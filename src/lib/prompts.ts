export const SYSTEM_PROMPT = `You are a content creation and repurposing expert. You create platform-optimized content for different social media and content platforms. Each version should match the platform's tone, format, and best practices. Always output valid JSON with no markdown code fences.`;

const PLATFORM_INSTRUCTIONS = `Return ONLY a valid JSON object (no markdown, no code fences) with these exact keys:

1. "twitter" - A Twitter/X thread of 4-8 tweets. Number each tweet (1/, 2/, etc.). Each tweet must be under 280 characters. Start with a compelling hook. End with a CTA. Separate tweets with two newlines.

2. "linkedin" - A LinkedIn post (150-300 words). Professional but conversational tone. Start with a bold opening line that grabs attention. Include 3-5 relevant hashtags at the end.

3. "instagram" - An Instagram caption (100-200 words). Casual, engaging tone. Use relevant emojis naturally throughout. Add a line break then 10-15 relevant hashtags at the end.

4. "tiktok" - A TikTok video script (30-60 seconds). Start with a strong hook line (first 3 seconds are critical). Use short punchy sentences. Include [PAUSE] markers for dramatic effect. End with a CTA or question. Format as a spoken script the creator can read on camera.

5. "youtube" - A YouTube video description (150-300 words). Start with a compelling 2-sentence summary. Include timestamps section with 3-5 key moments (format: 0:00 - Topic). Add relevant keywords naturally. End with a CTA to subscribe/engage.

6. "email" - An email newsletter version. Start with "Subject: " on the first line, then a blank line, then the body (200-400 words). Conversational, value-focused. End with a clear call-to-action.

7. "reddit" - A Reddit post. Start with "Title: " on the first line, then a blank line, then the body (200-300 words). Discussion-oriented tone, no self-promotion. End with a thought-provoking question to encourage comments.

Return ONLY the JSON object. No explanations, no markdown formatting.`;

export function buildArticlePrompt(articleText: string): string {
  return `Repurpose the following article for 7 platforms. ${PLATFORM_INSTRUCTIONS}

ARTICLE:
---
${articleText}
---`;
}

export function buildTopicPrompt(topic: string): string {
  return `Write original content about the following topic for 7 platforms. Create engaging, insightful content based on this topic/prompt. ${PLATFORM_INSTRUCTIONS}

TOPIC/PROMPT:
---
${topic}
---`;
}

export function buildUrlPrompt(articleText: string, url: string): string {
  return `Repurpose the following article (from ${url}) for 7 platforms. ${PLATFORM_INSTRUCTIONS}

ARTICLE:
---
${articleText}
---`;
}
