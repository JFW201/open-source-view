import { create } from "zustand";
import type {
  SignalSource,
  AnomalyAlert,
  RegionalConvergence,
} from "../types";

// ── Welford's Online Algorithm ──────────────────────────────────────────────
// Computes running mean and variance in O(1) per update, O(1) memory.

interface WelfordState {
  count: number;
  mean: number;
  m2: number; // sum of squares of differences from the mean
}

function welfordInit(): WelfordState {
  return { count: 0, mean: 0, m2: 0 };
}

function welfordUpdate(state: WelfordState, value: number): WelfordState {
  const count = state.count + 1;
  const delta = value - state.mean;
  const mean = state.mean + delta / count;
  const delta2 = value - mean;
  const m2 = state.m2 + delta * delta2;
  return { count, mean, m2 };
}

function welfordStdDev(state: WelfordState): number {
  if (state.count < 2) return 0;
  return Math.sqrt(state.m2 / (state.count - 1));
}

function welfordZScore(state: WelfordState, value: number): number {
  const std = welfordStdDev(state);
  if (std === 0) return 0;
  return (value - state.mean) / std;
}

// ── Anomaly Severity Thresholds ─────────────────────────────────────────────
const Z_SCORE_ELEVATED = 1.5;
const Z_SCORE_HIGH = 2.0;
const Z_SCORE_CRITICAL = 3.0;

function zScoreToSeverity(
  z: number
): "elevated" | "high" | "critical" | null {
  const absZ = Math.abs(z);
  if (absZ >= Z_SCORE_CRITICAL) return "critical";
  if (absZ >= Z_SCORE_HIGH) return "high";
  if (absZ >= Z_SCORE_ELEVATED) return "elevated";
  return null;
}

// ── Regional Grid ───────────────────────────────────────────────────────────
// Discretize the globe into ~10° grid cells for regional convergence detection.

function regionKey(lat: number, lon: number): string {
  const gridLat = Math.floor(lat / 10) * 10;
  const gridLon = Math.floor(lon / 10) * 10;
  return `${gridLat},${gridLon}`;
}

function regionCenter(key: string): [number, number] {
  const [lat, lon] = key.split(",").map(Number);
  return [lon + 5, lat + 5]; // center of the grid cell [lon, lat]
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ── Signal Fusion Store ─────────────────────────────────────────────────────

interface RegionBaseline {
  gdelt: WelfordState;
  acled: WelfordState;
  firms: WelfordState;
  news: WelfordState;
}

interface SignalFusionState {
  // Data source health tracking (intelligence gap reporting)
  sources: SignalSource[];

  // Anomaly detection
  anomalies: AnomalyAlert[];
  convergences: RegionalConvergence[];

  // Internal baselines (per-region Welford states)
  baselines: Record<string, RegionBaseline>;

  // Actions
  updateSourceStatus: (
    sourceId: string,
    status: SignalSource["status"],
    eventCount?: number,
    errorMessage?: string
  ) => void;

  // Ingest signal counts from each data source for anomaly detection
  ingestSignals: (
    type: "gdelt" | "acled" | "firms" | "news",
    regionCounts: { lat: number; lon: number; count: number }[]
  ) => void;

  // Detect convergence across signal types in the same region
  detectConvergence: () => void;

  // Clear anomalies older than the given duration (ms)
  pruneAnomalies: (maxAgeMs?: number) => void;

  clearAll: () => void;
}

const DEFAULT_SOURCES: SignalSource[] = [
  {
    id: "gdelt",
    name: "GDELT Global Events",
    status: "offline",
    lastUpdated: null,
    eventCount: 0,
  },
  {
    id: "acled",
    name: "ACLED Conflict Data",
    status: "offline",
    lastUpdated: null,
    eventCount: 0,
  },
  {
    id: "firms",
    name: "NASA FIRMS Fire Detection",
    status: "offline",
    lastUpdated: null,
    eventCount: 0,
  },
  {
    id: "news",
    name: "News RSS Feeds",
    status: "offline",
    lastUpdated: null,
    eventCount: 0,
  },
  {
    id: "air-traffic",
    name: "Air Traffic (OpenSky)",
    status: "offline",
    lastUpdated: null,
    eventCount: 0,
  },
  {
    id: "sea-traffic",
    name: "Sea Traffic (AIS)",
    status: "offline",
    lastUpdated: null,
    eventCount: 0,
  },
];

function initRegionBaseline(): RegionBaseline {
  return {
    gdelt: welfordInit(),
    acled: welfordInit(),
    firms: welfordInit(),
    news: welfordInit(),
  };
}

export const useSignalFusionStore = create<SignalFusionState>()((set, get) => ({
  sources: DEFAULT_SOURCES.map((s) => ({ ...s })),
  anomalies: [],
  convergences: [],
  baselines: {},

  updateSourceStatus: (sourceId, status, eventCount, errorMessage) => {
    set((s) => ({
      sources: s.sources.map((src) =>
        src.id === sourceId
          ? {
              ...src,
              status,
              lastUpdated: new Date().toISOString(),
              eventCount: eventCount ?? src.eventCount,
              errorMessage: errorMessage ?? undefined,
            }
          : src
      ),
    }));
  },

  ingestSignals: (type, regionCounts) => {
    const { baselines } = get();
    const newBaselines = { ...baselines };
    const newAnomalies: AnomalyAlert[] = [];
    const now = new Date().toISOString();

    for (const { lat, lon, count } of regionCounts) {
      const key = regionKey(lat, lon);

      if (!newBaselines[key]) {
        newBaselines[key] = initRegionBaseline();
      }

      const baseline = newBaselines[key][type];

      // Only check for anomalies after we have enough data points (min 5)
      if (baseline.count >= 5) {
        const z = welfordZScore(baseline, count);
        const severity = zScoreToSeverity(z);

        if (severity) {
          const center = regionCenter(key);
          newAnomalies.push({
            id: generateId(),
            region: key,
            signalType: type,
            currentValue: count,
            baselineMean: baseline.mean,
            baselineStdDev: welfordStdDev(baseline),
            zScore: z,
            severity,
            message: `${type.toUpperCase()} anomaly in region [${key}]: ${count} events (baseline: ${baseline.mean.toFixed(1)} ± ${welfordStdDev(baseline).toFixed(1)}, z=${z.toFixed(2)})`,
            timestamp: now,
            coordinates: center,
          });
        }
      }

      // Update the baseline with the new value
      newBaselines[key] = {
        ...newBaselines[key],
        [type]: welfordUpdate(baseline, count),
      };
    }

    set((s) => ({
      baselines: newBaselines,
      anomalies: [...newAnomalies, ...s.anomalies].slice(0, 500),
    }));
  },

  detectConvergence: () => {
    const { anomalies } = get();
    const now = new Date().toISOString();

    // Group recent anomalies (last 30 min) by region
    const cutoff = Date.now() - 30 * 60 * 1000;
    const recent = anomalies.filter(
      (a) => new Date(a.timestamp).getTime() > cutoff
    );

    const regionMap = new Map<string, AnomalyAlert[]>();
    for (const a of recent) {
      const existing = regionMap.get(a.region) || [];
      existing.push(a);
      regionMap.set(a.region, existing);
    }

    const newConvergences: RegionalConvergence[] = [];

    for (const [region, alerts] of regionMap) {
      // Need at least 2 different signal types for convergence
      const signalTypes = new Set(alerts.map((a) => a.signalType));
      if (signalTypes.size < 2) continue;

      const signals = Array.from(signalTypes).map((type) => {
        const typeAlerts = alerts.filter((a) => a.signalType === type);
        const maxZ = Math.max(...typeAlerts.map((a) => Math.abs(a.zScore)));
        return { type, count: typeAlerts.length, zScore: maxZ };
      });

      // Convergence score: weighted sum of z-scores across signal types
      const convergenceScore = signals.reduce(
        (sum, s) => sum + s.zScore * s.count,
        0
      );

      let severity: "moderate" | "high" | "critical" = "moderate";
      if (convergenceScore >= 10 || signalTypes.size >= 4) severity = "critical";
      else if (convergenceScore >= 5 || signalTypes.size >= 3)
        severity = "high";

      newConvergences.push({
        region,
        coordinates: regionCenter(region),
        radiusKm: 500, // ~10° grid cell radius
        signals,
        convergenceScore,
        severity,
        timestamp: now,
      });
    }

    set({ convergences: newConvergences });
  },

  pruneAnomalies: (maxAgeMs = 60 * 60 * 1000) => {
    const cutoff = Date.now() - maxAgeMs;
    set((s) => ({
      anomalies: s.anomalies.filter(
        (a) => new Date(a.timestamp).getTime() > cutoff
      ),
    }));
  },

  clearAll: () =>
    set({
      anomalies: [],
      convergences: [],
      baselines: {},
      sources: DEFAULT_SOURCES.map((s) => ({ ...s })),
    }),
}));
