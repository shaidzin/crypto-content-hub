import { NextRequest, NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import { SYSTEM_PROMPT, buildArticlePrompt, buildTopicPrompt, buildUrlPrompt } from "@/lib/prompts";
import { createServiceClient } from "@/lib/supabase-server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { PlatformOutputs } from "@/types";

export const maxDuration = 30;

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

    const body = await request.json();
    const { text, mode, url } = body;

    // Build the prompt based on mode
    let userPrompt: string;

    if (mode === "topic") {
      if (!text || typeof text !== "string" || text.length < 10) {
        return NextResponse.json(
          { error: "Please describe what you want to write about (at least 10 characters)." },
          { status: 400 }
        );
      }
      if (text.length > 2000) {
        return NextResponse.json(
          { error: "Topic description must be under 2,000 characters." },
          { status: 400 }
        );
      }
      userPrompt = buildTopicPrompt(text);
    } else if (mode === "url") {
      if (!text || typeof text !== "string" || text.length < 100) {
        return NextResponse.json(
          { error: "Could not extract enough content from that URL." },
          { status: 400 }
        );
      }
      userPrompt = buildUrlPrompt(text.slice(0, 10000), url || "");
    } else {
      // Default: article mode
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
      userPrompt = buildArticlePrompt(text);
    }

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
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
