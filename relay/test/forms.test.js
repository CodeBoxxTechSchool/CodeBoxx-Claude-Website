import assert from 'node:assert/strict';
import { test } from 'node:test';
import { toContact, toPitch, validateContact, validatePitch } from '../forms.js';
import { CONTACT, PITCH } from './fixtures.js';

const ID = '3f2b8c1e-9a4d-4e6f-8b7a-1c2d3e4f5a6b';
const NOW = Date.parse('2026-09-29T12:00:00Z');
const contactErrors = (changes) => validateContact({ ...CONTACT, ...changes }).errors ?? [];
const pitchErrors = (changes) => validatePitch({ ...PITCH, ...changes }).errors ?? [];

test('maps a valid contact submission to a form submission', () => {
  const result = validateContact({ ...CONTACT, extra: 'ignored' });
  assert.equal(result.ok, true);
  assert.deepEqual(toContact(result.data, NOW), {
    submissionId: ID,
    form: 'contact',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    phone: '+1 (555) 555-0100',
    language: 'fr',
    consent: true,
    consentAt: '2026-09-29T12:00:00.000Z',
    pageUrl: 'https://codeboxx.com/fr/#contact',
    division: 'solutions',
    isMobilePhone: false,
    country: 'CA',
    message: 'We need a team.',
  });
  const bare = toContact(validateContact({ ...CONTACT, message: '  ', pageUrl: undefined }).data);
  assert.equal('message' in bare || 'pageUrl' in bare, false);
  assert.equal(toContact(validateContact({ ...CONTACT, mobile: 'yes' }).data).isMobilePhone, true);
});

test('maps a valid pitch to a Ventures form submission', () => {
  const result = validatePitch(PITCH);
  assert.equal(result.ok, true);
  assert.deepEqual(toPitch(result.data, NOW), {
    submissionId: ID,
    form: 'pitch',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    phone: '555-555-0100',
    language: 'en',
    consent: true,
    consentAt: '2026-09-29T12:00:00.000Z',
    pageUrl: 'https://codeboxx.com/ventures/',
    division: 'ventures',
    message: 'An app for engines.',
    extra: { projectType: 'web-app' },
  });
  const bare = toPitch(validatePitch({ ...PITCH, projectType: '', description: undefined }).data);
  assert.equal('extra' in bare || 'message' in bare, false);
});

test('requires the fields each form asks for, consent and a submission ID', () => {
  for (const field of Object.keys(CONTACT).filter((f) => !['message', 'pageUrl'].includes(f))) {
    assert.deepEqual(contactErrors({ [field]: undefined }), [field], field);
  }
  for (const field of ['first', 'last', 'email', 'phone', 'lang', 'consent', 'submissionId']) {
    assert.deepEqual(pitchErrors({ [field]: undefined }), [field], field);
    assert.ok(pitchErrors({ [field]: '  ' }).includes(field), field);
  }
  assert.deepEqual(contactErrors({ consent: 'true' }), ['consent']);
  assert.deepEqual(pitchErrors({ consent: false }), ['consent']);
  for (const submissionId of ['nope', 42, '00000000-0000-0000-0000-000000000000']) {
    assert.deepEqual(pitchErrors({ submissionId }), ['submissionId'], String(submissionId));
  }
});

test('rejects values outside the choices', () => {
  assert.deepEqual(contactErrors({ division: 'Ventures' }), ['division']);
  assert.deepEqual(contactErrors({ mobile: 'maybe' }), ['mobile']);
  assert.deepEqual(contactErrors({ lang: 'de' }), ['lang']);
  assert.deepEqual(contactErrors({ country: 'ZZ' }), ['country']);
  assert.deepEqual(contactErrors({ country: 'CAN' }), ['country']);
  assert.deepEqual(contactErrors({ message: ['hi'] }), ['message']);
  assert.deepEqual(pitchErrors({ projectType: 'Web App' }), ['projectType']);
  assert.deepEqual(pitchErrors({ lang: 'es' }), ['lang']);
});

test('checks email, phone and page URL', () => {
  for (const email of ['ada', 'ada@example', `${'a'.repeat(250)}@ex.com`]) {
    assert.deepEqual(contactErrors({ email }), ['email'], email);
  }
  for (const phone of ['555-010', '1234567890123456', '555 CALL NOW', '555-555-0100 ext 2']) {
    assert.deepEqual(pitchErrors({ phone }), ['phone'], phone);
  }
  assert.deepEqual(pitchErrors({ phone: '+44 20.7946.0958' }), []);
  for (const pageUrl of [
    '/ventures',
    'javascript:alert(1)',
    42,
    `https://x.com/${'a'.repeat(490)}`,
  ]) {
    assert.deepEqual(pitchErrors({ pageUrl }), ['pageUrl'], String(pageUrl).slice(0, 20));
  }
});

test('enforces maximum lengths', () => {
  assert.deepEqual(contactErrors({ message: 'a'.repeat(2000) }), []);
  assert.deepEqual(contactErrors({ message: 'a'.repeat(2001) }), ['message']);
  assert.deepEqual(pitchErrors({ description: 'a'.repeat(2001) }), ['description']);
  assert.deepEqual(pitchErrors({ first: 'a'.repeat(101) }), ['first']);
  assert.deepEqual(pitchErrors({ last: 'a'.repeat(101) }), ['last']);
});
