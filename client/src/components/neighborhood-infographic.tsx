import { useState } from "react";
import { Download, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NeighborhoodInfographicProps {
  /** Area page slug, e.g. "bear-de", "middletown-de/parkside" */
  slug: string;
  /** Display name shown above the card */
  neighborhoodName: string;
}

/**
 * Renders the server-generated SVG infographic for a neighborhood.
 * The SVG is fully self-contained (Census data + Hensley's Homes branding).
 *
 * The SVG URL can also be used as og:image for social sharing.
 */
export default function NeighborhoodInfographic({
  slug,
  neighborhoodName,
}: NeighborhoodInfographicProps) {
  const [copied, setCopied] = useState(false);

  // Normalise slug — strip leading slash if present
  const cleanSlug = slug.replace(/^\//, "");

  // For sub-neighborhood slugs like "middletown-de/parkside" the server
  // expects only the final segment as the Census lookup key (e.g. "parkside")
  const censusSlug = cleanSlug.includes("/")
    ? cleanSlug.split("/").pop()!
    : cleanSlug;

  const svgUrl = `/api/infographic/${censusSlug}.svg`;
  const absoluteUrl = `https://hensleyshomes.com${svgUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback — select the text
    }
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = svgUrl;
    a.download = `${censusSlug}-neighborhood-profile.svg`;
    a.click();
  };

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Neighborhood Data Profile
            </h2>
            <p className="text-muted-foreground mt-1">
              US Census Bureau estimates for {neighborhoodName}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              {copied ? "Copied!" : "Copy Link"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Save SVG
            </Button>

            <a
              href={svgUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Open
              </Button>
            </a>
          </div>
        </div>

        {/* Infographic card */}
        <div className="rounded-xl overflow-hidden border border-border shadow-md bg-white">
          <img
            src={svgUrl}
            alt={`Neighborhood data profile for ${neighborhoodName} — income, homeownership, commute, and age distribution from US Census Bureau`}
            className="w-full h-auto"
            loading="lazy"
            width={800}
            height={500}
          />
        </div>

        {/* Fine print */}
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Data sourced from the US Census Bureau American Community Survey (ACS 5-Year Estimates).
          Updated annually. For sharing, use:{" "}
          <a
            href={absoluteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            {absoluteUrl}
          </a>
        </p>
      </div>
    </section>
  );
}
