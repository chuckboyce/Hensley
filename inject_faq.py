"""
inject_faq.py
Injects FAQPage schema blocks into pageSchemas.ts for the 10 routes missing them.

Routes handled:
  1. /areas                              — add FAQPage before closing ]
  2. /areas/wilmington-de/north-wilmington  — wrap wilmingtonSubSchemas() in [...]
  3. /areas/wilmington-de/highlands         — wrap wilmingtonSubSchemas() in [...]
  4. /areas/wilmington-de/forty-acres       — wrap wilmingtonSubSchemas() in [...]
  5. /areas/wilmington-de/trolley-square    — wrap wilmingtonSubSchemas() in [...]
  6. /areas/middletown-de/parkside          — wrap neighborhoodSchemas() in [...]
  7. /areas/middletown-de/bayberry          — wrap neighborhoodSchemas() in [...]
  8. /areas/middletown-de/st-annes          — wrap neighborhoodSchemas() in [...]
  9. /areas/middletown-de/whitehall         — wrap neighborhoodSchemas() in [...]
 10. /areas/middletown-de/hyetts-corner     — wrap neighborhoodSchemas() in [...]
"""

import re, pathlib, sys

FILE = pathlib.Path("server/utils/pageSchemas.ts")
src = FILE.read_text()

# ─────────────────────────────────────────────────────────────────────────────
# FAQ blocks (raw TypeScript object literals — no surrounding braces wrapper)
# ─────────────────────────────────────────────────────────────────────────────

FAQ_AREAS = '''\
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What areas does Kevin Hensley serve in Delaware and Maryland?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Kevin Hensley serves communities throughout New Castle County and Kent County in Delaware — including Bear, Hockessin, Middletown, Wilmington, Newark, Pike Creek, Smyrna, and more — as well as Cecil County, Maryland towns such as Chesapeake City, Elkton, North East, and Perryville.",
          },
        },
        {
          "@type": "Question",
          name: "How do I get started buying or selling a home in Delaware?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Contact Kevin Hensley at (302) 218-0130 or visit hensleyshomes.com. Kevin provides a free consultation to review your goals, walk you through the current market in your target area, and outline next steps whether you are buying or selling.",
          },
        },
        {
          "@type": "Question",
          name: "Which Delaware school districts are covered by Kevin Hensley's service areas?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Kevin's service areas span several top-rated Delaware school districts including the Appoquinimink School District (Middletown, Odessa, Townsend), the Christina School District (Newark, Glasgow, Bear), the Red Clay Consolidated School District (Wilmington, Hockessin, Pike Creek), and the Brandywine School District (North Wilmington, Centreville).",
          },
        },
        {
          "@type": "Question",
          name: "Is now a good time to buy a home in Delaware?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Delaware continues to attract buyers from New Jersey, Pennsylvania, and Maryland due to its low property taxes, no sales tax, and relatively affordable home prices compared to neighboring states. Kevin Hensley can provide current market conditions and inventory data for any specific community.",
          },
        },
      ],
    }'''

FAQ_NORTH_WILMINGTON = '''\
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is North Wilmington, Delaware known for?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "North Wilmington is a suburban residential area in New Castle County known for mature landscaping, family-friendly neighborhoods, top-rated Brandywine School District schools, and easy I-95 access to Wilmington and Philadelphia.",
          },
        },
        {
          "@type": "Question",
          name: "What are home prices like in North Wilmington, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "North Wilmington features a mix of split-levels, ranches, and colonials, with prices generally ranging from the mid-$200s to over $600,000 depending on the street and condition. Contact Kevin Hensley at (302) 218-0130 for current listing data.",
          },
        },
        {
          "@type": "Question",
          name: "Which school district serves North Wilmington?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Most of North Wilmington is served by the Brandywine School District, which includes Concord High School and several well-regarded elementary and middle schools.",
          },
        },
      ],
    }'''

FAQ_HIGHLANDS = '''\
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What makes the Highlands neighborhood in Wilmington, DE special?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The Highlands is one of Wilmington's most prestigious historic districts, featuring Tudor Revival, Colonial Revival, and Arts and Crafts architecture, tree-lined streets, and proximity to Brandywine Park and the Delaware Art Museum.",
          },
        },
        {
          "@type": "Question",
          name: "What type of homes are in the Highlands, Wilmington?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The Highlands is characterized by large historic single-family homes — many over 100 years old — with generous lot sizes, front porches, and architectural details uncommon in newer construction. Prices generally range from the $400s to over $1 million.",
          },
        },
        {
          "@type": "Question",
          name: "How close is the Highlands to downtown Wilmington?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The Highlands sits just north of downtown Wilmington, roughly a 5–10 minute drive or a pleasant walk via Brandywine Park to the Rodney Square business district and Amtrak station.",
          },
        },
      ],
    }'''

FAQ_FORTY_ACRES = '''\
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the Forty Acres neighborhood in Wilmington, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Forty Acres is a historic urban neighborhood in Wilmington known for its tight-knit community, affordable rowhouses and twins, proximity to Brandywine Creek State Park, and strong neighborhood association. It borders the Highlands and Trolley Square areas.",
          },
        },
        {
          "@type": "Question",
          name: "Is Forty Acres a good neighborhood to buy in Wilmington?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Forty Acres offers some of Wilmington's more accessible price points for urban rowhouse living, with active neighborhood investment and convenient access to parks, dining, and I-95. Kevin Hensley can provide current active listings and market data.",
          },
        },
        {
          "@type": "Question",
          name: "What is commuting like from Forty Acres, Wilmington?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Forty Acres has strong commuter access — the Wilmington Amtrak station is about 10 minutes away, and I-95 provides quick connections to Philadelphia (30 min) and Baltimore (1 hour). DART bus routes also serve the area.",
          },
        },
      ],
    }'''

FAQ_TROLLEY_SQUARE = '''\
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Trolley Square in Wilmington, DE known for?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Trolley Square is Wilmington's most walkable urban neighborhood, known for its independent restaurants, boutique shops, Victorian rowhouses, and a vibrant arts and nightlife scene along Delaware Avenue.",
          },
        },
        {
          "@type": "Question",
          name: "What kind of homes are in Trolley Square, Wilmington?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Trolley Square features charming Victorian rowhouses, twins, and converted condos, many retaining original architectural details. It appeals to young professionals and buyers seeking walkable city living at moderate price points compared to larger East Coast metros.",
          },
        },
        {
          "@type": "Question",
          name: "Is Trolley Square walkable?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — Trolley Square consistently earns high Walk Scores for Wilmington. Residents can walk to numerous restaurants, coffee shops, yoga studios, and specialty retailers, and the Wilmington Amtrak station is about a 10-minute drive or DART bus ride away.",
          },
        },
      ],
    }'''

FAQ_PARKSIDE = '''\
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Parkside in Middletown, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Parkside is a luxury master-planned community in Middletown, Delaware, featuring resort-style amenities including a pool and clubhouse, direct trail access, and a variety of single-family homes and townhouses within the Appoquinimink School District.",
          },
        },
        {
          "@type": "Question",
          name: "What are home prices in Parkside, Middletown, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Parkside homes typically range from the mid-$300s to over $600,000 depending on size and build. The community offers both resale and new construction options. Contact Kevin Hensley at (302) 218-0130 for current availability.",
          },
        },
        {
          "@type": "Question",
          name: "Which schools serve Parkside in Middletown, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Parkside is served by the highly rated Appoquinimink School District, which includes Middletown High School, Meredith Middle School, and Bunker Hill Elementary.",
          },
        },
      ],
    }'''

FAQ_BAYBERRY = '''\
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Bayberry in Middletown, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Bayberry is an award-winning master-planned community in Middletown, Delaware featuring multiple distinct neighborhoods, scenic lakes, walking trails, parks, and the 55+ active-adult enclave known as the Ponds at Bayberry. It is one of the largest planned communities in Delaware.",
          },
        },
        {
          "@type": "Question",
          name: "Is Bayberry good for families?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — Bayberry is one of the most family-friendly communities in Delaware. It sits within the Appoquinimink School District, offers extensive trail and park infrastructure, and features a variety of home styles from townhouses to large single-family homes.",
          },
        },
        {
          "@type": "Question",
          name: "Does Bayberry have a 55+ section?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — the Ponds at Bayberry is the active adult (55+) section of the broader Bayberry community, featuring low-maintenance homes, clubhouse amenities, and a quiet, resort-style setting still close to Middletown's shopping and services.",
          },
        },
      ],
    }'''

FAQ_ST_ANNES = '''\
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is The Estates at St. Anne's in Middletown, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The Estates at St. Anne's is an upscale golf course community in Middletown, Delaware, featuring spacious estate homes, scenic fairway views, and easy Route 1 access. Homes typically offer larger lots and premium finishes within the Appoquinimink School District.",
          },
        },
        {
          "@type": "Question",
          name: "Does St. Anne's have a golf course?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — the community is centered around the St. Anne's Golf Course, providing residents with scenic fairway views and recreational access. The course and surrounding estates create a distinct upscale character compared to other Middletown neighborhoods.",
          },
        },
        {
          "@type": "Question",
          name: "How far is St. Anne's from Middletown town center?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "St. Anne's is located just minutes from Middletown's main commercial corridor on Route 299 and Middletown Warwick Road, providing easy access to restaurants, grocery stores, and the Christiana Mall via Route 1.",
          },
        },
      ],
    }'''

FAQ_WHITEHALL = '''\
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is The Town of Whitehall in Middletown, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The Town of Whitehall is a new urbanism community in Middletown, Delaware designed to blend homes, shops, parks, and walkability in a traditional neighborhood setting. It features front-porch architecture, mixed-use zoning, and a town center concept uncommon in Delaware new construction.",
          },
        },
        {
          "@type": "Question",
          name: "Can I walk to shops in Whitehall, Middletown?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "That is a key design goal of Whitehall — the community is being built to include walkable retail and services within the neighborhood itself, reducing car dependence compared to conventional suburban developments.",
          },
        },
        {
          "@type": "Question",
          name: "Is Whitehall new construction or resale?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Whitehall is predominantly new construction, with phased development ongoing. Both new build and early resale homes are available. Kevin Hensley can advise on builder contracts, incentives, and resale opportunities at (302) 218-0130.",
          },
        },
      ],
    }'''

FAQ_HYETTS_CORNER = '''\
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Hyetts Corner in Middletown, DE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Hyetts Corner (also marketed as Hyetts Crossing) is a collection of modern new construction communities in Middletown, Delaware featuring energy-efficient homes, contemporary open floor plans, and convenient Route 1 access within the Appoquinimink School District.",
          },
        },
        {
          "@type": "Question",
          name: "Are Hyetts Corner homes new construction?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — Hyetts Corner consists primarily of recently built or actively under-construction single-family homes and townhouses with modern energy-efficient features. Kevin Hensley works with buyers to navigate builder contracts and negotiate upgrades.",
          },
        },
        {
          "@type": "Question",
          name: "What school district is Hyetts Corner in?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Hyetts Corner falls within the Appoquinimink School District, consistently one of the top-rated districts in Delaware, serving students through Middletown High School.",
          },
        },
      ],
    }'''

# ─────────────────────────────────────────────────────────────────────────────
# 1. /areas — insert FAQPage before the areaDataset line at the end
# ─────────────────────────────────────────────────────────────────────────────
OLD_AREAS = '    areaDataset({ slug: "areas", name: "Delaware & Maryland Communities" }),\n  ],'
NEW_AREAS = f'{FAQ_AREAS},\n    areaDataset({{ slug: "areas", name: "Delaware & Maryland Communities" }}),\n  ],'
assert OLD_AREAS in src, "AREAS anchor not found"
src = src.replace(OLD_AREAS, NEW_AREAS, 1)

# ─────────────────────────────────────────────────────────────────────────────
# Helper: wrap a wilmingtonSubSchemas() or neighborhoodSchemas() call in [...]
# and append a FAQPage block.
# ─────────────────────────────────────────────────────────────────────────────
def wrap_route(src, route_key, func_call_start, faq_block):
    """
    Finds the line:
        "<route_key>": <func_call_start>({
    and its closing "}),\n" and wraps it like:
        "<route_key>": [
          ...<func_call_start>({...}),
          <faq_block>,
        ],
    """
    # Build a pattern to match the entire function call.
    # The call ends with `}),\n` on its own line.
    pattern = re.compile(
        r'("' + re.escape(route_key) + r'":\s*)(' + re.escape(func_call_start) + r'\(\{.*?\}\))',
        re.DOTALL,
    )
    m = pattern.search(src)
    if not m:
        print(f"  ❌ Pattern not found for {route_key}", file=sys.stderr)
        return src
    key_part = m.group(1)   # e.g. '  "/areas/wilmington-de/north-wilmington": '
    call_part = m.group(2)  # e.g. 'wilmingtonSubSchemas({...})'
    replacement = f'{key_part}[\n    ...{call_part},\n{faq_block},\n  ]'
    src = src[:m.start()] + replacement + src[m.end():]
    print(f"  ✅ Wrapped {route_key}")
    return src

# ─────────────────────────────────────────────────────────────────────────────
# 2–5. Wilmington sub-neighborhoods
# ─────────────────────────────────────────────────────────────────────────────
src = wrap_route(src, "/areas/wilmington-de/north-wilmington", "wilmingtonSubSchemas", FAQ_NORTH_WILMINGTON)
src = wrap_route(src, "/areas/wilmington-de/highlands",        "wilmingtonSubSchemas", FAQ_HIGHLANDS)
src = wrap_route(src, "/areas/wilmington-de/forty-acres",      "wilmingtonSubSchemas", FAQ_FORTY_ACRES)
src = wrap_route(src, "/areas/wilmington-de/trolley-square",   "wilmingtonSubSchemas", FAQ_TROLLEY_SQUARE)

# ─────────────────────────────────────────────────────────────────────────────
# 6–10. Middletown sub-neighborhoods
# ─────────────────────────────────────────────────────────────────────────────
src = wrap_route(src, "/areas/middletown-de/parkside",      "neighborhoodSchemas", FAQ_PARKSIDE)
src = wrap_route(src, "/areas/middletown-de/bayberry",      "neighborhoodSchemas", FAQ_BAYBERRY)
src = wrap_route(src, "/areas/middletown-de/st-annes",      "neighborhoodSchemas", FAQ_ST_ANNES)
src = wrap_route(src, "/areas/middletown-de/whitehall",     "neighborhoodSchemas", FAQ_WHITEHALL)
src = wrap_route(src, "/areas/middletown-de/hyetts-corner", "neighborhoodSchemas", FAQ_HYETTS_CORNER)

# ─────────────────────────────────────────────────────────────────────────────
# Write back
# ─────────────────────────────────────────────────────────────────────────────
FILE.write_text(src)
print("\nDone — pageSchemas.ts updated.")
