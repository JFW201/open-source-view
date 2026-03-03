import { proxyFetchJSON } from "../proxy";
import type { GrokSummary, GrokRequest } from "../../types";

/**
 * xAI Grok API — unbiased news summarization.
 * Docs: https://docs.x.ai/
 */

interface GrokChatResponse {
  choices: {
    message: {
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
  };
}

const SYSTEM_PROMPT = `You are Waldorf Intelligence Analyst, an unbiased OSINT news summarizer. Your role is to:
1. Provide factual, neutral summaries of news headlines and events
2. Identify key geopolitical implications
3. Highlight connections between seemingly unrelated events
4. Rate overall sentiment objectively
5. Never editorialize or inject political bias

Respond in this exact JSON format:
{
  "summary": "2-3 sentence neutral summary of the key developments",
  "key_points": ["point 1", "point 2", "point 3"],
  "sentiment": "positive|negative|neutral|mixed",
  "confidence": 0.0-1.0
}`;

export async function generateNewsSummary(
  apiKey: string,
  request: GrokRequest
): Promise<GrokSummary> {
  const headlineList = request.headlines
    .slice(0, 30)
    .map((h, i) => `${i + 1}. ${h}`)
    .join("\n");

  let userPrompt = `Analyze and summarize these recent headlines:\n\n${headlineList}`;

  if (request.country) {
    userPrompt += `\n\nFocus especially on implications for ${request.country}.`;
  }
  if (request.context) {
    userPrompt += `\n\nAdditional context: ${request.context}`;
  }

  const body = JSON.stringify({
    model: "grok-3",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 1000,
    response_format: { type: "json_object" },
  });

  const data = await proxyFetchJSON<GrokChatResponse>(
    "https://api.x.ai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body,
    }
  );

  const content = data.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content);

  return {
    summary: parsed.summary ?? "Unable to generate summary.",
    key_points: parsed.key_points ?? [],
    sentiment: parsed.sentiment ?? "neutral",
    confidence: parsed.confidence ?? 0.5,
    generated_at: new Date().toISOString(),
  };
}

/**
 * Generate a country-specific intelligence brief.
 */
export async function generateCountryBrief(
  apiKey: string,
  countryName: string,
  recentHeadlines: string[]
): Promise<GrokSummary> {
  return generateNewsSummary(apiKey, {
    headlines: recentHeadlines,
    country: countryName,
    context: `This is for an OSINT intelligence brief focused on ${countryName}. Include any relevant security, economic, or political developments.`,
  });
}
