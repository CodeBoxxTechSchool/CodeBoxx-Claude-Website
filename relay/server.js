import http from 'node:http';
import { join } from 'node:path';
import { toLead, validateEnroll } from './enroll.js';
import { isHoneypot } from './fields.js';
import {
  toCareers,
  toContact,
  toPitch,
  validateCareers,
  validateContact,
  validatePitch,
} from './forms.js';
import { dequeue, enqueue, queueStats, startResending } from './outbox.js';
import { isRetryable, sendToPortal } from './portal.js';

const MAX_BODY_BYTES = 16 * 1024;
// A 5 MB CV is about 7 MB in base64, plus the form's fields.
const BODY_LIMITS = { '/api/careers': 8 * 1024 * 1024 };

// Handlers get the parsed JSON body (POST) or the query's URLSearchParams (GET) and the config, and
// resolve to { status, note?, body? }; body is added to the answer's JSON; note goes to the log, so
// it must never carry personal data.
const routes = {
  '/api/health': { GET: health },
  '/api/enroll': { POST: submission('enroll', validateEnroll, toLead) },
  '/api/contact': { POST: submission('contact', validateContact, toContact) },
  '/api/pitch': { POST: submission('pitch', validatePitch, toPitch) },
  '/api/careers': { POST: submission('careers', validateCareers, toCareers) },
};

/**
 * With ?queue=<seconds>, answers 503 once the oldest queued submission is older than that, for an
 * uptime check that only looks at the status code.
 */
async function health(query, { outboxDir, now }) {
  const maxAge = query.get('queue');
  if (maxAge !== null && !/^\d+$/.test(maxAge)) {
    return { status: 400, note: 'invalid=queue', body: { errors: ['queue'] } };
  }
  const queue = outboxDir ? await queueStats(outboxDir, now?.()) : null;
  const late = maxAge !== null && queue?.oldestAgeSeconds > Number(maxAge);
  return { status: late ? 503 : 200, body: { queue } };
}

// A form's handler: validate turns the browser's fields into data, toPortal maps it for the portal.
function submission(kind, validate, toPortal) {
  return async (body, config) => {
    if (isHoneypot(body)) return { status: 200, note: 'honeypot' };
    const result = validate(body, config.now ? new Date(config.now()) : undefined);
    // Field names only, never values: the careers form tells a refused CV apart from other errors.
    if (!result.ok) {
      return {
        status: 400,
        note: `invalid=${result.errors.join(',')}`,
        body: { errors: result.errors },
      };
    }
    return forward(kind, toPortal(result.data, config.now?.()), result.data.submissionId, config);
  };
}

// Only a submission with an ID is queued: the portal takes a resend of it at most once.
async function forward(kind, body, id, config) {
  const { received, status } = await sendToPortal(kind, body, config);
  let note = `portal=${status}`;
  if (id && config.outboxDir) {
    // The visitor's retry may have beaten the resend of a queued copy.
    if (received) await dequeue(config.outboxDir, id).catch(() => {});
    else if (isRetryable(status)) {
      note += await enqueue(config.outboxDir, id, kind, body, config.now?.()).then(
        () => ` queued=${id}`,
        (err) => ` queue-error=${err.code ?? err.name}`
      );
    }
  }
  return { status: received ? 200 : 502, note };
}

/**
 * config: { portalUrl, apiKey, timeoutMs?, fetch?, log?, outboxDir?, now? }; without outboxDir,
 * nothing is queued. Call .listen() on the result.
 */
export function createServer(config) {
  const log = config.log ?? console.log;
  return http.createServer(async (req, res) => {
    const started = performance.now();
    const path = req.url.split('?')[0];
    let result;
    try {
      result = await handle(req, path, config);
    } catch (err) {
      result = { status: 500, note: `error=${err.name}` };
    }
    if (result.allow) res.setHeader('Allow', result.allow);
    if (result.status === 413) res.setHeader('Connection', 'close');
    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: result.status === 200, ...result.body }));
    const ms = Math.round(performance.now() - started);
    log([req.method, path, result.status, `${ms}ms`, result.note].filter(Boolean).join(' '));
  });
}

async function handle(req, path, config) {
  const route = routes[path];
  if (!route) return { status: 404 };
  const handler = route[req.method];
  if (!handler) return { status: 405, allow: Object.keys(route).join(', ') };
  if (req.method !== 'POST') {
    return handler(new URLSearchParams(req.url.slice(path.length)), config);
  }

  const type = (req.headers['content-type'] ?? '').split(';')[0].trim().toLowerCase();
  if (type !== 'application/json') return { status: 415 };
  const raw = await readBody(req, BODY_LIMITS[path] ?? MAX_BODY_BYTES);
  if (raw === null) return { status: 413 };
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return { status: 400, note: 'bad-json' };
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { status: 400, note: 'bad-json' };
  }
  return handler(body, config);
}

// Resolves to the body as a string, or null once it passes maxBytes (the rest is not read).
function readBody(req, maxBytes) {
  if (Number(req.headers['content-length']) > maxBytes) return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        req.pause();
        req.removeAllListeners('data');
        resolve(null);
      } else chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

if (import.meta.main) {
  const { PORTAL_URL, WEBSITE_LEADS_API_KEY, PORT = '8787' } = process.env;
  const missing = ['PORTAL_URL', 'WEBSITE_LEADS_API_KEY'].filter((name) => !process.env[name]);
  if (missing.length) {
    console.error(`website-relay: missing environment variable(s): ${missing.join(', ')}`);
    process.exit(1);
  }
  if (!URL.canParse(PORTAL_URL)) {
    console.error('website-relay: PORTAL_URL is not a valid URL');
    process.exit(1);
  }
  const { STATE_DIRECTORY, OUTBOX_DIR } = process.env;
  // STATE_DIRECTORY comes from the unit's StateDirectory=; OUTBOX_DIR is for local runs.
  const outboxDir = STATE_DIRECTORY ? join(STATE_DIRECTORY, 'outbox') : OUTBOX_DIR;
  if (!outboxDir) console.warn('website-relay: no STATE_DIRECTORY or OUTBOX_DIR, queue disabled');
  const config = { portalUrl: PORTAL_URL, apiKey: WEBSITE_LEADS_API_KEY, outboxDir };
  const server = createServer(config);
  server.listen(Number(PORT), '127.0.0.1', () => {
    console.log(`website-relay listening on 127.0.0.1:${PORT}`);
  });
  if (outboxDir) startResending(config);
  process.on('SIGTERM', () => server.close(() => process.exit(0)));
}
