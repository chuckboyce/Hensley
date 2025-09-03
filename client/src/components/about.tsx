import { CheckCircle } from "lucide-react";
import { agentInfo } from "@/data/mock-data";
import kevinHensleyHeadshot from "@/assets/kevin-hensley-headshot.png";

export default function About() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src={kevinHensleyHeadshot} 
              alt="Professional headshot of Kevin Hensley, local real estate agent" 
              className="rounded-2xl shadow-2xl w-full max-w-md mx-auto" 
            />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Meet Kevin Hensley</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {agentInfo.name} has been serving the Delaware community for over {agentInfo.yearsExperience} years, building lasting relationships based on trust, integrity, and exceptional service. As Past President of both the state and local Boards of Realtors and the 2011 Realtor of the Year Award winner for Delaware, he brings unparalleled expertise to every transaction. Outside of real estate, Kevin serves as a State Representative in the Delaware General Assembly.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg p-6 border border-border" data-testid="stat-experience">
                <h4 className="font-semibold text-card-foreground mb-2">Experience</h4>
                <p className="text-3xl font-bold text-primary">{agentInfo.yearsExperience}</p>
                <p className="text-sm text-muted-foreground">Years in Real Estate</p>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border" data-testid="stat-transactions">
                <h4 className="font-semibold text-card-foreground mb-2">Transactions</h4>
                <p className="text-3xl font-bold text-primary">{agentInfo.transactionCount}</p>
                <p className="text-sm text-muted-foreground">Successful Deals</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-secondary rounded-full px-4 py-2">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm font-medium">Licensed Broker</span>
              </div>
              <div className="flex items-center bg-secondary rounded-full px-4 py-2">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm font-medium">Award Winner</span>
              </div>
              <div className="flex items-center bg-secondary rounded-full px-4 py-2">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm font-medium">State Representative</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
