// Astro-native counterpart to src/lib/routes.js (which stays react-router-based,
// for the legacy Home/Financing/Ventures island only — see
// src/layouts/LegacyShell.astro). Same EN/FR path table and hash table, but no
// react-router/window dependency: every function takes the current pathname as an
// explicit argument instead of reading it off `window.location` or a router
// context, so it works identically in Astro frontmatter (server/build time) and in
// a hydrated island (client time).
//
// Only param this site ever has is a single trailing ":slug" (blog post slugs), so
// route matching/generation is done with a small manual regex swap instead of
// pulling in react-router's matchPath/generatePath for this half of the app.

export const ROUTE_TABLE = [
  { en: '/', fr: '/fr' },
  { en: '/blog', fr: '/fr/blogue' },
  { en: '/blog/:slug', fr: '/fr/blogue/:slug' },
  { en: '/financing', fr: '/fr/financement' },
  { en: '/ventures', fr: '/fr/ventures' },
];

// Keep in sync with src/lib/routes.js's HASH_TABLE — duplicated rather than shared
// because that file imports react-i18next's useTranslation, which would drag a
// react-router-only dependency into pages that no longer use either.
export const HASH_TABLE = {
  top: { en: 'top', fr: 'top' },
  codeboxx: { en: 'codeboxx', fr: 'a-propos' },
  'about-team': { en: 'about-team', fr: 'equipe' },
  'about-history': { en: 'about-history', fr: 'historique' },
  'about-vision': { en: 'about-vision', fr: 'vision-mission' },
  solutions: { en: 'solutions', fr: 'solutions' },
  // The "Works" nav/footer link — matches nav.solutionsWorks ("Works" /
  // "Réalisations") — targets the trusted-companies logo slider specifically,
  // not just the top of the Solutions section (see ClientSlider in
  // HomeIsland.jsx, which is what actually carries this id).
  works: { en: 'works', fr: 'realisations' },
  academy: { en: 'academy', fr: 'academie' },
  'academy-courses': { en: 'academy-courses', fr: 'academie-cours' },
  intake: { en: 'intake', fr: 'admission' },
  contact: { en: 'contact', fr: 'contact' },
};

export const isFrenchPath = (pathname) => pathname === '/fr' || pathname.startsWith('/fr/');

function translateHash(id, lang) {
  for (const key in HASH_TABLE) {
    const pair = HASH_TABLE[key];
    if (pair.en === id) return lang === 'fr' ? pair.fr : pair.en;
    if (pair.fr === id) return lang === 'en' ? pair.en : pair.fr;
  }
  return id;
}

// `pattern` is one of ROUTE_TABLE's "en"/"fr" strings (at most one ":param"
// segment, always the last one here). Returns the captured value or null.
function matchPattern(pattern, pathname) {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;
  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    const pp = patternParts[i];
    if (pp.startsWith(':')) params[pp.slice(1)] = pathParts[i];
    else if (pp !== pathParts[i]) return null;
  }
  return params;
}

function fillPattern(pattern, params) {
  return (
    '/' +
    pattern
      .split('/')
      .filter(Boolean)
      .map((part) => (part.startsWith(':') ? params[part.slice(1)] : part))
      .join('/')
  );
}

// Translates a hash-only anchor ("#contact") or a full pathname ("/blog",
// "/blog/some-slug") into its equivalent in `lang`. `currentPathname` is only
// needed for the hash case (to know whether to prefix it with the localized home
// path) — pass `Astro.url.pathname` server-side or `window.location.pathname`
// client-side.
// Trailing slash matches Astro's `build.format: 'directory'` output (every real
// prerendered page is .../index.html, served at a URL ending in "/") — added here,
// once, rather than at each call site, so every internal link this produces is
// directly navigable regardless of how strictly a given static host normalizes
// trailing slashes.
const withTrailingSlash = (p) => (p.endsWith('/') ? p : p + '/');

export function localizedHref(path, lang, currentPathname = '/') {
  if (path.charAt(0) === '#') {
    const home = lang === 'fr' ? '/fr/' : '/';
    const hash = '#' + translateHash(path.slice(1), lang);
    return currentPathname === home ? hash : home + hash;
  }
  for (const r of ROUTE_TABLE) {
    const fromEn = matchPattern(r.en, path);
    if (fromEn) return withTrailingSlash(lang === 'fr' ? fillPattern(r.fr, fromEn) : path);
    const fromFr = matchPattern(r.fr, path);
    if (fromFr) return withTrailingSlash(lang === 'en' ? fillPattern(r.en, fromFr) : path);
  }
  return path;
}

// The DOM id a section should carry in `lang` — see routes.js's useLocalizedId for
// the react-i18next-bound original this mirrors.
export function localizedId(key, lang) {
  const pair = HASH_TABLE[key];
  if (!pair) return key;
  return lang === 'fr' ? pair.fr : pair.en;
}
