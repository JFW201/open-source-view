import React, { useEffect, useCallback } from "react";
import {
  RefreshCw,
  ExternalLink,
  Search,
  Filter,
} from "lucide-react";
import { useNewsStore } from "../../store/newsStore";
import { fetchAllFeeds } from "../../services/api/news";
import {
  NEWS_CATEGORY_LABELS,
  NEWS_CATEGORY_COLORS,
} from "../../constants/feeds";
import type { NewsCategory } from "../../types";
import { formatDistanceToNow } from "date-fns";
import clsx from "clsx";
import { ExportButton } from "./ExportButton";
import { exportNews } from "../../services/export";

const CATEGORIES: Array<NewsCategory | "all"> = [
  "all",
  "breaking",
  "geopolitical",
  "military",
  "cyber",
  "economic",
  "energy",
  "technology",
  "disaster",
  "space",
];

export const NewsFeed: React.FC = () => {
  const {
    filteredCategory,
    searchQuery,
    isLoading,
    lastUpdated,
    setItems,
    setFilteredCategory,
    setSearchQuery,
    setIsLoading,
    setLastUpdated,
    getFilteredItems,
  } = useNewsStore();

  const items = getFilteredItems();

  const loadFeeds = useCallback(async () => {
    setIsLoading(true);
    try {
      const newsItems = await fetchAllFeeds();
      setItems(newsItems);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error("Failed to fetch feeds:", err);
    } finally {
      setIsLoading(false);
    }
  }, [setItems, setIsLoading, setLastUpdated]);

  useEffect(() => {
    loadFeeds();
  }, [loadFeeds]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-waldorf-border">
        <h2 className="text-sm font-semibold">News Feed</h2>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-[10px] text-waldorf-text-dim">
              {formatDistanceToNow(new Date(lastUpdated), {
                addSuffix: true,
              })}
            </span>
          )}
          <ExportButton
            onExport={(format) => exportNews(items, format)}
            disabled={items.length === 0}
          />
          <button
            onClick={loadFeeds}
            disabled={isLoading}
            className="p-1 hover:bg-waldorf-surface-bright rounded transition-colors"
            title="Refresh feeds"
          >
            <RefreshCw
              size={14}
              className={clsx(
                "text-waldorf-text-dim",
                isLoading && "animate-spin"
              )}
            />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-2 border-b border-waldorf-border">
        <div className="relative">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-waldorf-text-dim"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search headlines..."
            className="w-full bg-waldorf-surface-bright border border-waldorf-border rounded pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-waldorf-accent"
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="px-4 py-2 border-b border-waldorf-border overflow-x-auto">
        <div className="flex gap-1.5 min-w-max">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilteredCategory(cat)}
              className={clsx(
                "px-2 py-0.5 rounded text-[10px] font-medium transition-colors whitespace-nowrap",
                filteredCategory === cat
                  ? "bg-waldorf-accent text-white"
                  : "bg-waldorf-surface-bright text-waldorf-text-dim hover:text-waldorf-text"
              )}
            >
              {cat === "all"
                ? "All"
                : NEWS_CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && items.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-waldorf-text-dim">
            <RefreshCw size={16} className="animate-spin mr-2" />
            Loading feeds...
          </div>
        ) : items.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-waldorf-text-dim">
            No articles found.
          </div>
        ) : (
          <div className="divide-y divide-waldorf-border/50">
            {items.slice(0, 200).map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 hover:bg-waldorf-surface-bright transition-colors group"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            NEWS_CATEGORY_COLORS[item.category] ?? "#71717a",
                        }}
                      />
                      <span className="text-[10px] text-waldorf-text-dim font-medium">
                        {item.source}
                      </span>
                      <span className="text-[10px] text-waldorf-text-dim">
                        {(() => {
                          try {
                            return formatDistanceToNow(
                              new Date(item.publishedAt),
                              { addSuffix: true }
                            );
                          } catch {
                            return "";
                          }
                        })()}
                      </span>
                    </div>
                    <h3 className="text-xs font-medium leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-[11px] text-waldorf-text-dim mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <ExternalLink
                    size={11}
                    className="text-waldorf-text-dim opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex-shrink-0"
                  />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-waldorf-border text-[10px] text-waldorf-text-dim text-center">
        {items.length} articles
        {filteredCategory !== "all" &&
          ` in ${NEWS_CATEGORY_LABELS[filteredCategory]}`}
      </div>
    </div>
  );
};
