import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { ghlService } from "./services/ghl";

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

  const httpServer = createServer(app);
  return httpServer;
}
