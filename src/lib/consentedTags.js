/**
 * Runs the consent-gated tags from Tracking.astro (type="text/plain" + data-cookieyes) that are
 * still in the page and whose category the visitor accepted. CookieYes only runs the tags it held
 * back itself: when consent was saved on an earlier page view, it leaves them in the page as
 * text/plain and they would never run. Tags of a refused category stay off, and nothing runs
 * without CookieYes. Running it again finds nothing to do, since a switched-on tag is no longer
 * text/plain.
 *
 * Tracking.astro inlines this function's source in the <head>, so it must not use anything from
 * outside its own body.
 */
export function enableConsentedTags() {
  try {
    const consent = window.getCkyConsent?.()?.categories ?? {};
    for (const old of document.querySelectorAll('script[type="text/plain"][data-cookieyes]')) {
      const category = old.getAttribute('data-cookieyes');
      if (!consent[category.replace('cookieyes-', '')]) continue;
      const tag = document.createElement('script');
      tag.src = old.src;
      // A script added from code is async unless told otherwise; this keeps the local files
      // running in page order, like the parsed tags they replace.
      tag.async = old.async;
      tag.setAttribute('data-cookieyes', category);
      old.replaceWith(tag);
    }
  } catch {
    // Tracking must never break the page.
  }
}
