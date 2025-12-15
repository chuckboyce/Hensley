import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, MapPin } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Breadcrumb } from "@/components/breadcrumb";

export default function AreasIndex() {
  const delawareAreas = [
    { name: "Bear, DE", slug: "bear-de" },
    { name: "Centreville, DE", slug: "centreville-de" },
    { name: "Delaware City, DE", slug: "delaware-city-de" },
    { name: "Hockessin, DE", slug: "hockessin-de" },
    { name: "Middletown, DE", slug: "middletown-de" },
    { name: "New Castle, DE", slug: "new-castle-de" },
    { name: "North Star, DE", slug: "north-star-de" },
    { name: "Odessa, DE", slug: "odessa-de" },
    { name: "Smyrna, DE", slug: "smyrna-de" },
    { name: "Townsend, DE", slug: "townsend-de" },
  ];

  const wilmingtonAreas = [
    { name: "Wilmington, DE (Parent)", slug: "wilmington-de" },
    { name: "North Wilmington", slug: "wilmington-de/north-wilmington" },
    { name: "Highlands", slug: "wilmington-de/highlands" },
    { name: "Forty Acres", slug: "wilmington-de/forty-acres" },
    { name: "Trolley Square", slug: "wilmington-de/trolley-square" },
  ];

  const marylandAreas = [
    { name: "Chesapeake City, MD", slug: "chesapeake-city-md" },
    { name: "Elkton, MD", slug: "elkton-md" },
    { name: "North East, MD", slug: "north-east-md" },
    { name: "Perryville, MD", slug: "perryville-md" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-12">
          {/* Breadcrumb */}
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "Service Areas" }
          ]} />

          {/* Header */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Service Areas</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Explore our comprehensive coverage across Delaware and Maryland communities
            </p>
          </div>

          {/* Delaware Areas */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
              <MapPin className="h-8 w-8 text-primary" />
              Delaware Communities
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {delawareAreas.map((area) => (
                <Link key={area.slug} href={`/areas/${area.slug}`}>
                  <Card className="p-6 hover:shadow-lg hover:bg-muted/50 transition-all cursor-pointer h-full" data-testid={`area-card-${area.slug}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{area.name}</h3>
                        <p className="text-sm text-muted-foreground">Learn about this community</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Wilmington Areas */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
              <MapPin className="h-8 w-8 text-primary" />
              Wilmington & Neighborhoods
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wilmingtonAreas.map((area) => (
                <Link key={area.slug} href={`/areas/${area.slug}`}>
                  <Card className="p-6 hover:shadow-lg hover:bg-muted/50 transition-all cursor-pointer h-full" data-testid={`area-card-${area.slug}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{area.name}</h3>
                        <p className="text-sm text-muted-foreground">Explore this area</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Maryland Areas */}
          <section>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
              <MapPin className="h-8 w-8 text-primary" />
              Maryland Communities
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marylandAreas.map((area) => (
                <Link key={area.slug} href={`/areas/${area.slug}`}>
                  <Card className="p-6 hover:shadow-lg hover:bg-muted/50 transition-all cursor-pointer h-full" data-testid={`area-card-${area.slug}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{area.name}</h3>
                        <p className="text-sm text-muted-foreground">Learn about this community</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="mt-16 bg-primary/10 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Contact Kevin Hensley directly to discuss real estate opportunities in your area of interest
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90" data-testid="button-contact-us">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
