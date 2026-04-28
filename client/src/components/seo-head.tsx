import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";

const BASE_URL = "https://hensleyshomes.com";

interface PageMeta {
  title: string;
  description: string;
}

const PAGE_META: Record<string, PageMeta> = {
  "/": {
    title: "Kevin Hensley's Homes - Delaware & Maryland Real Estate | Property Management",
    description:
      "Kevin Hensley's Homes provides expert real estate services in Delaware and Maryland. Specializing in home sales, property management, and investment consulting. Contact us for a free consultation today.",
  },
  "/buy": {
    title: "Buy a Home in Delaware & Maryland - Kevin Hensley's Homes",
    description:
      "Find your dream home in Delaware or Maryland with expert guidance. Comprehensive market analysis, property tours, and professional negotiation services. Start your home search today.",
  },
  "/sell": {
    title: "Sell Your Home in Delaware & Maryland - Kevin Hensley's Homes",
    description:
      "Sell your Delaware or Maryland home for top dollar. Professional photography, strategic marketing, and expert negotiation. Get your free home valuation today.",
  },
  "/property-management": {
    title: "Property Management Services - Delaware & Maryland | Kevin Hensley's Homes",
    description:
      "Professional property management in Delaware and Maryland. Tenant screening, rent collection, maintenance coordination, and 24/7 support. Maximize your rental income with peace of mind.",
  },
  "/areas/middletown-de": {
    title: "Middletown, DE Real Estate: Homes for Sale & Community Guide | Hensley's Homes",
    description:
      "Find homes for sale in Middletown, Delaware. Top-rated Appoquinimink schools, new construction, and easy commutes to Wilmington & Philadelphia. Your local Middletown real estate expert.",
  },
  "/contact": {
    title: "Contact Us - Kevin Hensley's Homes | Delaware & Maryland Real Estate",
    description:
      "Get in touch with Kevin Hensley's Homes for all your real estate needs in Delaware and Maryland. Call (302) 218-0130 or submit our online form for a free consultation.",
  },
  "/properties": {
    title: "Properties for Sale & Rent - Kevin Hensley's Homes | Delaware & Maryland",
    description:
      "Browse available properties for sale and rent in Delaware and Maryland. Find your dream home or investment property with Kevin Hensley's Homes.",
  },
  "/portal": {
    title: "Property Owner Portal - Kevin Hensley's Homes",
    description:
      "Access your property management portal to view rent payments, maintenance requests, and property documents.",
  },
  "/fair-housing": {
    title: "Fair Housing Policy - Kevin Hensley's Homes",
    description:
      "Kevin Hensley's Homes is committed to fair housing practices and equal opportunity in all real estate transactions.",
  },
  "/privacy-policy": {
    title: "Privacy Policy - Kevin Hensley's Homes",
    description:
      "Read our privacy policy to understand how we collect, use, and protect your personal information.",
  },
  "/terms-of-use": {
    title: "Terms of Use - Kevin Hensley's Homes",
    description:
      "Review the terms and conditions for using the Kevin Hensley's Homes website and services.",
  },
};

export function SEOHead() {
  const [location] = useLocation();
  const normalizedPath =
    location.split("#")[0].split("?")[0].replace(/\/$/, "") || "/";
  const canonicalUrl =
    normalizedPath === "/" ? BASE_URL : `${BASE_URL}${normalizedPath}`;
  const pageMeta = PAGE_META[normalizedPath];

  return (
    <Helmet>
      {pageMeta && <title>{pageMeta.title}</title>}
      {pageMeta && <meta name="description" content={pageMeta.description} />}
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={canonicalUrl} />
      {pageMeta && <meta property="og:title" content={pageMeta.title} />}
      {pageMeta && (
        <meta property="og:description" content={pageMeta.description} />
      )}
      {pageMeta && <meta name="twitter:title" content={pageMeta.title} />}
      {pageMeta && (
        <meta name="twitter:description" content={pageMeta.description} />
      )}
    </Helmet>
  );
}
