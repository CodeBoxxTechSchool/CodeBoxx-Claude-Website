import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isHoneypot, toLead, validateEnroll } from '../enroll.js';
import { VALID } from './fixtures.js';

const now = new Date('2026-09-28T12:00:00Z');
const errorsFor = (changes) => validateEnroll({ ...VALID, ...changes }, now).errors ?? [];

test('maps a valid submission to a LeadCreateDto', () => {
  const result = validateEnroll({ ...VALID, extra: 'ignored' }, now);
  assert.equal(result.ok, true);
  assert.deepEqual(toLead(result.data), {
    Email: 'ada@example.com',
    FirstName: 'Ada',
    LastName: 'Lovelace',
    BirthDate: '1990-02-28',
    Phone: '+15555550100',
    IsMobilePhone: true,
    Language: 'French',
    PreferredCommunicationMethod: 'SMS',
    Address: '1 Main St',
    City: 'Québec',
    State: 'QC',
    Country: 'CA',
    PostalCode: 'G1A 1A1',
    PreferredProgram: 43,
    SendEmails: true,
    ReferralChannel: 'Referred By a Friend',
  });
});

test('maps each choice', () => {
  const lead = (changes) => toLead(validateEnroll({ ...VALID, ...changes }, now).data);
  assert.equal(lead({ mobile: 'no' }).IsMobilePhone, false);
  assert.equal(lead({ lang: 'en' }).Language, 'English');
  assert.equal(lead({ contactBy: 'phone' }).PreferredCommunicationMethod, 'Phone');
  assert.equal(lead({ contactBy: 'email' }).PreferredCommunicationMethod, 'Email');
  assert.equal(lead({ program: 'fsd' }).PreferredProgram, 31);
  assert.equal(lead({ heard: 'TV' }).ReferralChannel, 'TV');
  assert.equal(lead({ heard: 'Télévision' }).ReferralChannel, 'TV');
  assert.equal(lead({ dial: '+234', phone: '803 123 4567' }).Phone, '+2348031234567');
  assert.equal('ReferralChannel' in lead({ heard: '' }), false);
  assert.equal('ReferralChannel' in lead({ heard: undefined }), false);
});

test('requires every drawer field but heard', () => {
  for (const field of Object.keys(VALID).filter((f) => f !== 'heard')) {
    assert.deepEqual(errorsFor({ [field]: undefined }), [field], field);
    assert.ok(errorsFor({ [field]: '  ' }).includes(field), field);
  }
});

test('rejects non-string values', () => {
  assert.deepEqual(errorsFor({ first: 42 }), ['first']);
  assert.deepEqual(errorsFor({ heard: ['TV'] }), ['heard']);
  assert.deepEqual(errorsFor({ mobile: true }), ['mobile']);
});

test('rejects values outside the choices', () => {
  assert.deepEqual(errorsFor({ lang: 'de' }), ['lang']);
  assert.deepEqual(errorsFor({ program: 'FSD' }), ['program']);
  assert.deepEqual(errorsFor({ contactBy: 'fax' }), ['contactBy']);
  assert.deepEqual(errorsFor({ mobile: 'maybe' }), ['mobile']);
  assert.deepEqual(errorsFor({ mobile: 'toString' }), ['mobile']);
  assert.deepEqual(errorsFor({ heard: 'A billboard' }), ['heard']);
  assert.deepEqual(errorsFor({ country: 'ZZ' }), ['country']);
  assert.deepEqual(errorsFor({ country: 'CAN' }), ['country']);
});

test('checks email, birthdate, dial code and phone', () => {
  for (const email of ['ada', 'ada@example', 'a da@example.com', `${'a'.repeat(250)}@ex.com`]) {
    assert.deepEqual(errorsFor({ email }), ['email'], email);
  }
  for (const birth of ['1990-02-30', '2023-02-29', '1899-12-31', '2026-09-29', '1990-2-3', 'x']) {
    assert.deepEqual(errorsFor({ birth }), ['birth'], birth);
  }
  assert.equal(validateEnroll({ ...VALID, birth: '2024-02-29' }, now).ok, true);
  assert.equal(validateEnroll({ ...VALID, birth: '2026-09-28' }, now).ok, true);
  for (const dial of ['1', '+', '+12345', '+1a']) {
    assert.deepEqual(errorsFor({ dial }), ['dial'], dial);
  }
  assert.deepEqual(errorsFor({ phone: '12345' }), ['phone']);
  assert.deepEqual(errorsFor({ phone: '1234567890123456' }), ['phone']);
  assert.deepEqual(errorsFor({ dial: '+1234', phone: '12345678901' }), []);
  assert.deepEqual(errorsFor({ dial: '+1234', phone: '123456789012' }), ['phone']);
});

test('enforces maximum lengths', () => {
  assert.deepEqual(errorsFor({ first: 'a'.repeat(100) }), []);
  for (const [field, max] of Object.entries({
    first: 100,
    last: 100,
    street: 100,
    city: 100,
    region: 100,
    postal: 15,
  })) {
    assert.deepEqual(errorsFor({ [field]: 'a'.repeat(max + 1) }), [field], field);
  }
  assert.deepEqual(errorsFor({ phone: `555-555-0100${'-'.repeat(19)}` }), ['phone']);
});

test('spots a filled honeypot', () => {
  assert.equal(isHoneypot(VALID), false);
  assert.equal(isHoneypot({ ...VALID, website: '' }), false);
  assert.equal(isHoneypot({ ...VALID, website: 'http://spam.example' }), true);
});
