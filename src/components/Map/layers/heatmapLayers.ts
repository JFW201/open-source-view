import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import type { Aircraft, Vessel, LayerConfig } from "../../../types";

function getLayerConfig(
  configs: LayerConfig[],
  id: string
): { visible: boolean; opacity: number } {
  const cfg = configs.find((l) => l.id === id);
  return { visible: cfg?.visible ?? false, opacity: cfg?.opacity ?? 0.8 };
}

export function createAircraftHeatmapLayer(
  aircraft: Aircraft[],
  configs: LayerConfig[]
) {
  const { visible, opacity } = getLayerConfig(configs, "air-heatmap");
  if (!visible || aircraft.length === 0) return [];

  const airborne = aircraft.filter((a) => !a.on_ground);

  return [
    new HeatmapLayer<Aircraft>({
      id: "aircraft-heatmap",
      data: airborne,
      getPosition: (d) => [d.longitude, d.latitude],
      getWeight: 1,
      radiusPixels: 30,
      intensity: 1.5,
      threshold: 0.05,
      opacity,
      colorRange: [
        [0, 25, 0, 25],
        [0, 85, 0, 100],
        [0, 170, 0, 150],
        [85, 255, 0, 180],
        [170, 255, 0, 210],
        [255, 255, 0, 240],
      ],
    }),
  ];
}

export function createVesselHeatmapLayer(
  vessels: Vessel[],
  configs: LayerConfig[]
) {
  const { visible, opacity } = getLayerConfig(configs, "sea-heatmap");
  if (!visible || vessels.length === 0) return [];

  return [
    new HeatmapLayer<Vessel>({
      id: "vessel-heatmap",
      data: vessels,
      getPosition: (d) => [d.longitude, d.latitude],
      getWeight: 1,
      radiusPixels: 35,
      intensity: 1.5,
      threshold: 0.05,
      opacity,
      colorRange: [
        [0, 0, 50, 25],
        [0, 0, 120, 100],
        [0, 60, 200, 150],
        [0, 140, 255, 180],
        [60, 200, 255, 210],
        [180, 240, 255, 240],
      ],
    }),
  ];
}
