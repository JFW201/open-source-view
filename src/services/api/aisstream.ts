import type { Vessel } from "../../types";

/**
 * AISStream.io — real-time AIS vessel tracking via WebSocket.
 * Primary maritime data source. Provides live ship positions worldwide.
 * Docs: https://aisstream.io/documentation
 */

type AISStreamCallback = (vessels: Vessel[]) => void;

interface AISStreamMessage {
  MessageType: string;
  MetaData: {
    MMSI: number;
    MMSI_String: string;
    ShipName: string;
    latitude: number;
    longitude: number;
    time_utc: string;
  };
  Message: {
    PositionReport?: {
      Sog: number;
      Cog: number;
      TrueHeading: number;
      NavigationalStatus: number;
    };
    ShipStaticData?: {
      Type: number;
      Name: string;
      Destination: string;
      CallSign: string;
      Flag: number;
    };
  };
}

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
  14: "AIS-SART active",
  15: "Undefined",
};

const SHIP_TYPE_MAP: Record<number, string> = {
  30: "Fishing", 31: "Towing", 32: "Towing (large)", 33: "Dredging",
  34: "Diving ops", 35: "Military ops", 36: "Sailing", 37: "Pleasure craft",
  40: "High-speed craft", 50: "Pilot vessel", 51: "SAR vessel", 52: "Tug",
  53: "Port tender", 55: "Law enforcement", 60: "Passenger", 70: "Cargo",
  80: "Tanker", 90: "Other",
};

export class AISStreamClient {
  private ws: WebSocket | null = null;
  private apiKey: string;
  private vesselMap = new Map<string, Vessel>();
  private callback: AISStreamCallback;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private flushInterval: ReturnType<typeof setInterval> | null = null;

  constructor(apiKey: string, callback: AISStreamCallback) {
    this.apiKey = apiKey;
    this.callback = callback;
  }

  connect(
    boundingBoxes?: Array<[[number, number], [number, number]]>
  ): void {
    const url = "wss://stream.aisstream.io/v0/stream";
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;

      const subscribeMsg = {
        APIKey: this.apiKey,
        BoundingBoxes: boundingBoxes ?? [
          [[-90, -180], [90, 180]], // Worldwide
        ],
        FilterMessageTypes: ["PositionReport", "ShipStaticData"],
      };

      this.ws?.send(JSON.stringify(subscribeMsg));

      // Flush accumulated vessel updates to the callback every 2 seconds
      this.flushInterval = setInterval(() => {
        if (this.vesselMap.size > 0) {
          this.callback(Array.from(this.vesselMap.values()));
        }
      }, 2000);
    };

    this.ws.onmessage = (event) => {
      try {
        const msg: AISStreamMessage = JSON.parse(event.data);
        this.processMessage(msg);
      } catch {
        // Skip malformed messages
      }
    };

    this.ws.onclose = () => {
      this.cleanup();
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = Math.pow(2, this.reconnectAttempts) * 1000;
        setTimeout(() => this.connect(boundingBoxes), delay);
      }
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  private processMessage(msg: AISStreamMessage): void {
    const mmsi = msg.MetaData.MMSI_String;
    const existing = this.vesselMap.get(mmsi);

    const vessel: Vessel = {
      mmsi,
      name: msg.MetaData.ShipName?.trim() || existing?.name || "Unknown",
      ship_type: existing?.ship_type || "Unknown",
      latitude: msg.MetaData.latitude,
      longitude: msg.MetaData.longitude,
      speed: msg.Message.PositionReport?.Sog ?? existing?.speed ?? 0,
      course: msg.Message.PositionReport?.Cog ?? existing?.course ?? 0,
      heading: msg.Message.PositionReport?.TrueHeading ?? existing?.heading ?? 0,
      flag: existing?.flag || "",
      destination: existing?.destination || "",
      status:
        msg.Message.PositionReport?.NavigationalStatus !== undefined
          ? NAV_STATUSES[msg.Message.PositionReport.NavigationalStatus] ?? "Unknown"
          : existing?.status || "Unknown",
    };

    // Enrich with static data if available
    if (msg.Message.ShipStaticData) {
      const sd = msg.Message.ShipStaticData;
      const typeBase = Math.floor(sd.Type / 10) * 10;
      vessel.ship_type = SHIP_TYPE_MAP[typeBase] || SHIP_TYPE_MAP[sd.Type] || "Unknown";
      vessel.destination = sd.Destination?.trim() || vessel.destination;
      if (sd.Name) vessel.name = sd.Name.trim();
    }

    this.vesselMap.set(mmsi, vessel);
  }

  disconnect(): void {
    this.maxReconnectAttempts = 0; // Prevent reconnection
    this.ws?.close();
    this.cleanup();
  }

  private cleanup(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  getVesselCount(): number {
    return this.vesselMap.size;
  }
}
