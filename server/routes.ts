import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertPropertySchema, insertPropertyMediaSchema } from "@shared/schema";
import { ghlService } from "./services/ghl";
import { parseBrightMLSText, generateListingKey } from "./utils/brightmls-parser";

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

  // List all properties
  app.get("/api/properties", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
