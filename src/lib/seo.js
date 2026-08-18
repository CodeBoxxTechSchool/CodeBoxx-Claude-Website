// Canonical production origin — every absolute URL emitted for SEO (canonical,
// hreflang, og:url, og:image, JSON-LD) is built from this single constant so a
// future domain change only happens in one place.
export const SITE_URL = 'https://codeboxx.com';

export const SITE_NAME = 'CodeBoxx';

// Default social preview image. Sized generously (1600px wide, from the site's own
// hero background) since no dedicated 1200x630 share asset exists yet — swap for a
// purpose-made one if social-card cropping ever looks off.
export const DEFAULT_OG_IMAGE = SITE_URL + '/assets/hero-bg.png';

export function absoluteUrl(pathname) {
  return SITE_URL + pathname;
}

// Trims text to `max` chars without cutting a word in half, since a mid-word cut
// looks broken in a search snippet or share card in a way "..." doesn't fix.
export function truncate(text, max = 160) {
  if (!text || text.length <= max) return text || '';
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}
