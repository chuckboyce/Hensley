import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { Bed, Bath, Square, MapPin, Home, Phone, Calendar, DollarSign, ExternalLink } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ResponsivePropertyImage } from "@/components/responsive-property-image";
import PropertySchemaInjector from "@/components/PropertySchemaInjector";
import comingSoonImage from "@assets/generated-image (1)_1762730474875.png";

type Tab = "sale" | "rent";

interface RentalListing {
  id: string;
  name: string;
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  lat: number | null;
  lng: number | null;
  marketRent: number | null;
  deposit: number | null;
  dateAvailable: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFeet: number | null;
  description: string | null;
  amenities: string[];
  photos: string[];
  propertyId: string;
  propertyName: string | null;
  propertyType: string | null;
  listingUrl: string;
  updatedAt: string;
}

export default function Properties() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>("rent");

  const { data: properties, isLoading: saleLoading } = useQuery({
    queryKey: ['/api/properties'],
    queryFn: async () => {
      const response = await fetch('/api/properties');
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    }
  });

  const { data: rentalsResponse, isLoading: rentLoading } = useQuery({
    queryKey: ['/api/doorloop/rentals'],
    queryFn: async () => {
      const response = await fetch('/api/doorloop/rentals');
      if (!response.ok) throw new Error('Failed to fetch rentals');
      return response.json();
    },
    staleTime: 10 * 60 * 1000,
  });

  const rentals: RentalListing[] = (rentalsResponse?.data ?? []).filter(
    (r: RentalListing) => r.marketRent !== null && r.marketRent > 0
  );

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
                {rentals.length > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    {rentals.length}
                  </span>
                )}
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
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold">Rental Properties</h2>
                  <p className="text-muted-foreground mt-1">
                    Available rentals managed by Hensley's Homes across Delaware
                  </p>
                </div>

                {rentLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className="overflow-hidden animate-pulse">
                        <div className="h-52 bg-muted" />
                        <div className="p-5 space-y-3">
                          <div className="h-5 bg-muted rounded w-1/2" />
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="h-4 bg-muted rounded w-1/2" />
                          <div className="h-9 bg-muted rounded" />
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : rentals.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-xl text-muted-foreground mb-4">No rental listings at this time</p>
                    <p className="text-sm text-muted-foreground">Contact us to join our waitlist for upcoming rentals</p>
                    <Link href="/contact">
                      <Button className="mt-6">Contact Us</Button>
                    </Link>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rentals.map((rental) => (
                      <Card key={rental.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                        {/* Photo */}
                        <div className="relative h-52 bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center overflow-hidden">
                          {rental.photos.length > 0 ? (
                            <img
                              src={rental.photos[0]}
                              alt={rental.street}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <Home className="h-16 w-16 text-primary/30" />
                          )}
                          <Badge className="absolute top-3 left-3 bg-blue-600 hover:bg-blue-600 text-white font-bold text-xs shadow">
                            FOR RENT
                          </Badge>
                          {rental.marketRent && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
                              <span className="text-white text-xl font-bold">
                                ${rental.marketRent.toLocaleString()}
                                <span className="text-sm font-normal opacity-80">/mo</span>
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-5 flex flex-col flex-1 gap-3">
                          {/* Address */}
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                            <div>
                              <div className="font-semibold text-foreground leading-tight">{rental.street}</div>
                              {rental.street2 && <div className="text-sm text-muted-foreground">{rental.street2}</div>}
                              <div className="text-sm text-muted-foreground">{rental.city}, {rental.state} {rental.zip}</div>
                            </div>
                          </div>

                          {/* Beds / Baths / Sqft */}
                          {(rental.bedrooms || rental.bathrooms || rental.squareFeet) && (
                            <div className="flex flex-wrap gap-3 py-2 border-y">
                              {rental.bedrooms && (
                                <div className="flex items-center gap-1 text-sm">
                                  <Bed className="h-4 w-4 text-muted-foreground" />
                                  {rental.bedrooms} Bed{rental.bedrooms !== 1 ? "s" : ""}
                                </div>
                              )}
                              {rental.bathrooms && (
                                <div className="flex items-center gap-1 text-sm">
                                  <Bath className="h-4 w-4 text-muted-foreground" />
                                  {rental.bathrooms} Bath{rental.bathrooms !== 1 ? "s" : ""}
                                </div>
                              )}
                              {rental.squareFeet && (
                                <div className="flex items-center gap-1 text-sm">
                                  <Square className="h-4 w-4 text-muted-foreground" />
                                  {rental.squareFeet.toLocaleString()} sq ft
                                </div>
                              )}
                            </div>
                          )}

                          {/* Description */}
                          {rental.description && (
                            <p className="text-sm text-muted-foreground line-clamp-3">{rental.description}</p>
                          )}

                          {/* Deposit + Available date */}
                          <div className="flex flex-wrap gap-3">
                            {rental.deposit && (
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <DollarSign className="h-3.5 w-3.5" />
                                Deposit: ${rental.deposit.toLocaleString()}
                              </div>
                            )}
                            {rental.dateAvailable && (
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                Available: {new Date(rental.dateAvailable).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </div>
                            )}
                          </div>

                          {/* Amenities */}
                          {rental.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {rental.amenities.slice(0, 6).map((a) => (
                                <span key={a} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                                  {a.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                              ))}
                              {rental.amenities.length > 6 && (
                                <span className="text-xs text-muted-foreground px-1 py-0.5">
                                  +{rental.amenities.length - 6} more
                                </span>
                              )}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex flex-col gap-2 mt-auto pt-1">
                            <a href={rental.listingUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                              <Button className="w-full" size="sm">
                                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                                View Full Listing
                              </Button>
                            </a>
                            <div className="flex gap-2">
                              <a href="tel:3022180130" className="flex-1">
                                <Button variant="outline" className="w-full" size="sm">
                                  <Phone className="h-3.5 w-3.5 mr-1.5" />
                                  Call to Show
                                </Button>
                              </a>
                              <Link href={`/contact?rental=${rental.id}&address=${encodeURIComponent(rental.street)}`} className="flex-1">
                                <Button variant="outline" className="w-full" size="sm">
                                  Request Info
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                <div className="mt-10 p-5 bg-muted rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    Rental listings are updated in real time from our property management system. Availability is subject to change. Contact us to confirm current availability and schedule a showing.
                  </p>
                </div>
              </>
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

        {/* CTA */}
        <section className="bg-muted py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Didn't Find What You're Looking For?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              I can help you find the perfect property — whether buying, selling, or renting. Get in touch today.
            </p>
            <Link href="/contact">
              <Button size="lg">Contact Kevin Hensley</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
