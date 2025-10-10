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
  customFields?: Record<string, string>;
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
   * Creates a new contact in GoHighLevel
   */
  async createContact(contactData: GHLContactData): Promise<GHLContact> {
    const url = `${this.baseUrl}/contacts/`;
    
    const payload = {
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      email: contactData.email,
      phone: contactData.phone || '',
      source: contactData.source,
      locationId: this.locationId,
      tags: contactData.tags || []
    };
    
    // Only include customFields if provided and properly structured with GHL field IDs
    if (contactData.customFields && Object.keys(contactData.customFields).length > 0) {
      // Note: customFields in GHL require actual field IDs from your GHL account
      // For now we're not using custom fields - all info is captured via source, tags, and notes
      console.warn('Custom fields provided but not configured for GHL integration');
    }

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
   * Creates a contact from website form data
   */
  async createContactFromForm(formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    service: string;
    message: string;
  }): Promise<GHLContact> {
    const ghlData: GHLContactData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      source: 'hensleys-homes.com - Contact Form',
      tags: ['Website Lead', 'Real Estate Inquiry', formData.service]
    };

    const contact = await this.createContact(ghlData);
    
    // Add the message as a contact note
    if (formData.message && formData.message.trim()) {
      try {
        await this.addNoteToContact(contact.id, `Website Contact Form Message:\n\n${formData.message}`);
      } catch (error) {
        console.warn('Failed to add note to contact, but contact was created successfully:', error);
      }
    }

    return contact;
  }

  /**
   * Adds a note to an existing contact
   */
  async addNoteToContact(contactId: string, note: string): Promise<void> {
    const url = `${this.baseUrl}/contacts/${contactId}/notes/`;
    
    const payload = {
      body: note,
      userId: this.locationId // Using location ID as user ID fallback
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
      console.warn(`Failed to add note to GHL contact ${contactId}: ${errorText}`);
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
      // Convert null phone to undefined for GHL service
      const ghlFormData = {
        ...formData,
        phone: formData.phone || undefined
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