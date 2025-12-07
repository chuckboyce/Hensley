/**
 * Breadcrumb Schema Generator for JSON-LD markup
 * Generates proper BreadcrumbList schema for SEO
 */

export interface BreadcrumbSchemaItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbSchemaItem[], baseUrl: string = 'https://hensleyshomes.com') {
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": baseUrl
    },
    ...items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 2,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`
    }))
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems
  };
}
