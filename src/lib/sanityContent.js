// Build-time counterpart to src/lib/sanity.js (which stays as-is for the legacy
// Home/Financing/Ventures island — see src/layouts/LegacyShell.astro). Same
// Content-API-over-fetch approach, no SDK, but these run in Astro frontmatter
// (Node, at build time via getStaticPaths/top-level await) instead of a browser
// `useEffect`, so callers get plain resolved data instead of a hook + loading
// state — the whole point of the migration is that this data is already resolved
// by the time the HTML ships, not fetched after.
//
// `import.meta.env.VITE_SANITY_*` still reads from .env/CI secrets exactly as
// today (Vite's env loading runs the same way inside Astro) — this file only ever
// runs server-side, so keeping the VITE_ prefix on server-only vars is a harmless
// naming leftover, not a leak (nothing here ships to the client).

const PROJECT_ID = import.meta.env.VITE_SANITY_PROJECT_ID;
const DATASET = import.meta.env.VITE_SANITY_DATASET || 'production';
const API_VERSION = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01';
const TOKEN = import.meta.env.VITE_SANITY_TOKEN;

export const hasSanityProject = Boolean(PROJECT_ID);

async function fetchCollection(type, groqTail = '') {
  if (!PROJECT_ID) return null;
  const url = new URL(
    'https://' + PROJECT_ID + '.apicdn.sanity.io/v' + API_VERSION + '/data/query/' + DATASET
  );
  url.searchParams.set('query', '*[_type == "' + type + '"]' + groqTail);
  const res = await fetch(url, {
    headers: TOKEN ? { Authorization: 'Bearer ' + TOKEN } : {},
  });
  if (!res.ok) throw new Error('Sanity ' + res.status + ' on ' + type);
  const body = await res.json();
  return body.result;
}

export function sanityImageUrl(url, { w, q = 60 } = {}) {
  if (!url) return null;
  return url + '?w=' + w + '&q=' + q + '&auto=format';
}

const FEATURED_IMAGE_PROJECTION = '{..., "featuredImageUrl": featuredImage.asset->url}';

function toPost(entry) {
  return {
    title: entry.title,
    slug: entry.slug?.current || entry.slug || '',
    category: entry.category,
    author: entry.author,
    date: (entry.publishedAt || entry.date || '').slice(0, 10),
    excerpt: entry.excerpt || entry.summary || '',
    content: entry.content || null,
    featuredImage: entry.featuredImageUrl || null,
    url: entry.url || entry.canonicalUrl || null,
  };
}

// Full post list, newest first — used at build time by both the /blog listing
// page (all of it, filtering/pagination happens client-side over the full set)
// and generate-sitemap-equivalent needs (@astrojs/sitemap picks up the actual
// prerendered post pages instead, so nothing else needs this for that purpose).
export async function fetchPostList(seed = []) {
  try {
    const rows = await fetchCollection(
      'post',
      ' | order(publishedAt desc) [0...50]' + FEATURED_IMAGE_PROJECTION
    );
    return rows && rows.length ? rows.map(toPost) : seed;
  } catch (err) {
    console.warn('[sanity]', err.message);
    return seed;
  }
}

export async function fetchPostBySlug(slug, seed = null) {
  const safeSlug = (slug || '').replace(/[^a-z0-9-]/g, '');
  if (!PROJECT_ID || !safeSlug) return seed;
  try {
    const entry = await fetchCollection(
      'post',
      '[slug.current == "' + safeSlug + '"][0]' + FEATURED_IMAGE_PROJECTION
    );
    return entry ? toPost(entry) : seed;
  } catch (err) {
    console.warn('[sanity]', err.message);
    return seed;
  }
}

// All published slugs, for getStaticPaths. Falls back to the seed posts' slugs so
// `astro build` still produces pages with no CMS connection (same "always builds"
// guarantee the old sanity.js seed fallback gave the SPA).
export async function fetchAllPostSlugs(seed = []) {
  if (!PROJECT_ID) return seed.map((p) => p.slug);
  try {
    const rows = await fetchCollection('post', '{"slug": slug.current}');
    const slugs = (rows || []).map((r) => r.slug).filter(Boolean);
    return slugs.length ? slugs : seed.map((p) => p.slug);
  } catch (err) {
    console.warn('[sanity]', err.message);
    return seed.map((p) => p.slug);
  }
}
