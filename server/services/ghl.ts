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
    
    // Include customField if provided and properly structured with GHL field IDs
    if (contactData.customField && Object.keys(contactData.customField).length > 0) {
      Object.assign(payload, { customField: contactData.customField });
    }

    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(payload)
    });

    // If custom fields error (422), retry without custom fields
    if (!response.ok && response.status === 422) {
      const errorText = await response.text();
      if (errorText.includes('customField')) {
        console.warn('⚠️ Custom fields not configured in GHL. Creating contact without custom fields.');
        console.warn('💡 To enable custom fields, create these fields in GHL Settings > Custom Fields:');
        console.warn('   - method, textshown, timestamp, ip, useragent, pageurl, referrer, consentsms, consentemail, evidenceid');
        
        // Retry without custom fields
        const payloadWithoutCustomFields = {
          firstName: contactData.firstName,
          lastName: contactData.lastName,
          email: contactData.email,
          phone: contactData.phone || '',
          source: contactData.source,
          locationId: this.locationId,
          tags: contactData.tags || []
        };
        
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28'
          },
          body: JSON.stringify(payloadWithoutCustomFields)
        });
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GHL API Error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    return result.contact || result;
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
    
    // Build custom fields object with GHL field names
    const customField: Record<string, any> = {
      method: 'webform',
      textshown: [
        formData.emailConsentText || '',
        formData.smsConsentText || ''
      ].filter(t => t).join(' | '),
      timestamp: timestamp,
      ip: formData.ipAddress || 'unknown',
      useragent: formData.userAgent || 'unknown',
      pageurl: formData.pageUrl || 'unknown',
      referrer: formData.referrer || 'direct',
      consentsms: formData.smsOptIn || false,
      consentemail: formData.emailOptIn || false,
      evidenceid: formData.evidenceId || ''
    };
    
    const ghlData: GHLContactData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      source: 'hensleys-homes.com - Contact Form',
      tags,
      customField
    };

    const contact = await this.upsertContact(ghlData);
    
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
      emailOptIn?: boolean;
      smsOptIn?: boolean;
      emailConsentText?: string;
      smsConsentText?: string;
      userAgent?: string;
      pageUrl?: string;
      referrer?: string;
      ipAddress?: string;
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
      // Convert null phone to undefined for GHL service and pass all metadata
      const timestamp = new Date().toISOString();
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