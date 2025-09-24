import { useEffect } from 'react';
import { StructuredDataProps, injectStructuredData } from '@/utils/structuredData';

interface StructuredDataComponentProps {
  data: StructuredDataProps | StructuredDataProps[];
}

/**
 * Component for injecting structured data into the page head
 * Usage: <StructuredData data={structuredDataObject} />
 */
export default function StructuredData({ data }: StructuredDataComponentProps) {
  useEffect(() => {
    if (Array.isArray(data)) {
      data.forEach(item => injectStructuredData(item));
    } else {
      injectStructuredData(data);
    }
    
    // Cleanup function to remove structured data when component unmounts
    return () => {
      const dataArray = Array.isArray(data) ? data : [data];
      dataArray.forEach(item => {
        const id = `structured-data-${item.type.toLowerCase()}`;
        const element = document.getElementById(id);
        if (element) {
          element.remove();
        }
      });
    };
  }, [data]);

  // This component doesn't render anything visible
  return null;
}