import { proxyFetchJSON } from "../proxy";
import type { KalshiMarket } from "../../types";

/**
 * Kalshi prediction markets API.
 * Docs: https://trading-api.readme.io/reference
 */

interface KalshiMarketsResponse {
  markets: KalshiAPIMarket[];
  cursor?: string;
}

interface KalshiAPIMarket {
  ticker: string;
  title: string;
  category: string;
  yes_bid: number;
  no_bid: number;
  volume: number;
  close_time: string;
  status: string;
}

export async function fetchKalshiMarkets(
  apiKey: string,
  options?: { limit?: number; category?: string }
): Promise<KalshiMarket[]> {
  const params = new URLSearchParams({
    limit: String(options?.limit ?? 50),
    status: "open",
  });
  if (options?.category) {
    params.set("series_ticker", options.category);
  }

  const url = `https://api.elections.kalshi.com/trade-api/v2/markets?${params}`;

  const data = await proxyFetchJSON<KalshiMarketsResponse>(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  });

  return data.markets.map((m) => ({
    id: m.ticker,
    title: m.title,
    category: m.category,
    yes_price: m.yes_bid / 100,
    no_price: m.no_bid / 100,
    volume: m.volume,
    close_time: m.close_time,
    status: m.status,
  }));
}

/**
 * Fetch trending Kalshi markets (highest volume, most relevant to OSINT).
 */
export async function fetchTrendingMarkets(
  apiKey: string
): Promise<KalshiMarket[]> {
  return fetchKalshiMarkets(apiKey, { limit: 20 });
}
