import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  BarChart3, 
  Search, 
  Grid3X3, 
  List, 
  Map as MapIcon,
  ChevronDown,
  X
} from "lucide-react";

export default function IdxTest() {
  const [viewType, setViewType] = useState("map");
  const [sortBy, setSortBy] = useState("price_desc");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");

  // Mock data for testing
  const resultCount = 9;
  const searchQuery = "My Listings";

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back navigation */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/">
          <Button variant="ghost" className="mb-4" data-testid="button-back-home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-6">IDX Map Interface Test</h1>
      </div>

      {/* Main content wrapper */}
      <div className="relative">
        <div className="grid lg:grid-cols-12 h-[calc(100vh-200px)]">
          {/* Map column */}
          <div className="lg:col-span-7 relative bg-muted" data-testid="map-container">
            {/* Map overlay buttons */}
            <div className="absolute top-4 left-4 z-10 space-y-2">
              <Button 
                variant="secondary" 
                className="bg-white shadow-md hover:bg-gray-50"
                data-testid="button-market-report"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Complimentary Market Report
              </Button>
              
              <Button 
                variant="secondary" 
                className="bg-white shadow-md hover:bg-gray-50 hidden"
                data-testid="button-redo-search"
              >
                <Search className="h-4 w-4 mr-2" />
                Redo Search in Map
              </Button>
            </div>

            {/* Map placeholder */}
            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapIcon className="h-12 w-12 mx-auto mb-2" />
                <p className="text-lg font-medium">Interactive Map</p>
                <p className="text-sm">Leaflet Map Integration Placeholder</p>
                <div className="mt-4 text-xs text-muted-foreground">
                  <p>Office: RE/MAX Eagle Realty</p>
                  <p>5609 DuPont Pkwy Ste 11, Smyrna, DE 19977</p>
                </div>
              </div>
            </div>

            {/* Search loader overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white px-4 py-2 rounded hidden">
              <span>Searching <span className="animate-spin inline-block">⟳</span></span>
            </div>
          </div>

          {/* Results column */}
          <div className="lg:col-span-5 flex flex-col bg-background">
            {/* Results header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-lg">
                    <strong className="text-foreground" data-testid="text-result-count">{resultCount}</strong>{" "}
                    <span className="text-muted-foreground">results for</span>{" "}
                    <strong className="text-foreground">{searchQuery}</strong>
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  data-testid="button-save-search"
                >
                  Save Search
                </Button>
              </div>

              {/* Search controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* View type selector */}
                <div>
                  <Label htmlFor="view-type" className="sr-only">Select View</Label>
                  <Select value={viewType} onValueChange={setViewType}>
                    <SelectTrigger data-testid="select-view-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">
                        <div className="flex items-center">
                          <Grid3X3 className="h-4 w-4 mr-2" />
                          Grid
                        </div>
                      </SelectItem>
                      <SelectItem value="list">
                        <div className="flex items-center">
                          <List className="h-4 w-4 mr-2" />
                          List
                        </div>
                      </SelectItem>
                      <SelectItem value="map">
                        <div className="flex items-center">
                          <MapIcon className="h-4 w-4 mr-2" />
                          Map
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort selector */}
                <div>
                  <Label htmlFor="sort-by" className="sr-only">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger data-testid="select-sort-by">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price_asc">Price $-$$</SelectItem>
                      <SelectItem value="price_desc">Price $$-$</SelectItem>
                      <SelectItem value="beds_desc">Beds</SelectItem>
                      <SelectItem value="baths_desc">Baths</SelectItem>
                      <SelectItem value="footage_desc">Footage</SelectItem>
                      <SelectItem value="acreage_desc">Acreage</SelectItem>
                      <SelectItem value="reductions_desc">Reductions</SelectItem>
                      <SelectItem value="days_on_market_desc">Days on Website</SelectItem>
                      <SelectItem value="pictures_desc"># Pictures</SelectItem>
                      <SelectItem value="walk_score_desc">Walk Score</SelectItem>
                      <SelectItem value="popularity_desc">Popularity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* More filters button */}
                <div className="flex justify-end">
                  <Button 
                    variant="default"
                    onClick={() => setShowMoreFilters(!showMoreFilters)}
                    data-testid="button-more-filters"
                  >
                    More Filters{" "}
                    <ChevronDown 
                      className={`h-4 w-4 ml-2 transition-transform ${showMoreFilters ? 'rotate-180' : ''}`} 
                    />
                  </Button>
                </div>
              </div>
            </div>

            {/* Advanced filters modal/panel */}
            {showMoreFilters && (
              <div className="border-b border-border bg-muted/50">
                <Card className="m-4">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Advanced Search Filters</h3>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowMoreFilters(false)}
                        data-testid="button-close-filters"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Location search */}
                      <div>
                        <Label htmlFor="location-search">Location - County, City, Neighborhood, School</Label>
                        <Input
                          id="location-search"
                          type="text"
                          placeholder="City, Area, Zip, MLS#, or Address"
                          value={searchLocation}
                          onChange={(e) => setSearchLocation(e.target.value)}
                          data-testid="input-location-search"
                        />
                      </div>

                      {/* Price range */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="min-price">Min Price</Label>
                          <Select>
                            <SelectTrigger data-testid="select-min-price">
                              <SelectValue placeholder="No Min" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="100000">$100,000</SelectItem>
                              <SelectItem value="200000">$200,000</SelectItem>
                              <SelectItem value="300000">$300,000</SelectItem>
                              <SelectItem value="400000">$400,000</SelectItem>
                              <SelectItem value="500000">$500,000</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="max-price">Max Price</Label>
                          <Select>
                            <SelectTrigger data-testid="select-max-price">
                              <SelectValue placeholder="No Max" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="300000">$300,000</SelectItem>
                              <SelectItem value="400000">$400,000</SelectItem>
                              <SelectItem value="500000">$500,000</SelectItem>
                              <SelectItem value="600000">$600,000</SelectItem>
                              <SelectItem value="1000000">$1,000,000+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Beds and Baths */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="beds">Bedrooms</Label>
                          <Select>
                            <SelectTrigger data-testid="select-bedrooms">
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1+</SelectItem>
                              <SelectItem value="2">2+</SelectItem>
                              <SelectItem value="3">3+</SelectItem>
                              <SelectItem value="4">4+</SelectItem>
                              <SelectItem value="5">5+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="baths">Bathrooms</Label>
                          <Select>
                            <SelectTrigger data-testid="select-bathrooms">
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1+</SelectItem>
                              <SelectItem value="2">2+</SelectItem>
                              <SelectItem value="3">3+</SelectItem>
                              <SelectItem value="4">4+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Property type */}
                      <div>
                        <Label htmlFor="property-type">Property Type</Label>
                        <Select>
                          <SelectTrigger data-testid="select-property-type">
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="residential">Residential</SelectItem>
                            <SelectItem value="condo">Condominium</SelectItem>
                            <SelectItem value="townhouse">Townhouse</SelectItem>
                            <SelectItem value="land">Land</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-4">
                        <Button variant="default" data-testid="button-apply-filters">
                          Apply Filters
                        </Button>
                        <Button variant="outline" data-testid="button-clear-filters">
                          Clear All
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Results area */}
            <div className="flex-1 overflow-y-auto p-4" data-testid="results-container">
              <div className="space-y-4">
                {/* Sample property listing cards */}
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex space-x-4">
                        <div className="w-32 h-24 bg-muted rounded flex-shrink-0 flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Photo {i}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-lg text-foreground">
                                ${(400000 + i * 50000).toLocaleString()}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                123{i} Sample St, Middletown, DE
                              </p>
                            </div>
                            <Badge variant="secondary">Active</Badge>
                          </div>
                          <div className="flex space-x-4 text-sm text-muted-foreground">
                            <span>{2 + i} bed</span>
                            <span>{2} bath</span>
                            <span>{1800 + i * 200} sqft</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Listing courtesy of RE/MAX Eagle Realty
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MLS Attribution Footer */}
        <div className="bg-muted border-t border-border p-4">
          <div className="container mx-auto">
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <strong>IDX Information:</strong> Listing data provided by Bright MLS. 
                IDX information is provided exclusively for consumers' personal, non-commercial use 
                and may not be used for any purpose other than to identify prospective properties 
                consumers may be interested in purchasing.
              </p>
              <p>
                © {new Date().getFullYear()} Bright MLS. All rights reserved. Information deemed reliable but not guaranteed.
              </p>
              <p className="text-xs">
                Data last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}