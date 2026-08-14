import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import { localizedHref } from '../lib/routes';

// Hrefs/nesting stay here; display labels come from common.nav via useNav() below,
// so a French label swap never touches routing.
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

function useNav() {
  const { t, i18n } = useTranslation();
  return NAV_STRUCTURE.map((n) => ({
    key: n.key,
    label: t('nav.' + n.key),
    href: localizedHref(n.href, i18n.language),
    items: n.items?.map(([k, href]) => [t('nav.' + k), localizedHref(href, i18n.language)]),
  }));
}

// Shows only the language you'd switch TO (not the active one), as a real button —
// clicking it navigates to the translated URL for wherever you currently are; the
// actual language flip happens via App.jsx's LocaleFromUrl reacting to that
// navigation, so the URL stays the single source of truth rather than this button
// and the URL both trying to drive language independently.
function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const next = i18n.language === 'fr' ? 'en' : 'fr';
  const goToTranslated = () => {
    navigate(localizedHref(location.pathname, next) + location.hash);
  };
  return (
    <Button size="sm" variant="outline-primary" onClick={goToTranslated} aria-label={t('actions.language')}>
      {next.toUpperCase()}
    </Button>
  );
}

function NavItem({ item, onNavigate }) {
  const [open, setOpen] = React.useState(false);
  const hasDropdown = Boolean(item.items);
  // Hover still opens it on desktop (mouseenter fires before any click there, so the
  // click branch below just navigates). On touch, there's no hover — the first tap
  // opens the dropdown instead of navigating; a second tap follows the link.
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

function TopBar({ onCodi, onEnroll }) {
  const { t, i18n } = useTranslation();
  const nav = useNav();
  const [expanded, setExpanded] = React.useState(false);
  const enroll = () =>
    onEnroll
      ? onEnroll('AI Native Full-Stack Developer')
      : (window.location.href = localizedHref('#contact', i18n.language));
  return (
    <React.Fragment>
      <header className="site-header">
        <Navbar expand="lg" expanded={expanded} onToggle={setExpanded}>
          <Container fluid className="wrap">
            <Navbar.Brand href={localizedHref('#top', i18n.language)} className="p-0">
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
              <LanguageToggle />
              <Button size="sm" variant="outline-primary" onClick={enroll}>
                {t('actions.enrollNow')}
              </Button>
              <Button size="sm" onClick={onCodi}>
                {t('actions.talkWithCodi')}
              </Button>
            </div>
          </Container>
        </Navbar>
      </header>
      <div className="mobile-cta-bar d-lg-none">
        <Button variant="outline-primary" onClick={enroll}>
          {t('actions.enrollNow')}
        </Button>
        <Button onClick={onCodi}>{t('actions.talkWithCodi')}</Button>
      </div>
    </React.Fragment>
  );
}

const FOOTER_COLUMN_KEYS = ['codeboxx', 'solutions', 'academy'];

function Footer() {
  const { t, i18n } = useTranslation();
  return (
    <footer className="site-footer">
      <div className="wrap d-flex flex-column gap-5">
        <div className="d-flex justify-content-between align-items-start gap-5 flex-wrap">
          <div className="d-flex flex-column gap-3">
            <Logo theme="dark" width={200} />
            <span className="footer-tagline">{t('footer.tagline')}</span>
          </div>
          <div className="d-flex gap-5 flex-wrap">
            {FOOTER_COLUMN_KEYS.map((key) => {
              const col = t('footer.columns.' + key, { returnObjects: true });
              return (
                <div key={key} className="footer-col d-flex flex-column gap-3">
                  <span className="footer-col-title">{col.title}</span>
                  {col.items.map((i) => (
                    <a key={i} href={localizedHref('#top', i18n.language)}>
                      {i}
                    </a>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <div className="footer-rule" />
        <div className="d-flex justify-content-between gap-4 footer-meta">
          <span>{t('footer.copyright')}</span>
          <span>v1.0.0 Stable · SHA: 7be1af8</span>
        </div>
      </div>
    </footer>
  );
}

export { NavItem, TopBar, Footer, LanguageToggle };
