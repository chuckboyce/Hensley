import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ArrowLeft, Upload, Eye, Save } from "lucide-react";

export default function AdminListings() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pdfText, setPdfText] = useState("");
  const [parsedData, setParsedData] = useState<any>(null);
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
    
    setIsAuthenticated(true);
    toast({
      title: "Authenticated",
      description: "Welcome to the admin panel"
    });
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
      setParsedData(data);
      
      toast({
        title: "Success",
        description: "Listing data extracted successfully!"
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

  const handleSaveListing = async () => {
    if (!parsedData) {
      toast({
        title: "Error",
        description: "Please parse the PDF text first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create property
      const propertyData = {
        listingKey: parsedData.mlsNumber || `MANUAL-${Date.now()}`,
        listingId: parsedData.mlsNumber || "",
        mlsId: "BrightMLS",
        mlsName: "BrightMLS",
        standardStatus: parsedData.status || "Active",
        listPrice: parsedData.listPrice || "0",
        unparsedAddress: `${parsedData.address}, ${parsedData.city}, ${parsedData.state} ${parsedData.zipCode}`,
        streetNumber: parsedData.address?.split(' ')[0] || "",
        streetName: parsedData.address?.substring(parsedData.address.indexOf(' ') + 1) || "",
        city: parsedData.city || "",
        stateOrProvince: parsedData.state || "DE",
        postalCode: parsedData.zipCode || "",
        propertyType: parsedData.propertyType || "Residential",
        propertySubType: parsedData.propertyType || "",
        bedroomsTotal: parsedData.bedrooms,
        bathroomsFull: parsedData.bathroomsFull,
        bathroomsHalf: parsedData.bathroomsHalf,
        livingArea: parsedData.squareFeet,
        lotSizeArea: parsedData.lotSizeAcres ? (parsedData.lotSizeAcres).toString() : undefined,
        lotSizeUnits: parsedData.lotSizeAcres ? "Acres" : undefined,
        yearBuilt: parsedData.yearBuilt,
        publicRemarks: parsedData.description || "",
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
        throw new Error("Failed to create property");
      }

      const property = await propertyResponse.json();

      // Add photos
      const validPhotos = photos.filter(p => p.trim());
      for (let i = 0; i < validPhotos.length; i++) {
        await fetch(`/api/admin/properties/${property.listingKey}/media`, {
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
      }

      toast({
        title: "Success!",
        description: "Listing published successfully"
      });

      // Reset form
      setPdfText("");
      setParsedData(null);
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
              data-testid="button-admin-login"
            >
              Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Add New Listing</h1>
          <Link href="/admin/manage-listings">
            <Button variant="outline">
              View All Listings
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Input */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Step 1: Paste BrightMLS Text</h2>
              <Textarea
                value={pdfText}
                onChange={(e) => setPdfText(e.target.value)}
                placeholder="Paste the text from BrightMLS PDF email here..."
                className="min-h-[300px] font-mono text-sm"
                data-testid="textarea-pdf-text"
              />
              <Button 
                onClick={handleParsePDF} 
                className="mt-4 w-full"
                disabled={isLoading}
                data-testid="button-parse-pdf"
              >
                <Eye className="mr-2 h-4 w-4" />
                Parse & Preview
              </Button>
            </Card>

            {parsedData && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Step 2: Add Photos</h2>
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
            )}
          </div>

          {/* Right Column: Preview */}
          <div className="space-y-6">
            {parsedData && (
              <>
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Parsed Data Preview</h2>
                  <div className="space-y-2 text-sm">
                    <div><strong>Address:</strong> {parsedData.address}, {parsedData.city}, {parsedData.state} {parsedData.zipCode}</div>
                    <div><strong>Price:</strong> ${parsedData.listPrice?.toLocaleString()}</div>
                    <div><strong>Status:</strong> {parsedData.status}</div>
                    <div><strong>MLS#:</strong> {parsedData.mlsNumber}</div>
                    <div><strong>Beds/Baths:</strong> {parsedData.bedrooms || 0} bed, {parsedData.bathroomsFull || 0} full, {parsedData.bathroomsHalf || 0} half bath</div>
                    <div><strong>Sq Ft:</strong> {parsedData.squareFeet?.toLocaleString()}</div>
                    <div><strong>Lot:</strong> {parsedData.lotSizeAcres} acres</div>
                    <div><strong>Year Built:</strong> {parsedData.yearBuilt}</div>
                    {parsedData.subdivision && <div><strong>Subdivision:</strong> {parsedData.subdivision}</div>}
                    {parsedData.schoolDistrict && <div><strong>School District:</strong> {parsedData.schoolDistrict}</div>}
                  </div>
                  {parsedData.description && (
                    <div className="mt-4">
                      <strong>Description:</strong>
                      <p className="text-sm text-muted-foreground mt-1">{parsedData.description}</p>
                    </div>
                  )}
                </Card>

                <Button
                  onClick={handleSaveListing}
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                  data-testid="button-save-listing"
                >
                  <Save className="mr-2 h-5 w-5" />
                  Publish Listing
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
