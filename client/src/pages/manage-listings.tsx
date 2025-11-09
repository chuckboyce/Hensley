import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function ManageListings() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  // Fetch all properties
  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['/api/properties'],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch('/api/properties');
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
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
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
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
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
          <div className="flex gap-4">
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
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property: any) => (
                    <tr key={property.listingKey} className="border-b">
                      <td className="p-3">
                        <div className="font-medium">{property.unparsedAddress}</div>
                      </td>
                      <td className="p-3">
                        ${parseInt(property.listPrice).toLocaleString()}
                      </td>
                      <td className="p-3">
                        {property.bedroomsTotal || 0} bed / {property.bathroomsFull || 0} bath
                      </td>
                      <td className="p-3 font-mono text-sm">
                        {property.listingId}
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
