import { invoke } from "@tauri-apps/api/core";
import type { NewsItem, FeedItem, FeedSource } from "../../types";
import { RSS_FEEDS } from "../../constants/feeds";

let isTauri = false;
try {
  isTauri = !!(window as any).__TAURI_INTERNALS__;
} catch {
  // browser mode
}

/**
 * Fetch all configured RSS feeds through the Tauri backend.
 * Falls back to a CORS proxy in browser dev mode.
 */
export async function fetchAllFeeds(): Promise<NewsItem[]> {
  if (isTauri) {
    return fetchViaTauri();
  }
  return fetchViaBrowserFallback();
}

async function fetchViaTauri(): Promise<NewsItem[]> {
  const sources: FeedSource[] = RSS_FEEDS.map((f) => ({
    url: f.url,
    name: f.name,
  }));

  const items = await invoke<FeedItem[]>("fetch_rss_batch", { sources });
  return items.map(feedItemToNewsItem);
}

async function fetchViaBrowserFallback(): Promise<NewsItem[]> {
  // In browser mode, try fetching through a public CORS proxy
  const results: NewsItem[] = [];

  // Batch into groups of 5 to avoid overloading
  const batches: typeof RSS_FEEDS[] = [];
  for (let i = 0; i < RSS_FEEDS.length; i += 5) {
    batches.push(RSS_FEEDS.slice(i, i + 5));
  }

  for (const batch of batches) {
    const promises = batch.map(async (feed) => {
      try {
        const resp = await fetch(feed.url);
        if (!resp.ok) return [];
        const text = await resp.text();
        return parseRSSText(text, feed.name, feed.category);
      } catch {
        return [];
      }
    });

    const batchResults = await Promise.all(promises);
    for (const items of batchResults) {
      results.push(...items);
    }
  }

  return results.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

function parseRSSText(
  xml: string,
  sourceName: string,
  category: string
): NewsItem[] {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");
    const items = doc.querySelectorAll("item");
    const results: NewsItem[] = [];

    items.forEach((item, index) => {
      if (index >= 20) return;
      const title = item.querySelector("title")?.textContent ?? "";
      const link = item.querySelector("link")?.textContent ?? "";
      const description = item.querySelector("description")?.textContent ?? "";
      const pubDate = item.querySelector("pubDate")?.textContent ?? "";

      results.push({
        id: `${sourceName}-${btoa(link || title).slice(0, 16)}`,
        title: stripHtml(title),
        source: sourceName,
        category: category as any,
        url: link,
        description: stripHtml(description).slice(0, 500),
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      });
    });

    return results;
  } catch {
    return [];
  }
}

function feedItemToNewsItem(item: FeedItem): NewsItem {
  const feed = RSS_FEEDS.find((f) => f.name === item.source);
  return {
    id: `${item.source}-${btoa(item.link || item.title).slice(0, 16)}`,
    title: stripHtml(item.title),
    source: item.source,
    category: feed?.category ?? "breaking",
    url: item.link,
    description: stripHtml(item.description).slice(0, 500),
    publishedAt: item.pub_date
      ? new Date(item.pub_date).toISOString()
      : new Date().toISOString(),
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim();
}
