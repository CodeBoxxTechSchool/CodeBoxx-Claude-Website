import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PRODUCT, refundDue } from '../coaching.js';

const ORDER = 'cs_test_a1B2c3D4e5F6g7H8';
const OTHER = 'cs_test_z9Y8x7W6v5U4t3S2';
const STRIPE = 'https://api.stripe.com/v1';
const DUE = 'https://portal.test/api/v1/live-help/refunds/due';
const MARK = 'https://portal.test/api/v1/live-help/refunds/';

// A call that marks an order refunded (the list, GET .../refunds/due, shares the prefix).
const marking = (c) => c.method === 'POST' && c.url.startsWith(MARK);

const session = (id, extra = {}) => ({
  id,
  amount_total: 20000,
  payment_intent: `pi_${id.slice(-6)}`,
  metadata: { product: PRODUCT },
  ...extra,
});

// A fake Stripe and portal: `answers` maps "METHOD url-prefix" to [status, body] or a function.
function fake(answers) {
  const calls = [];
  const fetch = async (url, init = {}) => {
    const method = init.method ?? 'GET';
    calls.push({ method, url, ...init });
    const key = Object.keys(answers)
      .filter((k) => `${method} ${url}`.startsWith(k))
      .sort((a, b) => b.length - a.length)[0];
    if (!key) throw new Error(`no answer for ${method} ${url}`);
    const answer = answers[key];
    const [status, body] = typeof answer === 'function' ? answer(url, init) : answer;
    return new Response(body === undefined ? null : JSON.stringify(body), { status });
  };
  return { fetch, calls };
}

const config = (fetch, logs = []) => ({
  portalUrl: 'https://portal.test',
  apiKey: 'website-key',
  stripeSecretKey: 'sk_test_key',
  fetch,
  log: (line) => logs.push(line),
});

test('refunds each order owed a refund in full, keyed by order, then marks it on the portal', async () => {
  const { fetch, calls } = fake({
    [`GET ${DUE}`]: [200, [{ orderId: ORDER, email: 'ada@example.com', reason: 'expired' }]],
    [`GET ${STRIPE}/checkout/sessions/${ORDER}`]: [200, session(ORDER)],
    [`POST ${STRIPE}/refunds`]: [200, { id: 're_1', status: 'succeeded' }],
    [`POST ${MARK}`]: [204],
  });
  const logs = [];
  assert.deepEqual(await refundDue(config(fetch, logs)), { due: 1, refunded: 1, failed: 0 });

  const refund = calls.find((c) => c.url === `${STRIPE}/refunds`);
  assert.equal(refund.headers['idempotency-key'], `${PRODUCT}-refund-${ORDER}`);
  const sent = new URLSearchParams(refund.body);
  assert.equal(sent.get('payment_intent'), 'pi_F6g7H8');
  assert.equal(sent.get('amount'), null, 'a full refund');
  assert.equal(sent.get('metadata[reason]'), 'expired');
  const mark = calls.find(marking);
  assert.equal(mark.url, `${MARK}${ORDER}`);
  assert.equal(mark.headers['api-key'], 'website-key');
  assert.ok(logs.every((line) => !line.includes('ada@example.com')));
});

test('a failed Stripe refund is not marked, so the next pass tries it again', async () => {
  const { fetch, calls } = fake({
    [`GET ${DUE}`]: [200, [{ orderId: ORDER, reason: 'cancelled' }]],
    [`GET ${STRIPE}/checkout/sessions/${ORDER}`]: [200, session(ORDER)],
    [`POST ${STRIPE}/refunds`]: [500, { error: {} }],
  });
  assert.deepEqual(await refundDue(config(fetch)), { due: 1, refunded: 0, failed: 1 });
  assert.ok(!calls.some(marking));
});

test('an order refunded already, or paid nothing with a promotion code, is marked without a new refund', async () => {
  const { fetch, calls } = fake({
    [`GET ${DUE}`]: [200, [{ orderId: ORDER }, { orderId: OTHER }]],
    [`GET ${STRIPE}/checkout/sessions/${ORDER}`]: [200, session(ORDER)],
    [`GET ${STRIPE}/checkout/sessions/${OTHER}`]: [
      200,
      session(OTHER, { amount_total: 0, payment_intent: null }),
    ],
    [`POST ${STRIPE}/refunds`]: [400, { error: { code: 'charge_already_refunded' } }],
    [`POST ${MARK}`]: [204],
  });
  assert.deepEqual(await refundDue(config(fetch)), { due: 2, refunded: 2, failed: 0 });
  assert.equal(calls.filter((c) => c.url === `${STRIPE}/refunds`).length, 1);
  assert.equal(calls.filter(marking).length, 2);
});

test('skips what is not a coaching checkout, and changes nothing when the portal list fails', async () => {
  const other = fake({
    [`GET ${DUE}`]: [200, [{ orderId: ORDER }, { orderId: 'wix-123' }]],
    [`GET ${STRIPE}/checkout/sessions/${ORDER}`]: [
      200,
      session(ORDER, { metadata: { product: 'forge' } }),
    ],
  });
  assert.deepEqual(await refundDue(config(other.fetch)), { due: 2, refunded: 0, failed: 1 });
  assert.ok(!other.calls.some((c) => c.method === 'POST'));

  for (const answer of [
    [404, {}],
    [200, { not: 'a list' }],
  ]) {
    const down = fake({ [`GET ${DUE}`]: answer });
    const logs = [];
    assert.deepEqual(await refundDue(config(down.fetch, logs)), { due: 0, refunded: 0, failed: 0 });
    assert.equal(down.calls.length, 1);
    assert.match(logs[0], /^refunds portal=(404|invalid)$/);
  }
});

test('does nothing without the Stripe key', async () => {
  const { fetch, calls } = fake({});
  assert.deepEqual(await refundDue({ ...config(fetch), stripeSecretKey: undefined }), {
    due: 0,
    refunded: 0,
    failed: 0,
  });
  assert.equal(calls.length, 0);
});
