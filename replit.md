# Overview

This full-stack real estate website, "Kevin Hensley's Homes," is a responsive single-page application built for a local real estate agent. It showcases services, property listings (sales and rentals), testimonials, and includes a contact form for lead generation. The application features a modern, clean design, leveraging React, TypeScript, Express.js, and shadcn/ui. Its purpose is to enhance online presence, attract potential clients, and streamline property showcasing. The site dynamically generates and optimizes content, including AI-written property descriptions and community pillar pages, to improve search engine visibility and user engagement.

# User Preferences

- **Communication Style**: Simple, everyday language. Avoid technical jargon.
- **Recent Changes Format**: Always include a client summary in italics that's suitable for invoices or status reports. Focus on results and benefits, not technical details.
- **Documentation Updates**: Update the Recent Changes section in this file at each checkpoint.
- **Navigation Behavior**: Always scroll to top of page on route change, unless landing on a specific anchor (hash link).

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

## Published Pillar Pages (31 Total)
**Delaware (28 pages):**
- Middletown, Laytonsville, Rehoboth Beach, Lewes, Milton, Georgetown, Smyrna, Harrington, New Castle, Hockessin (surrogate), Greenville (surrogate), Stanton (surrogate), Greenwood, Harrington, Bridgeville, Dewey Beach, Fenwick Island, South Bethany, Dagsboro, Frankford, Millville, Long Neck, Georgetown, Seaford, Centreville, North Star

**Wilmington, DE (Parent + 4 Sub-neighborhoods):**
- Wilmington, DE (parent)
- North Wilmington, Highlands, Forty Acres, Trolley Square (nested sub-pages)

**Maryland (3 pages):**
- Perryville, MD
- North East, MD

## Missing Pillar Pages (Queued for Future Development)
**Delaware (8 pages):**
- Newark, DE
- Pike Creek, DE
- Glasgow, DE
- St. Georges, DE
- Clayton, DE
- Dover, DE

**Maryland (5 pages):**
- Aberdeen, MD
- Charlestown, MD
- Elkton, MD
- Chesapeake City, MD
- Havre de Grace, MD

## Design Consistency Notes
- All pillar pages follow the same template with hero image, quick stats, spotlight property, price ranges, neighborhoods, highlights, and commute times
- Hero format: "Discover" + town name (small-caps) + state (all-caps)
- Spotlight: Highest-priced sale OR highest-priced rental if no sales available
- Links: All external references filtered to exclude forbidden domains (newhomesource.com, realtor.com, destateparks.com, 55places.com)
- Navigation: Nearby areas sections only link to published pillar pages to avoid 404 errors