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

const NEWARK_ZIP = "19711";

export default function NewarkDE() {
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties/zip', NEWARK_ZIP],
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
      name: "Elkton Road Corridor",
      type: "Urban / Walkable",
      description: "The heart of Newark's walkable scene, close to Main Street, restaurants, and the University of Delaware campus. Great for those who want to walk everywhere."
    },
    {
      name: "Brookside",
      type: "Established / Affordable",
      description: "One of Newark's most established neighborhoods with solid single-family homes and strong community ties. Well-priced for buyers seeking value in a great location."
    },
    {
      name: "Chestnut Hill Estates",
      type: "Move-Up / Family",
      description: "Spacious homes on larger lots with quiet streets and strong school access. Popular with families and professionals."
    },
    {
      name: "University Area",
      type: "Investment / Student",
      description: "Attractive for investors and parents of UD students. Strong rental demand and proximity to all university amenities and events."
    },
    {
      name: "Nottingham",
      type: "Suburban / Established",
      description: "Larger single-family homes in a well-maintained neighborhood near Route 896. A commuter favorite with quick access to I-95."
    },
    {
      name: "Welsh Tract",
      type: "Newer Development",
      description: "Features newer construction homes and townhomes near the growing south Newark corridor. Convenient to shopping, dining, and major routes."
    }
  ];

  const highlights = [
    { icon: GraduationCap, title: "University of Delaware", desc: "World-Class Research University" },
    { icon: Home, title: "Diverse Housing", desc: "Starter to Luxury" },
    { icon: ShoppingBag, title: "Main Street", desc: "Restaurants & Retail" },
    { icon: Heart, title: "Vibrant Community", desc: "Arts, Culture & Events" }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <Breadcrumb
        items={[
          { label: "Delaware Communities", href: "/areas" },
          { label: "Newark, Delaware", current: true }
        ]}
      />
      <main className="flex-1">
        <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-primary">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 container mx-auto px-4 lg:px-6 text-center text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-white/80 mb-2">Discover</p>
            <p className="text-5xl md:text-7xl font-bold tracking-wide font-serif" style={{ fontVariant: 'small-caps' }}>Newark</p>
            <p className="text-xl md:text-2xl font-bold tracking-[0.2em] mt-2 text-white/90 font-serif">DELAWARE</p>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Newark, DE Real Estate: Homes for Sale & Community Guide</h1>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>Newark, Delaware is one of the state's most dynamic and desirable communities, anchored by the University of Delaware and a thriving Main Street scene. With a population of around 33,000, Newark offers a rare blend of college-town energy, suburban comfort, walkable neighborhoods, and outstanding access to I-95 and the Northeast Corridor. It's home to a wide variety of housing options — from starter townhomes and established family neighborhoods to larger executive homes on private lots.</p>
                <p>Kevin Hensley helps buyers navigate Newark's diverse real estate market, from the walkable neighborhoods near UD's campus to the spacious homes in Chestnut Hill Estates, Nottingham, and beyond. Newark's Christina School District and Red Clay Consolidated options, combined with the city's cultural vitality and strong rental market, make it an excellent choice for families, professionals, and investors alike.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div><div className="text-3xl md:text-4xl font-bold">~33K</div><div className="text-sm opacity-80">Residents</div></div>
              <div><div className="text-3xl md:text-4xl font-bold">Univ. of DE</div><div className="text-sm opacity-80">Major Employer</div></div>
              <div><div className="text-3xl md:text-4xl font-bold">~$400K</div><div className="text-sm opacity-80">Median Home Price</div></div>
              <div><div className="text-3xl md:text-4xl font-bold">20 min</div><div className="text-sm opacity-80">to Wilmington</div></div>
            </div>
          </div>
        </section>

        {spotlightProperty && (
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{spotlightProperty.isRental ? 'Featured Rental' : 'Featured Home'} in Newark</h2>
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why People Love Newark</h2>
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
              <p className="text-muted-foreground max-w-xl mx-auto">Newark's diverse housing stock offers options across all budgets</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-3 bg-blue-500" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">$250K–$360K</div>
                  <h3 className="font-semibold text-lg mb-2">Starter Homes</h3>
                  <p className="text-muted-foreground text-sm">Townhomes and smaller detached homes, strong rental potential near UD</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow border-primary">
                <div className="h-3 bg-primary" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">$370K–$520K</div>
                  <h3 className="font-semibold text-lg mb-2">Move-Up Homes</h3>
                  <p className="text-muted-foreground text-sm">Established neighborhoods, updated homes, family-sized floor plans</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-3 bg-amber-500" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">$530K+</div>
                  <h3 className="font-semibold text-lg mb-2">Executive Homes</h3>
                  <p className="text-muted-foreground text-sm">Spacious homes on larger lots, custom builds, premium finishes</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Neighborhood Highlights</h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">From walkable urban streets to quiet suburban cul-de-sacs, Newark has a neighborhood for every lifestyle.</p>
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
                  <h2 className="text-3xl font-bold">Commute Times from Newark</h2>
                  <p className="text-muted-foreground">Strategic location between Philadelphia and Baltimore</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { dest: "Wilmington", time: "20 min" },
                  { dest: "Philadelphia", time: "40 min" },
                  { dest: "Baltimore", time: "60 min" },
                  { dest: "Dover", time: "55 min" }
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
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">Helpful links for buyers and new residents in Newark</p>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center"><GraduationCap className="h-5 w-5 text-primary" /></div>
                      <h3 className="font-bold text-lg">Education</h3>
                    </div>
                    <ul className="space-y-3">
                      <li><a href="https://www.udel.edu" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors"><ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" /><span><strong>University of Delaware</strong> — Campus, events & community</span></a></li>
                      <li><a href="https://www.christinak12.org" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors"><ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" /><span><strong>Christina School District</strong> — K-12 district info</span></a></li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center"><Landmark className="h-5 w-5 text-primary" /></div>
                      <h3 className="font-bold text-lg">City Government</h3>
                    </div>
                    <ul className="space-y-3">
                      <li><a href="https://www.newarkde.gov" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors"><ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" /><span><strong>City of Newark</strong> — Official city services</span></a></li>
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
                      <li><a href="https://www.newarkde.gov/18/Electrical-Engineering" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors"><ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" /><span><strong>Newark Electric</strong> — City-owned electric utility</span></a></li>
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
                      <li><a href="https://www.newarkde.gov/58/Parks-and-Recreation" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors"><ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" /><span><strong>Newark Parks & Rec</strong> — Local parks, trails & programs</span></a></li>
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
                { name: "Glasgow", href: "/areas/glasgow-de" },
                { name: "Bear", href: "/areas/bear-de" },
                { name: "Hockessin", href: "/areas/hockessin-de" },
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

        <LocalNews locationTag="newark-de" locationName="Newark, DE" />

        <section className="py-8 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6">
            <p className="text-xs text-muted-foreground text-center max-w-3xl mx-auto">Sources: Median home price estimate based on recent New Castle County market data. School district information from Christina School District and Red Clay Consolidated School District. Population from U.S. Census Bureau. Commute times are estimates and may vary.</p>
          </div>
        </section>
        <AreaLastUpdated date="2026-04-28" />

      </main>
      <Footer />
    </div>
  );
}
