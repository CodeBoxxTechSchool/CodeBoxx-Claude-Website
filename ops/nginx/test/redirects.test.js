import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { localizedHref } from '../../../src/lib/i18nRoutes.js';
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
    const path = rule.to.split('#')[0];
    const ok = path.endsWith('/') ? PAGES.has(path) : existsSync(new URL(`.${path}`, PUBLIC + '/'));
    assert.ok(ok, `redirects.tsv:${rule.line}: ${rule.to} is not on the new site`);
  }
});

test('academie targets are the French academy targets, and exist', () => {
  const english = new Map(
    table.rules.filter((r) => r.groups.includes('academy')).map((r) => [r.from, r.to])
  );
  const french = table.rules.filter((rule) => rule.groups.includes('academie'));
  assert.equal(french.length, english.size);
  for (const rule of french) {
    const [path, hash] = english.get(rule.from).split('#');
    const expected = hash ? localizedHref(`#${hash}`, 'fr') : localizedHref(path, 'fr');
    assert.equal(rule.to, expected, `redirects.tsv:${rule.line}`);
    assert.ok(PAGES.has(rule.to.split('#')[0]), rule.to);
  }
});

test('catch-alls land on a section, never on the bare homepage; apex has none', () => {
  const rest = table.rules.filter((rule) => rule.kind === 'rest');
  for (const rule of rest) {
    assert.ok(!rule.groups.includes('apex'), 'apex must keep serving the new site');
    assert.ok(rule.to === '=' || /\/#[a-z-]+$/.test(rule.to), `redirects.tsv:${rule.line}`);
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

test('keeps the query string, before the fragment', () => {
  const query = 'gclid=x&utm_source=y';
  const cases = [
    ['academy.codeboxx.com', '/contact-codeboxx/', `${SITE}/?${query}#contact`],
    ['www.codeboxx.com', '/join-our-team', `${SITE}/careers/?${query}`],
    ['www.codeboxx.com', '/fr/faq/', `${SITE}/fr/faq/?${query}`],
    ['academie.codeboxx.com', '/anything', `${SITE}/fr/?${query}#academie`],
  ];
  for (const [host, path, expected] of cases)
    assert.equal(resolve(table, host, path, query), expected);
});

test('matches with or without a trailing slash, ignoring case, prefixes included', () => {
  assert.equal(resolve(table, 'www.codeboxx.com', '/Join-Our-Team'), `${SITE}/careers/`);
  assert.equal(resolve(table, 'www.codeboxx.com', '/Blog/Categories/X'), `${SITE}/blog/`);
  assert.equal(resolve(table, 'www.codeboxx.com', '/About'), `${SITE}/About`);
  assert.equal(resolve(table, 'www.codeboxx.com', '/contact/'), `${SITE}/#contact`);
  assert.equal(resolve(table, 'Solutions.codeboxx.com', '/product-page'), `${SITE}/#solutions`);
  assert.equal(resolve(table, 'solutions.codeboxx.com', '/product-page/x/'), `${SITE}/#solutions`);
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
