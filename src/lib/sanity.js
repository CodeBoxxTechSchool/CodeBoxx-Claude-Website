import React from 'react';

const PROJECT_ID = import.meta.env.VITE_SANITY_PROJECT_ID;
const DATASET = import.meta.env.VITE_SANITY_DATASET || 'production';
const API_VERSION = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01';
const TOKEN = import.meta.env.VITE_SANITY_TOKEN;

export async function fetchCollection(type, groqTail = '') {
  if (!PROJECT_ID) throw new Error('VITE_SANITY_PROJECT_ID is not set.');
  const url = new URL(
    'https://' + PROJECT_ID + '.apicdn.sanity.io/v' + API_VERSION + '/data/query/' + DATASET
  );
  url.searchParams.set('query', '*[_type == "' + type + '"]' + groqTail);
  const res = await fetch(url, {
    headers: TOKEN ? { Authorization: 'Bearer ' + TOKEN } : {},
  });
  if (!res.ok) throw new Error('Sanity ' + res.status + ' on ' + type);
  const body = await res.json();
  return body.result || [];
}

// Sanity 'post' document -> the shape the Blog page renders.
function toPost(entry) {
  return {
    title: entry.title,
    category: entry.category,
    author: entry.author,
    date: (entry.publishedAt || entry.date || '').slice(0, 10),
    excerpt: entry.excerpt || entry.summary || '',
    url: entry.url || entry.canonicalUrl || '#',
  };
}

export function useSanityPosts(seed = []) {
  const [posts, setPosts] = React.useState(seed);
  React.useEffect(() => {
    let live = true;
    if (!PROJECT_ID) return undefined;
    fetchCollection('post', ' | order(publishedAt desc) [0...50]')
      .then((rows) => {
        if (live && rows.length) setPosts(rows.map(toPost));
      })
      .catch((err) => console.warn('[sanity]', err.message));
    return () => {
      live = false;
    };
  }, []);
  return posts;
}
