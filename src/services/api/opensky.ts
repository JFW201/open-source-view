import { proxyFetchJSON } from "../proxy";
import type { Aircraft } from "../../types";

/**
 * OpenSky Network — live ADS-B flight data.
 * Free tier: anonymous 10 req/10s, authenticated 20 req/10s.
 * Docs: https://openskynetwork.github.io/opensky-api/rest.html
 */

interface OpenSkyState {
  time: number;
  states: (string | number | boolean | null)[][] | null;
}

export async function fetchAircraft(
  credentials?: { username: string; password: string } | null
): Promise<Aircraft[]> {
  const url = "https://opensky-network.org/api/states/all";
  const headers: Record<string, string> = {};

  if (credentials?.username && credentials?.password) {
    headers["Authorization"] =
      "Basic " + btoa(`${credentials.username}:${credentials.password}`);
  }

  const data = await proxyFetchJSON<OpenSkyState>(url, { headers });

  if (!data.states) return [];

  return data.states.map((s) => ({
    icao24: String(s[0] ?? ""),
    callsign: String(s[1] ?? "").trim(),
    origin_country: String(s[2] ?? ""),
    longitude: Number(s[5]) || 0,
    latitude: Number(s[6]) || 0,
    baro_altitude: Number(s[7]) || 0,
    velocity: Number(s[9]) || 0,
    true_track: Number(s[10]) || 0,
    on_ground: Boolean(s[8]),
    squawk: s[14] ? String(s[14]) : null,
  }));
}

/**
 * Fetch aircraft within a bounding box (more efficient for regional views).
 */
export async function fetchAircraftInBounds(
  bounds: { south: number; north: number; west: number; east: number },
  credentials?: { username: string; password: string } | null
): Promise<Aircraft[]> {
  const url =
    `https://opensky-network.org/api/states/all` +
    `?lamin=${bounds.south}&lomin=${bounds.west}` +
    `&lamax=${bounds.north}&lomax=${bounds.east}`;

  const headers: Record<string, string> = {};
  if (credentials?.username && credentials?.password) {
    headers["Authorization"] =
      "Basic " + btoa(`${credentials.username}:${credentials.password}`);
  }

  const data = await proxyFetchJSON<OpenSkyState>(url, { headers });

  if (!data.states) return [];

  return data.states.map((s) => ({
    icao24: String(s[0] ?? ""),
    callsign: String(s[1] ?? "").trim(),
    origin_country: String(s[2] ?? ""),
    longitude: Number(s[5]) || 0,
    latitude: Number(s[6]) || 0,
    baro_altitude: Number(s[7]) || 0,
    velocity: Number(s[9]) || 0,
    true_track: Number(s[10]) || 0,
    on_ground: Boolean(s[8]),
    squawk: s[14] ? String(s[14]) : null,
  }));
}
