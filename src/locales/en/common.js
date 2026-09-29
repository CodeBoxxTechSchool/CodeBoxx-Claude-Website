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
    // Footer only: not in the top menu, so not under nav.
    careers: 'Careers',
    // [city label, street address] — shown under the tagline.
    addresses: [
      ['St. Pete', '1101 4th St S, St. Petersburg, FL 33701'],
      ['Quebec City', '400-1020 Bouvier Street, Quebec City, QC G2K 2C9'],
    ],
    phone: { label: 'Phone', display: '1-800-887-2497', tel: '+18008872497' },
    // [label, path] — shown in the middle of the subfooter.
    // Florida CIE licensure disclosure. Rule 6E-2.004(11)(c)16, F.A.C. (as amended
    // 8-27-24) requires this exact phrase in all advertising, websites included;
    // "any other phrase or form" is a violation. So it's identical, in English, on
    // the FR site too (rendered lang="en"), and must not be reworded or translated.
    licensure: 'Licensed by the Florida Commission for Independent Education, License No. 9103.',
    legalLabel: 'Legal',
    legal: [
      ['Privacy Policy', '/privacy-policy'],
      ['Terms and Conditions', '/terms-conditions'],
    ],
    copyright: 'Copyright © 2026 CodeBoxx Technology Corporation. All Rights Reserved.',
  },
};
