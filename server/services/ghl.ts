/**
 * GoHighLevel API integration service
 * Handles sending contact form data to GHL CRM
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
      tags: contactData.tags || [],
      customFields: contactData.customFields || {}
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
      source: 'Website Contact Form',
      tags: ['Website Lead', 'Real Estate Inquiry', formData.service],
      customFields: {
        'lead_source': 'hensleys-homes.com'
      }
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
}

// Export singleton instance
export const ghlService = new GoHighLevelService();
export { GoHighLevelService };