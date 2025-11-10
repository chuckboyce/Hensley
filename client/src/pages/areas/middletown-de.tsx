import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin, Home, TrendingUp, Users, GraduationCap, ShoppingCart } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function MiddletownDE() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <MapPin className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Middletown, Delaware Real Estate
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover one of Delaware's fastest-growing communities. Middletown offers small-town charm with 
                modern amenities, top-rated schools, and convenient access to major cities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/properties">
                  <Button size="lg">
                    <Home className="mr-2 h-5 w-5" />
                    View Middletown Homes
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Schedule Tour
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Facts */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Live in Middletown?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A thriving community with something for everyone
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Fastest Growing</h3>
                <p className="text-muted-foreground">
                  One of Delaware's fastest-growing towns with new developments and expanding amenities
                </p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Top Schools</h3>
                <p className="text-muted-foreground">
                  Highly-rated Appoquinimink School District with excellent educational opportunities
                </p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Prime Location</h3>
                <p className="text-muted-foreground">
                  Easy access to I-95, Delaware beaches, and major employment centers in DE, MD, and PA
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Features */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
                Community Highlights
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Shopping & Dining</h3>
                    <p className="text-muted-foreground">
                      Main Street features local shops, restaurants, and cafes. Nearby retail centers include 
                      Christiana Mall, Christiana Fashion Center, and The Centre at Middletown.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Parks & Recreation</h3>
                    <p className="text-muted-foreground">
                      Multiple parks, playgrounds, and sports facilities. Silver Lake Park offers walking trails, 
                      fishing, and community events throughout the year.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Housing Options</h3>
                    <p className="text-muted-foreground">
                      Diverse housing from historic homes in Old Town to new construction in established communities 
                      like Middletown Crossing, Whitehall, and Westridge.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Commuter-Friendly</h3>
                    <p className="text-muted-foreground">
                      Just 15 minutes to Delaware City, 30 minutes to Wilmington and Dover, and under an hour 
                      to Philadelphia and Baltimore. Easy access to major highways and employers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Market Stats */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
                Middletown Housing Market
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">$375K</div>
                  <h3 className="font-semibold mb-2">Median Home Price</h3>
                  <p className="text-muted-foreground text-sm">
                    Competitive pricing for Delaware market
                  </p>
                </div>

                <div>
                  <div className="text-4xl font-bold text-primary mb-2">30</div>
                  <h3 className="font-semibold mb-2">Days on Market</h3>
                  <p className="text-muted-foreground text-sm">
                    Homes sell quickly in this desirable area
                  </p>
                </div>

                <div>
                  <div className="text-4xl font-bold text-primary mb-2">22K+</div>
                  <h3 className="font-semibold mb-2">Population</h3>
                  <p className="text-muted-foreground text-sm">
                    Growing community with strong demand
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
              Ready to Call Middletown Home?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Let me help you find the perfect property in Middletown. With deep local knowledge and personalized 
              service, I'll guide you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/properties">
                <Button size="lg" variant="secondary">
                  View Available Homes
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Contact Me
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
