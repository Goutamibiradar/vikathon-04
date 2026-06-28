import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

    const payload = {
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are a food freshness analysis expert. Analyze the food item in this image and determine its freshness.

Respond ONLY with a valid JSON object (no markdown, no code fences, no extra text) using this exact format:
{
  "foodName": "Name of the food item",
  "status": "Fresh" or "Stale" or "Spoiled",
  "confidence": 85,
  "shelfLife": "Estimated remaining shelf life, e.g. '3-4 days'",
  "storageRecommendation": "How to store this food properly",
  "safetyAdvice": "Any food safety advice for this item"
}

Rules:
- "confidence" must be an integer from 0 to 100.
- "status" must be exactly one of: "Fresh", "Stale", or "Spoiled".
- If the image is not a food item, set foodName to "Not a food item", status to "Fresh", confidence to 0, and explain in safetyAdvice.`
            },
            {
              type: 'image_url',
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      temperature: 0.3,
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
      console.error('Groq Vision API Error:', errorData);
      return NextResponse.json({ error: 'Failed to analyze image' }, { status: response.status });
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content ?? '';

    // Try to parse the JSON from the AI response
    try {
      // Strip possible markdown code fences
      const cleaned = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const result = JSON.parse(cleaned);
      return NextResponse.json(result);
    } catch {
      console.error('Failed to parse AI response as JSON:', rawContent);
      // Return a fallback
      return NextResponse.json({
        foodName: 'Unknown',
        status: 'Fresh',
        confidence: 0,
        shelfLife: 'Unable to determine',
        storageRecommendation: 'Unable to determine',
        safetyAdvice: rawContent || 'The AI was unable to analyze this image. Please try again with a clearer photo of a food item.',
      });
    }
  } catch (error) {
    console.error('[POST /api/freshness]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
