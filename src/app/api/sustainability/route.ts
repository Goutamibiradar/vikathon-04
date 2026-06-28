import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const metrics = await req.json();

    if (!metrics) {
      return NextResponse.json({ error: 'No metrics provided' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

    const systemPrompt = {
      role: 'system',
      content: `You are an expert Sustainability and Environmental Consultant for restaurants. 
Analyze the following sustainability metrics for a restaurant and provide exactly 3 practical, highly specific, and actionable recommendations to help them improve.

Respond ONLY with a valid JSON array of strings. Do not use markdown blocks, just the JSON array.
Format: ["Suggestion 1", "Suggestion 2", "Suggestion 3"]`
    };

    const userPrompt = {
      role: 'user',
      content: `Here are our current metrics for this month:
- Food Waste: ${metrics.foodWaste} kg
- Water Usage: ${metrics.waterUsage} Liters
- Plastic Usage: ${metrics.plasticUsage} kg
- Carbon Footprint: ${metrics.carbonFootprint} kg CO2

Please provide 3 targeted suggestions to reduce these numbers.`
    };

    const payload = {
      model: 'llama-3.1-8b-instant',
      messages: [systemPrompt, userPrompt],
      temperature: 0.7,
      max_tokens: 512,
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API Error:', errorData);
      return NextResponse.json({ error: 'Failed to generate insights' }, { status: response.status });
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content ?? '';

    try {
      const cleaned = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const suggestions = JSON.parse(cleaned);
      
      if (!Array.isArray(suggestions)) {
        throw new Error('Not an array');
      }
      
      return NextResponse.json(suggestions);
    } catch {
      console.error('Failed to parse AI response as JSON array:', rawContent);
      return NextResponse.json([
        "Implement a 'First In, First Out' inventory system to reduce food waste.",
        "Install low-flow aerators on all kitchen sinks to cut water usage.",
        "Switch to biodegradable or compostable packaging alternatives."
      ]);
    }
  } catch (error) {
    console.error('[POST /api/sustainability]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
