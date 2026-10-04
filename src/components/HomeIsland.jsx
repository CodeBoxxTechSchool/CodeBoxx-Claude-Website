import React from 'react';
import { Button, Badge, Form, Offcanvas, Spinner } from 'react-bootstrap';
import { TopBar, Footer } from './ChromeIsland';
import Avatar from './Avatar';
import CountryCombobox from './CountryCombobox';
import Logo from './Logo';
import CyclingHeadline from './CyclingHeadline';
import { localizedHref, localizedId } from '../lib/i18nRoutes';
import { pageUrl, useRelaySubmit } from '../lib/useRelaySubmit';
import { trackLead } from '../lib/trackLead';
import { PORTFOLIO } from '../lib/forgeEvidence';
import { money } from '../lib/forgeFormat';

// The homepage (replaced the old react-router Home.jsx).
//
// Unlike Blog/BlogPost, this is NOT decomposed into a dozen fine-grained islands.
// Home is overwhelmingly *interactive* content — Studio/Solutions/Academy are
// tab-switchers, there's a chat drawer, a contact form, a carousel, a count-up
// animation — so hand-splitting it wouldn't buy much, and the Codi drawer needs to
// share state with both TopBar (top of the page) and the content, which only works
// cleanly if they're all one React tree. (The enroll drawer moved to /academy, see
// EnrollDrawer.jsx.) So this whole component mounts as ONE
// `client:load` island from src/pages/index.astro — but Astro still server-renders
// its first pass into real HTML same as any other island, which already fixes the
// two real problems this migration exists to fix: (1) real SEO/OG tags (via
// SeoHead.astro, no react-helmet-async) and (2) all of this page's actual text —
// hero copy, division blurbs, team names/photos, service details, academy
// copy — exists in the HTML response instead of only appearing after a client
// fetch waterfall resolves (compare useSanityTeam/useSanityLogos/useSanityPosts in
// the legacy sanity.js, all client-side-only). What doesn't change: this is still
// a fully interactive page after hydration, same behavior as before, and it still
// ships a real JS bundle for that — this migration's win here is crawlability and
// removing the content pop-in, not a zero-JS page (unlike Blog's article body).
//
// `home`/`common` (this language's home.js/common.js content) and
// `studioTeam`/`academyTeam`/`logos`/`latestPosts` (build-time-resolved Sanity
// data, or null when Sanity has none — see fetchTeam/fetchLogos in
// lib/sanityContent.js) all come in as props from src/pages/index.astro and flow
// through this context instead of react-i18next/useSanity* hooks, so every
// sub-component below just calls useHomeCtx() instead of useTranslation()/a
// useSanity* hook.
const HomeCtx = React.createContext(null);
// The Academy and Corporate Training live on their own pages; localizedHref sends
// French visitors to /fr/academie and /fr/formation-entreprise.
const ACADEMY_HREF = '/academy/';
const ACADEMY_APPLY_HREF = '/academy/#apply';
const ACADEMY_DATES_HREF = '/academy/#dates';
const CORPORATE_HREF = '/corporate-training/';
function useHomeCtx() {
  return React.useContext(HomeCtx);
}

// Only the id (used for anchors/routing) lives here — every text field is pulled
// from home.divisions.<id>.
const DIVISIONS_META = [{ id: 'codeboxx' }, { id: 'solutions' }, { id: 'academy' }];

function useDivisions(home) {
  return DIVISIONS_META.map((d) => ({ id: d.id, ...home.divisions[d.id] }));
}

function Codi({ open, onClose }) {
  const { home, common } = useHomeCtx();
  const replies = home.codi.replies;
  const [draft, setDraft] = React.useState('');
  // Greeting is NOT the first `log` entry — it's rendered separately below, always
  // from the current language, since a useState initializer only runs once and
  // would otherwise freeze the greeting in whatever language was active on mount.
  const [log, setLog] = React.useState([]);
  const send = () => {
    if (!draft.trim()) return;
    const reply = replies[log.filter((l) => l[0] === 'user').length % replies.length];
    setLog((l) => [...l, ['user', draft], ['codi', reply]]);
    setDraft('');
  };
  return (
    <Offcanvas show={open} onHide={onClose} placement="end" className="codi-offcanvas">
      <Offcanvas.Header className="site-header">
        <div className="d-flex align-items-center gap-3">
          <Avatar size="md" />
          <div className="d-flex flex-column gap-1">
            <span className="codi-name">{home.codi.name}</span>
            <span className="codi-role">{home.codi.role}</span>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3">
          <Badge bg="success">{home.codi.active}</Badge>
          <Button size="sm" variant="ghost" onClick={onClose}>
            {common.actions.close}
          </Button>
        </div>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column p-0">
        <div className="codi-log">
          <div className="codi-bubble">{home.codi.greeting}</div>
          {log.map(([who, text], i) => (
            <div key={i} className={'codi-bubble' + (who === 'user' ? ' codi-bubble-user' : '')}>
              {text}
            </div>
          ))}
        </div>
        <div className="codi-input-row">
          <Form.Control
            id="codi-input"
            className="flex-grow-1"
            placeholder={home.codi.placeholder}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <Button onClick={send}>{home.codi.send}</Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

function ClientCard({ t }) {
  return (
    <figure className="panel testimonial client-testimonial">
      <blockquote className="testimonial-quote">{t.quote}</blockquote>
      <figcaption className="testimonial-byline">
        <div className="rule" />
        <div className="testimonial-person">
          <Avatar size="md" />
          <div className="d-flex flex-column gap-1">
            <span className="testimonial-name">{t.name}</span>
            <span className="testimonial-role">{t.role}</span>
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

// 3 or fewer: the static 3-up grid, as before. More than 3 (e.g. once an
// editor adds a 4th client testimonial in Sanity): the same horizontal
// scroll-track + nudge-button slider pattern ClientSlider uses below, minus
// the auto-scroll, since these are read, not glanced at.
const SLIDER_LABELS = {
  en: { prev: 'Previous', next: 'Next', pause: 'Pause', play: 'Play' },
  fr: { prev: 'Précédent', next: 'Suivant', pause: 'Pause', play: 'Lecture' },
};

// Prev/next nudge buttons shared by the sliders below. The glyphs are visual
// only; screen readers get the named labels instead of "less than/greater than".
function SliderButtons({ onNudge }) {
  const { lang } = useHomeCtx();
  const labels = SLIDER_LABELS[lang] || SLIDER_LABELS.en;
  return (
    <div className="d-flex gap-2">
      <Button
        size="sm"
        variant="outline-primary"
        aria-label={labels.prev}
        onClick={() => onNudge(-1)}
      >
        <span aria-hidden="true">&lt;</span>
      </Button>
      <Button
        size="sm"
        variant="outline-primary"
        aria-label={labels.next}
        onClick={() => onNudge(1)}
      >
        <span aria-hidden="true">&gt;</span>
      </Button>
    </div>
  );
}

function Testimonials({ eyebrow, items }) {
  const ref = React.useRef(null);
  const nudge = (d) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: d * el.clientWidth * 0.8, behavior: 'smooth' });
  };
  if (items.length > 3) {
    return (
      <div className="testimonials">
        <div className="testimonial-slider-head">
          <p className="eyebrow">{eyebrow}</p>
          <SliderButtons onNudge={nudge} />
        </div>
        <div
          ref={ref}
          className="noscroll testimonial-track"
          tabIndex={0}
          role="region"
          aria-label={eyebrow}
        >
          {items.map((t) => (
            <ClientCard key={t.name} t={t} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="testimonials">
      <p className="eyebrow">{eyebrow}</p>
      <div className="grid3">
        {items.map((t) => (
          <ClientCard key={t.name} t={t} />
        ))}
      </div>
    </div>
  );
}

const CLIENT_LOGOS = [
  { id: 'client-1', name: 'Client One' },
  { id: 'client-2', name: 'Client Two' },
  { id: 'client-3', name: 'Client Three' },
  { id: 'client-4', name: 'Client Four' },
  { id: 'client-5', name: 'Client Five' },
  { id: 'client-6', name: 'Client Six' },
  { id: 'client-7', name: 'Client Seven' },
  { id: 'client-8', name: 'Client Eight' },
];

function sanityImageUrl(url, { w, q = 60 } = {}) {
  if (!url) return null;
  return url + '?w=' + w + '&q=' + q + '&auto=format';
}

function ClientSlider() {
  const { home, lang, logos: logosLive } = useHomeCtx();
  const logos = logosLive && logosLive.length ? logosLive : CLIENT_LOGOS;
  return (
    <LogoSlider id={localizedId('works', lang)} label={home.clientSlider.trustedBy} logos={logos} />
  );
}

// Academy's "our graduates work at" slider (academyPartnerLogo in Sanity), shown
// between the intake calendar and the graduate testimonials. No static fallback:
// renders nothing until Sanity has documents.
function AcademyLogoSlider() {
  const { home, academyLogos } = useHomeCtx();
  if (!academyLogos || !academyLogos.length) return null;
  return <LogoSlider label={home.academy.logosLabel} logos={academyLogos} />;
}

// Shared auto-scrolling logo track behind both sliders above.
function LogoSlider({ id, label, logos }) {
  const { lang } = useHomeCtx();
  const ref = React.useRef(null);
  const [paused, setPaused] = React.useState(false);
  // Auto-scroll needs a way to stop it that works without a mouse (WCAG 2.2.2):
  // the Pause toggle, keyboard focus inside the slider, and prefers-reduced-motion.
  const [stopped, setStopped] = React.useState(false);
  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setStopped(true);
  }, []);
  const nudge = (d) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: d * el.clientWidth * 0.8, behavior: 'smooth' });
  };
  React.useEffect(() => {
    if (paused || stopped) return;
    const t = setInterval(() => {
      const el = ref.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max - 4) el.scrollTo({ left: 0, behavior: 'smooth' });
      else el.scrollBy({ left: 224, behavior: 'smooth' });
    }, 2600);
    return () => clearInterval(t);
  }, [paused, stopped]);
  return (
    <div
      id={id}
      className="client-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <div className="client-slider-head">
        <p className="eyebrow">{label}</p>
        <div className="d-flex gap-2">
          <Button size="sm" variant="outline-primary" onClick={() => setStopped((v) => !v)}>
            {stopped
              ? (SLIDER_LABELS[lang] || SLIDER_LABELS.en).play
              : (SLIDER_LABELS[lang] || SLIDER_LABELS.en).pause}
          </Button>
          <SliderButtons onNudge={nudge} />
        </div>
      </div>
      <div
        ref={ref}
        className="noscroll client-track"
        tabIndex={0}
        role="region"
        aria-label={label}
      >
        {logos.map((logo) => (
          <div key={logo.id} className="client-slide">
            <img
              src={sanityImageUrl(logo.logo, { w: 400, q: 80 })}
              alt={logo.name}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ScriptTitle({ index, children, dark }) {
  return (
    <span className={'script-title' + (dark ? ' script-title-dark' : '')}>
      <span className="script-title-index">
        <span>{index}</span>
        <span>&mdash;</span>
        <span className="script-title-label">{children}</span>
      </span>
    </span>
  );
}

function SectionHead({ eyebrow, index, title, lede, children, badge }) {
  return (
    <div className="section-head">
      <div className="d-flex flex-column gap-3">
        <ScriptTitle index={index}>{eyebrow}</ScriptTitle>
        {badge}
        <h2 className="h2">{title}</h2>
        {lede ? <p className="lede">{lede}</p> : null}
      </div>
      {children}
    </div>
  );
}

function Platform() {
  const { home, lang, pathname } = useHomeCtx();
  const divisions = useDivisions(home);
  return (
    <section id="platform" className="sect">
      <div className="wrap">
        <SectionHead
          index="01"
          eyebrow={home.platform.eyebrow}
          title={home.platform.title}
          lede={home.platform.lede}
        />
        <div className="grid3">
          {divisions.map((d) => (
            <div key={d.id} className="panel panel-division">
              <div className="d-flex flex-column gap-3">
                <Badge bg="brand">{d.tag}</Badge>
                <h3 className="ptitle">{d.name}</h3>
                <p className="pbody">{d.blurb}</p>
                {d.extra ? <p className="pbody">{d.extra}</p> : null}
              </div>
              <div className="d-flex flex-column gap-4">
                <div className="rule" />
                <a href={localizedHref('#' + d.id, lang, pathname)} className="link-tag">
                  {d.role}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DivisionBand({
  id,
  index,
  name,
  role,
  lede,
  points,
  children,
  alt,
  after,
  intro,
  left,
  aside,
  badge,
}) {
  return (
    <section id={id} className={'sect' + (alt ? ' sect-alt' : '')}>
      <div className="wrap">
        {aside ? (
          <div className="d-flex gap-5 align-items-start justify-content-between flex-wrap">
            <div className="division-main">
              <SectionHead index={index} eyebrow={role} title={name} lede={lede} badge={badge} />
              {intro}
            </div>
            {aside}
          </div>
        ) : (
          <React.Fragment>
            <SectionHead index={index} eyebrow={role} title={name} lede={lede} badge={badge} />
            {intro}
          </React.Fragment>
        )}
        <div className="grid2">
          {left || (
            <div className="stacked-list">
              {points.map(([t, b]) => (
                <div key={t} className="stacked-item">
                  <span className="stacked-item-title">{t}</span>
                  <span className="pbody">{b}</span>
                </div>
              ))}
            </div>
          )}
          {children}
        </div>
        {after}
      </div>
    </section>
  );
}

// Structural-only: id (routing/anchors), people id/name/linkedin (proper nouns and
// links, not translated), subhead/reference (brand name + URL). Every text field
// comes from home.about.<id>.
const ABOUT_META = [
  {
    id: 'team',
    people: [
      {
        id: 'nicolas-genest',
        name: 'Nicolas Genest',
        linkedin: 'https://www.linkedin.com/in/ngenest/',
      },
      {
        id: 'remi-gagnon',
        name: 'Rémi Gagnon',
        linkedin: 'https://www.linkedin.com/in/r%C3%A9mi-gagnon-7684092/',
      },
      {
        id: 'felix-antoine-paradis',
        name: 'Félix-Antoine Paradis',
        linkedin: 'https://www.linkedin.com/in/felixaparadis/',
      },
      {
        id: 'martin-chantal',
        name: 'Martin Chantal',
        linkedin: 'https://www.linkedin.com/in/martin-chantal-078832181/',
      },
      {
        id: 'marie-france-nolin',
        name: 'Marie-France Nolin',
        linkedin: 'https://www.linkedin.com/in/marie-france-nolin-1ab1b8154/',
      },
      {
        id: 'brian-peret',
        name: 'Brian Peret',
        linkedin: 'https://www.linkedin.com/in/brian-peret-b62636101/',
      },
      {
        id: 'francis-patry-jessop',
        name: 'Francis Patry-Jessop',
        linkedin: 'https://www.linkedin.com/in/francis-patry-jessop-b1794b241/',
      },
      {
        id: 'cederic-noel',
        name: 'Cédéric Noël',
        linkedin: 'https://www.linkedin.com/in/c%C3%A9d%C3%A9ric-no%C3%ABl-4145a5167/',
      },
      {
        id: 'dovev-weaver-sr',
        name: 'Dovév Weaver Sr.',
        linkedin: 'https://www.linkedin.com/in/coachdtalks/',
      },
    ],
  },
  {
    id: 'history',
    subhead: 'CodeBoxx',
    reference: 'https://coruzant.com/profiles/nicolas-genest/',
  },
  { id: 'vision' },
];

function useAbout(home) {
  return ABOUT_META.map((a) => {
    const copy = home.about[a.id];
    return {
      ...a,
      ...copy,
      people: a.people?.map((p) => ({ ...p, role: copy.people?.[p.id]?.role })),
    };
  });
}

function ChevronButton({ active, onClick, label }) {
  return (
    <Button
      size="sm"
      variant={active ? 'primary' : 'outline-primary'}
      onClick={onClick}
      aria-label={label}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 6 15 12 9 18"></polyline>
      </svg>
    </Button>
  );
}

function Studio() {
  const { home, lang, pathname, studioTeam: studioTeamLive } = useHomeCtx();
  const about = useAbout(home);
  // Stores just the id, not the translated object — so a language switch can't
  // leave `active` pointing at a stale-language copy of the previously-active item.
  const [activeId, setActiveId] = React.useState('team');
  const active = about.find((a) => a.id === activeId) || about[0];
  const studioTeam = studioTeamLive && studioTeamLive.length ? studioTeamLive : about[0].people;
  const codeboxxId = localizedId('codeboxx', lang);
  const teamHash = '#' + localizedId('about-team', lang);
  const historyHash = '#' + localizedId('about-history', lang);
  const visionHash = '#' + localizedId('about-vision', lang);
  React.useEffect(() => {
    const hashToId = { [teamHash]: 'team', [historyHash]: 'history', [visionHash]: 'vision' };
    const apply = () => {
      const found = hashToId[location.hash];
      if (!found) return;
      setActiveId(found);
      const el = document.getElementById(codeboxxId);
      if (el)
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.pageYOffset - 70,
          behavior: 'smooth',
        });
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, [codeboxxId, teamHash, historyHash, visionHash]);
  return (
    <DivisionBand
      alt
      id={codeboxxId}
      index="03"
      role={home.studio.role}
      name={home.studio.name}
      lede={home.studio.lede}
      left={
        <div className="stacked-list">
          {about.map((a) => (
            <div key={a.id} className="stacked-item">
              <span className={'stacked-item-title' + (active.id === a.id ? ' active' : '')}>
                {a.title}
              </span>
              <span className="pbody">{a.blurb}</span>
              <ChevronButton
                active={active.id === a.id}
                onClick={() => setActiveId(a.id)}
                label={a.title}
              />
            </div>
          ))}
        </div>
      }
    >
      <ServiceDetail s={active.id === 'team' ? { ...active, people: studioTeam } : active} />
    </DivisionBand>
  );
}

// Structural-only: id, and `custom`'s logos (image assets, not text). Every text
// field comes from home.services.<id>.
const SERVICES_META = [
  { id: 'cto' },
  { id: 'agentic' },
  { id: 'custom', logos: ['Crewkit', 'Optigo', 'Catalog Crafter', 'Soumigo'] },
  { id: 'daas' },
];

function useServices(home) {
  return SERVICES_META.map((s) => ({ ...s, ...home.services[s.id] }));
}

const LOGO_LINKS = {
  Crewkit: 'https://crewkit.io/',
  Optigo: 'https://optigo.ca/',
  'Catalog Crafter': 'https://www.catalogcrafter.com/',
  Soumigo: 'https://soumigo.com/',
};

// Static files in public/assets/ are referenced by URL path, not imported as JS
// modules — Astro (like Vite) only bundles imports from src/, public/ is served
// as-is.
const LOGO_IMAGES = {
  Crewkit: '/assets/crewkit.webp',
  Optigo: '/assets/optigo.webp',
  'Catalog Crafter': '/assets/catalog-crafter.webp',
  Soumigo: '/assets/soumigo.webp',
};

function ServiceDetail({ s }) {
  const { home } = useHomeCtx();
  return (
    <div className="panel panel-sticky">
      <div className="d-flex flex-column gap-3 align-items-start">
        <span className="kicker">{s.title}</span>
        <h3 className="service-heading">{s.heading}</h3>
        <h4 className="service-sub">{s.sub}</h4>
      </div>
      <div className="rule" />
      {s.detail.split('\n\n').map((p, i) => (
        <p key={i} className="pbody">
          {p}
        </p>
      ))}
      {s.people ? (
        <div className="people-grid">
          {s.people.map((person) => (
            <div key={person.id} className="person">
              <div className="person-photo">
                <img
                  src={sanityImageUrl(person.photo, { w: 480, q: 75 })}
                  alt={person.name}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)',
                  }}
                />
              </div>
              <div className="d-flex flex-column gap-1">
                <span className="person-name">{person.name}</span>
                <span className="person-role">{person.role}</span>
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-tag"
                >
                  {home.linkedIn}
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {s.tags ? (
        <React.Fragment>
          <div className="rule" />
          <div className="d-flex flex-wrap gap-2">
            {s.tags.map((tag) => (
              <Badge key={tag} bg="default">
                {tag}
              </Badge>
            ))}
          </div>
        </React.Fragment>
      ) : null}
      <div className="rule" />
      {s.subhead ? <h3 className="service-subhead">{s.subhead}</h3> : null}
      {s.close.split('\n\n').map((p, i) => (
        <p key={i} className="pbody">
          {p}
        </p>
      ))}
      {s.reference ? (
        <p className="pbody text-sm">
          &mdash;{home.referenceLabel}{' '}
          <a href={s.reference} target="_blank" rel="noopener noreferrer">
            {s.reference}
          </a>
        </p>
      ) : null}
      {s.logos ? (
        <div className="d-flex flex-column gap-4">
          <h3 className="service-logos-title">{s.logosTitle}</h3>
          <div className="logo-grid-4">
            {s.logos.map((n) => (
              <div key={n} className="d-flex flex-column gap-2 align-items-center">
                <img
                  src={LOGO_IMAGES[n]}
                  alt={n}
                  loading="lazy"
                  style={{ width: '90%', height: 64, objectFit: 'contain', borderRadius: 8 }}
                />
                <span className="link-tag link-tag-muted">
                  <a href={LOGO_LINKS[n]} target="_blank" rel="noopener noreferrer">
                    {n}
                  </a>
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {s.closeAfter ? <p className="pbody">{s.closeAfter}</p> : null}
      {s.steps ? (
        <div className="service-steps">
          {s.steps.map(([t, b], i) => (
            <div key={t} className="step">
              <span className="step-num">{i + 1}</span>
              <div className="d-flex flex-column gap-2">
                <span className="step-title">{t}</span>
                <span className="pbody">{b}</span>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Solutions() {
  const { home, lang, pathname, clientTestimonials: clientTestimonialsLive } = useHomeCtx();
  const services = useServices(home);
  const solutionsId = localizedId('solutions', lang);
  const [activeId, setActiveId] = React.useState('cto');
  const active = services.find((s) => s.id === activeId) || services[0];
  const clientQuotes =
    clientTestimonialsLive && clientTestimonialsLive.length
      ? clientTestimonialsLive
      : home.clientQuotes;
  return (
    <DivisionBand
      id={solutionsId}
      index="04"
      role={home.solutions.role}
      name={home.solutions.name}
      aside={
        <div className="d-flex flex-column gap-3 align-items-center award-block">
          <img
            src="/assets/award-2025-retailtech.webp"
            alt={home.solutions.award.alt}
            className="award-img"
            width={148}
            height={211}
            loading="lazy"
          />
          <span className="award-caption">{home.solutions.award.caption}</span>
        </div>
      }
      after={
        <React.Fragment>
          <ClientSlider />
          <div className="case-studies-cta">
            <Button variant="outline-primary" href={localizedHref('/case-studies', lang, pathname)}>
              {home.solutions.caseStudies}
            </Button>
          </div>
          <Testimonials eyebrow={home.testimonials.clientEyebrow} items={clientQuotes} />
        </React.Fragment>
      }
      lede={null}
      intro={
        <div className="d-flex flex-column gap-3 division-intro">
          <p className="lede lede-wide">{home.solutions.introPara1}</p>
          <p className="lede lede-wide">{home.solutions.introPara2}</p>
        </div>
      }
      left={
        <div className="stacked-list">
          {services.map((s) => (
            <div key={s.id} className="stacked-item">
              <span className={'stacked-item-title' + (active.id === s.id ? ' active' : '')}>
                {s.title}
              </span>
              <span className="pbody">{s.blurb}</span>
              <ChevronButton
                active={active.id === s.id}
                onClick={() => setActiveId(s.id)}
                label={s.title}
              />
            </div>
          ))}
        </div>
      }
    >
      <ServiceDetail s={active} />
    </DivisionBand>
  );
}

// Structural-only: id, and `team`'s people id/name/linkedin. Text (titles, blurbs,
// course items, roles) comes from home.academyTopics.<id>, reshaped from tuples
// into named fields (titleLines/blurbParagraphs/items/kicker/people) so Academy()
// below never does positional (`[2]`, `[5]`, ...) indexing.
const ACADEMY_META = [
  { id: 'program' },
  { id: 'courses' },
  {
    id: 'team',
    people: [
      {
        id: 'etienne-gonthier-lapointe',
        name: 'Etienne Gonthier-Lapointe',
        linkedin: 'https://www.linkedin.com/in/etienne-lapointe-b82b101bb/',
      },
      {
        id: 'raina-dejute',
        name: 'Raina DeJute',
        linkedin: 'https://www.linkedin.com/in/rainadejute/',
      },
      {
        id: 'brian-peret-academy',
        name: 'Brian Peret',
        linkedin: 'https://www.linkedin.com/in/brian-peret-b62636101/',
      },
      {
        id: 'francis-patry-jessop-academy',
        name: 'Francis Patry-Jessop',
        linkedin: 'https://www.linkedin.com/in/francis-patry-jessop-b1794b241/',
      },
    ],
  },
];

function useAcademyTopics(home) {
  const coursesLabel = home.academy.coursesLabel;
  return ACADEMY_META.map((topic) => {
    const copy = home.academyTopics[topic.id];
    if (topic.id === 'program') {
      return {
        id: topic.id,
        titleLines: [copy.titleLine1],
        blurbParagraphs: [copy.blurb],
        detail: copy.detail,
        items: null,
        kicker: null,
        people: null,
      };
    }
    if (topic.id === 'courses') {
      return {
        id: topic.id,
        titleLines: [copy.titleLine1, copy.titleLine2],
        blurbParagraphs: [copy.blurbPara1, copy.blurbPara2],
        detail: copy.detail,
        // Tuple shape ([tag, title, body, cta]) matches the COHORT fallback tuples
        // below, so Academy() renders both through the same .map(([w, t, b, cta]) ...).
        items: copy.items.map((it) => [it.tag, it.title, it.body, it.cta]),
        kicker: coursesLabel,
        people: null,
      };
    }
    return {
      id: topic.id,
      titleLines: [copy.titleLine1],
      blurbParagraphs: [copy.blurb],
      detail: copy.detail,
      items: null,
      kicker: copy.teamLabel,
      people: topic.people.map((p) => ({ ...p, role: copy.people?.[p.id]?.role })),
    };
  });
}

// The homepage's Academy section is a jump to /academy, the only place a student
// applies: no enroll drawer, intake calendar or graduate stories here any more
// (they live on /academy). The #academy anchor stays, so old links still land on
// this section and its link onward; the old calendar anchor (#intake) goes straight
// to /academy's dates.
function Academy() {
  const { home, lang, pathname, academyTeam: academyTeamLive } = useHomeCtx();
  const topics = useAcademyTopics(home);
  const [active, setActive] = React.useState(0);
  const academyTeam =
    academyTeamLive && academyTeamLive.length ? academyTeamLive : topics[2].people;
  const academyId = localizedId('academy', lang);
  const coursesHash = '#' + localizedId('academy-courses', lang);
  const academyHash = '#' + localizedId('academy', lang);
  const intakeHash = '#' + localizedId('intake', lang);
  React.useEffect(() => {
    const apply = () => {
      if (location.hash === intakeHash) {
        location.replace(localizedHref(ACADEMY_DATES_HREF, lang, pathname));
        return;
      }
      if (location.hash === coursesHash) {
        setActive(1);
      } else if (location.hash === academyHash) {
        setActive(0);
      } else {
        return;
      }
      document.getElementById(academyId)?.scrollIntoView();
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, [academyId, coursesHash, academyHash, intakeHash, lang, pathname]);
  return (
    <DivisionBand
      alt
      id={academyId}
      index="05"
      role={home.academy.role}
      name={home.academy.name}
      after={
        <React.Fragment>
          <AcademyLogoSlider />
        </React.Fragment>
      }
      lede={home.academy.lede}
      intro={
        <div className="d-flex flex-column gap-3 division-intro">
          <p className="lede lede-wide">{home.academy.intro}</p>
          <div className="d-flex gap-3 flex-wrap">
            <Button href={localizedHref(ACADEMY_HREF, lang, pathname)}>
              {home.academy.goToAcademy}
            </Button>
            {/* Codi lives on the Academy page; #codi opens it there. */}
            <Button
              variant="outline-primary"
              href={localizedHref(ACADEMY_HREF, lang, pathname) + '#codi'}
            >
              {home.academy.askCodi}
            </Button>
          </div>
        </div>
      }
      left={
        <div className="stacked-list">
          {topics.map((topic, i) => (
            <div key={topic.id} className="stacked-item">
              <span className={'stacked-item-title' + (active === i ? ' active' : '')}>
                {topic.titleLines.map((l, k) => (
                  <span key={k} className="line-block">
                    {l}
                  </span>
                ))}
              </span>
              <span className="pbody">
                {topic.blurbParagraphs.map((p, k) => (
                  <span key={k} className="line-block">
                    {p}
                  </span>
                ))}
              </span>
              <ChevronButton
                active={active === i}
                onClick={() => setActive(i)}
                label={topic.titleLines.join(' ')}
              />
            </div>
          ))}
        </div>
      }
    >
      <div className="panel panel-sticky">
        <span className="kicker">{topics[active].kicker || home.academy.cohortStructureLabel}</span>
        <p className="pbody">{topics[active].detail}</p>
        {topics[active].people ? (
          <div className="people-grid people-grid-4">
            {academyTeam.map((person) => (
              <div key={person.id} className="person">
                <div className="person-photo person-photo-gray">
                  <img
                    src={sanityImageUrl(person.photo, { w: 480, q: 75 })}
                    alt={person.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)',
                    }}
                  />
                </div>
                <div className="d-flex flex-column gap-1">
                  <span className="person-name">{person.name}</span>
                  <span className="person-role">{person.role}</span>
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-tag"
                  >
                    {home.linkedIn}
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {(topics[active].items || (topics[active].people ? [] : home.cohort)).map(
          ([w, tt, b, cta], i) => (
            <div key={i} className="stacked-item">
              <span className="eyebrow">{w}</span>
              <span className="cohort-title">{tt}</span>
              <span className="pbody">{b}</span>
              {cta === 'enroll' ? (
                <Button
                  size="sm"
                  className="mt-1 align-self-start"
                  href={localizedHref(ACADEMY_APPLY_HREF, lang, pathname)}
                >
                  {home.academy.applyOnAcademy}
                </Button>
              ) : null}
              {cta === 'contact' ? (
                <div className="d-flex gap-2 flex-wrap mt-1">
                  <Button size="sm" href={localizedHref(CORPORATE_HREF, lang, pathname)}>
                    {home.academy.learnMore}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => {
                      location.hash = localizedHref('#contact', lang, pathname);
                    }}
                  >
                    {home.academy.contactUs}
                  </Button>
                </div>
              ) : null}
            </div>
          )
        )}
      </div>
    </DivisionBand>
  );
}

function CountUp({ value }) {
  // Non-numeric prefix/suffix (e.g. "+" and "K" in "+55K") are kept as-is
  // around the animated number.
  const m = String(value).match(/^(\D*?)([\d.]+)(.*)$/);
  const prefix = m ? m[1] : '';
  const target = m ? parseFloat(m[2]) : 0;
  const suffix = m ? m[3] : '';
  const [n, setN] = React.useState(0);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const t0 = performance.now(),
          dur = 1400;
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          setN(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target]);
  return (
    <span ref={ref}>
      {prefix}
      {Math.round(n)}
      {suffix}
    </span>
  );
}

function Metrics() {
  const { home } = useHomeCtx();
  const metrics = home.metrics.items;
  return (
    <section className="sect sect-navy">
      <div className="wrap">
        <div className="d-flex flex-column gap-3 mb-5">
          <ScriptTitle index="06" dark>
            {home.metrics.eyebrow}
          </ScriptTitle>
          <h2 className="h2 h2-inverse">{home.metrics.title}</h2>
        </div>
        <div className="grid4">
          {metrics.map(([n, label, desc]) => (
            <div key={label} className="metric">
              <span className="metric-value">
                <CountUp value={n} />
              </span>
              <span className="metric-label">{label}</span>
              <span className="metric-desc">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const CONTACT_BLANK = {
  first: '',
  last: '',
  email: '',
  country: '',
  phone: '',
  message: '',
  website: '',
};

function Contact() {
  const { home, lang } = useHomeCtx();
  const divisions = useDivisions(home);
  const contactId = localizedId('contact', lang);
  const [f, setF] = React.useState(CONTACT_BLANK);
  const [division, setDivision] = React.useState('codeboxx');
  const [mobile, setMobile] = React.useState('yes');
  const [lg, setLg] = React.useState(lang === 'fr' ? 'fr' : 'en');
  const [consent, setConsent] = React.useState(false);
  const { status, submit } = useRelaySubmit('/api/contact');
  const set = (k) => (e) => setF((v) => Object.assign({}, v, { [k]: e.target.value }));
  const invalid = f.email.length > 0 && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email);
  const ready = f.first && f.last && f.email && !invalid && f.country && f.phone && consent;
  const sending = status === 'sending';
  const send = async () => {
    const fields = { ...f, division, mobile, lang: lg, consent, pageUrl: pageUrl() };
    // Blank again after a success, so a second click can't send the same message twice.
    if (await submit(fields)) {
      trackLead({ formId: 'contact', language: lang });
      setF(CONTACT_BLANK);
      setConsent(false);
    }
  };
  const note = {
    sent: home.contact.sentNote,
    error: home.contact.errorNote,
    busy: home.contact.busyNote,
  }[status];
  return (
    <section id={contactId} className="sect sect-contact">
      <div className="wrap grid2">
        <div className="d-flex flex-column gap-3">
          <ScriptTitle index="07">{home.contact.learnMore}</ScriptTitle>
          <h2 className="h2">{home.contact.title}</h2>
          <p className="lede">{home.contact.lede1}</p>
          <p className="lede">{home.contact.lede2}</p>
          <div className="rule rule-spaced" />
          <h2 className="h2">{home.contact.enrollAcademyTitle}</h2>
          <p className="lede">{home.contact.enrollAcademyLede}</p>
          <div className="d-flex gap-3 flex-wrap">
            <Button href={localizedHref(ACADEMY_APPLY_HREF, lang)}>{home.contact.applyBtn}</Button>
          </div>
        </div>
        <div className="panel">
          <h2 className="h2 h2-tight">{home.contact.formTitle}</h2>
          <div className="d-flex flex-column gap-2">
            <span className="field-label">{home.contact.divisionLabel}</span>
            <div className="d-flex gap-2 flex-wrap">
              {divisions.map((d) => (
                <Form.Check
                  key={d.id}
                  id={'contact-division-' + d.id}
                  type="checkbox"
                  checked={division === d.id}
                  onChange={() => setDivision(d.id)}
                  label={d.name.replace('CodeBoxx ', '')}
                />
              ))}
              <Form.Check
                id="contact-division-ventures"
                type="checkbox"
                checked={division === 'ventures'}
                onChange={() => setDivision('ventures')}
                label={home.contact.venturesLabel}
              />
            </div>
          </div>
          <div className="form-row-2">
            <Form.Control
              placeholder={home.contact.firstPlaceholder}
              value={f.first}
              onChange={set('first')}
            />
            <Form.Control
              placeholder={home.contact.lastPlaceholder}
              value={f.last}
              onChange={set('last')}
            />
          </div>
          <Form.Group>
            <Form.Control
              placeholder={home.contact.emailPlaceholder}
              value={f.email}
              isInvalid={invalid}
              onChange={set('email')}
            />
            <Form.Control.Feedback type="invalid">
              {home.contact.invalidEmail}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="form-row-2">
            <CountryCombobox
              id="contact-country"
              label={home.enroll.countryLabel}
              lang={lang}
              value={f.country}
              onChange={(country) => setF((v) => ({ ...v, country }))}
              strings={home.enroll}
            />
            <Form.Control
              className="align-self-end"
              placeholder={home.contact.phonePlaceholder}
              value={f.phone}
              onChange={set('phone')}
            />
          </div>
          <div className="d-flex flex-column gap-2">
            <span className="field-label">{home.contact.mobileQ}</span>
            <div className="d-flex gap-2">
              <Form.Check
                id="contact-mobile-yes"
                type="checkbox"
                checked={mobile === 'yes'}
                onChange={() => setMobile('yes')}
                label={home.contact.yes}
              />
              <Form.Check
                id="contact-mobile-no"
                type="checkbox"
                checked={mobile === 'no'}
                onChange={() => setMobile('no')}
                label={home.contact.no}
              />
            </div>
          </div>
          <div className="d-flex flex-column gap-2">
            <span className="field-label">{home.contact.languageQ}</span>
            <div className="d-flex gap-2">
              <Form.Check
                id="contact-lang-en"
                type="checkbox"
                checked={lg === 'en'}
                onChange={() => setLg('en')}
                label={home.contact.english}
              />
              <Form.Check
                id="contact-lang-fr"
                type="checkbox"
                checked={lg === 'fr'}
                onChange={() => setLg('fr')}
                label={home.contact.french}
              />
            </div>
          </div>
          <Form.Group>
            <Form.Label htmlFor="contact-message">{home.contact.messageLabel}</Form.Label>
            <Form.Control
              id="contact-message"
              as="textarea"
              rows={4}
              maxLength={2000}
              value={f.message}
              onChange={set('message')}
            />
          </Form.Group>
          <div className="d-flex gap-2 align-items-start">
            <Form.Check
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              aria-label={home.contact.consentTextPart1}
            />
            <span className="consent-text">
              {home.contact.consentTextPart1}
              <a href="mailto:info@codeboxx.com">info@codeboxx.com</a>
              {home.contact.consentTextPart2}
              <a href={localizedHref('/privacy-policy', lang)}>{home.contact.consentLinkText}</a>
              {home.contact.consentTextPart3}
            </span>
          </div>
          <div className="enroll-hp" aria-hidden="true">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={f.website}
              onChange={set('website')}
            />
          </div>
          <div className="rule" />
          <div className="form-actions">
            <span
              className={'form-actions-note' + (status === 'sent' ? ' sent' : note ? ' error' : '')}
              aria-live="polite"
            >
              {note ?? home.contact.notSentNote}
            </span>
            <Button size="lg" disabled={!ready || sending} onClick={send}>
              {sending && <Spinner size="sm" aria-hidden="true" />}
              {sending ? home.contact.sending : home.contact.submit}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function fmtPostDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function CodeBlog() {
  const { home, lang, pathname, latestPosts } = useHomeCtx();
  const posts = latestPosts.slice(0, 3);
  return (
    <section id="codeblog" className="sect sect-steel">
      <div className="wrap">
        <div className="d-flex flex-column gap-3 mb-40">
          <ScriptTitle index="02" dark>
            CodeBlog
          </ScriptTitle>
          <h2 className="h2 h2-inverse">{home.codeBlog.title}</h2>
          <p className="lede lede-inverse">{home.codeBlog.lede}</p>
        </div>
        <div className="grid3">
          {posts.map((p) => (
            <a
              key={p.slug}
              href={localizedHref('/blog/' + p.slug, lang, pathname)}
              className="panel panel-link-card"
            >
              <img
                src={sanityImageUrl(p.featuredImage, { w: 500 })}
                alt={p.title}
                loading="lazy"
                style={{ width: '100%', height: 270, objectFit: 'cover' }}
              />
              <div className="panel-link-card-body">
                <div className="d-flex flex-column gap-3">
                  <Badge bg="brand">{p.category}</Badge>
                  <h3 className="ptitle">{p.title}</h3>
                  <p className="pbody">{p.excerpt}</p>
                </div>
                <div className="d-flex flex-column gap-4">
                  <div className="rule" />
                  <span className="card-date">{fmtPostDate(p.date)}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="d-flex justify-content-center mt-40">
          <Button
            onClick={() => {
              window.location.href = localizedHref('/blog', lang, pathname);
            }}
          >
            {home.codeBlog.seeAllPosts}
          </Button>
        </div>
      </div>
    </section>
  );
}

// "Start here" entry window, right under the hero: one doorway each to the
// CrewKit Forge 20 page (owned), its Dive Deeper evidence page (proven) and the
// #AIDoneRight standard (accountable). The Owned card's title cycles: it opens
// on the thesis, then runs the six headlines of the build-order funnel with the
// funnel's own transitions (CyclingHeadline). Each card is one big link (Bootstrap's
// .stretched-link) with its secondary links raised above it. The evidence bar
// is to scale and reads the same PORTFOLIO totals the Dive Deeper page uses.
const BUILD_ORDER_URL = 'https://buildorder.codeboxx.com/';

function Gateway() {
  const { home, lang, pathname } = useHomeCtx();
  const g = home.gateway;
  const factoryShare = (PORTFOLIO.factoryCost / PORTFOLIO.traditionalCost) * 100;
  return (
    <section className="gw" aria-labelledby="gw-title">
      <div className="wrap gw-inner">
        <div className="gw-head">
          <span className="gw-eyebrow">{g.eyebrow}</span>
          <h2 id="gw-title" className="gw-words">
            {g.words.map((w, i) => (
              <span key={w} className={'gw-word gw-word-' + i}>
                {w}
              </span>
            ))}
          </h2>
          <p className="gw-lede">{g.lede}</p>
        </div>

        <div className="gw-grid">
          <article className="gw-card gw-forge">
            <img
              className="gw-forge-img"
              src="/assets/crewkit-forge-poster.webp"
              alt={g.forge.imageAlt}
              width={1248}
              height={736}
              loading="lazy"
            />
            <div className="gw-card-body">
              <span className="gw-kicker">{g.forge.kicker}</span>
              <h3 className="gw-title gw-title-lg gw-title-cycling">
                <CyclingHeadline phrases={[g.forge.title, ...g.forge.reel.phrases]} />
              </h3>
              <p className="gw-body">{g.forge.body}</p>
              <div className="gw-links">
                <a
                  className="stretched-link gw-cta"
                  href={localizedHref('/crewkit-forge-20', lang, pathname)}
                >
                  {g.forge.cta} →
                </a>
                <a className="gw-secondary" href={BUILD_ORDER_URL} target="_blank" rel="noopener">
                  {g.forge.reserve}
                </a>
              </div>
            </div>
          </article>

          <article className="gw-card gw-deep">
            <span className="gw-kicker">{g.deep.kicker}</span>
            <h3 className="gw-title">
              {g.deep.title.replace('{saved}', money(PORTFOLIO.saved, lang))}
            </h3>
            <div className="gw-bars" aria-hidden="true">
              <div className="gw-bar-row">
                <span className="gw-bar-label">{g.deep.traditional}</span>
                <span className="gw-bar gw-bar-trad" style={{ width: '100%' }} />
                <span className="gw-bar-value">{money(PORTFOLIO.traditionalCost, lang)}</span>
              </div>
              <div className="gw-bar-row">
                <span className="gw-bar-label">{g.deep.factory}</span>
                <span className="gw-bar gw-bar-fact" style={{ width: factoryShare + '%' }} />
                <span className="gw-bar-value">{money(PORTFOLIO.factoryCost, lang)}</span>
              </div>
            </div>
            <a
              className="stretched-link gw-cta"
              href={localizedHref('/crewkit-forge-20/dive-deeper', lang, pathname)}
            >
              {g.deep.cta} →
            </a>
          </article>

          <article className="gw-card gw-adr">
            <span className="gw-kicker">{g.adr.kicker}</span>
            <span className="gw-adr-tag">{g.adr.tag}</span>
            <h3 className="gw-title">{g.adr.title}</h3>
            <p className="gw-body">{g.adr.body}</p>
            <div className="gw-links">
              <a
                className="stretched-link gw-cta"
                href={localizedHref('/ai-done-right', lang, pathname)}
              >
                {g.adr.cta} →
              </a>
              <a
                className="gw-secondary"
                href="/docs/AI-Done-Right-v2.0.pdf"
                download="AI-Done-Right-v2.0.pdf"
              >
                {g.adr.download}
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function ForgeTeaser() {
  const { home, lang, pathname } = useHomeCtx();
  const features = home.forge.features;
  return (
    <section className="band-dark">
      <video
        className="hero-video"
        muted
        loop
        playsInline
        preload="none"
        poster="/assets/crewkit-forge-poster.webp"
        aria-hidden="true"
      >
        <source src="/assets/crewkit-forge.webm" type="video/webm" />
        <source src="/assets/crewkit-forge.mp4" type="video/mp4" />
      </video>
      <div
        className="hero-video-scrim"
        style={{ background: 'rgba(0, 0, 0, 0.8)' }}
        aria-hidden="true"
      />
      <div className="wrap band-dark-inner">
        <img
          src="/assets/crewkit_wh.webp"
          alt="CodeBoxx w/ CrewKit Forge 20 appliance"
          width={210}
          height={100}
          className="forge-logo"
          loading="lazy"
        />
        <span className="band-superhead">{home.forge.superhead}</span>
        <h2 className="band-heading">{home.forge.heading}</h2>
        <p className="band-body">{home.forge.body}</p>
        <div className="forge-features">
          {features.map(([title, d]) => (
            <div key={title} className="forge-feature">
              <span className="forge-feature-title">{title}</span>
              <span className="forge-feature-body">{d}</span>
            </div>
          ))}
        </div>
        <div className="d-flex gap-3 flex-wrap justify-content-center mt-2">
          <Button
            onClick={() => window.open('https://buildorder.codeboxx.com/', '_blank', 'noopener')}
          >
            {home.forge.buildYourOwn}
          </Button>
          <Button
            variant="outline-primary"
            href={localizedHref('/crewkit-forge-20', lang, pathname)}
          >
            {home.forge.learnMore}
            <span className="visually-hidden">{home.forge.learnMoreAbout}</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function HomeIsland({
  lang,
  pathname,
  home,
  common,
  studioTeam,
  academyTeam,
  logos,
  academyLogos,
  latestPosts,
  clientTestimonials,
}) {
  const [codi, setCodi] = React.useState(false);
  React.useEffect(() => {
    // Arriving here from another page (e.g. clicking "Contact" on /blog) lands on
    // "/#contact" via a full page load. The browser's own anchor-scroll fires before
    // React has rendered the target section, so it silently does nothing — this is
    // the one-time catch-up scroll that makes it land the same place a same-page
    // click already does (same-page clicks keep working via native anchor scrolling,
    // unaffected by this effect).
    if (!location.hash) return;
    document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }, []);
  return (
    <HomeCtx.Provider
      value={{
        lang,
        pathname,
        home,
        common,
        studioTeam,
        academyTeam,
        logos,
        academyLogos,
        latestPosts,
        clientTestimonials,
      }}
    >
      <div id="top">
        <TopBar lang={lang} pathname={pathname} strings={common} onCodi={() => setCodi(true)} />
        <main id="main" tabIndex={-1}>
          <div className="hero">
            <video
              className="hero-video"
              muted
              loop
              playsInline
              preload="none"
              poster="/assets/hero-video-poster.webp"
              aria-hidden="true"
            >
              <source src="/assets/hero-video-bkg.webm" type="video/webm" />
              <source src="/assets/hero-video-bkg.mp4" type="video/mp4" />
            </video>
            <div className="hero-video-scrim" aria-hidden="true" />
            <div className="d-flex">
              <span className="pill">{home.hero.pill}</span>
            </div>
            <div className="d-flex justify-content-between align-items-end gap-5 flex-wrap">
              <h1>
                {home.hero.titleBefore}
                <span className="text-brand">{home.hero.titleHighlight}</span>
                {home.hero.titleAfter}
              </h1>
              <div className="hero-logo">
                <Logo theme="dark" width={280} />
              </div>
            </div>
          </div>
          <Gateway />
          <Platform />
          <CodeBlog />
          <Studio />
          <Solutions />
          <ForgeTeaser />
          <Academy />
          <Metrics />
          <Contact />
        </main>
        <Footer lang={lang} pathname={pathname} strings={common} />
        <Codi open={codi} onClose={() => setCodi(false)} />
      </div>
    </HomeCtx.Provider>
  );
}
