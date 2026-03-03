import { create } from "zustand";
import type { MarketIndex, KalshiMarket } from "../types";

interface MarketState {
  indices: MarketIndex[];
  kalshiMarkets: KalshiMarket[];
  isLoadingIndices: boolean;
  isLoadingKalshi: boolean;
  lastUpdated: string | null;

  setIndices: (indices: MarketIndex[]) => void;
  setKalshiMarkets: (markets: KalshiMarket[]) => void;
  setIsLoadingIndices: (loading: boolean) => void;
  setIsLoadingKalshi: (loading: boolean) => void;
  setLastUpdated: (time: string) => void;
}

export const useMarketStore = create<MarketState>()((set) => ({
  indices: [],
  kalshiMarkets: [],
  isLoadingIndices: false,
  isLoadingKalshi: false,
  lastUpdated: null,

  setIndices: (indices) => set({ indices }),
  setKalshiMarkets: (markets) => set({ kalshiMarkets: markets }),
  setIsLoadingIndices: (loading) => set({ isLoadingIndices: loading }),
  setIsLoadingKalshi: (loading) => set({ isLoadingKalshi: loading }),
  setLastUpdated: (time) => set({ lastUpdated: time }),
}));
