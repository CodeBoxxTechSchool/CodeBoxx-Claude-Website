// Sitemap tuning for @astrojs/sitemap (wired up in astro.config.mjs). Follows
// Google's guidance: list every indexable page, pair each EN page with its FR
// twin via hreflang (same mapping as the <link rel="alternate"> tags in
// SeoHead.astro), and only give <lastmod> where we know the real date: blog
// posts (Sanity's _updatedAt) and the blog listings (latest post). No
// changefreq/priority: Google ignores them.
import { localizedHref } from './i18nRoutes.js';

export const SITE_URL = 'https://codeboxx.ai';

// Map of post slug -> ISO date it was last edited. Returns an empty map (no
// lastmod, build still succeeds) if the project ID is missing or Sanity is
// unreachable.
export async function fetchPostDates({
  projectId,
  dataset = 'production',
  apiVersion = '2024-01-01',
}) {
  if (!projectId) return new Map();
  const query =
    '*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]{"s": slug.current, "u": _updatedAt}';
  const url =
    'https://' +
    projectId +
    '.apicdn.sanity.io/v' +
    apiVersion +
    '/data/query/' +
    dataset +
    '?query=' +
    encodeURIComponent(query);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const { result } = await res.json();
    return new Map((result || []).map((p) => [p.s, p.u]));
  } catch (err) {
    console.warn('[sitemap] no post dates (' + err.message + '); omitting <lastmod>');
    return new Map();
  }
}

const POST_PATH = /^\/(?:fr\/blogue|blog)\/([^/]+)\/$/;
const LISTING_PATH = /^\/(?:fr\/blogue|blog)\/$/;

export function makeSerialize(postDates) {
  const latest = [...postDates.values()].sort().pop();
  return (item) => {
    const path = new URL(item.url).pathname;

    const post = path.match(POST_PATH);
    if (post && postDates.has(post[1])) item.lastmod = postDates.get(post[1]);
    else if (LISTING_PATH.test(path) && latest) item.lastmod = latest;

    // hreflang: only for pages with a known EN/FR twin (routes in i18nRoutes.js).
    // Pages outside the table (e.g. Sanity landing pages, whose FR slug is
    // per-document) keep no alternates rather than a wrong one.
    const en = localizedHref(path, 'en', path);
    const fr = localizedHref(path, 'fr', path);
    if (en !== fr) {
      item.links = [
        { lang: 'en', url: SITE_URL + en },
        { lang: 'fr', url: SITE_URL + fr },
        { lang: 'x-default', url: SITE_URL + en },
      ];
    }
    return item;
  };
}

// Never list error or utility pages.
export function includeInSitemap(page) {
  return !/\/404\/?$/.test(new URL(page).pathname);
}
