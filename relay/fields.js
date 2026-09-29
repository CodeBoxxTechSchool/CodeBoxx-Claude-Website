// Checks shared by the relay's forms.

/**
 * Reads the given string fields from a submission, trimmed. Returns { data, errors }: errors is a
 * Set of the fields that are not strings, over their maximum length, or empty and not optional.
 */
export function readFields(body, { required, optional = [], maxLength }) {
  const data = {};
  const errors = new Set();
  for (const field of [...required, ...optional]) {
    const value = body[field] ?? '';
    if (typeof value !== 'string') errors.add(field);
    else data[field] = value.trim();
    if (data[field] === '' && !optional.includes(field)) errors.add(field);
    if (data[field]?.length > (maxLength[field] ?? Infinity)) errors.add(field);
  }
  return { data, errors };
}

export const isEmail = (value) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);

/** A bot filled the hidden `website` field. */
export const isHoneypot = (body) => Boolean(body.website);
