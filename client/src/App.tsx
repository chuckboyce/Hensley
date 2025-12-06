import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SEOHead } from "@/components/seo-head";
import { lazy, Suspense, useEffect } from "react";

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

// Critical pages - loaded immediately
import Home from "@/pages/home";
import Buy from "@/pages/buy";
import Sell from "@/pages/sell";
import PropertyManagement from "@/pages/property-management";
import MiddletownDE from "@/pages/areas/middletown-de";
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
        <Route path="/areas/middletown-de" component={MiddletownDE} />
        <Route path="/contact" component={Contact} />
        <Route path="/properties" component={Properties} />
        <Route path="/fair-housing" component={FairHousing} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-use" component={TermsOfUse} />
        
        {/* Lazy-loaded admin and portal pages */}
        <Route path="/portal" component={Portal} />
        <Route path="/admin" component={AdminListings} />
        <Route path="/admin/listings" component={AdminListings} />
        <Route path="/admin/manage-listings" component={ManageListings} />
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
        <ChatWidget />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
