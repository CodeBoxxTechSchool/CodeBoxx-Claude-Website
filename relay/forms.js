import { isEmail, readFields } from './fields.js';
import { COUNTRY_CODES, PROJECT_TYPES } from './lists.js';
import { isSubmissionId } from './outbox.js';

// At or under the portal's FormSubmission limits (names 100, email 256, phone 32, message 5000).
const MAX_LENGTH = {
  first: 100,
  last: 100,
  email: 254,
  phone: 30,
  message: 2000,
  description: 2000,
  position: 100,
};

const LANGUAGES = new Set(['en', 'fr']);

const CONTACT = {
  required: ['division', 'first', 'last', 'email', 'phone', 'mobile', 'lang', 'country'],
  optional: ['message'],
  choices: {
    division: new Set(['codeboxx', 'solutions', 'academy', 'ventures']),
    mobile: new Set(['yes', 'no']),
    lang: LANGUAGES,
    country: COUNTRY_CODES,
  },
};

const PITCH = {
  required: ['first', 'last', 'email', 'phone', 'lang'],
  optional: ['projectType', 'description'],
  choices: { lang: LANGUAGES, projectType: PROJECT_TYPES },
};

const CAREERS = {
  required: ['first', 'last', 'email', 'phone', 'lang', 'position', 'startDate'],
  optional: [],
  choices: { lang: LANGUAGES },
};

// The portal's own limit (FormSubmissionFile.MaxSize).
const MAX_CV_BYTES = 5 * 1024 * 1024;

/**
 * Checks a contact form, pitch drawer or careers form submission. Returns { ok: true, data } with
 * trimmed values, or { ok: false, errors } listing the offending field names. Unknown fields are
 * ignored.
 */
export const validateContact = (body) => result(check(body, CONTACT));
export const validatePitch = (body) => result(check(body, PITCH));

export function validateCareers(body, now = new Date()) {
  const { data, errors } = check(body, CAREERS);
  if (!isStartDate(data.startDate, now)) errors.add('startDate');
  data.cv = readCv(body.cv);
  if (!data.cv) errors.add('cv');
  return result({ data, errors });
}

const result = ({ data, errors }) =>
  errors.size ? { ok: false, errors: [...errors] } : { ok: true, data };

function check(body, { required, optional, choices }) {
  const { data, errors } = readFields(body, { required, optional, maxLength: MAX_LENGTH });

  data.country &&= data.country.toUpperCase();
  for (const [field, values] of Object.entries(choices)) {
    // An empty required field is already an error; an empty optional one is fine.
    if (data[field] && !values.has(data[field])) errors.add(field);
  }

  data.email = data.email?.toLowerCase();
  if (!isEmail(data.email)) errors.add('email');

  // As typed, but 7 to 15 digits (E.164).
  const digits = data.phone?.replace(/\D/g, '').length;
  if (!/^[\d\s()+.-]*$/.test(data.phone) || digits < 7 || digits > 15) errors.add('phone');

  if (body.consent !== true) errors.add('consent');

  // Required: the portal takes these forms only with one.
  if (isSubmissionId(body.submissionId)) data.submissionId = body.submissionId.toLowerCase();
  else errors.add('submissionId');

  if (body.pageUrl !== undefined) {
    if (isPageUrl(body.pageUrl)) data.pageUrl = body.pageUrl;
    else errors.add('pageUrl');
  }

  return { data, errors };
}

function isPageUrl(value) {
  if (typeof value !== 'string' || value.length > 500 || !URL.canParse(value)) return false;
  return ['http:', 'https:'].includes(new URL(value).protocol);
}

// A real date no more than a year back: a candidate may already be available, but an older date is
// a typo.
function isStartDate(value, now) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return false;
  const yearAgo = new Date(now);
  yearAgo.setUTCFullYear(yearAgo.getUTCFullYear() - 1);
  return value >= yearAgo.toISOString().slice(0, 10);
}

const PDF = Buffer.from('%PDF-');
// The OLE compound file every .doc is.
const OLE = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
const ZIP = Buffer.from('PK\x03\x04', 'latin1');

/**
 * { fileName, content } when the CV is a PDF, DOC or DOCX of 1 byte to 5 MB as told by its content,
 * else null. A quick check that spares the portal the obvious rejects: the portal reads a DOCX's zip
 * directory itself.
 */
function readCv(cv) {
  if (typeof cv !== 'object' || cv === null) return null;
  const { fileName, content } = cv;
  if (typeof fileName !== 'string' || fileName.length > 255) return null;
  if (typeof content !== 'string' || content.length > 4 * Math.ceil(MAX_CV_BYTES / 3)) return null;
  // Strict, as the portal is: Buffer.from would skip whatever is not base64.
  if (content.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(content)) return null;
  const bytes = Buffer.from(content, 'base64');
  if (bytes.length === 0 || bytes.length > MAX_CV_BYTES) return null;
  const starts = (signature) => bytes.subarray(0, signature.length).equals(signature);
  const docx = starts(ZIP) && bytes.includes('word/document.xml');
  return starts(PDF) || starts(OLE) || docx ? { fileName, content } : null;
}

/** Maps validated contact data to the portal's form submission (POST /api/v1/form-submissions). */
export function toContact(data, now) {
  return {
    ...common('contact', data, now),
    division: data.division,
    isMobilePhone: data.mobile === 'yes',
    country: data.country,
    ...(data.message && { message: data.message }),
  };
}

/** Maps validated pitch data to the portal's form submission. */
export function toPitch(data, now) {
  return {
    ...common('pitch', data, now),
    division: 'ventures',
    ...(data.description && { message: data.description }),
    ...(data.projectType && { extra: { projectType: data.projectType } }),
  };
}

/** Maps validated careers data to the portal's form submission, with the CV in base64. */
export function toCareers(data, now) {
  return {
    ...common('careers', data, now),
    extra: { position: data.position, startDate: data.startDate },
    cv: data.cv,
  };
}

function common(form, data, now = Date.now()) {
  return {
    submissionId: data.submissionId,
    form,
    firstName: data.first,
    lastName: data.last,
    email: data.email,
    phone: data.phone,
    language: data.lang,
    consent: true,
    // Stamped here, not by the portal: a queued copy may reach it up to 72 hours later.
    consentAt: new Date(now).toISOString(),
    ...(data.pageUrl && { pageUrl: data.pageUrl }),
  };
}
