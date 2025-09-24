import { Button } from "@/components/ui/button";
import { Home, Building } from "lucide-react";
import { Check } from "lucide-react";

export default function Services() {
  return (
    <section id="services" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive real estate solutions tailored to your needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Real Estate Sales */}
          <div className="bg-card rounded-xl p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-card-foreground ml-4">Real Estate Sales</h3>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Whether you're buying your first home or selling your current property, I provide expert guidance through every step of the process. From market analysis to closing, you'll receive personalized service backed by deep local knowledge.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm">Market Analysis & Pricing</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm">Professional Photography & Marketing</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm">Negotiation & Contract Management</span>
              </li>
            </ul>
          </div>
          
          {/* Property Management */}
          <div className="bg-card rounded-xl p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-card-foreground ml-4">Property Management</h3>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Maximize your rental income while minimizing stress. Our comprehensive property management services handle everything from tenant screening to maintenance coordination, giving you peace of mind and steady returns.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm">Tenant Screening & Placement</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm">Rent Collection & Financial Reporting</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm">Maintenance & Emergency Response</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
