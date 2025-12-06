import { Link } from "wouter";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Home, GraduationCap, Building, TreePine, ShoppingBag, Car, Bed, Bath, Ruler } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import middletownHero from "@assets/Middletown_DE_1757012981537.jpg";
import type { Property } from "@shared/schema";

const MIDDLETOWN_ZIP = "19709";

export default function MiddletownDE() {
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties/zip', MIDDLETOWN_ZIP],
  });

  useEffect(() => {
    const placeScript = document.createElement('script');
    placeScript.type = 'application/ld+json';
    placeScript.id = 'middletown-place-schema';
    placeScript.textContent = JSON.stringify({
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
    
    const existingPlace = document.getElementById('middletown-place-schema');
    if (existingPlace) existingPlace.remove();
    document.head.appendChild(placeScript);
    
    return () => {
      const el = document.getElementById('middletown-place-schema');
      if (el) el.remove();
    };
  }, []);

  useEffect(() => {
    if (properties.length === 0) return;
    
    const propertySchemas = properties.slice(0, 6).map((property) => ({
      "@type": property.isRental ? "Residence" : "SingleFamilyResidence",
      "@id": `https://hensleyshomes.com/properties#${property.listingKey}`,
      "name": `${property.bedroomsTotal || 0} Bed, ${property.bathroomsFull || 0} Bath ${property.isRental ? 'Rental' : 'Home'} in Middletown`,
      "description": property.schemaSummary || property.publicRemarks?.substring(0, 200) || `${property.bedroomsTotal} bedroom home in Middletown, DE`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": property.unparsedAddress,
        "addressLocality": "Middletown",
        "addressRegion": "DE",
        "postalCode": "19709",
        "addressCountry": "US"
      },
      "numberOfRooms": property.bedroomsTotal,
      "numberOfBathroomsTotal": property.bathroomsFull,
      ...(property.imageUrl && { "image": property.imageUrl }),
      ...(property.listPrice && {
        "offers": {
          "@type": "Offer",
          "priceCurrency": "USD",
          "price": property.listPrice,
          "availability": "https://schema.org/InStock"
        }
      })
    }));

    const listingsScript = document.createElement('script');
    listingsScript.type = 'application/ld+json';
    listingsScript.id = 'middletown-listings-schema';
    listingsScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": propertySchemas
    });
    
    const existingListings = document.getElementById('middletown-listings-schema');
    if (existingListings) existingListings.remove();
    document.head.appendChild(listingsScript);
    
    return () => {
      const el = document.getElementById('middletown-listings-schema');
      if (el) el.remove();
    };
  }, [properties]);

  const neighborhoods = [
    { name: "Parkside", type: "New Construction" },
    { name: "The Estates at St. Anne's", type: "Luxury" },
    { name: "Bayberry", type: "Established" },
    { name: "Hyetts Corner", type: "Family-Friendly" },
    { name: "Town of Whitehall", type: "Master Planned" },
    { name: "Legacy at Odessa National", type: "Golf Course" }
  ];

  const highlights = [
    { icon: GraduationCap, title: "Top Schools", desc: "Appoquinimink District" },
    { icon: Building, title: "New Construction", desc: "Modern communities" },
    { icon: TreePine, title: "Parks & Trails", desc: "Silver Lake Park" },
    { icon: ShoppingBag, title: "Local Shops", desc: "Main Street charm" }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Image */}
        <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${middletownHero})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 container mx-auto px-4 lg:px-6 text-center text-white">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.3em] text-white/80 mb-2">
                Discover
              </p>
              <p className="text-5xl md:text-7xl font-semibold tracking-wide" style={{ fontVariant: 'small-caps' }}>
                Middletown
              </p>
              <p className="text-xl md:text-2xl font-medium tracking-[0.2em] mt-2 text-white/90">
                DELAWARE
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/buy">
                <Button size="lg" data-testid="button-see-homes">
                  <Home className="mr-2 h-5 w-5" />
                  Browse Homes
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="secondary" data-testid="button-contact">
                  Contact Kevin
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Middletown, DE Real Estate: Homes for Sale & Community Guide
              </h1>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Looking to buy a home in Middletown, Delaware? Discover why families, first-time buyers, and commuters are choosing Delaware's fastest-growing community. With top-rated Appoquinimink schools, new construction neighborhoods, and easy access to Wilmington and Philadelphia, Middletown offers the perfect blend of suburban convenience and small-town charm.
                </p>
                <p>
                  As your local Middletown real estate expert, I'll help you find the right home in communities like Parkside, Bayberry, Whitehall, and more. Whether you're searching for a starter home, move-up property, or luxury estate, let's explore what Middletown has to offer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-12 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold">25 min</div>
                <div className="text-sm opacity-80">to Wilmington</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold">#1</div>
                <div className="text-sm opacity-80">School District (Niche)</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold">$520K</div>
                <div className="text-sm opacity-80">Median Price (Jan 2025)</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold">206%</div>
                <div className="text-sm opacity-80">Growth 2000-2010</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Middletown - Visual Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Families Love Middletown
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((item, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <item.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Housing Market - Price Tiers */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Find Your Price Range
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                From starter homes to luxury estates, Middletown has options for every budget
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-3 bg-blue-500" />
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">$375K–$475K</div>
                  <h3 className="font-semibold text-lg mb-2">Starter Homes</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Townhomes & single-family homes perfect for first-time buyers
                  </p>
                  <Link href="/buy">
                    <Button size="sm" data-testid="button-starter-homes">View Homes</Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow border-primary">
                <div className="h-3 bg-primary" />
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">$500K–$650K</div>
                  <h3 className="font-semibold text-lg mb-2">Move-Up Homes</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Spacious layouts with modern amenities for growing families
                  </p>
                  <Link href="/buy">
                    <Button size="sm" data-testid="button-moveup-homes">View Homes</Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-3 bg-amber-500" />
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">$700K+</div>
                  <h3 className="font-semibold text-lg mb-2">Luxury Homes</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Premium properties, golf communities & custom estates
                  </p>
                  <Link href="/buy">
                    <Button size="sm" data-testid="button-luxury-homes">View Homes</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Active Listings */}
        {properties.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Homes for Sale in Middletown
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  {properties.length} active listing{properties.length !== 1 ? 's' : ''} in the 19709 zip code
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {properties.slice(0, 6).map((property) => (
                  <Card key={property.listingKey} className="overflow-hidden hover:shadow-xl transition-shadow">
                    {property.imageUrl && (
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={property.imageUrl} 
                          alt={property.unparsedAddress || 'Property'} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {property.isRental && (
                          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                            FOR RENT
                          </span>
                        )}
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-primary mb-1">
                        ${property.listPrice?.toLocaleString()}
                        {property.isRental && <span className="text-sm font-normal">/mo</span>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                        {property.unparsedAddress}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {property.bedroomsTotal && (
                          <span className="flex items-center gap-1">
                            <Bed className="h-4 w-4" /> {property.bedroomsTotal} bed
                          </span>
                        )}
                        {property.bathroomsFull && (
                          <span className="flex items-center gap-1">
                            <Bath className="h-4 w-4" /> {property.bathroomsFull} bath
                          </span>
                        )}
                        {property.livingArea && (
                          <span className="flex items-center gap-1">
                            <Ruler className="h-4 w-4" /> {property.livingArea.toLocaleString()} sqft
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {properties.length > 6 && (
                <div className="text-center mt-8">
                  <Link href="/properties">
                    <Button size="lg" data-testid="button-view-all-listings">
                      View All {properties.length} Listings
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Popular Neighborhoods */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Popular Neighborhoods
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {neighborhoods.map((hood) => (
                <Card key={hood.name} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{hood.name}</h3>
                      <p className="text-sm text-muted-foreground">{hood.type}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Commute Times */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-14 w-14 bg-primary rounded-full flex items-center justify-center">
                  <Car className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Easy Commutes</h2>
                  <p className="text-muted-foreground">Direct Route 1 access to major destinations</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { dest: "Wilmington", time: "25 min" },
                  { dest: "Newark", time: "20 min" },
                  { dest: "Philadelphia", time: "55 min" },
                  { dest: "Dover", time: "35 min" }
                ].map((route) => (
                  <Card key={route.dest}>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{route.time}</div>
                      <div className="text-sm text-muted-foreground">{route.dest}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Explore Other Areas */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-3xl font-bold text-center mb-8">
              Explore Nearby Areas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { name: "Townsend", href: "/areas/townsend-de" },
                { name: "Bear", href: "/areas/bear-de" },
                { name: "New Castle", href: "/areas/new-castle-de" },
                { name: "Hockessin", href: "/areas/hockessin-de" }
              ].map((area) => (
                <Link key={area.name} href={area.href}>
                  <Card className="hover:border-primary transition-colors cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                      <span className="font-medium">{area.name}, DE</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Sources Footnote */}
        <section className="py-8 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6">
            <p className="text-xs text-muted-foreground text-center max-w-3xl mx-auto">
              Sources: Median home price from Rocket Homes (January 2025). 
              School district ranking from Niche.com (2024-25). 
              Population growth data from U.S. Census Bureau (2000-2010). 
              Commute times are estimates and may vary.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
