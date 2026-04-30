# Changelog - Kevin Hensley's Homes Website

All notable changes to the Kevin Hensley real estate website will be documented in this file.

---

## [2.0.1] - 2026-04-29

### Fixed: Duplicate Content / Canonical URL Errors

*Google Search Console was reporting "Duplicate without user-selected canonical" on area pages like `/areas/smyrna-de/`. Every page on the site was affected.*

**Root cause:** The base `index.html` template had a hardcoded `<link rel="canonical" href="https://hensleyshomes.com" />`. Because this SPA serves the same HTML file for every route, every single page was telling Google it was a duplicate of the homepage — including all 34 area and neighborhood pages.

**What changed:**

- Removed the hardcoded root canonical from `client/index.html`
- In **production**: Express server now injects a page-specific `<link rel="canonical">` directly into the HTML `<head>` for every route before the response is sent — Google sees the correct canonical in the raw HTML source without needing to execute JavaScript. Trailing slashes are stripped so both `/areas/smyrna-de` and `/areas/smyrna-de/` resolve to the same canonical URL.
- In **development**: React's existing `SEOHead` component continues to handle canonical tags dynamically via `react-helmet-async`
- Also added canonical tag to the `/properties` route, which has its own server-side handler separate from the catch-all

This fix applies to all 34 public-facing pages simultaneously.

---

## [2.0.0] - 2026-04-28

### SEO & AEO Overhaul — Structured Data, Census Integration, Broken Links, Search Engine Submission

*A comprehensive SEO/AEO (Answer Engine Optimization) pass covering server-side schema injection, live Census data on all neighborhood pages, broken link repairs, and direct search engine submission integrations.*

---

#### New Pages Added

Five new Middletown sub-neighborhood pages, each with full community writeup, live U.S. Census ACS data, and a shareable data infographic:

- **Parkside** — `/areas/middletown-de/parkside`
- **Bayberry** — `/areas/middletown-de/bayberry`
- **The Estates at St. Anne's** — `/areas/middletown-de/st-annes`
- **The Town of Whitehall** — `/areas/middletown-de/whitehall`
- **Hyetts Corner / Hyetts Crossing** — `/areas/middletown-de/hyetts-corner`

---

#### Server-Side JSON-LD Schema Injection

*Google and AI assistants now read your structured data directly from the HTML source, not from JavaScript that runs after the page loads. This is the most SEO-effective way to deliver schema markup.*

- Moved all JSON-LD structured data from client-side `useEffect` calls to server-side `<head>` injection using `react-helmet-async`
- Every page now includes appropriate schema types: `RealEstateAgent`, `Neighborhood`, `Dataset`, `FAQPage`, `BreadcrumbList`, `WebPage`
- Added Kevin's professional headshot URL to all `RealEstateAgent` schema objects
- Corrected agent name to "Kevin Hensley" across all structured data entries
- Added missing `description` and `license` fields to `Dataset` schemas on all 5 Middletown neighborhood pages (required for valid Dataset markup)
- Added `FAQPage` JSON-LD schema to 10 area pages that were previously missing it
- Added "Last Updated" timestamps visible on all pages for freshness signals

#### Live Census Data — Community DNA Section

*All neighborhood pages now show real U.S. Census Bureau data pulled directly from the American Community Survey (ACS 5-Year Estimates, 2023). Data is cached until January 1 each year to match the ACS release cycle.*

- **CensusStatsBar** component expanded with four new data dimensions:
  - Age distribution breakdown (Under 18 / Ages 18–64 / Ages 65+)
  - Commute mode breakdown (Drove alone / Carpool / Public transit / Walked / Work from home)
  - Household type (Family households / Married-couple households)
  - Year-built decade buckets (Built 2000+ / 1980–1999 / Pre-1980)
- Census tract mappings added for all 25+ area pages (Delaware + Maryland)
- Fixed Census API 400 error: request was sending 51 variables, exceeding the API's 50-variable hard limit — reduced to 45 variables
- Fixed data accuracy bug: the "Under 18" age calculation incorrectly included 18–21 year-olds (ACS variables B01001_007–009 male and B01001_031–033 female); corrected to only count true under-18 groups

#### SVG Neighborhood Infographic

*Each neighborhood page now includes a shareable, visually styled data infographic rendered server-side as a scalable vector image.*

- New `/api/infographic/:slug.svg` endpoint generates a 800×500 SVG data card
- Infographic displays: owner-occupancy rate, median household income, home vintage breakdown, and age distribution
- Embedded directly on each neighborhood page and available as a standalone URL for sharing

#### Sitemap Expansion

- Updated `sitemap.xml` to include all 30+ area and sub-neighborhood pages
- Correct priority and change frequency values assigned per page type

#### IndexNow Integration

*New admin tool: instantly notify Bing and other IndexNow-compatible search engines whenever new pages go live.*

- New `/api/admin/ping-search-engines` admin endpoint
- Submits all sitemap URLs to IndexNow in a single API call
- Returns a per-URL status report (HTTP 202 = accepted)
- IndexNow key file served at `/.well-known/` and root path

#### Google Indexing API Integration

*New admin tool: request immediate crawling of any page directly through Google's API.*

- New `/api/admin/google-index` admin endpoint
- Uses Google service account (`replit-google-search@foundrywave-tech.iam.gserviceaccount.com`) with `googleapis` package
- Submits each sitemap URL as a `URL_UPDATED` indexing request
- Returns per-URL success/failure summary
- Note: requires service account to be added as an Owner in Google Search Console to activate

#### Broken Link Repairs

*23 confirmed broken outbound links fixed across 13 files. Broken links are a negative ranking signal and create a poor user experience.*

- Fixed 10 confirmed 404 links: `middletown.delaware.gov`, `newarkde.gov`, `lennar.com` builder pages, RE/MAX `settings.php` URL
- Fixed 13 additional dead links: `kent.delaware.gov` → `kentcountyde.gov`, `smyrnapubliclibrary.org` → `duckcreek.lib.de.us`, and others provided with verified replacement URLs
- Removed one unresolvable HOA link (Parkside HOA); replaced with contact-Kevin text

---

## [1.4.0] - 2025-12-06

### AI-Enhanced Search Engine Visibility

*Your property listings now include AI-written descriptions optimized for Google and AI search engines. This helps your listings appear in more search results and provides better answers when people ask AI assistants about homes in your area.*

- Each property listing now has an AI-generated summary highlighting key selling points
- Added structured data that helps Google understand your listings as real estate properties
- Summaries update automatically when new listings are added
- Admin page now shows which listings have AI summaries and when they were created
- Added "Generate AI Summaries" button in admin panel to refresh descriptions anytime

## [1.3.0] - 2025-12-05

### Automated Listing Sync

*Your website now automatically stays in sync with your RE/MAX listings. New properties appear on your site within minutes, and sold/expired listings are automatically removed - no manual updates needed.*

- Website receives automatic updates whenever your RE/MAX listings change
- New listings appear on the site automatically with photos and details
- Sold or expired listings are automatically marked as inactive
- Rental properties are detected and labeled automatically
- Admin page shows listing status including any expired properties

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