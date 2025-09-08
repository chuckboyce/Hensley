import { Button } from "@/components/ui/button";
import { Link } from "wouter";

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
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-foreground">Hensley's Homes</span>
                  <span className="text-sm text-muted-foreground">Real Estate & Property Management</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Your trusted local partner for real estate sales and property management services. Serving the community with integrity and expertise.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="social-twitter">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="social-facebook">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="social-instagram">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.99C24.007 5.367 18.641.001 12.017.001z"/>
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
