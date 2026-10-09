// The window event that opens the enroll drawer (EnrollDrawer.jsx) on the pages that mount it
// (/academy's AcademyApply.jsx, the homepage's HomeIsland.jsx); TopBar's mobile Enroll Now sends
// it. Its own module so the site-wide TopBar doesn't pull in the drawer.
export const ENROLL_OPEN_EVENT = 'enroll:open';
