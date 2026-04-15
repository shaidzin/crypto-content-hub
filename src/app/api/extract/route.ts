import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 15;

function extractTextFromHTML(html: string): string {
  // Remove script and style tags and their content
  let text = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<nav[\s\S]*?<\/nav>/gi, "");
  text = text.replace(/<footer[\s\S]*?<\/footer>/gi, "");
  text = text.replace(/<header[\s\S]*?<\/header>/gi, "");

  // Try to extract article or main content first
  const articleMatch = text.match(/<article[\s\S]*?<\/article>/i);
  const mainMatch = text.match(/<main[\s\S]*?<\/main>/i);
  const contentDiv = text.match(/<div[^>]*(?:content|article|post|entry|body)[^>]*>[\s\S]*?<\/div>/i);

  const contentBlock = articleMatch?.[0] || mainMatch?.[0] || contentDiv?.[0] || text;

  // Strip all HTML tags
  let cleaned = contentBlock.replace(/<[^>]+>/g, " ");

  // Decode HTML entities
  cleaned = cleaned
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

  // Clean up whitespace
  cleaned = cleaned
    .replace(/\s+/g, " ")
    .trim();

  return cleaned;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Please provide a URL." },
        { status: 400 }
      );
    }

    // Basic URL validation
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return NextResponse.json(
        { error: "Please enter a valid URL (e.g., https://example.com/article)." },
        { status: 400 }
      );
    }

    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ContentSpark/1.0)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL (status ${response.status}). Make sure the URL is accessible.` },
        { status: 400 }
      );
    }

    const html = await response.text();
    const text = extractTextFromHTML(html);

    if (text.length < 100) {
      return NextResponse.json(
        { error: "Could not extract enough content from that URL. Try pasting the article text directly." },
        { status: 400 }
      );
    }

    // Limit to 10,000 characters
    const trimmed = text.slice(0, 10000);

    return NextResponse.json({ text: trimmed });
  } catch (error: unknown) {
    console.error("Extract API error:", error);
    return NextResponse.json(
      { error: "Failed to extract content from URL. Try pasting the article text directly." },
      { status: 500 }
    );
  }
}
