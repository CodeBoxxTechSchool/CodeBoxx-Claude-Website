import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { COHORTS_URL, loadStarts } from '../cohorts.js';

// 2026-10-13, 14:00 UTC: the window runs from 2026-10-14 to 2027-01-11.
const NOW = Date.parse('2026-10-13T14:00:00Z');
const AS_OF = '2026-10-13T13:55:00.000Z';
const ANSWER = {
  ok: true,
  cohorts: [
    { program: 'fsd', start: '2026-11-09' },
    { program: 'fsd', start: '2027-01-11' },
  ],
  windowDays: 90,
  asOf: AS_OF,
};

function jsonFetch(status, body, calls = []) {
  return async (url, init) => {
    calls.push({ url, init });
    return new Response(typeof body === 'string' ? body : JSON.stringify(body), { status });
  };
}

// Runs loadStarts with a quiet log; `logs` and `warnings` collect what it printed.
function load(options) {
  const logs = [];
  const warnings = [];
  const run = loadStarts({
    env: {},
    strict: true,
    now: () => NOW,
    log: (line) => logs.push(line),
    warn: (line) => warnings.push(line),
    ...options,
  });
  return { run, logs, warnings };
}

test('a valid answer gives the start dates per program, from the default URL', async () => {
  const calls = [];
  const { run, logs, warnings } = load({ fetch: jsonFetch(200, ANSWER, calls) });
  assert.deepEqual(await run, { fsd: ['2026-11-09', '2027-01-11'], ai: [] });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, COHORTS_URL);
  assert.ok(calls[0].init.signal instanceof AbortSignal);
  assert.match(
    logs[0],
    /fsd: 2026-11-09, 2027-01-11; ai: none .*as of 2026-10-13T13:55:00.000Z, 0 h old/
  );
  assert.deepEqual(warnings, []);
});

test('COHORTS_URL replaces the default URL', async () => {
  const calls = [];
  const url = 'http://127.0.0.1:8787/api/cohorts';
  const { run } = load({ env: { COHORTS_URL: url }, fetch: jsonFetch(200, ANSWER, calls) });
  await run;
  assert.equal(calls[0].url, url);
});

test('drops starts that are today or past, or more than 90 days away, and duplicates', async () => {
  const cohorts = [
    { program: 'fsd', start: '2026-10-13' },
    { program: 'fsd', start: '2026-09-14' },
    { program: 'fsd', start: '2026-10-14' },
    { program: 'fsd', start: '2026-10-14' },
    { program: 'fsd', start: '2027-01-11' },
    { program: 'fsd', start: '2027-01-12' },
    { program: 'ai', start: '2026-12-01' },
  ];
  const { run } = load({ fetch: jsonFetch(200, { ...ANSWER, cohorts }) });
  assert.deepEqual(await run, { fsd: ['2026-10-14', '2027-01-11'], ai: ['2026-12-01'] });
});

test('an empty list is a valid answer: no dates, no error', async () => {
  const { run, warnings } = load({ fetch: jsonFetch(200, { ...ANSWER, cohorts: [] }) });
  assert.deepEqual(await run, { fsd: [], ai: [] });
  assert.deepEqual(warnings, []);
});

test('a 503 from the relay fails the build', async () => {
  const { run } = load({ fetch: jsonFetch(503, { ok: false, error: 'cohorts unavailable' }) });
  await assert.rejects(run, /HTTP 503 \(cohorts unavailable\)\. Build stopped/);
});

test('a non-JSON error page fails the build with its status', async () => {
  const { run } = load({ fetch: jsonFetch(502, '<html>Bad gateway</html>') });
  await assert.rejects(run, /HTTP 502\. Build stopped/);
});

test('invalid JSON or a bad shape fails the build', async () => {
  const bad = [
    ['not json', /invalid JSON/],
    [{ ...ANSWER, ok: false }, /not an \{ ok: true/],
    [{ ...ANSWER, cohorts: {} }, /not an \{ ok: true/],
    [{ ...ANSWER, asOf: undefined }, /no valid asOf/],
    [{ ...ANSWER, cohorts: [{ program: 'fsd', start: '2026-11-09T00:00:00' }] }, /invalid start/],
    [{ ...ANSWER, cohorts: [{ program: 'fsd', start: '2026-02-30' }] }, /invalid start/],
    [{ ...ANSWER, cohorts: [{ program: 'xyz', start: 'soon' }] }, /invalid start/],
    [{ ...ANSWER, cohorts: [{ program: 7, start: '2026-11-09' }] }, /invalid cohort/],
    [{ ...ANSWER, cohorts: [null] }, /invalid cohort/],
  ];
  for (const [body, error] of bad) {
    const { run } = load({ fetch: jsonFetch(200, body) });
    await assert.rejects(run, error, JSON.stringify(body));
  }
});

test("a program the site doesn't show is skipped, with one warning per program", async () => {
  const cohorts = [
    ...ANSWER.cohorts,
    { program: 'xyz', start: '2026-11-16' },
    { program: 'xyz', start: '2026-12-07' },
    { program: 'toString', start: '2026-11-09' },
  ];
  const { run, warnings } = load({ fetch: jsonFetch(200, { ...ANSWER, cohorts }) });
  assert.deepEqual(await run, { fsd: ['2026-11-09', '2027-01-11'], ai: [] });
  assert.equal(warnings.length, 2);
  assert.match(warnings[0], /skipped program "xyz"/);
  assert.match(warnings[1], /skipped program "toString"/);
});

test('a network error fails the build', async () => {
  const fetch = async () => {
    throw new TypeError('fetch failed');
  };
  await assert.rejects(load({ fetch }).run, /no start dates from .*: fetch failed/);
});

test('an answer that takes longer than the timeout fails the build', async () => {
  // Waits for the abort, as fetch does.
  const fetch = (url, { signal }) =>
    new Promise((resolve, reject) => signal.addEventListener('abort', () => reject(signal.reason)));
  await assert.rejects(load({ fetch, timeoutMs: 20 }).run, /TimeoutError|timeout|aborted/i);
});

test('outside a production build (astro dev), a failure warns and gives no dates', async () => {
  const { run, warnings } = load({ strict: false, fetch: jsonFetch(503, { ok: false }) });
  assert.deepEqual(await run, { fsd: [], ai: [] });
  assert.match(warnings[0], /HTTP 503; building without start dates/);
});

test('a copy older than two days warns but still gives its dates', async () => {
  const asOf = '2026-10-10T12:00:00.000Z';
  const { run, warnings } = load({ fetch: jsonFetch(200, { ...ANSWER, asOf }) });
  assert.deepEqual((await run).fsd, ['2026-11-09', '2027-01-11']);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /74 h old: the portal hasn't answered it since 2026-10-10/);
});

test('COHORTS_FILE is read instead of the URL, with the same checks and window', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'cohorts-'));
  try {
    const file = join(dir, 'cohorts.json');
    const cohorts = [...ANSWER.cohorts, { program: 'fsd', start: '2026-10-01' }];
    await writeFile(file, JSON.stringify({ ...ANSWER, cohorts }));
    const fetch = () => assert.fail('no fetch with COHORTS_FILE');
    const { run, logs } = load({ env: { COHORTS_FILE: file, COHORTS_URL: 'x' }, fetch });
    assert.deepEqual(await run, { fsd: ['2026-11-09', '2027-01-11'], ai: [] });
    assert.ok(logs[0].includes(file));

    await writeFile(file, JSON.stringify({ ok: true }));
    await assert.rejects(load({ env: { COHORTS_FILE: file } }).run, /not an \{ ok: true/);
    const missing = join(dir, 'missing.json');
    await assert.rejects(load({ env: { COHORTS_FILE: missing } }).run, /ENOENT/);
  } finally {
    await rm(dir, { recursive: true });
  }
});
