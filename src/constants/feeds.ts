import type { RSSFeed } from "../types";

export const RSS_FEEDS: RSSFeed[] = [
  // ── Breaking News ───────────────────────────────────────────────────────
  { url: "https://feeds.bbci.co.uk/news/world/rss.xml", name: "BBC World", category: "breaking" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", name: "NYT World", category: "breaking" },
  { url: "https://feeds.reuters.com/reuters/topNews", name: "Reuters Top", category: "breaking" },
  { url: "https://www.aljazeera.com/xml/rss/all.xml", name: "Al Jazeera", category: "breaking" },
  { url: "https://rss.dw.com/xml/rss-en-all", name: "DW News", category: "breaking" },

  // ── Geopolitical ────────────────────────────────────────────────────────
  { url: "https://www.foreignaffairs.com/rss.xml", name: "Foreign Affairs", category: "geopolitical" },
  { url: "https://warontherocks.com/feed/", name: "War on the Rocks", category: "geopolitical" },
  { url: "https://feeds.feedburner.com/CfsrReport", name: "CSIS", category: "geopolitical" },
  { url: "https://www.crisisgroup.org/rss.xml", name: "Crisis Group", category: "geopolitical" },

  // ── Military / Defense ──────────────────────────────────────────────────
  { url: "https://www.defensenews.com/arc/outboundfeeds/rss/", name: "Defense News", category: "military" },
  { url: "https://www.janes.com/feeds/news", name: "Janes", category: "military" },
  { url: "https://theaviationist.com/feed/", name: "The Aviationist", category: "military" },
  { url: "https://www.thedrive.com/the-war-zone/feed", name: "The War Zone", category: "military" },

  // ── Cyber Security ──────────────────────────────────────────────────────
  { url: "https://feeds.feedburner.com/TheHackersNews", name: "Hacker News", category: "cyber" },
  { url: "https://www.darkreading.com/rss.xml", name: "Dark Reading", category: "cyber" },
  { url: "https://krebsonsecurity.com/feed/", name: "Krebs on Security", category: "cyber" },
  { url: "https://www.bleepingcomputer.com/feed/", name: "BleepingComputer", category: "cyber" },

  // ── Economic / Finance ──────────────────────────────────────────────────
  { url: "https://feeds.bloomberg.com/markets/news.rss", name: "Bloomberg Markets", category: "economic" },
  { url: "https://www.ft.com/?format=rss", name: "Financial Times", category: "economic" },
  { url: "https://feeds.a]reuters.com/reuters/businessNews", name: "Reuters Business", category: "economic" },

  // ── Energy ──────────────────────────────────────────────────────────────
  { url: "https://oilprice.com/rss/main", name: "OilPrice", category: "energy" },
  { url: "https://www.energy-pedia.com/rss.aspx", name: "Energy Pedia", category: "energy" },

  // ── Technology ──────────────────────────────────────────────────────────
  { url: "https://feeds.arstechnica.com/arstechnica/index", name: "Ars Technica", category: "technology" },
  { url: "https://www.wired.com/feed/rss", name: "Wired", category: "technology" },

  // ── Natural Disasters ───────────────────────────────────────────────────
  { url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.atom", name: "USGS Earthquakes", category: "disaster" },
  { url: "https://www.gdacs.org/xml/rss.xml", name: "GDACS", category: "disaster" },

  // ── Space ───────────────────────────────────────────────────────────────
  { url: "https://www.nasa.gov/rss/dyn/breaking_news.rss", name: "NASA", category: "space" },
  { url: "https://spacenews.com/feed/", name: "SpaceNews", category: "space" },
];

export const NEWS_CATEGORY_LABELS: Record<string, string> = {
  breaking: "Breaking News",
  geopolitical: "Geopolitical",
  military: "Military & Defense",
  cyber: "Cyber Security",
  economic: "Economics & Finance",
  energy: "Energy",
  technology: "Technology",
  disaster: "Natural Disasters",
  health: "Health",
  space: "Space",
};

export const NEWS_CATEGORY_COLORS: Record<string, string> = {
  breaking: "#ef4444",
  geopolitical: "#f59e0b",
  military: "#dc2626",
  cyber: "#8b5cf6",
  economic: "#22c55e",
  energy: "#f97316",
  technology: "#3b82f6",
  disaster: "#eab308",
  health: "#14b8a6",
  space: "#6366f1",
};
