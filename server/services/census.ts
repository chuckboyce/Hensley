const ACS_YEAR = 2023;
const ACS_BASE = `https://api.census.gov/data/${ACS_YEAR}/acs/acs5`;

/**
 * Census tract mappings for every area page.
 *
 * For communities that span multiple tracts (Bear, Pike Creek) we use the
 * most representative/central tract.  Multi-tract coverage can be expanded
 * in a future iteration.
 *
 * FIPS reference:
 *   State:   Delaware = 10  |  Maryland = 24
 *   County:  New Castle DE = 003  |  Kent DE = 001  |  Cecil MD = 015
 *
 * Tract IDs sourced via Census TIGER geocoder (April 2026).
 */
const NEIGHBORHOOD_TRACTS: Record<string, {
  tractId: string;
  countyFips: string;
  stateFips: string;
  name: string;
  /** GEOID = stateFips + countyFips + tractId — used for schema @id */
  geoid: string;
}> = {
  // ── Middletown sub-neighborhoods (original) ─────────────────────────────
  "parkside":      { tractId: "016612", countyFips: "003", stateFips: "10", name: "Parkside",                         geoid: "10003016612" },
  "st-annes":      { tractId: "016807", countyFips: "003", stateFips: "10", name: "The Estates at St. Anne's",        geoid: "10003016807" },
  "bayberry":      { tractId: "016611", countyFips: "003", stateFips: "10", name: "Bayberry",                         geoid: "10003016611" },
  "whitehall":     { tractId: "016614", countyFips: "003", stateFips: "10", name: "The Town of Whitehall",            geoid: "10003016614" },
  "hyetts-corner": { tractId: "016608", countyFips: "003", stateFips: "10", name: "Hyetts Corner / Hyetts Crossing",  geoid: "10003016608" },

  // ── Delaware area pages ──────────────────────────────────────────────────
  // Bear: large unincorporated area — tract 016301 covers the Bear core
  "bear-de":           { tractId: "016301", countyFips: "003", stateFips: "10", name: "Bear",           geoid: "10003016301" },
  "hockessin-de":      { tractId: "013508", countyFips: "003", stateFips: "10", name: "Hockessin",      geoid: "10003013508" },
  // Smyrna: Kent County tract 040201
  "smyrna-de":         { tractId: "040201", countyFips: "001", stateFips: "10", name: "Smyrna",         geoid: "10001040201" },
  "townsend-de":       { tractId: "016901", countyFips: "003", stateFips: "10", name: "Townsend",       geoid: "10003016901" },
  "new-castle-de":     { tractId: "016100", countyFips: "003", stateFips: "10", name: "New Castle",     geoid: "10003016100" },
  "odessa-de":         { tractId: "016614", countyFips: "003", stateFips: "10", name: "Odessa",         geoid: "10003016614" },
  "north-star-de":     { tractId: "013612", countyFips: "003", stateFips: "10", name: "North Star",     geoid: "10003013612" },
  "centreville-de":    { tractId: "011800", countyFips: "003", stateFips: "10", name: "Centreville",    geoid: "10003011800" },
  "delaware-city-de":  { tractId: "016404", countyFips: "003", stateFips: "10", name: "Delaware City",  geoid: "10003016404" },
  "glasgow-de":        { tractId: "013800", countyFips: "003", stateFips: "10", name: "Glasgow",        geoid: "10003013800" },
  // Clayton: Kent County tract 040201 (same as Smyrna — adjacent)
  "clayton-de":        { tractId: "040201", countyFips: "001", stateFips: "10", name: "Clayton",        geoid: "10001040201" },
  "newark-de":         { tractId: "014402", countyFips: "003", stateFips: "10", name: "Newark",         geoid: "10003014402" },
  // Pike Creek: tract 013505 (Pike Creek Valley core)
  "pike-creek-de":     { tractId: "013505", countyFips: "003", stateFips: "10", name: "Pike Creek",     geoid: "10003013505" },

  // ── Wilmington & sub-neighborhoods ──────────────────────────────────────
  "wilmington-de":           { tractId: "002800", countyFips: "003", stateFips: "10", name: "Wilmington",         geoid: "10003002800" },
  "north-wilmington":        { tractId: "011000", countyFips: "003", stateFips: "10", name: "North Wilmington",   geoid: "10003011000" },
  "highlands":               { tractId: "001300", countyFips: "003", stateFips: "10", name: "Highlands",          geoid: "10003001300" },
  "forty-acres":             { tractId: "002300", countyFips: "003", stateFips: "10", name: "Forty Acres",        geoid: "10003002300" },
  "trolley-square":          { tractId: "001400", countyFips: "003", stateFips: "10", name: "Trolley Square",     geoid: "10003001400" },

  // ── Maryland area pages ──────────────────────────────────────────────────
  "chesapeake-city-md": { tractId: "030200", countyFips: "015", stateFips: "24", name: "Chesapeake City", geoid: "24015030200" },
  "elkton-md":          { tractId: "030400", countyFips: "015", stateFips: "24", name: "Elkton",          geoid: "24015030400" },
  "north-east-md":      { tractId: "030903", countyFips: "015", stateFips: "24", name: "North East",      geoid: "24015030903" },
  "perryville-md":      { tractId: "031202", countyFips: "015", stateFips: "24", name: "Perryville",      geoid: "24015031202" },
};

// ── ACS variable definitions ─────────────────────────────────────────────────
//
// B25003 — Tenure (owner vs renter)
//   B25003_001E  total housing units
//   B25003_002E  owner-occupied
//
// B19013 — Median household income
//   B19013_001E
//
// B25035 — Median year structure built
//   B25035_001E
//
// B01001 — Sex by age (used to derive median age and age distribution)
//   B01001_001E  total population
//   B01001_003E–B01001_025E  male age groups
//   B01001_027E–B01001_049E  female age groups
//   We pull summary age-group buckets to build under-18 / 18-64 / 65+ splits:
//   Under 18:  B01001_003–009 (male) + B01001_027–033 (female)
//   65+:       B01001_020–025 (male) + B01001_044–049 (female)
//
// B25034 — Year structure built (10 decadal buckets)
//   B25034_001E  total
//   B25034_002E  built 2020 or later
//   B25034_003E  built 2010–2019
//   B25034_004E  built 2000–2009
//   B25034_005E  built 1990–1999
//   B25034_006E  built 1980–1989
//   B25034_007E  built 1970–1979
//   B25034_008E  built 1960–1969
//   B25034_009E  built 1950–1959
//   B25034_010E  built 1940–1949
//   B25034_011E  built 1939 or earlier
//
// B08301 — Means of transportation to work
//   B08301_001E  total workers 16+
//   B08301_003E  drove alone
//   B08301_004E  carpooled
//   B08301_010E  public transport
//   B08301_019E  walked
//   B08301_021E  worked from home
//
// B11001 — Household type
//   B11001_001E  total households
//   B11001_002E  family households
//   B11001_003E  married-couple family

const ACS_VARS = [
  // Tenure
  "B25003_001E", "B25003_002E",
  // Income
  "B19013_001E",
  // Median year built
  "B25035_001E",
  // Age groups (under 18: male 003-006, female 027-030; 65+: male 020-025, female 044-049)
  "B01001_001E",
  "B01001_003E","B01001_004E","B01001_005E","B01001_006E",
  "B01001_020E","B01001_021E","B01001_022E","B01001_023E","B01001_024E","B01001_025E",
  "B01001_027E","B01001_028E","B01001_029E","B01001_030E",
  "B01001_044E","B01001_045E","B01001_046E","B01001_047E","B01001_048E","B01001_049E",
  // Year structure built
  "B25034_001E","B25034_002E","B25034_003E","B25034_004E","B25034_005E","B25034_006E",
  "B25034_007E","B25034_008E","B25034_009E","B25034_010E","B25034_011E",
  // Commute mode
  "B08301_001E","B08301_003E","B08301_004E","B08301_010E","B08301_019E","B08301_021E",
  // Household type
  "B11001_001E","B11001_002E","B11001_003E",
];

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AgeBuckets {
  under18Pct: number | null;
  age18to64Pct: number | null;
  age65plusPct: number | null;
  totalPopulation: number | null;
}

export interface YearBuiltBuckets {
  total: number | null;
  /** Percent built 2000 or later */
  pctBuiltPost2000: number | null;
  /** Percent built 1980–1999 */
  pctBuilt1980to1999: number | null;
  /** Percent built before 1980 */
  pctBuiltPre1980: number | null;
}

export interface CommuteMode {
  total: number | null;
  droveAlonePct: number | null;
  carpoolPct: number | null;
  transitPct: number | null;
  walkedPct: number | null;
  workFromHomePct: number | null;
}

export interface HouseholdType {
  totalHouseholds: number | null;
  familyHouseholdPct: number | null;
  marriedCouplePct: number | null;
}

export interface CensusData {
  // Original fields
  ownerOccupancyPct: number | null;
  medianHouseholdIncome: number | null;
  medianYearBuilt: number | null;
  vintageYear: number;
  tractId: string;
  geoid: string;
  neighborhoodName: string;
  asOfDate: string;
  cachedUntil: string;
  // New fields (Gap 3)
  ageBuckets: AgeBuckets;
  yearBuiltBuckets: YearBuiltBuckets;
  commuteMode: CommuteMode;
  householdType: HouseholdType;
}

interface CacheEntry {
  data: CensusData;
  expiresAt: Date;
}

const censusCache: Map<string, CacheEntry> = new Map();

function getNextJanuary1(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear() + 1, 0, 1));
}

export function getNeighborhoodTractInfo(slug: string) {
  return NEIGHBORHOOD_TRACTS[slug] || null;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function safeInt(headers: string[], row: string[], varName: string): number | null {
  const idx = headers.indexOf(varName);
  if (idx === -1) return null;
  const val = parseInt(row[idx], 10);
  return isNaN(val) || val < 0 ? null : val;
}

function pct(num: number | null, denom: number | null): number | null {
  if (num === null || denom === null || denom === 0) return null;
  return Math.round((num / denom) * 100);
}

function sumVars(headers: string[], row: string[], varNames: string[]): number | null {
  let total = 0;
  let anyFound = false;
  for (const v of varNames) {
    const val = safeInt(headers, row, v);
    if (val !== null) { total += val; anyFound = true; }
  }
  return anyFound ? total : null;
}

// ── Main fetch ────────────────────────────────────────────────────────────────

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
    const url = `${ACS_BASE}?get=${ACS_VARS.join(",")}&for=tract:${tractId}&in=state:${stateFips}+county:${countyFips}&key=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Census API error for tract ${tractId}: ${response.status} ${response.statusText}`);
      return null;
    }

    const json = (await response.json()) as string[][];
    if (!json || json.length < 2) return null;

    const headers = json[0];
    const row = json[1];
    const g = (v: string) => safeInt(headers, row, v);

    // ── Tenure ──
    const totalUnits  = g("B25003_001E");
    const ownerOccupied = g("B25003_002E");
    const ownerOccupancyPct = pct(ownerOccupied, totalUnits);

    // ── Income / Year built ──
    const medianHouseholdIncome = g("B19013_001E");
    const medianYearBuilt       = g("B25035_001E");

    // ── Age buckets ──
    const totalPop = g("B01001_001E");
    const under18Male   = sumVars(headers, row, ["B01001_003E","B01001_004E","B01001_005E","B01001_006E"]);
    const under18Female = sumVars(headers, row, ["B01001_027E","B01001_028E","B01001_029E","B01001_030E"]);
    const age65plusMale   = sumVars(headers, row, ["B01001_020E","B01001_021E","B01001_022E","B01001_023E","B01001_024E","B01001_025E"]);
    const age65plusFemale = sumVars(headers, row, ["B01001_044E","B01001_045E","B01001_046E","B01001_047E","B01001_048E","B01001_049E"]);

    const under18 = (under18Male !== null && under18Female !== null) ? under18Male + under18Female : null;
    const age65plus = (age65plusMale !== null && age65plusFemale !== null) ? age65plusMale + age65plusFemale : null;
    const age18to64 = (totalPop !== null && under18 !== null && age65plus !== null)
      ? totalPop - under18 - age65plus : null;

    const ageBuckets: AgeBuckets = {
      under18Pct:    pct(under18, totalPop),
      age18to64Pct:  pct(age18to64, totalPop),
      age65plusPct:  pct(age65plus, totalPop),
      totalPopulation: totalPop,
    };

    // ── Year built buckets ──
    const ybTotal     = g("B25034_001E");
    const ybPost2000  = sumVars(headers, row, ["B25034_002E","B25034_003E","B25034_004E"]); // 2000+
    const yb1980_1999 = sumVars(headers, row, ["B25034_005E","B25034_006E"]);               // 1980–1999
    const ybPre1980   = sumVars(headers, row, ["B25034_007E","B25034_008E","B25034_009E","B25034_010E","B25034_011E"]);

    const yearBuiltBuckets: YearBuiltBuckets = {
      total: ybTotal,
      pctBuiltPost2000:    pct(ybPost2000, ybTotal),
      pctBuilt1980to1999:  pct(yb1980_1999, ybTotal),
      pctBuiltPre1980:     pct(ybPre1980, ybTotal),
    };

    // ── Commute mode ──
    const commuteTotal = g("B08301_001E");
    const commuteMode: CommuteMode = {
      total:            commuteTotal,
      droveAlonePct:    pct(g("B08301_003E"), commuteTotal),
      carpoolPct:       pct(g("B08301_004E"), commuteTotal),
      transitPct:       pct(g("B08301_010E"), commuteTotal),
      walkedPct:        pct(g("B08301_019E"), commuteTotal),
      workFromHomePct:  pct(g("B08301_021E"), commuteTotal),
    };

    // ── Household type ──
    const totalHH = g("B11001_001E");
    const familyHH = g("B11001_002E");
    const marriedHH = g("B11001_003E");
    const householdType: HouseholdType = {
      totalHouseholds:    totalHH,
      familyHouseholdPct: pct(familyHH, totalHH),
      marriedCouplePct:   pct(marriedHH, totalHH),
    };

    const expiresAt = getNextJanuary1();
    const data: CensusData = {
      ownerOccupancyPct,
      medianHouseholdIncome,
      medianYearBuilt,
      vintageYear: ACS_YEAR,
      tractId,
      geoid: tractInfo.geoid,
      neighborhoodName: tractInfo.name,
      asOfDate: `ACS 5-Year Estimates, ${ACS_YEAR}`,
      cachedUntil: expiresAt.toISOString().split("T")[0],
      ageBuckets,
      yearBuiltBuckets,
      commuteMode,
      householdType,
    };

    censusCache.set(slug, { data, expiresAt });
    console.log(`✅ Census data cached for ${tractInfo.name} (tract ${tractId}) until ${data.cachedUntil}`);
    return data;
  } catch (err) {
    console.error(`Failed to fetch Census data for ${slug}:`, err);
    return null;
  }
}
