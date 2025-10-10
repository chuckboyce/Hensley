import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ehoLogo from "@assets/eho_logo_1760104830421.png";
import realtorLogo from "@assets/realtor_logo_1760104830430.png";

export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Make Your Move?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Whether you're buying, selling, or looking for property management services, let's discuss how I can help you achieve your real estate goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white hover:bg-gray-100 text-primary px-8 py-4 rounded-lg font-semibold text-lg"
              data-testid="button-call-now"
            >
              <a href="tel:(302) 218-0130">Call (302) 218-0130</a>
            </Button>
            <Link href="/contact">
              <Button 
                variant="outline"
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-2 border-primary-foreground/20 px-8 py-4 rounded-lg font-semibold text-lg"
                data-testid="button-schedule-consultation-footer"
              >
                Schedule Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-secondary border-t border-border">
        <div className="container mx-auto px-4 lg:px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center p-1 border border-border">
                  <img 
                    src="/hensleys-homes-logo.png" 
                    alt="Hensley's Homes Logo" 
                    className="w-full h-full object-contain rounded"
                  />
                </div>
                <div className="flex items-center">
                  <img 
                    src="/hensleys-homes-logotype.png" 
                    alt="Hensley's Homes" 
                    className="h-8 object-contain"
                  />
                </div>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Your trusted local partner for real estate sales and property management services. Serving the community with integrity and expertise.
              </p>
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src={ehoLogo} 
                  alt="Equal Housing Opportunity" 
                  className="h-12 w-auto"
                  data-testid="img-eho-logo"
                />
                <img 
                  src={realtorLogo} 
                  alt="Realtor" 
                  className="h-12 w-auto"
                  data-testid="img-realtor-logo"
                />
              </div>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/kevin.hensley.5" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" data-testid="social-facebook-personal">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/HensleysHomes" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" data-testid="social-facebook-business">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <nav className="space-y-2">
                <button 
                  onClick={() => scrollToSection('home')} 
                  className="block text-muted-foreground hover:text-primary transition-colors text-left"
                  data-testid="footer-link-home"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="block text-muted-foreground hover:text-primary transition-colors text-left"
                  data-testid="footer-link-about"
                >
                  About Kevin
                </button>
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="block text-muted-foreground hover:text-primary transition-colors text-left"
                  data-testid="footer-link-services"
                >
                  Our Services
                </button>
                <button 
                  onClick={() => scrollToSection('properties')} 
                  className="block text-muted-foreground hover:text-primary transition-colors text-left"
                  data-testid="footer-link-properties"
                >
                  Properties
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials')} 
                  className="block text-muted-foreground hover:text-primary transition-colors text-left"
                  data-testid="footer-link-testimonials"
                >
                  Testimonials
                </button>
              </nav>
            </div>
            
            {/* Services */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Services</h4>
              <nav className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors" data-testid="footer-service-sales">Home Sales</a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors" data-testid="footer-service-management">Property Management</a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors" data-testid="footer-service-analysis">Market Analysis</a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors" data-testid="footer-service-consulting">Investment Consulting</a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors" data-testid="footer-service-rentals">Rental Listings</a>
              </nav>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Hensley's Homes. All rights reserved. | Licensed Real Estate Professional | 
              <a href="/fair-housing" className="hover:text-primary transition-colors ml-1" data-testid="footer-fair-housing">Fair Housing</a> | 
              <a href="/privacy-policy" className="hover:text-primary transition-colors ml-1" data-testid="footer-privacy">Privacy Policy</a> | 
              <a href="/terms-of-use" className="hover:text-primary transition-colors ml-1" data-testid="footer-terms">Terms of Service</a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
