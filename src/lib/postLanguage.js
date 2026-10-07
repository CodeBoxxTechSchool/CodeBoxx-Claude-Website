// A blog post in English or French: Sanity's post documents carry the French translation in
// titleFr, excerptFr and contentFr (see toPost in sanityContent.js).

// A post has a French version once it has a French title and body; until then its French page
// shows the English post and names the English page as canonical (see pages/fr/blogue/[slug]).
export function isTranslated(post) {
  return Boolean(post.titleFr && post.contentFr && post.contentFr.length);
}

// The post's title, excerpt and body in `lang`, falling back to English.
export function localizePost(post, lang) {
  if (lang !== 'fr' || !isTranslated(post)) return post;
  return {
    ...post,
    title: post.titleFr,
    excerpt: post.excerptFr || post.excerpt,
    content: post.contentFr,
  };
}

// A post trimmed to what a listing card renders — drops `content` (the full
// Portable Text body), which is most of a post's size. Lists passed to a React
// island get serialized into the page's HTML, so shipping full posts made the
// homepage and /blog HTML ~1.6 MB each.
// `lang` 'fr' gives the French title and excerpt, where the post has them.
export function toPostCard(post, lang = 'en') {
  const { title, slug, category, author, date, excerpt, featuredImage } = localizePost(post, lang);
  return { title, slug, category, author, date, excerpt, featuredImage };
}
