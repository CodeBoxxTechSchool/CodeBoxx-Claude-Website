import React from 'react';

const BASE = import.meta.env.VITE_EMDASH_API_URL;
const PROJECT = import.meta.env.VITE_EMDASH_PROJECT;
const TOKEN = import.meta.env.VITE_EMDASH_TOKEN;

export async function fetchCollection(collection, params = {}) {
  if (!BASE) throw new Error('VITE_EMDASH_API_URL is not set.');
  const url = new URL(BASE + '/projects/' + PROJECT + '/collections/' + collection + '/entries');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url, {
    headers: TOKEN ? { Authorization: 'Bearer ' + TOKEN } : {},
  });
  if (!res.ok) throw new Error('EmDash ' + res.status + ' on ' + collection);
  const body = await res.json();
  return Array.isArray(body) ? body : body.data || body.entries || [];
}

// EmDash 'post' entry -> the shape the Blog page renders.
function toPost(entry) {
  const d = entry.fields || entry;
  return {
    title: d.title,
    category: d.category,
    author: d.author,
    date: (d.publishedAt || d.date || '').slice(0, 10),
    excerpt: d.excerpt || d.summary || '',
    url: d.url || d.canonicalUrl || '#',
  };
}

export function useEmdashPosts(seed = []) {
  const [posts, setPosts] = React.useState(seed);
  React.useEffect(() => {
    let live = true;
    if (!BASE) return undefined;
    fetchCollection('post', { sort: '-publishedAt', limit: '50' })
      .then(rows => { if (live && rows.length) setPosts(rows.map(toPost)); })
      .catch(err => console.warn('[emdash]', err.message));
    return () => { live = false; };
  }, []);
  return posts;
}
