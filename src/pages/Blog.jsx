import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { TopBar, Footer } from '../components/Chrome';
import Seo from '../components/Seo';
import { useSanityPosts, sanityImageUrl } from '../lib/sanity';
import { localizedHref } from '../lib/routes';
import { SEED_POSTS } from '../lib/blogSeed';

// Re-exported for BlogPost.jsx's existing `import { SEED_POSTS } from './Blog'` —
// the data itself now lives in lib/blogSeed.js so the new Astro pages
// (src/pages/blog/, src/pages/fr/blogue/) can use it without pulling in this
// file's react-router-dom/react-bootstrap/react-i18next imports.
export { SEED_POSTS };

// Canonical English values stored on Sanity `post.category` — filtering (`cat`
// state, `p.category === cat`) always compares against these; only the button's
// displayed label is translated (via blog.categories), so a language switch can't
// break matching against live (English) Sanity data.
const CATEGORY_KEYS = [
  'All Posts',
  'CodeBoxx for Life',
  'CodeBoxx Curriculums',
  'Technology News',
  'Workshop',
];

const fmt = (d) =>
  new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

function Band() {
  const { t } = useTranslation();
  return (
    <section className="band-dark">
      <div className="wrap d-flex flex-column gap-4 align-items-start">
        <span className="pill">{t('blog.band.pill')}</span>
        <h1 className="band-title">{t('blog.band.title')}</h1>
        <p className="band-lede">{t('blog.band.lede')}</p>
      </div>
    </section>
  );
}

const PAGE_SIZE = 2;

function Posts() {
  const { t, i18n } = useTranslation();
  const categoryLabels = t('blog.categories', { returnObjects: true });
  const POSTS = useSanityPosts(SEED_POSTS);
  const [cat, setCat] = React.useState('All Posts');
  const [shown, setShown] = React.useState(PAGE_SIZE);
  const all = cat === 'All Posts' ? POSTS : POSTS.filter((p) => p.category === cat);
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
        <div className="grid2">
          {list.map((p) => (
            <article key={p.slug} className="panel post-card">
              <img
                src={sanityImageUrl(p.featuredImage, { w: 500 })}
                alt={p.title}
                loading="lazy"
                style={{ width: '100%', height: 200, objectFit: 'cover' }}
              />
              <div className="post-card-body">
                <div className="post-meta-row">
                  <Badge bg="brand">{p.category}</Badge>
                  <span className="post-date">{fmt(p.date)}</span>
                </div>
                <h2 className="post-title">{p.title}</h2>
                <p className="pbody">{p.excerpt}</p>
                <div className="rule" />
                <div className="post-meta-row">
                  <span className="post-author">{p.author}</span>
                  <Link to={localizedHref('/blog/' + p.slug, i18n.language)} className="link-tag">
                    {t('blog.readPost')}
                  </Link>
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
              {t('blog.loadMore')}
            </Button>
            <span className="load-more-count">
              {t('blog.showingOf', { shown: list.length, total: all.length })}
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Subscribe() {
  const { t } = useTranslation();
  return (
    <section className="sect sect-contact">
      <div className="wrap grid2">
        <div className="d-flex flex-column gap-3">
          <p className="eyebrow">{t('blog.subscribe.eyebrow')}</p>
          <h2 className="h2">{t('blog.subscribe.title')}</h2>
          <p className="lede">{t('blog.subscribe.lede')}</p>
        </div>
        <div className="panel">
          <Form.Group>
            <Form.Label>{t('blog.subscribe.emailLabel')}</Form.Label>
            <Form.Control id="blog-email" placeholder={t('blog.subscribe.emailPlaceholder')} />
          </Form.Group>
          <div className="rule" />
          <div className="form-actions">
            <span className="form-actions-note">{t('blog.subscribe.unsubscribeNote')}</span>
            <Button size="lg">{t('blog.subscribe.submit')}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogPage() {
  const { t, i18n } = useTranslation();
  return (
    <div id="top">
      <Seo title={t('blog.seo.title')} description={t('blog.seo.description')} />
      <TopBar
        onCodi={() => {
          window.location.href = localizedHref('#contact', i18n.language);
        }}
      />
      <main>
        <Band />
        <Posts />
        <Subscribe />
      </main>
      <Footer />
    </div>
  );
}

export default BlogPage;
