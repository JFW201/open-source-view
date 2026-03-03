import { proxyFetchJSON, proxyFetch } from "../proxy";
import { cache, CACHE_TTL } from "../cache";
import type { GdeltEvent, GdeltTensionPair } from "../../types";

/**
 * GDELT GKG (Global Knowledge Graph) and Events API integration.
 * Uses the GDELT 2.0 Events API and DOC API for geospatial event data.
 * No API key required — fully public.
 */

const GDELT_DOC_API = "https://api.gdeltproject.org/api/v2/doc/doc";
const GDELT_GEO_API = "https://api.gdeltproject.org/api/v2/geo/geo";

// Strategic bilateral tension pairs to track
const TENSION_PAIRS: [string, string][] = [
  ["United States", "Russia"],
  ["Russia", "Ukraine"],
  ["United States", "China"],
  ["China", "Taiwan"],
  ["United States", "Iran"],
  ["Israel", "Iran"],
  ["India", "Pakistan"],
  ["North Korea", "South Korea"],
];

/**
 * Fetch geolocated events from GDELT for the past 7 days.
 * Uses the GEO API which returns events with lat/lon.
 */
export async function fetchGdeltEvents(): Promise<GdeltEvent[]> {
  const cacheKey = "gdelt-events";
  const cached = await cache.get<GdeltEvent[]>(cacheKey);
  if (cached) return cached;

  try {
    // Query for conflict/protest events in the last 7 days
    const query = encodeURIComponent("conflict OR protest OR military OR attack OR war");
    const url = `${GDELT_GEO_API}?query=${query}&mode=PointData&format=GeoJSON&timespan=7d&maxpoints=500&SORTBY=ToneDesc`;

    const resp = await proxyFetch(url);
    if (resp.status >= 400) throw new Error(`GDELT API error: ${resp.status}`);

    const geojson = JSON.parse(resp.body);
    if (!geojson.features || !Array.isArray(geojson.features)) return [];

    const events: GdeltEvent[] = geojson.features
      .filter((f: any) => f.geometry?.coordinates && f.properties)
      .map((f: any, i: number) => {
        const props = f.properties;
        const [lng, lat] = f.geometry.coordinates;
        return {
          id: `gdelt-${props.urlhash || i}-${Date.now()}`,
          date: props.date || new Date().toISOString(),
          latitude: lat,
          longitude: lng,
          eventCode: props.eventcode || "",
          eventDescription: props.name || props.html || "GDELT Event",
          actor1: props.actor1 || "",
          actor2: props.actor2 || "",
          goldsteinScale: parseFloat(props.goldstein) || 0,
          numMentions: parseInt(props.mentioncount) || parseInt(props.numarts) || 1,
          avgTone: parseFloat(props.tone) || 0,
          sourceUrl: props.url || props.shareimage,
          country: props.country || "",
        };
      });

    await cache.set(cacheKey, events, CACHE_TTL.GDELT);
    return events;
  } catch (err) {
    console.error("GDELT event fetch failed:", err);
    const stale = await cache.get<GdeltEvent[]>(cacheKey, true);
    return stale || [];
  }
}

/**
 * Fetch articles by theme for bilateral tension scoring.
 * Uses the DOC API to count articles mentioning both countries together.
 */
export async function fetchGdeltTensionPairs(): Promise<GdeltTensionPair[]> {
  const cacheKey = "gdelt-tension";
  const cached = await cache.get<GdeltTensionPair[]>(cacheKey);
  if (cached) return cached;

  const results: GdeltTensionPair[] = [];

  for (const [c1, c2] of TENSION_PAIRS) {
    try {
      const query = encodeURIComponent(`"${c1}" "${c2}" (conflict OR tension OR military OR sanctions OR threat)`);
      const url7d = `${GDELT_DOC_API}?query=${query}&mode=ToneChart&format=json&timespan=7d&SMOOTHING=3`;
      const url1d = `${GDELT_DOC_API}?query=${query}&mode=ToneChart&format=json&timespan=24h&SMOOTHING=0`;

      const [resp7d, resp1d] = await Promise.all([
        proxyFetch(url7d).catch(() => null),
        proxyFetch(url1d).catch(() => null),
      ]);

      let weeklyTone = 0;
      let dailyTone = 0;
      let articleCount7d = 0;
      let articleCount1d = 0;

      if (resp7d && resp7d.status < 400) {
        try {
          const data7d = JSON.parse(resp7d.body);
          if (data7d.tonechart) {
            const points = Array.isArray(data7d.tonechart) ? data7d.tonechart : [];
            if (points.length > 0) {
              weeklyTone = points.reduce((s: number, p: any) => s + (parseFloat(p.value) || 0), 0) / points.length;
              articleCount7d = points.reduce((s: number, p: any) => s + (parseInt(p.count) || 1), 0);
            }
          }
        } catch { /* parse error — skip */ }
      }

      if (resp1d && resp1d.status < 400) {
        try {
          const data1d = JSON.parse(resp1d.body);
          if (data1d.tonechart) {
            const points = Array.isArray(data1d.tonechart) ? data1d.tonechart : [];
            if (points.length > 0) {
              dailyTone = points.reduce((s: number, p: any) => s + (parseFloat(p.value) || 0), 0) / points.length;
              articleCount1d = points.reduce((s: number, p: any) => s + (parseInt(p.count) || 1), 0);
            }
          }
        } catch { /* parse error — skip */ }
      }

      // Convert tone to tension score (lower/more negative tone = higher tension)
      // Tone ranges from -100 to +100, normalize to 0-100 tension
      const tensionScore = Math.max(0, Math.min(100, 50 - weeklyTone * 5));
      const dailyTension = Math.max(0, Math.min(100, 50 - dailyTone * 5));
      const change = weeklyTone !== 0 ? ((dailyTension - tensionScore) / Math.max(tensionScore, 1)) * 100 : 0;

      results.push({
        country1: c1,
        country2: c2,
        score: Math.round(tensionScore * 10) / 10,
        change: Math.round(change * 10) / 10,
        trend: change > 5 ? "rising" : change < -5 ? "falling" : "stable",
        updatedAt: new Date().toISOString(),
      });

      // Small delay between pairs to avoid rate limiting
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.error(`GDELT tension fetch failed for ${c1}-${c2}:`, err);
      results.push({
        country1: c1,
        country2: c2,
        score: 0,
        change: 0,
        trend: "stable",
        updatedAt: new Date().toISOString(),
      });
    }
  }

  await cache.set(cacheKey, results, CACHE_TTL.GDELT);
  return results;
}
