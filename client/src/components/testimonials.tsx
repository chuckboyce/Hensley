import { Star } from "lucide-react";
import { testimonials } from "@/data/mock-data";

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Our Clients Say</h2>
          <p className="text-xl text-muted-foreground">Real experiences from satisfied homeowners and investors</p>
        </div>
        
        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <div className="bg-card rounded-xl p-8 shadow-lg border border-border" data-testid={`testimonial-${testimonial.id}`}>
      <div className="flex items-center mb-4">
        <div className="flex text-yellow-400">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-current" />
          ))}
        </div>
      </div>
      <p className="text-muted-foreground mb-6 leading-relaxed" data-testid={`testimonial-content-${testimonial.id}`}>
        "{testimonial.content}"
      </p>
      <div className="flex items-center">
        <img 
          src={testimonial.image} 
          alt={`${testimonial.clientName} testimonial`} 
          className="h-12 w-12 rounded-full object-cover" 
        />
        <div className="ml-4">
          <p className="font-semibold text-card-foreground" data-testid={`testimonial-name-${testimonial.id}`}>
            {testimonial.clientName}
          </p>
          <p className="text-sm text-muted-foreground" data-testid={`testimonial-role-${testimonial.id}`}>
            {testimonial.clientRole}
          </p>
        </div>
      </div>
    </div>
  );
}
