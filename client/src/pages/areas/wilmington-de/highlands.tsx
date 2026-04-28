import { Link } from "wouter";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, GraduationCap, Building, TreePine, ShoppingBag, Car, Bed, Bath, Ruler, ExternalLink, Landmark, Zap, Droplets, Leaf } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import LocalNews from "@/components/local-news";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/breadcrumb";
import highlandsHero from "@assets/generated_images/highlands_luxury_historic_homes_and_parks.png";
import type { Property } from "@shared/schema";

const HIGHLANDS_ZIP = "19806";

export default function HighlandsDe() {
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties/zip', HIGHLANDS_ZIP],
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

  const neighborhoods = [
    { 
      name: "Rockford Park District", 
      type: "Scenic / Premium",
      description: "Adjacent to one of Wilmington's most iconic parks, these homes offer immediate access to trails, open space, and the landmark Rockford Tower.",
      link: undefined as string | undefined,
      linkText: undefined as string | undefined
    },
    { 
      name: "Kentmere Parkway Corridor",
      type: "Historic / Architectural",
      description: "Known for some of Wilmington's most stunning historic homes, with wide streets, mature trees, and a park-like setting.",
      link: undefined as string | undefined,
      linkText: undefined as string | undefined
    },
    { 
      name: "Baynard Boulevard Area (Highlands Edge)",
      type: "Established / Walkable",
      description: "Offers character-rich homes with convenient access to Brandywine Park and the surrounding cultural attractions.",
      link: undefined as string | undefined,
      linkText: undefined as string | undefined
    },
    { 
      name: "Gilpin Avenue + Parkside Block",
      type: "Luxury / Historic",
      description: "Highly desirable homes near Rockford Park featuring elegant facades, deep lots, and premium walkability.",
      link: undefined as string | undefined,
      linkText: undefined as string | undefined
    },
    { 
      name: "Highlands Cultural District",
      type: "Walkable / Amenity-Rich",
      description: "Within walking distance of the Delaware Art Museum, outdoor events, and scenic trail networks—ideal for residents who enjoy culture and nature.",
      link: "https://www.delart.org",
      linkText: "Delaware Art Museum"
    },
    { 
      name: "North Union / Highlands Fringe",
      type: "Upscale / Adjacent",
      description: "Homes along the edges of the Highlands offer premium location benefits with slightly more approachable pricing.",
      link: undefined as string | undefined,
      linkText: undefined as string | undefined
    }
  ];

  const highlights = [
    { icon: Landmark, title: "Historic Luxury", desc: "Stone & architecture" },
    { icon: TreePine, title: "Parks Access", desc: "Rockford & trails" },
    { icon: GraduationCap, title: "Premium Schools", desc: "Top private options" },
    { icon: Leaf, title: "Cultural District", desc: "Arts & museums" }
  ];

  return (
    <>
      <Header />
      <Breadcrumb 
        items={[
          { label: "Delaware Communities", href: "/areas" },
          { label: "Wilmington, Delaware", href: "/areas/wilmington-de" },
          { label: "Highlands, Wilmington", current: true }
        ]}
      />
      <main>
        {/* Hero Section with Image */}
        <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${highlandsHero})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/80 mb-2">
                Discover
              </p>
              <p className="text-5xl md:text-7xl font-bold tracking-wide font-serif" style={{ fontVariant: 'small-caps' }}>
                Highlands
              </p>
              <p className="text-xl md:text-2xl font-bold tracking-[0.2em] mt-2 text-white/90 font-serif">
                WILMINGTON, DELAWARE
              </p>
            </div>
          </div>
        </section>

        {/* Quick Stats Bar */}
        <section className="py-8 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold">6 min</div>
                <div className="text-sm opacity-90">to Downtown Wilmington</div>
              </div>
              <div>
                <div className="text-2xl font-bold">~$750K</div>
                <div className="text-sm opacity-90">Median Home Price</div>
              </div>
              <div>
                <div className="text-2xl font-bold">Premium Schools</div>
                <div className="text-sm opacity-90">Red Clay + private</div>
              </div>
              <div>
                <div className="text-2xl font-bold">Historic Luxury</div>
                <div className="text-sm opacity-90">High-end market</div>
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
                  {spotlightProperty.isRental ? 'Featured Rental' : 'Featured Home'} in Highlands
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Families Love the Highlands</h2>
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
              <p className="text-muted-foreground max-w-xl mx-auto">From upscale homes to premium estates, the Highlands offers luxury at every level</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-3 bg-blue-500" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">$600K–$850K</div>
                  <h3 className="font-semibold text-lg mb-2">Upscale Homes</h3>
                  <p className="text-muted-foreground text-sm">Beautiful historic homes with landscaped lots and classic architectural details</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow border-primary">
                <div className="h-3 bg-primary" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">$900K–$1.3M</div>
                  <h3 className="font-semibold text-lg mb-2">Luxury Market</h3>
                  <p className="text-muted-foreground text-sm">Larger estate homes, high-end renovations, and premium streets near parks</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-3 bg-amber-500" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">$1.4M+</div>
                  <h3 className="font-semibold text-lg mb-2">Premium Estates</h3>
                  <p className="text-muted-foreground text-sm">Historic masterpieces, custom restorations, and exceptional multi-level residences</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Neighborhood Highlights & Resources</h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">Explore some of the Highlands' most desirable communities, each offering its own character, amenities, and lifestyle benefits.</p>
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
                  { dest: "Downtown Wilmington", time: "6 min" },
                  { dest: "Greenville, DE", time: "6 min" },
                  { dest: "Newark, DE", time: "22 min" },
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
        <LocalNews locationTag="highlands-de" locationName="Highlands, DE" />

      </main>
      <Footer />
    </>
  );
}
