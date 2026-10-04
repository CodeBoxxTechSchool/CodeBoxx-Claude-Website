import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { localizedHref } from '../../../src/lib/i18nRoutes.js';
import { headerProblems, plan, stylesheet } from '../check-redirects.js';
import { CONF_FILE, OLD_URLS, SITE, load, match, parse, render, resolve } from '../redirects.js';

const table = load();
const read = (name) => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');
const lines = (text) => text.split('\n').filter(Boolean);
// The built site's pages (its sitemap, EN + FR): ops tests run in CI before the build.
const PAGES = new Set(lines(read('new-pages.txt')));
const PUBLIC = new URL('../../../public', import.meta.url);
const SWAP_HOSTS = [
  'codeboxx.com',
  'www.codeboxx.com',
  'academy.codeboxx.com',
  'www.academy.codeboxx.com',
  'academie.codeboxx.com',
  'www.academie.codeboxx.com',
  'solutions.codeboxx.com',
  'www.solutions.codeboxx.com',
];

const hostsOf = (group) => Object.keys(table.hosts).filter((host) => table.hosts[host] === group);
const oldPaths = (group) =>
  lines(read(`old-urls/${OLD_URLS[group]}`)).map((url) => new URL(url).pathname);
const servedPath = (path) => PAGES.has(path) || PAGES.has(`${path}/`);
// A target (without its #fragment): a page of the new site, or a file in public/.
const onSite = (path) =>
  path.endsWith('/') ? PAGES.has(path) : existsSync(new URL(`.${path}`, PUBLIC + '/'));

test('the generated nginx include is up to date (run node ops/nginx/redirects.js)', () => {
  assert.equal(readFileSync(CONF_FILE, 'utf8'), render(table));
});

test('maps the eight swap hosts, and only those', () => {
  assert.deepEqual(Object.keys(table.hosts).sort(), SWAP_HOSTS.sort());
});

test('every old URL redirects, except apex paths the new site serves', () => {
  for (const group of Object.keys(OLD_URLS)) {
    for (const host of hostsOf(group)) {
      for (const path of oldPaths(group)) {
        for (const variant of new Set([path, path.replace(/\/?$/, '/')])) {
          const location = resolve(table, host, variant);
          if (group === 'apex' && servedPath(path)) assert.equal(location, null, host + variant);
          else assert.ok(location, `${host}${variant} has no target`);
        }
      }
    }
  }
});

test('every target is a page of the new site (or a file in public/)', () => {
  for (const rule of table.rules.filter((rule) => rule.to !== '=')) {
    assert.ok(
      onSite(rule.to.split('#')[0]),
      `redirects.tsv:${rule.line}: ${rule.to} is not on the new site`
    );
  }
});

test('academie targets are the French academy targets, and exist', () => {
  const english = new Map(
    table.rules.filter((r) => r.groups.includes('academy')).map((r) => [r.from, r.to])
  );
  const french = table.rules.filter((rule) => rule.groups.includes('academie'));
  assert.equal(french.length, english.size);
  for (const rule of french) {
    const expected = localizedHref(english.get(rule.from), 'fr');
    assert.equal(rule.to, expected, `redirects.tsv:${rule.line}`);
    assert.ok(onSite(rule.to.split('#')[0]), rule.to);
  }
});

test('catch-alls land on a section or the Academy or Solutions page, never on the bare homepage; apex has none', () => {
  const rest = table.rules.filter((rule) => rule.kind === 'rest');
  for (const rule of rest) {
    assert.ok(!rule.groups.includes('apex'), 'apex must keep serving the new site');
    assert.ok(
      rule.to === '=' ||
        rule.to === '/academy/' ||
        rule.to === '/fr/academie/' ||
        rule.to === '/solutions/' ||
        /\/#[a-z-]+$/.test(rule.to),
      `redirects.tsv:${rule.line}`
    );
    assert.ok(rule.to !== '=' || rule.groups.join() === 'www', 'only www keeps the path');
  }
  for (const group of new Set(Object.values(table.hosts)))
    assert.equal(rest.filter((r) => r.groups.includes(group)).length, group === 'apex' ? 0 : 1);
});

test('apex never redirects a path the new site serves', () => {
  for (const rule of table.rules.filter((rule) => rule.groups.includes('apex'))) {
    assert.ok(!servedPath(rule.path), `redirects.tsv:${rule.line}: ${rule.path} is a page`);
    if (rule.kind === 'prefix')
      for (const page of PAGES)
        assert.ok(!page.startsWith(`${rule.path}/`), `${rule.from}: ${page}`);
  }
  for (const page of PAGES) assert.equal(resolve(table, 'codeboxx.com', page), null, page);
  for (const path of ['/', '/api/health', '/api/contact', '/404.html'])
    assert.equal(resolve(table, 'codeboxx.com', path), null, path);
});

test('the old hosts send /favicon.ico to the icon, not to a section', () => {
  for (const host of Object.keys(table.hosts).filter((host) => host !== 'codeboxx.com'))
    assert.equal(resolve(table, host, '/favicon.ico'), `${SITE}/favicon.ico`, host);
  assert.equal(resolve(table, 'codeboxx.com', '/favicon.ico'), null);
});

test('keeps the query string, before the fragment', () => {
  const query = 'gclid=x&utm_source=y';
  const cases = [
    ['academy.codeboxx.com', '/contact-codeboxx/', `${SITE}/?${query}#contact`],
    ['www.codeboxx.com', '/join-our-team', `${SITE}/careers/?${query}`],
    ['www.codeboxx.com', '/fr/faq/', `${SITE}/fr/faq/?${query}`],
    ['academie.codeboxx.com', '/anything', `${SITE}/fr/academie/?${query}`],
    ['academie.codeboxx.com', '/faq', `${SITE}/fr/academie/?${query}#faq`],
  ];
  for (const [host, path, expected] of cases)
    assert.equal(resolve(table, host, path, query), expected);
});

test('academy.codeboxx.com lands on /academy, its section, or its own page', () => {
  const cases = [
    ['/', '/academy/'],
    ['/full-stack-development', '/academy/#programs'],
    ['/artificial-intelligence', '/academy/#programs'],
    ['/programs', '/academy/#programs'],
    ['/frequently-asked-questions', '/academy/#faq'],
    ['/coding-school-financing-options', '/academy/#funding'],
    ['/enroll-in-our-coding-school-programs', '/academy/#apply'],
    ['/no-such-page', '/academy/'],
    ['/corporate-training', '/corporate-training/'],
    ['/technology-training-for-businesses', '/corporate-training/'],
    ['/post/coming-soon-at-codeboxx', '/blog/coming-soon-at-codeboxx/'],
  ];
  for (const host of ['academy.codeboxx.com', 'www.academy.codeboxx.com'])
    for (const [path, to] of cases) assert.equal(resolve(table, host, path), `${SITE}${to}`, path);
  assert.equal(
    resolve(table, 'academy.codeboxx.com', '/full-stack-development', 'utm_source=x'),
    `${SITE}/academy/?utm_source=x#programs`
  );
});

test('matches with or without a trailing slash, ignoring case, prefixes included', () => {
  assert.equal(resolve(table, 'www.codeboxx.com', '/Join-Our-Team'), `${SITE}/careers/`);
  assert.equal(resolve(table, 'www.codeboxx.com', '/Blog/Categories/X'), `${SITE}/blog/`);
  assert.equal(resolve(table, 'www.codeboxx.com', '/About'), `${SITE}/About`);
  assert.equal(resolve(table, 'www.codeboxx.com', '/contact/'), `${SITE}/#contact`);
  assert.equal(resolve(table, 'Solutions.codeboxx.com', '/product-page'), `${SITE}/solutions/`);
  assert.equal(resolve(table, 'solutions.codeboxx.com', '/product-page/x/'), `${SITE}/solutions/`);
  assert.equal(
    resolve(table, 'academy.codeboxx.com', '/codeblog/categories/workshop'),
    `${SITE}/blog/`
  );
  assert.equal(resolve(table, 'codeboxx.com', '/post/unknown'), `${SITE}/blog/`);
});

test('never redirects certificate challenges, the IP or unknown hosts', () => {
  for (const host of Object.keys(table.hosts)) {
    assert.equal(match(table, host, '/.well-known/acme-challenge/token'), null, host);
    assert.equal(match(table, host, '/.well-known/acme-challenge/'), null, host);
  }
  for (const host of ['159.223.145.47', 'example.com', ''])
    assert.equal(resolve(table, host, '/post/kntv-press-here'), null);
});

test('the certificate and the https server cover the eight swap hosts', () => {
  const [, names] = read('codeboxx-https.conf').match(/server_name ([^;]+);/);
  assert.deepEqual(names.split(/\s+/).sort(), [...SWAP_HOSTS].sort());
  const [, issued] = read('issue-cert.sh').match(/^NAMES=\(([^)]+)\)/m);
  assert.deepEqual(issued.split(/\s+/).filter(Boolean).sort(), [...SWAP_HOSTS].sort());
});

test('check plan: the apex goes to https over http; the IP fails the handshake over https', () => {
  const ip = '159.223.145.47';
  const [http, https] = [plan(table, ip), plan(table, ip, true)];
  const find = (checks, host, path) => checks.find((c) => c.host === host && c.path === path);
  const oldHosts = (checks) =>
    checks.filter((c) => c.host !== 'codeboxx.com' && table.hosts[c.host]);
  assert.deepEqual(oldHosts(http), oldHosts(https));
  // Old Wix paths go to the site (codeboxx.ai); the apex's own pages to https on the apex.
  for (const check of http.filter((c) => c.host === 'codeboxx.com' && !c.unchanged))
    assert.ok(/^https:\/\/codeboxx\.(ai|com)\//.test(check.location), check.path);
  assert.equal(find(http, 'codeboxx.com', '/faq/').location, 'https://codeboxx.com/faq/');
  assert.equal(find(https, 'codeboxx.com', '/faq/').unchanged, 200);
  for (const host of SWAP_HOSTS)
    for (const checks of [http, https])
      assert.equal(find(checks, host, '/.well-known/acme-challenge/test').unchanged, 404, host);
  assert.equal(find(http, ip, '/').unchanged, 200);
  for (const host of [ip, 'example.com']) assert.ok(find(https, host, '/').rejected, host);
});

test('check plan over live DNS (--base https://codeboxx.com): only the unknown name is rejected', () => {
  const live = plan(table, 'codeboxx.com', true);
  assert.deepEqual(
    live.filter((c) => c.rejected).map((c) => c.host),
    ['example.com']
  );
  assert.equal(live.find((c) => c.host === 'codeboxx.com' && c.path === '/').unchanged, 200);
});

test('rejects malformed lines', () => {
  const head = '[hosts]\na.com\ta\n[redirects]\n';
  assert.throws(() => parse(`${head}a\t/Post\t/blog/`), /bad old path/);
  assert.throws(() => parse(`${head}a\t/x\tblog/`), /bad target/);
  assert.throws(() => parse(`${head}b\t/x\t/blog/`), /unknown group/);
  assert.throws(() => parse(`${head}a\t/x/\t/blog/`), /bad old path/);
  assert.throws(() => parse(`${head}a\t/x\t/blog/\na\t/x\t/`), /repeated/);
  assert.throws(() => parse(`${head}a\t/.well-known/acme-challenge/x\t/`), /bad old path/);
  assert.throws(() => parse(`${head}a /x /blog/`), /unexpected line/);
});

test('finds the page stylesheet and checks compression and caching', () => {
  assert.equal(
    stylesheet('<link rel="stylesheet" href="/_astro/ChromeIsland.BMBRr28j.css">'),
    '/_astro/ChromeIsland.BMBRr28j.css'
  );
  assert.equal(stylesheet('<link rel="icon" href="/favicon.svg">'), null);
  const res = (encoding, cache) => ({
    headers: { 'content-encoding': encoding, 'cache-control': cache },
  });
  const page = res('gzip', 'no-cache');
  const asset = res('gzip', 'public, max-age=31536000, immutable');
  assert.deepEqual(headerProblems(page, asset), []);
  assert.deepEqual(headerProblems({ headers: {} }, { headers: {} }), [
    'page not gzipped (none)',
    'page Cache-Control none (want no-cache)',
    '/_astro/ CSS not gzipped (none)',
    '/_astro/ CSS Cache-Control none (want a year, immutable)',
  ]);
});
