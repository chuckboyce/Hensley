/**
 * DoorLoop API Service
 * Fetches active rental listings from DoorLoop property management platform.
 * Base URL: https://app.doorloop.com/api
 * Auth: Bearer token via DOORLOOP_API_KEY env var
 */

const DOORLOOP_BASE = "https://app.doorloop.com/api";

interface DoorLoopAddress {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  lat?: number;
  lng?: number;
}

interface DoorLoopUnit {
  id: string;
  name: string;
  active: boolean;
  address: DoorLoopAddress;
  addressSameAsProperty: boolean;
  marketRent?: number;
  property: string;
  rentalApplicationListing?: { activeListing: boolean };
  numBedrooms?: number;
  numBathrooms?: number;
  squareFeet?: number;
  inEviction: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DoorLoopProperty {
  id: string;
  name: string;
  active: boolean;
  address: DoorLoopAddress;
  type: string;
  class: string;
  numActiveUnits?: number;
}

export interface RentalListing {
  id: string;
  name: string;
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  marketRent: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFeet: number | null;
  propertyId: string;
  propertyName: string | null;
  propertyType: string | null;
  listingUrl: string;
  updatedAt: string;
}

// Simple in-memory cache
let cachedListings: RentalListing[] | null = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function getApiKey(): string {
  const key = process.env.DOORLOOP_API_KEY;
  if (!key) throw new Error("DOORLOOP_API_KEY environment variable is not set");
  return key;
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${DOORLOOP_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`DoorLoop API error ${res.status} for ${path}`);
  }
  return res.json() as Promise<T>;
}

async function fetchAllUnits(): Promise<DoorLoopUnit[]> {
  const data = await fetchJson<{ data: DoorLoopUnit[]; total: number }>("/units");
  return data.data || [];
}

async function fetchAllProperties(): Promise<Map<string, DoorLoopProperty>> {
  const data = await fetchJson<{ data: DoorLoopProperty[] }>("/properties");
  const map = new Map<string, DoorLoopProperty>();
  for (const p of data.data || []) {
    map.set(p.id, p);
  }
  return map;
}

export async function getActiveRentalListings(forceRefresh = false): Promise<RentalListing[]> {
  const now = Date.now();
  if (!forceRefresh && cachedListings && now < cacheExpiry) {
    return cachedListings;
  }

  console.log("🏠 Fetching rental listings from DoorLoop...");
  const [units, propertiesMap] = await Promise.all([
    fetchAllUnits(),
    fetchAllProperties(),
  ]);

  const listings: RentalListing[] = units
    .filter((u) => u.active && u.rentalApplicationListing?.activeListing === true)
    .map((u) => {
      const prop = propertiesMap.get(u.property);
      return {
        id: u.id,
        name: u.name,
        street: u.address.street1,
        street2: u.address.street2 || "",
        city: u.address.city,
        state: u.address.state,
        zip: u.address.zip,
        marketRent: u.marketRent ?? null,
        bedrooms: u.numBedrooms ?? null,
        bathrooms: u.numBathrooms ?? null,
        squareFeet: u.squareFeet ?? null,
        propertyId: u.property,
        propertyName: prop?.name ?? null,
        propertyType: prop?.type ?? null,
        listingUrl: `https://app.doorloop.com/listings/${u.property}`,
        updatedAt: u.updatedAt,
      };
    })
    .sort((a, b) => (a.marketRent ?? 0) - (b.marketRent ?? 0));

  cachedListings = listings;
  cacheExpiry = now + CACHE_TTL_MS;
  console.log(`✅ Loaded ${listings.length} active DoorLoop rental listings`);
  return listings;
}

export function clearRentalListingsCache(): void {
  cachedListings = null;
  cacheExpiry = 0;
}
