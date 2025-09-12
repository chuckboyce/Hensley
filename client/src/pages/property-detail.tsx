import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Calendar, 
  Building, 
  Home,
  ArrowLeft,
  Phone,
  Mail
} from "lucide-react";
import { type Property, type PropertyMedia } from "@shared/schema";

export default function PropertyDetail() {
  const { listingKey } = useParams<{ listingKey: string }>();

  const { data: property, isLoading: propertyLoading, error: propertyError } = useQuery<Property>({
    queryKey: ['/api/properties', listingKey],
    enabled: !!listingKey,
  });

  const { data: media = [], isLoading: mediaLoading } = useQuery<PropertyMedia[]>({
    queryKey: ['/api/properties', listingKey, 'media'],
    enabled: !!listingKey,
  });

  if (propertyLoading || mediaLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-6 w-32"></div>
            <div className="h-96 bg-muted rounded-xl mb-8"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="h-8 bg-muted rounded mb-4"></div>
                <div className="h-6 bg-muted rounded mb-6 w-64"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-4 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
              <div>
                <div className="h-64 bg-muted rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (propertyError || !property) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6" data-testid="button-back-home">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Property Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The property you're looking for doesn't exist or may have been removed.
            </p>
            <Link href="/#properties">
              <Button data-testid="button-browse-properties">Browse Properties</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const mainImage = media.length > 0 
    ? media.find(m => m.mediaOrder === 1)?.mediaUrl || media[0].mediaUrl
    : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Back Navigation */}
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back-home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Main Property Image */}
        <div className="relative mb-8">
          <img 
            src={mainImage}
            alt={`Property at ${property.unparsedAddress}`}
            className="w-full h-96 md:h-[500px] object-cover rounded-xl"
            data-testid="image-property-main"
          />
          <div className="absolute top-4 left-4">
            <Badge 
              variant={property.standardStatus === 'Active' ? 'default' : 'secondary'}
              className={`${property.standardStatus === 'Active' 
                ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                : 'bg-blue-100 text-blue-800 hover:bg-blue-100'} text-lg px-4 py-2`}
              data-testid="badge-property-status"
            >
              {property.standardStatus}
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Property Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="text-property-price">
                {formatPrice(property.listPrice)}
              </h1>
              <div className="flex items-start text-muted-foreground mb-4">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-lg" data-testid="text-property-address">
                  {property.unparsedAddress}
                </span>
              </div>
              
              {/* Property Stats */}
              <div className="flex flex-wrap gap-6 text-foreground">
                <div className="flex items-center" data-testid="text-bedrooms">
                  <Bed className="h-5 w-5 mr-2" />
                  <span className="font-semibold">{property.bedroomsTotal || 0}</span>
                  <span className="ml-1">Bedrooms</span>
                </div>
                <div className="flex items-center" data-testid="text-bathrooms">
                  <Bath className="h-5 w-5 mr-2" />
                  <span className="font-semibold">
                    {(property.bathroomsFull || 0) + (property.bathroomsHalf || 0)}
                  </span>
                  <span className="ml-1">Bathrooms</span>
                </div>
                <div className="flex items-center" data-testid="text-square-footage">
                  <Square className="h-5 w-5 mr-2" />
                  <span className="font-semibold">{property.livingArea?.toLocaleString() || 'N/A'}</span>
                  <span className="ml-1">Sq Ft</span>
                </div>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Property Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Description</h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed" data-testid="text-property-description">
                  {property.publicRemarks || "No description available for this property."}
                </p>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Property Details */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Property Details</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center">
                      <Home className="h-4 w-4 mr-2" />
                      Property Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Property Type:</span>
                        <span className="font-medium" data-testid="text-property-type">
                          {property.propertyType || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year Built:</span>
                        <span className="font-medium" data-testid="text-year-built">
                          {property.yearBuilt || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lot Size:</span>
                        <span className="font-medium" data-testid="text-lot-size">
                          {property.lotSizeArea ? `${parseFloat(property.lotSizeArea).toLocaleString()} ${property.lotSizeUnits || 'sq ft'}` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stories:</span>
                        <span className="font-medium" data-testid="text-stories">
                          {property.storiesTotal || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      Listing Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">MLS Number:</span>
                        <span className="font-medium" data-testid="text-mls-number">
                          {property.listingKey}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Days on Market:</span>
                        <span className="font-medium" data-testid="text-days-on-market">
                          {property.daysOnMarket ?? 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">List Date:</span>
                        <span className="font-medium" data-testid="text-list-date">
                          {property.onMarketDate ? formatDate(property.onMarketDate) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span className="font-medium" data-testid="text-last-updated">
                          {property.lastUpdated ? formatDate(property.lastUpdated) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* IDX Compliance */}
            <div className="bg-muted rounded-lg p-6 mb-8">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium">
                  <strong>IDX Information:</strong> Listing courtesy of {property.listingOfficeName}
                </p>
                <p>
                  © {new Date().getFullYear()} Bright MLS. All rights reserved. Information is deemed reliable but not guaranteed.
                </p>
                <p>
                  The data relating to real estate for sale on this website appears in part through the BRIGHT Internet Data Exchange program, 
                  a voluntary cooperative exchange of property listing information between licensed real estate brokerage firms in which 
                  Hensley's Homes participates, and is provided by BRIGHT through a licensing agreement.
                </p>
                <p>
                  The information provided by this website is for the personal, non-commercial use of consumers and may not be used for any purpose other than to identify prospective properties consumers may be interested in purchasing.
                </p>
                <p className="text-xs">
                  Data last updated: {property.lastUpdated ? formatDate(property.lastUpdated) : formatDate(new Date())}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">Contact Agent</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold text-primary-foreground">KH</span>
                    </div>
                    <h4 className="font-semibold text-foreground">Kevin Hensley</h4>
                    <p className="text-sm text-muted-foreground">Licensed Real Estate Agent</p>
                    <p className="text-sm text-muted-foreground">RE/MAX Eagle Realty</p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button className="w-full" data-testid="button-call-agent">
                      <Phone className="h-4 w-4 mr-2" />
                      (301) 898-2800
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="button-email-agent">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Agent
                    </Button>
                  </div>

                  <Separator />

                  <div className="text-xs text-muted-foreground">
                    <p className="mb-2">
                      <strong>Office:</strong> RE/MAX Eagle Realty<br />
                      6120 Brandon Ave, Suite 200<br />
                      Springfield, VA 22150
                    </p>
                    <p>
                      Licensed in Virginia (#0225260053)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Media */}
        {media.length > 1 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Property Photos</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.slice(1).map((mediaItem, index) => (
                <div key={mediaItem.id} className="relative">
                  <img 
                    src={mediaItem.mediaUrl}
                    alt={mediaItem.caption || `Property photo ${index + 2}`}
                    className="w-full h-48 object-cover rounded-lg"
                    data-testid={`image-property-${index + 2}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}