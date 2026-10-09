import React from 'react';
import { shareHrefs, SHARE_ICONS, copyToClipboard } from '../lib/share';

// LinkedIn / Facebook / copy-link buttons for a blog post card (see
// BlogPostsIsland.jsx). The card's title link is stretched over the whole
// card; .share-buttons sits above that overlay (see _blog.scss) so these stay
// clickable. The post page hero has an Astro twin, ShareLinks.astro.
export default function ShareButtons({ url, strings, className = '' }) {
  const [copied, setCopied] = React.useState(false);
  const hrefs = shareHrefs(url);
  React.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <div className={'share-buttons ' + className}>
      <a
        className="share-btn"
        href={hrefs.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={strings.linkedin}
        title={strings.linkedin}
        dangerouslySetInnerHTML={{ __html: SHARE_ICONS.linkedin }}
      />
      <a
        className="share-btn"
        href={hrefs.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={strings.facebook}
        title={strings.facebook}
        dangerouslySetInnerHTML={{ __html: SHARE_ICONS.facebook }}
      />
      <button
        type="button"
        className="share-btn"
        aria-label={strings.copy}
        title={strings.copy}
        onClick={async () => setCopied(await copyToClipboard(url))}
        dangerouslySetInnerHTML={{ __html: SHARE_ICONS.link }}
      />
      <span className={'share-copied' + (copied ? ' is-visible' : '')} role="status">
        {copied ? strings.copied : ''}
      </span>
    </div>
  );
}
