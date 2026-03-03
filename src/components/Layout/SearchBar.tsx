import React, { useEffect, useRef, useCallback } from "react";
import {
  Search,
  Sparkles,
  MapPin,
  Newspaper,
  Shield,
  Building2,
  Zap,
  Cable,
  AlertTriangle,
  X,
  Loader2,
} from "lucide-react";
import { useSearchStore } from "../../store/searchStore";
import { useMapStore } from "../../store/mapStore";
import { useNewsStore } from "../../store/newsStore";
import { useSettingsStore } from "../../store/settingsStore";
import { usePanelStore } from "../../store/panelStore";
import { searchAll, isQuestionQuery } from "../../services/search";
import { proxyFetchJSON } from "../../services/proxy";
import { COUNTRIES } from "../../data/countries";
import { MILITARY_BASES } from "../../data/militaryBases";
import { DATA_CENTERS } from "../../data/dataCenters";
import { NUCLEAR_FACILITIES } from "../../data/nuclearFacilities";
import { UNDERSEA_CABLES } from "../../data/underseaCables";
import { CONFLICT_ZONES } from "../../data/conflictZones";
import type { SearchResult, SearchResultType, Country } from "../../types";
import clsx from "clsx";

const TYPE_ICONS: Record<SearchResultType, React.ReactNode> = {
  country: <MapPin size={12} />,
  news: <Newspaper size={12} />,
  military: <Shield size={12} />,
  datacenter: <Building2 size={12} />,
  nuclear: <Zap size={12} />,
  cable: <Cable size={12} />,
  conflict: <AlertTriangle size={12} />,
  ai: <Sparkles size={12} />,
};

const TYPE_COLORS: Record<SearchResultType, string> = {
  country: "text-waldorf-accent",
  news: "text-waldorf-warning",
  military: "text-waldorf-danger",
  datacenter: "text-blue-400",
  nuclear: "text-amber-400",
  cable: "text-purple-400",
  conflict: "text-red-400",
  ai: "text-waldorf-accent",
};

const TYPE_LABELS: Record<SearchResultType, string> = {
  country: "Country",
  news: "News",
  military: "Military",
  datacenter: "Data Center",
  nuclear: "Nuclear",
  cable: "Cable",
  conflict: "Conflict",
  ai: "AI",
};

export const SearchBar: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const {
    query, results, isOpen, isLoading, isAIEnabled, aiResult,
    selectedIndex, setQuery, setResults, setIsOpen, setIsLoading,
    toggleAI, setAIResult, setSelectedIndex, clear,
  } = useSearchStore();

  const newsItems = useNewsStore((s) => s.items);
  const flyTo = useMapStore((s) => s.flyTo);
  const setSelectedCountry = useMapStore((s) => s.setSelectedCountry);
  const setActivePanel = usePanelStore((s) => s.setActivePanel);
  const hasApiKey = useSettingsStore((s) => s.hasApiKey);
  const getApiKey = useSettingsStore((s) => s.getApiKey);

  // Keyboard shortcut: Cmd+K / Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === "Escape" && isOpen) {
        clear();
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, clear, setIsOpen]);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setIsOpen]);

  // Debounced search
  const performSearch = useCallback(
    (q: string) => {
      clearTimeout(debounceRef.current);
      if (q.trim().length < 2) {
        setResults([]);
        setAIResult(null);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        // Text search
        const textResults = searchAll(q, {
          countries: COUNTRIES,
          newsItems,
          militaryBases: MILITARY_BASES,
          dataCenters: DATA_CENTERS,
          nuclearFacilities: NUCLEAR_FACILITIES,
          underseaCables: UNDERSEA_CABLES,
          conflictZones: CONFLICT_ZONES,
        });
        setResults(textResults);

        // AI search (if enabled and query looks like a question)
        if (isAIEnabled && hasApiKey("xai") && isQuestionQuery(q)) {
          setIsLoading(true);
          try {
            const key = getApiKey("xai")!;
            const body = JSON.stringify({
              model: "grok-3",
              messages: [
                {
                  role: "system",
                  content:
                    "You are Waldorf OSINT search assistant. Answer the user's intelligence question concisely in 2-3 sentences. Be factual and neutral.",
                },
                { role: "user", content: q },
              ],
              temperature: 0.3,
              max_tokens: 300,
            });

            const data = await proxyFetchJSON<any>(
              "https://api.x.ai/v1/chat/completions",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${key}`,
                  "Content-Type": "application/json",
                },
                body,
              }
            );

            const answer = data?.choices?.[0]?.message?.content ?? null;
            setAIResult(answer);
          } catch {
            setAIResult(null);
          } finally {
            setIsLoading(false);
          }
        }
      }, 300);
    },
    [newsItems, isAIEnabled, hasApiKey, getApiKey, setResults, setAIResult, setIsLoading]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);
    performSearch(val);
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.coordinates) {
      flyTo(result.coordinates[0], result.coordinates[1], result.type === "country" ? 5 : 8);
    }

    if (result.type === "country" && result.data) {
      setSelectedCountry(result.data as Country);
      setActivePanel("country");
    } else if (result.type === "news") {
      setActivePanel("news");
    }

    clear();
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const total = results.length + (aiResult ? 1 : 0);
    if (!isOpen || total === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(Math.min(selectedIndex + 1, total - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(Math.max(selectedIndex - 1, -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const aiOffset = aiResult ? 1 : 0;
      if (selectedIndex >= aiOffset && results[selectedIndex - aiOffset]) {
        handleResultClick(results[selectedIndex - aiOffset]);
      }
    }
  };

  const showDropdown = isOpen && (results.length > 0 || aiResult || isLoading || query.length >= 2);

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md mx-4">
      <div className="relative">
        <Search
          size={13}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-waldorf-text-dim"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search countries, news, bases, facilities...  ⌘K"
          className="w-full bg-waldorf-surface-bright border border-waldorf-border rounded-md pl-8 pr-20 py-1.5 text-xs focus:outline-none focus:border-waldorf-accent transition-colors"
        />
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {hasApiKey("xai") && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleAI();
                if (query.length >= 2) performSearch(query);
              }}
              className={clsx(
                "px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors flex items-center gap-0.5",
                isAIEnabled
                  ? "bg-waldorf-accent/20 text-waldorf-accent"
                  : "bg-waldorf-surface text-waldorf-text-dim hover:text-waldorf-text"
              )}
              title={isAIEnabled ? "AI search enabled" : "Enable AI search (Grok)"}
            >
              <Sparkles size={9} />
              AI
            </button>
          )}
          {query && (
            <button
              onClick={() => { clear(); inputRef.current?.focus(); }}
              className="p-0.5 text-waldorf-text-dim hover:text-waldorf-text"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Results dropdown */}
      {showDropdown && (
        <div className="absolute top-full mt-1 w-full bg-waldorf-surface border border-waldorf-border rounded-lg shadow-2xl overflow-hidden z-[100] max-h-[420px] overflow-y-auto">
          {/* AI result */}
          {aiResult && (
            <div
              className={clsx(
                "px-3 py-2.5 border-b border-waldorf-border",
                selectedIndex === 0 ? "bg-waldorf-accent/10" : "bg-waldorf-surface-bright"
              )}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles size={11} className="text-waldorf-accent" />
                <span className="text-[10px] font-semibold text-waldorf-accent">
                  Grok AI
                </span>
              </div>
              <p className="text-xs leading-relaxed text-waldorf-text">
                {aiResult}
              </p>
            </div>
          )}

          {isLoading && !aiResult && (
            <div className="px-3 py-2.5 border-b border-waldorf-border bg-waldorf-surface-bright flex items-center gap-2 text-xs text-waldorf-text-dim">
              <Loader2 size={12} className="animate-spin text-waldorf-accent" />
              Asking Grok...
            </div>
          )}

          {/* Text results */}
          {results.length > 0 ? (
            results.map((result, i) => {
              const idx = i + (aiResult ? 1 : 0);
              return (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={clsx(
                    "w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors",
                    selectedIndex === idx
                      ? "bg-waldorf-accent/10"
                      : "hover:bg-waldorf-surface-bright"
                  )}
                >
                  <span className={clsx("flex-shrink-0", TYPE_COLORS[result.type])}>
                    {TYPE_ICONS[result.type]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{result.title}</div>
                    <div className="text-[10px] text-waldorf-text-dim truncate">
                      {result.subtitle}
                    </div>
                  </div>
                  <span className="text-[9px] text-waldorf-text-dim flex-shrink-0 px-1.5 py-0.5 bg-waldorf-surface-bright rounded">
                    {TYPE_LABELS[result.type]}
                  </span>
                </button>
              );
            })
          ) : !isLoading && !aiResult && query.length >= 2 ? (
            <div className="px-3 py-4 text-center text-xs text-waldorf-text-dim">
              No results for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
