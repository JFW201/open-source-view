import { proxyFetchJSON } from "../proxy";
import type { MarketIndex } from "../../types";
import { cache, CACHE_TTL } from "../cache";

/**
 * Alpha Vantage — stock market and economic data.
 * Free tier: 25 req/day. Premium for real-time.
 * Docs: https://www.alphavantage.co/documentation/
 */

interface AlphaVantageQuote {
  "Global Quote": {
    "01. symbol": string;
    "02. open": string;
    "03. high": string;
    "04. low": string;
    "05. price": string;
    "08. previous close": string;
    "09. change": string;
    "10. change percent": string;
  };
}

const TRACKED_SYMBOLS = [
  { symbol: "SPY", name: "S&P 500 ETF" },
  { symbol: "QQQ", name: "NASDAQ 100 ETF" },
  { symbol: "DIA", name: "Dow Jones ETF" },
  { symbol: "VGK", name: "FTSE Europe ETF" },
  { symbol: "EEM", name: "Emerging Markets ETF" },
  { symbol: "GLD", name: "Gold ETF" },
  { symbol: "USO", name: "Oil ETF" },
  { symbol: "TLT", name: "20Y Treasury ETF" },
  { symbol: "UUP", name: "US Dollar Index ETF" },
  { symbol: "VIX", name: "Volatility Index" },
];

export async function fetchMarketQuote(
  apiKey: string,
  symbol: string
): Promise<MarketIndex | null> {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

  const data = await proxyFetchJSON<AlphaVantageQuote>(url);
  const q = data["Global Quote"];
  if (!q || !q["05. price"]) return null;

  const tracked = TRACKED_SYMBOLS.find((s) => s.symbol === symbol);

  return {
    symbol: q["01. symbol"],
    name: tracked?.name ?? symbol,
    price: parseFloat(q["05. price"]),
    change: parseFloat(q["09. change"]),
    changePercent: parseFloat(q["10. change percent"].replace("%", "")),
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchAllMarketIndices(
  apiKey: string
): Promise<MarketIndex[]> {
  // Check cache first (avoids burning rate-limited API calls)
  const cached = await cache.get<MarketIndex[]>("market-indices");
  if (cached && cached.length > 0) return cached;

  // Fetch sequentially to respect rate limits (5 calls/minute on free tier)
  const results: MarketIndex[] = [];

  for (const { symbol } of TRACKED_SYMBOLS) {
    try {
      const quote = await fetchMarketQuote(apiKey, symbol);
      if (quote) results.push(quote);
    } catch {
      // Skip failed symbols
    }
    // Alpha Vantage free tier: 5 requests per minute
    await new Promise((r) => setTimeout(r, 12500));
  }

  if (results.length > 0) {
    await cache.set("market-indices", results, CACHE_TTL.MARKETS);
  }

  return results;
}

export { TRACKED_SYMBOLS };
