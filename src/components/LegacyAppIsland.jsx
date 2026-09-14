import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import '../lib/i18n';
import App from '../App';

// Temporary bridge for the pages this migration hasn't reached yet: Home,
// Financing, Ventures. Mounted with `client:only="react"` from
// src/layouts/LegacyShell.astro, so it behaves exactly like the old Vite/CSR SPA
// did in production — same react-router BrowserRouter, same react-i18next setup,
// same react-helmet-async-managed <head> tags, same everything — just hosted from
// an Astro static page instead of index.html/main.jsx (which this migration
// removes; see astrobuild-migration notes in the PR description for why).
//
// This is intentionally not an improvement over today's behavior — Home/
// Financing/Ventures keep the CSR-only rendering (and the client-side-only SEO
// tags) they have in production right now. Removing this file page by page as
// each of those three gets natively ported to Astro is the next phase of the
// migration, same pattern already used for Blog/BlogPost.
export default function LegacyAppIsland() {
  return (
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}
