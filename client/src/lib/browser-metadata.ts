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
  sms: "I agree to receive SMS from Hensleys Homes. Msg & data rates may apply. Message frequency varies. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase. By signing up, you agree to our Terms and Privacy Policy.",
  email: "I agree to receive email from Hensleys Homes. You can unsubscribe anytime. See our Terms and Privacy Policy."
};
