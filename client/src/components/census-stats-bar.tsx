import { useQuery } from "@tanstack/react-query";
import { Home, DollarSign, Calendar, Info } from "lucide-react";

interface CensusData {
  ownerOccupancyPct: number | null;
  medianHouseholdIncome: number | null;
  medianYearBuilt: number | null;
  vintageYear: number;
  asOfDate: string;
  cachedUntil: string;
}

interface CensusStatsBarProps {
  neighborhoodSlug: string;
}

function formatCurrency(val: number | null) {
  if (val === null) return "N/A";
  return `$${val.toLocaleString()}`;
}

export default function CensusStatsBar({ neighborhoodSlug }: CensusStatsBarProps) {
  const { data, isLoading, isError } = useQuery<{ success: boolean; data: CensusData }>({
    queryKey: ["/api/census/neighborhood", neighborhoodSlug],
    queryFn: () =>
      fetch(`/api/census/neighborhood/${neighborhoodSlug}`).then((r) => {
        if (!r.ok) throw new Error("Census data unavailable");
        return r.json();
      }),
    staleTime: 1000 * 60 * 60 * 24,
    retry: 1,
  });

  const census = data?.data;

  return (
    <section className="py-10 bg-secondary/40 border-y border-border">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-6 font-medium">
            Community DNA — Live Census Data
          </p>
          {isLoading && (
            <div className="grid grid-cols-3 gap-6 text-center">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-8 bg-muted rounded w-20 mx-auto mb-2" />
                  <div className="h-4 bg-muted rounded w-32 mx-auto" />
                </div>
              ))}
            </div>
          )}
          {isError && (
            <p className="text-center text-sm text-muted-foreground italic">
              Census data temporarily unavailable. Please check back shortly.
            </p>
          )}
          {census && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    {census.ownerOccupancyPct !== null ? `${census.ownerOccupancyPct}%` : "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Owner-Occupied Homes</div>
                  <div className="text-xs text-muted-foreground">Housing Stability</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    {formatCurrency(census.medianHouseholdIncome)}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Median Household Income</div>
                  <div className="text-xs text-muted-foreground">Economic Context</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    {census.medianYearBuilt ?? "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Median Year Built</div>
                  <div className="text-xs text-muted-foreground">Development Character</div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5 flex-shrink-0" />
                <span>
                  Source: US Census Bureau {census.asOfDate} (Tables B25003, B19013, B25035). Data
                  refreshes annually each January.
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
