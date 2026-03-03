import { useEffect, useRef } from "react";
import { useMapStore } from "../store/mapStore";
import { cache, CACHE_TTL } from "../services/cache";
import { proxyFetchJSON } from "../services/proxy";
import type { CountryBoundaryFeature } from "../types";

// world-atlas TopoJSON uses ISO 3166-1 numeric IDs.
// We map them to ISO alpha-2 for matching our country data.
const ISO_NUM_TO_A2: Record<string, string> = {
  "004":"AF","008":"AL","012":"DZ","016":"AS","020":"AD","024":"AO","028":"AG",
  "032":"AR","036":"AU","040":"AT","044":"BS","048":"BH","050":"BD","051":"AM",
  "056":"BE","060":"BM","064":"BT","068":"BO","070":"BA","072":"BW","076":"BR",
  "084":"BZ","090":"SB","096":"BN","100":"BG","104":"MM","108":"BI","112":"BY",
  "116":"KH","120":"CM","124":"CA","140":"CF","144":"LK","148":"TD","152":"CL",
  "156":"CN","170":"CO","174":"KM","178":"CG","180":"CD","188":"CR","191":"HR",
  "192":"CU","196":"CY","203":"CZ","204":"BJ","208":"DK","214":"DO","218":"EC",
  "222":"SV","226":"GQ","231":"ET","232":"ER","233":"EE","242":"FJ","246":"FI",
  "250":"FR","266":"GA","268":"GE","270":"GM","275":"PS","276":"DE","288":"GH",
  "296":"KI","300":"GR","320":"GT","324":"GN","328":"GY","332":"HT","340":"HN",
  "348":"HU","352":"IS","356":"IN","360":"ID","364":"IR","368":"IQ","372":"IE",
  "376":"IL","380":"IT","384":"CI","388":"JM","392":"JP","398":"KZ","400":"JO",
  "404":"KE","408":"KP","410":"KR","414":"KW","417":"KG","418":"LA","422":"LB",
  "426":"LS","428":"LV","430":"LR","434":"LY","440":"LT","442":"LU","450":"MG",
  "454":"MW","458":"MY","462":"MV","466":"ML","470":"MT","478":"MR","480":"MU",
  "484":"MX","496":"MN","498":"MD","499":"ME","504":"MA","508":"MZ","512":"OM",
  "516":"NA","520":"NR","524":"NP","528":"NL","540":"NC","554":"NZ","558":"NI",
  "562":"NE","566":"NG","578":"NO","586":"PK","591":"PA","598":"PG","600":"PY",
  "604":"PE","608":"PH","616":"PL","620":"PT","630":"PR","634":"QA","642":"RO",
  "643":"RU","646":"RW","682":"SA","686":"SN","688":"RS","694":"SL","702":"SG",
  "703":"SK","704":"VN","705":"SI","706":"SO","710":"ZA","716":"ZW","724":"ES",
  "728":"SS","729":"SD","740":"SR","752":"SE","756":"CH","760":"SY","762":"TJ",
  "764":"TH","768":"TG","780":"TT","784":"AE","788":"TN","792":"TR","795":"TM",
  "800":"UG","804":"UA","807":"MK","818":"EG","826":"GB","834":"TZ","840":"US",
  "854":"BF","858":"UY","860":"UZ","862":"VE","887":"YE","894":"ZM",
  "-99":"XK","732":"EH",
};

const GEOJSON_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const CACHE_KEY = "country-boundaries-geojson";

/**
 * Fetches world country boundaries (TopoJSON → GeoJSON), caches permanently,
 * and stores the features in mapStore.
 */
export function useCountryBoundaries() {
  const setCountryBoundaries = useMapStore((s) => s.setCountryBoundaries);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    (async () => {
      // Try cache first
      const cached = await cache.get<CountryBoundaryFeature[]>(CACHE_KEY);
      if (cached && cached.length > 0) {
        setCountryBoundaries(cached);
        return;
      }

      try {
        // Fetch TopoJSON from CDN
        const topo = await proxyFetchJSON<any>(GEOJSON_URL);

        // Manual TopoJSON → GeoJSON conversion (avoids topojson-client dependency)
        const features = convertTopoToGeoJSON(topo);
        if (features.length > 0) {
          setCountryBoundaries(features);
          await cache.set(CACHE_KEY, features, CACHE_TTL.GEOJSON);
        }
      } catch (err) {
        console.warn("Failed to load country boundaries:", err);
        // Try stale cache as last resort
        const stale = await cache.get<CountryBoundaryFeature[]>(CACHE_KEY, true);
        if (stale) setCountryBoundaries(stale);
      }
    })();
  }, [setCountryBoundaries]);
}

/**
 * Convert a TopoJSON Topology → GeoJSON FeatureCollection.
 * This is a minimal implementation for the world-atlas countries format.
 */
function convertTopoToGeoJSON(topology: any): CountryBoundaryFeature[] {
  if (!topology?.objects?.countries?.geometries || !topology.arcs) return [];

  const { arcs: topoArcs, transform } = topology;
  const geometries = topology.objects.countries.geometries;

  // Decode delta-encoded arcs
  const decodedArcs: [number, number][][] = topoArcs.map((arc: number[][]) => {
    let x = 0, y = 0;
    return arc.map(([dx, dy]: number[]) => {
      x += dx;
      y += dy;
      if (transform) {
        return [
          x * transform.scale[0] + transform.translate[0],
          y * transform.scale[1] + transform.translate[1],
        ] as [number, number];
      }
      return [x, y] as [number, number];
    });
  });

  function resolveArc(index: number): [number, number][] {
    if (index >= 0) return decodedArcs[index];
    return [...decodedArcs[~index]].reverse();
  }

  function resolveRing(indices: number[]): [number, number][] {
    const coords: [number, number][] = [];
    for (const idx of indices) {
      const arc = resolveArc(idx);
      // Skip first point of subsequent arcs to avoid duplicates
      const start = coords.length === 0 ? 0 : 1;
      for (let i = start; i < arc.length; i++) {
        coords.push(arc[i]);
      }
    }
    return coords;
  }

  const features: CountryBoundaryFeature[] = [];

  for (const geom of geometries) {
    const isoA2 = ISO_NUM_TO_A2[String(geom.id)] ?? "";
    const props = {
      ISO_A2: isoA2,
      ISO_A3: "",
      NAME: geom.properties?.name ?? isoA2,
      ...geom.properties,
    };

    let geometry: any;

    if (geom.type === "Polygon") {
      geometry = {
        type: "Polygon",
        coordinates: geom.arcs.map(resolveRing),
      };
    } else if (geom.type === "MultiPolygon") {
      geometry = {
        type: "MultiPolygon",
        coordinates: geom.arcs.map((polygon: number[][]) =>
          polygon.map(resolveRing)
        ),
      };
    } else {
      continue;
    }

    features.push({
      type: "Feature",
      properties: props,
      geometry,
    });
  }

  return features;
}
