import { test } from 'node:test';
import assert from 'node:assert/strict';
import { frTypography, frTypographyString as fr } from '../frTypography.js';

const N = ' ';

test('non-breaking space before : ; ! ?', () => {
  assert.equal(fr('Résultat : oui'), `Résultat${N}: oui`);
  assert.equal(fr('Résultat: oui'), `Résultat${N}: oui`);
  assert.equal(fr('un; deux'), `un${N}; deux`);
  assert.equal(fr('Bravo!'), `Bravo${N}!`);
  assert.equal(fr('Vraiment ?'), `Vraiment${N}?`);
  assert.equal(fr(' ?'), `${N}?`);
});

test('number before $ and %', () => {
  assert.equal(fr('jusqu’à 7 500 $.'), `jusqu’à 7 500${N}$.`);
  assert.equal(fr('9800$'), `9800${N}$`);
  assert.equal(fr('78%'), `78${N}%`);
  assert.equal(fr('14,9 M$'), '14,9 M$');
});

test('leaves code-like text alone', () => {
  for (const s of [
    'https://codeboxx.com',
    '9:00',
    '16:9',
    'Q&amp; R',
    '{{date}}',
    'mailto:a@b.c',
  ]) {
    assert.equal(fr(s), s);
  }
});

test('is idempotent', () => {
  const s = 'Prix : 7 500 $ ; 78 % !';
  assert.equal(fr(fr(s)), fr(s));
});

test('walks objects, skipping the English quotes', () => {
  const out = frTypography({
    a: ['Note: x'],
    gradQuotes: [{ after: 'Great!' }],
    source: 'x; y',
  });
  assert.deepEqual(out, { a: [`Note${N}: x`], gradQuotes: [{ after: 'Great!' }], source: 'x; y' });
});
