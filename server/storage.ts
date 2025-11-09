// Database integration blueprint: javascript_database
import { users, contacts, properties, propertyMedia, type User, type InsertUser, type Contact, type InsertContact, type Property, type InsertProperty, type PropertyMedia, type InsertPropertyMedia } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  listProperties(): Promise<Property[]>;
  getProperty(listingKey: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updatePropertyStatus(listingKey: string, status: string): Promise<Property | undefined>;
  deleteProperty(listingKey: string): Promise<boolean>;
  getPropertyMedia(listingKey: string): Promise<PropertyMedia[]>;
  createPropertyMedia(media: InsertPropertyMedia): Promise<PropertyMedia>;
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
      .orderBy(desc(properties.onMarketDate));
  }

  async getProperty(listingKey: string): Promise<Property | undefined> {
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.listingKey, listingKey));
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
}

export const storage = new DatabaseStorage();
