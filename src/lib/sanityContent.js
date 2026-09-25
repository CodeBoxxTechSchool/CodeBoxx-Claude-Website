// Build-time counterpart to src/lib/sanity.js (the browser-side fetcher, still
// used for Home's intake calendar — see lib/intakes.js). Same
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

// A post trimmed to what a listing card renders — drops `content` (the full
// Portable Text body), which is most of a post's size. Lists passed to a React
// island get serialized into the page's HTML, so shipping full posts made the
// homepage and /blog HTML ~1.6 MB each.
export function toPostCard({ title, slug, category, author, date, excerpt, featuredImage }) {
  return { title, slug, category, author, date, excerpt, featuredImage };
}

// Full post list, newest first — used at build time by both the /blog listing
// page (all of it, filtering/pagination happens client-side over the full set)
// and getStaticPaths in blog/[slug].astro (every post needs its own static
// page, not just recent ones). The [0...500] slice is a safety cap, not a
// "recent posts only" limit — raise it if the blog ever actually grows past
// that many posts.
export async function fetchPostList(seed = []) {
  try {
    const rows = await fetchCollection(
      'post',
      ' | order(publishedAt desc) [0...500]' + FEATURED_IMAGE_PROJECTION
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

function toTeamMember(entry) {
  return {
    id: entry._id,
    name: entry.name,
    role: entry.role,
    linkedin: entry.linkedin,
    photo: entry.photo,
  };
}

function toLogo(entry) {
  return { id: entry._id, name: entry.name, logo: entry.logo };
}

// Returns live Sanity rows, or `null` if there's no project/no data/an error — the
// null (not a seed array) is deliberate: unlike fetchPostList, the right fallback
// here is locale-derived (a studio/academy person's `role` text comes from
// home.about.<id>.people[id].role, translated per-language), which only
// HomeIsland.jsx's own useAbout()/useAcademyTopics() can build — so it does the
// `teamLive && teamLive.length ? teamLive : ownSeed` fallback itself, the same
// shape useSanityTeam(group, seed) resolved to for the legacy CSR hook.
export async function fetchTeam(group) {
  if (!PROJECT_ID) return null;
  try {
    const rows = await fetchCollection(
      'teamMember',
      '[group == "' +
        group +
        '"] | order(order asc) {_id, name, role, linkedin, "photo": photo.asset->url}'
    );
    return rows && rows.length ? rows.map(toTeamMember) : null;
  } catch (err) {
    console.warn('[sanity]', err.message);
    return null;
  }
}

// Same null-or-live shape as fetchTeam, for the same reason (HomeIsland.jsx falls
// back to its own CLIENT_LOGOS constant, which needs no translation but lives with
// the rest of that component's static seed data).
export async function fetchLogos() {
  if (!PROJECT_ID) return null;
  try {
    const rows = await fetchCollection(
      'partnerLogo',
      ' | order(order asc) {_id, name, "logo": logo.asset->url}'
    );
    return rows && rows.length ? rows.map(toLogo) : null;
  } catch (err) {
    console.warn('[sanity]', err.message);
    return null;
  }
}

function toClientTestimonial(entry) {
  return { quote: entry.quote, name: entry.name, role: entry.role };
}

function toGraduateTestimonial(entry) {
  return {
    photo: entry.photoUrl,
    name: entry.name,
    role: entry.role,
    before: entry.before,
    after: entry.after,
  };
}

// Same null-or-live shape as fetchTeam/fetchLogos — HomeIsland.jsx falls back to
// its own hardcoded quotes (home.clientQuotes in src/locales/*/home.js) when this
// is null, so the real client testimonials already on the site stay as the seed
// rather than being lost when this collection is empty (e.g. before an editor has
// entered them into Sanity yet).
export async function fetchClientTestimonials() {
  if (!PROJECT_ID) return null;
  try {
    const rows = await fetchCollection(
      'clientTestimonial',
      ' | order(order asc) {quote, name, role}'
    );
    return rows && rows.length ? rows.map(toClientTestimonial) : null;
  } catch (err) {
    console.warn('[sanity]', err.message);
    return null;
  }
}

// Sanity 'landingPage' document -> the shape pages/lp/[slug].astro and its FR
// twin render. Sections pass through as-is (their `_type` picks the renderer
// in LandingSections.jsx).
function toLandingPage(entry) {
  return {
    title: entry.title,
    slug: entry.slug?.current || '',
    slugFr: entry.slugFr?.current || '',
    showTopBar: entry.showTopBar !== false,
    showFooter: entry.showFooter !== false,
    sections: entry.sections || [],
  };
}

// All landingPage documents, for getStaticPaths in pages/lp/[slug].astro and
// pages/fr/lp/[slug].astro — one real prebuilt page per document per language
// it has a slug for. No seed fallback: this is fully custom per-document
// content with nothing sensible to hardcode.
export async function fetchLandingPages() {
  if (!PROJECT_ID) return [];
  try {
    const rows = await fetchCollection('landingPage', '{...}');
    return (rows || []).map(toLandingPage);
  } catch (err) {
    console.warn('[sanity]', err.message);
    return [];
  }
}

// Same shape/reasoning as fetchClientTestimonials, falling back to
// home.gradQuotes.
export async function fetchGraduateTestimonials() {
  if (!PROJECT_ID) return null;
  try {
    const rows = await fetchCollection(
      'graduateTestimonial',
      ' | order(order asc) {name, role, before, after, "photoUrl": photo.asset->url}'
    );
    return rows && rows.length ? rows.map(toGraduateTestimonial) : null;
  } catch (err) {
    console.warn('[sanity]', err.message);
    return null;
  }
}
