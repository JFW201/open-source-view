import React, { useCallback, useState } from "react";
import {
  X,
  MapPin,
  Users,
  Building,
  Globe2,
  Sparkles,
  Loader2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Briefcase,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react";
import { useMapStore } from "../../store/mapStore";
import { useNewsStore } from "../../store/newsStore";
import { useSettingsStore } from "../../store/settingsStore";
import { usePanelStore } from "../../store/panelStore";
import { generateCountryBrief } from "../../services/api/grok";
import { useEconomicIndicators } from "../../hooks/useEconomicIndicators";
import type { GrokSummary } from "../../types";

export const CountryDetail: React.FC = () => {
  const selectedCountry = useMapStore((s) => s.selectedCountry);
  const setSelectedCountry = useMapStore((s) => s.setSelectedCountry);
  const newsItems = useNewsStore((s) => s.items);
  const { setActivePanel } = usePanelStore();
  const hasApiKey = useSettingsStore((s) => s.hasApiKey);
  const getApiKey = useSettingsStore((s) => s.getApiKey);

  const [brief, setBrief] = useState<GrokSummary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { indicators, isLoading: isLoadingEcon, refetch: refetchEcon } =
    useEconomicIndicators(selectedCountry?.code ?? null);

  const handleClose = useCallback(() => {
    setSelectedCountry(null);
    setActivePanel("news");
  }, [setSelectedCountry, setActivePanel]);

  const handleGenerateBrief = useCallback(async () => {
    if (!selectedCountry || !hasApiKey("xai")) return;
    const key = getApiKey("xai");
    if (!key) return;

    setIsGenerating(true);
    try {
      const countryNews = newsItems
        .filter(
          (n) =>
            n.title.toLowerCase().includes(selectedCountry.name.toLowerCase()) ||
            n.description
              .toLowerCase()
              .includes(selectedCountry.name.toLowerCase())
        )
        .slice(0, 20)
        .map((n) => n.title);

      // If we don't have country-specific news, use recent headlines
      const headlines =
        countryNews.length > 3
          ? countryNews
          : newsItems.slice(0, 20).map((n) => n.title);

      const result = await generateCountryBrief(
        key,
        selectedCountry.name,
        headlines
      );
      setBrief(result);
    } catch (err) {
      console.error("Failed to generate brief:", err);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedCountry, hasApiKey, getApiKey, newsItems]);

  if (!selectedCountry) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-waldorf-text-dim gap-2 px-8 text-center">
        <MapPin size={24} className="opacity-40" />
        <p className="text-sm">Click a location on the map to view country intelligence.</p>
      </div>
    );
  }

  const c = selectedCountry;
  const relatedNews = newsItems.filter(
    (n) =>
      n.title.toLowerCase().includes(c.name.toLowerCase()) ||
      n.description.toLowerCase().includes(c.name.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-waldorf-border">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getFlagEmoji(c.code)}</span>
          <div>
            <h2 className="text-sm font-semibold">{c.name}</h2>
            <p className="text-[10px] text-waldorf-text-dim">
              {c.subregion} — {c.region}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-waldorf-surface-bright rounded transition-colors"
        >
          <X size={14} className="text-waldorf-text-dim" />
        </button>
      </div>

      {/* Country info */}
      <div className="px-4 py-3 space-y-2 border-b border-waldorf-border">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-waldorf-text-dim">
            <Building size={12} />
            <span>Capital:</span>
            <span className="text-waldorf-text">{c.capital}</span>
          </div>
          <div className="flex items-center gap-1.5 text-waldorf-text-dim">
            <Users size={12} />
            <span>Pop:</span>
            <span className="text-waldorf-text">
              {(c.population / 1e6).toFixed(1)}M
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-waldorf-text-dim">
            <Globe2 size={12} />
            <span>Currency:</span>
            <span className="text-waldorf-text">
              {c.currencies.join(", ")}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-waldorf-text-dim">
            <MapPin size={12} />
            <span>Coords:</span>
            <span className="text-waldorf-text font-mono text-[10px]">
              {c.latitude.toFixed(2)}, {c.longitude.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Economic Indicators */}
      <div className="px-4 py-3 border-b border-waldorf-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-waldorf-text-dim flex items-center gap-1.5">
            <BarChart3 size={12} /> Economic Indicators
          </h3>
          <button
            onClick={refetchEcon}
            disabled={isLoadingEcon}
            className="p-0.5 hover:bg-waldorf-surface-bright rounded transition-colors"
            title="Refresh indicators"
          >
            <RefreshCw
              size={10}
              className={`text-waldorf-text-dim ${isLoadingEcon ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {isLoadingEcon ? (
          <div className="flex items-center gap-1.5 text-[10px] text-waldorf-text-dim">
            <Loader2 size={10} className="animate-spin" />
            Loading World Bank data...
          </div>
        ) : indicators ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            {indicators.gdp && (
              <div className="flex items-center gap-1.5 text-xs">
                <DollarSign size={10} className="text-waldorf-text-dim flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-waldorf-text-dim">GDP</div>
                  <div className="text-waldorf-text font-mono text-[11px]">
                    ${indicators.gdp.value >= 1e12
                      ? `${(indicators.gdp.value / 1e12).toFixed(2)}T`
                      : indicators.gdp.value >= 1e9
                        ? `${(indicators.gdp.value / 1e9).toFixed(1)}B`
                        : `${(indicators.gdp.value / 1e6).toFixed(0)}M`}
                    <span className="text-[9px] text-waldorf-text-dim ml-0.5">
                      ({indicators.gdp.year})
                    </span>
                  </div>
                </div>
              </div>
            )}
            {indicators.gdpGrowth && (
              <div className="flex items-center gap-1.5 text-xs">
                {indicators.gdpGrowth.value >= 0 ? (
                  <TrendingUp size={10} className="text-waldorf-success flex-shrink-0" />
                ) : (
                  <TrendingDown size={10} className="text-waldorf-danger flex-shrink-0" />
                )}
                <div>
                  <div className="text-[10px] text-waldorf-text-dim">GDP Growth</div>
                  <div
                    className={`font-mono text-[11px] ${
                      indicators.gdpGrowth.value >= 0
                        ? "text-waldorf-success"
                        : "text-waldorf-danger"
                    }`}
                  >
                    {indicators.gdpGrowth.value >= 0 ? "+" : ""}
                    {indicators.gdpGrowth.value.toFixed(1)}%
                    <span className="text-[9px] text-waldorf-text-dim ml-0.5">
                      ({indicators.gdpGrowth.year})
                    </span>
                  </div>
                </div>
              </div>
            )}
            {indicators.inflation && (
              <div className="flex items-center gap-1.5 text-xs">
                <ArrowUpDown size={10} className="text-waldorf-warning flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-waldorf-text-dim">Inflation</div>
                  <div className="text-waldorf-text font-mono text-[11px]">
                    {indicators.inflation.value.toFixed(1)}%
                    <span className="text-[9px] text-waldorf-text-dim ml-0.5">
                      ({indicators.inflation.year})
                    </span>
                  </div>
                </div>
              </div>
            )}
            {indicators.unemployment && (
              <div className="flex items-center gap-1.5 text-xs">
                <Briefcase size={10} className="text-waldorf-text-dim flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-waldorf-text-dim">Unemployment</div>
                  <div className="text-waldorf-text font-mono text-[11px]">
                    {indicators.unemployment.value.toFixed(1)}%
                    <span className="text-[9px] text-waldorf-text-dim ml-0.5">
                      ({indicators.unemployment.year})
                    </span>
                  </div>
                </div>
              </div>
            )}
            {indicators.tradeBalance && (
              <div className="flex items-center gap-1.5 text-xs">
                <DollarSign size={10} className="text-waldorf-text-dim flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-waldorf-text-dim">Trade Balance</div>
                  <div
                    className={`font-mono text-[11px] ${
                      indicators.tradeBalance.value >= 0
                        ? "text-waldorf-success"
                        : "text-waldorf-danger"
                    }`}
                  >
                    {indicators.tradeBalance.value >= 0 ? "+" : ""}$
                    {Math.abs(indicators.tradeBalance.value) >= 1e9
                      ? `${(indicators.tradeBalance.value / 1e9).toFixed(1)}B`
                      : `${(indicators.tradeBalance.value / 1e6).toFixed(0)}M`}
                    <span className="text-[9px] text-waldorf-text-dim ml-0.5">
                      ({indicators.tradeBalance.year})
                    </span>
                  </div>
                </div>
              </div>
            )}
            {indicators.populationGrowth && (
              <div className="flex items-center gap-1.5 text-xs">
                <Users size={10} className="text-waldorf-text-dim flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-waldorf-text-dim">Pop Growth</div>
                  <div className="text-waldorf-text font-mono text-[11px]">
                    {indicators.populationGrowth.value >= 0 ? "+" : ""}
                    {indicators.populationGrowth.value.toFixed(2)}%
                    <span className="text-[9px] text-waldorf-text-dim ml-0.5">
                      ({indicators.populationGrowth.year})
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-[10px] text-waldorf-text-dim">
            No economic data available for this country.
          </p>
        )}
        {indicators && (
          <div className="mt-1.5 text-[9px] text-waldorf-text-dim">
            Source: World Bank Open Data
          </div>
        )}
      </div>

      {/* AI Brief */}
      <div className="px-4 py-3 border-b border-waldorf-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-waldorf-accent flex items-center gap-1.5">
            <Sparkles size={12} /> Grok Intelligence Brief
          </h3>
          <button
            onClick={handleGenerateBrief}
            disabled={isGenerating || !hasApiKey("xai")}
            className="text-[10px] px-2 py-0.5 bg-waldorf-accent/20 text-waldorf-accent rounded hover:bg-waldorf-accent/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <Loader2 size={10} className="animate-spin inline mr-1" />
            ) : null}
            {isGenerating ? "Generating..." : "Generate Brief"}
          </button>
        </div>

        {!hasApiKey("xai") && (
          <p className="text-[10px] text-waldorf-warning">
            Configure xAI API key in Settings to enable AI briefs.
          </p>
        )}

        {brief && (
          <div className="space-y-2">
            <p className="text-xs leading-relaxed text-waldorf-text">
              {brief.summary}
            </p>
            {brief.key_points.length > 0 && (
              <ul className="space-y-1">
                {brief.key_points.map((point, i) => (
                  <li
                    key={i}
                    className="text-[11px] text-waldorf-text-dim flex items-start gap-1.5"
                  >
                    <span className="text-waldorf-accent mt-0.5">·</span>
                    {point}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center gap-3 text-[10px] text-waldorf-text-dim">
              <span>
                Sentiment:{" "}
                <span
                  className={
                    brief.sentiment === "positive"
                      ? "text-waldorf-success"
                      : brief.sentiment === "negative"
                      ? "text-waldorf-danger"
                      : "text-waldorf-text-dim"
                  }
                >
                  {brief.sentiment}
                </span>
              </span>
              <span>Confidence: {(brief.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Related news */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2">
          <h3 className="text-xs font-semibold text-waldorf-text-dim mb-2">
            Related News ({relatedNews.length})
          </h3>
        </div>
        {relatedNews.length > 0 ? (
          <div className="divide-y divide-waldorf-border/50">
            {relatedNews.slice(0, 30).map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 hover:bg-waldorf-surface-bright transition-colors"
              >
                <div className="text-[10px] text-waldorf-text-dim mb-0.5">
                  {item.source}
                </div>
                <div className="text-xs leading-snug line-clamp-2">
                  {item.title}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="px-4 text-xs text-waldorf-text-dim">
            No recent news found for {c.name}.
          </div>
        )}
      </div>
    </div>
  );
};

function getFlagEmoji(countryCode: string): string {
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return "";
  }
}
