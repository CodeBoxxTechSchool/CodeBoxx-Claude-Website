import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { trackLead } from '../trackLead.js';

// A page where CookieYes recorded `categories` and gtag records every call.
const page = (categories = { analytics: true, advertisement: true }) => {
  const calls = [];
  globalThis.window = {
    gtag: (...args) => calls.push(args),
    getCkyConsent: () => ({ categories }),
  };
  return calls;
};

const LEAD = [
  'event',
  'generate_lead',
  { send_to: 'G-7L7VBFGNTF', form_id: 'enroll', page_language: 'fr', program: 'fsd' },
];
const CONVERSION = ['event', 'conversion', { send_to: 'AW-16665523741/J94oCPfX3PYZEJ3s3oo-' }];

afterEach(() => {
  delete globalThis.window;
});

test('sends the GA4 lead event and the Ads conversion, each to its own tag', () => {
  const calls = page();
  trackLead({ formId: 'enroll', program: 'fsd', language: 'fr' });
  assert.deepEqual(calls, [LEAD, CONVERSION]);
});

test('leaves program out when the form has none', () => {
  const calls = page();
  trackLead({ formId: 'contact', language: 'en' });
  assert.deepEqual(calls[0][2], {
    send_to: 'G-7L7VBFGNTF',
    form_id: 'contact',
    page_language: 'en',
  });
});

test('sends only what the visitor consented to', () => {
  let calls = page({ analytics: true, advertisement: false });
  trackLead({ formId: 'enroll', program: 'fsd', language: 'fr' });
  assert.deepEqual(calls, [LEAD]);
  calls = page({ analytics: false, advertisement: true });
  trackLead({ formId: 'enroll', program: 'fsd', language: 'fr' });
  assert.deepEqual(calls, [CONVERSION]);
  calls = page({ analytics: false, advertisement: false });
  trackLead({ formId: 'enroll', program: 'fsd', language: 'fr' });
  assert.deepEqual(calls, []);
});

test('sends nothing without CookieYes', () => {
  const calls = page();
  delete globalThis.window.getCkyConsent;
  trackLead({ formId: 'pitch', language: 'en' });
  assert.deepEqual(calls, []);
});

test('does nothing without gtag (no consent yet), in or out of a browser', () => {
  assert.doesNotThrow(() => trackLead({ formId: 'pitch', language: 'en' }));
  globalThis.window = { getCkyConsent: () => ({ categories: { analytics: true } }) };
  assert.doesNotThrow(() => trackLead({ formId: 'pitch', language: 'en' }));
  assert.equal(globalThis.window.gtag, undefined);
});

test('never throws when gtag or CookieYes does', () => {
  page();
  globalThis.window.gtag = () => {
    throw new Error('blocked');
  };
  assert.doesNotThrow(() => trackLead({ formId: 'pitch', language: 'en' }));
  page();
  globalThis.window.getCkyConsent = () => {
    throw new Error('not ready');
  };
  assert.doesNotThrow(() => trackLead({ formId: 'pitch', language: 'en' }));
});
