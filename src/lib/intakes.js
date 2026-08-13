import React from 'react';
import { fetchCollection, hasSanityProject } from './sanity';

// Cohort intake rows for the homepage calendar (#intake). Backed by Sanity's
// 'cohortIntake' document type (a reference to a 'program' document, date,
// location, status). useIntakes() groups rows by the referenced program and
// returns an array of { id, title, meta, rows } — one entry per program that has
// at least one intake row, ordered by the program's own `order` field. Adding a
// new 'program' document in Sanity is enough to add a new calendar column; no
// website code change needed. IntakeCalendar (Home.jsx) renders one
// CalendarColumn per array entry.
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

export function useIntakes(seed = []) {
  const [programs, setPrograms] = React.useState(seed);
  React.useEffect(() => {
    let live = true;
    if (!hasSanityProject) return undefined;
    fetchCollection(
      'cohortIntake',
      ' | order(date asc) {date, location, status, "program": program->{_id, title, meta, order}}'
    )
      .then((rows) => {
        if (!live || !rows.length) return;
        const byProgram = new Map();
        rows.forEach((entry) => {
          if (!entry.program) return; // no program reference — nothing to group it under.
          const key = entry.program._id;
          if (!byProgram.has(key)) {
            byProgram.set(key, {
              id: key,
              title: entry.program.title,
              meta: entry.program.meta,
              order: entry.program.order ?? 0,
              rows: [],
            });
          }
          byProgram.get(key).rows.push(toRow(entry));
        });
        const grouped = Array.from(byProgram.values()).sort((a, b) => a.order - b.order);
        if (grouped.length) setPrograms(grouped);
      })
      .catch((err) => console.warn('[intakes]', err.message));
    return () => {
      live = false;
    };
  }, []);
  return programs;
}
