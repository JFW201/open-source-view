import React, { useEffect, useCallback } from "react";
import { TrendingUp, TrendingDown, RefreshCw, Minus } from "lucide-react";
import { useMarketStore } from "../../store/marketStore";
import { useSettingsStore } from "../../store/settingsStore";
import { fetchAllMarketIndices } from "../../services/api/markets";
import clsx from "clsx";
import { ExportButton } from "./ExportButton";
import { exportMarkets } from "../../services/export";

export const MarketData: React.FC = () => {
  const { indices, isLoadingIndices, lastUpdated, setIndices, setIsLoadingIndices, setLastUpdated } =
    useMarketStore();
  const hasApiKey = useSettingsStore((s) => s.hasApiKey);
  const getApiKey = useSettingsStore((s) => s.getApiKey);

  const loadMarkets = useCallback(async () => {
    const key = getApiKey("alphavantage");
    if (!key) return;

    setIsLoadingIndices(true);
    try {
      const data = await fetchAllMarketIndices(key);
      setIndices(data);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error("Failed to fetch market data:", err);
    } finally {
      setIsLoadingIndices(false);
    }
  }, [getApiKey, setIndices, setIsLoadingIndices, setLastUpdated]);

  useEffect(() => {
    if (hasApiKey("alphavantage")) {
      loadMarkets();
    }
  }, [hasApiKey, loadMarkets]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-waldorf-border">
        <h2 className="text-sm font-semibold">Markets</h2>
        <div className="flex items-center gap-2">
          <ExportButton
            onExport={(format) => exportMarkets(indices, format)}
            disabled={indices.length === 0}
          />
          <button
            onClick={loadMarkets}
            disabled={isLoadingIndices || !hasApiKey("alphavantage")}
            className="p-1 hover:bg-waldorf-surface-bright rounded transition-colors disabled:opacity-40"
            title="Refresh market data"
          >
            <RefreshCw
              size={14}
              className={clsx(
                "text-waldorf-text-dim",
                isLoadingIndices && "animate-spin"
              )}
            />
          </button>
        </div>
      </div>

      {/* Market indices */}
      <div className="flex-1 overflow-y-auto">
        {!hasApiKey("alphavantage") ? (
          <div className="flex flex-col items-center justify-center h-full text-waldorf-text-dim gap-2 px-8 text-center">
            <TrendingUp size={24} className="opacity-40" />
            <p className="text-xs">
              Configure Alpha Vantage API key in Settings to view live market
              data.
            </p>
          </div>
        ) : indices.length === 0 && !isLoadingIndices ? (
          <div className="flex items-center justify-center h-32 text-sm text-waldorf-text-dim">
            No market data loaded.
          </div>
        ) : isLoadingIndices && indices.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-waldorf-text-dim">
            <RefreshCw size={16} className="animate-spin mr-2" />
            Loading markets...
          </div>
        ) : (
          <div className="divide-y divide-waldorf-border/50">
            {indices.map((idx) => {
              const isUp = idx.change > 0;
              const isDown = idx.change < 0;
              const isFlat = idx.change === 0;

              return (
                <div
                  key={idx.symbol}
                  className="px-4 py-3 hover:bg-waldorf-surface-bright transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold font-mono">
                        {idx.symbol}
                      </div>
                      <div className="text-[10px] text-waldorf-text-dim">
                        {idx.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-semibold">
                        ${idx.price.toFixed(2)}
                      </div>
                      <div
                        className={clsx(
                          "text-[10px] font-mono flex items-center gap-0.5 justify-end",
                          isUp && "text-waldorf-success",
                          isDown && "text-waldorf-danger",
                          isFlat && "text-waldorf-text-dim"
                        )}
                      >
                        {isUp ? (
                          <TrendingUp size={10} />
                        ) : isDown ? (
                          <TrendingDown size={10} />
                        ) : (
                          <Minus size={10} />
                        )}
                        {isUp ? "+" : ""}
                        {idx.change.toFixed(2)} ({isUp ? "+" : ""}
                        {idx.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {lastUpdated && (
        <div className="px-4 py-2 border-t border-waldorf-border text-[10px] text-waldorf-text-dim text-center">
          Last updated: {new Date(lastUpdated).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};
