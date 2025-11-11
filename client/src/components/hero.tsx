import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import { Link } from "wouter";
import ConsultationModal from "@/components/consultation-modal";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToProperties = () => {
    const element = document.getElementById('properties');
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
    <section id="home" className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60">
        <picture>
          {/* AVIF format - best compression */}
          <source 
            type="image/avif"
            srcSet="/hero-mobile.avif 640w, /hero-tablet.avif 1024w, /hero-desktop.avif 1920w, /hero-2x.avif 2560w"
            sizes="100vw"
          />
          {/* WebP format - good compression and wide support */}
          <source 
            type="image/webp"
            srcSet="/hero-mobile.webp 640w, /hero-tablet.webp 1024w, /hero-desktop.webp 1920w, /hero-2x.webp 2560w"
            sizes="100vw"
          />
          {/* JPEG fallback for older browsers */}
          <img 
            src="/hero-desktop.jpg" 
            srcSet="/hero-mobile.jpg 640w, /hero-tablet.jpg 1024w, /hero-desktop.jpg 1920w, /hero-2x.jpg 2560w"
            sizes="100vw"
            alt="Modern luxury home exterior" 
            width={1920}
            height={1280}
            loading="eager"
            // @ts-ignore - fetchpriority is valid HTML but not in React types yet
            fetchpriority="high"
            className="w-full h-full object-cover" 
          />
        </picture>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 lg:px-6 py-24 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0px 0px 20px rgba(0,0,0,0.8)'}}>
            Your Trusted Local
            <span className="text-blue-400"> Real Estate</span> Partner
          </h1>
          <p className="text-xl text-white mb-8 leading-relaxed" style={{textShadow: '2px 2px 6px rgba(0,0,0,0.9), 0px 0px 15px rgba(0,0,0,0.7)'}}>
            With years of experience serving our community, Kevin Hensley's Homes provides expert real estate sales and comprehensive property management services you can trust.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            {/* View Properties button hidden until IDX approval */}
            {/* <Button 
              onClick={scrollToProperties}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg"
              data-testid="button-view-properties"
            >
              View Properties
            </Button> */}
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg"
              data-testid="button-consultation"
            >
              Get Free Consultation
            </Button>
            <Link href="/portal" className="hidden sm:block">
              <Button 
                variant="outline"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white px-8 py-4 rounded-lg font-semibold text-lg"
                data-testid="button-portal-login"
              >
                <LogIn className="mr-2 h-5 w-5" />
                Portal Login
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Property Search Bar hidden until IDX approval */}
        {/* <div className="bg-white rounded-xl p-6 shadow-2xl max-w-4xl">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Label className="block text-sm font-medium text-muted-foreground mb-2">Location</Label>
              <Input 
                type="text" 
                placeholder="Enter city, neighborhood, or ZIP" 
                className="w-full"
                data-testid="input-location"
              />
            </div>
            <div className="flex-1">
              <Label className="block text-sm font-medium text-muted-foreground mb-2">Property Type</Label>
              <Select>
                <SelectTrigger data-testid="select-property-type">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="houses">Houses</SelectItem>
                  <SelectItem value="condos">Condos</SelectItem>
                  <SelectItem value="townhomes">Townhomes</SelectItem>
                  <SelectItem value="apartments">Apartments</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label className="block text-sm font-medium text-muted-foreground mb-2">Price Range</Label>
              <Select>
                <SelectTrigger data-testid="select-price-range">
                  <SelectValue placeholder="Any Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Price</SelectItem>
                  <SelectItem value="under-200k">Under $200k</SelectItem>
                  <SelectItem value="200k-400k">$200k - $400k</SelectItem>
                  <SelectItem value="400k-600k">$400k - $600k</SelectItem>
                  <SelectItem value="600k-plus">$600k+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-md font-semibold"
                data-testid="button-search"
              >
                Search
              </Button>
            </div>
          </div>
        </div> */}
      </div>

      <ConsultationModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  );
}
