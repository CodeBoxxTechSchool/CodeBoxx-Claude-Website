import { readFileSync, writeFileSync } from 'node:fs';

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

// Temporary (CLP-1398, about four weeks from 2026-10-07): every old URL in one sitemap, which the
// apex serves instead of redirecting so it can be submitted in Search Console's codeboxx.com
// property; Google then recrawls the old URLs and sees their 301s sooner. Written to public/ with
// the conf; to retire it, delete the file and these lines.
export const OLD_URLS_SITEMAP = '/sitemap-old-urls.xml';
export const SITEMAP_FILE = new URL('../../public/sitemap-old-urls.xml', import.meta.url);

const ACME = /^\/\.well-known\/acme-challenge(\/|$)/;
const FROM = /^(\*|\/[a-z0-9._-]+(\/[a-z0-9._-]+)*(\/\*)?)$/;
const TO = /^(=|\/([a-z0-9._-]+\/?)*(#[a-z0-9-]+)?)$/;

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
    for (const group of groups) {
      if (!Object.values(hosts).includes(group)) fail(`unknown group ${group}`);
      if (seen.has(`${group} ${from}`)) fail(`${from} repeated in ${group}`);
      seen.add(`${group} ${from}`);
    }
    const kind = from === '*' ? 'rest' : from.endsWith('/*') ? 'prefix' : 'exact';
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
  if (group === 'apex' && trimmed === OLD_URLS_SITEMAP) return null;
  const mine = rules.filter((rule) => rule.groups.includes(group));
  const under = (rule) => trimmed === rule.path || trimmed.startsWith(rule.path + '/');
  return (
    mine.find((rule) => rule.kind === 'exact' && rule.path === trimmed) ??
    mine.find((rule) => rule.kind === 'prefix' && under(rule)) ??
    mine.find((rule) => rule.kind === 'rest') ??
    null
  );
}

/** The Location nginx answers for this request, or null when it doesn't redirect. */
export function resolve(table, host, path, query = '') {
  const rule = match(table, host, path);
  if (!rule) return null;
  const search = query ? `?${query}` : '';
  if (rule.to === '=') return SITE + path + search;
  const [target, fragment] = rule.to.split('#');
  return SITE + target + search + (fragment ? `#${fragment}` : '');
}

const quote = (text) => `"${text}"`;
const escape = (path) => path.replace(/[.]/g, '\\.');

/** The http-level nginx include (conf.d/codeboxx-redirects.conf) for the table. */
export function render({ hosts, rules }) {
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
    '# Exact paths first; then the regexes, in this order.',
    'map "$legacy_group:$legacy_path" $legacy_target {',
    '    default "";',
    ...entries(exact),
    '    # Certificate issuance and renewal, on every host.',
    '    "~^[a-z]+:/\\.well-known/acme-challenge(/|$)" "";',
    '    # Temporary: the old URLs sitemap, served by the apex (OLD_URLS_SITEMAP in redirects.js).',
    `    "apex:${OLD_URLS_SITEMAP}" "";`,
    ...entries(prefix),
    ...entries(rest),
    '}',
    '',
    '# The target path, the query string (ads: gclid, utm_*), then the fragment; "=" keeps the path.',
    '# $request_uri, not the decoded $uri, so an encoded CR/LF cannot split the response.',
    'map $legacy_target $legacy_location {',
    '    default "";',
    `    "=" ${SITE}$request_uri;`,
    `    "~^([^#]+)(#.*)?$" ${SITE}$1$is_args$args$2;`,
    '}',
    '',
  ].join('\n');
}

const xmlEscape = (text) =>
  text.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);

/** Every old Wix URL (old-urls/), as the sitemap at OLD_URLS_SITEMAP. */
export function oldUrlsSitemap() {
  const urls = [...new Set(Object.values(OLD_URLS))].flatMap((name) =>
    readFileSync(new URL(`old-urls/${name}`, import.meta.url), 'utf8')
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean)
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!-- Generated by `node ops/nginx/redirects.js` from ops/nginx/old-urls/. Temporary (CLP-1398). -->',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...[...new Set(urls)].map((url) => `  <url><loc>${xmlEscape(url)}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
}

if (import.meta.main) {
  writeFileSync(CONF_FILE, render(load()));
  console.log(`wrote ${CONF_FILE.pathname}`);
  writeFileSync(SITEMAP_FILE, oldUrlsSitemap());
  console.log(`wrote ${SITEMAP_FILE.pathname}`);
}
