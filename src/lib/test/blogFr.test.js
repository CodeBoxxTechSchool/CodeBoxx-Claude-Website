import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isTranslated, localizePost, toPostCard } from '../postLanguage.js';
import { frTypographyBlocks } from '../frTypography.js';
import { makeFilter, makeSerialize } from '../sitemap.js';

const block = (key, text, extra = {}) => ({
  _key: key,
  _type: 'block',
  style: 'normal',
  markDefs: [],
  children: [{ _key: key + 's', _type: 'span', marks: [], text }],
  ...extra,
});
const post = {
  slug: 'the-age-of-vibe-coding-is-here',
  title: 'The Age of Vibe Coding is Here',
  excerpt: 'English excerpt',
  content: [block('a', 'English body')],
  titleFr: 'L’ère du vibe coding est arrivée',
  excerptFr: 'Résumé en français',
  contentFr: [block('a', 'Corps en français')],
};
const english = { ...post, titleFr: '', excerptFr: '', contentFr: null };

test('a post is translated once it has a French title and body', () => {
  assert.equal(isTranslated(post), true);
  assert.equal(isTranslated(english), false);
  assert.equal(isTranslated({ ...post, contentFr: [] }), false);
  assert.equal(isTranslated({ ...post, titleFr: '' }), false);
});

test('localizePost gives the French title, excerpt and body, else the English', () => {
  const fr = localizePost(post, 'fr');
  assert.equal(fr.title, post.titleFr);
  assert.equal(fr.excerpt, post.excerptFr);
  assert.equal(fr.content, post.contentFr);
  assert.equal(fr.slug, post.slug);
  assert.equal(localizePost(post, 'en'), post);
  assert.equal(localizePost(english, 'fr'), english);
  assert.equal(localizePost({ ...post, excerptFr: '' }, 'fr').excerpt, post.excerpt);
});

test('cards are French on French pages, English otherwise (also as a .map callback)', () => {
  assert.equal(toPostCard(post, 'fr').title, post.titleFr);
  assert.equal(toPostCard(post).title, post.title);
  assert.deepEqual(
    [post].map(toPostCard).map((c) => c.title),
    [post.title]
  );
  assert.equal('content' in toPostCard(post, 'fr'), false);
});

test('French typography applies to span text and table cells only', () => {
  const blocks = frTypographyBlocks([
    block('a', 'Pourquoi? Voici: 40% et 12000 $.', {
      markDefs: [{ _key: 'l1', _type: 'link', href: 'https://example.com/a:b' }],
    }),
    {
      _key: 't',
      _type: 'table',
      rows: [{ _key: 'r', _type: 'tableRow', cells: ['Prix: 9 800$'] }],
    },
    { _key: 'v', _type: 'videoEmbed', url: 'https://youtu.be/x?t=1' },
  ]);
  assert.equal(blocks[0].children[0].text, 'Pourquoi ? Voici : 40 % et 12000 $.');
  assert.equal(blocks[0].markDefs[0].href, 'https://example.com/a:b');
  assert.equal(blocks[1].rows[0].cells[0], 'Prix : 9 800 $');
  assert.deepEqual(blocks[2], { _key: 'v', _type: 'videoEmbed', url: 'https://youtu.be/x?t=1' });
});

test('sitemap: an untranslated post has no French page listed and no hreflang pair', () => {
  const translated = new Set(['translated-post']);
  const filter = makeFilter(translated);
  const site = 'https://codeboxx.ai';
  assert.equal(filter(site + '/fr/blogue/translated-post/'), true);
  assert.equal(filter(site + '/fr/blogue/english-only/'), false);
  assert.equal(filter(site + '/blog/english-only/'), true);
  assert.equal(filter(site + '/fr/blogue/'), true);
  assert.equal(filter(site + '/404/'), false);
  const serialize = makeSerialize(new Map(), translated);
  assert.equal(serialize({ url: site + '/blog/translated-post/' }).links.length, 3);
  assert.equal(serialize({ url: site + '/blog/english-only/' }).links, undefined);
  assert.equal(serialize({ url: site + '/academy/' }).links.length, 3);
});

test('sitemap: with the translation status unknown, everything stays listed and paired', () => {
  const filter = makeFilter(null);
  assert.equal(filter('https://codeboxx.ai/fr/blogue/any-post/'), true);
  assert.equal(
    makeSerialize(new Map(), null)({ url: 'https://codeboxx.ai/blog/any-post/' }).links.length,
    3
  );
});
