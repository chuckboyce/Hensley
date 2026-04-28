const ACS_YEAR = 2023;
const ACS_BASE = `https://api.census.gov/data/${ACS_YEAR}/acs/acs5`;

const NEIGHBORHOOD_TRACTS: Record<string, { tractId: string; countyFips: string; stateFips: string; name: string }> = {
  "parkside": { tractId: "016612", countyFips: "003", stateFips: "10", name: "Parkside" },
  "st-annes": { tractId: "016807", countyFips: "003", stateFips: "10", name: "The Estates at St. Anne's" },
  "bayberry": { tractId: "016611", countyFips: "003", stateFips: "10", name: "Bayberry" },
  "whitehall": { tractId: "016614", countyFips: "003", stateFips: "10", name: "The Town of Whitehall" },
  "hyetts-corner": { tractId: "016608", countyFips: "003", stateFips: "10", name: "Hyetts Corner / Hyetts Crossing" },
};

interface CensusData {
  ownerOccupancyPct: number | null;
  medianHouseholdIncome: number | null;
  medianYearBuilt: number | null;
  vintageYear: number;
  tractId: string;
  neighborhoodName: string;
  asOfDate: string;
  cachedUntil: string;
}

interface CacheEntry {
  data: CensusData;
  expiresAt: Date;
}

const censusCache: Map<string, CacheEntry> = new Map();

function getNextJanuary1(): Date {
  const now = new Date();
  const nextYear = now.getFullYear() + 1;
  return new Date(Date.UTC(nextYear, 0, 1));
}

export function getNeighborhoodTractInfo(slug: string) {
  return NEIGHBORHOOD_TRACTS[slug] || null;
}

export async function getCensusData(slug: string): Promise<CensusData | null> {
  const tractInfo = NEIGHBORHOOD_TRACTS[slug];
  if (!tractInfo) return null;

  const cached = censusCache.get(slug);
  if (cached && cached.expiresAt > new Date()) {
    return cached.data;
  }

  const apiKey = process.env.CENSUS_API_KEY;
  if (!apiKey) {
    console.warn("CENSUS_API_KEY not set — Census data unavailable");
    return null;
  }

  const { tractId, countyFips, stateFips } = tractInfo;

  try {
    const vars = ["B25003_001E", "B25003_002E", "B19013_001E", "B25035_001E"];
    const url = `${ACS_BASE}?get=${vars.join(",")}&for=tract:${tractId}&in=state:${stateFips}+county:${countyFips}&key=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Census API error for tract ${tractId}: ${response.status} ${response.statusText}`);
      return null;
    }

    const json = (await response.json()) as string[][];
    if (!json || json.length < 2) return null;

    const headers = json[0];
    const row = json[1];

    const get = (varName: string): number | null => {
      const idx = headers.indexOf(varName);
      if (idx === -1) return null;
      const val = parseInt(row[idx], 10);
      return isNaN(val) || val < 0 ? null : val;
    };

    const totalUnits = get("B25003_001E");
    const ownerOccupied = get("B25003_002E");
    const medianIncome = get("B19013_001E");
    const medianYearBuilt = get("B25035_001E");

    const ownerOccupancyPct =
      totalUnits && ownerOccupied ? Math.round((ownerOccupied / totalUnits) * 100) : null;

    const expiresAt = getNextJanuary1();
    const data: CensusData = {
      ownerOccupancyPct,
      medianHouseholdIncome: medianIncome,
      medianYearBuilt,
      vintageYear: ACS_YEAR,
      tractId,
      neighborhoodName: tractInfo.name,
      asOfDate: `ACS 5-Year Estimates, ${ACS_YEAR}`,
      cachedUntil: expiresAt.toISOString().split("T")[0],
    };

    censusCache.set(slug, { data, expiresAt });
    console.log(`✅ Census data cached for ${tractInfo.name} until ${data.cachedUntil}`);
    return data;
  } catch (err) {
    console.error(`Failed to fetch Census data for ${slug}:`, err);
    return null;
  }
}
