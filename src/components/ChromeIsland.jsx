import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import Logo from './Logo';
import { localizedHref } from '../lib/i18nRoutes';
import { SOCIAL_LINKS } from '../lib/social';

// Site-wide top menu and footer (replaced the old react-router/react-i18next
// Chrome.jsx). Props-driven instead of reading a router context or i18next:
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
      ['aboutAiDoneRight', '/ai-done-right'],
    ],
  },
  {
    key: 'solutions',
    href: '/solutions/',
    items: [
      ['solutionsServices', '/solutions/#services'],
      ['corporateTraining', '/corporate-training'],
      ['solutionsWorks', '#works'],
    ],
  },
  {
    key: 'academy',
    // /academy is the one Academy page; localizedHref sends French pages to its
    // twin, /fr/academie.
    href: '/academy/',
    items: [
      ['academyCourses', '/academy/#programs'],
      ['academyCalendar', '/academy/#dates'],
      ['academyFinancing', '/financing'],
      ['academyFaq', '/academy/#faq'],
    ],
  },
  { key: 'ventures', href: '/ventures' },
  { key: 'blog', href: '/blog' },
  { key: 'contact', href: '#contact' },
];

// Accessible name keeps the visible "FR"/"EN" text (WCAG 2.5.3 Label in Name)
// and adds the language's own name, announced in that language.
const LANGUAGE_NAMES = { en: 'English', fr: 'Français' };

function LanguageToggle({ lang, pathname, hrefOverride }) {
  const next = lang === 'fr' ? 'en' : 'fr';
  const href = hrefOverride || localizedHref(pathname, next, pathname);
  return (
    <a
      className="btn btn-sm btn-outline-primary"
      href={href}
      hrefLang={next}
      lang={next}
      aria-label={next.toUpperCase() + ' – ' + LANGUAGE_NAMES[next]}
    >
      {next.toUpperCase()}
    </a>
  );
}

// Blue strip under the top bar with the social icons, like codeboxx.com's (Wix) header:
// six icons don't fit next to the FR/EN button at every width. Part of the sticky header.
function SocialBar({ strings }) {
  return (
    <nav className="social-bar" aria-label={strings.social.label}>
      <ul className="social-bar-list">
        {SOCIAL_LINKS.map((link) => (
          <li key={link.key}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name + strings.social.newTab}
              title={link.name}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
                <path fill="currentColor" d={link.path} />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </nav>
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

// "Talk With Codi" site-wide is hidden for now: flip to true to bring the button back in the
// top bar and the mobile CTA bar everywhere. Pages that mount the live assistant (the Academy
// pages, via Layout's `codi` prop) show it regardless.
const SHOW_CODI_BUTTON = false;

// Academy content on a page that isn't the Academy's own (the homepage's Academy section) carries
// data-cta="enroll". While one crosses the middle of the screen, TopBar's call to action is Enroll
// Now instead of Contact Us.
function useAcademyInView(enabled) {
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return;
    const sections = document.querySelectorAll('[data-cta="enroll"]');
    if (!sections.length) return;
    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)
        );
        setInView(visible.size > 0);
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);
  return inView;
}

export function TopBar({
  lang,
  pathname,
  strings,
  onCodi,
  langHref,
  codi = false,
  cta = 'general',
}) {
  const [expanded, setExpanded] = React.useState(false);
  const nav = NAV_STRUCTURE.map((n) => ({
    key: n.key,
    label: strings.nav[n.key],
    href: localizedHref(n.href, lang, pathname),
    items: n.items?.map(([k, href]) => [strings.nav[k], localizedHref(href, lang, pathname)]),
  }));
  // Pages without an on-page Codi drawer (Blog, BlogPost) send the visitor to the
  // homepage's #contact section instead.
  const contactHref = localizedHref('#contact', lang, pathname);
  // `codi`: the page mounts the live admissions assistant (CodiChat.jsx), opened by its event.
  const handleCodi = codi
    ? () => window.dispatchEvent(new Event('codi:open'))
    : onCodi || (() => (window.location.href = contactHref));
  const showCodi = SHOW_CODI_BUTTON || codi;
  // Academy visitors enroll; everyone else is asked to get in touch. `cta`:
  // - 'enroll': the Academy's pages (Academy, Financing, FAQ, Pinellas residents).
  // - 'contact': the pages for companies (Solutions, Case Studies, Corporate Training, Forge 20,
  //   Ventures, #AIDoneRight), to inquire or pitch in their own #contact section
  //   (BusinessContactSection.astro).
  // - 'general': every other page, the homepage's contact form. On the homepage, Enroll Now
  //   while its Academy section is on screen (useAcademyInView).
  const academyInView = useAcademyInView(cta !== 'enroll');
  const ctaButton =
    cta === 'enroll' || academyInView
      ? {
          href: localizedHref('/academy/#apply', lang, pathname),
          label: strings.actions.enrollNow,
        }
      : { href: cta === 'contact' ? '#contact' : contactHref, label: strings.actions.contactUs };
  return (
    <React.Fragment>
      <a className="skip-link" href="#main">
        {strings.actions.skipToContent}
      </a>
      <header className="site-header">
        <Navbar expand="lg" expanded={expanded} onToggle={setExpanded}>
          <Container fluid className="wrap">
            <Navbar.Brand href={localizedHref('#top', lang, pathname)} className="p-0">
              <Logo width={168} label="CodeBoxx Technology" />
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
              <LanguageToggle lang={lang} pathname={pathname} hrefOverride={langHref} />
              <Button size="sm" variant="outline-primary" href={ctaButton.href}>
                {ctaButton.label}
              </Button>
              {showCodi && (
                <Button size="sm" onClick={handleCodi}>
                  {strings.actions.talkWithCodi}
                </Button>
              )}
            </div>
          </Container>
        </Navbar>
        <SocialBar strings={strings} />
      </header>
      <div className="mobile-cta-bar d-lg-none">
        <Button variant="outline-primary" href={ctaButton.href}>
          {ctaButton.label}
        </Button>
        {showCodi && <Button onClick={handleCodi}>{strings.actions.talkWithCodi}</Button>}
      </div>
    </React.Fragment>
  );
}

// Footer columns' link data — separate from strings.footer.columns (which only
// carries each column's title now; see common.js). Built entirely from nav.* +
// the exact hrefs NAV_STRUCTURE's own menu/dropdowns use, so this can't drift
// out of sync with the top menu the way a second, hand-copied list in
// common.js could. Real hrefs (not the blanket "#top" every footer link used
// before) since these now point at actual pages/sections, same as the top menu.
function buildFooterColumns(lang, pathname, strings) {
  const nav = strings.nav;
  const href = (h) => localizedHref(h, lang, pathname);
  return [
    {
      key: 'codeboxx',
      title: strings.footer.columns.codeboxx.title,
      items: [
        { label: nav.ventures, href: href('/ventures') },
        { label: nav.blog, href: href('/blog') },
        { label: nav.about, href: href('#codeboxx') },
        { label: nav.aboutAiDoneRight, href: href('/ai-done-right') },
        { label: strings.footer.careers, href: href('/careers') },
      ],
    },
    {
      key: 'solutions',
      title: strings.footer.columns.solutions.title,
      items: [
        { label: nav.solutionsServices, href: href('/solutions/#services') },
        { label: nav.corporateTraining, href: href('/corporate-training') },
        { label: nav.solutionsWorks, href: href('#works') },
        { label: nav.caseStudies, href: href('/case-studies') },
      ],
    },
    {
      key: 'academy',
      title: strings.footer.columns.academy.title,
      items: [
        { label: nav.academyCourses, href: href('/academy/#programs') },
        { label: nav.academyCalendar, href: href('/academy/#dates') },
        { label: nav.academyFinancing, href: href('/financing') },
        { label: nav.academyFaq, href: href('/academy/#faq') },
      ],
    },
  ];
}

// Florida CIE licensure disclosure (see footer.licensure in common.js for why the
// wording is fixed). Also rendered on its own by Layout.astro on pages that hide
// the footer, since landing pages are advertising too.
export function LicensureNotice({ lang, strings, className = 'footer-licensure' }) {
  return (
    <p className={className} lang={lang === 'en' ? undefined : 'en'}>
      {strings.footer.licensure}
    </p>
  );
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
            <address className="footer-addresses">
              {strings.footer.addresses.map(([city, street]) => (
                <span key={city} className="footer-address">
                  <span className="footer-address-city">{city}</span>
                  <span aria-hidden="true"> | </span>
                  {street}
                </span>
              ))}
              <span className="footer-address">
                <span className="footer-address-city">{strings.footer.phone.label}</span>
                <span aria-hidden="true"> | </span>
                <a href={'tel:' + strings.footer.phone.tel}>{strings.footer.phone.display}</a>
              </span>
            </address>
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
        <LicensureNotice lang={lang} strings={strings} />
        <div className="d-flex justify-content-between gap-4 footer-meta">
          <span>{strings.footer.copyright}</span>
          <nav className="footer-legal" aria-label={strings.footer.legalLabel}>
            {strings.footer.legal.map(([label, path]) => (
              <a key={path} href={localizedHref(path, lang, pathname)}>
                {label}
              </a>
            ))}
          </nav>
          <span>v1.0.0 Stable · SHA: 7be1af8</span>
        </div>
      </div>
    </footer>
  );
}
