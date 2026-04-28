import { Link } from "wouter";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/breadcrumb";
import { MapPin, GraduationCap, TreePine, ShoppingBag, Car, Bed, Bath, Ruler, ExternalLink, Building, Star } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import LocalNews from "@/components/local-news";
import CensusStatsBar from "@/components/census-stats-bar";
import JsonLd from "@/components/JsonLd";
import middletownHero from "@assets/Middletown_DE_1757012981537.jpg";
import type { Property } from "@shared/schema";

const ZIP = "19709";

export default function BayberryMiddletown() {
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties/zip", ZIP],
  });

  const spotlightProperty = useMemo(() => {
    if (properties.length === 0) return null;
    const sales = properties.filter((p) => !p.isRental);
    const rentals = properties.filter((p) => p.isRental);
    if (sales.length > 0) return sales.reduce((h, c) => (Number(c.listPrice) > Number(h.listPrice) ? c : h));
    if (rentals.length > 0) return rentals.reduce((h, c) => (Number(c.listPrice) > Number(h.listPrice) ? c : h));
    return null;
  }, [properties]);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Place",
      "@id": "https://hensleyshomes.com/areas/middletown-de/bayberry/#place",
      name: "Bayberry, Middletown, Delaware",
      description: "Award-winning master-planned community in Middletown, DE. Features multiple neighborhoods, walking trails, lakes, parks, and the 55+ Ponds at Bayberry.",
      address: { "@type": "PostalAddress", addressLocality: "Middletown", addressRegion: "DE", postalCode: "19709", addressCountry: "US" },
      containsPlace: { "@type": "Place", "@id": "https://hensleyshomes.com/areas/middletown-de/#place" },
      url: "https://hensleyshomes.com/areas/middletown-de/bayberry",
      author: { "@type": "RealEstateAgent", "@id": "https://hensleyshomes.com/#kevin-hensley" },
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "@id": "https://hensleyshomes.com/areas/middletown-de/bayberry/#dataset",
      name: "Demographic and Housing Profile for Bayberry, Middletown, Delaware",
      creator: { "@type": "Organization", name: "US Census Bureau", url: "https://www.census.gov" },
      variableMeasured: ["Median Household Income", "Homeownership Rate", "Median Year Structure Built"],
      citation: "ACS 5-Year Estimates Tables B25003, B19013, B25035",
      subjectOf: { "@type": "RealEstateAgent", "@id": "https://hensleyshomes.com/#kevin-hensley", knowsAbout: { "@type": "Place", "@id": "https://hensleyshomes.com/areas/middletown-de/bayberry/#place" } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://hensleyshomes.com" },
        { "@type": "ListItem", position: 2, name: "Delaware Communities", item: "https://hensleyshomes.com/areas" },
        { "@type": "ListItem", position: 3, name: "Middletown, Delaware", item: "https://hensleyshomes.com/areas/middletown-de" },
        { "@type": "ListItem", position: 4, name: "Bayberry", item: "https://hensleyshomes.com/areas/middletown-de/bayberry" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "@id": "https://hensleyshomes.com/#kevin-hensley",
      name: "Kevin Hensley",
      image: "https://hensleyshomes.com/assets/IMG_0525-CDZL6hPI.jpeg",
      url: "https://hensleyshomes.com",
      telephone: "+13022180130",
      description: "Delaware and Maryland licensed real estate agent specializing in residential sales, new construction, and neighborhood guides for Middletown, DE and surrounding communities.",
      areaServed: { "@type": "Place", "@id": "https://hensleyshomes.com/areas/middletown-de/bayberry/#place" },
      knowsAbout: { "@type": "Place", "@id": "https://hensleyshomes.com/areas/middletown-de/bayberry/#place" },
    },
  ];

  const highlights = [
    { icon: TreePine, title: "Lakes & Trails", desc: "Miles of walking paths" },
    { icon: GraduationCap, title: "Top Schools", desc: "Appoquinimink District" },
    { icon: ShoppingBag, title: "Town Center", desc: "Bayberry retail coming" },
    { icon: MapPin, title: "Master-Planned", desc: "Award-winning design" },
  ];

  return (
    <>
      <JsonLd schemas={schemas} />
      <Header />
      <Breadcrumb
        items={[
          { label: "Delaware Communities", href: "/areas" },
          { label: "Middletown, Delaware", href: "/areas/middletown-de" },
          { label: "Bayberry", current: true },
        ]}
      />
      <main>
        {/* Hero */}
        <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${middletownHero})` }}>
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-white/80 mb-2">Middletown, Delaware</p>
            <p className="text-5xl md:text-7xl font-bold tracking-wide font-serif" style={{ fontVariant: "small-caps" }}>
              Bayberry
            </p>
            <p className="text-xl md:text-2xl font-bold tracking-[0.2em] mt-2 text-white/90 font-serif">
              Middletown's Award-Winning Master-Planned Community
            </p>
            <span className="mt-4 inline-block bg-white/20 border border-white/40 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
              📷 Hero photo coming soon
            </span>
          </div>
        </section>

        {/* Intro */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Bayberry, Middletown DE — Homes for Sale & Neighborhood Guide
            </h1>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Bayberry is Middletown's premier master-planned community, recognized for its beautiful streetscapes, walking trails, lakes, and parks. Encompassing multiple sub-neighborhoods, Bayberry offers a diverse range of home styles — from established sections to new construction — making it a top choice for buyers at every stage of life.
              </p>
              <p>
                The upcoming Bayberry Town Center will bring retail, dining, and services right into the heart of the community, reinforcing Bayberry's vision as a truly self-contained, walkable neighborhood in one of Delaware's fastest-growing markets.
              </p>
            </div>
          </div>
        </section>

        {/* Census Stats Bar */}
        <CensusStatsBar neighborhoodSlug="bayberry" />

        {/* Highlights */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Families Choose Bayberry</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((item, i) => (
                <Card key={i} className="text-center hover:shadow-lg transition-shadow">
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

        {/* Schools */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-primary" /> School Feeder Pattern
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { level: "Elementary", name: "Bunker Hill Elementary", grades: "K–5" },
                { level: "Middle", name: "Meredith Middle School", grades: "6–8" },
                { level: "High", name: "Middletown High School", grades: "9–12" },
              ].map((s) => (
                <Card key={s.level}>
                  <CardContent className="p-6 text-center">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{s.level}</div>
                    <div className="font-bold text-foreground mb-1">{s.name}</div>
                    <div className="text-sm text-muted-foreground">Grades {s.grades}</div>
                    <div className="text-xs text-muted-foreground mt-1">Appoquinimink School District</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Spotlight Listing */}
        {spotlightProperty && (
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Home in Middletown</h2>
              </div>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow max-w-4xl mx-auto">
                <div className="md:flex">
                  {spotlightProperty.imageUrl && (
                    <div className="md:w-1/2 aspect-video md:aspect-auto relative overflow-hidden">
                      <img src={spotlightProperty.imageUrl} alt={spotlightProperty.unparsedAddress || "Property"} className="w-full h-full object-cover" loading="lazy" />
                      <span className={`absolute top-3 left-3 ${spotlightProperty.isRental ? "bg-blue-600" : "bg-primary"} text-white text-sm font-semibold px-3 py-1.5 rounded`}>
                        {spotlightProperty.isRental ? "FOR RENT" : "FOR SALE"}
                      </span>
                    </div>
                  )}
                  <CardContent className="md:w-1/2 p-6 flex flex-col justify-between">
                    <div>
                      <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                        ${Math.round(Number(spotlightProperty.listPrice)).toLocaleString()}
                        {spotlightProperty.isRental && <span className="text-lg font-normal">/mo</span>}
                      </div>
                      <p className="text-lg text-foreground mb-4">{spotlightProperty.unparsedAddress}</p>
                      <p className="text-sm text-muted-foreground mb-4">{spotlightProperty.city}, {spotlightProperty.stateOrProvince} {spotlightProperty.postalCode}</p>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {spotlightProperty.bedroomsTotal && <div className="flex items-center gap-2"><Bed className="h-5 w-5 text-primary" /><span className="font-medium">{spotlightProperty.bedroomsTotal}</span><span className="text-muted-foreground">Bedrooms</span></div>}
                        {(spotlightProperty.bathroomsFull || spotlightProperty.bathroomsHalf) && <div className="flex items-center gap-2"><Bath className="h-5 w-5 text-primary" /><span className="font-medium">{spotlightProperty.bathroomsFull || 0}{spotlightProperty.bathroomsHalf ? `.${spotlightProperty.bathroomsHalf}` : ""}</span><span className="text-muted-foreground">Bathrooms</span></div>}
                        {spotlightProperty.livingArea && <div className="flex items-center gap-2"><Ruler className="h-5 w-5 text-primary" /><span className="font-medium">{spotlightProperty.livingArea.toLocaleString()}</span><span className="text-muted-foreground">Sq Ft</span></div>}
                        {spotlightProperty.yearBuilt && <div className="flex items-center gap-2"><Building className="h-5 w-5 text-primary" /><span className="font-medium">{spotlightProperty.yearBuilt}</span><span className="text-muted-foreground">Built</span></div>}
                      </div>
                    </div>
                    {spotlightProperty.listingUrl && (
                      <a href={spotlightProperty.listingUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="lg" className="w-full">View Full Listing on RE/MAX</Button>
                      </a>
                    )}
                  </CardContent>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* The Ponds at Bayberry — 55+ Sub-Section */}
        <section className="py-16 bg-amber-50 dark:bg-amber-950/20 border-y border-amber-200 dark:border-amber-800">
          <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-14 w-14 bg-amber-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="h-7 w-7 text-amber-600" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-amber-600 font-semibold mb-1">55+ Active Adult Community</div>
                <h2 className="text-3xl font-bold text-foreground">The Ponds at Bayberry</h2>
                <p className="text-muted-foreground mt-1">Bayberry's premier low-maintenance 55+ enclave</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The Ponds at Bayberry is the 55+ active adult section within the larger Bayberry community. Offering beautifully designed homes with low-maintenance living, neighborhood gathering spaces, and direct access to Bayberry's walking trails and parks, this is a top choice for active adults seeking comfort, community, and convenience.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Residents enjoy the peaceful pond-side setting while remaining close to shopping, medical facilities, and Middletown's growing amenity base — all within the award-winning Bayberry master plan.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  "Age-restricted 55+ community",
                  "Low-maintenance home designs",
                  "Walking trails & open green spaces",
                  "Access to all Bayberry amenities",
                  "Close to medical & retail services",
                  "Strong sense of community & social activities",
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-sm text-foreground">
                    <div className="h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
                    {feat}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Commute Times */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-14 w-14 bg-primary rounded-full flex items-center justify-center"><Car className="h-7 w-7 text-primary-foreground" /></div>
              <div><h2 className="text-3xl font-bold">Easy Commutes from Bayberry</h2><p className="text-muted-foreground">Route 1 access to major destinations</p></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[{ dest: "Wilmington", time: "25 min" }, { dest: "Newark, DE", time: "20 min" }, { dest: "Philadelphia", time: "55 min" }, { dest: "Dover", time: "35 min" }].map((r) => (
                <Card key={r.dest}><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-primary">{r.time}</div><div className="text-sm text-muted-foreground">{r.dest}</div></CardContent></Card>
              ))}
            </div>
          </div>
        </section>

        {/* HOA / Resources */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
            <h2 className="text-3xl font-bold mb-8">HOA &amp; Community Resources</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3">Bayberry Community HOA</h3>
                  <p className="text-sm text-muted-foreground mb-4">Manages the master-planned community's shared amenities, trails, parks, and upcoming Town Center development.</p>
                  <a href="https://www.vbsmc.net" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    <ExternalLink className="h-4 w-4" /> Bayberry Community HOA
                  </a>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3">Town of Middletown</h3>
                  <p className="text-sm text-muted-foreground mb-4">Official resources for permits, utilities, and local governance.</p>
                  <a href="https://www.middletown.delaware.gov" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    <ExternalLink className="h-4 w-4" /> Town of Middletown Official Site
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <LocalNews locationTag="middletown-de" locationName="Middletown, DE" />

        <section className="py-10 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6 text-center">
            <Link href="/areas/middletown-de">
              <Button variant="outline" size="lg">← Back to Middletown Overview</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
