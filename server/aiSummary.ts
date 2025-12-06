import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
// This uses Replit's AI Integrations service, which provides OpenAI-compatible API access
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

interface PropertyForSummary {
  address: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  listPrice: string;
  bedroomsTotal?: number | null;
  bathroomsFull?: number | null;
  livingArea?: number | null;
  yearBuilt?: number | null;
  publicRemarks?: string | null;
  isRental?: boolean;
}

/**
 * Generate an AI-summarized description for schema markup
 * Max 300 characters, preserving relevant real estate keywords
 */
export async function generatePropertySummary(property: PropertyForSummary): Promise<string> {
  // If no description provided, create a basic one from property details
  if (!property.publicRemarks || property.publicRemarks.trim().length < 20) {
    return createBasicSummary(property);
  }

  try {
    const propertyType = property.isRental ? "rental property" : "home for sale";
    const priceText = property.isRental 
      ? `$${parseInt(property.listPrice).toLocaleString()}/month` 
      : `$${parseInt(property.listPrice).toLocaleString()}`;

    const prompt = `Summarize this real estate listing description in exactly 1-2 sentences, maximum 280 characters. 
Keep important keywords like: location features, home style, upgrades, school districts, community amenities.
Do NOT include the price or address - those are shown separately.
Be concise but highlight what makes this property special.

Property: ${property.bedroomsTotal || '?'} bed, ${property.bathroomsFull || '?'} bath ${propertyType} in ${property.city}, ${property.stateOrProvince}
${property.livingArea ? `${property.livingArea.toLocaleString()} sq ft` : ''}
${property.yearBuilt ? `Built ${property.yearBuilt}` : ''}

Original description:
${property.publicRemarks}

Respond with ONLY the summary, no quotes or extra text:`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using faster/cheaper model for summaries
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    let summary = response.choices[0]?.message?.content?.trim() || "";
    
    // Ensure it's under 300 characters
    if (summary.length > 300) {
      summary = summary.substring(0, 297) + "...";
    }

    // Fallback if AI returns empty
    if (!summary || summary.length < 10) {
      return createBasicSummary(property);
    }

    return summary;
  } catch (error) {
    console.error("[AI Summary] Error generating summary:", error);
    return createBasicSummary(property);
  }
}

/**
 * Create a basic summary from property details when AI is unavailable
 */
function createBasicSummary(property: PropertyForSummary): string {
  const parts: string[] = [];
  
  if (property.bedroomsTotal) {
    parts.push(`${property.bedroomsTotal} bedroom`);
  }
  if (property.bathroomsFull) {
    parts.push(`${property.bathroomsFull} bathroom`);
  }
  
  const propertyType = property.isRental ? "rental" : "home";
  
  let summary = "";
  if (parts.length > 0) {
    summary = `${parts.join(", ")} ${propertyType}`;
  } else {
    summary = `${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}`;
  }
  
  summary += ` in ${property.city}, ${property.stateOrProvince}`;
  
  if (property.livingArea) {
    summary += `. ${property.livingArea.toLocaleString()} sq ft`;
  }
  
  if (property.yearBuilt) {
    summary += `, built ${property.yearBuilt}`;
  }
  
  summary += ".";
  
  // Ensure under 300 chars
  if (summary.length > 300) {
    summary = summary.substring(0, 297) + "...";
  }
  
  return summary;
}

/**
 * Batch generate summaries for multiple properties
 * Uses rate limiting to avoid API overload
 */
export async function batchGenerateSummaries(
  properties: Array<PropertyForSummary & { listingKey: string }>
): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  
  // Process in batches of 3 with delay between batches
  const batchSize = 3;
  for (let i = 0; i < properties.length; i += batchSize) {
    const batch = properties.slice(i, i + batchSize);
    
    const promises = batch.map(async (property) => {
      const summary = await generatePropertySummary(property);
      results.set(property.listingKey, summary);
    });
    
    await Promise.all(promises);
    
    // Small delay between batches to respect rate limits
    if (i + batchSize < properties.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return results;
}
