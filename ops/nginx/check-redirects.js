import { readFileSync } from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import { isIP } from 'node:net';
import { OLD_URLS, load, match, resolve } from './redirects.js';

const USAGE =
  'usage: node ops/nginx/check-redirects.js --base http://159.223.145.47 [--relay]\n' +
  '       node ops/nginx/check-redirects.js --base https://159.223.145.47 [--ca test-ca.pem] [--relay]\n' +
  '       node ops/nginx/check-redirects.js --base https://codeboxx.com --relay   (after the DNS swap)\n' +
  '  --site <url>: where the targets, headers and relay are fetched, the site itself (default:\n' +
  '  http://<ip> when --base is an IP, else https://codeboxx.ai)';
const QUERY = 'gclid=x&utm_source=y';
const APEX = 'codeboxx.com';
// The one live origin: every old host, the apex included, redirects there.
const SITE_HOST = 'codeboxx.ai';
const PARALLEL = 8;
// Its own user agent, so ops/nginx-report leaves out the 404s it asks for on purpose.
export const USER_AGENT = 'codeboxx-check-redirects';

/**
 * { status, location } of one request to base with this Host header; redirects not followed.
 * Over https the certificate is verified for that host (ca: a test CA instead of the system's).
 */
export function send(base, host, path, method = 'HEAD', ca = undefined) {
  const url = new URL(path, base);
  const client = url.protocol === 'https:' ? https : http;
  const options = {
    method,
    headers: { host, 'user-agent': USER_AGENT },
    servername: isIP(host) ? undefined : host,
    ca,
  };
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

/**
 * { status, headers, body } of a GET to base with this Host header, asking for gzip when gzip is
 * set (the body is then left compressed, only the headers matter).
 */
export function get(base, host, path, { gzip = false, ca = undefined } = {}) {
  const url = new URL(path, base);
  const client = url.protocol === 'https:' ? https : http;
  const headers = { host, 'user-agent': USER_AGENT, ...(gzip && { 'accept-encoding': 'gzip' }) };
  const options = { headers, servername: isIP(host) ? undefined : host, ca, timeout: 10_000 };
  return new Promise((done, fail) => {
    const req = client.request(url, options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () =>
        done({
          status: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks).toString(),
        })
      );
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', fail);
    req.end();
  });
}

/** The first /_astro/ stylesheet a page links to, or null. */
export const stylesheet = (html) => /href="(\/_astro\/[^"]+\.css)"/.exec(html)?.[1] ?? null;

/**
 * What's wrong with the compression and caching headers of a page and of one of its /_astro/
 * files (both fetched asking for gzip), as a list of messages; empty when both are right.
 */
export function headerProblems(page, asset) {
  const problems = [];
  const encoding = (res) => res.headers['content-encoding'] ?? 'none';
  const cache = (res) => res.headers['cache-control'] ?? 'none';
  if (encoding(page) !== 'gzip') problems.push(`page not gzipped (${encoding(page)})`);
  if (cache(page) !== 'no-cache')
    problems.push(`page Cache-Control ${cache(page)} (want no-cache)`);
  if (encoding(asset) !== 'gzip') problems.push(`/_astro/ CSS not gzipped (${encoding(asset)})`);
  if (!/max-age=31536000/.test(cache(asset)) || !/immutable/.test(cache(asset)))
    problems.push(`/_astro/ CSS Cache-Control ${cache(asset)} (want a year, immutable)`);
  return problems;
}

const oldPaths = (group) =>
  readFileSync(new URL(`old-urls/${OLD_URLS[group]}`, import.meta.url), 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((url) => new URL(url).pathname);

/**
 * Every request to make: { host, path, location } (a 301 there), { host, path, unchanged }, or
 * { host, path, rejected } (no handshake). The apex serves no page: every path of it is a 301 to
 * codeboxx.ai, the new site's pages to the same path.
 */
export function plan(table, baseHost, secure = false) {
  const checks = [];
  const page = (host, path) => ({ host, path, unchanged: 200 });
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
      checks.push(location ? { host, path, location } : page(host, path));
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
  // The IP (or any base that isn't one of the site's names) and an unknown name get no site name.
  const unknown = table.hosts[baseHost] ? ['example.com'] : [baseHost, 'example.com'];
  for (const host of unknown) {
    if (secure) checks.push({ host, path: '/', rejected: true });
    else
      for (const path of ['/', '/post/kntv-press-here', '/contact', '/join-our-team'])
        checks.push({ host, path, unchanged: path === '/' ? 200 : 404 });
  }
  const apexPages = [
    '/',
    '/faq/',
    `/faq/?${QUERY}`,
    '/blog',
    '/blog/',
    '/crewkit-forge-20',
    '/fr/blogue/',
  ];
  // The apex serves nothing itself: each of the new site's pages goes to the same path on the site.
  for (const path of apexPages) {
    const [pathname, query] = path.split('?');
    checks.push({ host: APEX, path, location: resolve(table, APEX, pathname, query) });
  }
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
  const caIndex = args.indexOf('--ca');
  const ca = caIndex >= 0 ? readFileSync(args[caIndex + 1]) : undefined;
  const secure = base.startsWith('https:');
  // The targets, headers and relay are the site's: through the IP's default server over http (the
  // droplet answers any unknown name with the site), else codeboxx.ai itself.
  const baseHost = new URL(base).hostname;
  const siteIndex = args.indexOf('--site');
  const siteBase =
    siteIndex >= 0
      ? args[siteIndex + 1]
      : isIP(baseHost)
        ? `http://${baseHost}`
        : `https://${SITE_HOST}`;
  const siteHost = isIP(new URL(siteBase).hostname) ? new URL(siteBase).hostname : SITE_HOST;
  const table = load();
  const checks = plan(table, baseHost, secure);
  const failures = [];
  const fail = (what, got) => failures.push(`${what}: got ${got}`);
  const describe = (res) => `${res.status}${res.location ? ` -> ${res.location}` : ''}`;
  const targets = new Set();
  let redirects = 0;
  let unchanged = 0;
  let rejected = 0;

  await runAll(checks, async (check) => {
    const what = `${check.host}${check.path}`;
    const res = await send(base, check.host, check.path, 'HEAD', ca).catch((error) => error);
    if (check.rejected) {
      if (!/unrecognized name/.test(res.message))
        return fail(`${what} (want the handshake rejected)`, res.message ?? describe(res));
      rejected++;
      return;
    }
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
    const res = await send(siteBase, siteHost, path, 'HEAD', ca).catch((error) => error);
    if (res instanceof Error || res.status !== 200)
      return fail(`target ${siteHost}${path} (want 200)`, res.message ?? describe(res));
    reached++;
  });

  // Compression and caching (ops/nginx/snippets/codeboxx-site.conf), on the homepage and its CSS.
  let headers = 'unchecked';
  try {
    const css = stylesheet((await get(siteBase, siteHost, '/', { ca })).body);
    if (!css) fail(`headers ${siteHost}/`, 'no /_astro/ stylesheet in the page');
    else {
      const page = await get(siteBase, siteHost, '/', { gzip: true, ca });
      const asset = await get(siteBase, siteHost, css, { gzip: true, ca });
      const problems = headerProblems(page, asset);
      for (const problem of problems) fail(`headers ${siteHost}`, problem);
      headers = problems.length ? 'wrong' : 'ok';
    }
  } catch (error) {
    fail(`headers ${siteHost}/`, error.message);
  }

  if (args.includes('--relay')) {
    const res = await send(siteBase, siteHost, '/api/health', 'GET', ca).catch((error) => error);
    if (res instanceof Error || res.status !== 200)
      fail(`relay ${siteHost}/api/health (want 200)`, res.message ?? describe(res));
  }

  for (const failure of failures.sort()) err(`FAIL ${failure}`);
  out(
    `${base}: ${redirects} redirects, ${targets.size} targets (${reached} answered 200), ` +
      `${unchanged} unredirected requests${secure ? `, ${rejected} rejected handshakes` : ''}, ` +
      `compression and caching ${headers}` +
      `${args.includes('--relay') ? ', relay health' : ''}; ` +
      `${failures.length} failure(s)`
  );
  return failures.length ? 1 : 0;
}

if (import.meta.main) process.exitCode = await main(process.argv.slice(2));
