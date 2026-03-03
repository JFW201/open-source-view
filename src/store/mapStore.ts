import { create } from "zustand";
import type { ViewState, LayerConfig, Aircraft, Vessel, Country } from "../types";
import { LAYER_CONFIGS } from "../constants/layers";

interface MapState {
  viewState: ViewState;
  layers: LayerConfig[];
  aircraft: Aircraft[];
  vessels: Vessel[];
  selectedCountry: Country | null;
  mapProjection: "mercator" | "globe";
  isLoadingAir: boolean;
  isLoadingSea: boolean;

  setViewState: (viewState: Partial<ViewState>) => void;
  toggleLayer: (layerId: string) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  setAircraft: (aircraft: Aircraft[]) => void;
  setVessels: (vessels: Vessel[]) => void;
  setSelectedCountry: (country: Country | null) => void;
  setMapProjection: (projection: "mercator" | "globe") => void;
  setIsLoadingAir: (loading: boolean) => void;
  setIsLoadingSea: (loading: boolean) => void;
  isLayerVisible: (layerId: string) => boolean;
}

const INITIAL_VIEW_STATE: ViewState = {
  longitude: 0,
  latitude: 20,
  zoom: 2.5,
  pitch: 0,
  bearing: 0,
};

export const useMapStore = create<MapState>()((set, get) => ({
  viewState: INITIAL_VIEW_STATE,
  layers: LAYER_CONFIGS.map((l) => ({ ...l })),
  aircraft: [],
  vessels: [],
  selectedCountry: null,
  mapProjection: "globe",
  isLoadingAir: false,
  isLoadingSea: false,

  setViewState: (partial) =>
    set((state) => ({ viewState: { ...state.viewState, ...partial } })),

  toggleLayer: (layerId) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === layerId ? { ...l, visible: !l.visible } : l
      ),
    })),

  setLayerOpacity: (layerId, opacity) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === layerId ? { ...l, opacity } : l
      ),
    })),

  setAircraft: (aircraft) => set({ aircraft }),
  setVessels: (vessels) => set({ vessels }),
  setSelectedCountry: (country) => set({ selectedCountry: country }),
  setMapProjection: (projection) => set({ mapProjection: projection }),
  setIsLoadingAir: (loading) => set({ isLoadingAir: loading }),
  setIsLoadingSea: (loading) => set({ isLoadingSea: loading }),

  isLayerVisible: (layerId) => {
    const layer = get().layers.find((l) => l.id === layerId);
    return layer?.visible ?? false;
  },
}));
