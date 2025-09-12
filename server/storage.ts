import { type User, type InsertUser, type Contact, type InsertContact, type Property, type InsertProperty, type PropertyMedia, type InsertPropertyMedia } from "@shared/schema";
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
  getPropertyMedia(listingKey: string): Promise<PropertyMedia[]>;
  createPropertyMedia(media: InsertPropertyMedia): Promise<PropertyMedia>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contacts: Map<string, Contact>;
  private properties: Map<string, Property>;
  private propertyMedia: Map<string, PropertyMedia[]>;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.properties = new Map();
    this.propertyMedia = new Map();
    this.seedSampleProperty();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      ...insertContact, 
      id,
      phone: insertContact.phone || null,
      createdAt: new Date()
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async listProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).sort(
      (a, b) => new Date(b.onMarketDate || b.createdAt).getTime() - new Date(a.onMarketDate || a.createdAt).getTime()
    );
  }

  async getProperty(listingKey: string): Promise<Property | undefined> {
    return this.properties.get(listingKey);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = randomUUID();
    const property: Property = { 
      ...insertProperty,
      id,
      // Ensure null values are properly set for optional fields
      mlsStatus: insertProperty.mlsStatus ?? null,
      closePrice: insertProperty.closePrice ?? null,
      listingContractDate: insertProperty.listingContractDate ?? null,
      onMarketDate: insertProperty.onMarketDate ?? null,
      daysOnMarket: insertProperty.daysOnMarket ?? null,
      contingency: insertProperty.contingency ?? null,
      streetNumber: insertProperty.streetNumber ?? null,
      streetName: insertProperty.streetName ?? null,
      streetSuffix: insertProperty.streetSuffix ?? null,
      unitNumber: insertProperty.unitNumber ?? null,
      countyOrParish: insertProperty.countyOrParish ?? null,
      latitude: insertProperty.latitude ?? null,
      longitude: insertProperty.longitude ?? null,
      propertySubType: insertProperty.propertySubType ?? null,
      bedroomsTotal: insertProperty.bedroomsTotal ?? null,
      bathroomsFull: insertProperty.bathroomsFull ?? null,
      bathroomsHalf: insertProperty.bathroomsHalf ?? null,
      livingArea: insertProperty.livingArea ?? null,
      lotSizeArea: insertProperty.lotSizeArea ?? null,
      lotSizeUnits: insertProperty.lotSizeUnits ?? null,
      yearBuilt: insertProperty.yearBuilt ?? null,
      storiesTotal: insertProperty.storiesTotal ?? null,
      garageSpaces: insertProperty.garageSpaces ?? null,
      cooling: insertProperty.cooling ?? null,
      heating: insertProperty.heating ?? null,
      sewer: insertProperty.sewer ?? null,
      waterSource: insertProperty.waterSource ?? null,
      associationFee: insertProperty.associationFee ?? null,
      associationFeeFrequency: insertProperty.associationFeeFrequency ?? null,
      photosCount: insertProperty.photosCount ?? null,
      publicRemarks: insertProperty.publicRemarks ?? null,
      virtualTourURLUnbranded: insertProperty.virtualTourURLUnbranded ?? null,
      virtualTourURLBranded: insertProperty.virtualTourURLBranded ?? null,
      listingOfficePhone: insertProperty.listingOfficePhone ?? null,
      listingAgentPhone: insertProperty.listingAgentPhone ?? null,
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    this.properties.set(property.listingKey, property);
    return property;
  }

  async getPropertyMedia(listingKey: string): Promise<PropertyMedia[]> {
    const media = this.propertyMedia.get(listingKey) || [];
    return media.sort((a, b) => (a.mediaOrder || 0) - (b.mediaOrder || 0));
  }

  async createPropertyMedia(insertMedia: InsertPropertyMedia): Promise<PropertyMedia> {
    const id = randomUUID();
    const media: PropertyMedia = { 
      ...insertMedia,
      id,
      mediaOrder: insertMedia.mediaOrder ?? null,
      caption: insertMedia.caption ?? null,
      mediaType: insertMedia.mediaType ?? null,
      createdAt: new Date()
    };
    
    const existing = this.propertyMedia.get(media.listingKey) || [];
    existing.push(media);
    this.propertyMedia.set(media.listingKey, existing);
    
    return media;
  }

  private seedSampleProperty(): void {
    // Sample property representing the listing from the MLS URL
    const sampleProperty: Property = {
      id: randomUUID(),
      listingKey: "DENC2087994",
      listingId: "DENC2087994",
      mlsId: "DENC2087994",
      mlsName: "Bright MLS",
      standardStatus: "Active",
      mlsStatus: "Active",
      
      // Pricing and Status
      listPrice: "425000",
      closePrice: null,
      listingContractDate: null,
      onMarketDate: new Date("2024-12-01"),
      daysOnMarket: 47,
      contingency: null,
      
      // Location
      unparsedAddress: "123 Main Street, Middletown, DE 19709",
      streetNumber: "123",
      streetName: "Main",
      streetSuffix: "Street",
      unitNumber: null,
      city: "Middletown",
      stateOrProvince: "DE",
      postalCode: "19709",
      countyOrParish: "New Castle",
      latitude: "39.4496",
      longitude: "-75.7163",
      
      // Property details
      propertyType: "Residential",
      propertySubType: "Single Family Attached",
      bedroomsTotal: 3,
      bathroomsFull: 2,
      bathroomsHalf: 1,
      livingArea: 1850,
      lotSizeArea: "0.15",
      lotSizeUnits: "Acres",
      yearBuilt: 2018,
      storiesTotal: 2,
      garageSpaces: 2,
      
      // Features
      cooling: ["Central Air", "Electric"],
      heating: ["Forced Air", "Natural Gas"],
      sewer: ["Public Sewer"],
      waterSource: ["Public"],
      associationFee: "125",
      associationFeeFrequency: "Monthly",
      
      // Media
      photosCount: 25,
      
      // Marketing
      publicRemarks: "Welcome to this stunning 3-bedroom, 2.5-bathroom townhome in the desirable Middletown community! This beautifully maintained home features an open-concept living space with modern finishes throughout. The gourmet kitchen boasts granite countertops, stainless steel appliances, and a large island perfect for entertaining. The spacious master suite includes a walk-in closet and en-suite bathroom. Additional highlights include a 2-car garage, private patio, and convenient location near shopping, dining, and major commuter routes. Don't miss this opportunity to own in one of Delaware's most sought-after neighborhoods!",
      virtualTourURLUnbranded: null,
      virtualTourURLBranded: null,
      
      // Attribution (IDX compliance)
      listingOfficeName: "RE/MAX Eagle Realty",
      listingOfficePhone: "(302) 659-1320",
      listingAgentName: "Kevin Hensley",
      listingAgentPhone: "(302) 218-0130",
      
      // System fields
      lastUpdated: new Date(),
      createdAt: new Date()
    };

    this.properties.set(sampleProperty.listingKey, sampleProperty);

    // Sample property media
    const sampleMedia: PropertyMedia[] = [
      {
        id: randomUUID(),
        mediaKey: "DENC2087994-001",
        listingKey: "DENC2087994",
        mediaUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
        mediaOrder: 1,
        caption: "Front Exterior",
        mediaType: "Photo",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        mediaKey: "DENC2087994-002",
        listingKey: "DENC2087994",
        mediaUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2058&q=80",
        mediaOrder: 2,
        caption: "Living Room",
        mediaType: "Photo",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        mediaKey: "DENC2087994-003",
        listingKey: "DENC2087994",
        mediaUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        mediaOrder: 3,
        caption: "Kitchen",
        mediaType: "Photo",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        mediaKey: "DENC2087994-004",
        listingKey: "DENC2087994",
        mediaUrl: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        mediaOrder: 4,
        caption: "Master Bedroom",
        mediaType: "Photo",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        mediaKey: "DENC2087994-005",
        listingKey: "DENC2087994",
        mediaUrl: "https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
        mediaOrder: 5,
        caption: "Master Bathroom",
        mediaType: "Photo",
        createdAt: new Date()
      }
    ];

    this.propertyMedia.set(sampleProperty.listingKey, sampleMedia);
  }
}

export const storage = new MemStorage();
