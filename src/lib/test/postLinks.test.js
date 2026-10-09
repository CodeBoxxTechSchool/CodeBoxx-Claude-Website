import assert from 'node:assert/strict';
import { test } from 'node:test';
import { postTopic, relatedPosts, titleWords, TOPIC_PATHS } from '../postLinks.js';

// Real posts (titles, categories and dates from Sanity, Oct 2026), each with a French version
// unless `fr: false`.
const post = (slug, title, category, date, fr = true) => ({
  slug,
  title,
  category,
  date,
  titleFr: fr ? 'Titre' : '',
  contentFr: fr ? [{ _type: 'block' }] : [],
});
const POSTS = [
  post(
    'why-amazon-layoffs-signal-hope-for-employees-everywhere',
    'Why Amazon Layoffs Signal Hope for Employees Everywhere',
    'Technology News',
    '2025-11-20'
  ),
  post(
    'what-amazon-layoffs-really-mean-for-early-career-goers',
    'What Amazon Layoffs Really Mean For Early Career Goers',
    'Technology News',
    '2025-11-21'
  ),
  post(
    'amazon-layoffs-devastate-thousands-but-it-s-not-the-endgame-for-workers',
    'Amazon Layoffs Devastate Thousands, But It’s Not The Endgame For Workers',
    'Technology News',
    '2026-02-04'
  ),
  post(
    'the-age-of-vibe-coding-is-here',
    'The Age of Vibe Coding is Here',
    'Technology News',
    '2025-10-18'
  ),
  post(
    'how-vibe-coding-is-democratizing-the-field',
    'How Vibe-Coding Is Democratizing the Field',
    'Technology News',
    '2025-11-13'
  ),
  post(
    'the-fastest-way-to-become-a-job-ready-full-stack-developer',
    'The Fastest Way to Become a Job-Ready Full-Stack Developer',
    'CodeBoxx Curriculums',
    '2025-03-20'
  ),
  post(
    'coming-soon-at-codeboxx',
    'Coming soon at CodeBoxx',
    'CodeBoxx Curriculums',
    '2024-06-21',
    false
  ),
];

test('titleWords keeps the distinctive words, without accents, stopwords or a final s', () => {
  assert.deepEqual(
    [...titleWords('Why Amazon Layoffs Signal Hope for Employees Everywhere')],
    ['amazon', 'layoff', 'signal', 'hope', 'employee', 'everywhere']
  );
  assert.deepEqual([...titleWords('Développeurs à l’ère de l’IA')], ['developpeur', 'ere']);
});

test('relatedPosts puts the posts sharing the most title words first', () => {
  const [first, second] = relatedPosts(POSTS[0], POSTS);
  assert.deepEqual([first.slug, second.slug].sort(), [
    'amazon-layoffs-devastate-thousands-but-it-s-not-the-endgame-for-workers',
    'what-amazon-layoffs-really-mean-for-early-career-goers',
  ]);
  // Same score: the closer date wins.
  assert.equal(first.slug, 'what-amazon-layoffs-really-mean-for-early-career-goers');
});

test('relatedPosts never returns the post itself or a post without a French version', () => {
  for (const p of POSTS) {
    const related = relatedPosts(p, POSTS, 10);
    assert.ok(!related.includes(p));
    assert.ok(related.every((r) => r.slug !== 'coming-soon-at-codeboxx'));
  }
  assert.equal(relatedPosts(POSTS[3], POSTS).length, 3);
  assert.equal(relatedPosts(POSTS[3], POSTS)[0].slug, 'how-vibe-coding-is-democratizing-the-field');
});

test('postTopic sends company posts to Corporate Training, build/hire posts to Solutions', () => {
  assert.equal(postTopic('best-corporate-ai-bootcamps'), 'corporate');
  assert.equal(postTopic('ai-native-code-migration'), 'solutions');
  assert.equal(postTopic('the-age-of-vibe-coding-is-here'), 'academy');
  assert.deepEqual(Object.keys(TOPIC_PATHS).sort(), ['academy', 'corporate', 'solutions']);
});
