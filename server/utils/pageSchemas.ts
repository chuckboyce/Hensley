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

// ---------------------------------------------------------------------------
// Helper: generate the 4-schema block for Middletown sub-neighborhoods
// (Place + Dataset + BreadcrumbList + RealEstateAgent)
// ---------------------------------------------------------------------------
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
      description: `US Census Bureau ACS 5-year estimates covering median household income, homeownership rates, and housing age data for ${opts.name}.`,
      license: "https://creativecommons.org/publicdomain/zero/1.0/",
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

// ---------------------------------------------------------------------------
// Helper: generate the standard 3-schema block for top-level area pages
// (Place + BreadcrumbList + RealEstateAgent)
// ---------------------------------------------------------------------------
function areaSchemas(opts: {
  slug: string;
  name: string;
  description: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  breadcrumbLabel: string;
  breadcrumbSection: { name: string; item: string };
  parentPlace?: { name: string; id: string };
}): object[] {
  const pageUrl = `${BASE}/areas/${opts.slug}`;
  const placeId = `${pageUrl}/#place`;

  const place: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": placeId,
    name: opts.name,
    description: opts.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: opts.addressLocality,
      addressRegion: opts.addressRegion,
      postalCode: opts.postalCode,
      addressCountry: "US",
    },
    url: pageUrl,
    author: { "@type": "RealEstateAgent", "@id": `${BASE}/#kevin-hensley` },
  };

  if (opts.parentPlace) {
    place.containsPlace = {
      "@type": "Place",
      "@id": opts.parentPlace.id,
      name: opts.parentPlace.name,
    };
  }

  const breadcrumbs = [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE },
    { "@type": "ListItem", position: 2, name: opts.breadcrumbSection.name, item: opts.breadcrumbSection.item },
    { "@type": "ListItem", position: 3, name: opts.breadcrumbLabel, item: pageUrl },
  ];

  return [
    place,
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs,
    },
    {
      ...KEVIN_AGENT,
      areaServed: { "@type": "Place", "@id": placeId },
      knowsAbout: { "@type": "Place", "@id": placeId },
    },
  ];
}

// ---------------------------------------------------------------------------
// Helper: generate the 4-schema block for Wilmington sub-neighborhood pages
// (Place + BreadcrumbList + RealEstateAgent)
// ---------------------------------------------------------------------------
function wilmingtonSubSchemas(opts: {
  subSlug: string;
  name: string;
  description: string;
  addressLocality: string;
  postalCode: string;
  breadcrumbLabel: string;
}): object[] {
  const pageUrl = `${BASE}/areas/wilmington-de/${opts.subSlug}`;
  const placeId = `${pageUrl}/#place`;
  const parentId = `${BASE}/areas/wilmington-de/#place`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "Place",
      "@id": placeId,
      name: opts.name,
      description: opts.description,
      address: {
        "@type": "PostalAddress",
        addressLocality: opts.addressLocality,
        addressRegion: "DE",
        postalCode: opts.postalCode,
        addressCountry: "US",
      },
      containsPlace: {
        "@type": "Place",
        "@id": parentId,
        name: "Wilmington, Delaware",
      },
      url: pageUrl,
      author: { "@type": "RealEstateAgent", "@id": `${BASE}/#kevin-hensley` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Delaware Communities", item: `${BASE}/areas` },
        { "@type": "ListItem", position: 3, name: "Wilmington, Delaware", item: `${BASE}/areas/wilmington-de` },
        { "@type": "ListItem", position: 4, name: opts.breadcrumbLabel, item: pageUrl },
      ],
    },
    {
      ...KEVIN_AGENT,
      areaServed: { "@type": "Place", "@id": placeId },
      knowsAbout: { "@type": "Place", "@id": placeId },
    },
  ];
}


// ---------------------------------------------------------------------------
// Helper: generate a Dataset schema block for an area page
// Cites the US Census Bureau as the data creator and documents the ACS
// variables pulled by server/services/census.ts for that area.
// ---------------------------------------------------------------------------
function areaDataset(opts: {
  slug: string;
  name: string;
  isSubNeighborhood?: boolean;
  parentSlug?: string;
}): object {
  const basePath = opts.isSubNeighborhood && opts.parentSlug
    ? `/areas/${opts.parentSlug}/${opts.slug}`
    : `/areas/${opts.slug}`;
  const pageUrl = `${BASE}${basePath}`;
  const placeId = `${pageUrl}/#place`;

  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${pageUrl}/#dataset`,
    name: `Demographic and Housing Profile for ${opts.name}`,
    description: `US Census Bureau ACS 5-year estimates for ${opts.name} covering homeownership rate, median household income, median year structure built, age distribution, housing construction era, commute mode, and household type.`,
    license: "https://creativecommons.org/publicdomain/zero/1.0/",
    creator: {
      "@type": "Organization",
      name: "US Census Bureau",
      url: "https://www.census.gov",
    },
    variableMeasured: [
      "Homeownership Rate (B25003)",
      "Median Household Income (B19013)",
      "Median Year Structure Built (B25035)",
      "Age Distribution — Under 18, 18–64, 65+ (B01001)",
      "Year Structure Built by Decade (B25034)",
      "Means of Transportation to Work (B08301)",
      "Household Type — Family vs Non-Family (B11001)",
    ],
    citation: "ACS 5-Year Estimates Tables B25003, B19013, B25035, B01001, B25034, B08301, B11001",
    temporalCoverage: "2019/2023",
    subjectOf: {
      "@type": "RealEstateAgent",
      "@id": `${BASE}/#kevin-hensley`,
      knowsAbout: { "@type": "Place", "@id": placeId },
    },
  };
}

// ---------------------------------------------------------------------------
// Page schema registry
// ---------------------------------------------------------------------------
export const PAGE_SCHEMAS: Record<string, object[]> = {

  // ── Homepage ──────────────────────────────────────────────────────────────
  "/": [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Kevin Hensley's Homes - Delaware & Maryland Real Estate",
      description:
        "Professional real estate services in Delaware and Maryland. Specializing in home sales, property management, and investment consulting. Contact us for a free consultation.",
      url: BASE,
      publisher: { "@type": "Organization", name: "Kevin Hensley's Homes" },
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
      name: "Kevin Hensley",
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

  // ── Areas Index ───────────────────────────────────────────────────────────
  "/areas": [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${BASE}/areas/#page`,
      name: "Service Areas — Delaware & Maryland Communities",
      description:
        "Explore all neighborhoods and communities served by Kevin Hensley's Homes across Delaware and Maryland, including Bear, Middletown, Hockessin, Wilmington, and more.",
      url: `${BASE}/areas`,
      publisher: { "@type": "RealEstateAgent", "@id": `${BASE}/#kevin-hensley` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Service Areas", item: `${BASE}/areas` },
      ],
    },
    {
      ...KEVIN_AGENT,
      areaServed: [
        { "@type": "State", name: "Delaware" },
        { "@type": "State", name: "Maryland" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What areas does Kevin Hensley serve in Delaware and Maryland?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Kevin Hensley serves communities throughout New Castle County and Kent County in Delaware — including Bear, Hockessin, Middletown, Wilmington, Newark, Pike Creek, Smyrna, and more — as well as Cecil County, Maryland towns such as Chesapeake City, Elkton, North East, and Perryville.",
          },
        },
        {
          "@type": "Question",
          name: "How do I get started buying or selling a home in Delaware?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Contact Kevin Hensley at (302) 218-0130 or visit hensleyshomes.com. Kevin provides a free consultation to review your goals, walk you through the current market in your target area, and outline next steps whether you are buying or selling.",
          },
        },
        {
          "@type": "Question",
          name: "Which Delaware school districts are covered by Kevin Hensley's service areas?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Kevin's service areas span several top-rated Delaware school districts including the Appoquinimink School District (Middletown, Odessa, Townsend), the Christina School District (Newark, Glasgow, Bear), the Red Clay Consolidated School District (Wilmington, Hockessin, Pike Creek), and the Brandywine School District (North Wilmington, Centreville).",
          },
        },
        {
          "@type": "Question",
          name: "Is now a good time to buy a home in Delaware?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Delaware continues to attract buyers from New Jersey, Pennsylvania, and Maryland due to its low property taxes, no sales tax, and relatively affordable home prices compared to neighboring states. Kevin Hensley can provide current market conditions and inventory data for any specific community.",
          },
        },
      ],
    },
    areaDataset({ slug: "areas", name: "Delaware & Maryland Communities" }),
  ],

  // ── Delaware: Bear ────────────────────────────────────────────────────────
  "/areas/bear-de": [
    ...areaSchemas({
      slug: "bear-de",
      name: "Bear, Delaware",
      description:
        "Community guide for Bear, DE including neighborhoods, schools, commutes, and insights from local Realtor Kevin Hensley. Bear is a fast-growing unincorporated community in New Castle County.",
      addressLocality: "Bear",
      addressRegion: "DE",
      postalCode: "19701",
      breadcrumbLabel: "Bear, Delaware",
      breadcrumbSection: { name: "Delaware Communities", item: `${BASE}/areas` },
    }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is Bear, DE a good place to raise a family?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Bear, Delaware is consistently popular with families thanks to its mix of Christina and Colonial school district schools, large community parks like Glasgow Park, and suburban neighborhoods such as Brennan Estates and Caravel Farms.",
          },
        },
        {
          "@type": "Question",
          name: "What school district is Bear, Delaware in?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Bear, DE is served by two school districts depending on exact location: Christina School District and Colonial School District.",
          },
        },
        {
          "@type": "Question",
          name: "What is the average home price in Bear, Delaware?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "As of early 2025, the median home sale price in Bear, DE is approximately $400,000, ranging from starter homes in the $280K–$350K range to luxury homes above $500K in communities like Caravel Farms and Red Lion Chase.",
          },
        },
        {
          "@type": "Question",
          name: "How far is Bear, Delaware from Philadelphia?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Bear, DE is approximately 40 miles from Philadelphia, PA — typically a 40–50 minute drive via I-95 North.",
          },
        },
        {
          "@type": "Question",
          name: "What are the best neighborhoods in Bear, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Top neighborhoods in Bear, DE include Brennan Estates (family-friendly), Caravel Farms (luxury, custom homes), Red Lion Chase (upscale master-planned), and Village of Red Lion Creek (55+ active adult community).",
          },
        },
      ],
    },
    areaDataset({ slug: "bear-de", name: "Bear, Delaware" }),
  ],

  // ── Delaware: Hockessin ───────────────────────────────────────────────────
  "/areas/hockessin-de": [
    ...areaSchemas({
      slug: "hockessin-de",
      name: "Hockessin, Delaware",
      description:
        "Community guide for Hockessin, DE — an upscale unincorporated community in New Castle County known for top-ranked schools, rolling hills, and luxury homes.",
      addressLocality: "Hockessin",
      addressRegion: "DE",
      postalCode: "19707",
      breadcrumbLabel: "Hockessin, Delaware",
      breadcrumbSection: { name: "Delaware Communities", item: `${BASE}/areas` },
    }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What school district is Hockessin, Delaware in?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Hockessin is served by the Red Clay Consolidated School District, ranked #2 in Delaware by Niche.com.",
          },
        },
        {
          "@type": "Question",
          name: "What is the average home price in Hockessin, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "As of early 2025, the median home sale price in Hockessin, DE is approximately $550,000, making it one of the most expensive residential markets in Delaware.",
          },
        },
        {
          "@type": "Question",
          name: "How far is Hockessin, Delaware from Wilmington?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Hockessin is approximately 10–12 miles southwest of downtown Wilmington, typically a 20-minute drive.",
          },
        },
        {
          "@type": "Question",
          name: "Is Hockessin a good place to live?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Hockessin is widely regarded as one of the best places to live in Delaware, offering top-rated schools, scenic landscapes, low crime, and a strong sense of community — though at a premium price point.",
          },
        },
      ],
    },
    areaDataset({ slug: "hockessin-de", name: "Hockessin, Delaware" }),
  ],

  // ── Delaware: Smyrna ──────────────────────────────────────────────────────
  "/areas/smyrna-de": [
    ...areaSchemas({
      slug: "smyrna-de",
      name: "Smyrna, Delaware",
      description:
        "Community guide for Smyrna, DE — a growing town in Kent County with affordable housing, lake recreation, and easy access to Route 13 between Dover and Wilmington.",
      addressLocality: "Smyrna",
      addressRegion: "DE",
      postalCode: "19977",
      breadcrumbLabel: "Smyrna, Delaware",
      breadcrumbSection: { name: "Delaware Communities", item: `${BASE}/areas` },
    }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What school district is Smyrna, Delaware in?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Smyrna, DE is served by the Smyrna School District.",
          },
        },
        {
          "@type": "Question",
          name: "What is the average home price in Smyrna, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "As of early 2025, the median home sale price in Smyrna, DE is approximately $360,000, offering more affordability than northern Delaware communities.",
          },
        },
        {
          "@type": "Question",
          name: "How far is Smyrna, Delaware from Dover?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Smyrna is approximately 15 miles north of Dover, DE — about a 20–25 minute drive via Route 13.",
          },
        },
        {
          "@type": "Question",
          name: "Is Smyrna, Delaware a good place to buy a home?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Smyrna is a strong value market for buyers. It offers newer construction, lake communities like Garrisons Lake, waterfront areas near Woodland Beach, and solid school options at prices well below New Castle County.",
          },
        },
      ],
    },
    areaDataset({ slug: "smyrna-de", name: "Smyrna, Delaware" }),
  ],

  // ── Delaware: Townsend ────────────────────────────────────────────────────
  "/areas/townsend-de": [
    ...areaSchemas({
      slug: "townsend-de",
      name: "Townsend, Delaware",
      description:
        "Community guide for Townsend, DE — a small-town community in New Castle County near the Odessa corridor, offering Appoquinimink schools, golf communities, and rural charm.",
      addressLocality: "Townsend",
      addressRegion: "DE",
      postalCode: "19734",
      breadcrumbLabel: "Townsend, Delaware",
      breadcrumbSection: { name: "Delaware Communities", item: `${BASE}/areas` },
    }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What school district is Townsend, Delaware in?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Townsend, DE is served by the Appoquinimink School District, ranked #1 in Delaware by Niche.com.",
          },
        },
        {
          "@type": "Question",
          name: "What is the average home price in Townsend, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Home prices in Townsend, DE typically range from the mid-$300Ks to over $500K depending on the community, with golf course communities like Odessa National commanding premium prices.",
          },
        },
        {
          "@type": "Question",
          name: "Is Townsend, Delaware a quiet place to live?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Townsend offers a small-town atmosphere with nature access including Blackbird State Forest, while remaining convenient to Middletown shopping and Route 1.",
          },
        },
      ],
    },
    areaDataset({ slug: "townsend-de", name: "Townsend, Delaware" }),
  ],

  // ── Delaware: New Castle ──────────────────────────────────────────────────
  "/areas/new-castle-de": [
    ...areaSchemas({
      slug: "new-castle-de",
      name: "New Castle, Delaware",
      description:
        "Community guide for New Castle, DE — a historic city on the Delaware River featuring colonial architecture, cobblestone streets, and affordable homes in the Colonial School District.",
      addressLocality: "New Castle",
      addressRegion: "DE",
      postalCode: "19720",
      breadcrumbLabel: "New Castle, Delaware",
      breadcrumbSection: { name: "Delaware Communities", item: `${BASE}/areas` },
    }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is New Castle, Delaware known for?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "New Castle, DE is known for its exceptionally well-preserved colonial and 18th-century architecture, historic downtown, cobblestone streets, and riverfront access along the Delaware River.",
          },
        },
        {
          "@type": "Question",
          name: "What school district is New Castle, Delaware in?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "New Castle, DE is served by the Colonial School District.",
          },
        },
        {
          "@type": "Question",
          name: "What is the average home price in New Castle, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "New Castle, DE offers some of the most affordable homes in New Castle County, with median prices generally ranging from $250,000 to $375,000 depending on the neighborhood.",
          },
        },
        {
          "@type": "Question",
          name: "How far is New Castle, Delaware from Wilmington?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "New Castle is approximately 6 miles south of downtown Wilmington — about a 10–15 minute drive.",
          },
        },
      ],
    },
    areaDataset({ slug: "new-castle-de", name: "New Castle, Delaware" }),
  ],

  // ── Delaware: Odessa ──────────────────────────────────────────────────────
  "/areas/odessa-de": [
    ...areaSchemas({
      slug: "odessa-de",
      name: "Odessa, Delaware",
      description:
        "Community guide for Odessa, DE — a historic village in New Castle County featuring a preserved 18th-century district, golf communities, and Appoquinimink school access.",
      addressLocality: "Odessa",
      addressRegion: "DE",
      postalCode: "19730",
      breadcrumbLabel: "Odessa, Delaware",
      breadcrumbSection: { name: "Delaware Communities", item: `${BASE}/areas` },
    }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Odessa, Delaware known for?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Odessa, DE is known for its Historic Odessa district — one of the best-preserved 18th-century towns in the Mid-Atlantic — featuring museums, Georgian-style architecture, and historic gardens.",
          },
        },
        {
          "@type": "Question",
          name: "What school district is Odessa, Delaware in?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Odessa, DE is served by the Appoquinimink School District, ranked #1 in Delaware.",
          },
        },
        {
          "@type": "Question",
          name: "Is Odessa, DE a good place to buy a home?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Odessa offers a unique combination of historic character and modern amenities, with nearby communities like Odessa National Golf Club. It is a strong choice for buyers who value the top-ranked Appoquinimink schools and a quiet village setting.",
          },
        },
      ],
    },
    areaDataset({ slug: "odessa-de", name: "Odessa, Delaware" }),
  ],

  // ── Delaware: North Star ──────────────────────────────────────────────────
  "/areas/north-star-de": [
    ...areaSchemas({
      slug: "north-star-de",
      name: "North Star, Delaware",
      description:
        "Community guide for North Star, DE — an upscale unincorporated community in New Castle County served by the Red Clay Consolidated School District, featuring luxury homes and wooded lots.",
      addressLocality: "North Star",
      addressRegion: "DE",
      postalCode: "19808",
      breadcrumbLabel: "North Star, Delaware",
      breadcrumbSection: { name: "Delaware Communities", item: `${BASE}/areas` },
    }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What school district is North Star, Delaware in?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "North Star, DE is served by the Red Clay Consolidated School District, ranked #2 in Delaware.",
          },
        },
        {
          "@type": "Question",
          name: "What type of homes are in North Star, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "North Star features a mix of luxury custom-built homes, executive properties on wooded lots, and established single-family neighborhoods. The area is known for premium construction and spacious properties.",
          },
        },
        {
          "@type": "Question",
          name: "How far is North Star, Delaware from Wilmington?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "North Star is approximately 8–10 miles southwest of downtown Wilmington — a 15–20 minute commute.",
          },
        },
      ],
    },
    areaDataset({ slug: "north-star-de", name: "North Star, Delaware" }),
  ],

  // ── Delaware: Centreville ─────────────────────────────────────────────────
  "/areas/centreville-de": [
    ...areaSchemas({
      slug: "centreville-de",
      name: "Centreville, Delaware",
      description:
        "Community guide for Centreville, DE — a prestigious village in the Brandywine Valley featuring historic estates, luxury homes, scenic rolling hills, and Red Clay school access.",
      addressLocality: "Centreville",
      addressRegion: "DE",
      postalCode: "19807",
      breadcrumbLabel: "Centreville, Delaware",
      breadcrumbSection: { name: "Delaware Communities", item: `${BASE}/areas` },
    }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Centreville, Delaware known for?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Centreville is known as one of Delaware's most prestigious residential areas, set in the Brandywine Valley near Winterthur Museum, Mt. Cuba Center, and Longwood Gardens. It features historic stone farmhouses, luxury estates, and scenic countryside.",
          },
        },
        {
          "@type": "Question",
          name: "What school district is Centreville, Delaware in?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Centreville, DE is primarily served by the Red Clay Consolidated School District, and is also close to several prestigious private schools.",
          },
        },
        {
          "@type": "Question",
          name: "What types of homes are available in Centreville, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Centreville offers a range of luxury properties including historic stone farmhouses, custom estate homes on large lots, and upscale mixed-use residences. Prices are among the highest in Delaware.",
          },
        },
      ],
    },
    areaDataset({ slug: "centreville-de", name: "Centreville, Delaware" }),
  ],

  // ── Delaware: Delaware City ───────────────────────────────────────────────
  "/areas/delaware-city-de": [
    ...areaSchemas({
      slug: "delaware-city-de",
      name: "Delaware City, Delaware",
      description:
        "Community guide for Delaware City, DE — a small historic city on the Delaware River featuring Victorian architecture, marina access, Fort Delaware State Park, and Colonial School District.",
      addressLocality: "Delaware City",
      addressRegion: "DE",
      postalCode: "19706",
      breadcrumbLabel: "Delaware City, Delaware",
      breadcrumbSection: { name: "Delaware Communities", item: `${BASE}/areas` },
    }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Delaware City, Delaware known for?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Delaware City is known for Fort Delaware State Park on Pea Patch Island, its Victorian-era architecture, marina access, and proximity to wildlife refuges and the C&D Canal.",
          },
        },
        {
          "@type": "Question",
          name: "What school district is Delaware City in?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Delaware City is served by the Colonial School District.",
          },
        },
        {
          "@type": "Question",
          name: "Is Delaware City, DE a good place to buy waterfront property?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Delaware City offers some of the most accessible waterfront and water-view properties in New Castle County at relatively affordable prices, with marina access and proximity to wildlife refuges.",
          },
        },
      ],
    },
    areaDataset({ slug: "delaware-city-de", name: "Delaware City, Delaware" }),
  ],

  // ── Delaware: Glasgow ─────────────────────────────────────────────────────
  "/areas/glasgow-de": [
    ...areaSchemas({
      slug: "glasgow-de",
      name: "Glasgow, Delaware",
      description:
        "Community guide for Glasgow, DE — an established community in New Castle County near Route 40 and I-95, served by the Christina School District with convenient access to Wilmington and Newark.",
      addressLocality: "Glasgow",
      addressRegion: "DE",
      postalCode: "19702",
      breadcrumbLabel: "Glasgow, Delaware",
      breadcrumbSection: { name: "Delaware Communities", item: `${BASE}/areas` },
    }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What school district is Glasgow, Delaware in?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Glasgow, DE is served by the Christina School District.",
          },
        },
        {
          "@type": "Question",
          name: "How far is Glasgow, Delaware from Wilmington?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Glasgow is approximately 12 miles southwest of downtown Wilmington — about a 20-minute drive via I-95 North.",
          },
        },
        {
          "@type": "Question",
          name: "What is the housing market like in Glasgow, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Glasgow offers a mix of established single-family neighborhoods, newer construction, and affordable townhomes. It is one of the more accessible price points in New Castle County.",
          },
        },
      ],
    },
    areaDataset({ slug: "glasgow-de", name: "Glasgow, Delaware" }),
  ],

  // ── Delaware: Clayton ─────────────────────────────────────────────────────
  "/areas/clayton-de": [
    ...areaSchemas({
      slug: "clayton-de",
      name: "Clayton, Delaware",
      description:
        "Community guide for Clayton, DE — a small town in Kent County offering affordable housing, small-town character, and easy Route 13 access between Smyrna and Dover.",
      addressLocality: "Clayton",
      addressRegion: "DE",
      postalCode: "19938",
      breadcrumbLabel: "Clayton, Delaware",
      breadcrumbSection: { name: "Delaware Communities", item: `${BASE}/areas` },
    }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What county is Clayton, Delaware in?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Clayton is located in Kent County, Delaware, approximately midway between Smyrna and Dover along Route 13.",
          },
        },
        {
          "@type": "Question",
          name: "Is Clayton, DE affordable for first-time home buyers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Clayton is one of the most affordable towns in Kent County, offering entry-level single-family homes and newer construction at prices below neighboring Smyrna and Dover.",
          },
        },
        {
          "@type": "Question",
          name: "What is Clayton, Delaware known for?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Clayton is a quiet small town known for its historic core, tight-knit community feel, and growing residential development along the Route 13 corridor.",
          },
        },
      ],
    },
    areaDataset({ slug: "clayton-de", name: "Clayton, Delaware" }),
  ],

  // ── Delaware: Newark ──────────────────────────────────────────────────────
  "/areas/newark-de": [
    ...areaSchemas({
      slug: "newark-de",
      name: "Newark, Delaware",
      description:
        "Community guide for Newark, DE — home to the University of Delaware, a walkable Main Street, and diverse housing ranging from starter homes to executive neighborhoods.",
      addressLocality: "Newark",
      addressRegion: "DE",
      postalCode: "19711",
      breadcrumbLabel: "Newark, Delaware",
      breadcrumbSection: { name: "Delaware Communities", item: `${BASE}/areas` },
    }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Newark, Delaware known for?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Newark, DE is best known as home to the University of Delaware and its walkable Main Street lined with restaurants, shops, and entertainment. It is one of the most vibrant communities in Delaware.",
          },
        },
        {
          "@type": "Question",
          name: "What school district is Newark, Delaware in?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Newark, DE is served primarily by the Christina School District, with some areas also falling within the Red Clay Consolidated School District.",
          },
        },
        {
          "@type": "Question",
          name: "Is Newark, DE a good place for real estate investment?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Newark has strong rental demand driven by the University of Delaware, stable property values, and a diverse housing market. It is a popular choice for both owner-occupants and investors.",
          },
        },
        {
          "@type": "Question",
          name: "How far is Newark, Delaware from Philadelphia?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Newark, DE is approximately 40 miles southwest of Philadelphia — about a 45-minute drive via I-95 North.",
          },
        },
      ],
    },
    areaDataset({ slug: "newark-de", name: "Newark, Delaware" }),
  ],

  // ── Delaware: Pike Creek ──────────────────────────────────────────────────
  "/areas/pike-creek-de": [
    ...areaSchemas({
      slug: "pike-creek-de",
      name: "Pike Creek, Delaware",
      description:
        "Community guide for Pike Creek, DE — a highly desirable suburban community in New Castle County served by Red Clay schools, featuring parks, trails, and strong resale values.",
      addressLocality: "Pike Creek",
      addressRegion: "DE",
      postalCode: "19808",
      breadcrumbLabel: "Pike Creek, Delaware",
      breadcrumbSection: { name: "Delaware Communities", item: `${BASE}/areas` },
    }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What school district is Pike Creek, Delaware in?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Pike Creek, DE is served by the Red Clay Consolidated School District, one of Delaware's top-ranked districts.",
          },
        },
        {
          "@type": "Question",
          name: "Why is Pike Creek, DE so popular with home buyers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Pike Creek is popular for its combination of top-rated Red Clay schools, proximity to Brandywine Springs State Park and White Clay Creek trails, the Pike Creek shopping corridor, and strong property values.",
          },
        },
        {
          "@type": "Question",
          name: "How far is Pike Creek, Delaware from Wilmington?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Pike Creek is approximately 10–12 miles southwest of downtown Wilmington — about a 20-minute drive.",
          },
        },
      ],
    },
    areaDataset({ slug: "pike-creek-de", name: "Pike Creek, Delaware" }),
  ],

  // ── Wilmington, DE (parent) ───────────────────────────────────────────────
  "/areas/wilmington-de": [
    {
      "@context": "https://schema.org",
      "@type": "Place",
      "@id": `${BASE}/areas/wilmington-de/#place`,
      name: "Wilmington, Delaware",
      description:
        "Community guide for Wilmington, DE — Delaware's largest city featuring the Riverfront, Brandywine Park, finance and biotech employment hubs, and diverse neighborhoods from Trolley Square to the Highlands.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Wilmington",
        addressRegion: "DE",
        postalCode: "19801",
        addressCountry: "US",
      },
      url: `${BASE}/areas/wilmington-de`,
      author: { "@type": "RealEstateAgent", "@id": `${BASE}/#kevin-hensley` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Delaware Communities", item: `${BASE}/areas` },
        { "@type": "ListItem", position: 3, name: "Wilmington, Delaware", item: `${BASE}/areas/wilmington-de` },
      ],
    },
    {
      ...KEVIN_AGENT,
      areaServed: { "@type": "Place", "@id": `${BASE}/areas/wilmington-de/#place` },
      knowsAbout: { "@type": "Place", "@id": `${BASE}/areas/wilmington-de/#place` },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the average home price in Wilmington, Delaware?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "As of early 2025, the median home sale price in Wilmington, DE is approximately $325,000 — among the most affordable of any Delaware city, with significant variation by neighborhood.",
          },
        },
        {
          "@type": "Question",
          name: "What are the best neighborhoods in Wilmington, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Top neighborhoods in Wilmington include Trolley Square (walkable, urban), the Highlands (historic, upscale), Forty Acres (community-oriented), North Wilmington (suburban, family-friendly), and the Riverfront (new development, amenities).",
          },
        },
        {
          "@type": "Question",
          name: "What industries are based in Wilmington, Delaware?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Wilmington is a major center for finance, banking, and credit card companies (JPMorgan Chase, Bank of America, Capital One), as well as pharmaceutical and biotech firms.",
          },
        },
      ],
    },
    areaDataset({ slug: "wilmington-de", name: "Wilmington, Delaware" }),
  ],

  // ── Wilmington sub-neighborhoods ─────────────────────────────────────────
  "/areas/wilmington-de/north-wilmington": [
    ...wilmingtonSubSchemas({
    subSlug: "north-wilmington",
    name: "North Wilmington, Delaware",
    description:
      "Community guide for North Wilmington, DE — a suburban residential area featuring mature landscaping, family neighborhoods, and convenient access to I-95 and Wilmington employment.",
    addressLocality: "North Wilmington",
    postalCode: "19803",
    breadcrumbLabel: "North Wilmington",
  }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is North Wilmington, Delaware known for?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "North Wilmington is a suburban residential area in New Castle County known for mature landscaping, family-friendly neighborhoods, top-rated Brandywine School District schools, and easy I-95 access to Wilmington and Philadelphia.",
          },
        },
        {
          "@type": "Question",
          name: "What are home prices like in North Wilmington, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "North Wilmington features a mix of split-levels, ranches, and colonials, with prices generally ranging from the mid-$200s to over $600,000 depending on the street and condition. Contact Kevin Hensley at (302) 218-0130 for current listing data.",
          },
        },
        {
          "@type": "Question",
          name: "Which school district serves North Wilmington?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Most of North Wilmington is served by the Brandywine School District, which includes Concord High School and several well-regarded elementary and middle schools.",
          },
        },
      ],
    },
  ],

  "/areas/wilmington-de/highlands": [
    ...wilmingtonSubSchemas({
    subSlug: "highlands",
    name: "Highlands, Wilmington, Delaware",
    description:
      "Community guide for the Highlands neighborhood of Wilmington, DE — a prestigious historic district featuring Tudor and Colonial Revival homes, tree-lined streets, and proximity to Brandywine Park.",
    addressLocality: "Wilmington",
    postalCode: "19806",
    breadcrumbLabel: "Highlands, Wilmington",
  }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What makes the Highlands neighborhood in Wilmington, DE special?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The Highlands is one of Wilmington's most prestigious historic districts, featuring Tudor Revival, Colonial Revival, and Arts and Crafts architecture, tree-lined streets, and proximity to Brandywine Park and the Delaware Art Museum.",
          },
        },
        {
          "@type": "Question",
          name: "What type of homes are in the Highlands, Wilmington?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The Highlands is characterized by large historic single-family homes — many over 100 years old — with generous lot sizes, front porches, and architectural details uncommon in newer construction. Prices generally range from the $400s to over $1 million.",
          },
        },
        {
          "@type": "Question",
          name: "How close is the Highlands to downtown Wilmington?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The Highlands sits just north of downtown Wilmington, roughly a 5–10 minute drive or a pleasant walk via Brandywine Park to the Rodney Square business district and Amtrak station.",
          },
        },
      ],
    },
  ],

  "/areas/wilmington-de/forty-acres": [
    ...wilmingtonSubSchemas({
    subSlug: "forty-acres",
    name: "Forty Acres, Wilmington, Delaware",
    description:
      "Community guide for the Forty Acres neighborhood of Wilmington, DE — a historic, tight-knit urban neighborhood with strong community identity, proximity to parks, and accessible home prices.",
    addressLocality: "Wilmington",
    postalCode: "19806",
    breadcrumbLabel: "Forty Acres",
  }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the Forty Acres neighborhood in Wilmington, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Forty Acres is a historic urban neighborhood in Wilmington known for its tight-knit community, affordable rowhouses and twins, proximity to Brandywine Creek State Park, and strong neighborhood association. It borders the Highlands and Trolley Square areas.",
          },
        },
        {
          "@type": "Question",
          name: "Is Forty Acres a good neighborhood to buy in Wilmington?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Forty Acres offers some of Wilmington's more accessible price points for urban rowhouse living, with active neighborhood investment and convenient access to parks, dining, and I-95. Kevin Hensley can provide current active listings and market data.",
          },
        },
        {
          "@type": "Question",
          name: "What is commuting like from Forty Acres, Wilmington?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Forty Acres has strong commuter access — the Wilmington Amtrak station is about 10 minutes away, and I-95 provides quick connections to Philadelphia (30 min) and Baltimore (1 hour). DART bus routes also serve the area.",
          },
        },
      ],
    },
  ],

  "/areas/wilmington-de/trolley-square": [
    ...wilmingtonSubSchemas({
    subSlug: "trolley-square",
    name: "Trolley Square, Wilmington, Delaware",
    description:
      "Community guide for Trolley Square, Wilmington, DE — a walkable, eclectic neighborhood featuring independent restaurants, boutique shops, Victorian rowhouses, and a vibrant arts scene.",
    addressLocality: "Wilmington",
    postalCode: "19806",
    breadcrumbLabel: "Trolley Square",
  }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Trolley Square in Wilmington, DE known for?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Trolley Square is Wilmington's most walkable urban neighborhood, known for its independent restaurants, boutique shops, Victorian rowhouses, and a vibrant arts and nightlife scene along Delaware Avenue.",
          },
        },
        {
          "@type": "Question",
          name: "What kind of homes are in Trolley Square, Wilmington?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Trolley Square features charming Victorian rowhouses, twins, and converted condos, many retaining original architectural details. It appeals to young professionals and buyers seeking walkable city living at moderate price points compared to larger East Coast metros.",
          },
        },
        {
          "@type": "Question",
          name: "Is Trolley Square walkable?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — Trolley Square consistently earns high Walk Scores for Wilmington. Residents can walk to numerous restaurants, coffee shops, yoga studios, and specialty retailers, and the Wilmington Amtrak station is about a 10-minute drive or DART bus ride away.",
          },
        },
      ],
    },
  ],

  // ── Middletown, DE (parent) ───────────────────────────────────────────────
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
    {
      ...KEVIN_AGENT,
      areaServed: { "@type": "Place", "@id": `${BASE}/areas/middletown-de/#place` },
      knowsAbout: { "@type": "Place", "@id": `${BASE}/areas/middletown-de/#place` },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is Middletown, Delaware a good place to live?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Middletown is consistently rated among the best places to live in Delaware. It is served by the #1-ranked Appoquinimink School District, has experienced 200%+ population growth, and offers a wide range of housing from new construction townhomes to luxury master-planned communities.",
          },
        },
        {
          "@type": "Question",
          name: "What school district is Middletown, Delaware in?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Middletown, DE is served by the Appoquinimink School District, ranked #1 in Delaware by Niche.com.",
          },
        },
        {
          "@type": "Question",
          name: "What is the average home price in Middletown, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "As of early 2025, the median home sale price in Middletown, DE is approximately $520,000, with new construction and luxury communities like Parkside and Bayberry driving prices higher.",
          },
        },
        {
          "@type": "Question",
          name: "How far is Middletown, Delaware from Wilmington?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Middletown is approximately 25 miles south of Wilmington — about a 25–30 minute drive via Route 1 North.",
          },
        },
      ],
    },
    areaDataset({ slug: "north-wilmington", name: "North Wilmington, Delaware", isSubNeighborhood: true, parentSlug: "wilmington-de" }),
    areaDataset({ slug: "highlands", name: "Highlands, Wilmington, Delaware", isSubNeighborhood: true, parentSlug: "wilmington-de" }),
    areaDataset({ slug: "forty-acres", name: "Forty Acres, Wilmington, Delaware", isSubNeighborhood: true, parentSlug: "wilmington-de" }),
    areaDataset({ slug: "trolley-square", name: "Trolley Square, Wilmington, Delaware", isSubNeighborhood: true, parentSlug: "wilmington-de" }),
  ],

  // ── Middletown sub-neighborhoods ─────────────────────────────────────────
  "/areas/middletown-de/parkside": [
    ...neighborhoodSchemas({
    slug: "parkside",
    name: "Parkside, Middletown, Delaware",
    description:
      "Community guide for Parkside, Middletown DE — a luxury master-planned neighborhood with resort-style pool and direct trail access.",
    datasetName: "Demographic and Housing Profile for Parkside, Middletown, Delaware",
    breadcrumbs: [
      { name: "Home", item: BASE },
      { name: "Delaware Communities", item: `${BASE}/areas` },
      { name: "Middletown, Delaware", item: `${BASE}/areas/middletown-de` },
      { name: "Parkside", item: `${BASE}/areas/middletown-de/parkside` },
    ],
  }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Parkside in Middletown, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Parkside is a luxury master-planned community in Middletown, Delaware, featuring resort-style amenities including a pool and clubhouse, direct trail access, and a variety of single-family homes and townhouses within the Appoquinimink School District.",
          },
        },
        {
          "@type": "Question",
          name: "What are home prices in Parkside, Middletown, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Parkside homes typically range from the mid-$300s to over $600,000 depending on size and build. The community offers both resale and new construction options. Contact Kevin Hensley at (302) 218-0130 for current availability.",
          },
        },
        {
          "@type": "Question",
          name: "Which schools serve Parkside in Middletown, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Parkside is served by the highly rated Appoquinimink School District, which includes Middletown High School, Meredith Middle School, and Bunker Hill Elementary.",
          },
        },
      ],
    },
  ],

  "/areas/middletown-de/bayberry": [
    ...neighborhoodSchemas({
    slug: "bayberry",
    name: "Bayberry, Middletown, Delaware",
    description:
      "Award-winning master-planned community in Middletown, DE featuring multiple neighborhoods, walking trails, lakes, parks, and the 55+ Ponds at Bayberry.",
    datasetName: "Demographic and Housing Profile for Bayberry, Middletown, Delaware",
    breadcrumbs: [
      { name: "Home", item: BASE },
      { name: "Delaware Communities", item: `${BASE}/areas` },
      { name: "Middletown, Delaware", item: `${BASE}/areas/middletown-de` },
      { name: "Bayberry", item: `${BASE}/areas/middletown-de/bayberry` },
    ],
  }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Bayberry in Middletown, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Bayberry is an award-winning master-planned community in Middletown, Delaware featuring multiple distinct neighborhoods, scenic lakes, walking trails, parks, and the 55+ active-adult enclave known as the Ponds at Bayberry. It is one of the largest planned communities in Delaware.",
          },
        },
        {
          "@type": "Question",
          name: "Is Bayberry good for families?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — Bayberry is one of the most family-friendly communities in Delaware. It sits within the Appoquinimink School District, offers extensive trail and park infrastructure, and features a variety of home styles from townhouses to large single-family homes.",
          },
        },
        {
          "@type": "Question",
          name: "Does Bayberry have a 55+ section?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — the Ponds at Bayberry is the active adult (55+) section of the broader Bayberry community, featuring low-maintenance homes, clubhouse amenities, and a quiet, resort-style setting still close to Middletown's shopping and services.",
          },
        },
      ],
    },
  ],

  "/areas/middletown-de/st-annes": [
    ...neighborhoodSchemas({
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
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is The Estates at St. Anne's in Middletown, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The Estates at St. Anne's is an upscale golf course community in Middletown, Delaware, featuring spacious estate homes, scenic fairway views, and easy Route 1 access. Homes typically offer larger lots and premium finishes within the Appoquinimink School District.",
          },
        },
        {
          "@type": "Question",
          name: "Does St. Anne's have a golf course?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — the community is centered around the St. Anne's Golf Course, providing residents with scenic fairway views and recreational access. The course and surrounding estates create a distinct upscale character compared to other Middletown neighborhoods.",
          },
        },
        {
          "@type": "Question",
          name: "How far is St. Anne's from Middletown town center?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "St. Anne's is located just minutes from Middletown's main commercial corridor on Route 299 and Middletown Warwick Road, providing easy access to restaurants, grocery stores, and the Christiana Mall via Route 1.",
          },
        },
      ],
    },
  ],

  "/areas/middletown-de/whitehall": [
    ...neighborhoodSchemas({
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
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is The Town of Whitehall in Middletown, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The Town of Whitehall is a new urbanism community in Middletown, Delaware designed to blend homes, shops, parks, and walkability in a traditional neighborhood setting. It features front-porch architecture, mixed-use zoning, and a town center concept uncommon in Delaware new construction.",
          },
        },
        {
          "@type": "Question",
          name: "Can I walk to shops in Whitehall, Middletown?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "That is a key design goal of Whitehall — the community is being built to include walkable retail and services within the neighborhood itself, reducing car dependence compared to conventional suburban developments.",
          },
        },
        {
          "@type": "Question",
          name: "Is Whitehall new construction or resale?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Whitehall is predominantly new construction, with phased development ongoing. Both new build and early resale homes are available. Kevin Hensley can advise on builder contracts, incentives, and resale opportunities at (302) 218-0130.",
          },
        },
      ],
    },
  ],

  "/areas/middletown-de/hyetts-corner": [
    ...neighborhoodSchemas({
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
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Hyetts Corner in Middletown, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Hyetts Corner (also marketed as Hyetts Crossing) is a collection of modern new construction communities in Middletown, Delaware featuring energy-efficient homes, contemporary open floor plans, and convenient Route 1 access within the Appoquinimink School District.",
          },
        },
        {
          "@type": "Question",
          name: "Are Hyetts Corner homes new construction?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — Hyetts Corner consists primarily of recently built or actively under-construction single-family homes and townhouses with modern energy-efficient features. Kevin Hensley works with buyers to navigate builder contracts and negotiate upgrades.",
          },
        },
        {
          "@type": "Question",
          name: "What school district is Hyetts Corner in?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Hyetts Corner falls within the Appoquinimink School District, consistently one of the top-rated districts in Delaware, serving students through Middletown High School.",
          },
        },
      ],
    },
  ],

  // ── Maryland: Chesapeake City ─────────────────────────────────────────────
  "/areas/chesapeake-city-md": [
    ...areaSchemas({
      slug: "chesapeake-city-md",
      name: "Chesapeake City, Maryland",
      description:
        "Community guide for Chesapeake City, MD — a charming waterfront town on the C&D Canal featuring Victorian architecture, marina access, boutique shops, and a strong second-home market.",
      addressLocality: "Chesapeake City",
      addressRegion: "MD",
      postalCode: "21915",
      breadcrumbLabel: "Chesapeake City, Maryland",
      breadcrumbSection: { name: "Maryland Communities", item: `${BASE}/areas` },
    }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Chesapeake City, Maryland known for?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Chesapeake City is known for its scenic location on the Chesapeake and Delaware Canal, Victorian-era architecture, waterfront dining, marina access, and its appeal as a weekend destination and second-home community.",
          },
        },
        {
          "@type": "Question",
          name: "Is Chesapeake City, MD a good place to buy waterfront property?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Chesapeake City offers a unique waterfront lifestyle on the C&D Canal at price points significantly below comparable waterfront markets. It appeals to buyers seeking water views, boating access, and a historic village setting.",
          },
        },
        {
          "@type": "Question",
          name: "How far is Chesapeake City, Maryland from Wilmington, Delaware?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Chesapeake City is approximately 20 miles from Wilmington, DE — about a 25–30 minute drive.",
          },
        },
      ],
    },
    areaDataset({ slug: "chesapeake-city-md", name: "Chesapeake City, Maryland" }),
  ],

  // ── Maryland: Elkton ──────────────────────────────────────────────────────
  "/areas/elkton-md": [
    ...areaSchemas({
      slug: "elkton-md",
      name: "Elkton, Maryland",
      description:
        "Community guide for Elkton, MD — the Cecil County seat offering affordable suburban housing, Route 40 commercial access, and convenient proximity to Delaware and Pennsylvania.",
      addressLocality: "Elkton",
      addressRegion: "MD",
      postalCode: "21921",
      breadcrumbLabel: "Elkton, Maryland",
      breadcrumbSection: { name: "Maryland Communities", item: `${BASE}/areas` },
    }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is Elkton, Maryland affordable for home buyers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Elkton, MD is one of the most affordable markets in the Delaware-Maryland-Pennsylvania tri-state area, with a range of entry-level homes, townhomes, and suburban neighborhoods priced well below nearby Delaware communities.",
          },
        },
        {
          "@type": "Question",
          name: "How far is Elkton, Maryland from Wilmington, Delaware?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Elkton is approximately 12 miles from Wilmington, DE — about a 20-minute drive via I-95.",
          },
        },
        {
          "@type": "Question",
          name: "What county is Elkton, Maryland in?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Elkton is the county seat of Cecil County, Maryland.",
          },
        },
      ],
    },
    areaDataset({ slug: "elkton-md", name: "Elkton, Maryland" }),
  ],

  // ── Maryland: North East ──────────────────────────────────────────────────
  "/areas/north-east-md": [
    ...areaSchemas({
      slug: "north-east-md",
      name: "North East, Maryland",
      description:
        "Community guide for North East, MD — a waterfront town on the North East River and Chesapeake Bay offering marina access, a charming Main Street, and affordable home prices in Cecil County.",
      addressLocality: "North East",
      addressRegion: "MD",
      postalCode: "21901",
      breadcrumbLabel: "North East, Maryland",
      breadcrumbSection: { name: "Maryland Communities", item: `${BASE}/areas` },
    }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is North East, Maryland known for?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "North East, MD is known for its waterfront location on the North East River (which feeds into the Chesapeake Bay), its marina, charming Main Street, and as a popular destination for boaters and outdoor enthusiasts.",
          },
        },
        {
          "@type": "Question",
          name: "Is North East, MD a good place to live?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "North East is a strong option for buyers seeking waterfront access, a small-town atmosphere, and affordable prices — particularly those working in the Delaware or Wilmington corridor.",
          },
        },
      ],
    },
    areaDataset({ slug: "north-east-md", name: "North East, Maryland" }),
  ],

  // ── Maryland: Perryville ──────────────────────────────────────────────────
  "/areas/perryville-md": [
    ...areaSchemas({
      slug: "perryville-md",
      name: "Perryville, Maryland",
      description:
        "Community guide for Perryville, MD — a waterfront community in Cecil County at the mouth of the Susquehanna River, offering marina access, Amtrak rail service, and affordable housing.",
      addressLocality: "Perryville",
      addressRegion: "MD",
      postalCode: "21903",
      breadcrumbLabel: "Perryville, Maryland",
      breadcrumbSection: { name: "Maryland Communities", item: `${BASE}/areas` },
    }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Perryville, Maryland known for?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Perryville is known for its location at the mouth of the Susquehanna River where it meets the Chesapeake Bay, with marina access, Perry Point VA Medical Center, and an Amtrak station providing rail access to Philadelphia and Baltimore.",
          },
        },
        {
          "@type": "Question",
          name: "Is Perryville, MD a good place to commute from?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Perryville has an Amtrak station with direct service to Philadelphia, Wilmington, and Baltimore, making it a viable option for commuters seeking affordable waterfront living with rail access.",
          },
        },
      ],
    },
    areaDataset({ slug: "perryville-md", name: "Perryville, Maryland" }),
  ],

  // ── Core service pages ────────────────────────────────────────────────────
  "/buy": [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Home Buying Services - Delaware & Maryland",
      description:
        "Expert home buying assistance in Delaware and Maryland. Market analysis, property tours, and professional negotiation.",
      provider: { "@type": "RealEstateAgent", name: "Kevin Hensley", url: BASE },
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
      provider: { "@type": "RealEstateAgent", name: "Kevin Hensley", url: BASE },
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
      provider: { "@type": "RealEstateAgent", name: "Kevin Hensley", url: BASE },
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
