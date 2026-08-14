import { matchPath, generatePath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// The single EN/FR path table. English is the unprefixed canonical form (unchanged
// from before this existed); French gets its own translated, /fr-prefixed path.
// Blog post slugs are Sanity content (author-entered, English) and aren't
// translated — only the static "/blog" -> "/blogue" segment differs, carried
// through via the ":slug" param in generatePath.
export const ROUTE_TABLE = [
  { en: '/', fr: '/fr' },
  { en: '/blog', fr: '/fr/blogue' },
  { en: '/blog/:slug', fr: '/fr/blogue/:slug' },
  { en: '/financing', fr: '/fr/financement' },
  { en: '/ventures', fr: '/fr/ventures' },
];

// Every hash fragment that's an actual link/navigation target somewhere in the app
// (NAV_STRUCTURE in Chrome.jsx, Platform()'s division links, Academy's course-card
// CTA, the consent-text privacy link) — each also names the real DOM `id` a section
// carries (via useLocalizedId below), so a hash always resolves to an element that
// exists in the current language. "#platform"/"#codeblog" are element ids with no
// inbound link anywhere, so they're deliberately not in this table — nothing ever
// navigates to them, so there's nothing to translate.
export const HASH_TABLE = {
  top: { en: 'top', fr: 'top' },
  codeboxx: { en: 'codeboxx', fr: 'a-propos' },
  'about-team': { en: 'about-team', fr: 'equipe' },
  'about-history': { en: 'about-history', fr: 'historique' },
  'about-vision': { en: 'about-vision', fr: 'vision-mission' },
  solutions: { en: 'solutions', fr: 'solutions' },
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
  return id; // unknown hash — leave unchanged rather than guess
}

// Translates a hash-only anchor ("#contact") or a full pathname ("/blog",
// "/blog/some-slug") into its equivalent in `lang`. Works from either language as
// input and is idempotent — already-target-language input passes through
// unchanged. Falls back to returning `path` as-is for anything not in
// ROUTE_TABLE/HASH_TABLE, rather than guessing.
// Landing pages have arbitrary, editor-chosen per-document slugs that aren't
// derivable from a fixed path pattern — so unlike ROUTE_TABLE, this is a small
// mutable registry populated at runtime by LandingPage.jsx once its Sanity
// document loads, and cleared when it unmounts.
let landingPageSlugs = null;

export function setLandingPageSlugs(pair) {
  landingPageSlugs = pair;
}

export function localizedHref(path, lang) {
  if (path.charAt(0) === '#') {
    const home = lang === 'fr' ? '/fr' : '/';
    const hash = '#' + translateHash(path.slice(1), lang);
    return window.location.pathname === home ? hash : home + hash;
  }
  if (landingPageSlugs && (matchPath('/lp/:slug', path) || matchPath('/fr/lp/:slug', path))) {
    if (lang === 'fr') {
      return landingPageSlugs.slugFr ? '/fr/lp/' + landingPageSlugs.slugFr : '/fr';
    }
    return '/lp/' + landingPageSlugs.slug;
  }
  for (const r of ROUTE_TABLE) {
    const fromEn = matchPath(r.en, path);
    if (fromEn) return lang === 'fr' ? generatePath(r.fr, fromEn.params) : path;
    const fromFr = matchPath(r.fr, path);
    if (fromFr) return lang === 'en' ? generatePath(r.en, fromFr.params) : path;
  }
  return path;
}

// The DOM `id` a section should carry in the current language, e.g.
// useLocalizedId('codeboxx') -> 'codeboxx' in English, 'a-propos' in French. Keeps
// the section's actual id (and so its native browser scroll-to-anchor behavior) in
// sync with whatever HASH_TABLE says links should point to in that language.
export function useLocalizedId(key) {
  const { i18n } = useTranslation();
  const pair = HASH_TABLE[key];
  if (!pair) return key;
  return i18n.language === 'fr' ? pair.fr : pair.en;
}
