import { useEffect, useRef, useCallback } from "react";
import { useMapStore } from "../store/mapStore";
import { useSettingsStore } from "../store/settingsStore";
import { fetchLiveFlights } from "../services/api/aviationstack";
import { fetchAircraft } from "../services/api/opensky";
import { AISStreamClient } from "../services/api/aisstream";
import { fetchVessels } from "../services/api/ais";
import { cache, CACHE_TTL } from "../services/cache";

/**
 * Manages live data polling for air and sea traffic.
 * Uses Aviation Stack (primary) / OpenSky (fallback) for air.
 * Uses AIS Stream (primary, WebSocket) / AISHub (fallback) for sea.
 */
export function useDataPolling() {
  const setAircraft = useMapStore((s) => s.setAircraft);
  const setVessels = useMapStore((s) => s.setVessels);
  const setIsLoadingAir = useMapStore((s) => s.setIsLoadingAir);
  const setIsLoadingSea = useMapStore((s) => s.setIsLoadingSea);
  const isAirVisible = useMapStore((s) => s.isLayerVisible);
  const layers = useMapStore((s) => s.layers);

  const hasApiKey = useSettingsStore((s) => s.hasApiKey);
  const getApiKey = useSettingsStore((s) => s.getApiKey);
  const refreshInterval = useSettingsStore((s) => s.settings.refreshInterval);

  const aisClientRef = useRef<AISStreamClient | null>(null);
  const airIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const airLayerVisible = layers.find((l) => l.id === "air-traffic")?.visible ?? false;
  const seaLayerVisible = layers.find((l) => l.id === "sea-traffic")?.visible ?? false;

  // ── Air traffic polling ───────────────────────────────────────────────
  const fetchAirData = useCallback(async () => {
    // Check cache first
    const cached = await cache.get<any[]>("air-traffic");
    if (cached && cached.length > 0) {
      setAircraft(cached);
      return;
    }

    setIsLoadingAir(true);
    try {
      // Primary: Aviation Stack
      if (hasApiKey("aviationstack")) {
        const key = getApiKey("aviationstack")!;
        const data = await fetchLiveFlights(key);
        if (data.length > 0) {
          setAircraft(data);
          await cache.set("air-traffic", data, CACHE_TTL.AIR_TRAFFIC);
          setIsLoadingAir(false);
          return;
        }
      }

      // Fallback: OpenSky Network
      let data;
      if (hasApiKey("opensky")) {
        const key = getApiKey("opensky")!;
        const [username, password] = key.includes(":")
          ? key.split(":")
          : [key, ""];
        data = await fetchAircraft(
          username && password ? { username, password } : null
        );
      } else {
        // Anonymous OpenSky (rate limited but works)
        data = await fetchAircraft(null);
      }
      setAircraft(data);
      if (data.length > 0) {
        await cache.set("air-traffic", data, CACHE_TTL.AIR_TRAFFIC);
      }
    } catch (err) {
      console.error("Air traffic fetch failed:", err);
      // Serve stale cache on error
      const stale = await cache.get<any[]>("air-traffic", true);
      if (stale && stale.length > 0) setAircraft(stale);
    } finally {
      setIsLoadingAir(false);
    }
  }, [hasApiKey, getApiKey, setAircraft, setIsLoadingAir]);

  useEffect(() => {
    if (airLayerVisible) {
      fetchAirData();
      airIntervalRef.current = setInterval(
        fetchAirData,
        Math.max(refreshInterval * 1000, 10000)
      );
    } else {
      if (airIntervalRef.current) {
        clearInterval(airIntervalRef.current);
        airIntervalRef.current = null;
      }
    }

    return () => {
      if (airIntervalRef.current) {
        clearInterval(airIntervalRef.current);
        airIntervalRef.current = null;
      }
    };
  }, [airLayerVisible, fetchAirData, refreshInterval]);

  // ── Sea traffic (WebSocket or polling) ────────────────────────────────
  useEffect(() => {
    if (!seaLayerVisible) {
      aisClientRef.current?.disconnect();
      aisClientRef.current = null;
      return;
    }

    // Primary: AIS Stream (WebSocket)
    if (hasApiKey("aisstream")) {
      const key = getApiKey("aisstream")!;
      const client = new AISStreamClient(key, (vessels) => {
        setVessels(vessels);
      });
      client.connect();
      aisClientRef.current = client;
      return;
    }

    // Fallback: AISHub (polling)
    if (hasApiKey("aishub")) {
      const key = getApiKey("aishub")!;
      const fetchSeaData = async () => {
        // Check cache first
        const cached = await cache.get<any[]>("sea-traffic");
        if (cached && cached.length > 0) {
          setVessels(cached);
          return;
        }

        setIsLoadingSea(true);
        try {
          const data = await fetchVessels(key);
          setVessels(data);
          if (data.length > 0) {
            await cache.set("sea-traffic", data, CACHE_TTL.SEA_TRAFFIC);
          }
        } catch (err) {
          console.error("AIS fetch failed:", err);
          const stale = await cache.get<any[]>("sea-traffic", true);
          if (stale && stale.length > 0) setVessels(stale);
        } finally {
          setIsLoadingSea(false);
        }
      };

      fetchSeaData();
      const interval = setInterval(
        fetchSeaData,
        Math.max(refreshInterval * 1000, 30000)
      );
      return () => clearInterval(interval);
    }

    return () => {
      aisClientRef.current?.disconnect();
      aisClientRef.current = null;
    };
  }, [seaLayerVisible, hasApiKey, getApiKey, setVessels, setIsLoadingSea, refreshInterval]);
}
