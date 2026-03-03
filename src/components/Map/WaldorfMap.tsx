import React, { useCallback, useMemo, useRef } from "react";
import DeckGL from "@deck.gl/react";
import { Map as MapLibreMap, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import { useMapStore } from "../../store/mapStore";
import { useSettingsStore } from "../../store/settingsStore";
import { usePanelStore } from "../../store/panelStore";
import { COUNTRIES } from "../../data/countries";
import { MILITARY_BASES } from "../../data/militaryBases";
import { DATA_CENTERS } from "../../data/dataCenters";
import { UNDERSEA_CABLES } from "../../data/underseaCables";
import { NUCLEAR_FACILITIES } from "../../data/nuclearFacilities";
import { CONFLICT_ZONES } from "../../data/conflictZones";

import {
  createAirTrafficLayer,
  createSeaTrafficLayer,
  createMilitaryBasesLayer,
  createDataCentersLayer,
  createUnderseaCablesLayer,
  createNuclearFacilitiesLayer,
  createConflictZonesLayer,
} from "./layers";

const MAP_STYLES: Record<string, string> = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  satellite: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
};

export const WaldorfMap: React.FC = () => {
  const deckRef = useRef<any>(null);

  const viewState = useMapStore((s) => s.viewState);
  const setViewState = useMapStore((s) => s.setViewState);
  const layers = useMapStore((s) => s.layers);
  const aircraft = useMapStore((s) => s.aircraft);
  const vessels = useMapStore((s) => s.vessels);
  const setSelectedCountry = useMapStore((s) => s.setSelectedCountry);
  const mapStyle = useSettingsStore((s) => s.settings.mapStyle);
  const { setActivePanel } = usePanelStore();

  const handleViewStateChange = useCallback(
    ({ viewState: vs }: { viewState: any }) => {
      setViewState(vs);
    },
    [setViewState]
  );

  const handleMapClick = useCallback(
    (event: any) => {
      // Check if we clicked on a deck.gl feature
      if (event.object) return;

      // Reverse geocode: find nearest country to click point
      const [lng, lat] = event.coordinate ?? [0, 0];
      if (!lng && !lat) return;

      let nearest = COUNTRIES[0];
      let minDist = Infinity;
      for (const c of COUNTRIES) {
        const d = Math.hypot(c.latitude - lat, c.longitude - lng);
        if (d < minDist) {
          minDist = d;
          nearest = c;
        }
      }

      // Only select if click is reasonably close (within ~15 degrees)
      if (minDist < 15) {
        setSelectedCountry(nearest);
        setActivePanel("country");
      }
    },
    [setSelectedCountry, setActivePanel]
  );

  const handleLayerClick = useCallback(
    (info: any) => {
      if (!info.object) return;
      // Could open a detail tooltip or panel for the clicked feature
    },
    []
  );

  const deckLayers = useMemo(() => {
    return [
      ...createConflictZonesLayer(CONFLICT_ZONES, layers),
      ...createUnderseaCablesLayer(UNDERSEA_CABLES, layers),
      ...createMilitaryBasesLayer(MILITARY_BASES, layers),
      ...createDataCentersLayer(DATA_CENTERS, layers),
      ...createNuclearFacilitiesLayer(NUCLEAR_FACILITIES, layers),
      ...createSeaTrafficLayer(vessels, layers),
      ...createAirTrafficLayer(aircraft, layers),
    ];
  }, [layers, aircraft, vessels]);

  const getTooltip = useCallback(({ object }: { object: any }) => {
    if (!object) return null;

    // Military base
    if (object.branch) {
      return {
        html: `<div class="waldorf-tooltip">
          <div class="tooltip-title">${object.name}</div>
          <div class="tooltip-meta">${object.branch} — ${object.operator}</div>
          <div class="tooltip-detail">${object.country} | ${object.type}</div>
        </div>`,
        style: { backgroundColor: "transparent", border: "none", padding: 0 },
      };
    }

    // Data center
    if (object.operator && object.capacity_mw !== undefined) {
      return {
        html: `<div class="waldorf-tooltip">
          <div class="tooltip-title">${object.name}</div>
          <div class="tooltip-meta">${object.operator}</div>
          <div class="tooltip-detail">${object.capacity_mw} MW | ${object.type}</div>
        </div>`,
        style: { backgroundColor: "transparent", border: "none", padding: 0 },
      };
    }

    // Aircraft
    if (object.callsign !== undefined) {
      return {
        html: `<div class="waldorf-tooltip">
          <div class="tooltip-title">${object.callsign || object.icao24}</div>
          <div class="tooltip-meta">${object.origin_country}</div>
          <div class="tooltip-detail">Alt: ${Math.round(object.baro_altitude)}m | ${Math.round(object.velocity)} m/s</div>
        </div>`,
        style: { backgroundColor: "transparent", border: "none", padding: 0 },
      };
    }

    // Vessel
    if (object.mmsi) {
      return {
        html: `<div class="waldorf-tooltip">
          <div class="tooltip-title">${object.name}</div>
          <div class="tooltip-meta">${object.ship_type} | ${object.flag}</div>
          <div class="tooltip-detail">${object.speed} kn → ${object.destination || "N/A"}</div>
        </div>`,
        style: { backgroundColor: "transparent", border: "none", padding: 0 },
      };
    }

    // Nuclear facility
    if (object.capacity_mw !== undefined && object.type) {
      return {
        html: `<div class="waldorf-tooltip">
          <div class="tooltip-title">${object.name}</div>
          <div class="tooltip-meta">${object.country} — ${object.type}</div>
          <div class="tooltip-detail">${object.status}${object.capacity_mw ? ` | ${object.capacity_mw} MW` : ""}</div>
        </div>`,
        style: { backgroundColor: "transparent", border: "none", padding: 0 },
      };
    }

    // Conflict zone
    if (object.intensity) {
      return {
        html: `<div class="waldorf-tooltip">
          <div class="tooltip-title">${object.name}</div>
          <div class="tooltip-meta">${object.type} — ${object.intensity} intensity</div>
          <div class="tooltip-detail">${object.description}</div>
        </div>`,
        style: { backgroundColor: "transparent", border: "none", padding: 0 },
      };
    }

    // Cable segment
    if (object.capacity_tbps !== undefined) {
      return {
        html: `<div class="waldorf-tooltip">
          <div class="tooltip-title">${object.name}</div>
          <div class="tooltip-detail">${object.capacity_tbps} Tbps</div>
        </div>`,
        style: { backgroundColor: "transparent", border: "none", padding: 0 },
      };
    }

    return null;
  }, []);

  return (
    <div className="absolute inset-0">
      <DeckGL
        ref={deckRef}
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
        layers={deckLayers}
        onClick={handleMapClick}
        getTooltip={getTooltip as any}
        controller={{ dragRotate: true, touchRotate: true }}
      >
        <MapLibreMap
          mapStyle={MAP_STYLES[mapStyle] || MAP_STYLES.dark}
          attributionControl={false}
        >
          <NavigationControl position="bottom-right" showCompass showZoom />
        </MapLibreMap>
      </DeckGL>
    </div>
  );
};
