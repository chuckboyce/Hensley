import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ArrowLeft, Upload, Eye, Save } from "lucide-react";

export default function AdminListings() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pdfText, setPdfText] = useState("");
  
  // Editable form fields
  const [formData, setFormData] = useState({
    mlsNumber: "",
    address: "",
    city: "",
    state: "DE",
    zipCode: "",
    listPrice: "",
    status: "Active",
    bedrooms: "",
    bathroomsFull: "",
    bathroomsHalf: "",
    squareFeet: "",
    lotSizeAcres: "",
    yearBuilt: "",
    description: "",
    propertyType: "Residential",
    subdivision: "",
    schoolDistrict: "",
    listingUrl: "",
    imageUrl: ""
  });
  
  const [photos, setPhotos] = useState<string[]>(['']);
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
      // Validate credentials by calling parse endpoint with empty text
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
      toast({
        title: "Authenticated",
        description: "Welcome to the admin panel"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed. Please check your password.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleParsePDF = async () => {
    if (!pdfText.trim()) {
      toast({
        title: "Error",
        description: "Please paste the BrightMLS PDF text",
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
        body: JSON.stringify({ text: pdfText })
      });

      if (!response.ok) {
        throw new Error("Failed to parse listing");
      }

      const data = await response.json();
      
      // Populate form with parsed data
      setFormData({
        mlsNumber: data.mlsNumber || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "DE",
        zipCode: data.zipCode || "",
        listPrice: data.listPrice || "",
        status: data.status || "Active",
        bedrooms: data.bedrooms?.toString() || "",
        bathroomsFull: data.bathroomsFull?.toString() || "",
        bathroomsHalf: data.bathroomsHalf?.toString() || "",
        squareFeet: data.squareFeet?.toString() || "",
        lotSizeAcres: data.lotSizeAcres?.toString() || "",
        yearBuilt: data.yearBuilt?.toString() || "",
        description: data.description || "",
        propertyType: data.propertyType || "Residential",
        subdivision: data.subdivision || "",
        schoolDistrict: data.schoolDistrict || "",
        listingUrl: "",
        imageUrl: ""
      });
      
      toast({
        title: "Success",
        description: "Listing data extracted! Review and edit fields as needed."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to parse listing",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPhotoField = () => {
    setPhotos([...photos, '']);
  };

  const handlePhotoChange = (index: number, value: string) => {
    const newPhotos = [...photos];
    newPhotos[index] = value;
    setPhotos(newPhotos);
  };

  const validateForm = (): boolean => {
    const required = ['address', 'city', 'state', 'zipCode', 'listPrice'];
    const missing = required.filter(field => !formData[field as keyof typeof formData]);
    
    if (missing.length > 0) {
      toast({
        title: "Validation Error",
        description: `Missing required fields: ${missing.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSaveListing = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Extract street number and name safely
      let streetNumber = "";
      let streetName = "";
      
      if (formData.address) {
        const parts = formData.address.split(' ');
        streetNumber = parts[0] || "";
        streetName = parts.slice(1).join(' ') || "";
      }

      // Create property
      const propertyData = {
        listingKey: formData.mlsNumber || `MANUAL-${Date.now()}`,
        listingId: formData.mlsNumber || "",
        mlsId: "BrightMLS",
        mlsName: "BrightMLS",
        standardStatus: formData.status,
        listPrice: formData.listPrice,
        unparsedAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        streetNumber,
        streetName,
        city: formData.city,
        stateOrProvince: formData.state,
        postalCode: formData.zipCode,
        propertyType: formData.propertyType,
        propertySubType: formData.propertyType,
        bedroomsTotal: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathroomsFull: formData.bathroomsFull ? parseInt(formData.bathroomsFull) : undefined,
        bathroomsHalf: formData.bathroomsHalf ? parseInt(formData.bathroomsHalf) : undefined,
        livingArea: formData.squareFeet ? parseInt(formData.squareFeet) : undefined,
        lotSizeArea: formData.lotSizeAcres || undefined,
        lotSizeUnits: formData.lotSizeAcres ? "Acres" : undefined,
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
        publicRemarks: formData.description || "",
        listingUrl: formData.listingUrl || undefined,
        imageUrl: formData.imageUrl || undefined,
        listingOfficeName: "RE/MAX Eagle Realty",
        listingAgentName: "Kevin Hensley"
      };

      const propertyResponse = await fetch("/api/admin/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`
        },
        body: JSON.stringify(propertyData)
      });

      if (!propertyResponse.ok) {
        const error = await propertyResponse.json();
        throw new Error(error.error || "Failed to create property");
      }

      const property = await propertyResponse.json();

      // Add photos with error checking
      const validPhotos = photos.filter(p => p.trim());
      let photoErrors = 0;
      
      for (let i = 0; i < validPhotos.length; i++) {
        try {
          const mediaResponse = await fetch(`/api/admin/properties/${property.listingKey}/media`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${password}`
            },
            body: JSON.stringify({
              mediaKey: `${property.listingKey}-${i}`,
              mediaUrl: validPhotos[i],
              mediaOrder: i,
              mediaType: "Photo"
            })
          });
          
          if (!mediaResponse.ok) {
            photoErrors++;
            console.error(`Failed to upload photo ${i + 1}`);
          }
        } catch (error) {
          photoErrors++;
          console.error(`Error uploading photo ${i + 1}:`, error);
        }
      }

      if (photoErrors > 0) {
        toast({
          title: "Partial Success",
          description: `Listing published but ${photoErrors} photo(s) failed to upload`
        });
      } else {
        toast({
          title: "Success!",
          description: "Listing published successfully"
        });
      }

      // Reset form
      setPdfText("");
      setFormData({
        mlsNumber: "",
        address: "",
        city: "",
        state: "DE",
        zipCode: "",
        listPrice: "",
        status: "Active",
        bedrooms: "",
        bathroomsFull: "",
        bathroomsHalf: "",
        squareFeet: "",
        lotSizeAcres: "",
        yearBuilt: "",
        description: "",
        propertyType: "Residential",
        subdivision: "",
        schoolDistrict: "",
        listingUrl: "",
        imageUrl: ""
      });
      setPhotos(['']);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save listing",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-3xl font-bold">Add New Listing</h1>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: PDF Parser */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Step 1: Paste BrightMLS PDF Text</h2>
              <Textarea
                value={pdfText}
                onChange={(e) => setPdfText(e.target.value)}
                placeholder="Paste the text from BrightMLS PDF email here..."
                className="min-h-[200px] font-mono text-sm"
                data-testid="textarea-pdf-text"
              />
              <Button 
                onClick={handleParsePDF} 
                className="mt-4 w-full"
                disabled={isLoading}
                data-testid="button-parse-pdf"
              >
                <Eye className="mr-2 h-4 w-4" />
                {isLoading ? "Parsing..." : "Parse & Fill Form"}
              </Button>
            </Card>
          </div>

          {/* Right Column: Editable Form */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Step 2: Review & Edit Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>MLS Number *</Label>
                    <Input
                      value={formData.mlsNumber}
                      onChange={(e) => setFormData({...formData, mlsNumber: e.target.value})}
                      placeholder="DENC2091894"
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                      <SelectTrigger>
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
                  </div>
                </div>

                <div>
                  <Label>Address *</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="636 Courtly Rd"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>City *</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="Townsend"
                    />
                  </div>
                  <div>
                    <Label>State *</Label>
                    <Input
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      placeholder="DE"
                    />
                  </div>
                  <div>
                    <Label>ZIP *</Label>
                    <Input
                      value={formData.zipCode}
                      onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                      placeholder="19734"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>List Price *</Label>
                    <Input
                      value={formData.listPrice}
                      onChange={(e) => setFormData({...formData, listPrice: e.target.value})}
                      placeholder="374900"
                    />
                  </div>
                  <div>
                    <Label>Property Type</Label>
                    <Input
                      value={formData.propertyType}
                      onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                      placeholder="Residential"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label>Beds</Label>
                    <Input
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                      placeholder="3"
                    />
                  </div>
                  <div>
                    <Label>Full Baths</Label>
                    <Input
                      value={formData.bathroomsFull}
                      onChange={(e) => setFormData({...formData, bathroomsFull: e.target.value})}
                      placeholder="2"
                    />
                  </div>
                  <div>
                    <Label>Half Baths</Label>
                    <Input
                      value={formData.bathroomsHalf}
                      onChange={(e) => setFormData({...formData, bathroomsHalf: e.target.value})}
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <Label>Sq Ft</Label>
                    <Input
                      value={formData.squareFeet}
                      onChange={(e) => setFormData({...formData, squareFeet: e.target.value})}
                      placeholder="2175"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Lot Size (acres)</Label>
                    <Input
                      value={formData.lotSizeAcres}
                      onChange={(e) => setFormData({...formData, lotSizeAcres: e.target.value})}
                      placeholder="0.10"
                    />
                  </div>
                  <div>
                    <Label>Year Built</Label>
                    <Input
                      value={formData.yearBuilt}
                      onChange={(e) => setFormData({...formData, yearBuilt: e.target.value})}
                      placeholder="2014"
                    />
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Property description..."
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label>RE/MAX Listing URL</Label>
                  <Input
                    value={formData.listingUrl}
                    onChange={(e) => setFormData({...formData, listingUrl: e.target.value})}
                    placeholder="https://www.remax.com/property/..."
                    data-testid="input-listing-url"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Link to the full listing on RE/MAX website
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Step 3: Upload Main Image (Optional)</h2>
              <div className="space-y-4">
                <div>
                  <Label>Upload Property Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
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
                            setFormData(prev => ({...prev, imageUrl}));
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
                      }
                    }}
                    data-testid="input-image-upload"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload a single main image for this property (max 5MB, JPEG/PNG/WebP/GIF)
                  </p>
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img src={formData.imageUrl} alt="Preview" className="max-w-sm rounded border" />
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Step 4: Add Photo URLs (Optional)</h2>
              <div className="space-y-3">
                {photos.map((photo, index) => (
                  <div key={index}>
                    <Label>Photo URL {index + 1}</Label>
                    <Input
                      value={photo}
                      onChange={(e) => handlePhotoChange(index, e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      data-testid={`input-photo-${index}`}
                    />
                  </div>
                ))}
                <Button
                  onClick={handleAddPhotoField}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  data-testid="button-add-photo"
                >
                  + Add Another Photo
                </Button>
              </div>
            </Card>

            <Button
              onClick={handleSaveListing}
              className="w-full"
              size="lg"
              disabled={isLoading}
              data-testid="button-save-listing"
            >
              <Save className="mr-2 h-5 w-5" />
              {isLoading ? "Publishing..." : "Publish Listing"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
