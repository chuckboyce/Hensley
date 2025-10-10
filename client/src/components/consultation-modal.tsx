import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { prepareContactSubmission, type FormSubmissionData } from "@/lib/form-submission";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ConsultationModal({ open, onOpenChange }: ConsultationModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      service: '',
      message: '',
      emailOptIn: false,
      smsOptIn: false
    },
  });

  const consultationMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      return await apiRequest('POST', '/api/contacts', data);
    },
    onSuccess: () => {
      toast({
        title: "Consultation request sent!",
        description: "We'll contact you within 24 hours to schedule your free consultation.",
      });
      form.reset();
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

  const onSubmit = (data: InsertContact) => {
    const formData: FormSubmissionData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || undefined,
      service: data.service,
      message: data.message,
      emailOptIn: data.emailOptIn || false,
      smsOptIn: data.smsOptIn || false
    };
    
    const submissionData = prepareContactSubmission(formData);
    consultationMutation.mutate(submissionData);
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
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="modal-input-first-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="modal-input-last-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" {...field} data-testid="modal-input-email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} value={field.value || ''} data-testid="modal-input-phone" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How can we help? *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="modal-select-service">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="buying">Buying a Home</SelectItem>
                    <SelectItem value="selling">Selling a Home</SelectItem>
                    <SelectItem value="property-management">Property Management</SelectItem>
                    <SelectItem value="consultation">General Consultation</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tell us about your needs *</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    rows={3}
                    placeholder="What are your real estate goals? What's your timeline?"
                    data-testid="modal-textarea-message"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-3 pt-2">
            <FormField
              control={form.control}
              name="emailOptIn"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="modal-checkbox-email-opt-in"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal">
                      I agree to receive email communications about my real estate inquiry
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="smsOptIn"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="modal-checkbox-sms-opt-in"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal">
                      I agree to receive SMS/text messages about my real estate inquiry
                    </FormLabel>
                  </div>
                </FormItem>
              )}
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}
