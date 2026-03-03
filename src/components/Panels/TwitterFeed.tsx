import React, { useEffect, useCallback } from "react";
import { Twitter, RefreshCw, Heart, Repeat2, ExternalLink } from "lucide-react";
import { useNewsStore } from "../../store/newsStore";
import { useSettingsStore } from "../../store/settingsStore";
import { fetchOSINTTweets } from "../../services/api/twitter";
import { formatDistanceToNow } from "date-fns";
import clsx from "clsx";

export const TwitterFeed: React.FC = () => {
  const { tweets, isLoadingTweets, setTweets, setIsLoadingTweets } =
    useNewsStore();
  const hasApiKey = useSettingsStore((s) => s.hasApiKey);
  const getApiKey = useSettingsStore((s) => s.getApiKey);

  const loadTweets = useCallback(async () => {
    const key = getApiKey("twitter");
    if (!key) return;

    setIsLoadingTweets(true);
    try {
      const data = await fetchOSINTTweets(key);
      setTweets(data);
    } catch (err) {
      console.error("Failed to fetch tweets:", err);
    } finally {
      setIsLoadingTweets(false);
    }
  }, [getApiKey, setTweets, setIsLoadingTweets]);

  useEffect(() => {
    if (hasApiKey("twitter")) {
      loadTweets();
    }
  }, [hasApiKey, loadTweets]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-waldorf-border">
        <h2 className="text-sm font-semibold">X / OSINT Feed</h2>
        <button
          onClick={loadTweets}
          disabled={isLoadingTweets || !hasApiKey("twitter")}
          className="p-1 hover:bg-waldorf-surface-bright rounded transition-colors disabled:opacity-40"
        >
          <RefreshCw
            size={14}
            className={clsx(
              "text-waldorf-text-dim",
              isLoadingTweets && "animate-spin"
            )}
          />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!hasApiKey("twitter") ? (
          <div className="flex flex-col items-center justify-center h-full text-waldorf-text-dim gap-2 px-8 text-center">
            <Twitter size={24} className="opacity-40" />
            <p className="text-xs">
              Configure X / Twitter API key in Settings to view OSINT tweets.
            </p>
          </div>
        ) : isLoadingTweets && tweets.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-waldorf-text-dim">
            <RefreshCw size={16} className="animate-spin mr-2" />
            Loading tweets...
          </div>
        ) : tweets.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-waldorf-text-dim">
            No tweets loaded.
          </div>
        ) : (
          <div className="divide-y divide-waldorf-border/50">
            {tweets.map((tweet) => (
              <a
                key={tweet.id}
                href={tweet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 hover:bg-waldorf-surface-bright transition-colors group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-waldorf-surface-bright flex items-center justify-center text-[10px] font-bold text-waldorf-accent">
                    {tweet.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold">
                      {tweet.author}
                    </span>
                    <span className="text-[10px] text-waldorf-text-dim ml-1.5">
                      @{tweet.author_handle}
                    </span>
                  </div>
                  <span className="text-[10px] text-waldorf-text-dim">
                    {(() => {
                      try {
                        return formatDistanceToNow(
                          new Date(tweet.created_at),
                          { addSuffix: true }
                        );
                      } catch {
                        return "";
                      }
                    })()}
                  </span>
                </div>

                <p className="text-xs leading-relaxed mb-2">{tweet.text}</p>

                <div className="flex items-center gap-4 text-[10px] text-waldorf-text-dim">
                  <span className="flex items-center gap-1">
                    <Repeat2 size={10} />
                    {tweet.retweet_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart size={10} />
                    {tweet.like_count}
                  </span>
                  <ExternalLink
                    size={10}
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
