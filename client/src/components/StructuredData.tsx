import { StructuredDataProps } from '@/utils/structuredData';

interface StructuredDataComponentProps {
  data: StructuredDataProps | StructuredDataProps[];
}

/**
 * Component for injecting structured data into the page head.
 * Renders inline <script type="application/ld+json"> tags so that
 * schema markup is present in the initial HTML and visible to crawlers.
 */
export default function StructuredData({ data }: StructuredDataComponentProps) {
  const dataArray = Array.isArray(data) ? data : [data];

  return (
    <>
      {dataArray.map((item) => {
        const json = JSON.stringify(
          {
            '@context': 'https://schema.org',
            '@type': item.type,
            ...item.data,
          },
          null,
          2
        );
        return (
          <script
            key={item.type}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: json }}
          />
        );
      })}
    </>
  );
}
