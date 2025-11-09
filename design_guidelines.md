# Hensley's Homes Property Portal - Design Guidelines

## Design Approach
**Reference-Based**: Drawing from premium real estate platforms (Zillow, Apartments.com, Redfin) with emphasis on trust-building and dual-audience navigation. Clean, professional aesthetic prioritizing credibility and ease of access.

## Typography System
- **Primary Font**: Inter (Google Fonts) - Modern, professional, excellent readability
- **Headings**: 
  - H1: 3.5rem (56px) / font-bold / leading-tight
  - H2: 2.5rem (40px) / font-semibold / leading-snug
  - H3: 1.875rem (30px) / font-semibold
- **Body**: 1.125rem (18px) / font-normal / leading-relaxed
- **Buttons/CTAs**: 1rem (16px) / font-semibold / uppercase tracking-wide

## Layout & Spacing System
**Tailwind Units**: 4, 6, 8, 12, 16, 20, 24
- Section padding: py-20 (desktop), py-12 (mobile)
- Component spacing: gap-8, gap-12
- Container: max-w-7xl with px-6
- Card padding: p-8

## Page Structure (7 Sections)

### 1. Header/Navigation
Fixed navigation with logo left, centered menu (Home, About, Contact), right-aligned "Owner Login" + "Tenant Login" buttons. Height: h-20. Background: backdrop-blur with subtle border-b.

### 2. Hero Section (100vh)
**Large hero image**: Professional property exterior/interior (modern home with warm lighting). Full-width, overlay gradient (dark bottom to transparent top).

**Content centered**:
- Main headline: "Professional Property Management for Hensley's Homes"
- Subheading: "Secure portal access for property owners and tenants"
- Two prominent CTAs with blurred backgrounds (bg-white/20 backdrop-blur-md):
  - "Owner Portal Access" (primary)
  - "Tenant Portal Access" (secondary outline)
- Small trust badge row below: "Powered by DoorLoop • Secure Access • 24/7 Support"

### 3. Dual Audience Split Section
Two-column grid (lg:grid-cols-2, gap-8):

**Left Column - Property Owners**:
- Icon: Building/home icon
- Headline: "For Property Owners"
- 4 feature bullets with checkmarks
- CTA button: "Access Owner Portal"

**Right Column - Tenants**:
- Icon: Key icon
- Headline: "For Tenants"
- 4 feature bullets with checkmarks
- CTA button: "Access Tenant Portal"

Each column has subtle card styling (border, rounded-2xl, p-12).

### 4. Features Grid
Three-column layout (grid-cols-1 md:grid-cols-3, gap-8):
- **Maintenance Requests**: Icon + title + 2-line description
- **Rent Payments**: Icon + title + 2-line description
- **Document Management**: Icon + title + 2-line description
- **Communication Tools**: Icon + title + 2-line description
- **Property Analytics**: Icon + title + 2-line description
- **Lease Management**: Icon + title + 2-line description

### 5. Trust & Security Section
Centered content block (max-w-4xl):
- Shield icon (large)
- Headline: "Bank-Level Security & Support"
- Supporting paragraph about encryption, data protection
- Three-column stats grid:
  - "256-bit Encryption"
  - "99.9% Uptime"
  - "24/7 Support"

### 6. CTA Section with Image
Two-column split:
- **Left**: Image of professional property manager or happy tenant
- **Right**: 
  - Headline: "Ready to Get Started?"
  - Body text about easy access
  - Two stacked CTAs (Owner/Tenant portal)
  - Help link: "Need assistance? Contact support"

### 7. Footer
Four-column grid (grid-cols-1 md:grid-cols-4, gap-12):
- **Column 1**: Hensley's Homes logo + tagline
- **Column 2**: Quick Links (Home, About, Properties, Contact)
- **Column 3**: Portal Access (Owner Login, Tenant Login)
- **Column 4**: Contact Info (phone, email, address)

Bottom bar: Copyright, "Powered by DoorLoop", Privacy/Terms links

## Component Specifications

**Buttons**:
- Primary: Solid fill, rounded-lg, px-8 py-4, shadow-lg
- Secondary: Border-2, rounded-lg, px-8 py-4
- Buttons on images: backdrop-blur-md, bg-white/20, border border-white/30

**Cards**:
- Border: border border-gray-200
- Rounded: rounded-2xl
- Shadow: shadow-md, hover:shadow-xl transition
- Padding: p-8 to p-12

**Icons**: 
- Heroicons (CDN)
- Sizes: w-8 h-8 (feature icons), w-16 h-16 (section icons)

## Images Section

**Hero Image**: 
Professional real estate photography - modern home exterior at golden hour or upscale interior with natural lighting. Full-width background image with subtle dark gradient overlay (top: transparent, bottom: rgba(0,0,0,0.4)).

**CTA Section Image**:
Professional photo of property manager at desk with laptop or happy tenant/family in home. Portrait orientation, fills left half of section.

**Optional Supporting Images**:
- Feature icons can use illustration style graphics
- Trust section could include subtle background pattern

## Animations
Minimal approach:
- Fade-in on scroll for section reveals
- Button hover: subtle scale (scale-105) + shadow increase
- Card hover: shadow transition only
- No complex animations or parallax effects