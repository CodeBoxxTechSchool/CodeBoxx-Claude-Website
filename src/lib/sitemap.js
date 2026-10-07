// Sitemap tuning for @astrojs/sitemap (wired up in astro.config.mjs). Follows
// Google's guidance: list every indexable page, pair each EN page with its FR
// twin via hreflang (same mapping as the <link rel="alternate"> tags in
// SeoHead.astro), and only give <lastmod> where we know the real date: blog
// posts (Sanity's _updatedAt) and the blog listings (latest post). No
// changefreq/priority: Google ignores them.
import { localizedHref } from './i18nRoutes.js';

export const SITE_URL = 'https://codeboxx.ai';

// Each post's last edit (slug -> ISO date, for <lastmod>) and which posts have a French
// translation (titleFr and contentFr in Sanity). Unknown (dates empty, translated null) when the
// project ID is missing or Sanity is unreachable: the build still succeeds, without lastmod, and
// every French post stays listed as before.
export async function fetchPostIndex({
  projectId,
  dataset = 'production',
  apiVersion = '2024-01-01',
}) {
  const unknown = { dates: new Map(), translated: null };
  if (!projectId) return unknown;
  const query =
    '*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]' +
    '{"s": slug.current, "u": _updatedAt, "fr": defined(titleFr) && count(contentFr) > 0}';
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
    const posts = result || [];
    return {
      dates: new Map(posts.map((p) => [p.s, p.u])),
      translated: new Set(posts.filter((p) => p.fr).map((p) => p.s)),
    };
  } catch (err) {
    console.warn('[sitemap] no post index (' + err.message + '); omitting <lastmod>');
    return unknown;
  }
}

const POST_PATH = /^\/(?:fr\/blogue|blog)\/([^/]+)\/$/;
const FR_POST_PATH = /^\/fr\/blogue\/([^/]+)\/$/;
const LISTING_PATH = /^\/(?:fr\/blogue|blog)\/$/;

// A post without a French translation has no twin: no hreflang pair (`translated` null: unknown,
// so every post keeps its pair, as before).
const untranslated = (translated, slug) => Boolean(translated) && !translated.has(slug);

export function makeSerialize(postDates, translated = null) {
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
    if (en !== fr && !(post && untranslated(translated, post[1]))) {
      item.links = [
        { lang: 'en', url: SITE_URL + en },
        { lang: 'fr', url: SITE_URL + fr },
        { lang: 'x-default', url: SITE_URL + en },
      ];
    }
    return item;
  };
}

// Never list error or utility pages, nor a post's French page until the post is translated (that
// page names the English post as canonical).
export function makeFilter(translated = null) {
  return (page) => {
    const path = new URL(page).pathname;
    if (/\/404\/?$/.test(path)) return false;
    const frPost = path.match(FR_POST_PATH);
    return !(frPost && untranslated(translated, frPost[1]));
  };
}
