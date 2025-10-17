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

  // Sitemap.xml for SEO
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const baseUrl = "https://hensleys-homes.com";
      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      // Define all pages with their SEO properties
      const pages = [
        {
          url: baseUrl,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: '1.0'
        },
        {
          url: `${baseUrl}#services`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.8'
        },
        {
          url: `${baseUrl}#properties`,
          lastmod: currentDate,
          changefreq: 'daily',
          priority: '0.9'
        },
        {
          url: `${baseUrl}#testimonials`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.7'
        },
        {
          url: `${baseUrl}#contact`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.8'
        }
      ];

      // Build XML sitemap
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
