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

/**
 * Creates Organization structured data
 */
export function createOrganizationData(): StructuredDataProps {
  return {
    type: 'Organization',
    data: {
      name: "Kevin Hensley's Homes",
      alternateName: "Hensley's Homes",
      description: "Professional real estate services in Delaware and Maryland including home sales, property management, and investment consulting",
      url: "https://hensleyshomes.com",
      logo: "https://hensleyshomes.com/hensleys-homes-logo.png",
      image: "https://hensleyshomes.com/hensleys-homes-logo.png",
      telephone: "(302) 218-0130",
      areaServed: [
        { "@type": "State", "name": "Delaware" },
        { "@type": "State", "name": "Maryland" }
      ],
      address: {
        "@type": "PostalAddress",
        addressRegion: "DE",
        addressCountry: "US"
      },
      sameAs: [
        "https://www.facebook.com/kevin.hensley.5",
        "https://www.facebook.com/HensleysHomes"
      ],
      founder: {
        "@type": "Person",
        name: "Kevin Hensley"
      }
    }
  };
}

/**
 * Creates FAQPage structured data
 */
export function createFAQData(): StructuredDataProps {
  return {
    type: 'FAQPage',
    data: {
      mainEntity: [
        {
          "@type": "Question",
          name: "What areas do you serve?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Kevin Hensley's Homes provides real estate services throughout Delaware and Maryland, specializing in residential properties and property management."
          }
        },
        {
          "@type": "Question",
          name: "Do you offer property management services?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, we provide comprehensive property management services including tenant screening, rent collection, maintenance coordination, and property marketing."
          }
        },
        {
          "@type": "Question",
          name: "How can I schedule a consultation?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can schedule a free consultation by calling (302) 218-0130 or using the contact form on our website. We offer both in-person and virtual consultations."
          }
        },
        {
          "@type": "Question",
          name: "What makes your real estate services different?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We combine local market expertise with personalized service, offering comprehensive real estate solutions including sales, property management, and investment consulting all under one roof."
          }
        }
      ]
    }
  };
}

/**
 * Creates comprehensive RealEstateAgent structured data
 */
export function createRealEstateAgentData(): StructuredDataProps {
  return {
    type: 'RealEstateAgent',
    data: {
      name: "Kevin Hensley's Homes",
      image: "https://hensleyshomes.com/assets/IMG_0525-CDZL6hPI.jpeg",
      description: "Licensed real estate professional specializing in residential sales and property management in Delaware and Maryland",
      url: "https://hensleyshomes.com",
      telephone: "(302) 218-0130",
      email: "info@hensleyshomes.com",
      areaServed: [
        {
          "@type": "State",
          "name": "Delaware"
        },
        {
          "@type": "State", 
          "name": "Maryland"
        }
      ],
      serviceType: [
        "Real Estate Sales",
        "Property Management", 
        "Investment Consulting",
        "Market Analysis",
        "Rental Properties",
        "Home Buying Assistance",
        "Home Selling Assistance",
        "Property Valuation"
      ],
      address: {
        "@type": "PostalAddress",
        "addressRegion": "DE",
        "addressCountry": "US"
      },
      agent: {
        "@type": "Person",
        "name": "Kevin Hensley",
        "image": "https://hensleyshomes.com/assets/IMG_0525-CDZL6hPI.jpeg",
        "jobTitle": "Real Estate Broker",
        "telephone": "(302) 218-0130",
        "knowsAbout": [
          "Delaware Real Estate Market",
          "Maryland Real Estate Market", 
          "Property Management",
          "Investment Properties",
          "Residential Sales",
          "Market Analysis"
        ]
      },
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Real Estate License",
        "recognizedBy": {
          "@type": "Organization",
          "name": "Delaware Real Estate Commission"
        }
      },
      makesOffer: [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Free Market Analysis",
            "description": "Complimentary home valuation and market analysis"
          },
          "price": "0",
          "priceCurrency": "USD"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Free Consultation",
            "description": "No-obligation consultation for buying, selling, or property management"
          },
          "price": "0",
          "priceCurrency": "USD"
        }
      ],
      sameAs: [
        "https://www.facebook.com/kevin.hensley.5",
        "https://www.facebook.com/HensleysHomes"
      ]
    }
  };
}