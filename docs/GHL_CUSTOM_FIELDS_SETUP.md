# GoHighLevel Custom Fields Setup Guide

## Overview
To enable full compliance tracking and metadata capture, you need to create custom fields in your GoHighLevel account. These fields store browser metadata, consent information, and compliance audit data.

## Required Custom Fields

Create the following custom fields in **Settings > Custom Fields** in your GoHighLevel account:

### 1. **contact.method**
- **Type:** Text (Single Line)
- **Label:** Submission Method
- **Description:** How the contact was submitted (e.g., "webform")

### 2. **contact.textshown**
- **Type:** Text (Multi Line) or Text Area
- **Label:** Consent Text Shown
- **Description:** The exact consent language shown to the user

### 3. **contact.timestamp**
- **Type:** Text (Single Line) or Date/Time
- **Label:** Submission Timestamp
- **Description:** When the form was submitted (UTC ISO8601 format)

### 4. **contact.ip**
- **Type:** Text (Single Line)
- **Label:** IP Address
- **Description:** User's IP address at time of submission

### 5. **contact.useragent**
- **Type:** Text (Multi Line)
- **Label:** User Agent
- **Description:** Browser user agent string

### 6. **contact.pageurl**
- **Type:** Text (Single Line)
- **Label:** Page URL
- **Description:** The URL where the form was submitted

### 7. **contact.referrer**
- **Type:** Text (Single Line)
- **Label:** Referrer
- **Description:** The referring page URL (or "direct" if none)

### 8. **contact.consentsms**
- **Type:** Checkbox or Text
- **Label:** SMS Consent
- **Description:** Whether user opted in to SMS (true/false)

### 9. **contact.consentemail**
- **Type:** Checkbox or Text
- **Label:** Email Consent
- **Description:** Whether user opted in to Email (true/false)

### 10. **contact.evidenceid**
- **Type:** Text (Single Line)
- **Label:** Evidence ID
- **Description:** Database record ID linking to full audit trail

## Setup Instructions

1. **Access Custom Fields:**
   - Log into your GoHighLevel account
   - Navigate to **Settings** (gear icon)
   - Click **Custom Fields**

2. **Create Each Field:**
   - Click **+ Add Custom Field**
   - Select **Contact** as the object type
   - Enter the field name **exactly as shown above** including the `contact.` prefix (e.g., `contact.method`, `contact.timestamp`, etc.)
   - Choose the appropriate field type
   - Add a label and description
   - Save the field

3. **Important Notes:**
   - Field names are **case-sensitive** and must match exactly
   - The `contact.` prefix is **required** and must be included in the field name
   - The full field name format is: `contact.fieldname` (e.g., `contact.method`, `contact.ip`)
   - All fields are optional - the system will work without them but won't track compliance metadata

## Current Behavior

**With Custom Fields Configured:**
- Full metadata is sent to GoHighLevel
- Complete compliance audit trail available in GHL
- All browser data, consent text, and timestamps are stored

**Without Custom Fields Configured:**
- Contacts are still created successfully in GoHighLevel
- Basic info (name, email, phone, tags) is saved
- Metadata is stored in local PostgreSQL database as backup
- Console warning appears: "Custom fields not configured in GHL"

## Testing

After creating the custom fields:

1. Submit a test contact through the website
2. Check the GoHighLevel contact record
3. Verify all custom fields are populated with data
4. System message should appear in conversation with opt-in details

## Troubleshooting

**If contacts aren't syncing:**
- Verify GHL_SECRET and GHL_LOCATION_ID environment variables are set
- Check that API key has proper permissions
- Ensure custom field names match exactly (case-sensitive)

**If custom fields are empty:**
- Confirm field names are correct (no `contact.` prefix)
- Check field type compatibility (text vs checkbox)
- Review server logs for specific error messages

## Contact Information
For issues with custom fields setup, contact your GoHighLevel administrator or support.
