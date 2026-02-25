import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Phone } from "lucide-react";
import { Link } from "wouter";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center p-1 border border-border">
                  <img 
                    src="/hensleys-homes-logo.png" 
                    alt="Hensley's Homes Logo" 
                    width="40"
                    height="40"
                    className="w-full h-full object-contain rounded"
                  />
                </div>
                <div className="flex items-center">
                  <img 
                    src="/hensleys-homes-logotype.png" 
                    alt="Hensley's Homes" 
                    width="200"
                    height="32"
                    className="h-8 object-contain"
                  />
                </div>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/buy">
                <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      data-testid="nav-buy">
                  Buy
                </span>
              </Link>
              <Link href="/sell">
                <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      data-testid="nav-sell">
                  Sell
                </span>
              </Link>
              <Link href="/property-management">
                <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      data-testid="nav-property-management">
                  Property Management
                </span>
              </Link>
              <Link href="/properties">
                <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      data-testid="nav-properties">
                  Properties
                </span>
              </Link>
              <Link href="/contact">
                <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      data-testid="nav-contact">
                  Contact
                </span>
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <a 
                href="tel:(302) 218-0130" 
                className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground"
                data-testid="header-phone"
              >
                <Phone className="h-4 w-4" />
                <span>(302) 218-0130</span>
              </a>
              <Link href="/portal">
                <Button
                  variant="default"
                  size="sm"
                  className="hidden md:inline-flex"
                  data-testid="header-portal-login"
                >
                  Portal Login
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="mobile-menu-toggle"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur" data-testid="mobile-menu">
          <nav className="flex flex-col space-y-4 p-6">
            <Link href="/buy" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-lg font-medium text-muted-foreground hover:text-foreground text-left cursor-pointer"
                    data-testid="mobile-nav-buy">
                Buy
              </span>
            </Link>
            <Link href="/sell" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-lg font-medium text-muted-foreground hover:text-foreground text-left cursor-pointer"
                    data-testid="mobile-nav-sell">
                Sell
              </span>
            </Link>
            <Link href="/property-management" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-lg font-medium text-muted-foreground hover:text-foreground text-left cursor-pointer"
                    data-testid="mobile-nav-property-management">
                Property Management
              </span>
            </Link>
            <Link href="/properties" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-lg font-medium text-muted-foreground hover:text-foreground text-left cursor-pointer"
                    data-testid="mobile-nav-properties">
                Properties
              </span>
            </Link>
            <button 
              onClick={() => scrollToSection('testimonials')} 
              className="text-lg font-medium text-muted-foreground hover:text-foreground text-left"
              data-testid="mobile-nav-testimonials"
            >
              Testimonials
            </button>
            <Link href="/contact">
              <span className="text-lg font-medium text-muted-foreground hover:text-foreground text-left cursor-pointer"
                    data-testid="mobile-nav-contact">
                Contact
              </span>
            </Link>
            <Link href="/portal" onClick={() => setMobileMenuOpen(false)}>
              <Button 
                className="mt-4 w-full"
                data-testid="mobile-nav-portal"
              >
                Portal Login
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
