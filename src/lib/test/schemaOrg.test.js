import assert from 'node:assert/strict';
import { test } from 'node:test';
import { blogPostingSchema, LOGO_URL, postAuthor } from '../schemaOrg.js';

const CODEBOXX = { '@type': 'Organization', name: 'CodeBoxx', url: 'https://codeboxx.ai/' };

test('postAuthor maps any CodeBoxx spelling, or no author, to the organization', () => {
  for (const name of ['CodeBoxx Technology', 'Codeboxx Technology', ' codeboxx ', '', null]) {
    assert.deepEqual(postAuthor(name), CODEBOXX, String(name));
  }
});

test('postAuthor maps anyone else to a Person', () => {
  assert.deepEqual(postAuthor(' Cédéric Noël '), { '@type': 'Person', name: 'Cédéric Noël' });
});

const POST = {
  title: 'AI Native Code Migration',
  excerpt: 'Excerpt',
  author: 'Nicolas Genest',
  date: '2026-07-16',
  updatedAt: '2026-09-30T15:45:11Z',
};
const PAGE_URL = 'https://codeboxx.ai/blog/ai-native-code-migration/';

test('blogPostingSchema points the page, url and logo at absolute URLs', () => {
  const schema = blogPostingSchema({ post: POST, url: PAGE_URL, image: 'img', inLanguage: 'en' });
  assert.equal(schema.url, PAGE_URL);
  assert.deepEqual(schema.mainEntityOfPage, { '@type': 'WebPage', '@id': PAGE_URL });
  assert.equal(schema.inLanguage, 'en');
  assert.deepEqual(schema.author, { '@type': 'Person', name: 'Nicolas Genest' });
  assert.deepEqual(schema.publisher, {
    ...CODEBOXX,
    logo: { '@type': 'ImageObject', url: LOGO_URL },
  });
  assert.equal(LOGO_URL, 'https://codeboxx.ai/icon-192.png');
  assert.equal(schema.datePublished, '2026-07-16');
  assert.equal(schema.dateModified, '2026-09-30T15:45:11Z');
});

test('blogPostingSchema falls back to datePublished without an edit date (seed posts)', () => {
  const { updatedAt, ...seed } = POST;
  const schema = blogPostingSchema({ post: seed, url: PAGE_URL, image: 'img', inLanguage: 'en' });
  assert.equal(schema.dateModified, '2026-07-16');
});
