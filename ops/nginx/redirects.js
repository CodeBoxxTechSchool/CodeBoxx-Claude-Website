import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { SITE_REDIRECTS } from '../../src/lib/siteRedirects.js';

export const SITE = 'https://codeboxx.ai';
export const DATA_FILE = new URL('redirects.tsv', import.meta.url);
export const CONF_FILE = new URL('conf.d/codeboxx-redirects.conf', import.meta.url);

/** The old Wix sitemap (in old-urls/) listing each group's URLs. */
export const OLD_URLS = {
  www: 'www.codeboxx.com.txt',
  apex: 'www.codeboxx.com.txt',
  academy: 'academy.codeboxx.com.txt',
  academie: 'academy.codeboxx.com.txt',
  solutions: 'www.solutions.codeboxx.com.txt',
};

const urlsIn = (file) =>
  readFileSync(file, 'utf8')
    .split('\n')
    .map((url) => url.trim())
    .filter(Boolean);

/**
 * A group's old URLs: its Wix sitemap, then those found outside it (old-urls/extra/, same file
 * name; Wayback Machine, CLP-1378), which only the tests and the check go through.
 */
export function oldUrls(group) {
  return ['old-urls/', 'old-urls/extra/']
    .map((dir) => new URL(dir + OLD_URLS[group], import.meta.url))
    .flatMap((file) => (existsSync(file) ? urlsIn(file) : []));
}

const ACME = /^\/\.well-known\/acme-challenge(\/|$)/;
const FROM = /^(\*|\/[a-z0-9._-]+(\/[a-z0-9._-]+)*(\/\*)?)$/;
const TO = /^(=|-|\/([a-z0-9._-]+\/?)*(#[a-z0-9-]+)?)$/;
// A "-" target: the page is gone. nginx doesn't redirect it but answers 410, with the 404 page.
export const GONE = '-';

/**
 * The group of a path with no page or file on codeboxx.ai itself (location @missing in
 * snippets/codeboxx-site.conf), checked before the 404. It has no host of its own: Cloudflare sends
 * codeboxx.biz/<path> to codeboxx.ai/<path>, so the old codeboxx.biz pages land there.
 */
export const MISSING = 'missing';
export const MISSING_HOSTS = ['codeboxx.ai', 'www.codeboxx.ai'];

/** { hosts: { hostname: group }, rules: [{ groups, from, to, kind, path, line }] } of redirects.tsv. */
export function parse(text) {
  const hosts = {};
  const rules = [];
  const seen = new Set();
  let section;
  text.split('\n').forEach((raw, index) => {
    const line = index + 1;
    const fail = (why) => {
      throw new Error(`redirects.tsv:${line}: ${why}`);
    };
    if (!raw.trim() || raw.startsWith('#')) return;
    if (/^\[\w+\]$/.test(raw)) {
      section = raw.slice(1, -1);
      return;
    }
    const fields = raw.split('\t');
    if (section === 'hosts' && fields.length === 2) {
      hosts[fields[0]] = fields[1];
      return;
    }
    if (section !== 'redirects' || fields.length !== 3) fail('unexpected line');
    const [groupList, from, to] = fields;
    const groups = groupList.split(',');
    if (!FROM.test(from) || ACME.test(from)) fail(`bad old path ${from}`);
    if (!TO.test(to)) fail(`bad target ${to}`);
    if (groups.includes(MISSING)) {
      if (groups.length > 1) fail(`${MISSING} goes on a line of its own`);
      // The page is missing on the site, so keeping its path would loop.
      if (from === '*' || to === '=') fail(`${MISSING} takes no catch-all and no "="`);
    }
    for (const group of groups) {
      if (group !== MISSING && !Object.values(hosts).includes(group))
        fail(`unknown group ${group}`);
      if (seen.has(`${group} ${from}`)) fail(`${from} repeated in ${group}`);
      seen.add(`${group} ${from}`);
    }
    const kind = from === '*' ? 'rest' : from.endsWith('/*') ? 'prefix' : 'exact';
    if (to === GONE && kind !== 'exact') fail(`${from}: only an exact old path can be gone`);
    rules.push({ groups, from, to, kind, path: from.replace(/\/\*$/, ''), line });
  });
  return { hosts, rules };
}

export const load = () => parse(readFileSync(DATA_FILE, 'utf8'));

/** The rule nginx applies to this host and path (as sent, with or without trailing slash), or null. */
export function match({ hosts, rules }, host, path) {
  const group = hosts[host.toLowerCase()];
  // nginx's map compares exact strings ignoring case; the prefix regexes use ~* to match.
  const trimmed = path.replace(/(.)\/+$/, '$1').toLowerCase();
  if (!group || ACME.test(trimmed)) return null;
  const mine = rules.filter((rule) => rule.groups.includes(group));
  const under = (rule) => trimmed === rule.path || trimmed.startsWith(rule.path + '/');
  return (
    mine.find((rule) => rule.kind === 'exact' && rule.path === trimmed) ??
    mine.find((rule) => rule.kind === 'prefix' && under(rule)) ??
    mine.find((rule) => rule.kind === 'rest') ??
    null
  );
}

/**
 * The path a "=" target keeps: a page's gets its trailing slash (no file extension, not under
 * /api/), since codeboxx.ai answers /blog with a 301 to /blog/; one hop instead of two.
 */
export const samePath = (path) => (/^(?!\/api\/).*\/[^/.]+$/.test(path) ? `${path}/` : path);

/** The Location nginx answers for this request, or null when it doesn't redirect. */
export function resolve(table, host, path, query = '') {
  const rule = match(table, host, path);
  if (!rule || rule.to === GONE) return null;
  const search = query ? `?${query}` : '';
  if (rule.to === '=') return SITE + samePath(path) + search;
  const [target, fragment] = rule.to.split('#');
  return SITE + target + search + (fragment ? `#${fragment}` : '');
}

/**
 * The rules a path missing on codeboxx.ai goes through: the "missing" ones, then www's old Wix
 * paths (a /post/ slug reached through codeboxx.biz), without www's "=" catch-all. An exact path
 * of both is the "missing" rule's.
 */
export function missingRules(rules) {
  const own = rules.filter((rule) => rule.groups.includes(MISSING));
  const taken = new Set(own.map((rule) => `${rule.kind} ${rule.path}`));
  const www = rules.filter(
    (rule) =>
      rule.groups.includes('www') &&
      rule.kind !== 'rest' &&
      rule.to !== '=' &&
      !taken.has(`${rule.kind} ${rule.path}`)
  );
  return [...own, ...www];
}

/** The rule nginx applies to a path missing on codeboxx.ai (as sent), or null: its 404. */
export function matchMissing({ rules }, path) {
  const trimmed = path.replace(/(.)\/+$/, '$1').toLowerCase();
  const mine = missingRules(rules);
  const under = (rule) => trimmed === rule.path || trimmed.startsWith(rule.path + '/');
  return (
    mine.find((rule) => rule.kind === 'exact' && rule.path === trimmed) ??
    mine.find((rule) => rule.kind === 'prefix' && under(rule)) ??
    null
  );
}

/** The Location for a path missing on codeboxx.ai, or null when it answers 404 or 410 (gone). */
export function resolveMissing(table, path, query = '') {
  const rule = matchMissing(table, path);
  if (!rule || rule.to === GONE) return null;
  const [target, fragment] = rule.to.split('#');
  return SITE + target + (query ? `?${query}` : '') + (fragment ? `#${fragment}` : '');
}

const quote = (text) => `"${text}"`;
const escape = (path) => path.replace(/[.]/g, '\\.');

/** The http-level nginx include (conf.d/codeboxx-redirects.conf) for the table. */
export function render({ hosts, rules: allRules }) {
  const rules = allRules.filter((rule) => !rule.groups.includes(MISSING));
  const missing = missingRules(allRules);
  const alternatives = (groups) => (groups.length > 1 ? `(${groups.join('|')})` : groups[0]);
  const exact = rules
    .filter((rule) => rule.kind === 'exact')
    .flatMap((rule) => rule.groups.map((group) => [`${group}:${rule.path}`, rule.to]));
  const prefix = rules
    .filter((rule) => rule.kind === 'prefix')
    .map((rule) => [`~*^${alternatives(rule.groups)}:${escape(rule.path)}(/.*)?$`, rule.to]);
  const rest = rules
    .filter((rule) => rule.kind === 'rest')
    .map((rule) => [`~^${alternatives(rule.groups)}:`, rule.to]);
  const entries = (pairs) => pairs.map(([key, value]) => `    ${quote(key)} ${quote(value)};`);
  return [
    '# Generated from redirects.tsv by `node ops/nginx/redirects.js`: edit that file, not this one.',
    '# Installed as /etc/nginx/conf.d/codeboxx-redirects.conf; snippets/codeboxx-redirects.conf',
    '# returns the redirect in the codeboxx server block. See ops/nginx/README.md.',
    '',
    '# Keys such as "academie:/post/<long slug>" outgrow the default bucket.',
    'map_hash_bucket_size 256;',
    '',
    'map $host $legacy_group {',
    '    default "";',
    ...Object.entries(hosts).map(([host, group]) => `    ${host} ${group};`),
    '}',
    '',
    '# Without its trailing slashes, so /contact and /contact/ match alike.',
    'map $uri $legacy_path {',
    '    default $uri;',
    '    "~^(.+?)/+$" $1;',
    '}',
    '',
    '# Exact paths first; then the regexes, in this order. "" does not redirect. "-" is a gone page:',
    '# location @missing in snippets/codeboxx-site.conf answers it 410.',
    'map "$legacy_group:$legacy_path" $legacy_target {',
    '    default "";',
    ...entries(exact),
    '    # Certificate issuance and renewal, on every host.',
    '    "~^[a-z]+:/\\.well-known/acme-challenge(/|$)" "";',
    ...entries(prefix),
    ...entries(rest),
    '}',
    '',
    '# "=" keeps the path, a page\'s with its trailing slash (samePath in redirects.js), and the',
    '# query string. $request_uri, not the decoded $uri, so an encoded CR/LF cannot split the response.',
    'map $request_uri $legacy_same_path {',
    `    default ${SITE}$request_uri;`,
    `    "~^(?!/api/)([^?]*/[^/?.]+)(\\?.*)?$" ${SITE}$1/$2;`,
    '}',
    '',
    '# The target path, the query string (ads: gclid, utm_*), then the fragment.',
    'map $legacy_target $legacy_location {',
    '    default "";',
    `    "${GONE}" "";`,
    '    "=" $legacy_same_path;',
    `    "~^([^#]+)(#.*)?$" ${SITE}$1$is_args$args$2;`,
    '}',
    '',
    "# The site's own redirects (src/lib/siteRedirects.js), on every host: one 301, returned by",
    "# snippets/codeboxx-site.conf, instead of Astro's meta-refresh page. With or without the",
    '# trailing slash; the query string, then the fragment.',
    'map $legacy_path $site_target {',
    '    default "";',
    ...Object.entries(SITE_REDIRECTS).map(([from, to]) => `    ${quote(from)} ${quote(to)};`),
    '}',
    '',
    'map $site_target $site_location {',
    '    default "";',
    '    "~^([^#]+)(#.*)?$" $1$is_args$args$2;',
    '}',
    '',
    '# A path with no page or file on codeboxx.ai (location @missing in snippets/codeboxx-site.conf),',
    '# before its 404: redirects.tsv\'s "missing" rules, then www\'s old Wix paths. Only on',
    '# codeboxx.ai: the IP and unknown hosts keep their 404. "-" is a gone page: nginx answers 410.',
    'map $host $missing_host {',
    '    default "";',
    ...MISSING_HOSTS.map((host) => `    ${host} site;`),
    '}',
    '',
    'map "$missing_host:$legacy_path" $missing_target {',
    '    default "";',
    ...entries(
      missing.filter((rule) => rule.kind === 'exact').map((rule) => [`site:${rule.path}`, rule.to])
    ),
    ...entries(
      missing
        .filter((rule) => rule.kind === 'prefix')
        .map((rule) => [`~*^site:${escape(rule.path)}(/.*)?$`, rule.to])
    ),
    '}',
    '',
    'map $missing_target $missing_location {',
    '    default "";',
    `    "${GONE}" "";`,
    `    "~^([^#]+)(#.*)?$" ${SITE}$1$is_args$args$2;`,
    '}',
    '',
  ].join('\n');
}

/** The Location nginx answers for a site redirect's target (SITE_REDIRECTS) and query string. */
export function siteLocation(to, query = '') {
  const [target, fragment] = to.split('#');
  return target + (query ? `?${query}` : '') + (fragment ? `#${fragment}` : '');
}

if (import.meta.main) {
  writeFileSync(CONF_FILE, render(load()));
  console.log(`wrote ${CONF_FILE.pathname}`);
}
