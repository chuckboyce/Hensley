import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);
  
  return null;
}

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
      aria-label="Scroll to top"
      data-testid="button-scroll-to-top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}

// Critical pages - loaded immediately
import Home from "@/pages/home";
import Buy from "@/pages/buy";
import Sell from "@/pages/sell";
import PropertyManagement from "@/pages/property-management";
import PropertyManagementNewarkDE from "@/pages/property-management-newark-de";
import AreasIndex from "@/pages/areas";
import MiddletownDE from "@/pages/areas/middletown-de";
import TownsendDE from "@/pages/areas/townsend-de";
import BearDE from "@/pages/areas/bear-de";
import HockessinDE from "@/pages/areas/hockessin-de";
import NewCastleDE from "@/pages/areas/new-castle-de";
import OdessaDE from "@/pages/areas/odessa-de";
import SmyrnaDE from "@/pages/areas/smyrna-de";
import ChesapeakeCityMD from "@/pages/areas/chesapeake-city-md";
import ElktonMD from "@/pages/areas/elkton-md";
import DelawareCityDE from "@/pages/areas/delaware-city-de";
import CentrevilleDe from "@/pages/areas/centreville-de";
import CentrevilleMisspelled from "@/pages/areas/centerville-de";
import NorthStarDE from "@/pages/areas/north-star-de";
import PerryvilleMD from "@/pages/areas/perryville-md";
import NorthEastMD from "@/pages/areas/north-east-md";
import WilmingtonDE from "@/pages/areas/wilmington-de";
import NorthWilmingtonDE from "@/pages/areas/wilmington-de/north-wilmington";
import HighlandsDE from "@/pages/areas/wilmington-de/highlands";
import FortyAcresDE from "@/pages/areas/wilmington-de/forty-acres";
import TrolleySquareDE from "@/pages/areas/wilmington-de/trolley-square";
import Contact from "@/pages/contact";
import Properties from "@/pages/properties";
import FairHousing from "@/pages/fair-housing";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfUse from "@/pages/terms-of-use";
import NotFound from "@/pages/not-found";

// Non-critical pages - lazy loaded for better performance
const Portal = lazy(() => import("@/pages/portal"));
const AdminListings = lazy(() => import("@/pages/admin-listings"));
const ManageListings = lazy(() => import("@/pages/manage-listings"));
const DoorLoopTest = lazy(() => import("@/pages/doorloop-test"));
const PropertyDetail = lazy(() => import("@/pages/property-detail"));
const IdxTest = lazy(() => import("@/pages/idx-test"));
const AdminCms = lazy(() => import("@/pages/admin-cms"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));
const OwnerOnboarding = lazy(() => import("@/pages/owner-onboarding"));

// GoHighLevel Chat Widget Component
function ChatWidget() {
  return (
    <chat-widget location-id="woWxqHyKDVM5Fd6Y05OW"></chat-widget>
  );
}

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/buy" component={Buy} />
        <Route path="/sell" component={Sell} />
        <Route path="/property-management" component={PropertyManagement} />
        <Route path="/property-management/newark-de" component={PropertyManagementNewarkDE} />
        <Route path="/areas" component={AreasIndex} />
        <Route path="/areas/middletown-de" component={MiddletownDE} />
        <Route path="/areas/townsend-de" component={TownsendDE} />
        <Route path="/areas/bear-de" component={BearDE} />
        <Route path="/areas/hockessin-de" component={HockessinDE} />
        <Route path="/areas/new-castle-de" component={NewCastleDE} />
        <Route path="/areas/odessa-de" component={OdessaDE} />
        <Route path="/areas/smyrna-de" component={SmyrnaDE} />
        <Route path="/areas/chesapeake-city-md" component={ChesapeakeCityMD} />
        <Route path="/areas/elkton-md" component={ElktonMD} />
        <Route path="/areas/delaware-city-de" component={DelawareCityDE} />
        <Route path="/areas/centreville-de" component={CentrevilleDe} />
        <Route path="/areas/centerville-de" component={CentrevilleMisspelled} />
        <Route path="/areas/north-star-de" component={NorthStarDE} />
        <Route path="/areas/perryville-md" component={PerryvilleMD} />
        <Route path="/areas/north-east-md" component={NorthEastMD} />
        <Route path="/areas/wilmington-de" component={WilmingtonDE} />
        <Route path="/areas/wilmington-de/north-wilmington" component={NorthWilmingtonDE} />
        <Route path="/areas/wilmington-de/highlands" component={HighlandsDE} />
        <Route path="/areas/wilmington-de/forty-acres" component={FortyAcresDE} />
        <Route path="/areas/wilmington-de/trolley-square" component={TrolleySquareDE} />
        <Route path="/contact" component={Contact} />
        <Route path="/properties" component={Properties} />
        <Route path="/fair-housing" component={FairHousing} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-use" component={TermsOfUse} />
        
        {/* Lazy-loaded admin and portal pages */}
        <Route path="/portal" component={Portal} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/listings" component={AdminListings} />
        <Route path="/admin/manage-listings" component={ManageListings} />
        <Route path="/admin/cms" component={AdminCms} />
        <Route path="/owner-onboarding" component={OwnerOnboarding} />
        <Route path="/doorloop-test" component={DoorLoopTest} />
        {/* Property routes hidden until IDX approval */}
        {/* <Route path="/properties/:listingKey" component={PropertyDetail} /> */}
        {/* <Route path="/idx-test" component={IdxTest} /> */}
        
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScrollToTop />
        <SEOHead />
        <Toaster />
        <Router />
        <ScrollToTopButton />
        <ChatWidget />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
