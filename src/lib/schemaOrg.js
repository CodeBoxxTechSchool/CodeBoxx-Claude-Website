// Schema.org JSON-LD shared by SeoHead.astro (Organization) and the blog post
// pages (BlogPosting).
import { SITE_URL } from './sitemap.js';

// Google wants a raster logo of at least 112 px, so not favicon.svg.
export const LOGO_URL = SITE_URL + '/icon-192.png';

const CODEBOXX = { '@type': 'Organization', name: 'CodeBoxx', url: SITE_URL + '/' };

// Sanity's post.author is free text: the company under varying spellings
// ("CodeBoxx Technology", "Codeboxx Technology") or a person's name.
export function postAuthor(name) {
  const trimmed = (name || '').trim();
  if (!trimmed || /codeboxx/i.test(trimmed)) return CODEBOXX;
  return { '@type': 'Person', name: trimmed };
}

// `url` must be the page's canonical URL (SeoHead's, trailing slash included).
export function blogPostingSchema({ post, url, image, inLanguage }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: [image],
    inLanguage,
    url,
    datePublished: post.date || undefined,
    dateModified: post.updatedAt || post.date || undefined,
    author: postAuthor(post.author),
    publisher: { ...CODEBOXX, logo: { '@type': 'ImageObject', url: LOGO_URL } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}
