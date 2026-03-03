import type { NuclearFacility } from "../types";

export const NUCLEAR_FACILITIES: NuclearFacility[] = [
  // ── United States ──────────────────────────────────────────────────────
  { id: "us-palo-verde", name: "Palo Verde", country: "US", latitude: 33.3883, longitude: -112.8614, type: "power", status: "active", capacity_mw: 3937 },
  { id: "us-south-texas", name: "South Texas Project", country: "US", latitude: 28.7950, longitude: -96.0489, type: "power", status: "active", capacity_mw: 2708 },
  { id: "us-vogtle", name: "Vogtle", country: "US", latitude: 33.1424, longitude: -81.7587, type: "power", status: "active", capacity_mw: 4700 },
  { id: "us-oak-ridge", name: "Oak Ridge National Lab (Y-12)", country: "US", latitude: 35.9306, longitude: -84.3106, type: "enrichment", status: "active" },
  { id: "us-los-alamos", name: "Los Alamos National Lab", country: "US", latitude: 35.8450, longitude: -106.2872, type: "military", status: "active" },
  { id: "us-pantex", name: "Pantex Plant", country: "US", latitude: 35.3175, longitude: -101.5558, type: "military", status: "active" },

  // ── Russia ─────────────────────────────────────────────────────────────
  { id: "ru-kursk", name: "Kursk NPP II", country: "RU", latitude: 51.6714, longitude: 35.6063, type: "power", status: "active", capacity_mw: 4696 },
  { id: "ru-leningrad", name: "Leningrad NPP II", country: "RU", latitude: 59.8253, longitude: 29.0569, type: "power", status: "active", capacity_mw: 4532 },
  { id: "ru-sarov", name: "Sarov (Arzamas-16)", country: "RU", latitude: 54.9358, longitude: 43.3238, type: "military", status: "active" },
  { id: "ru-seversk", name: "Seversk (Siberian Chemical Combine)", country: "RU", latitude: 56.6008, longitude: 84.8867, type: "enrichment", status: "active" },

  // ── China ──────────────────────────────────────────────────────────────
  { id: "cn-daya-bay", name: "Daya Bay / Ling Ao", country: "CN", latitude: 22.5993, longitude: 114.5464, type: "power", status: "active", capacity_mw: 6324 },
  { id: "cn-taishan", name: "Taishan", country: "CN", latitude: 21.9154, longitude: 112.9826, type: "power", status: "active", capacity_mw: 3520 },
  { id: "cn-lanzhou", name: "Lanzhou Gaseous Diffusion Plant", country: "CN", latitude: 36.0564, longitude: 103.8343, type: "enrichment", status: "active" },
  { id: "cn-mianyang", name: "China Academy of Engineering Physics", country: "CN", latitude: 31.4673, longitude: 104.7650, type: "military", status: "active" },

  // ── France ─────────────────────────────────────────────────────────────
  { id: "fr-gravelines", name: "Gravelines", country: "FR", latitude: 51.0153, longitude: 2.1075, type: "power", status: "active", capacity_mw: 5460 },
  { id: "fr-flamanville", name: "Flamanville (EPR)", country: "FR", latitude: 49.5374, longitude: -1.8817, type: "power", status: "active", capacity_mw: 4890 },
  { id: "fr-tricastin", name: "Tricastin (Georges Besse II)", country: "FR", latitude: 44.3322, longitude: 4.7218, type: "enrichment", status: "active" },

  // ── United Kingdom ─────────────────────────────────────────────────────
  { id: "uk-hinkley-c", name: "Hinkley Point C", country: "GB", latitude: 51.2085, longitude: -3.1294, type: "power", status: "under_construction", capacity_mw: 3260 },
  { id: "uk-sellafield", name: "Sellafield", country: "GB", latitude: 54.4209, longitude: -3.4951, type: "enrichment", status: "active" },
  { id: "uk-aldermaston", name: "AWE Aldermaston", country: "GB", latitude: 51.3575, longitude: -1.1589, type: "military", status: "active" },

  // ── India ──────────────────────────────────────────────────────────────
  { id: "in-kudankulam", name: "Kudankulam", country: "IN", latitude: 8.1722, longitude: 77.7147, type: "power", status: "active", capacity_mw: 2000 },
  { id: "in-bhabha", name: "Bhabha Atomic Research Centre", country: "IN", latitude: 19.0048, longitude: 72.9250, type: "research", status: "active" },

  // ── Others ─────────────────────────────────────────────────────────────
  { id: "pk-chashma", name: "Chashma", country: "PK", latitude: 32.3833, longitude: 71.3685, type: "power", status: "active", capacity_mw: 1330 },
  { id: "pk-kahuta", name: "Kahuta (KRL)", country: "PK", latitude: 33.5942, longitude: 73.4000, type: "enrichment", status: "active" },
  { id: "ir-bushehr", name: "Bushehr", country: "IR", latitude: 28.8319, longitude: 50.8847, type: "power", status: "active", capacity_mw: 1000 },
  { id: "ir-natanz", name: "Natanz", country: "IR", latitude: 33.7247, longitude: 51.7275, type: "enrichment", status: "active" },
  { id: "ir-fordow", name: "Fordow", country: "IR", latitude: 34.8822, longitude: 51.5858, type: "enrichment", status: "active" },
  { id: "kp-yongbyon", name: "Yongbyon", country: "KP", latitude: 39.7972, longitude: 125.7558, type: "military", status: "active" },
  { id: "il-dimona", name: "Dimona (Negev Nuclear Research Center)", country: "IL", latitude: 31.0014, longitude: 35.1444, type: "military", status: "active" },
  { id: "kr-kori", name: "Shin Kori", country: "KR", latitude: 35.3209, longitude: 129.2838, type: "power", status: "active", capacity_mw: 5600 },
  { id: "jp-kashiwazaki", name: "Kashiwazaki-Kariwa", country: "JP", latitude: 37.4264, longitude: 138.5978, type: "power", status: "active", capacity_mw: 7965 },
  { id: "ua-zaporizhzhia", name: "Zaporizhzhia", country: "UA", latitude: 47.5076, longitude: 34.5862, type: "power", status: "active", capacity_mw: 5700 },
];
