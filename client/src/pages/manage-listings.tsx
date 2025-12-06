import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ArrowLeft, Plus, Trash2, Edit, Globe } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function ManageListings() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({ 
    listPrice: "", 
    bedroomsTotal: "", 
    bathroomsFull: "", 
    bathroomsHalf: "", 
    livingArea: "", 
    yearBuilt: "", 
    publicRemarks: "", 
    listingUrl: "", 
    imageUrl: "", 
    isRental: false 
  });
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!password) {
      toast({
        title: "Error",
        description: "Please enter the admin password",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/parse-listing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`
        },
        body: JSON.stringify({ text: "test" })
      });

      if (response.status === 401) {
        toast({
          title: "Error",
          description: "Invalid password",
          variant: "destructive"
        });
        return;
      }

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      setIsAuthenticated(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all properties including inactive (admin view)
  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['/api/admin/properties/all'],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch('/api/admin/properties/all', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    }
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ listingKey, status }: { listingKey: string; status: string }) => {
      const response = await fetch(`/api/admin/properties/${listingKey}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/properties/all'] });
      toast({
        title: "Success",
        description: "Status updated"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (listingKey: string) => {
      const response = await fetch(`/api/admin/properties/${listingKey}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete listing');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/properties/all'] });
      toast({
        title: "Success",
        description: "Listing deleted"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive"
      });
    }
  });

  // Edit mutation
  const editMutation = useMutation({
    mutationFn: async ({ listingKey, updates }: { listingKey: string; updates: any }) => {
      const response = await fetch(`/api/admin/properties/${listingKey}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.details?.[0]?.message || 'Failed to update property');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/properties/all'] });
      setEditDialogOpen(false);
      setEditingProperty(null);
      toast({
        title: "Success",
        description: "Property updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update property",
        variant: "destructive"
      });
    }
  });

  // Ping search engines mutation
  const pingSearchEnginesMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/ping-search-engines', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to ping search engines');
      return response.json();
    },
    onSuccess: (data) => {
      const { results } = data;
      if (results.message) {
        toast({
          title: "Notice",
          description: results.message
        });
      } else {
        const successCount = (results.google ? 1 : 0) + (results.bing ? 1 : 0);
        toast({
          title: "Success",
          description: `Pinged ${successCount} search engine${successCount !== 1 ? 's' : ''} successfully`
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to ping search engines",
        variant: "destructive"
      });
    }
  });

  // Sync listings from RE/MAX website
  const syncListingsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/sync-listings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to sync listings');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/properties/all'] });
      const { summary } = data;
      toast({
        title: "Sync Complete",
        description: `${summary.newListings} new, ${summary.updatedListings} updated, ${summary.expiredListings} expired`
      });
    },
    onError: (error) => {
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "Failed to sync listings",
        variant: "destructive"
      });
    }
  });

  // Generate AI summaries for schema markup
  const generateSummariesMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/generate-summaries', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to generate summaries');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/properties/all'] });
      toast({
        title: "AI Summaries",
        description: data.propertiesQueued 
          ? `Generating ${data.propertiesQueued} summaries in background...` 
          : data.message
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate summaries",
        variant: "destructive"
      });
    }
  });

  const handleOpenEdit = (property: any) => {
    setEditingProperty(property);
    setEditFormData({
      listPrice: property.listPrice || "",
      bedroomsTotal: property.bedroomsTotal || "",
      bathroomsFull: property.bathroomsFull || "",
      bathroomsHalf: property.bathroomsHalf || "",
      livingArea: property.livingArea || "",
      yearBuilt: property.yearBuilt || "",
      publicRemarks: property.publicRemarks || "",
      listingUrl: property.listingUrl || "",
      imageUrl: property.imageUrl || "",
      isRental: property.isRental || false
    });
    setEditDialogOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    try {
      const uploadData = new FormData();
      uploadData.append('image', file);
      
      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${password}`
        },
        body: uploadData
      });
      
      if (response.ok) {
        const { imageUrl } = await response.json();
        setEditFormData(prev => ({ ...prev, imageUrl }));
        toast({
          title: "Success",
          description: "Image uploaded successfully"
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    }
  };

  const handleSaveEdit = () => {
    if (!editingProperty) return;
    
    const updates: any = {};
    
    // Only add fields that have actual values (not empty strings)
    if (editFormData.listPrice) updates.listPrice = editFormData.listPrice;
    if (editFormData.bedroomsTotal) updates.bedroomsTotal = parseInt(editFormData.bedroomsTotal);
    if (editFormData.bathroomsFull) updates.bathroomsFull = parseInt(editFormData.bathroomsFull);
    if (editFormData.bathroomsHalf) updates.bathroomsHalf = parseInt(editFormData.bathroomsHalf);
    if (editFormData.livingArea) updates.livingArea = parseInt(editFormData.livingArea);
    if (editFormData.yearBuilt) updates.yearBuilt = parseInt(editFormData.yearBuilt);
    if (editFormData.publicRemarks) updates.publicRemarks = editFormData.publicRemarks;
    if (editFormData.listingUrl) updates.listingUrl = editFormData.listingUrl;
    if (editFormData.imageUrl) updates.imageUrl = editFormData.imageUrl;
    if (editFormData.isRental !== undefined) updates.isRental = editFormData.isRental;
    
    // Check if at least one field has been updated
    if (Object.keys(updates).length === 0) {
      toast({
        title: "Error",
        description: "Please update at least one field",
        variant: "destructive"
      });
      return;
    }
    
    editMutation.mutate({
      listingKey: editingProperty.listingKey,
      updates
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter admin password"
                data-testid="input-admin-password"
              />
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full"
              disabled={isLoading}
              data-testid="button-admin-login"
            >
              {isLoading ? "Authenticating..." : "Login"}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Manage Listings</h1>
          <div className="flex gap-4 flex-wrap">
            <Button
              onClick={() => syncListingsMutation.mutate()}
              disabled={syncListingsMutation.isPending}
              variant="default"
              data-testid="button-sync-listings"
            >
              {syncListingsMutation.isPending ? "Syncing..." : "Sync from RE/MAX"}
            </Button>
            <Button
              onClick={() => pingSearchEnginesMutation.mutate()}
              disabled={pingSearchEnginesMutation.isPending}
              variant="secondary"
              data-testid="button-ping-search-engines"
            >
              <Globe className="mr-2 h-4 w-4" />
              {pingSearchEnginesMutation.isPending ? "Pinging..." : "Ping Search Engines"}
            </Button>
            <Button
              onClick={() => generateSummariesMutation.mutate()}
              disabled={generateSummariesMutation.isPending}
              variant="outline"
              data-testid="button-generate-summaries"
            >
              {generateSummariesMutation.isPending ? "Generating..." : "Generate AI Summaries"}
            </Button>
            <Link href="/admin/listings">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Listing
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {propertiesLoading ? (
          <Card className="p-8 text-center">
            <p>Loading listings...</p>
          </Card>
        ) : !properties || properties.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No listings yet</p>
            <Link href="/admin/listings">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Listing
              </Button>
            </Link>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Address</th>
                    <th className="text-left p-3">Price</th>
                    <th className="text-left p-3">Beds/Baths</th>
                    <th className="text-left p-3">MLS#</th>
                    <th className="text-left p-3">Schema</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property: any) => (
                    <tr key={property.listingKey} className="border-b">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{property.unparsedAddress}</div>
                          {property.isRental && (
                            <Badge variant="secondary" className="text-xs">
                              RENTAL
                            </Badge>
                          )}
                          {property.isActive === false && (
                            <Badge variant="destructive" className="text-xs">
                              EXPIRED
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        ${parseInt(property.listPrice).toLocaleString()}
                      </td>
                      <td className="p-3">
                        {property.bedroomsTotal || 0} bed / {(property.bathroomsFull || 0) + (property.bathroomsHalf || 0) * 0.5} bath
                      </td>
                      <td className="p-3 font-mono text-sm">
                        {property.listingId}
                      </td>
                      <td className="p-3">
                        {property.schemaSummary ? (
                          <div className="max-w-[200px]" title={property.schemaSummary}>
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              AI ✓
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1 truncate">
                              {new Date(property.schemaUpdatedAt).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="p-3">
                        <Select
                          value={property.standardStatus}
                          onValueChange={(status) => updateStatusMutation.mutate({ 
                            listingKey: property.listingKey, 
                            status 
                          })}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Active Under Contract">Active Under Contract</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Sold">Sold</SelectItem>
                            <SelectItem value="Expired">Expired</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(property)}
                            data-testid={`button-edit-${property.listingKey}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this listing?')) {
                                deleteMutation.mutate(property.listingKey);
                              }
                            }}
                            data-testid={`button-delete-${property.listingKey}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Property</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editListPrice">List Price ($)</Label>
                  <Input
                    id="editListPrice"
                    type="number"
                    value={editFormData.listPrice}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, listPrice: e.target.value }))}
                    placeholder="e.g., 350000"
                    data-testid="input-edit-list-price"
                  />
                </div>
                <div>
                  <Label htmlFor="editYearBuilt">Year Built</Label>
                  <Input
                    id="editYearBuilt"
                    type="number"
                    value={editFormData.yearBuilt}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, yearBuilt: e.target.value }))}
                    placeholder="e.g., 1995"
                    data-testid="input-edit-year-built"
                  />
                </div>
                <div>
                  <Label htmlFor="editBedrooms">Bedrooms</Label>
                  <Input
                    id="editBedrooms"
                    type="number"
                    value={editFormData.bedroomsTotal}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, bedroomsTotal: e.target.value }))}
                    placeholder="e.g., 4"
                    data-testid="input-edit-bedrooms"
                  />
                </div>
                <div>
                  <Label htmlFor="editBathroomsFull">Full Bathrooms</Label>
                  <Input
                    id="editBathroomsFull"
                    type="number"
                    value={editFormData.bathroomsFull}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, bathroomsFull: e.target.value }))}
                    placeholder="e.g., 2"
                    data-testid="input-edit-bathrooms-full"
                  />
                </div>
                <div>
                  <Label htmlFor="editBathroomsHalf">Half Bathrooms</Label>
                  <Input
                    id="editBathroomsHalf"
                    type="number"
                    value={editFormData.bathroomsHalf}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, bathroomsHalf: e.target.value }))}
                    placeholder="e.g., 1"
                    data-testid="input-edit-bathrooms-half"
                  />
                </div>
                <div>
                  <Label htmlFor="editLivingArea">Living Area (Sq Ft)</Label>
                  <Input
                    id="editLivingArea"
                    type="number"
                    value={editFormData.livingArea}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, livingArea: e.target.value }))}
                    placeholder="e.g., 2200"
                    data-testid="input-edit-living-area"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="editRemarks">Description</Label>
                <Textarea
                  id="editRemarks"
                  value={editFormData.publicRemarks}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, publicRemarks: e.target.value }))}
                  placeholder="Property description..."
                  className="h-24 resize-none"
                  data-testid="textarea-edit-remarks"
                />
              </div>

              <div>
                <Label htmlFor="editListingUrl">RE/MAX Listing URL</Label>
                <Input
                  id="editListingUrl"
                  type="url"
                  value={editFormData.listingUrl}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, listingUrl: e.target.value }))}
                  placeholder="https://example.remax.com/..."
                  data-testid="input-edit-listing-url"
                />
              </div>

              <div>
                <Label>Property Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      await handleImageUpload(file);
                    }
                  }}
                  data-testid="input-edit-image-upload"
                />
                {editFormData.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={editFormData.imageUrl} 
                      alt="Property preview" 
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a main image for this property (max 5MB, JPEG/PNG/WebP/GIF)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="editIsRental" 
                  checked={editFormData.isRental}
                  onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, isRental: checked as boolean }))}
                  data-testid="checkbox-edit-rental"
                />
                <Label htmlFor="editIsRental" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  This is a rental property (will show "FOR RENT" badge)
                </Label>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setEditDialogOpen(false)}
                  data-testid="button-cancel-edit"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveEdit}
                  disabled={editMutation.isPending}
                  data-testid="button-save-edit"
                >
                  {editMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
