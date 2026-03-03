import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { MapAnnotation, Measurement, MeasurementPoint } from "../types";

type AnnotationMode = "none" | "marker" | "polygon" | "circle" | "measure";

interface AnnotationState {
  annotations: MapAnnotation[];
  measurements: Measurement[];
  activeMode: AnnotationMode;
  pendingPolygonPoints: [number, number][];
  pendingMeasurePoints: MeasurementPoint[];
  selectedAnnotationId: string | null;

  setActiveMode: (mode: AnnotationMode) => void;
  addAnnotation: (annotation: MapAnnotation) => void;
  removeAnnotation: (id: string) => void;
  updateAnnotation: (
    id: string,
    updates: Partial<MapAnnotation>
  ) => void;
  clearAnnotations: () => void;
  setSelectedAnnotation: (id: string | null) => void;

  addPendingPolygonPoint: (point: [number, number]) => void;
  finishPolygon: (name: string, description: string, color: [number, number, number]) => void;
  cancelPending: () => void;

  addPendingMeasurePoint: (point: MeasurementPoint) => void;
  finishMeasurement: () => void;
  removeMeasurement: (id: string) => void;
  clearMeasurements: () => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const useAnnotationStore = create<AnnotationState>()(
  persist(
    (set, get) => ({
      annotations: [],
      measurements: [],
      activeMode: "none",
      pendingPolygonPoints: [],
      pendingMeasurePoints: [],
      selectedAnnotationId: null,

      setActiveMode: (mode) =>
        set({ activeMode: mode, pendingPolygonPoints: [], pendingMeasurePoints: [] }),

      addAnnotation: (annotation) =>
        set((s) => ({ annotations: [...s.annotations, annotation] })),

      removeAnnotation: (id) =>
        set((s) => ({
          annotations: s.annotations.filter((a) => a.id !== id),
          selectedAnnotationId:
            s.selectedAnnotationId === id ? null : s.selectedAnnotationId,
        })),

      updateAnnotation: (id, updates) =>
        set((s) => ({
          annotations: s.annotations.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),

      clearAnnotations: () =>
        set({ annotations: [], selectedAnnotationId: null }),

      setSelectedAnnotation: (id) => set({ selectedAnnotationId: id }),

      addPendingPolygonPoint: (point) =>
        set((s) => ({
          pendingPolygonPoints: [...s.pendingPolygonPoints, point],
        })),

      finishPolygon: (name, description, color) => {
        const { pendingPolygonPoints } = get();
        if (pendingPolygonPoints.length < 3) return;

        const annotation: MapAnnotation = {
          id: generateId(),
          type: "polygon",
          name,
          description,
          color,
          coordinates: pendingPolygonPoints[0],
          polygonCoords: [...pendingPolygonPoints, pendingPolygonPoints[0]],
          createdAt: new Date().toISOString(),
        };

        set((s) => ({
          annotations: [...s.annotations, annotation],
          pendingPolygonPoints: [],
          activeMode: "none",
        }));
      },

      cancelPending: () =>
        set({ pendingPolygonPoints: [], pendingMeasurePoints: [], activeMode: "none" }),

      addPendingMeasurePoint: (point) =>
        set((s) => ({
          pendingMeasurePoints: [...s.pendingMeasurePoints, point],
        })),

      finishMeasurement: () => {
        const { pendingMeasurePoints } = get();
        if (pendingMeasurePoints.length < 2) return;

        let total = 0;
        for (let i = 1; i < pendingMeasurePoints.length; i++) {
          total += haversineDistance(
            pendingMeasurePoints[i - 1].latitude,
            pendingMeasurePoints[i - 1].longitude,
            pendingMeasurePoints[i].latitude,
            pendingMeasurePoints[i].longitude
          );
        }

        const measurement: Measurement = {
          id: generateId(),
          points: [...pendingMeasurePoints],
          totalDistanceKm: total,
          createdAt: new Date().toISOString(),
        };

        set((s) => ({
          measurements: [...s.measurements, measurement],
          pendingMeasurePoints: [],
          activeMode: "none",
        }));
      },

      removeMeasurement: (id) =>
        set((s) => ({
          measurements: s.measurements.filter((m) => m.id !== id),
        })),

      clearMeasurements: () => set({ measurements: [], pendingMeasurePoints: [] }),
    }),
    {
      name: "waldorf-annotations",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        annotations: state.annotations,
        measurements: state.measurements,
      }),
    }
  )
);
