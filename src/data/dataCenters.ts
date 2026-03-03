import type { DataCenter } from "../types";

export const DATA_CENTERS: DataCenter[] = [
  // ── US Hyperscale ──────────────────────────────────────────────────────
  { id: "aws-us-east-1", name: "AWS US East (Virginia)", operator: "Amazon", latitude: 39.0438, longitude: -77.4874, country: "US", type: "cloud", capacity_mw: 2000 },
  { id: "aws-us-west-2", name: "AWS US West (Oregon)", operator: "Amazon", latitude: 45.8450, longitude: -119.7009, country: "US", type: "cloud", capacity_mw: 1000 },
  { id: "gcp-council-bluffs", name: "Google Council Bluffs", operator: "Google", latitude: 41.2619, longitude: -95.8608, country: "US", type: "cloud", capacity_mw: 900 },
  { id: "gcp-the-dalles", name: "Google The Dalles", operator: "Google", latitude: 45.5946, longitude: -121.1787, country: "US", type: "cloud", capacity_mw: 600 },
  { id: "msft-quincy", name: "Microsoft Quincy", operator: "Microsoft", latitude: 47.2343, longitude: -119.8526, country: "US", type: "cloud", capacity_mw: 800 },
  { id: "msft-boydton", name: "Microsoft Boydton", operator: "Microsoft", latitude: 36.6681, longitude: -78.3875, country: "US", type: "cloud", capacity_mw: 700 },
  { id: "meta-prineville", name: "Meta Prineville", operator: "Meta", latitude: 44.3098, longitude: -120.7344, country: "US", type: "cloud", capacity_mw: 500 },
  { id: "meta-lulea", name: "Meta Lulea", operator: "Meta", latitude: 65.5848, longitude: 22.1547, country: "SE", type: "cloud", capacity_mw: 400 },

  // ── AI / GPU Clusters ──────────────────────────────────────────────────
  { id: "msft-phoenix-ai", name: "Microsoft Phoenix AI Datacenter", operator: "Microsoft", latitude: 33.4484, longitude: -112.0740, country: "US", type: "ai", capacity_mw: 1500 },
  { id: "nvidia-dgx-cloud", name: "NVIDIA DGX SuperPOD (CoreWeave)", operator: "NVIDIA/CoreWeave", latitude: 40.7753, longitude: -74.0267, country: "US", type: "ai", capacity_mw: 300 },
  { id: "xai-memphis", name: "xAI Colossus (Memphis)", operator: "xAI", latitude: 35.1495, longitude: -90.0490, country: "US", type: "ai", capacity_mw: 200 },
  { id: "oracle-abilene", name: "Oracle AI Abilene", operator: "Oracle", latitude: 32.4487, longitude: -99.7331, country: "US", type: "ai", capacity_mw: 800 },

  // ── Europe ─────────────────────────────────────────────────────────────
  { id: "equinix-ld8", name: "Equinix LD8 London", operator: "Equinix", latitude: 51.5090, longitude: -0.0102, country: "GB", type: "colocation", capacity_mw: 45 },
  { id: "equinix-fr5", name: "Equinix FR5 Frankfurt", operator: "Equinix", latitude: 50.1109, longitude: 8.6821, country: "DE", type: "colocation", capacity_mw: 50 },
  { id: "equinix-am5", name: "Equinix AM5 Amsterdam", operator: "Equinix", latitude: 52.3441, longitude: 4.8294, country: "NL", type: "colocation", capacity_mw: 40 },
  { id: "aws-eu-west-1", name: "AWS EU West (Dublin)", operator: "Amazon", latitude: 53.3498, longitude: -6.2603, country: "IE", type: "cloud", capacity_mw: 600 },
  { id: "gcp-eemshaven", name: "Google Eemshaven", operator: "Google", latitude: 53.4399, longitude: 6.8325, country: "NL", type: "cloud", capacity_mw: 500 },
  { id: "msft-dublin", name: "Microsoft Dublin", operator: "Microsoft", latitude: 53.3498, longitude: -6.2603, country: "IE", type: "cloud", capacity_mw: 500 },

  // ── Asia Pacific ───────────────────────────────────────────────────────
  { id: "equinix-sg3", name: "Equinix SG3 Singapore", operator: "Equinix", latitude: 1.3521, longitude: 103.8198, country: "SG", type: "colocation", capacity_mw: 30 },
  { id: "equinix-ty4", name: "Equinix TY4 Tokyo", operator: "Equinix", latitude: 35.6762, longitude: 139.6503, country: "JP", type: "colocation", capacity_mw: 35 },
  { id: "aws-ap-southeast-1", name: "AWS Singapore", operator: "Amazon", latitude: 1.2966, longitude: 103.7764, country: "SG", type: "cloud", capacity_mw: 400 },
  { id: "aws-ap-northeast-1", name: "AWS Tokyo", operator: "Amazon", latitude: 35.6804, longitude: 139.7690, country: "JP", type: "cloud", capacity_mw: 500 },
  { id: "alibaba-hangzhou", name: "Alibaba Cloud Hangzhou", operator: "Alibaba", latitude: 30.2741, longitude: 120.1551, country: "CN", type: "cloud", capacity_mw: 600 },
  { id: "tencent-guizhou", name: "Tencent Cloud Guizhou", operator: "Tencent", latitude: 26.6470, longitude: 106.6302, country: "CN", type: "cloud", capacity_mw: 500 },

  // ── Middle East ────────────────────────────────────────────────────────
  { id: "aws-me-south-1", name: "AWS Bahrain", operator: "Amazon", latitude: 26.2235, longitude: 50.5876, country: "BH", type: "cloud", capacity_mw: 200 },
  { id: "msft-qatar", name: "Microsoft Qatar", operator: "Microsoft", latitude: 25.2854, longitude: 51.5310, country: "QA", type: "cloud", capacity_mw: 200 },
  { id: "oracle-jeddah", name: "Oracle Jeddah", operator: "Oracle", latitude: 21.4858, longitude: 39.1925, country: "SA", type: "cloud", capacity_mw: 300 },
];
