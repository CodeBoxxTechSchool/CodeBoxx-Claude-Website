import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { Badge } from 'react-bootstrap';
import { TopBar, Footer } from '../components/Chrome';
import { useSanityPost } from '../lib/sanity';
import { SEED_POSTS } from './Blog';

const fmt = (d) =>
  new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

// Maps Portable Text block/list/mark types onto this site's existing typography
// classes, so a post's rich content reads like the rest of the site rather than
// @portabletext/react's unstyled defaults.
const portableTextComponents = {
  block: {
    normal: ({ children }) => <p className="pbody">{children}</p>,
    h1: ({ children }) => <h2 className="h2">{children}</h2>,
    h2: ({ children }) => <h2 className="h2">{children}</h2>,
    h3: ({ children }) => <h3 className="ptitle">{children}</h3>,
    h4: ({ children }) => <h3 className="ptitle">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="post-blockquote">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="post-list">{children}</ul>,
    number: ({ children }) => <ol className="post-list">{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

function NotFound() {
  return (
    <div id="top">
      <TopBar
        onCodi={() => {
          window.location.href = '/#contact';
        }}
      />
      <section className="sect">
        <div className="wrap d-flex flex-column gap-3 align-items-start">
          <h1 className="h2">Post not found</h1>
          <p className="pbody">This post may have been moved or removed.</p>
          <Link to="/blog" className="link-tag">
            Back to CodeBlog
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function BlogPost() {
  const { slug } = useParams();
  const seedMatch = SEED_POSTS.find((p) => p.slug === slug) || null;
  const post = useSanityPost(slug, seedMatch);

  if (!post) return <NotFound />;

  return (
    <div id="top">
      <TopBar
        onCodi={() => {
          window.location.href = '/#contact';
        }}
      />
      <section className="band-dark">
        <div className="wrap d-flex flex-column gap-4 align-items-start">
          {post.category ? <Badge bg="brand">{post.category}</Badge> : null}
          <h1 className="band-title">{post.title}</h1>
          <div className="d-flex gap-3">
            <span className="band-lede">{post.author}</span>
            {post.date ? <span className="band-lede">{fmt(post.date)}</span> : null}
          </div>
        </div>
      </section>
      <section className="sect">
        <div className="wrap post-article">
          {post.content ? (
            <PortableText value={post.content} components={portableTextComponents} />
          ) : (
            <p className="pbody">{post.excerpt}</p>
          )}
          {post.url ? (
            <div className="post-external-ref">
              <div className="rule" />
              <a href={post.url} target="_blank" rel="noopener noreferrer" className="link-tag">
                External Reference
              </a>
            </div>
          ) : null}
          <Link to="/blog" className="link-tag mt-40">
            Back to CodeBlog
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default BlogPost;
