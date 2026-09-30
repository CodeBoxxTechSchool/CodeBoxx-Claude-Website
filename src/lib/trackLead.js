// Where a received lead is reported. The tags themselves load in Tracking.astro.
const GA4_ID = 'G-7L7VBFGNTF';
const ADS_CONVERSION = 'AW-16665523741/J94oCPfX3PYZEJ3s3oo-';

/**
 * Reports a received enroll, contact or pitch form as a GA4 generate_lead event (analytics
 * consent) and a Google Ads conversion (advertising consent). Nothing is sent or queued without
 * the matching CookieYes consent.
 */
export function trackLead({ formId, program, language }) {
  try {
    const gtag = typeof window === 'undefined' ? undefined : window.gtag;
    if (typeof gtag !== 'function') return;
    // Checked per tag: gtag exists once either consent is given, and an event sent to a tag that
    // wasn't configured still makes gtag.js fetch that tag's code.
    const consent = window.getCkyConsent?.()?.categories ?? {};
    if (consent.analytics) {
      // page_language, not language: gtag.js reads `language` as the visitor's browser language.
      const params = { send_to: GA4_ID, form_id: formId, page_language: language };
      if (program) params.program = program;
      gtag('event', 'generate_lead', params);
    }
    // No value: Ads applies the conversion action's default, so bidding history carries over.
    if (consent.advertisement) gtag('event', 'conversion', { send_to: ADS_CONVERSION });
  } catch {
    // Tracking must never break the form's success.
  }
}
