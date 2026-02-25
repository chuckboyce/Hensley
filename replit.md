# Overview

"Kevin Hensley's Homes" is a full-stack, responsive single-page application for a local real estate agent. It showcases services, property listings (sales and rentals), testimonials, and includes a contact form for lead generation. Built with React, TypeScript, Express.js, and shadcn/ui, the application aims to enhance online presence, attract potential clients, and streamline property showcasing. It features dynamic content generation, including AI-written property descriptions and community pillar pages, to improve SEO and user engagement.

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
- **Styling**: Tailwind CSS with custom CSS variables, shadcn/ui (Radix UI)
- **State Management**: TanStack Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **UI/UX Decisions**: Clean, professional, responsive design; optimized image loading; efficient font loading; lazy loading for images below the fold.

## Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ES modules)
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized middleware with structured JSON responses

## Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations
- **Data Validation**: Zod schemas

## Authentication and Authorization
- **Current Implementation**: Basic contact form (no user authentication)

## Development and Deployment
- **Development Server**: Vite with HMR
- **Production Build**: Vite (frontend), esbuild (backend)

## Key Design Patterns
- **Separation of Concerns**: Clear client/server/shared code
- **Type Safety**: End-to-end TypeScript
- **Component Composition**: Reusable UI components
- **Server-Side Rendering**: Static HTML with client-side hydration
- **Progressive Enhancement**: Graceful degradation

## SEO and Discoverability
- **Structured Data**: JSON-LD schemas (Organization, RealEstateAgent, WebSite, ProfessionalService, FAQPage)
- **Meta Tags**: Comprehensive titles, descriptions, keywords, Open Graph, Twitter Cards
- **Robots.txt**: Dynamic, environment-aware configuration
- **Sitemap.xml**: Auto-generated XML sitemap
- **Search Engine Notification**: Manual ping functionality for Google and Bing
- **Google Analytics**: Tracking
- **Canonical URLs**: Proper canonical tags
- **Security Headers**: CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy implemented via Express middleware.

## Feature Specifications
- **Property Listings**: Supports both sales and rental listings with visual indicators.
- **AI-Enhanced Content**: AI-generated property summaries and hero images for pillar pages, optimized for search engines.
- **Automated Listing Sync**: Integration with RE/MAX for automatic updates of property listings.
- **Pillar Pages**: Hierarchical community pages with AI-generated images and filtered external links. Includes breadcrumb navigation with JSON-LD schema.
- **Admin Panel**: Functionality to edit property details, generate AI summaries, and ping search engines.
- **Performance Optimization**: Mobile-first approach with optimized image loading, font loading, and Core Web Vitals adherence.
- **Dedicated Service Pages**: Separate pages for buying, selling, property management, and specific locations.
- **Audio Property Tours**: MP3 player integrated into property listing cards for guided audio tours.

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
- **GoHighLevel (GHL)**: CRM integration for lead capture via `@gohighlevel/api-client`

## Runtime Libraries
- **TanStack Query**: Server state management
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation
- **date-fns**: Date manipulation
- **clsx/twMerge**: Conditional CSS class management
- **rss-parser**: RSS/Atom feed parsing for CMS content ingestion

# Recent Changes

## February 17, 2026 — Headless CMS & Local News System
*Built a complete content management system that automatically pulls local news from RSS feeds, generates AI-powered summaries and FAQs tailored to each community, and displays them on all 19 location pages — boosting SEO with fresh, location-specific content and FAQ schema markup.*

- Created database tables for RSS feed sources (`rss_feeds`) and articles (`cms_articles`) with AI summaries, FAQ storage, location tagging, and publish/draft workflow
- Built RSS feed fetcher that imports articles from configured news sources with duplicate detection
- Integrated OpenAI (gpt-4o-mini) to generate location-specific article summaries and FAQ sets using real estate keywords and the site's brand voice
- Added admin CMS panel at `/admin/cms` with feed management, article review, AI content generation, editing, and publish/unpublish workflow
- Created public JSON API (`/api/cms/articles`) for serving published content by location — designed API-first so other sites can consume it
- Built reusable Local News & Updates component with FAQ JSON-LD schema markup for search engine visibility
- Integrated Local News section into all 19 community pillar pages with location-specific content filtering

## February 25, 2026 — Team Page Update & Address Edit Fix
*Updated the About section to introduce Megan Donahue as a second team member, giving the site a "Meet the Team" feel that better reflects the full Hensley's Homes crew. Also fixed a bug where editing a property's street address in the admin panel appeared to save but wasn't actually being stored.*

- Redesigned the About section from a single agent profile into a two-column team grid featuring Kevin Hensley and Megan Donahue, each with their own photo, bio, stats, and credential badges
- Wrote Megan's new bio highlighting her 20+ years in new home building and real estate, builder relationships (Ryan Homes, DRB Homes, DR Horton, Schell Brothers), and expertise in Kent & Sussex County for RE/MAX Eagle Realty
- Added Megan's professional headshot to the site
- Fixed property address edit bug: the admin edit modal was accepting the new address but the storage layer was silently discarding it before writing to the database