import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, Building, ArrowRight, Phone } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PropertyManagement() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <Building className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Professional Property Management Services
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Maximize your rental income while minimizing stress. Comprehensive property management 
                services for residential properties in Delaware and Maryland.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Phone className="mr-2 h-5 w-5" />
                    Schedule Consultation
                  </Button>
                </Link>
                <Link href="/portal">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Owner Portal Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Core Services */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Complete Property Management Solutions
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to protect your investment and maximize returns
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                <h3 className="text-xl font-semibold text-card-foreground mb-4">
                  Tenant Screening & Placement
                </h3>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Comprehensive background checks</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Credit and employment verification</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Reference checks and rental history</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Professional lease agreements</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                <h3 className="text-xl font-semibold text-card-foreground mb-4">
                  Rent Collection & Accounting
                </h3>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Online rent payment processing</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Monthly financial statements</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Late payment enforcement</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Annual tax documentation (1099s)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                <h3 className="text-xl font-semibold text-card-foreground mb-4">
                  Maintenance & Repairs
                </h3>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>24/7 emergency maintenance hotline</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Vetted contractor network</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Routine property inspections</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Preventive maintenance programs</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                <h3 className="text-xl font-semibold text-card-foreground mb-4">
                  Marketing & Leasing
                </h3>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Professional photography and listings</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Multi-platform advertising</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Property showings and tours</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Market rate analysis</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                <h3 className="text-xl font-semibold text-card-foreground mb-4">
                  Legal Compliance
                </h3>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Fair Housing compliance</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Lease agreement enforcement</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Eviction processing when necessary</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Safety and code compliance</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                <h3 className="text-xl font-semibold text-card-foreground mb-4">
                  Owner Communication
                </h3>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Dedicated property manager</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Online owner portal 24/7 access</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Regular property updates</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Detailed expense reporting</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
                Why Choose Our Property Management
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-start">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Maximize Rental Income</h3>
                    <p className="text-muted-foreground">
                      Strategic pricing and marketing to minimize vacancies and maximize your monthly cash flow
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Protect Your Investment</h3>
                    <p className="text-muted-foreground">
                      Regular inspections and preventive maintenance keep your property in excellent condition
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Save Time & Stress</h3>
                    <p className="text-muted-foreground">
                      We handle everything - from midnight emergencies to lease renewals - so you don't have to
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Quality Tenants</h3>
                    <p className="text-muted-foreground">
                      Rigorous screening process ensures reliable, qualified tenants who pay on time and respect your property
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 lg:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Simplify Your Property Management?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Schedule a free consultation to learn how we can help you maximize your rental income.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="text-lg">
                Get Started Today
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
