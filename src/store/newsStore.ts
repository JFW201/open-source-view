import { create } from "zustand";
import type { NewsItem, NewsCategory, GrokSummary, Tweet } from "../types";

interface NewsState {
  items: NewsItem[];
  filteredCategory: NewsCategory | "all";
  filteredCountry: string | null;
  searchQuery: string;
  isLoading: boolean;
  lastUpdated: string | null;
  aiSummary: GrokSummary | null;
  isGeneratingSummary: boolean;
  tweets: Tweet[];
  isLoadingTweets: boolean;

  setItems: (items: NewsItem[]) => void;
  addItems: (items: NewsItem[]) => void;
  setFilteredCategory: (category: NewsCategory | "all") => void;
  setFilteredCountry: (country: string | null) => void;
  setSearchQuery: (query: string) => void;
  setIsLoading: (loading: boolean) => void;
  setLastUpdated: (time: string) => void;
  setAiSummary: (summary: GrokSummary | null) => void;
  setIsGeneratingSummary: (loading: boolean) => void;
  setTweets: (tweets: Tweet[]) => void;
  setIsLoadingTweets: (loading: boolean) => void;
  getFilteredItems: () => NewsItem[];
}

export const useNewsStore = create<NewsState>()((set, get) => ({
  items: [],
  filteredCategory: "all",
  filteredCountry: null,
  searchQuery: "",
  isLoading: false,
  lastUpdated: null,
  aiSummary: null,
  isGeneratingSummary: false,
  tweets: [],
  isLoadingTweets: false,

  setItems: (items) => set({ items }),

  addItems: (newItems) =>
    set((state) => {
      const existingIds = new Set(state.items.map((i) => i.id));
      const unique = newItems.filter((i) => !existingIds.has(i.id));
      const merged = [...unique, ...state.items]
        .sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        )
        .slice(0, 500);
      return { items: merged };
    }),

  setFilteredCategory: (category) => set({ filteredCategory: category }),
  setFilteredCountry: (country) => set({ filteredCountry: country }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setLastUpdated: (time) => set({ lastUpdated: time }),
  setAiSummary: (summary) => set({ aiSummary: summary }),
  setIsGeneratingSummary: (loading) => set({ isGeneratingSummary: loading }),
  setTweets: (tweets) => set({ tweets }),
  setIsLoadingTweets: (loading) => set({ isLoadingTweets: loading }),

  getFilteredItems: () => {
    const { items, filteredCategory, filteredCountry, searchQuery } = get();
    let filtered = items;

    if (filteredCategory !== "all") {
      filtered = filtered.filter((i) => i.category === filteredCategory);
    }
    if (filteredCountry) {
      filtered = filtered.filter((i) => i.country === filteredCountry);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.source.toLowerCase().includes(q)
      );
    }
    return filtered;
  },
}));
