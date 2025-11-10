import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, TrendingUp, ArrowRight, Phone } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Sell() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <TrendingUp className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Sell Your Home with Confidence
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Get top dollar for your property with expert marketing, professional photography, 
                and proven negotiation strategies. I'll handle every detail from pricing to closing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Phone className="mr-2 h-5 w-5" />
                    Get Free Home Valuation
                  </Button>
                </Link>
                <Link href="/properties">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View Recent Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Selling Process */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                The Home Selling Process
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A proven strategy to maximize your sale price
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-4">
                  Pricing & Preparation
                </h3>
                <p className="text-muted-foreground">
                  Comprehensive market analysis to price your home competitively. I'll recommend 
                  strategic improvements to maximize value.
                </p>
              </div>

              <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-4">
                  Marketing & Showings
                </h3>
                <p className="text-muted-foreground">
                  Professional photography, virtual tours, and targeted marketing across multiple 
                  platforms to attract qualified buyers.
                </p>
              </div>

              <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-4">
                  Offers & Closing
                </h3>
                <p className="text-muted-foreground">
                  Review and negotiate offers to secure the best terms. I'll coordinate inspections, 
                  appraisals, and closing to ensure a smooth sale.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Marketing Services */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
                Comprehensive Marketing Package
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <Check className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Professional Photography</h3>
                    <p className="text-muted-foreground text-sm">
                      High-quality photos and virtual tours that showcase your home's best features
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Multi-Platform Exposure</h3>
                    <p className="text-muted-foreground text-sm">
                      Listings on MLS, Zillow, Realtor.com, and targeted social media campaigns
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Market Analysis & Pricing Strategy</h3>
                    <p className="text-muted-foreground text-sm">
                      Data-driven pricing to attract buyers while maximizing your return
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Staging Consultation</h3>
                    <p className="text-muted-foreground text-sm">
                      Expert advice on presenting your home to appeal to the widest buyer pool
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Open Houses & Private Showings</h3>
                    <p className="text-muted-foreground text-sm">
                      Flexible showing schedule and well-promoted open houses to drive traffic
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Expert Negotiation</h3>
                    <p className="text-muted-foreground text-sm">
                      Skilled negotiation to secure the highest price and best terms for your sale
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Sell With Me */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
                Why Sell With Kevin Hensley's Homes
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-5xl font-bold text-primary mb-4">98%</div>
                  <h3 className="font-semibold mb-2">List to Sale Price</h3>
                  <p className="text-muted-foreground text-sm">
                    My homes sell for an average of 98% of asking price
                  </p>
                </div>

                <div>
                  <div className="text-5xl font-bold text-primary mb-4">45</div>
                  <h3 className="font-semibold mb-2">Days to Close</h3>
                  <p className="text-muted-foreground text-sm">
                    Average time from listing to closing day
                  </p>
                </div>

                <div>
                  <div className="text-5xl font-bold text-primary mb-4">15+</div>
                  <h3 className="font-semibold mb-2">Years Experience</h3>
                  <p className="text-muted-foreground text-sm">
                    Deep knowledge of Delaware and Maryland markets
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 lg:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Sell Your Home?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Get a free, no-obligation home valuation and discover what your property is worth in today's market.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="text-lg">
                Get Free Valuation
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
