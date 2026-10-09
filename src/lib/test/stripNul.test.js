import assert from 'node:assert/strict';
import { test } from 'node:test';
import { withoutNul } from '../stripNul.js';

test('withoutNul drops NUL bytes and keeps multi-byte characters whole', () => {
  const page = Buffer.concat([Buffer.from('case<!-- --> '), Buffer.from([0]), Buffer.from('→ é')]);
  assert.equal(withoutNul(page).toString('utf8'), 'case<!-- --> → é');
});

test('withoutNul returns a clean page as is', () => {
  const page = Buffer.from('<p>Académie →</p>');
  assert.equal(withoutNul(page), page);
});
