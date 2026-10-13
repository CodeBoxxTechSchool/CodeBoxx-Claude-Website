// The Academy's start dates, read at build time from the school portal through the website
// relay's GET /api/cohorts (relay/cohorts.js): the portal is their only source. They feed the
// Academy page in both languages (the Starts list, the <title> and the Course structured data)
// and /llms.txt. One portal cohort is one start date, offered online or at St. Pete, full or
// part time. Only starts within the next WINDOW_DAYS are published; the deploy runs every day
// (.github/workflows/deploy.yml) so dates enter and leave that window on time.
//
// A production build that can't get the dates fails, so the deploy stops and the live site keeps
// the dates it has, rather than publishing an Academy page without any. `astro dev` warns and
// carries on without dates.
//
// COHORTS_URL (default below) or COHORTS_FILE (a local JSON file holding the same answer, for
// offline work), from the environment or .env.
import { readFile as fsReadFile } from 'node:fs/promises';
import { PROGRAM_FACTS } from './academyPrograms.js';

export const COHORTS_URL = 'https://codeboxx.ai/api/cohorts';
export const WINDOW_DAYS = 90;
const TIMEOUT_MS = 15_000;
const DAY_MS = 24 * 60 * 60 * 1000;
// The relay serves its last copy while the portal is down: past two days, the build log says so.
const STALE_MS = 2 * DAY_MS;

/**
 * The start dates per site program key ({ fsd: ['2026-11-09', …], ai: [] }), sorted, only those
 * after today (UTC) and at most WINDOW_DAYS later. Throws when `strict` (any build but
 * `astro dev`) and the dates can't be had; otherwise warns and returns no dates.
 */
export async function loadStarts({
  env,
  strict = !import.meta.env?.DEV,
  fetch = globalThis.fetch,
  readFile = fsReadFile,
  now = Date.now,
  timeoutMs = TIMEOUT_MS,
  log = console.log,
  warn = console.warn,
} = {}) {
  env ??= await buildEnv();
  const source = env.COHORTS_FILE || env.COHORTS_URL || COHORTS_URL;
  try {
    const body = env.COHORTS_FILE
      ? JSON.parse(await readFile(env.COHORTS_FILE, 'utf8'))
      : await fetchCohorts(source, fetch, timeoutMs);
    const { cohorts, asOf } = parseCohorts(body);
    const time = now();
    const starts = byProgram(inWindow(cohorts, time));
    const ageMs = time - Date.parse(asOf);
    const listed = Object.entries(starts)
      .map(([program, dates]) => `${program}: ${dates.join(', ') || 'none'}`)
      .join('; ');
    log(`[cohorts] ${listed} (${source}, as of ${asOf}, ${hours(ageMs)} old)`);
    if (ageMs > STALE_MS) {
      warn(
        `[cohorts] the relay's copy is ${hours(ageMs)} old: the portal hasn't answered it since ` +
          `${asOf}, so new or changed start dates may be missing`
      );
    }
    return starts;
  } catch (err) {
    const message = `no start dates from ${source}: ${err.message}`;
    if (strict) {
      throw new Error(`[cohorts] ${message}. Build stopped: the live site keeps its dates.`, {
        cause: err,
      });
    }
    warn(`[cohorts] ${message}; building without start dates`);
    return byProgram([]);
  }
}

// Once per build: the Academy page (both languages) and /llms.txt share one answer.
let build;
export function buildStarts() {
  return (build ??= loadStarts());
}

async function fetchCohorts(url, fetch, timeoutMs) {
  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': 'codeboxx-website-build' },
    signal: AbortSignal.timeout(timeoutMs),
  });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    if (res.ok) throw new Error('invalid JSON');
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}${body?.error ? ` (${body.error})` : ''}`);
  return body;
}

/** The relay's answer, checked: { cohorts: [{ program, start }], asOf }, or throws. */
export function parseCohorts(body) {
  if (body?.ok !== true || !Array.isArray(body.cohorts)) {
    throw new Error('not an { ok: true, cohorts: [...] } answer');
  }
  if (typeof body.asOf !== 'string' || Number.isNaN(Date.parse(body.asOf))) {
    throw new Error('no valid asOf');
  }
  const cohorts = body.cohorts.map((c) => {
    if (typeof c?.program !== 'string' || !Object.hasOwn(PROGRAM_FACTS, c.program)) {
      throw new Error(`unknown program ${JSON.stringify(c?.program)}`);
    }
    if (!isDate(c.start)) throw new Error(`invalid start ${JSON.stringify(c.start)}`);
    return { program: c.program, start: c.start };
  });
  return { cohorts, asOf: body.asOf };
}

// The relay already filters; this keeps a build from publishing a date that has passed since.
export function inWindow(cohorts, now) {
  const today = new Date(now).toISOString().slice(0, 10);
  const last = new Date(Date.parse(today) + WINDOW_DAYS * DAY_MS).toISOString().slice(0, 10);
  return cohorts.filter(({ start }) => start > today && start <= last);
}

function byProgram(cohorts) {
  return Object.fromEntries(
    Object.keys(PROGRAM_FACTS).map((program) => [
      program,
      [...new Set(cohorts.filter((c) => c.program === program).map((c) => c.start))].sort(),
    ])
  );
}

function isDate(value) {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}

const hours = (ms) => (ms < 0 ? '0 h' : `${Math.floor(ms / 3_600_000)} h`);

// Same as astro.config.mjs: .env (by mode) under the process's own environment.
async function buildEnv() {
  const { loadEnv } = await import('vite');
  const mode = import.meta.env?.MODE || 'production';
  return { ...loadEnv(mode, process.cwd(), ''), ...process.env };
}
