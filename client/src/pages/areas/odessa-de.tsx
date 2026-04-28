import { Link } from "wouter";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/breadcrumb";
import { MapPin, GraduationCap, Home, TreePine, Heart, Car, Bed, Bath, Ruler, ExternalLink, Landmark, Zap, Droplets, Leaf, Building, Landmark as HistoryIcon } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import LocalNews from "@/components/local-news";
import odessaHero from "@assets/generated_images/odessa_de_historic_town_aerial.png";
import type { Property } from "@shared/schema";
import AreaLastUpdated from "@/components/area-last-updated";

const ODESSA_ZIP = "19730";

export default function OdessaDE() {
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties/zip', ODESSA_ZIP],
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
      name: "Historic Odessa", 
      type: "Historic District",
      description: "A beautifully preserved area featuring centuries-old homes, museums, gardens, and brick-lined streets. Ideal for buyers seeking charm, character, and a walkable village feel.",
      link: "https://www.historicodessa.org",
      linkText: "Historic Odessa Foundation"
    },
    { 
      name: "Odessa National", 
      type: "Golf Course Community",
      description: "Although just outside Odessa proper, this popular community offers golf access, modern homes, and easy commuting routes. A top choice for buyers wanting newer homes with amenities.",
      link: "https://www.odessanationalgolfclub.com",
      linkText: "Odessa National Golf Club"
    },
    { 
      name: "Fieldsboro", 
      type: "Rural / Scenic",
      description: "Located near Odessa's outskirts, Fieldsboro provides open land, quiet surroundings, and larger lots. Appeals to buyers who want country living with proximity to major routes."
    },
    { 
      name: "Cantwell Ridge", 
      type: "Established / Family-Friendly",
      description: "A quiet, well-maintained community offering traditional homes, tree-lined streets, and proximity to Appoquinimink schools."
    },
    { 
      name: "Bay View Road Area", 
      type: "Rural / Waterfront Access",
      description: "Known for scenic landscapes, water access points along the Appoquinimink River, and homes with larger lots. A great fit for buyers who value privacy and nature."
    }
  ];

  const highlights = [
    { icon: GraduationCap, title: "Good Schools", desc: "Appoquinimink District" },
    { icon: HistoryIcon, title: "Historic Character", desc: "Preserved District" },
    { icon: TreePine, title: "Rural Charm", desc: "Open Spaces" },
    { icon: Heart, title: "Walkable", desc: "Village Atmosphere" }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <Breadcrumb 
        items={[
          { label: "Delaware Communities", href: "/areas" },
          { label: "Odessa, Delaware", current: true }
        ]}
      />
      <main className="flex-1">
        <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${odessaHero})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 container mx-auto px-4 lg:px-6 text-center text-white">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/80 mb-2">Discover</p>
              <p className="text-5xl md:text-7xl font-bold tracking-wide font-serif" style={{ fontVariant: 'small-caps' }}>Odessa</p>
              <p className="text-xl md:text-2xl font-bold tracking-[0.2em] mt-2 text-white/90 font-serif">DELAWARE</p>
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Odessa, DE Real Estate: Homes for Sale & Community Guide</h1>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>Odessa, Delaware is one of the most charming and historic small towns in the state—known for beautifully preserved 18th- and 19th-century architecture, tree-lined streets, and a peaceful rural setting just minutes from Middletown. With its walkable historic core, scenic open spaces, and quick access to Routes 1 and 13, Odessa appeals to buyers who appreciate heritage, tranquility, and convenience.</p>
                <p>As a Delaware real estate expert, Kevin helps clients navigate Odessa's unique blend of historic homes, countryside properties, and nearby newer developments in the broader Middletown–Odessa–Townsend (MOT) area. Whether you're searching for a classic residence with character or a modern home just outside town limits, Odessa offers a timeless lifestyle with modern accessibility.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div><div className="text-3xl md:text-4xl font-bold">10 min</div><div className="text-sm opacity-80">to Middletown</div></div>
              <div><div className="text-3xl md:text-4xl font-bold">Historic</div><div className="text-sm opacity-80">Preserved District</div></div>
              <div><div className="text-3xl md:text-4xl font-bold">~$475K</div><div className="text-sm opacity-80">Median Price (Jan 2025)</div></div>
              <div><div className="text-3xl md:text-4xl font-bold">Small</div><div className="text-sm opacity-80">Stable Population</div></div>
            </div>
          </div>
        </section>

        {spotlightProperty && (
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{spotlightProperty.isRental ? 'Featured Rental' : 'Featured Home'} in Odessa</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">{spotlightProperty.isRental ? 'Premium rental property available now' : 'Exceptional property currently on the market'}</p>
              </div>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow max-w-4xl mx-auto">
                <div className="md:flex">
                  {spotlightProperty.imageUrl && (
                    <div className="md:w-1/2 aspect-video md:aspect-auto relative overflow-hidden">
                      <img src={spotlightProperty.imageUrl} alt={spotlightProperty.unparsedAddress || 'Property'} className="w-full h-full object-cover" loading="lazy" />
                      <span className={`absolute top-3 left-3 ${spotlightProperty.isRental ? 'bg-blue-600' : 'bg-primary'} text-white text-sm font-semibold px-3 py-1.5 rounded`}>{spotlightProperty.isRental ? 'FOR RENT' : 'FOR SALE'}</span>
                    </div>
                  )}
                  <CardContent className="md:w-1/2 p-6 flex flex-col justify-between">
                    <div>
                      <div className="text-3xl md:text-4xl font-bold text-primary mb-2">${Math.round(Number(spotlightProperty.listPrice)).toLocaleString()}{spotlightProperty.isRental && <span className="text-lg font-normal">/mo</span>}</div>
                      <p className="text-lg text-foreground mb-4">{spotlightProperty.unparsedAddress}</p>
                      <p className="text-sm text-muted-foreground mb-4">{spotlightProperty.city}, {spotlightProperty.stateOrProvince} {spotlightProperty.postalCode}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Families Love Odessa</h2>
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
              <p className="text-muted-foreground max-w-xl mx-auto">From historic estates to rural properties, Odessa offers unique homes at every price point</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-3 bg-blue-500" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">$350K–$425K</div>
                  <h3 className="font-semibold text-lg mb-2">Starter Homes</h3>
                  <p className="text-muted-foreground text-sm">Primarily found just outside the historic zone or in nearby communities</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow border-primary">
                <div className="h-3 bg-primary" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">$450K–$575K</div>
                  <h3 className="font-semibold text-lg mb-2">Move-Up Homes</h3>
                  <p className="text-muted-foreground text-sm">Larger properties, updated homes, and residences with acreage or privacy</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-3 bg-amber-500" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">$600K+</div>
                  <h3 className="font-semibold text-lg mb-2">Luxury Homes</h3>
                  <p className="text-muted-foreground text-sm">Historic estates, renovated period homes, and custom rural properties</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Neighborhood Highlights & Resources</h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">Explore some of Odessa's most desirable communities, each offering its own character, amenities, and lifestyle benefits.</p>
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
                  <p className="text-muted-foreground">Quick access to Route 1 and major destinations</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { dest: "Middletown", time: "10 min" },
                  { dest: "Dover", time: "25 min" },
                  { dest: "Wilmington", time: "35 min" },
                  { dest: "Philadelphia (PHL)", time: "55 min" }
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

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Local Resources</h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">Helpful links for new residents and homebuyers in Odessa</p>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center"><Landmark className="h-5 w-5 text-primary" /></div>
                      <h3 className="font-bold text-lg">Municipal & Historic</h3>
                    </div>
                    <ul className="space-y-3">
                      <li><a href="https://odessa.delaware.gov" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors"><ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" /><span><strong>Town of Odessa</strong> — Government & community info</span></a></li>
                      <li><a href="https://www.historicodessa.org" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors"><ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" /><span><strong>Historic Odessa Foundation</strong> — Museums & events</span></a></li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-amber-500/10 rounded-lg flex items-center justify-center"><Zap className="h-5 w-5 text-amber-600" /></div>
                      <h3 className="font-bold text-lg">Utilities & Services</h3>
                    </div>
                    <ul className="space-y-3">
                      <li><a href="https://www.delmarva.com" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors"><ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" /><span><strong>Delmarva Power</strong> — Electric provider</span></a></li>
                      <li><a href="https://www.nccde.org" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors"><ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" /><span><strong>County Utilities</strong> — Sewer & wastewater</span></a></li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-green-500/10 rounded-lg flex items-center justify-center"><Leaf className="h-5 w-5 text-green-600" /></div>
                      <h3 className="font-bold text-lg">Community Info</h3>
                    </div>
                    <ul className="space-y-3">
                      <li><a href="https://nccde.org" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors"><ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" /><span><strong>Odessa Library</strong> — Community programs</span></a></li>
                      <li><a href="https://odessa.delaware.gov" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors"><ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" /><span><strong>Odessa Memorial Park</strong> — Recreation & open space</span></a></li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Explore Nearby Areas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { name: "Middletown", href: "/areas/middletown-de" },
                { name: "Townsend", href: "/areas/townsend-de" },
                { name: "Smyrna", href: "/areas/smyrna-de" },
                { name: "St. Georges", href: "/areas/st-georges-de" }
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

        <LocalNews locationTag="odessa-de" locationName="Odessa, DE" />

        <section className="py-8 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6">
            <p className="text-xs text-muted-foreground text-center max-w-3xl mx-auto">Sources: Median home price from RocketHomes (January 2025). School district information from Appoquinimink School District. Population data from U.S. Census Bureau. Commute times are estimates and may vary.</p>
          </div>
        </section>
        <AreaLastUpdated date="2026-04-28" />

      </main>
      <Footer />
    </div>
  );
}
