import { randomUUID } from 'node:crypto';
import { mkdir, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { isRetryable, KINDS, sendToPortal } from './portal.js';

const MAX_AGE_MS = 72 * 60 * 60 * 1000;
const RESEND_EVERY_MS = 5 * 60 * 1000;

/** A UUID (8-4-4-4-12 hex, any case) other than all zeros. Lowercased, it is a safe file name. */
export const isSubmissionId = (value) =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value) &&
  /[1-9a-f]/i.test(value);

/** Keeps a submission the portal could not take, replacing any earlier one with the same ID. */
export async function enqueue(dir, id, kind, body, now = Date.now()) {
  await mkdir(dir, { recursive: true, mode: 0o700 });
  const file = join(dir, `${id}.json`);
  // A visitor's retry keeps the first queuedAt, so the 72 hours count from the first failure.
  const earlier = await readFile(file, 'utf8').then(parse, () => null);
  const queuedAt = earlier?.queuedAt ?? new Date(now).toISOString();
  // Written aside then renamed, so a reader never sees half a file.
  const tmp = join(dir, `${id}.${randomUUID()}.tmp`);
  await writeFile(tmp, JSON.stringify({ kind, body, queuedAt }), { mode: 0o600 });
  await rename(tmp, file);
}

export const dequeue = (dir, id) => rm(join(dir, `${id}.json`), { force: true });

/** { size, oldestAgeSeconds } of the queue, without reading out any submission. */
export async function queueStats(dir, now = Date.now()) {
  const items = await readQueue(dir);
  const oldest = Math.min(...items.map((item) => item.since));
  return {
    size: items.length,
    oldestAgeSeconds: items.length ? Math.max(0, Math.floor((now - oldest) / 1000)) : null,
  };
}

/**
 * One pass over the queue, a file at a time: deletes what the portal received or refused, and
 * what is over 72 hours old; keeps the rest for the next pass. Never rejects.
 */
export async function resendQueued(config) {
  const { outboxDir: dir, log = console.log, now = Date.now } = config;
  try {
    for (const { name, file, entry, since } of await readQueue(dir)) {
      if (now() - since > MAX_AGE_MS) {
        await rm(file, { force: true });
        log(`resend ${name} gave-up`);
      } else if (!entry) {
        log(`resend ${name} unreadable`);
      } else {
        const { received, status } = await sendToPortal(entry.kind, entry.body, config);
        const outcome = received ? 'received' : isRetryable(status) ? 'kept' : 'refused';
        if (outcome !== 'kept') await rm(file, { force: true });
        log(`resend ${name} portal=${status} ${outcome}`);
      }
    }
  } catch (err) {
    log(`resend error=${err.code ?? err.name}`);
  }
}

/** Resends now, then 5 minutes after each pass ends, so passes never overlap. */
export async function startResending(config) {
  await resendQueued(config);
  setTimeout(() => startResending(config), RESEND_EVERY_MS).unref();
}

// Every file in the folder, with its parsed entry (null when unreadable) and when it was queued.
async function readQueue(dir) {
  let names;
  try {
    names = await readdir(dir);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
  const items = await Promise.all(
    names.map(async (name) => {
      const file = join(dir, name);
      try {
        const { mtimeMs } = await stat(file);
        const entry = /^[0-9a-f-]{36}\.json$/.test(name)
          ? parse(await readFile(file, 'utf8'))
          : null;
        return { name, file, entry, since: entry ? Date.parse(entry.queuedAt) : mtimeMs };
      } catch {
        // Deleted since the listing.
        return null;
      }
    })
  );
  return items.filter(Boolean);
}

function parse(text) {
  try {
    const entry = JSON.parse(text);
    const valid = Object.hasOwn(KINDS, entry?.kind) && !Number.isNaN(Date.parse(entry.queuedAt));
    return valid ? entry : null;
  } catch {
    return null;
  }
}
