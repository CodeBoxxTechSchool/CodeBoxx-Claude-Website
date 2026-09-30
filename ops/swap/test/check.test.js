import assert from 'node:assert/strict';
import { homedir } from 'node:os';
import { test } from 'node:test';
import {
  RECORDS,
  WEBSITE_NAMES,
  dnsResult,
  formatResult,
  formatTable,
  isWebsiteRecord,
  parseCommand,
  parseDig,
  recordResult,
  summary,
} from '../check.js';

const REPO = new URL('../../../', import.meta.url).pathname;

// dig +noall +comments +answer output: header comments, then the answer section.
const DIG = `;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 4981
;; flags: qr rd ra; QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 1

;; ANSWER SECTION:
WWW.codeboxx.com.\t300\tIN\tCNAME\tcodeboxx.com.
codeboxx.com.\t\t3600\tIN\tA\t159.223.145.47
google._domainkey.codeboxx.com.\t3600 IN\tTXT\t"v=DKIM1; k=rsa; p=MIIB" "IjAN  \\"x\\" \\059"
codeboxx.com.\t\t3600\tIN\tMX\t5 alt2.aspmx.l.google.com.

`;

test('parses dig output: status and answers, TXT strings joined', () => {
  assert.deepEqual(parseDig(DIG), {
    status: 'NOERROR',
    answers: [
      { name: 'www.codeboxx.com', type: 'CNAME', ttl: 300, value: 'codeboxx.com' },
      { name: 'codeboxx.com', type: 'A', ttl: 3600, value: '159.223.145.47' },
      {
        name: 'google._domainkey.codeboxx.com',
        type: 'TXT',
        ttl: 3600,
        value: 'v=DKIM1; k=rsa; p=MIIBIjAN  "x" ;',
      },
      { name: 'codeboxx.com', type: 'MX', ttl: 3600, value: '5 alt2.aspmx.l.google.com' },
    ],
  });
  const refused = ';; ->>HEADER<<- opcode: QUERY, status: REFUSED, id: 22844\n';
  assert.deepEqual(parseDig(refused), { status: 'REFUSED', answers: [] });
  assert.deepEqual(parseDig(''), { status: null, answers: [] });
});

test('the website records are the address records of the eight names, nothing else', () => {
  assert.equal(WEBSITE_NAMES.length, 8);
  assert.equal(RECORDS.filter(([name, type]) => isWebsiteRecord({ name, type })).length, 24);
  assert.ok(isWebsiteRecord({ name: 'codeboxx.com', type: 'A' }));
  assert.ok(isWebsiteRecord({ name: 'www.academie.codeboxx.com', type: 'CNAME' }));
  for (const type of ['NS', 'MX', 'TXT', 'CAA'])
    assert.ok(!isWebsiteRecord({ name: 'codeboxx.com', type }), type);
  assert.ok(!isWebsiteRecord({ name: 's1._domainkey.codeboxx.com', type: 'CNAME' }));
});

test('parses the command line', () => {
  const check = parseCommand([
    'check',
    '--names',
    'solutions.codeboxx.com, WWW.solutions.codeboxx.com',
  ]);
  assert.deepEqual(check.names, ['solutions.codeboxx.com', 'www.solutions.codeboxx.com']);
  assert.equal(check.expectIp, '159.223.145.47');
  assert.deepEqual(parseCommand(['check']).names, WEBSITE_NAMES);
  assert.equal(parseCommand(['check', '--expect-ip', '127.0.0.1']).expectIp, '127.0.0.1');
  assert.match(parseCommand(['snapshot']).out, /\/swap-snapshot-\d{8}T\d{6}Z\.json$/);
  assert.ok(parseCommand(['snapshot']).out.startsWith(homedir()));
  assert.equal(parseCommand(['snapshot', '--out', 'snap.json'], '/tmp').out, '/tmp/snap.json');
  assert.throws(() => parseCommand(['snapshot', '--out', 'snap.json'], REPO), /inside the repo/);
  assert.throws(() => parseCommand(['check', '--names', 'example.com']), /not a website name/);
  assert.throws(() => parseCommand(['check', '--expect-ip', 'codeboxx.com']), /IPv4/);
  assert.throws(() => parseCommand(['switch']), /unknown command/);
  assert.throws(() => parseCommand(['check', '--nmes', 'x']), /Unknown option/);
});

test('dns passes only when every source answers the droplet alone', () => {
  const droplet = { chain: ['codeboxx.com'], addresses: ['159.223.145.47'] };
  const wix = { chain: ['cdn3.wixdns.net', 'cfd.wixdns.net'], addresses: ['162.159.143.12'] };
  assert.equal(
    dnsResult('www.codeboxx.com', { a: droplet, b: droplet }, '159.223.145.47').ok,
    true
  );
  const late = dnsResult('www.codeboxx.com', { a: droplet, '8.8.8.8': wix }, '159.223.145.47');
  assert.equal(late.ok, false);
  assert.equal(
    late.detail,
    '@8.8.8.8 cdn3.wixdns.net (Wix) -> cfd.wixdns.net (Wix) -> 162.159.143.12'
  );
  const extra = { chain: [], addresses: ['159.223.145.47', '185.230.63.107'] };
  assert.equal(dnsResult('codeboxx.com', { a: extra }, '159.223.145.47').ok, false);
  assert.match(
    dnsResult('codeboxx.com', { a: new Error('no answer') }, '1.2.3.4').detail,
    /no answer/
  );
});

test('a snapshot record must be the same on every nameserver', () => {
  const mx = { name: 'codeboxx.com', type: 'MX', ttl: 3600, values: ['5 alt2.aspmx.l.google.com'] };
  assert.deepEqual(recordResult(mx, { ns0: { ...mx, ttl: 300 }, ns1: mx }), {
    ok: true,
    what: 'unchanged codeboxx.com MX',
    detail: '',
  });
  const changed = recordResult(mx, { ns0: mx, ns1: { ...mx, values: [] } });
  assert.equal(changed.ok, false);
  assert.equal(changed.detail, 'want 5 alt2.aspmx.l.google.com, got @ns1 (none)');
  const caa = { name: 'codeboxx.com', type: 'CAA', ttl: null, values: [] };
  assert.equal(recordResult(caa, { ns0: caa, ns1: caa }).ok, true);
});

test('formats results, the summary and the snapshot table', () => {
  const results = [
    { ok: true, what: 'dns a', detail: '' },
    { ok: false, what: 'https a certificate', detail: 'ERR_TLS_CERT_ALTNAME_INVALID' },
  ];
  assert.deepEqual(results.map(formatResult), [
    'ok   dns a',
    'FAIL https a certificate: ERR_TLS_CERT_ALTNAME_INVALID',
  ]);
  assert.equal(summary(results), '2 checks, 1 failed');
  const table = formatTable([
    { name: 'codeboxx.com', type: 'A', ttl: 300, values: ['159.223.145.47'] },
    { name: 'www.codeboxx.com', type: 'AAAA', ttl: null, values: [] },
  ]);
  assert.deepEqual(table, [
    'codeboxx.com      A     300  159.223.145.47',
    'www.codeboxx.com  AAAA  -    (none)',
  ]);
});
