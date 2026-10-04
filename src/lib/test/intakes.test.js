import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { addDaysIso, formatIntakeDate, groupIntakes, nextFsdIntake, todayIso } from '../intakes.js';

const TODAY = '2026-09-30';
const FSD = 'AI Native Full Stack Development';
const AI = 'Advanced AI Developer';

const intake = (date, program, location = 'Online', pace = 'Full Time', status = 'Open') => ({
  date,
  location,
  status,
  pace,
  program: program === null ? null : { title: program },
});

let warnings;
const warn = console.warn;
beforeEach(() => {
  warnings = [];
  console.warn = (...args) => warnings.push(args);
});
afterEach(() => {
  console.warn = warn;
});

test('todayIso is the local calendar date', () => {
  assert.equal(todayIso(new Date(2026, 0, 5, 23, 59)), '2026-01-05');
  assert.equal(todayIso(new Date(2026, 11, 31, 0, 0)), '2026-12-31');
});

test('addDaysIso crosses months, years and DST changes', () => {
  assert.equal(addDaysIso('2026-09-30', 90), '2026-12-29');
  assert.equal(addDaysIso('2026-12-15', 30), '2027-01-14');
  assert.equal(addDaysIso('2026-10-31', 2), '2026-11-02');
  assert.equal(addDaysIso('2028-02-28', 1), '2028-02-29');
});

test('keeps only dates after today and at most 90 days out', () => {
  const groups = groupIntakes(
    [
      intake('2026-09-14', FSD),
      intake(TODAY, FSD),
      intake('2026-10-01', FSD),
      intake('2026-12-29', FSD),
      intake('2026-12-30', FSD),
      intake('2030-09-21', FSD),
    ],
    TODAY
  );
  assert.deepEqual(groups.fsd['Full Time'], [
    ['2026-10-01', 'Online', 'Open'],
    ['2026-12-29', 'Online', 'Open'],
  ]);
});

test('drops undated intakes', () => {
  const groups = groupIntakes([intake('', FSD), intake(null, AI), intake(undefined, AI)], TODAY);
  assert.deepEqual(groups.fsd['Full Time'], []);
  assert.deepEqual(groups.aidev['Full Time'], []);
});

test('assigns columns by program title, whichever duplicate document it comes from', () => {
  const groups = groupIntakes(
    [
      intake('2026-10-05', FSD, 'Online'),
      intake('2026-10-06', 'AI Native Full-Stack Development', 'St. Pete'),
      intake('2026-10-07', AI, 'Online'),
      intake('2026-10-08', '  advanced ai-developer ', 'St. Pete'),
      intake('2026-10-09', 'Advanced AI Technologist', 'Online'),
    ],
    TODAY
  );
  assert.deepEqual(groups.fsd['Full Time'], [
    ['2026-10-05', 'Online', 'Open'],
    ['2026-10-06', 'St. Pete', 'Open'],
  ]);
  assert.deepEqual(groups.aidev['Full Time'], [
    ['2026-10-07', 'Online', 'Open'],
    ['2026-10-08', 'St. Pete', 'Open'],
    ['2026-10-09', 'Online', 'Open'],
  ]);
  assert.deepEqual(warnings, []);
});

test('drops and warns about an unknown or missing program', () => {
  const groups = groupIntakes(
    [intake('2026-10-05', 'Data Analytics'), intake('2026-10-06', null)],
    TODAY
  );
  assert.deepEqual(groups, {
    fsd: { 'Full Time': [], 'Part Time': [] },
    aidev: { 'Full Time': [], 'Part Time': [] },
  });
  assert.equal(warnings.length, 2);
});

test('sorts by date, then location, keeping same-day intakes as separate lines', () => {
  const groups = groupIntakes(
    [
      intake('2026-11-27', FSD, 'St. Pete'),
      intake('2026-10-12', FSD, 'St. Pete', 'Full Time', 'Waitlist'),
      intake('2026-10-12', FSD, 'Online', 'Full Time', 'Planned'),
    ],
    TODAY
  );
  assert.deepEqual(groups.fsd['Full Time'], [
    ['2026-10-12', 'Online', 'Planned'],
    ['2026-10-12', 'St. Pete', 'Waitlist'],
    ['2026-11-27', 'St. Pete', 'Open'],
  ]);
});

test('buckets both paces and drops an unknown pace', () => {
  const groups = groupIntakes(
    [
      intake('2026-10-05', FSD, 'Online', 'Full Time'),
      intake('2026-10-19', FSD, 'Online', 'Part Time'),
      intake('2026-11-02', AI, 'Online', 'Part Time'),
      intake('2026-11-03', AI, 'Online', 'Evenings'),
      intake('2026-11-04', AI, 'Online'),
    ],
    TODAY
  );
  assert.deepEqual(groups.fsd['Full Time'], [['2026-10-05', 'Online', 'Open']]);
  assert.deepEqual(groups.fsd['Part Time'], [['2026-10-19', 'Online', 'Open']]);
  assert.deepEqual(groups.aidev['Full Time'], [['2026-11-04', 'Online', 'Open']]);
  assert.deepEqual(groups.aidev['Part Time'], [['2026-11-02', 'Online', 'Open']]);
});

test('handles no rows', () => {
  const empty = { 'Full Time': [], 'Part Time': [] };
  assert.deepEqual(groupIntakes([], TODAY), { fsd: empty, aidev: empty });
  assert.deepEqual(groupIntakes(null, TODAY), { fsd: empty, aidev: empty });
});

test('formats dates per page language', () => {
  assert.equal(formatIntakeDate('2026-11-27', 'en'), 'Nov 27, 2026');
  assert.equal(formatIntakeDate('2026-11-09', 'en'), 'Nov 9, 2026');
  assert.equal(formatIntakeDate('2026-11-27', 'fr'), '27 nov. 2026');
  assert.equal(formatIntakeDate('2026-11-09', 'fr'), '9 nov. 2026');
  assert.equal(formatIntakeDate('2027-02-01', 'fr'), '1 févr. 2027');
});

test('next intake is the earliest Full Time FSD date in the window', () => {
  const groups = groupIntakes(
    [
      intake('2026-09-20', FSD),
      intake('2026-10-03', AI),
      intake('2026-10-04', FSD, 'Online', 'Part Time'),
      intake('2026-11-27', FSD, 'St. Pete'),
      intake('2026-11-09', FSD, 'Online'),
      intake('2027-01-05', FSD),
    ],
    TODAY
  );
  assert.equal(nextFsdIntake(groups), '2026-11-09');
});

test('no next intake without a Full Time FSD date in the window, or while loading', () => {
  const groups = groupIntakes(
    [
      intake('2026-10-03', AI),
      intake('2026-10-04', FSD, 'Online', 'Part Time'),
      intake('2027-01-05', FSD),
    ],
    TODAY
  );
  assert.equal(nextFsdIntake(groups), null);
  assert.equal(nextFsdIntake(groupIntakes([], TODAY)), null);
  assert.equal(nextFsdIntake(null), null);
});
