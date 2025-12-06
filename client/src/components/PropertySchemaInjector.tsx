import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

interface PropertySchemaInjectorProps {
  listingKey?: string;
}

export default function PropertySchemaInjector({ listingKey }: PropertySchemaInjectorProps) {
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  
  const endpoint = listingKey 
    ? `/api/schema/property/${listingKey}`
    : '/api/schema/properties';
  
  const { data: schemaData } = useQuery<string>({
    queryKey: ['schema', listingKey || 'all'],
    queryFn: async () => {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch schema');
      }
      return response.text();
    },
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!schemaData) return;

    if (scriptRef.current) {
      scriptRef.current.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = listingKey 
      ? `property-schema-${listingKey}` 
      : 'property-list-schema';
    script.innerHTML = schemaData;
    document.head.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }
    };
  }, [schemaData, listingKey]);

  return null;
}
