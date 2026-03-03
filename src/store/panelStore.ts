import { create } from "zustand";
import type { PanelId } from "../types";

interface PanelState {
  activePanel: PanelId | null;
  panelWidth: number;
  sidebarCollapsed: boolean;

  setActivePanel: (panel: PanelId | null) => void;
  togglePanel: (panel: PanelId) => void;
  setPanelWidth: (width: number) => void;
  toggleSidebar: () => void;
}

export const usePanelStore = create<PanelState>()((set, get) => ({
  activePanel: "news",
  panelWidth: 420,
  sidebarCollapsed: false,

  setActivePanel: (panel) => set({ activePanel: panel }),

  togglePanel: (panel) => {
    const current = get().activePanel;
    set({ activePanel: current === panel ? null : panel });
  },

  setPanelWidth: (width) => set({ panelWidth: Math.max(320, Math.min(600, width)) }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}));
