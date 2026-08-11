import React from 'react';
import { fetchCollection, hasSanityProject } from './sanity';

// Cohort intake rows for the homepage calendar (#intake). Backed by Sanity's
// 'cohortIntake' document type for now (program: "fsd" | "aidev", date, location,
// status) — this is the one deliberate seam meant to be swapped for a real
// admissions API later. IntakeCalendar only ever imports `useIntakes` from this file
// and expects the `{ fsd: [...], aidev: [...] }` shape below, so that future rewrite
// touches only this file, not Home.jsx.
function toRow(entry) {
  const date = new Date(entry.date + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
  return [date, entry.location, entry.status];
}

export function useIntakes(seed = { fsd: [], aidev: [] }) {
  const [intakes, setIntakes] = React.useState(seed);
  React.useEffect(() => {
    let live = true;
    if (!hasSanityProject) return undefined;
    fetchCollection('cohortIntake', ' | order(date asc) {program, date, location, status}')
      .then((rows) => {
        if (!live || !rows.length) return;
        const grouped = { fsd: [], aidev: [] };
        rows.forEach((entry) => {
          if (grouped[entry.program]) grouped[entry.program].push(toRow(entry));
        });
        setIntakes(grouped);
      })
      .catch((err) => console.warn('[intakes]', err.message));
    return () => {
      live = false;
    };
  }, []);
  return intakes;
}
