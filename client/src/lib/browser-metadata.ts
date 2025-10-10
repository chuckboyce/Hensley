export interface BrowserMetadata {
  userAgent: string;
  pageUrl: string;
  referrer: string;
}

export function getBrowserMetadata(): BrowserMetadata {
  return {
    userAgent: navigator.userAgent,
    pageUrl: window.location.href,
    referrer: document.referrer || 'direct'
  };
}

export interface ConsentText {
  email: string;
  sms: string;
}

export const CONSENT_TEXT: ConsentText = {
  email: "I agree to receive email communications about my real estate inquiry",
  sms: "I agree to receive SMS/text messages about my real estate inquiry"
};
