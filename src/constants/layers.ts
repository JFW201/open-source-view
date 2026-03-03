import type { LayerConfig } from "../types";

export const LAYER_CONFIGS: LayerConfig[] = [
  {
    id: "air-traffic",
    name: "Air Traffic",
    category: "tracking",
    visible: false,
    opacity: 0.9,
    color: [34, 197, 94],
    description: "Live aircraft positions via Aviation Stack / OpenSky Network",
    requiresApiKey: "aviationstack",
  },
  {
    id: "sea-traffic",
    name: "Sea Traffic",
    category: "tracking",
    visible: false,
    opacity: 0.9,
    color: [96, 165, 250],
    description: "Live vessel positions via AIS Stream / AISHub",
    requiresApiKey: "aisstream",
  },
  {
    id: "military-bases",
    name: "Military Bases",
    category: "military",
    visible: false,
    opacity: 0.85,
    color: [239, 68, 68],
    description: "Major military installations worldwide",
  },
  {
    id: "conflict-zones",
    name: "Conflict Zones",
    category: "geopolitical",
    visible: false,
    opacity: 0.5,
    color: [239, 68, 68],
    description: "Active conflict and tension areas",
  },
  {
    id: "data-centers",
    name: "Data Centers",
    category: "infrastructure",
    visible: false,
    opacity: 0.85,
    color: [59, 130, 246],
    description: "Major cloud and AI data center locations",
  },
  {
    id: "undersea-cables",
    name: "Undersea Cables",
    category: "infrastructure",
    visible: false,
    opacity: 0.7,
    color: [168, 85, 247],
    description: "Submarine communications cable routes",
  },
  {
    id: "nuclear-facilities",
    name: "Nuclear Facilities",
    category: "infrastructure",
    visible: false,
    opacity: 0.85,
    color: [245, 158, 11],
    description: "Nuclear power plants, research reactors, enrichment sites",
  },
];

export const LAYER_CATEGORIES = [
  { id: "tracking", label: "Live Tracking", icon: "radar" },
  { id: "military", label: "Military", icon: "shield" },
  { id: "infrastructure", label: "Infrastructure", icon: "building" },
  { id: "geopolitical", label: "Geopolitical", icon: "globe" },
] as const;

export const API_KEY_CONFIGS: Record<
  string,
  { label: string; description: string; docsUrl: string }
> = {
  aviationstack: {
    label: "Aviation Stack",
    description: "Primary flight tracking API with real-time positions. Get key from aviationstack.com.",
    docsUrl: "https://aviationstack.com/documentation",
  },
  opensky: {
    label: "OpenSky Network (Fallback)",
    description: "Free flight tracking fallback. Sign up at opensky-network.org for higher rate limits.",
    docsUrl: "https://openskynetwork.github.io/opensky-api/",
  },
  aisstream: {
    label: "AIS Stream",
    description: "Primary real-time vessel tracking via WebSocket. Get key from aisstream.io.",
    docsUrl: "https://aisstream.io/documentation",
  },
  aishub: {
    label: "AISHub (Fallback)",
    description: "Community vessel tracking fallback. Free with data sharing at aishub.net.",
    docsUrl: "https://www.aishub.net/",
  },
  xai: {
    label: "xAI (Grok)",
    description: "Grok AI model for unbiased news summaries. Get key from x.ai.",
    docsUrl: "https://docs.x.ai/",
  },
  twitter: {
    label: "X / Twitter API",
    description: "Access to X posts and trends. Bearer token from developer.x.com.",
    docsUrl: "https://developer.x.com/en/docs",
  },
  kalshi: {
    label: "Kalshi",
    description:
      "Prediction markets data. API access from kalshi.com developer portal.",
    docsUrl: "https://trading-api.readme.io/reference/getting-started",
  },
  alphavantage: {
    label: "Alpha Vantage",
    description: "Free stock market data. Get API key from alphavantage.co.",
    docsUrl: "https://www.alphavantage.co/documentation/",
  },
  maptiler: {
    label: "MapTiler",
    description:
      "Optional: Premium map tiles. Free tier includes 100k tile loads/month.",
    docsUrl: "https://docs.maptiler.com/",
  },
};
