import React from "react";
import {
  Newspaper,
  MapPin,
  TrendingUp,
  Sparkles,
  BarChart3,
  Twitter,
  Settings as SettingsIcon,
  PanelLeftClose,
  PanelLeft,
  Bell,
  Clock,
} from "lucide-react";
import { usePanelStore } from "../../store/panelStore";
import { useAlertStore } from "../../store/alertStore";
import { LayerPanel } from "../Map/controls/LayerPanel";
import type { PanelId } from "../../types";
import clsx from "clsx";

interface NavItem {
  id: PanelId;
  label: string;
  icon: React.ReactNode;
  badge?: () => number;
}

const NAV_ITEMS: NavItem[] = [
  { id: "news", label: "News", icon: <Newspaper size={16} /> },
  { id: "country", label: "Country", icon: <MapPin size={16} /> },
  { id: "markets", label: "Markets", icon: <TrendingUp size={16} /> },
  { id: "predictions", label: "Predict", icon: <BarChart3 size={16} /> },
  { id: "twitter", label: "X Feed", icon: <Twitter size={16} /> },
  { id: "ai", label: "AI Brief", icon: <Sparkles size={16} /> },
  {
    id: "alerts",
    label: "Alerts",
    icon: <Bell size={16} />,
    badge: () => useAlertStore.getState().unreadCount,
  },
  { id: "timeline", label: "Timeline", icon: <Clock size={16} /> },
  { id: "settings", label: "Settings", icon: <SettingsIcon size={16} /> },
];

export const Sidebar: React.FC = () => {
  const { activePanel, togglePanel, sidebarCollapsed, toggleSidebar } =
    usePanelStore();

  return (
    <aside
      className={clsx(
        "flex flex-col bg-waldorf-surface border-r border-waldorf-border transition-all duration-200",
        sidebarCollapsed ? "w-12" : "w-52"
      )}
    >
      {/* Collapse toggle */}
      <div className="flex items-center justify-end p-2 border-b border-waldorf-border">
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-waldorf-surface-bright rounded transition-colors"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <PanelLeft size={14} className="text-waldorf-text-dim" />
          ) : (
            <PanelLeftClose size={14} className="text-waldorf-text-dim" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 p-1.5">
        {NAV_ITEMS.map((item) => {
          const badgeCount = item.badge?.() ?? 0;
          return (
            <button
              key={item.id}
              onClick={() => togglePanel(item.id)}
              className={clsx(
                "flex items-center gap-2.5 rounded-md transition-colors relative",
                sidebarCollapsed ? "p-2 justify-center" : "px-3 py-2",
                activePanel === item.id
                  ? "bg-waldorf-accent/15 text-waldorf-accent"
                  : "text-waldorf-text-dim hover:text-waldorf-text hover:bg-waldorf-surface-bright"
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              {item.icon}
              {!sidebarCollapsed && (
                <span className="text-xs font-medium">{item.label}</span>
              )}
              {badgeCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[14px] h-[14px] flex items-center justify-center bg-waldorf-danger text-white text-[8px] font-bold rounded-full px-0.5">
                  {badgeCount > 99 ? "99+" : badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Layer panel (when expanded) */}
      {!sidebarCollapsed && (
        <div className="flex-1 overflow-y-auto border-t border-waldorf-border mt-2">
          <LayerPanel />
        </div>
      )}
    </aside>
  );
};
