import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { serviceAreas } from "@/data/mock-data";
import middletownImage from "@assets/Middletown_DE_1757012981537.jpg";
import ConsultationModal from "@/components/consultation-modal";

export default function ServiceArea() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Service Areas</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Proudly serving our local communities with expert real estate services
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src={middletownImage}
              alt="Historic downtown Middletown, DE with monument and local buildings" 
              loading="lazy"
              decoding="async"
              width={600}
              height={400}
              className="rounded-xl shadow-lg w-full" 
            />
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">Local Market Expertise</h3>
            <p className="text-muted-foreground leading-relaxed">
              With deep roots in our community, I understand the unique characteristics of each neighborhood, from school districts to local amenities, helping you make informed decisions about your next home or investment.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {serviceAreas.map((area, index) => (
                <div key={index} className="bg-muted rounded-lg p-4 text-center" data-testid={`service-area-${index}`}>
                  <h4 className="font-semibold text-foreground mb-1">{area.name}</h4>
                  <p className="text-sm text-muted-foreground">{area.description}</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-2"
                data-testid="button-schedule-consultation"
              >
                <Plus className="h-5 w-5" />
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ConsultationModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  );
}
