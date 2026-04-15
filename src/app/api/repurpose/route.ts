import { NextRequest, NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import { createServiceClient } from "@/lib/supabase-server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { PlatformOutputs } from "@/types";

export const maxDuration = 30;

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60_000;
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

function parseAIResponse(text: string): Record<string, unknown> {
  try {
    return JSON.parse(text);
  } catch {
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

    // Authenticate user
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to use ContentSpark." },
        { status: 401 }
      );
    }

    // Check credits using service role (bypasses RLS)
    const serviceClient = createServiceClient();
    const { data: profile } = await serviceClient
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (!profile || profile.credits < 1) {
      return NextResponse.json(
        { error: "No credits remaining. Please purchase more credits." },
        { status: 402 }
      );
    }

    // Validate input
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

    // Call OpenAI
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

    const raw = parseAIResponse(content);

    // Normalize: AI sometimes returns objects/arrays instead of strings
    const requiredKeys: (keyof PlatformOutputs)[] = [
      "twitter", "linkedin", "instagram", "tiktok", "youtube", "email", "reddit",
    ];

    const outputs: Record<string, string> = {};
    for (const key of requiredKeys) {
      const val = raw[key];
      if (!val) {
        console.error(`Missing key "${key}" in AI response:`, JSON.stringify(raw).slice(0, 500));
        return NextResponse.json(
          { error: "AI generated incomplete content. Please try again." },
          { status: 500 }
        );
      }
      // Convert arrays/objects to string
      if (typeof val === "string") {
        outputs[key] = val;
      } else if (Array.isArray(val)) {
        outputs[key] = val.join("\n\n");
      } else if (typeof val === "object") {
        outputs[key] = Object.values(val).join("\n\n");
      } else {
        outputs[key] = String(val);
      }
    }

    // Deduct 1 credit
    await serviceClient
      .from("profiles")
      .update({ credits: profile.credits - 1 })
      .eq("id", user.id);

    return NextResponse.json({
      outputs: outputs as unknown as PlatformOutputs,
      creditsRemaining: profile.credits - 1,
    });
  } catch (error: unknown) {
    console.error("Repurpose API error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
