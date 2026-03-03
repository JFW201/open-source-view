import React, { useEffect, useState } from "react";
import { Wifi, WifiOff, Clock, MapPin, Activity } from "lucide-react";
import { useMapStore } from "../../store/mapStore";
import { useNewsStore } from "../../store/newsStore";
import { useSignalFusionStore } from "../../store/signalFusionStore";

export const StatusBar: React.FC = () => {
  const viewState = useMapStore((s) => s.viewState);
  const aircraft = useMapStore((s) => s.aircraft);
  const vessels = useMapStore((s) => s.vessels);
  const gdeltEvents = useMapStore((s) => s.gdeltEvents);
  const acledEvents = useMapStore((s) => s.acledEvents);
  const firmsHotspots = useMapStore((s) => s.firmsHotspots);
  const newsCount = useNewsStore((s) => s.items.length);
  const lastUpdated = useNewsStore((s) => s.lastUpdated);
  const sources = useSignalFusionStore((s) => s.sources);
  const anomalyCount = useSignalFusionStore((s) => s.anomalies.length);
  const liveSources = sources.filter((s) => s.status === "live").length;

  const [isConnected, setIsConnected] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <footer className="h-6 bg-waldorf-surface border-t border-waldorf-border flex items-center justify-between px-3 text-[10px] text-waldorf-text-dim select-none">
      {/* Left: connection status */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          {isConnected ? (
            <Wifi size={10} className="text-waldorf-success" />
          ) : (
            <WifiOff size={10} className="text-waldorf-danger" />
          )}
          {isConnected ? "Connected" : "Offline"}
        </span>
        <span className="text-waldorf-border">|</span>
        <span>{newsCount} articles</span>
        {aircraft.length > 0 && (
          <>
            <span className="text-waldorf-border">|</span>
            <span>{aircraft.length} aircraft</span>
          </>
        )}
        {vessels.length > 0 && (
          <>
            <span className="text-waldorf-border">|</span>
            <span>{vessels.length} vessels</span>
          </>
        )}
        {gdeltEvents.length > 0 && (
          <>
            <span className="text-waldorf-border">|</span>
            <span>{gdeltEvents.length} GDELT</span>
          </>
        )}
        {acledEvents.length > 0 && (
          <>
            <span className="text-waldorf-border">|</span>
            <span>{acledEvents.length} ACLED</span>
          </>
        )}
        {firmsHotspots.length > 0 && (
          <>
            <span className="text-waldorf-border">|</span>
            <span>{firmsHotspots.length} fires</span>
          </>
        )}
        <span className="text-waldorf-border">|</span>
        <span className="flex items-center gap-1">
          <Activity size={9} />
          {liveSources}/{sources.length} sources
          {anomalyCount > 0 && (
            <span className="text-waldorf-danger ml-0.5">
              ({anomalyCount} anomalies)
            </span>
          )}
        </span>
      </div>

      {/* Center: timestamp */}
      <div className="flex items-center gap-1">
        <Clock size={10} />
        {new Date().toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}{" "}
        UTC{new Date().getTimezoneOffset() === 0 ? "" : ` (local)`}
      </div>

      {/* Right: coordinates */}
      <div className="flex items-center gap-1 font-mono">
        <MapPin size={10} />
        {viewState.latitude.toFixed(4)}, {viewState.longitude.toFixed(4)} | z
        {viewState.zoom.toFixed(1)}
      </div>
    </footer>
  );
};
