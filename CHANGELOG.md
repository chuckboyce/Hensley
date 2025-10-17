# Changelog - Kevin Hensley's Homes Website

All notable changes to the Kevin Hensley real estate website will be documented in this file.

## [1.2.0] - 2025-10-17

### Added
- **Sitemap.xml**: Auto-generated XML sitemap for improved SEO and search engine discoverability
  - Available at `/sitemap.xml` endpoint
  - Includes all main website sections (home, services, properties, testimonials, contact)
  - Properly formatted with lastmod dates, change frequency, and priority values
  - Updates automatically with current date on each request
  - Ready for future expansion with blog posts and individual property listings

### Fixed
- **GoHighLevel Checkbox Fields**: Consent checkboxes now properly populate in GHL
  - Changed from boolean values to text values ("Agree to SMS", "Agree to Email")
  - Email and SMS consent checkboxes now correctly display as checked in GoHighLevel

### Technical Details
- Sitemap route registered in `server/index.ts` before Vite middleware to ensure proper routing
- XML format follows sitemap.org protocol specification
- Documentation updated in `replit.md` with SEO implementation details

## [1.1.0] - 2025-10-10

### Changed
- **GoHighLevel Integration**: Refactored to use official `@gohighlevel/api-client` SDK
  - Replaced manual fetch API calls with SDK methods for cleaner, more maintainable code
  - Contact creation now uses `contacts.upsertContact()` method
  - Custom field updates use `contacts.updateContact()` method
  - Custom field definitions fetched via `locations.getCustomFields()` method
  - Conversation messages posted via SDK's generic `request()` method
  - All 10 custom compliance fields continue to populate correctly
  - Authentication using private integration token via `GHL_SECRET` environment variable
  - Dynamic field ID mapping maintained for proper custom field updates

### Technical Details
- Updated `server/services/ghl.ts` to use `@gohighlevel/api-client` package
- Maintained existing error handling and fallback mechanisms
- All functionality verified working with SDK implementation
- Documentation updated in `replit.md` to reflect SDK usage

## [Initial Release] - 2025-01-09

### Added
- Complete real estate website for Kevin Hensley's Homes
- Single-page application with responsive design
- Hero section with property search functionality
- Services section highlighting real estate sales and property management
- About section with agent information and credentials
- Featured properties with filtering (For Sale/For Rent/All)
- Client testimonials section
- Service areas overview
- Contact form with backend API integration
- Professional footer with business information
- Mobile-responsive navigation

### Updated
- Agent name changed from "Hensley" to "Kevin Hensley" throughout the site
- Email address updated to kevin@hensleys-homes.com
- All testimonials updated to reference "Kevin Hensley"
- About section heading changed to "Meet Kevin Hensley"
- Hero section text updated to mention "Kevin Hensley's Homes"
- Footer navigation updated to "About Kevin"

### Fixed
- Hero section text readability improved with stronger text shadows
- Background overlay darkened for better contrast (black/80 to black/60)
- Custom text shadows added for maximum white text visibility
- Professional headshot image properly imported and displayed

### Technical Details
- Built with React 18 + TypeScript
- Styled with Tailwind CSS and shadcn/ui components
- Backend API with Express.js and in-memory storage
- Form validation with Zod schemas
- Responsive design for all device sizes