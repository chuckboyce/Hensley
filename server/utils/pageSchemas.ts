/**
 * Server-side JSON-LD schema definitions for each URL path.
 * These are injected directly into the HTML before the page is served
 * so schema markup appears in the raw source — visible to search engines
 * and crawlers even without JavaScript execution.
 */

const BASE = "https://hensleyshomes.com";

const KEVIN_PHOTO = `${BASE}/assets/IMG_0525-CDZL6hPI.jpeg`;

const KEVIN_AGENT = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": `${BASE}/#kevin-hensley`,
  name: "Kevin Hensley",
  image: KEVIN_PHOTO,
  url: BASE,
  telephone: "+13022180130",
  description:
    "Delaware and Maryland licensed real estate agent specializing in residential sales, new construction, and neighborhood guides for Middletown, DE and surrounding communities.",
};

function neighborhoodSchemas(opts: {
  slug: string;
  name: string;
  description: string;
  datasetName: string;
  breadcrumbs: { name: string; item: string }[];
}): object[] {
  const id = `${BASE}/areas/middletown-de/${opts.slug}/#place`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Place",
      "@id": id,
      name: opts.name,
      description: opts.description,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Middletown",
        addressRegion: "DE",
        postalCode: "19709",
        addressCountry: "US",
      },
      containsPlace: {
        "@type": "Place",
        "@id": `${BASE}/areas/middletown-de/#place`,
      },
      url: `${BASE}/areas/middletown-de/${opts.slug}`,
      author: { "@type": "RealEstateAgent", "@id": `${BASE}/#kevin-hensley` },
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "@id": `${BASE}/areas/middletown-de/${opts.slug}/#dataset`,
      name: opts.datasetName,
      creator: {
        "@type": "Organization",
        name: "US Census Bureau",
        url: "https://www.census.gov",
      },
      variableMeasured: [
        "Median Household Income",
        "Homeownership Rate",
        "Median Year Structure Built",
      ],
      citation: "ACS 5-Year Estimates Tables B25003, B19013, B25035",
      subjectOf: {
        "@type": "RealEstateAgent",
        "@id": `${BASE}/#kevin-hensley`,
        knowsAbout: { "@type": "Place", "@id": id },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: opts.breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.item,
      })),
    },
    {
      ...KEVIN_AGENT,
      areaServed: { "@type": "Place", "@id": id },
      knowsAbout: { "@type": "Place", "@id": id },
    },
  ];
}

export const PAGE_SCHEMAS: Record<string, object[]> = {
  "/": [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Kevin Hensley's Homes - Delaware & Maryland Real Estate",
      description:
        "Professional real estate services in Delaware and Maryland. Specializing in home sales, property management, and investment consulting. Contact us for a free consultation.",
      url: BASE,
      publisher: {
        "@type": "Organization",
        name: "Kevin Hensley's Homes",
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      name: "Kevin Hensley's Homes",
      image: KEVIN_PHOTO,
      description:
        "Licensed real estate professional specializing in residential sales and property management in Delaware and Maryland",
      url: BASE,
      telephone: "(302) 218-0130",
      email: "info@hensleyshomes.com",
      areaServed: [
        { "@type": "State", name: "Delaware" },
        { "@type": "State", name: "Maryland" },
      ],
      serviceType: [
        "Real Estate Sales",
        "Property Management",
        "Investment Consulting",
        "Market Analysis",
        "Rental Properties",
        "Home Buying Assistance",
        "Home Selling Assistance",
        "Property Valuation",
      ],
      address: { "@type": "PostalAddress", addressRegion: "DE", addressCountry: "US" },
      agent: {
        "@type": "Person",
        name: "Kevin Hensley",
        image: KEVIN_PHOTO,
        jobTitle: "Real Estate Broker",
        telephone: "(302) 218-0130",
      },
      sameAs: [
        "https://www.facebook.com/kevin.hensley.5",
        "https://www.facebook.com/HensleysHomes",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Kevin Hensley's Homes",
      alternateName: "Hensley's Homes",
      description:
        "Professional real estate services in Delaware and Maryland including home sales, property management, and investment consulting",
      url: BASE,
      logo: `${BASE}/hensleys-homes-logo.png`,
      telephone: "(302) 218-0130",
      areaServed: [
        { "@type": "State", name: "Delaware" },
        { "@type": "State", name: "Maryland" },
      ],
      address: { "@type": "PostalAddress", addressRegion: "DE", addressCountry: "US" },
      sameAs: [
        "https://www.facebook.com/kevin.hensley.5",
        "https://www.facebook.com/HensleysHomes",
      ],
      founder: { "@type": "Person", name: "Kevin Hensley" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What areas do you serve?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Kevin Hensley's Homes provides real estate services throughout Delaware and Maryland, specializing in residential properties and property management.",
          },
        },
        {
          "@type": "Question",
          name: "Do you offer property management services?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, we provide comprehensive property management services including tenant screening, rent collection, maintenance coordination, and property marketing.",
          },
        },
        {
          "@type": "Question",
          name: "How can I schedule a consultation?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can schedule a free consultation by calling (302) 218-0130 or using the contact form on our website. We offer both in-person and virtual consultations.",
          },
        },
        {
          "@type": "Question",
          name: "What makes your real estate services different?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We combine local market expertise with personalized service, offering comprehensive real estate solutions including sales, property management, and investment consulting all under one roof.",
          },
        },
      ],
    },
  ],

  "/areas/middletown-de": [
    {
      "@context": "https://schema.org",
      "@type": "Place",
      "@id": `${BASE}/areas/middletown-de/#place`,
      name: "Middletown, Delaware",
      description:
        "Community guide for Middletown, DE including neighborhoods, new construction, schools, commutes, and insights from local Realtor Kevin Hensley.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Middletown",
        addressRegion: "DE",
        postalCode: "19709",
        addressCountry: "US",
      },
      areaServed: "Middletown, Delaware",
      url: `${BASE}/areas/middletown-de`,
      author: { "@type": "RealEstateAgent", "@id": `${BASE}/#kevin-hensley` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Delaware Communities", item: `${BASE}/areas` },
        { "@type": "ListItem", position: 3, name: "Middletown, Delaware", item: `${BASE}/areas/middletown-de` },
      ],
    },
  ],

  "/areas/middletown-de/parkside": neighborhoodSchemas({
    slug: "parkside",
    name: "Parkside, Middletown, Delaware",
    description:
      "Community guide for Parkside, Middletown DE — a luxury master-planned neighborhood with resort-style amenities, tree-lined streets, and top-rated Appoquinimink schools.",
    datasetName: "Demographic and Housing Profile for Parkside, Middletown, Delaware",
    breadcrumbs: [
      { name: "Home", item: BASE },
      { name: "Delaware Communities", item: `${BASE}/areas` },
      { name: "Middletown, Delaware", item: `${BASE}/areas/middletown-de` },
      { name: "Parkside", item: `${BASE}/areas/middletown-de/parkside` },
    ],
  }),

  "/areas/middletown-de/bayberry": neighborhoodSchemas({
    slug: "bayberry",
    name: "Bayberry, Middletown, Delaware",
    description:
      "Award-winning master-planned community in Middletown, DE. Features multiple neighborhoods, walking trails, lakes, parks, and the 55+ Ponds at Bayberry.",
    datasetName: "Demographic and Housing Profile for Bayberry, Middletown, Delaware",
    breadcrumbs: [
      { name: "Home", item: BASE },
      { name: "Delaware Communities", item: `${BASE}/areas` },
      { name: "Middletown, Delaware", item: `${BASE}/areas/middletown-de` },
      { name: "Bayberry", item: `${BASE}/areas/middletown-de/bayberry` },
    ],
  }),

  "/areas/middletown-de/st-annes": neighborhoodSchemas({
    slug: "st-annes",
    name: "The Estates at St. Anne's, Middletown, Delaware",
    description:
      "Upscale golf course community in Middletown, DE with spacious estates, scenic fairway views, and easy Route 1 access.",
    datasetName: "Demographic and Housing Profile for The Estates at St. Anne's, Middletown, Delaware",
    breadcrumbs: [
      { name: "Home", item: BASE },
      { name: "Delaware Communities", item: `${BASE}/areas` },
      { name: "Middletown, Delaware", item: `${BASE}/areas/middletown-de` },
      { name: "St. Anne's", item: `${BASE}/areas/middletown-de/st-annes` },
    ],
  }),

  "/areas/middletown-de/whitehall": neighborhoodSchemas({
    slug: "whitehall",
    name: "The Town of Whitehall, Middletown, Delaware",
    description:
      "New urbanism community in Middletown, DE blending homes, shops, parks, and walkability with architectural charm and front-porch living.",
    datasetName: "Demographic and Housing Profile for The Town of Whitehall, Middletown, Delaware",
    breadcrumbs: [
      { name: "Home", item: BASE },
      { name: "Delaware Communities", item: `${BASE}/areas` },
      { name: "Middletown, Delaware", item: `${BASE}/areas/middletown-de` },
      { name: "Whitehall", item: `${BASE}/areas/middletown-de/whitehall` },
    ],
  }),

  "/areas/middletown-de/hyetts-corner": neighborhoodSchemas({
    slug: "hyetts-corner",
    name: "Hyetts Corner / Hyetts Crossing, Middletown, Delaware",
    description:
      "Modern new construction communities in Middletown, DE featuring energy-efficient homes, contemporary floor plans, and easy Route 1 access within the Appoquinimink School District.",
    datasetName: "Demographic and Housing Profile for Hyetts Corner, Middletown, Delaware",
    breadcrumbs: [
      { name: "Home", item: BASE },
      { name: "Delaware Communities", item: `${BASE}/areas` },
      { name: "Middletown, Delaware", item: `${BASE}/areas/middletown-de` },
      { name: "Hyetts Corner", item: `${BASE}/areas/middletown-de/hyetts-corner` },
    ],
  }),

  "/buy": [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Home Buying Services - Delaware & Maryland",
      description:
        "Expert home buying assistance in Delaware and Maryland. Market analysis, property tours, and professional negotiation.",
      provider: { "@type": "RealEstateAgent", name: "Kevin Hensley's Homes", url: BASE },
      areaServed: [
        { "@type": "State", name: "Delaware" },
        { "@type": "State", name: "Maryland" },
      ],
      url: `${BASE}/buy`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Buy a Home", item: `${BASE}/buy` },
      ],
    },
  ],

  "/sell": [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Home Selling Services - Delaware & Maryland",
      description:
        "Sell your Delaware or Maryland home for top dollar. Professional photography, strategic marketing, and expert negotiation.",
      provider: { "@type": "RealEstateAgent", name: "Kevin Hensley's Homes", url: BASE },
      areaServed: [
        { "@type": "State", name: "Delaware" },
        { "@type": "State", name: "Maryland" },
      ],
      url: `${BASE}/sell`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Sell Your Home", item: `${BASE}/sell` },
      ],
    },
  ],

  "/property-management": [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Property Management Services - Delaware & Maryland",
      description:
        "Professional property management in Delaware and Maryland. Tenant screening, rent collection, maintenance coordination, and 24/7 support.",
      provider: { "@type": "RealEstateAgent", name: "Kevin Hensley's Homes", url: BASE },
      areaServed: [
        { "@type": "State", name: "Delaware" },
        { "@type": "State", name: "Maryland" },
      ],
      url: `${BASE}/property-management`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Property Management", item: `${BASE}/property-management` },
      ],
    },
  ],

  "/contact": [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact Kevin Hensley's Homes",
      description:
        "Contact Kevin Hensley's Homes for real estate services in Delaware and Maryland.",
      url: `${BASE}/contact`,
      mainEntity: {
        "@type": "RealEstateAgent",
        name: "Kevin Hensley's Homes",
        telephone: "(302) 218-0130",
        email: "info@hensleyshomes.com",
        url: BASE,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Contact", item: `${BASE}/contact` },
      ],
    },
  ],
};

/**
 * Returns the JSON-LD script block(s) to inject for a given URL path,
 * or an empty string if no schemas are configured for that path.
 */
export function buildSchemaHtml(urlPath: string): string {
  const normalized = urlPath.split("?")[0].split("#")[0].replace(/\/$/, "") || "/";
  const schemas = PAGE_SCHEMAS[normalized];
  if (!schemas || schemas.length === 0) return "";

  return schemas
    .map(
      (schema) =>
        `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
    )
    .join("\n");
}
