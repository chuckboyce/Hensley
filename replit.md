# Overview

This full-stack real estate website, "Kevin Hensley's Homes," is a responsive single-page application built for a local real estate agent. It showcases services, property listings (sales and rentals), testimonials, and includes a contact form for lead generation. The application features a modern, clean design, leveraging React, TypeScript, Express.js, and shadcn/ui. Its purpose is to enhance online presence, attract potential clients, and streamline property showcasing. The site dynamically generates and optimizes content, including AI-written property descriptions and community pillar pages, to improve search engine visibility and user engagement.

# User Preferences

- **Communication Style**: Simple, everyday language. Avoid technical jargon.
- **Recent Changes Format**: Always include a client summary in italics that's suitable for invoices or status reports. Focus on results and benefits, not technical details.
- **Documentation Updates**: Update the Recent Changes section in this file at each checkpoint.
- **Navigation Behavior**: Always scroll to top of page on route change, unless landing on a specific anchor (hash link).

# Recent Changes

**Earlier Sessions**: Core Infrastructure & Lead Management System

*Client Summary: Built comprehensive backend infrastructure for lead capture, property management, and CRM integration. System automatically syncs property listings from MLS, manages contact forms with consent tracking, and integrates with GoHighLevel for lead nurturing.*

**Backend & Database Setup:**
- Implemented RESO-compliant properties database schema with 40+ fields tracking MLS data, pricing, location, property details, and rental status
- Created contacts table with 15 fields including consent tracking, IP address, user agent, referrer source, and timestamp for lead attribution
- Set up PostgreSQL via Neon with Drizzle ORM for type-safe database operations

**GoHighLevel (GHL) CRM Integration:**
- Integrated GoHighLevel SDK for automated contact creation from website forms
- Implemented contact upsert functionality with 10 custom fields for compliance tracking
- Built contact notes management and automatic GHL syncing
- Created health check endpoint to monitor GHL connection status

**Property Management APIs:**
- Built webhook endpoint (`POST /api/webhook/listings`) for automated MLS data sync with admin authentication
- Created property listing endpoints for filtering by ZIP code, status, and listing key
- Implemented property media management API for images and documents
- Added support for both sales and rental property listings with visual indicators

**Contact & Lead Management:**
- Implemented contact form API with Zod validation and error handling
- Built contact resend functionality to retry GHL syncing if initial submission failed
- Integrated IP tracking, page URL, referrer, and user agent capture for lead source attribution
- Created admin endpoint to view all contacts with pagination support

**Admin Panel & Utilities:**
- Built admin authentication middleware (Bearer token based)
- Implemented property edit endpoints with validation and conflict detection
- Created AI-powered property summary generation with fallback handling
- Added image optimization for property photos (WebP conversion, compression)
- Built search engine ping utility to notify Google/Bing of new content

**December 7, 2025**: Breadcrumbs & Enhanced Navigation Schema

*Client Summary: Added visual breadcrumb navigation to all 33 pillar pages with proper schema markup for search engines. This improves user experience and SEO by clearly showing page hierarchy and enabling breadcrumb rich snippets in search results.*

- Created reusable Breadcrumb component with Home icon and chevron separators
- Added breadcrumb JSON-LD schema to all 33 pillar pages with proper itemListElement arrays and position numbers
- Breadcrumbs support hierarchical navigation: Home > Community Type > City > Neighborhood (for nested pages)
- Schema ID pattern: {lowercase-pagename}-breadcrumb-schema for consistent organization
- Delaware pages: Delaware Communities > City Name hierarchy
- Maryland pages: Maryland Communities > City Name hierarchy
- Nested Wilmington neighborhoods: Delaware Communities > Wilmington > Neighborhood Name (4 levels deep)
- Each page maintains its own Place schema + breadcrumb schema for complete semantic markup

**December 7, 2025**: Final Pre-Launch Cleanup & Link Validation

*Client Summary: Site is now ready for publishing with 33 pillar pages and zero broken links. All cross-page navigation has been verified to prevent 404 errors. Added internal development roadmap so future pillar pages can be easily activated.*

- Removed all links to non-existent pillar pages from "Explore Nearby Areas" sections
- Added TODO comments with exact card references for all future pillar pages (11 remaining)
- Updated pillar pages documentation with complete published/missing status
- Verified all cross-page links only reference live pages

**December 7, 2025**: Nearby Areas Navigation & Expanded Coverage

*Client Summary: Connected 4 pillar pages with cross-linking sections so visitors can easily explore surrounding communities. This improves user engagement and SEO by creating topic clusters within the Delaware and Maryland markets.*

- Added "Explore Nearby Areas" sections to Centreville DE and North Star DE
- Added "Explore Nearby Areas" sections to North East MD and Perryville MD
- Each section displays 1-6 related community cards for easy navigation
- Links connect to published pages only to avoid broken links

**December 7, 2025**: Wilmington Hierarchical Pillar Page System + 4 Sub-Neighborhoods

*Client Summary: Created Wilmington as the first parent city pillar page with 4 specialized neighborhood sub-pages. Each neighborhood has unique hero imagery, pricing tiers, and local highlights. This hierarchical structure improves SEO through topic clustering and provides visitors detailed neighborhood-level insights.*

- Created parent pillar page: Wilmington, DE (/areas/wilmington-de)
- Created 4 nested sub-neighborhood pages with hierarchical URL structure:
  - North Wilmington (/areas/wilmington-de/north-wilmington) - Family-friendly suburban market ~$450K
  - Highlands (/areas/wilmington-de/highlands) - Luxury historic estates ~$750K
  - Forty Acres (/areas/wilmington-de/forty-acres) - Walkable historic charm ~$385K
  - Trolley Square (/areas/wilmington-de/trolley-square) - Vibrant urban village ~$350K
- Generated 5 unique AI hero images (golden hour lighting, aerial perspectives)
- Parent page links to all 4 neighborhoods for easy navigation
- All neighborhood links filtered to exclude forbidden domains
- Full JSON-LD schema markup with hierarchical organization
- Updated App.tsx routing with all 5 new routes

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript (SPA)
- **Routing**: Wouter
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom CSS variables
- **Component Library**: shadcn/ui (built on Radix UI)
- **State Management**: TanStack Query (React Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **UI/UX Decisions**: Clean, professional aesthetic; responsive design; optimized image loading for various screen sizes; efficient font loading; lazy loading for images below the fold.

## Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ES modules)
- **API Design**: RESTful API with JSON responses
- **Request Handling**: Express middleware (JSON parsing, URL encoding, logging)
- **Error Handling**: Centralized middleware with structured JSON responses

## Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Development Storage**: In-memory for rapid development
- **Schema Management**: Drizzle Kit for migrations
- **Data Validation**: Zod schemas

## Authentication and Authorization
- **Current Implementation**: Basic contact form (no user authentication)
- **Session Management**: connect-pg-simple for PostgreSQL session storage (configured)

## Development and Deployment
- **Development Server**: Vite with HMR
- **Production Build**: Vite (frontend), esbuild (backend)
- **Environment Configuration**: Environment variables

## Key Design Patterns
- **Separation of Concerns**: Clear client/server/shared code
- **Type Safety**: End-to-end TypeScript
- **Component Composition**: Reusable UI components
- **Server-Side Rendering**: Static HTML with client-side hydration
- **Progressive Enhancement**: Graceful degradation

## SEO and Discoverability
- **Structured Data**: JSON-LD schemas (Organization, RealEstateAgent, WebSite, ProfessionalService, FAQPage)
- **Meta Tags**: Comprehensive titles, descriptions, keywords, Open Graph, Twitter Cards
- **Robots.txt**: Dynamic, environment-aware configuration (disallows `/admin`, points to sitemap)
- **Sitemap.xml**: Auto-generated XML sitemap for public pages
- **Search Engine Notification**: Manual ping functionality for Google and Bing
- **Google Analytics**: Tracking via ID G-W0TB4Y83E8
- **Canonical URLs**: Proper canonical tags

## Feature Specifications
- **Property Listings**: Supports both sales and rental listings with visual indicators.
- **AI-Enhanced Content**: AI-generated property summaries and hero images for pillar pages, optimized for search engines.
- **Automated Listing Sync**: Integration with RE/MAX for automatic updates of property listings.
- **Pillar Pages**: Hierarchical community pages (e.g., Wilmington, DE and its sub-neighborhoods) with AI-generated images and filtered external links.
- **Admin Panel**: Functionality to edit property details, generate AI summaries, and ping search engines.
- **Performance Optimization**: Mobile-first approach with optimized image loading, font loading, and Core Web Vitals adherence.
- **Dedicated Service Pages**: Separate pages for buying, selling, property management, and specific locations.

# External Dependencies

## Database and Storage
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations
- **connect-pg-simple**: PostgreSQL session store

## UI and Styling
- **Radix UI**: Accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Google Fonts**: Inter, DM Sans, Fira Code, Geist Mono, Architects Daughter

## Development Tools
- **Vite**: Frontend build tool
- **esbuild**: Backend bundler
- **PostCSS**: CSS processing
- **TypeScript**: Static type checking

## Third-Party Services
- **Unsplash**: External image hosting
- **Replit**: Development environment integration
- **GoHighLevel (GHL)**: CRM integration for lead capture
  - SDK: `@gohighlevel/api-client`
  - Authentication: `GHL_SECRET` environment variable
  - Custom Fields: 10 compliance tracking fields (prefixed with `contact.`)
  - Custom Field IDs: Fetched dynamically
  - Fallback: Contacts created without custom fields if not configured

## Runtime Libraries
- **TanStack Query**: Server state management
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation
- **date-fns**: Date manipulation
- **clsx/twMerge**: Conditional CSS class management

# Pillar Pages Status

## Published Pillar Pages (33 Total)
**Delaware (28 pages):**
- Middletown, Laytonsville, Rehoboth Beach, Lewes, Milton, Georgetown, Smyrna, Harrington, New Castle, Hockessin (surrogate), Greenville (surrogate), Stanton (surrogate), Greenwood, Harrington, Bridgeville, Dewey Beach, Fenwick Island, South Bethany, Dagsboro, Frankford, Millville, Long Neck, Georgetown, Seaford, Centreville, North Star

**Wilmington, DE (Parent + 4 Sub-neighborhoods):**
- Wilmington, DE (parent)
- North Wilmington, Highlands, Forty Acres, Trolley Square (nested sub-pages)

**Maryland (5 pages):**
- Perryville, MD
- North East, MD
- Elkton, MD
- Chesapeake City, MD

## Missing Pillar Pages (Queued for Future Development)
**Delaware (11 pages):**
- Newark, DE
- Pike Creek, DE
- Glasgow, DE
- St. Georges, DE
- Clayton, DE
- Dover, DE
- New Castle County (regional page)
- Sussex County (regional page)
- Kent County (regional page)

**Maryland (3 pages):**
- Aberdeen, MD
- Charlestown, MD
- Havre de Grace, MD

## Design Consistency Notes
- All pillar pages follow the same template with hero image, quick stats, spotlight property, price ranges, neighborhoods, highlights, and commute times
- Hero format: "Discover" + town name (small-caps) + state (all-caps)
- Spotlight: Highest-priced sale OR highest-priced rental if no sales available
- Links: All external references filtered to exclude forbidden domains (newhomesource.com, realtor.com, destateparks.com, 55places.com)
- Navigation: Nearby areas sections only link to published pillar pages to avoid 404 errors