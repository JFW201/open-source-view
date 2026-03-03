import { proxyFetchJSON } from "../proxy";
import type { Vessel } from "../../types";

/**
 * AIS vessel tracking — uses AISHub community data or MarineTraffic API.
 * AISHub: http://www.aishub.net/api (free with data sharing)
 */

interface AISHubResponse {
  ERROR: boolean;
  ERROR_MESSAGE?: string;
  RECORDS?: number;
  positions?: AISHubPosition[];
}

interface AISHubPosition {
  MMSI: string;
  NAME: string;
  SHIPTYPE: number;
  LATITUDE: number;
  LONGITUDE: number;
  SOG: number;
  COG: number;
  HEADING: number;
  FLAG: string;
  DESTINATION: string;
  NAVSTAT: number;
}

const SHIP_TYPES: Record<number, string> = {
  30: "Fishing",
  31: "Towing",
  32: "Towing (large)",
  33: "Dredging",
  34: "Diving ops",
  35: "Military ops",
  36: "Sailing",
  37: "Pleasure craft",
  40: "High-speed craft",
  50: "Pilot vessel",
  51: "SAR vessel",
  52: "Tug",
  53: "Port tender",
  55: "Law enforcement",
  60: "Passenger",
  70: "Cargo",
  80: "Tanker",
  90: "Other",
};

const NAV_STATUSES: Record<number, string> = {
  0: "Under way using engine",
  1: "At anchor",
  2: "Not under command",
  3: "Restricted maneuverability",
  4: "Constrained by draught",
  5: "Moored",
  6: "Aground",
  7: "Engaged in fishing",
  8: "Under way sailing",
  15: "Undefined",
};

function shipTypeLabel(code: number): string {
  const base = Math.floor(code / 10) * 10;
  return SHIP_TYPES[base] || SHIP_TYPES[code] || "Unknown";
}

export async function fetchVessels(apiKey: string): Promise<Vessel[]> {
  const url = `https://data.aishub.net/ws.php?username=${encodeURIComponent(apiKey)}&format=1&output=json&compress=0`;

  const data = await proxyFetchJSON<AISHubResponse[]>(url);

  if (!Array.isArray(data) || data.length < 2 || !data[1]) return [];

  const positions = (data[1] as any) as AISHubPosition[];

  return positions.map((p) => ({
    mmsi: String(p.MMSI),
    name: p.NAME?.trim() || "Unknown",
    ship_type: shipTypeLabel(p.SHIPTYPE),
    latitude: p.LATITUDE,
    longitude: p.LONGITUDE,
    speed: p.SOG / 10,
    course: p.COG / 10,
    heading: p.HEADING,
    flag: p.FLAG || "",
    destination: p.DESTINATION?.trim() || "",
    status: NAV_STATUSES[p.NAVSTAT] || "Unknown",
  }));
}
