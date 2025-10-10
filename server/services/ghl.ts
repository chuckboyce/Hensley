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
 * - GHL_SECRET: GoHighLevel API key
 * - GHL_LOCATION_ID: GoHighLevel location identifier
 * 
 * Features:
 * - Contact creation with tags and custom fields
 * - Contact notes management
 * - Website form integration
 * - Error handling with local backup
 * - Comprehensive logging
 */

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
  private apiKey: string;
  private locationId: string;
  private baseUrl = 'https://services.leadconnectorhq.com';

  constructor() {
    this.apiKey = process.env.GHL_SECRET || '';
    this.locationId = process.env.GHL_LOCATION_ID || '';
    
    if (!this.apiKey || !this.locationId) {
      throw new Error('GHL_SECRET and GHL_LOCATION_ID environment variables are required');
    }
  }

  /**
   * Upserts a contact in GoHighLevel (creates or updates if exists)
   * Note: Custom fields are NOT supported in upsert endpoint - use updateContactCustomFields instead
   */
  async upsertContact(contactData: GHLContactData): Promise<GHLContact> {
    const url = `${this.baseUrl}/contacts/upsert`;
    
    const payload = {
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      email: contactData.email,
      phone: contactData.phone || '',
      source: contactData.source,
      locationId: this.locationId,
      tags: contactData.tags || []
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GHL API Error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    return result.contact || result;
  }

  /**
   * Updates custom fields for an existing contact using PUT endpoint
   * Format: customFields array with { key: "contact.fieldname", field_value: value }
   */
  async updateContactCustomFields(
    contactId: string,
    customFields: Array<{ key: string; field_value: any }>,
    contactInfo?: { firstName?: string; lastName?: string; email?: string; phone?: string }
  ): Promise<void> {
    const url = `${this.baseUrl}/contacts/${contactId}`;
    
    // Include basic contact info if provided (may be required for custom fields to update)
    const payload: any = {
      customFields
    };
    
    if (contactInfo) {
      if (contactInfo.firstName) payload.firstName = contactInfo.firstName;
      if (contactInfo.lastName) payload.lastName = contactInfo.lastName;
      if (contactInfo.email) payload.email = contactInfo.email;
      if (contactInfo.phone) payload.phone = contactInfo.phone;
    }

    console.log('📝 Updating custom fields for contact:', contactId);
    console.log('📝 Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Custom fields update failed:', errorText);
      throw new Error(`Failed to update custom fields for contact ${contactId}: ${errorText}`);
    }

    const result = await response.json();
    console.log('📝 GHL response:', JSON.stringify(result, null, 2));
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
  }): Promise<GHLContact> {
    const tags = ['Website Lead', 'Real Estate Inquiry', formData.service];
    
    const timestamp = formData.timestamp || new Date().toISOString();
    const method = formData.method || 'webform';
    
    const ghlData: GHLContactData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      source: 'hensleys-homes.com - Contact Form',
      tags
    };

    // Step 1: Upsert the contact (without custom fields)
    const contact = await this.upsertContact(ghlData);
    
    // Step 2: Update custom fields using PUT endpoint
    // Format: customFields array with { key: "contact.fieldname", field_value: value }
    // Note: Keys must match EXACTLY what's configured in GHL (including typos like "timetamp")
    const customFields = [
      { key: 'contact.method', field_value: method },
      { 
        key: 'contact.textshown', 
        field_value: [
          formData.emailConsentText || '',
          formData.smsConsentText || ''
        ].filter(t => t).join(' | ')
      },
      { key: 'contact.timetamp', field_value: timestamp }, // Note: GHL has typo "timetamp" not "timestamp"
      { key: 'contact.ip', field_value: formData.ipAddress || 'unknown' },
      { key: 'contact.useragent', field_value: formData.userAgent || 'unknown' },
      { key: 'contact.pageurl', field_value: formData.pageUrl || 'unknown' },
      { key: 'contact.referrer', field_value: formData.referrer || 'direct' },
      { key: 'contact.consentsms', field_value: formData.smsOptIn || false },
      { key: 'contact.consentemail', field_value: formData.emailOptIn || false },
      { key: 'contact.evidenceid', field_value: formData.evidenceId || '' }
    ];
    
    try {
      await this.updateContactCustomFields(contact.id, customFields, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      });
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

    return contact;
  }

  /**
   * Posts an inbound message to a contact's conversation
   */
  async postInboundMessage(contactId: string, message: string): Promise<void> {
    const url = `${this.baseUrl}/conversations/messages/inbound`;
    
    const payload = {
      type: 'SMS',
      contactId: contactId,
      message: message
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to post inbound message to GHL contact ${contactId}: ${errorText}`);
    }
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
        timestamp
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
      // Test API connectivity by attempting to fetch a contact (this will fail if no contacts exist, but that's OK)
      const url = `${this.baseUrl}/contacts/?limit=1`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28'
        }
      });
      
      if (response.status === 401) {
        return { status: 'error', message: 'Invalid API credentials' };
      } else if (!response.ok) {
        return { status: 'error', message: `API returned ${response.status}` };
      }
      
      return { status: 'connected', message: 'GHL API connection successful' };
    } catch (error) {
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
      baseUrl: this.baseUrl,
      locationId: this.locationId ? '***configured***' : 'NOT SET',
      apiKey: this.apiKey ? '***configured***' : 'NOT SET',
      isConfigured: !!(this.apiKey && this.locationId)
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
  LEAD_SOURCE_CUSTOM_FIELD: 'hensleys-homes.com'
} as const;