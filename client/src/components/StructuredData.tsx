import { Helmet } from "react-helmet-async";
import { StructuredDataProps } from "@/utils/structuredData";

interface StructuredDataComponentProps {
  data: StructuredDataProps | StructuredDataProps[];
}

/**
 * Injects schema.org JSON-LD blocks into <head> via Helmet.
 * Accepts the StructuredDataProps format (type + data) used by the
 * structuredData utility helpers (createWebPageData, createRealEstateAgentData, etc.).
 */
export default function StructuredData({ data }: StructuredDataComponentProps) {
  const dataArray = Array.isArray(data) ? data : [data];

  return (
    <Helmet>
      {dataArray.map((item, i) => (
        <script
          key={`${item.type}-${i}`}
          type="application/ld+json"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": item.type,
            ...item.data,
          })}
        </script>
      ))}
    </Helmet>
  );
}
