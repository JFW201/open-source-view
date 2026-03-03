// ── Map & Layer Types ───────────────────────────────────────────────────────

export interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

export type LayerCategory =
  | "tracking"
  | "military"
  | "infrastructure"
  | "geopolitical"
  | "natural";

export interface LayerConfig {
  id: string;
  name: string;
  category: LayerCategory;
  visible: boolean;
  opacity: number;
  color: [number, number, number];
  description: string;
  requiresApiKey?: string;
}

// ── Tracking Types ──────────────────────────────────────────────────────────

export interface Aircraft {
  icao24: string;
  callsign: string;
  origin_country: string;
  longitude: number;
  latitude: number;
  baro_altitude: number;
  velocity: number;
  true_track: number;
  on_ground: boolean;
  squawk: string | null;
}

export interface Vessel {
  mmsi: string;
  name: string;
  ship_type: string;
  latitude: number;
  longitude: number;
  speed: number;
  course: number;
  heading: number;
  flag: string;
  destination: string;
  status: string;
}

// ── Static Layer Data Types ─────────────────────────────────────────────────

export interface MilitaryBase {
  id: string;
  name: string;
  country: string;
  operator: string;
  branch: string;
  latitude: number;
  longitude: number;
  type: string;
}

export interface DataCenter {
  id: string;
  name: string;
  operator: string;
  latitude: number;
  longitude: number;
  country: string;
  type: string;
  capacity_mw?: number;
}

export interface UnderseaCable {
  id: string;
  name: string;
  landing_points: [number, number][];
  length_km: number;
  owners: string;
  rfs_year: number;
  capacity_tbps?: number;
}

export interface NuclearFacility {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  type: "power" | "research" | "enrichment" | "military";
  status: "active" | "decommissioned" | "under_construction";
  capacity_mw?: number;
}

export interface ConflictZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius_km: number;
  intensity: "low" | "medium" | "high";
  type: string;
  description: string;
}

// ── Country Types ───────────────────────────────────────────────────────────

export interface Country {
  code: string;
  name: string;
  region: string;
  subregion: string;
  latitude: number;
  longitude: number;
  population: number;
  capital: string;
  currencies: string[];
  languages: string[];
}

// ── News Types ──────────────────────────────────────────────────────────────

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  category: NewsCategory;
  url: string;
  description: string;
  publishedAt: string;
  country?: string;
  aiSummary?: string;
  sentiment?: "positive" | "negative" | "neutral";
}

export type NewsCategory =
  | "breaking"
  | "geopolitical"
  | "military"
  | "cyber"
  | "economic"
  | "energy"
  | "technology"
  | "disaster"
  | "health"
  | "space";

export interface RSSFeed {
  url: string;
  name: string;
  category: NewsCategory;
  region?: string;
}

// ── Market Types ────────────────────────────────────────────────────────────

export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  updatedAt: string;
}

export interface KalshiMarket {
  id: string;
  title: string;
  category: string;
  yes_price: number;
  no_price: number;
  volume: number;
  close_time: string;
  status: string;
}

// ── AI / Grok Types ─────────────────────────────────────────────────────────

export interface GrokSummary {
  summary: string;
  key_points: string[];
  sentiment: "positive" | "negative" | "neutral" | "mixed";
  confidence: number;
  generated_at: string;
}

export interface GrokRequest {
  headlines: string[];
  context?: string;
  country?: string;
}

// ── Twitter / X Types ───────────────────────────────────────────────────────

export interface Tweet {
  id: string;
  text: string;
  author: string;
  author_handle: string;
  created_at: string;
  retweet_count: number;
  like_count: number;
  url: string;
}

// ── Settings Types ──────────────────────────────────────────────────────────

export interface ApiKeyConfig {
  key: string;
  label: string;
  description: string;
  required: boolean;
  docsUrl: string;
}

export interface AppSettings {
  apiKeys: Record<string, string>;
  mapStyle: "dark" | "satellite" | "light";
  refreshInterval: number; // seconds
  maxNewsItems: number;
  enableNotifications: boolean;
}

// ── Panel Types ─────────────────────────────────────────────────────────────

export type PanelId =
  | "news"
  | "country"
  | "markets"
  | "ai"
  | "predictions"
  | "twitter"
  | "settings";

// ── Tauri IPC Types ─────────────────────────────────────────────────────────

export interface ProxyRequest {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

export interface ProxyResponse {
  status: number;
  body: string;
  headers: Record<string, string>;
}

export interface FeedSource {
  url: string;
  name: string;
}

export interface FeedItem {
  title: string;
  link: string;
  description: string;
  pub_date: string;
  source: string;
}

// ── GeoJSON Types ───────────────────────────────────────────────────────

export interface CountryBoundaryFeature {
  type: "Feature";
  properties: {
    ISO_A2?: string;
    NAME?: string;
    [key: string]: unknown;
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
}

// ── Search Types ─────────────────────────────────────────────────────────

export type SearchResultType =
  | "country"
  | "news"
  | "military"
  | "datacenter"
  | "nuclear"
  | "cable"
  | "conflict"
  | "ai";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  coordinates?: [number, number];
  score: number;
  data?: unknown;
}

// ── Cache Types ──────────────────────────────────────────────────────────

export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number;
}

// ── Export Types ──────────────────────────────────────────────────────────

export type ExportFormat = "json" | "csv" | "markdown";
