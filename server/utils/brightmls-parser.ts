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
  
  // Extract MLS Number - handle multiple formats
  const mlsMatch = text.match(/MLS[#\s]+([A-Z0-9]+)/i) || 
                   text.match(/MLS Number\s+([A-Z0-9]+)/i);
  if (mlsMatch) {
    data.mlsNumber = mlsMatch[1].trim();
  }
  
  // Extract address - handle both formats:
  // Format 1: "636 Courtly Rd, Townsend, DE 19734" (BrightMLS)
  // Format 2: "6 DUNLEARY DR\nBEAR, DE 19701" (RE/MAX)
  const addressMatch1 = text.match(/(\d+\s+[^,\n]+),\s*([^,\n]+),\s*([A-Z]{2})\s+(\d{5})/);
  const addressMatch2 = text.match(/^(\d+\s+[^\n]+)\n([^,\n]+),\s*([A-Z]{2})\s+(\d{5})/m);
  
  const addressMatch = addressMatch1 || addressMatch2;
  if (addressMatch) {
    data.address = addressMatch[1].trim();
    data.city = addressMatch[2].trim();
    data.state = addressMatch[3].trim();
    data.zipCode = addressMatch[4].trim();
  }
  
  // Extract price - handle multiple formats
  const priceMatch = text.match(/^\$?([\d,]+)(?:\.\d{2})?\s*$/m) || // Standalone price line (RE/MAX)
                    text.match(/\$?([\d,]+)(?:\.\d{2})?\s*\n.*(?:Active|Pending|Sold|Under Contract)/i) ||
                    text.match(/List Price\s+\$?([\d,]+)/i);
  if (priceMatch) {
    data.listPrice = priceMatch[1].replace(/,/g, '');
  }
  
  // Extract status - handle multiple formats
  const statusMatch = text.match(/Status\s+(Active Under Contract|Active|Pending|Sold|Closed|Expired)/i) ||
                     text.match(/(Active Under Contract|Active|Pending|Sold|Closed|Expired)/i);
  if (statusMatch) {
    data.status = statusMatch[1].trim();
  }
  
  // Extract bedrooms - handle multiple formats
  const bedroomsMatch = text.match(/(\d+)\s*Beds?\s*$/m) || // "4 Beds" (RE/MAX)
                       text.match(/(\d+)\s*Bedr(?:oo)?ms?/i) || // "3 Bedrms" (BrightMLS)
                       text.match(/Bedrooms Total\s*\n\s*(\d+)/i); // "Bedrooms Total\n4" (RE/MAX details)
  if (bedroomsMatch) {
    data.bedrooms = parseInt(bedroomsMatch[1]);
  }
  
  // Extract bathrooms - handle multiple formats
  // Look in details section first (more accurate for RE/MAX)
  const fullBathMatch = text.match(/Bathrooms Full\s*\n\s*(\d+)/i) || 
                       text.match(/(\d+)\s*Full\s*Bath/i);
  const halfBathMatch = text.match(/Bathrooms Half\s*\n\s*(\d+)/i) ||
                       text.match(/(\d+)\s*Half\s*Bath/i);
  if (fullBathMatch) {
    data.bathroomsFull = parseInt(fullBathMatch[1]);
  }
  if (halfBathMatch) {
    data.bathroomsHalf = parseInt(halfBathMatch[1]);
  }
  
  // Extract square feet - handle multiple formats
  const sqftMatch = text.match(/([\d,]+)\s*Sq\s*Ft/i) || // "3,350 Sq Ft" (RE/MAX)
                   text.match(/([\d,]+)\s*Sqft/i) || // "2,175 Sqft" (BrightMLS)
                   text.match(/Living Area\s*\n\s*([\d,]+)\s*SqFt/i) || // "Living Area\n3,350 SqFt" (RE/MAX details)
                   text.match(/Above Grade Fin(?:ished)? SQFT\s+([\d,]+)/i);
  if (sqftMatch) {
    data.squareFeet = parseInt(sqftMatch[1].replace(/,/g, ''));
  }
  
  // Extract lot size - handle multiple formats
  const lotMatch = text.match(/([\d.]+)\s*acres lot/i) || // "0.23 acres lot" (RE/MAX)
                   text.match(/([\d.]+)\s*Acres/i) || // "0.10 Acres" (BrightMLS)
                   text.match(/Lot Size Acres\s*\n\s*([\d.]+)/i); // "Lot Size Acres\n0.23" (RE/MAX details)
  if (lotMatch) {
    data.lotSizeAcres = parseFloat(lotMatch[1]);
  }
  
  // Extract year built - handle multiple formats
  const yearMatch = text.match(/Built in (\d{4})/i) || // "Built in 2001" (RE/MAX)
                   text.match(/Year Built\s*\n\s*(\d{4})/i) || // "Year Built\n2001" (RE/MAX details)
                   text.match(/Year Built\s+(\d{4})/i); // "Year Built 2014" (BrightMLS)
  if (yearMatch) {
    data.yearBuilt = parseInt(yearMatch[1]);
  }
  
  // Extract property type - handle multiple formats
  const typeMatch = text.match(/Property Sub Type\s*\n\s*([^\n]+)/i) || // RE/MAX details
                   text.match(/Property Type\s*\n\s*([^\n]+)/i) || // RE/MAX details
                   text.match(/Property Type\s+(\w+(?:\s+\w+)*)/i) || // BrightMLS
                   text.match(/Structure Type\s+([^\n]+)/i);
  if (typeMatch) {
    data.propertyType = typeMatch[1].trim();
  }
  
  // Extract subdivision/neighborhood - handle multiple formats
  const subdivMatch = text.match(/Subdivision Name\s*\n\s*([^\n]+)/i) || // RE/MAX details
                     text.match(/Subdivision\/Neighborhood\s+([^\n]+)/i); // BrightMLS
  if (subdivMatch) {
    data.subdivision = subdivMatch[1].trim();
  }
  
  // Extract school district
  const schoolMatch = text.match(/School District\s*\n\s*([^\n]+)/i) || // RE/MAX details
                     text.match(/School District\s+([^\n]+)/i); // BrightMLS
  if (schoolMatch) {
    data.schoolDistrict = schoolMatch[1].trim();
  }
  
  // Extract tax amount - handle multiple formats
  const taxMatch = text.match(/Tax Annual Amount\s*\n\s*\$?([\d,]+)/i) || // RE/MAX details
                  text.match(/Tax Annual Amount\s+\$?([\d,]+)/i); // BrightMLS
  if (taxMatch) {
    data.taxAmount = taxMatch[1].replace(/,/g, '');
  }
  
  // Extract HOA/Association fee - handle multiple formats
  const hoaMatch = text.match(/Association Fee\s*\n\s*\$?([\d,]+)/i) || // RE/MAX details
                  text.match(/Association Fee\s+\$?([\d,]+)/i); // BrightMLS
  if (hoaMatch) {
    data.hoaFee = hoaMatch[1].replace(/,/g, '');
  }
  
  // Extract description - handle multiple formats
  // RE/MAX: After MLS# and before "Read Less" or "Details for"
  const remaxDescMatch = text.match(/MLS#\s*[A-Z0-9]+\s*\n+([^]+?)(?:\n(?:Read Less|Details for)|$)/i);
  // BrightMLS: After photo count (e.g., "1 / 16") and before "About"
  const brightmlsDescMatch = text.match(/\d+\s*\/\s*\d+\s*\n([^\n]+(?:\n(?!About)[^\n]+)*)/i);
  
  const descMatch = remaxDescMatch || brightmlsDescMatch;
  if (descMatch) {
    data.description = descMatch[1]
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\.\.\.\s*$/, '') // Remove trailing ellipsis
      .trim();
  }
  
  return data;
}

// Helper to generate a listingKey from MLS number
export function generateListingKey(mlsNumber: string): string {
  return mlsNumber || `MANUAL-${Date.now()}`;
}
