import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CheckCircle, Lock, Home, AlertCircle } from "lucide-react";

const passwordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

const ownerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  companyName: z.string().optional(),
  title: z.string().optional(),
});

type PasswordForm = z.infer<typeof passwordSchema>;
type OwnerForm = z.infer<typeof ownerSchema>;

type Step = "locked" | "form" | "success";

export default function OwnerOnboarding() {
  const [step, setStep] = useState<Step>("locked");
  const [authToken, setAuthToken] = useState("");
  const [authError, setAuthError] = useState("");
  const [createdOwner, setCreatedOwner] = useState<{ fullName: string; id: string } | null>(null);

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "" },
  });

  const ownerForm = useForm<OwnerForm>({
    resolver: zodResolver(ownerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      companyName: "",
      title: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: OwnerForm) => {
      const res = await fetch("/api/onboarding/owner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Submission failed" }));
        throw new Error(err.error || "Submission failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setCreatedOwner({ fullName: data.owner.fullName, id: data.owner.id });
      setStep("success");
    },
  });

  function handlePasswordSubmit(values: PasswordForm) {
    setAuthError("");
    fetch("/api/onboarding/owner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${values.password}`,
      },
      body: JSON.stringify({}),
    }).then((res) => {
      if (res.status === 400) {
        setAuthToken(values.password);
        setStep("form");
      } else if (res.status === 401) {
        setAuthError("Incorrect password. Please try again.");
      } else {
        setAuthToken(values.password);
        setStep("form");
      }
    }).catch(() => {
      setAuthError("Unable to connect. Please try again.");
    });
  }

  function handleOwnerSubmit(values: OwnerForm) {
    submitMutation.mutate(values);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">

      {/* STEP 1: Password Gate */}
      {step === "locked" && (
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
              <Home className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-2xl">Owner Onboarding</CardTitle>
            <CardDescription className="text-base mt-1">
              Hensley's Homes &mdash; Property Management
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 bg-muted rounded-lg px-3 py-2">
              <Lock className="h-4 w-4 flex-shrink-0" />
              <span>This page is for new property owners joining our management program. Please enter the access code provided by Kevin.</span>
            </div>

            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Code</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter access code"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {authError && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {authError}
                  </div>
                )}
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: Owner Form */}
      {step === "form" && (
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Welcome to Hensley's Homes</CardTitle>
                <CardDescription>Tell us a little about yourself to get started</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <Form {...ownerForm}>
              <form onSubmit={ownerForm.handleSubmit(handleOwnerSubmit)} className="space-y-4">

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={ownerForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={ownerForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={ownerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={ownerForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(302) 555-0100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground mb-3 uppercase font-semibold tracking-wide">Optional</p>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={ownerForm.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Smith Properties LLC" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={ownerForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Owner, Manager..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {submitMutation.isError && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {submitMutation.error instanceof Error
                      ? submitMutation.error.message
                      : "Something went wrong. Please try again."}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={submitMutation.isPending}>
                  {submitMutation.isPending ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: Success */}
      {step === "success" && (
        <Card className="w-full max-w-md shadow-lg text-center">
          <CardContent className="pt-10 pb-10">
            <div className="mx-auto mb-5 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-9 w-9 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
            <p className="text-muted-foreground mb-2">
              {createdOwner?.fullName && (
                <><span className="font-medium text-foreground">{createdOwner.fullName}</span> has been added to our system.</>
              )}
            </p>
            <p className="text-muted-foreground text-sm">
              Kevin will be in touch shortly to walk you through the next steps of the onboarding process.
            </p>
            <div className="mt-6">
              <Link href="/">
                <Button variant="outline" className="w-full">Return Home</Button>
              </Link>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <span className="font-medium">Hensley's Homes</span> &mdash; RE/MAX Eagle Realty<br />
              <a href="tel:3022180130" className="text-primary hover:underline">(302) 218-0130</a>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
