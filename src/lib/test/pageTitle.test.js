import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MAX_TITLE, pageTitle } from '../pageTitle.js';

test('pageTitle adds the brand when the result stays within 70 characters', () => {
  assert.equal(pageTitle('Careers'), 'Careers | CodeBoxx');
  const fits = 'x'.repeat(MAX_TITLE - ' | CodeBoxx'.length);
  assert.equal(pageTitle(fits).length, MAX_TITLE);
});

test('pageTitle leaves a long title without the brand, and a branded one as is', () => {
  const long = 'x'.repeat(MAX_TITLE - ' | CodeBoxx'.length + 1);
  assert.equal(pageTitle(long), long);
  assert.equal(
    pageTitle('CodeBoxx Solutions | AI-Native Software'),
    'CodeBoxx Solutions | AI-Native Software'
  );
});
