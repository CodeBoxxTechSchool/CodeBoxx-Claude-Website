import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import Logo from './Logo';
import { localizedHref } from '../lib/i18nRoutes';

// Astro-native counterpart to Chrome.jsx (which stays react-router/react-i18next
// based, for the legacy Home/Financing/Ventures island only). Same markup/classes/
// behavior, but props-driven instead of reading a router context or i18next:
// - `lang`/`pathname` replace useTranslation()/useLocation() — passed down from
//   the Astro page that mounts this (Astro.currentLocale equivalent + Astro.url).
// - plain <a href> navigation replaces useNavigate(), since Astro pages are real
//   documents (a full navigation is correct here, not a client-side route change).
// - `strings` is the current language's common.js content (nav/actions/footer) —
//   resolved at build/request time by the page, not looked up at render time.
//
// Mounted with `client:load` from Layout.astro: Astro still server-renders this
// component's initial HTML (nav links, footer, all real hrefs) into the page, so
// none of it depends on JS to exist — only the mobile toggle and hover/tap
// dropdowns are progressive-enhancement-only, matching what was already
// JS-dependent in the original.
const NAV_STRUCTURE = [
  {
    key: 'about',
    href: '#codeboxx',
    items: [
      ['aboutTeam', '#about-team'],
      ['aboutHistory', '#about-history'],
      ['aboutVisionMission', '#about-vision'],
    ],
  },
  {
    key: 'solutions',
    href: '#solutions',
    items: [
      ['solutionsServices', '#solutions'],
      ['solutionsWorks', '#solutions'],
    ],
  },
  {
    key: 'academy',
    href: '#academy',
    items: [
      ['academyCourses', '#academy-courses'],
      ['academyCalendar', '#intake'],
      ['academyFinancing', '/financing'],
    ],
  },
  { key: 'ventures', href: '/ventures' },
  { key: 'blog', href: '/blog' },
  { key: 'contact', href: '#contact' },
];

function LanguageToggle({ lang, pathname, label }) {
  const next = lang === 'fr' ? 'en' : 'fr';
  const href = localizedHref(pathname, next, pathname);
  return (
    <a className="btn btn-sm btn-outline-primary" href={href} aria-label={label}>
      {next.toUpperCase()}
    </a>
  );
}

function NavItem({ item, onNavigate }) {
  const [open, setOpen] = React.useState(false);
  const hasDropdown = Boolean(item.items);
  const handleLinkClick = (e) => {
    if (hasDropdown && !open) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    setOpen(false);
    onNavigate?.();
  };
  const handleSubLinkClick = () => {
    setOpen(false);
    onNavigate?.();
  };
  return (
    <div
      className={'nav-item' + (open ? ' open' : '')}
      onMouseEnter={() => hasDropdown && setOpen(true)}
      onMouseLeave={() => hasDropdown && setOpen(false)}
    >
      <Nav.Link as="a" href={item.href} onClick={handleLinkClick}>
        {item.label}
        {hasDropdown ? (
          <svg
            className="nav-caret"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        ) : null}
      </Nav.Link>
      {hasDropdown && open ? (
        <div className="nav-dropdown">
          {item.items.map(([l, hr]) => (
            <a key={l} href={hr} onClick={handleSubLinkClick}>
              {l}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function TopBar({ lang, pathname, strings, onCodi, onEnroll }) {
  const [expanded, setExpanded] = React.useState(false);
  const nav = NAV_STRUCTURE.map((n) => ({
    key: n.key,
    label: strings.nav[n.key],
    href: localizedHref(n.href, lang, pathname),
    items: n.items?.map(([k, href]) => [strings.nav[k], localizedHref(href, lang, pathname)]),
  }));
  // Both pages that mount this today (Blog, BlogPost) have no on-page Codi/Enroll
  // drawer — same as the original Chrome.jsx usage from those two pages, this just
  // sends the visitor to the homepage's #contact section.
  const contactHref = localizedHref('#contact', lang, pathname);
  const handleCodi = onCodi || (() => (window.location.href = contactHref));
  const handleEnroll = onEnroll || (() => (window.location.href = contactHref));
  return (
    <React.Fragment>
      <header className="site-header">
        <Navbar expand="lg" expanded={expanded} onToggle={setExpanded}>
          <Container fluid className="wrap">
            <Navbar.Brand href={localizedHref('#top', lang, pathname)} className="p-0">
              <Logo width={168} />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="main-nav" />
            <Navbar.Collapse id="main-nav">
              <Nav className="flex-wrap gap-4 mx-lg-auto">
                {nav.map((n) => (
                  <NavItem key={n.key} item={n} onNavigate={() => setExpanded(false)} />
                ))}
              </Nav>
            </Navbar.Collapse>
            <div className="d-none d-lg-flex align-items-center gap-3 flex-shrink-0">
              <LanguageToggle lang={lang} pathname={pathname} label={strings.actions.language} />
              <Button size="sm" variant="outline-primary" onClick={handleEnroll}>
                {strings.actions.enrollNow}
              </Button>
              <Button size="sm" onClick={handleCodi}>
                {strings.actions.talkWithCodi}
              </Button>
            </div>
          </Container>
        </Navbar>
      </header>
      <div className="mobile-cta-bar d-lg-none">
        <Button variant="outline-primary" onClick={handleEnroll}>
          {strings.actions.enrollNow}
        </Button>
        <Button onClick={handleCodi}>{strings.actions.talkWithCodi}</Button>
      </div>
    </React.Fragment>
  );
}

// Footer columns' link data — separate from strings.footer.columns (which only
// carries each column's title, plus codeboxx's three placeholder-bullet
// labels; see common.js). solutions/academy are built entirely from nav.* +
// the exact hrefs NAV_STRUCTURE's own dropdowns use, so this can't drift out
// of sync with the top menu the way a second, hand-copied list in common.js
// could. Real hrefs (not the blanket "#top" every footer link used before)
// since these now point at actual pages/sections, same as the top menu.
function buildFooterColumns(lang, pathname, strings) {
  const nav = strings.nav;
  const href = (h) => localizedHref(h, lang, pathname);
  return [
    {
      key: 'codeboxx',
      title: strings.footer.columns.codeboxx.title,
      items: [
        ...strings.footer.columns.codeboxx.items.map((label) => ({ label, href: href('#top') })),
        { label: nav.ventures, href: href('/ventures') },
        { label: nav.blog, href: href('/blog') },
        { label: nav.about, href: href('#codeboxx') },
      ],
    },
    {
      key: 'solutions',
      title: strings.footer.columns.solutions.title,
      items: [
        { label: nav.solutionsServices, href: href('#solutions') },
        { label: nav.solutionsWorks, href: href('#solutions') },
      ],
    },
    {
      key: 'academy',
      title: strings.footer.columns.academy.title,
      items: [
        { label: nav.academyCourses, href: href('#academy-courses') },
        { label: nav.academyCalendar, href: href('#intake') },
        { label: nav.academyFinancing, href: href('/financing') },
      ],
    },
  ];
}

export function Footer({ lang, pathname, strings }) {
  const footerColumns = buildFooterColumns(lang, pathname, strings);
  return (
    <footer className="site-footer">
      <div className="wrap d-flex flex-column gap-5">
        <div className="d-flex justify-content-between align-items-start gap-5 flex-wrap">
          <div className="d-flex flex-column gap-3">
            <Logo theme="dark" width={200} />
            <span className="footer-tagline">{strings.footer.tagline}</span>
          </div>
          <div className="d-flex gap-5 flex-wrap">
            {footerColumns.map((col) => (
              <div key={col.key} className="footer-col d-flex flex-column gap-3">
                <span className="footer-col-title">{col.title}</span>
                {col.items.map((item, i) => (
                  <a key={i} href={item.href}>
                    {item.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="footer-rule" />
        <div className="d-flex justify-content-between gap-4 footer-meta">
          <span>{strings.footer.copyright}</span>
          <span>v1.0.0 Stable · SHA: 7be1af8</span>
        </div>
      </div>
    </footer>
  );
}
