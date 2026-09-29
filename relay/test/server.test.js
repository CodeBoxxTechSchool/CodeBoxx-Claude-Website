import assert from 'node:assert/strict';
import { mkdtemp, readdir, readFile, rm, stat } from 'node:fs/promises';
import http from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, beforeEach, test } from 'node:test';
import { enqueue, resendQueued } from '../outbox.js';
import { createServer } from '../server.js';
import { base64, CAREERS, CONTACT, PDF, PITCH, VALID } from './fixtures.js';

const API_KEY = 'test-key';
const NOW = Date.parse('2026-09-29T12:00:00Z');
const ID = '3f2b8c1e-9a4d-4e6f-8b7a-1c2d3e4f5a6b';
const outboxDir = join(await mkdtemp(join(tmpdir(), 'relay-')), 'outbox');
const MB = 1024 * 1024;

// Fake portal: answers portalStatus, or never answers when portalStatus is null.
let portalStatus;
let portalRequests;
const portal = http.createServer((req, res) => {
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', () => {
    portalRequests.push({ url: req.url, headers: req.headers, body: JSON.parse(body) });
    if (portalStatus !== null) res.writeHead(portalStatus).end('{"email":"ada@example.com"}');
  });
});

let logs;
let relayUrl;
let relay;

async function listen(server) {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return `http://127.0.0.1:${server.address().port}`;
}

function startRelay(portalUrl) {
  relay = createServer({
    portalUrl,
    apiKey: API_KEY,
    timeoutMs: 200,
    log: (l) => logs.push(l),
    outboxDir,
    now: () => NOW,
  });
  return listen(relay);
}

before(async () => {
  relayUrl = await startRelay(await listen(portal));
});

after(() => {
  relay.close();
  portal.closeAllConnections();
  portal.close();
  return rm(join(outboxDir, '..'), { recursive: true });
});

beforeEach(async () => {
  portalStatus = 201;
  portalRequests = [];
  logs = [];
  await rm(outboxDir, { recursive: true, force: true });
});

const queued = () => readdir(outboxDir).catch(() => []);

const post = (path, body, headers = { 'content-type': 'application/json' }) =>
  fetch(`${relayUrl}${path}`, {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

async function expect(res, status) {
  assert.equal(res.status, status);
  assert.equal((await res.json()).ok, status === 200);
}

test('forwards a valid lead to the portal with the api key', async () => {
  await expect(await post('/api/enroll', VALID), 200);
  assert.equal(portalRequests.length, 1);
  const [{ url, headers, body }] = portalRequests;
  assert.equal(url, '/api/v1/leads');
  assert.equal(headers['api-key'], API_KEY);
  assert.equal(body.Email, 'ada@example.com');
  assert.equal(body.SendEmails, true);
  assert.match(logs[0], /^POST \/api\/enroll 200 \d+ms portal=201$/);
});

test('maps each portal outcome', async () => {
  for (const [status, expected] of [
    [201, 200],
    [409, 200],
    [400, 502],
    [401, 502],
    [500, 502],
    [302, 502],
  ]) {
    portalStatus = status;
    await expect(await post('/api/enroll', VALID), expected);
    assert.match(logs.at(-1), new RegExp(` ${expected} \\d+ms portal=${status}$`));
  }
});

test('answers 502 when the portal times out', async () => {
  portalStatus = null;
  await expect(await post('/api/enroll', VALID), 502);
  assert.match(logs[0], /portal=timeout$/);
  assert.deepEqual(await queued(), []);
});

test('passes the submission ID and clears a queued copy once received', async () => {
  await enqueue(outboxDir, ID, 'enroll', {});
  for (const status of [201, 409]) {
    portalStatus = status;
    await expect(await post('/api/enroll', { ...VALID, submissionId: ID.toUpperCase() }), 200);
    assert.equal(portalRequests.at(-1).body.SubmissionId, ID);
    assert.deepEqual(await queued(), []);
  }
});

test('queues a submission on a portal 5xx or timeout, not on a 4xx', async () => {
  for (const [status, expected] of [
    [400, false],
    [500, true],
    [503, true],
    [null, true],
  ]) {
    await rm(outboxDir, { recursive: true, force: true });
    portalStatus = status;
    await expect(await post('/api/enroll', { ...VALID, submissionId: ID }), 502);
    assert.deepEqual(await queued(), expected ? [`${ID}.json`] : [], String(status));
  }
  assert.match(logs.at(-1), new RegExp(`portal=timeout queued=${ID}$`));
  const file = join(outboxDir, `${ID}.json`);
  assert.deepEqual(JSON.parse(await readFile(file, 'utf8')), {
    kind: 'enroll',
    body: portalRequests.at(-1).body,
    queuedAt: '2026-09-29T12:00:00.000Z',
  });
  assert.equal((await stat(outboxDir)).mode & 0o777, 0o700);
  assert.equal((await stat(file)).mode & 0o777, 0o600);
});

test('queues nothing without a submission ID', async () => {
  portalStatus = 500;
  await expect(await post('/api/enroll', VALID), 502);
  assert.deepEqual(await queued(), []);
});

test('answers 502 when the portal is unreachable', async () => {
  const closed = http.createServer();
  const deadUrl = await listen(closed);
  closed.close();
  const saved = relayUrl;
  const savedRelay = relay;
  relayUrl = await startRelay(deadUrl);
  try {
    await expect(await post('/api/enroll', { ...VALID, submissionId: ID }), 502);
    assert.match(logs[0], new RegExp(`portal=error queued=${ID}$`));
    assert.deepEqual(await queued(), [`${ID}.json`]);
  } finally {
    relay.close();
    relay = savedRelay;
    relayUrl = saved;
  }
});

test('forwards contact, pitch and careers submissions to the portal, queuing only a 5xx', async () => {
  for (const [path, body, kind] of [
    ['/api/contact', CONTACT, 'contact'],
    ['/api/pitch', PITCH, 'pitch'],
    ['/api/careers', CAREERS, 'careers'],
  ]) {
    for (const [status, expected, queues] of [
      [201, 200, false],
      [400, 502, false],
      [409, 502, false],
      [500, 502, true],
    ]) {
      await rm(outboxDir, { recursive: true, force: true });
      portalStatus = status;
      await expect(await post(path, body), expected);
      const request = portalRequests.at(-1);
      assert.equal(request.url, '/api/v1/form-submissions');
      assert.equal(request.headers['api-key'], API_KEY);
      assert.equal(request.body.form, kind);
      assert.equal(request.body.submissionId, ID);
      assert.equal(request.body.consentAt, '2026-09-29T12:00:00.000Z');
      assert.deepEqual(await queued(), queues ? [`${ID}.json`] : [], `${kind} ${status}`);
    }
    const file = JSON.parse(await readFile(join(outboxDir, `${ID}.json`), 'utf8'));
    assert.equal(file.kind, kind);
    assert.deepEqual(file.body, portalRequests.at(-1).body);
  }
  assert.deepEqual(portalRequests.at(-1).body.cv, CAREERS.cv);
});

test('takes a body of up to 8 MB on the careers route only', async () => {
  await expect(await post('/api/contact', { ...CONTACT, pad: 'x'.repeat(16 * 1024) }), 413);
  const pdf = Buffer.concat([PDF, Buffer.alloc(5 * MB - PDF.length, 0x20)]);
  const cv = { fileName: 'cv.pdf', content: base64(pdf) };
  await expect(await post('/api/careers', { ...CAREERS, cv }), 200);
  assert.equal(portalRequests.length, 1);
  assert.equal(portalRequests[0].body.cv.content, cv.content);
  await expect(await post('/api/careers', { ...CAREERS, pad: 'x'.repeat(8 * MB) }), 413);
  assert.equal(portalRequests.length, 1);
});

test('rejects a CV the portal would refuse without calling it', async () => {
  const cv = { fileName: 'cv.pdf', content: base64(Buffer.from('not a pdf')) };
  const res = await post('/api/careers', { ...CAREERS, cv });
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { ok: false, errors: ['cv'] });
  assert.equal(portalRequests.length, 0);
  assert.match(logs[0], /^POST \/api\/careers 400 \d+ms invalid=cv$/);
});

test('resends a queued contact submission with the time the visitor consented', async () => {
  portalStatus = 500;
  await expect(await post('/api/contact', CONTACT), 502);
  portalStatus = 201;
  await resendQueued({
    portalUrl: `http://127.0.0.1:${portal.address().port}`,
    apiKey: API_KEY,
    outboxDir,
    log: (l) => logs.push(l),
    now: () => NOW + 3 * 60 * 60 * 1000,
  });
  assert.equal(portalRequests.length, 2);
  assert.deepEqual(portalRequests[1].body, portalRequests[0].body);
  assert.equal(portalRequests[1].body.consentAt, '2026-09-29T12:00:00.000Z');
  assert.deepEqual(await queued(), []);
});

test('requires a submission ID and consent on contact and pitch', async () => {
  await expect(await post('/api/contact', { ...CONTACT, submissionId: undefined }), 400);
  await expect(await post('/api/pitch', { ...PITCH, consent: false }), 400);
  await expect(await post('/api/pitch', { ...PITCH, website: 'spam' }), 200);
  assert.equal(portalRequests.length, 0);
  assert.match(logs[0], /400 \d+ms invalid=submissionId$/);
  assert.match(logs[1], /400 \d+ms invalid=consent$/);
  assert.match(logs[2], /200 \d+ms honeypot$/);
});

test('rejects an invalid submission without calling the portal', async () => {
  await expect(await post('/api/enroll', { ...VALID, email: 'nope', lang: 'de' }), 400);
  assert.equal(portalRequests.length, 0);
  assert.match(logs[0], /400 \d+ms invalid=lang,email$/);
});

test('answers success to a filled honeypot without calling the portal', async () => {
  await expect(await post('/api/enroll', { website: 'spam', email: 'bot' }), 200);
  assert.equal(portalRequests.length, 0);
  assert.match(logs[0], /200 \d+ms honeypot$/);
});

test('rejects bad requests', async () => {
  await expect(await post('/api/enroll', 'not json'), 400);
  await expect(await post('/api/enroll', '[1]'), 400);
  await expect(await post('/api/enroll', 'null'), 400);
  await expect(await post('/api/enroll', VALID, { 'content-type': 'text/plain' }), 415);
  await expect(await post('/api/enroll', { ...VALID, pad: 'x'.repeat(16 * 1024) }), 413);
  await expect(await post('/api/nope', VALID), 404);
  const res = await fetch(`${relayUrl}/api/enroll`);
  await expect(res, 405);
  assert.equal(res.headers.get('allow'), 'POST');
  assert.equal(portalRequests.length, 0);
});

test('caps a chunked body without a content-length', async () => {
  const postChunked = (path) =>
    new Promise((resolve, reject) => {
      const req = http.request(`${relayUrl}${path}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'transfer-encoding': 'chunked' },
      });
      req.on('response', (res) => resolve(res.statusCode));
      req.on('error', reject);
      for (let i = 0; i < 20; i++) req.write('x'.repeat(1024));
      req.end();
    });
  assert.equal(await postChunked('/api/enroll'), 413);
  // Read to the end, then refused as JSON.
  assert.equal(await postChunked('/api/careers'), 400);
});

test('answers the health check with the queue size and age, without calling the portal', async () => {
  const health = async () => (await fetch(`${relayUrl}/api/health`)).json();
  assert.deepEqual(await health(), { ok: true, queue: { size: 0, oldestAgeSeconds: null } });
  await enqueue(outboxDir, ID, 'enroll', VALID, NOW - 90_000);
  await enqueue(outboxDir, ID.replace('3', '4'), 'enroll', VALID, NOW - 5_000);
  assert.deepEqual(await health(), { ok: true, queue: { size: 2, oldestAgeSeconds: 90 } });
  assert.equal(portalRequests.length, 0);
  assert.match(logs[0], /^GET \/api\/health 200 \d+ms$/);
});

test('answers 503 to a health check with ?queue= once a submission waited longer', async () => {
  const health = (query) => fetch(`${relayUrl}/api/health?queue=${query}`);
  const empty = await health(900);
  assert.equal(empty.status, 200);
  assert.deepEqual(await empty.json(), { ok: true, queue: { size: 0, oldestAgeSeconds: null } });
  await enqueue(outboxDir, ID, 'enroll', VALID, NOW - 900_000);
  assert.equal((await health(900)).status, 200);
  const late = await health(899);
  assert.equal(late.status, 503);
  assert.deepEqual(await late.json(), { ok: false, queue: { size: 1, oldestAgeSeconds: 900 } });
  assert.equal((await fetch(`${relayUrl}/api/health`)).status, 200);
  assert.match(logs[2], /^GET \/api\/health 503 \d+ms$/);
});

test('refuses a health check whose ?queue= is not a whole number of seconds', async () => {
  for (const query of ['abc', '-1', '1.5', '']) {
    const res = await fetch(`${relayUrl}/api/health?queue=${query}`);
    assert.equal(res.status, 400, query);
    assert.deepEqual(await res.json(), { ok: false, errors: ['queue'] });
  }
  assert.match(logs[0], /^GET \/api\/health 400 \d+ms invalid=queue$/);
});

test('logs no personal data', async () => {
  await post('/api/enroll', VALID);
  await post('/api/enroll', { ...VALID, birth: '1990-02-30' });
  portalStatus = 500;
  await post('/api/enroll', { ...VALID, submissionId: ID });
  await post('/api/contact', CONTACT);
  await post('/api/pitch', { ...PITCH, phone: 'x' });
  await post('/api/careers', CAREERS);
  await post('/api/careers', { ...CAREERS, startDate: 'x', cv: { ...CAREERS.cv, content: 'x' } });
  const text = logs.join('\n').toLowerCase();
  const cv = CAREERS.cv.content.slice(0, 12).toLowerCase();
  for (const value of [
    'ada',
    'lovelace',
    '555',
    'main st',
    'g1a',
    'developer',
    '.pdf',
    cv,
    API_KEY,
  ]) {
    assert.ok(!text.includes(value), value);
  }
});
