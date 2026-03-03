import type { ConflictZone } from "../types";

export const CONFLICT_ZONES: ConflictZone[] = [
  { id: "ua-east", name: "Eastern Ukraine", latitude: 48.5, longitude: 37.5, radius_km: 250, intensity: "high", type: "Interstate war", description: "Russia-Ukraine conflict — active frontlines across Donetsk, Luhansk, Zaporizhzhia, and Kherson oblasts" },
  { id: "ua-crimea", name: "Crimea", latitude: 44.9, longitude: 34.1, radius_km: 120, intensity: "medium", type: "Occupied territory", description: "Russian-occupied Crimean Peninsula — strategic military buildup and contested status" },
  { id: "gaza", name: "Gaza Strip", latitude: 31.42, longitude: 34.35, radius_km: 30, intensity: "high", type: "Armed conflict", description: "Israeli-Palestinian conflict in Gaza — active military operations" },
  { id: "west-bank", name: "West Bank", latitude: 31.95, longitude: 35.25, radius_km: 50, intensity: "medium", type: "Occupation/unrest", description: "Ongoing tensions, settler violence, and military raids in the West Bank" },
  { id: "lebanon-south", name: "Southern Lebanon", latitude: 33.3, longitude: 35.5, radius_km: 40, intensity: "medium", type: "Cross-border conflict", description: "Hezbollah-Israel cross-border exchanges and tensions" },
  { id: "syria", name: "Syria", latitude: 35.5, longitude: 38.5, radius_km: 300, intensity: "medium", type: "Civil war / insurgency", description: "Ongoing multi-party civil conflict with foreign military involvement" },
  { id: "yemen", name: "Yemen", latitude: 15.5, longitude: 44.0, radius_km: 300, intensity: "high", type: "Civil war", description: "Houthi-Saudi coalition conflict, Red Sea shipping attacks" },
  { id: "red-sea", name: "Red Sea / Gulf of Aden", latitude: 13.5, longitude: 43.0, radius_km: 200, intensity: "high", type: "Maritime threat", description: "Houthi attacks on commercial shipping in the Red Sea and Gulf of Aden" },
  { id: "sudan", name: "Sudan", latitude: 15.5, longitude: 32.5, radius_km: 400, intensity: "high", type: "Civil war", description: "RSF vs SAF conflict — widespread fighting across Khartoum, Darfur, and Kordofan" },
  { id: "ethiopia-amhara", name: "Ethiopia (Amhara)", latitude: 11.5, longitude: 38.5, radius_km: 200, intensity: "medium", type: "Internal conflict", description: "Fano militia insurgency in Amhara region" },
  { id: "drc-east", name: "Eastern DRC", latitude: -1.5, longitude: 29.0, radius_km: 250, intensity: "high", type: "Armed conflict", description: "M23 and multiple armed group conflicts in North Kivu, South Kivu, and Ituri" },
  { id: "sahel", name: "Sahel (Mali/Niger/Burkina Faso)", latitude: 14.0, longitude: -1.0, radius_km: 500, intensity: "high", type: "Insurgency", description: "JNIM and ISGS jihadist insurgency across the Sahel region" },
  { id: "somalia", name: "Somalia", latitude: 5.0, longitude: 45.0, radius_km: 300, intensity: "medium", type: "Insurgency", description: "Al-Shabaab insurgency — ongoing military operations" },
  { id: "myanmar", name: "Myanmar", latitude: 19.5, longitude: 96.5, radius_km: 400, intensity: "high", type: "Civil war", description: "Post-coup civil war — military junta vs. resistance forces across multiple states" },
  { id: "taiwan-strait", name: "Taiwan Strait", latitude: 24.5, longitude: 119.5, radius_km: 200, intensity: "low", type: "Tension zone", description: "PRC-Taiwan strategic tension — military buildups and air/naval incursions" },
  { id: "south-china-sea", name: "South China Sea", latitude: 12.0, longitude: 114.0, radius_km: 500, intensity: "low", type: "Maritime dispute", description: "Territorial disputes involving China, Philippines, Vietnam, and others" },
  { id: "kashmir", name: "Kashmir (LoC)", latitude: 34.5, longitude: 75.0, radius_km: 150, intensity: "low", type: "Border tension", description: "India-Pakistan Line of Control — periodic ceasefire violations and militant activity" },
  { id: "nagorno-karabakh", name: "South Caucasus (post-NK)", latitude: 40.0, longitude: 46.5, radius_km: 100, intensity: "low", type: "Post-conflict", description: "Post-2023 aftermath of Nagorno-Karabakh conflict — ongoing territorial tensions" },
  { id: "haiti", name: "Haiti", latitude: 18.9, longitude: -72.3, radius_km: 80, intensity: "medium", type: "Gang violence / instability", description: "Widespread gang control, state collapse, and humanitarian crisis" },
];
