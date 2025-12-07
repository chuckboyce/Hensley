import { Link } from "wouter";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, GraduationCap, Home, TreePine, Heart, Car, Bed, Bath, Ruler, ExternalLink, Landmark, Zap, Droplets, Leaf, Building, ShoppingBag } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import bearHero from "@assets/generated_images/bear_de_suburban_aerial_view.png";
import type { Property } from "@shared/schema";

const BEAR_ZIP = "19701";

export default function BearDE() {
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties/zip', BEAR_ZIP],
  });

  const spotlightProperty = useMemo(() => {
    if (properties.length === 0) return null;
    
    const salesListings = properties.filter(p => !p.isRental);
    const rentalListings = properties.filter(p => p.isRental);
    
    if (salesListings.length > 0) {
      return salesListings.reduce((highest, current) => 
        Number(current.listPrice) > Number(highest.listPrice) ? current : highest
      );
    }
    
    if (rentalListings.length > 0) {
      return rentalListings.reduce((highest, current) => 
        Number(current.listPrice) > Number(highest.listPrice) ? current : highest
      );
    }
    
    return null;
  }, [properties]);

  useEffect(() => {
    const placeScript = document.createElement('script');
    placeScript.type = 'application/ld+json';
    placeScript.id = 'bear-place-schema';
    placeScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Place",
      "@id": "https://hensleyshomes.com/areas/bear-de/#place",
      "name": "Bear, Delaware",
      "description": "Community guide for Bear, DE including neighborhoods, schools, commutes, and insights from local Realtor Kevin Hensley.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bear",
        "addressRegion": "DE",
        "postalCode": "19701",
        "addressCountry": "US"
      },
      "areaServed": "Bear, Delaware",
      "url": "https://hensleyshomes.com/areas/bear-de",
      "author": {
        "@type": "RealEstateAgent",
        "@id": "https://hensleyshomes.com/#kevin-hensley"
      }
    });
    
    const existingPlace = document.getElementById('bear-place-schema');
    if (existingPlace) existingPlace.remove();
    document.head.appendChild(placeScript);
    
    return () => {
      const el = document.getElementById('bear-place-schema');
      if (el) el.remove();
    };
  }, []);

  const neighborhoods = [
    { 
      name: "Brennan Estates", 
      type: "Family-Friendly",
      description: "A highly desirable community featuring tree-lined streets, playgrounds, and well-maintained homes. Popular among families for its strong community feel, nearby schools, and easy access to Route 40 and I-95.",
      link: "https://www.brennanestateshoa.org",
      linkText: "Brennan Estates HOA"
    },
    { 
      name: "Caravel Farms", 
      type: "Established / Luxury",
      description: "Known for its spacious lots, mature landscaping, and custom-built homes. Caravel Farms appeals to buyers seeking privacy, character, and a quiet setting within minutes of major roadways.",
      link: "https://www.caravelfarms.org",
      linkText: "Caravel Farms Community Info"
    },
    { 
      name: "Red Lion Chase", 
      type: "Luxury / Master Planned",
      description: "An upscale community with large homes, clubhouse amenities, open space, and scenic streetscapes. Ideal for buyers seeking newer construction with premium finishes and community facilities.",
      link: "https://redlionchasemc.com",
      linkText: "Red Lion Chase Maintenance Corp."
    },
    { 
      name: "Village of Red Lion Creek", 
      type: "Active Adult (55+)",
      description: "A popular 55+ community offering low-maintenance homes, quiet streets, and proximity to shopping and medical services. Great for active adults seeking a comfortable, well-kept neighborhood.",
      link: "https://www.villageofredlioncreek.com",
      linkText: "Village of Red Lion Creek Community Site"
    }
  ];

  const highlights = [
    { icon: GraduationCap, title: "Strong Schools", desc: "Christina & Colonial Districts" },
    { icon: Home, title: "Mix of Styles", desc: "Established & Newer" },
    { icon: TreePine, title: "Parks", desc: "Glasgow Park & Trails" },
    { icon: ShoppingBag, title: "Convenient", desc: "Route 40 Corridor" }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Image */}
        <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bearHero})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 container mx-auto px-4 lg:px-6 text-center text-white">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/80 mb-2">
                Discover
              </p>
              <p className="text-5xl md:text-7xl font-bold tracking-wide font-serif" style={{ fontVariant: 'small-caps' }}>
                Bear
              </p>
              <p className="text-xl md:text-2xl font-bold tracking-[0.2em] mt-2 text-white/90 font-serif">
                DELAWARE
              </p>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Bear, DE Real Estate: Homes for Sale & Community Guide
              </h1>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Looking to buy a home in Bear, Delaware? Bear offers a convenient location near Wilmington and Newark, a wide mix of established and newer communities, and strong access to major employers along Route 40 and I-95. Families appreciate its parks, shopping corridors, and steady housing market, making Bear an appealing option for commuters and first-time buyers alike.
                </p>
                <p>
                  As a local real estate expert, Kevin helps clients explore neighborhoods like Brennan Estates, Caravel Farms, Red Lion Chase, and Wrangle Hill Estates. Whether you're searching for a starter townhome, a spacious move-up property, or a low-maintenance active-adult home, Bear has options that fit a variety of lifestyles and budgets.
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
                <div className="text-3xl md:text-4xl font-bold">30 min</div>
                <div className="text-sm opacity-80">to Wilmington</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold">2</div>
                <div className="text-sm opacity-80">School Districts</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold">~$400K</div>
                <div className="text-sm opacity-80">Median Price (Jan 2025)</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold">Steady</div>
                <div className="text-sm opacity-80">Population Growth</div>
              </div>
            </div>
          </div>
        </section>

        {/* Spotlight Listing */}
        {spotlightProperty && (
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {spotlightProperty.isRental ? 'Featured Rental' : 'Featured Home'} in Bear
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  {spotlightProperty.isRental 
                    ? 'Premium rental property available now' 
                    : 'Exceptional property currently on the market'}
                </p>
              </div>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow max-w-4xl mx-auto">
                <div className="md:flex">
                  {spotlightProperty.imageUrl && (
                    <div className="md:w-1/2 aspect-video md:aspect-auto relative overflow-hidden">
                      <img 
                        src={spotlightProperty.imageUrl} 
                        alt={spotlightProperty.unparsedAddress || 'Property'} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <span className={`absolute top-3 left-3 ${spotlightProperty.isRental ? 'bg-blue-600' : 'bg-primary'} text-white text-sm font-semibold px-3 py-1.5 rounded`}>
                        {spotlightProperty.isRental ? 'FOR RENT' : 'FOR SALE'}
                      </span>
                    </div>
                  )}
                  <CardContent className="md:w-1/2 p-6 flex flex-col justify-between">
                    <div>
                      <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                        ${Math.round(Number(spotlightProperty.listPrice)).toLocaleString()}
                        {spotlightProperty.isRental && <span className="text-lg font-normal">/mo</span>}
                      </div>
                      <p className="text-lg text-foreground mb-4">
                        {spotlightProperty.unparsedAddress}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {spotlightProperty.city}, {spotlightProperty.stateOrProvince} {spotlightProperty.postalCode}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {spotlightProperty.bedroomsTotal && (
                          <div className="flex items-center gap-2">
                            <Bed className="h-5 w-5 text-primary" />
                            <span className="font-medium">{spotlightProperty.bedroomsTotal}</span>
                            <span className="text-muted-foreground">Bedrooms</span>
                          </div>
                        )}
                        {(spotlightProperty.bathroomsFull || spotlightProperty.bathroomsHalf) && (
                          <div className="flex items-center gap-2">
                            <Bath className="h-5 w-5 text-primary" />
                            <span className="font-medium">
                              {spotlightProperty.bathroomsFull || 0}
                              {spotlightProperty.bathroomsHalf ? `.${spotlightProperty.bathroomsHalf}` : ''}
                            </span>
                            <span className="text-muted-foreground">Bathrooms</span>
                          </div>
                        )}
                        {spotlightProperty.livingArea && (
                          <div className="flex items-center gap-2">
                            <Ruler className="h-5 w-5 text-primary" />
                            <span className="font-medium">{spotlightProperty.livingArea.toLocaleString()}</span>
                            <span className="text-muted-foreground">Sq Ft</span>
                          </div>
                        )}
                        {spotlightProperty.yearBuilt && (
                          <div className="flex items-center gap-2">
                            <Building className="h-5 w-5 text-primary" />
                            <span className="font-medium">{spotlightProperty.yearBuilt}</span>
                            <span className="text-muted-foreground">Built</span>
                          </div>
                        )}
                        {spotlightProperty.garageSpaces && (
                          <div className="flex items-center gap-2">
                            <Car className="h-5 w-5 text-primary" />
                            <span className="font-medium">{spotlightProperty.garageSpaces}</span>
                            <span className="text-muted-foreground">Garage</span>
                          </div>
                        )}
                        {spotlightProperty.lotSizeArea && (
                          <div className="flex items-center gap-2">
                            <TreePine className="h-5 w-5 text-primary" />
                            <span className="font-medium">{Number(spotlightProperty.lotSizeArea).toFixed(2)}</span>
                            <span className="text-muted-foreground">{spotlightProperty.lotSizeUnits || 'Acres'}</span>
                          </div>
                        )}
                      </div>

                      {spotlightProperty.propertySubType && (
                        <p className="text-sm text-muted-foreground mb-4">
                          <span className="font-medium">Property Type:</span> {spotlightProperty.propertySubType}
                        </p>
                      )}

                      {spotlightProperty.daysOnMarket !== null && spotlightProperty.daysOnMarket !== undefined && (
                        <p className="text-sm text-muted-foreground mb-4">
                          <span className="font-medium">Days on Market:</span> {spotlightProperty.daysOnMarket}
                        </p>
                      )}
                    </div>

                    {spotlightProperty.listingUrl && (
                      <a 
                        href={spotlightProperty.listingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <Button size="lg" className="w-full" data-testid="button-view-full-listing">
                          View Full Listing on RE/MAX
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Why Bear - Visual Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Families Love Bear
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
                From starter townhomes to upscale communities, Bear has options for every budget
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-3 bg-blue-500" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">$300K–$375K</div>
                  <h3 className="font-semibold text-lg mb-2">Starter Homes</h3>
                  <p className="text-muted-foreground text-sm">
                    Great for first-time buyers seeking townhomes or modest single-family homes with convenient commuting access
                  </p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow border-primary">
                <div className="h-3 bg-primary" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">$380K–$500K</div>
                  <h3 className="font-semibold text-lg mb-2">Move-Up Homes</h3>
                  <p className="text-muted-foreground text-sm">
                    Ideal for households wanting larger floor plans, garages, and established neighborhoods with nearby shopping
                  </p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-3 bg-amber-500" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">$550K+</div>
                  <h3 className="font-semibold text-lg mb-2">Luxury Homes</h3>
                  <p className="text-muted-foreground text-sm">
                    Features include larger lots, upgraded interiors, and upscale communities with amenities and open space
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Neighborhood Highlights & Resources */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                Neighborhood Highlights & Resources
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                Explore some of Bear's most desirable communities, each offering its own character, amenities, and lifestyle benefits.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {neighborhoods.map((hood) => (
                  <Card key={hood.name} className="hover:shadow-md transition-shadow h-full">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{hood.name}</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                            {hood.type}
                          </span>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4 flex-1">
                        {hood.description}
                      </p>
                      {hood.link && (
                        <a 
                          href={hood.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                          {hood.linkText}
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                  <p className="text-muted-foreground">Quick access to I-95 and major destinations</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { dest: "Wilmington", time: "30 min" },
                  { dest: "Newark", time: "15 min" },
                  { dest: "Philadelphia (PHL)", time: "40 min" },
                  { dest: "Dover", time: "50 min" }
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

        {/* Local Resources */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                Local Resources
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                Helpful links for new residents and homebuyers in Bear
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Municipal Government */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Landmark className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg">Municipal Government</h3>
                    </div>
                    <ul className="space-y-3">
                      <li>
                        <a href="https://www.nccde.org" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors">
                          <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                          <span><strong>New Castle County Government</strong> — Services & local info</span>
                        </a>
                      </li>
                      <li>
                        <a href="https://nccde.org/140/Bear-Library" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors">
                          <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                          <span><strong>Bear Library</strong> — Community programs & events</span>
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Electric Service */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                        <Zap className="h-5 w-5 text-amber-600" />
                      </div>
                      <h3 className="font-bold text-lg">Electric Service</h3>
                    </div>
                    <ul className="space-y-3">
                      <li>
                        <a href="https://www.delmarva.com" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors">
                          <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                          <span><strong>Delmarva Power</strong> — Electric provider for Bear & surrounding areas</span>
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Water & Wastewater */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Droplets className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-lg">Water & Wastewater</h3>
                    </div>
                    <ul className="space-y-3">
                      <li>
                        <a href="https://www.nccde.org" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors">
                          <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                          <span><strong>New Castle County Sewer Services</strong> — Sewer & wastewater info</span>
                        </a>
                      </li>
                      <li>
                        <a href="https://www.artesianwater.com" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors">
                          <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                          <span><strong>Artesian Water Company</strong> — Water utility provider</span>
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Community Info */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <Leaf className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="font-bold text-lg">Community Info</h3>
                    </div>
                    <ul className="space-y-3">
                      <li>
                        <a href="https://www.nccde.org/431/Glasgow-Park" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors">
                          <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                          <span><strong>Glasgow Park</strong> — Trails, events, amenities</span>
                        </a>
                      </li>
                      <li>
                        <a href="https://en.wikipedia.org/wiki/Bear,_Delaware" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors">
                          <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                          <span><strong>Bear History</strong> — Local information & history</span>
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Explore Other Areas */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-3xl font-bold text-center mb-8">
              Explore Nearby Areas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { name: "Newark", href: "/areas/newark-de" },
                { name: "New Castle", href: "/areas/new-castle-de" },
                { name: "Delaware City", href: "/areas/delaware-city-de" },
                { name: "Glasgow", href: "/areas/glasgow-de" }
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
              Sources: Median home price from RocketHomes (January 2025). 
              School district information from Niche.com (2024-25). 
              Population data from U.S. Census Bureau. 
              Commute times are estimates and may vary.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
