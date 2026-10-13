import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, beforeEach, test } from 'node:test';
import { cohortsHandler, inWindow, toPublic } from '../cohorts.js';
import { createServer } from '../server.js';

const API_KEY = 'test-key';
const PORTAL_URL = 'http://portal.test/';
const TODAY = Date.parse('2026-10-13T12:00:00Z');
const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;
const dir = await mkdtemp(join(tmpdir(), 'relay-cohorts-'));
const file = join(dir, 'state', 'cohorts.json');

// A cohort as the portal's GET /api/v1/cohorts lists it.
const cohort = (id, startDate, programId = 31) => ({
  id,
  name: `FSD ${id}`,
  description: { en: 'Full-Stack Development, St. Pete', fr: 'Développement' },
  startDate,
  endDate: '2027-06-30T00:00:00',
  facility: { id: 3, name: { en: 'St. Pete campus', fr: 'Campus St. Pete' } },
  programId,
});

const PORTAL = [
  cohort(2704, '2026-12-07T00:00:00'),
  cohort(2611, '2026-11-09T00:00:00'),
  cohort(2701, '2027-01-11T00:00:00'),
  cohort(2703, '2027-03-08T00:00:00'),
];

// Fake fetch: answers portal.status with portal.body (JSON unless a string), or throws portal.error.
let portal;
let calls;
let time;
let logs;

const fakeFetch = async (url, init) => {
  calls.push({ url, init });
  if (portal.error) throw Object.assign(new Error('fail'), { name: portal.error });
  if (portal.wait) await portal.wait;
  const body = typeof portal.body === 'string' ? portal.body : JSON.stringify(portal.body);
  return new Response(body, { status: portal.status });
};

const config = (extra = {}) => ({
  portalUrl: PORTAL_URL,
  apiKey: API_KEY,
  fetch: fakeFetch,
  log: (line) => logs.push(line),
  now: () => time,
  ...extra,
});

beforeEach(async () => {
  portal = { status: 200, body: PORTAL };
  calls = [];
  time = TODAY;
  logs = [];
  await rm(join(dir, 'state'), { recursive: true, force: true });
});

after(() => rm(dir, { recursive: true }));

test('asks the portal for its cohorts with the api key', async () => {
  await cohortsHandler(config())();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'http://portal.test/api/v1/cohorts');
  assert.equal(calls[0].init.headers['api-key'], API_KEY);
  assert.equal(calls[0].init.method ?? 'GET', 'GET');
});

test('answers the program and start date of each cohort, sorted, nothing else', async () => {
  const result = await cohortsHandler(config())();
  assert.equal(result.status, 200);
  assert.equal(result.note, 'portal=200');
  assert.equal(result.headers['Cache-Control'], 'public, max-age=300');
  assert.deepEqual(result.body, {
    cohorts: [
      { program: 'fsd', start: '2026-11-09' },
      { program: 'fsd', start: '2026-12-07' },
      { program: 'fsd', start: '2027-01-11' },
    ],
    windowDays: 90,
    asOf: '2026-10-13T12:00:00.000Z',
  });
  const text = JSON.stringify(result.body);
  for (const secret of ['FSD', 'St. Pete', 'Développement', '2611', 'facility', 'name', 'id"']) {
    assert.ok(!text.includes(secret), secret);
  }
});

test('shows the dates after today (UTC) and up to 90 days later', () => {
  const at = (start) => ({ program: 'fsd', start });
  const list = ['2026-10-12', '2026-10-13', '2026-10-14', '2027-01-11', '2027-01-12'].map(at);
  assert.deepEqual(inWindow(list, TODAY), [at('2026-10-14'), at('2027-01-11')]);
  // Until midnight UTC it is still the 13th; then the window moves a day.
  assert.equal(inWindow(list, Date.parse('2026-10-13T23:59:59Z')).length, 2);
  const next = inWindow(list, Date.parse('2026-10-14T00:00:00Z'));
  assert.deepEqual(next, [at('2027-01-11'), at('2027-01-12')]);
});

test('drops duplicates, cohorts without a start date and programs the site does not show', () => {
  const list = [
    cohort(1, '2026-11-09T00:00:00'),
    cohort(2, '2026-11-09T00:00:00'),
    cohort(3, null),
    cohort(4, 'soon'),
    cohort(5, '2026-11-16T00:00:00', 43),
    cohort(6, '2026-11-23T00:00:00', 44),
    cohort(7, '2026-11-30T00:00:00', 44),
    { ...cohort(8, '2026-12-07T00:00:00'), programId: '31' },
    null,
  ];
  const unmapped = new Set();
  const lines = [];
  assert.deepEqual(
    toPublic(list, unmapped, (line) => lines.push(line)),
    [{ program: 'fsd', start: '2026-11-09' }]
  );
  // Once per program, by its ID only.
  assert.deepEqual(lines, [
    'cohorts unmapped-program=43',
    'cohorts unmapped-program=44',
    'cohorts unmapped-program=invalid',
  ]);
  toPublic(list, unmapped, (line) => lines.push(line));
  assert.equal(lines.length, 3);
});

test('serves the cached answer for 10 minutes, then asks the portal again', async () => {
  const handler = cohortsHandler(config());
  await handler();
  time += 10 * MINUTE - 1;
  const cached = await handler();
  assert.equal(cached.note, 'cache');
  assert.equal(cached.body.asOf, '2026-10-13T12:00:00.000Z');
  assert.equal(calls.length, 1);
  time += 1;
  const refreshed = await handler();
  assert.equal(refreshed.note, 'portal=200');
  assert.equal(refreshed.body.asOf, '2026-10-13T12:10:00.000Z');
  assert.equal(calls.length, 2);
});

test('shares one portal call between requests that arrive during it', async () => {
  let answer;
  portal.wait = new Promise((resolve) => (answer = resolve));
  const handler = cohortsHandler(config());
  const pending = [handler(), handler(), handler()];
  answer();
  const results = await Promise.all(pending);
  assert.equal(calls.length, 1);
  assert.deepEqual(
    results.map((r) => r.status),
    [200, 200, 200]
  );
});

test('serves the last good answer when the portal fails, dropping dates that have passed', async () => {
  const handler = cohortsHandler(config());
  await handler();
  const failures = [
    [{ status: 500 }, 'portal=500 stale'],
    [{ status: 401 }, 'portal=401 stale'],
    [{ status: 302 }, 'portal=302 stale'],
    [{ status: 200, body: 'not json' }, 'portal=invalid stale'],
    [{ status: 200, body: { cohorts: [] } }, 'portal=invalid stale'],
    [{ error: 'TimeoutError' }, 'portal=timeout stale'],
    [{ error: 'TypeError' }, 'portal=error stale'],
  ];
  for (const [answer, note] of failures) {
    portal = answer;
    time += 2 * DAY;
    const result = await handler();
    assert.equal(result.status, 200);
    assert.equal(result.note, note);
    assert.equal(result.body.asOf, '2026-10-13T12:00:00.000Z');
  }
  // Now 2026-10-27: the 2026-11-09 start is still ahead; two weeks later it has passed.
  time += 14 * DAY;
  const { body } = await handler();
  assert.deepEqual(
    body.cohorts.map((c) => c.start),
    ['2026-12-07', '2027-01-11']
  );
});

test('waits a minute after a failure before asking the portal again', async () => {
  const handler = cohortsHandler(config());
  await handler();
  portal = { status: 503 };
  time += 10 * MINUTE;
  await handler();
  time += MINUTE - 1;
  assert.equal((await handler()).note, 'stale');
  assert.equal(calls.length, 2);
  portal = { status: 200, body: PORTAL };
  time += 1;
  assert.equal((await handler()).note, 'portal=200');
  assert.equal(calls.length, 3);
});

test('answers 503 when the portal fails and there is no copy, 401 included', async () => {
  for (const status of [401, 500]) {
    portal = { status };
    const result = await cohortsHandler(config())();
    assert.equal(result.status, 503);
    assert.equal(result.note, `portal=${status}`);
    assert.deepEqual(result.body, { error: 'cohorts unavailable' });
    assert.equal(result.headers, undefined);
  }
});

test('keeps the last good answer in the file for after a restart', async () => {
  await cohortsHandler(config({ cohortsFile: file }))();
  const saved = JSON.parse(await readFile(file, 'utf8'));
  assert.equal(saved.asOf, '2026-10-13T12:00:00.000Z');
  assert.ok(!JSON.stringify(saved).includes('FSD'));

  // Restarted within 10 minutes: the saved copy is fresh, the portal isn't asked.
  time += 5 * MINUTE;
  const restarted = await cohortsHandler(config({ cohortsFile: file }))();
  assert.equal(restarted.note, 'cache');
  assert.equal(calls.length, 1);

  // Restarted later with the portal down: the saved copy, with its time.
  portal = { status: 500 };
  time += DAY;
  const stale = await cohortsHandler(config({ cohortsFile: file }))();
  assert.equal(stale.status, 200);
  assert.equal(stale.note, 'portal=500 stale');
  assert.equal(stale.body.asOf, '2026-10-13T12:00:00.000Z');
  assert.equal(stale.body.cohorts.length, 3);

  // A failure leaves the file as it was.
  assert.deepEqual(JSON.parse(await readFile(file, 'utf8')), saved);
});

test('ignores a saved file it cannot use', async () => {
  for (const text of ['{', '{"asOf":"x","cohorts":[]}', '{"asOf":"2026-10-13","cohorts":[{}]}']) {
    await mkdir(join(dir, 'state'), { recursive: true });
    await writeFile(file, text);
    portal = { status: 500 };
    logs = [];
    const result = await cohortsHandler(config({ cohortsFile: file }))();
    assert.equal(result.status, 503);
    assert.deepEqual(logs, ['cohorts load-error=invalid']);
  }
});

test('serves GET and HEAD over http with the cache header; other methods 405', async () => {
  const lines = [];
  const relay = createServer(config({ log: (line) => lines.push(line) }));
  await new Promise((resolve) => relay.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${relay.address().port}/api/cohorts`;
  try {
    const get = await fetch(url);
    assert.equal(get.status, 200);
    assert.equal(get.headers.get('cache-control'), 'public, max-age=300');
    assert.equal(get.headers.get('content-type'), 'application/json');
    const body = await get.json();
    assert.equal(body.ok, true);
    assert.equal(body.cohorts.length, 3);

    const head = await fetch(url, { method: 'HEAD' });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), '');

    for (const method of ['POST', 'PUT', 'DELETE']) {
      const res = await fetch(url, { method });
      assert.equal(res.status, 405);
      assert.equal(res.headers.get('allow'), 'GET, HEAD');
      assert.equal(res.headers.get('cache-control'), null);
    }
    assert.equal(calls.length, 1);
    assert.match(lines[0], /^GET \/api\/cohorts 200 \d+ms portal=200$/);
    assert.match(lines[1], /^HEAD \/api\/cohorts 200 \d+ms cache$/);
  } finally {
    relay.close();
  }
});
