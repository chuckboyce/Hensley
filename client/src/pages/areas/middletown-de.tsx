import { Link } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Home, TrendingUp, GraduationCap, Building, Clock, Users, Compass } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function MiddletownDE() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'middletown-schema';
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Place",
      "@id": "https://hensleyshomes.com/areas/middletown-de/#place",
      "name": "Middletown, Delaware",
      "description": "Community guide for Middletown, DE including neighborhoods, new construction, schools, commutes, and insights from local Realtor Kevin Hensley.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Middletown",
        "addressRegion": "DE",
        "postalCode": "19709",
        "addressCountry": "US"
      },
      "areaServed": "Middletown, Delaware",
      "url": "https://hensleyshomes.com/areas/middletown-de",
      "author": {
        "@type": "RealEstateAgent",
        "@id": "https://hensleyshomes.com/#kevin-hensley"
      }
    });
    
    const existing = document.getElementById('middletown-schema');
    if (existing) existing.remove();
    document.head.appendChild(script);
    
    return () => {
      const el = document.getElementById('middletown-schema');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <MapPin className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Middletown, Delaware
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Welcome to Middletown — one of Delaware's most desirable and fastest-growing communities.
                Whether you're searching for a new construction home, ready to move up, or buying your
                first place, Middletown offers a blend of comfort, convenience, and small-town charm.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/buy">
                  <Button size="lg" data-testid="button-see-homes">
                    <Home className="mr-2 h-5 w-5" />
                    See Homes
                  </Button>
                </Link>
                <Link href="/sell">
                  <Button size="lg" variant="outline" data-testid="button-get-home-value">
                    Get Home Value
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About Middletown */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                About Middletown
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Over the last two decades, Middletown has experienced tremendous growth — new schools,
                parks, restaurants, and entire neighborhoods — while maintaining the friendly,
                community-driven feel residents love. From parades to festivals and everyday moments with
                neighbors, Middletown is the kind of place where people feel connected and supported.
              </p>
            </div>
          </div>
        </section>

        {/* Housing Market Overview */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
                Housing Market Overview
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-12">
                Middletown offers a wide variety of homes including modern townhomes, amenity-rich planned
                communities, golf course neighborhoods, and luxury properties. It's also one of the most
                active new construction markets in Delaware.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                  <div className="text-3xl font-bold text-primary mb-2">$350K–$425K</div>
                  <h3 className="font-semibold mb-2">Starter Homes</h3>
                  <p className="text-muted-foreground text-sm">
                    Perfect for first-time buyers
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                  <div className="text-3xl font-bold text-primary mb-2">$475K–$650K</div>
                  <h3 className="font-semibold mb-2">Move-Up Homes</h3>
                  <p className="text-muted-foreground text-sm">
                    Growing families and upgraders
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                  <div className="text-3xl font-bold text-primary mb-2">$700K+</div>
                  <h3 className="font-semibold mb-2">Luxury Homes</h3>
                  <p className="text-muted-foreground text-sm">
                    Premium properties and estates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* New Construction */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start mb-6">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    New Construction in Middletown
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    New construction is one of Middletown's biggest attractions. Buyers can choose from modern
                    floor plans, energy-efficient designs, smart home upgrades, and community amenities like
                    pools, walking trails, and clubhouses. Several builders continue to expand the area with
                    fresh, thoughtfully planned developments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Neighborhoods */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
                Neighborhood Highlights
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-8">
                Popular neighborhoods in Middletown include:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Parkside",
                  "The Estates at St. Anne's",
                  "Bayberry North & South",
                  "Hyetts Corner / Hyetts Crossing",
                  "The Town of Whitehall",
                  "Legacy at Odessa National"
                ].map((neighborhood) => (
                  <div key={neighborhood} className="bg-card rounded-lg p-4 border border-border flex items-center">
                    <MapPin className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    <span className="font-medium">{neighborhood}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Schools */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start mb-8">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Schools
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Middletown is part of the highly rated Appoquinimink School District — one of Delaware's
                    top-performing districts.
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-16">
                {[
                  "Middletown High School",
                  "Appoquinimink High School",
                  "Louis L. Redding Middle School",
                  "Silver Lake Elementary",
                  "Cedar Lane Elementary"
                ].map((school) => (
                  <div key={school} className="flex items-center">
                    <div className="h-2 w-2 bg-primary rounded-full mr-3"></div>
                    <span>{school}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Things to Do */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
                Things to Do
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: MapPin, text: "Historic Downtown Middletown / Main Street" },
                  { icon: Users, text: "Middletown Peach Festival (annual tradition)" },
                  { icon: Compass, text: "Silver Lake Park" },
                  { icon: Building, text: "Local restaurants, breweries, and boutique shopping" },
                  { icon: Users, text: "Year-round community events and seasonal celebrations" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start bg-card rounded-lg p-4 border border-border">
                    <item.icon className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Commute */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start mb-8">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Commute & Accessibility
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    With immediate access to Route 1, Middletown provides quick travel options for work or
                    weekend plans.
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-16">
                <div className="flex items-center justify-between bg-card rounded-lg p-4 border border-border">
                  <span className="font-medium">Wilmington</span>
                  <span className="text-primary font-semibold">25–35 min</span>
                </div>
                <div className="flex items-center justify-between bg-card rounded-lg p-4 border border-border">
                  <span className="font-medium">Newark</span>
                  <span className="text-primary font-semibold">20–30 min</span>
                </div>
                <div className="flex items-center justify-between bg-card rounded-lg p-4 border border-border">
                  <span className="font-medium">Philadelphia Airport</span>
                  <span className="text-primary font-semibold">50–60 min</span>
                </div>
                <div className="flex items-center justify-between bg-card rounded-lg p-4 border border-border">
                  <span className="font-medium">Dover</span>
                  <span className="text-primary font-semibold">~35 min</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Who Middletown is Best For
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Middletown is ideal for families, commuters, first-time buyers, and anyone seeking modern
                    home options, strong schools, and a welcoming, active community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Explore Other Areas */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
                Explore Nearby Areas
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/areas/townsend-de">
                  <div className="bg-card rounded-lg p-4 border border-border hover:border-primary transition-colors cursor-pointer text-center">
                    <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                    <span className="font-medium">Townsend, DE</span>
                  </div>
                </Link>
                <Link href="/areas/bear-de">
                  <div className="bg-card rounded-lg p-4 border border-border hover:border-primary transition-colors cursor-pointer text-center">
                    <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                    <span className="font-medium">Bear, DE</span>
                  </div>
                </Link>
                <Link href="/areas/new-castle-de">
                  <div className="bg-card rounded-lg p-4 border border-border hover:border-primary transition-colors cursor-pointer text-center">
                    <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                    <span className="font-medium">New Castle, DE</span>
                  </div>
                </Link>
                <Link href="/areas/hockessin-de">
                  <div className="bg-card rounded-lg p-4 border border-border hover:border-primary transition-colors cursor-pointer text-center">
                    <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                    <span className="font-medium">Hockessin, DE</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 lg:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Explore Middletown?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Whether you're buying or selling, I'm here to help you navigate the Middletown market with
              confidence and local expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/buy">
                <Button size="lg" variant="secondary" data-testid="button-cta-see-homes">
                  See Homes
                </Button>
              </Link>
              <Link href="/sell">
                <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary" data-testid="button-cta-get-value">
                  Get Home Value
                </Button>
              </Link>
              <Link href="/property-management">
                <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary" data-testid="button-cta-property-mgmt">
                  Property Management
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
