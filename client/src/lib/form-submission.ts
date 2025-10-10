import { type InsertContact } from "@shared/schema";
import { getBrowserMetadata, CONSENT_TEXT } from "./browser-metadata";

export interface FormSubmissionData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  service: string;
  message: string;
  emailOptIn?: boolean;
  smsOptIn?: boolean;
}

export function prepareContactSubmission(formData: FormSubmissionData): InsertContact {
  const browserMetadata = getBrowserMetadata();
  const timestamp = new Date();
  
  return {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone || undefined,
    service: formData.service,
    message: formData.message,
    method: "webform",
    emailOptIn: formData.emailOptIn,
    smsOptIn: formData.smsOptIn,
    userAgent: browserMetadata.userAgent,
    pageUrl: browserMetadata.pageUrl,
    referrer: browserMetadata.referrer,
    emailConsentText: formData.emailOptIn ? CONSENT_TEXT.email : undefined,
    smsConsentText: formData.smsOptIn ? CONSENT_TEXT.sms : undefined,
    timestamp
  };
}
