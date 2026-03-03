import { create } from "zustand";
import type { HistoricalSnapshot } from "../types";

interface PlaybackState {
  isRecording: boolean;
  isPlaying: boolean;
  snapshots: HistoricalSnapshot[];
  currentIndex: number;
  playbackSpeed: number; // 1x, 2x, 4x
  maxSnapshots: number;

  startRecording: () => void;
  stopRecording: () => void;
  addSnapshot: (snapshot: HistoricalSnapshot) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setCurrentIndex: (index: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  clearHistory: () => void;
}

export const usePlaybackStore = create<PlaybackState>()((set) => ({
  isRecording: false,
  isPlaying: false,
  snapshots: [],
  currentIndex: 0,
  playbackSpeed: 1,
  maxSnapshots: 360, // ~6 hours at 1 snapshot/min

  startRecording: () => set({ isRecording: true }),
  stopRecording: () => set({ isRecording: false }),

  addSnapshot: (snapshot) =>
    set((s) => {
      if (!s.isRecording) return s;
      const updated = [...s.snapshots, snapshot];
      if (updated.length > s.maxSnapshots) {
        updated.shift();
      }
      return { snapshots: updated, currentIndex: updated.length - 1 };
    }),

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  stop: () => set({ isPlaying: false, currentIndex: 0 }),

  setCurrentIndex: (index) => set({ currentIndex: index }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  clearHistory: () =>
    set({ snapshots: [], currentIndex: 0, isPlaying: false }),
}));
