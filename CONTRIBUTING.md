# Contributing to Waldorf

Thanks for your interest in contributing to Waldorf. This guide covers development setup, coding standards, and how to submit changes.

---

## Development Setup

### 1. Fork & Clone

```bash
git clone https://github.com/<your-username>/open-source-view.git
cd open-source-view
```

### 2. Install Dependencies

```bash
# JavaScript dependencies
npm install

# Rust toolchain (if not installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

See [README.md](./README.md#prerequisites) for platform-specific system dependencies.

### 3. Run in Development

```bash
# Full Tauri app (recommended)
npm run tauri:dev

# Frontend only (browser at http://localhost:1420)
npm run dev
```

### 4. Verify Your Setup

```bash
# Type-check
npx tsc --noEmit

# Build
npm run build
```

---

## Project Structure

| Directory | Purpose |
|-----------|---------|
| `src/components/` | React UI components (Map, Panels, Layout) |
| `src/store/` | Zustand state management (11 stores) |
| `src/services/api/` | External API client functions |
| `src/services/proxy.ts` | Tauri HTTP proxy wrapper |
| `src/services/cache.ts` | Two-tier caching (memory + persistent) |
| `src/data/` | Static reference datasets |
| `src/hooks/` | React hooks for data lifecycle |
| `src/types/` | TypeScript interfaces and type definitions |
| `src/constants/` | Layer configs, RSS feeds, API key metadata |
| `src/styles/` | Global CSS and Tailwind overrides |
| `src-tauri/src/` | Rust backend (proxy, RSS fetcher) |

---

## Coding Standards

### TypeScript

- Strict mode enabled — no `any` unless absolutely necessary
- All new types go in `src/types/index.ts`
- Use explicit return types for exported functions
- Prefer `interface` over `type` for object shapes

### React

- Functional components with `React.FC`
- State management via Zustand stores, not component state (except UI-only state like form inputs)
- Memoize expensive computations with `useMemo` and callbacks with `useCallback`
- deck.gl layers created by factory functions in `src/components/Map/layers/`

### Styling

- Tailwind CSS with `waldorf-*` custom tokens (defined in `tailwind.config.js`)
- Text sizes: `text-[10px]` for metadata, `text-xs` for labels, `text-sm` for headings
- Use `clsx` for conditional classes
- Dark theme is the default — all colors should work on dark backgrounds

### Naming

- Files: PascalCase for components (`NewsFeed.tsx`), camelCase for everything else (`mapStore.ts`)
- Stores: `use<Name>Store` pattern (e.g., `useMapStore`)
- Layer factories: `create<Name>Layer` pattern (e.g., `createAirTrafficLayer`)
- Hooks: `use<Name>` pattern (e.g., `useDataPolling`)

---

## Adding a New Map Layer

1. **Define the data type** in `src/types/index.ts`
2. **Add layer config** to `LAYER_CONFIGS` in `src/constants/layers.ts`
3. **Create the layer factory** in `src/components/Map/layers/` — export a function `create<Name>Layer(data, configs)`
4. **Add state** to `mapStore.ts` if the layer uses dynamic data
5. **Wire into `WaldorfMap.tsx`** — import the factory and spread into `deckLayers`
6. **Add tooltip** handling in the `getTooltip` callback in `WaldorfMap.tsx`
7. **Add polling** (if needed) in a hook under `src/hooks/`

---

## Adding a New Panel

1. **Create the panel component** in `src/components/Panels/<Name>.tsx`
2. **Add the panel ID** to `PanelId` union in `src/types/index.ts`
3. **Register in `PanelContainer.tsx`** — import and add to the `PANELS` record
4. **Add sidebar nav item** in `Sidebar.tsx` — add to `NAV_ITEMS` array
5. **Create a store** (if needed) in `src/store/`

---

## Adding a New API Integration

1. **Create the API client** in `src/services/api/<name>.ts`
2. **Use `proxyFetchJSON`** from `src/services/proxy.ts` for all HTTP requests (CORS bypass via Tauri)
3. **Add API key config** (if needed) to `API_KEY_CONFIGS` in `src/constants/layers.ts`
4. **Add cache TTL** to `CACHE_TTL` in `src/services/cache.ts`
5. **Create a polling hook** in `src/hooks/` that checks layer visibility before polling
6. **Update the signal fusion store** if the source should participate in anomaly detection

---

## Commit Messages

Use clear, descriptive commit messages:

```
feat: add satellite imagery layer with Sentinel-2 integration
fix: correct vessel tooltip showing wrong speed unit
refactor: extract layer factory helper for opacity calculation
docs: add API key setup guide for ACLED
```

Prefixes: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `style`

---

## Pull Requests

1. Create a feature branch from `main`
2. Make your changes with clear commits
3. Run `npx tsc --noEmit` — must pass with zero errors
4. Run `npm run build` — must complete successfully
5. Open a PR with a description of what changed and why
6. Reference any related issues

---

## Reporting Issues

When reporting bugs, include:
- Operating system and version
- Node.js and Rust versions (`node -v`, `rustc --version`)
- Steps to reproduce
- Console errors (open Debug panel or browser DevTools)
- Expected vs actual behavior
