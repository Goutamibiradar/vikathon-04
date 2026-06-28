import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages payload' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

    // Fetch live restaurant data from Supabase to give the AI context
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const [{ data: restaurants }, { data: inspections }, { data: complaints }] = await Promise.all([
      supabase.from('restaurants').select('*').order('name'),
      supabase.from('inspection_reports').select('*').order('inspection_date', { ascending: false }).limit(20),
      supabase.from('complaints').select('*').order('created_at', { ascending: false }).limit(10),
    ]);

    // Build a context string with real data
    const restaurantContext = (restaurants ?? []).map((r) =>
      `- **${r.name}** (${r.cuisine}): Hygiene Score ${r.hygiene_score}/100, Grade ${r.grade}, Status: ${r.status}, Address: ${r.address}, Last Inspected: ${r.last_inspection_date || 'Never'}`
    ).join('\n');

    const inspectionContext = (inspections ?? []).map((i) =>
      `- ${i.restaurant_name}: Score ${i.score}/100 (Grade ${i.grade}) on ${i.inspection_date} by ${i.inspector_name}. Remarks: "${i.remarks}"`
    ).join('\n');

    const complaintContext = (complaints ?? []).map((c) =>
      `- Complaint about ${c.restaurant_name}: "${c.description}" (Status: ${c.status})`
    ).join('\n');

    // System prompt enriched with live data
    const systemPrompt = {
      role: 'system',
      content: `You are the SafeBite Food Safety Assistant — an AI embedded in the SafeBite food safety management platform.

## Your Knowledge Base (LIVE DATA from SafeBite database)

### Registered Restaurants
${restaurantContext || 'No restaurants registered yet.'}

### Recent Inspection Reports
${inspectionContext || 'No inspections recorded yet.'}

### Recent Complaints
${complaintContext || 'No complaints filed yet.'}

## Instructions
- When a user asks about a specific restaurant, reference the REAL data above. Use the actual restaurant name, score, grade, and inspection history.
- When users ask general food safety questions, provide accurate FDA/WHO-aligned guidance.
- Explain hygiene grades: A (90-100, excellent), B (80-89, good), C (60-79, needs improvement), F (below 60, critical violations).
- Always format your responses with Markdown for readability (bold text, bullet points, headers).
- Be professional, knowledgeable, and empathetic.
- If a restaurant is not in the database, say so clearly and suggest they search the SafeBite directory.
- If you don't know an answer, recommend consulting local health department guidelines.`
    };

    const payload = {
      model: 'llama-3.1-8b-instant',
      messages: [systemPrompt, ...messages],
      temperature: 0.7,
      max_tokens: 1024,
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API Error:', errorData);
      return NextResponse.json({ error: 'Failed to communicate with AI provider' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('[POST /api/chat]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

