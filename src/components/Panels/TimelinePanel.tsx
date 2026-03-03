import React from "react";
import {
  Clock,
  AlertTriangle,
  Info,
  AlertCircle,
  Newspaper,
  Plane,
  Ship,
  Bell,
  Swords,
  TrendingUp,
  Shield,
  MapPin,
  Trash2,
} from "lucide-react";
import { useTimelineStore } from "../../store/timelineStore";
import { useMapStore } from "../../store/mapStore";
import type { TimelineEventType } from "../../types";
import clsx from "clsx";
import { format, formatDistanceToNow } from "date-fns";

const EVENT_TYPE_CONFIG: Record<
  TimelineEventType,
  { icon: React.ReactNode; color: string; label: string }
> = {
  news: {
    icon: <Newspaper size={10} />,
    color: "text-waldorf-accent",
    label: "News",
  },
  aircraft_detected: {
    icon: <Plane size={10} />,
    color: "text-green-400",
    label: "Aircraft",
  },
  vessel_detected: {
    icon: <Ship size={10} />,
    color: "text-blue-400",
    label: "Vessel",
  },
  alert_triggered: {
    icon: <Bell size={10} />,
    color: "text-waldorf-warning",
    label: "Alert",
  },
  conflict: {
    icon: <Swords size={10} />,
    color: "text-waldorf-danger",
    label: "Conflict",
  },
  economic: {
    icon: <TrendingUp size={10} />,
    color: "text-emerald-400",
    label: "Economic",
  },
  military: {
    icon: <Shield size={10} />,
    color: "text-orange-400",
    label: "Military",
  },
};

const SEVERITY_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string }
> = {
  info: { icon: <Info size={10} />, color: "text-waldorf-accent" },
  warning: {
    icon: <AlertTriangle size={10} />,
    color: "text-waldorf-warning",
  },
  critical: {
    icon: <AlertCircle size={10} />,
    color: "text-waldorf-danger",
  },
};

const EVENT_TYPES = [
  "all",
  "news",
  "aircraft_detected",
  "vessel_detected",
  "alert_triggered",
  "conflict",
  "economic",
  "military",
] as const;

export const TimelinePanel: React.FC = () => {
  const {
    filterType,
    filterSeverity,
    setFilterType,
    setFilterSeverity,
    getFilteredEvents,
    clearEvents,
  } = useTimelineStore();
  const flyTo = useMapStore((s) => s.flyTo);

  const events = getFilteredEvents();

  // Group events by date
  const grouped = events.reduce<Record<string, typeof events>>((acc, event) => {
    const date = format(new Date(event.timestamp), "yyyy-MM-dd");
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-waldorf-border">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-waldorf-accent" />
          <h2 className="text-sm font-semibold">Timeline</h2>
          <span className="text-[10px] text-waldorf-text-dim font-mono">
            {events.length} events
          </span>
        </div>
        {events.length > 0 && (
          <button
            onClick={clearEvents}
            className="p-1 hover:bg-waldorf-surface-bright rounded transition-colors"
            title="Clear timeline"
          >
            <Trash2 size={12} className="text-waldorf-text-dim" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="px-4 py-2 border-b border-waldorf-border space-y-1.5">
        <div className="flex flex-wrap gap-1">
          {EVENT_TYPES.map((type) => {
            const config =
              type === "all"
                ? null
                : EVENT_TYPE_CONFIG[type as TimelineEventType];
            return (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={clsx(
                  "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] transition-colors",
                  filterType === type
                    ? "bg-waldorf-accent/20 text-waldorf-accent"
                    : "bg-waldorf-surface-bright text-waldorf-text-dim hover:text-waldorf-text"
                )}
              >
                {config?.icon}
                {config?.label || "All"}
              </button>
            );
          })}
        </div>
        <div className="flex gap-1">
          {["all", "info", "warning", "critical"].map((sev) => {
            const config = sev === "all" ? null : SEVERITY_CONFIG[sev];
            return (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={clsx(
                  "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] transition-colors",
                  filterSeverity === sev
                    ? "bg-waldorf-accent/20 text-waldorf-accent"
                    : "bg-waldorf-surface-bright text-waldorf-text-dim hover:text-waldorf-text"
                )}
              >
                {config?.icon}
                {sev === "all" ? "All" : sev.charAt(0).toUpperCase() + sev.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events list */}
      <div className="flex-1 overflow-y-auto">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-waldorf-text-dim gap-2 px-8 text-center">
            <Clock size={24} className="opacity-40" />
            <p className="text-xs">
              Events will appear here as they are detected across all data
              sources.
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, dateEvents]) => (
            <div key={date}>
              <div className="sticky top-0 bg-waldorf-surface px-4 py-1 text-[10px] font-semibold text-waldorf-text-dim border-b border-waldorf-border/50">
                {format(new Date(date), "EEEE, MMM d, yyyy")}
              </div>
              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-waldorf-border" />

                {dateEvents.map((event) => {
                  const typeConfig = EVENT_TYPE_CONFIG[event.type];
                  const sevConfig = event.severity
                    ? SEVERITY_CONFIG[event.severity]
                    : null;

                  return (
                    <div
                      key={event.id}
                      className="relative px-4 py-2 hover:bg-waldorf-surface-bright/50 transition-colors cursor-pointer"
                      onClick={() => {
                        if (event.coordinates) {
                          flyTo(event.coordinates[0], event.coordinates[1], 6);
                        }
                      }}
                    >
                      <div className="flex gap-3 ml-4">
                        {/* Timeline dot */}
                        <div
                          className={clsx(
                            "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 -ml-6 relative z-10",
                            event.severity === "critical"
                              ? "bg-waldorf-danger/20"
                              : event.severity === "warning"
                                ? "bg-waldorf-warning/20"
                                : "bg-waldorf-surface-bright"
                          )}
                        >
                          <span className={typeConfig.color}>
                            {typeConfig.icon}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span
                              className={clsx(
                                "text-[10px] font-medium",
                                typeConfig.color
                              )}
                            >
                              {typeConfig.label}
                            </span>
                            {sevConfig && (
                              <span className={clsx("flex items-center gap-0.5 text-[10px]", sevConfig.color)}>
                                {sevConfig.icon}
                              </span>
                            )}
                            <span className="text-[10px] text-waldorf-text-dim ml-auto">
                              {format(new Date(event.timestamp), "HH:mm:ss")}
                            </span>
                          </div>
                          <div className="text-xs leading-snug text-waldorf-text line-clamp-2">
                            {event.title}
                          </div>
                          {event.description && (
                            <div className="text-[10px] text-waldorf-text-dim mt-0.5 line-clamp-2">
                              {event.description}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-0.5">
                            {event.source && (
                              <span className="text-[10px] text-waldorf-text-dim">
                                {event.source}
                              </span>
                            )}
                            {event.coordinates && (
                              <span className="text-[10px] text-waldorf-text-dim flex items-center gap-0.5">
                                <MapPin size={8} />
                                {event.coordinates[1].toFixed(2)},{" "}
                                {event.coordinates[0].toFixed(2)}
                              </span>
                            )}
                            {event.relatedCountry && (
                              <span className="text-[10px] text-waldorf-accent">
                                {event.relatedCountry}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
