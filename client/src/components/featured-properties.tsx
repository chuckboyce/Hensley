import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Square, MapPin } from "lucide-react";
import { type Property } from "@shared/schema";
import { Link } from "wouter";
import AudioPlayer from "@/components/audio-player";
import whispperingWoodsAudio from "@assets/1415_Whispering_Woods_1765302937957.mp3";

export default function FeaturedProperties() {
  const [filter, setFilter] = useState<'all' | 'active' | 'sold'>('all');

  const { data: properties = [], isLoading, error } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const filteredProperties = properties.filter((property) => {
    if (filter === 'all') return true;
    return property.standardStatus.toLowerCase() === filter;
  });

  if (isLoading) {
    return (
      <section id="properties" className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Properties</h2>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-xl overflow-hidden shadow-lg border border-border animate-pulse">
                  <div className="h-64 bg-muted"></div>
                  <div className="p-6">
                    <div className="h-6 bg-muted rounded mb-3"></div>
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="flex justify-between mb-4">
                      <div className="h-4 bg-muted rounded w-16"></div>
                      <div className="h-4 bg-muted rounded w-16"></div>
                      <div className="h-4 bg-muted rounded w-16"></div>
                    </div>
                    <div className="h-10 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="properties" className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Properties</h2>
          <p className="text-muted-foreground">Unable to load properties at this time. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="properties" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Properties</h2>
            <p className="text-xl text-muted-foreground">Discover your next home or investment opportunity</p>
          </div>
          <div className="mt-6 md:mt-0">
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              data-testid="button-view-all"
            >
              View All Properties
            </Button>
          </div>
        </div>
        
        {/* Property Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button
            onClick={() => setFilter('active')}
            variant={filter === 'active' ? 'default' : 'secondary'}
            className="rounded-full"
            data-testid="filter-active"
          >
            Active Listings
          </Button>
          <Button
            onClick={() => setFilter('sold')}
            variant={filter === 'sold' ? 'default' : 'secondary'}
            className="rounded-full"
            data-testid="filter-sold"
          >
            Recently Sold
          </Button>
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'secondary'}
            className="rounded-full"
            data-testid="filter-all"
          >
            All Properties
          </Button>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Call to Action for IDX Integration */}
        <div className="mt-12 text-center">
          <div className="bg-muted rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-foreground mb-4">Browse All Available Properties</h3>
            <p className="text-muted-foreground mb-6">
              Access our complete database of homes for sale and rent in your area
            </p>
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
              data-testid="button-search-all"
            >
              Search All Listings
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function PropertyCard({ property }: { property: Property }) {
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const getMainImage = () => {
    // For now, use a placeholder. In the actual implementation, 
    // this would fetch the first media image from the API
    return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80";
  };

  const hasAudioTour = property.unparsedAddress?.includes("1415") && property.unparsedAddress?.includes("Whispering");

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-lg border border-border hover:shadow-xl transition-shadow" data-testid={`property-card-${property.listingKey}`}>
      <img 
        src={getMainImage()} 
        alt={`Property at ${property.unparsedAddress}`} 
        className="w-full h-64 object-cover" 
      />
      
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h4 className="text-xl font-semibold text-card-foreground" data-testid={`property-price-${property.listingKey}`}>
            {formatPrice(property.listPrice)}
          </h4>
          <Badge 
            variant={property.standardStatus === 'Active' ? 'default' : 'secondary'}
            className={property.standardStatus === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-blue-100 text-blue-800 hover:bg-blue-100'}
          >
            {property.standardStatus}
          </Badge>
        </div>
        
        <div className="flex items-start text-muted-foreground" data-testid={`property-address-${property.listingKey}`}>
          <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{property.unparsedAddress}</span>
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{property.bedroomsTotal || 0} bed</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{(property.bathroomsFull || 0) + (property.bathroomsHalf || 0)} bath</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{property.livingArea?.toLocaleString() || 'N/A'} sqft</span>
          </div>
        </div>

        {hasAudioTour && (
          <div className="pt-2 border-t border-border">
            <AudioPlayer src={whispperingWoodsAudio} title="Audio Tour" duration="2:00" />
          </div>
        )}
        
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link 
            href={`/properties/${property.listingKey}`} 
            data-testid={`link-property-${property.listingKey}`}
          >
            View Details
          </Link>
        </Button>
      </div>
      
      {/* IDX Attribution */}
      <div className="px-6 pb-4">
        <p className="text-xs text-muted-foreground">
          Listing courtesy of {property.listingOfficeName}
        </p>
      </div>
    </div>
  );
}
