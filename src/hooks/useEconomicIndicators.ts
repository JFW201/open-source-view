import { useState, useEffect, useCallback } from "react";
import type { EconomicIndicators } from "../types";
import { cache, CACHE_TTL } from "../services/cache";

// World Bank API indicators
const WB_INDICATORS: Record<string, string> = {
  gdp: "NY.GDP.MKTP.CD",
  gdpGrowth: "FP.CPI.TOTL.ZG",
  inflation: "FP.CPI.TOTL.ZG",
  unemployment: "SL.UEM.TOTL.ZS",
  tradeBalance: "NE.RSB.GNFS.CD",
  populationGrowth: "SP.POP.GROW",
};

// ISO2 to ISO3 mapping for World Bank API (subset of most common)
const ISO2_TO_ISO3: Record<string, string> = {
  AF: "AFG", AL: "ALB", DZ: "DZA", AD: "AND", AO: "AGO",
  AR: "ARG", AM: "ARM", AU: "AUS", AT: "AUT", AZ: "AZE",
  BH: "BHR", BD: "BGD", BY: "BLR", BE: "BEL", BZ: "BLZ",
  BJ: "BEN", BT: "BTN", BO: "BOL", BA: "BIH", BW: "BWA",
  BR: "BRA", BN: "BRN", BG: "BGR", BF: "BFA", BI: "BDI",
  KH: "KHM", CM: "CMR", CA: "CAN", CF: "CAF", TD: "TCD",
  CL: "CHL", CN: "CHN", CO: "COL", CG: "COG", CD: "COD",
  CR: "CRI", CI: "CIV", HR: "HRV", CU: "CUB", CY: "CYP",
  CZ: "CZE", DK: "DNK", DJ: "DJI", DO: "DOM", EC: "ECU",
  EG: "EGY", SV: "SLV", GQ: "GNQ", ER: "ERI", EE: "EST",
  ET: "ETH", FI: "FIN", FR: "FRA", GA: "GAB", GM: "GMB",
  GE: "GEO", DE: "DEU", GH: "GHA", GR: "GRC", GT: "GTM",
  GN: "GIN", GY: "GUY", HT: "HTI", HN: "HND", HU: "HUN",
  IS: "ISL", IN: "IND", ID: "IDN", IR: "IRN", IQ: "IRQ",
  IE: "IRL", IL: "ISR", IT: "ITA", JM: "JAM", JP: "JPN",
  JO: "JOR", KZ: "KAZ", KE: "KEN", KW: "KWT", KG: "KGZ",
  LA: "LAO", LV: "LVA", LB: "LBN", LY: "LBY", LT: "LTU",
  LU: "LUX", MG: "MDG", MW: "MWI", MY: "MYS", ML: "MLI",
  MR: "MRT", MX: "MEX", MD: "MDA", MN: "MNG", ME: "MNE",
  MA: "MAR", MZ: "MOZ", MM: "MMR", NA: "NAM", NP: "NPL",
  NL: "NLD", NZ: "NZL", NI: "NIC", NE: "NER", NG: "NGA",
  KP: "PRK", NO: "NOR", OM: "OMN", PK: "PAK", PA: "PAN",
  PG: "PNG", PY: "PRY", PE: "PER", PH: "PHL", PL: "POL",
  PT: "PRT", QA: "QAT", RO: "ROU", RU: "RUS", RW: "RWA",
  SA: "SAU", SN: "SEN", RS: "SRB", SL: "SLE", SG: "SGP",
  SK: "SVK", SI: "SVN", SO: "SOM", ZA: "ZAF", KR: "KOR",
  SS: "SSD", ES: "ESP", LK: "LKA", SD: "SDN", SE: "SWE",
  CH: "CHE", SY: "SYR", TW: "TWN", TJ: "TJK", TZ: "TZA",
  TH: "THA", TG: "TGO", TN: "TUN", TR: "TUR", TM: "TKM",
  UG: "UGA", UA: "UKR", AE: "ARE", GB: "GBR", US: "USA",
  UY: "URY", UZ: "UZB", VE: "VEN", VN: "VNM", YE: "YEM",
  ZM: "ZMB", ZW: "ZWE",
};

async function fetchWBIndicator(
  countryCode3: string,
  indicator: string
): Promise<{ value: number; year: number } | undefined> {
  try {
    const url = `https://api.worldbank.org/v2/country/${countryCode3}/indicator/${indicator}?format=json&per_page=5&date=2019:2024&mrv=1`;
    const response = await fetch(url);
    if (!response.ok) return undefined;

    const data = await response.json();
    if (!Array.isArray(data) || data.length < 2 || !Array.isArray(data[1]))
      return undefined;

    const entry = data[1].find(
      (d: any) => d.value !== null && d.value !== undefined
    );
    if (!entry) return undefined;

    return { value: entry.value, year: parseInt(entry.date) };
  } catch {
    return undefined;
  }
}

export function useEconomicIndicators(countryCode: string | null) {
  const [indicators, setIndicators] = useState<EconomicIndicators | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchIndicators = useCallback(async () => {
    if (!countryCode) {
      setIndicators(null);
      return;
    }

    const iso3 = ISO2_TO_ISO3[countryCode.toUpperCase()];
    if (!iso3) {
      setIndicators(null);
      return;
    }

    // Check cache
    const cacheKey = `econ-${countryCode}`;
    const cached = await cache.get<EconomicIndicators>(cacheKey);
    if (cached) {
      setIndicators(cached);
      return;
    }

    setIsLoading(true);
    try {
      const [gdp, gdpGrowth, inflation, unemployment, tradeBalance, popGrowth] =
        await Promise.all([
          fetchWBIndicator(iso3, "NY.GDP.MKTP.CD"),
          fetchWBIndicator(iso3, "NY.GDP.MKTP.KD.ZG"),
          fetchWBIndicator(iso3, "FP.CPI.TOTL.ZG"),
          fetchWBIndicator(iso3, "SL.UEM.TOTL.ZS"),
          fetchWBIndicator(iso3, "NE.RSB.GNFS.CD"),
          fetchWBIndicator(iso3, "SP.POP.GROW"),
        ]);

      const result: EconomicIndicators = {
        countryCode,
        gdp,
        gdpGrowth,
        inflation,
        unemployment,
        tradeBalance,
        populationGrowth: popGrowth,
        fetchedAt: new Date().toISOString(),
      };

      setIndicators(result);
      // Cache for 24 hours (economic data doesn't change frequently)
      await cache.set(cacheKey, result, 86400000);
    } catch (err) {
      console.error("Failed to fetch economic indicators:", err);
    } finally {
      setIsLoading(false);
    }
  }, [countryCode]);

  useEffect(() => {
    fetchIndicators();
  }, [fetchIndicators]);

  return { indicators, isLoading, refetch: fetchIndicators };
}
