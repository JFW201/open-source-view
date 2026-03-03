import { create } from "zustand";
import type { SearchResult } from "../types";

interface SearchState {
  query: string;
  results: SearchResult[];
  isOpen: boolean;
  isLoading: boolean;
  isAIEnabled: boolean;
  aiResult: string | null;
  selectedIndex: number;

  setQuery: (query: string) => void;
  setResults: (results: SearchResult[]) => void;
  setIsOpen: (open: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  toggleAI: () => void;
  setAIResult: (result: string | null) => void;
  setSelectedIndex: (index: number) => void;
  clear: () => void;
}

export const useSearchStore = create<SearchState>()((set) => ({
  query: "",
  results: [],
  isOpen: false,
  isLoading: false,
  isAIEnabled: false,
  aiResult: null,
  selectedIndex: -1,

  setQuery: (query) => set({ query, selectedIndex: -1 }),
  setResults: (results) => set({ results }),
  setIsOpen: (isOpen) => set({ isOpen, selectedIndex: -1 }),
  setIsLoading: (isLoading) => set({ isLoading }),
  toggleAI: () => set((s) => ({ isAIEnabled: !s.isAIEnabled })),
  setAIResult: (aiResult) => set({ aiResult }),
  setSelectedIndex: (selectedIndex) => set({ selectedIndex }),
  clear: () => set({ query: "", results: [], isOpen: false, aiResult: null, selectedIndex: -1 }),
}));
