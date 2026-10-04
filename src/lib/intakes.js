import React from 'react';
import { fetchCollection, hasSanityProject } from './sanity.js';

// Cohort intake rows for the homepage calendar (#intake), from Sanity's
// 'cohortIntake' documents (program reference, pace "Full Time" | "Part Time",
// date, location, status). The calendar has two fixed columns, fsd and aidev,
// each with its own Full Time / Part Time buckets.

// Only cohorts starting within this many days are shown.
export const WINDOW_DAYS = 90;

// The visitor's local calendar date as "YYYY-MM-DD". Dates are compared as
// strings in that form, so there's no time-of-day/timezone edge case.
export function todayIso(now = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
}

// Calendar-day arithmetic in UTC, so a DST change can't shift the result.
export function addDaysIso(iso, days) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

// By title, not _id or `order`: Sanity has two program documents per title (one
// per pace), and `order` repeats across programs.
function columnFor(title) {
  const t = (title || '').toLowerCase().replace(/[\s-]+/g, ' ');
  if (t.includes('full stack')) return 'fsd';
  // The program was renamed Advanced AI Technologist (Oct 2026); Sanity may still
  // say Advanced AI Developer.
  if (t.includes('ai developer') || t.includes('ai technologist')) return 'aidev';
  return null;
}

// "Nov 27, 2026" in English, "27 nov. 2026" in French.
export function formatIntakeDate(iso, lang) {
  const date = new Date(iso + 'T12:00:00');
  return lang === 'fr'
    ? date.toLocaleDateString('fr-CA', { day: 'numeric', month: 'short', year: 'numeric' })
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Sanity rows -> { fsd, aidev }, each { 'Full Time': rows, 'Part Time': rows },
// a row being ["YYYY-MM-DD", location, status]. Keeps only dated intakes starting
// after `today` and at most WINDOW_DAYS later, sorted by date then location.
export function groupIntakes(rows, today) {
  const last = addDaysIso(today, WINDOW_DAYS);
  const paces = () => ({ 'Full Time': [], 'Part Time': [] });
  const groups = { fsd: paces(), aidev: paces() };
  (rows || [])
    .filter((entry) => entry.date && entry.date > today && entry.date <= last)
    .sort(
      (a, b) => a.date.localeCompare(b.date) || (a.location || '').localeCompare(b.location || '')
    )
    .forEach((entry) => {
      const column = columnFor(entry.program?.title);
      if (!column) {
        console.warn('[intakes] no calendar column for program', entry.program?.title);
        return;
      }
      const bucket = groups[column][entry.pace];
      if (bucket) bucket.push([entry.date, entry.location, entry.status]);
    });
  return groups;
}

// The earliest Full Time FSD start in the window, or null (also while loading).
export function nextFsdIntake(groups) {
  const first = groups && groups.fsd['Full Time'][0];
  return first ? first[0] : null;
}

// `null` until the fetch settles, so the calendar can render its column heads
// without rows instead of flashing a wrong "coming soon". A failed fetch or an
// unconfigured Sanity settles to empty columns.
export function useIntakes() {
  const [live, setLive] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    const settle = (rows) => {
      if (alive) setLive(groupIntakes(rows, todayIso()));
    };
    if (!hasSanityProject) {
      settle([]);
      return undefined;
    }
    fetchCollection('cohortIntake', ' {date, location, status, pace, "program": program->{title}}')
      .then(settle)
      .catch((err) => {
        console.warn('[intakes]', err.message);
        settle([]);
      });
    return () => {
      alive = false;
    };
  }, []);
  return live;
}
