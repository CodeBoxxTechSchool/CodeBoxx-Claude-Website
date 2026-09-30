// Blog post sharing (LinkedIn, Facebook, copy link), shared by the blog list cards
// (BlogPostsIsland.jsx) and the post page hero (ShareLinks.astro). Share URLs use
// the site's canonical origin, the same one as each page's canonical/og:url tags,
// so the networks fetch the right preview no matter which host the page runs on.
import { localizedHref } from './i18nRoutes';

export const SITE_URL = 'https://codeboxx.com';

// Absolute, localized URL of a post, e.g. https://codeboxx.com/fr/blogue/<slug>/.
export function postUrl(slug, lang) {
  return SITE_URL + localizedHref('/blog/' + slug, lang, '/');
}

export function shareHrefs(url) {
  const u = encodeURIComponent(url);
  return {
    linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + u,
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + u,
  };
}

// Inline SVG icons (currentColor, decorative: the buttons carry aria-labels).
export const SHARE_ICONS = {
  linkedin:
    '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
  facebook:
    '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg>',
  link: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
};

// Copies `url` to the clipboard; falls back to a hidden textarea where the async
// Clipboard API isn't available (older browsers, non-secure contexts).
export async function copyToClipboard(url) {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = url;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}
