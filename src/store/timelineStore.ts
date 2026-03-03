import { create } from "zustand";
import type { TimelineEvent } from "../types";

interface TimelineState {
  events: TimelineEvent[];
  filterType: string | "all";
  filterSeverity: string | "all";

  addEvent: (event: TimelineEvent) => void;
  addEvents: (events: TimelineEvent[]) => void;
  clearEvents: () => void;
  setFilterType: (type: string | "all") => void;
  setFilterSeverity: (severity: string | "all") => void;
  getFilteredEvents: () => TimelineEvent[];
}

export const useTimelineStore = create<TimelineState>()((set, get) => ({
  events: [],
  filterType: "all",
  filterSeverity: "all",

  addEvent: (event) =>
    set((s) => ({
      events: [event, ...s.events]
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, 1000),
    })),

  addEvents: (newEvents) =>
    set((s) => {
      const existingIds = new Set(s.events.map((e) => e.id));
      const unique = newEvents.filter((e) => !existingIds.has(e.id));
      return {
        events: [...unique, ...s.events]
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
          .slice(0, 1000),
      };
    }),

  clearEvents: () => set({ events: [] }),

  setFilterType: (type) => set({ filterType: type }),
  setFilterSeverity: (severity) => set({ filterSeverity: severity }),

  getFilteredEvents: () => {
    const { events, filterType, filterSeverity } = get();
    let filtered = events;
    if (filterType !== "all") {
      filtered = filtered.filter((e) => e.type === filterType);
    }
    if (filterSeverity !== "all") {
      filtered = filtered.filter((e) => e.severity === filterSeverity);
    }
    return filtered;
  },
}));
