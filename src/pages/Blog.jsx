import React from 'react';
import { Button, Badge, Input } from '../design-system';
import { TopBar, Footer } from '../components/Chrome';
import { useSanityPosts } from '../lib/sanity';
import '../lib/image-slot.js';

const PILL = {
  width: 'fit-content',
  borderRadius: 9999,
  boxShadow: 'inset 0 0 0 1.5px var(--blue-500)',
  padding: '8px 16px',
  display: 'inline-flex',
  fontWeight: 700,
  fontSize: 12,
  lineHeight: '100%',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  color: 'var(--neutral-0)',
  whiteSpace: 'nowrap',
  marginBottom: 10,
};

const CATEGORIES = [
  'All Posts',
  'CodeBoxx for Life',
  'CodeBoxx Curriculums',
  'Technology News',
  'Workshop',
];

// Sourced from the current CodeBlog. Replaced by the Sanity `post` document type at runtime.
const SEED_POSTS = [
  {
    title: 'Best Corporate AI Bootcamps',
    category: 'Technology News',
    author: 'Codeboxx Technology',
    date: '2026-01-14',
    excerpt:
      'Corporate AI training has become one of the fastest-growing investments in workforce development. Most organizations still struggle to find programs that go beyond awareness and actually change how teams work.',
    url: 'https://academy.codeboxx.com/post/best-corporate-ai-bootcamps',
  },
  {
    title: 'Unlock your own Future: Join CodeBoxx\u2019s 4-Day Vibe Coding and Agentic AI Workshop',
    category: 'Workshop',
    author: 'Codeboxx Technology',
    date: '2025-12-01',
    excerpt:
      'Four days, virtual or in the St. Petersburg classroom, ending with a product of yours in production or in your portfolio.',
    url: 'https://academy.codeboxx.com/post/unlock-your-own-future-join-codeboxx-s-4-day-vibe-coding-and-agentic-ai-workshop',
  },
  {
    title: 'CodeBoxx Academy Expands Pathways to Prosperity Through New Community Referral Program',
    category: 'CodeBoxx for Life',
    author: 'Codeboxx Technology',
    date: '2025-11-18',
    excerpt:
      'A referral partner program that lets individuals, businesses and organizations across Tampa Bay connect motivated learners to the Academy.',
    url: 'https://academy.codeboxx.com/post/codeboxx-academy-expands-pathways-to-prosperity-through-new-community-referral-program',
  },
  {
    title: 'CodeBoxx Celebrates New Learning Opportunities with USF CTPE!',
    category: 'CodeBoxx Curriculums',
    author: 'Marc Litalien',
    date: '2025-10-22',
    excerpt:
      'The University of South Florida Office of Corporate Training and Professional Education launches a new course offering for professionals investing in their growth.',
    url: 'https://academy.codeboxx.com/post/codeboxx-celebrates-new-learning-opportunities-with-usf-ctpe',
  },
];

const fmt = (d) =>
  new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

function Band() {
  return (
    <section style={{ background: 'var(--navy-500)', padding: '80px 0' }}>
      <div
        className="wrap"
        style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}
      >
        <span style={PILL}>CodeBlog</span>
        <h1
          style={{
            margin: 0,
            fontSize: 48,
            fontWeight: 900,
            lineHeight: '100%',
            color: 'var(--neutral-0)',
            maxWidth: 780,
            textWrap: 'pretty',
          }}
        >
          Fresh news from the studio, the platform and the school.
        </h1>
        <p
          style={{
            fontSize: 14,
            lineHeight: '20px',
            color: 'rgba(255,255,255,0.72)',
            margin: 0,
            maxWidth: 560,
          }}
        >
          Curriculum notes, technology news, workshops and graduate stories. Every post is written
          and published in Sanity.
        </p>
      </div>
    </section>
  );
}

const PAGE_SIZE = 2;

function Posts() {
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
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                appearance: 'none',
                cursor: 'pointer',
                border: 0,
                borderRadius: 9999,
                padding: '8px 16px',
                fontFamily: 'inherit',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                background: cat === c ? 'var(--blue-500)' : 'transparent',
                color: cat === c ? 'var(--neutral-0)' : 'var(--ui-slate-500)',
                boxShadow: cat === c ? 'none' : 'inset 0 0 0 1px var(--ui-slate-200)',
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid2">
          {list.map((p) => (
            <article
              key={p.title}
              className="panel"
              style={{ gap: 16, padding: 0, overflow: 'hidden' }}
            >
              <image-slot
                id={
                  'post-' +
                  p.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .slice(0, 40)
                }
                shape="rect"
                fit="cover"
                placeholder="Cover image"
                style={{ width: '100%', height: 200 }}
              ></image-slot>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  padding: '0 24px 24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <Badge variant="brand">{p.category}</Badge>
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--ui-slate-400)' }}>
                    {fmt(p.date)}
                  </span>
                </div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 700,
                    lineHeight: '124%',
                    textWrap: 'pretty',
                  }}
                >
                  {p.title}
                </h2>
                <p className="pbody">{p.excerpt}</p>
                <div className="rule" />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ui-slate-500)' }}>
                    {p.author}
                  </span>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                    }}
                  >
                    Read Post
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        {more ? (
          <div
            ref={sentinel}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
          >
            <Button variant="secondary" size="lg" onClick={() => setShown((s) => s + PAGE_SIZE)}>
              Load More
            </Button>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--ui-slate-400)' }}>
              {'Showing ' + list.length + ' of ' + all.length}
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Subscribe() {
  return (
    <section
      className="sect"
      style={{ background: 'var(--neutral-0)', boxShadow: 'inset 0 1px 0 0 var(--ui-slate-200)' }}
    >
      <div className="wrap grid2" style={{ alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p className="eyebrow">SUBSCRIBE</p>
          <h2 className="h2">New posts, straight to your inbox.</h2>
          <p className="lede">
            Curriculum updates, workshop dates and technology notes. One email per post, no digests.
          </p>
        </div>
        <div className="panel">
          <Input
            id="blog-email"
            label="Email"
            placeholder="name@company.com"
            style={{ width: '100%' }}
          />
          <div className="rule" />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ui-slate-400)' }}>
              Unsubscribe from any email.
            </span>
            <Button size="lg">Subscribe</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogPage() {
  return (
    <div id="top">
      <TopBar
        onCodi={() => {
          window.location.href = '/#contact';
        }}
      />
      <Band />
      <Posts />
      <Subscribe />
      <Footer />
    </div>
  );
}

export default BlogPage;
