// Runs from the repo only: it checks the relay's lists against the site's.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import countries from '../../src/data/countries.js';
import en from '../../src/locales/en/home.js';
import fr from '../../src/locales/fr/home.js';
import venturesEn from '../../src/locales/en/ventures.js';
import venturesFr from '../../src/locales/fr/ventures.js';
import businessEn from '../../src/locales/en/businessContact.js';
import businessFr from '../../src/locales/fr/businessContact.js';
import { CONTACT_TOPICS, COUNTRY_CODES, HEARD_ABOUT, PROJECT_TYPES } from '../lists.js';

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

test('the relay accepts exactly the project types the pitch drawer offers', () => {
  for (const ventures of [venturesEn, venturesFr]) {
    const values = ventures.pitchDrawer.projectKinds.map((k) => k.value);
    assert.deepEqual(values, [...PROJECT_TYPES]);
  }
});

test('the relay accepts exactly the topics the business contact form offers', () => {
  for (const business of [businessEn, businessFr]) {
    assert.deepEqual(
      business.topics.map((t) => t.value),
      [...CONTACT_TOPICS]
    );
  }
});
