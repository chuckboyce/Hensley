// TypeScript declarations for custom web components
import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'chat-widget': DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & { 'location-id': string },
        HTMLElement
      >;
    }
  }
}

export {};
