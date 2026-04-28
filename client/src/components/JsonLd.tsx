/**
 * Renders one or more fully-formed JSON-LD objects as inline <script> tags
 * so that schema markup is present in the initial HTML and visible to crawlers.
 *
 * Usage:
 *   <JsonLd schemas={[placeSchema, breadcrumbSchema, datasetSchema]} />
 */
interface JsonLdProps {
  schemas: Record<string, unknown>[];
}

export default function JsonLd({ schemas }: JsonLdProps) {
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={(schema["@type"] as string) ?? i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
        />
      ))}
    </>
  );
}
