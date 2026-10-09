import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import { fetchPostIndex, makeSerialize, makeFilter } from './src/lib/sitemap.js';
import { frTypographyPlugin } from './src/lib/frTypography.js';
import { stripNulBytes } from './src/lib/stripNul.js';

// Blog post dates for the sitemap's <lastmod>, and which posts are translated (their French page
// is listed and paired with hreflang; see src/lib/sitemap.js). Same
// VITE_SANITY_* vars the pages use: from .env locally, from CI secrets in deploy.
const env = { ...loadEnv(process.env.NODE_ENV || 'production', process.cwd(), ''), ...process.env };
const { dates: postDates, translated } = await fetchPostIndex({
  projectId: env.VITE_SANITY_PROJECT_ID,
  dataset: env.VITE_SANITY_DATASET || 'production',
  apiVersion: env.VITE_SANITY_API_VERSION || '2024-01-01',
});

// Static output: every route is prerendered to plain files in dist/. No
// adapter/server needed, so the rsync-dist-to-nginx deploy pipeline
// (.github/workflows/deploy.yml) works as-is.
export default defineConfig({
  site: 'https://codeboxx.ai',
  output: 'static',
  integrations: [
    react(),
    sitemap({ filter: makeFilter(translated), serialize: makeSerialize(postDates, translated) }),
    // React 18 can leave a NUL byte in a page's HTML; see src/lib/stripNul.js.
    stripNulBytes(),
  ],
  build: { format: 'directory' },
  // The French Academy's accented spelling, as people type it. Static output makes
  // these tiny redirect pages; the real page is /fr/academie (ASCII, like every FR slug).
  redirects: {
    '/académie': '/fr/academie/',
    '/fr/académie': '/fr/academie/',
  },
  // Local dev only: the forms' relay (relay/server.js); nginx does this in production.
  // French spacing (non-breaking space before : ; ! ?, before $ and %) on all FR
  // content — see src/lib/frTypography.js.
  vite: {
    plugins: [frTypographyPlugin()],
    server: { proxy: { '/api': 'http://localhost:8787' } },
  },
});
