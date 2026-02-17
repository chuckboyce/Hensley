import { Link } from "wouter";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/breadcrumb";
import { MapPin, GraduationCap, Building, TreePine, ShoppingBag, Car, Bed, Bath, Ruler, ExternalLink, Landmark, Zap, Droplets, Leaf } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import LocalNews from "@/components/local-news";
import { Button } from "@/components/ui/button";
import perryvilleHero from "@assets/generated_images/perryville_waterfront_river_and_marina.png";
import type { Property } from "@shared/schema";

const PERRYVILLE_ZIP = "21903";

export default function PerryvilleMD() {
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties/zip', PERRYVILLE_ZIP],
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
    placeScript.id = 'perryville-place-schema';
    placeScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Place",
      "@id": "https://hensleyshomes.com/areas/perryville-md/#place",
      "name": "Perryville, Maryland",
      "description": "Community guide for Perryville, MD including neighborhoods, waterfront living, schools, commutes, and insights from local Realtor Kevin Hensley.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Perryville",
        "addressRegion": "MD",
        "postalCode": "21903",
        "addressCountry": "US"
      },
      "areaServed": "Perryville, Maryland",
      "url": "https://hensleyshomes.com/areas/perryville-md",
      "author": {
        "@type": "RealEstateAgent",
        "@id": "https://hensleyshomes.com/#kevin-hensley"
      }
    });
    
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.id = 'perryville-md-breadcrumb-schema';
    breadcrumbScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://hensleyshomes.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Maryland Communities",
          "item": "https://hensleyshomes.com/areas"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Perryville, Maryland",
          "item": "https://hensleyshomes.com/areas/perryville-md"
        }
      ]
    });
    
    const existingPlace = document.getElementById('perryville-place-schema');
    if (existingPlace) existingPlace.remove();
    const existingBreadcrumb = document.getElementById('perryville-md-breadcrumb-schema');
    if (existingBreadcrumb) existingBreadcrumb.remove();
    
    document.head.appendChild(placeScript);
    document.head.appendChild(breadcrumbScript);
    
    return () => {
      const el = document.getElementById('perryville-place-schema');
      if (el) el.remove();
      const bc = document.getElementById('perryville-md-breadcrumb-schema');
      if (bc) bc.remove();
    };
  }, []);

  const neighborhoods = [
    { 
      name: "RiverView Estates", 
      type: "Waterfront / Scenic",
      description: "A desirable neighborhood offering water views, quiet streets, and proximity to Perryville Community Park. Excellent for buyers drawn to peaceful waterfront settings."
    },
    { 
      name: "Beacon Point",
      type: "Established / Family-Friendly",
      description: "A well-known community featuring traditional homes, walkable streets, and easy access to schools, retail, and Route 40. Great for families and commuters."
    },
    { 
      name: "Owens Landing",
      type: "Waterfront / Condos",
      description: "A popular waterfront condo community offering boat slips, scenic river views, and low-maintenance living close to the MARC station and local amenities.",
      link: "https://www.rrta.com",
      linkText: "MARC Perryville Station Info"
    },
    { 
      name: "Perryville Station Area",
      type: "Commuter-Friendly / Established",
      description: "Neighborhoods surrounding the MARC station offer quick access to rail transit and I-95, making them ideal for buyers who commute to Baltimore, Washington, or Wilmington."
    },
    { 
      name: "Glen Heights",
      type: "Established / Suburban",
      description: "A quiet, suburban neighborhood featuring well-kept homes, mature landscaping, and easy proximity to Perryville's shopping and dining options."
    },
    { 
      name: "Frenchtown Woods (Perryville Area)",
      type: "Newer Construction",
      description: "A growing development area offering modern homes, larger lots, and convenient access to both Route 40 and Perryville's waterfront."
    }
  ];

  const highlights = [
    { icon: Landmark, title: "Waterfront Living", desc: "Susquehanna River views" },
    { icon: Car, title: "MARC Station", desc: "Direct rail to Baltimore/DC" },
    { icon: GraduationCap, title: "Schools", desc: "Cecil County Public Schools" },
    { icon: Leaf, title: "Parks & Marina", desc: "Community trails & boat access" }
  ];

  return (
    <>
      <Header />
      <Breadcrumb 
        items={[
          { label: "Maryland Communities", href: "/areas" },
          { label: "Perryville, Maryland", current: true }
        ]}
      />
      <main>
        {/* Hero Section with Image */}
        <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${perryvilleHero})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/80 mb-2">
                Discover
              </p>
              <p className="text-5xl md:text-7xl font-bold tracking-wide font-serif" style={{ fontVariant: 'small-caps' }}>
                Perryville
              </p>
              <p className="text-xl md:text-2xl font-bold tracking-[0.2em] mt-2 text-white/90 font-serif">
                MARYLAND
              </p>
            </div>
          </div>
        </section>

        {/* Quick Stats Bar */}
        <section className="py-8 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold">30 min</div>
                <div className="text-sm opacity-90">to Newark, DE</div>
              </div>
              <div>
                <div className="text-2xl font-bold">~$360K</div>
                <div className="text-sm opacity-90">Median Home Price</div>
              </div>
              <div>
                <div className="text-2xl font-bold">MARC Train</div>
                <div className="text-sm opacity-90">Direct rail access</div>
              </div>
              <div>
                <div className="text-2xl font-bold">Waterfront</div>
                <div className="text-sm opacity-90">Susquehanna River</div>
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
                  {spotlightProperty.isRental ? 'Featured Rental' : 'Featured Home'} in Perryville
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
                        {spotlightProperty.bedroomsTotal && <div className="flex items-center gap-2"><Bed className="h-5 w-5 text-primary" /><span className="font-medium">{spotlightProperty.bedroomsTotal}</span><span className="text-muted-foreground">Bedrooms</span></div>}
                        {(spotlightProperty.bathroomsFull || spotlightProperty.bathroomsHalf) && <div className="flex items-center gap-2"><Bath className="h-5 w-5 text-primary" /><span className="font-medium">{spotlightProperty.bathroomsFull || 0}{spotlightProperty.bathroomsHalf ? `.${spotlightProperty.bathroomsHalf}` : ''}</span><span className="text-muted-foreground">Bathrooms</span></div>}
                        {spotlightProperty.livingArea && <div className="flex items-center gap-2"><Ruler className="h-5 w-5 text-primary" /><span className="font-medium">{spotlightProperty.livingArea.toLocaleString()}</span><span className="text-muted-foreground">Sq Ft</span></div>}
                        {spotlightProperty.yearBuilt && <div className="flex items-center gap-2"><Building className="h-5 w-5 text-primary" /><span className="font-medium">{spotlightProperty.yearBuilt}</span><span className="text-muted-foreground">Built</span></div>}
                        {spotlightProperty.garageSpaces && <div className="flex items-center gap-2"><Car className="h-5 w-5 text-primary" /><span className="font-medium">{spotlightProperty.garageSpaces}</span><span className="text-muted-foreground">Garage</span></div>}
                        {spotlightProperty.lotSizeArea && <div className="flex items-center gap-2"><TreePine className="h-5 w-5 text-primary" /><span className="font-medium">{Number(spotlightProperty.lotSizeArea).toFixed(2)}</span><span className="text-muted-foreground">{spotlightProperty.lotSizeUnits || 'Acres'}</span></div>}
                      </div>
                      {spotlightProperty.propertySubType && <p className="text-sm text-muted-foreground mb-4"><span className="font-medium">Property Type:</span> {spotlightProperty.propertySubType}</p>}
                      {spotlightProperty.daysOnMarket !== null && spotlightProperty.daysOnMarket !== undefined && <p className="text-sm text-muted-foreground mb-4"><span className="font-medium">Days on Market:</span> {spotlightProperty.daysOnMarket}</p>}
                    </div>
                    {spotlightProperty.listingUrl && <a href={spotlightProperty.listingUrl} target="_blank" rel="noopener noreferrer" className="inline-block"><Button size="lg" className="w-full" data-testid="button-view-full-listing">View Full Listing on RE/MAX</Button></a>}
                  </CardContent>
                </div>
              </Card>
            </div>
          </section>
        )}

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Families Love Perryville</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((item, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"><item.icon className="h-8 w-8 text-primary" /></div>
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Your Price Range</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">From waterfront townhomes to suburban homes, Perryville has options for every budget</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-3 bg-blue-500" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">$260K–$330K</div>
                  <h3 className="font-semibold text-lg mb-2">Starter Homes</h3>
                  <p className="text-muted-foreground text-sm">Townhomes and smaller single-family homes near Route 40 and suburban areas</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow border-primary">
                <div className="h-3 bg-primary" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">$340K–$450K</div>
                  <h3 className="font-semibold text-lg mb-2">Move-Up Homes</h3>
                  <p className="text-muted-foreground text-sm">Larger single-family homes, established subdivisions, and updated residences</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-3 bg-amber-500" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">$500K+</div>
                  <h3 className="font-semibold text-lg mb-2">Luxury Homes</h3>
                  <p className="text-muted-foreground text-sm">Waterfront homes, acreage properties, and premium river-view residences</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Neighborhood Highlights & Resources</h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">Explore some of Perryville's most desirable communities, each offering its own character, amenities, and lifestyle benefits.</p>
              <div className="grid md:grid-cols-2 gap-6">
                {neighborhoods.map((hood) => (
                  <Card key={hood.name} className="hover:shadow-md transition-shadow h-full">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0"><MapPin className="h-5 w-5 text-primary" /></div>
                        <div>
                          <h3 className="font-bold text-lg">{hood.name}</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{hood.type}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4 flex-1">{hood.description}</p>
                      {hood.link && (
                        <a href={hood.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
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

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Nearby Areas</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Discover neighboring communities</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4 max-w-xl mx-auto">
              {[
                { name: "North East, MD", href: "/areas/north-east-md" }
                // TODO: Add these when pages are created:
                // { name: "Havre de Grace, MD", href: "/areas/havre-de-grace-md" },
                // { name: "Aberdeen, MD", href: "/areas/aberdeen-md" },
                // { name: "Elkton, MD", href: "/areas/elkton-md" },
                // { name: "Charlestown, MD", href: "/areas/charlestown-md" }
              ].map((area) => (
                <Link key={area.name} href={area.href}>
                  <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                    <CardContent className="p-4 text-center">
                      <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                      <span className="font-medium text-sm">{area.name}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-14 w-14 bg-primary rounded-full flex items-center justify-center"><Car className="h-7 w-7 text-primary-foreground" /></div>
                <div>
                  <h2 className="text-3xl font-bold">Easy Commutes</h2>
                  <p className="text-muted-foreground">Quick access to major destinations</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { dest: "Elkton, MD", time: "20 min" },
                  { dest: "Newark, DE", time: "30 min" },
                  { dest: "Aberdeen, MD", time: "10 min" },
                  { dest: "Baltimore (MARC)", time: "45 min" }
                ].map((item) => (
                  <div key={item.dest}>
                    <div className="text-xl font-bold text-primary">{item.time}</div>
                    <div className="text-sm text-muted-foreground">{item.dest}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <LocalNews locationTag="perryville-md" locationName="Perryville, MD" />

      </main>
      <Footer />
    </>
  );
}
