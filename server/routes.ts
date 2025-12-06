import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertPropertySchema, insertPropertyMediaSchema, updatePropertyDetailsSchema } from "@shared/schema";
import { ghlService } from "./services/ghl";
import { parseBrightMLSText, generateListingKey } from "./utils/brightmls-parser";
import { pingSearchEngines } from "./utils/search-engine-ping";
import { optimizePropertyImage } from "./utils/image-optimizer";
import { syncListings } from "../scripts/sync-listings";
import { generatePropertySummary } from "./aiSummary";
import { generateFullPageSchema, generatePropertySchema, generatePropertyListSchema } from "./utils/schemaGenerator";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import fs from "fs/promises";

// Simple admin password middleware
function adminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const password = process.env.ADMIN_PASSWORD;
  
  if (!password) {
    return res.status(500).json({ error: "Admin password not configured" });
  }
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Unauthorized - Missing credentials" });
  }
  
  const token = authHeader.substring(7);
  
  if (token !== password) {
    return res.status(401).json({ error: "Unauthorized - Invalid credentials" });
  }
  
  next();
}

// Configure multer for image uploads (memory storage for optimization)
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (pre-optimization)
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      
      // Capture IP address from request headers
      const ipAddress = req.headers['x-forwarded-for'] 
        ? (req.headers['x-forwarded-for'] as string).split(',')[0].trim()
        : req.socket.remoteAddress || 'unknown';
      
      // Prepare data with IP and convert null to undefined for optional fields
      const submissionData = {
        ...validatedData,
        ipAddress,
        phone: validatedData.phone || undefined,
        emailConsentText: validatedData.emailConsentText || undefined,
        smsConsentText: validatedData.smsConsentText || undefined,
        userAgent: validatedData.userAgent || undefined,
        pageUrl: validatedData.pageUrl || undefined,
        referrer: validatedData.referrer || undefined
      };
      
      // Process contact form submission with GHL integration
      const result = await ghlService.processContactFormSubmission(
        submissionData,
        (data) => storage.createContact(data)
      );
      
      res.json(result);
    } catch (error) {
      console.error("Error creating contact:", error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Invalid contact data" 
      });
    }
  });

  // GHL Health check endpoint
  app.get("/api/ghl/health", async (req, res) => {
    try {
      const health = await ghlService.healthCheck();
      res.json(health);
    } catch (error) {
      console.error("Error checking GHL health:", error);
      res.status(500).json({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Get all contacts (for admin purposes)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // Resend a contact to GoHighLevel (creates contact + sends messages)
  app.post("/api/contacts/:id/resend-to-ghl", async (req, res) => {
    try {
      const { id } = req.params;
      const { ghlContactId } = req.body; // Optional: specify existing GHL contact ID
      
      const contacts = await storage.getContacts();
      const contact = contacts.find(c => c.id === id);
      
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }

      console.log(`📤 Resending contact ${id} to GoHighLevel...`);

      // Prepare data for GHL
      const ghlFormData = {
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone || undefined,
        service: contact.service,
        message: contact.message,
        method: contact.method || 'webform',
        emailOptIn: contact.emailOptIn,
        smsOptIn: contact.smsOptIn,
        emailConsentText: contact.emailConsentText || undefined,
        smsConsentText: contact.smsConsentText || undefined,
        userAgent: contact.userAgent || undefined,
        pageUrl: contact.pageUrl || undefined,
        referrer: contact.referrer || undefined,
        ipAddress: contact.ipAddress || undefined,
        evidenceId: contact.id,
        timestamp: contact.timestamp?.toISOString() || new Date().toISOString()
      };

      const ghlContact = await ghlService.createContactFromForm(ghlFormData);
      
      console.log(`✅ Successfully resent contact to GHL: ${ghlContact.id}`);
      
      res.json({
        success: true,
        message: "Contact resent to GoHighLevel successfully",
        ghlContactId: ghlContact.id,
        localContactId: contact.id
      });
    } catch (error) {
      console.error("❌ Error resending contact to GHL:", error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : "Failed to resend contact" 
      });
    }
  });

  // List active properties (public)
  app.get("/api/properties", async (req, res) => {
    try {
      // Show only active listings to the public
      const properties = await storage.listActiveProperties();
      res.json(properties);
    } catch (error) {
      console.error("Error listing properties:", error);
      res.status(500).json({ error: "Failed to list properties" });
    }
  });

  // List all properties including inactive (admin)
  app.get("/api/admin/properties/all", adminAuth, async (req, res) => {
    try {
      const properties = await storage.listProperties();
      res.json(properties);
    } catch (error) {
      console.error("Error listing properties:", error);
      res.status(500).json({ error: "Failed to list properties" });
    }
  });

  // Get a specific property by listingKey
  app.get("/api/properties/:listingKey", async (req, res) => {
    try {
      const { listingKey } = req.params as { listingKey: string };
      const property = await storage.getProperty(listingKey);
      if (!property) return res.status(404).json({ error: "Property not found" });
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ error: "Failed to fetch property" });
    }
  });

  // Get media for a property
  app.get("/api/properties/:listingKey/media", async (req, res) => {
    try {
      const { listingKey } = req.params as { listingKey: string };
      const property = await storage.getProperty(listingKey);
      if (!property) return res.status(404).json({ error: "Property not found" });
      const media = await storage.getPropertyMedia(listingKey);
      res.json(media);
    } catch (error) {
      console.error("Error fetching property media:", error);
      res.status(500).json({ error: "Failed to fetch property media" });
    }
  });

  // Admin: Parse BrightMLS text (preview before saving)
  app.post("/api/admin/parse-listing", adminAuth, async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }
      
      const parsed = parseBrightMLSText(text);
      res.json(parsed);
    } catch (error) {
      console.error("Error parsing listing text:", error);
      res.status(500).json({ error: "Failed to parse listing text" });
    }
  });

  // Admin: Upload property image (with automatic optimization)
  app.post("/api/admin/upload-image", adminAuth, imageUpload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }
      
      const optimized = await optimizePropertyImage(req.file.buffer, req.file.originalname);
      
      const largestJpeg = optimized.variants
        .filter(v => v.format === 'jpeg')
        .sort((a, b) => b.width - a.width)[0];
      
      res.json({ 
        imageUrl: largestJpeg?.url || optimized.variants[0]?.url,
        variants: optimized.variants,
        placeholder: optimized.placeholder,
        originalFilename: optimized.originalFilename
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to upload image" });
    }
  });

  // Admin: Create property
  app.post("/api/admin/properties", adminAuth, async (req, res) => {
    try {
      const validatedData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(validatedData);
      res.json(property);
    } catch (error) {
      console.error("Error creating property:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid property data" });
    }
  });

  // Admin: Update property status
  app.patch("/api/admin/properties/:listingKey/status", adminAuth, async (req, res) => {
    try {
      const { listingKey } = req.params as { listingKey: string };
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const property = await storage.updatePropertyStatus(listingKey, status);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      
      res.json(property);
    } catch (error) {
      console.error("Error updating property status:", error);
      res.status(500).json({ error: "Failed to update property status" });
    }
  });

  // Admin: Update property details (image and rental status)
  app.patch("/api/admin/properties/:listingKey", adminAuth, async (req, res) => {
    try {
      const { listingKey } = req.params as { listingKey: string };
      
      // Validate request body using safeParse
      const result = updatePropertyDetailsSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: result.error.errors 
        });
      }
      
      const updated = await storage.updatePropertyDetails(listingKey, result.data);
      
      if (!updated) {
        return res.status(404).json({ error: "Property not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(500).json({ error: "Failed to update property" });
    }
  });

  // Admin: Delete property
  app.delete("/api/admin/properties/:listingKey", adminAuth, async (req, res) => {
    try {
      const { listingKey } = req.params as { listingKey: string };
      const deleted = await storage.deleteProperty(listingKey);
      
      if (!deleted) {
        return res.status(404).json({ error: "Property not found" });
      }
      
      res.json({ success: true, message: "Property deleted successfully" });
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).json({ error: "Failed to delete property" });
    }
  });

  // Admin: Add property media
  app.post("/api/admin/properties/:listingKey/media", adminAuth, async (req, res) => {
    try {
      const { listingKey } = req.params as { listingKey: string };
      
      // Check if property exists
      const property = await storage.getProperty(listingKey);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      
      const validatedData = insertPropertyMediaSchema.parse({
        ...req.body,
        listingKey
      });
      
      const media = await storage.createPropertyMedia(validatedData);
      res.json(media);
    } catch (error) {
      console.error("Error creating property media:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid media data" });
    }
  });

  // Admin: Ping search engines with sitemap
  app.post("/api/admin/ping-search-engines", adminAuth, async (req, res) => {
    try {
      // Get the base URL from the request or use default
      const protocol = req.protocol;
      const host = req.get('host') || 'hensleys-homes.com';
      const sitemapUrl = `${protocol}://${host}/sitemap.xml`;
      
      console.log(`Pinging search engines with sitemap: ${sitemapUrl}`);
      const results = await pingSearchEngines(sitemapUrl);
      
      res.json({
        success: true,
        sitemapUrl,
        results
      });
    } catch (error) {
      console.error("Error pinging search engines:", error);
      res.status(500).json({ error: "Failed to ping search engines" });
    }
  });

  // Admin: Sync listings from RE/MAX website
  app.post("/api/admin/sync-listings", adminAuth, async (req, res) => {
    try {
      console.log("[API] Starting listing sync...");
      const result = await syncListings();
      
      res.json({
        success: result.success,
        summary: {
          newListings: result.newListings,
          updatedListings: result.updatedListings,
          expiredListings: result.expiredListings,
        },
        errors: result.errors,
        timestamp: result.timestamp,
      });
    } catch (error) {
      console.error("Error syncing listings:", error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : "Failed to sync listings" 
      });
    }
  });

  // Admin: Manually trigger AI summary generation for all properties
  app.post("/api/admin/generate-summaries", adminAuth, async (req, res) => {
    try {
      const propertiesNeedingSummary = await storage.getPropertiesNeedingSummary();
      
      if (propertiesNeedingSummary.length === 0) {
        return res.json({
          success: true,
          message: "No properties need summary generation",
          generated: 0
        });
      }
      
      // Start background generation and respond immediately
      res.json({
        success: true,
        message: `Starting AI summary generation for ${propertiesNeedingSummary.length} properties...`,
        propertiesQueued: propertiesNeedingSummary.length
      });
      
      // Generate summaries in background after response
      generateSummariesInBackground();
    } catch (error) {
      console.error("Error triggering summary generation:", error);
      res.status(500).json({ error: "Failed to trigger summary generation" });
    }
  });

  // Background function to generate AI summaries for properties
  async function generateSummariesInBackground() {
    try {
      const propertiesNeedingSummary = await storage.getPropertiesNeedingSummary();
      
      if (propertiesNeedingSummary.length === 0) {
        console.log("[AI Summary] No properties need summary generation");
        return;
      }
      
      console.log(`[AI Summary] Generating summaries for ${propertiesNeedingSummary.length} properties...`);
      
      for (const property of propertiesNeedingSummary) {
        try {
          const summary = await generatePropertySummary({
            address: property.unparsedAddress,
            city: property.city,
            stateOrProvince: property.stateOrProvince,
            postalCode: property.postalCode,
            listPrice: property.listPrice,
            bedroomsTotal: property.bedroomsTotal,
            bathroomsFull: property.bathroomsFull,
            livingArea: property.livingArea,
            yearBuilt: property.yearBuilt,
            publicRemarks: property.publicRemarks,
            isRental: property.isRental,
          });
          
          await storage.updateSchemaSummary(property.listingKey, summary);
          console.log(`[AI Summary] Generated summary for ${property.listingKey}: ${summary.substring(0, 50)}...`);
          
          // Small delay between API calls to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (err) {
          console.error(`[AI Summary] Error generating summary for ${property.listingKey}:`, err);
        }
      }
      
      console.log("[AI Summary] Finished generating summaries");
    } catch (error) {
      console.error("[AI Summary] Error in background summary generation:", error);
    }
  }

  // Webhook: Receive listing data from external scraper
  app.post("/api/webhook/listings", adminAuth, async (req, res) => {
    try {
      console.log("[Webhook] Received listing data push...");
      
      let listingData = req.body;
      
      // Validate that we received an object
      if (!listingData || typeof listingData !== 'object') {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid data format. Expected JSON object with MLS IDs as keys." 
        });
      }
      
      // Support wrapped format: { listings: { DENC123: {...}, ... } }
      // If there's a "listings" key containing an object, use that instead
      if (listingData.listings && typeof listingData.listings === 'object') {
        console.log("[Webhook] Found wrapped format with 'listings' key, unwrapping...");
        listingData = listingData.listings;
      }
      
      // Filter to only valid MLS IDs (e.g., DENC2093782, MDDO12345, etc.)
      // Skip metadata keys like "type", "timestamp", "listings", "count", "message"
      const mlsIdPattern = /^[A-Z]{2,4}\d+$/;
      const allKeys = Object.keys(listingData);
      const mlsIds = allKeys.filter(key => mlsIdPattern.test(key));
      
      console.log(`[Webhook] Received ${allKeys.length} keys, ${mlsIds.length} are valid MLS IDs...`);
      
      if (mlsIds.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: "No valid MLS IDs found. Keys should match pattern like DENC2093782." 
        });
      }
      
      let newCount = 0;
      let updatedCount = 0;
      const errors: string[] = [];
      
      // Process each listing
      for (const mlsId of mlsIds) {
        try {
          const listing = listingData[mlsId];
          
          // Convert to ScrapedListing format
          const scraped = {
            mlsid: listing.mlsid || mlsId,
            address: listing.address || '',
            price: listing.price || listing.Price || '0',
            url: listing.url || '',
            detail_url: listing.detail_url || listing.url || '',
            cover_photo_url: listing.cover_photo_url || '',
            description: listing.description || '',
            Bedrooms: listing.Bedrooms || listing['Bedrooms'] || '',
            Bathrooms: listing['Full Bathrooms'] || listing.Bathrooms || '',
            'Full Bathrooms': listing['Full Bathrooms'] || '',
            'Square Feet': listing['Sqr Footage'] || listing['Square Feet'] || '',
            'Sqr Footage': listing['Sqr Footage'] || '',
            'Year Built': listing['Year Built'] || '',
            // Additional fields
            City: listing.City || '',
            County: listing.County || '',
            Zip: listing.Zip || '',
            Neighborhood: listing.Neighborhood || '',
            Style: listing.Style || '',
            Type: listing.Type || '',
            'Listing Status': listing['Listing Status'] || 'Active',
          };
          
          // Determine if this is a rental based on Type or price
          const isRental = listing.Type === 'Rentals' || 
            (listing.price && !listing.price.includes(',') && parseInt(listing.price.replace(/[$,]/g, '')) < 10000);
          
          const { property, isNew } = await storage.upsertPropertyFromScraper(scraped);
          
          // Update rental status if needed
          if (isRental && !property.isRental) {
            await storage.updatePropertyDetails(property.listingKey, { isRental: true });
          }
          
          if (isNew) {
            newCount++;
            console.log(`[Webhook] New listing: ${mlsId} - ${listing.address}`);
          } else {
            updatedCount++;
          }
        } catch (err: any) {
          console.error(`[Webhook] Error processing ${mlsId}:`, err.message);
          errors.push(`${mlsId}: ${err.message}`);
        }
      }
      
      // Mark listings not in this batch as inactive
      const expiredCount = await storage.markInactiveExcept(mlsIds);
      
      console.log(`[Webhook] Sync complete: ${newCount} new, ${updatedCount} updated, ${expiredCount} expired`);
      
      // Generate AI summaries for properties that need them (async, don't block response)
      generateSummariesInBackground().catch(err => {
        console.error("[Webhook] Error generating AI summaries:", err);
      });
      
      res.json({
        success: true,
        summary: {
          received: mlsIds.length,
          newListings: newCount,
          updatedListings: updatedCount,
          expiredListings: expiredCount,
        },
        errors: errors.length > 0 ? errors : undefined,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[Webhook] Error processing listings:", error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : "Failed to process listings" 
      });
    }
  });

  // Get only active properties (for public display)
  app.get("/api/properties/active", async (req, res) => {
    try {
      const activeProperties = await storage.listActiveProperties();
      res.json(activeProperties);
    } catch (error) {
      console.error("Error fetching active properties:", error);
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  // Get JSON-LD schema for properties page (for SEO/AEO)
  app.get("/api/schema/properties", async (req, res) => {
    try {
      const protocol = req.protocol;
      const host = req.get('host') || 'hensleyshomes.com';
      const baseUrl = host.includes('localhost') || host.includes('replit') 
        ? `${protocol}://${host}` 
        : 'https://hensleyshomes.com';
      
      const activeProperties = await storage.listActiveProperties();
      const schemaJson = generateFullPageSchema(activeProperties, baseUrl);
      
      res.header('Content-Type', 'application/ld+json');
      res.header('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      res.send(schemaJson);
    } catch (error) {
      console.error("Error generating schema:", error);
      res.status(500).json({ error: "Failed to generate schema" });
    }
  });

  // Get JSON-LD schema for a single property
  app.get("/api/schema/property/:listingKey", async (req, res) => {
    try {
      const { listingKey } = req.params;
      const property = await storage.getProperty(listingKey);
      
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      
      const protocol = req.protocol;
      const host = req.get('host') || 'hensleyshomes.com';
      const baseUrl = host.includes('localhost') || host.includes('replit') 
        ? `${protocol}://${host}` 
        : 'https://hensleyshomes.com';
      
      const schema = generatePropertySchema({ property, baseUrl });
      
      res.header('Content-Type', 'application/ld+json');
      res.header('Cache-Control', 'public, max-age=3600');
      res.send(JSON.stringify(schema));
    } catch (error) {
      console.error("Error generating property schema:", error);
      res.status(500).json({ error: "Failed to generate schema" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
