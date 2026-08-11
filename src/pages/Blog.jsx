import React from 'react';
import { Button, Badge, Form } from 'react-bootstrap';
import { TopBar, Footer } from '../components/Chrome';
import { useSanityPosts } from '../lib/sanity';
import '../lib/image-slot.js';

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
    title: 'Unlock your own Future: Join CodeBoxx’s 4-Day Vibe Coding and Agentic AI Workshop',
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
    <section className="band-dark">
      <div className="wrap d-flex flex-column gap-4 align-items-start">
        <span className="pill">CodeBlog</span>
        <h1 className="band-title">Fresh news from the studio, the platform and the school.</h1>
        <p className="band-lede">
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
      <div className="wrap d-flex flex-column gap-5">
        <div className="d-flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={'category-pill' + (cat === c ? ' active' : '')}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid2">
          {list.map((p) => (
            <article key={p.title} className="panel post-card">
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
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="link-tag">
                    Read Post
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
              Load More
            </Button>
            <span className="load-more-count">
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
    <section className="sect sect-contact">
      <div className="wrap grid2">
        <div className="d-flex flex-column gap-3">
          <p className="eyebrow">SUBSCRIBE</p>
          <h2 className="h2">New posts, straight to your inbox.</h2>
          <p className="lede">
            Curriculum updates, workshop dates and technology notes. One email per post, no digests.
          </p>
        </div>
        <div className="panel">
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control id="blog-email" placeholder="name@company.com" />
          </Form.Group>
          <div className="rule" />
          <div className="form-actions">
            <span className="form-actions-note">Unsubscribe from any email.</span>
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
