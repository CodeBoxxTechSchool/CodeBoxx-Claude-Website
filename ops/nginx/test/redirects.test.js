import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { localizedHref } from '../../../src/lib/i18nRoutes.js';
import { SITE_REDIRECTS } from '../../../src/lib/siteRedirects.js';
import {
  cohortsList,
  headerProblems,
  missingChecks,
  plan,
  stylesheet,
} from '../check-redirects.js';
import {
  CONF_FILE,
  GONE,
  MISSING,
  MISSING_HOSTS,
  OLD_URLS,
  SITE,
  load,
  match,
  matchMissing,
  oldUrls,
  parse,
  render,
  resolve,
  resolveMissing,
  siteLocation,
} from '../redirects.js';

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
const oldPaths = (group) => oldUrls(group).map((url) => new URL(url).pathname);
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

test('every old URL redirects or is gone, on every old host', () => {
  for (const group of Object.keys(OLD_URLS)) {
    for (const host of hostsOf(group)) {
      for (const path of oldPaths(group)) {
        for (const variant of new Set([path, path.replace(/\/?$/, '/')])) {
          const gone = match(table, host, variant)?.to === GONE;
          assert.ok(gone || resolve(table, host, variant), `${host}${variant} has no target`);
        }
      }
    }
  }
});

test('a gone page is not redirected, is no page of the new site, and answers 410', () => {
  const gone = table.rules.filter((rule) => rule.to === GONE && !rule.groups.includes(MISSING));
  assert.equal(gone.length, 13);
  for (const rule of gone) {
    assert.equal(rule.kind, 'exact', `redirects.tsv:${rule.line}`);
    assert.ok(!servedPath(rule.path), `redirects.tsv:${rule.line}: ${rule.path} is a page`);
    for (const host of rule.groups.flatMap(hostsOf)) {
      assert.equal(resolve(table, host, rule.path), null, host + rule.path);
      assert.equal(resolve(table, host, rule.path + '/', 'utm_source=x'), null, host + rule.path);
    }
  }
  const conf = render(table);
  assert.ok(conf.includes('"apex:/post/kntv-press-here" "-";'));
  // "-" gets no Location, and the site's @missing answers it 410: not at server level, where the
  // error page's internal redirect would answer 410 again and lose the site's 404 page.
  assert.match(conf, /map \$legacy_target \$legacy_location \{\n {4}default "";\n {4}"-" "";\n/);
  const missingBlock = read('snippets/codeboxx-site.conf').split('location @missing {')[1];
  assert.ok(missingBlock.includes('    if ($legacy_target = "-") {\n        return 410;\n    }'));
  assert.doesNotMatch(read('snippets/codeboxx-redirects.conf'), /410/);
  // Another old post still lands on the blog.
  assert.equal(resolve(table, 'codeboxx.com', '/post/unknown'), `${SITE}/blog/`);
});

test('every target is a page of the new site (or a file in public/)', () => {
  for (const rule of table.rules.filter((rule) => rule.to !== '=' && rule.to !== GONE)) {
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

test('catch-alls land on a section or the Academy or Solutions page, never on the bare homepage', () => {
  const rest = table.rules.filter((rule) => rule.kind === 'rest');
  for (const rule of rest) {
    assert.ok(
      rule.to === '=' ||
        rule.to === '/academy/' ||
        rule.to === '/fr/academie/' ||
        rule.to === '/solutions/' ||
        /\/#[a-z-]+$/.test(rule.to),
      `redirects.tsv:${rule.line}`
    );
    assert.ok(
      rule.to !== '=' || rule.groups.join() === 'www,apex',
      'only www and the apex keep the path'
    );
  }
  for (const group of new Set(Object.values(table.hosts)))
    assert.equal(rest.filter((r) => r.groups.includes(group)).length, 1, group);
});

test('the apex serves nothing: old paths to their page, every other path to the same one on codeboxx.ai', () => {
  // Its old-path rules never shadow a page of the new site, which keeps its path.
  for (const rule of table.rules.filter(
    (rule) => rule.groups.includes('apex') && rule.kind !== 'rest'
  )) {
    assert.ok(!servedPath(rule.path), `redirects.tsv:${rule.line}: ${rule.path} is a page`);
    if (rule.kind === 'prefix')
      for (const page of PAGES)
        assert.ok(!page.startsWith(`${rule.path}/`), `${rule.from}: ${page}`);
  }
  assert.equal(SITE, 'https://codeboxx.ai');
  for (const page of PAGES) assert.equal(resolve(table, 'codeboxx.com', page), SITE + page, page);
  for (const path of ['/', '/academy/', '/api/health', '/404.html', '/favicon.svg'])
    assert.equal(resolve(table, 'codeboxx.com', path), SITE + path, path);
  // A page's path without its trailing slash gets it, so it lands in one hop (codeboxx.ai would
  // answer /blog with a 301 to /blog/).
  for (const path of ['/blog', '/crewkit-forge-20', '/fr/blogue', '/no-such-page'])
    assert.equal(resolve(table, 'codeboxx.com', path), `${SITE}${path}/`, path);
  assert.equal(
    resolve(table, 'codeboxx.com', '/academy/', 'gclid=x'),
    'https://codeboxx.ai/academy/?gclid=x'
  );
});

test('the old hosts send /favicon.ico to the icon, not to a section', () => {
  for (const host of Object.keys(table.hosts))
    assert.equal(resolve(table, host, '/favicon.ico'), `${SITE}/favicon.ico`, host);
});

test('keeps the query string, before the fragment', () => {
  const query = 'gclid=x&utm_source=y';
  const cases = [
    ['academy.codeboxx.com', '/contact-codeboxx/', `${SITE}/?${query}#contact`],
    ['www.codeboxx.com', '/join-our-team', `${SITE}/careers/?${query}`],
    ['www.codeboxx.com', '/fr/faq/', `${SITE}/fr/faq/?${query}`],
    ['academie.codeboxx.com', '/anything', `${SITE}/fr/academie/?${query}`],
    ['academie.codeboxx.com', '/enroll', `${SITE}/fr/academie/?${query}#apply`],
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
    ['/frequently-asked-questions', '/faq/'],
    ['/faq', '/faq/'],
    ['/coding-school-financing-options', '/financing/'],
    ['/financing-options', '/financing/'],
    ['/enroll-in-our-coding-school-programs', '/academy/#apply'],
    ['/no-such-page', '/academy/'],
    ['/corporate-training', '/corporate-training/'],
    ['/technology-training-for-businesses', '/corporate-training/'],
    ['/technology-training-for-businesses-old', '/corporate-training/'],
    ['/post/coming-soon-at-codeboxx', '/academy/'],
  ];
  for (const host of ['academy.codeboxx.com', 'www.academy.codeboxx.com'])
    for (const [path, to] of cases) assert.equal(resolve(table, host, path), `${SITE}${to}`, path);
  assert.equal(
    resolve(table, 'academy.codeboxx.com', '/full-stack-development', 'utm_source=x'),
    `${SITE}/academy/?utm_source=x#programs`
  );
});

test('solutions.codeboxx.com sends DaaS, vibe coding and Academy for Business to their page', () => {
  const cases = [
    ['/developer-as-a-service', '/solutions/#service-daas'],
    ['/developers-as-a-service', '/solutions/#service-daas'],
    ['/daas', '/solutions/#service-daas'],
    ['/sdaas', '/solutions/#service-daas'],
    ['/vibe-coding-workshop', '/solutions/#vibe-coaching'],
    ['/academy-for-business', '/corporate-training/'],
    ['/academy-for-buisness', '/corporate-training/'],
  ];
  for (const host of hostsOf('solutions'))
    for (const [path, to] of cases) assert.equal(resolve(table, host, path), `${SITE}${to}`, path);
  assert.equal(
    resolve(table, 'academie.codeboxx.com', '/financing-options'),
    `${SITE}/fr/financement/`
  );
  assert.equal(resolve(table, 'academie.codeboxx.com', '/faq/'), `${SITE}/fr/faq/`);
});

test('the old URLs found outside the sitemaps (old-urls/extra/) are checked', () => {
  const extra = (name) => lines(read(`old-urls/extra/${name}`));
  const academy = extra('academy.codeboxx.com.txt');
  const solutions = extra('www.solutions.codeboxx.com.txt');
  assert.equal(academy.length + solutions.length, 50);
  assert.ok(oldUrls('academie').includes('https://academy.codeboxx.com/new-enroll'));
  const checks = plan(table, '159.223.145.47');
  for (const [group, urls] of [
    ['academy', academy],
    ['academie', academy],
    ['solutions', solutions],
  ])
    for (const host of hostsOf(group))
      for (const url of urls) {
        const { pathname } = new URL(url);
        const check = checks.find((c) => c.host === host && c.path === pathname);
        assert.ok(check?.location, host + pathname);
        assert.equal(check.location, resolve(table, host, pathname));
      }
});

test('matches with or without a trailing slash, ignoring case, prefixes included', () => {
  assert.equal(resolve(table, 'www.codeboxx.com', '/Join-Our-Team'), `${SITE}/careers/`);
  assert.equal(resolve(table, 'www.codeboxx.com', '/Blog/Categories/X'), `${SITE}/blog/`);
  assert.equal(resolve(table, 'www.codeboxx.com', '/About'), `${SITE}/About/`);
  assert.equal(resolve(table, 'www.codeboxx.com', '/contact/'), `${SITE}/#contactus`);
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

test('check plan: the apex goes to codeboxx.ai over both; the IP fails the handshake over https', () => {
  const ip = '159.223.145.47';
  const [http, https] = [plan(table, ip), plan(table, ip, true)];
  const find = (checks, host, path) => checks.find((c) => c.host === host && c.path === path);
  const gone = table.rules
    .filter((rule) => rule.to === GONE && rule.groups.includes('apex'))
    .flatMap((rule) => [rule.path, rule.path + '/']);
  const apexGone = (c) => c.host === 'codeboxx.com' && gone.includes(c.path);
  const oldHosts = (checks) => checks.filter((c) => table.hosts[c.host] && !apexGone(c));
  assert.deepEqual(oldHosts(http), oldHosts(https));
  // The gone posts answer 410 on www over both, and on the apex over https; over http the apex
  // sends every path to codeboxx.ai in one hop, so they're 301s to the same path there (its 410).
  for (const path of gone) {
    for (const checks of [http, https])
      assert.equal(find(checks, 'www.codeboxx.com', path).unchanged, 410, path);
    assert.equal(find(https, 'codeboxx.com', path).unchanged, 410, path);
    assert.equal(find(http, 'codeboxx.com', path).location, `https://codeboxx.ai${path}`, path);
    assert.ok(find(http, 'codeboxx.com', path).gone, path);
  }
  // Every other apex request but the certificate challenge is a 301 to codeboxx.ai.
  for (const checks of [http, https])
    for (const check of checks.filter((c) => c.host === 'codeboxx.com' && !c.unchanged))
      assert.ok(check.location.startsWith('https://codeboxx.ai/'), check.path);
  const unchanged = (checks) => checks.filter((c) => c.host === 'codeboxx.com' && c.unchanged);
  assert.deepEqual(
    unchanged(http).map((c) => c.path),
    ['/.well-known/acme-challenge/test']
  );
  assert.deepEqual(
    unchanged(https)
      .map((c) => c.path)
      .sort(),
    ['/.well-known/acme-challenge/test', ...gone].sort()
  );
  assert.equal(find(http, 'codeboxx.com', '/faq/').location, 'https://codeboxx.ai/faq/');
  assert.equal(find(https, 'codeboxx.com', '/').location, 'https://codeboxx.ai/');
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
  assert.equal(
    live.find((c) => c.host === 'codeboxx.com' && c.path === '/').location,
    'https://codeboxx.ai/'
  );
});

test('check plan: www.codeboxx.ai is one 301 to the same path on codeboxx.ai, over public DNS only', () => {
  const www = (checks) => checks.filter((c) => c.host === 'www.codeboxx.ai');
  // Through the IP the droplet serves www itself; the redirect is Cloudflare's (CLP-1413).
  for (const secure of [false, true])
    assert.deepEqual(www(plan(table, '159.223.145.47', secure)), []);
  const checks = www(plan(table, 'codeboxx.com', true));
  assert.deepEqual(
    checks.map((c) => c.path),
    ['/', '/faq/', '/faq/?gclid=x&utm_source=y', '/blog/', '/fr/blogue/']
  );
  for (const check of checks) {
    assert.equal(check.base, 'https://www.codeboxx.ai');
    assert.equal(check.location, `https://codeboxx.ai${check.path}`);
  }
});

test('the site answers a page without its trailing slash with a 301 to it, as "=" does', () => {
  const site = read('snippets/codeboxx-site.conf');
  assert.match(site, /^absolute_redirect off;$/m);
  assert.match(site, /location \/ \{[^}]*try_files \$uri \$uri\/ @missing;/);
  // nginx's map and samePath agree: the same paths get a slash, the query string after it.
  const conf = render(table);
  assert.ok(conf.includes('"~^(?!/api/)([^?]*/[^/?.]+)(\\?.*)?$" https://codeboxx.ai$1/$2;'));
  assert.ok(conf.includes('"=" $legacy_same_path;'));
  assert.equal(
    resolve(table, 'codeboxx.com', '/blog', 'gclid=x'),
    'https://codeboxx.ai/blog/?gclid=x'
  );
});

test("the site's own redirects are one 301 from nginx, from no page, to a page of the site", () => {
  const conf = render(table);
  for (const [from, to] of Object.entries(SITE_REDIRECTS)) {
    assert.ok(conf.includes(`    "${from}" "${to}";`), from);
    assert.ok(!from.endsWith('/') && !servedPath(from), `${from} is a page`);
    assert.ok(onSite(to.split('#')[0]), to);
  }
  assert.match(
    read('snippets/codeboxx-site.conf'),
    /^if \(\$site_location\) \{\n {4}return 301 \$site_location;\n\}$/m
  );
  assert.equal(siteLocation('/#contact', 'gclid=x'), '/?gclid=x#contact');
  assert.equal(siteLocation('/academy/'), '/academy/');
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
  assert.throws(() => parse(`${head}a\t/x/*\t-`), /only an exact old path can be gone/);
  assert.equal(parse(`${head}a\t/x\t-`).rules[0].to, GONE);
  assert.throws(() => parse(`${head}missing\t*\t/blog/`), /no catch-all/);
  assert.throws(() => parse(`${head}missing\t/x\t=`), /no catch-all/);
  assert.throws(() => parse(`${head}a,missing\t/x\t/blog/`), /a line of its own/);
  assert.equal(parse(`${head}missing\t/x/*\t/blog/`).rules[0].kind, 'prefix');
});

const missing = table.rules.filter((rule) => rule.groups.includes(MISSING));

test('codeboxx.ai: an old address with no page lands on its page, a retired one is gone', () => {
  assert.equal(resolveMissing(table, '/en'), `${SITE}/`);
  assert.equal(resolveMissing(table, '/en/'), `${SITE}/`);
  assert.equal(resolveMissing(table, '/en/article/1485'), `${SITE}/blog/`);
  assert.equal(resolveMissing(table, '/EN/Testimonial/2517'), `${SITE}/academy/#stories`);
  assert.equal(resolveMissing(table, '/fr/registrations'), `${SITE}/fr/academie/#apply`);
  assert.equal(resolveMissing(table, '/fr/pages/media/Article/1225'), `${SITE}/fr/blogue/`);
  assert.equal(resolveMissing(table, '/en/garneau'), `${SITE}/academy/`);
  assert.equal(
    resolveMissing(table, '/en', 'utm_source=careerkarma&utm_campaign=careerkarma'),
    `${SITE}/?utm_source=careerkarma&utm_campaign=careerkarma`
  );
  assert.equal(
    resolveMissing(table, '/en/testimonials', 'utm_source=x'),
    `${SITE}/academy/?utm_source=x#stories`
  );
  // www's old Wix paths too: a post on the new blog, and the others to the blog.
  assert.equal(
    resolveMissing(table, '/post/top-tech-opportunities-for-developers-in-tampa-st-pete'),
    resolve(
      table,
      'www.codeboxx.com',
      '/post/top-tech-opportunities-for-developers-in-tampa-st-pete'
    )
  );
  assert.equal(resolveMissing(table, '/post/unknown'), `${SITE}/blog/`);
  assert.equal(resolveMissing(table, '/resources/'), `${SITE}/blog/`);
  // Short forms only crawlers ask for (nginx report, Nov 2026).
  assert.equal(resolveMissing(table, '/our-program/'), `${SITE}/academy/#programs`);
  assert.equal(resolveMissing(table, '/reg/'), `${SITE}/academy/#apply`);
  // Retired: the post dropped from the new blog (PR #138), www's gone posts, the 404 page's old
  // address and a page we never had answer 410.
  for (const path of [
    '/blog/q-a-about-ethics-by-design/',
    '/fr/blogue/q-a-about-ethics-by-design',
    '/post/kntv-press-here',
    '/404/',
    '/404',
    '/cybersecurity/',
  ]) {
    assert.equal(matchMissing(table, path)?.to, GONE, path);
    assert.equal(resolveMissing(table, path), null, path);
  }
  // Anything else keeps its 404: no catch-all, and www's "=" isn't taken (it would loop).
  for (const path of ['/no-such-page', '/blog/no-such-post/', '/fr/no-such-page', '/about'])
    assert.equal(matchMissing(table, path), null, path);
});

test('codeboxx.ai: every old codeboxx.biz address seen in the logs has a target', () => {
  const urls = lines(read('old-urls/codeboxx.biz.txt'));
  assert.ok(urls.length > 300);
  for (const url of urls) {
    const { pathname } = new URL(url);
    assert.ok(resolveMissing(table, pathname), pathname);
  }
});

test('codeboxx.ai: the missing rules are no page of the site, and their targets are', () => {
  for (const rule of missing) {
    assert.ok(!servedPath(rule.path), `redirects.tsv:${rule.line}: ${rule.path} is a page`);
    if (rule.kind === 'prefix')
      for (const page of PAGES)
        assert.ok(!page.startsWith(`${rule.path}/`), `redirects.tsv:${rule.line}: ${page}`);
  }
  const conf = render(table);
  for (const host of MISSING_HOSTS) assert.ok(conf.includes(`    ${host} site;`), host);
  assert.ok(conf.includes('"site:/en" "/";'));
  assert.ok(conf.includes('"site:/blog/q-a-about-ethics-by-design" "-";'));
  assert.ok(!conf.includes('"missing:'), "no missing rule in the old hosts' maps");
  assert.match(read('snippets/codeboxx-site.conf'), /^error_page 404 410 \/404\.html;$/m);
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

test("recognizes the relay's cohorts answer", () => {
  const answer = { ok: true, cohorts: [], windowDays: 90, asOf: '2026-10-13T12:00:00.000Z' };
  assert.equal(cohortsList(JSON.stringify(answer)), true);
  for (const body of ['', '<html>', '{"ok":false,"error":"cohorts unavailable"}', '[]'])
    assert.equal(cohortsList(body), false, body);
});

test('check plan: codeboxx.ai paths with no page, over http through the IP or at codeboxx.ai', () => {
  const checks = missingChecks(table);
  const at = (path) => checks.find((check) => check.path === path);
  assert.deepEqual(at('/en/article/sample'), {
    path: '/en/article/sample',
    location: `${SITE}/blog/`,
  });
  assert.equal(at('/EN/Article/1485').location, `${SITE}/blog/`);
  assert.equal(at('/post/unknown').location, `${SITE}/blog/`);
  assert.equal(at('/blog/q-a-about-ethics-by-design').unchanged, 410);
  assert.equal(at('/no-such-page').unchanged, 404);
  assert.equal(at('/en?gclid=x&utm_source=y').location, `${SITE}/?gclid=x&utm_source=y`);
  assert.equal(checks.length, missing.length + 5);
  const ofSite = (list) => list.filter((check) => check.host === 'codeboxx.ai');
  const http = ofSite(plan(table, '159.223.145.47'));
  assert.equal(http.length, checks.length);
  assert.ok(http.every((check) => !check.base));
  assert.equal(ofSite(plan(table, '159.223.145.47', true)).length, 0);
  const named = ofSite(plan(table, 'codeboxx.com', true));
  assert.equal(named.length, checks.length);
  assert.ok(named.every((check) => check.base === 'https://codeboxx.ai'));
});
