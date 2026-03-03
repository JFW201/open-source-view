# Waldorf — Open Source Intelligence Monitor

A comprehensive OSINT desktop application built with Tauri v2 + React + deck.gl, designed for Apple Silicon first.

## Features

### Interactive Map
- **deck.gl + MapLibre GL JS** — WebGL-accelerated 3D rendering with globe and flat map modes
- **7 toggleable overlay layers** — air traffic, sea traffic, military bases, data centers, undersea cables, nuclear facilities, conflict zones
- **Country click intelligence** — click any country for detailed info + Grok AI brief
- **Smart tooltips** — hover any map feature for contextual details

### Live Tracking
- **Air Traffic** — Aviation Stack (primary) + OpenSky Network (fallback) for global flight positions
- **Sea Traffic** — AIS Stream WebSocket (primary) + AISHub (fallback) for live vessel tracking
- **Auto-polling** with configurable refresh intervals and graceful fallback chains

### Intelligence Feeds
- **30+ RSS feeds** across 10 categories (breaking, geopolitical, military, cyber, economic, energy, tech, disaster, health, space)
- **X/Twitter OSINT feed** — curated list of 13 OSINT accounts with real-time updates
- **Kalshi prediction markets** — live event probability tracking
- **Alpha Vantage market data** — 10 major indices/ETFs (S&P 500, NASDAQ, gold, oil, VIX, etc.)

### AI-Powered Analysis
- **Grok (xAI) integration** — unbiased news summaries via Grok-3
- **Country intelligence briefs** — AI-generated per-country analysis
- **Sentiment analysis** — automated positive/negative/neutral/mixed classification

### Data Layers
- **50+ military bases** — US, Russia, China, UK, France, NATO, Israel, India, Australia
- **30+ data centers** — AWS, Google, Microsoft, Meta, xAI, Oracle, Alibaba, Tencent, Equinix
- **13 undersea cables** — MAREA, 2Africa, Equiano, Dunant, Grace Hopper, SEA-ME-WE 6, and more
- **30+ nuclear facilities** — power plants, enrichment sites, research reactors, military sites
- **19 conflict zones** — with intensity ratings and descriptions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop | Tauri v2 (Rust, Apple Silicon native) |
| Frontend | React 18, TypeScript, Vite 6 |
| Map | deck.gl 9 + MapLibre GL JS 4 |
| State | Zustand 4 |
| Data | TanStack Query 5 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |

## Getting Started

### Prerequisites
- Node.js 18+
- Rust toolchain (`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`)
- Tauri CLI (`cargo install tauri-cli@^2`)
- Xcode Command Line Tools (macOS)

### Install & Run

```bash
# Install dependencies
npm install

# Run in development (opens Tauri window)
npm run tauri dev

# Build for production
npm run tauri build
```

### API Keys

Configure API keys in the Settings panel (gear icon) after launching the app. All keys are stored locally on your device.

| Service | Purpose | Get Key |
|---------|---------|---------|
| Aviation Stack | Air traffic tracking (primary) | [aviationstack.com](https://aviationstack.com) |
| OpenSky Network | Air traffic fallback (free) | [opensky-network.org](https://opensky-network.org) |
| AIS Stream | Vessel tracking (primary, WebSocket) | [aisstream.io](https://aisstream.io) |
| AISHub | Vessel tracking fallback | [aishub.net](https://www.aishub.net) |
| xAI (Grok) | AI news summaries | [x.ai](https://x.ai) |
| X / Twitter | OSINT tweet feed | [developer.x.com](https://developer.x.com) |
| Kalshi | Prediction markets | [kalshi.com](https://kalshi.com) |
| Alpha Vantage | Stock market data | [alphavantage.co](https://www.alphavantage.co) |
| MapTiler | Premium map tiles (optional) | [maptiler.com](https://www.maptiler.com) |

## Architecture

```
src/
├── components/
│   ├── Map/           # deck.gl map + layer factories + controls
│   ├── Panels/        # News, Country, Markets, AI, Twitter, Predictions, Settings
│   └── Layout/        # TopBar, Sidebar, PanelContainer, StatusBar
├── store/             # Zustand stores (map, news, market, settings, panel)
├── services/
│   ├── api/           # API clients (aviationstack, aisstream, opensky, ais, grok, twitter, kalshi, markets, news)
│   └── proxy.ts       # Tauri backend HTTP proxy (CORS bypass)
├── data/              # Static reference data (military bases, data centers, cables, nuclear, conflicts, countries)
├── types/             # TypeScript interfaces
├── constants/         # Layer configs, RSS feed definitions, API key configs
├── hooks/             # useDataPolling (air/sea traffic lifecycle)
└── styles/            # Global CSS, map overrides, tooltips

src-tauri/
├── src/
│   ├── main.rs        # Tauri entry point
│   └── lib.rs         # Rust commands (proxy_request, fetch_rss, fetch_rss_batch)
├── Cargo.toml         # Rust dependencies (reqwest, rss, serde)
└── tauri.conf.json    # Tauri app config (window, CSP, plugins)
```

## License

MIT
