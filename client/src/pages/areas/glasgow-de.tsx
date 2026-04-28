import { Link } from "wouter";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/breadcrumb";
import { MapPin, GraduationCap, Home, TreePine, Heart, Car, Bed, Bath, Ruler, ExternalLink, Landmark, Zap, Leaf, Building, ShoppingBag } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import LocalNews from "@/components/local-news";
import AreaLastUpdated from "@/components/area-last-updated";
import type { Property } from "@shared/schema";

const GLASGOW_ZIP = "19702";

export default function GlasgowDE() {
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties/zip', GLASGOW_ZIP],
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
      name: "Glasgow Pines",
      type: "Established / Family-Friendly",
      description: "A well-established neighborhood featuring single-family homes, mature trees, and quiet streets. Convenient to shopping on Route 40 and easy access to I-95."
    },
    {
      name: "Beckett's Run",
      type: "Move-Up / Suburban",
      description: "Offers larger homes with generous lot sizes and a suburban feel. Popular with growing families and commuters heading toward Wilmington."
    },
    {
      name: "Brennan Estates",
      type: "Newer Construction",
      description: "Features newer homes with modern finishes, open floor plans, and community amenities. Close to area schools and local retail."
    },
    {
      name: "Eagle Run",
      type: "Starter / Townhome",
      description: "A mix of townhomes and single-family detached homes, offering affordable entry points into New Castle County homeownership."
    }
  ];

  const highlights = [
    { icon: GraduationCap, title: "Christina Schools", desc: "Well-Regarded District" },
    { icon: ShoppingBag, title: "Route 40 Corridor", desc: "Retail & Dining Hub" },
    { icon: Car, title: "I-95 Access", desc: "Easy Commuting" },
    { icon: Heart, title: "Family-Friendly", desc: "Established Community" }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <Breadcrumb
        items={[
          { label: "Delaware Communities", href: "/areas" },
          { label: "Glasgow, Delaware", current: true }
        ]}
      />
      <main className="flex-1">
        <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center bg-gradient-to-br from-slate-700 via-slate-600 to-primary">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 container mx-auto px-4 lg:px-6 text-center text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-white/80 mb-2">Discover</p>
            <p className="text-5xl md:text-7xl font-bold tracking-wide font-serif" style={{ fontVariant: 'small-caps' }}>Glasgow</p>
            <p className="text-xl md:text-2xl font-bold tracking-[0.2em] mt-2 text-white/90 font-serif">DELAWARE</p>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Glasgow, DE Real Estate: Homes for Sale & Community Guide</h1>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>Glasgow, Delaware is a popular unincorporated community in New Castle County offering suburban convenience just minutes from Newark and Bear. Known for easy access to I-95 and the bustling Route 40 retail corridor, Glasgow is a hub for families and professionals who want suburban living without sacrificing proximity to major employers, shopping, and dining.</p>
                <p>Kevin Hensley has helped many buyers find homes in Glasgow's well-established neighborhoods like Glasgow Pines, Beckett's Run, and Brennan Estates. Whether you're a first-time buyer, upsizing for a growing family, or seeking a low-maintenance townhome, Glasgow offers a wide spectrum of housing styles and price points throughout the 19702 zip code.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div><div className="text-3xl md:text-4xl font-bold">15 min</div><div className="text-sm opacity-80">to Wilmington</div></div>
              <div><div className="text-3xl md:text-4xl font-bold">Christina</div><div className="text-sm opacity-80">School District</div></div>
              <div><div className="text-3xl md:text-4xl font-bold">~$370K</div><div className="text-sm opacity-80">Median Home Price</div></div>
              <div><div className="text-3xl md:text-4xl font-bold">I-95</div><div className="text-sm opacity-80">Direct Access</div></div>
            </div>
          </div>
        </section>

        {spotlightProperty && (
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{spotlightProperty.isRental ? 'Featured Rental' : 'Featured Home'} in Glasgow</h2>
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
                      </div>
                    </div>
                    {spotlightProperty.listingUrl && <a href={spotlightProperty.listingUrl} target="_blank" rel="noopener noreferrer"><Button size="lg" className="w-full">View Full Listing on RE/MAX</Button></a>}
                  </CardContent>
                </div>
              </Card>
            </div>
          </section>
        )}

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Buyers Choose Glasgow</h2>
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
              <p className="text-muted-foreground max-w-xl mx-auto">From townhomes to spacious single-family homes, Glasgow fits many budgets</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-3 bg-blue-500" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">$270K–$340K</div>
                  <h3 className="font-semibold text-lg mb-2">Starter Homes</h3>
                  <p className="text-muted-foreground text-sm">Townhomes and smaller detached homes ideal for first-time buyers</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow border-primary">
                <div className="h-3 bg-primary" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">$350K–$470K</div>
                  <h3 className="font-semibold text-lg mb-2">Move-Up Homes</h3>
                  <p className="text-muted-foreground text-sm">Larger single-family homes in established neighborhoods</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-3 bg-amber-500" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">$480K+</div>
                  <h3 className="font-semibold text-lg mb-2">Premium Homes</h3>
                  <p className="text-muted-foreground text-sm">Spacious homes with premium finishes and larger lots</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Neighborhood Highlights</h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">Glasgow's neighborhoods each offer distinct character and appeal for buyers at different life stages.</p>
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
                      <p className="text-muted-foreground text-sm flex-1">{hood.description}</p>
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
                  <h2 className="text-3xl font-bold">Easy Commutes from Glasgow</h2>
                  <p className="text-muted-foreground">Direct I-95 access makes reaching major destinations fast</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { dest: "Wilmington", time: "15 min" },
                  { dest: "Newark / UD", time: "10 min" },
                  { dest: "Philadelphia", time: "40 min" },
                  { dest: "Dover", time: "60 min" }
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
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">Helpful links for buyers and new residents in the Glasgow area</p>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center"><GraduationCap className="h-5 w-5 text-primary" /></div>
                      <h3 className="font-bold text-lg">Schools</h3>
                    </div>
                    <ul className="space-y-3">
                      <li><a href="https://www.christinak12.org" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors"><ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" /><span><strong>Christina School District</strong> — District information & schools</span></a></li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center"><Landmark className="h-5 w-5 text-primary" /></div>
                      <h3 className="font-bold text-lg">Government Services</h3>
                    </div>
                    <ul className="space-y-3">
                      <li><a href="https://www.newcastlede.gov" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors"><ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" /><span><strong>New Castle County</strong> — County services & permits</span></a></li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-amber-500/10 rounded-lg flex items-center justify-center"><Zap className="h-5 w-5 text-amber-600" /></div>
                      <h3 className="font-bold text-lg">Utilities</h3>
                    </div>
                    <ul className="space-y-3">
                      <li><a href="https://www.delmarva.com" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors"><ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" /><span><strong>Delmarva Power</strong> — Electric service</span></a></li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center"><Leaf className="h-5 w-5 text-blue-600" /></div>
                      <h3 className="font-bold text-lg">Parks & Recreation</h3>
                    </div>
                    <ul className="space-y-3">
                      <li><a href="https://www.newcastlede.gov/417/Parks" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors"><ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" /><span><strong>New Castle County Parks</strong> — Local parks & trails</span></a></li>
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
                { name: "Newark", href: "/areas/newark-de" },
                { name: "Bear", href: "/areas/bear-de" },
                { name: "New Castle", href: "/areas/new-castle-de" },
                { name: "Wilmington", href: "/areas/wilmington-de" }
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

        <LocalNews locationTag="glasgow-de" locationName="Glasgow, DE" />

        <section className="py-8 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6">
            <p className="text-xs text-muted-foreground text-center max-w-3xl mx-auto">Sources: Median home price estimate based on recent New Castle County market data. School district information from Christina School District. Commute times are estimates and may vary based on traffic conditions.</p>
          </div>
        </section>
        <AreaLastUpdated date="2026-04-28" />

      </main>
      <Footer />
    </div>
  );
}
