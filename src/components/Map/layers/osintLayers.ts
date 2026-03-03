import { ScatterplotLayer, TextLayer } from "@deck.gl/layers";
import type {
  GdeltEvent,
  AcledEvent,
  FirmsHotspot,
  LayerConfig,
} from "../../../types";

function getLayerConfig(
  configs: LayerConfig[],
  id: string
): { visible: boolean; opacity: number } {
  const cfg = configs.find((l) => l.id === id);
  return { visible: cfg?.visible ?? false, opacity: cfg?.opacity ?? 0.8 };
}

// ── GDELT Events Layer ──────────────────────────────────────────────────────

export function createGdeltEventsLayer(
  events: GdeltEvent[],
  configs: LayerConfig[]
) {
  const { visible, opacity } = getLayerConfig(configs, "gdelt-events");
  if (!visible || events.length === 0) return [];

  return [
    new ScatterplotLayer<GdeltEvent>({
      id: "gdelt-events",
      data: events,
      getPosition: (d) => [d.longitude, d.latitude],
      getRadius: (d) => Math.max(5000, Math.min(30000, d.numMentions * 500)),
      getFillColor: (d) => {
        const alpha = Math.round(opacity * 200);
        // Goldstein scale: -10 (conflict) to +10 (cooperation)
        if (d.goldsteinScale <= -5) return [239, 68, 68, alpha]; // red — high conflict
        if (d.goldsteinScale <= -2) return [245, 158, 11, alpha]; // orange — moderate conflict
        if (d.goldsteinScale <= 2) return [148, 163, 184, alpha]; // gray — neutral
        if (d.goldsteinScale <= 5) return [96, 165, 250, alpha]; // blue — moderate cooperation
        return [34, 197, 94, alpha]; // green — high cooperation
      },
      getLineColor: [255, 255, 255, 40],
      stroked: true,
      lineWidthMinPixels: 1,
      radiusMinPixels: 3,
      radiusMaxPixels: 15,
      pickable: true,
      autoHighlight: true,
      highlightColor: [168, 85, 247, 150],
    }),
  ];
}

// ── ACLED Conflict Events Layer ─────────────────────────────────────────────

export function createAcledEventsLayer(
  events: AcledEvent[],
  configs: LayerConfig[]
) {
  const { visible, opacity } = getLayerConfig(configs, "acled-events");
  if (!visible || events.length === 0) return [];

  return [
    new ScatterplotLayer<AcledEvent>({
      id: "acled-events",
      data: events,
      getPosition: (d) => [d.longitude, d.latitude],
      getRadius: (d) =>
        Math.max(6000, Math.min(40000, (d.fatalities + 1) * 3000)),
      getFillColor: (d) => {
        const alpha = Math.round(opacity * 200);
        // Color by event type
        switch (d.eventType) {
          case "Battles":
            return [239, 68, 68, alpha]; // red
          case "Explosions/Remote violence":
            return [245, 158, 11, alpha]; // orange
          case "Violence against civilians":
            return [220, 38, 127, alpha]; // pink
          case "Protests":
            return [96, 165, 250, alpha]; // blue
          case "Riots":
            return [168, 85, 247, alpha]; // purple
          case "Strategic developments":
            return [34, 197, 94, alpha]; // green
          default:
            return [148, 163, 184, alpha]; // gray
        }
      },
      getLineColor: (d) => {
        if (d.fatalities >= 10) return [239, 68, 68, 255];
        if (d.fatalities >= 1) return [245, 158, 11, 200];
        return [255, 255, 255, 60];
      },
      stroked: true,
      lineWidthMinPixels: 1,
      radiusMinPixels: 3,
      radiusMaxPixels: 18,
      pickable: true,
      autoHighlight: true,
      highlightColor: [239, 68, 68, 150],
    }),
    new TextLayer<AcledEvent>({
      id: "acled-events-labels",
      data: events.filter((e) => e.fatalities >= 5),
      getPosition: (d) => [d.longitude, d.latitude],
      getText: (d) => `${d.eventType} (${d.fatalities})`,
      getSize: 10,
      getColor: [239, 68, 68, Math.round(opacity * 220)],
      getPixelOffset: [0, -14],
      fontFamily: "Inter, sans-serif",
      fontWeight: 600,
      billboard: true,
      sizeMinPixels: 0,
      sizeMaxPixels: 12,
    }),
  ];
}

// ── NASA FIRMS Fire Hotspots Layer ──────────────────────────────────────────

export function createFirmsHotspotsLayer(
  hotspots: FirmsHotspot[],
  configs: LayerConfig[]
) {
  const { visible, opacity } = getLayerConfig(configs, "firms-hotspots");
  if (!visible || hotspots.length === 0) return [];

  return [
    new ScatterplotLayer<FirmsHotspot>({
      id: "firms-hotspots",
      data: hotspots,
      getPosition: (d) => [d.longitude, d.latitude],
      getRadius: (d) => Math.max(3000, Math.min(20000, d.frp * 200)),
      getFillColor: (d) => {
        const alpha = Math.round(opacity * 200);
        // Color by fire radiative power (FRP)
        if (d.frp >= 100) return [239, 68, 68, alpha]; // red — intense
        if (d.frp >= 30) return [245, 158, 11, alpha]; // orange — moderate
        if (d.frp >= 10) return [234, 179, 8, alpha]; // yellow — low-moderate
        return [245, 200, 60, alpha]; // light yellow — low
      },
      radiusMinPixels: 2,
      radiusMaxPixels: 10,
      pickable: true,
      autoHighlight: true,
      highlightColor: [245, 158, 11, 200],
    }),
  ];
}
