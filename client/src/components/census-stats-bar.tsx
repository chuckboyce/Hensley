import { useQuery } from "@tanstack/react-query";
import { Home, DollarSign, Calendar, Info, Users, Car, Building2, Baby } from "lucide-react";

// ── Types (mirrors server/services/census.ts) ─────────────────────────────────

interface AgeBuckets {
  under18Pct: number | null;
  age18to64Pct: number | null;
  age65plusPct: number | null;
  totalPopulation: number | null;
}

interface YearBuiltBuckets {
  total: number | null;
  pctBuiltPost2000: number | null;
  pctBuilt1980to1999: number | null;
  pctBuiltPre1980: number | null;
}

interface CommuteMode {
  total: number | null;
  droveAlonePct: number | null;
  carpoolPct: number | null;
  transitPct: number | null;
  walkedPct: number | null;
  workFromHomePct: number | null;
}

interface HouseholdType {
  totalHouseholds: number | null;
  familyHouseholdPct: number | null;
  marriedCouplePct: number | null;
}

interface CensusData {
  ownerOccupancyPct: number | null;
  medianHouseholdIncome: number | null;
  medianYearBuilt: number | null;
  vintageYear: number;
  asOfDate: string;
  cachedUntil: string;
  ageBuckets: AgeBuckets;
  yearBuiltBuckets: YearBuiltBuckets;
  commuteMode: CommuteMode;
  householdType: HouseholdType;
}

interface CensusStatsBarProps {
  neighborhoodSlug: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(val: number | null) {
  if (val === null) return "N/A";
  return `$${val.toLocaleString()}`;
}

function pct(val: number | null) {
  if (val === null) return "N/A";
  return `${val}%`;
}

/** Horizontal bar — width driven by a 0-100 percentage value */
function Bar({ value, color = "bg-primary" }: { value: number | null; color?: string }) {
  if (value === null) return null;
  return (
    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
      <div
        className={`${color} h-1.5 rounded-full transition-all`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

/** Skeleton loader tile */
function SkeletonTile() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-8 bg-muted rounded w-20 mx-auto" />
      <div className="h-4 bg-muted rounded w-28 mx-auto" />
      <div className="h-3 bg-muted rounded w-20 mx-auto" />
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

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
    <section className="py-12 bg-secondary/40 border-y border-border">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-5xl mx-auto">

          {/* Section header */}
          <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-8 font-medium">
            Community DNA — Live Census Data
          </p>

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[1, 2, 3, 4].map((i) => <SkeletonTile key={i} />)}
            </div>
          )}

          {/* Error */}
          {isError && (
            <p className="text-center text-sm text-muted-foreground italic">
              Census data temporarily unavailable. Please check back shortly.
            </p>
          )}

          {census && (
            <div className="space-y-10">

              {/* ── Row 1: Core 4 stats ─────────────────────────────────── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

                {/* Owner-Occupied */}
                <div className="flex flex-col items-center gap-1">
                  <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    {pct(census.ownerOccupancyPct)}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Owner-Occupied</div>
                  <div className="text-xs text-muted-foreground">Housing Stability</div>
                </div>

                {/* Median HH Income */}
                <div className="flex flex-col items-center gap-1">
                  <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    {formatCurrency(census.medianHouseholdIncome)}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Median HH Income</div>
                  <div className="text-xs text-muted-foreground">Economic Context</div>
                </div>

                {/* Median Year Built */}
                <div className="flex flex-col items-center gap-1">
                  <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    {census.medianYearBuilt ?? "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Median Year Built</div>
                  <div className="text-xs text-muted-foreground">Development Era</div>
                </div>

                {/* Family Households */}
                <div className="flex flex-col items-center gap-1">
                  <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    {pct(census.householdType?.familyHouseholdPct)}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Family Households</div>
                  <div className="text-xs text-muted-foreground">Community Profile</div>
                </div>
              </div>

              {/* ── Row 2: Age distribution + Housing era + Commute ────── */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Age Distribution */}
                {census.ageBuckets && (
                  <div className="bg-background rounded-xl p-5 border border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Baby className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">Age Distribution</span>
                    </div>
                    <div className="space-y-3">
                      {([
                        { label: "Under 18", value: census.ageBuckets.under18Pct, color: "bg-blue-400" },
                        { label: "Ages 18–64", value: census.ageBuckets.age18to64Pct, color: "bg-primary" },
                        { label: "Ages 65+", value: census.ageBuckets.age65plusPct, color: "bg-amber-400" },
                      ] as const).map(({ label, value, color }) => (
                        <div key={label}>
                          <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                            <span>{label}</span>
                            <span className="font-medium text-foreground">{pct(value)}</span>
                          </div>
                          <Bar value={value} color={color} />
                        </div>
                      ))}
                      {census.ageBuckets.totalPopulation !== null && (
                        <p className="text-xs text-muted-foreground pt-1">
                          Total population: {census.ageBuckets.totalPopulation.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Housing Era */}
                {census.yearBuiltBuckets && (
                  <div className="bg-background rounded-xl p-5 border border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">Housing Era</span>
                    </div>
                    <div className="space-y-3">
                      {([
                        { label: "Built 2000+", value: census.yearBuiltBuckets.pctBuiltPost2000, color: "bg-emerald-400" },
                        { label: "Built 1980–1999", value: census.yearBuiltBuckets.pctBuilt1980to1999, color: "bg-primary" },
                        { label: "Built pre-1980", value: census.yearBuiltBuckets.pctBuiltPre1980, color: "bg-amber-400" },
                      ] as const).map(({ label, value, color }) => (
                        <div key={label}>
                          <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                            <span>{label}</span>
                            <span className="font-medium text-foreground">{pct(value)}</span>
                          </div>
                          <Bar value={value} color={color} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Commute Mode */}
                {census.commuteMode && (
                  <div className="bg-background rounded-xl p-5 border border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Car className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">How Residents Commute</span>
                    </div>
                    <div className="space-y-3">
                      {([
                        { label: "Drive alone", value: census.commuteMode.droveAlonePct, color: "bg-primary" },
                        { label: "Work from home", value: census.commuteMode.workFromHomePct, color: "bg-emerald-400" },
                        { label: "Carpool", value: census.commuteMode.carpoolPct, color: "bg-blue-400" },
                        { label: "Public transit", value: census.commuteMode.transitPct, color: "bg-violet-400" },
                        { label: "Walk", value: census.commuteMode.walkedPct, color: "bg-amber-400" },
                      ] as const).map(({ label, value, color }) => (
                        <div key={label}>
                          <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                            <span>{label}</span>
                            <span className="font-medium text-foreground">{pct(value)}</span>
                          </div>
                          <Bar value={value} color={color} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Source attribution ───────────────────────────────────── */}
              <div className="flex items-start justify-center gap-1.5 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                <span>
                  Source: US Census Bureau {census.asOfDate} (Tables B25003, B19013, B25035, B01001,
                  B25034, B08301, B11001). Data refreshes annually each January.
                </span>
              </div>

            </div>
          )}
        </div>
      </div>
    </section>
  );
}
