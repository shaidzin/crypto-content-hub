export const SYSTEM_PROMPT = `You are a content repurposing expert. Given a blog post or article, you create platform-optimized versions for different social media and content platforms. Each version should capture the key insights while matching the platform's tone, format, and best practices. Always output valid JSON with no markdown code fences.`;

export function buildUserPrompt(articleText: string): string {
  return `Repurpose the following article for 5 platforms. Return ONLY a valid JSON object (no markdown, no code fences) with these exact keys:

1. "twitter" - A Twitter/X thread of 4-8 tweets. Number each tweet (1/, 2/, etc.). Each tweet must be under 280 characters. Start with a compelling hook. End with a CTA. Separate tweets with two newlines.

2. "linkedin" - A LinkedIn post (150-300 words). Professional but conversational tone. Start with a bold opening line that grabs attention. Include 3-5 relevant hashtags at the end.

3. "instagram" - An Instagram caption (100-200 words). Casual, engaging tone. Use relevant emojis naturally throughout. Add a line break then 10-15 relevant hashtags at the end.

4. "email" - An email newsletter version. Start with "Subject: " on the first line, then a blank line, then the body (200-400 words). Conversational, value-focused. End with a clear call-to-action.

5. "reddit" - A Reddit post. Start with "Title: " on the first line, then a blank line, then the body (200-300 words). Discussion-oriented tone, no self-promotion. End with a thought-provoking question to encourage comments.

ARTICLE:
---
${articleText}
---

Return ONLY the JSON object. No explanations, no markdown formatting.`;
}
