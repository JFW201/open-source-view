import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  WatchlistAlert,
  AlertNotification,
  AlertCondition,
  Aircraft,
  Vessel,
  NewsItem,
} from "../types";

interface AlertState {
  alerts: WatchlistAlert[];
  notifications: AlertNotification[];
  unreadCount: number;

  addAlert: (name: string, condition: AlertCondition) => void;
  removeAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  clearNotifications: () => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  evaluateAircraft: (aircraft: Aircraft[]) => void;
  evaluateVessels: (vessels: Vessel[]) => void;
  evaluateNews: (items: NewsItem[]) => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const useAlertStore = create<AlertState>()(
  persist(
    (set, get) => ({
      alerts: [],
      notifications: [],
      unreadCount: 0,

      addAlert: (name, condition) => {
        const alert: WatchlistAlert = {
          id: generateId(),
          name,
          condition,
          enabled: true,
          createdAt: new Date().toISOString(),
          lastTriggeredAt: null,
          triggerCount: 0,
        };
        set((s) => ({ alerts: [...s.alerts, alert] }));
      },

      removeAlert: (id) =>
        set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),

      toggleAlert: (id) =>
        set((s) => ({
          alerts: s.alerts.map((a) =>
            a.id === id ? { ...a, enabled: !a.enabled } : a
          ),
        })),

      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

      markNotificationRead: (id) =>
        set((s) => {
          const updated = s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
          };
        }),

      markAllRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      evaluateAircraft: (aircraft) => {
        const { alerts } = get();
        const now = new Date().toISOString();
        const newNotifications: AlertNotification[] = [];
        const alertUpdates: Record<string, Partial<WatchlistAlert>> = {};

        for (const alert of alerts) {
          if (!alert.enabled) continue;

          if (alert.condition.type === "aircraft_callsign") {
            const keyword = alert.condition.value.toLowerCase();
            const match = aircraft.find(
              (a) =>
                a.callsign?.toLowerCase().includes(keyword) ||
                a.icao24?.toLowerCase().includes(keyword)
            );
            if (match) {
              // Throttle: don't re-trigger within 5 minutes
              if (
                alert.lastTriggeredAt &&
                Date.now() - new Date(alert.lastTriggeredAt).getTime() < 300000
              )
                continue;

              newNotifications.push({
                id: generateId(),
                alertId: alert.id,
                alertName: alert.name,
                message: `Aircraft "${match.callsign || match.icao24}" detected from ${match.origin_country}`,
                timestamp: now,
                read: false,
                data: {
                  coordinates: [match.longitude, match.latitude],
                  type: "aircraft",
                },
              });
              alertUpdates[alert.id] = {
                lastTriggeredAt: now,
                triggerCount: alert.triggerCount + 1,
              };
            }
          }

          if (
            alert.condition.type === "geofence_entry" &&
            alert.condition.geofence
          ) {
            const gf = alert.condition.geofence;
            const inside = aircraft.filter(
              (a) =>
                !a.on_ground &&
                haversineDistance(
                  gf.center[1],
                  gf.center[0],
                  a.latitude,
                  a.longitude
                ) <= gf.radiusKm
            );
            if (inside.length > 0) {
              if (
                alert.lastTriggeredAt &&
                Date.now() - new Date(alert.lastTriggeredAt).getTime() < 300000
              )
                continue;

              newNotifications.push({
                id: generateId(),
                alertId: alert.id,
                alertName: alert.name,
                message: `${inside.length} aircraft detected in geofence "${gf.name}" (${gf.radiusKm}km radius)`,
                timestamp: now,
                read: false,
                data: { coordinates: gf.center, type: "geofence" },
              });
              alertUpdates[alert.id] = {
                lastTriggeredAt: now,
                triggerCount: alert.triggerCount + 1,
              };
            }
          }
        }

        if (newNotifications.length > 0) {
          set((s) => ({
            notifications: [...newNotifications, ...s.notifications].slice(
              0,
              200
            ),
            unreadCount: s.unreadCount + newNotifications.length,
            alerts: s.alerts.map((a) =>
              alertUpdates[a.id] ? { ...a, ...alertUpdates[a.id] } : a
            ),
          }));
        }
      },

      evaluateVessels: (vessels) => {
        const { alerts } = get();
        const now = new Date().toISOString();
        const newNotifications: AlertNotification[] = [];
        const alertUpdates: Record<string, Partial<WatchlistAlert>> = {};

        for (const alert of alerts) {
          if (!alert.enabled) continue;

          if (alert.condition.type === "vessel_mmsi") {
            const keyword = alert.condition.value.toLowerCase();
            const match = vessels.find(
              (v) =>
                v.mmsi?.toLowerCase().includes(keyword) ||
                v.name?.toLowerCase().includes(keyword)
            );
            if (match) {
              if (
                alert.lastTriggeredAt &&
                Date.now() - new Date(alert.lastTriggeredAt).getTime() < 300000
              )
                continue;

              newNotifications.push({
                id: generateId(),
                alertId: alert.id,
                alertName: alert.name,
                message: `Vessel "${match.name}" (MMSI: ${match.mmsi}) detected — ${match.ship_type}, heading to ${match.destination || "unknown"}`,
                timestamp: now,
                read: false,
                data: {
                  coordinates: [match.longitude, match.latitude],
                  type: "vessel",
                },
              });
              alertUpdates[alert.id] = {
                lastTriggeredAt: now,
                triggerCount: alert.triggerCount + 1,
              };
            }
          }

          if (
            alert.condition.type === "geofence_entry" &&
            alert.condition.geofence
          ) {
            const gf = alert.condition.geofence;
            const inside = vessels.filter(
              (v) =>
                haversineDistance(
                  gf.center[1],
                  gf.center[0],
                  v.latitude,
                  v.longitude
                ) <= gf.radiusKm
            );
            if (inside.length > 0) {
              if (
                alert.lastTriggeredAt &&
                Date.now() - new Date(alert.lastTriggeredAt).getTime() < 300000
              )
                continue;

              newNotifications.push({
                id: generateId(),
                alertId: alert.id,
                alertName: alert.name,
                message: `${inside.length} vessel(s) detected in geofence "${gf.name}"`,
                timestamp: now,
                read: false,
                data: { coordinates: gf.center, type: "geofence" },
              });
              alertUpdates[alert.id] = {
                lastTriggeredAt: now,
                triggerCount: alert.triggerCount + 1,
              };
            }
          }
        }

        if (newNotifications.length > 0) {
          set((s) => ({
            notifications: [...newNotifications, ...s.notifications].slice(
              0,
              200
            ),
            unreadCount: s.unreadCount + newNotifications.length,
            alerts: s.alerts.map((a) =>
              alertUpdates[a.id] ? { ...a, ...alertUpdates[a.id] } : a
            ),
          }));
        }
      },

      evaluateNews: (items) => {
        const { alerts } = get();
        const now = new Date().toISOString();
        const newNotifications: AlertNotification[] = [];
        const alertUpdates: Record<string, Partial<WatchlistAlert>> = {};

        for (const alert of alerts) {
          if (!alert.enabled) continue;

          if (alert.condition.type === "news_keyword") {
            const keyword = alert.condition.value.toLowerCase();
            const matches = items.filter(
              (n) =>
                n.title.toLowerCase().includes(keyword) ||
                n.description.toLowerCase().includes(keyword)
            );

            if (matches.length > 0) {
              if (
                alert.lastTriggeredAt &&
                Date.now() - new Date(alert.lastTriggeredAt).getTime() < 300000
              )
                continue;

              const first = matches[0];
              newNotifications.push({
                id: generateId(),
                alertId: alert.id,
                alertName: alert.name,
                message: `News keyword "${alert.condition.value}" found: "${first.title}"${matches.length > 1 ? ` (+${matches.length - 1} more)` : ""}`,
                timestamp: now,
                read: false,
                data: { type: "news" },
              });
              alertUpdates[alert.id] = {
                lastTriggeredAt: now,
                triggerCount: alert.triggerCount + 1,
              };
            }
          }

          if (alert.condition.type === "country_event") {
            const country = alert.condition.value.toLowerCase();
            const matches = items.filter(
              (n) =>
                n.country?.toLowerCase() === country ||
                n.title.toLowerCase().includes(country)
            );

            if (matches.length > 0) {
              if (
                alert.lastTriggeredAt &&
                Date.now() - new Date(alert.lastTriggeredAt).getTime() < 600000
              )
                continue;

              newNotifications.push({
                id: generateId(),
                alertId: alert.id,
                alertName: alert.name,
                message: `${matches.length} event(s) related to "${alert.condition.value}" detected`,
                timestamp: now,
                read: false,
                data: { type: "country_event" },
              });
              alertUpdates[alert.id] = {
                lastTriggeredAt: now,
                triggerCount: alert.triggerCount + 1,
              };
            }
          }
        }

        if (newNotifications.length > 0) {
          set((s) => ({
            notifications: [...newNotifications, ...s.notifications].slice(
              0,
              200
            ),
            unreadCount: s.unreadCount + newNotifications.length,
            alerts: s.alerts.map((a) =>
              alertUpdates[a.id] ? { ...a, ...alertUpdates[a.id] } : a
            ),
          }));
        }
      },
    }),
    {
      name: "waldorf-alerts",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
