import { readFile } from 'node:fs/promises';

const DEFAULT_LOG = '/var/log/nginx/access.log.1';
const SENDGRID_URL = 'https://api.sendgrid.com/v3/mail/send';
const MAX_ROWS = 50;
// A 404 with no referrer and no crawler is reported only from this many hits in the day.
const MIN_HITS = 3;
const MONTHS = 'JanFebMarAprMayJunJulAugSepOctNovDec';

/** Referrer hosts that make a 404 a broken link on our own site. */
export const OWN_HOSTS = ['codeboxx.com', 'www.codeboxx.com', '159.223.145.47'];

/** Search engine crawlers, by user agent: a URL they recrawl keeps costing us. */
export const CRAWLERS = /Googlebot|bingbot|DuckDuckBot|YandexBot|Applebot|Baiduspider/i;

/**
 * ops/nginx/check-redirects.js's user agent (USER_AGENT there): its 404s are expected, it asks
 * for them on purpose (an unredirected path on the IP, /.well-known/acme-challenge/test).
 */
export const OWN_CHECK = /^codeboxx-check-redirects\b/;

/**
 * 404 paths (percent-decoded) that are scanner probes, ignored even with a referrer or many hits.
 * Old Wix URLs (/post/some-title, /blog, /fr/...) must never match: finding those is the point of
 * the report.
 */
export const PROBES = [
  /\/\.(?!well-known\/)/, // dotfiles and dot-folders: /.env, /.git/config, /app/.aws/...
  /\.(php\d?|aspx?|jsp|cgi|env|sql|bak|ini|ya?ml|log)(\/|$)/i,
  /\/wp-/i,
  /\/(cgi-bin|vendor|phpunit)(\/|$)/i,
  /^\/(SDK|containers|actuator|boaform|HNAP1|webui)(\/|$)/i,
  // Sitemap name guesses (/sitemap_index.xml, /sitemap1.xml, /sitemap.txt, ...); ours are
  // /sitemap.xml, /sitemap-index.xml and /sitemap-0.xml, so a 404 on those still shows.
  /^\/sitemap(?!(-index|-0)?\.xml$)[\w-]*\.(xml|xml\.gz|txt)$/i,
];

// nginx's combined format; a quoted field holds no raw quote (nginx logs it as \x22).
const LINE =
  /^\S+ \S+ \S+ \[(\d\d)\/(\w{3})\/(\d{4}):[^\]]*\] "([^"]*)" (\d{3}) \S+ "([^"]*)" "([^"]*)"/;
const REQUEST = /^([A-Z]+) (\/\S*) HTTP\/[\d.]+$/;

/** { day, method, path, status, referrer, userAgent } of a log line, or null when malformed. */
export function parseLine(line) {
  const match = LINE.exec(line);
  const request = match && REQUEST.exec(match[4]);
  if (!request) return null;
  const [, dd, mon, yyyy, , status, referrer, userAgent] = match;
  const month = String(MONTHS.indexOf(mon) / 3 + 1).padStart(2, '0');
  return {
    day: `${yyyy}-${month}-${dd}`,
    method: request[1],
    path: request[2].split('?')[0],
    status: Number(status),
    referrer: referrer === '-' ? '' : referrer,
    userAgent,
  };
}

export function isProbe(path) {
  let decoded = path;
  try {
    decoded = decodeURIComponent(path);
  } catch {
    // Not valid percent-encoding: matched as is.
  }
  return PROBES.some((pattern) => pattern.test(decoded));
}

export const isOwnReferrer = (referrer) => OWN_HOSTS.includes(URL.parse(referrer)?.hostname);

/**
 * The day's { day, total, errors, missing, ignored }: 5xx by status and path, and 404s of GET and
 * HEAD by path, both sorted for the email. A 404 path is kept only when a hit had a referrer or
 * came from a crawler, or it got MIN_HITS hits: one-off scanner requests, probes and other methods
 * are only counted in ignored.
 */
export function summarize(text) {
  const days = new Map();
  const errors = new Map();
  const missing = new Map();
  let total = 0;
  let ignored = 0;
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    total++;
    const hit = parseLine(line);
    if (!hit) continue;
    days.set(hit.day, (days.get(hit.day) ?? 0) + 1);
    if (hit.status >= 500) {
      const key = `${hit.status} ${hit.path}`;
      const row = errors.get(key) ?? { status: hit.status, path: hit.path, count: 0 };
      row.count++;
      errors.set(key, row);
    } else if (hit.status === 404) {
      if (
        !['GET', 'HEAD'].includes(hit.method) ||
        isProbe(hit.path) ||
        OWN_CHECK.test(hit.userAgent)
      ) {
        ignored++;
        continue;
      }
      const row = missing.get(hit.path) ?? {
        path: hit.path,
        count: 0,
        internal: false,
        external: false,
        crawled: false,
      };
      row.count++;
      row.internal ||= isOwnReferrer(hit.referrer);
      row.external ||= Boolean(hit.referrer) && !isOwnReferrer(hit.referrer);
      row.crawled ||= CRAWLERS.test(hit.userAgent);
      missing.set(hit.path, row);
    }
  }
  const kept = [];
  for (const row of missing.values()) {
    if (row.internal || row.external || row.crawled || row.count >= MIN_HITS) kept.push(row);
    else ignored += row.count;
  }
  // The file can start or end with a few lines from around midnight: the day is the most common.
  const day = [...days].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  return {
    day,
    total,
    ignored,
    errors: [...errors.values()].sort((a, b) => b.count - a.count || a.path.localeCompare(b.path)),
    missing: kept.sort(
      (a, b) =>
        b.internal - a.internal ||
        b.external - a.external ||
        b.count - a.count ||
        a.path.localeCompare(b.path)
    ),
  };
}

// Why a 404 row is there, the first that applies.
const MARKS = {
  internal: 'linked from our own site',
  external: 'linked from another site',
  crawled: 'crawled by a search engine',
};

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/** { subject, text } of the email, or null when there is nothing to report. */
export function formatEmail({ day, total, errors, missing, ignored }) {
  if (!errors.length && !missing.length) return null;
  const errorHits = errors.reduce((sum, row) => sum + row.count, 0);
  const counts = [
    errorHits && plural(errorHits, 'server error', 'server errors'),
    missing.length && plural(missing.length, 'page not found', 'pages not found'),
  ].filter(Boolean);
  const lines = [`nginx access log of the codeboxx.com website droplet for ${day} (UTC).`, ''];
  if (errors.length) {
    lines.push(`Server errors (5xx): ${plural(errorHits, 'hit', 'hits')}`);
    lines.push(...table(errors, (row) => `${row.status}  ${row.path}`), '');
  }
  if (missing.length) {
    lines.push(`Pages not found (404): ${plural(missing.length, 'path', 'paths')}`);
    const mark = (row) => {
      const reason = Object.keys(MARKS).find((key) => row[key]);
      return reason ? `  <- ${MARKS[reason]}` : '';
    };
    lines.push(...table(missing, (row) => `${row.path}${mark(row)}`), '');
  }
  lines.push(
    `${plural(ignored, '404 hit', '404 hits')} ignored (scanner probes, our redirect checks and one-off requests).`
  );
  lines.push(`${plural(total, 'request', 'requests')} in total.`);
  return {
    subject: `codeboxx.com website: ${counts.join(', ')} (${day})`,
    text: lines.join('\n') + '\n',
  };
}

function table(rows, describe) {
  const lines = rows
    .slice(0, MAX_ROWS)
    .map((row) => `${String(row.count).padStart(6)}  ${describe(row)}`);
  if (rows.length > MAX_ROWS) lines.push(`  ... and ${rows.length - MAX_ROWS} more`);
  return lines;
}

/** Sends the email; resolves to null, or to an error message that never holds the key. */
export async function send({ subject, text }, { apiKey, to, from }, fetch = globalThis.fetch) {
  const res = await fetch(SENDGRID_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: to.map((email) => ({ email })) }],
      from: { email: from },
      subject,
      content: [{ type: 'text/plain', value: text }],
    }),
    signal: AbortSignal.timeout(30_000),
  });
  if (res.ok) return null;
  const body = await res.json().catch(() => null);
  const messages = (body?.errors ?? []).map((error) => error.message).join('; ');
  return `SendGrid answered ${res.status}${messages ? `: ${messages}` : ''}`.replaceAll(
    apiKey,
    '[key]'
  );
}

/** Runs the report; resolves to the exit code. */
export async function main(
  args,
  { env = process.env, fetch = globalThis.fetch, out = console.log, err = console.error } = {}
) {
  const dryRun = args.includes('--dry-run');
  const unknown = args.filter((arg) => arg.startsWith('-') && arg !== '--dry-run');
  if (unknown.length) {
    err(`nginx-report: unknown option(s): ${unknown.join(', ')}`);
    return 1;
  }
  const path = args.find((arg) => !arg.startsWith('-')) ?? DEFAULT_LOG;
  const { SENDGRID_API_KEY: apiKey, REPORT_TO = '', REPORT_FROM } = env;
  const to = REPORT_TO.split(/[;,]/)
    .map((address) => address.trim())
    .filter(Boolean);
  const missing = [!apiKey && 'SENDGRID_API_KEY', !to.length && 'REPORT_TO'].filter(Boolean);
  if (!dryRun && missing.length) {
    err(`nginx-report: missing environment variable(s): ${missing.join(', ')}`);
    return 1;
  }

  let text;
  try {
    text = await readFile(path, 'utf8');
  } catch (error) {
    err(`nginx-report: cannot read ${path} (${error.code ?? error.name})`);
    return 1;
  }
  const summary = summarize(text);
  const email = formatEmail(summary);
  if (!email) {
    out(`nginx-report ${summary.day ?? path}: nothing to report`);
    return 0;
  }
  if (dryRun) {
    out(`Subject: ${email.subject}\n\n${email.text}`);
    return 0;
  }
  const from = REPORT_FROM || 'portal@codeboxx.com';
  const failure = await send(email, { apiKey, to, from }, fetch).catch(
    (error) => `cannot reach SendGrid (${error.cause?.code ?? error.name})`
  );
  if (failure) {
    err(`nginx-report: ${failure}`);
    return 1;
  }
  out(`nginx-report ${summary.day}: sent "${email.subject}" to ${to.length} address(es)`);
  return 0;
}

if (import.meta.main) process.exitCode = await main(process.argv.slice(2));
