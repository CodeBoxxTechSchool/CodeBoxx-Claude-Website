import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { enableConsentedTags } from '../consentedTags.js';

// A script element: `type` is the attribute as written in the page (null when absent).
const script = (src, category, { async = false, type = 'text/plain' } = {}) => {
  const attributes = { 'data-cookieyes': category };
  const el = {
    src,
    async,
    type,
    getAttribute: (name) => attributes[name] ?? null,
    setAttribute: (name, value) => (attributes[name] = value),
    replaceWith: (other) => head.splice(head.indexOf(el), 1, other),
  };
  return el;
};

// The tags as Tracking.astro writes them.
const TAGS = [
  ['https://www.googletagmanager.com/gtag/js?id=G-7L7VBFGNTF', 'cookieyes-analytics', true],
  ['https://codeboxx.ai/assets/js/google-analytics.js', 'cookieyes-analytics', false],
  ['https://www.googletagmanager.com/gtag/js?id=AW-11226981671', 'cookieyes-advertisement', true],
  ['https://codeboxx.ai/assets/js/google-ads.js', 'cookieyes-advertisement', false],
  ['https://codeboxx.ai/assets/js/linkedin-insight.js', 'cookieyes-advertisement', false],
];

let head;
let created;

// A page holding `tags`, where CookieYes recorded `categories`.
const page = (categories, tags = TAGS.map(([src, cat, async]) => script(src, cat, { async }))) => {
  head = [...tags];
  created = 0;
  globalThis.document = {
    querySelectorAll: (selector) => {
      assert.equal(selector, 'script[type="text/plain"][data-cookieyes]');
      return head.filter((el) => el.type === 'text/plain' && el.getAttribute('data-cookieyes'));
    },
    createElement: () => {
      created += 1;
      return script('', null, { async: true, type: null });
    },
  };
  globalThis.window = { getCkyConsent: () => ({ categories }) };
};

// What is in the page: src, whether it runs (no text/plain type), async, category.
const state = () =>
  head.map((el) => [el.src, el.type !== 'text/plain', el.async, el.getAttribute('data-cookieyes')]);
const running = () => state().filter(([, runs]) => runs);

afterEach(() => {
  delete globalThis.document;
  delete globalThis.window;
});

test('switches on every tag, in place and in order, once both categories are accepted', () => {
  page({ necessary: true, analytics: true, advertisement: true });
  enableConsentedTags();
  assert.deepEqual(
    state(),
    TAGS.map(([src, cat, async]) => [src, true, async, cat])
  );
});

test('switches on only the accepted category', () => {
  page({ analytics: true, advertisement: false });
  enableConsentedTags();
  assert.deepEqual(running(), [
    [TAGS[0][0], true, true, 'cookieyes-analytics'],
    [TAGS[1][0], true, false, 'cookieyes-analytics'],
  ]);
  page({ analytics: false, advertisement: true });
  enableConsentedTags();
  assert.deepEqual(
    running().map(([src]) => src),
    TAGS.slice(2).map(([src]) => src)
  );
});

test('switches on nothing without consent', () => {
  page({ necessary: true, analytics: false, advertisement: false });
  enableConsentedTags();
  assert.deepEqual(running(), []);
  page({});
  enableConsentedTags();
  assert.deepEqual(running(), []);
});

test('switches on nothing without CookieYes', () => {
  page({ analytics: true, advertisement: true });
  delete globalThis.window.getCkyConsent;
  enableConsentedTags();
  assert.deepEqual(running(), []);
});

test('does nothing when CookieYes already took the tags out of the page', () => {
  page({ analytics: true, advertisement: true }, []);
  enableConsentedTags();
  assert.equal(created, 0);
});

test('leaves a tag CookieYes already switched on alone', () => {
  const restored = script(TAGS[3][0], TAGS[3][1], { type: 'text/javascript' });
  page({ analytics: true, advertisement: true }, [restored]);
  enableConsentedTags();
  assert.equal(head[0], restored);
  assert.equal(created, 0);
});

test('running it twice switches each tag on only once', () => {
  page({ analytics: true, advertisement: true });
  enableConsentedTags();
  const first = [...head];
  enableConsentedTags();
  assert.equal(created, TAGS.length);
  assert.ok(head.every((el, i) => el === first[i]));
});

test('switches on the rest when a category is accepted later on the same page', () => {
  const categories = { analytics: true, advertisement: false };
  page(categories);
  enableConsentedTags();
  categories.advertisement = true;
  enableConsentedTags();
  assert.equal(created, TAGS.length);
  assert.equal(running().length, TAGS.length);
});

test('never throws when CookieYes or the page does', () => {
  page({ analytics: true });
  globalThis.window.getCkyConsent = () => {
    throw new Error('not ready');
  };
  assert.doesNotThrow(() => enableConsentedTags());
  page({ analytics: true });
  globalThis.document.createElement = () => {
    throw new Error('blocked');
  };
  assert.doesNotThrow(() => enableConsentedTags());
  delete globalThis.document;
  assert.doesNotThrow(() => enableConsentedTags());
});

test('runs from its own source alone, as Tracking.astro inlines it', () => {
  page({ analytics: true, advertisement: true });
  new Function(`(${enableConsentedTags})()`)();
  assert.equal(running().length, TAGS.length);
});
