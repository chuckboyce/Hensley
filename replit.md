# Overview

This is a full-stack real estate website application for "Kevin Hensley's Homes" - a local real estate agent and property management business. The application features a modern, responsive single-page website that showcases services, properties, testimonials, and includes a contact form for lead generation. The site supports both property sales and rental listings with visual indicators. Built with React and TypeScript on the frontend, Express.js on the backend, and designed with a clean, professional aesthetic using shadcn/ui components.

# Recent Changes

**December 5, 2025**: Automated RE/MAX listing scraper integration
- Created Python/Playwright scraper (`scripts/scrape-listings.py`) to extract listings from kevin-hensley.remax.com
- Extracts MLS ID, address, price, cover photo URL, description, bedrooms, bathrooms, square feet, year built
- Added database fields: `isActive` (boolean), `lastSeen` (timestamp), `dateFound` (timestamp) for listing lifecycle tracking
- Created sync script (`scripts/sync-listings.ts`) that runs Python scraper and updates database
- Added `POST /api/admin/sync-listings` endpoint to trigger sync from admin panel
- Added `GET /api/admin/properties/all` endpoint for admin to see all listings including expired
- Public `/api/properties` endpoint now only returns active listings
- Admin manage-listings page shows "EXPIRED" badge for inactive listings
- Listings not found in latest scrape are automatically marked as inactive
- Eliminates manual photo uploads and listing updates

**November 26, 2025**: Mobile performance optimization
- Updated hero image preloading with media queries for responsive loading (mobile/tablet/desktop WebP)
- Changed hero component to use picture element with responsive sources (WebP with JPEG fallback)
- Made Google Fonts non-render-blocking with preload and font-display swap pattern
- Removed 180+ lines of inline JSON-LD from index.html, moved to React StructuredData component
- Added Organization and FAQ schema generators to structuredData.ts utility
- Added lazy loading (loading="lazy") and decoding="async" to all below-fold images
- Added explicit width/height attributes to prevent CLS on about, service-area, testimonials, footer
- Removed unused framer-motion package (~100KB bundle savings)
- Verified recharts is code-split to only load on admin pages

**November 11, 2025**: Optimized hero image for LCP performance
- Downloaded and self-hosted hero image (originally 825KB from Unsplash)
- Created image optimization script (`scripts/optimize-hero-image.ts`) using Sharp
- Generated 4 responsive sizes: mobile (640w), tablet (1024w), desktop (1920w), 2x/retina (2560w)
- Generated 3 formats per size: AVIF, WebP, JPEG (12 total optimized images)
- Achieved 85-90% file size reduction on mobile (123KB AVIF, 82KB WebP vs 825KB original)
- Implemented responsive picture element with format fallbacks (AVIF → WebP → JPEG)
- Updated preload tags with media queries for viewport-specific image loading
- Images stored in `client/public/` directory for Vite serving in development
- Added `express.static('public')` middleware in server/index.ts for production
- Removed GoHighLevel chat widget per user request

**November 10, 2025**: Implemented Core Web Vitals performance optimizations
- Added hero image preload with fetchpriority=high for LCP optimization (target: < 2.5s)
- Implemented lazy loading for admin/portal pages using React.lazy() with Suspense
- Configured long-cache headers in Express: 1 year for versioned assets, 1 day for static files
- Added explicit width/height attributes to header logos and hero image to prevent CLS (target: < 0.1)
- Deferred non-critical JavaScript (Google Analytics) for better INP (target: < 200ms)
- Optimized bundle size by code-splitting non-critical routes (Portal, AdminListings, ManageListings, DoorLoopTest)
- Performance targets: LCP < 2.5s, CLS < 0.1, INP < 200ms on mobile

**November 10, 2025**: Implemented semantic URL structure for improved SEO and user experience
- Created dedicated service pages: /buy, /sell, /property-management
- Created area-specific page: /areas/middletown-de for location-based content
- Updated header navigation to link directly to service pages (removed scroll-based navigation)
- Updated sitemap.xml to include all new semantic URLs with proper priority and changefreq
- Added comprehensive SEO metadata in SEOHead component for all new routes
- All pages feature full layouts with detailed content, benefits, and clear CTAs
- Mobile navigation updated with same semantic URL structure

**November 10, 2025**: Implemented dynamic canonical URLs and trailing slash consistency
- Created SEOHead component to dynamically update canonical URLs based on current route
- Ensured all routes follow consistent pattern without trailing slashes
- Dynamic meta tag updates (title, description, OG tags, Twitter cards) per page
- Canonical URLs normalize paths by removing trailing slashes and hash fragments
- All internal links verified to use consistent URL structure

**November 10, 2025**: Added search engine ping functionality
- Created utility function to ping Google and Bing with sitemap URL
- Added POST `/api/admin/ping-search-engines` endpoint to notify search engines of sitemap updates
- Implemented "Ping Search Engines" button on manage-listings page for manual submission
- Automatic notification to Google Search Console and Bing Webmaster Tools
- Success feedback shows how many search engines were successfully notified

**November 10, 2025**: Added property edit functionality
- Implemented edit dialog on manage-listings page for updating property details
- Added `updatePropertyDetailsSchema` for validating partial updates (imageUrl and isRental only)
- Created narrowly-scoped `updatePropertyDetails` storage method to prevent accidental field updates
- PATCH `/api/admin/properties/:listingKey` endpoint with safeParse validation returning 400 for all invalid payloads
- Edit modal supports image upload (via existing upload endpoint) and rental checkbox
- Proper error handling with detailed validation feedback

**November 10, 2025**: Added rental property support
- Added `isRental` boolean field to properties database schema
- Admin panel now includes checkbox to mark properties as rentals
- Public properties page displays blue "FOR RENT" badge (top-left) on rental property images
- Manage listings page shows "RENTAL" badge next to rental property addresses
- Database automatically defaults isRental to false for all existing properties

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript in a single-page application (SPA) structure
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Request Handling**: Express middleware for JSON parsing, URL encoding, and request logging
- **Error Handling**: Centralized error handling middleware with structured JSON responses

## Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Development Storage**: In-memory storage implementation for rapid development
- **Schema Management**: Drizzle Kit for database migrations and schema changes
- **Data Validation**: Zod schemas for runtime type checking and validation

## Authentication and Authorization
- **Current Implementation**: Basic contact form submission without authentication
- **Session Management**: Connect-pg-simple for PostgreSQL session storage (configured but not actively used)
- **Security**: CORS enabled, request logging, and input validation

## Development and Deployment
- **Development Server**: Vite dev server with hot module replacement (HMR)
- **Production Build**: Vite for frontend, esbuild for backend bundling
- **Static Assets**: Served through Express with Vite middleware in development
- **Environment Configuration**: Environment variables for database connection and feature flags

## Key Design Patterns
- **Separation of Concerns**: Clear separation between client, server, and shared code
- **Type Safety**: End-to-end TypeScript with shared types between frontend and backend
- **Component Composition**: Reusable UI components with consistent design system
- **Server-Side Rendering**: Static HTML with client-side hydration
- **Progressive Enhancement**: Graceful degradation for users without JavaScript

## SEO and Discoverability
- **Structured Data**: JSON-LD schemas for Organization, RealEstateAgent, WebSite, ProfessionalService, and FAQPage
- **Meta Tags**: Comprehensive title, description, keywords, and social media tags (Open Graph, Twitter Cards)
- **Robots.txt**: Dynamic robots.txt at `/robots.txt` with environment-aware configuration
  - Allows all search engines to crawl the entire site
  - Explicitly disallows /admin directory to prevent indexing of admin pages
  - Points to sitemap.xml for efficient discovery
  - Uses dynamic host detection for multi-environment support
- **Sitemap.xml**: Auto-generated XML sitemap at `/sitemap.xml` for search engine crawlers
  - Includes only public pages (home, services, properties, testimonials, contact)
  - Excludes all admin pages for security and SEO best practices
  - Updates automatically with current date
  - Ready for expansion with future blog posts and property listings
- **Search Engine Notification**: Manual ping functionality to notify Google and Bing of sitemap updates
- **Google Analytics**: Tracking configured with ID G-W0TB4Y83E8
- **Canonical URLs**: Proper canonical tags to prevent duplicate content issues

# External Dependencies

## Database and Storage
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe database operations and schema management
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## UI and Styling
- **Radix UI**: Accessible, unstyled UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Web fonts (Inter, DM Sans, Fira Code, Geist Mono, Architects Daughter)

## Development Tools
- **Vite**: Frontend build tool and development server
- **esbuild**: Fast JavaScript/TypeScript bundler for backend
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer
- **TypeScript**: Static type checking and compilation

## Third-Party Services
- **Unsplash**: External image hosting for property photos and stock imagery
- **Replit**: Development environment integration with custom plugins and banners
- **GoHighLevel (GHL)**: CRM integration for lead capture and automated follow-up
  - **SDK**: Uses official `@gohighlevel/api-client` npm package for all API interactions
  - **Authentication**: Private integration token via `GHL_SECRET` environment variable
  - **Custom Fields**: 10 compliance tracking fields (all prefixed with `contact.`):
    - `contact.method`, `contact.textshown`, `contact.timetamp` (note typo in GHL), `contact.ip`
    - `contact.useragent`, `contact.pageurl`, `contact.referrer`
    - `contact.consentsms`, `contact.consentemail`, `contact.evidenceid`
  - **Important**: Custom field names MUST include the `contact.` prefix when sending to GHL API
  - **Custom Field IDs**: Field definitions are fetched dynamically to map field keys to their unique IDs
  - **Fallback**: If custom fields aren't configured, contacts are created without them (metadata saved locally)

## Runtime Libraries
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition
- **date-fns**: Date manipulation and formatting utilities
- **clsx/twMerge**: Conditional CSS class management