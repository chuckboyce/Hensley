import { Button } from "@/components/ui/button";
import { Home, Key, FileText, CreditCard, Wrench, BarChart3 } from "lucide-react";

export default function Portal() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Property Management Portal
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Secure access for property owners and tenants. Manage your properties, payments, and maintenance requests all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white hover:bg-gray-100 text-primary px-8 py-6 text-lg font-semibold"
              data-testid="button-owner-portal"
            >
              <a href="https://74458621.app.doorloop.com/auth/login" target="_blank" rel="noopener noreferrer">
                <Home className="mr-2 h-5 w-5" />
                Owner Portal Login
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold"
              data-testid="button-tenant-portal"
            >
              <a href="https://74458621.app.doorloop.com/auth/login" target="_blank" rel="noopener noreferrer">
                <Key className="mr-2 h-5 w-5" />
                Tenant Portal Login
              </a>
            </Button>
          </div>
          <p className="text-sm text-primary-foreground/70 mt-6">
            🔒 Powered by DoorLoop • Secure Access • 24/7 Support
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
                  <span className="text-muted-foreground">View financial statements and reports</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">Monitor property performance and occupancy</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">Track maintenance and repairs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">Access documents and lease agreements</span>
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
                  <span className="text-muted-foreground">Pay rent online securely</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">Submit and track maintenance requests</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">View lease details and documents</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-muted-foreground">Communicate with property management</span>
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
          <h2 className="text-3xl font-bold text-center mb-12">Portal Features</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Online Payments</h3>
              <p className="text-muted-foreground">Secure rent and fee payments with multiple payment options</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Maintenance Requests</h3>
              <p className="text-muted-foreground">Submit and track repair requests with photo uploads</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Document Access</h3>
              <p className="text-muted-foreground">View and download leases, notices, and important documents</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Financial Reports</h3>
              <p className="text-muted-foreground">Detailed statements and analytics for property owners</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Property Management</h3>
              <p className="text-muted-foreground">Complete oversight of all properties and units</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure Access</h3>
              <p className="text-muted-foreground">Bank-level encryption and data protection</p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
          <p className="text-muted-foreground mb-6">
            Our team is here to assist you with any questions about accessing or using the portal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" size="lg">
              <a href="tel:(302) 218-0130">
                Call (302) 218-0130
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="mailto:kevin@hensleys-homes.com">
                Email Support
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
