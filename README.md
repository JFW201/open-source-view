# Waldorf — Open Source Intelligence Monitor

A comprehensive OSINT desktop application built with **Tauri v2 + React + deck.gl**, designed for real-time global intelligence monitoring with multi-source signal fusion and anomaly detection.

---

## Features

### Interactive Globe & Map
- **deck.gl + MapLibre GL JS** — WebGL-accelerated 3D rendering with globe and flat map modes
- **13 toggleable overlay layers** across 5 categories (tracking, military, infrastructure, geopolitical, natural/environmental)
- **Country click intelligence** — click any country for detailed info, economic indicators, and AI-generated briefs
- **Smart tooltips** — hover any map feature for contextual details
- **Custom annotations** — drop markers, draw polygons, and create radius circles on the map
- **Distance measurement** — measure great-circle distances between any points with Haversine accuracy
- **Heatmaps** — density visualization for aircraft and vessel clustering

### Live Tracking
- **Air Traffic** — Aviation Stack (primary) + OpenSky Network (fallback) for global flight positions
- **Sea Traffic** — AIS Stream WebSocket (primary) + AISHub (fallback) for live vessel tracking
- **Auto-polling** with configurable refresh intervals and graceful fallback chains

### OSINT Data Layers
- **GDELT Events** — Global event database with 300+ categories, color-coded by Goldstein cooperation/conflict scale
- **ACLED Conflict Data** — Armed conflict events with actor attribution, fatality counts, and sub-event classification
- **NASA FIRMS Fire Detection** — VIIRS satellite active fire / thermal anomaly detections with fire radiative power (FRP)

### Signal Fusion & Anomaly Detection
- **Multi-source signal fusion** — Welford's online algorithm for streaming mean/variance computation (O(1) memory)
- **Statistical anomaly detection** — Z-score-based alerting with configurable severity thresholds (elevated ≥1.5σ, high ≥2.0σ, critical ≥3.0σ)
- **Regional convergence** — 10° lat/lon grid cell analysis detecting when multiple signal types spike simultaneously
- **Intelligence gap reporting** — Real-time source health monitoring with status tracking (live/degraded/offline/stale)

### Intelligence Feeds
- **30+ RSS feeds** across 10 categories (breaking, geopolitical, military, cyber, economic, energy, tech, disaster, health, space)
- **X/Twitter OSINT feed** — curated list of OSINT accounts with real-time updates
- **Kalshi prediction markets** — live event probability tracking
- **Alpha Vantage market data** — 10 major indices/ETFs (S&P 500, NASDAQ, gold, oil, VIX, etc.)

### AI-Powered Analysis
- **Grok (xAI) integration** — unbiased news summaries via Grok-3
- **Country intelligence briefs** — AI-generated per-country analysis
- **Sentiment analysis** — automated positive/negative/neutral/mixed classification

### Alerts & Watchlists
- **Custom alert conditions** — geofence entry, news keywords, aircraft callsigns, vessel MMSI, country events
- **Real-time evaluation** — automatic trigger with notification badges
- **Alert history** — timestamped log with trigger counts

### Historical Playback
- **Timeline scrubbing** — replay recorded aircraft/vessel snapshots at configurable speed
- **Play/pause/step controls** — granular control over historical data review

### Economic Indicators
- **Per-country data** — GDP, GDP growth, inflation, unemployment, trade balance, population growth
- **World Bank API** — automated fetching with persistent caching

### Data Layers
- **224 military bases** — across 52 countries (US: 58, Russia: 21, China: 23, India: 12, Israel: 7, plus NATO allies and regional powers)
- **30+ data centers** — AWS, Google, Microsoft, Meta, xAI, Oracle, Alibaba, Tencent, Equinix
- **13 undersea cables** — MAREA, 2Africa, Equiano, Dunant, Grace Hopper, SEA-ME-WE 6, and more
- **30+ nuclear facilities** — power plants, enrichment sites, research reactors, military sites
- **19 conflict zones** — with intensity ratings and descriptions

### Built-in Debug & Diagnostics
- **Connection tester** — verify API connectivity for all data sources
- **Cache inspector** — view in-memory cache entries, sizes, and TTL freshness
- **Store state viewer** — inspect Zustand store sizes and data counts
- **Console log capture** — in-app log viewer for errors, warnings, and info messages
- **System info** — browser, platform, Tauri status, and memory usage

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop | Tauri v2 (Rust backend, native on macOS/Windows/Linux) |
| Frontend | React 18, TypeScript 5.7, Vite 6 |
| Map | deck.gl 9 + MapLibre GL JS 4 |
| State | Zustand 4 (11 stores with persist middleware) |
| Data | TanStack Query 5 + two-tier cache (memory + Tauri Store) |
| Styling | Tailwind CSS 3 with custom `waldorf-*` design tokens |
| Icons | Lucide React |
| HTTP | Rust-backed proxy (CORS bypass) with 30s timeout |

---

## Getting Started

### Prerequisites

**All platforms:**
- [Node.js](https://nodejs.org/) 18+ (LTS recommended)
- [Rust toolchain](https://rustup.rs/) (install via rustup)
- [Git](https://git-scm.com/)

**macOS:**
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

**Windows:**
```powershell
# Install Visual Studio Build Tools (C++ workload required)
# Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/

# Install Rust (via rustup-init.exe)
# Download from: https://rustup.rs/

# Install WebView2 (usually pre-installed on Windows 10/11)
# Download from: https://developer.microsoft.com/en-us/microsoft-edge/webview2/
```

**Linux (Debian/Ubuntu):**
```bash
# Install system dependencies
sudo apt update
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget \
  file libssl-dev libayatana-appindicator3-dev librsvg2-dev \
  libgtk-3-dev libsoup-3.0-dev libjavascriptcoregtk-4.1-dev

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

**Linux (Fedora):**
```bash
sudo dnf install webkit2gtk4.1-devel openssl-devel curl wget \
  file libappindicator-gtk3-devel librsvg2-devel gtk3-devel \
  libsoup3-devel javascriptcoregtk4.1-devel
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

**Linux (Arch):**
```bash
sudo pacman -S webkit2gtk-4.1 base-devel curl wget file openssl \
  libappindicator-gtk3 librsvg gtk3 libsoup3
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### Install & Run

```bash
# Clone the repository
git clone https://github.com/JFW201/open-source-view.git
cd open-source-view

# Install JavaScript dependencies
npm install

# Run in development mode (opens Tauri window with hot-reload)
npm run tauri:dev

# Or run frontend only in browser (no Tauri features)
npm run dev
# Open http://localhost:1420
```

### Build for Production

```bash
# Build for your current platform
npm run tauri:build

# macOS-specific builds
npm run tauri:build:mac-arm    # Apple Silicon (M1/M2/M3/M4)
npm run tauri:build:mac-intel  # Intel Mac (x86_64)
```

Build outputs are located in `src-tauri/target/release/bundle/`:
- **macOS**: `.dmg` and `.app`
- **Windows**: `.msi` and NSIS installer
- **Linux**: `.deb`, `.rpm`, and `.AppImage`

### Browser-Only Mode

Waldorf can run in the browser without Tauri for development:

```bash
npm run dev
```

In browser mode:
- HTTP requests go directly to APIs (may hit CORS restrictions)
- No persistent cache (Tauri Store unavailable)
- No desktop notifications
- All map layers and UI features still work

---

## API Key Configuration

Configure API keys in the **Settings panel** (gear icon in sidebar) after launching the app. All keys are stored locally on your device via Tauri's encrypted store.

| Service | Purpose | Required? | Get Key |
|---------|---------|-----------|---------|
| Aviation Stack | Air traffic tracking (primary) | For air traffic | [aviationstack.com](https://aviationstack.com) |
| OpenSky Network | Air traffic fallback | Free alternative | [opensky-network.org](https://opensky-network.org) |
| AIS Stream | Vessel tracking (primary, WebSocket) | For sea traffic | [aisstream.io](https://aisstream.io) |
| AISHub | Vessel tracking fallback | Free alternative | [aishub.net](https://www.aishub.net) |
| xAI (Grok) | AI news summaries & country briefs | For AI features | [x.ai](https://x.ai) |
| X / Twitter | OSINT tweet feed | For X feed | [developer.x.com](https://developer.x.com) |
| Kalshi | Prediction markets | For predictions | [kalshi.com](https://kalshi.com) |
| Alpha Vantage | Stock market data | For markets | [alphavantage.co](https://www.alphavantage.co) |
| MapTiler | Premium map tiles | Optional | [maptiler.com](https://www.maptiler.com) |
| ACLED | Armed conflict event data | For ACLED layer | [acleddata.com](https://acleddata.com) |
| ACLED Email | Email for ACLED API auth | With ACLED key | Same as above |
| NASA FIRMS | Fire detection (higher limits) | Optional (works without) | [firms.modaps.eosdis.nasa.gov](https://firms.modaps.eosdis.nasa.gov) |

**Note:** GDELT requires no API key. NASA FIRMS works without a key at reduced rate limits.

### Minimum Setup (No API Keys)

Even without any API keys, Waldorf provides:
- All 13 static/reference map layers (military bases, data centers, cables, nuclear, conflict zones, country boundaries)
- GDELT global events (no key required)
- NASA FIRMS fire detection (basic access, no key)
- 30+ RSS news feeds
- Custom annotations and measurements
- Historical playback of cached data
- Signal fusion and anomaly detection
- Economic indicators (World Bank, no key)

---

## Architecture

```
src/
├── components/
│   ├── Map/                 # deck.gl map, layer factories, controls
│   │   ├── layers/          # Layer factory functions (8 base + 2 heatmap + 3 OSINT + annotations)
│   │   └── controls/        # LayerPanel, MapToolbar, PlaybackControl
│   ├── Panels/              # News, Country, Markets, AI, Twitter, Predictions,
│   │                        # Settings, Alerts, Timeline, Signals, Debug
│   └── Layout/              # TopBar, Sidebar, PanelContainer, StatusBar
├── store/                   # 11 Zustand stores
│   ├── mapStore.ts          # Map view state, aircraft, vessels, OSINT data, layers
│   ├── newsStore.ts         # RSS feed items and search
│   ├── marketStore.ts       # Stock indices, Kalshi markets
│   ├── settingsStore.ts     # API keys, preferences (persisted)
│   ├── panelStore.ts        # Active panel, sidebar state
│   ├── searchStore.ts       # Global search results
│   ├── alertStore.ts        # Watchlist alerts, notifications
│   ├── timelineStore.ts     # Timeline events
│   ├── playbackStore.ts     # Historical playback state
│   ├── annotationStore.ts   # Markers, polygons, circles, measurements
│   └── signalFusionStore.ts # Welford's algorithm, anomaly detection, convergence
├── services/
│   ├── api/                 # API clients (12 services)
│   │   ├── aviationstack.ts, opensky.ts      # Air traffic
│   │   ├── aisstream.ts, ais.ts              # Sea traffic
│   │   ├── gdelt.ts, acled.ts, firms.ts      # OSINT data
│   │   ├── grok.ts                           # AI summaries
│   │   ├── twitter.ts                        # X feed
│   │   ├── kalshi.ts, markets.ts             # Financial data
│   │   └── news.ts                           # RSS aggregation
│   ├── proxy.ts             # Tauri backend HTTP proxy (CORS bypass)
│   └── cache.ts             # Two-tier cache (memory + Tauri Store)
├── data/                    # Static reference data
│   ├── militaryBases.ts     # 224 bases across 52 countries
│   ├── dataCenters.ts       # 30+ major data centers
│   ├── underseaCables.ts    # 13 submarine cable routes
│   ├── nuclearFacilities.ts # 30+ nuclear sites
│   ├── conflictZones.ts     # 19 conflict/tension areas
│   └── countries.ts         # 195 country profiles
├── hooks/                   # React hooks
│   ├── useDataPolling.ts    # Air/sea traffic lifecycle
│   ├── useOsintPolling.ts   # GDELT/ACLED/FIRMS polling (layer-gated)
│   ├── useAlertEvaluation.ts # Alert condition checking
│   ├── useAutoUpdater.ts    # Tauri auto-update
│   ├── useCountryBoundaries.ts # GeoJSON boundary loading
│   └── useEconomicIndicators.ts # World Bank data fetching
├── types/                   # TypeScript interfaces (35+ types)
├── constants/               # Layer configs, RSS feed definitions, API key configs
└── styles/                  # Global CSS, map overrides, tooltip styles

src-tauri/
├── src/
│   ├── main.rs              # Tauri entry point
│   └── lib.rs               # 3 Rust commands: proxy_request, fetch_rss, fetch_rss_batch
├── Cargo.toml               # Rust dependencies (reqwest, rss, serde, tokio)
└── tauri.conf.json          # Window config, CSP, bundle targets, plugins
```

### Data Flow

```
External APIs → Rust proxy (CORS bypass) → Cache (memory + Tauri Store)
                                              ↓
                    React hooks (polling) → Zustand stores → deck.gl layers
                                              ↓
                    Signal fusion store → Welford's algorithm → Anomaly alerts
```

### Cache TTLs

| Data Source | TTL | Rationale |
|-------------|-----|-----------|
| Air Traffic | 30s | Real-time positions |
| Sea Traffic | 60s | Slower vessel movement |
| Markets | 2m | Exchange update frequency |
| News | 5m | RSS feed refresh rate |
| Tweets | 3m | Social media velocity |
| Predictions | 5m | Market update frequency |
| GDELT | 10m | Event database update cycle |
| FIRMS | 15m | Satellite pass frequency |
| ACLED | 30m | Conflict data update speed |
| AI Summary | 30m | Expensive API call |
| GeoJSON | ∞ | Static boundary data |

---

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed solutions to common issues.

**Quick fixes:**
- **Blank map**: Check internet connection — map tiles require network access
- **No data loading**: Open the Debug panel (bug icon in sidebar) to test API connections
- **CORS errors in browser**: Run via `npm run tauri:dev` for the Rust proxy, or check browser console
- **Build fails on Rust**: Run `rustup update` and ensure system dependencies are installed
- **API rate limits**: Check cache TTLs in Debug panel — reduce polling frequency in Settings

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, coding standards, and submission guidelines.

---

## License

MIT
