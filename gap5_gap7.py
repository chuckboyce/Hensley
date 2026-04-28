"""
gap5_gap7.py
===========

Gap 5: Remove leftover client-side schema blocks from 6 Middletown-area TSX files.
        Files affected:
          client/src/pages/areas/middletown-de/index.tsx
          client/src/pages/areas/middletown-de/parkside.tsx
          client/src/pages/areas/middletown-de/bayberry.tsx
          client/src/pages/areas/middletown-de/st-annes.tsx
          client/src/pages/areas/middletown-de/whitehall.tsx
          client/src/pages/areas/middletown-de/hyetts-corner.tsx

Gap 7: Add a "Page last reviewed" <AreaLastUpdated> component to every area page
        so that each page shows a human-readable last-reviewed date near the footer.
        The component is a tiny shared file in client/src/components/area-last-updated.tsx.
"""

import re, pathlib, sys

BASE = pathlib.Path("client/src/pages/areas")

# ─────────────────────────────────────────────────────────────────────────────
# Gap 7 — Step 0: create the shared component
# ─────────────────────────────────────────────────────────────────────────────

COMPONENT_PATH = pathlib.Path("client/src/components/area-last-updated.tsx")
COMPONENT_SRC = '''\
import { Calendar } from "lucide-react";

interface AreaLastUpdatedProps {
  /** ISO-8601 date string, e.g. "2025-04-28" */
  date: string;
  /** Optional display label. Defaults to "Page last reviewed" */
  label?: string;
}

/**
 * Small "last reviewed" attribution badge shown near the foot of every area page.
 * Uses a <time> element for semantic HTML and schema.org dateModified signal.
 */
export default function AreaLastUpdated({ date, label = "Page last reviewed" }: AreaLastUpdatedProps) {
  const displayDate = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground py-2">
      <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
      <span>
        {label}:{" "}
        <time dateTime={date} itemProp="dateModified">
          {displayDate}
        </time>
      </span>
    </div>
  );
}
'''
COMPONENT_PATH.write_text(COMPONENT_SRC)
print(f"✅ Created {COMPONENT_PATH}")

# ─────────────────────────────────────────────────────────────────────────────
# Helper: strip the `const schemas = [...]` block and related import/JSX
# ─────────────────────────────────────────────────────────────────────────────

def remove_schemas_block(src: str, filepath: str) -> str:
    """Remove `const schemas = [...];` block from TSX source."""
    # Match: `  const schemas = [` ... `  ];`  (top-level 2-space indent)
    pattern = re.compile(
        r'\n  const schemas = \[.*?\n  \];',
        re.DOTALL,
    )
    m = pattern.search(src)
    if not m:
        print(f"  ⚠️  No 'const schemas' block found in {filepath}", file=sys.stderr)
        return src
    src = src[:m.start()] + src[m.end():]
    print(f"  ✅ Removed const schemas block from {filepath}")
    return src

def remove_jsonld_import(src: str, filepath: str) -> str:
    """Remove `import JsonLd from "@/components/JsonLd";` line."""
    pattern = re.compile(r'\nimport JsonLd from "@/components/JsonLd";\n')
    if not pattern.search(src):
        print(f"  ⚠️  No JsonLd import found in {filepath}", file=sys.stderr)
        return src
    src = pattern.sub('\n', src, count=1)
    print(f"  ✅ Removed JsonLd import from {filepath}")
    return src

def remove_jsonld_jsx(src: str, filepath: str) -> str:
    """Remove `      <JsonLd schemas={schemas} />` line (and surrounding blank line if any)."""
    pattern = re.compile(r'\n\s*<JsonLd schemas=\{schemas\} />\n')
    if not pattern.search(src):
        print(f"  ⚠️  No <JsonLd> JSX found in {filepath}", file=sys.stderr)
        return src
    src = pattern.sub('\n', src, count=1)
    print(f"  ✅ Removed <JsonLd> JSX from {filepath}")
    return src

# ─────────────────────────────────────────────────────────────────────────────
# Helper: inject AreaLastUpdated into a page
# ─────────────────────────────────────────────────────────────────────────────

def inject_last_updated(src: str, filepath: str, date: str) -> str:
    """
    1. Add import for AreaLastUpdated after last existing import line.
    2. Insert <AreaLastUpdated date="..." /> just before </main> or before <Footer />.
    """
    # --- import ---
    import_line = 'import AreaLastUpdated from "@/components/area-last-updated";'
    if import_line in src:
        print(f"  ℹ️  AreaLastUpdated import already present in {filepath}")
    else:
        # Insert after the last `import ... from` line
        last_import = list(re.finditer(r'\nimport .+ from ".+";\n', src))
        if not last_import:
            print(f"  ⚠️  Could not find import anchor in {filepath}", file=sys.stderr)
            return src
        pos = last_import[-1].end()
        src = src[:pos] + f'import AreaLastUpdated from "@/components/area-last-updated";\n' + src[pos:]
        print(f"  ✅ Added AreaLastUpdated import to {filepath}")

    # --- JSX: insert before </main> (preferred) or before <Footer /> ---
    jsx_snippet = f'\n        <AreaLastUpdated date="{date}" />\n'
    if '<AreaLastUpdated' in src:
        print(f"  ℹ️  AreaLastUpdated JSX already present in {filepath}")
        return src

    # Try to insert before the closing </main> tag
    main_close = re.search(r'\n(\s*)</main>', src)
    if main_close:
        pos = main_close.start()
        src = src[:pos] + jsx_snippet + src[pos:]
        print(f"  ✅ Inserted AreaLastUpdated JSX before </main> in {filepath}")
        return src

    # Fallback: before <Footer />
    footer_tag = re.search(r'\n(\s*)<Footer\b', src)
    if footer_tag:
        pos = footer_tag.start()
        src = src[:pos] + jsx_snippet + src[pos:]
        print(f"  ✅ Inserted AreaLastUpdated JSX before <Footer> in {filepath}")
        return src

    print(f"  ⚠️  Could not find </main> or <Footer> in {filepath}", file=sys.stderr)
    return src


# ─────────────────────────────────────────────────────────────────────────────
# File manifest
# Each entry: (relative path, date, has_schemas_block)
# ─────────────────────────────────────────────────────────────────────────────

REVIEWED_DATE = "2026-04-28"

FILES = [
    # (path relative to client/src/pages/areas, needs Gap5 cleanup, Gap7 date)
    # Middletown sub-pages — Gap 5 + Gap 7
    ("middletown-de/index.tsx",       True,  REVIEWED_DATE),
    ("middletown-de/parkside.tsx",    True,  REVIEWED_DATE),
    ("middletown-de/bayberry.tsx",    True,  REVIEWED_DATE),
    ("middletown-de/st-annes.tsx",    True,  REVIEWED_DATE),
    ("middletown-de/whitehall.tsx",   True,  REVIEWED_DATE),
    ("middletown-de/hyetts-corner.tsx", True, REVIEWED_DATE),

    # All other top-level area pages — Gap 7 only
    ("bear-de.tsx",                   False, REVIEWED_DATE),
    ("hockessin-de.tsx",              False, REVIEWED_DATE),
    ("smyrna-de.tsx",                 False, REVIEWED_DATE),
    ("townsend-de.tsx",               False, REVIEWED_DATE),
    ("new-castle-de.tsx",             False, REVIEWED_DATE),
    ("odessa-de.tsx",                 False, REVIEWED_DATE),
    ("north-star-de.tsx",             False, REVIEWED_DATE),
    ("centreville-de.tsx",            False, REVIEWED_DATE),
    ("delaware-city-de.tsx",          False, REVIEWED_DATE),
    ("glasgow-de.tsx",                False, REVIEWED_DATE),
    ("clayton-de.tsx",                False, REVIEWED_DATE),
    ("newark-de.tsx",                 False, REVIEWED_DATE),
    ("pike-creek-de.tsx",             False, REVIEWED_DATE),
    ("wilmington-de/index.tsx",       False, REVIEWED_DATE),
    ("wilmington-de/north-wilmington.tsx", False, REVIEWED_DATE),
    ("wilmington-de/highlands.tsx",   False, REVIEWED_DATE),
    ("wilmington-de/forty-acres.tsx", False, REVIEWED_DATE),
    ("wilmington-de/trolley-square.tsx", False, REVIEWED_DATE),
    ("chesapeake-city-md.tsx",        False, REVIEWED_DATE),
    ("elkton-md.tsx",                 False, REVIEWED_DATE),
    ("north-east-md.tsx",             False, REVIEWED_DATE),
    ("perryville-md.tsx",             False, REVIEWED_DATE),

    # /areas index
    ("index.tsx",                     False, REVIEWED_DATE),
]


errors = 0
for relpath, has_schemas, date in FILES:
    full = BASE / relpath
    if not full.exists():
        print(f"  ❌ FILE NOT FOUND: {full}", file=sys.stderr)
        errors += 1
        continue

    print(f"\n── {relpath} ──")
    src = full.read_text()

    if has_schemas:
        src = remove_schemas_block(src, relpath)
        src = remove_jsonld_import(src, relpath)
        src = remove_jsonld_jsx(src, relpath)

    src = inject_last_updated(src, relpath, date)

    full.write_text(src)

print(f"\n{'='*60}")
print(f"Done. Errors: {errors}")
