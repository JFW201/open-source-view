import { ScatterplotLayer, ArcLayer, TextLayer } from "@deck.gl/layers";
import type {
  Aircraft,
  Vessel,
  MilitaryBase,
  DataCenter,
  UnderseaCable,
  NuclearFacility,
  ConflictZone,
  LayerConfig,
} from "../../../types";

/**
 * Build all deck.gl layers from current data and layer configs.
 * Each layer respects visibility and opacity from the layer config.
 */

function getLayerConfig(
  configs: LayerConfig[],
  id: string
): { visible: boolean; opacity: number } {
  const cfg = configs.find((l) => l.id === id);
  return { visible: cfg?.visible ?? false, opacity: cfg?.opacity ?? 0.8 };
}

// ── Air Traffic Layer ─────────────────────────────────────────────────────

export function createAirTrafficLayer(
  aircraft: Aircraft[],
  configs: LayerConfig[]
) {
  const { visible, opacity } = getLayerConfig(configs, "air-traffic");
  if (!visible || aircraft.length === 0) return [];

  return [
    new ScatterplotLayer<Aircraft>({
      id: "air-traffic-dots",
      data: aircraft.filter((a) => !a.on_ground),
      getPosition: (d) => [d.longitude, d.latitude, d.baro_altitude],
      getRadius: 3000,
      getFillColor: [34, 197, 94, Math.round(opacity * 255)],
      radiusMinPixels: 2,
      radiusMaxPixels: 6,
      pickable: true,
      autoHighlight: true,
      highlightColor: [34, 197, 94, 200],
    }),
    new TextLayer<Aircraft>({
      id: "air-traffic-labels",
      data: aircraft.filter((a) => !a.on_ground && a.callsign),
      getPosition: (d) => [d.longitude, d.latitude, d.baro_altitude],
      getText: (d) => d.callsign,
      getSize: 11,
      getColor: [34, 197, 94, Math.round(opacity * 200)],
      getAngle: 0,
      getTextAnchor: "start",
      getAlignmentBaseline: "center",
      getPixelOffset: [8, 0],
      fontFamily: "JetBrains Mono, monospace",
      fontWeight: 500,
      billboard: true,
      sizeMinPixels: 8,
      sizeMaxPixels: 14,
    }),
  ];
}

// ── Sea Traffic Layer ─────────────────────────────────────────────────────

export function createSeaTrafficLayer(
  vessels: Vessel[],
  configs: LayerConfig[]
) {
  const { visible, opacity } = getLayerConfig(configs, "sea-traffic");
  if (!visible || vessels.length === 0) return [];

  return [
    new ScatterplotLayer<Vessel>({
      id: "sea-traffic-dots",
      data: vessels,
      getPosition: (d) => [d.longitude, d.latitude],
      getRadius: 4000,
      getFillColor: (d) => {
        const alpha = Math.round(opacity * 255);
        switch (d.ship_type) {
          case "Tanker": return [239, 68, 68, alpha];
          case "Cargo": return [96, 165, 250, alpha];
          case "Passenger": return [168, 85, 247, alpha];
          case "Military ops": return [245, 158, 11, alpha];
          case "Fishing": return [34, 197, 94, alpha];
          default: return [148, 163, 184, alpha];
        }
      },
      radiusMinPixels: 2,
      radiusMaxPixels: 8,
      pickable: true,
      autoHighlight: true,
      highlightColor: [96, 165, 250, 200],
    }),
  ];
}

// ── Military Bases Layer ──────────────────────────────────────────────────

export function createMilitaryBasesLayer(
  bases: MilitaryBase[],
  configs: LayerConfig[]
) {
  const { visible, opacity } = getLayerConfig(configs, "military-bases");
  if (!visible) return [];

  return [
    new ScatterplotLayer<MilitaryBase>({
      id: "military-bases",
      data: bases,
      getPosition: (d) => [d.longitude, d.latitude],
      getRadius: 15000,
      getFillColor: (d) => {
        const alpha = Math.round(opacity * 255);
        switch (d.operator) {
          case "US": return [59, 130, 246, alpha];
          case "RU": return [239, 68, 68, alpha];
          case "CN": return [245, 158, 11, alpha];
          case "GB": return [168, 85, 247, alpha];
          case "FR": return [34, 197, 94, alpha];
          case "NATO": return [96, 165, 250, alpha];
          default: return [148, 163, 184, alpha];
        }
      },
      getLineColor: [255, 255, 255, 60],
      lineWidthMinPixels: 1,
      stroked: true,
      radiusMinPixels: 4,
      radiusMaxPixels: 12,
      pickable: true,
      autoHighlight: true,
      highlightColor: [255, 255, 255, 80],
    }),
    new TextLayer<MilitaryBase>({
      id: "military-bases-labels",
      data: bases,
      getPosition: (d) => [d.longitude, d.latitude],
      getText: (d) => d.name,
      getSize: 11,
      getColor: [255, 255, 255, Math.round(opacity * 180)],
      getPixelOffset: [0, -14],
      fontFamily: "Inter, sans-serif",
      fontWeight: 500,
      billboard: true,
      sizeMinPixels: 0,
      sizeMaxPixels: 13,
    }),
  ];
}

// ── Data Centers Layer ────────────────────────────────────────────────────

export function createDataCentersLayer(
  centers: DataCenter[],
  configs: LayerConfig[]
) {
  const { visible, opacity } = getLayerConfig(configs, "data-centers");
  if (!visible) return [];

  return [
    new ScatterplotLayer<DataCenter>({
      id: "data-centers",
      data: centers,
      getPosition: (d) => [d.longitude, d.latitude],
      getRadius: (d) => Math.max(8000, (d.capacity_mw ?? 100) * 20),
      getFillColor: (d) => {
        const alpha = Math.round(opacity * 200);
        return d.type === "ai"
          ? [168, 85, 247, alpha]
          : [59, 130, 246, alpha];
      },
      getLineColor: [255, 255, 255, 40],
      stroked: true,
      lineWidthMinPixels: 1,
      radiusMinPixels: 3,
      radiusMaxPixels: 15,
      pickable: true,
      autoHighlight: true,
      highlightColor: [59, 130, 246, 150],
    }),
    new TextLayer<DataCenter>({
      id: "data-centers-labels",
      data: centers,
      getPosition: (d) => [d.longitude, d.latitude],
      getText: (d) => d.name,
      getSize: 11,
      getColor: [59, 130, 246, Math.round(opacity * 180)],
      getPixelOffset: [0, -14],
      fontFamily: "Inter, sans-serif",
      fontWeight: 500,
      billboard: true,
      sizeMinPixels: 0,
      sizeMaxPixels: 12,
    }),
  ];
}

// ── Undersea Cables Layer ─────────────────────────────────────────────────

export function createUnderseaCablesLayer(
  cables: UnderseaCable[],
  configs: LayerConfig[]
) {
  const { visible, opacity } = getLayerConfig(configs, "undersea-cables");
  if (!visible) return [];

  // Build arc segments from consecutive landing points
  interface CableSegment {
    source: [number, number];
    target: [number, number];
    name: string;
    capacity_tbps?: number;
  }

  const segments: CableSegment[] = [];
  for (const cable of cables) {
    for (let i = 0; i < cable.landing_points.length - 1; i++) {
      segments.push({
        source: cable.landing_points[i],
        target: cable.landing_points[i + 1],
        name: cable.name,
        capacity_tbps: cable.capacity_tbps,
      });
    }
  }

  return [
    new ArcLayer<CableSegment>({
      id: "undersea-cables",
      data: segments,
      getSourcePosition: (d) => d.source,
      getTargetPosition: (d) => d.target,
      getSourceColor: [168, 85, 247, Math.round(opacity * 200)],
      getTargetColor: [96, 165, 250, Math.round(opacity * 200)],
      getWidth: (d) => Math.max(1, Math.min(4, (d.capacity_tbps ?? 10) / 50)),
      widthMinPixels: 1,
      widthMaxPixels: 4,
      pickable: true,
      autoHighlight: true,
      highlightColor: [168, 85, 247, 200],
      greatCircle: true,
    }),
  ];
}

// ── Nuclear Facilities Layer ──────────────────────────────────────────────

export function createNuclearFacilitiesLayer(
  facilities: NuclearFacility[],
  configs: LayerConfig[]
) {
  const { visible, opacity } = getLayerConfig(configs, "nuclear-facilities");
  if (!visible) return [];

  return [
    new ScatterplotLayer<NuclearFacility>({
      id: "nuclear-facilities",
      data: facilities,
      getPosition: (d) => [d.longitude, d.latitude],
      getRadius: 12000,
      getFillColor: (d) => {
        const alpha = Math.round(opacity * 255);
        switch (d.type) {
          case "military": return [239, 68, 68, alpha];
          case "enrichment": return [245, 158, 11, alpha];
          case "power": return [34, 197, 94, alpha];
          case "research": return [59, 130, 246, alpha];
          default: return [148, 163, 184, alpha];
        }
      },
      getLineColor: [245, 158, 11, 100],
      stroked: true,
      lineWidthMinPixels: 2,
      radiusMinPixels: 4,
      radiusMaxPixels: 10,
      pickable: true,
      autoHighlight: true,
      highlightColor: [245, 158, 11, 150],
    }),
    new TextLayer<NuclearFacility>({
      id: "nuclear-facilities-labels",
      data: facilities,
      getPosition: (d) => [d.longitude, d.latitude],
      getText: (d) => d.name,
      getSize: 11,
      getColor: [245, 158, 11, Math.round(opacity * 180)],
      getPixelOffset: [0, -14],
      fontFamily: "Inter, sans-serif",
      fontWeight: 500,
      billboard: true,
      sizeMinPixels: 0,
      sizeMaxPixels: 12,
    }),
  ];
}

// ── Conflict Zones Layer ──────────────────────────────────────────────────

export function createConflictZonesLayer(
  zones: ConflictZone[],
  configs: LayerConfig[]
) {
  const { visible, opacity } = getLayerConfig(configs, "conflict-zones");
  if (!visible) return [];

  return [
    new ScatterplotLayer<ConflictZone>({
      id: "conflict-zones",
      data: zones,
      getPosition: (d) => [d.longitude, d.latitude],
      getRadius: (d) => d.radius_km * 1000,
      getFillColor: (d) => {
        const base = Math.round(opacity * 120);
        switch (d.intensity) {
          case "high": return [239, 68, 68, base];
          case "medium": return [245, 158, 11, base];
          case "low": return [234, 179, 8, Math.round(base * 0.5)];
          default: return [148, 163, 184, base];
        }
      },
      getLineColor: (d) => {
        switch (d.intensity) {
          case "high": return [239, 68, 68, 180];
          case "medium": return [245, 158, 11, 150];
          default: return [234, 179, 8, 100];
        }
      },
      stroked: true,
      lineWidthMinPixels: 1,
      radiusMinPixels: 10,
      radiusMaxPixels: 200,
      pickable: true,
      autoHighlight: true,
      highlightColor: [239, 68, 68, 80],
    }),
    new TextLayer<ConflictZone>({
      id: "conflict-zones-labels",
      data: zones,
      getPosition: (d) => [d.longitude, d.latitude],
      getText: (d) => d.name,
      getSize: 12,
      getColor: [239, 68, 68, Math.round(opacity * 220)],
      fontFamily: "Inter, sans-serif",
      fontWeight: 600,
      billboard: true,
      sizeMinPixels: 0,
      sizeMaxPixels: 14,
    }),
  ];
}
