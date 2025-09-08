import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function FairHousing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <Link href="/">
            <Button variant="ghost" className="mb-4" data-testid="back-to-home">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Fair Housing Statement</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
              <p className="text-muted-foreground leading-relaxed text-lg">
                RE/MAX Eagle Realty and its technology provider, Inside Real Estate, fully support the principles of the Fair Housing Act (Title VIII of the Civil Rights Act of 1968), as amended, which generally prohibits discrimination in the sale, rental, and financing of dwellings, and in other housing-related transactions, based on race, color, national origin, religion, sex, familial status (including children under the age of 18 living with parents of legal custodians, pregnant women, and people securing custody of children under the age of 18), and handicap (disability).
              </p>
              
              <p className="text-muted-foreground leading-relaxed text-lg mt-6">
                As an adjunct to the foregoing commitment, both RE/MAX Eagle Realty and Inside Real Estate actively promote, and are committed to, creating and fostering an environment of diversity throughout their respective organizations and franchise systems, and each views such a concept as a critical component to the on-going success of their business operations.
              </p>
            </div>

            <div className="mt-8 bg-primary/5 border border-primary/20 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Equal Housing Opportunity</h2>
              <p className="text-muted-foreground">
                We are pledged to the letter and spirit of U.S. policy for the achievement of equal housing opportunity throughout the nation. We encourage and support an affirmative advertising and marketing program in which there are no barriers to obtaining housing because of race, color, religion, sex, handicap, familial status, or national origin.
              </p>
            </div>

            <div className="mt-8 text-center">
              <Link href="/">
                <Button className="px-8 py-3" data-testid="return-home">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}