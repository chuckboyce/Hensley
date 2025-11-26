import Header from "@/components/header";
import Hero from "@/components/hero";
import Services from "@/components/services";
import About from "@/components/about";
// import FeaturedProperties from "@/components/featured-properties"; // Hidden until IDX approval
import Testimonials from "@/components/testimonials";
import ServiceArea from "@/components/service-area";
import Footer from "@/components/footer";
import StructuredData from "@/components/StructuredData";
import { createWebPageData, createBreadcrumbData, createRealEstateAgentData, createOrganizationData, createFAQData } from "@/utils/structuredData";

export default function Home() {
  // Create structured data for the home page
  const homePageData = createWebPageData({
    name: "Kevin Hensley's Homes - Delaware & Maryland Real Estate",
    description: "Professional real estate services in Delaware and Maryland. Specializing in home sales, property management, and investment consulting. Contact us for a free consultation.",
    url: "https://hensleys-homes.com",
    breadcrumbs: [
      { name: "Home", url: "https://hensleys-homes.com" }
    ]
  });

  const breadcrumbData = createBreadcrumbData([
    { name: "Home", url: "https://hensleys-homes.com" }
  ]);

  const realEstateAgentData = createRealEstateAgentData();
  const organizationData = createOrganizationData();
  const faqData = createFAQData();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StructuredData data={[homePageData, breadcrumbData, realEstateAgentData, organizationData, faqData]} />
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        {/* <FeaturedProperties /> */} {/* Hidden until IDX approval */}
        <Testimonials />
        <ServiceArea />
      </main>
      <Footer />
    </div>
  );
}
