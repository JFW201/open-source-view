import type { CacheEntry } from "../types";

/**
 * Two-tier cache: in-memory Map (fast) → persistent Tauri store (survives restart).
 * Each entry has a TTL. Stale entries are served if network is unavailable (offline mode).
 */

type StoreHandle = {
  get: <T>(key: string) => Promise<T | null>;
  set: (key: string, value: unknown) => Promise<void>;
  save: () => Promise<void>;
};

class CacheService {
  private mem = new Map<string, CacheEntry>();
  private store: StoreHandle | null = null;
  private initPromise: Promise<void> | null = null;

  /** Lazily initialize the Tauri persistent store. */
  private async ensureStore(): Promise<StoreHandle | null> {
    if (this.store) return this.store;
    if (this.initPromise) {
      await this.initPromise;
      return this.store;
    }
    this.initPromise = (async () => {
      try {
        const { Store } = await import("@tauri-apps/plugin-store");
        this.store = (await Store.load("waldorf-cache.json")) as unknown as StoreHandle;
      } catch {
        // Browser dev mode — no persistent cache available
      }
    })();
    await this.initPromise;
    return this.store;
  }

  /** Get from cache. Returns null if missing or expired (unless `allowStale`). */
  async get<T>(key: string, allowStale = false): Promise<T | null> {
    // 1. Check memory
    const mem = this.mem.get(key);
    if (mem) {
      const fresh = Date.now() - mem.timestamp < mem.ttl;
      if (fresh || allowStale) return mem.data as T;
    }

    // 2. Check persistent store
    const store = await this.ensureStore();
    if (store) {
      const stored = await store.get<CacheEntry<T>>(key);
      if (stored && typeof stored === "object" && "timestamp" in stored) {
        const fresh = Date.now() - stored.timestamp < stored.ttl;
        if (fresh || allowStale) {
          this.mem.set(key, stored as CacheEntry); // promote to memory
          return stored.data;
        }
      }
    }

    return null;
  }

  /** Store value in both tiers. */
  async set<T>(key: string, data: T, ttlMs: number): Promise<void> {
    const entry: CacheEntry<T> = { data, timestamp: Date.now(), ttl: ttlMs };
    this.mem.set(key, entry as CacheEntry);

    const store = await this.ensureStore();
    if (store) {
      try {
        await store.set(key, entry);
        await store.save();
      } catch {
        // Persistence is best-effort
      }
    }
  }

  /** Invalidate a specific key from both tiers. */
  async invalidate(key: string): Promise<void> {
    this.mem.delete(key);
    const store = await this.ensureStore();
    if (store) {
      try {
        await store.set(key, null);
        await store.save();
      } catch {
        // best-effort
      }
    }
  }

  /** Clear all cached data. */
  async clear(): Promise<void> {
    this.mem.clear();
  }
}

/** Singleton cache instance for the entire app. */
export const cache = new CacheService();

// ── TTL Constants ────────────────────────────────────────────────────────

export const CACHE_TTL = {
  NEWS: 5 * 60 * 1000,          // 5 minutes
  MARKETS: 2 * 60 * 1000,       // 2 minutes
  AIR_TRAFFIC: 30 * 1000,       // 30 seconds
  SEA_TRAFFIC: 60 * 1000,       // 60 seconds
  AI_SUMMARY: 30 * 60 * 1000,   // 30 minutes
  GEOJSON: Infinity,            // Static data, never expires
  TWEETS: 3 * 60 * 1000,        // 3 minutes
  PREDICTIONS: 5 * 60 * 1000,   // 5 minutes
  GDELT: 10 * 60 * 1000,        // 10 minutes
  ACLED: 30 * 60 * 1000,        // 30 minutes (conflict data updates slowly)
  FIRMS: 15 * 60 * 1000,        // 15 minutes (satellite passes ~every 12h)
} as const;
