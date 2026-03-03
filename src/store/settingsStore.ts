import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AppSettings } from "../types";

interface SettingsState {
  settings: AppSettings;
  setApiKey: (service: string, key: string) => void;
  removeApiKey: (service: string) => void;
  getApiKey: (service: string) => string | undefined;
  hasApiKey: (service: string) => boolean;
  setMapStyle: (style: AppSettings["mapStyle"]) => void;
  setRefreshInterval: (seconds: number) => void;
  setMaxNewsItems: (count: number) => void;
  setEnableNotifications: (enabled: boolean) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  apiKeys: {},
  mapStyle: "dark",
  refreshInterval: 60,
  maxNewsItems: 200,
  enableNotifications: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,

      setApiKey: (service, key) =>
        set((state) => ({
          settings: {
            ...state.settings,
            apiKeys: { ...state.settings.apiKeys, [service]: key },
          },
        })),

      removeApiKey: (service) =>
        set((state) => {
          const { [service]: _, ...rest } = state.settings.apiKeys;
          return { settings: { ...state.settings, apiKeys: rest } };
        }),

      getApiKey: (service) => get().settings.apiKeys[service],

      hasApiKey: (service) => {
        const key = get().settings.apiKeys[service];
        return !!key && key.trim().length > 0;
      },

      setMapStyle: (style) =>
        set((state) => ({ settings: { ...state.settings, mapStyle: style } })),

      setRefreshInterval: (seconds) =>
        set((state) => ({
          settings: { ...state.settings, refreshInterval: seconds },
        })),

      setMaxNewsItems: (count) =>
        set((state) => ({
          settings: { ...state.settings, maxNewsItems: count },
        })),

      setEnableNotifications: (enabled) =>
        set((state) => ({
          settings: { ...state.settings, enableNotifications: enabled },
        })),
    }),
    {
      name: "waldorf-settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
