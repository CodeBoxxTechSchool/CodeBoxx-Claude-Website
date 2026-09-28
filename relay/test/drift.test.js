// Runs from the repo only: it checks the relay's lists against the site's.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import countries from '../../src/data/countries.js';
import en from '../../src/locales/en/home.js';
import fr from '../../src/locales/fr/home.js';
import { COUNTRY_CODES, HEARD_ABOUT } from '../lists.js';

test('the relay accepts exactly the countries the site offers', () => {
  assert.equal(COUNTRY_CODES.size, 250);
  assert.deepEqual([...COUNTRY_CODES].sort(), countries.map((c) => c.code).sort());
});

test('the relay maps exactly the heard-about labels the site offers', () => {
  assert.equal(en.heardAbout.length, fr.heardAbout.length);
  const expected = new Map(
    en.heardAbout.flatMap((label, i) => [
      [label, label],
      [fr.heardAbout[i], label],
    ])
  );
  assert.deepEqual(HEARD_ABOUT, expected);
});
