# Overview

This is a full-stack real estate website application for "Kevin Hensley's Homes" - a local real estate agent and property management business. The application features a modern, responsive single-page website that showcases services, properties, testimonials, and includes a contact form for lead generation. The site supports both property sales and rental listings with visual indicators. Built with React and TypeScript on the frontend, Express.js on the backend, and designed with a clean, professional aesthetic using shadcn/ui components.

# Recent Changes

**December 6, 2025**: AI-Enhanced Search Engine Visibility

*Client Summary: Your property listings now include AI-written descriptions optimized for Google and AI search engines. This helps your listings appear in more search results and provides better answers when people ask AI assistants about homes in your area.*

- Each property listing now has an AI-generated summary highlighting key selling points
- Added structured data that helps Google understand your listings as real estate properties
- Summaries update automatically when new listings are added
- Admin page now shows which listings have AI summaries and when they were created
- Added "Generate AI Summaries" button in admin panel to refresh descriptions anytime

**December 5, 2025**: Automated Listing Sync

*Client Summary: Your website now automatically stays in sync with your RE/MAX listings. New properties appear on your site within minutes, and sold/expired listings are automatically removed - no manual updates needed.*

- Website receives automatic updates whenever your RE/MAX listings change
- New listings appear on the site automatically with photos and details
- Sold or expired listings are automatically marked as inactive
- Rental properties are detected and labeled automatically
- Admin page shows listing status including any expired properties

**November 26, 2025**: Mobile Performance Optimization

*Client Summary: Your website now loads faster on phones and tablets. Images load more efficiently based on screen size, and the site feels snappier overall - especially important since most home buyers browse on mobile.*

- Optimized image loading for different screen sizes (mobile, tablet, desktop)
- Improved font loading so text appears faster
- Images below the fold now load only when needed
- Reduced overall page weight for faster mobile performance

**November 11, 2025**: Hero Image Optimization

*Client Summary: The main photo on your homepage now loads 85-90% faster, especially on mobile devices. This improves the first impression visitors get when they land on your site.*

- Optimized the main homepage image from 825KB down to ~80KB on mobile
- Created multiple sizes for different devices (phone, tablet, desktop, retina)
- Images now load in modern formats that are smaller and faster
- Removed the GoHighLevel chat widget as requested

**November 10, 2025**: Website Speed Improvements

*Client Summary: Your website now meets Google's "Core Web Vitals" standards for speed and responsiveness. This helps with search rankings and gives visitors a better experience.*

- Homepage loads faster with optimized image loading
- Admin pages load separately so they don't slow down the public site
- Set up proper caching so returning visitors see pages instantly
- Optimized for Google's speed metrics (LCP, CLS, INP)

**November 10, 2025**: Dedicated Service Pages

*Client Summary: Your website now has separate pages for each service (buying, selling, property management) and for specific areas like Middletown, DE. This helps people find you when searching for these specific services.*

- Created dedicated pages: /buy, /sell, /property-management
- Created location page: /areas/middletown-de
- Updated navigation to link directly to these new pages
- Each page has its own search-optimized content

**November 10, 2025**: SEO URL Improvements

*Client Summary: Cleaned up your website's URLs so Google can better understand and index your pages. This helps prevent duplicate content issues that could hurt search rankings.*

- All pages now have consistent, clean URLs
- Each page has proper titles and descriptions for search engines
- Social media sharing now shows correct previews

**November 10, 2025**: Search Engine Notification

*Client Summary: Added a button in your admin panel to notify Google and Bing whenever you make changes to your site. This helps search engines discover your updates faster.*

- "Ping Search Engines" button in admin panel
- Notifies both Google and Bing of sitemap updates
- Shows confirmation of successful notifications

**November 10, 2025**: Property Editing

*Client Summary: You can now edit property details directly from the admin panel without needing to re-enter everything. Makes quick updates much easier.*

- Edit button on each listing in admin panel
- Update photos and mark properties as rentals
- Changes save immediately

**November 10, 2025**: Rental Property Support

*Client Summary: Your website now supports rental listings alongside sales. Rentals are clearly marked with a blue "FOR RENT" badge so visitors can easily tell them apart.*

- Properties can be marked as rentals in admin panel
- Blue "FOR RENT" badge displays on rental listings
- Rentals show in the same property grid as sales

# User Preferences

- Preferred communication style: Simple, everyday language.
- When updating Recent Changes, always include a client summary in italics that's suitable for invoices or status reports. Focus on results and benefits, not technical details.

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