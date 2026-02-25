import { CheckCircle } from "lucide-react";
import { agentInfo } from "@/data/mock-data";
import IMG_0525 from "@assets/IMG_0525.jpeg";
import meganDonahue from "@assets/mjd_teamhensley_1772038463400.png";

function TeamMemberPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative mx-auto w-64 h-80 flex-shrink-0">
      <div className="absolute inset-0 rounded-3xl bg-primary/10 rotate-3" />
      <div className="relative w-full h-full rounded-3xl overflow-hidden ring-4 ring-primary/30 shadow-2xl">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-top"
        />
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Meet the Team</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Two experienced professionals dedicated to helping you find the perfect home in Delaware and Maryland.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Kevin Hensley */}
          <div className="flex flex-col items-center text-center gap-6">
            <TeamMemberPhoto
              src={IMG_0525}
              alt="Professional headshot of Kevin Hensley, RE/MAX Eagle Realty"
            />
            <div className="space-y-4 w-full max-w-md">
              <div>
                <h3 className="text-2xl font-bold text-foreground">Kevin Hensley</h3>
                <p className="text-primary font-medium">Broker / Owner &mdash; RE/MAX Eagle Realty</p>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {agentInfo.name} has been serving the Delaware community for over {agentInfo.yearsExperience} years, building lasting relationships based on trust, integrity, and exceptional service. As Past President of both the state and local Boards of Realtors and the 2011 Realtor of the Year Award winner for Delaware, he brings unparalleled expertise to every transaction. Outside of real estate, Kevin serves as a State Representative in the Delaware General Assembly.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-lg p-4 border border-border">
                  <p className="text-2xl font-bold text-primary">{agentInfo.yearsExperience}</p>
                  <p className="text-xs text-muted-foreground">Years in Real Estate</p>
                </div>
                <div className="bg-card rounded-lg p-4 border border-border">
                  <p className="text-2xl font-bold text-primary">{agentInfo.transactionCount}</p>
                  <p className="text-xs text-muted-foreground">Successful Deals</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <div className="flex items-center bg-secondary rounded-full px-3 py-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5" />
                  <span className="text-xs font-medium">Licensed Broker</span>
                </div>
                <div className="flex items-center bg-secondary rounded-full px-3 py-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5" />
                  <span className="text-xs font-medium">Award Winner</span>
                </div>
                <div className="flex items-center bg-secondary rounded-full px-3 py-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5" />
                  <span className="text-xs font-medium">State Representative</span>
                </div>
              </div>
            </div>
          </div>

          {/* Megan Donahue */}
          <div className="flex flex-col items-center text-center gap-6">
            <TeamMemberPhoto
              src={meganDonahue}
              alt="Professional headshot of Megan Donahue, RE/MAX Eagle Realty"
            />
            <div className="space-y-4 w-full max-w-md">
              <div>
                <h3 className="text-2xl font-bold text-foreground">Megan Donahue</h3>
                <p className="text-primary font-medium">Licensed Realtor &mdash; RE/MAX Eagle Realty</p>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm">
                With over 20 years of experience in new home building and real estate, Megan brings deep expertise in Kent &amp; Sussex County, Delaware. Her career includes successful partnerships with top builders including Ryan Homes, DRB Homes, DR Horton, and Schell Brothers — managing and selling communities across New Castle, Kent, and Sussex County while consistently exceeding sales targets. Megan specializes in buyer and seller representation, new construction, market analysis, and contract negotiation, delivering exceptional results for every client she serves.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-lg p-4 border border-border">
                  <p className="text-2xl font-bold text-primary">20+</p>
                  <p className="text-xs text-muted-foreground">Years in Real Estate</p>
                </div>
                <div className="bg-card rounded-lg p-4 border border-border">
                  <p className="text-2xl font-bold text-primary">DE</p>
                  <p className="text-xs text-muted-foreground">Licensed in Delaware</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <div className="flex items-center bg-secondary rounded-full px-3 py-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5" />
                  <span className="text-xs font-medium">New Construction</span>
                </div>
                <div className="flex items-center bg-secondary rounded-full px-3 py-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5" />
                  <span className="text-xs font-medium">Licensed Realtor</span>
                </div>
                <div className="flex items-center bg-secondary rounded-full px-3 py-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5" />
                  <span className="text-xs font-medium">Kent &amp; Sussex County</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
