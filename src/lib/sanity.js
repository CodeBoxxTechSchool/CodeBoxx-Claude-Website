import React from 'react';

const PROJECT_ID = import.meta.env.VITE_SANITY_PROJECT_ID;
const DATASET = import.meta.env.VITE_SANITY_DATASET || 'production';
const API_VERSION = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01';
const TOKEN = import.meta.env.VITE_SANITY_TOKEN;

// Lets other modules (e.g. intakes.js) skip a doomed fetch quietly instead of
// hitting the same "not configured" warning fetchCollection already throws.
export const hasSanityProject = Boolean(PROJECT_ID);

export async function fetchCollection(type, groqTail = '') {
  if (!PROJECT_ID) throw new Error('VITE_SANITY_PROJECT_ID is not set.');
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

// Appends Sanity's image CDN resize/quality params to an asset URL, so callers
// request only the pixel size they'll actually render (e.g. a small, low-quality
// tile for a repeated background) instead of always paying for the full upload.
export function sanityImageUrl(url, { w, q = 60 } = {}) {
  if (!url) return null;
  return url + '?w=' + w + '&q=' + q + '&auto=format';
}

// Sanity 'post' document -> the shape Blog.jsx's cards and BlogPost.jsx's page
// render. Both post queries below add a `{..., "featuredImageUrl": ...}` projection —
// `...` keeps every raw field as-is (so `slug`/`content` need no query change) while
// resolving the image asset reference to a plain URL. `url` is an optional external
// reference now (not the content source), so it maps to `null` when absent rather
// than a placeholder '#' href.
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

const FEATURED_IMAGE_PROJECTION = '{..., "featuredImageUrl": featuredImage.asset->url}';

export function useSanityPosts(seed = []) {
  const [posts, setPosts] = React.useState(seed);
  React.useEffect(() => {
    let live = true;
    if (!PROJECT_ID) return undefined;
    fetchCollection(
      'post',
      ' | order(publishedAt desc) [0...50]' + FEATURED_IMAGE_PROJECTION
    )
      .then((rows) => {
        if (live && rows && rows.length) setPosts(rows.map(toPost));
      })
      .catch((err) => console.warn('[sanity]', err.message));
    return () => {
      live = false;
    };
  }, []);
  return posts;
}

// Fetches one post by slug for BlogPost.jsx (route: /blog/:slug). The slug comes
// from a route param, so it's the first user-facing value in this codebase to feed
// directly into a hand-built GROQ string — sanitized to [a-z0-9-] before use.
export function useSanityPost(slug, seed = null) {
  const [post, setPost] = React.useState(seed);
  React.useEffect(() => {
    let live = true;
    const safeSlug = (slug || '').replace(/[^a-z0-9-]/g, '');
    if (!PROJECT_ID || !safeSlug) return undefined;
    fetchCollection('post', '[slug.current == "' + safeSlug + '"][0]' + FEATURED_IMAGE_PROJECTION)
      .then((entry) => {
        if (live && entry) setPost(toPost(entry));
      })
      .catch((err) => console.warn('[sanity]', err.message));
    return () => {
      live = false;
    };
  }, [slug]);
  return post;
}

// Sanity 'teamMember' document (name, role, linkedin, photo image, group: "studio" |
// "academy", order) -> the shape ServiceDetail's and Academy's people-grids render.
// `id` carries the Sanity document _id — used as both the React key and the
// <image-slot> id, so a stable identity survives reordering (see the seed shapes in
// Home.jsx for why this matters: image-slot persists locally-dropped images keyed
// by id, and a positional id would reattach a stale photo to the wrong person after
// a reorder).
function toTeamMember(entry) {
  return {
    id: entry._id,
    name: entry.name,
    role: entry.role,
    linkedin: entry.linkedin,
    photo: entry.photo,
  };
}

export function useSanityTeam(group, seed = []) {
  const [team, setTeam] = React.useState(seed);
  React.useEffect(() => {
    let live = true;
    if (!PROJECT_ID) return undefined;
    fetchCollection(
      'teamMember',
      '[group == "' +
        group +
        '"] | order(order asc) {_id, name, role, linkedin, "photo": photo.asset->url}'
    )
      .then((rows) => {
        if (live && rows && rows.length) setTeam(rows.map(toTeamMember));
      })
      .catch((err) => console.warn('[sanity]', err.message));
    return () => {
      live = false;
    };
  }, [group]);
  return team;
}

// Sanity 'partnerLogo' document (name, logo image, order) -> the shape ClientSlider
// renders. No fixed count — however many documents exist is however many slides show.
function toLogo(entry) {
  return { id: entry._id, name: entry.name, logo: entry.logo };
}

export function useSanityLogos(seed = []) {
  const [logos, setLogos] = React.useState(seed);
  React.useEffect(() => {
    let live = true;
    if (!PROJECT_ID) return undefined;
    fetchCollection('partnerLogo', ' | order(order asc) {_id, name, "logo": logo.asset->url}')
      .then((rows) => {
        if (live && rows && rows.length) setLogos(rows.map(toLogo));
      })
      .catch((err) => console.warn('[sanity]', err.message));
    return () => {
      live = false;
    };
  }, []);
  return logos;
}

// Reads the current language out of a Sanity {en, fr} localized field, falling
// back to English — used by every landing-page section renderer.
export function pickLocale(field, lang) {
  return (field && (field[lang] || field.en)) || '';
}

// Sanity 'landingPage' document -> the shape LandingPage.jsx renders. Sections
// pass through as-is (their `_type` picks the renderer) since none of the
// section schemas have image fields needing a projection.
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

// Fetches one landing page by its per-language slug (route: /lp/:slug or
// /fr/lp/:slug). No seed fallback — this is fully custom per-document content
// with nothing sensible to hardcode. Returns `undefined` while loading, `null`
// once loading has resolved with nothing found (no Sanity project configured,
// bad slug, or no matching document).
export function useSanityLandingPage(slug, lang) {
  const [page, setPage] = React.useState(undefined);
  React.useEffect(() => {
    let live = true;
    const safeSlug = (slug || '').replace(/[^a-z0-9-]/g, '');
    if (!PROJECT_ID || !safeSlug) {
      setPage(null);
      return undefined;
    }
    const field = lang === 'fr' ? 'slugFr' : 'slug';
    fetchCollection('landingPage', '[' + field + '.current == "' + safeSlug + '"][0]{...}')
      .then((entry) => {
        if (live) setPage(entry ? toLandingPage(entry) : null);
      })
      .catch((err) => {
        console.warn('[sanity]', err.message);
        if (live) setPage(null);
      });
    return () => {
      live = false;
    };
  }, [slug, lang]);
  return page;
}
