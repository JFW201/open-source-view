import { proxyFetchJSON } from "../proxy";
import type { Aircraft } from "../../types";

/**
 * Aviation Stack — real-time and historical flight data.
 * Primary aerial tracking source. Provides global flight positions.
 * Docs: https://aviationstack.com/documentation
 */

interface AviationStackResponse {
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
  data: AviationStackFlight[];
}

interface AviationStackFlight {
  flight_date: string;
  flight_status: string;
  departure: {
    airport: string;
    iata: string;
    icao: string;
    timezone: string;
    scheduled: string;
    actual: string | null;
  };
  arrival: {
    airport: string;
    iata: string;
    icao: string;
    timezone: string;
    scheduled: string;
    actual: string | null;
  };
  airline: {
    name: string;
    iata: string;
    icao: string;
  };
  flight: {
    number: string;
    iata: string;
    icao: string;
  };
  live: {
    updated: string;
    latitude: number;
    longitude: number;
    altitude: number;
    direction: number;
    speed_horizontal: number;
    speed_vertical: number;
    is_ground: boolean;
  } | null;
}

/**
 * Fetch currently active flights with live position data.
 * Note: Live tracking requires a paid Aviation Stack plan.
 */
export async function fetchLiveFlights(apiKey: string): Promise<Aircraft[]> {
  const url = `https://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_status=active&limit=100`;

  const data = await proxyFetchJSON<AviationStackResponse>(url);

  return data.data
    .filter((f) => f.live && f.live.latitude !== 0)
    .map((f) => ({
      icao24: f.flight.icao || f.flight.iata || "",
      callsign: f.flight.iata || f.flight.number || "",
      origin_country: f.airline?.name || "",
      longitude: f.live!.longitude,
      latitude: f.live!.latitude,
      baro_altitude: f.live!.altitude,
      velocity: f.live!.speed_horizontal,
      true_track: f.live!.direction,
      on_ground: f.live!.is_ground,
      squawk: null,
    }));
}

/**
 * Fetch flights for a specific airline or route.
 */
export async function fetchFlightsByAirline(
  apiKey: string,
  airlineIata: string
): Promise<Aircraft[]> {
  const url = `https://api.aviationstack.com/v1/flights?access_key=${apiKey}&airline_iata=${airlineIata}&flight_status=active&limit=100`;

  const data = await proxyFetchJSON<AviationStackResponse>(url);

  return data.data
    .filter((f) => f.live && f.live.latitude !== 0)
    .map((f) => ({
      icao24: f.flight.icao || f.flight.iata || "",
      callsign: f.flight.iata || f.flight.number || "",
      origin_country: f.airline?.name || "",
      longitude: f.live!.longitude,
      latitude: f.live!.latitude,
      baro_altitude: f.live!.altitude,
      velocity: f.live!.speed_horizontal,
      true_track: f.live!.direction,
      on_ground: f.live!.is_ground,
      squawk: null,
    }));
}

/**
 * Fetch flights departing from or arriving at a specific airport.
 */
export async function fetchFlightsByAirport(
  apiKey: string,
  airportIata: string,
  type: "departure" | "arrival" = "departure"
): Promise<Aircraft[]> {
  const param = type === "departure" ? "dep_iata" : "arr_iata";
  const url = `https://api.aviationstack.com/v1/flights?access_key=${apiKey}&${param}=${airportIata}&flight_status=active&limit=100`;

  const data = await proxyFetchJSON<AviationStackResponse>(url);

  return data.data
    .filter((f) => f.live && f.live.latitude !== 0)
    .map((f) => ({
      icao24: f.flight.icao || f.flight.iata || "",
      callsign: f.flight.iata || f.flight.number || "",
      origin_country: f.airline?.name || "",
      longitude: f.live!.longitude,
      latitude: f.live!.latitude,
      baro_altitude: f.live!.altitude,
      velocity: f.live!.speed_horizontal,
      true_track: f.live!.direction,
      on_ground: f.live!.is_ground,
      squawk: null,
    }));
}
