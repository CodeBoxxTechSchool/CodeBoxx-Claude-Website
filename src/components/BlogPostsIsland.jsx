import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { localizedHref } from '../lib/i18nRoutes';

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
  const all = cat === 'All Posts' ? posts : posts.filter((p) => p.category === cat);
  const list = all.slice(0, shown);
  const more = all.length > shown;
  const sentinel = React.useRef(null);

  React.useEffect(() => {
    setShown(PAGE_SIZE);
  }, [cat]);

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
                <div className="post-meta-row">
                  <span className="post-author">{p.author}</span>
                  <a href={localizedHref('/blog/' + p.slug, lang, pathname)} className="link-tag">
                    {strings.readPost}
                  </a>
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
