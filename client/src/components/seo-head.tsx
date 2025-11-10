import { useEffect } from 'react';
import { useLocation } from 'wouter';

const BASE_URL = 'https://hensleys-homes.com';

interface PageMeta {
  title: string;
  description: string;
}

const PAGE_META: Record<string, PageMeta> = {
  '/': {
    title: "Kevin Hensley's Homes - Delaware & Maryland Real Estate | Property Management",
    description: "Kevin Hensley's Homes provides expert real estate services in Delaware and Maryland. Specializing in home sales, property management, and investment consulting. Contact us for a free consultation today."
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
    title: "Middletown DE Real Estate - Homes for Sale | Kevin Hensley's Homes",
    description: "Discover Middletown, Delaware real estate. One of DE's fastest-growing communities with top schools, modern amenities, and easy access to major cities. Browse homes and schedule tours."
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
