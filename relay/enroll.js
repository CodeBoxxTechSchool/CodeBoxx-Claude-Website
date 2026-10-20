import { isEmail, readFields } from './fields.js';
import { COUNTRY_CODES, HEARD_ABOUT } from './lists.js';
import { isSubmissionId } from './outbox.js';

const REQUIRED = ['first', 'last', 'email', 'dial', 'phone', 'lang', 'program'];

// The drawer sends contactBy only when chosen; Codi still sends all of them (CLP-1438). Checked
// only when present.
const OPTIONAL = [
  'birth',
  'mobile',
  'contactBy',
  'street',
  'city',
  'region',
  'country',
  'postal',
  'heard',
];

// At or under the portal's Registration columns (Email 255, names/address/city/state 100,
// PostalCode 15); a longer value would fail the portal's insert.
const MAX_LENGTH = {
  first: 100,
  last: 100,
  email: 254,
  phone: 30,
  street: 100,
  city: 100,
  region: 100,
  postal: 15,
};

/** The portal's program IDs, by the site's program key. */
export const PROGRAM_IDS = { fsd: 31, ai: 43 };

const CHOICES = {
  mobile: { yes: true, no: false },
  lang: { en: 'English', fr: 'French' },
  contactBy: { phone: 'Phone', sms: 'SMS', email: 'Email' },
  program: PROGRAM_IDS,
};

/**
 * Checks an enroll drawer submission. Returns { ok: true, data } with trimmed values, or
 * { ok: false, errors } listing the offending field names. Unknown fields are ignored.
 */
export function validateEnroll(body, now = new Date()) {
  const { data, errors } = readFields(body, {
    required: REQUIRED,
    optional: OPTIONAL,
    maxLength: MAX_LENGTH,
  });

  for (const [field, choices] of Object.entries(CHOICES)) {
    if (OPTIONAL.includes(field) && !data[field]) continue;
    if (!Object.hasOwn(choices, data[field])) errors.add(field);
  }

  data.email = data.email?.toLowerCase();
  if (!isEmail(data.email)) errors.add('email');

  if (data.birth && !isBirthDate(data.birth, now)) errors.add('birth');

  if (!/^\+\d{1,4}$/.test(data.dial)) errors.add('dial');
  data.phone = `${data.dial}${(data.phone ?? '').replace(/\D/g, '')}`;
  // E.164: at most 15 digits including the country code.
  const digits = data.phone.length - 1;
  if (digits < 7 || digits > 15) errors.add('phone');

  data.country = data.country?.toUpperCase();
  if (data.country && !COUNTRY_CODES.has(data.country)) errors.add('country');

  if (data.heard && !HEARD_ABOUT.has(data.heard)) errors.add('heard');

  // Optional: a page loaded before the drawer sent one has none.
  if (body.submissionId !== undefined) {
    if (isSubmissionId(body.submissionId)) data.submissionId = body.submissionId.toLowerCase();
    else errors.add('submissionId');
  }

  return errors.size ? { ok: false, errors: [...errors] } : { ok: true, data };
}

function isBirthDate(value, now) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const real =
    date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  return real && y >= 1900 && value <= now.toISOString().slice(0, 10);
}

/** Maps validated data to the portal's LeadCreateDto (POST /api/v1/leads). */
export function toLead(data) {
  const lead = {
    Email: data.email,
    FirstName: data.first,
    LastName: data.last,
    Phone: data.phone,
    // The drawer no longer asks: everyone has one.
    IsMobilePhone: data.mobile ? CHOICES.mobile[data.mobile] : true,
    Language: CHOICES.lang[data.lang],
    PreferredProgram: CHOICES.program[data.program],
    SendEmails: true,
  };
  // Omitted rather than empty: the portal stores its own placeholders for missing values
  // (CLP-1435).
  const optional = {
    BirthDate: data.birth,
    PreferredCommunicationMethod: CHOICES.contactBy[data.contactBy],
    Address: data.street,
    City: data.city,
    State: data.region,
    Country: data.country,
    PostalCode: data.postal,
    ReferralChannel: HEARD_ABOUT.get(data.heard),
  };
  for (const [key, value] of Object.entries(optional)) if (value) lead[key] = value;
  // A repeat of a known ID gets the first answer, without a second lead or email.
  if (data.submissionId) lead.SubmissionId = data.submissionId;
  return lead;
}
