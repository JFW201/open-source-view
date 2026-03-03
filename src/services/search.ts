import type { SearchResult, NewsItem } from "../types";
import type { MilitaryBase, DataCenter, NuclearFacility, ConflictZone, UnderseaCable, Country } from "../types";

/**
 * Score a query against a list of searchable strings.
 * Returns 0 (no match) or a positive number (higher = better match).
 */
function scoreMatch(query: string, fields: (string | undefined)[]): number {
  let best = 0;
  const q = query.toLowerCase();

  for (const raw of fields) {
    if (!raw) continue;
    const field = raw.toLowerCase();

    if (field === q) {
      best = Math.max(best, 100);
    } else if (field.startsWith(q)) {
      best = Math.max(best, 80);
    } else if (field.includes(q)) {
      best = Math.max(best, 50);
    } else {
      // Check each query word individually
      const words = q.split(/\s+/);
      const matched = words.filter((w) => field.includes(w)).length;
      if (matched > 0) {
        best = Math.max(best, 20 + (matched / words.length) * 30);
      }
    }
  }

  return best;
}

export interface SearchableData {
  countries: Country[];
  newsItems: NewsItem[];
  militaryBases: MilitaryBase[];
  dataCenters: DataCenter[];
  nuclearFacilities: NuclearFacility[];
  underseaCables: UnderseaCable[];
  conflictZones: ConflictZone[];
}

/**
 * Search across all data sources. Returns up to 25 results sorted by relevance.
 */
export function searchAll(query: string, data: SearchableData): SearchResult[] {
  const q = query.trim();
  if (q.length < 2) return [];

  const results: SearchResult[] = [];

  // Countries
  for (const c of data.countries) {
    const score = scoreMatch(q, [c.name, c.code, c.capital, c.region, c.subregion]);
    if (score > 0) {
      results.push({
        id: `country-${c.code}`,
        type: "country",
        title: c.name,
        subtitle: `${c.capital} — ${c.region}`,
        coordinates: [c.longitude, c.latitude],
        score,
        data: c,
      });
    }
  }

  // News (limit scanning to first 500 for performance)
  for (const item of data.newsItems.slice(0, 500)) {
    const score = scoreMatch(q, [item.title, item.source, item.description]);
    if (score > 0) {
      results.push({
        id: `news-${item.id}`,
        type: "news",
        title: item.title,
        subtitle: item.source,
        score: score * 0.8, // Slight penalty so structural data ranks above news
      });
    }
  }

  // Military bases
  for (const base of data.militaryBases) {
    const score = scoreMatch(q, [base.name, base.country, base.operator, base.branch, base.type]);
    if (score > 0) {
      results.push({
        id: `mil-${base.id}`,
        type: "military",
        title: base.name,
        subtitle: `${base.branch} — ${base.operator} (${base.country})`,
        coordinates: [base.longitude, base.latitude],
        score,
      });
    }
  }

  // Data centers
  for (const dc of data.dataCenters) {
    const score = scoreMatch(q, [dc.name, dc.operator, dc.country, dc.type]);
    if (score > 0) {
      results.push({
        id: `dc-${dc.id}`,
        type: "datacenter",
        title: dc.name,
        subtitle: `${dc.operator} — ${dc.country}`,
        coordinates: [dc.longitude, dc.latitude],
        score,
      });
    }
  }

  // Nuclear facilities
  for (const nf of data.nuclearFacilities) {
    const score = scoreMatch(q, [nf.name, nf.country, nf.type, nf.status]);
    if (score > 0) {
      results.push({
        id: `nuc-${nf.id}`,
        type: "nuclear",
        title: nf.name,
        subtitle: `${nf.type} — ${nf.country} (${nf.status})`,
        coordinates: [nf.longitude, nf.latitude],
        score,
      });
    }
  }

  // Undersea cables
  for (const cable of data.underseaCables) {
    const score = scoreMatch(q, [cable.name, cable.owners]);
    if (score > 0) {
      const midIdx = Math.floor(cable.landing_points.length / 2);
      const midPoint = cable.landing_points[midIdx];
      results.push({
        id: `cable-${cable.id}`,
        type: "cable",
        title: cable.name,
        subtitle: `${cable.owners} — ${cable.length_km.toLocaleString()} km`,
        coordinates: midPoint ? [midPoint[0], midPoint[1]] : undefined,
        score,
      });
    }
  }

  // Conflict zones
  for (const cz of data.conflictZones) {
    const score = scoreMatch(q, [cz.name, cz.type, cz.description, cz.intensity]);
    if (score > 0) {
      results.push({
        id: `conflict-${cz.id}`,
        type: "conflict",
        title: cz.name,
        subtitle: `${cz.type} — ${cz.intensity} intensity`,
        coordinates: [cz.longitude, cz.latitude],
        score,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 25);
}

/**
 * Detect if query looks like a natural language question for AI search.
 */
export function isQuestionQuery(query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q.endsWith("?")) return true;
  const questionStarters = [
    "what", "where", "when", "why", "how", "who", "which",
    "tell me", "explain", "summarize", "analyze", "describe",
    "is there", "are there", "can you", "what's",
  ];
  return questionStarters.some((s) => q.startsWith(s));
}
