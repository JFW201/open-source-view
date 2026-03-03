import { useEffect, useRef, useCallback } from "react";
import { useMapStore } from "../store/mapStore";
import { useSettingsStore } from "../store/settingsStore";
import { useSignalFusionStore } from "../store/signalFusionStore";
import { fetchGdeltEvents } from "../services/api/gdelt";
import { fetchAcledEvents } from "../services/api/acled";
import { fetchFirmsHotspots, filterHighConfidence } from "../services/api/firms";

/**
 * Polls GDELT, ACLED, and FIRMS data when their layers are visible.
 * Updates the signal fusion store with source status and regional counts
 * for anomaly detection.
 */
export function useOsintPolling() {
  const layers = useMapStore((s) => s.layers);
  const setGdeltEvents = useMapStore((s) => s.setGdeltEvents);
  const setAcledEvents = useMapStore((s) => s.setAcledEvents);
  const setFirmsHotspots = useMapStore((s) => s.setFirmsHotspots);

  const hasApiKey = useSettingsStore((s) => s.hasApiKey);
  const getApiKey = useSettingsStore((s) => s.getApiKey);

  const updateSourceStatus = useSignalFusionStore(
    (s) => s.updateSourceStatus
  );
  const ingestSignals = useSignalFusionStore((s) => s.ingestSignals);
  const detectConvergence = useSignalFusionStore((s) => s.detectConvergence);

  const gdeltVisible =
    layers.find((l) => l.id === "gdelt-events")?.visible ?? false;
  const acledVisible =
    layers.find((l) => l.id === "acled-events")?.visible ?? false;
  const firmsVisible =
    layers.find((l) => l.id === "firms-hotspots")?.visible ?? false;

  const gdeltIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const acledIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const firmsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Helper: aggregate events into 10° grid cells for anomaly detection
  const toRegionCounts = (
    items: { latitude: number; longitude: number }[]
  ): { lat: number; lon: number; count: number }[] => {
    const map = new Map<string, { lat: number; lon: number; count: number }>();
    for (const item of items) {
      const gridLat = Math.floor(item.latitude / 10) * 10;
      const gridLon = Math.floor(item.longitude / 10) * 10;
      const key = `${gridLat},${gridLon}`;
      const existing = map.get(key);
      if (existing) {
        existing.count++;
      } else {
        map.set(key, { lat: gridLat, lon: gridLon, count: 1 });
      }
    }
    return Array.from(map.values());
  };

  // ── GDELT Polling ─────────────────────────────────────────────────────────
  const fetchGdelt = useCallback(async () => {
    try {
      const events = await fetchGdeltEvents();
      setGdeltEvents(events);
      updateSourceStatus("gdelt", events.length > 0 ? "live" : "degraded", events.length);

      // Feed into anomaly detection
      if (events.length > 0) {
        ingestSignals("gdelt", toRegionCounts(events));
        detectConvergence();
      }
    } catch (err) {
      console.error("GDELT polling error:", err);
      updateSourceStatus("gdelt", "degraded", undefined, String(err));
    }
  }, [setGdeltEvents, updateSourceStatus, ingestSignals, detectConvergence]);

  useEffect(() => {
    if (gdeltVisible) {
      fetchGdelt();
      gdeltIntervalRef.current = setInterval(fetchGdelt, 10 * 60 * 1000); // 10 min
    } else {
      if (gdeltIntervalRef.current) {
        clearInterval(gdeltIntervalRef.current);
        gdeltIntervalRef.current = null;
      }
    }
    return () => {
      if (gdeltIntervalRef.current) {
        clearInterval(gdeltIntervalRef.current);
        gdeltIntervalRef.current = null;
      }
    };
  }, [gdeltVisible, fetchGdelt]);

  // ── ACLED Polling ─────────────────────────────────────────────────────────
  const fetchAcled = useCallback(async () => {
    if (!hasApiKey("acled")) {
      updateSourceStatus("acled", "offline", 0, "API key required");
      return;
    }
    try {
      const apiKey = getApiKey("acled")!;
      const email = getApiKey("acled_email") || "";
      const events = await fetchAcledEvents(apiKey, email);
      setAcledEvents(events);
      updateSourceStatus("acled", events.length > 0 ? "live" : "degraded", events.length);

      if (events.length > 0) {
        ingestSignals("acled", toRegionCounts(events));
        detectConvergence();
      }
    } catch (err) {
      console.error("ACLED polling error:", err);
      updateSourceStatus("acled", "degraded", undefined, String(err));
    }
  }, [hasApiKey, getApiKey, setAcledEvents, updateSourceStatus, ingestSignals, detectConvergence]);

  useEffect(() => {
    if (acledVisible) {
      fetchAcled();
      acledIntervalRef.current = setInterval(fetchAcled, 30 * 60 * 1000); // 30 min
    } else {
      if (acledIntervalRef.current) {
        clearInterval(acledIntervalRef.current);
        acledIntervalRef.current = null;
      }
    }
    return () => {
      if (acledIntervalRef.current) {
        clearInterval(acledIntervalRef.current);
        acledIntervalRef.current = null;
      }
    };
  }, [acledVisible, fetchAcled]);

  // ── FIRMS Polling ─────────────────────────────────────────────────────────
  const fetchFirms = useCallback(async () => {
    try {
      const mapKey = hasApiKey("firms") ? getApiKey("firms") : undefined;
      const allHotspots = await fetchFirmsHotspots(mapKey);
      const hotspots = filterHighConfidence(allHotspots);
      setFirmsHotspots(hotspots);
      updateSourceStatus("firms", hotspots.length > 0 ? "live" : "degraded", hotspots.length);

      if (hotspots.length > 0) {
        ingestSignals("firms", toRegionCounts(hotspots));
        detectConvergence();
      }
    } catch (err) {
      console.error("FIRMS polling error:", err);
      updateSourceStatus("firms", "degraded", undefined, String(err));
    }
  }, [hasApiKey, getApiKey, setFirmsHotspots, updateSourceStatus, ingestSignals, detectConvergence]);

  useEffect(() => {
    if (firmsVisible) {
      fetchFirms();
      firmsIntervalRef.current = setInterval(fetchFirms, 15 * 60 * 1000); // 15 min
    } else {
      if (firmsIntervalRef.current) {
        clearInterval(firmsIntervalRef.current);
        firmsIntervalRef.current = null;
      }
    }
    return () => {
      if (firmsIntervalRef.current) {
        clearInterval(firmsIntervalRef.current);
        firmsIntervalRef.current = null;
      }
    };
  }, [firmsVisible, fetchFirms]);
}
