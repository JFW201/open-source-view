import { useEffect, useRef } from "react";
import { useMapStore } from "../store/mapStore";
import { useNewsStore } from "../store/newsStore";
import { useAlertStore } from "../store/alertStore";
import { useTimelineStore } from "../store/timelineStore";
import { usePlaybackStore } from "../store/playbackStore";
import type { TimelineEvent } from "../types";

/**
 * Evaluates alert conditions against live data and generates timeline events.
 * Runs alongside the data polling hook.
 */
export function useAlertEvaluation() {
  const aircraft = useMapStore((s) => s.aircraft);
  const vessels = useMapStore((s) => s.vessels);
  const newsItems = useNewsStore((s) => s.items);

  const evaluateAircraft = useAlertStore((s) => s.evaluateAircraft);
  const evaluateVessels = useAlertStore((s) => s.evaluateVessels);
  const evaluateNews = useAlertStore((s) => s.evaluateNews);

  const addEvents = useTimelineStore((s) => s.addEvents);
  const addSnapshot = usePlaybackStore((s) => s.addSnapshot);
  const isRecording = usePlaybackStore((s) => s.isRecording);

  const prevAircraftCountRef = useRef(0);
  const prevVesselCountRef = useRef(0);
  const prevNewsIdsRef = useRef<Set<string>>(new Set());

  // Evaluate aircraft alerts & generate timeline events
  useEffect(() => {
    if (aircraft.length === 0) return;

    evaluateAircraft(aircraft);

    // Generate timeline events for significant changes
    if (
      prevAircraftCountRef.current > 0 &&
      Math.abs(aircraft.length - prevAircraftCountRef.current) >
        prevAircraftCountRef.current * 0.2
    ) {
      const event: TimelineEvent = {
        id: `ac-change-${Date.now()}`,
        type: "aircraft_detected",
        title: `Aircraft count changed: ${prevAircraftCountRef.current} → ${aircraft.length}`,
        description: `Significant change in tracked aircraft (${aircraft.length > prevAircraftCountRef.current ? "+" : ""}${aircraft.length - prevAircraftCountRef.current})`,
        timestamp: new Date().toISOString(),
        severity:
          Math.abs(aircraft.length - prevAircraftCountRef.current) > 100
            ? "warning"
            : "info",
      };
      addEvents([event]);
    }

    prevAircraftCountRef.current = aircraft.length;

    // Record snapshot for playback
    if (isRecording) {
      addSnapshot({
        timestamp: Date.now(),
        aircraft: [...aircraft],
        vessels: useMapStore.getState().vessels,
      });
    }
  }, [aircraft, evaluateAircraft, addEvents, addSnapshot, isRecording]);

  // Evaluate vessel alerts
  useEffect(() => {
    if (vessels.length === 0) return;

    evaluateVessels(vessels);

    if (
      prevVesselCountRef.current > 0 &&
      Math.abs(vessels.length - prevVesselCountRef.current) >
        prevVesselCountRef.current * 0.2
    ) {
      const event: TimelineEvent = {
        id: `vsl-change-${Date.now()}`,
        type: "vessel_detected",
        title: `Vessel count changed: ${prevVesselCountRef.current} → ${vessels.length}`,
        description: `Significant change in tracked vessels (${vessels.length > prevVesselCountRef.current ? "+" : ""}${vessels.length - prevVesselCountRef.current})`,
        timestamp: new Date().toISOString(),
        severity: "info",
      };
      addEvents([event]);
    }

    prevVesselCountRef.current = vessels.length;
  }, [vessels, evaluateVessels, addEvents]);

  // Evaluate news alerts & generate timeline events
  useEffect(() => {
    if (newsItems.length === 0) return;

    evaluateNews(newsItems);

    // Generate timeline events for new news items
    const newEvents: TimelineEvent[] = [];
    for (const item of newsItems) {
      if (prevNewsIdsRef.current.has(item.id)) continue;

      // Only create timeline events for breaking/military/conflict news
      if (
        item.category === "breaking" ||
        item.category === "military" ||
        item.category === "geopolitical"
      ) {
        newEvents.push({
          id: `news-${item.id}`,
          type: "news",
          title: item.title,
          description: item.description,
          timestamp: item.publishedAt,
          source: item.source,
          severity:
            item.category === "breaking"
              ? "warning"
              : item.category === "military"
                ? "warning"
                : "info",
          relatedCountry: item.country,
        });
      }
    }

    if (newEvents.length > 0) {
      addEvents(newEvents);
    }

    // Update tracked IDs
    prevNewsIdsRef.current = new Set(newsItems.map((n) => n.id));
  }, [newsItems, evaluateNews, addEvents]);

  // Generate timeline events from alert notifications
  const notifications = useAlertStore((s) => s.notifications);
  const prevNotifCountRef = useRef(0);

  useEffect(() => {
    if (notifications.length <= prevNotifCountRef.current) {
      prevNotifCountRef.current = notifications.length;
      return;
    }

    const newCount = notifications.length - prevNotifCountRef.current;
    const newNotifs = notifications.slice(0, newCount);
    const events: TimelineEvent[] = newNotifs.map((n) => ({
      id: `alert-${n.id}`,
      type: "alert_triggered" as const,
      title: n.alertName,
      description: n.message,
      timestamp: n.timestamp,
      coordinates: n.data?.coordinates,
      severity: "critical" as const,
    }));

    if (events.length > 0) {
      addEvents(events);
    }

    prevNotifCountRef.current = notifications.length;
  }, [notifications, addEvents]);
}
