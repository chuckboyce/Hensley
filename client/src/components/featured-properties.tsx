import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Square } from "lucide-react";
import { properties, type Property } from "@/data/mock-data";

export default function FeaturedProperties() {
  const [filter, setFilter] = useState<'all' | 'sale' | 'rent'>('all');

  const filteredProperties = properties.filter(property => {
    if (filter === 'all') return true;
    return property.type === filter;
  });

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
            onClick={() => setFilter('sale')}
            variant={filter === 'sale' ? 'default' : 'secondary'}
            className="rounded-full"
            data-testid="filter-sale"
          >
            For Sale
          </Button>
          <Button
            onClick={() => setFilter('rent')}
            variant={filter === 'rent' ? 'default' : 'secondary'}
            className="rounded-full"
            data-testid="filter-rent"
          >
            For Rent
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
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-lg border border-border hover:shadow-xl transition-shadow" data-testid={`property-card-${property.id}`}>
      <img 
        src={property.image} 
        alt={`Property at ${property.address}`} 
        className="w-full h-64 object-cover" 
      />
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-xl font-semibold text-card-foreground" data-testid={`property-price-${property.id}`}>
            {property.price}
          </h4>
          <Badge 
            variant={property.type === 'sale' ? 'default' : 'secondary'}
            className={property.type === 'sale' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-blue-100 text-blue-800 hover:bg-blue-100'}
          >
            {property.status}
          </Badge>
        </div>
        <p className="text-muted-foreground mb-4" data-testid={`property-address-${property.id}`}>
          {property.address}
        </p>
        
        <div className="flex justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{property.bathrooms} bath</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{property.sqft} sqft</span>
          </div>
        </div>
        
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          data-testid={`button-view-details-${property.id}`}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
