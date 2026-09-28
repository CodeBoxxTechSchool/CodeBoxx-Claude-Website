// Nav, footer, and other strings shared across every page. NAV/footer structure
// (hrefs, column keys) stays in ChromeIsland.jsx — only the display text lives here.
export default {
  nav: {
    about: 'About',
    aboutTeam: 'Team',
    aboutHistory: 'History',
    aboutVisionMission: 'Vision & Mission',
    solutions: 'Solutions',
    solutionsServices: 'Services',
    solutionsWorks: 'Works',
    academy: 'Academy',
    academyCourses: 'Courses',
    academyCalendar: 'Calendar',
    academyFinancing: 'Financing Options',
    academyFaq: 'FAQ',
    ventures: 'Ventures',
    blog: 'Blog',
    contact: 'Contact',
  },
  actions: {
    enrollNow: 'Enroll Now',
    talkWithCodi: 'Talk With Codi',
    close: 'Close',
    language: 'Language',
    skipToContent: 'Skip to main content',
  },
  footer: {
    tagline: 'We build AI-Native teams and software that outwork the old way.',
    columns: {
      // Only titles here — ChromeIsland.jsx builds every column's
      // actual links straight from nav.* + the same hrefs the top menu uses,
      // so the footer can't silently drift out of sync with it.
      codeboxx: { title: 'CodeBoxx' },
      solutions: { title: 'Solutions' },
      academy: { title: 'Academy' },
    },
    // [city label, street address] — shown under the tagline.
    addresses: [
      ['St. Pete', '1101 4th St S, St. Petersburg, FL 33701'],
      ['Quebec City', '400-1020 Bouvier Street, Quebec City, QC G2K 2C9'],
    ],
    phone: { label: 'Phone', display: '1-800-887-2497', tel: '+18008872497' },
    copyright: 'Copyright © 2026 CodeBoxx Technology Corporation. All Rights Reserved.',
  },
};
