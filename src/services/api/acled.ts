import { proxyFetchJSON } from "../proxy";
import { cache, CACHE_TTL } from "../cache";
import type { AcledEvent } from "../../types";

/**
 * ACLED (Armed Conflict Location & Event Data) API integration.
 * Requires a free API key + email from https://acleddata.com/
 * Returns structured conflict events with actor attribution, fatalities,
 * and precise geolocations.
 */

const ACLED_API = "https://api.acleddata.com/acled/read";

/**
 * Fetch conflict events from ACLED for the past 30 days.
 * @param apiKey ACLED API key (free registration)
 * @param email Email used for ACLED registration
 */
export async function fetchAcledEvents(
  apiKey: string,
  email: string
): Promise<AcledEvent[]> {
  const cacheKey = "acled-events";
  const cached = await cache.get<AcledEvent[]>(cacheKey);
  if (cached) return cached;

  try {
    // Date range: last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const dateFrom = thirtyDaysAgo.toISOString().split("T")[0];
    const dateTo = now.toISOString().split("T")[0];

    const params = new URLSearchParams({
      key: apiKey,
      email,
      event_date: `${dateFrom}|${dateTo}`,
      event_date_where: "BETWEEN",
      limit: "2000",
      fields:
        "event_id_cnty|event_date|event_type|sub_event_type|actor1|actor2|country|admin1|location|latitude|longitude|fatalities|notes|source",
    });

    const url = `${ACLED_API}?${params.toString()}`;
    const data = await proxyFetchJSON<{ success: boolean; data: any[] }>(url);

    if (!data.success || !Array.isArray(data.data)) {
      console.warn("ACLED API returned unsuccessful response");
      return [];
    }

    const events: AcledEvent[] = data.data
      .filter((d: any) => d.latitude && d.longitude)
      .map((d: any) => ({
        id: `acled-${d.event_id_cnty || d.data_id}`,
        eventDate: d.event_date,
        eventType: d.event_type || "Unknown",
        subEventType: d.sub_event_type || "",
        actor1: d.actor1 || "Unknown",
        actor2: d.actor2 || "",
        country: d.country || "",
        admin1: d.admin1 || "",
        location: d.location || "",
        latitude: parseFloat(d.latitude),
        longitude: parseFloat(d.longitude),
        fatalities: parseInt(d.fatalities) || 0,
        notes: d.notes || "",
        source: d.source || "ACLED",
      }));

    await cache.set(cacheKey, events, CACHE_TTL.ACLED);
    return events;
  } catch (err) {
    console.error("ACLED fetch failed:", err);
    const stale = await cache.get<AcledEvent[]>(cacheKey, true);
    return stale || [];
  }
}

/**
 * Classify ACLED event severity based on type and fatalities.
 */
export function classifyAcledSeverity(
  event: AcledEvent
): "info" | "warning" | "critical" {
  if (event.fatalities >= 10) return "critical";
  if (event.fatalities >= 1) return "warning";

  const highSeverityTypes = [
    "Battles",
    "Explosions/Remote violence",
    "Violence against civilians",
  ];
  if (highSeverityTypes.includes(event.eventType)) return "warning";

  return "info";
}
