// Fallback for the homepage's CodeBlog teaser (latest 3 posts) — shown when
// VITE_SANITY_PROJECT_ID isn't set or the fetch fails. Same shape and seed slugs
// as SEED_POSTS in lib/blogSeed.js (this just needs fewer fields: no `content`/
// `url`, since the teaser only ever renders title/category/date/excerpt).
//
// Lives in its own file, not inlined in HomeIsland.jsx, because
// src/pages/index.astro's frontmatter needs it too — it calls
// fetchPostList(LATEST_POSTS) at build time (the same function Blog uses) so the
// resolved-or-seed array is already decided before it reaches the component,
// exactly like every other Sanity-backed prop HomeIsland receives.
export const LATEST_POSTS = [
  {
    title: 'Best Corporate AI Bootcamps',
    slug: 'best-corporate-ai-bootcamps',
    category: 'Technology News',
    date: '2026-01-14',
    excerpt:
      'Corporate AI training has become one of the fastest-growing investments in workforce development. Most organizations still struggle to find programs that go beyond awareness.',
  },
  {
    title: 'Unlock your own Future: Join CodeBoxx’s 4-Day Vibe Coding and Agentic AI Workshop',
    slug: 'unlock-your-own-future-join-codeboxx-s-4-day-vibe-coding-and-agentic-ai-workshop',
    category: 'Workshop',
    date: '2025-12-01',
    excerpt:
      'Four days, virtual or in the St. Petersburg classroom, ending with a product of yours in production or in your portfolio.',
  },
  {
    title: 'CodeBoxx Academy Expands Pathways to Prosperity Through New Community Referral Program',
    slug: 'codeboxx-academy-expands-pathways-to-prosperity-through-new-community-referral-program',
    category: 'CodeBoxx for Life',
    date: '2025-11-18',
    excerpt:
      'A referral partner program that lets individuals, businesses and organizations across Tampa Bay connect motivated learners to the Academy.',
  },
];
