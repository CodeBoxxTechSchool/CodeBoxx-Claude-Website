import { execFile } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import { isIPv4 } from 'node:net';
import { homedir } from 'node:os';
import { isAbsolute, join, relative, resolve } from 'node:path';
import tls from 'node:tls';
import { fileURLToPath } from 'node:url';
import { parseArgs, promisify } from 'node:util';
import { load } from '../nginx/redirects.js';

const USAGE = `usage: node ops/swap/check.js snapshot [--out file]
       node ops/swap/check.js ttl
       node ops/swap/check.js check [--snapshot file] [--names a,b] [--expect-ip ip]`;
export const SITE = 'codeboxx.com';
export const DROPLET_IP = '159.223.145.47';
/** The eight names that move: the hosts of the nginx redirects (their tests pin them). */
export const WEBSITE_NAMES = Object.keys(load().hosts);
export const WIX_NAMESERVERS = ['ns0.wixdns.net', 'ns1.wixdns.net'];
export const PUBLIC_RESOLVERS = ['1.1.1.1', '8.8.8.8', '9.9.9.9'];
export const MAX_TTL = 300;
const WEBSITE_TYPES = ['A', 'AAAA', 'CNAME'];
const MIN_CERT_DAYS = 14;
const REPO = fileURLToPath(new URL('../../', import.meta.url));

/** Every record the snapshot holds, [name, type]: the website records, then the others. */
export const RECORDS = [
  ...WEBSITE_NAMES.flatMap((name) => WEBSITE_TYPES.map((type) => [name, type])),
  ...['NS', 'MX', 'TXT', 'CAA'].map((type) => [SITE, type]),
  [`_dmarc.${SITE}`, 'TXT'],
  [`google._domainkey.${SITE}`, 'TXT'],
  [`s1._domainkey.${SITE}`, 'CNAME'],
  [`s2._domainkey.${SITE}`, 'CNAME'],
];
/** The records the swap edits: the address records of the eight names (not the apex's MX, TXT...). */
export const isWebsiteRecord = (record) =>
  WEBSITE_NAMES.includes(record.name) && WEBSITE_TYPES.includes(record.type);

// dig, not Node's resolver: that one gives no TTL for a CNAME, and the TTL is the go/no-go.
const run = promisify(execFile);
const DIG_MISSING = 'dig not found: apt install bind9-dnsutils (dnsutils on older systems)';
const unescape = (text) =>
  text.replace(/\\(\d{3}|.)/g, (_, c) => (c.length === 3 ? String.fromCharCode(c) : c));

/** { status, answers: [{ name, type, ttl, value }] } of `dig +noall +comments +answer` output. */
export function parseDig(text) {
  const answers = [];
  for (const line of text.split('\n')) {
    const [, name, ttl, type, data] = line.match(/^(\S+)\s+(\d+)\s+IN\s+(\S+)\s+(.*?)\s*$/) ?? [];
    if (!name) continue;
    const value =
      type === 'TXT'
        ? [...data.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => unescape(m[1])).join('')
        : data.replace(/\.$/, '').toLowerCase();
    answers.push({ name: name.replace(/\.$/, '').toLowerCase(), type, ttl: Number(ttl), value });
  }
  return { status: text.match(/status: (\w+)/)?.[1] ?? null, answers };
}

/** The answer section for name/type from a server; only the public resolvers recurse. */
async function dig(server, name, type, recursive = PUBLIC_RESOLVERS.includes(server)) {
  const what = `${name} ${type} @${server}`;
  const recurse = recursive ? '+recurse' : '+norecurse';
  const args = ['+noall', '+comments', '+answer', recurse, '+time=3', '+tries=2', name, type];
  const { stdout } = await run('dig', [...args, `@${server}`]).catch((error) => {
    throw new Error(`${(error.stdout || error.message).trim().split('\n').at(-1)}: ${what}`);
  });
  const { status, answers } = parseDig(stdout);
  if (!['NOERROR', 'NXDOMAIN'].includes(status))
    throw new Error(`${status ?? 'no answer'}: ${what}`);
  return answers;
}

/** { name, type, ttl, values } at this server: the records of that type at that name. */
async function records(server, name, type) {
  const answers = (await dig(server, name, type)).filter((a) => a.name === name && a.type === type);
  const ttl = answers.length ? Math.max(...answers.map((a) => a.ttl)) : null;
  return { name, type, ttl, values: answers.map((a) => a.value).sort() };
}

/** { chain, addresses }: the A records of name at a server, through CNAMEs (in the zone only
 * when the server is authoritative). */
async function addresses(server, name) {
  const recursive = PUBLIC_RESOLVERS.includes(server);
  const chain = [];
  let current = name;
  for (let depth = 0; depth < 5; depth++) {
    const answers = await dig(server, current, 'A');
    const cnames = answers.filter((a) => a.type === 'CNAME');
    chain.push(...cnames.map((a) => a.value));
    const found = answers.filter((a) => a.type === 'A').map((a) => a.value);
    if (found.length || !cnames.length) return { chain, addresses: found.sort() };
    current = cnames.at(-1).value;
    if (!recursive && current !== SITE && !current.endsWith(`.${SITE}`)) break;
  }
  return { chain, addresses: [] };
}

// Results: { ok, what, detail }, one line each.
export const formatResult = ({ ok, what, detail }) =>
  `${ok ? 'ok  ' : 'FAIL'} ${what}${detail ? `: ${detail}` : ''}`;
export function summary(results) {
  const failed = results.filter((r) => !r.ok).length;
  return `${results.length} checks, ${failed} failed`;
}

const listed = (values) => values.join(' | ') || '(none)';

export function formatTable(list) {
  const rows = list.map((r) => [r.name, r.type, r.ttl ?? '-', listed(r.values)]);
  const widths = [0, 1, 2].map((i) => Math.max(...rows.map((row) => String(row[i]).length)));
  const pad = (cell, i) => String(cell).padEnd(widths[i] ?? 0);
  return rows.map((row) => row.map(pad).join('  ').trimEnd());
}

const wixTag = (text) => (/wixdns\.net|^185\.230\.63\./.test(text) ? `${text} (Wix)` : text);
const describe = ({ chain, addresses }) =>
  [...chain, addresses.join(',') || 'no address'].map(wixTag).join(' -> ');

/** One result from { source: answer | Error }: every answer must pass isRight. */
function everySource(what, answers, isRight, show) {
  const wrong = Object.entries(answers).filter(([, a]) => a instanceof Error || !isRight(a));
  const why = (a) => (a instanceof Error ? a.message : show(a));
  const detail = wrong.map(([source, a]) => `@${source} ${why(a)}`);
  return { ok: !wrong.length, what, detail: detail.join('; ') };
}

/** The name must resolve to the droplet alone everywhere. */
export function dnsResult(name, answers, expectIp) {
  const alone = (a) => a.addresses.join() === expectIp;
  return everySource(`dns ${name} -> ${expectIp}`, answers, alone, describe);
}

/** A snapshot record must hold the same values on every nameserver. */
export function recordResult(expected, current) {
  const want = listed(expected.values);
  const show = (got) => listed(got.values);
  const same = (got) => show(got) === want;
  const result = everySource(`unchanged ${expected.name} ${expected.type}`, current, same, show);
  if (!result.ok) result.detail = `want ${want}, got ${result.detail}`;
  return result;
}

function request(url, method = 'HEAD') {
  const client = url.startsWith('https:') ? https : http;
  return new Promise((done, fail) => {
    const req = client.request(url, { method, agent: false, timeout: 10_000 }, (res) => {
      const { statusCode: status, headers, socket } = res;
      const answer = {
        status,
        location: headers.location,
        address: socket.remoteAddress,
        body: '',
      };
      res.setEncoding('utf8');
      res.on('data', (chunk) => (answer.body += chunk));
      res.on('end', () => done(answer));
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', fail);
    req.end();
  });
}

function certificate(name) {
  return new Promise((done, fail) => {
    const socket = tls.connect({ host: name, port: 443, servername: name, timeout: 10_000 }, () => {
      const cert = socket.getPeerCertificate();
      const validTo = new Date(cert.valid_to);
      done({ address: socket.remoteAddress, validTo, issuer: cert.issuer?.O });
      socket.end();
    });
    socket.on('timeout', () => socket.destroy(new Error('timeout')));
    socket.on('error', fail);
  });
}

// Through this machine's DNS, which may still hold the old answer (then Wix answered, not nginx).
const elsewhere = (address, expectIp) =>
  address === expectIp ? '' : `reached ${address}, not the droplet ${expectIp}`;

/** A network check's result: it gives [what is wrong or '', detail]; an error fails it. */
const probe = (what, check) =>
  check.then(
    ([wrong, detail]) => ({ ok: !wrong, what, detail: wrong ? `${wrong}; ${detail}` : detail }),
    (error) => ({ ok: false, what, detail: error.code ?? error.message })
  );

async function checkTls(name, expectIp) {
  const cert = await certificate(name);
  const days = Math.floor((cert.validTo - Date.now()) / 86_400_000);
  const soon = days < MIN_CERT_DAYS ? 'expires soon' : '';
  const until = cert.validTo.toISOString().slice(0, 10);
  return [
    elsewhere(cert.address, expectIp) || soon,
    `${cert.issuer}, ${days} days left (${until})`,
  ];
}

async function checkHttp(name, expectIp) {
  const res = await request(`http://${name}/`);
  // Old hosts go to the site (codeboxx.ai), the apex to https on itself.
  const redirected =
    res.status === 301 && /^https:\/\/codeboxx\.(ai|com)\//.test(res.location ?? '');
  const wrong = elsewhere(res.address, expectIp) || (redirected ? '' : 'wrong answer');
  return [wrong, `${res.status} ${res.location ?? ''}`];
}

async function checkHealth(expectIp) {
  const res = await request(`https://${SITE}/api/health`, 'GET');
  const healthy = res.status === 200 && /"ok":\s*true\b/.test(res.body);
  const wrong = elsewhere(res.address, expectIp) || (healthy ? '' : 'wrong answer');
  return [wrong, `${res.status} ${res.body.trim()}`];
}

function report(results, out) {
  results.forEach((result) => out(formatResult(result)));
  out(summary(results));
  return results.every((result) => result.ok) ? 0 : 1;
}

const settle = (promise) => promise.catch((error) => error);
/** { server: what fn(server) gave, or its Error }. */
const byServer = async (servers, fn) =>
  Object.fromEntries(await Promise.all(servers.map(async (s) => [s, await settle(fn(s))])));

export function parseCommand(argv, cwd = process.cwd()) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      out: { type: 'string' },
      snapshot: { type: 'string' },
      names: { type: 'string' },
      'expect-ip': { type: 'string', default: DROPLET_IP },
    },
  });
  const [command, ...rest] = positionals;
  if (!['snapshot', 'ttl', 'check'].includes(command) || rest.length)
    throw new Error('unknown command');
  const names = values.names
    ? values.names.split(',').map((n) => n.trim().toLowerCase())
    : WEBSITE_NAMES;
  const unknown = names.filter((name) => !WEBSITE_NAMES.includes(name));
  if (unknown.length) throw new Error(`not a website name: ${unknown.join(', ')}`);
  if (!isIPv4(values['expect-ip'])) throw new Error('--expect-ip takes an IPv4 address');
  const stamp = `${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`;
  const out = resolve(cwd, values.out ?? join(homedir(), `swap-snapshot-${stamp}.json`));
  const inRepo = relative(REPO, out);
  if (!inRepo.startsWith('..') && !isAbsolute(inRepo))
    throw new Error(`${out} is inside the repo: keep snapshots out of it`);
  return { command, names, out, snapshot: values.snapshot, expectIp: values['expect-ip'] };
}

export async function main(argv, { out = console.log, err = console.error } = {}) {
  let options;
  try {
    options = parseCommand(argv);
  } catch (error) {
    err(`${error.message}\n${USAGE}`);
    return 2;
  }
  const hasDig = await run('dig', ['-v']).then(Boolean, () => false);
  if (!hasDig) return (err(DIG_MISSING), 2);
  const servers = WIX_NAMESERVERS;

  if (options.command === 'snapshot') {
    const [server] = servers;
    const list = await Promise.all(RECORDS.map(([name, type]) => records(server, name, type)));
    const takenAt = new Date().toISOString();
    writeFileSync(options.out, JSON.stringify({ takenAt, server, records: list }, null, 2) + '\n');
    out(`${takenAt} @${server}\n${formatTable(list).join('\n')}\nSaved to ${options.out}`);
    return 0;
  }

  if (options.command === 'ttl') {
    const results = await Promise.all(
      WEBSITE_NAMES.flatMap((name) =>
        servers.map(async (server) => {
          const what = `ttl ${name} @${server}`;
          const answers = await settle(dig(server, name, 'A'));
          if (answers instanceof Error) return { ok: false, what, detail: answers.message };
          const own = answers.filter((a) => a.name === name);
          const ttl = own.length ? Math.max(...own.map((a) => a.ttl)) : null;
          const detail = `${own[0]?.type ?? 'no record'} ${ttl ?? ''}`.trim();
          return { ok: ttl !== null && ttl <= MAX_TTL, what: `${what} <= ${MAX_TTL}`, detail };
        })
      )
    );
    const code = report(results, out);
    out('Switch no sooner than 1 h after the old 3600 s TTL was replaced (resolvers keep it).');
    return code;
  }

  const sources = [...servers, ...PUBLIC_RESOLVERS];
  const jobs = options.names.flatMap((name) => [
    byServer(sources, (s) => addresses(s, name)).then((a) => dnsResult(name, a, options.expectIp)),
    probe(`https ${name} certificate`, checkTls(name, options.expectIp)),
    probe(`http://${name}/ -> 301 https`, checkHttp(name, options.expectIp)),
  ]);
  const health = `https://${SITE}/api/health -> 200 ok:true`;
  if (options.names.includes(SITE)) jobs.push(probe(health, checkHealth(options.expectIp)));
  else out(`--   /api/health skipped: ${SITE} is not in --names`);
  if (options.snapshot) {
    const snapshot = JSON.parse(readFileSync(options.snapshot, 'utf8'));
    for (const expected of snapshot.records.filter((r) => !isWebsiteRecord(r)))
      jobs.push(
        byServer(servers, (s) => records(s, expected.name, expected.type)).then((got) =>
          recordResult(expected, got)
        )
      );
  }
  return report(await Promise.all(jobs), out);
}

if (import.meta.main)
  process.exitCode = await main(process.argv.slice(2)).catch((error) => {
    console.error(error.message);
    return 1;
  });
