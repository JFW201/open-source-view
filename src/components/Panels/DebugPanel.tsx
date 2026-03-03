import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Bug,
  Wifi,
  WifiOff,
  Database,
  HardDrive,
  Terminal,
  RefreshCw,
  Trash2,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";
import { useMapStore } from "../../store/mapStore";
import { useNewsStore } from "../../store/newsStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useSignalFusionStore } from "../../store/signalFusionStore";
import { useAlertStore } from "../../store/alertStore";
import { useAnnotationStore } from "../../store/annotationStore";
import { useTimelineStore } from "../../store/timelineStore";
import { cache, CACHE_TTL } from "../../services/cache";
import { proxyFetch } from "../../services/proxy";
import clsx from "clsx";

// ── Log Capture ──────────────────────────────────────────────────────────────

interface LogEntry {
  id: number;
  level: "error" | "warn" | "info";
  message: string;
  timestamp: string;
}

let logId = 0;
const logBuffer: LogEntry[] = [];
const logListeners = new Set<() => void>();

function pushLog(level: LogEntry["level"], args: unknown[]) {
  const message = args
    .map((a) =>
      typeof a === "string" ? a : a instanceof Error ? a.message : JSON.stringify(a)
    )
    .join(" ");
  logBuffer.push({
    id: ++logId,
    level,
    message,
    timestamp: new Date().toISOString(),
  });
  if (logBuffer.length > 500) logBuffer.shift();
  logListeners.forEach((fn) => fn());
}

// Intercept console methods once
if (!(window as any).__waldorf_debug_hooked__) {
  (window as any).__waldorf_debug_hooked__ = true;
  const origError = console.error;
  const origWarn = console.warn;
  const origInfo = console.info;

  console.error = (...args: unknown[]) => {
    pushLog("error", args);
    origError.apply(console, args);
  };
  console.warn = (...args: unknown[]) => {
    pushLog("warn", args);
    origWarn.apply(console, args);
  };
  console.info = (...args: unknown[]) => {
    pushLog("info", args);
    origInfo.apply(console, args);
  };
}

function useLogs() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const update = () => setTick((t) => t + 1);
    logListeners.add(update);
    return () => { logListeners.delete(update); };
  }, []);
  return logBuffer;
}

// ── Connection Test Endpoints ────────────────────────────────────────────────

interface ConnectionTest {
  name: string;
  url: string;
  keyRequired?: string;
}

const CONNECTION_TESTS: ConnectionTest[] = [
  { name: "CartoCDN (Map Tiles)", url: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" },
  { name: "GDELT API", url: "https://api.gdeltproject.org/api/v2/geo/geo?query=conflict&format=GeoJSON&maxrows=1" },
  { name: "NASA FIRMS", url: "https://firms.modaps.eosdis.nasa.gov/api/country/csv/OPEN/VIIRS_SNPP_NRT/USA/1/2024-01-01" },
  { name: "World Bank API", url: "https://api.worldbank.org/v2/country/US/indicator/NY.GDP.MKTP.CD?format=json&per_page=1" },
  { name: "Aviation Stack", url: "https://api.aviationstack.com/v1/flights?limit=1", keyRequired: "aviationstack" },
  { name: "OpenSky Network", url: "https://opensky-network.org/api/states/all?lamin=45&lamax=46&lomin=-1&lomax=0" },
  { name: "ACLED API", url: "https://api.acleddata.com/acled/read?limit=1", keyRequired: "acled" },
];

type TestResult = "pending" | "testing" | "success" | "error";

// ── Section Component ────────────────────────────────────────────────────────

const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, icon, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-waldorf-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-waldorf-surface-bright transition-colors"
      >
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        {icon}
        <span className="text-xs font-semibold flex-1 text-left">{title}</span>
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
};

// ── Main Panel ───────────────────────────────────────────────────────────────

export const DebugPanel: React.FC = () => {
  const logs = useLogs();
  const logEndRef = useRef<HTMLDivElement>(null);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [testLatencies, setTestLatencies] = useState<Record<string, number>>({});

  const hasApiKey = useSettingsStore((s) => s.hasApiKey);
  const getApiKey = useSettingsStore((s) => s.getApiKey);

  // Store data counts
  const aircraft = useMapStore((s) => s.aircraft);
  const vessels = useMapStore((s) => s.vessels);
  const gdeltEvents = useMapStore((s) => s.gdeltEvents);
  const acledEvents = useMapStore((s) => s.acledEvents);
  const firmsHotspots = useMapStore((s) => s.firmsHotspots);
  const layers = useMapStore((s) => s.layers);
  const newsItems = useNewsStore((s) => s.items);
  const sources = useSignalFusionStore((s) => s.sources);
  const anomalies = useSignalFusionStore((s) => s.anomalies);
  const convergences = useSignalFusionStore((s) => s.convergences);
  const alerts = useAlertStore((s) => s.alerts);
  const notifications = useAlertStore((s) => s.notifications);
  const annotations = useAnnotationStore((s) => s.annotations);
  const measurements = useAnnotationStore((s) => s.measurements);
  const timelineEvents = useTimelineStore((s) => s.events);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs.length]);

  // Connection tester
  const runConnectionTest = useCallback(
    async (test: ConnectionTest) => {
      setTestResults((r) => ({ ...r, [test.name]: "testing" }));
      const start = performance.now();
      try {
        let url = test.url;
        // Append API key if needed
        if (test.keyRequired) {
          const key = getApiKey(test.keyRequired);
          if (!key) {
            setTestResults((r) => ({ ...r, [test.name]: "error" }));
            setTestLatencies((l) => ({ ...l, [test.name]: -1 }));
            return;
          }
          if (test.keyRequired === "aviationstack") {
            url += `&access_key=${key}`;
          } else if (test.keyRequired === "acled") {
            const email = getApiKey("acled_email") || "";
            url += `&key=${key}&email=${encodeURIComponent(email)}`;
          }
        }
        const resp = await proxyFetch(url);
        const latency = Math.round(performance.now() - start);
        setTestLatencies((l) => ({ ...l, [test.name]: latency }));
        setTestResults((r) => ({
          ...r,
          [test.name]: resp.status < 400 ? "success" : "error",
        }));
      } catch {
        const latency = Math.round(performance.now() - start);
        setTestLatencies((l) => ({ ...l, [test.name]: latency }));
        setTestResults((r) => ({ ...r, [test.name]: "error" }));
      }
    },
    [getApiKey]
  );

  const runAllTests = useCallback(() => {
    for (const test of CONNECTION_TESTS) {
      runConnectionTest(test);
    }
  }, [runConnectionTest]);

  const clearLogs = useCallback(() => {
    logBuffer.length = 0;
    logListeners.forEach((fn) => fn());
  }, []);

  // System info
  const isTauri = !!(window as any).__TAURI_INTERNALS__;
  const memInfo = (performance as any).memory;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-waldorf-border">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Bug size={14} /> Debug & Diagnostics
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Connection Tester */}
        <Section
          title="Connection Tester"
          icon={<Wifi size={12} className="text-waldorf-accent" />}
          defaultOpen={true}
        >
          <div className="space-y-1.5 mb-2">
            {CONNECTION_TESTS.map((test) => {
              const result = testResults[test.name] || "pending";
              const latency = testLatencies[test.name];
              const needsKey = test.keyRequired && !hasApiKey(test.keyRequired);

              return (
                <div
                  key={test.name}
                  className="flex items-center justify-between py-1"
                >
                  <div className="flex items-center gap-2">
                    {result === "testing" && (
                      <Loader2 size={10} className="text-waldorf-accent animate-spin" />
                    )}
                    {result === "success" && (
                      <CheckCircle size={10} className="text-waldorf-success" />
                    )}
                    {result === "error" && (
                      <XCircle size={10} className="text-waldorf-danger" />
                    )}
                    {result === "pending" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-waldorf-text-dim/30" />
                    )}
                    <span className="text-[10px]">{test.name}</span>
                    {needsKey && (
                      <span className="text-[9px] text-waldorf-warning bg-waldorf-warning/10 px-1 rounded">
                        key missing
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-waldorf-text-dim font-mono">
                    {result === "success" && latency !== undefined && `${latency}ms`}
                    {result === "error" && latency === -1 && "no key"}
                    {result === "error" && latency !== undefined && latency >= 0 && `fail ${latency}ms`}
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={runAllTests}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-waldorf-accent/15 text-waldorf-accent text-[10px] font-medium rounded hover:bg-waldorf-accent/25 transition-colors"
          >
            <RefreshCw size={10} /> Test All Connections
          </button>
        </Section>

        {/* Store State */}
        <Section
          title="Store State"
          icon={<Database size={12} className="text-waldorf-accent" />}
        >
          <div className="space-y-1">
            {[
              { label: "Aircraft", count: aircraft.length },
              { label: "Vessels", count: vessels.length },
              { label: "GDELT Events", count: gdeltEvents.length },
              { label: "ACLED Events", count: acledEvents.length },
              { label: "FIRMS Hotspots", count: firmsHotspots.length },
              { label: "News Items", count: newsItems.length },
              { label: "Layer Configs", count: layers.length },
              { label: "Annotations", count: annotations.length },
              { label: "Measurements", count: measurements.length },
              { label: "Timeline Events", count: timelineEvents.length },
              { label: "Watchlist Alerts", count: alerts.length },
              { label: "Notifications", count: notifications.length },
              { label: "Signal Sources", count: sources.length },
              { label: "Anomalies", count: anomalies.length },
              { label: "Convergences", count: convergences.length },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-0.5"
              >
                <span className="text-[10px] text-waldorf-text-dim">
                  {item.label}
                </span>
                <span
                  className={clsx(
                    "text-[10px] font-mono",
                    item.count > 0 ? "text-waldorf-text" : "text-waldorf-text-dim"
                  )}
                >
                  {item.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Signal Source Health */}
        <Section
          title="Signal Source Health"
          icon={<HardDrive size={12} className="text-waldorf-accent" />}
        >
          <div className="space-y-1.5">
            {sources.map((src) => (
              <div
                key={src.id}
                className="flex items-center justify-between py-0.5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      "w-1.5 h-1.5 rounded-full",
                      src.status === "live" && "bg-waldorf-success",
                      src.status === "degraded" && "bg-waldorf-warning",
                      src.status === "stale" && "bg-yellow-600",
                      src.status === "offline" && "bg-waldorf-text-dim"
                    )}
                  />
                  <span className="text-[10px]">{src.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-waldorf-text-dim font-mono">
                  <span>{src.eventCount}</span>
                  <span
                    className={clsx(
                      "px-1 rounded text-[9px]",
                      src.status === "live" && "bg-waldorf-success/15 text-waldorf-success",
                      src.status === "degraded" && "bg-waldorf-warning/15 text-waldorf-warning",
                      src.status === "stale" && "bg-yellow-600/15 text-yellow-500",
                      src.status === "offline" && "bg-waldorf-text-dim/15 text-waldorf-text-dim"
                    )}
                  >
                    {src.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {sources.some((s) => s.errorMessage) && (
            <div className="mt-2 space-y-1">
              <div className="text-[10px] font-semibold text-waldorf-danger">
                Errors:
              </div>
              {sources
                .filter((s) => s.errorMessage)
                .map((s) => (
                  <div
                    key={s.id}
                    className="text-[9px] text-waldorf-danger/80 bg-waldorf-danger/5 px-2 py-1 rounded font-mono"
                  >
                    [{s.id}] {s.errorMessage}
                  </div>
                ))}
            </div>
          )}
        </Section>

        {/* Cache Inspector */}
        <Section
          title="Cache TTLs"
          icon={<Database size={12} className="text-waldorf-accent" />}
        >
          <div className="space-y-1">
            {Object.entries(CACHE_TTL).map(([key, ttl]) => (
              <div
                key={key}
                className="flex items-center justify-between py-0.5"
              >
                <span className="text-[10px] text-waldorf-text-dim">{key}</span>
                <span className="text-[10px] font-mono text-waldorf-text">
                  {ttl === Infinity
                    ? "∞"
                    : ttl >= 60000
                    ? `${ttl / 60000}m`
                    : `${ttl / 1000}s`}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Log Viewer */}
        <Section
          title={`Console Logs (${logs.length})`}
          icon={<Terminal size={12} className="text-waldorf-accent" />}
        >
          <div className="flex items-center justify-end mb-1.5">
            <button
              onClick={clearLogs}
              className="flex items-center gap-1 text-[10px] text-waldorf-text-dim hover:text-waldorf-danger transition-colors"
            >
              <Trash2 size={9} /> Clear
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto bg-waldorf-bg rounded border border-waldorf-border p-1.5 font-mono text-[9px] space-y-0.5">
            {logs.length === 0 && (
              <div className="text-waldorf-text-dim text-center py-4">
                No logs captured yet
              </div>
            )}
            {logs.map((log) => (
              <div
                key={log.id}
                className={clsx(
                  "flex gap-1.5 leading-tight",
                  log.level === "error" && "text-waldorf-danger",
                  log.level === "warn" && "text-waldorf-warning",
                  log.level === "info" && "text-waldorf-text-dim"
                )}
              >
                <span className="shrink-0 opacity-50">
                  {new Date(log.timestamp).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
                <span className="shrink-0 w-5 uppercase">
                  {log.level === "error" && (
                    <XCircle size={9} className="inline" />
                  )}
                  {log.level === "warn" && (
                    <AlertTriangle size={9} className="inline" />
                  )}
                  {log.level === "info" && (
                    <Info size={9} className="inline" />
                  )}
                </span>
                <span className="break-all">{log.message}</span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </Section>

        {/* System Info */}
        <Section
          title="System Info"
          icon={<Info size={12} className="text-waldorf-accent" />}
        >
          <div className="space-y-1">
            {[
              { label: "Runtime", value: isTauri ? "Tauri v2" : "Browser" },
              { label: "Platform", value: navigator.platform },
              { label: "User Agent", value: navigator.userAgent.slice(0, 80) + "..." },
              { label: "Language", value: navigator.language },
              { label: "Online", value: navigator.onLine ? "Yes" : "No" },
              { label: "Cores", value: String(navigator.hardwareConcurrency || "N/A") },
              ...(memInfo
                ? [
                    {
                      label: "JS Heap",
                      value: `${Math.round(memInfo.usedJSHeapSize / 1048576)}MB / ${Math.round(memInfo.jsHeapSizeLimit / 1048576)}MB`,
                    },
                  ]
                : []),
              { label: "Screen", value: `${screen.width}x${screen.height} @${devicePixelRatio}x` },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start justify-between py-0.5"
              >
                <span className="text-[10px] text-waldorf-text-dim shrink-0">
                  {item.label}
                </span>
                <span className="text-[10px] font-mono text-waldorf-text text-right ml-2 break-all">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
};
