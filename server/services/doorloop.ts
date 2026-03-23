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
  listing?: {
    activeListing: boolean;
    dateAvailable?: string;
    rent?: number;
    deposit?: number;
  };
  listed?: boolean;
  // beds/baths/size come back as these names on active listing units
  beds?: number;
  baths?: number;
  size?: number;
  // legacy field names (may still appear)
  numBedrooms?: number;
  numBathrooms?: number;
  squareFeet?: number;
  description?: string;
  amenities?: string[];
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
  lat: number | null;
  lng: number | null;
  marketRent: number | null;
  deposit: number | null;
  dateAvailable: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFeet: number | null;
  description: string | null;
  amenities: string[];
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
    .filter((u) => u.active && (u.rentalApplicationListing?.activeListing === true || u.listing?.activeListing === true))
    .map((u) => {
      const prop = propertiesMap.get(u.property);
      const beds = u.beds || u.numBedrooms || null;
      const baths = u.baths || u.numBathrooms || null;
      const sqft = u.size || u.squareFeet || null;
      const rent = u.marketRent ?? u.listing?.rent ?? null;
      const deposit = u.listing?.deposit ?? null;
      const dateAvailable = u.listing?.dateAvailable ?? null;
      const description = u.description && u.description.trim() ? u.description.trim() : null;
      const amenities = u.amenities ?? [];
      return {
        id: u.id,
        name: u.name,
        street: u.address.street1,
        street2: u.address.street2 || "",
        city: u.address.city,
        state: u.address.state,
        zip: u.address.zip,
        lat: u.address.lat ?? null,
        lng: u.address.lng ?? null,
        marketRent: rent,
        deposit,
        dateAvailable,
        bedrooms: beds && beds > 0 ? beds : null,
        bathrooms: baths && baths > 0 ? baths : null,
        squareFeet: sqft && sqft > 0 ? sqft : null,
        description,
        amenities,
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

export interface CreateOwnerPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
  title?: string;
}

export interface DoorLoopOwner {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  name: string;
  active: boolean;
  emails: { type: string; address: string }[];
  phones: { type: string; number: string }[];
  companyName?: string;
  title?: string;
  createdAt: string;
}

export async function createOwner(payload: CreateOwnerPayload): Promise<DoorLoopOwner> {
  const body: Record<string, unknown> = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    emails: [{ type: "Primary", address: payload.email }],
    phones: [{ type: "Mobile", number: payload.phone }],
    active: false,
  };
  if (payload.companyName) body.companyName = payload.companyName;
  if (payload.title) body.title = payload.title;

  const res = await fetch(`${DOORLOOP_BASE}/owners`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DoorLoop create owner failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<DoorLoopOwner>;
}
