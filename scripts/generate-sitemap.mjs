// Regenerates public/sitemap.xml right before every build, so it always reflects
// whatever posts currently exist in Sanity instead of going stale between deploys.
// Run standalone with `node scripts/generate-sitemap.mjs`; wired into `npm run build`
// via package.json's prebuild script.
import { writeFileSync, readFileSync, existsSync } from 'node:fs';

const SITE_URL = 'https://codeboxx.com';

// Mirrors the static (non-post) entries of ROUTE_TABLE in src/lib/routes.js. Kept in
// sync by hand — routes.js pulls in react-router-dom/react-i18next, browser-only
// deps this plain Node script doesn't load.
const STATIC_ROUTES = [
  { en: '/', fr: '/fr' },
  { en: '/blog', fr: '/fr/blogue' },
  { en: '/financing', fr: '/fr/financement' },
  { en: '/ventures', fr: '/fr/ventures' },
];

// Vite only loads .env into import.meta.env inside the app bundle — this script runs
// outside that pipeline, so VITE_SANITY_* has to be read from .env by hand.
function loadEnv() {
  const env = { ...process.env };
  if (existsSync('.env')) {
    for (const line of readFileSync('.env', 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      if (!(key in env)) env[key] = trimmed.slice(eq + 1).trim();
    }
  }
  return env;
}

async function fetchPostSlugs(env) {
  const projectId = env.VITE_SANITY_PROJECT_ID;
  if (!projectId) return [];
  const dataset = env.VITE_SANITY_DATASET || 'production';
  const apiVersion = env.VITE_SANITY_API_VERSION || '2024-01-01';
  const url = new URL(
    'https://' + projectId + '.apicdn.sanity.io/v' + apiVersion + '/data/query/' + dataset
  );
  url.searchParams.set(
    'query',
    '*[_type == "post" && defined(slug.current)]{ "slug": slug.current, "date": publishedAt }'
  );
  try {
    const res = await fetch(url, {
      headers: env.VITE_SANITY_TOKEN ? { Authorization: 'Bearer ' + env.VITE_SANITY_TOKEN } : {},
    });
    if (!res.ok) throw new Error('Sanity ' + res.status);
    const body = await res.json();
    return body.result || [];
  } catch (err) {
    console.warn('[sitemap] skipping Sanity posts:', err.message);
    return [];
  }
}

function urlEntry(loc, alternates, lastmod) {
  const links = alternates
    .map(
      (a) => '    <xhtml:link rel="alternate" hreflang="' + a.lang + '" href="' + a.href + '" />'
    )
    .join('\n');
  return (
    '  <url>\n    <loc>' +
    loc +
    '</loc>\n' +
    links +
    '\n' +
    (lastmod ? '    <lastmod>' + lastmod + '</lastmod>\n' : '') +
    '  </url>'
  );
}

function localizedPair(enHref, frHref) {
  return [
    { lang: 'en', href: enHref },
    { lang: 'fr', href: frHref },
    { lang: 'x-default', href: enHref },
  ];
}

async function main() {
  const env = loadEnv();
  const entries = [];

  for (const { en, fr } of STATIC_ROUTES) {
    const enHref = SITE_URL + en;
    const frHref = SITE_URL + fr;
    const alternates = localizedPair(enHref, frHref);
    entries.push(urlEntry(enHref, alternates));
    entries.push(urlEntry(frHref, alternates));
  }

  // Blog post slugs are Sanity content, not translated (see routes.js) — only the
  // "/blog" -> "/blogue" segment differs between the two localized URLs.
  const posts = await fetchPostSlugs(env);
  for (const post of posts) {
    if (!post.slug) continue;
    const enHref = SITE_URL + '/blog/' + post.slug;
    const frHref = SITE_URL + '/fr/blogue/' + post.slug;
    const alternates = localizedPair(enHref, frHref);
    const lastmod = post.date ? post.date.slice(0, 10) : undefined;
    entries.push(urlEntry(enHref, alternates, lastmod));
    entries.push(urlEntry(frHref, alternates, lastmod));
  }

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    entries.join('\n') +
    '\n</urlset>\n';

  writeFileSync('public/sitemap.xml', xml);
  console.log(
    '[sitemap] wrote public/sitemap.xml with ' +
      entries.length +
      ' URLs (' +
      posts.length +
      ' posts).'
  );
}

main();
