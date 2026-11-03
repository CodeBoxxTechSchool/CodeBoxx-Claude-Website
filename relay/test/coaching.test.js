import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { test } from 'node:test';
import {
  availabilityHandler,
  checkIn,
  checkout,
  handleWebhook,
  PRICE_CENTS,
  PRODUCT,
  verifySignature,
} from '../coaching.js';
import { createServer } from '../server.js';

const NOW = Date.parse('2026-11-03T15:00:00Z');
const SECRET = 'whsec_test_secret';
const SESSION = 'cs_test_a1B2c3D4e5F6g7H8';
const PAID = {
  id: SESSION,
  payment_status: 'paid',
  metadata: { product: PRODUCT, name: 'Ada Lovelace', phone: '+1 555 0100' },
  customer_details: { email: 'ada@example.com' },
};

// A fake fetch for Stripe and the portal: records calls, answers from `answers` by URL prefix.
function fakeFetch(answers) {
  const calls = [];
  const fetch = async (url, init = {}) => {
    calls.push({ url, ...init });
    const key = Object.keys(answers).find((prefix) => url.startsWith(prefix));
    const answer = answers[key];
    if (answer instanceof Error) throw answer;
    const [status, body] = typeof answer === 'function' ? answer(url, init) : answer;
    return new Response(body === undefined ? null : JSON.stringify(body), { status });
  };
  return { fetch, calls };
}

const config = (fetch, extra = {}) => ({
  portalUrl: 'https://portal.test/',
  apiKey: 'website-key',
  stripeSecretKey: 'sk_test_key',
  stripeWebhookSecret: SECRET,
  siteUrl: 'https://codeboxx.ai',
  fetch,
  now: () => NOW,
  ...extra,
});

const STRIPE = 'https://api.stripe.com/v1';
const REGISTER = 'https://portal.test/api/v1/live-help/sessions/register';

test('checkout opens a $200 Stripe Checkout with promotion codes, back to the right page', async () => {
  const { fetch, calls } = fakeFetch({
    [`${STRIPE}/checkout/sessions`]: [200, { id: SESSION, url: 'https://checkout.stripe.com/c/x' }],
  });
  const body = { name: ' Ada Lovelace ', email: 'ada@example.com', phone: '', lang: 'fr' };
  const result = await checkout(body, config(fetch));

  assert.deepEqual(result.body, { url: 'https://checkout.stripe.com/c/x' });
  assert.equal(result.status, 200);
  const [call] = calls;
  assert.equal(call.method, 'POST');
  assert.equal(call.headers.authorization, 'Bearer sk_test_key');
  const sent = new URLSearchParams(call.body);
  assert.equal(sent.get('mode'), 'payment');
  assert.equal(sent.get('line_items[0][price_data][unit_amount]'), String(PRICE_CENTS));
  assert.equal(sent.get('line_items[0][price_data][currency]'), 'usd');
  assert.equal(sent.get('allow_promotion_codes'), 'true');
  assert.equal(sent.get('customer_email'), 'ada@example.com');
  assert.equal(sent.get('metadata[product]'), PRODUCT);
  assert.equal(sent.get('metadata[name]'), 'Ada Lovelace');
  assert.equal(sent.get('locale'), 'fr');
  assert.equal(
    sent.get('success_url'),
    'https://codeboxx.ai/fr/vibe-coaching/?session_id={CHECKOUT_SESSION_ID}'
  );
  assert.equal(sent.get('cancel_url'), 'https://codeboxx.ai/fr/vibe-coaching/?canceled=1');
});

test('checkout refuses a missing name or a bad email, and never calls Stripe', async () => {
  const { fetch, calls } = fakeFetch({});
  const result = await checkout({ name: '', email: 'nope' }, config(fetch));
  assert.equal(result.status, 400);
  assert.deepEqual(result.body.errors.sort(), ['email', 'name']);
  assert.equal(calls.length, 0);
});

test('checkout without the Stripe key, or with a Stripe error, says so', async () => {
  const body = { name: 'Ada', email: 'ada@example.com' };
  const { fetch } = fakeFetch({ [STRIPE]: [500, { error: {} }] });
  assert.equal((await checkout(body, config(fetch, { stripeSecretKey: '' }))).status, 503);
  assert.equal((await checkout(body, config(fetch))).status, 502);
  assert.equal((await checkout({ ...body, website: 'x' }, config(fetch))).note, 'honeypot');
});

test('check-in confirms the paid session, registers it and returns the portal link', async () => {
  const { fetch, calls } = fakeFetch({
    [`${STRIPE}/checkout/sessions/${SESSION}`]: [200, PAID],
    [REGISTER]: [200, { checkInUrl: '/livecoaching/abc123' }],
  });
  const result = await checkIn(new URLSearchParams({ session_id: SESSION }), config(fetch));

  assert.deepEqual(result.body, { checkInUrl: 'https://portal.test/livecoaching/abc123' });
  const register = calls.find((c) => c.url === REGISTER);
  assert.equal(register.headers['api-key'], 'website-key');
  assert.deepEqual(JSON.parse(register.body), {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    phone: '+1 555 0100',
    orderId: SESSION,
  });
});

test('check-in falls back to the name-and-email page when the portal gives no link', async () => {
  const { fetch } = fakeFetch({
    [`${STRIPE}/checkout/sessions/${SESSION}`]: [200, PAID],
    [REGISTER]: [200, undefined],
  });
  const result = await checkIn(new URLSearchParams({ session_id: SESSION }), config(fetch));
  assert.deepEqual(result.body, { checkInUrl: 'https://portal.test/livecoaching' });
});

test('check-in refuses a bad id, an unpaid or other session, and reports a portal failure', async () => {
  const query = new URLSearchParams({ session_id: SESSION });
  const cases = [
    [{ session_id: 'cs_test_x"><script>' }, {}, 400],
    [{ session_id: SESSION }, { [STRIPE]: [404, {}] }, 404],
    [{ session_id: SESSION }, { [STRIPE]: [200, { ...PAID, metadata: {} }] }, 404],
    [{ session_id: SESSION }, { [STRIPE]: [200, { ...PAID, payment_status: 'unpaid' }] }, 409],
    [{ session_id: SESSION }, { [STRIPE]: [200, PAID], [REGISTER]: [500, {}] }, 502],
  ];
  for (const [params, answers, status] of cases) {
    const { fetch } = fakeFetch(answers);
    const result = await checkIn(new URLSearchParams(params), config(fetch));
    assert.equal(
      result.status,
      status,
      JSON.stringify(params) + JSON.stringify(Object.keys(answers))
    );
  }
  assert.equal(
    (await checkIn(query, config(fakeFetch({}).fetch, { stripeSecretKey: '' }))).status,
    503
  );
});

// A Stripe-Signature header for raw, as Stripe computes it.
const sign = (raw, t = NOW / 1000, secret = SECRET) =>
  `t=${t},v1=${createHmac('sha256', secret).update(`${t}.${raw}`).digest('hex')}`;

test('verifySignature takes Stripe signatures only: right secret, recent, unaltered', () => {
  const raw = '{"id":"evt_1"}';
  assert.ok(verifySignature(raw, sign(raw), SECRET, NOW));
  assert.ok(
    verifySignature(
      raw,
      `t=${NOW / 1000},v1=${'0'.repeat(64)},${sign(raw).split(',')[1]}`,
      SECRET,
      NOW
    )
  );
  assert.ok(!verifySignature(raw, sign(raw, NOW / 1000, 'whsec_other'), SECRET, NOW));
  assert.ok(!verifySignature(raw + ' ', sign(raw), SECRET, NOW));
  assert.ok(!verifySignature(raw, sign(raw, NOW / 1000 - 301), SECRET, NOW));
  assert.ok(!verifySignature(raw, undefined, SECRET, NOW));
  assert.ok(!verifySignature(raw, 't=abc,v1=xyz', SECRET, NOW));
});

test('the webhook registers a paid coaching checkout; a portal failure asks Stripe to retry', async () => {
  const event = JSON.stringify({ type: 'checkout.session.completed', data: { object: PAID } });
  const headers = { 'stripe-signature': sign(event) };

  const ok = fakeFetch({ [REGISTER]: [200, { checkInUrl: '/livecoaching/abc123' }] });
  assert.equal((await handleWebhook({ raw: event, headers }, config(ok.fetch))).status, 200);
  assert.equal(ok.calls.length, 1);

  const down = fakeFetch({ [REGISTER]: [503, {}] });
  assert.equal((await handleWebhook({ raw: event, headers }, config(down.fetch))).status, 502);
});

test('the webhook ignores other events and products, and refuses a bad signature', async () => {
  const { fetch, calls } = fakeFetch({ [REGISTER]: [200, {}] });
  for (const event of [
    { type: 'payment_intent.created', data: { object: {} } },
    {
      type: 'checkout.session.completed',
      data: { object: { ...PAID, metadata: { product: 'forge' } } },
    },
    { type: 'checkout.session.completed', data: { object: { ...PAID, payment_status: 'unpaid' } } },
  ]) {
    const raw = JSON.stringify(event);
    const result = await handleWebhook(
      { raw, headers: { 'stripe-signature': sign(raw) } },
      config(fetch)
    );
    assert.equal(result.status, 200);
  }
  const raw = JSON.stringify({ type: 'checkout.session.completed', data: { object: PAID } });
  const forged = await handleWebhook(
    { raw, headers: { 'stripe-signature': sign(raw, NOW / 1000, 'x') } },
    config(fetch)
  );
  assert.equal(forged.status, 400);
  assert.equal(calls.length, 0);
});

test('availability relays the portal status for a minute, and keeps it a while when the portal is down', async () => {
  let time = NOW;
  let portal = [
    200,
    {
      availableNow: false,
      untilUtc: null,
      nextStartUtc: '2026-11-04T14:00:00Z',
      nextEndUtc: '2026-11-04T18:00:00Z',
      coach: 'Ada',
    },
  ];
  const { fetch, calls } = fakeFetch({
    'https://portal.test/api/v1/live-help/availability': () => portal,
  });
  const handler = availabilityHandler(config(fetch, { now: () => time }));

  const first = await handler();
  assert.deepEqual(first.body, {
    availableNow: false,
    untilUtc: null,
    nextStartUtc: '2026-11-04T14:00:00.000Z',
    nextEndUtc: '2026-11-04T18:00:00.000Z',
  });
  assert.equal(first.headers['Cache-Control'], 'public, max-age=60');

  time += 30 * 1000;
  assert.equal((await handler()).note, 'cache');
  assert.equal(calls.length, 1);

  portal = [500, {}];
  time += 60 * 1000;
  const stale = await handler();
  assert.equal(stale.status, 200);
  assert.equal(stale.note, 'portal=500');

  time += 11 * 60 * 1000;
  assert.equal((await handler()).status, 503);
});

test('the server passes the webhook its exact bytes, and answers 503 without the keys', async () => {
  const fake = fakeFetch({ [REGISTER]: [200, { checkInUrl: '/livecoaching/abc123' }] });
  const logs = [];
  const start = async (extra) => {
    const server = createServer({ ...config(fake.fetch, extra), log: (l) => logs.push(l) });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    return [server, `http://127.0.0.1:${server.address().port}`];
  };
  // Spacing a JSON parser would drop: the signature only matches the bytes as sent.
  const raw =
    '{ "type": "checkout.session.completed",  "data": { "object": ' + JSON.stringify(PAID) + ' } }';
  const [server, url] = await start({});
  try {
    const res = await fetch(`${url}/api/coaching/stripe-webhook`, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8', 'stripe-signature': sign(raw) },
      body: raw,
    });
    assert.equal(res.status, 200);
    assert.match(
      logs.at(-1),
      /^POST \/api\/coaching\/stripe-webhook 200 \d+ms registered portal=200$/
    );
  } finally {
    server.close();
  }
  const [bare, bareUrl] = await start({
    stripeSecretKey: undefined,
    stripeWebhookSecret: undefined,
  });
  try {
    const res = await fetch(`${bareUrl}/api/coaching/checkout`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Ada', email: 'ada@example.com' }),
    });
    assert.equal(res.status, 503);
    assert.deepEqual((await res.json()).errors, ['unavailable']);
  } finally {
    bare.close();
  }
  assert.ok(logs.every((line) => !line.includes('ada@example.com') && !line.includes('Lovelace')));
});
