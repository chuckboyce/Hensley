import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  service: text("service").notNull(),
  message: text("message").notNull(),
  method: text("method").default("webform").notNull(),
  emailOptIn: boolean("email_opt_in").default(false).notNull(),
  smsOptIn: boolean("sms_opt_in").default(false).notNull(),
  emailConsentText: text("email_consent_text"),
  smsConsentText: text("sms_consent_text"),
  userAgent: text("user_agent"),
  pageUrl: text("page_url"),
  referrer: text("referrer"),
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  service: true,
  message: true,
  method: true,
  emailOptIn: true,
  smsOptIn: true,
  emailConsentText: true,
  smsConsentText: true,
  userAgent: true,
  pageUrl: true,
  referrer: true,
  ipAddress: true,
  timestamp: true,
}).extend({
  timestamp: z.coerce.date().optional()
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

// RESO-compliant Property schema for IDX integration
export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // RESO Identity fields
  listingKey: text("listing_key").notNull().unique(), // Primary key for RESO
  listingId: text("listing_id").notNull(),
  mlsId: text("mls_id").notNull(),
  mlsName: text("mls_name").notNull(),
  standardStatus: text("standard_status").notNull(), // Active, Pending, Sold, etc.
  mlsStatus: text("mls_status"),
  
  // Pricing and Status
  listPrice: decimal("list_price", { precision: 12, scale: 2 }).notNull(),
  closePrice: decimal("close_price", { precision: 12, scale: 2 }),
  listingContractDate: timestamp("listing_contract_date"),
  onMarketDate: timestamp("on_market_date"),
  daysOnMarket: integer("days_on_market"),
  contingency: text("contingency"),
  
  // Location fields
  unparsedAddress: text("unparsed_address").notNull(),
  streetNumber: text("street_number"),
  streetName: text("street_name"),
  streetSuffix: text("street_suffix"),
  unitNumber: text("unit_number"),
  city: text("city").notNull(),
  stateOrProvince: text("state_or_province").notNull(),
  postalCode: text("postal_code").notNull(),
  countyOrParish: text("county_or_parish"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  
  // Property details
  propertyType: text("property_type").notNull(), // Residential, Commercial, etc.
  propertySubType: text("property_sub_type"), // Single Family, Condo, etc.
  bedroomsTotal: integer("bedrooms_total"),
  bathroomsFull: integer("bathrooms_full"),
  bathroomsHalf: integer("bathrooms_half"),
  livingArea: integer("living_area"), // Square feet
  lotSizeArea: decimal("lot_size_area", { precision: 12, scale: 4 }),
  lotSizeUnits: text("lot_size_units"), // Acres, SqFt, etc.
  yearBuilt: integer("year_built"),
  storiesTotal: integer("stories_total"),
  garageSpaces: integer("garage_spaces"),
  
  // Features (extensible)
  cooling: text("cooling").array(),
  heating: text("heating").array(),
  sewer: text("sewer").array(),
  waterSource: text("water_source").array(),
  associationFee: decimal("association_fee", { precision: 8, scale: 2 }),
  associationFeeFrequency: text("association_fee_frequency"),
  
  // Media count
  photosCount: integer("photos_count").default(0),
  
  // Marketing
  publicRemarks: text("public_remarks"),
  virtualTourURLUnbranded: text("virtual_tour_url_unbranded"),
  virtualTourURLBranded: text("virtual_tour_url_branded"),
  listingUrl: text("listing_url"), // Link to full listing on RE/MAX or other site
  imageUrl: text("image_url"), // Uploaded property image (DEPRECATED - use hero_media_id)
  heroMediaId: varchar("hero_media_id"), // FK to property_media for hero image with variants
  isRental: boolean("is_rental").default(false).notNull(), // For sale vs for rent
  
  // Attribution (IDX compliance)
  listingOfficeName: text("listing_office_name").notNull(),
  listingOfficePhone: text("listing_office_phone"),
  listingAgentName: text("listing_agent_name").notNull(),
  listingAgentPhone: text("listing_agent_phone"),
  
  // Scraper tracking fields
  isActive: boolean("is_active").default(true).notNull(), // False when listing no longer appears on agent page
  lastSeen: timestamp("last_seen").defaultNow().notNull(), // Last time scraper saw this listing
  dateFound: timestamp("date_found").defaultNow().notNull(), // When listing was first discovered by scraper
  
  // AI-generated schema markup fields
  schemaSummary: text("schema_summary"), // AI-summarized description for schema markup (max 300 chars)
  schemaUpdatedAt: timestamp("schema_updated_at"), // When the schema summary was last generated
  
  // System fields
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Media resource for property photos and media
export const propertyMedia = pgTable("property_media", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mediaKey: text("media_key").notNull().unique(),
  listingKey: text("listing_key").notNull(), // Foreign key to properties
  mediaUrl: text("media_url").notNull(), // Legacy single URL (DEPRECATED - use variants)
  mediaOrder: integer("media_order").default(0),
  caption: text("caption"),
  mediaType: text("media_type").default("Photo"), // Photo, VirtualTour, etc.
  
  // Responsive image optimization fields
  variants: jsonb("variants").notNull().default('[]'), // Array of {format, width, url, fileSize}
  placeholder: text("placeholder"), // Base64-encoded blur placeholder
  originalFilename: text("original_filename"),
  originalWidth: integer("original_width"),
  originalHeight: integer("original_height"),
  originalFilesize: integer("original_filesize"),
  usage: text("usage").default("gallery"), // "gallery", "hero", "floorplan"
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  listingKeyIdx: index("property_media_listing_key_idx").on(table.listingKey),
  listingKeyUsageIdx: index("property_media_listing_key_usage_idx").on(table.listingKey, table.usage),
}));

export const insertPropertySchema = createInsertSchema(properties).pick({
  listingKey: true,
  listingId: true,
  mlsId: true,
  mlsName: true,
  standardStatus: true,
  mlsStatus: true,
  listPrice: true,
  closePrice: true,
  listingContractDate: true,
  onMarketDate: true,
  daysOnMarket: true,
  contingency: true,
  unparsedAddress: true,
  streetNumber: true,
  streetName: true,
  streetSuffix: true,
  unitNumber: true,
  city: true,
  stateOrProvince: true,
  postalCode: true,
  countyOrParish: true,
  latitude: true,
  longitude: true,
  propertyType: true,
  propertySubType: true,
  bedroomsTotal: true,
  bathroomsFull: true,
  bathroomsHalf: true,
  livingArea: true,
  lotSizeArea: true,
  lotSizeUnits: true,
  yearBuilt: true,
  storiesTotal: true,
  garageSpaces: true,
  cooling: true,
  heating: true,
  sewer: true,
  waterSource: true,
  associationFee: true,
  associationFeeFrequency: true,
  photosCount: true,
  publicRemarks: true,
  virtualTourURLUnbranded: true,
  virtualTourURLBranded: true,
  listingUrl: true,
  imageUrl: true,
  isRental: true,
  listingOfficeName: true,
  listingOfficePhone: true,
  listingAgentName: true,
  listingAgentPhone: true,
  isActive: true,
  lastSeen: true,
  dateFound: true,
});

// Schema for updating property details
export const updatePropertyDetailsSchema = insertPropertySchema
  .pick({
    listPrice: true,
    bedroomsTotal: true,
    bathroomsFull: true,
    bathroomsHalf: true,
    livingArea: true,
    yearBuilt: true,
    publicRemarks: true,
    listingUrl: true,
    imageUrl: true,
    isRental: true,
  })
  .partial()
  .superRefine((data, ctx) => {
    // Ensure at least one field is provided
    if (Object.values(data).every(v => v === undefined)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one field must be provided",
      });
    }
  });

export const insertPropertyMediaSchema = createInsertSchema(propertyMedia).pick({
  mediaKey: true,
  listingKey: true,
  mediaUrl: true,
  mediaOrder: true,
  caption: true,
  mediaType: true,
});

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;
export type UpdatePropertyDetails = z.infer<typeof updatePropertyDetailsSchema>;
export type InsertPropertyMedia = z.infer<typeof insertPropertyMediaSchema>;
export type PropertyMedia = typeof propertyMedia.$inferSelect;
