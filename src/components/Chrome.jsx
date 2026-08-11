import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import Logo from './Logo';

const hrefFor = (t) => (t.charAt(0) === '#' ? (window.location.pathname === '/' ? t : '/' + t) : t);

const NAV = [
  {
    label: 'About',
    href: '#codeboxx',
    items: [
      ['Team', '#about-team'],
      ['History', '#about-history'],
      ['Vision & Mission', '#about-vision'],
    ],
  },
  {
    label: 'Solutions',
    href: '#solutions',
    items: [
      ['Services', '#solutions'],
      ['Works', '#solutions'],
    ],
  },
  {
    label: 'Academy',
    href: '#academy',
    items: [
      ['Courses', '#academy-courses'],
      ['Calendar', '#intake'],
      ['Financing Options', '/financing'],
    ],
  },
  { label: 'Ventures', href: '/ventures' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '#contact' },
];

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
      <Nav.Link as="a" href={hrefFor(item.href)} onClick={handleLinkClick}>
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
            <a key={l} href={hrefFor(hr)} onClick={handleSubLinkClick}>
              {l}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TopBar({ onCodi, onEnroll }) {
  const [expanded, setExpanded] = React.useState(false);
  const enroll = () =>
    onEnroll ? onEnroll('AI Native Full-Stack Developer') : (window.location.href = '/#contact');
  return (
    <React.Fragment>
      <header className="site-header">
        <Navbar expand="lg" expanded={expanded} onToggle={setExpanded}>
          <Container fluid className="wrap">
            <Navbar.Brand href={hrefFor('#top')} className="p-0">
              <Logo width={168} />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="main-nav" />
            <Navbar.Collapse id="main-nav">
              <Nav className="flex-wrap gap-4 mx-lg-auto">
                {NAV.map((n) => (
                  <NavItem key={n.label} item={n} onNavigate={() => setExpanded(false)} />
                ))}
              </Nav>
            </Navbar.Collapse>
            <div className="d-none d-lg-flex align-items-center gap-3 flex-shrink-0">
              <Button size="sm" variant="outline-primary" onClick={enroll}>
                Enroll Now
              </Button>
              <Button size="sm" onClick={onCodi}>
                Talk With Codi
              </Button>
            </div>
          </Container>
        </Navbar>
      </header>
      <div className="mobile-cta-bar d-lg-none">
        <Button variant="outline-primary" onClick={enroll}>
          Enroll Now
        </Button>
        <Button onClick={onCodi}>Talk With Codi</Button>
      </div>
    </React.Fragment>
  );
}

function Footer() {
  const cols = [
    ['CodeBoxx', ['Delivery Pods', 'Engagement Model', 'Case Notes']],
    ['Solutions', ['Deploy Console', 'Status', 'Documentation']],
    ['Academy', ['Curriculum', 'Admissions', 'Cohort Dates']],
  ];
  return (
    <footer className="site-footer">
      <div className="wrap d-flex flex-column gap-5">
        <div className="d-flex justify-content-between align-items-start gap-5 flex-wrap">
          <div className="d-flex flex-column gap-3">
            <Logo theme="dark" width={200} />
            <span className="footer-tagline">
              One platform for the studio, the deployment operation and the academy.
            </span>
          </div>
          <div className="d-flex gap-5 flex-wrap">
            {cols.map(([h, items]) => (
              <div key={h} className="footer-col d-flex flex-column gap-3">
                <span className="footer-col-title">{h}</span>
                {items.map((i) => (
                  <a key={i} href={hrefFor('#top')}>
                    {i}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="footer-rule" />
        <div className="d-flex justify-content-between gap-4 footer-meta">
          <span>© 2026 CodeBoxx</span>
          <span>v1.0.0 Stable · SHA: 7be1af8</span>
        </div>
      </div>
    </footer>
  );
}

export { NAV, NavItem, TopBar, Footer };
