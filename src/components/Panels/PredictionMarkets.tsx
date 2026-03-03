import React, { useEffect, useCallback } from "react";
import { BarChart3, RefreshCw, TrendingUp } from "lucide-react";
import { useMarketStore } from "../../store/marketStore";
import { useSettingsStore } from "../../store/settingsStore";
import { fetchTrendingMarkets } from "../../services/api/kalshi";
import clsx from "clsx";

export const PredictionMarkets: React.FC = () => {
  const { kalshiMarkets, isLoadingKalshi, setKalshiMarkets, setIsLoadingKalshi } =
    useMarketStore();
  const hasApiKey = useSettingsStore((s) => s.hasApiKey);
  const getApiKey = useSettingsStore((s) => s.getApiKey);

  const loadMarkets = useCallback(async () => {
    const key = getApiKey("kalshi");
    if (!key) return;

    setIsLoadingKalshi(true);
    try {
      const data = await fetchTrendingMarkets(key);
      setKalshiMarkets(data);
    } catch (err) {
      console.error("Failed to fetch Kalshi markets:", err);
    } finally {
      setIsLoadingKalshi(false);
    }
  }, [getApiKey, setKalshiMarkets, setIsLoadingKalshi]);

  useEffect(() => {
    if (hasApiKey("kalshi")) {
      loadMarkets();
    }
  }, [hasApiKey, loadMarkets]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-waldorf-border">
        <h2 className="text-sm font-semibold">Prediction Markets</h2>
        <button
          onClick={loadMarkets}
          disabled={isLoadingKalshi || !hasApiKey("kalshi")}
          className="p-1 hover:bg-waldorf-surface-bright rounded transition-colors disabled:opacity-40"
        >
          <RefreshCw
            size={14}
            className={clsx(
              "text-waldorf-text-dim",
              isLoadingKalshi && "animate-spin"
            )}
          />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!hasApiKey("kalshi") ? (
          <div className="flex flex-col items-center justify-center h-full text-waldorf-text-dim gap-2 px-8 text-center">
            <BarChart3 size={24} className="opacity-40" />
            <p className="text-xs">
              Configure Kalshi API key in Settings to view prediction markets.
            </p>
          </div>
        ) : isLoadingKalshi && kalshiMarkets.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-waldorf-text-dim">
            <RefreshCw size={16} className="animate-spin mr-2" />
            Loading markets...
          </div>
        ) : kalshiMarkets.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-waldorf-text-dim">
            No prediction markets loaded.
          </div>
        ) : (
          <div className="divide-y divide-waldorf-border/50">
            {kalshiMarkets.map((market) => (
              <div
                key={market.id}
                className="px-4 py-3 hover:bg-waldorf-surface-bright transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-waldorf-accent font-medium mb-0.5">
                      {market.category}
                    </div>
                    <h3 className="text-xs leading-snug line-clamp-2">
                      {market.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-waldorf-text-dim">
                      <span>Vol: {market.volume.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-waldorf-text-dim">
                        YES
                      </span>
                      <span
                        className={clsx(
                          "text-sm font-mono font-bold",
                          market.yes_price > 0.6
                            ? "text-waldorf-success"
                            : market.yes_price < 0.4
                            ? "text-waldorf-danger"
                            : "text-waldorf-warning"
                        )}
                      >
                        {(market.yes_price * 100).toFixed(0)}¢
                      </span>
                    </div>
                    {/* Probability bar */}
                    <div className="w-16 h-1.5 bg-waldorf-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-waldorf-accent rounded-full"
                        style={{ width: `${market.yes_price * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
