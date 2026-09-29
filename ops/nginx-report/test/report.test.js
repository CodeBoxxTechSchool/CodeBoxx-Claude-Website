import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { formatEmail, isProbe, main, parseLine, summarize } from '../report.js';

const KEY = 'SG.secret-test-key';
const ENV = { SENDGRID_API_KEY: KEY, REPORT_TO: 'a@example.com; b@example.com' };
const dir = await mkdtemp(join(tmpdir(), 'nginx-report-'));
after(() => rm(dir, { recursive: true }));

const BROWSER = 'Mozilla/5.0 (X11)';
const GOOGLEBOT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const OURS = 'https://codeboxx.com/';

const line = (request, status, referrer = '-', agent = BROWSER, time = '28/Sep/2026:19:08:38') =>
  `1.2.3.4 - - [${time} +0000] "${request}" ${status} 153 "${referrer}" "${agent}"`;

async function logFile(lines) {
  const file = join(dir, `access-${Math.random()}.log`);
  await writeFile(file, lines.join('\n') + '\n');
  return file;
}

// Runs main with a fake fetch; returns the exit code, printed lines and the requests sent.
async function run(args, { env = ENV, status = 202, body = '' } = {}) {
  const out = [];
  const requests = [];
  const fetch = async (url, init) => {
    requests.push({ url, ...init });
    return new Response(body, { status });
  };
  const push = (text) => out.push(text);
  const code = await main(args, { env, fetch, out: push, err: push });
  return { code, out: out.join('\n'), requests };
}

test('parses a combined log line, dropping the query string', () => {
  assert.deepEqual(parseLine(line('GET /blog?page=2 HTTP/1.1', 404, 'https://codeboxx.com/')), {
    day: '2026-09-28',
    method: 'GET',
    path: '/blog',
    status: 404,
    referrer: 'https://codeboxx.com/',
    userAgent: BROWSER,
  });
  assert.equal(parseLine(line('GET / HTTP/1.1', 200)).referrer, '');
  assert.equal(parseLine(line('HEAD /x HTTP/1.0', 200)).method, 'HEAD');
  assert.equal(parseLine(line('POST /api/enroll HTTP/2.0', 502)).status, 502);
});

test('skips malformed lines', () => {
  assert.equal(parseLine(line('\\x16\\x03\\x01\\x00\\xEE', 400)), null);
  assert.equal(parseLine(line('-', 400)), null);
  assert.equal(parseLine(line('GET', 400)), null);
  assert.equal(parseLine('garbage'), null);
  assert.equal(parseLine(''), null);
});

test('ignores scanner probes, never a normal-looking path', () => {
  for (const path of [
    '/.env',
    '/%2eenv',
    '/.env.bak',
    '/app/.env',
    '/.git/config',
    '/cgi-bin/luci/;stok=/locale',
    '/lib/vendor/phpunit/phpunit/src/Util/PHP/eval-stdin.php',
    '/index.php/x',
    '/wp-login.php',
    '/blog/wp-includes/wlwmanifest.xml',
    '/config.yml',
    '/backup.sql',
    '/SDK/webLanguage',
    '/containers/json',
    '/actuator/health',
    '/HNAP1',
    '/webui/',
  ]) {
    assert.ok(isProbe(path), path);
  }
  for (const path of [
    '/post/my-article',
    '/fr/programmes',
    '/blog',
    '/programs',
    '/favicon.ico',
    '/.well-known/security.txt',
    '/login',
  ]) {
    assert.ok(!isProbe(path), path);
  }
});

test('keeps a 404 with a referrer, a crawler or 3 hits, not a one-off request', () => {
  const kept = (lines) => summarize(lines.join('\n')).missing.map((row) => row.path);
  assert.deepEqual(kept([line('GET /login HTTP/1.1', 404)]), []);
  assert.deepEqual(kept([line('GET /post/old HTTP/1.1', 404, '-', GOOGLEBOT)]), ['/post/old']);
  assert.deepEqual(kept([line('GET /blog HTTP/1.1', 404, 'https://www.google.com/')]), ['/blog']);
  assert.deepEqual(kept(Array(3).fill(line('GET /favicon.ico HTTP/1.1', 404))), ['/favicon.ico']);
  assert.deepEqual(kept(Array(2).fill(line('GET /version HTTP/1.1', 404))), []);
  assert.deepEqual(kept([line('GET /.env HTTP/1.1', 404, OURS, GOOGLEBOT)]), []);
  const { ignored } = summarize(
    [line('GET /login HTTP/1.1', 404), line('GET /.git HTTP/1.1', 404)].join('\n')
  );
  assert.equal(ignored, 2);
});

test('groups errors and 404s, putting links from our own site, then other sites, first', () => {
  const summary = summarize(
    [
      line('POST /api/enroll HTTP/1.1', 502),
      line('POST /api/enroll HTTP/1.1', 502),
      line('GET /api/health?queue=900 HTTP/1.1', 503),
      line('GET /favicon.ico HTTP/1.1', 404),
      line('GET /favicon.ico HTTP/1.1', 404),
      line('HEAD /favicon.ico HTTP/1.1', 404),
      line('GET /post/old?utm=x HTTP/1.1', 404, 'https://www.codeboxx.com/blog'),
      line('GET /post/old HTTP/1.1', 404),
      line('GET /fr/programmes HTTP/1.1', 404, 'http://159.223.145.47/fr/'),
      line('GET /blog HTTP/1.1', 404, 'https://codeboxx.com.evil.test/'),
      line('GET /programs HTTP/1.1', 404, '-', GOOGLEBOT),
      line('GET /login HTTP/1.1', 404),
      line('POST /blog HTTP/1.1', 404),
      line('GET /.env HTTP/1.1', 404),
      line('GET / HTTP/1.1', 200),
      line('-', 400),
      line('GET / HTTP/1.1', 200, '-', BROWSER, '29/Sep/2026:00:00:01'),
    ].join('\n')
  );
  assert.equal(summary.day, '2026-09-28');
  assert.equal(summary.total, 17);
  assert.equal(summary.ignored, 3);
  assert.deepEqual(summary.errors, [
    { status: 502, path: '/api/enroll', count: 2 },
    { status: 503, path: '/api/health', count: 1 },
  ]);
  const row = (path, count, internal, external, crawled) => ({
    path,
    count,
    internal,
    external,
    crawled,
  });
  assert.deepEqual(summary.missing, [
    row('/post/old', 2, true, false, false),
    row('/fr/programmes', 1, true, false, false),
    row('/blog', 1, false, true, false),
    row('/favicon.ico', 3, false, false, false),
    row('/programs', 1, false, false, true),
  ]);
});

test('words the subject and body, marking why each 404 is listed', () => {
  const email = formatEmail({
    day: '2026-09-28',
    total: 1091,
    ignored: 950,
    errors: [{ status: 502, path: '/api/enroll', count: 1 }],
    missing: [
      { path: '/post/old', count: 2, internal: true, external: true },
      { path: '/fr/programmes', count: 1, external: true, crawled: true },
      { path: '/programs', count: 1, crawled: true },
      { path: '/favicon.ico', count: 8 },
    ],
  });
  assert.equal(
    email.subject,
    'codeboxx.com website: 1 server error, 4 pages not found (2026-09-28)'
  );
  assert.match(email.text, /^ {5}1 {2}502 {2}\/api\/enroll$/m);
  assert.match(email.text, /^ {5}2 {2}\/post\/old {2}<- linked from our own site$/m);
  assert.match(email.text, /^ {5}1 {2}\/fr\/programmes {2}<- linked from another site$/m);
  assert.match(email.text, /^ {5}1 {2}\/programs {2}<- crawled by a search engine$/m);
  assert.match(email.text, /^ {5}8 {2}\/favicon\.ico$/m);
  assert.match(email.text, /950 404 hits ignored \(scanner probes and one-off requests\)\./);
  assert.match(email.text, /1091 requests in total/);
  const only404 = formatEmail({
    day: '2026-09-28',
    total: 1,
    ignored: 0,
    errors: [],
    missing: [{ path: '/blog', count: 1, internal: false }],
  });
  assert.equal(only404.subject, 'codeboxx.com website: 1 page not found (2026-09-28)');
  assert.doesNotMatch(only404.text, /Server errors/);
});

test('shows at most 50 rows and says how many more', () => {
  const missing = Array.from({ length: 53 }, (_, i) => ({ path: `/p${i}`, count: 1 }));
  const { text } = formatEmail({ day: '2026-09-28', total: 53, ignored: 0, errors: [], missing });
  assert.ok(text.includes('/p49\n'));
  assert.ok(!text.includes('/p50'));
  assert.match(text, /\.\.\. and 3 more/);
});

test('sends nothing when there is nothing to report', async () => {
  const file = await logFile([
    line('GET / HTTP/1.1', 200),
    line('GET /.env HTTP/1.1', 404),
    line('GET /login HTTP/1.1', 404),
  ]);
  const { code, out, requests } = await run([file]);
  assert.equal(code, 0);
  assert.equal(out, 'nginx-report 2026-09-28: nothing to report');
  assert.equal(requests.length, 0);
});

test('prints the email on a dry run, without a key', async () => {
  const file = await logFile([line('GET /blog HTTP/1.1', 404, 'https://www.google.com/')]);
  const { code, out, requests } = await run(['--dry-run', file], { env: {} });
  assert.equal(code, 0);
  assert.match(out, /^Subject: codeboxx.com website: 1 page not found \(2026-09-28\)\n/);
  assert.equal(requests.length, 0);
});

test('sends the email through SendGrid, the key in the Authorization header only', async () => {
  const file = await logFile([line('GET /blog HTTP/1.1', 404, '-', GOOGLEBOT)]);
  const { code, requests } = await run([file]);
  assert.equal(code, 0);
  const [{ url, method, headers, body }] = requests;
  assert.equal(url, 'https://api.sendgrid.com/v3/mail/send');
  assert.equal(method, 'POST');
  assert.equal(headers.Authorization, `Bearer ${KEY}`);
  assert.ok(!body.includes(KEY));
  const email = JSON.parse(body);
  assert.deepEqual(email.personalizations, [
    { to: [{ email: 'a@example.com' }, { email: 'b@example.com' }] },
  ]);
  assert.deepEqual(email.from, { email: 'portal@codeboxx.com' });
  assert.match(email.subject, /1 page not found/);
  assert.equal(email.content[0].type, 'text/plain');
  assert.ok(!email.content[0].value.includes('1.2.3.4'));
  assert.ok(!email.content[0].value.includes('Googlebot'));
});

test('fails on a SendGrid error without printing the key', async () => {
  const file = await logFile([line('GET /blog HTTP/1.1', 404, OURS)]);
  const body = JSON.stringify({ errors: [{ message: 'The from address does not match' }] });
  const { code, out } = await run([file], { status: 403, body });
  assert.equal(code, 1);
  assert.match(out, /SendGrid answered 403: The from address does not match/);
  assert.ok(!out.includes(KEY));
});

test('fails on a missing log file or configuration', async () => {
  assert.equal((await run([join(dir, 'nope.log')])).code, 1);
  const { code, out } = await run([await logFile([])], { env: {} });
  assert.equal(code, 1);
  assert.match(out, /missing environment variable\(s\): SENDGRID_API_KEY, REPORT_TO/);
});
