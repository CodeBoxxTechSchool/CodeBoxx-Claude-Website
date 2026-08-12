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
    tagline: 'One platform for the studio, the deployment operation and the academy.',
    columns: {
      codeboxx: { title: 'CodeBoxx', items: ['Delivery Pods', 'Engagement Model', 'Case Notes'] },
      solutions: { title: 'Solutions', items: ['Deploy Console', 'Status', 'Documentation'] },
      academy: { title: 'Academy', items: ['Curriculum', 'Admissions', 'Cohort Dates'] },
    },
    copyright: '© 2026 CodeBoxx',
  },
};
