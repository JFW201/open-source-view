import React, { useState, useCallback } from "react";
import {
  Bell,
  BellOff,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  CheckCheck,
  MapPin,
  Plane,
  Ship,
  Newspaper,
  Globe2,
  ChevronDown,
  ChevronRight,
  X,
  Clock,
} from "lucide-react";
import { useAlertStore } from "../../store/alertStore";
import { useMapStore } from "../../store/mapStore";
import type { AlertConditionType, AlertCondition } from "../../types";
import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";

const CONDITION_TYPES: {
  type: AlertConditionType;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
}[] = [
  {
    type: "news_keyword",
    label: "News Keyword",
    icon: <Newspaper size={12} />,
    placeholder: 'e.g. "Taiwan Strait"',
  },
  {
    type: "aircraft_callsign",
    label: "Aircraft Callsign / ICAO",
    icon: <Plane size={12} />,
    placeholder: 'e.g. "FORTE" or "AE5420"',
  },
  {
    type: "vessel_mmsi",
    label: "Vessel Name / MMSI",
    icon: <Ship size={12} />,
    placeholder: 'e.g. "EVER GIVEN" or "477123456"',
  },
  {
    type: "geofence_entry",
    label: "Geofence Entry",
    icon: <MapPin size={12} />,
    placeholder: "Use current map center",
  },
  {
    type: "country_event",
    label: "Country Event",
    icon: <Globe2 size={12} />,
    placeholder: 'e.g. "Ukraine" or "China"',
  },
];

export const AlertsPanel: React.FC = () => {
  const {
    alerts,
    notifications,
    unreadCount,
    addAlert,
    removeAlert,
    toggleAlert,
    clearNotifications,
    markAllRead,
  } = useAlertStore();
  const viewState = useMapStore((s) => s.viewState);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [conditionType, setConditionType] =
    useState<AlertConditionType>("news_keyword");
  const [conditionValue, setConditionValue] = useState("");
  const [geofenceRadius, setGeofenceRadius] = useState(100);
  const [expandedSection, setExpandedSection] = useState<
    "alerts" | "notifications"
  >("alerts");

  const handleAdd = useCallback(() => {
    if (!name.trim()) return;

    const condition: AlertCondition = {
      type: conditionType,
      value: conditionValue,
    };

    if (conditionType === "geofence_entry") {
      condition.geofence = {
        center: [viewState.longitude, viewState.latitude],
        radiusKm: geofenceRadius,
        name: name,
      };
      condition.value = name;
    }

    addAlert(name, condition);
    setName("");
    setConditionValue("");
    setShowForm(false);
  }, [
    name,
    conditionType,
    conditionValue,
    geofenceRadius,
    viewState,
    addAlert,
  ]);

  const conditionConfig = CONDITION_TYPES.find(
    (c) => c.type === conditionType
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-waldorf-border">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-waldorf-accent" />
          <h2 className="text-sm font-semibold">Alerts & Watchlists</h2>
          {unreadCount > 0 && (
            <span className="text-[10px] bg-waldorf-danger text-white px-1.5 py-0.5 rounded-full font-mono">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-1 hover:bg-waldorf-surface-bright rounded transition-colors"
          title="Add alert"
        >
          <Plus size={14} className="text-waldorf-accent" />
        </button>
      </div>

      {/* Create alert form */}
      {showForm && (
        <div className="px-4 py-3 border-b border-waldorf-border space-y-2 bg-waldorf-surface-bright/50">
          <input
            type="text"
            placeholder="Alert name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-waldorf-bg border border-waldorf-border rounded px-2 py-1.5 text-xs text-waldorf-text placeholder:text-waldorf-text-dim focus:outline-none focus:border-waldorf-accent"
          />

          <div className="flex flex-wrap gap-1">
            {CONDITION_TYPES.map((ct) => (
              <button
                key={ct.type}
                onClick={() => setConditionType(ct.type)}
                className={clsx(
                  "flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-colors",
                  conditionType === ct.type
                    ? "bg-waldorf-accent/20 text-waldorf-accent"
                    : "bg-waldorf-surface text-waldorf-text-dim hover:text-waldorf-text"
                )}
              >
                {ct.icon}
                {ct.label}
              </button>
            ))}
          </div>

          {conditionType === "geofence_entry" ? (
            <div className="space-y-1.5">
              <div className="text-[10px] text-waldorf-text-dim">
                Center: {viewState.latitude.toFixed(4)},{" "}
                {viewState.longitude.toFixed(4)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-waldorf-text-dim">
                  Radius:
                </span>
                <input
                  type="range"
                  min={10}
                  max={500}
                  value={geofenceRadius}
                  onChange={(e) => setGeofenceRadius(Number(e.target.value))}
                  className="flex-1 h-1 accent-waldorf-accent"
                />
                <span className="text-[10px] font-mono text-waldorf-text w-12 text-right">
                  {geofenceRadius}km
                </span>
              </div>
            </div>
          ) : (
            <input
              type="text"
              placeholder={conditionConfig?.placeholder}
              value={conditionValue}
              onChange={(e) => setConditionValue(e.target.value)}
              className="w-full bg-waldorf-bg border border-waldorf-border rounded px-2 py-1.5 text-xs text-waldorf-text placeholder:text-waldorf-text-dim focus:outline-none focus:border-waldorf-accent"
            />
          )}

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={
                !name.trim() ||
                (conditionType !== "geofence_entry" && !conditionValue.trim())
              }
              className="flex-1 bg-waldorf-accent text-white text-xs py-1.5 rounded hover:bg-waldorf-accent-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Create Alert
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-3 bg-waldorf-surface text-waldorf-text-dim text-xs py-1.5 rounded hover:bg-waldorf-surface-bright transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {/* Watchlist alerts section */}
        <button
          onClick={() =>
            setExpandedSection(
              expandedSection === "alerts" ? "notifications" : "alerts"
            )
          }
          className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-waldorf-text-dim hover:bg-waldorf-surface-bright transition-colors"
        >
          <span>Watchlist ({alerts.length})</span>
          {expandedSection === "alerts" ? (
            <ChevronDown size={12} />
          ) : (
            <ChevronRight size={12} />
          )}
        </button>

        {expandedSection === "alerts" && (
          <div className="divide-y divide-waldorf-border/50">
            {alerts.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-waldorf-text-dim">
                <BellOff size={20} className="mx-auto mb-2 opacity-40" />
                No watchlist alerts configured.
                <br />
                Click + to add one.
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="px-4 py-2 hover:bg-waldorf-surface-bright/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <button
                        onClick={() => toggleAlert(alert.id)}
                        className="flex-shrink-0"
                      >
                        {alert.enabled ? (
                          <ToggleRight
                            size={16}
                            className="text-waldorf-success"
                          />
                        ) : (
                          <ToggleLeft
                            size={16}
                            className="text-waldorf-text-dim"
                          />
                        )}
                      </button>
                      <div className="min-w-0">
                        <div className="text-xs font-medium truncate">
                          {alert.name}
                        </div>
                        <div className="text-[10px] text-waldorf-text-dim flex items-center gap-1">
                          {
                            CONDITION_TYPES.find(
                              (c) => c.type === alert.condition.type
                            )?.icon
                          }
                          <span className="truncate">
                            {alert.condition.type === "geofence_entry"
                              ? `${alert.condition.geofence?.radiusKm}km radius`
                              : alert.condition.value}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {alert.triggerCount > 0 && (
                        <span className="text-[10px] text-waldorf-warning font-mono">
                          {alert.triggerCount}x
                        </span>
                      )}
                      <button
                        onClick={() => removeAlert(alert.id)}
                        className="p-1 hover:bg-waldorf-danger/20 rounded transition-colors"
                      >
                        <Trash2
                          size={10}
                          className="text-waldorf-text-dim hover:text-waldorf-danger"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Notifications section */}
        <button
          onClick={() =>
            setExpandedSection(
              expandedSection === "notifications" ? "alerts" : "notifications"
            )
          }
          className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-waldorf-text-dim hover:bg-waldorf-surface-bright transition-colors border-t border-waldorf-border"
        >
          <span className="flex items-center gap-1.5">
            Notifications
            {unreadCount > 0 && (
              <span className="text-[10px] bg-waldorf-danger text-white px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </span>
          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAllRead();
                  }}
                  className="p-0.5 hover:bg-waldorf-surface-bright rounded"
                  title="Mark all read"
                >
                  <CheckCheck size={10} className="text-waldorf-text-dim" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearNotifications();
                  }}
                  className="p-0.5 hover:bg-waldorf-surface-bright rounded"
                  title="Clear all"
                >
                  <X size={10} className="text-waldorf-text-dim" />
                </button>
              </>
            )}
            {expandedSection === "notifications" ? (
              <ChevronDown size={12} />
            ) : (
              <ChevronRight size={12} />
            )}
          </div>
        </button>

        {expandedSection === "notifications" && (
          <div className="divide-y divide-waldorf-border/50">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-waldorf-text-dim">
                No notifications yet. Alerts will appear here when triggered.
              </div>
            ) : (
              notifications.slice(0, 50).map((notif) => (
                <div
                  key={notif.id}
                  className={clsx(
                    "px-4 py-2 transition-colors",
                    !notif.read
                      ? "bg-waldorf-accent/5 border-l-2 border-l-waldorf-accent"
                      : "hover:bg-waldorf-surface-bright/50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-semibold text-waldorf-accent mb-0.5">
                        {notif.alertName}
                      </div>
                      <div className="text-xs text-waldorf-text leading-snug">
                        {notif.message}
                      </div>
                      <div className="text-[10px] text-waldorf-text-dim mt-0.5 flex items-center gap-1">
                        <Clock size={8} />
                        {formatDistanceToNow(new Date(notif.timestamp), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
