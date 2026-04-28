import { Link } from "wouter";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/breadcrumb";
import { MapPin, GraduationCap, Building, TreePine, ShoppingBag, Car, Bed, Bath, Ruler, ExternalLink, Landmark, Zap, Droplets, Leaf } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import middletownHero from "@assets/Middletown_DE_1757012981537.jpg";
import type { Property } from "@shared/schema";
import AudioPlayer from "@/components/audio-player";
import LocalNews from "@/components/local-news";
import whispperingWoodsAudio from "@assets/1415_Whispering_Woods_1765302937957.mp3";
import AreaLastUpdated from "@/components/area-last-updated";

const MIDDLETOWN_ZIP = "19709";

export default function MiddletownDE() {
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties/zip', MIDDLETOWN_ZIP],
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
      name: "Parkside", 
      type: "Luxury",
      description: "A beautifully planned community known for its tree-lined streets, large parks, and resort-style amenities including a clubhouse, pool, tennis courts, and walking paths. The neighborhood has a strong sense of community with regular events and a warm, welcoming feel.",
      link: "https://www.middletown.delaware.gov",
      linkText: "Parkside HOA / Community Site",
      pageLink: "/areas/middletown-de/parkside"
    },
    { 
      name: "The Estates at St. Anne's", 
      type: "Golf Course",
      description: "An upscale golf course community featuring spacious homes, scenic fairway views, peaceful streets, and easy access to Route 1. Residents enjoy elegant architecture, open landscapes, and a quiet, refined atmosphere perfect for those who appreciate a more private setting.",
      link: "https://stannesgolf.com",
      linkText: "St. Anne's Golf Course & Community Info",
      pageLink: "/areas/middletown-de/st-annes"
    },
    { 
      name: "Bayberry", 
      type: "Master Planned",
      description: "An award-winning master-planned community featuring multiple neighborhoods with beautiful streetscapes, walking trails, lakes, and parks. Bayberry offers a range of home styles from new construction to established sections, with the upcoming Bayberry Town Center bringing retail and dining options. Also home to The Ponds at Bayberry (55+ community).",
      link: "https://www.vbsmc.net",
      linkText: "Bayberry Community HOA",
      pageLink: "/areas/middletown-de/bayberry"
    },
    { 
      name: "The Town of Whitehall", 
      type: "Master Planned",
      description: "A beautifully designed 'new urbanism' community blending homes, shops, parks, community events, and walkability. Whitehall emphasizes front-porch living, architectural charm, and a connected community feel. It's one of Middletown's most visually distinctive developments.",
      link: "https://whitehallde.com",
      linkText: "The Town of Whitehall Official Site",
      pageLink: "/areas/middletown-de/whitehall"
    },
    { 
      name: "Hyetts Corner / Hyetts Crossing", 
      type: "New Construction",
      description: "These newer communities feature modern floor plans, energy-efficient homes, and convenient access to Route 1. With attractive pricing and contemporary layouts, they appeal to buyers looking for newer construction within the Middletown school district.",
      link: "https://www.lennar.com/new-homes/delaware",
      linkText: "Hyetts Crossing Community Info",
      pageLink: "/areas/middletown-de/hyetts-corner"
    }
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
      <Breadcrumb 
        items={[
          { label: "Delaware Communities", href: "/areas" },
          { label: "Middletown, Delaware", current: true }
        ]}
      />
      
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
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/80 mb-2">
                Discover
              </p>
              <p className="text-5xl md:text-7xl font-bold tracking-wide font-serif" style={{ fontVariant: 'small-caps' }}>
                Middletown
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

        {/* Spotlight Listing */}
        {spotlightProperty && (
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {spotlightProperty.isRental ? 'Featured Rental' : 'Featured Home'} in Middletown
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

                    <div className="space-y-4 mt-4">
                      {spotlightProperty.unparsedAddress?.includes("1415") && spotlightProperty.unparsedAddress?.includes("Whispering") && (
                        <AudioPlayer src={whispperingWoodsAudio} title="Audio Tour" duration="2:00" />
                      )}
                      
                      {spotlightProperty.listingUrl && (
                        <a 
                          href={spotlightProperty.listingUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block w-full"
                        >
                          <Button size="lg" className="w-full" data-testid="button-view-full-listing">
                            View Full Listing on RE/MAX
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          </section>
        )}

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
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">$375K–$475K</div>
                  <h3 className="font-semibold text-lg mb-2">Starter Homes</h3>
                  <p className="text-muted-foreground text-sm">
                    Townhomes & single-family homes perfect for first-time buyers
                  </p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow border-primary">
                <div className="h-3 bg-primary" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">$500K–$650K</div>
                  <h3 className="font-semibold text-lg mb-2">Move-Up Homes</h3>
                  <p className="text-muted-foreground text-sm">
                    Spacious layouts with modern amenities for growing families
                  </p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-3 bg-amber-500" />
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">$700K+</div>
                  <h3 className="font-semibold text-lg mb-2">Luxury Homes</h3>
                  <p className="text-muted-foreground text-sm">
                    Premium properties, golf communities & custom estates
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
                Explore some of Middletown's most desirable communities, each offering its own character, amenities, and lifestyle benefits.
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
                      <div className="flex flex-col gap-2 mt-auto">
                        {hood.pageLink && (
                          <Link
                            href={hood.pageLink}
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                          >
                            <MapPin className="h-4 w-4" />
                            View Neighborhood Guide →
                          </Link>
                        )}
                        {hood.link && (
                          <a 
                            href={hood.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary hover:underline"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {hood.linkText}
                          </a>
                        )}
                      </div>
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

        {/* Local Resources */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                Local Resources
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                Helpful links for new residents and homebuyers in Middletown
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
                        <a href="https://www.middletown.delaware.gov" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors">
                          <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                          <span><strong>Town of Middletown</strong> — Official website for news, events, and community info</span>
                        </a>
                      </li>
                      <li>
                        <a href="https://www.middletown.delaware.gov/government" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors">
                          <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                          <span><strong>Town Hall</strong> — Permits, records, taxes, and local administration</span>
                        </a>
                      </li>
                      <li>
                        <a href="https://www.middletown.delaware.gov/departments/Billing" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors">
                          <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                          <span><strong>Utilities Department</strong> — Water, sewer, trash, and meter applications</span>
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
                        <a href="https://www.middletown.delaware.gov/departments/Electric" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors">
                          <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                          <span><strong>Middletown Electric</strong> — Town-owned electric with stable rates via DEMEC</span>
                        </a>
                      </li>
                      <li>
                        <a href="https://efficiencysmart.org" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors">
                          <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                          <span><strong>Efficiency Smart</strong> — Free energy audits, rebates, and home improvement incentives</span>
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
                        <a href="https://www.middletown.delaware.gov/departments/Water-Wastewater" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors">
                          <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                          <span><strong>Municipal Water/Wastewater</strong> — Drinking water, sewer, and fire hydrant maintenance</span>
                        </a>
                      </li>
                      <li>
                        <a href="https://www.artesianwater.com" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors">
                          <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                          <span><strong>Artesian Water</strong> — Private water provider for some newer developments</span>
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
                        <a href="https://www.middletown.delaware.gov/community" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors">
                          <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                          <span><strong>Town History</strong> — Local heritage and community development information</span>
                        </a>
                      </li>
                      <li>
                        <a href="https://ecode360.com/MI4162" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 text-sm hover:text-primary transition-colors">
                          <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                          <span><strong>Municipal Codes</strong> — Water, plumbing, and infrastructure standards</span>
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

        <LocalNews locationTag="middletown-de" locationName="Middletown, DE" />

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
        <AreaLastUpdated date="2026-04-28" />

      </main>

      <Footer />
    </div>
  );
}
