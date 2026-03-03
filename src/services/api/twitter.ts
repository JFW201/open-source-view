import { proxyFetchJSON } from "../proxy";
import type { Tweet } from "../../types";

/**
 * X (Twitter) API v2 — fetches recent tweets from OSINT-relevant accounts.
 * Docs: https://developer.x.com/en/docs/x-api
 */

interface TwitterSearchResponse {
  data?: TwitterAPITweet[];
  includes?: {
    users?: TwitterAPIUser[];
  };
  meta?: {
    result_count: number;
    newest_id: string;
    oldest_id: string;
  };
}

interface TwitterAPITweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
  };
}

interface TwitterAPIUser {
  id: string;
  name: string;
  username: string;
}

const OSINT_ACCOUNTS = [
  "IntelCrab",
  "sentdefender",
  "RALee85",
  "Faytuks",
  "ELINTNews",
  "ABORINT",
  "Liveuamap",
  "oryaborint",
  "air_intel",
  "MT_Anderson",
  "GeoConfirmed",
  "TheDeadDistrict",
  "OSINTtechnical",
];

export async function fetchOSINTTweets(bearerToken: string): Promise<Tweet[]> {
  const query = OSINT_ACCOUNTS.map((a) => `from:${a}`).join(" OR ");
  const params = new URLSearchParams({
    query,
    max_results: "50",
    "tweet.fields": "created_at,public_metrics,author_id",
    expansions: "author_id",
    "user.fields": "name,username",
  });

  const url = `https://api.x.com/2/tweets/search/recent?${params}`;
  const data = await proxyFetchJSON<TwitterSearchResponse>(url, {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });

  if (!data.data) return [];

  const userMap = new Map<string, TwitterAPIUser>();
  data.includes?.users?.forEach((u) => userMap.set(u.id, u));

  return data.data.map((t) => {
    const user = userMap.get(t.author_id);
    return {
      id: t.id,
      text: t.text,
      author: user?.name ?? "Unknown",
      author_handle: user?.username ?? "",
      created_at: t.created_at,
      retweet_count: t.public_metrics.retweet_count,
      like_count: t.public_metrics.like_count,
      url: `https://x.com/${user?.username ?? "i"}/status/${t.id}`,
    };
  });
}

/**
 * Search X for a specific topic (e.g., country-specific OSINT).
 */
export async function searchTweets(
  bearerToken: string,
  query: string,
  maxResults = 20
): Promise<Tweet[]> {
  const params = new URLSearchParams({
    query: `${query} -is:retweet lang:en`,
    max_results: String(Math.min(maxResults, 100)),
    "tweet.fields": "created_at,public_metrics,author_id",
    expansions: "author_id",
    "user.fields": "name,username",
  });

  const url = `https://api.x.com/2/tweets/search/recent?${params}`;
  const data = await proxyFetchJSON<TwitterSearchResponse>(url, {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });

  if (!data.data) return [];

  const userMap = new Map<string, TwitterAPIUser>();
  data.includes?.users?.forEach((u) => userMap.set(u.id, u));

  return data.data.map((t) => {
    const user = userMap.get(t.author_id);
    return {
      id: t.id,
      text: t.text,
      author: user?.name ?? "Unknown",
      author_handle: user?.username ?? "",
      created_at: t.created_at,
      retweet_count: t.public_metrics.retweet_count,
      like_count: t.public_metrics.like_count,
      url: `https://x.com/${user?.username ?? "i"}/status/${t.id}`,
    };
  });
}
