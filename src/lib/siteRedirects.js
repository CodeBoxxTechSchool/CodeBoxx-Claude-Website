// The site's own redirects, path -> target (a #fragment kept, the query string put before it).
// Astro writes a meta-refresh page for each (astro.config.mjs's `redirects`), and nginx answers
// them first with a real 301 (ops/nginx/redirects.js writes the map): Search Console listed the
// meta-refresh pages as "Excluded by 'noindex' tag". No import.meta.env: plain Node imports it.
export const SITE_REDIRECTS = {
  // The French Academy's accented spelling, as people type it; the real page is /fr/academie
  // (ASCII, like every FR slug).
  '/académie': '/fr/academie/',
  '/fr/académie': '/fr/academie/',
  // Posts merged or retired (Search Console coverage, Oct 2026): the teaser now points to the
  // full episode post, and the 2024 "coming soon" announcement to the Academy it announced.
  '/blog/building-people-not-just-tech':
    '/blog/building-people-not-just-tech-nicolas-genest-on-ai-talent-and-the-future-of-work-ep-1146/',
  '/fr/blogue/building-people-not-just-tech':
    '/fr/blogue/building-people-not-just-tech-nicolas-genest-on-ai-talent-and-the-future-of-work-ep-1146/',
  '/blog/coming-soon-at-codeboxx': '/academy/',
  '/fr/blogue/coming-soon-at-codeboxx': '/fr/academie/',
  // Short links that open the homepage's enroll drawer (ENROLL_HASHES in HomeIsland.jsx).
  '/contact': '/#contact',
  '/launch': '/#launch',
  '/fr/contact': '/fr/#contact',
  '/fr/launch': '/fr/#launch',
};
