import { Helmet } from "react-helmet-async";

/**
 * Injects one or more fully-formed JSON-LD objects into <head> via Helmet.
 * Schema markup lands in the document head on every render, visible to crawlers.
 *
 * Usage:
 *   <JsonLd schemas={[placeSchema, breadcrumbSchema, agentSchema]} />
 */
interface JsonLdProps {
  schemas: Record<string, unknown>[];
}

export default function JsonLd({ schemas }: JsonLdProps) {
  return (
    <Helmet>
      {schemas.map((schema, i) => (
        <script
          key={`${schema["@type"] ?? "schema"}-${i}`}
          type="application/ld+json"
        >
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
