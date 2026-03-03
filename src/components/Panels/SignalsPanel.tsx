import React from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Layers,
} from "lucide-react";
import { useSignalFusionStore } from "../../store/signalFusionStore";
import clsx from "clsx";

const STATUS_ICON: Record<string, React.ReactNode> = {
  live: <CheckCircle size={12} className="text-waldorf-success" />,
  degraded: <AlertTriangle size={12} className="text-yellow-400" />,
  offline: <XCircle size={12} className="text-waldorf-danger" />,
  stale: <Clock size={12} className="text-waldorf-text-dim" />,
};

const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  degraded: "Degraded",
  offline: "Offline",
  stale: "Stale",
};

const SEVERITY_COLORS: Record<string, string> = {
  elevated: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  high: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  critical: "text-red-400 bg-red-400/10 border-red-400/30",
  moderate: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
};

export const SignalsPanel: React.FC = () => {
  const sources = useSignalFusionStore((s) => s.sources);
  const anomalies = useSignalFusionStore((s) => s.anomalies);
  const convergences = useSignalFusionStore((s) => s.convergences);

  const liveCount = sources.filter((s) => s.status === "live").length;
  const degradedCount = sources.filter(
    (s) => s.status === "degraded" || s.status === "stale"
  ).length;
  const offlineCount = sources.filter((s) => s.status === "offline").length;

  // Show anomalies from the last hour
  const recentAnomalies = anomalies.filter(
    (a) => Date.now() - new Date(a.timestamp).getTime() < 60 * 60 * 1000
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-waldorf-border">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-waldorf-accent" />
          <h2 className="text-sm font-semibold">Signal Fusion</h2>
        </div>
        <p className="text-[10px] text-waldorf-text-dim mt-1">
          Multi-source anomaly detection & intelligence gap reporting
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Intelligence Gap Report */}
        <div className="p-3 border-b border-waldorf-border">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap size={12} className="text-waldorf-accent" />
            <span className="text-xs font-semibold">Data Source Status</span>
            <span className="ml-auto text-[10px] text-waldorf-text-dim">
              {liveCount} live | {degradedCount} warn | {offlineCount} off
            </span>
          </div>

          <div className="space-y-1.5">
            {sources.map((source) => (
              <div
                key={source.id}
                className="flex items-center gap-2 text-[11px] p-1.5 rounded bg-waldorf-bg/50"
              >
                {STATUS_ICON[source.status]}
                <span className="font-medium flex-1 truncate">
                  {source.name}
                </span>
                <span
                  className={clsx(
                    "text-[9px] px-1.5 py-0.5 rounded",
                    source.status === "live" && "bg-waldorf-success/20 text-waldorf-success",
                    source.status === "degraded" && "bg-yellow-400/20 text-yellow-400",
                    source.status === "offline" && "bg-waldorf-danger/20 text-waldorf-danger",
                    source.status === "stale" && "bg-gray-500/20 text-gray-400"
                  )}
                >
                  {STATUS_LABEL[source.status]}
                </span>
                {source.eventCount > 0 && (
                  <span className="text-[9px] text-waldorf-text-dim">
                    {source.eventCount.toLocaleString()}
                  </span>
                )}
              </div>
            ))}
          </div>

          {offlineCount > 0 && (
            <div className="mt-2 p-2 rounded bg-waldorf-danger/10 border border-waldorf-danger/20">
              <p className="text-[10px] text-waldorf-danger">
                <AlertTriangle size={10} className="inline mr-1" />
                {offlineCount} source{offlineCount > 1 ? "s" : ""} offline —
                intelligence coverage may have gaps. Check API keys in Settings.
              </p>
            </div>
          )}
        </div>

        {/* Regional Convergence */}
        {convergences.length > 0 && (
          <div className="p-3 border-b border-waldorf-border">
            <div className="flex items-center gap-1.5 mb-2">
              <Layers size={12} className="text-waldorf-accent" />
              <span className="text-xs font-semibold">
                Multi-Source Convergence
              </span>
              <span className="ml-auto text-[10px] text-waldorf-text-dim">
                {convergences.length} region{convergences.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-2">
              {convergences.map((c, i) => (
                <div
                  key={`${c.region}-${i}`}
                  className={clsx(
                    "p-2 rounded border text-[11px]",
                    SEVERITY_COLORS[c.severity]
                  )}
                >
                  <div className="font-semibold mb-1">
                    Region [{c.region}] — {c.severity.toUpperCase()}
                  </div>
                  <div className="text-[10px] opacity-80">
                    {c.signals.map((s) => `${s.type}(z=${s.zScore.toFixed(1)})`).join(", ")}
                  </div>
                  <div className="text-[10px] opacity-60 mt-0.5">
                    Convergence score: {c.convergenceScore.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Anomaly Alerts */}
        <div className="p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle size={12} className="text-waldorf-accent" />
            <span className="text-xs font-semibold">Anomaly Alerts</span>
            <span className="ml-auto text-[10px] text-waldorf-text-dim">
              {recentAnomalies.length} recent
            </span>
          </div>

          {recentAnomalies.length === 0 ? (
            <p className="text-[11px] text-waldorf-text-dim italic">
              No anomalies detected. Baselines are being established as data
              flows in. Alerts will appear when event counts deviate
              significantly from the rolling baseline.
            </p>
          ) : (
            <div className="space-y-1.5">
              {recentAnomalies.slice(0, 50).map((a) => (
                <div
                  key={a.id}
                  className={clsx(
                    "p-2 rounded border text-[11px]",
                    SEVERITY_COLORS[a.severity]
                  )}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold uppercase text-[9px]">
                      {a.severity} — {a.signalType}
                    </span>
                    <span className="text-[9px] opacity-60">
                      z={a.zScore.toFixed(2)}
                    </span>
                  </div>
                  <div className="opacity-80">{a.message}</div>
                  <div className="text-[9px] opacity-50 mt-0.5">
                    {new Date(a.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
