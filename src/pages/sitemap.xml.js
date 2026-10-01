// /sitemap.xml: the address most crawlers and SEO tools try first. It's a copy
// of the sitemap index @astrojs/sitemap writes to /sitemap-index.xml (pointing at
// its sitemap-0.xml), so both addresses work. robots.txt lists the canonical one.
import { SITE_URL } from '../lib/sitemap.js';

export function GET() {
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    '  <sitemap><loc>' +
    SITE_URL +
    '/sitemap-0.xml</loc></sitemap>\n' +
    '</sitemapindex>\n';
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
