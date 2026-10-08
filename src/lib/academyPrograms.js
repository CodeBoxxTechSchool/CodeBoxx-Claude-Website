// The Academy's programs as machine-readable facts: the Course structured data on
// /academy and /fr/academie (AcademyPage.astro) and /llms.txt read them. The page text
// (names, who it is for, schedules, start dates) stays in src/locales/{en,fr}/academy.js
// programs.items; keep tuition and lengths here in step with it.
export const PROGRAM_FACTS = {
  // AI Native Full-Stack Developer: no prior experience.
  fsd: { price: 12000, currency: 'USD', weeks: { fullTime: 16, partTime: 32 } },
  // Advanced AI Technologist: prior programming and SQL.
  ai: { price: 9800, currency: 'USD', weeks: { fullTime: 12, partTime: 24 } },
};

// Both programs are taught on campus or online, full-time or part-time (FAQ, "How much
// does it cost?").
export const COURSE_MODES = ['Onsite', 'Online'];
export const PACES = ['fullTime', 'partTime'];

// The two campuses, the same offices as the footer and the Organization schema.
export const CAMPUSES = [
  {
    '@type': 'Place',
    name: 'CodeBoxx St. Petersburg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1101 4th St S',
      addressLocality: 'St. Petersburg',
      addressRegion: 'FL',
      postalCode: '33701',
      addressCountry: 'US',
    },
  },
  {
    '@type': 'Place',
    name: 'CodeBoxx Quebec City',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '400-1020 Bouvier Street',
      addressLocality: 'Quebec City',
      addressRegion: 'QC',
      postalCode: 'G2K 2C9',
      addressCountry: 'CA',
    },
  },
];

// A program's start dates still to come on `today` (YYYY-MM-DD), as listed in the locale.
export function upcomingStarts(program, today) {
  return (program.starts || []).filter((d) => d >= today);
}
