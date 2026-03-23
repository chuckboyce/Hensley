import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Bed, Bath, Square, MapPin } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ResponsivePropertyImage } from "@/components/responsive-property-image";
import PropertySchemaInjector from "@/components/PropertySchemaInjector";
import comingSoonImage from "@assets/generated-image (1)_1762730474875.png";

type Tab = "sale" | "rent";

const DOORLOOP_LISTINGS_URL = "https://74458621.app.doorloop.com/listings/";

export default function Properties() {
  const [tab, setTab] = useState<Tab>("rent");

  const { data: properties, isLoading: saleLoading } = useQuery({
    queryKey: ['/api/properties'],
    queryFn: async () => {
      const response = await fetch('/api/properties');
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    }
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PropertySchemaInjector />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Available Properties</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Browse homes for sale and rental properties managed by Hensley's Homes
            </p>
          </div>
        </section>

        {/* Tabs */}
        <div className="border-b border-border bg-background sticky top-16 z-10">
          <div className="container mx-auto px-4">
            <div className="flex gap-0">
              <button
                onClick={() => setTab("rent")}
                className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                  tab === "rent"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                For Rent
              </button>
              <button
                onClick={() => setTab("sale")}
                className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                  tab === "sale"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                For Sale
                {properties && properties.length > 0 && (
                  <span className="ml-2 bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                    {properties.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <section className="py-12">
          <div className="container mx-auto px-4">

            {/* ── FOR RENT TAB ── */}
            {tab === "rent" && (
              <div className="-mx-4">
                <iframe
                  src={DOORLOOP_LISTINGS_URL}
                  className="w-full border-0"
                  style={{ minHeight: "900px" }}
                  title="Available Rental Properties"
                  allow="payment"
                />
              </div>
            )}

            {/* ── FOR SALE TAB ── */}
            {tab === "sale" && (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold">Homes For Sale</h2>
                  <p className="text-muted-foreground mt-1">Active listings represented by Kevin Hensley</p>
                </div>

                {saleLoading ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading properties...</p>
                  </div>
                ) : !properties || properties.length === 0 ? (
                  <Card className="p-12 text-center">
                    <p className="text-xl text-muted-foreground mb-4">No properties available at this time</p>
                    <p className="text-sm text-muted-foreground">Please check back soon or contact us for upcoming listings</p>
                    <Link href="/contact">
                      <Button className="mt-6">Contact Us</Button>
                    </Link>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map((property: any) => {
                      const photos = property.media || [];
                      const mainPhoto = property.imageUrl || photos[0]?.mediaUrl || comingSoonImage;
                      const lastUpdated = new Date(property.lastUpdated);
                      const hoursAgo = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60);
                      const isRecentlyUpdated = hoursAgo < 24;

                      return (
                        <Card key={property.listingKey} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative h-64 bg-muted">
                            <ResponsivePropertyImage
                              variants={property.imageVariants}
                              placeholder={property.imagePlaceholder}
                              fallbackUrl={mainPhoto}
                              alt={property.unparsedAddress}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            {property.isRental && (
                              <Badge className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-600 text-white font-bold">
                                FOR RENT
                              </Badge>
                            )}
                            {isRecentlyUpdated && (
                              <Badge className="absolute top-4 left-4 ml-28 bg-purple-600 hover:bg-purple-600 text-white font-bold">
                                UPDATED
                              </Badge>
                            )}
                            {property.standardStatus && (
                              <Badge className={`absolute top-4 right-4 ${
                                property.standardStatus === "Active" ? "bg-green-600 hover:bg-green-600"
                                : property.standardStatus === "Active Under Contract" ? "bg-yellow-500 hover:bg-yellow-500"
                                : property.standardStatus === "Pending" ? "bg-orange-500 hover:bg-orange-500"
                                : property.standardStatus === "Sold" ? "bg-red-600 hover:bg-red-600"
                                : "bg-gray-500 hover:bg-gray-500"
                              }`}>
                                {property.standardStatus}
                              </Badge>
                            )}
                          </div>

                          <div className="p-6">
                            <div className="text-3xl font-bold text-primary mb-4">
                              ${parseInt(property.listPrice).toLocaleString()}
                            </div>
                            <div className="flex items-start gap-2 text-sm mb-4">
                              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{property.unparsedAddress || `${property.streetNumber || ''} ${property.streetName || ''}`.trim()}</div>
                                <div className="text-muted-foreground">{property.city}, {property.stateOrProvince} {property.postalCode}</div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b">
                              {property.bedroomsTotal && (
                                <div className="flex items-center gap-1.5 text-sm">
                                  <Bed className="h-4 w-4 text-muted-foreground" />
                                  {property.bedroomsTotal} Beds
                                </div>
                              )}
                              {(property.bathroomsFull || property.bathroomsHalf) && (
                                <div className="flex items-center gap-1.5 text-sm">
                                  <Bath className="h-4 w-4 text-muted-foreground" />
                                  {(property.bathroomsFull || 0) + (property.bathroomsHalf || 0) * 0.5} Baths
                                </div>
                              )}
                              {property.livingArea && (
                                <div className="flex items-center gap-1.5 text-sm">
                                  <Square className="h-4 w-4 text-muted-foreground" />
                                  {parseInt(property.livingArea).toLocaleString()} sq ft
                                </div>
                              )}
                            </div>
                            {property.publicRemarks && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{property.publicRemarks}</p>
                            )}
                            {property.listingId && (
                              <div className="text-xs text-muted-foreground mb-4">MLS# {property.listingId}</div>
                            )}
                            <div className="flex gap-2">
                              {property.listingUrl ? (
                                <a href={property.listingUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                                  <Button className="w-full">View Full Listing</Button>
                                </a>
                              ) : (
                                <Link href={`/contact?property=${property.listingKey}`}>
                                  <Button className="flex-1">Request Info</Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}

                <div className="mt-12 p-6 bg-muted rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Some properties which appear for sale on this website may no longer be available because they are under contract, have Closed or are no longer being offered for sale.
                  </p>
                </div>
              </>
            )}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
