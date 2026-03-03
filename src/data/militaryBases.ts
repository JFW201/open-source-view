import type { MilitaryBase } from "../types";

export const MILITARY_BASES: MilitaryBase[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // ── United States — Domestic ─────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  // HQ / Command
  { id: "us-pentagon", name: "The Pentagon", country: "US", operator: "US", branch: "DoD HQ", latitude: 38.8719, longitude: -77.0563, type: "headquarters" },

  // Navy
  { id: "us-norfolk", name: "Naval Station Norfolk", country: "US", operator: "US", branch: "Navy", latitude: 36.9465, longitude: -76.3015, type: "naval" },
  { id: "us-sandiego", name: "Naval Base San Diego", country: "US", operator: "US", branch: "Navy", latitude: 32.6839, longitude: -117.1285, type: "naval" },
  { id: "us-pearl-harbor", name: "Naval Station Pearl Harbor", country: "US", operator: "US", branch: "Navy", latitude: 21.3530, longitude: -157.9739, type: "naval" },
  { id: "us-kings-bay", name: "Naval Submarine Base Kings Bay", country: "US", operator: "US", branch: "Navy", latitude: 30.7966, longitude: -81.5151, type: "naval" },
  { id: "us-mayport", name: "Naval Station Mayport", country: "US", operator: "US", branch: "Navy", latitude: 30.3918, longitude: -81.4065, type: "naval" },

  // Army
  { id: "us-campbell", name: "Fort Campbell", country: "US", operator: "US", branch: "Army", latitude: 36.6627, longitude: -87.4748, type: "army" },
  { id: "us-bragg", name: "Fort Liberty (Bragg)", country: "US", operator: "US", branch: "Army", latitude: 35.1392, longitude: -78.9967, type: "army" },
  { id: "us-hood", name: "Fort Cavazos (Hood)", country: "US", operator: "US", branch: "Army", latitude: 31.1349, longitude: -97.7756, type: "army" },
  { id: "us-stewart", name: "Fort Stewart", country: "US", operator: "US", branch: "Army", latitude: 31.8691, longitude: -81.6095, type: "army" },
  { id: "us-drum", name: "Fort Drum", country: "US", operator: "US", branch: "Army", latitude: 44.0541, longitude: -75.7588, type: "army" },
  { id: "us-riley", name: "Fort Riley", country: "US", operator: "US", branch: "Army", latitude: 39.0553, longitude: -96.7643, type: "army" },
  { id: "us-jblm", name: "Joint Base Lewis-McChord", country: "US", operator: "US", branch: "Army/Air Force", latitude: 47.0854, longitude: -122.5806, type: "army" },
  { id: "us-eisenhower", name: "Fort Eisenhower (Gordon)", country: "US", operator: "US", branch: "Army", latitude: 33.4170, longitude: -82.1375, type: "army" },
  { id: "us-moore", name: "Fort Moore (Benning)", country: "US", operator: "US", branch: "Army", latitude: 32.3593, longitude: -84.9488, type: "army" },

  // Air Force
  { id: "us-nellis", name: "Nellis AFB", country: "US", operator: "US", branch: "Air Force", latitude: 36.2360, longitude: -115.0342, type: "air" },
  { id: "us-edwards", name: "Edwards AFB", country: "US", operator: "US", branch: "Air Force", latitude: 34.9054, longitude: -117.8839, type: "air" },
  { id: "us-offutt", name: "Offutt AFB (STRATCOM)", country: "US", operator: "US", branch: "Air Force", latitude: 41.1186, longitude: -95.9125, type: "air" },
  { id: "us-whiteman", name: "Whiteman AFB", country: "US", operator: "US", branch: "Air Force", latitude: 38.7302, longitude: -93.5479, type: "air" },
  { id: "us-barksdale", name: "Barksdale AFB", country: "US", operator: "US", branch: "Air Force", latitude: 32.5013, longitude: -93.6627, type: "air" },
  { id: "us-langley", name: "Joint Base Langley-Eustis", country: "US", operator: "US", branch: "Air Force", latitude: 37.0833, longitude: -76.3606, type: "air" },
  { id: "us-creech", name: "Creech AFB", country: "US", operator: "US", branch: "Air Force", latitude: 36.5839, longitude: -115.6711, type: "air" },
  { id: "us-eglin", name: "Eglin AFB", country: "US", operator: "US", branch: "Air Force", latitude: 30.4833, longitude: -86.5254, type: "air" },
  { id: "us-tyndall", name: "Tyndall AFB", country: "US", operator: "US", branch: "Air Force", latitude: 30.0696, longitude: -85.5763, type: "air" },
  { id: "us-jbsa-lackland", name: "JBSA Lackland", country: "US", operator: "US", branch: "Air Force", latitude: 29.3842, longitude: -98.6152, type: "air" },

  // Space Force
  { id: "us-peterson", name: "Peterson SFB (SPACECOM)", country: "US", operator: "US", branch: "Space Force", latitude: 38.8094, longitude: -104.7133, type: "space" },
  { id: "us-vandenberg", name: "Vandenberg SFB", country: "US", operator: "US", branch: "Space Force", latitude: 34.7420, longitude: -120.5724, type: "space" },
  { id: "us-schriever", name: "Schriever SFB", country: "US", operator: "US", branch: "Space Force", latitude: 38.8058, longitude: -104.5286, type: "space" },
  { id: "us-buckley", name: "Buckley SFB", country: "US", operator: "US", branch: "Space Force", latitude: 39.7017, longitude: -104.7516, type: "space" },

  // Marine Corps
  { id: "us-pendleton", name: "Camp Pendleton", country: "US", operator: "US", branch: "Marine Corps", latitude: 33.3036, longitude: -117.3553, type: "army" },
  { id: "us-miramar", name: "MCAS Miramar", country: "US", operator: "US", branch: "Marine Corps", latitude: 32.8684, longitude: -117.1424, type: "air" },
  { id: "us-quantico", name: "MCB Quantico", country: "US", operator: "US", branch: "Marine Corps", latitude: 38.5218, longitude: -77.3174, type: "army" },
  { id: "us-cherry-point", name: "MCAS Cherry Point", country: "US", operator: "US", branch: "Marine Corps", latitude: 34.9009, longitude: -76.8807, type: "air" },

  // Intelligence / NSA / CIA
  { id: "us-nsa-meade", name: "NSA Fort Meade", country: "US", operator: "US", branch: "Intelligence", latitude: 39.1086, longitude: -76.7712, type: "intelligence" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── United States — Overseas ─────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  // Europe
  { id: "us-ramstein", name: "Ramstein Air Base", country: "DE", operator: "US", branch: "Air Force", latitude: 49.4369, longitude: 7.6003, type: "air" },
  { id: "us-aviano", name: "Aviano Air Base", country: "IT", operator: "US", branch: "Air Force", latitude: 46.0319, longitude: 12.5965, type: "air" },
  { id: "us-rota", name: "Naval Station Rota", country: "ES", operator: "US", branch: "Navy", latitude: 36.6361, longitude: -6.3528, type: "naval" },
  { id: "us-moron", name: "Morón Air Base", country: "ES", operator: "US", branch: "Air Force", latitude: 37.1749, longitude: -5.6158, type: "air" },
  { id: "us-sigonella", name: "NAS Sigonella", country: "IT", operator: "US", branch: "Navy", latitude: 37.4017, longitude: 14.9222, type: "naval" },
  { id: "us-naples", name: "Naval Support Activity Naples", country: "IT", operator: "US", branch: "Navy", latitude: 40.8185, longitude: 14.1879, type: "naval" },

  // Japan
  { id: "us-yokosuka", name: "Naval Base Yokosuka", country: "JP", operator: "US", branch: "Navy", latitude: 35.2841, longitude: 139.6708, type: "naval" },
  { id: "us-kadena", name: "Kadena Air Base", country: "JP", operator: "US", branch: "Air Force", latitude: 26.3516, longitude: 127.7675, type: "air" },
  { id: "us-misawa", name: "Misawa Air Base", country: "JP", operator: "US", branch: "Air Force", latitude: 40.7032, longitude: 141.3684, type: "air" },
  { id: "us-yokota", name: "Yokota Air Base", country: "JP", operator: "US", branch: "Air Force", latitude: 35.7485, longitude: 139.3485, type: "air" },
  { id: "us-atsugi", name: "Naval Air Facility Atsugi", country: "JP", operator: "US", branch: "Navy", latitude: 35.4546, longitude: 139.4494, type: "naval" },
  { id: "us-camp-zama", name: "Camp Zama", country: "JP", operator: "US", branch: "Army", latitude: 35.4895, longitude: 139.3942, type: "army" },

  // South Korea
  { id: "us-osan", name: "Osan Air Base", country: "KR", operator: "US", branch: "Air Force", latitude: 37.0901, longitude: 127.0298, type: "air" },
  { id: "us-humphreys", name: "Camp Humphreys", country: "KR", operator: "US", branch: "Army", latitude: 36.9627, longitude: 127.0311, type: "army" },
  { id: "us-kunsan", name: "Kunsan Air Base", country: "KR", operator: "US", branch: "Air Force", latitude: 35.9024, longitude: 126.6155, type: "air" },

  // Pacific
  { id: "us-guam", name: "Naval Base Guam", country: "GU", operator: "US", branch: "Navy", latitude: 13.4443, longitude: 144.7937, type: "naval" },
  { id: "us-andersen", name: "Andersen AFB Guam", country: "GU", operator: "US", branch: "Air Force", latitude: 13.5840, longitude: 144.9243, type: "air" },
  { id: "us-diegogarcia", name: "Diego Garcia", country: "IO", operator: "US", branch: "Navy", latitude: -7.3195, longitude: 72.4229, type: "naval" },

  // Middle East & Africa
  { id: "us-incirlik", name: "Incirlik Air Base", country: "TR", operator: "US", branch: "Air Force", latitude: 37.0019, longitude: 35.4259, type: "air" },
  { id: "us-aldhafra", name: "Al Dhafra Air Base", country: "AE", operator: "US", branch: "Air Force", latitude: 24.2482, longitude: 54.5476, type: "air" },
  { id: "us-aludeid", name: "Al Udeid Air Base", country: "QA", operator: "US", branch: "Air Force", latitude: 25.1173, longitude: 51.3150, type: "air" },
  { id: "us-djibouti", name: "Camp Lemonnier", country: "DJ", operator: "US", branch: "Navy", latitude: 11.5469, longitude: 43.1556, type: "naval" },
  { id: "us-bahrain", name: "Naval Support Activity Bahrain", country: "BH", operator: "US", branch: "Navy", latitude: 26.2361, longitude: 50.6153, type: "naval" },
  { id: "us-arifjan", name: "Camp Arifjan", country: "KW", operator: "US", branch: "Army", latitude: 29.1229, longitude: 48.0783, type: "army" },
  { id: "us-ali-al-salem", name: "Ali Al Salem Air Base", country: "KW", operator: "US", branch: "Air Force", latitude: 29.3466, longitude: 47.5208, type: "air" },
  { id: "us-al-jaber", name: "Ahmed Al Jaber Air Base", country: "KW", operator: "US", branch: "Air Force", latitude: 28.9348, longitude: 47.7919, type: "air" },

  // Greenland
  { id: "us-thule", name: "Pituffik Space Base (Thule)", country: "GL", operator: "US", branch: "Space Force", latitude: 76.5312, longitude: -68.7031, type: "space" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── Russia ───────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  // Navy — Northern Fleet
  { id: "ru-severomorsk", name: "Severomorsk (Northern Fleet)", country: "RU", operator: "RU", branch: "Navy", latitude: 69.0733, longitude: 33.4197, type: "naval" },
  { id: "ru-gadzhiyevo", name: "Gadzhiyevo (Nuclear Sub Base)", country: "RU", operator: "RU", branch: "Navy", latitude: 69.2536, longitude: 33.3233, type: "naval" },
  { id: "ru-murmansk", name: "Murmansk Naval Base", country: "RU", operator: "RU", branch: "Navy", latitude: 68.9585, longitude: 33.0827, type: "naval" },

  // Navy — Baltic Fleet
  { id: "ru-kaliningrad", name: "Kaliningrad (Baltic Fleet)", country: "RU", operator: "RU", branch: "Navy", latitude: 54.7104, longitude: 20.4522, type: "naval" },

  // Navy — Black Sea Fleet
  { id: "ru-sevastopol", name: "Sevastopol (Black Sea Fleet)", country: "RU", operator: "RU", branch: "Navy", latitude: 44.6166, longitude: 33.5254, type: "naval" },
  { id: "ru-oktyabrsky", name: "Oktyabrsky (Crimea)", country: "RU", operator: "RU", branch: "Navy", latitude: 44.6146, longitude: 33.4857, type: "naval" },
  { id: "ru-donuzlav", name: "Donuzlav Naval Base", country: "RU", operator: "RU", branch: "Navy", latitude: 45.3456, longitude: 33.0508, type: "naval" },

  // Navy — Pacific Fleet
  { id: "ru-vladivostok", name: "Vladivostok (Pacific Fleet)", country: "RU", operator: "RU", branch: "Navy", latitude: 43.1056, longitude: 131.8735, type: "naval" },
  { id: "ru-vilyuchinsk", name: "Vilyuchinsk (Sub Base Kamchatka)", country: "RU", operator: "RU", branch: "Navy", latitude: 52.9220, longitude: 158.4050, type: "naval" },

  // Air Force
  { id: "ru-engels", name: "Engels-2 Air Base", country: "RU", operator: "RU", branch: "Air Force", latitude: 51.4829, longitude: 46.2002, type: "air" },
  { id: "ru-chkalovsky", name: "Chkalovsky Air Base", country: "RU", operator: "RU", branch: "Air Force", latitude: 55.8781, longitude: 38.0619, type: "air" },
  { id: "ru-kubinka", name: "Kubinka Air Base", country: "RU", operator: "RU", branch: "Air Force", latitude: 55.6113, longitude: 36.6500, type: "air" },
  { id: "ru-akhtubinsk", name: "Akhtubinsk Air Base", country: "RU", operator: "RU", branch: "Air Force", latitude: 48.3150, longitude: 46.1750, type: "air" },
  { id: "ru-krymsk", name: "Krymsk Air Base", country: "RU", operator: "RU", branch: "Air Force", latitude: 44.9654, longitude: 37.3728, type: "air" },
  { id: "ru-mozdok", name: "Mozdok Air Base", country: "RU", operator: "RU", branch: "Air Force", latitude: 43.7861, longitude: 44.5964, type: "air" },

  // Strategic / Missile / Space
  { id: "ru-plesetsk", name: "Plesetsk Cosmodrome", country: "RU", operator: "RU", branch: "Strategic", latitude: 62.9271, longitude: 40.5778, type: "space" },
  { id: "ru-sarov", name: "Sarov (Arzamas-16)", country: "RU", operator: "RU", branch: "Nuclear", latitude: 54.9360, longitude: 43.3247, type: "intelligence" },
  { id: "ru-novosibirsk", name: "Novosibirsk Garrison", country: "RU", operator: "RU", branch: "Army", latitude: 55.0084, longitude: 82.9357, type: "army" },

  // Overseas / CIS
  { id: "ru-tartus", name: "Tartus Naval Facility", country: "SY", operator: "RU", branch: "Navy", latitude: 34.8860, longitude: 35.8868, type: "naval" },
  { id: "ru-hmeimim", name: "Khmeimim Air Base", country: "SY", operator: "RU", branch: "Air Force", latitude: 35.4085, longitude: 35.9487, type: "air" },
  { id: "ru-baikonur", name: "Baikonur Cosmodrome", country: "KZ", operator: "RU", branch: "Space", latitude: 45.9650, longitude: 63.3050, type: "space" },
  { id: "ru-gyumri", name: "102nd Military Base Gyumri", country: "AM", operator: "RU", branch: "Army", latitude: 40.8064, longitude: 43.8457, type: "army" },
  { id: "ru-kant", name: "Kant Air Base", country: "KG", operator: "RU", branch: "Air Force", latitude: 42.8533, longitude: 74.8464, type: "air" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── China (PLA) ──────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  // Navy (PLAN)
  { id: "cn-yulin", name: "Yulin Naval Base", country: "CN", operator: "CN", branch: "Navy", latitude: 18.2270, longitude: 109.5658, type: "naval" },
  { id: "cn-qingdao", name: "Qingdao Naval Base", country: "CN", operator: "CN", branch: "Navy", latitude: 36.0671, longitude: 120.3826, type: "naval" },
  { id: "cn-zhanjiang", name: "Zhanjiang Naval Base", country: "CN", operator: "CN", branch: "Navy", latitude: 21.2707, longitude: 110.3594, type: "naval" },
  { id: "cn-haikou", name: "Haikou Naval Base", country: "CN", operator: "CN", branch: "Navy", latitude: 20.0174, longitude: 110.3515, type: "naval" },
  { id: "cn-dalian", name: "Dalian Naval Base", country: "CN", operator: "CN", branch: "Navy", latitude: 38.9318, longitude: 121.6146, type: "naval" },
  { id: "cn-shanghai-jiangnan", name: "Shanghai Jiangnan Shipyard", country: "CN", operator: "CN", branch: "Navy", latitude: 30.8840, longitude: 121.6791, type: "naval" },

  // Army / Ground Forces
  { id: "cn-wuhan", name: "Wuhan Garrison (Central TC)", country: "CN", operator: "CN", branch: "Army", latitude: 30.5928, longitude: 114.3055, type: "army" },
  { id: "cn-chengdu", name: "Chengdu Garrison (Western TC)", country: "CN", operator: "CN", branch: "Army", latitude: 30.5728, longitude: 104.0668, type: "army" },
  { id: "cn-kunming", name: "Kunming Garrison", country: "CN", operator: "CN", branch: "Army", latitude: 25.0292, longitude: 102.6839, type: "army" },
  { id: "cn-korla", name: "Korla Test Range", country: "CN", operator: "CN", branch: "Army", latitude: 41.7186, longitude: 86.1591, type: "army" },
  { id: "cn-kashgar", name: "Kashgar Military Base", country: "CN", operator: "CN", branch: "Army", latitude: 39.4547, longitude: 75.9891, type: "army" },

  // Nuclear / Strategic
  { id: "cn-lop-nur", name: "Lop Nur Nuclear Test Site", country: "CN", operator: "CN", branch: "Nuclear", latitude: 41.5479, longitude: 88.3517, type: "intelligence" },

  // Space Launch
  { id: "cn-jiuquan", name: "Jiuquan Satellite Launch Center", country: "CN", operator: "CN", branch: "Space", latitude: 40.9606, longitude: 100.2910, type: "space" },
  { id: "cn-xichang", name: "Xichang Satellite Launch Center", country: "CN", operator: "CN", branch: "Space", latitude: 28.2463, longitude: 102.0268, type: "space" },
  { id: "cn-wenchang", name: "Wenchang Space Launch Site", country: "CN", operator: "CN", branch: "Space", latitude: 19.6145, longitude: 110.9510, type: "space" },

  // Overseas / Forward Positions
  { id: "cn-djibouti", name: "PLA Support Base Djibouti", country: "DJ", operator: "CN", branch: "Navy", latitude: 11.5891, longitude: 43.0826, type: "naval" },
  { id: "cn-ream", name: "Ream Naval Base (Cambodia)", country: "KH", operator: "CN", branch: "Navy", latitude: 10.5026, longitude: 103.6248, type: "naval" },

  // South China Sea — Artificial Islands
  { id: "cn-fiery-cross", name: "Fiery Cross Reef", country: "CN", operator: "CN", branch: "Navy", latitude: 9.5464, longitude: 112.8833, type: "naval" },
  { id: "cn-subi-reef", name: "Subi Reef", country: "CN", operator: "CN", branch: "Navy", latitude: 10.9237, longitude: 114.0833, type: "naval" },
  { id: "cn-mischief-reef", name: "Mischief Reef", country: "CN", operator: "CN", branch: "Navy", latitude: 9.9000, longitude: 115.5333, type: "naval" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── United Kingdom ───────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "uk-faslane", name: "HMNB Clyde (Faslane)", country: "GB", operator: "GB", branch: "Navy", latitude: 56.0671, longitude: -4.8219, type: "naval" },
  { id: "uk-portsmouth", name: "HMNB Portsmouth", country: "GB", operator: "GB", branch: "Navy", latitude: 50.7984, longitude: -1.1082, type: "naval" },
  { id: "uk-akrotiri", name: "RAF Akrotiri", country: "CY", operator: "GB", branch: "Air Force", latitude: 34.5900, longitude: 32.9878, type: "air" },
  { id: "uk-lakenheath", name: "RAF Lakenheath", country: "GB", operator: "US/GB", branch: "Air Force", latitude: 52.4093, longitude: 0.5608, type: "air" },
  { id: "uk-aldermaston", name: "AWE Aldermaston", country: "GB", operator: "GB", branch: "Nuclear", latitude: 51.3627, longitude: -1.1575, type: "intelligence" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── France ───────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "fr-toulon", name: "Toulon Naval Base", country: "FR", operator: "FR", branch: "Navy", latitude: 43.1031, longitude: 5.9291, type: "naval" },
  { id: "fr-iletlongue", name: "Île Longue (Nuclear Sub)", country: "FR", operator: "FR", branch: "Navy", latitude: 48.3082, longitude: -4.5221, type: "naval" },
  { id: "fr-djibouti", name: "FFDj Djibouti", country: "DJ", operator: "FR", branch: "Multi", latitude: 11.5537, longitude: 43.1487, type: "army" },
  { id: "fr-istres", name: "BA 125 Istres-Orange", country: "FR", operator: "FR", branch: "Air Force", latitude: 43.5237, longitude: 4.9242, type: "air" },
  { id: "fr-mont-de-marsan", name: "BA 118 Mont-de-Marsan", country: "FR", operator: "FR", branch: "Air Force", latitude: 43.9117, longitude: -0.5075, type: "air" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── NATO / European Allies ───────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  // NATO HQ
  { id: "nato-shape", name: "SHAPE (NATO HQ)", country: "BE", operator: "NATO", branch: "HQ", latitude: 50.5017, longitude: 3.7250, type: "headquarters" },

  // Germany
  { id: "de-spangdahlem", name: "Spangdahlem Air Base", country: "DE", operator: "US", branch: "Air Force", latitude: 49.9726, longitude: 6.6925, type: "air" },
  { id: "de-grafenwoehr", name: "Grafenwöhr Training Area", country: "DE", operator: "US", branch: "Army", latitude: 49.6986, longitude: 11.9404, type: "army" },
  { id: "de-vilseck", name: "Rose Barracks Vilseck", country: "DE", operator: "US", branch: "Army", latitude: 49.6098, longitude: 11.8040, type: "army" },

  // Italy
  { id: "it-ghedi", name: "Ghedi Air Base", country: "IT", operator: "IT", branch: "Air Force", latitude: 45.4322, longitude: 10.2777, type: "air" },
  { id: "it-amendola", name: "Amendola Air Base", country: "IT", operator: "IT", branch: "Air Force", latitude: 41.5414, longitude: 15.7181, type: "air" },

  // Norway
  { id: "no-bodo", name: "Bodø Main Air Station", country: "NO", operator: "NO", branch: "Air Force", latitude: 67.2692, longitude: 14.3653, type: "air" },
  { id: "no-bardufoss", name: "Bardufoss Air Station", country: "NO", operator: "NO", branch: "Air Force", latitude: 69.0558, longitude: 18.5404, type: "air" },

  // Poland
  { id: "pl-redzikowo", name: "Redzikowo Aegis Ashore", country: "PL", operator: "US", branch: "Navy", latitude: 54.4770, longitude: 17.0990, type: "naval" },
  { id: "pl-lask", name: "32nd Air Base Łask", country: "PL", operator: "PL", branch: "Air Force", latitude: 51.5515, longitude: 19.1794, type: "air" },

  // Turkey
  { id: "tr-izmir", name: "Izmir NATO / Air Base", country: "TR", operator: "TR/NATO", branch: "Air Force", latitude: 38.4221, longitude: 27.1559, type: "air" },
  { id: "tr-diyarbakir", name: "Diyarbakır Air Base", country: "TR", operator: "TR", branch: "Air Force", latitude: 37.8939, longitude: 40.2019, type: "air" },

  // Spain
  { id: "es-torrejon", name: "Torrejón Air Base", country: "ES", operator: "ES", branch: "Air Force", latitude: 40.4820, longitude: -3.4468, type: "air" },

  // Netherlands
  { id: "nl-volkel", name: "Volkel Air Base", country: "NL", operator: "NL", branch: "Air Force", latitude: 51.6572, longitude: 5.7074, type: "air" },

  // Belgium
  { id: "be-kleine-brogel", name: "Kleine-Brogel Air Base", country: "BE", operator: "BE", branch: "Air Force", latitude: 51.1682, longitude: 5.4700, type: "air" },

  // Romania
  { id: "ro-deveselu", name: "Deveselu Aegis Ashore", country: "RO", operator: "US", branch: "Navy", latitude: 44.0392, longitude: 24.0318, type: "naval" },
  { id: "ro-kogalniceanu", name: "Mihail Kogălniceanu Air Base", country: "RO", operator: "RO/US", branch: "Air Force", latitude: 44.3582, longitude: 28.4382, type: "air" },

  // Greece
  { id: "gr-souda-bay", name: "Souda Bay Naval Base", country: "GR", operator: "GR/US", branch: "Navy", latitude: 35.4912, longitude: 24.1164, type: "naval" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── Israel ───────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "il-palmachim", name: "Palmachim Air Base", country: "IL", operator: "IL", branch: "Air Force", latitude: 31.8978, longitude: 34.6905, type: "air" },
  { id: "il-nevatim", name: "Nevatim Air Base", country: "IL", operator: "IL", branch: "Air Force", latitude: 31.2079, longitude: 34.8176, type: "air" },
  { id: "il-ramat-david", name: "Ramat David Air Base", country: "IL", operator: "IL", branch: "Air Force", latitude: 32.6652, longitude: 35.1793, type: "air" },
  { id: "il-hatzerim", name: "Hatzerim Air Base", country: "IL", operator: "IL", branch: "Air Force", latitude: 31.2337, longitude: 34.6627, type: "air" },
  { id: "il-ramon", name: "Ramon Air Base", country: "IL", operator: "IL", branch: "Air Force", latitude: 30.7763, longitude: 34.6668, type: "air" },
  { id: "il-haifa-naval", name: "Haifa Naval Base", country: "IL", operator: "IL", branch: "Navy", latitude: 32.8209, longitude: 35.0008, type: "naval" },
  { id: "il-tel-nof", name: "Tel Nof Air Base", country: "IL", operator: "IL", branch: "Air Force", latitude: 31.8394, longitude: 34.8219, type: "air" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── India ────────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "in-vizag", name: "INS Visakhapatnam", country: "IN", operator: "IN", branch: "Navy", latitude: 17.7137, longitude: 83.3011, type: "naval" },
  { id: "in-karwar", name: "INS Kadamba (Karwar)", country: "IN", operator: "IN", branch: "Navy", latitude: 14.7851, longitude: 74.1213, type: "naval" },
  { id: "in-vikrant-cochin", name: "INS Vikrant Homeport (Kochi)", country: "IN", operator: "IN", branch: "Navy", latitude: 9.9680, longitude: 76.2673, type: "naval" },
  { id: "in-ins-chilka", name: "INS Chilka", country: "IN", operator: "IN", branch: "Navy", latitude: 19.7050, longitude: 85.1203, type: "naval" },
  { id: "in-ins-dega", name: "INS Dega (Visakhapatnam)", country: "IN", operator: "IN", branch: "Navy", latitude: 17.7247, longitude: 83.2222, type: "naval" },
  { id: "in-pune", name: "Pune Cantonment (Southern Command)", country: "IN", operator: "IN", branch: "Army", latitude: 18.5049, longitude: 73.8965, type: "army" },
  { id: "in-jodhpur", name: "Jodhpur Air Force Station", country: "IN", operator: "IN", branch: "Air Force", latitude: 26.2512, longitude: 73.0488, type: "air" },
  { id: "in-leh", name: "Leh Air Force Station", country: "IN", operator: "IN", branch: "Air Force", latitude: 34.1359, longitude: 77.5465, type: "air" },
  { id: "in-ambala", name: "Ambala Air Force Station", country: "IN", operator: "IN", branch: "Air Force", latitude: 30.3681, longitude: 76.8171, type: "air" },
  { id: "in-bareilly", name: "Bareilly Air Force Station", country: "IN", operator: "IN", branch: "Air Force", latitude: 28.4228, longitude: 79.4508, type: "air" },
  { id: "in-port-blair", name: "INS Jarawa (Port Blair)", country: "IN", operator: "IN", branch: "Navy", latitude: 11.6461, longitude: 92.7265, type: "naval" },
  { id: "in-agra", name: "Agra Air Force Station", country: "IN", operator: "IN", branch: "Air Force", latitude: 27.1558, longitude: 77.9607, type: "air" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── Japan Self-Defense Forces ────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "jp-yokosuka-jmsdf", name: "JMSDF Yokosuka", country: "JP", operator: "JP", branch: "Navy", latitude: 35.2869, longitude: 139.6631, type: "naval" },
  { id: "jp-kure", name: "JMSDF Kure", country: "JP", operator: "JP", branch: "Navy", latitude: 34.2346, longitude: 132.5609, type: "naval" },
  { id: "jp-sasebo", name: "JMSDF Sasebo", country: "JP", operator: "JP", branch: "Navy", latitude: 33.1628, longitude: 129.7188, type: "naval" },
  { id: "jp-misawa-jasdf", name: "JASDF Misawa", country: "JP", operator: "JP", branch: "Air Force", latitude: 40.7032, longitude: 141.3684, type: "air" },
  { id: "jp-naha", name: "JASDF Naha", country: "JP", operator: "JP", branch: "Air Force", latitude: 26.1958, longitude: 127.6459, type: "air" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── South Korea (ROK) ────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "kr-gimhae", name: "ROKAF Gimhae Air Base", country: "KR", operator: "KR", branch: "Air Force", latitude: 35.1630, longitude: 128.9383, type: "air" },
  { id: "kr-jinhae", name: "Jinhae Naval Base", country: "KR", operator: "KR", branch: "Navy", latitude: 35.1389, longitude: 128.6608, type: "naval" },
  { id: "kr-gangneung", name: "Gangneung Air Base", country: "KR", operator: "KR", branch: "Air Force", latitude: 37.7536, longitude: 128.9440, type: "air" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── Pakistan ─────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "pk-kamra", name: "PAF Kamra (PAC)", country: "PK", operator: "PK", branch: "Air Force", latitude: 33.8698, longitude: 72.4013, type: "air" },
  { id: "pk-sargodha", name: "PAF Mushaf (Sargodha)", country: "PK", operator: "PK", branch: "Air Force", latitude: 32.0496, longitude: 72.6649, type: "air" },
  { id: "pk-karachi-naval", name: "PNS Dockyard Karachi", country: "PK", operator: "PK", branch: "Navy", latitude: 24.8421, longitude: 66.9746, type: "naval" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── Iran ─────────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "ir-bandar-abbas", name: "Bandar Abbas Naval Base", country: "IR", operator: "IR", branch: "Navy", latitude: 27.1832, longitude: 56.2765, type: "naval" },
  { id: "ir-bushehr", name: "Bushehr Naval Base", country: "IR", operator: "IR", branch: "Navy", latitude: 28.9713, longitude: 50.8346, type: "naval" },
  { id: "ir-isfahan", name: "Isfahan Air Base (8th TFB)", country: "IR", operator: "IR", branch: "Air Force", latitude: 32.7441, longitude: 51.8613, type: "air" },
  { id: "ir-natanz", name: "Natanz Vicinity (Military)", country: "IR", operator: "IR", branch: "Nuclear", latitude: 33.7247, longitude: 51.7270, type: "intelligence" },
  { id: "ir-chabahar", name: "Chabahar Naval Base", country: "IR", operator: "IR", branch: "Navy", latitude: 25.2920, longitude: 60.6437, type: "naval" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── North Korea (DPRK) ──────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "kp-yongbyon", name: "Yongbyon Nuclear Complex", country: "KP", operator: "KP", branch: "Nuclear", latitude: 39.7953, longitude: 125.7553, type: "intelligence" },
  { id: "kp-sunchon", name: "Sunchon Air Base", country: "KP", operator: "KP", branch: "Air Force", latitude: 39.4153, longitude: 125.9000, type: "air" },
  { id: "kp-nampo", name: "Nampo Naval Base", country: "KP", operator: "KP", branch: "Navy", latitude: 38.7372, longitude: 125.3975, type: "naval" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── Saudi Arabia & Gulf States ──────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "sa-dhahran", name: "King Abdulaziz AB Dhahran", country: "SA", operator: "SA", branch: "Air Force", latitude: 26.2653, longitude: 50.1524, type: "air" },
  { id: "sa-prince-sultan", name: "Prince Sultan Air Base", country: "SA", operator: "SA", branch: "Air Force", latitude: 24.0625, longitude: 47.5806, type: "air" },
  { id: "sa-jeddah-naval", name: "King Faisal Naval Base Jeddah", country: "SA", operator: "SA", branch: "Navy", latitude: 21.3664, longitude: 39.1526, type: "naval" },
  { id: "sa-al-kharj", name: "Al-Kharj Military City", country: "SA", operator: "SA", branch: "Army", latitude: 24.1469, longitude: 47.3179, type: "army" },
  { id: "ae-al-minhad", name: "Al Minhad Air Base", country: "AE", operator: "AE", branch: "Air Force", latitude: 25.0273, longitude: 55.3664, type: "air" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── Egypt ────────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "eg-cairo-west", name: "Cairo West Air Base", country: "EG", operator: "EG", branch: "Air Force", latitude: 30.1164, longitude: 30.9154, type: "air" },
  { id: "eg-berenice", name: "Berenice Military Base", country: "EG", operator: "EG", branch: "Navy", latitude: 23.9461, longitude: 35.4788, type: "naval" },
  { id: "eg-ras-banas", name: "Ras Banas Air Base", country: "EG", operator: "EG", branch: "Air Force", latitude: 23.9419, longitude: 35.4647, type: "air" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── Australia ────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "au-pineGap", name: "Pine Gap (Joint)", country: "AU", operator: "AU/US", branch: "Intelligence", latitude: -23.7989, longitude: 133.7369, type: "intelligence" },
  { id: "au-tindal", name: "RAAF Tindal", country: "AU", operator: "AU", branch: "Air Force", latitude: -14.5214, longitude: 132.3782, type: "air" },
  { id: "au-amberley", name: "RAAF Amberley", country: "AU", operator: "AU", branch: "Air Force", latitude: -27.6310, longitude: 152.7111, type: "air" },
  { id: "au-stirling", name: "HMAS Stirling", country: "AU", operator: "AU", branch: "Navy", latitude: -32.2397, longitude: 115.6882, type: "naval" },
  { id: "au-darwin", name: "RAAF Darwin / Robertson Barracks", country: "AU", operator: "AU", branch: "Multi", latitude: -12.4528, longitude: 130.8709, type: "army" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── Taiwan (ROC) ─────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "tw-hualien", name: "Hualien Air Base", country: "TW", operator: "TW", branch: "Air Force", latitude: 24.0231, longitude: 121.6167, type: "air" },
  { id: "tw-chiayi", name: "Chiayi Air Base", country: "TW", operator: "TW", branch: "Air Force", latitude: 23.4618, longitude: 120.3926, type: "air" },
  { id: "tw-zuoying", name: "Zuoying Naval Base", country: "TW", operator: "TW", branch: "Navy", latitude: 22.7006, longitude: 120.2771, type: "naval" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── Brazil / Latin America ───────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "br-brasilia", name: "Brasília Air Base (BAAN)", country: "BR", operator: "BR", branch: "Air Force", latitude: -15.8622, longitude: -47.9263, type: "air" },
  { id: "br-sao-pedro", name: "São Pedro da Aldeia Naval Air Base", country: "BR", operator: "BR", branch: "Navy", latitude: -22.8120, longitude: -42.0928, type: "naval" },
  { id: "br-natal", name: "Natal Air Base (Parnamirim)", country: "BR", operator: "BR", branch: "Air Force", latitude: -5.9114, longitude: -35.2475, type: "air" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── Africa ───────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "et-debre-zeit", name: "Debre Zeit / Bishoftu Air Base", country: "ET", operator: "ET", branch: "Air Force", latitude: 8.7308, longitude: 38.9561, type: "air" },
  { id: "ke-nanyuki", name: "Nanyuki / Laikipia Air Base", country: "KE", operator: "KE", branch: "Army", latitude: 0.0444, longitude: 36.9672, type: "army" },
  { id: "ng-abuja", name: "Nigerian Air Force Base Abuja", country: "NG", operator: "NG", branch: "Air Force", latitude: 9.0068, longitude: 7.2632, type: "air" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── Additional US Domestic ─────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "us-kitsap", name: "Naval Base Kitsap", country: "US", operator: "US", branch: "Navy", latitude: 47.5649, longitude: -122.6550, type: "naval" },
  { id: "us-groton", name: "Naval Submarine Base New London", country: "US", operator: "US", branch: "Navy", latitude: 41.3866, longitude: -72.0876, type: "naval" },
  { id: "us-lejeune", name: "Camp Lejeune", country: "US", operator: "US", branch: "Marine Corps", latitude: 34.6753, longitude: -77.3866, type: "army" },
  { id: "us-twentynine-palms", name: "MCAGCC Twentynine Palms", country: "US", operator: "US", branch: "Marine Corps", latitude: 34.2366, longitude: -116.0569, type: "army" },
  { id: "us-hill", name: "Hill AFB", country: "US", operator: "US", branch: "Air Force", latitude: 41.1241, longitude: -111.9730, type: "air" },
  { id: "us-wright-pat", name: "Wright-Patterson AFB", country: "US", operator: "US", branch: "Air Force", latitude: 39.8260, longitude: -84.0486, type: "air" },
  { id: "us-robins", name: "Robins AFB", country: "US", operator: "US", branch: "Air Force", latitude: 32.6401, longitude: -83.5918, type: "air" },
  { id: "us-tinker", name: "Tinker AFB", country: "US", operator: "US", branch: "Air Force", latitude: 35.4146, longitude: -97.3866, type: "air" },
  { id: "us-minot", name: "Minot AFB", country: "US", operator: "US", branch: "Air Force", latitude: 48.4156, longitude: -101.3579, type: "air" },
  { id: "us-malmstrom", name: "Malmstrom AFB", country: "US", operator: "US", branch: "Air Force", latitude: 47.5076, longitude: -111.1831, type: "air" },
  { id: "us-warren", name: "F.E. Warren AFB", country: "US", operator: "US", branch: "Air Force", latitude: 41.1498, longitude: -104.8662, type: "air" },
  { id: "us-scott", name: "Scott AFB (TRANSCOM)", country: "US", operator: "US", branch: "Air Force", latitude: 38.5452, longitude: -89.8506, type: "air" },
  { id: "us-macdill", name: "MacDill AFB (CENTCOM)", country: "US", operator: "US", branch: "Air Force", latitude: 27.8491, longitude: -82.5212, type: "air" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── Additional Russia ──────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "ru-shagol", name: "Shagol Air Base (Chelyabinsk)", country: "RU", operator: "RU", branch: "Air Force", latitude: 55.2100, longitude: 61.3200, type: "air" },
  { id: "ru-domna", name: "Domna Air Base (Chita)", country: "RU", operator: "RU", branch: "Air Force", latitude: 51.8500, longitude: 113.1500, type: "air" },
  { id: "ru-ukrainka", name: "Ukrainka Air Base", country: "RU", operator: "RU", branch: "Air Force", latitude: 51.1700, longitude: 128.4200, type: "air" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── Additional China ───────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "cn-woody-island", name: "Woody Island (Yongxing)", country: "CN", operator: "CN", branch: "Navy", latitude: 16.8340, longitude: 112.3440, type: "naval" },
  { id: "cn-ningbo", name: "Ningbo (Eastern TC HQ)", country: "CN", operator: "CN", branch: "Army", latitude: 29.8683, longitude: 121.5440, type: "army" },
  { id: "cn-shenyang", name: "Shenyang (Northern TC HQ)", country: "CN", operator: "CN", branch: "Army", latitude: 41.8057, longitude: 123.4315, type: "army" },
  { id: "cn-guangzhou", name: "Guangzhou (Southern TC HQ)", country: "CN", operator: "CN", branch: "Army", latitude: 23.1291, longitude: 113.2644, type: "army" },
  { id: "cn-lanzhou", name: "Lanzhou Military Region", country: "CN", operator: "CN", branch: "Army", latitude: 36.0611, longitude: 103.8343, type: "army" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── Additional NATO Europe ─────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "dk-karup", name: "Fighter Wing Skrydstrup", country: "DK", operator: "DK", branch: "Air Force", latitude: 55.2248, longitude: 9.2640, type: "air" },
  { id: "cz-namest", name: "Náměšť nad Oslavou Air Base", country: "CZ", operator: "CZ", branch: "Air Force", latitude: 49.1660, longitude: 16.1245, type: "air" },
  { id: "lt-siauliai", name: "Šiauliai Air Base (NATO BAP)", country: "LT", operator: "NATO", branch: "Air Force", latitude: 55.8939, longitude: 23.3950, type: "air" },
  { id: "ee-amari", name: "Ämari Air Base", country: "EE", operator: "NATO", branch: "Air Force", latitude: 59.2603, longitude: 24.2085, type: "air" },
  { id: "bg-graf-ignatievo", name: "Graf Ignatievo Air Base", country: "BG", operator: "BG", branch: "Air Force", latitude: 42.2903, longitude: 24.7141, type: "air" },
  { id: "hu-kecskemet", name: "Kecskemét Air Base", country: "HU", operator: "HU", branch: "Air Force", latitude: 46.9175, longitude: 19.7493, type: "air" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── Canada ─────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "ca-esquimalt", name: "CFB Esquimalt", country: "CA", operator: "CA", branch: "Navy", latitude: 48.4322, longitude: -123.4390, type: "naval" },
  { id: "ca-halifax", name: "CFB Halifax", country: "CA", operator: "CA", branch: "Navy", latitude: 44.6614, longitude: -63.5838, type: "naval" },
  { id: "ca-cold-lake", name: "CFB Cold Lake", country: "CA", operator: "CA", branch: "Air Force", latitude: 54.4050, longitude: -110.2790, type: "air" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── Singapore & Southeast Asia ─────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "sg-changi", name: "Changi Naval Base", country: "SG", operator: "SG", branch: "Navy", latitude: 1.3330, longitude: 104.0000, type: "naval" },
  { id: "sg-tengah", name: "Tengah Air Base", country: "SG", operator: "SG", branch: "Air Force", latitude: 1.3870, longitude: 103.7090, type: "air" },
];
