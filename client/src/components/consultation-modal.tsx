import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ConsultationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

interface ConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ConsultationModal({ open, onOpenChange }: ConsultationModalProps) {
  const [formData, setFormData] = useState<ConsultationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const consultationMutation = useMutation({
    mutationFn: async (data: ConsultationFormData) => {
      return await apiRequest('POST', '/api/contacts', data);
    },
    onSuccess: () => {
      toast({
        title: "Consultation request sent!",
        description: "We'll contact you within 24 hours to schedule your free consultation.",
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error sending request",
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
    consultationMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof ConsultationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Schedule Your Free Consultation</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill out the form below and we'll contact you within 24 hours to discuss your real estate needs.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="modal-firstName" className="block text-sm font-medium text-foreground mb-2">
                First Name *
              </Label>
              <Input 
                type="text" 
                id="modal-firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                data-testid="modal-input-first-name"
              />
            </div>
            <div>
              <Label htmlFor="modal-lastName" className="block text-sm font-medium text-foreground mb-2">
                Last Name *
              </Label>
              <Input 
                type="text" 
                id="modal-lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                data-testid="modal-input-last-name"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="modal-email" className="block text-sm font-medium text-foreground mb-2">
              Email *
            </Label>
            <Input 
              type="email" 
              id="modal-email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              data-testid="modal-input-email"
            />
          </div>
          
          <div>
            <Label htmlFor="modal-phone" className="block text-sm font-medium text-foreground mb-2">
              Phone
            </Label>
            <Input 
              type="tel" 
              id="modal-phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              data-testid="modal-input-phone"
            />
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-foreground mb-2">
              How can we help? *
            </Label>
            <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
              <SelectTrigger data-testid="modal-select-service">
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
            <Label htmlFor="modal-message" className="block text-sm font-medium text-foreground mb-2">
              Tell us about your needs *
            </Label>
            <Textarea 
              id="modal-message"
              rows={3}
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="What are your real estate goals? What's your timeline?"
              required
              data-testid="modal-textarea-message"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              data-testid="modal-button-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={consultationMutation.isPending}
              data-testid="modal-button-submit"
            >
              {consultationMutation.isPending ? 'Sending...' : 'Request Consultation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
