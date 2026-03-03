import type { MilitaryBase } from "../types";

export const MILITARY_BASES: MilitaryBase[] = [
  // ── United States ──────────────────────────────────────────────────────
  { id: "us-pentagon", name: "The Pentagon", country: "US", operator: "US", branch: "DoD HQ", latitude: 38.8719, longitude: -77.0563, type: "headquarters" },
  { id: "us-norfolk", name: "Naval Station Norfolk", country: "US", operator: "US", branch: "Navy", latitude: 36.9465, longitude: -76.3015, type: "naval" },
  { id: "us-sandiego", name: "Naval Base San Diego", country: "US", operator: "US", branch: "Navy", latitude: 32.6839, longitude: -117.1285, type: "naval" },
  { id: "us-campbell", name: "Fort Campbell", country: "US", operator: "US", branch: "Army", latitude: 36.6627, longitude: -87.4748, type: "army" },
  { id: "us-bragg", name: "Fort Liberty (Bragg)", country: "US", operator: "US", branch: "Army", latitude: 35.1392, longitude: -78.9967, type: "army" },
  { id: "us-hood", name: "Fort Cavazos (Hood)", country: "US", operator: "US", branch: "Army", latitude: 31.1349, longitude: -97.7756, type: "army" },
  { id: "us-nellis", name: "Nellis AFB", country: "US", operator: "US", branch: "Air Force", latitude: 36.2360, longitude: -115.0342, type: "air" },
  { id: "us-edwards", name: "Edwards AFB", country: "US", operator: "US", branch: "Air Force", latitude: 34.9054, longitude: -117.8839, type: "air" },
  { id: "us-offutt", name: "Offutt AFB (STRATCOM)", country: "US", operator: "US", branch: "Air Force", latitude: 41.1186, longitude: -95.9125, type: "air" },
  { id: "us-peterson", name: "Peterson SFB (SPACECOM)", country: "US", operator: "US", branch: "Space Force", latitude: 38.8094, longitude: -104.7133, type: "space" },

  // ── US Overseas ────────────────────────────────────────────────────────
  { id: "us-ramstein", name: "Ramstein Air Base", country: "DE", operator: "US", branch: "Air Force", latitude: 49.4369, longitude: 7.6003, type: "air" },
  { id: "us-aviano", name: "Aviano Air Base", country: "IT", operator: "US", branch: "Air Force", latitude: 46.0319, longitude: 12.5965, type: "air" },
  { id: "us-yokosuka", name: "Naval Base Yokosuka", country: "JP", operator: "US", branch: "Navy", latitude: 35.2841, longitude: 139.6708, type: "naval" },
  { id: "us-kadena", name: "Kadena Air Base", country: "JP", operator: "US", branch: "Air Force", latitude: 26.3516, longitude: 127.7675, type: "air" },
  { id: "us-osan", name: "Osan Air Base", country: "KR", operator: "US", branch: "Air Force", latitude: 37.0901, longitude: 127.0298, type: "air" },
  { id: "us-humphreys", name: "Camp Humphreys", country: "KR", operator: "US", branch: "Army", latitude: 36.9627, longitude: 127.0311, type: "army" },
  { id: "us-diegogarcia", name: "Diego Garcia", country: "IO", operator: "US", branch: "Navy", latitude: -7.3195, longitude: 72.4229, type: "naval" },
  { id: "us-incirlik", name: "Incirlik Air Base", country: "TR", operator: "US", branch: "Air Force", latitude: 37.0019, longitude: 35.4259, type: "air" },
  { id: "us-aldhafra", name: "Al Dhafra Air Base", country: "AE", operator: "US", branch: "Air Force", latitude: 24.2482, longitude: 54.5476, type: "air" },
  { id: "us-aludeid", name: "Al Udeid Air Base", country: "QA", operator: "US", branch: "Air Force", latitude: 25.1173, longitude: 51.3150, type: "air" },
  { id: "us-djibouti", name: "Camp Lemonnier", country: "DJ", operator: "US", branch: "Navy", latitude: 11.5469, longitude: 43.1556, type: "naval" },
  { id: "us-guam", name: "Naval Base Guam", country: "GU", operator: "US", branch: "Navy", latitude: 13.4443, longitude: 144.7937, type: "naval" },
  { id: "us-rota", name: "Naval Station Rota", country: "ES", operator: "US", branch: "Navy", latitude: 36.6361, longitude: -6.3528, type: "naval" },

  // ── Russia ─────────────────────────────────────────────────────────────
  { id: "ru-severomorsk", name: "Severomorsk (Northern Fleet)", country: "RU", operator: "RU", branch: "Navy", latitude: 69.0733, longitude: 33.4197, type: "naval" },
  { id: "ru-kaliningrad", name: "Kaliningrad (Baltic Fleet)", country: "RU", operator: "RU", branch: "Navy", latitude: 54.7104, longitude: 20.4522, type: "naval" },
  { id: "ru-sevastopol", name: "Sevastopol (Black Sea Fleet)", country: "RU", operator: "RU", branch: "Navy", latitude: 44.6166, longitude: 33.5254, type: "naval" },
  { id: "ru-vladivostok", name: "Vladivostok (Pacific Fleet)", country: "RU", operator: "RU", branch: "Navy", latitude: 43.1056, longitude: 131.8735, type: "naval" },
  { id: "ru-engels", name: "Engels-2 Air Base", country: "RU", operator: "RU", branch: "Air Force", latitude: 51.4829, longitude: 46.2002, type: "air" },
  { id: "ru-tartus", name: "Tartus Naval Facility", country: "SY", operator: "RU", branch: "Navy", latitude: 34.8860, longitude: 35.8868, type: "naval" },
  { id: "ru-hmeimim", name: "Khmeimim Air Base", country: "SY", operator: "RU", branch: "Air Force", latitude: 35.4085, longitude: 35.9487, type: "air" },

  // ── China ──────────────────────────────────────────────────────────────
  { id: "cn-yulin", name: "Yulin Naval Base", country: "CN", operator: "CN", branch: "Navy", latitude: 18.2270, longitude: 109.5658, type: "naval" },
  { id: "cn-qingdao", name: "Qingdao Naval Base", country: "CN", operator: "CN", branch: "Navy", latitude: 36.0671, longitude: 120.3826, type: "naval" },
  { id: "cn-zhanjiang", name: "Zhanjiang Naval Base", country: "CN", operator: "CN", branch: "Navy", latitude: 21.2707, longitude: 110.3594, type: "naval" },
  { id: "cn-djibouti", name: "PLA Support Base Djibouti", country: "DJ", operator: "CN", branch: "Navy", latitude: 11.5891, longitude: 43.0826, type: "naval" },
  { id: "cn-fiery-cross", name: "Fiery Cross Reef", country: "CN", operator: "CN", branch: "Navy", latitude: 9.5464, longitude: 112.8833, type: "naval" },

  // ── United Kingdom ─────────────────────────────────────────────────────
  { id: "uk-faslane", name: "HMNB Clyde (Faslane)", country: "GB", operator: "GB", branch: "Navy", latitude: 56.0671, longitude: -4.8219, type: "naval" },
  { id: "uk-akrotiri", name: "RAF Akrotiri", country: "CY", operator: "GB", branch: "Air Force", latitude: 34.5900, longitude: 32.9878, type: "air" },
  { id: "uk-lakenheath", name: "RAF Lakenheath", country: "GB", operator: "US/GB", branch: "Air Force", latitude: 52.4093, longitude: 0.5608, type: "air" },

  // ── France ─────────────────────────────────────────────────────────────
  { id: "fr-toulon", name: "Toulon Naval Base", country: "FR", operator: "FR", branch: "Navy", latitude: 43.1031, longitude: 5.9291, type: "naval" },
  { id: "fr-iletlongue", name: "Île Longue (Nuclear Sub)", country: "FR", operator: "FR", branch: "Navy", latitude: 48.3082, longitude: -4.5221, type: "naval" },
  { id: "fr-djibouti", name: "FFDj Djibouti", country: "DJ", operator: "FR", branch: "Multi", latitude: 11.5537, longitude: 43.1487, type: "army" },

  // ── NATO / Others ──────────────────────────────────────────────────────
  { id: "nato-shape", name: "SHAPE (NATO HQ)", country: "BE", operator: "NATO", branch: "HQ", latitude: 50.5017, longitude: 3.7250, type: "headquarters" },
  { id: "il-palmachim", name: "Palmachim Air Base", country: "IL", operator: "IL", branch: "Air Force", latitude: 31.8978, longitude: 34.6905, type: "air" },
  { id: "il-nevatim", name: "Nevatim Air Base", country: "IL", operator: "IL", branch: "Air Force", latitude: 31.2079, longitude: 34.8176, type: "air" },
  { id: "in-vizag", name: "INS Visakhapatnam", country: "IN", operator: "IN", branch: "Navy", latitude: 17.7137, longitude: 83.3011, type: "naval" },
  { id: "in-karwar", name: "INS Kadamba (Karwar)", country: "IN", operator: "IN", branch: "Navy", latitude: 14.7851, longitude: 74.1213, type: "naval" },
  { id: "au-pineGap", name: "Pine Gap (Joint)", country: "AU", operator: "AU/US", branch: "Intelligence", latitude: -23.7989, longitude: 133.7369, type: "intelligence" },
  { id: "au-tindal", name: "RAAF Tindal", country: "AU", operator: "AU", branch: "Air Force", latitude: -14.5214, longitude: 132.3782, type: "air" },
];
