import { NextRequest, NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import type { PlatformOutputs } from "@/types";

export const maxDuration = 30;

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  rateLimitMap.set(ip, recent);

  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

function parseAIResponse(text: string): PlatformOutputs {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // Strip markdown code fences if present
    const cleaned = text.replace(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/, "$1").trim();
    return JSON.parse(cleaned);
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Please provide content to repurpose." },
        { status: 400 }
      );
    }

    if (text.length < 100) {
      return NextResponse.json(
        { error: "Content must be at least 100 characters long." },
        { status: 400 }
      );
    }

    if (text.length > 10000) {
      return NextResponse.json(
        { error: "Content must be under 10,000 characters." },
        { status: 400 }
      );
    }

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(text) },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "Failed to generate content. Please try again." },
        { status: 500 }
      );
    }

    const outputs = parseAIResponse(content);

    // Validate all expected keys exist
    const requiredKeys: (keyof PlatformOutputs)[] = [
      "twitter",
      "linkedin",
      "instagram",
      "email",
      "reddit",
    ];
    for (const key of requiredKeys) {
      if (!outputs[key] || typeof outputs[key] !== "string") {
        return NextResponse.json(
          { error: "AI generated incomplete content. Please try again." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ outputs });
  } catch (error: unknown) {
    console.error("Repurpose API error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
