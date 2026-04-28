import { Link } from "wouter";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/breadcrumb";
import { MapPin, GraduationCap, TreePine, ShoppingBag, Car, Bed, Bath, Ruler, ExternalLink, Building } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import LocalNews from "@/components/local-news";
import CensusStatsBar from "@/components/census-stats-bar";
import JsonLd from "@/components/JsonLd";
import middletownHero from "@assets/Middletown_DE_1757012981537.jpg";
import type { Property } from "@shared/schema";

const ZIP = "19709";

export default function ParksideMiddletown() {
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
      "@id": "https://hensleyshomes.com/areas/middletown-de/parkside/#place",
      name: "Parkside, Middletown, Delaware",
      description: "Community guide for Parkside, Middletown DE — a luxury master-planned neighborhood with resort-style amenities, tree-lined streets, and top-rated Appoquinimink schools.",
      address: { "@type": "PostalAddress", addressLocality: "Middletown", addressRegion: "DE", postalCode: "19709", addressCountry: "US" },
      containsPlace: { "@type": "Place", "@id": "https://hensleyshomes.com/areas/middletown-de/#place" },
      url: "https://hensleyshomes.com/areas/middletown-de/parkside",
      author: { "@type": "RealEstateAgent", "@id": "https://hensleyshomes.com/#kevin-hensley" },
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "@id": "https://hensleyshomes.com/areas/middletown-de/parkside/#dataset",
      name: "Demographic and Housing Profile for Parkside, Middletown, Delaware",
      description: "US Census Bureau ACS 5-year estimates covering median household income, homeownership rates, and housing age data for Parkside, Middletown, Delaware.",
      license: "https://creativecommons.org/publicdomain/zero/1.0/",
      creator: { "@type": "Organization", name: "US Census Bureau", url: "https://www.census.gov" },
      variableMeasured: ["Median Household Income", "Homeownership Rate", "Median Year Structure Built"],
      citation: "ACS 5-Year Estimates Tables B25003, B19013, B25035",
      subjectOf: { "@type": "RealEstateAgent", "@id": "https://hensleyshomes.com/#kevin-hensley", knowsAbout: { "@type": "Place", "@id": "https://hensleyshomes.com/areas/middletown-de/parkside/#place" } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://hensleyshomes.com" },
        { "@type": "ListItem", position: 2, name: "Delaware Communities", item: "https://hensleyshomes.com/areas" },
        { "@type": "ListItem", position: 3, name: "Middletown, Delaware", item: "https://hensleyshomes.com/areas/middletown-de" },
        { "@type": "ListItem", position: 4, name: "Parkside", item: "https://hensleyshomes.com/areas/middletown-de/parkside" },
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
      areaServed: { "@type": "Place", "@id": "https://hensleyshomes.com/areas/middletown-de/parkside/#place" },
      knowsAbout: { "@type": "Place", "@id": "https://hensleyshomes.com/areas/middletown-de/parkside/#place" },
    },
  ];

  const highlights = [
    { icon: TreePine, title: "Resort Amenities", desc: "Pool, tennis & trails" },
    { icon: GraduationCap, title: "Top Schools", desc: "Appoquinimink District" },
    { icon: ShoppingBag, title: "Community Events", desc: "Active HOA calendar" },
    { icon: MapPin, title: "Tree-Lined Streets", desc: "Parkside character" },
  ];

  return (
    <>
      <JsonLd schemas={schemas} />
      <Header />
      <Breadcrumb
        items={[
          { label: "Delaware Communities", href: "/areas" },
          { label: "Middletown, Delaware", href: "/areas/middletown-de" },
          { label: "Parkside", current: true },
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
              Parkside
            </p>
            <p className="text-xl md:text-2xl font-bold tracking-[0.2em] mt-2 text-white/90 font-serif">
              Middletown's Premier Master-Planned Community
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
              Parkside, Middletown DE — Homes for Sale & Neighborhood Guide
            </h1>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Parkside is one of Middletown's most sought-after communities, known for its beautifully planned streets, large parks, and resort-style amenities. The neighborhood features a clubhouse, swimming pool, tennis courts, and an extensive network of walking paths — all managed by an active HOA that fosters a strong sense of community with regular events year-round.
              </p>
              <p>
                Families are drawn to Parkside for its award-winning Appoquinimink school feeder pattern, easy Route 1 access, and the warm, welcoming atmosphere that makes it feel like a true neighborhood. Whether you're a first-time buyer or upsizing, Parkside delivers exceptional value in one of Delaware's fastest-growing towns.
              </p>
            </div>
          </div>
        </section>

        {/* Census Stats Bar */}
        <CensusStatsBar neighborhoodSlug="parkside" />

        {/* Highlights */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Families Love Parkside</h2>
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
                { level: "Elementary", name: "Lorewood Grove Elementary", grades: "K–5" },
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {spotlightProperty.isRental ? "Featured Rental" : "Featured Home"} in Middletown
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  {spotlightProperty.isRental ? "Premium rental property available now" : "Exceptional property currently on the market"}
                </p>
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
                      <a href={spotlightProperty.listingUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                        <Button size="lg" className="w-full">View Full Listing on RE/MAX</Button>
                      </a>
                    )}
                  </CardContent>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Commute Times */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-14 w-14 bg-primary rounded-full flex items-center justify-center"><Car className="h-7 w-7 text-primary-foreground" /></div>
              <div><h2 className="text-3xl font-bold">Easy Commutes from Parkside</h2><p className="text-muted-foreground">Direct Route 1 access to major destinations</p></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { dest: "Wilmington", time: "25 min" },
                { dest: "Newark, DE", time: "20 min" },
                { dest: "Philadelphia", time: "55 min" },
                { dest: "Dover", time: "35 min" },
              ].map((r) => (
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
                  <h3 className="font-bold text-lg mb-3">Parkside Community Association</h3>
                  <p className="text-sm text-muted-foreground mb-4">Manages the clubhouse, pool, tennis courts, walking trails, and community events. Active social calendar with seasonal events for all ages.</p>
                  <a href="https://www.middletown.delaware.gov" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    <ExternalLink className="h-4 w-4" /> Parkside HOA / Community Site
                  </a>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3">Middletown Municipal Resources</h3>
                  <p className="text-sm text-muted-foreground mb-4">Town utilities, permits, and local governance information for Parkside residents.</p>
                  <a href="https://www.middletown.delaware.gov" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    <ExternalLink className="h-4 w-4" /> Town of Middletown Official Site
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <LocalNews locationTag="middletown-de" locationName="Middletown, DE" />

        {/* Back to Hub */}
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
