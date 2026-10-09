// The links at the end of a blog post (PostFooterLinks.astro): the CodeBoxx page the post
// leads to, and the posts related to it. Both pick from the English title and slug, so a post
// and its French twin link to the same pages. No import.meta.env: plain Node tests import it.
import { isTranslated } from './postLanguage.js';

// The service page a post leads to, by slug: posts about teams and companies go to Corporate
// Training, posts about building software or hiring developers to Solutions, every other post
// to the Academy. A new post goes to the Academy until its slug is added here.
const CORPORATE = new Set([
  'best-ai-workforce-upskilling-companies',
  'top-ai-native-developer-training-programs-for-businesses',
  'best-corporate-ai-bootcamps',
  'best-ai-first-coding-academies-for-corporate-training-in-north-america',
  'is-ai-exposing-a-leadership-gap-here-s-what-it-means-for-your-organization',
  'is-ai-exposing-a-leadership-gap-here-s-what-that-means-for-your-organization',
  'ai-agents-are-breaking-the-foundations-of-software-engineering-and-most-enterprises-aren-t-ready',
  'the-ai-workforce-stack-how-companies-will-structure-teams-when-ai-becomes-an-operational-unit',
  'how-companies-are-structuring-teams-when-ai-becomes-an-operational-unit',
  'the-end-of-the-coordination-layer-how-ai-agents-are-reshaping-company-structures',
  'what-happens-when-your-new-teammate-isn-t-human',
  'executives-advocate-for-reshaping-of-workforce-following-job-cuts-from-ai',
  'there-is-no-such-thing-as-a-non-technical-worker-anymore',
  'the-challenges-and-solutions-of-tech-training-for-tampa-bay-corporations-how-codeboxx-academy-is-le',
]);
const SOLUTIONS = new Set([
  'best-onshore-ai-development-companies-in-the-us',
  'ai-native-code-migration',
  'where-to-find-developers-other-than-upwork-or-toptal',
  'interview-questions-when-hiring-an-ai-specialist',
  'interview-questions-when-hiring-a-full-stack-developer',
  'the-hidden-problem-with-vibe-coding-everyone-can-build-few-can-finish',
]);

// 'academy', 'corporate' or 'solutions'; the page is TOPIC_PATHS[topic].
export function postTopic(slug) {
  if (CORPORATE.has(slug)) return 'corporate';
  if (SOLUTIONS.has(slug)) return 'solutions';
  return 'academy';
}

export const TOPIC_PATHS = {
  academy: '/academy',
  corporate: '/corporate-training',
  solutions: '/solutions',
};

// Words too common in these titles to say two posts are about the same thing.
const STOPWORDS = new Set(
  (
    'the and for with without from are was been its this that these those your you our they ' +
    'their how what why when where which who here there than then not just more most new next ' +
    'now can will into about over isn aren won don does every everyone few meet'
  ).split(' ')
);

// A title's distinctive words: lower case, no accents, 3 letters or more, a final "s" dropped
// ("layoffs" and "layoff" match), stopwords left out.
export function titleWords(title) {
  const words = (title || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w))
    .map((w) => (w.length > 4 && w.endsWith('s') ? w.slice(0, -1) : w));
  return new Set(words);
}

const days = (d) => (d ? Date.parse(d + 'T12:00:00Z') / 86400000 : 0);

// The `count` posts most related to `post`, out of `posts` (both in English, from toPost):
// two points per title word they share, one for the same category, then the closest date.
// Only posts with a French version, so the French page can link to the same ones; that also
// leaves out the placeholder posts.
export function relatedPosts(post, posts, count = 3) {
  const words = titleWords(post.title);
  const at = days(post.date);
  return posts
    .filter((p) => p.slug !== post.slug && isTranslated(p))
    .map((p) => {
      let shared = 0;
      for (const w of titleWords(p.title)) if (words.has(w)) shared++;
      const score = 2 * shared + (p.category && p.category === post.category ? 1 : 0);
      return { p, score, gap: Math.abs(days(p.date) - at) };
    })
    .sort((a, b) => b.score - a.score || a.gap - b.gap || a.p.slug.localeCompare(b.p.slug))
    .slice(0, count)
    .map((r) => r.p);
}
