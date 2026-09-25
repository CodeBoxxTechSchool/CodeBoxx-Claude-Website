import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Static output: every route is prerendered to plain files in dist/. No
// adapter/server needed, so the rsync-dist-to-nginx deploy pipeline
// (.github/workflows/deploy.yml) works as-is.
export default defineConfig({
  site: 'https://codeboxx.com',
  output: 'static',
  integrations: [react(), sitemap()],
  build: { format: 'directory' },
});
