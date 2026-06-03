import { NextResponse } from "next/server";

const VALID_RARITIES = ["common", "rare", "epic", "legendary"] as const;
type Rarity = (typeof VALID_RARITIES)[number];

function isValidRarity(value: string): value is Rarity {
  return VALID_RARITIES.includes(value as Rarity);
}

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service not configured — missing GEMINI_API_KEY" },
        { status: 503 }
      );
    }

    const prompt = `You are an AI difficulty assessor for an RPG to-do list app called DailyQuest.
Analyze the task title and return a JSON object with rarity and xp.

Task Title: "${title}"

Rarity Guide:
- common (XP: 10-50): very easy/quick tasks (e.g. drink water, make bed).
- rare (XP: 51-200): medium effort (e.g. 30 min workout, read a chapter).
- epic (XP: 201-500): hard, hours of work (e.g. finish project feature).
- legendary (XP: 501-1000): extremely hard, days of effort (e.g. run marathon).

Return ONLY valid JSON like this (no markdown, no explanation):
{"rarity":"rare","xp":120}`;

    // Use Gemini REST API directly for maximum compatibility
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 100,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, errBody);
      return NextResponse.json(
        { error: `Gemini API returned ${geminiRes.status}` },
        { status: 500 }
      );
    }

    const geminiData = await geminiRes.json();
    const rawText: string =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!rawText) {
      console.error("Empty Gemini response:", JSON.stringify(geminiData));
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 500 }
      );
    }

    // Strip markdown code fences if present
    const jsonStr = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const data = JSON.parse(jsonStr) as { rarity?: string; xp?: number };

    const rarity: Rarity = isValidRarity(data.rarity ?? "")
      ? (data.rarity as Rarity)
      : "common";

    const xp: number =
      typeof data.xp === "number" && data.xp >= 10 && data.xp <= 1000
        ? Math.round(data.xp)
        : 50;

    return NextResponse.json({ rarity, xp });
  } catch (error) {
    console.error("AI Assess Error:", error);
    return NextResponse.json(
      { error: "Failed to assess quest difficulty" },
      { status: 500 }
    );
  }
}
