// French typography for FR content (Québec, OQLF): a non-breaking space
// before « : », « ; », « ! » and « ? », and between a number and « $ » or « % ».
// Applied to every FR locale/data module at build time (see frTypographyPlugin
// in astro.config.mjs), so the source files stay plain and new copy follows
// the rule without anyone having to remember it.
import { fileURLToPath } from 'node:url';

const NBSP = ' ';

export function frTypographyString(s) {
  return (
    s
      // An existing ordinary space before : ; ! ? becomes non-breaking.
      .replace(/[  ]([:;!?])/g, NBSP + '$1')
      // No space at all: add one, only when the sign ends a word and is
      // followed by a space or the end — leaves URLs (https://), times (9:00),
      // ratios (16:9), HTML entities (&amp;) and "!!"/"?!" runs alone.
      .replace(/(^|[^&\w])(\w*[\p{L}\d)»”’'"])([:;!?])(?=\s|$)/gu, (m, pre, word, sign) =>
        /^&\w+$/.test(word) ? m : pre + word + NBSP + sign
      )
      // A number before $ or %: "7 500 $", "78 %".
      .replace(/(\d)[  ]?([$%])/g, '$1' + NBSP + '$2')
  );
}

// A French Portable Text body (a blog post's contentFr, from Sanity): the same rule on each
// span's text and each table cell, leaving keys, marks and links alone.
export function frTypographyBlocks(blocks) {
  return (blocks || []).map((block) => {
    if (block._type === 'block')
      return {
        ...block,
        children: (block.children || []).map((c) =>
          typeof c.text === 'string' ? { ...c, text: frTypographyString(c.text) } : c
        ),
      };
    if (block._type === 'table')
      return {
        ...block,
        rows: (block.rows || []).map((row) => ({
          ...row,
          cells: (row.cells || []).map((cell) =>
            typeof cell === 'string' ? frTypographyString(cell) : cell
          ),
        })),
      };
    return block;
  });
}

// Left as-is: the testimonials kept in English in the FR locale (home.js), and
// the legal JSON's internal `source` note.
const SKIP_KEYS = new Set(['clientQuotes', 'gradQuotes', 'source']);

export function frTypography(value) {
  if (typeof value === 'string') return frTypographyString(value);
  if (Array.isArray(value)) return value.map(frTypography);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = SKIP_KEYS.has(k) ? v : frTypography(v);
    return out;
  }
  return value;
}

// Vite plugin: runs frTypography over the default export of every FR content
// module — src/locales/fr/*.js and src/data/legal/*.fr.json.
export function frTypographyPlugin() {
  // A real path, not the URL's pathname: on Windows the latter is
  // "/C:/Source%20Code/…" (leading slash, percent-encoded space) and Vite
  // cannot resolve the injected import from a checkout whose path has a space.
  const helper = fileURLToPath(import.meta.url).replace(/\\/g, '/');
  return {
    name: 'fr-typography',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0];
      if (/\/src\/data\/legal\/[^/]+\.fr\.json$/.test(file)) {
        return { code: JSON.stringify(frTypography(JSON.parse(code))), map: null };
      }
      if (/\/src\/locales\/fr\/[^/]+\.js$/.test(file)) {
        if (!code.includes('export default')) return null;
        return {
          code:
            `import { frTypography as __frTypography } from ${JSON.stringify(helper)};\n` +
            code.replace('export default', 'const __frContent =') +
            '\nexport default __frTypography(__frContent);\n',
          map: null,
        };
      }
      return null;
    },
  };
}
