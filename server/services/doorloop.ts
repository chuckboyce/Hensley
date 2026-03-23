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

interface DoorLoopPicture {
  fileId: string;
  rank: number;
  url: string;
}

interface DoorLoopProperty {
  id: string;
  name: string;
  active: boolean;
  address: DoorLoopAddress;
  type: string;
  class: string;
  numActiveUnits?: number;
  description?: string;
  pictures?: DoorLoopPicture[];
  amenities?: string[];
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
  photos: string[];
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

async function fetchPropertyDetail(propertyId: string): Promise<DoorLoopProperty | null> {
  try {
    return await fetchJson<DoorLoopProperty>(`/properties/${propertyId}`);
  } catch {
    return null;
  }
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

  const activeUnits = units.filter(
    (u) => u.active && (u.rentalApplicationListing?.activeListing === true || u.listing?.activeListing === true)
  );

  // Fetch individual property records (with photos + description) for active units only
  const uniquePropertyIds = [...new Set(activeUnits.map((u) => u.property))];
  const detailedProperties = await Promise.all(uniquePropertyIds.map(fetchPropertyDetail));
  const detailedMap = new Map<string, DoorLoopProperty>();
  for (const p of detailedProperties) {
    if (p) detailedMap.set(p.id, p);
  }

  const listings: RentalListing[] = activeUnits
    .map((u) => {
      const prop = detailedMap.get(u.property) ?? propertiesMap.get(u.property);
      const beds = u.beds || u.numBedrooms || null;
      const baths = u.baths || u.numBathrooms || null;
      const sqft = u.size || u.squareFeet || null;
      const rent = u.marketRent ?? u.listing?.rent ?? null;
      const deposit = u.listing?.deposit ?? null;
      const dateAvailable = u.listing?.dateAvailable ?? null;

      // Description: prefer property-level (richer), fall back to unit-level
      const rawDesc = prop?.description?.trim() || u.description?.trim() || null;
      const description = rawDesc && rawDesc.length > 0 ? rawDesc : null;

      // Merge unit amenities + property amenities, deduplicated
      const unitAmenities = u.amenities ?? [];
      const propAmenities = prop?.amenities ?? [];
      const amenities = [...new Set([...unitAmenities, ...propAmenities])];

      // Photos sorted by rank
      const photos = (prop?.pictures ?? [])
        .sort((a, b) => a.rank - b.rank)
        .map((p) => p.url);

      // Listing URL: public DoorLoop tenant-facing listing page
      const listingUrl = `https://74458621.app.doorloop.com/listings/${u.property}?listingId=${u.id}`;

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
        photos,
        propertyId: u.property,
        propertyName: prop?.name ?? null,
        propertyType: prop?.type ?? null,
        listingUrl,
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
