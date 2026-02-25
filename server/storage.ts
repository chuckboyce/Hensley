// Database integration blueprint: javascript_database
import { users, contacts, properties, propertyMedia, rssFeeds, cmsArticles, type User, type InsertUser, type Contact, type InsertContact, type Property, type InsertProperty, type UpdatePropertyDetails, type PropertyMedia, type InsertPropertyMedia, type RssFeed, type InsertRssFeed, type CmsArticle, type InsertCmsArticle } from "@shared/schema";
import { db } from "./db";
import { eq, desc, notInArray, and, lt, or, isNull, sql, arrayContains, inArray } from "drizzle-orm";
import { randomUUID } from "crypto";

// Type for scraped listing data
export interface ScrapedListing {
  mlsid: string;
  address: string;
  price: string;
  url: string;
  detail_url?: string;
  cover_photo_url?: string;
  description?: string;
  date_scraped?: string;
  is_new?: boolean;
  // Additional attributes from page details
  [key: string]: any;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  listProperties(): Promise<Property[]>;
  listActiveProperties(): Promise<Property[]>;
  getProperty(listingKey: string): Promise<Property | undefined>;
  getPropertyByMlsId(mlsId: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updatePropertyStatus(listingKey: string, status: string): Promise<Property | undefined>;
  updatePropertyDetails(listingKey: string, updates: UpdatePropertyDetails): Promise<Property | undefined>;
  upsertPropertyFromScraper(scraped: ScrapedListing): Promise<{ property: Property; isNew: boolean }>;
  markInactiveExcept(activeMlsIds: string[]): Promise<number>;
  deleteProperty(listingKey: string): Promise<boolean>;
  getPropertyMedia(listingKey: string): Promise<PropertyMedia[]>;
  createPropertyMedia(media: InsertPropertyMedia): Promise<PropertyMedia>;
  // CMS: RSS Feeds
  listRssFeeds(): Promise<RssFeed[]>;
  getRssFeed(id: string): Promise<RssFeed | undefined>;
  createRssFeed(feed: InsertRssFeed): Promise<RssFeed>;
  updateRssFeed(id: string, updates: Partial<InsertRssFeed>): Promise<RssFeed | undefined>;
  deleteRssFeed(id: string): Promise<boolean>;
  updateFeedLastFetched(id: string): Promise<void>;
  // CMS: Articles
  listCmsArticles(status?: string): Promise<CmsArticle[]>;
  listCmsArticlesByLocation(locationTag: string): Promise<CmsArticle[]>;
  getCmsArticle(id: string): Promise<CmsArticle | undefined>;
  getCmsArticleByUrl(url: string): Promise<CmsArticle | undefined>;
  createCmsArticle(article: InsertCmsArticle): Promise<CmsArticle>;
  updateCmsArticle(id: string, updates: Partial<CmsArticle>): Promise<CmsArticle | undefined>;
  deleteCmsArticle(id: string): Promise<boolean>;
  publishCmsArticle(id: string): Promise<CmsArticle | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt));
  }

  async listProperties(): Promise<Property[]> {
    return await db
      .select()
      .from(properties)
      .orderBy(desc(properties.listingId));
  }

  async listActiveProperties(): Promise<Property[]> {
    return await db
      .select()
      .from(properties)
      .where(eq(properties.isActive, true))
      .orderBy(desc(properties.listingId));
  }

  async getProperty(listingKey: string): Promise<Property | undefined> {
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.listingKey, listingKey));
    return property || undefined;
  }

  async getPropertyByMlsId(mlsId: string): Promise<Property | undefined> {
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.listingId, mlsId));
    return property || undefined;
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const [property] = await db
      .insert(properties)
      .values(insertProperty)
      .returning();
    return property;
  }

  async updatePropertyStatus(listingKey: string, status: string): Promise<Property | undefined> {
    const [property] = await db
      .update(properties)
      .set({ standardStatus: status })
      .where(eq(properties.listingKey, listingKey))
      .returning();
    return property || undefined;
  }

  async updatePropertyDetails(listingKey: string, updates: UpdatePropertyDetails): Promise<Property | undefined> {
    // Build update object, excluding undefined fields
    const updateData: any = { lastUpdated: new Date() };
    
    if (updates.unparsedAddress !== undefined) {
      updateData.unparsedAddress = updates.unparsedAddress;
    }
    if (updates.listPrice !== undefined) {
      updateData.listPrice = updates.listPrice;
    }
    if (updates.bedroomsTotal !== undefined) {
      updateData.bedroomsTotal = updates.bedroomsTotal;
    }
    if (updates.bathroomsFull !== undefined) {
      updateData.bathroomsFull = updates.bathroomsFull;
    }
    if (updates.bathroomsHalf !== undefined) {
      updateData.bathroomsHalf = updates.bathroomsHalf;
    }
    if (updates.livingArea !== undefined) {
      updateData.livingArea = updates.livingArea;
    }
    if (updates.yearBuilt !== undefined) {
      updateData.yearBuilt = updates.yearBuilt;
    }
    if (updates.publicRemarks !== undefined) {
      updateData.publicRemarks = updates.publicRemarks;
    }
    if (updates.listingUrl !== undefined) {
      updateData.listingUrl = updates.listingUrl;
    }
    if (updates.imageUrl !== undefined) {
      updateData.imageUrl = updates.imageUrl;
    }
    if (updates.isRental !== undefined) {
      updateData.isRental = updates.isRental;
    }
    
    // Guard against empty updates (should be caught by schema, but defensive check)
    if (Object.keys(updateData).length === 1) { // Only has lastUpdated
      throw new Error("No fields to update");
    }
    
    const [property] = await db
      .update(properties)
      .set(updateData)
      .where(eq(properties.listingKey, listingKey))
      .returning();
    
    return property || undefined;
  }

  async upsertPropertyFromScraper(scraped: ScrapedListing): Promise<{ property: Property; isNew: boolean }> {
    const now = new Date();
    
    // Check if property already exists by MLS ID
    const existing = await this.getPropertyByMlsId(scraped.mlsid);
    
    // Parse price - remove $ and commas
    const priceStr = scraped.price.replace(/[$,]/g, '');
    const listPrice = priceStr || '0';
    
    // Parse bedrooms/bathrooms from scraped attributes (handle both old and new field names)
    const bedroomsTotal = scraped['Bedrooms'] ? parseInt(scraped['Bedrooms']) : undefined;
    const bathroomsFull = (scraped['Bathrooms'] || scraped['Full Bathrooms']) 
      ? parseInt(scraped['Bathrooms'] || scraped['Full Bathrooms']) 
      : undefined;
    const livingAreaStr = scraped['Square Feet'] || scraped['Sqr Footage'] || '';
    const livingArea = livingAreaStr ? parseInt(livingAreaStr.replace(/,/g, '')) : undefined;
    const yearBuilt = scraped['Year Built'] ? parseInt(scraped['Year Built']) : undefined;
    
    // Extract city and zip from scraped data
    const city = scraped['City'] || '';
    const postalCode = scraped['Zip'] || '';
    
    if (existing) {
      // Update existing property
      const [property] = await db
        .update(properties)
        .set({
          listPrice: listPrice,
          unparsedAddress: scraped.address,
          listingUrl: scraped.detail_url || scraped.url,
          imageUrl: scraped.cover_photo_url || existing.imageUrl,
          publicRemarks: scraped.description || existing.publicRemarks,
          bedroomsTotal: bedroomsTotal ?? existing.bedroomsTotal,
          bathroomsFull: bathroomsFull ?? existing.bathroomsFull,
          livingArea: livingArea ?? existing.livingArea,
          yearBuilt: yearBuilt ?? existing.yearBuilt,
          city: city || existing.city,
          postalCode: postalCode || existing.postalCode,
          isActive: true,
          lastSeen: now,
          lastUpdated: now,
        })
        .where(eq(properties.listingKey, existing.listingKey))
        .returning();
      
      return { property, isNew: false };
    } else {
      // Create new property
      const listingKey = `remax-${scraped.mlsid}`;
      
      const [property] = await db
        .insert(properties)
        .values({
          listingKey,
          listingId: scraped.mlsid,
          mlsId: 'BrightMLS',
          mlsName: 'BrightMLS',
          standardStatus: 'Active',
          listPrice: listPrice,
          unparsedAddress: scraped.address,
          city: city || 'Delaware',
          stateOrProvince: 'DE',
          postalCode: postalCode,
          propertyType: 'Residential',
          listingUrl: scraped.detail_url || scraped.url,
          imageUrl: scraped.cover_photo_url || '',
          publicRemarks: scraped.description || '',
          bedroomsTotal,
          bathroomsFull,
          livingArea,
          yearBuilt,
          listingOfficeName: 'RE/MAX',
          listingAgentName: 'Kevin Hensley',
          isActive: true,
          lastSeen: now,
          dateFound: now,
        })
        .returning();
      
      return { property, isNew: true };
    }
  }

  async markInactiveExcept(activeMlsIds: string[]): Promise<number> {
    if (activeMlsIds.length === 0) {
      // If no active listings, don't mark everything as inactive - this is likely an error
      return 0;
    }
    
    const result = await db
      .update(properties)
      .set({ 
        isActive: false,
        lastUpdated: new Date()
      })
      .where(
        and(
          eq(properties.isActive, true),
          notInArray(properties.listingId, activeMlsIds)
        )
      )
      .returning();
    
    return result.length;
  }

  async deleteProperty(listingKey: string): Promise<boolean> {
    // Delete associated media first
    await db
      .delete(propertyMedia)
      .where(eq(propertyMedia.listingKey, listingKey));
    
    // Delete the property
    const result = await db
      .delete(properties)
      .where(eq(properties.listingKey, listingKey))
      .returning();
    
    return result.length > 0;
  }

  async getPropertyMedia(listingKey: string): Promise<PropertyMedia[]> {
    return await db
      .select()
      .from(propertyMedia)
      .where(eq(propertyMedia.listingKey, listingKey))
      .orderBy(propertyMedia.mediaOrder);
  }

  async createPropertyMedia(insertMedia: InsertPropertyMedia): Promise<PropertyMedia> {
    const [media] = await db
      .insert(propertyMedia)
      .values(insertMedia)
      .returning();
    return media;
  }

  async updateSchemaSummary(listingKey: string, summary: string): Promise<void> {
    await db
      .update(properties)
      .set({
        schemaSummary: summary,
        schemaUpdatedAt: new Date(),
      })
      .where(eq(properties.listingKey, listingKey));
  }

  async getPropertiesNeedingSummary(): Promise<Property[]> {
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    return await db
      .select()
      .from(properties)
      .where(
        and(
          eq(properties.isActive, true),
          or(
            isNull(properties.schemaSummary),
            lt(properties.schemaUpdatedAt, sixtyDaysAgo)
          )
        )
      );
  }

  // CMS: RSS Feed methods
  async listRssFeeds(): Promise<RssFeed[]> {
    return await db.select().from(rssFeeds).orderBy(desc(rssFeeds.createdAt));
  }

  async getRssFeed(id: string): Promise<RssFeed | undefined> {
    const [feed] = await db.select().from(rssFeeds).where(eq(rssFeeds.id, id));
    return feed || undefined;
  }

  async createRssFeed(feed: InsertRssFeed): Promise<RssFeed> {
    const [created] = await db.insert(rssFeeds).values(feed).returning();
    return created;
  }

  async updateRssFeed(id: string, updates: Partial<InsertRssFeed>): Promise<RssFeed | undefined> {
    const [updated] = await db.update(rssFeeds).set(updates).where(eq(rssFeeds.id, id)).returning();
    return updated || undefined;
  }

  async deleteRssFeed(id: string): Promise<boolean> {
    const result = await db.delete(rssFeeds).where(eq(rssFeeds.id, id)).returning();
    return result.length > 0;
  }

  async updateFeedLastFetched(id: string): Promise<void> {
    await db.update(rssFeeds).set({ lastFetched: new Date() }).where(eq(rssFeeds.id, id));
  }

  // CMS: Article methods
  async listCmsArticles(status?: string): Promise<CmsArticle[]> {
    if (status) {
      return await db.select().from(cmsArticles).where(eq(cmsArticles.status, status)).orderBy(desc(cmsArticles.createdAt));
    }
    return await db.select().from(cmsArticles).orderBy(desc(cmsArticles.createdAt));
  }

  async listCmsArticlesByLocation(locationTag: string): Promise<CmsArticle[]> {
    return await db.select().from(cmsArticles)
      .where(and(
        eq(cmsArticles.status, "published"),
        arrayContains(cmsArticles.locationTags, [locationTag])
      ))
      .orderBy(desc(cmsArticles.publishedOnSiteAt));
  }

  async getCmsArticle(id: string): Promise<CmsArticle | undefined> {
    const [article] = await db.select().from(cmsArticles).where(eq(cmsArticles.id, id));
    return article || undefined;
  }

  async getCmsArticleByUrl(url: string): Promise<CmsArticle | undefined> {
    const [article] = await db.select().from(cmsArticles).where(eq(cmsArticles.originalUrl, url));
    return article || undefined;
  }

  async createCmsArticle(article: InsertCmsArticle): Promise<CmsArticle> {
    const [created] = await db.insert(cmsArticles).values(article).returning();
    return created;
  }

  async updateCmsArticle(id: string, updates: Partial<CmsArticle>): Promise<CmsArticle | undefined> {
    const [updated] = await db.update(cmsArticles).set(updates).where(eq(cmsArticles.id, id)).returning();
    return updated || undefined;
  }

  async deleteCmsArticle(id: string): Promise<boolean> {
    const result = await db.delete(cmsArticles).where(eq(cmsArticles.id, id)).returning();
    return result.length > 0;
  }

  async publishCmsArticle(id: string): Promise<CmsArticle | undefined> {
    const [published] = await db.update(cmsArticles)
      .set({ status: "published", publishedOnSiteAt: new Date() })
      .where(eq(cmsArticles.id, id))
      .returning();
    return published || undefined;
  }
}

export const storage = new DatabaseStorage();
