// Fallback posts shown when VITE_SANITY_PROJECT_ID isn't set — sourced from the
// current CodeBlog. `slug` reuses each seed post's old external URL's trailing
// path segment for a stable seed-only identity; real Sanity posts get their slug
// from the `slug` field's own `source: 'title'`, with no reason to match these.
//
// Used by the Astro blog pages (src/pages/blog/, src/pages/fr/blogue/).
export const SEED_POSTS = [
  {
    title: 'Best Corporate AI Bootcamps',
    slug: 'best-corporate-ai-bootcamps',
    category: 'Technology News',
    author: 'Codeboxx Technology',
    date: '2026-01-14',
    excerpt:
      'Corporate AI training has become one of the fastest-growing investments in workforce development. Most organizations still struggle to find programs that go beyond awareness and actually change how teams work.',
    content: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Corporate AI training has become one of the fastest-growing investments in workforce development. Most organizations still struggle to find programs that go beyond awareness and actually change how teams work.',
          },
        ],
      },
    ],
    url: 'https://academy.codeboxx.com/post/best-corporate-ai-bootcamps',
  },
  {
    title: 'Unlock your own Future: Join CodeBoxx’s 4-Day Vibe Coding and Agentic AI Workshop',
    slug: 'unlock-your-own-future-join-codeboxx-s-4-day-vibe-coding-and-agentic-ai-workshop',
    category: 'Workshop',
    author: 'Codeboxx Technology',
    date: '2025-12-01',
    excerpt:
      'Four days, virtual or in the St. Petersburg classroom, ending with a product of yours in production or in your portfolio.',
    content: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Four days, virtual or in the St. Petersburg classroom, ending with a product of yours in production or in your portfolio.',
          },
        ],
      },
    ],
    url: 'https://academy.codeboxx.com/post/unlock-your-own-future-join-codeboxx-s-4-day-vibe-coding-and-agentic-ai-workshop',
  },
  {
    title: 'CodeBoxx Academy Expands Pathways to Prosperity Through New Community Referral Program',
    slug: 'codeboxx-academy-expands-pathways-to-prosperity-through-new-community-referral-program',
    category: 'CodeBoxx for Life',
    author: 'Codeboxx Technology',
    date: '2025-11-18',
    excerpt:
      'A referral partner program that lets individuals, businesses and organizations across Tampa Bay connect motivated learners to the Academy.',
    content: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'A referral partner program that lets individuals, businesses and organizations across Tampa Bay connect motivated learners to the Academy.',
          },
        ],
      },
    ],
    url: 'https://academy.codeboxx.com/post/codeboxx-academy-expands-pathways-to-prosperity-through-new-community-referral-program',
  },
  {
    title: 'CodeBoxx Celebrates New Learning Opportunities with USF CTPE!',
    slug: 'codeboxx-celebrates-new-learning-opportunities-with-usf-ctpe',
    category: 'CodeBoxx Curriculums',
    author: 'Marc Litalien',
    date: '2025-10-22',
    excerpt:
      'The University of South Florida Office of Corporate Training and Professional Education launches a new course offering for professionals investing in their growth.',
    content: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'The University of South Florida Office of Corporate Training and Professional Education launches a new course offering for professionals investing in their growth.',
          },
        ],
      },
    ],
    url: 'https://academy.codeboxx.com/post/codeboxx-celebrates-new-learning-opportunities-with-usf-ctpe',
  },
];
