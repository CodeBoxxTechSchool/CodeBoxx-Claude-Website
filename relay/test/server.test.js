import assert from 'node:assert/strict';
import http from 'node:http';
import { after, before, beforeEach, test } from 'node:test';
import { createServer } from '../server.js';
import { VALID } from './fixtures.js';

const API_KEY = 'test-key';

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
  relay = createServer({ portalUrl, apiKey: API_KEY, timeoutMs: 200, log: (l) => logs.push(l) });
  return listen(relay);
}

before(async () => {
  relayUrl = await startRelay(await listen(portal));
});

after(() => {
  relay.close();
  portal.closeAllConnections();
  portal.close();
});

beforeEach(() => {
  portalStatus = 201;
  portalRequests = [];
  logs = [];
});

const post = (path, body, headers = { 'content-type': 'application/json' }) =>
  fetch(`${relayUrl}${path}`, {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

async function expect(res, status) {
  assert.equal(res.status, status);
  assert.deepEqual(await res.json(), { ok: status === 200 });
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
});

test('answers 502 when the portal is unreachable', async () => {
  const closed = http.createServer();
  const deadUrl = await listen(closed);
  closed.close();
  const saved = relayUrl;
  const savedRelay = relay;
  relayUrl = await startRelay(deadUrl);
  try {
    await expect(await post('/api/enroll', VALID), 502);
    assert.match(logs[0], /portal=error$/);
  } finally {
    relay.close();
    relay = savedRelay;
    relayUrl = saved;
  }
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
  const status = await new Promise((resolve, reject) => {
    const req = http.request(`${relayUrl}/api/enroll`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'transfer-encoding': 'chunked' },
    });
    req.on('response', (res) => resolve(res.statusCode));
    req.on('error', reject);
    for (let i = 0; i < 20; i++) req.write('x'.repeat(1024));
    req.end();
  });
  assert.equal(status, 413);
});

test('answers the health check without calling the portal', async () => {
  await expect(await fetch(`${relayUrl}/api/health`), 200);
  assert.equal(portalRequests.length, 0);
  assert.match(logs[0], /^GET \/api\/health 200 \d+ms$/);
});

test('logs no personal data', async () => {
  await post('/api/enroll', VALID);
  await post('/api/enroll', { ...VALID, birth: '1990-02-30' });
  const text = logs.join('\n').toLowerCase();
  for (const value of ['ada', 'lovelace', '555', 'main st', 'g1a', API_KEY]) {
    assert.ok(!text.includes(value), value);
  }
});
