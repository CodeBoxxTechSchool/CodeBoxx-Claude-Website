export default {
  seo: {
    title: 'CodeBlog — News, Curriculum Notes & Workshops',
    description:
      'Curriculum notes, technology news, workshops and graduate stories from the CodeBoxx studio, platform and academy.',
  },
  band: {
    pill: 'CodeBlog',
    title: 'Fresh news from the studio, the platform and the school.',
    lede: 'Curriculum notes, technology news, workshops and graduate stories. Every post is written and published in Sanity.',
  },
  // Keys match the canonical English category values stored on Sanity `post`
  // documents (and CATEGORY_KEYS in Blog.jsx) — filtering matches on those values,
  // this is display-only, so switching language can't break the category filter.
  categories: {
    'All Posts': 'All Posts',
    'CodeBoxx for Life': 'CodeBoxx for Life',
    'CodeBoxx Curriculums': 'CodeBoxx Curriculums',
    'Technology News': 'Technology News',
    Workshop: 'Workshop',
  },
  coverImage: 'Cover image',
  readPost: 'Read Post',
  loadMore: 'Load More',
  showingOf: 'Showing {{shown}} of {{total}}',
  subscribe: {
    eyebrow: 'SUBSCRIBE',
    title: 'New posts, straight to your inbox.',
    lede: 'Curriculum updates, workshop dates and technology notes. One email per post, no digests.',
    emailLabel: 'Email',
    emailPlaceholder: 'name@company.com',
    unsubscribeNote: 'Unsubscribe from any email.',
    submit: 'Subscribe',
  },
  post: {
    notFoundTitle: 'Post not found',
    notFoundBody: 'This post may have been moved or removed.',
    backToCodeBlog: 'Back to CodeBlog',
    externalReference: 'External Reference',
  },
};
