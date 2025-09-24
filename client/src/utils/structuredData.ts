/**
 * Utility functions for managing structured data (JSON-LD) throughout the application
 */

export interface StructuredDataProps {
  type: string;
  data: Record<string, any>;
}

/**
 * Injects structured data into the page head
 */
export function injectStructuredData(structuredData: StructuredDataProps): void {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.innerHTML = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': structuredData.type,
    ...structuredData.data
  }, null, 2);
  
  // Add a unique ID to prevent duplicates
  script.id = `structured-data-${structuredData.type.toLowerCase()}`;
  
  // Remove existing script with same ID if it exists
  const existing = document.getElementById(script.id);
  if (existing) {
    existing.remove();
  }
  
  document.head.appendChild(script);
}

/**
 * Creates breadcrumb structured data for a given path
 */
export function createBreadcrumbData(breadcrumbs: Array<{ name: string; url: string }>): StructuredDataProps {
  return {
    type: 'BreadcrumbList',
    data: {
      itemListElement: breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.name,
        item: breadcrumb.url
      }))
    }
  };
}

/**
 * Creates property listing structured data
 */
export function createPropertyData(property: {
  name: string;
  description: string;
  price: number;
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  images?: string[];
}): StructuredDataProps {
  return {
    type: 'Product',
    data: {
      name: property.name,
      description: property.description,
      category: 'Real Estate',
      offers: {
        '@type': 'Offer',
        price: property.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: window.location.href
      },
      location: {
        '@type': 'PostalAddress',
        streetAddress: property.address
      },
      ...(property.bedrooms && { numberOfRooms: property.bedrooms }),
      ...(property.bathrooms && { numberOfBathroomsTotal: property.bathrooms }),
      ...(property.sqft && { floorSize: { '@type': 'QuantitativeValue', value: property.sqft, unitText: 'sq ft' } }),
      ...(property.images && { image: property.images })
    }
  };
}

/**
 * Creates WebPage structured data for a specific page
 */
export function createWebPageData(page: {
  name: string;
  description: string;
  url: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}): StructuredDataProps {
  return {
    type: 'WebPage',
    data: {
      name: page.name,
      description: page.description,
      url: page.url,
      publisher: {
        '@type': 'Organization',
        name: "Kevin Hensley's Homes"
      },
      ...(page.breadcrumbs && {
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: page.breadcrumbs.map((breadcrumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: breadcrumb.name,
            item: breadcrumb.url
          }))
        }
      })
    }
  };
}

/**
 * Creates LocalBusiness structured data with specific location info
 */
export function createLocalBusinessData(location: {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}): StructuredDataProps {
  return {
    type: 'LocalBusiness',
    data: {
      '@type': ['LocalBusiness', 'RealEstateAgent'],
      name: location.name,
      telephone: location.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: location.address,
        addressLocality: location.city,
        addressRegion: location.state,
        postalCode: location.zipCode,
        addressCountry: 'US'
      },
      areaServed: [location.state],
      serviceType: ['Real Estate Sales', 'Property Management']
    }
  };
}

/**
 * Creates structured data for real estate services
 */
export function createServiceData(service: {
  name: string;
  description: string;
  serviceType: string;
  areaServed: string[];
}): StructuredDataProps {
  return {
    type: 'Service',
    data: {
      name: service.name,
      description: service.description,
      serviceType: service.serviceType,
      provider: {
        '@type': 'Organization',
        name: "Kevin Hensley's Homes"
      },
      areaServed: service.areaServed.map(area => ({
        '@type': 'State',
        name: area
      }))
    }
  };
}