import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

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
        { error: "AI service not configured" },
        { status: 503 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an AI difficulty assessor for an RPG to-do list app called DailyQuest.
Analyze the task title and categorize it by difficulty.

Task Title: "${title}"

Rarity Guide:
- common (XP: 10-50): very easy, quick tasks (e.g. drink water, make bed, reply email).
- rare (XP: 51-200): medium effort tasks (e.g. 30 min workout, read a chapter, cook a meal).
- epic (XP: 201-500): hard tasks taking hours (e.g. clean whole house, finish project feature).
- legendary (XP: 501-1000): extremely hard/rare tasks taking days (e.g. run marathon, build a fullstack app, get a job).

Return ONLY a valid JSON object like this:
{"rarity": "rare", "xp": 150}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    // Safely extract text from response
    const rawText: string =
      response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!rawText) {
      throw new Error("Empty response from AI");
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
