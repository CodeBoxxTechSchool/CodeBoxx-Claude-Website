// Google Ads conversion tracking: AW-11226981671, plus AW-16665523741, whose lead conversion
// src/lib/trackLead.js sends. Loaded by Tracking.astro only after CookieYes advertising consent,
// alongside gtag.js for AW-11226981671 (one gtag.js serves both IDs).
window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
window.gtag = window.gtag || gtag;
gtag('js', new Date());
gtag('config', 'AW-11226981671');
gtag('config', 'AW-16665523741');
