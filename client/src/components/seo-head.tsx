import { useEffect } from 'react';
import { useLocation } from 'wouter';

const BASE_URL = 'https://hensleyshomes.com';

interface PageMeta {
  title: string;
  description: string;
}

const PAGE_META: Record<string, PageMeta> = {
  '/': {
    title: "Kevin Hensley's Homes | Delaware & Maryland Real Estate",
    description: "Buy, sell, or manage property in Delaware and Maryland with Kevin Hensley's Homes. Expert real estate services, property management, and investment consulting. Free consultation."
  },
  '/buy': {
    title: "Buy a Home in Delaware & Maryland - Kevin Hensley's Homes",
    description: "Find your dream home in Delaware or Maryland with expert guidance. Comprehensive market analysis, property tours, and professional negotiation services. Start your home search today."
  },
  '/sell': {
    title: "Sell Your Home in Delaware & Maryland - Kevin Hensley's Homes",
    description: "Sell your Delaware or Maryland home for top dollar. Professional photography, strategic marketing, and expert negotiation. Get your free home valuation today."
  },
  '/property-management': {
    title: "Property Management Services - Delaware & Maryland | Kevin Hensley's Homes",
    description: "Professional property management in Delaware and Maryland. Tenant screening, rent collection, maintenance coordination, and 24/7 support. Maximize your rental income with peace of mind."
  },
  '/areas/middletown-de': {
    title: "Middletown, DE Real Estate: Homes for Sale & Community Guide | Hensley's Homes",
    description: "Find homes for sale in Middletown, Delaware. Top-rated Appoquinimink schools, new construction, and easy commutes to Wilmington & Philadelphia. Your local Middletown real estate expert."
  },
  '/contact': {
    title: "Contact Us - Kevin Hensley's Homes | Delaware & Maryland Real Estate",
    description: "Get in touch with Kevin Hensley's Homes for all your real estate needs in Delaware and Maryland. Call (302) 218-0130 or submit our online form for a free consultation."
  },
  '/properties': {
    title: "Properties for Sale & Rent - Kevin Hensley's Homes | Delaware & Maryland",
    description: "Browse available properties for sale and rent in Delaware and Maryland. Find your dream home or investment property with Kevin Hensley's Homes."
  },
  '/portal': {
    title: "Property Owner Portal - Kevin Hensley's Homes",
    description: "Access your property management portal to view rent payments, maintenance requests, and property documents."
  },
  '/fair-housing': {
    title: "Fair Housing Policy - Kevin Hensley's Homes",
    description: "Kevin Hensley's Homes is committed to fair housing practices and equal opportunity in all real estate transactions."
  },
  '/privacy-policy': {
    title: "Privacy Policy - Kevin Hensley's Homes",
    description: "Read our privacy policy to understand how we collect, use, and protect your personal information."
  },
  '/terms-of-use': {
    title: "Terms of Use - Kevin Hensley's Homes",
    description: "Review the terms and conditions for using the Kevin Hensley's Homes website and services."
  },
  '/areas': {
    title: "Delaware & Maryland Service Areas | Kevin Hensley's Homes",
    description: "Hensley's Homes serves buyers and sellers across Delaware and Maryland — from Middletown and Wilmington to Elkton and Chesapeake City. Find your community."
  },
  '/areas/bear-de': {
    title: "Bear, DE Real Estate: Homes for Sale & Community Guide | Hensley's Homes",
    description: "Find homes for sale in Bear, Delaware. Family-friendly neighborhoods, easy I-95 access, and top schools in New Castle County. Your local Bear DE real estate expert."
  },
  '/areas/smyrna-de': {
    title: "Smyrna, DE Real Estate: Homes for Sale & Community Guide | Hensley's Homes",
    description: "Explore homes for sale in Smyrna, Delaware. Affordable prices, growing amenities, and access to Routes 1 and 13. Expert guidance from your local Smyrna real estate agent."
  },
  '/areas/townsend-de': {
    title: "Townsend, DE Real Estate: Homes for Sale & Community Guide | Hensley's Homes",
    description: "Discover homes for sale in Townsend, Delaware. Golf-course communities, new construction, and Appoquinimink schools. Kevin Hensley — your Townsend DE real estate expert."
  },
  '/areas/hockessin-de': {
    title: "Hockessin, DE Real Estate: Homes for Sale & Community Guide | Hensley's Homes",
    description: "Browse luxury homes for sale in Hockessin, Delaware. Upscale neighborhoods, top-rated schools, and scenic landscapes near Wilmington. Your Hockessin real estate specialist."
  },
  '/areas/new-castle-de': {
    title: "New Castle, DE Real Estate: Homes for Sale & Community Guide | Hensley's Homes",
    description: "Find homes for sale in New Castle, Delaware. Historic districts, riverfront living, and affordable prices near Wilmington and I-95. Local expertise from Kevin Hensley."
  },
  '/areas/odessa-de': {
    title: "Odessa, DE Real Estate: Homes for Sale & Community Guide | Hensley's Homes",
    description: "Explore charming homes for sale in Odessa, Delaware. Preserved historic village, golf communities, and Appoquinimink schools. Your Odessa DE real estate guide."
  },
  '/areas/delaware-city-de': {
    title: "Delaware City, DE Real Estate: Homes for Sale & Community Guide | Hensley's Homes",
    description: "Find waterfront and historic homes for sale in Delaware City, DE. Riverfront access, marina lifestyle, and unique character. Expert real estate guidance from Kevin Hensley."
  },
  '/areas/north-star-de': {
    title: "North Star, DE Real Estate: Homes for Sale & Community Guide | Hensley's Homes",
    description: "Browse upscale homes for sale in North Star, Delaware. Luxury neighborhoods near Pike Creek, top schools, and easy Wilmington commute. Your North Star real estate expert."
  },
  '/areas/centreville-de': {
    title: "Centreville, DE Real Estate: Luxury Homes & Estates | Hensley's Homes",
    description: "Discover luxury homes and estates for sale in Centreville, Delaware. Colonial architecture, rolling landscapes, and proximity to Greenville amenities. Kevin Hensley, your guide."
  },
  '/areas/wilmington-de': {
    title: "Wilmington, DE Real Estate: Homes for Sale & Neighborhoods | Hensley's Homes",
    description: "Find homes for sale in Wilmington, Delaware. Walkable historic neighborhoods, strong job market, and median prices around $325K. Expert guidance from Kevin Hensley."
  },
  '/areas/wilmington-de/north-wilmington': {
    title: "North Wilmington, DE Homes for Sale | Kevin Hensley's Homes",
    description: "Explore homes for sale in North Wilmington, Delaware. Mature suburban neighborhoods, top schools, and easy access to Wilmington's employment centers."
  },
  '/areas/wilmington-de/highlands': {
    title: "Highlands Neighborhood Wilmington, DE Homes for Sale | Hensley's Homes",
    description: "Find historic luxury homes in the Highlands neighborhood of Wilmington, DE. Tree-lined streets, elegant architecture, and walkable to Brandywine Park."
  },
  '/areas/wilmington-de/forty-acres': {
    title: "Forty Acres Neighborhood Wilmington, DE Homes for Sale | Hensley's Homes",
    description: "Browse homes for sale in the Forty Acres neighborhood of Wilmington, Delaware. Historic rowhomes, community character, and affordable entry-level prices."
  },
  '/areas/wilmington-de/trolley-square': {
    title: "Trolley Square Wilmington, DE Homes for Sale | Hensley's Homes",
    description: "Discover homes for sale in Trolley Square, Wilmington DE. Walkable shops and dining, charming row homes, and a vibrant urban neighborhood lifestyle."
  },
  '/areas/chesapeake-city-md': {
    title: "Chesapeake City, MD Real Estate: Waterfront Homes for Sale | Hensley's Homes",
    description: "Find waterfront and Victorian homes for sale in Chesapeake City, Maryland. Canal-side living, boating lifestyle, and charming boutique town. Kevin Hensley, your MD real estate expert."
  },
  '/areas/elkton-md': {
    title: "Elkton, MD Real Estate: Homes for Sale & Community Guide | Hensley's Homes",
    description: "Explore homes for sale in Elkton, Maryland. Suburban neighborhoods, golf communities, and easy access to I-95 and the Delaware border. Hensley's Homes — your Elkton MD guide."
  },
  '/areas/north-east-md': {
    title: "North East, MD Real Estate: Waterfront Homes for Sale | Hensley's Homes",
    description: "Find waterfront and single-family homes for sale in North East, Maryland. Chesapeake Bay lifestyle, marina access, and a walkable Main Street. Your North East MD real estate expert."
  },
  '/areas/perryville-md': {
    title: "Perryville, MD Real Estate: Homes for Sale & Community Guide | Hensley's Homes",
    description: "Browse homes for sale in Perryville, Maryland. Waterfront living, MARC rail access, and easy I-95 commutes to Baltimore or Wilmington. Kevin Hensley — your Perryville MD guide."
  },
  '/property-management/newark-de': {
    title: "Property Management in Newark, DE | Kevin Hensley's Homes",
    description: "Professional property management services in Newark, Delaware. Tenant screening, rent collection, and maintenance coordination for Newark rental property owners."
  }
};

export function SEOHead() {
  const [location] = useLocation();

  useEffect(() => {
    // Normalize the path: remove trailing slashes and hash fragments
    const normalizedPath = location.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';
    
    // Get canonical URL (always without trailing slash except for root)
    const canonicalUrl = normalizedPath === '/' 
      ? BASE_URL 
      : `${BASE_URL}${normalizedPath}`;

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    // Update Open Graph URL
    let ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement;
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = canonicalUrl;

    // Update page title and meta descriptions if page-specific meta exists
    const pageMeta = PAGE_META[normalizedPath];
    if (pageMeta) {
      document.title = pageMeta.title;
      
      const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (metaDescription) {
        metaDescription.content = pageMeta.description;
      }

      const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
      if (ogTitle) {
        ogTitle.content = pageMeta.title;
      }

      const ogDescription = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
      if (ogDescription) {
        ogDescription.content = pageMeta.description;
      }

      const twitterTitle = document.querySelector('meta[name="twitter:title"]') as HTMLMetaElement;
      if (twitterTitle) {
        twitterTitle.content = pageMeta.title;
      }

      const twitterDescription = document.querySelector('meta[name="twitter:description"]') as HTMLMetaElement;
      if (twitterDescription) {
        twitterDescription.content = pageMeta.description;
      }
    }
  }, [location]);

  return null;
}
