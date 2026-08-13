import React from 'react';
import { fetchCollection, hasSanityProject } from './sanity';

// Cohort intake rows for the homepage calendar (#intake). Backed by Sanity's
// 'cohortIntake' document type (a reference to a 'program' document, a pace —
// "Full Time" | "Part Time" — date, location, status). useIntakes() groups rows
// two levels deep: one entry per program TITLE (a calendar row — see the grouping
// key note below), each holding its own "Full Time"/"Part Time" buckets (the row's
// two columns) — the same program can have entries in both. Adding a new
// 'program' document in Sanity is enough to add a new calendar row; no website
// code change needed. IntakeCalendar (Home.jsx) renders one row per array entry,
// each with exactly two CalendarColumns.
function todayIso() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
}

function toRow(entry) {
  const hasDate = Boolean(entry.date);
  const date = hasDate
    ? new Date(entry.date + 'T12:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
    : null; // null tells CalendarColumn to render the "On Demand" label instead.
  // A cohort whose start date has already passed (or starts today) reads as
  // "Ongoing" regardless of whatever status was manually set — editors don't have
  // to remember to flip it. Compared as plain calendar-day strings (both are
  // "YYYY-MM-DD"), not Date objects, so there's no time-of-day/timezone edge case.
  const status = hasDate && entry.date <= todayIso() ? 'Ongoing' : entry.status;
  return [date, entry.location, status];
}

// Returns live Sanity data only (or `null` until it arrives / if there's none) —
// deliberately does NOT take a seed argument or store one in state. IntakeCalendar
// (Home.jsx) builds its seed fresh every render via `t()` (so it's always in the
// current language) and falls back to it with `useIntakes() || seed`. If this hook
// instead seeded its own state from a language-computed value, that value would be
// captured only once at mount (a `useState` initializer runs once) and never update
// on a later language switch — the exact bug this shape avoids.
export function useIntakes() {
  const [live, setLive] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    if (!hasSanityProject) return undefined;
    fetchCollection(
      'cohortIntake',
      ' | order(date asc) {date, location, status, pace, "program": program->{_id, title, order}}'
    )
      .then((rows) => {
        if (!alive || !rows.length) return;
        const byProgram = new Map();
        rows.forEach((entry) => {
          if (!entry.program) return; // no program reference — nothing to group it under.
          // Keyed by the program's title, not its document _id: two separate
          // Program documents that happen to share a title (an editor accidentally
          // created a duplicate) would otherwise render as two separate rows, one
          // showing whichever pace the intakes referencing the first doc used, the
          // other showing the rest — the exact split shown in Studio. Titles are
          // meant to be the human identity of a course, so merge on that instead.
          const key = (entry.program.title || '').trim().toLowerCase();
          if (!byProgram.has(key)) {
            byProgram.set(key, {
              id: key,
              title: entry.program.title,
              order: entry.program.order ?? 0,
              paces: { 'Full Time': [], 'Part Time': [] },
            });
          } else {
            // Duplicate-titled doc: keep the lower `order` so the row's position
            // doesn't depend on which duplicate happened to be seen first.
            const existing = byProgram.get(key);
            existing.order = Math.min(existing.order, entry.program.order ?? 0);
          }
          const bucket = byProgram.get(key).paces[entry.pace];
          if (bucket) bucket.push(toRow(entry)); // unknown/missing pace — drop the row.
        });
        // A program with rows registered but none carrying a valid `pace` (e.g.
        // existing intakes from before this field existed) would otherwise render
        // as an empty row — only switch away from the seed once at least one
        // program actually has a visible date in either column.
        const grouped = Array.from(byProgram.values())
          .filter((p) => p.paces['Full Time'].length || p.paces['Part Time'].length)
          .sort((a, b) => a.order - b.order);
        if (grouped.length) setLive(grouped);
      })
      .catch((err) => console.warn('[intakes]', err.message));
    return () => {
      alive = false;
    };
  }, []);
  return live;
}
