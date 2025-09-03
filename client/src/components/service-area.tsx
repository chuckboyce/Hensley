import { Button } from "@/components/ui/button";
import { serviceAreas } from "@/data/mock-data";

export default function ServiceArea() {
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
              src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
              alt="Beautiful downtown area with local community buildings" 
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
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                data-testid="button-market-report"
              >
                Get Market Report
              </Button>
              <Button 
                variant="secondary"
                className="flex-1 border border-border"
                data-testid="button-schedule-consultation"
              >
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
