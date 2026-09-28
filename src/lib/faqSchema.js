// FAQPage JSON-LD for /faq and /fr/faq, built from the same locale items the
// page renders (see src/locales/en/faq.js) so the two can't drift apart.
const plain = (p) =>
  Array.isArray(p) ? p.map((s) => (typeof s === 'string' ? s : s.label)).join('') : p;

export function faqSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a.map(plain).join('\n\n') },
    })),
  };
}
