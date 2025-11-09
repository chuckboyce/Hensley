import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Contact from "@/pages/contact";
import FairHousing from "@/pages/fair-housing";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfUse from "@/pages/terms-of-use";
import PropertyDetail from "@/pages/property-detail";
import IdxTest from "@/pages/idx-test";
import DoorLoopTest from "@/pages/doorloop-test";
import Portal from "@/pages/portal";
import NotFound from "@/pages/not-found";

// GoHighLevel Chat Widget Component
function ChatWidget() {
  return (
    <chat-widget location-id="woWxqHyKDVM5Fd6Y05OW"></chat-widget>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/contact" component={Contact} />
      <Route path="/portal" component={Portal} />
      <Route path="/fair-housing" component={FairHousing} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-use" component={TermsOfUse} />
      <Route path="/doorloop-test" component={DoorLoopTest} />
      {/* Property routes hidden until IDX approval */}
      {/* <Route path="/properties/:listingKey" component={PropertyDetail} /> */}
      {/* <Route path="/idx-test" component={IdxTest} /> */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <ChatWidget />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
