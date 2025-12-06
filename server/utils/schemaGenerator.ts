import type { Property } from "@shared/schema";

interface PropertySchemaInput {
  property: Property;
  baseUrl: string;
}

function sanitizeForSchema(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .replace(/[\x00-\x1F\x7F]/g, '')
    .replace(/\uFFFD/g, '')
    .replace(/"/g, '\\"')
    .trim();
}

function truncateAtWordBoundary(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  const truncated = str.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > maxLength * 0.7 ? truncated.substring(0, lastSpace) : truncated.substring(0, maxLength - 3)) + '...';
}

function determinePropertyType(property: Property): string {
  if (property.isRental) return "Residence";
  
  const remarks = (property.publicRemarks || '').toLowerCase();
  const subType = (property.propertySubType || '').toLowerCase();
  
  if (subType.includes('townhouse') || subType.includes('town house') || remarks.includes('townhouse')) {
    return "Residence";
  }
  if (subType.includes('condo') || remarks.includes('condo')) {
    return "Apartment";
  }
  if (subType.includes('apartment') || remarks.includes('apartment')) {
    return "Apartment";
  }
  
  return "SingleFamilyResidence";
}

export function generatePropertySchema(input: PropertySchemaInput): object {
  const { property, baseUrl } = input;
  
  const city = property.city || 'Delaware';
  const state = property.stateOrProvince || 'DE';
  const streetAddress = sanitizeForSchema(property.unparsedAddress) || 
    (property.city ? `${property.city}, ${state}` : 'Delaware');
  
  const rawDescription = property.schemaSummary || property.publicRemarks || '';
  const description = truncateAtWordBoundary(
    sanitizeForSchema(rawDescription) || 
    `${property.isRental ? 'For rent' : 'For sale'}: ${property.bedroomsTotal || 0} bed, ${property.bathroomsFull || 0} bath home in ${city}, ${state}`,
    300
  );
  
  const propertyType = determinePropertyType(property);
  const listingType = property.isRental ? 'Rental' : 'Home';
  
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": propertyType,
    "@id": `${baseUrl}/properties#${property.listingKey}`,
    name: `${property.bedroomsTotal || 0} Bed, ${property.bathroomsFull || 0} Bath ${listingType} in ${city}`,
    description: description,
    url: `${baseUrl}/properties`,
    identifier: {
      "@type": "PropertyValue",
      name: "MLS Number",
      value: property.mlsId || property.listingKey
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: streetAddress,
      addressLocality: city,
      addressRegion: state,
      postalCode: property.postalCode || undefined,
      addressCountry: "US"
    },
  };

  if (property.imageUrl) {
    const imageUrl = property.imageUrl.startsWith('http') 
      ? property.imageUrl 
      : `${baseUrl}${property.imageUrl}`;
    schema.image = imageUrl;
    schema.photo = {
      "@type": "ImageObject",
      url: imageUrl,
      contentUrl: imageUrl
    };
  }

  if (property.listPrice) {
    const priceValue = typeof property.listPrice === 'string' 
      ? parseFloat(property.listPrice.replace(/[$,]/g, ''))
      : property.listPrice;
    
    if (!isNaN(priceValue) && priceValue > 0) {
      schema.offers = {
        "@type": "Offer",
        priceCurrency: "USD",
        price: priceValue,
        availability: property.isActive ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
        validFrom: property.dateFound?.toISOString() || new Date().toISOString(),
        seller: {
          "@type": "RealEstateAgent",
          name: "Kevin Hensley's Homes",
          url: baseUrl
        }
      };
      
      if (property.isRental) {
        schema.offers.priceSpecification = {
          "@type": "UnitPriceSpecification",
          price: priceValue,
          priceCurrency: "USD",
          unitText: "MONTH"
        };
      }
    }
  }

  if (property.bedroomsTotal && property.bedroomsTotal > 0) {
    schema.numberOfBedrooms = property.bedroomsTotal;
    schema.numberOfRooms = property.bedroomsTotal + (property.bathroomsFull || 0) + 2;
  }

  if (property.bathroomsFull && property.bathroomsFull > 0) {
    schema.numberOfBathroomsTotal = property.bathroomsFull;
  }

  if (property.livingArea && property.livingArea > 0) {
    schema.floorSize = {
      "@type": "QuantitativeValue",
      value: property.livingArea,
      unitCode: "FTK",
      unitText: "sq ft"
    };
  }

  if (property.yearBuilt && property.yearBuilt > 1800) {
    schema.yearBuilt = property.yearBuilt;
  }

  if (property.lotSizeArea) {
    const lotSize = parseFloat(String(property.lotSizeArea));
    if (!isNaN(lotSize) && lotSize > 0) {
      schema.lotSize = {
        "@type": "QuantitativeValue",
        value: lotSize,
        unitCode: property.lotSizeUnits === 'SqFt' ? 'FTK' : 'ACR',
        unitText: property.lotSizeUnits || 'acres'
      };
    }
  }

  if (property.garageSpaces && property.garageSpaces > 0) {
    schema.amenityFeature = schema.amenityFeature || [];
    schema.amenityFeature.push({
      "@type": "LocationFeatureSpecification",
      name: "Garage",
      value: `${property.garageSpaces} car garage`
    });
  }

  return schema;
}

export function generatePropertyListSchema(properties: Property[], baseUrl: string): object {
  const activeProperties = properties.filter(p => p.isActive);
  
  const itemListElements = activeProperties.slice(0, 50).map((property, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: generatePropertySchema({ property, baseUrl })
  }));

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${baseUrl}/properties#listings`,
    name: "Available Properties - Kevin Hensley's Homes",
    description: "Browse our current listings of homes for sale and rent in Delaware and surrounding areas.",
    numberOfItems: activeProperties.length,
    itemListElement: itemListElements
  };
}

export function generateRealEstateAgentSchema(baseUrl: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${baseUrl}#agent`,
    name: "Kevin Hensley's Homes",
    description: "Local real estate agent specializing in buying, selling, and property management in Delaware. Licensed with RE/MAX.",
    url: baseUrl,
    logo: `${baseUrl}/remax-logo.svg`,
    image: `${baseUrl}/kevin-headshot.jpg`,
    telephone: "(302) 222-7874",
    email: "kevin@hensleyshomes.com",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Middletown",
      addressRegion: "DE",
      addressCountry: "US"
    },
    areaServed: [
      {
        "@type": "City",
        name: "Middletown",
        "@id": "https://www.wikidata.org/wiki/Q2068419"
      },
      {
        "@type": "State",
        name: "Delaware",
        "@id": "https://www.wikidata.org/wiki/Q1393"
      }
    ],
    memberOf: {
      "@type": "Organization",
      name: "RE/MAX",
      url: "https://www.remax.com"
    },
    knowsAbout: [
      "Real Estate Sales",
      "Property Management",
      "Delaware Real Estate",
      "Home Buying",
      "Home Selling"
    ],
    sameAs: [
      "https://www.facebook.com/HensleysHomes",
      "https://www.instagram.com/hensleyshomes"
    ]
  };
}

export function generateOrganizationSchema(baseUrl: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}#organization`,
    name: "Kevin Hensley's Homes",
    url: baseUrl,
    logo: `${baseUrl}/remax-logo.svg`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "(302) 222-7874",
      contactType: "sales",
      availableLanguage: "English",
      areaServed: "US"
    }
  };
}

export function generateWebsiteSchema(baseUrl: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}#website`,
    url: baseUrl,
    name: "Kevin Hensley's Homes",
    description: "Your trusted local real estate agent for buying, selling, and property management in Delaware",
    publisher: {
      "@id": `${baseUrl}#organization`
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/properties?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

export function generateFullPageSchema(properties: Property[], baseUrl: string): string {
  const schemas = [
    generateOrganizationSchema(baseUrl),
    generateWebsiteSchema(baseUrl),
    generateRealEstateAgentSchema(baseUrl),
    generatePropertyListSchema(properties, baseUrl)
  ];

  return JSON.stringify(schemas, null, 0);
}
