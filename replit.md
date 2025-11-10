# Overview

This is a full-stack real estate website application for "Kevin Hensley's Homes" - a local real estate agent and property management business. The application features a modern, responsive single-page website that showcases services, properties, testimonials, and includes a contact form for lead generation. The site supports both property sales and rental listings with visual indicators. Built with React and TypeScript on the frontend, Express.js on the backend, and designed with a clean, professional aesthetic using shadcn/ui components.

# Recent Changes

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
  - Points to sitemap.xml for efficient discovery
  - Uses dynamic host detection for multi-environment support
- **Sitemap.xml**: Auto-generated XML sitemap at `/sitemap.xml` for search engine crawlers
  - Includes all main sections with proper priority and change frequency
  - Updates automatically with current date
  - Ready for expansion with future blog posts and property listings
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