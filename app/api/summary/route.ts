import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const fallback =
    "Based on your audit, your team may reduce AI spend by reviewing unused seats, downgrading overpowered plans, and checking API usage. The highest-savings teams should explore discounted AI credits through Credex.";

  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!anthropicKey) {
    return NextResponse.json({
      summary: fallback,
      usedFallback: true
    });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-latest",
        max_tokens: 180,
        messages: [
          {
            role: "user",
            content: `Write a 100-word personalized AI spend audit summary for a startup founder or engineering manager.

Rules:
- Use only the audit JSON provided.
- Do not invent numbers.
- Mention monthly savings and annual savings if present.
- If savings are above $500/month, mention Credex as a possible way to capture more savings through discounted AI credits.
- If savings are below $100/month, be honest and say the stack looks mostly optimized.
- Keep the tone clear, practical, and not too salesy.

Audit JSON:
${JSON.stringify(body)}`
          }
        ]
      })
    });

    if (!response.ok) {
      return NextResponse.json({
        summary: fallback,
        usedFallback: true
      });
    }

    const data = await response.json();
    const summary = data.content?.[0]?.text || fallback;

    return NextResponse.json({
      summary,
      usedFallback: false
    });
  } catch {
    return NextResponse.json({
      summary: fallback,
      usedFallback: true
    });
  }
}