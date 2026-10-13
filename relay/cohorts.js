import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { PROGRAM_IDS } from './enroll.js';
import { fetchCohorts } from './portal.js';

export const WINDOW_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;
// A portal answer is served for 10 minutes before the portal is asked again.
const FRESH_MS = 10 * 60 * 1000;
// nginx doesn't rate-limit this route: after a failed call, the last copy is served for a minute
// without asking again, so a portal that is down isn't called by every request.
const RETRY_MS = 60 * 1000;
const CACHE_CONTROL = 'public, max-age=300';

// Portal program ID -> the site's program key. Only these programs' start dates are published;
// one portal cohort is one start date, offered online or at St. Pete, full or part time.
const PROGRAMS = new Map([[PROGRAM_IDS.fsd, 'fsd']]);
const PROGRAM_KEYS = new Set(PROGRAMS.values());

/**
 * The /api/cohorts handler, with its own cache: resolves to { status, note, headers?, body }.
 * config: { portalUrl, apiKey, timeoutMs?, fetch?, cohortsFile?, log?, now? }. The last good
 * answer is kept in cohortsFile, when set, for the next start.
 */
export function cohortsHandler(config) {
  const { cohortsFile, log = console.log, now = Date.now } = config;
  // { asOf, cohorts: [{ program, start }] }: every start the portal gave, before the window.
  let copy = null;
  let loading = null;
  let refreshing = null;
  let failedAt = -Infinity;
  const unmapped = new Set();

  async function refresh() {
    const { status, cohorts } = await fetchCohorts(config);
    if (!cohorts) {
      failedAt = now();
      return `portal=${status}${copy ? ' stale' : ''}`;
    }
    copy = { asOf: new Date(now()).toISOString(), cohorts: toPublic(cohorts, unmapped, log) };
    failedAt = -Infinity;
    if (cohortsFile) {
      await save(cohortsFile, copy).catch((err) =>
        log(`cohorts save-error=${err.code ?? err.name}`)
      );
    }
    return 'portal=200';
  }

  return async () => {
    loading ??= cohortsFile ? load(cohortsFile, log).then((saved) => (copy ??= saved)) : null;
    await loading;
    const time = now();
    let note;
    if (copy && time - Date.parse(copy.asOf) < FRESH_MS) note = 'cache';
    else if (time - failedAt >= RETRY_MS) {
      // Requests during a call wait for the same call.
      refreshing ??= refresh().finally(() => (refreshing = null));
      note = await refreshing;
    } else note = copy ? 'stale' : 'unavailable';
    if (!copy) return { status: 503, note, body: { error: 'cohorts unavailable' } };
    // The window is applied to every answer, so a date that has passed leaves a stale copy too.
    const cohorts = inWindow(copy.cohorts, time);
    const body = { cohorts, windowDays: WINDOW_DAYS, asOf: copy.asOf };
    return { status: 200, note, headers: { 'Cache-Control': CACHE_CONTROL }, body };
  };
}

/**
 * The portal's cohorts as [{ program, start }], sorted by start, without duplicates, nothing else
 * of them kept. A cohort without a start date or of a program the site doesn't show is dropped;
 * each such program is logged once (its ID only).
 */
export function toPublic(list, unmapped = new Set(), log = console.log) {
  const seen = new Map();
  for (const cohort of list) {
    const id = Number.isInteger(cohort?.programId) ? cohort.programId : 'invalid';
    const program = PROGRAMS.get(id);
    if (!program) {
      if (!unmapped.has(id)) log(`cohorts unmapped-program=${id}`);
      unmapped.add(id);
      continue;
    }
    // The date as the portal shows it (ASP.NET: "2026-11-09T00:00:00"), never shifted by a zone.
    const start = typeof cohort.startDate === 'string' && startDate(cohort.startDate);
    if (start) seen.set(`${start} ${program}`, { program, start });
  }
  return [...seen.keys()].sort().map((key) => seen.get(key));
}

/** The cohorts starting after today (UTC) and at most WINDOW_DAYS later. */
export function inWindow(cohorts, now = Date.now()) {
  const today = new Date(now).toISOString().slice(0, 10);
  const last = new Date(Date.parse(today) + WINDOW_DAYS * DAY_MS).toISOString().slice(0, 10);
  return cohorts.filter(({ start }) => start > today && start <= last);
}

function startDate(text) {
  const date = /^(\d{4}-\d{2}-\d{2})(?:T|$)/.exec(text)?.[1];
  return date && !Number.isNaN(Date.parse(date)) ? date : null;
}

// Written aside then renamed, so a restart never reads half a file.
async function save(file, copy) {
  await mkdir(dirname(file), { recursive: true, mode: 0o700 });
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(copy));
  await rename(tmp, file);
}

// The saved copy, or null when there is none or it doesn't hold what save() writes.
async function load(file, log) {
  let text;
  try {
    text = await readFile(file, 'utf8');
  } catch (err) {
    if (err.code !== 'ENOENT') log(`cohorts load-error=${err.code ?? err.name}`);
    return null;
  }
  try {
    const saved = JSON.parse(text);
    const valid =
      !Number.isNaN(Date.parse(saved?.asOf)) &&
      Array.isArray(saved.cohorts) &&
      saved.cohorts.every(
        (c) => PROGRAM_KEYS.has(c?.program) && startDate(c.start ?? '') === c.start
      );
    if (valid) return saved;
  } catch {}
  log('cohorts load-error=invalid');
  return null;
}
