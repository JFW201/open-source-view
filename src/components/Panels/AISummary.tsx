import React, { useCallback, useState } from "react";
import { Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { useNewsStore } from "../../store/newsStore";
import { useSettingsStore } from "../../store/settingsStore";
import { generateNewsSummary } from "../../services/api/grok";
import type { GrokSummary } from "../../types";
import clsx from "clsx";
import { ExportButton } from "./ExportButton";
import { exportAISummary } from "../../services/export";

export const AISummary: React.FC = () => {
  const newsItems = useNewsStore((s) => s.items);
  const hasApiKey = useSettingsStore((s) => s.hasApiKey);
  const getApiKey = useSettingsStore((s) => s.getApiKey);

  const [summary, setSummary] = useState<GrokSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    const key = getApiKey("xai");
    if (!key) return;

    setIsLoading(true);
    setError(null);
    try {
      const headlines = newsItems.slice(0, 30).map((n) => n.title);
      if (headlines.length === 0) {
        setError("No news items available. Load news feeds first.");
        return;
      }

      const result = await generateNewsSummary(key, { headlines });
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate summary");
    } finally {
      setIsLoading(false);
    }
  }, [getApiKey, newsItems]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-waldorf-border">
        <h2 className="text-sm font-semibold flex items-center gap-1.5">
          <Sparkles size={14} className="text-waldorf-accent" />
          Grok Intelligence Brief
        </h2>
        <div className="flex items-center gap-2">
          <ExportButton
            onExport={(format) => summary && exportAISummary(summary, format)}
            disabled={!summary}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !hasApiKey("xai") || newsItems.length === 0}
            className="text-[10px] px-2.5 py-1 bg-waldorf-accent/20 text-waldorf-accent rounded hover:bg-waldorf-accent/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            {isLoading ? (
              <Loader2 size={10} className="animate-spin" />
            ) : (
              <RefreshCw size={10} />
            )}
            {isLoading ? "Generating..." : "Generate Brief"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {!hasApiKey("xai") ? (
          <div className="flex flex-col items-center justify-center h-full text-waldorf-text-dim gap-2 text-center">
            <Sparkles size={24} className="opacity-40" />
            <p className="text-xs">
              Configure your xAI API key in Settings to generate Grok-powered
              intelligence briefs.
            </p>
            <p className="text-[10px] mt-1">
              Grok provides unbiased summaries of incoming news and geopolitical
              developments.
            </p>
          </div>
        ) : !summary && !isLoading && !error ? (
          <div className="flex flex-col items-center justify-center h-full text-waldorf-text-dim gap-2 text-center">
            <Sparkles size={24} className="opacity-40" />
            <p className="text-xs">
              Click "Generate Brief" to create an AI-powered summary of the
              latest headlines.
            </p>
          </div>
        ) : error ? (
          <div className="bg-waldorf-danger/10 border border-waldorf-danger/30 rounded-lg p-3 text-xs text-waldorf-danger">
            {error}
          </div>
        ) : summary ? (
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-waldorf-surface-bright rounded-lg p-4 border border-waldorf-border">
              <h3 className="text-[10px] font-semibold text-waldorf-accent uppercase tracking-wider mb-2">
                Executive Summary
              </h3>
              <p className="text-sm leading-relaxed">{summary.summary}</p>
            </div>

            {/* Key points */}
            {summary.key_points.length > 0 && (
              <div>
                <h3 className="text-[10px] font-semibold text-waldorf-accent uppercase tracking-wider mb-2">
                  Key Intelligence Points
                </h3>
                <ul className="space-y-2">
                  {summary.key_points.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 bg-waldorf-surface-bright rounded p-2.5 border border-waldorf-border"
                    >
                      <span className="text-waldorf-accent font-mono text-xs font-bold mt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-xs leading-relaxed">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center justify-between text-[10px] text-waldorf-text-dim border-t border-waldorf-border pt-3">
              <div className="flex items-center gap-3">
                <span>
                  Sentiment:{" "}
                  <span
                    className={clsx(
                      "font-medium",
                      summary.sentiment === "positive" && "text-waldorf-success",
                      summary.sentiment === "negative" && "text-waldorf-danger",
                      summary.sentiment === "mixed" && "text-waldorf-warning",
                      summary.sentiment === "neutral" && "text-waldorf-text-dim"
                    )}
                  >
                    {summary.sentiment}
                  </span>
                </span>
                <span>
                  Confidence: {(summary.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <span>
                {new Date(summary.generated_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
