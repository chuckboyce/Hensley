import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, Home, ArrowRight, Phone } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Buy() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <Home className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Find Your Dream Home in Delaware & Maryland
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Expert guidance through every step of the home buying process. From market analysis to closing, 
                I'll help you make informed decisions and secure the perfect property.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/properties">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Home className="mr-2 h-5 w-5" />
                    Browse Properties
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <Phone className="mr-2 h-5 w-5" />
                    Schedule Consultation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Home Buying Process */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                The Home Buying Process
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A clear roadmap to homeownership
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-4">
                  Pre-Approval & Budget
                </h3>
                <p className="text-muted-foreground">
                  Get pre-approved for a mortgage and establish your budget. I'll help you understand 
                  your buying power and connect you with trusted lenders.
                </p>
              </div>

              <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-4">
                  Property Search
                </h3>
                <p className="text-muted-foreground">
                  Tour homes that match your criteria. I'll provide detailed market analysis and 
                  insights about each property and neighborhood.
                </p>
              </div>

              <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-4">
                  Offer & Closing
                </h3>
                <p className="text-muted-foreground">
                  Submit a competitive offer, negotiate terms, and navigate inspections. I'll guide 
                  you through closing to ensure a smooth transaction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Included */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
                What's Included
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <Check className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Comprehensive Market Analysis</h3>
                    <p className="text-muted-foreground text-sm">
                      Detailed pricing insights and market trends to help you make informed decisions
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Property Tours & Previews</h3>
                    <p className="text-muted-foreground text-sm">
                      Access to exclusive listings and scheduled tours at your convenience
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Negotiation Expertise</h3>
                    <p className="text-muted-foreground text-sm">
                      Skilled negotiation to secure the best price and favorable terms
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Transaction Coordination</h3>
                    <p className="text-muted-foreground text-sm">
                      Full management of paperwork, inspections, and closing details
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Local Market Knowledge</h3>
                    <p className="text-muted-foreground text-sm">
                      Deep understanding of Delaware and Maryland neighborhoods and schools
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Professional Network</h3>
                    <p className="text-muted-foreground text-sm">
                      Connections to trusted inspectors, lenders, contractors, and attorneys
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Areas We Serve
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Explore homes in Delaware's most desirable communities
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/areas/middletown-de">
                  <Button variant="outline" size="lg" data-testid="link-middletown-de">
                    Middletown, DE
                  </Button>
                </Link>
                <Link href="/areas/townsend-de">
                  <Button variant="outline" size="lg">
                    Townsend, DE
                  </Button>
                </Link>
                <Link href="/areas/bear-de">
                  <Button variant="outline" size="lg">
                    Bear, DE
                  </Button>
                </Link>
                <Link href="/areas/new-castle-de">
                  <Button variant="outline" size="lg">
                    New Castle, DE
                  </Button>
                </Link>
                <Link href="/areas/hockessin-de">
                  <Button variant="outline" size="lg">
                    Hockessin, DE
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 lg:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Home Search?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Schedule a free consultation to discuss your home buying goals and get started today.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="text-lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
