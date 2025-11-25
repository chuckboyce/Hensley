import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation, Link } from "wouter";
import { Bed, Bath, Square, MapPin, DollarSign } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ResponsivePropertyImage } from "@/components/responsive-property-image";
import comingSoonImage from "@assets/generated-image (1)_1762730474875.png";

export default function Properties() {
  const [, setLocation] = useLocation();

  const { data: properties, isLoading } = useQuery({
    queryKey: ['/api/properties'],
    queryFn: async () => {
      const response = await fetch('/api/properties');
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    }
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Available Properties
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Browse our current listings and find your dream home
            </p>
          </div>
        </section>

        {/* Listings Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading properties...</p>
              </div>
            ) : !properties || properties.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-xl text-muted-foreground mb-4">
                  No properties available at this time
                </p>
                <p className="text-sm text-muted-foreground">
                  Please check back soon or contact us for upcoming listings
                </p>
                <Link href="/contact">
                  <Button className="mt-6">Contact Us</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property: any) => {
                  // Get main image - priority order: uploaded image, first media URL, coming soon placeholder
                  const photos = property.media || [];
                  const mainPhoto = property.imageUrl || photos[0]?.mediaUrl || comingSoonImage;
                  
                  // Check if property was recently updated (within 24 hours)
                  const lastUpdated = new Date(property.lastUpdated);
                  const now = new Date();
                  const hoursAgo = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
                  const isRecentlyUpdated = hoursAgo < 24;
                  
                  return (
                    <Card key={property.listingKey} className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`property-card-${property.listingKey}`}>
                      {/* Property Image */}
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
                          <Badge 
                            className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-600 text-white font-bold"
                            data-testid="badge-for-rent"
                          >
                            FOR RENT
                          </Badge>
                        )}
                        {isRecentlyUpdated && (
                          <Badge 
                            className="absolute top-4 left-4 ml-28 bg-purple-600 hover:bg-purple-600 text-white font-bold"
                            data-testid="badge-updated"
                          >
                            UPDATED
                          </Badge>
                        )}
                        {property.standardStatus && (
                          <Badge 
                            className={`absolute top-4 right-4 ${
                              property.standardStatus === "Active" 
                                ? "bg-green-600 hover:bg-green-600" 
                                : property.standardStatus === "Active Under Contract"
                                ? "bg-yellow-500 hover:bg-yellow-500"
                                : property.standardStatus === "Pending"
                                ? "bg-orange-500 hover:bg-orange-500"
                                : property.standardStatus === "Sold"
                                ? "bg-red-600 hover:bg-red-600"
                                : "bg-gray-500 hover:bg-gray-500"
                            }`}
                          >
                            {property.standardStatus}
                          </Badge>
                        )}
                      </div>

                      {/* Property Details */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-3xl font-bold text-primary">
                            ${parseInt(property.listPrice).toLocaleString()}
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-sm mb-4">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{property.streetNumber} {property.streetName}</div>
                            <div className="text-muted-foreground">
                              {property.city}, {property.stateOrProvince} {property.postalCode}
                            </div>
                          </div>
                        </div>

                        {/* Property Stats */}
                        <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b">
                          {property.bedroomsTotal && (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Bed className="h-4 w-4 text-muted-foreground" />
                              <span>{property.bedroomsTotal} Beds</span>
                            </div>
                          )}
                          {(property.bathroomsFull || property.bathroomsHalf) && (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Bath className="h-4 w-4 text-muted-foreground" />
                              <span>{(property.bathroomsFull || 0) + (property.bathroomsHalf || 0) * 0.5} Baths</span>
                            </div>
                          )}
                          {property.livingArea && (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Square className="h-4 w-4 text-muted-foreground" />
                              <span>{parseInt(property.livingArea).toLocaleString()} sq ft</span>
                            </div>
                          )}
                        </div>

                        {/* Description Preview */}
                        {property.publicRemarks && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {property.publicRemarks}
                          </p>
                        )}

                        {/* MLS Number */}
                        {property.listingId && (
                          <div className="text-xs text-muted-foreground mb-4">
                            MLS# {property.listingId}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          {property.listingUrl ? (
                            <a 
                              href={property.listingUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex-1"
                            >
                              <Button className="w-full" data-testid={`button-view-listing-${property.listingKey}`}>
                                View Full Listing
                              </Button>
                            </a>
                          ) : (
                            <Link href={`/contact?property=${property.listingKey}`}>
                              <Button className="flex-1" data-testid={`button-contact-${property.listingKey}`}>
                                Request Info
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-muted py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Didn't Find What You're Looking For?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              I can help you find the perfect property that matches your needs and budget.
              Get in touch today to discuss your requirements.
            </p>
            <Link href="/contact">
              <Button size="lg" data-testid="button-contact-cta">
                Contact Kevin Hensley
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
