import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Static output: every route Astro knows about (Blog/BlogPost natively, plus the
// stub pages that mount the legacy React app for Home/Financing/Ventures — see
// src/layouts/LegacyShell.astro) is prerendered to plain files in dist/, same as
// today's `vite build`. No adapter/server needed, so the existing
// rsync-dist-to-nginx deploy pipeline (.github/workflows/deploy.yml) keeps working
// unchanged.
export default defineConfig({
  site: 'https://codeboxx.com',
  output: 'static',
  integrations: [react(), sitemap()],
  build: { format: 'directory' },
});
