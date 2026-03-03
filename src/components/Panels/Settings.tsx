import React, { useState } from "react";
import {
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  Save,
  Check,
  Globe2,
  Clock,
  Bell,
} from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";
import { API_KEY_CONFIGS } from "../../constants/layers";
import clsx from "clsx";

export const Settings: React.FC = () => {
  const { settings, setApiKey, removeApiKey, hasApiKey, setMapStyle, setRefreshInterval, setEnableNotifications } =
    useSettingsStore();

  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState("");
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const toggleKeyVisibility = (service: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(service)) next.delete(service);
      else next.add(service);
      return next;
    });
  };

  const handleSaveKey = (service: string) => {
    if (keyInput.trim()) {
      setApiKey(service, keyInput.trim());
    } else {
      removeApiKey(service);
    }
    setEditingKey(null);
    setKeyInput("");
    setSavedKey(service);
    setTimeout(() => setSavedKey(null), 2000);
  };

  const handleEditKey = (service: string) => {
    setEditingKey(service);
    setKeyInput(settings.apiKeys[service] ?? "");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-waldorf-border">
        <h2 className="text-sm font-semibold">Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* API Keys section */}
        <div className="px-4 py-3 border-b border-waldorf-border">
          <h3 className="text-xs font-semibold text-waldorf-accent flex items-center gap-1.5 mb-3">
            <Key size={12} /> API Keys & Credentials
          </h3>
          <p className="text-[10px] text-waldorf-text-dim mb-3">
            Configure API keys to enable data sources. Keys are stored locally
            on your device.
          </p>

          <div className="space-y-2">
            {Object.entries(API_KEY_CONFIGS).map(([service, config]) => {
              const configured = hasApiKey(service);
              const isEditing = editingKey === service;
              const justSaved = savedKey === service;
              const isVisible = visibleKeys.has(service);
              const currentKey = settings.apiKeys[service] ?? "";

              return (
                <div
                  key={service}
                  className="bg-waldorf-surface-bright border border-waldorf-border rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={clsx(
                          "w-1.5 h-1.5 rounded-full",
                          configured ? "bg-waldorf-success" : "bg-waldorf-text-dim"
                        )}
                      />
                      <span className="text-xs font-semibold">
                        {config.label}
                      </span>
                    </div>
                    <a
                      href={config.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-waldorf-accent hover:text-waldorf-accent-bright flex items-center gap-0.5"
                    >
                      Docs <ExternalLink size={9} />
                    </a>
                  </div>

                  <p className="text-[10px] text-waldorf-text-dim mb-2">
                    {config.description}
                  </p>

                  {isEditing ? (
                    <div className="flex gap-1.5">
                      <input
                        type={isVisible ? "text" : "password"}
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="Enter API key..."
                        className="flex-1 bg-waldorf-bg border border-waldorf-border rounded px-2 py-1 text-[11px] font-mono focus:outline-none focus:border-waldorf-accent"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveKey(service);
                          if (e.key === "Escape") {
                            setEditingKey(null);
                            setKeyInput("");
                          }
                        }}
                      />
                      <button
                        onClick={() => toggleKeyVisibility(service)}
                        className="p-1 hover:bg-waldorf-bg rounded"
                      >
                        {isVisible ? (
                          <EyeOff size={12} className="text-waldorf-text-dim" />
                        ) : (
                          <Eye size={12} className="text-waldorf-text-dim" />
                        )}
                      </button>
                      <button
                        onClick={() => handleSaveKey(service)}
                        className="px-2 py-1 bg-waldorf-accent text-white rounded text-[10px] font-medium hover:bg-waldorf-accent-bright"
                      >
                        <Save size={10} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      {configured ? (
                        <div className="flex-1 bg-waldorf-bg border border-waldorf-border rounded px-2 py-1 text-[10px] font-mono text-waldorf-text-dim">
                          {isVisible
                            ? currentKey
                            : "••••••••" + currentKey.slice(-4)}
                        </div>
                      ) : (
                        <div className="flex-1 text-[10px] text-waldorf-text-dim italic">
                          Not configured
                        </div>
                      )}
                      {configured && (
                        <button
                          onClick={() => toggleKeyVisibility(service)}
                          className="p-1 hover:bg-waldorf-bg rounded"
                        >
                          {isVisible ? (
                            <EyeOff
                              size={12}
                              className="text-waldorf-text-dim"
                            />
                          ) : (
                            <Eye
                              size={12}
                              className="text-waldorf-text-dim"
                            />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleEditKey(service)}
                        className={clsx(
                          "px-2 py-1 rounded text-[10px] font-medium transition-colors",
                          justSaved
                            ? "bg-waldorf-success/20 text-waldorf-success"
                            : "bg-waldorf-surface text-waldorf-text-dim hover:text-waldorf-text hover:bg-waldorf-border"
                        )}
                      >
                        {justSaved ? (
                          <Check size={10} />
                        ) : configured ? (
                          "Edit"
                        ) : (
                          "Add"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Display settings */}
        <div className="px-4 py-3 border-b border-waldorf-border">
          <h3 className="text-xs font-semibold text-waldorf-accent flex items-center gap-1.5 mb-3">
            <Globe2 size={12} /> Display
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-waldorf-text-dim block mb-1">
                Map Style
              </label>
              <div className="flex gap-1.5">
                {(["dark", "light", "satellite"] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setMapStyle(style)}
                    className={clsx(
                      "px-3 py-1 rounded text-[10px] font-medium capitalize transition-colors",
                      settings.mapStyle === style
                        ? "bg-waldorf-accent text-white"
                        : "bg-waldorf-surface-bright text-waldorf-text-dim hover:text-waldorf-text"
                    )}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Data refresh settings */}
        <div className="px-4 py-3 border-b border-waldorf-border">
          <h3 className="text-xs font-semibold text-waldorf-accent flex items-center gap-1.5 mb-3">
            <Clock size={12} /> Data Refresh
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-waldorf-text-dim block mb-1">
                Auto-refresh interval
              </label>
              <div className="flex gap-1.5">
                {[30, 60, 120, 300].map((secs) => (
                  <button
                    key={secs}
                    onClick={() => setRefreshInterval(secs)}
                    className={clsx(
                      "px-3 py-1 rounded text-[10px] font-medium transition-colors",
                      settings.refreshInterval === secs
                        ? "bg-waldorf-accent text-white"
                        : "bg-waldorf-surface-bright text-waldorf-text-dim hover:text-waldorf-text"
                    )}
                  >
                    {secs < 60 ? `${secs}s` : `${secs / 60}m`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="px-4 py-3">
          <h3 className="text-xs font-semibold text-waldorf-accent flex items-center gap-1.5 mb-3">
            <Bell size={12} /> Notifications
          </h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableNotifications}
              onChange={(e) => setEnableNotifications(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-waldorf-border bg-waldorf-surface-bright text-waldorf-accent focus:ring-waldorf-accent focus:ring-offset-0"
            />
            <span className="text-xs text-waldorf-text-dim">
              Enable breaking news notifications
            </span>
          </label>
        </div>

        {/* App info */}
        <div className="px-4 py-3 border-t border-waldorf-border">
          <div className="text-center text-[10px] text-waldorf-text-dim space-y-1">
            <div className="font-semibold text-waldorf-text">
              Waldorf OSINT Monitor v0.1.0
            </div>
            <div>Open Source Intelligence Dashboard</div>
            <div>Built with Tauri + React + deck.gl</div>
          </div>
        </div>
      </div>
    </div>
  );
};
