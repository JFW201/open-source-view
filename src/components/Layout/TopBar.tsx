import React from "react";
import {
  Globe2,
  Map,
} from "lucide-react";
import { useMapStore } from "../../store/mapStore";
import { SearchBar } from "./SearchBar";
import clsx from "clsx";

export const TopBar: React.FC = () => {
  const mapProjection = useMapStore((s) => s.mapProjection);
  const setMapProjection = useMapStore((s) => s.setMapProjection);
  const aircraft = useMapStore((s) => s.aircraft);
  const vessels = useMapStore((s) => s.vessels);
  const layers = useMapStore((s) => s.layers);

  const activeLayers = layers.filter((l) => l.visible).length;

  return (
    <header className="h-10 bg-waldorf-surface border-b border-waldorf-border flex items-center justify-between px-4 select-none z-50" data-tauri-drag-region>
      {/* Left: Branding */}
      <div className="flex items-center gap-3 flex-shrink-0" data-tauri-drag-region>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-waldorf-accent flex items-center justify-center">
            <Globe2 size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight">WALDORF</span>
          <span className="text-[10px] text-waldorf-text-dim font-mono px-1.5 py-0.5 bg-waldorf-surface-bright rounded">
            OSINT
          </span>
        </div>
      </div>

      {/* Center: Search bar */}
      <SearchBar />

      {/* Right: Status + map controls */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="hidden lg:flex items-center gap-3 text-[10px] text-waldorf-text-dim">
          {activeLayers > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-waldorf-success animate-pulse" />
              {activeLayers} layer{activeLayers !== 1 ? "s" : ""}
            </span>
          )}
          {aircraft.length > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {aircraft.length.toLocaleString()} ac
            </span>
          )}
          {vessels.length > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              {vessels.length.toLocaleString()} vsl
            </span>
          )}
        </div>

        <div className="flex bg-waldorf-surface-bright rounded overflow-hidden border border-waldorf-border">
          <button
            onClick={() => setMapProjection("globe")}
            className={clsx(
              "p-1.5 transition-colors",
              mapProjection === "globe"
                ? "bg-waldorf-accent text-white"
                : "text-waldorf-text-dim hover:text-waldorf-text"
            )}
            title="Globe view"
          >
            <Globe2 size={13} />
          </button>
          <button
            onClick={() => setMapProjection("mercator")}
            className={clsx(
              "p-1.5 transition-colors",
              mapProjection === "mercator"
                ? "bg-waldorf-accent text-white"
                : "text-waldorf-text-dim hover:text-waldorf-text"
            )}
            title="Flat map view"
          >
            <Map size={13} />
          </button>
        </div>
      </div>
    </header>
  );
};
