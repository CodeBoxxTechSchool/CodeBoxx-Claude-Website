// Nav, footer, and other strings shared across every page. NAV/footer structure
// (hrefs, column keys) stays in Chrome.jsx — only the display text lives here.
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
    ventures: 'Ventures',
    blog: 'Blog',
    contact: 'Contact',
  },
  actions: {
    enrollNow: 'Enroll Now',
    talkWithCodi: 'Talk With Codi',
    close: 'Close',
    language: 'Language',
  },
  footer: {
    tagline: 'We build AI-Native teams and software that outwork the old way.',
    columns: {
      // solutions/academy have no `items` here on purpose — Chrome.jsx/
      // ChromeIsland.jsx build those columns straight from nav.* + the same
      // hrefs the top menu's Solutions/Academy dropdowns use, so the footer
      // can't silently drift out of sync with the top menu. `codeboxx` keeps
      // its own placeholder bullets (no real destination) and Chrome*.jsx
      // appends Ventures/Blog/About (real nav.* links) after them.
      codeboxx: { title: 'CodeBoxx', items: ['Delivery Pods', 'Engagement Model', 'Case Notes'] },
      solutions: { title: 'Solutions' },
      academy: { title: 'Academy' },
    },
    copyright: '© 2026 CodeBoxx',
  },
};
