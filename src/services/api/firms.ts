import { proxyFetch } from "../proxy";
import { cache, CACHE_TTL } from "../cache";
import type { FirmsHotspot } from "../../types";

/**
 * NASA FIRMS (Fire Information for Resource Management System) integration.
 * Uses the FIRMS API for VIIRS and MODIS active fire data.
 * Free MAP_KEY available from https://firms.modaps.eosdis.nasa.gov/api/area/
 * Without key, uses the open CSV endpoint with region filtering.
 */

const FIRMS_CSV_BASE = "https://firms.modaps.eosdis.nasa.gov/api/area/csv";
const FIRMS_OPEN_URL =
  "https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-20-viirs-c2/csv/J1_VIIRS_C2_Global_24h.csv";

/**
 * Fetch active fire hotspots from NASA FIRMS.
 * @param mapKey Optional FIRMS MAP_KEY for API access (higher limits)
 */
export async function fetchFirmsHotspots(
  mapKey?: string
): Promise<FirmsHotspot[]> {
  const cacheKey = "firms-hotspots";
  const cached = await cache.get<FirmsHotspot[]>(cacheKey);
  if (cached) return cached;

  try {
    let csvText: string;

    if (mapKey) {
      // Use the authenticated API for VIIRS data, last 24 hours, global
      const url = `${FIRMS_CSV_BASE}/${mapKey}/VIIRS_NOAA20_NRT/world/1`;
      const resp = await proxyFetch(url);
      if (resp.status >= 400) throw new Error(`FIRMS API error: ${resp.status}`);
      csvText = resp.body;
    } else {
      // Use the open CSV endpoint (no key needed, global 24h)
      const resp = await proxyFetch(FIRMS_OPEN_URL);
      if (resp.status >= 400) throw new Error(`FIRMS open CSV error: ${resp.status}`);
      csvText = resp.body;
    }

    const hotspots = parseFirmsCsv(csvText);

    await cache.set(cacheKey, hotspots, CACHE_TTL.FIRMS);
    return hotspots;
  } catch (err) {
    console.error("FIRMS fetch failed:", err);
    const stale = await cache.get<FirmsHotspot[]>(cacheKey, true);
    return stale || [];
  }
}

/**
 * Parse FIRMS CSV into typed hotspot objects.
 * CSV columns: latitude,longitude,bright_ti4,scan,track,acq_date,acq_time,satellite,confidence,version,bright_ti5,frp,daynight
 * or: latitude,longitude,brightness,scan,track,acq_date,acq_time,satellite,confidence,version,bright_t31,frp,daynight
 */
function parseFirmsCsv(csv: string): FirmsHotspot[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];

  const header = lines[0].toLowerCase().split(",");
  const latIdx = header.indexOf("latitude");
  const lonIdx = header.indexOf("longitude");
  const brightIdx = header.findIndex(
    (h) => h === "bright_ti4" || h === "brightness"
  );
  const scanIdx = header.indexOf("scan");
  const trackIdx = header.indexOf("track");
  const dateIdx = header.indexOf("acq_date");
  const timeIdx = header.indexOf("acq_time");
  const satIdx = header.indexOf("satellite");
  const confIdx = header.indexOf("confidence");
  const frpIdx = header.indexOf("frp");
  const dnIdx = header.indexOf("daynight");

  if (latIdx < 0 || lonIdx < 0) return [];

  const hotspots: FirmsHotspot[] = [];

  // Limit to 5000 hotspots to keep memory manageable
  const maxRows = Math.min(lines.length, 5001);
  for (let i = 1; i < maxRows; i++) {
    const cols = lines[i].split(",");
    if (cols.length < 5) continue;

    const lat = parseFloat(cols[latIdx]);
    const lon = parseFloat(cols[lonIdx]);
    if (isNaN(lat) || isNaN(lon)) continue;

    hotspots.push({
      latitude: lat,
      longitude: lon,
      brightness: brightIdx >= 0 ? parseFloat(cols[brightIdx]) || 0 : 0,
      scan: scanIdx >= 0 ? parseFloat(cols[scanIdx]) || 0 : 0,
      track: trackIdx >= 0 ? parseFloat(cols[trackIdx]) || 0 : 0,
      acqDate: dateIdx >= 0 ? cols[dateIdx] : "",
      acqTime: timeIdx >= 0 ? cols[timeIdx] : "",
      satellite: satIdx >= 0 ? cols[satIdx] : "VIIRS",
      confidence: confIdx >= 0 ? cols[confIdx] : "",
      frp: frpIdx >= 0 ? parseFloat(cols[frpIdx]) || 0 : 0,
      daynight: (dnIdx >= 0 ? cols[dnIdx] : "D") as "D" | "N",
    });
  }

  return hotspots;
}

/**
 * Filter hotspots by minimum confidence.
 * VIIRS confidence: "l" (low), "n" (nominal), "h" (high)
 * MODIS confidence: 0-100
 */
export function filterHighConfidence(hotspots: FirmsHotspot[]): FirmsHotspot[] {
  return hotspots.filter((h) => {
    if (typeof h.confidence === "number") return h.confidence >= 50;
    if (typeof h.confidence === "string") {
      const c = h.confidence.toLowerCase().trim();
      return c === "h" || c === "high" || c === "n" || c === "nominal";
    }
    return true;
  });
}
