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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center p-1 border border-border">
                  <img 
                    src="/hensleys-homes-logo.png" 
                    alt="Hensley's Homes Logo" 
                    className="w-full h-full object-contain rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-foreground">Hensley's Homes</span>
                  <span className="text-xs text-muted-foreground">Real Estate & Property Management</span>
                </div>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('home')} 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-home"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-about"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('services')} 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-services"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('properties')} 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-properties"
              >
                Properties
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')} 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-testimonials"
              >
                Testimonials
              </button>
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
            <button 
              onClick={() => scrollToSection('home')} 
              className="text-lg font-medium text-foreground text-left"
              data-testid="mobile-nav-home"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-lg font-medium text-muted-foreground hover:text-foreground text-left"
              data-testid="mobile-nav-about"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('services')} 
              className="text-lg font-medium text-muted-foreground hover:text-foreground text-left"
              data-testid="mobile-nav-services"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('properties')} 
              className="text-lg font-medium text-muted-foreground hover:text-foreground text-left"
              data-testid="mobile-nav-properties"
            >
              Properties
            </button>
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
          </nav>
        </div>
      )}
    </>
  );
}
