/**
 * ==========================================
 * GoHighLevel (GHL) Complete Integration
 * ==========================================
 * 
 * This file contains ALL GoHighLevel integration logic, API configuration,
 * and contact management functionality. All GHL-related code should be
 * centralized here for easy maintenance and future enhancements.
 * 
 * Environment Variables Required:
 * - GHL_SECRET: GoHighLevel API key (location access token)
 * - GHL_LOCATION_ID: GoHighLevel location identifier
 * 
 * Features:
 * - Contact creation with tags and custom fields
 * - Contact notes management
 * - Website form integration
 * - Error handling with local backup
 * - Comprehensive logging
 * 
 * Uses @gohighlevel/api-client SDK for all API interactions
 */

import { HighLevel } from '@gohighlevel/api-client';

interface GHLContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source: string;
  tags?: string[];
  customField?: Record<string, any>;
}

interface GHLContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source: string;
  dateAdded: string;
}

class GoHighLevelService {
  private client: InstanceType<typeof HighLevel>;
  private locationId: string;

  constructor() {
    const apiKey = process.env.GHL_SECRET || '';
    this.locationId = process.env.GHL_LOCATION_ID || '';
    
    if (!apiKey || !this.locationId) {
      throw new Error('GHL_SECRET and GHL_LOCATION_ID environment variables are required');
    }

    // Initialize HighLevel SDK with private integration token
    this.client = new HighLevel({
      privateIntegrationToken: apiKey
    });
  }

  /**
   * Upserts a contact in GoHighLevel (creates or updates if exists)
   * Note: Custom fields are NOT supported in upsert endpoint - use updateContactCustomFields instead
   */
  async upsertContact(contactData: GHLContactData): Promise<GHLContact> {
    const payload = {
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      email: contactData.email,
      phone: contactData.phone || '',
      source: contactData.source,
      locationId: this.locationId,
      tags: contactData.tags || []
    };

    const response = await this.client.contacts.upsertContact(payload);
    
    // The SDK returns the contact object - handle both possible response formats
    const contact = (response as any).contact || response;
    return contact as GHLContact;
  }

  /**
   * Fetches custom field definitions to get their IDs
   * Returns normalized format with key (from fieldKey) for easy mapping
   */
  async getCustomFieldDefinitions(): Promise<Array<{ id: string; key: string; name: string }>> {
    const response = await this.client.locations.getCustomFields({
      locationId: this.locationId
    });

    const rawFields = response.customFields || [];
    
    // Normalize: GHL returns fieldKey, we map it to key for consistency
    return rawFields.map((field: any) => ({
      id: field.id,
      key: field.fieldKey,  // GHL uses 'fieldKey' not 'key'
      name: field.name
    }));
  }

  /**
   * Updates custom fields for an existing contact using PUT endpoint
   * Format: customFields array with { id: "field_id", key: "contact.fieldname", field_value: value }
   */
  async updateContactCustomFields(
    contactId: string,
    customFields: Array<{ key: string; field_value: any }>
  ): Promise<void> {
    // First, fetch custom field definitions to get their IDs
    console.log('📝 Fetching custom field definitions...');
    const fieldDefinitions = await this.getCustomFieldDefinitions();
    console.log('📝 Found custom field definitions:', JSON.stringify(fieldDefinitions, null, 2));
    
    // Map field keys to their IDs
    const fieldKeyToId = new Map<string, string>();
    for (const field of fieldDefinitions) {
      fieldKeyToId.set(field.key, field.id);
    }
    
    // Add IDs to custom fields (required by GHL API)
    const customFieldsWithIds = customFields.map(field => {
      const fieldId = fieldKeyToId.get(field.key);
      if (!fieldId) {
        console.warn(`⚠️ No field ID found for key: ${field.key}`);
      }
      return {
        id: fieldId || '',
        key: field.key,
        field_value: field.field_value
      };
    });
    
    console.log('📝 Updating custom fields for contact:', contactId);
    console.log('📝 Payload:', JSON.stringify({ customFields: customFieldsWithIds }, null, 2));

    // Use SDK to update contact with custom fields
    const response = await this.client.contacts.updateContact(
      { contactId },
      { customFields: customFieldsWithIds }
    );
    
    console.log('📝 GHL response:', JSON.stringify(response, null, 2));
  }

  /**
   * Creates a contact from website form data with metadata and custom fields
   */
  async createContactFromForm(formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    service: string;
    message: string;
    method?: string;
    emailOptIn?: boolean;
    smsOptIn?: boolean;
    emailConsentText?: string;
    smsConsentText?: string;
    userAgent?: string;
    pageUrl?: string;
    referrer?: string;
    ipAddress?: string;
    evidenceId?: string;
    timestamp?: string;
    additionalTags?: string[];
    noteBody?: string;
  }): Promise<GHLContact> {
    const tags = ['Website Lead', 'Real Estate Inquiry', formData.service, ...(formData.additionalTags || [])];
    
    const timestamp = formData.timestamp || new Date().toISOString();
    const method = formData.method || 'webform';
    
    const ghlData: GHLContactData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      source: 'hensleyshomes.com - Contact Form',
      tags
    };

    // Step 1: Upsert the contact (without custom fields)
    const contact = await this.upsertContact(ghlData);
    
    // Step 2: Update custom fields using PUT endpoint
    // Format: customFields array with { key: "contact.fieldname", field_value: value }
    // Note: Keys must match EXACTLY what's configured in GHL (including typos like "timetamp")
    // DATE fields must use YYYY-MM-DD format, not full ISO timestamp
    const dateOnly = timestamp.split('T')[0]; // Convert "2025-10-10T20:29:28.029Z" to "2025-10-10"
    
    const customFields = [
      { key: 'contact.method', field_value: method },
      { 
        key: 'contact.textshown', 
        field_value: [
          formData.emailConsentText || '',
          formData.smsConsentText || ''
        ].filter(t => t).join(' | ')
      },
      { key: 'contact.timetamp', field_value: dateOnly }, // DATE type requires YYYY-MM-DD format
      { key: 'contact.ip', field_value: formData.ipAddress || 'unknown' },
      { key: 'contact.useragent', field_value: formData.userAgent || 'unknown' },
      { key: 'contact.pageurl', field_value: formData.pageUrl || 'unknown' },
      { key: 'contact.referrer', field_value: formData.referrer || 'direct' },
      { key: 'contact.consentsms', field_value: formData.smsOptIn ? 'Agree to SMS' : '' },
      { key: 'contact.consentemail', field_value: formData.emailOptIn ? 'Agree to Email' : '' },
      { key: 'contact.evidenceid', field_value: formData.evidenceId || '' }
    ];
    
    try {
      await this.updateContactCustomFields(contact.id, customFields);
      console.log('✅ Custom fields updated successfully for contact:', contact.id);
    } catch (error) {
      console.warn('⚠️ Failed to update custom fields (contact created successfully):', error);
    }
    
    // Post system message with opt-in evidence
    const systemMessage = `Opt In captured ${timestamp}, page ${formData.pageUrl || 'unknown'}, IP: ${formData.ipAddress || 'unknown'}, SMS = ${formData.smsOptIn || false}, EMAIL = ${formData.emailOptIn || false}`;
    
    try {
      await this.postInboundMessage(contact.id, systemMessage);
    } catch (error) {
      console.warn('Failed to post system opt-in message:', error);
    }
    
    // Post the user message as an inbound message to the contact's conversation
    if (formData.message && formData.message.trim()) {
      try {
        await this.postInboundMessage(contact.id, `Website Contact Form Message:\n\n${formData.message}`);
      } catch (error) {
        console.warn('Failed to post inbound message to contact, but contact was upserted successfully:', error);
      }
    }

    // Post note if provided (e.g. property address from landing pages)
    if (formData.noteBody && formData.noteBody.trim()) {
      try {
        await this.addNote(contact.id, formData.noteBody);
        console.log('📌 Note added to GHL contact:', contact.id);
      } catch (error) {
        console.warn('Failed to add note to GHL contact:', error);
      }
    }

    return contact;
  }

  /**
   * Creates a note on a GHL contact
   */
  async addNote(contactId: string, body: string): Promise<void> {
    await this.client.request({
      method: 'POST',
      url: `/contacts/${contactId}/notes`,
      data: { body, userId: '' }
    });
  }

  /**
   * Posts an inbound message to a contact's conversation
   * Uses the SDK's request method for direct API access
   */
  async postInboundMessage(contactId: string, message: string): Promise<void> {
    const payload = {
      type: 'SMS',
      contactId: contactId,
      message: message
    };

    // Use SDK's request method for direct API endpoint access
    await this.client.request({
      method: 'POST',
      url: '/conversations/messages/inbound',
      data: payload
    });
  }

  /**
   * Complete integration method for handling website contact form submissions
   * This method handles the entire flow: validation, local backup, GHL creation, and error handling
   */
  async processContactFormSubmission(
    formData: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string | null;
      service: string;
      message: string;
      method?: string;
      emailOptIn?: boolean;
      smsOptIn?: boolean;
      emailConsentText?: string;
      smsConsentText?: string;
      userAgent?: string;
      pageUrl?: string;
      referrer?: string;
      ipAddress?: string;
      timestamp?: Date;
      additionalTags?: string[];
      noteBody?: string;
    },
    localStorageBackup: (data: any) => Promise<any>
  ): Promise<{
    success: boolean;
    localContact: any;
    ghl: {
      success: boolean;
      contactId?: string;
      error?: string;
    };
  }> {
    
    // 1. Create local backup first (always succeeds)
    const localContact = await localStorageBackup(formData);
    console.log('Contact saved locally as backup:', localContact.id);
    
    // 2. Attempt GHL integration
    let ghlContact = null;
    let ghlError = null;
    
    try {
      // Convert timestamp Date to ISO string for GHL service
      const timestamp = formData.timestamp ? formData.timestamp.toISOString() : new Date().toISOString();
      const ghlFormData = {
        ...formData,
        phone: formData.phone || undefined,
        emailOptIn: formData.emailOptIn,
        smsOptIn: formData.smsOptIn,
        emailConsentText: formData.emailConsentText,
        smsConsentText: formData.smsConsentText,
        userAgent: formData.userAgent,
        pageUrl: formData.pageUrl,
        referrer: formData.referrer,
        ipAddress: formData.ipAddress,
        evidenceId: localContact.id,
        timestamp,
        additionalTags: formData.additionalTags,
        noteBody: formData.noteBody,
      };
      
      ghlContact = await this.createContactFromForm(ghlFormData);
      console.log('✅ Contact successfully sent to GoHighLevel:', ghlContact.id);
      
    } catch (error) {
      ghlError = error;
      console.error('❌ Failed to send contact to GoHighLevel:', error);
      // Don't fail the request if GHL fails - we still have local backup
    }
    
    return {
      success: true,
      localContact,
      ghl: {
        success: !!ghlContact,
        contactId: ghlContact?.id,
        error: ghlError ? (ghlError instanceof Error ? ghlError.message : 'Unknown GHL error') : undefined
      }
    };
  }

  /**
   * Health check method to verify GHL API connectivity
   */
  async healthCheck(): Promise<{ status: 'connected' | 'error'; message: string }> {
    try {
      // Test API connectivity by fetching contacts
      const response = await this.client.contacts.getContacts({
        locationId: this.locationId,
        limit: 1
      });
      
      return { status: 'connected', message: 'GHL API connection successful' };
    } catch (error: any) {
      if (error.statusCode === 401) {
        return { status: 'error', message: 'Invalid API credentials' };
      }
      
      return { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown connection error' 
      };
    }
  }

  /**
   * Get current GHL configuration (without exposing secrets)
   */
  getConfig() {
    return {
      locationId: this.locationId ? '***configured***' : 'NOT SET',
      apiKey: '***configured***',
      isConfigured: true,
      sdkVersion: 'Using @gohighlevel/api-client SDK'
    };
  }
}

// ==========================================
// EXPORT SINGLETON INSTANCE
// ==========================================
// All GHL operations should use this single instance
export const ghlService = new GoHighLevelService();

// Export class for testing purposes
export { GoHighLevelService };

// ==========================================
// GHL INTEGRATION CONSTANTS
// ==========================================
export const GHL_CONFIG = {
  API_VERSION: '2021-07-28',
  BASE_URL: 'https://services.leadconnectorhq.com',
  DEFAULT_TAGS: ['Website Lead', 'Real Estate Inquiry'],
  DEFAULT_SOURCE: 'Website Contact Form',
  LEAD_SOURCE_CUSTOM_FIELD: 'hensleyshomes.com'
} as const;
