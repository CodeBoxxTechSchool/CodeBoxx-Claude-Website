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

/**
 * Checks a contact form or pitch drawer submission. Returns { ok: true, data } with trimmed
 * values, or { ok: false, errors } listing the offending field names. Unknown fields are ignored.
 */
export const validateContact = (body) => validate(body, CONTACT);
export const validatePitch = (body) => validate(body, PITCH);

function validate(body, { required, optional, choices }) {
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

  return errors.size ? { ok: false, errors: [...errors] } : { ok: true, data };
}

function isPageUrl(value) {
  if (typeof value !== 'string' || value.length > 500 || !URL.canParse(value)) return false;
  return ['http:', 'https:'].includes(new URL(value).protocol);
}

/** Maps validated contact data to the portal's form submission (POST /api/v1/form-submissions). */
export function toContact(data) {
  return {
    ...common('contact', data),
    division: data.division,
    isMobilePhone: data.mobile === 'yes',
    country: data.country,
    ...(data.message && { message: data.message }),
  };
}

/** Maps validated pitch data to the portal's form submission. */
export function toPitch(data) {
  return {
    ...common('pitch', data),
    division: 'ventures',
    ...(data.description && { message: data.description }),
    ...(data.projectType && { extra: { projectType: data.projectType } }),
  };
}

function common(form, data) {
  return {
    submissionId: data.submissionId,
    form,
    firstName: data.first,
    lastName: data.last,
    email: data.email,
    phone: data.phone,
    language: data.lang,
    consent: true,
    ...(data.pageUrl && { pageUrl: data.pageUrl }),
  };
}
