import {
  ScatterplotLayer,
  TextLayer,
  PolygonLayer,
  LineLayer,
} from "@deck.gl/layers";
import type {
  MapAnnotation,
  Measurement,
  MeasurementPoint,
} from "../../../types";

export function createAnnotationLayers(annotations: MapAnnotation[]) {
  if (annotations.length === 0) return [];

  const markers = annotations.filter((a) => a.type === "marker");
  const polygons = annotations.filter(
    (a) => a.type === "polygon" && a.polygonCoords
  );
  const circles = annotations.filter(
    (a) => a.type === "circle" && a.radiusKm
  );

  const layers: any[] = [];

  // Markers
  if (markers.length > 0) {
    layers.push(
      new ScatterplotLayer<MapAnnotation>({
        id: "annotation-markers",
        data: markers,
        getPosition: (d) => [d.coordinates[0], d.coordinates[1]],
        getRadius: 8000,
        getFillColor: (d) => [...d.color, 200] as [number, number, number, number],
        getLineColor: [255, 255, 255, 180],
        stroked: true,
        lineWidthMinPixels: 2,
        radiusMinPixels: 6,
        radiusMaxPixels: 12,
        pickable: true,
        autoHighlight: true,
        highlightColor: [255, 255, 255, 80],
      }),
      new TextLayer<MapAnnotation>({
        id: "annotation-marker-labels",
        data: markers,
        getPosition: (d) => [d.coordinates[0], d.coordinates[1]],
        getText: (d) => d.name,
        getSize: 12,
        getColor: (d) => [...d.color, 220] as [number, number, number, number],
        getPixelOffset: [0, -16],
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
        billboard: true,
        sizeMinPixels: 10,
        sizeMaxPixels: 14,
      })
    );
  }

  // Polygons
  if (polygons.length > 0) {
    layers.push(
      new PolygonLayer<MapAnnotation>({
        id: "annotation-polygons",
        data: polygons,
        getPolygon: (d) => d.polygonCoords!,
        getFillColor: (d) => [...d.color, 40] as [number, number, number, number],
        getLineColor: (d) => [...d.color, 200] as [number, number, number, number],
        getLineWidth: 2,
        lineWidthMinPixels: 1,
        pickable: true,
        autoHighlight: true,
        highlightColor: [255, 255, 255, 40],
      }),
      new TextLayer<MapAnnotation>({
        id: "annotation-polygon-labels",
        data: polygons,
        getPosition: (d) => [d.coordinates[0], d.coordinates[1]],
        getText: (d) => d.name,
        getSize: 12,
        getColor: (d) => [...d.color, 220] as [number, number, number, number],
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
        billboard: true,
        sizeMinPixels: 10,
        sizeMaxPixels: 14,
      })
    );
  }

  // Circles (approximated as polygons with many sides)
  if (circles.length > 0) {
    const circlePolygonData = circles.map((c) => {
      const points: [number, number][] = [];
      const numSides = 64;
      const lat = c.coordinates[1];
      const lng = c.coordinates[0];
      const radiusDeg = c.radiusKm! / 111.32;

      for (let i = 0; i <= numSides; i++) {
        const angle = (i / numSides) * 2 * Math.PI;
        const dLat = radiusDeg * Math.cos(angle);
        const dLng =
          (radiusDeg * Math.sin(angle)) / Math.cos((lat * Math.PI) / 180);
        points.push([lng + dLng, lat + dLat]);
      }

      return { ...c, circlePolygon: points };
    });

    layers.push(
      new PolygonLayer({
        id: "annotation-circles",
        data: circlePolygonData,
        getPolygon: (d: any) => d.circlePolygon,
        getFillColor: (d: any) => [...d.color, 30] as [number, number, number, number],
        getLineColor: (d: any) => [...d.color, 180] as [number, number, number, number],
        getLineWidth: 1.5,
        lineWidthMinPixels: 1,
        pickable: true,
        autoHighlight: true,
      }),
      new TextLayer({
        id: "annotation-circle-labels",
        data: circlePolygonData,
        getPosition: (d: any) => [d.coordinates[0], d.coordinates[1]],
        getText: (d: any) => `${d.name}\n${d.radiusKm}km`,
        getSize: 11,
        getColor: (d: any) => [...d.color, 220] as [number, number, number, number],
        fontFamily: "Inter, sans-serif",
        fontWeight: 500,
        billboard: true,
        sizeMinPixels: 9,
        sizeMaxPixels: 13,
      })
    );
  }

  return layers;
}

// Pending polygon outline
export function createPendingPolygonLayer(points: [number, number][]) {
  if (points.length < 2) {
    if (points.length === 1) {
      return [
        new ScatterplotLayer({
          id: "pending-polygon-points",
          data: points.map((p) => ({ position: p })),
          getPosition: (d: any) => d.position,
          getRadius: 5000,
          getFillColor: [59, 130, 246, 200],
          radiusMinPixels: 4,
          radiusMaxPixels: 8,
        }),
      ];
    }
    return [];
  }

  const segments = [];
  for (let i = 0; i < points.length - 1; i++) {
    segments.push({
      source: points[i],
      target: points[i + 1],
    });
  }

  return [
    new LineLayer({
      id: "pending-polygon-lines",
      data: segments,
      getSourcePosition: (d: any) => d.source,
      getTargetPosition: (d: any) => d.target,
      getColor: [59, 130, 246, 180],
      getWidth: 2,
      widthMinPixels: 1,
    }),
    new ScatterplotLayer({
      id: "pending-polygon-points",
      data: points.map((p) => ({ position: p })),
      getPosition: (d: any) => d.position,
      getRadius: 5000,
      getFillColor: [59, 130, 246, 200],
      getLineColor: [255, 255, 255, 200],
      stroked: true,
      lineWidthMinPixels: 1,
      radiusMinPixels: 4,
      radiusMaxPixels: 8,
    }),
  ];
}

// Measurement lines
export function createMeasurementLayers(
  measurements: Measurement[],
  pendingPoints: MeasurementPoint[]
) {
  const layers: any[] = [];

  // Saved measurements
  for (const m of measurements) {
    if (m.points.length < 2) continue;

    const segments = [];
    for (let i = 0; i < m.points.length - 1; i++) {
      segments.push({
        source: [m.points[i].longitude, m.points[i].latitude] as [
          number,
          number,
        ],
        target: [m.points[i + 1].longitude, m.points[i + 1].latitude] as [
          number,
          number,
        ],
      });
    }

    layers.push(
      new LineLayer({
        id: `measurement-line-${m.id}`,
        data: segments,
        getSourcePosition: (d: any) => d.source,
        getTargetPosition: (d: any) => d.target,
        getColor: [245, 158, 11, 200],
        getWidth: 2,
        widthMinPixels: 1,
      }),
      new ScatterplotLayer({
        id: `measurement-points-${m.id}`,
        data: m.points.map((p) => ({
          position: [p.longitude, p.latitude],
        })),
        getPosition: (d: any) => d.position,
        getRadius: 4000,
        getFillColor: [245, 158, 11, 220],
        getLineColor: [255, 255, 255, 200],
        stroked: true,
        lineWidthMinPixels: 1,
        radiusMinPixels: 3,
        radiusMaxPixels: 6,
      }),
      new TextLayer({
        id: `measurement-label-${m.id}`,
        data: [
          {
            position: [
              (m.points[0].longitude +
                m.points[m.points.length - 1].longitude) /
                2,
              (m.points[0].latitude +
                m.points[m.points.length - 1].latitude) /
                2,
            ],
            text:
              m.totalDistanceKm < 1
                ? `${(m.totalDistanceKm * 1000).toFixed(0)}m`
                : `${m.totalDistanceKm.toFixed(1)}km`,
          },
        ],
        getPosition: (d: any) => d.position,
        getText: (d: any) => d.text,
        getSize: 12,
        getColor: [245, 158, 11, 240],
        getPixelOffset: [0, -12],
        fontFamily: "JetBrains Mono, monospace",
        fontWeight: 700,
        billboard: true,
        sizeMinPixels: 10,
        sizeMaxPixels: 14,
        background: true,
        getBackgroundColor: [18, 18, 26, 200],
        backgroundPadding: [4, 2],
      })
    );
  }

  // Pending measurement
  if (pendingPoints.length >= 1) {
    const points = pendingPoints.map((p) => ({
      position: [p.longitude, p.latitude],
    }));

    layers.push(
      new ScatterplotLayer({
        id: "pending-measure-points",
        data: points,
        getPosition: (d: any) => d.position,
        getRadius: 5000,
        getFillColor: [245, 158, 11, 220],
        getLineColor: [255, 255, 255, 220],
        stroked: true,
        lineWidthMinPixels: 1,
        radiusMinPixels: 4,
        radiusMaxPixels: 8,
      })
    );

    if (pendingPoints.length >= 2) {
      const segments = [];
      for (let i = 0; i < pendingPoints.length - 1; i++) {
        segments.push({
          source: [pendingPoints[i].longitude, pendingPoints[i].latitude],
          target: [
            pendingPoints[i + 1].longitude,
            pendingPoints[i + 1].latitude,
          ],
        });
      }

      layers.push(
        new LineLayer({
          id: "pending-measure-lines",
          data: segments,
          getSourcePosition: (d: any) => d.source,
          getTargetPosition: (d: any) => d.target,
          getColor: [245, 158, 11, 160],
          getWidth: 2,
          widthMinPixels: 1,
          // dashed effect would need custom shader, use solid for now
        })
      );
    }
  }

  return layers;
}
