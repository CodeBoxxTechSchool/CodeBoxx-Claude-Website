import { readFileSync } from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import { isIP } from 'node:net';
import { OLD_URLS, load, match, resolve } from './redirects.js';

const USAGE = 'usage: node ops/nginx/check-redirects.js --base http://159.223.145.47 [--relay]';
const QUERY = 'gclid=x&utm_source=y';
const APEX = 'codeboxx.com';
const PARALLEL = 8;

/** { status, location } of one request to base with this Host header; redirects not followed. */
export function send(base, host, path, method = 'HEAD') {
  const url = new URL(path, base);
  const client = url.protocol === 'https:' ? https : http;
  const options = { method, headers: { host }, servername: isIP(host) ? undefined : host };
  return new Promise((done, fail) => {
    const req = client.request(url, { ...options, timeout: 10_000 }, (res) => {
      res.resume();
      res.on('end', () => done({ status: res.statusCode, location: res.headers.location ?? null }));
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', fail);
    req.end();
  });
}

const oldPaths = (group) =>
  readFileSync(new URL(`old-urls/${OLD_URLS[group]}`, import.meta.url), 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((url) => new URL(url).pathname);

/** Every request to make: { host, path, location } (a 301 there) or { host, path, unchanged }. */
export function plan(table, baseHost) {
  const checks = [];
  for (const [host, group] of Object.entries(table.hosts)) {
    const paths = new Set();
    for (const path of oldPaths(group)) paths.add(path).add(path.replace(/\/?$/, '/'));
    for (const rule of table.rules.filter((rule) => rule.groups.includes(group))) {
      // A "=" catch-all keeps the path, so its sample must be a page of the new site.
      const rest = rule.to === '=' ? '/faq/' : '/no-such-old-page';
      const sample = { rest, prefix: `${rule.path}/sample` }[rule.kind];
      paths.add(sample ?? rule.path);
    }
    for (const path of paths) {
      const location = resolve(table, host, path);
      checks.push(location ? { host, path, location } : { host, path, unchanged: 200 });
    }
    // The query string must land before the fragment, where the target has one.
    const redirected = [...paths].filter((path) => resolve(table, host, path));
    const withHash = redirected.find((path) => resolve(table, host, path).includes('#'));
    for (const path of new Set([withHash ?? redirected[0], redirected.at(-1)].filter(Boolean)))
      checks.push({ host, path: `${path}?${QUERY}`, location: resolve(table, host, path, QUERY) });
    // Old paths match ignoring case (a "=" target keeps the case, so it's no sample).
    const upper = redirected.findLast((path) => match(table, host, path).to !== '=').toUpperCase();
    checks.push({ host, path: upper, location: resolve(table, host, upper) });
    checks.push({ host, path: '/.well-known/acme-challenge/test', unchanged: 404 });
  }
  for (const host of [baseHost, 'example.com'])
    for (const path of ['/', '/post/kntv-press-here', '/contact', '/join-our-team'])
      checks.push({ host, path, unchanged: path === '/' ? 200 : 404 });
  for (const path of ['/', '/faq/', '/blog', '/blog/', '/crewkit-forge-20', '/fr/blogue/'])
    checks.push({ host: APEX, path, unchanged: 200 });
  return checks;
}

async function runAll(items, worker) {
  const queue = [...items];
  const next = async () => {
    for (let item = queue.shift(); item; item = queue.shift()) await worker(item);
  };
  await Promise.all(Array.from({ length: PARALLEL }, next));
}

export async function main(args, { out = console.log, err = console.error } = {}) {
  const baseIndex = args.indexOf('--base');
  const base = baseIndex >= 0 ? args[baseIndex + 1] : undefined;
  if (!base || !/^https?:\/\//.test(base)) {
    err(USAGE);
    return 2;
  }
  const table = load();
  const checks = plan(table, new URL(base).hostname);
  const failures = [];
  const fail = (what, got) => failures.push(`${what}: got ${got}`);
  const describe = (res) => `${res.status}${res.location ? ` -> ${res.location}` : ''}`;
  const targets = new Set();
  let redirects = 0;
  let unchanged = 0;

  await runAll(checks, async (check) => {
    const what = `${check.host}${check.path}`;
    const res = await send(base, check.host, check.path).catch((error) => error);
    if (res instanceof Error) return fail(what, res.message);
    if (check.location) {
      if (res.status !== 301 || res.location !== check.location)
        return fail(`${what} (want 301 -> ${check.location})`, describe(res));
      redirects++;
      targets.add(new URL(check.location).pathname);
    } else {
      if (res.status !== check.unchanged || res.location)
        return fail(`${what} (want ${check.unchanged}, no redirect)`, describe(res));
      unchanged++;
    }
  });

  let reached = 0;
  await runAll(targets, async (path) => {
    const res = await send(base, APEX, path).catch((error) => error);
    if (res instanceof Error || res.status !== 200)
      return fail(`target ${APEX}${path} (want 200)`, res.message ?? describe(res));
    reached++;
  });

  if (args.includes('--relay')) {
    const res = await send(base, APEX, '/api/health', 'GET').catch((error) => error);
    if (res instanceof Error || res.status !== 200)
      fail(`relay ${APEX}/api/health (want 200)`, res.message ?? describe(res));
  }

  for (const failure of failures.sort()) err(`FAIL ${failure}`);
  out(
    `${base}: ${redirects} redirects, ${targets.size} targets (${reached} answered 200), ` +
      `${unchanged} unredirected requests${args.includes('--relay') ? ', relay health' : ''}; ` +
      `${failures.length} failure(s)`
  );
  return failures.length ? 1 : 0;
}

if (import.meta.main) process.exitCode = await main(process.argv.slice(2));
