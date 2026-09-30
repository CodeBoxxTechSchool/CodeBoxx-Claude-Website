import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { localizedHref } from '../lib/i18nRoutes';
import { postUrl } from '../lib/share';
import ShareButtons from './ShareButtons';

// Astro-native counterpart to the `Posts` component in the old Blog.jsx. Same
// category-filter + "show N, load more via IntersectionObserver" behavior, but
// `posts` arrives fully resolved as a prop (fetched at build time in
// src/pages/blog/index.astro) instead of via the `useSanityPosts` hook — so Astro
// server-renders the full interactive markup (all posts, correct hrefs) into the
// page before this island ever hydrates. JS only adds the filter/pagination
// *interaction* on top of content that already exists without it.
const CATEGORY_KEYS = [
  'All Posts',
  'CodeBoxx for Life',
  'CodeBoxx Curriculums',
  'Technology News',
  'Workshop',
];

const PAGE_SIZE = 3;

// Lower-case and strip accents, so "cafe" matches "café" and search works the
// same in EN and FR.
const fold = (s) =>
  (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

// A post matches when every word of the query appears somewhere in its title,
// excerpt, author or category label.
function matches(post, query, categoryLabel) {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const hay = fold([post.title, post.excerpt, post.author, categoryLabel].join(' '));
  return words.every((w) => hay.includes(w));
}

const fmt = (d) =>
  new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

function sanityImageUrl(url, { w, q = 60 } = {}) {
  if (!url) return null;
  return url + '?w=' + w + '&q=' + q + '&auto=format';
}

export default function BlogPosts({ posts, lang, pathname, strings }) {
  const categoryLabels = strings.categories;
  const [cat, setCat] = React.useState('All Posts');
  const [shown, setShown] = React.useState(PAGE_SIZE);
  const [query, setQuery] = React.useState('');
  const all = (cat === 'All Posts' ? posts : posts.filter((p) => p.category === cat)).filter((p) =>
    matches(p, query, categoryLabels[p.category])
  );
  const list = all.slice(0, shown);
  const more = all.length > shown;
  const sentinel = React.useRef(null);

  React.useEffect(() => {
    setShown(PAGE_SIZE);
  }, [cat, query]);

  React.useEffect(() => {
    if (!more || !sentinel.current) return;
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) setShown((s) => s + PAGE_SIZE);
      },
      { rootMargin: '200px' }
    );
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [more, cat]);

  return (
    <section className="sect">
      <div className="wrap d-flex flex-column gap-5">
        <div className="blog-toolbar">
          <div className="d-flex gap-2 flex-wrap">
            {CATEGORY_KEYS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={'category-pill' + (cat === c ? ' active' : '')}
              >
                {categoryLabels[c]}
              </button>
            ))}
          </div>
          <div className="blog-search" role="search">
            <svg
              className="blog-search-icon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              className="blog-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={strings.search.placeholder}
              aria-label={strings.search.label}
            />
          </div>
        </div>
        {query && !all.length ? (
          <p className="pbody blog-search-empty" role="status">
            {strings.search.noResults.replace('{{query}}', query)}
          </p>
        ) : null}
        <div className="grid3">
          {list.map((p) => (
            <article key={p.slug} className="panel post-card">
              <img
                src={sanityImageUrl(p.featuredImage, { w: 500 })}
                alt={p.title}
                loading="lazy"
                style={{ width: '100%', height: 270, objectFit: 'cover' }}
              />
              <div className="post-card-body">
                <div className="post-meta-row">
                  <Badge bg="brand">{categoryLabels[p.category] || p.category}</Badge>
                  <span className="post-date">{fmt(p.date)}</span>
                </div>
                <h2 className="post-title">{p.title}</h2>
                <p className="pbody">{p.excerpt}</p>
                <div className="rule" />
                <div className="post-meta-row post-card-footer">
                  <span className="post-author">{p.author}</span>
                  <div className="post-card-actions">
                    <ShareButtons url={postUrl(p.slug, lang)} strings={strings.share} />
                    {/* stretched-link: the whole card is clickable (Bootstrap's
                    ::after overlay; .post-card is position: relative). */}
                    <a
                      href={localizedHref('/blog/' + p.slug, lang, pathname)}
                      className="link-tag stretched-link"
                    >
                      {strings.readPost}
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        {more ? (
          <div ref={sentinel} className="load-more">
            <Button
              variant="outline-primary"
              size="lg"
              onClick={() => setShown((s) => s + PAGE_SIZE)}
            >
              {strings.loadMore}
            </Button>
            <span className="load-more-count">
              {strings.showingOf.replace('{{shown}}', list.length).replace('{{total}}', all.length)}
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
