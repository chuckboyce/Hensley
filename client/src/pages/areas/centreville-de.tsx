import { Link } from "wouter";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, GraduationCap, Building, TreePine, ShoppingBag, Car, Bed, Bath, Ruler, ExternalLink, Landmark, Zap, Droplets, Leaf } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import centrevileHero from "@assets/generated_images/centreville_luxury_estates_and_rolling_hills.png";
import type { Property } from "@shared/schema";

const CENTREVILLE_ZIP = "19807";

export default function CentrevilleDe() {
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties/zip', CENTREVILLE_ZIP],
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
    placeScript.id = 'centreville-place-schema';
    placeScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Place",
      "@id": "https://hensleyshomes.com/areas/centreville-de/#place",
      "name": "Centreville, Delaware",
      "description": "Community guide for Centreville, DE including luxury neighborhoods, estates, schools, commutes, and insights from local Realtor Kevin Hensley.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Centreville",
        "addressRegion": "DE",
        "postalCode": "19807",
        "addressCountry": "US"
      },
      "areaServed": "Centreville, Delaware",
      "url": "https://hensleyshomes.com/areas/centreville-de",
      "author": {
        "@type": "RealEstateAgent",
        "@id": "https://hensleyshomes.com/#kevin-hensley"
      }
    });
    
    const existingPlace = document.getElementById('centreville-place-schema');
    if (existingPlace) existingPlace.remove();
    document.head.appendChild(placeScript);
    
    return () => {
      const el = document.getElementById('centreville-place-schema');
      if (el) el.remove();
    };
  }, []);

  const neighborhoods = [
    { 
      name: "Centreville Village", 
      type: "Historic / Walkable",
      description: "The heart of Centreville, featuring Colonial-era architecture, boutique shops, and scenic surroundings. Ideal for buyers valuing charm and lifestyle amenities.",
      link: "https://www.visitwilmingtonde.com",
      linkText: "Centreville Village Info"
    },
    { 
      name: "Owl's Nest Area",
      type: "Luxury / Countryside",
      description: "Known for custom homes, open landscapes, and proximity to golf, dining, and luxury amenities. Offers privacy with easy access to Route 52."
    },
    { 
      name: "Dew Point Farms Area",
      type: "Rural / Scenic",
      description: "A countryside setting with traditional and custom homes, offering lush landscapes and quiet living near the PA border."
    },
    { 
      name: "Barley Mill / Greenville Fringe",
      type: "Luxury / Newer Development",
      description: "A high-end mixed-use area nearby offering luxury residences, retail, and modern amenities. Appeals to buyers seeking upscale, low-maintenance living.",
      link: "https://www.barleymillplaza.com",
      linkText: "Barley Mill Plaza"
    },
    { 
      name: "Centre Meeting Road Area",
      type: "Historic / Countryside",
      description: "Features historic homes, stone farmhouses, and elegant estate properties among rolling hills and wooded scenery."
    },
    { 
      name: "Mt. Cuba Surroundings",
      type: "Scenic / Natural",
      description: "Homes near Mt. Cuba Center enjoy exceptional privacy, wooded settings, and stunning natural views within minutes of nature trails and gardens.",
      link: "https://mtcubacenter.org",
      linkText: "Mt. Cuba Center Info"
    }
  ];

  const highlights = [
    { icon: Landmark, title: "Historic Village", desc: "Colonial charm & boutiques" },
    { icon: TreePine, title: "Brandywine Valley", desc: "Scenic luxury setting" },
    { icon: GraduationCap, title: "Schools", desc: "Red Clay + private options" },
    { icon: Leaf, title: "Estates & Parks", desc: "Winterthur, Mt. Cuba" }
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section with Image */}
        <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${centrevileHero})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/80 mb-2">
                Discover
              </p>
              <p className="text-5xl md:text-7xl font-bold tracking-wide font-serif" style={{ fontVariant: 'small-caps' }}>
                Centreville
              </p>
              <p className="text-xl md:text-2xl font-bold tracking-[0.2em] mt-2 text-white/90 font-serif">
                DELAWARE
              </p>
            </div>
          </div>
        </section>

        {/* Quick Stats Bar */}
        <section className="py-8 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold">10 min</div>
                <div className="text-sm opacity-90">to Greenville</div>
              </div>
              <div>
                <div className="text-2xl font-bold">~$1.1M</div>
                <div className="text-sm opacity-90">Median Home Price</div>
              </div>
              <div>
                <div className="text-2xl font-bold">Luxury Market</div>
                <div className="text-sm opacity-90">High-value estates</div>
              </div>
              <div>
                <div className="text-2xl font-bold">Historic</div>
                <div className="text-sm opacity-90">Brandywine Valley</div>
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
                  {spotlightProperty.isRental ? 'Featured Rental' : 'Featured Home'} in Centreville
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Families Love Centreville</h2>
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
              <p className="text-muted-foreground max-w-xl mx-auto">From upscale single-family homes to grand country estates, Centreville offers luxury at every level</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-3 bg-blue-500" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">$750K–$950K</div>
                  <h3 className="font-semibold text-lg mb-2">Entry Luxury</h3>
                  <p className="text-muted-foreground text-sm">Upscale single-family homes and smaller estate properties</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow border-primary">
                <div className="h-3 bg-primary" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">$1M–$1.5M</div>
                  <h3 className="font-semibold text-lg mb-2">Premium Homes</h3>
                  <p className="text-muted-foreground text-sm">Larger lots, renovated historic homes, and significant properties</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-3 bg-amber-500" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">$1.6M+</div>
                  <h3 className="font-semibold text-lg mb-2">Estate Properties</h3>
                  <p className="text-muted-foreground text-sm">Custom estates, historic manors, and Brandywine countryside residences</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Neighborhood Highlights & Resources</h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">Explore some of Centreville's most desirable communities, each offering its own character, amenities, and lifestyle benefits.</p>
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
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {[
                { name: "Wilmington", href: "/areas/wilmington-de" },
                { name: "North Star", href: "/areas/north-star-de" }
                // TODO: Add these when pages are created:
                // { name: "Greenville", href: "/areas/greenville-de" },
                // { name: "Hockessin", href: "/areas/hockessin-de" },
                // { name: "Pike Creek", href: "/areas/pike-creek-de" }
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
                  { dest: "Greenville", time: "10 min" },
                  { dest: "Wilmington", time: "20 min" },
                  { dest: "Newark", time: "30 min" },
                  { dest: "Philadelphia Airport", time: "35 min" }
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
      </main>
      <Footer />
    </>
  );
}
