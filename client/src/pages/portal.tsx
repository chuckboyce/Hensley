import { Button } from "@/components/ui/button";
import { Home, Key, FileText, CreditCard, Wrench, BarChart3, Phone, Mail, MessageSquare } from "lucide-react";
import { Link } from "wouter";

export default function Portal() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Branding */}
      <header className="bg-background border-b border-border py-4">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center p-1 border border-border">
                <img 
                  src="/hensleys-homes-logo.png" 
                  alt="Hensley's Homes Logo" 
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <img 
                src="/hensleys-homes-logotype.png" 
                alt="Hensley's Homes" 
                className="h-8 object-contain"
              />
            </Link>
            <Link href="/">
              <Button variant="ghost">
                ← Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Property Portal
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Secure portal access for property owners and tenants. Manage your properties, payments, and maintenance requests all in one place.
          </p>
        </div>
      </section>

      {/* Dual Audience Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Property Owners */}
            <div className="bg-background border border-border rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">For Property Owners</h2>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">Detailed financial statements & custom reports</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">Real-time property performance analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">FREE unlimited eSignatures for documents</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">QuickBooks Online sync & accounting tools</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">VIP priority support via phone, email & chat</span>
                </li>
              </ul>
              <Button
                asChild
                className="w-full"
                size="lg"
                data-testid="button-owner-access"
              >
                <a href="https://74458621.app.doorloop.com/auth/login" target="_blank" rel="noopener noreferrer">
                  Access Owner Portal
                </a>
              </Button>
            </div>

            {/* Tenants */}
            <div className="bg-background border border-border rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <Key className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">For Tenants</h2>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">Pay rent online via FREE ACH or credit/debit card</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">Submit maintenance requests with photos & real-time tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">Access lease agreements & sign documents electronically</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">Direct messaging with property management team</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">Receive important announcements via email & SMS</span>
                </li>
              </ul>
              <Button
                asChild
                className="w-full"
                size="lg"
                data-testid="button-tenant-access"
              >
                <a href="https://74458621.app.doorloop.com/auth/login" target="_blank" rel="noopener noreferrer">
                  Access Tenant Portal
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Premium Portal Features</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Powered by DoorLoop Premium - Professional property management tools trusted by thousands
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">FREE ACH Payments</h3>
              <p className="text-muted-foreground">No transaction fees for ACH rent payments. Credit/debit also available.</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Maintenance Tracking</h3>
              <p className="text-muted-foreground">Real-time request tracking with vendor management & photo uploads</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Unlimited eSignatures</h3>
              <p className="text-muted-foreground">Sign leases & documents electronically at no extra cost</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Custom Dashboards</h3>
              <p className="text-muted-foreground">Personalized analytics with KPIs tailored to your portfolio</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">VIP Support</h3>
              <p className="text-muted-foreground">Priority assistance via phone, email, chat & Zoom</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Bank-Level Security</h3>
              <p className="text-muted-foreground">256-bit encryption & unlimited secure data storage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
          <p className="text-muted-foreground mb-6">
            Kevin Hensley and his team are here to assist you with any questions about accessing or using the portal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" size="lg">
              <a href="tel:(302) 218-0130">
                <Phone className="mr-2 h-5 w-5" />
                Call (302) 218-0130
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="mailto:kevin@hensleys-homes.com">
                <Mail className="mr-2 h-5 w-5" />
                Email Support
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-8">
            Hensley's Homes | Licensed Real Estate Professional | Serving Delaware & Maryland
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            🔒 Powered by DoorLoop • Secure Access • 24/7 Support
          </p>
        </div>
      </section>
    </div>
  );
}
