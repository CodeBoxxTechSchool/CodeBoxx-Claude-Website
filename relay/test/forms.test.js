import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  toCareers,
  toContact,
  toPitch,
  validateCareers,
  validateContact,
  validatePitch,
} from '../forms.js';
import { base64, CAREERS, CONTACT, PDF, PITCH } from './fixtures.js';

const ID = '3f2b8c1e-9a4d-4e6f-8b7a-1c2d3e4f5a6b';
const NOW = Date.parse('2026-09-29T12:00:00Z');
const contactErrors = (changes) => validateContact({ ...CONTACT, ...changes }).errors ?? [];
const pitchErrors = (changes) => validatePitch({ ...PITCH, ...changes }).errors ?? [];
const careersErrors = (changes) =>
  validateCareers({ ...CAREERS, ...changes }, new Date(NOW)).errors ?? [];
const cvErrors = (cv) => careersErrors({ cv });
const withCv = (bytes, fileName = 'cv') => ({ fileName, content: base64(bytes) });

const MB = 1024 * 1024;
const OLE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
// The start of a zip whose first entry is a Word document's main part.
const DOCX = Buffer.concat([
  Buffer.from('PK\x03\x04\x14\x00\x06\x00', 'latin1'),
  Buffer.alloc(18),
  Buffer.from('\x11\x00\x00\x00word/document.xml<w:document/>', 'latin1'),
]);
// A PDF of exactly `size` bytes.
const pdfOf = (size) => Buffer.concat([PDF, Buffer.alloc(size - PDF.length, 0x20)]);

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

test('maps a valid careers application to a form submission with the CV', () => {
  const result = validateCareers({ ...CAREERS, extra: 'ignored' }, new Date(NOW));
  assert.equal(result.ok, true);
  assert.deepEqual(toCareers(result.data, NOW), {
    submissionId: ID,
    form: 'careers',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    phone: '+1 (555) 555-0100',
    language: 'fr',
    consent: true,
    consentAt: '2026-09-29T12:00:00.000Z',
    pageUrl: 'https://codeboxx.com/fr/carrieres/',
    extra: { position: 'Full-stack developer', startDate: '2026-11-02' },
    cv: { fileName: 'Ada Lovelace CV.pdf', content: CAREERS.cv.content },
  });
  const cv = { ...CAREERS.cv, extra: 'dropped' };
  assert.deepEqual(validateCareers({ ...CAREERS, cv }, new Date(NOW)).data.cv, CAREERS.cv);
});

test('requires every careers field, consent, a submission ID and a CV', () => {
  const optional = ['pageUrl'];
  for (const field of Object.keys(CAREERS).filter((f) => !optional.includes(f))) {
    assert.deepEqual(careersErrors({ [field]: undefined }), [field], field);
  }
  assert.deepEqual(careersErrors({ position: '  ' }), ['position']);
  assert.deepEqual(careersErrors({ position: 'a'.repeat(101) }), ['position']);
  assert.deepEqual(careersErrors({ consent: 'yes' }), ['consent']);
  assert.deepEqual(careersErrors({ lang: 'es' }), ['lang']);
});

test('takes a real start date from a year ago on', () => {
  for (const startDate of ['2025-09-29', '2026-09-29', '2031-01-15', '2028-02-29']) {
    assert.deepEqual(careersErrors({ startDate }), [], startDate);
  }
  for (const startDate of ['2025-09-28', '2027-02-29', '2026-13-01', '2026-11-2', '02/11/2026']) {
    assert.deepEqual(careersErrors({ startDate }), ['startDate'], startDate);
  }
});

test('takes a PDF, DOC or DOCX CV of up to 5 MB, as told by its content', () => {
  assert.deepEqual(cvErrors(withCv(Buffer.from([...OLE, 0, 1, 2]), 'cv.doc')), []);
  assert.deepEqual(cvErrors(withCv(DOCX, 'cv.docx')), []);
  assert.deepEqual(cvErrors(withCv(pdfOf(5 * MB), 'cv.pdf')), []);
  // The extension counts for nothing.
  assert.deepEqual(cvErrors(withCv(PDF, 'cv.png')), []);
});

test('rejects any other CV', () => {
  const zip = Buffer.from('PK\x03\x04\x14\x00xl/workbook.xml', 'latin1');
  for (const [name, cv] of [
    ['png', withCv(Buffer.from('\x89PNG\r\n\x1a\n', 'latin1'), 'cv.pdf')],
    ['zip without a Word document', withCv(zip, 'cv.docx')],
    ['text named .pdf', withCv(Buffer.from('Curriculum vitae'), 'cv.pdf')],
    ['over 5 MB', withCv(pdfOf(5 * MB + 1))],
    ['empty', { fileName: 'cv.pdf', content: '' }],
    ['data URL', { fileName: 'cv.pdf', content: `data:application/pdf;base64,${base64(PDF)}` }],
    ['not base64', { fileName: 'cv.pdf', content: base64(PDF).slice(0, -4) + '!!!!' }],
    ['base64 missing padding', { fileName: 'cv.pdf', content: base64(pdfOf(100)).slice(0, -2) }],
    ['content not a string', { fileName: 'cv.pdf', content: [...PDF] }],
    ['no file name', { content: base64(PDF) }],
    ['file name too long', withCv(PDF, `${'a'.repeat(252)}.pdf`)],
    ['a string', base64(PDF)],
    ['null', null],
  ]) {
    assert.deepEqual(cvErrors(cv), ['cv'], name);
  }
});
