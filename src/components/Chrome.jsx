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
      ['Courses', '#academy'],
      ['Calendar', '#intake'],
      ['Financing Options', '/financing'],
    ],
  },
  { label: 'Ventures', href: '/ventures' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '#contact' },
];

function NavItem({ item }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      className={'nav-item' + (open ? ' open' : '')}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Nav.Link as="a" href={hrefFor(item.href)}>
        {item.label}
      </Nav.Link>
      {item.items && open ? (
        <div className="nav-dropdown">
          {item.items.map(([l, hr]) => (
            <a key={l} href={hrefFor(hr)} onClick={() => setOpen(false)}>
              {l}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TopBar({ onCodi, onEnroll }) {
  return (
    <header className="site-header">
      <Navbar expand="lg">
        <Container fluid className="wrap">
          <Navbar.Brand href={hrefFor('#top')} className="p-0">
            <Logo width={168} />
          </Navbar.Brand>
          <Nav className="flex-row flex-wrap gap-4 mx-auto">
            {NAV.map((n) => (
              <NavItem key={n.label} item={n} />
            ))}
          </Nav>
          <div className="d-flex align-items-center gap-3 flex-shrink-0">
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() =>
                onEnroll
                  ? onEnroll('AI Native Full-Stack Developer')
                  : (window.location.href = '/#contact')
              }
            >
              Enroll Now
            </Button>
            <Button size="sm" onClick={onCodi}>
              Talk With Codi
            </Button>
          </div>
        </Container>
      </Navbar>
    </header>
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
