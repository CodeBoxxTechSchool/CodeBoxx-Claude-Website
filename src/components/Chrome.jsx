import React from 'react';
import { Button, Logo } from '../design-system';

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
      style={{ position: 'relative', display: 'flex', alignItems: 'center', height: 80 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <a
        href={hrefFor(item.href)}
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: open ? 'var(--blue-500)' : 'var(--ui-slate-500)',
        }}
      >
        {item.label}
      </a>
      {item.items && open ? (
        <div
          style={{
            position: 'absolute',
            top: 68,
            left: -16,
            minWidth: 200,
            zIndex: 20,
            background: 'var(--neutral-0)',
            borderRadius: 12,
            padding: 8,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'inset 0 0 0 1px var(--ui-slate-200), 0 1px 2px 0 rgba(0,0,0,0.0392)',
          }}
        >
          {item.items.map(([l, hr]) => (
            <a
              key={l}
              href={hrefFor(hr)}
              onClick={() => setOpen(false)}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--ui-slate-900)',
                padding: '10px 12px',
                borderRadius: 8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--blue-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
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
    <header
      style={{
        background: 'var(--neutral-0)',
        boxShadow: 'inset 0 -1px 0 0 var(--ui-slate-200)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="wrap"
        style={{
          minHeight: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap',
          paddingBlock: 12,
        }}
      >
        <a href={hrefFor('#top')} style={{ display: 'flex' }}>
          <Logo width={168} />
        </a>
        <nav
          className="nav"
          style={{
            display: 'flex',
            gap: 20,
            alignItems: 'center',
            flex: '1 1 auto',
            minWidth: 0,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {NAV.map((n) => (
            <NavItem key={n.label} item={n} />
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '0 0 auto' }}>
          <Button
            size="sm"
            variant="secondary"
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
      </div>
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
    <footer style={{ background: 'var(--navy-500)', padding: '64px 0 48px' }}>
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 48,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Logo theme="dark" width={200} />
            <span
              style={{
                fontSize: 14,
                lineHeight: '20px',
                color: 'rgba(255,255,255,0.72)',
                maxWidth: 280,
              }}
            >
              One platform for the studio, the deployment operation and the academy.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 64, flexWrap: 'wrap' }}>
            {cols.map(([h, items]) => (
              <div key={h} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    color: 'var(--blue-500)',
                  }}
                >
                  {h}
                </span>
                {items.map((i) => (
                  <a
                    key={i}
                    href={hrefFor('#top')}
                    style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)' }}
                  >
                    {i}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.16)' }} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 24,
            fontSize: 11,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.56)',
          }}
        >
          <span>© 2026 CodeBoxx</span>
          <span>v1.0.0 Stable · SHA: 7be1af8</span>
        </div>
      </div>
    </footer>
  );
}

export { NAV, NavItem, TopBar, Footer };
