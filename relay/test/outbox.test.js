import assert from 'node:assert/strict';
import { mkdtemp, readdir, rm, utimes, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, test } from 'node:test';
import { enqueue, resendQueued, startResending } from '../outbox.js';

const HOUR = 60 * 60 * 1000;
const ID = '3f2b8c1e-9a4d-4e6f-8b7a-1c2d3e4f5a6b';
const LEAD = { Email: 'ada@example.com', SubmissionId: ID };

let dir;
let clock;
let answer; // the portal's status, or 'timeout' / 'error'
let calls;
let logs;
let config;

// Fake fetch standing in for the portal.
async function fetch(url, init) {
  calls.push({ url, body: JSON.parse(init.body) });
  if (answer === 'timeout') throw new DOMException('timed out', 'TimeoutError');
  if (answer === 'error') throw new TypeError('fetch failed');
  return new Response(null, { status: answer });
}

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'outbox-'));
  clock = Date.parse('2026-09-29T12:00:00Z');
  answer = 201;
  calls = [];
  logs = [];
  config = {
    portalUrl: 'http://portal.test/',
    apiKey: 'k',
    fetch,
    log: (l) => logs.push(l),
    outboxDir: dir,
    now: () => clock,
  };
  await enqueue(dir, ID, 'enroll', LEAD, clock);
  clock += HOUR;
});

afterEach(() => rm(dir, { recursive: true }));

test('resends a queued submission and deletes it once received, a repeated ID included', async () => {
  for (const status of [201, 409]) {
    answer = status;
    await enqueue(dir, ID, 'enroll', LEAD, clock);
    await resendQueued(config);
    assert.deepEqual(calls.at(-1), { url: 'http://portal.test/api/v1/leads', body: LEAD });
    assert.deepEqual(await readdir(dir), []);
    assert.equal(logs.at(-1), `resend ${ID}.json portal=${status} received`);
  }
});

test('resends a contact or pitch submission to the form submissions endpoint', async () => {
  for (const kind of ['contact', 'pitch']) {
    for (const status of [201, 409]) {
      answer = status;
      await enqueue(dir, ID, kind, { submissionId: ID }, clock);
      await resendQueued(config);
      assert.equal(calls.at(-1).url, 'http://portal.test/api/v1/form-submissions');
      assert.deepEqual(await readdir(dir), []);
      assert.equal(
        logs.at(-1),
        `resend ${ID}.json portal=${status} ${status === 201 ? 'received' : 'refused'}`
      );
    }
  }
});

test('keeps it on a portal 5xx, timeout or network error', async () => {
  for (const status of [500, 'timeout', 'error']) {
    answer = status;
    await resendQueued(config);
    assert.deepEqual(await readdir(dir), [`${ID}.json`]);
    assert.equal(logs.at(-1), `resend ${ID}.json portal=${status} kept`);
  }
});

test('deletes it when the portal refuses it', async () => {
  answer = 400;
  await resendQueued(config);
  assert.deepEqual(await readdir(dir), []);
  assert.equal(logs[0], `resend ${ID}.json portal=400 refused`);
});

test('gives up 72 hours after the first failure, retries included, without calling the portal', async () => {
  answer = 500;
  clock += 71 * HOUR;
  await enqueue(dir, ID, 'enroll', LEAD, clock);
  await resendQueued(config);
  assert.deepEqual(await readdir(dir), [`${ID}.json`]);
  clock += 1;
  await resendQueued(config);
  assert.deepEqual(await readdir(dir), []);
  assert.equal(calls.length, 1);
  assert.equal(logs.at(-1), `resend ${ID}.json gave-up`);
});

test('leaves an unreadable file until it is 72 hours old', async () => {
  const name = `${ID.replace('3', '4')}.json`;
  const file = join(dir, name);
  const writtenAt = (hoursAgo) => new Date(clock - hoursAgo * HOUR);
  await writeFile(file, '{"kind":');
  await utimes(file, writtenAt(71), writtenAt(71));
  await resendQueued(config);
  assert.ok((await readdir(dir)).includes(name));
  assert.ok(logs.includes(`resend ${name} unreadable`));
  await utimes(file, writtenAt(73), writtenAt(73));
  await resendQueued(config);
  assert.ok(!(await readdir(dir)).includes(name));
  assert.ok(logs.includes(`resend ${name} gave-up`));
});

test('resends at startup', async () => {
  await startResending(config);
  assert.equal(calls.length, 1);
  assert.deepEqual(await readdir(dir), []);
});
