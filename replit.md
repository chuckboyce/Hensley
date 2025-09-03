# Overview

This is a full-stack real estate website application for "Hensley's Homes" - a local real estate agent and property management business. The application features a modern, responsive single-page website that showcases services, properties, testimonials, and includes a contact form for lead generation. Built with React and TypeScript on the frontend, Express.js on the backend, and designed with a clean, professional aesthetic using shadcn/ui components.

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

## Runtime Libraries
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition
- **date-fns**: Date manipulation and formatting utilities
- **clsx/twMerge**: Conditional CSS class management