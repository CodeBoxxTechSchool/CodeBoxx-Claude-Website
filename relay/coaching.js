import { createHmac, timingSafeEqual } from 'node:crypto';
import { isEmail, isHoneypot, readFields } from './fields.js';

// Vibe Coaching (CLP-1499): a 30-minute live session with the coach on duty, $200, paid with Stripe
// Checkout. The relay holds the Stripe secret key: it opens the checkout, takes Stripe's signed
// webhook, and registers each paid purchase with the portal, which queues the buyer for a coach.
// Stripe is called over its REST API (no npm dependency); nothing personal is logged.

export const PRODUCT = 'vibe-coaching';
export const PRICE_CENTS = 20000;
export const CURRENCY = 'usd';
const ITEM_NAME = {
  en: 'Vibe Coaching: 30-minute live session',
  fr: 'Vibe Coaching : séance en direct de 30 minutes',
};
const PAGE_PATH = { en: '/vibe-coaching/', fr: '/fr/vibe-coaching/' };

const STRIPE_API = 'https://api.stripe.com/v1';
// A signed webhook older than this is refused (Stripe's own default).
const SIGNATURE_TOLERANCE_S = 300;
const SESSION_ID = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/;
// The portal's availability is served for a minute, then for 10 more when the portal is down.
const AVAILABILITY_FRESH_MS = 60 * 1000;
const AVAILABILITY_STALE_MS = 10 * 60 * 1000;
const MAX_LENGTH = { name: 200, email: 255, phone: 50 };

/**
 * The coaching routes, for createServer's table. config: { portalUrl, apiKey, stripeSecretKey?,
 * stripeWebhookSecret?, siteUrl, timeoutMs?, fetch?, now? }. Without the Stripe keys, checkout,
 * check-in and the webhook answer 503.
 */
export function coachingRoutes(config) {
  const webhook = (request) => handleWebhook(request, config);
  webhook.raw = true;
  return {
    '/api/coaching/checkout': { POST: (body) => checkout(body, config) },
    '/api/coaching/check-in': { GET: (query) => checkIn(query, config) },
    '/api/coaching/stripe-webhook': { POST: webhook },
    '/api/coaching/availability': { GET: availabilityHandler(config) },
  };
}

const unavailable = { status: 503, note: 'stripe-unconfigured', body: { errors: ['unavailable'] } };

/** Opens a Stripe Checkout for one session; answers { url } to send the browser to. */
export async function checkout(body, config) {
  if (isHoneypot(body)) return { status: 200, note: 'honeypot' };
  if (!config.stripeSecretKey) return unavailable;
  const { data, errors } = readFields(body, {
    required: ['name', 'email'],
    optional: ['phone'],
    maxLength: MAX_LENGTH,
  });
  if (data.email && !isEmail(data.email)) errors.add('email');
  if (errors.size) {
    return { status: 400, note: `invalid=${[...errors].join(',')}`, body: { errors: [...errors] } };
  }
  const lang = body.lang === 'fr' ? 'fr' : 'en';
  const page = `${config.siteUrl.replace(/\/+$/, '')}${PAGE_PATH[lang]}`;
  const params = new URLSearchParams({
    mode: 'payment',
    customer_email: data.email,
    allow_promotion_codes: 'true',
    locale: lang,
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': CURRENCY,
    'line_items[0][price_data][unit_amount]': String(PRICE_CENTS),
    'line_items[0][price_data][product_data][name]': ITEM_NAME[lang],
    'metadata[product]': PRODUCT,
    'metadata[name]': data.name,
    'metadata[phone]': data.phone,
    'payment_intent_data[metadata][product]': PRODUCT,
    success_url: `${page}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${page}?canceled=1`,
  });
  const res = await stripe('POST', '/checkout/sessions', config, params);
  if (res.status !== 200 || typeof res.body?.url !== 'string') {
    return { status: 502, note: `stripe=${res.status}`, body: { errors: ['stripe'] } };
  }
  return { status: 200, note: 'stripe=200', body: { url: res.body.url } };
}

/**
 * Back from Stripe: confirms the session is a paid coaching purchase, registers it with the portal
 * (again, if the webhook already did: the portal stores it once) and answers { checkInUrl }, the
 * portal page that puts the buyer in the queue.
 */
export async function checkIn(query, config) {
  if (!config.stripeSecretKey) return unavailable;
  const id = query.get('session_id') ?? '';
  if (!SESSION_ID.test(id))
    return { status: 400, note: 'invalid=session_id', body: { errors: ['session_id'] } };
  const res = await stripe('GET', `/checkout/sessions/${id}`, config);
  if (res.status === 404)
    return { status: 404, note: 'stripe=404', body: { errors: ['session_id'] } };
  if (res.status !== 200)
    return { status: 502, note: `stripe=${res.status}`, body: { errors: ['stripe'] } };
  const session = res.body;
  if (session.metadata?.product !== PRODUCT) {
    return { status: 404, note: 'not-coaching', body: { errors: ['session_id'] } };
  }
  if (session.payment_status !== 'paid') {
    return { status: 409, note: `payment=${session.payment_status}`, body: { errors: ['unpaid'] } };
  }
  const { status, checkInUrl } = await registerPurchase(session, config);
  if (!checkInUrl) return { status: 502, note: `portal=${status}`, body: { errors: ['portal'] } };
  return { status: 200, note: `portal=${status}`, body: { checkInUrl } };
}

/**
 * Stripe's webhook: { raw, headers }, the body exactly as sent. A paid coaching checkout is
 * registered with the portal; a 5xx makes Stripe send the event again later.
 */
export async function handleWebhook({ raw, headers }, config) {
  if (!config.stripeWebhookSecret || !config.stripeSecretKey) return unavailable;
  const now = config.now?.() ?? Date.now();
  if (!verifySignature(raw, headers['stripe-signature'], config.stripeWebhookSecret, now)) {
    return { status: 400, note: 'bad-signature' };
  }
  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return { status: 400, note: 'bad-json' };
  }
  const paidTypes = ['checkout.session.completed', 'checkout.session.async_payment_succeeded'];
  const session = event?.data?.object;
  if (
    !paidTypes.includes(event?.type) ||
    session?.metadata?.product !== PRODUCT ||
    session.payment_status !== 'paid'
  ) {
    return { status: 200, note: `ignored=${event?.type}` };
  }
  const { status, checkInUrl } = await registerPurchase(session, config);
  return checkInUrl
    ? { status: 200, note: `registered portal=${status}` }
    : { status: 502, note: `portal=${status}` };
}

/**
 * Stripe's scheme: the header holds t=<seconds> and one or more v1=<hex HMAC-SHA256 of
 * "<t>.<body>">; any v1 may match (during a secret roll there are two). Too old is refused.
 */
export function verifySignature(raw, header, secret, nowMs = Date.now()) {
  if (typeof header !== 'string' || typeof raw !== 'string') return false;
  const parts = header.split(',').map((part) => part.trim().split('='));
  const t = parts.find(([key]) => key === 't')?.[1];
  const signatures = parts.filter(([key]) => key === 'v1').map(([, value]) => value);
  if (!/^\d+$/.test(t ?? '') || !signatures.length) return false;
  if (Math.abs(nowMs / 1000 - Number(t)) > SIGNATURE_TOLERANCE_S) return false;
  const expected = createHmac('sha256', secret).update(`${t}.${raw}`).digest();
  return signatures.some((hex) => {
    const given = /^[0-9a-f]{64}$/.test(hex) ? Buffer.from(hex, 'hex') : null;
    return given !== null && timingSafeEqual(given, expected);
  });
}

/**
 * Registers a paid Checkout Session with the portal. Resolves to { status, checkInUrl? }: the
 * absolute check-in URL, or the name-and-email check-in page when the portal answers without one.
 */
export async function registerPurchase(session, config) {
  const { portalUrl, apiKey, timeoutMs = 10000, fetch = globalThis.fetch } = config;
  const portal = portalUrl.replace(/\/+$/, '');
  const body = {
    name: session.metadata?.name || session.customer_details?.name || '',
    email: session.customer_details?.email || session.customer_email || '',
    phone: session.metadata?.phone || session.customer_details?.phone || null,
    orderId: session.id,
  };
  try {
    const res = await fetch(`${portal}/api/v1/live-help/sessions/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify(body),
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.status !== 200) {
      await res.body?.cancel();
      return { status: res.status };
    }
    const text = await res.text();
    const path = text ? JSON.parse(text)?.checkInUrl : null;
    return {
      status: 200,
      checkInUrl: `${portal}${typeof path === 'string' && path.startsWith('/') ? path : '/livecoaching'}`,
    };
  } catch (err) {
    return { status: { TimeoutError: 'timeout', SyntaxError: 'invalid' }[err.name] ?? 'error' };
  }
}

/** The /api/coaching/availability handler, with a cache: the portal's on-call status, UTC times. */
export function availabilityHandler(config) {
  const { portalUrl, apiKey, timeoutMs = 10000, fetch = globalThis.fetch, now = Date.now } = config;
  let copy = null;
  let at = -Infinity;
  return async () => {
    const time = now();
    let note = 'cache';
    if (time - at >= AVAILABILITY_FRESH_MS) {
      try {
        const res = await fetch(`${portalUrl.replace(/\/+$/, '')}/api/v1/live-help/availability`, {
          headers: { accept: 'application/json', 'api-key': apiKey },
          redirect: 'manual',
          signal: AbortSignal.timeout(timeoutMs),
        });
        if (res.status !== 200) {
          await res.body?.cancel();
          note = `portal=${res.status}`;
        } else {
          const a = await res.json();
          copy = {
            availableNow: a?.availableNow === true,
            untilUtc: utc(a?.untilUtc),
            nextStartUtc: utc(a?.nextStartUtc),
            nextEndUtc: utc(a?.nextEndUtc),
          };
          at = time;
          note = 'portal=200';
        }
      } catch (err) {
        note = `portal=${err.name === 'TimeoutError' ? 'timeout' : 'error'}`;
      }
    }
    if (!copy || time - at > AVAILABILITY_FRESH_MS + AVAILABILITY_STALE_MS) {
      return { status: 503, note, body: { errors: ['unavailable'] } };
    }
    return { status: 200, note, headers: { 'Cache-Control': 'public, max-age=60' }, body: copy };
  };
}

// An ISO time from the portal, or null.
const utc = (value) =>
  typeof value === 'string' && !Number.isNaN(Date.parse(value))
    ? new Date(value).toISOString()
    : null;

/**
 * A Stripe API call; idempotencyKey makes a repeated POST return the first one's result. Resolves
 * to { status, body }: status is 'timeout' / 'error' without an answer. Never rejects.
 */
export async function stripe(method, path, config, params, { idempotencyKey } = {}) {
  const { stripeSecretKey, timeoutMs = 10000, fetch = globalThis.fetch } = config;
  try {
    const res = await fetch(`${STRIPE_API}${path}`, {
      method,
      headers: {
        authorization: `Bearer ${stripeSecretKey}`,
        ...(params && { 'content-type': 'application/x-www-form-urlencoded' }),
        ...(idempotencyKey && { 'idempotency-key': idempotencyKey }),
      },
      body: params?.toString(),
      signal: AbortSignal.timeout(timeoutMs),
    });
    const text = await res.text();
    let body = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {}
    return { status: res.status, body };
  } catch (err) {
    return { status: err.name === 'TimeoutError' ? 'timeout' : 'error', body: null };
  }
}

// Refunds (CLP-1505): every hour, the purchases the portal says are owed a full refund (a coach
// cancelled before the session started, or 24 hours passed and none started) are refunded in
// Stripe, then marked refunded on the portal, which stops listing them.
const REFUND_EVERY_MS = 60 * 60 * 1000;

/**
 * One refund pass. Resolves to { due, refunded, failed }; never rejects. A refund is keyed by its
 * order in Stripe (one refund per order, however many passes try it), and only marked on the
 * portal once Stripe took it, so a failure is tried again next pass. Logs order IDs (Stripe
 * Checkout Session IDs) and statuses only.
 */
export async function refundDue(config) {
  const {
    portalUrl,
    apiKey,
    timeoutMs = 10000,
    fetch = globalThis.fetch,
    log = console.log,
  } = config;
  const portal = portalUrl.replace(/\/+$/, '');
  const summary = { due: 0, refunded: 0, failed: 0 };
  if (!config.stripeSecretKey) return summary;
  let due;
  try {
    const res = await fetch(`${portal}/api/v1/live-help/refunds/due`, {
      headers: { accept: 'application/json', 'api-key': apiKey },
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.status !== 200) {
      await res.body?.cancel();
      log(`refunds portal=${res.status}`);
      return summary;
    }
    due = await res.json();
  } catch (err) {
    log(`refunds portal=${err.name === 'TimeoutError' ? 'timeout' : 'error'}`);
    return summary;
  }
  if (!Array.isArray(due)) {
    log('refunds portal=invalid');
    return summary;
  }
  summary.due = due.length;
  for (const item of due) {
    const orderId = item?.orderId;
    if (typeof orderId !== 'string' || !SESSION_ID.test(orderId)) continue;
    const outcome = await refund(orderId, item.reason, config);
    if (outcome === 'refunded' || outcome === 'nothing-paid') {
      const marked = await markRefunded(portal, orderId, config);
      if (marked) summary.refunded++;
      else summary.failed++;
      log(`refund ${orderId} ${outcome} portal=${marked ? 204 : 'failed'}`);
    } else {
      summary.failed++;
      log(`refund ${orderId} ${outcome}`);
    }
  }
  if (due.length)
    log(`refunds due=${summary.due} refunded=${summary.refunded} failed=${summary.failed}`);
  return summary;
}

// Refunds an order's payment in full. Resolves to 'refunded', 'nothing-paid' (a 100% promotion
// code) or what stopped it.
async function refund(orderId, reason, config) {
  const session = await stripe('GET', `/checkout/sessions/${orderId}`, config);
  if (session.status !== 200) return `stripe-session=${session.status}`;
  if (session.body?.metadata?.product !== PRODUCT) return 'not-coaching';
  if (session.body.amount_total === 0) return 'nothing-paid';
  const paymentIntent = session.body.payment_intent;
  if (typeof paymentIntent !== 'string') return 'no-payment';
  const params = new URLSearchParams({
    payment_intent: paymentIntent,
    'metadata[product]': PRODUCT,
    'metadata[order]': orderId,
    'metadata[reason]': String(reason ?? ''),
  });
  const res = await stripe('POST', '/refunds', config, params, {
    idempotencyKey: `${PRODUCT}-refund-${orderId}`,
  });
  if (res.status === 200) return 'refunded';
  // Refunded already (by staff in the dashboard, say): the buyer has their money back.
  if (res.body?.error?.code === 'charge_already_refunded') return 'refunded';
  return `stripe-refund=${res.status}`;
}

async function markRefunded(
  portal,
  orderId,
  { apiKey, timeoutMs = 10000, fetch = globalThis.fetch }
) {
  try {
    const res = await fetch(`${portal}/api/v1/live-help/refunds/${orderId}`, {
      method: 'POST',
      headers: { 'api-key': apiKey },
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
    });
    await res.body?.cancel();
    return res.status === 204;
  } catch {
    return false;
  }
}

/** Refunds now, then an hour after each pass ends, so passes never overlap. */
export async function startRefunding(config) {
  await refundDue(config);
  setTimeout(() => startRefunding(config), REFUND_EVERY_MS).unref();
}
