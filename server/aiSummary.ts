import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

interface PropertyForSummary {
  address: string | null;
  city: string | null;
  stateOrProvince: string | null;
  postalCode: string | null;
  listPrice: string | null;
  bedroomsTotal?: number | null;
  bathroomsFull?: number | null;
  livingArea?: number | null;
  yearBuilt?: number | null;
  publicRemarks?: string | null;
  isRental?: boolean | null;
}

let lastApiCall = 0;
const MIN_DELAY_BETWEEN_CALLS = 500;
let consecutiveErrors = 0;
const MAX_CONSECUTIVE_ERRORS = 5;

function sanitizeString(str: string): string {
  return str
    .replace(/[\x00-\x1F\x7F]/g, '')
    .replace(/\uFFFD/g, '')
    .trim();
}

async function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCall;
  
  const backoffMultiplier = Math.min(Math.pow(2, consecutiveErrors), 32);
  const requiredDelay = MIN_DELAY_BETWEEN_CALLS * backoffMultiplier;
  
  if (timeSinceLastCall < requiredDelay) {
    await new Promise(resolve => setTimeout(resolve, requiredDelay - timeSinceLastCall));
  }
  
  lastApiCall = Date.now();
}

export async function generatePropertySummary(property: PropertyForSummary): Promise<string> {
  if (!property.publicRemarks || property.publicRemarks.trim().length < 20) {
    return createBasicSummary(property);
  }

  if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
    console.warn("[AI Summary] Too many consecutive errors, using fallback");
    return createBasicSummary(property);
  }

  try {
    await waitForRateLimit();
    
    const propertyType = property.isRental ? "rental property" : "home for sale";
    const city = property.city || "the area";
    const state = property.stateOrProvince || "";

    const prompt = `Summarize this real estate listing description in exactly 1-2 sentences, maximum 280 characters. 
Keep important keywords like: location features, home style, upgrades, school districts, community amenities.
Do NOT include the price or address - those are shown separately.
Be concise but highlight what makes this property special.

Property: ${property.bedroomsTotal || '?'} bed, ${property.bathroomsFull || '?'} bath ${propertyType} in ${city}${state ? `, ${state}` : ''}
${property.livingArea ? `${property.livingArea.toLocaleString()} sq ft` : ''}
${property.yearBuilt ? `Built ${property.yearBuilt}` : ''}

Original description:
${property.publicRemarks.substring(0, 1500)}

Respond with ONLY the summary, no quotes or extra text:`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    consecutiveErrors = 0;

    let summary = response.choices[0]?.message?.content?.trim() || "";
    summary = sanitizeString(summary);
    
    if (summary.length > 300) {
      const lastSpace = summary.lastIndexOf(' ', 297);
      summary = summary.substring(0, lastSpace > 200 ? lastSpace : 297) + "...";
    }

    if (!summary || summary.length < 10) {
      return createBasicSummary(property);
    }

    return summary;
  } catch (error: any) {
    consecutiveErrors++;
    
    if (error?.status === 429 || error?.code === 'rate_limit_exceeded') {
      console.warn("[AI Summary] Rate limited, backing off...");
      lastApiCall = Date.now() + 30000;
    } else if (error?.status >= 500) {
      console.warn("[AI Summary] Server error, backing off...");
      lastApiCall = Date.now() + 10000;
    }
    
    console.error("[AI Summary] Error generating summary:", error?.message || error);
    return createBasicSummary(property);
  }
}

function createBasicSummary(property: PropertyForSummary): string {
  const parts: string[] = [];
  
  if (property.bedroomsTotal) {
    parts.push(`${property.bedroomsTotal} bedroom`);
  }
  if (property.bathroomsFull) {
    parts.push(`${property.bathroomsFull} bathroom`);
  }
  
  const propertyType = property.isRental ? "rental" : "home";
  const city = property.city || "Delaware";
  const state = property.stateOrProvince || "";
  
  let summary = "";
  if (parts.length > 0) {
    summary = `${parts.join(", ")} ${propertyType}`;
  } else {
    summary = `${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}`;
  }
  
  summary += ` in ${city}${state ? `, ${state}` : ''}`;
  
  if (property.livingArea) {
    summary += `. ${property.livingArea.toLocaleString()} sq ft`;
  }
  
  if (property.yearBuilt) {
    summary += `, built ${property.yearBuilt}`;
  }
  
  summary += ".";
  
  if (summary.length > 300) {
    summary = summary.substring(0, 297) + "...";
  }
  
  return sanitizeString(summary);
}

export function resetErrorCount(): void {
  consecutiveErrors = 0;
}
