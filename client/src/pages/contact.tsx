import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Phone, Mail, MapPin, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import remaxLogo from "@assets/remax_2025_logo_1760103527751.png";
import hhLogo from "@assets/HH_logotype_1757349200633.png";
import { prepareContactSubmission, type FormSubmissionData } from "@/lib/form-submission";

export default function Contact() {
  const [formData, setFormData] = useState<FormSubmissionData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    emailOptIn: false,
    smsOptIn: false
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const contactMutation = useMutation({
    mutationFn: async (data: FormSubmissionData) => {
      return await apiRequest('POST', '/api/contacts', data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        service: '',
        message: '',
        emailOptIn: false,
        smsOptIn: false
      });
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.service || !formData.message) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const submissionData = prepareContactSubmission(formData);
    contactMutation.mutate(submissionData);
  };

  const handleInputChange = (field: keyof FormSubmissionData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <Link href="/">
            <Button variant="ghost" className="mb-4" data-testid="back-to-home">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Contact Us</h1>
          <p className="text-lg text-muted-foreground mt-2">Ready to start your real estate journey? Let's talk about your goals.</p>
        </div>
      </header>
      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
            <h2 className="text-2xl font-semibold text-card-foreground mb-6">Send a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                    First Name *
                  </Label>
                  <Input 
                    type="text" 
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                    Last Name *
                  </Label>
                  <Input 
                    type="text" 
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                    data-testid="input-last-name"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email *
                </Label>
                <Input 
                  type="email" 
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  data-testid="input-email"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  Phone
                </Label>
                <Input 
                  type="tel" 
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  data-testid="input-phone"
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  How can we help? *
                </Label>
                <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
                  <SelectTrigger data-testid="select-service">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buying">Buying a Home</SelectItem>
                    <SelectItem value="selling">Selling a Home</SelectItem>
                    <SelectItem value="property-management">Property Management</SelectItem>
                    <SelectItem value="consultation">General Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message *
                </Label>
                <Textarea 
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tell us about your needs and timeline..."
                  required
                  data-testid="textarea-message"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="smsOptIn"
                    checked={formData.smsOptIn}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, smsOptIn: checked === true }))}
                    data-testid="checkbox-sms-opt-in"
                  />
                  <Label htmlFor="smsOptIn" className="text-sm font-normal cursor-pointer leading-tight">
                    I agree to receive SMS from Hensleys Homes. Msg & data rates may apply. Message frequency varies. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase. By signing up, you agree to our <a href="/terms-of-use" className="text-primary underline hover:text-primary/80" target="_blank">Terms</a> and <a href="/privacy-policy" className="text-primary underline hover:text-primary/80" target="_blank">Privacy Policy</a>.
                  </Label>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="emailOptIn"
                    checked={formData.emailOptIn}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, emailOptIn: checked === true }))}
                    data-testid="checkbox-email-opt-in"
                  />
                  <Label htmlFor="emailOptIn" className="text-sm font-normal cursor-pointer leading-tight">
                    I agree to receive email from Hensleys Homes. You can unsubscribe anytime. See our <a href="/terms-of-use" className="text-primary underline hover:text-primary/80" target="_blank">Terms</a> and <a href="/privacy-policy" className="text-primary underline hover:text-primary/80" target="_blank">Privacy Policy</a>.
                  </Label>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
                disabled={contactMutation.isPending}
                data-testid="button-send-message"
              >
                {contactMutation.isPending ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
          
          {/* Office Information */}
          <div className="space-y-8">
            {/* RE/MAX Eagle Realty Information */}
            <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
              <div className="text-center mb-6">
                <img 
                  src={remaxLogo} 
                  alt="RE/MAX Logo" 
                  className="h-16 mx-auto mb-4"
                  data-testid="img-remax-logo"
                />
                <h2 className="text-2xl font-bold text-primary mb-2">RE/MAX Eagle Realty</h2>
                <div className="h-16 w-64 bg-white rounded-lg flex items-center justify-center mx-auto px-4 py-2 pt-[0px] pb-[0px] mt-[0px] mb-[0px]">
                  <img 
                    src={hhLogo} 
                    alt="Hensley's Homes Logo" 
                    className="w-full h-full object-contain"
                    data-testid="img-hensleys-logo"
                  />
                </div>
              </div>
              
              <div className="text-center space-y-2 mb-6">
                <h3 className="text-xl font-semibold text-foreground">Kevin Hensley</h3>
                <p className="text-muted-foreground">Associate</p>
                <p className="text-sm text-muted-foreground">
                  License# 324709, RB-0003526
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-4 text-center">
                    <p className="font-medium text-card-foreground">Cell: (302) 218-0130</p>
                    <p className="font-medium text-card-foreground">Direct: (302) 273-0057</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-4 text-center">
                    <p className="font-medium text-card-foreground">5609 DuPont Pkwy Ste 11</p>
                    <p className="font-medium text-card-foreground">Smyrna, DE 19977</p>
                    <p className="font-medium text-card-foreground">(302) 659-1320</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
              <h3 className="text-xl font-semibold text-card-foreground mb-4">Business Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="text-card-foreground font-medium">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="text-card-foreground font-medium">9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="text-card-foreground font-medium">By Appointment</span>
                </div>
                <div className="border-t border-border pt-3 mt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Emergency</span>
                    <span className="text-card-foreground font-medium">24/7 Available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center">
              <div className="flex items-center justify-center mt-4 space-x-4">
                <div className="h-8 w-8 bg-primary/10 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">NAR</span>
                </div>
                <p className="text-xs text-muted-foreground">National Association of Realtors</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}