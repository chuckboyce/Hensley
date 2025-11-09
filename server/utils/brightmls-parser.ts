/**
 * Parser for BrightMLS PDF text export
 * Extracts property data from the standardized BrightMLS format
 */

export interface ParsedPropertyData {
  // Core fields
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  listPrice?: string;
  status?: string;
  mlsNumber?: string;
  
  // Property details
  bedrooms?: number;
  bathroomsFull?: number;
  bathroomsHalf?: number;
  squareFeet?: number;
  lotSizeAcres?: number;
  yearBuilt?: number;
  
  // Description
  description?: string;
  
  // Additional details
  propertyType?: string;
  subdivision?: string;
  schoolDistrict?: string;
  taxAmount?: string;
  hoaFee?: string;
}

export function parseBrightMLSText(text: string): ParsedPropertyData {
  const data: ParsedPropertyData = {};
  
  // Extract MLS Number (e.g., "DENC2091894")
  const mlsMatch = text.match(/MLS Number\s+([A-Z0-9]+)/i) || 
                   text.match(/MLS #?\s*:?\s*([A-Z0-9]+)/i);
  if (mlsMatch) {
    data.mlsNumber = mlsMatch[1].trim();
  }
  
  // Extract address from top section (e.g., "636 Courtly Rd, Townsend, DE 19734")
  const addressMatch = text.match(/(\d+\s+[^,\n]+),\s*([^,\n]+),\s*([A-Z]{2})\s+(\d{5})/);
  if (addressMatch) {
    data.address = addressMatch[1].trim();
    data.city = addressMatch[2].trim();
    data.state = addressMatch[3].trim();
    data.zipCode = addressMatch[4].trim();
  }
  
  // Extract price (e.g., "$374,900" or "$374,900.00")
  const priceMatch = text.match(/\$?([\d,]+)(?:\.\d{2})?\s*\n.*(?:Active|Pending|Sold|Under Contract)/i) ||
                    text.match(/List Price\s+\$?([\d,]+)/i);
  if (priceMatch) {
    data.listPrice = priceMatch[1].replace(/,/g, '');
  }
  
  // Extract status
  const statusMatch = text.match(/(Active Under Contract|Active|Pending|Sold|Closed|Expired)/i);
  if (statusMatch) {
    data.status = statusMatch[1].trim();
  }
  
  // Extract bedrooms (e.g., "3 Bedrms" or "3 Bedroom(s)")
  const bedroomsMatch = text.match(/(\d+)\s*Bedr(?:oo)?ms?|(\d+)\s*Bedroom/i);
  if (bedroomsMatch) {
    data.bedrooms = parseInt(bedroomsMatch[1] || bedroomsMatch[2]);
  }
  
  // Extract bathrooms (e.g., "3 Baths" with breakdown "2 Full Bath(s)" "1 Half Bath(s)")
  const fullBathMatch = text.match(/(\d+)\s*Full\s*Bath/i);
  const halfBathMatch = text.match(/(\d+)\s*Half\s*Bath/i);
  if (fullBathMatch) {
    data.bathroomsFull = parseInt(fullBathMatch[1]);
  }
  if (halfBathMatch) {
    data.bathroomsHalf = parseInt(halfBathMatch[1]);
  }
  
  // Extract square feet (e.g., "2,175 Sqft")
  const sqftMatch = text.match(/([\d,]+)\s*Sqft|Above Grade Fin(?:ished)? SQFT\s+([\d,]+)/i);
  if (sqftMatch) {
    data.squareFeet = parseInt((sqftMatch[1] || sqftMatch[2]).replace(/,/g, ''));
  }
  
  // Extract lot size (e.g., "0.10 Acres")
  const lotMatch = text.match(/([\d.]+)\s*Acres/i) ||
                   text.match(/Lot Size Acres\s+([\d.]+)/i);
  if (lotMatch) {
    data.lotSizeAcres = parseFloat(lotMatch[1]);
  }
  
  // Extract year built (e.g., "Built in 2014" or "Year Built 2014")
  const yearMatch = text.match(/Built in (\d{4})|Year Built\s+(\d{4})/i);
  if (yearMatch) {
    data.yearBuilt = parseInt(yearMatch[1] || yearMatch[2]);
  }
  
  // Extract property type
  const typeMatch = text.match(/Property Type\s+(\w+(?:\s+\w+)*)/i) ||
                   text.match(/Structure Type\s+([^\n]+)/i);
  if (typeMatch) {
    data.propertyType = typeMatch[1].trim();
  }
  
  // Extract subdivision/neighborhood
  const subdivMatch = text.match(/Subdivision\/Neighborhood\s+([^\n]+)/i);
  if (subdivMatch) {
    data.subdivision = subdivMatch[1].trim();
  }
  
  // Extract school district
  const schoolMatch = text.match(/School District\s+([^\n]+)/i);
  if (schoolMatch) {
    data.schoolDistrict = schoolMatch[1].trim();
  }
  
  // Extract tax amount
  const taxMatch = text.match(/Tax Annual Amount\s+\$?([\d,]+)/i);
  if (taxMatch) {
    data.taxAmount = taxMatch[1].replace(/,/g, '');
  }
  
  // Extract HOA/Association fee
  const hoaMatch = text.match(/Association Fee\s+\$?([\d,]+)/i);
  if (hoaMatch) {
    data.hoaFee = hoaMatch[1].replace(/,/g, '');
  }
  
  // Extract description (the large paragraph between price and "About" section)
  // Look for the text after photo count (e.g., "1 / 16") and before "About"
  const descMatch = text.match(/\d+\s*\/\s*\d+\s*\n([^\n]+(?:\n(?!About)[^\n]+)*)/i);
  if (descMatch) {
    data.description = descMatch[1]
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  return data;
}

// Helper to generate a listingKey from MLS number
export function generateListingKey(mlsNumber: string): string {
  return mlsNumber || `MANUAL-${Date.now()}`;
}
