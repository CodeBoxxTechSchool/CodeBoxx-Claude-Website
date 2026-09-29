// Common misspellings of the big webmail domains. Only these providers are corrected: an unknown
// domain may be real, so it's never rewritten.
const PROVIDERS = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'];

const TYPOS = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmail.co': 'hotmail.com',
  'yahoo.co': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'yhoo.com': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'outlook.co': 'outlook.com',
  'iclod.com': 'icloud.com',
  'icloud.co': 'icloud.com',
};

const BAD_TLD = /\.(con|cmo|cm)$/;

/** The corrected address when the domain is a known typo (gmail.con → gmail.com), else null. */
export function suggestEmail(email) {
  const at = email.lastIndexOf('@');
  if (at < 1) return null;
  const domain = email
    .slice(at + 1)
    .trim()
    .toLowerCase();
  const withCom = domain.replace(BAD_TLD, '.com');
  const fixed = TYPOS[withCom] ?? (PROVIDERS.includes(withCom) ? withCom : null);
  return fixed && fixed !== domain ? email.slice(0, at + 1) + fixed : null;
}
