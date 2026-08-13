import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge, Form, Offcanvas } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { TopBar, Footer } from '../components/Chrome';
import Avatar from '../components/Avatar';
import Logo from '../components/Logo';
import { useSanityTeam, useSanityLogos, useSanityPosts, sanityImageUrl } from '../lib/sanity';
import { useIntakes } from '../lib/intakes';
import '../lib/image-slot.js';

// Only the id (used for anchors/routing) lives here — every text field is pulled
// from home.divisions.<id> via useDivisions() so it stays in sync with the toggle.
const DIVISIONS_META = [{ id: 'codeboxx' }, { id: 'solutions' }, { id: 'academy' }];

function useDivisions() {
  const { t } = useTranslation();
  return DIVISIONS_META.map((d) => ({
    id: d.id,
    ...t('home.divisions.' + d.id, { returnObjects: true }),
  }));
}

function Codi({ open, onClose }) {
  const { t } = useTranslation();
  const replies = t('home.codi.replies', { returnObjects: true });
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
            <span className="codi-name">{t('home.codi.name')}</span>
            <span className="codi-role">{t('home.codi.role')}</span>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3">
          <Badge bg="success">{t('home.codi.active')}</Badge>
          <Button size="sm" variant="ghost" onClick={onClose}>
            {t('actions.close')}
          </Button>
        </div>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column p-0">
        <div className="codi-log">
          <div className="codi-bubble">{t('home.codi.greeting')}</div>
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
            placeholder={t('home.codi.placeholder')}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <Button onClick={send}>{t('home.codi.send')}</Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

function Testimonials({ eyebrow, items }) {
  return (
    <div className="testimonials">
      <p className="eyebrow">{eyebrow}</p>
      <div className="grid3">
        {items.map((t) => (
          <figure key={t.name} className="panel testimonial">
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

function ClientSlider() {
  const { t } = useTranslation();
  const logos = useSanityLogos(CLIENT_LOGOS);
  const ref = React.useRef(null);
  const [paused, setPaused] = React.useState(false);
  const nudge = (d) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: d * el.clientWidth * 0.8, behavior: 'smooth' });
  };
  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      const el = ref.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max - 4) el.scrollTo({ left: 0, behavior: 'smooth' });
      else el.scrollBy({ left: 224, behavior: 'smooth' });
    }, 2600);
    return () => clearInterval(t);
  }, [paused]);
  return (
    <div
      className="client-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="client-slider-head">
        <p className="eyebrow">{t('home.clientSlider.trustedBy')}</p>
        <div className="d-flex gap-2">
          <Button size="sm" variant="outline-primary" onClick={() => nudge(-1)}>
            &lt;
          </Button>
          <Button size="sm" variant="outline-primary" onClick={() => nudge(1)}>
            &gt;
          </Button>
        </div>
      </div>
      <div ref={ref} className="noscroll client-track">
        {logos.map((logo) => (
          <div key={logo.id} className="client-slide">
            <image-slot
              id={'client-logo-' + logo.id}
              src={logo.logo}
              shape="rect"
              fit="contain"
              placeholder={logo.name}
              style={{ width: '100%', height: '100%', '--slot-frame-bg': 'transparent' }}
            ></image-slot>
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

function SectionHead({ eyebrow, index, title, lede, children }) {
  return (
    <div className="section-head">
      <div className="d-flex flex-column gap-3">
        <ScriptTitle index={index}>{eyebrow}</ScriptTitle>
        <h2 className="h2">{title}</h2>
        {lede ? <p className="lede">{lede}</p> : null}
      </div>
      {children}
    </div>
  );
}

function Platform() {
  const { t } = useTranslation();
  const divisions = useDivisions();
  return (
    <section id="platform" className="sect">
      <div className="wrap">
        <SectionHead
          index="01"
          eyebrow={t('home.platform.eyebrow')}
          title={t('home.platform.title')}
          lede={t('home.platform.lede')}
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
                <a href={'#' + d.id} className="link-tag">
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
}) {
  return (
    <section id={id} className={'sect' + (alt ? ' sect-alt' : '')}>
      <div className="wrap">
        {aside ? (
          <div className="d-flex gap-5 align-items-start justify-content-between flex-wrap">
            <div className="division-main">
              <SectionHead index={index} eyebrow={role} title={name} lede={lede} />
              {intro}
            </div>
            {aside}
          </div>
        ) : (
          <React.Fragment>
            <SectionHead index={index} eyebrow={role} title={name} lede={lede} />
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
// comes from home.about.<id> via useAbout().
const ABOUT_META = [
  {
    id: 'team',
    people: [
      { id: 'nicolas-genest', name: 'Nicolas Genest', linkedin: 'https://www.linkedin.com/in/ngenest/' },
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
      { id: 'brian-peret', name: 'Brian Peret', linkedin: 'https://www.linkedin.com/in/brian-peret-b62636101/' },
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
      { id: 'dovev-weaver-sr', name: 'Dovév Weaver Sr.', linkedin: 'https://www.linkedin.com/in/coachdtalks/' },
    ],
  },
  { id: 'history', subhead: 'CodeBoxx', reference: 'https://coruzant.com/profiles/nicolas-genest/' },
  { id: 'vision' },
];

function useAbout() {
  const { t } = useTranslation();
  return ABOUT_META.map((a) => {
    const copy = t('home.about.' + a.id, { returnObjects: true });
    return {
      ...a,
      ...copy,
      people: a.people?.map((p) => ({ ...p, role: copy.people?.[p.id]?.role })),
    };
  });
}

function ChevronButton({ active, onClick }) {
  return (
    <Button size="sm" variant={active ? 'primary' : 'outline-primary'} onClick={onClick}>
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
  const { t } = useTranslation();
  const about = useAbout();
  // Stores just the id, not the translated object — so a language switch can't
  // leave `active` pointing at a stale-language copy of the previously-active item.
  const [activeId, setActiveId] = React.useState('team');
  const active = about.find((a) => a.id === activeId) || about[0];
  const studioTeam = useSanityTeam('studio', about[0].people);
  React.useEffect(() => {
    const apply = () => {
      const m = /^#about-(team|history|vision)$/.exec(location.hash);
      if (!m) return;
      setActiveId(m[1]);
      const el = document.getElementById('codeboxx');
      if (el)
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.pageYOffset - 70,
          behavior: 'smooth',
        });
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);
  return (
    <DivisionBand
      alt
      id="codeboxx"
      index="03"
      role={t('home.studio.role')}
      name={t('home.studio.name')}
      lede={t('home.studio.lede')}
      left={
        <div className="stacked-list">
          {about.map((a) => (
            <div key={a.id} className="stacked-item">
              <span className={'stacked-item-title' + (active.id === a.id ? ' active' : '')}>
                {a.title}
              </span>
              <span className="pbody">{a.blurb}</span>
              <ChevronButton active={active.id === a.id} onClick={() => setActiveId(a.id)} />
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
// field comes from home.services.<id> via useServices().
const SERVICES_META = [
  { id: 'cto' },
  { id: 'agentic' },
  { id: 'custom', logos: ['Crewkit', 'Optigo', 'Catalog Crafter', 'Soumigo'] },
  { id: 'daas' },
];

function useServices() {
  const { t } = useTranslation();
  return SERVICES_META.map((s) => ({
    ...s,
    ...t('home.services.' + s.id, { returnObjects: true }),
  }));
}

const LOGO_LINKS = {
  Crewkit: 'https://crewkit.io/',
  Optigo: 'https://optigo.ca/',
  'Catalog Crafter': 'https://www.catalogcrafter.com/',
  Soumigo: 'https://soumigo.com/',
};

// Static files in public/assets/ are referenced by URL path, not imported as JS
// modules — Vite only bundles imports from src/, public/ is served as-is.
const LOGO_IMAGES = {
  Crewkit: '/assets/crewkit.png',
  Optigo: '/assets/optigo.png',
  'Catalog Crafter': '/assets/catalog-crafter.png',
  Soumigo: '/assets/soumigo.png',
};

function ServiceDetail({ s }) {
  const { t } = useTranslation();
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
                <image-slot
                  id={'team-' + person.id}
                  src={person.photo}
                  mask="polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)"
                  fit="cover"
                  placeholder={t('home.headshot')}
                  style={{ width: '100%', height: '100%' }}
                ></image-slot>
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
                  {t('home.linkedIn')}
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
          &mdash;{t('home.referenceLabel')}{' '}
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
                <image-slot
                  id={'logo-' + n.toLowerCase().replace(/\s+/g, '-')}
                  src={LOGO_IMAGES[n]}
                  shape="rounded"
                  radius="8"
                  fit="contain"
                  placeholder={n}
                  style={{ width: '90%', height: 64, '--slot-frame-bg': 'transparent' }}
                ></image-slot>
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
  const { t } = useTranslation();
  const services = useServices();
  const [activeId, setActiveId] = React.useState('cto');
  const active = services.find((s) => s.id === activeId) || services[0];
  return (
    <DivisionBand
      id="solutions"
      index="04"
      role={t('home.solutions.role')}
      name={t('home.solutions.name')}
      aside={
        <div className="d-flex flex-column gap-3 align-items-center award-block">
          <img
            src="/assets/award-2025-retailtech.png"
            alt="RetailTech Breakthrough Award 2025 — CodeBoxx for GoodwillFinds' GEM Chatbot, Chatbot Solution of the Year"
            className="award-img"
          />
          <span className="award-caption">{t('home.solutions.award.caption')}</span>
        </div>
      }
      after={
        <React.Fragment>
          <ClientSlider />
          <Testimonials
            eyebrow={t('home.testimonials.clientEyebrow')}
            items={t('home.clientQuotes', { returnObjects: true })}
          />
        </React.Fragment>
      }
      lede={null}
      intro={
        <div className="d-flex flex-column gap-3 division-intro">
          <p className="lede lede-wide">{t('home.solutions.introPara1')}</p>
          <p className="lede lede-wide">{t('home.solutions.introPara2')}</p>
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
              <ChevronButton active={active.id === s.id} onClick={() => setActiveId(s.id)} />
            </div>
          ))}
        </div>
      }
    >
      <ServiceDetail s={active} />
    </DivisionBand>
  );
}

// Raw seed rows only — title/meta come from home.intake.<id> via i18n (see
// IntakeCalendar below), since these predate any Sanity 'program' documents.
// Each program's seed dates split across both pace columns just to demonstrate the
// 2-column-per-row layout — no scheduling meaning, same as the rest of this seed.
const SEED_INTAKES_META = [
  {
    id: 'fsd',
    paces: {
      'Full Time': [
        ['Sep 14, 2026', 'Quebec City', 'Open'],
        ['Jan 11, 2027', 'Remote', 'Waitlist'],
      ],
      'Part Time': [
        ['Oct 26, 2026', 'Montreal', 'Open'],
        ['Mar 22, 2027', 'Quebec City', 'Planned'],
      ],
    },
  },
  {
    id: 'aidev',
    paces: {
      'Full Time': [
        ['Sep 28, 2026', 'Remote', 'Open'],
        ['Feb 08, 2027', 'Remote', 'Planned'],
      ],
      'Part Time': [
        ['Nov 16, 2026', 'Montreal', 'Waitlist'],
        ['Apr 19, 2027', 'Quebec City', 'Planned'],
      ],
    },
  },
];

function CalendarColumn({ title, rows }) {
  const { t } = useTranslation();
  const tone = {
    Open: 'status-open',
    Waitlist: 'status-waitlist',
    Planned: 'status-planned',
    Ongoing: 'status-ongoing',
  };
  const statusLabel = t('home.intake.status', { returnObjects: true });
  return (
    <div className="calendar-col">
      <div className="calendar-col-head">
        <span className="calendar-col-title calendar-pace-title">{title}</span>
      </div>
      {rows.map(([date, place, status], i) => (
        <div key={i} className="calendar-row">
          <div className="calendar-row-left">
            <span className="calendar-date">{date || t('home.intake.onDemand')}</span>
            <span className="calendar-place">{place}</span>
          </div>
          <span className={'calendar-status ' + tone[status]}>{statusLabel[status] || status}</span>
        </div>
      ))}
    </div>
  );
}

function IntakeCalendar() {
  const { t } = useTranslation();
  const seed = SEED_INTAKES_META.map((p) => ({
    id: p.id,
    title: t('home.intake.' + p.id + '.title'),
    paces: p.paces,
  }));
  const programs = useIntakes() || seed;
  return (
    <div id="intake" className="calendar-band">
      <div className="calendar-head">
        <div className="d-flex flex-column gap-3">
          <span className="calendar-eyebrow">{t('home.intake.eyebrow')}</span>
          <span className="calendar-title">{t('home.intake.title')}</span>
        </div>
        <Badge bg="brand">{t('home.intake.editable')}</Badge>
      </div>
      <div className="calendar-rows">
        {programs.map((p) => (
          <div key={p.id} className="calendar-program-row">
            <span className="calendar-col-title">{p.title}</span>
            <div className="calendar-cols calendar-grid">
              <CalendarColumn title={t('home.intake.fullTime')} rows={p.paces['Full Time']} />
              <CalendarColumn title={t('home.intake.partTime')} rows={p.paces['Part Time']} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Structural-only: id, and `team`'s people id/name/linkedin. Text (titles, blurbs,
// course items, roles) comes from home.academyTopics.<id> via useAcademyTopics(),
// reshaped from tuples into named fields (titleLines/blurbParagraphs/items/kicker/
// people) so Academy() below never does positional (`[2]`, `[5]`, ...) indexing.
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
      { id: 'raina-dejute', name: 'Raina DeJute', linkedin: 'https://www.linkedin.com/in/rainadejute/' },
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

function useAcademyTopics() {
  const { t } = useTranslation();
  const coursesLabel = t('home.academy.coursesLabel');
  return ACADEMY_META.map((topic) => {
    const copy = t('home.academyTopics.' + topic.id, { returnObjects: true });
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

function Academy({ onEnroll }) {
  const { t } = useTranslation();
  const topics = useAcademyTopics();
  const [active, setActive] = React.useState(0);
  const academyTeam = useSanityTeam('academy', topics[2].people);
  React.useEffect(() => {
    const apply = () => {
      if (location.hash === '#academy-courses') {
        setActive(1);
      } else if (location.hash === '#academy') {
        setActive(0);
      } else {
        return;
      }
      document.getElementById('academy')?.scrollIntoView();
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);
  return (
    <DivisionBand
      alt
      id="academy"
      index="05"
      role={t('home.academy.role')}
      name={t('home.academy.name')}
      after={
        <React.Fragment>
          <IntakeCalendar />
          <Testimonials
            eyebrow={t('home.testimonials.gradEyebrow')}
            items={t('home.gradQuotes', { returnObjects: true })}
          />
        </React.Fragment>
      }
      lede={t('home.academy.lede')}
      intro={
        <div className="d-flex flex-column gap-3 division-intro">
          <p className="lede lede-wide">{t('home.academy.intro')}</p>
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
              <ChevronButton active={active === i} onClick={() => setActive(i)} />
            </div>
          ))}
        </div>
      }
    >
      <div className="panel panel-sticky">
        <div className="d-flex justify-content-between align-items-center gap-3">
          <span className="kicker">{topics[active].kicker || t('home.academy.cohortStructureLabel')}</span>
          <Badge bg="brand">{t('home.academy.nextIntake')}</Badge>
        </div>
        <p className="pbody">{topics[active].detail}</p>
        {topics[active].people ? (
          <div className="people-grid people-grid-4">
            {academyTeam.map((person) => (
              <div key={person.id} className="person">
                <div className="person-photo person-photo-gray">
                  <image-slot
                    id={'academy-team-' + person.id}
                    src={person.photo}
                    mask="polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)"
                    fit="cover"
                    placeholder={t('home.headshot')}
                    style={{ width: '100%', height: '100%' }}
                  ></image-slot>
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
                    {t('home.linkedIn')}
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {(topics[active].items || (topics[active].people ? [] : t('home.cohort', { returnObjects: true }))).map(
          ([w, tt, b, cta], i) => (
            <div key={i} className="stacked-item">
              <span className="eyebrow">{w}</span>
              <span className="cohort-title">{tt}</span>
              <span className="pbody">{b}</span>
              {cta === 'enroll' ? (
                <Button size="sm" className="mt-1" onClick={() => onEnroll(tt)}>
                  {t('home.academy.enrollNow')}
                </Button>
              ) : null}
              {cta === 'contact' ? (
                <Button
                  size="sm"
                  variant="outline-primary"
                  className="mt-1"
                  onClick={() => {
                    location.hash = '#contact';
                  }}
                >
                  {t('home.academy.contactUs')}
                </Button>
              ) : null}
            </div>
          )
        )}
      </div>
    </DivisionBand>
  );
}

function CountUp({ value }) {
  const m = String(value).match(/^([\d.]+)(.*)$/);
  const target = m ? parseFloat(m[1]) : 0;
  const suffix = m ? m[2] : '';
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
      {Math.round(n)}
      {suffix}
    </span>
  );
}

function Metrics() {
  const { t } = useTranslation();
  const metrics = t('home.metrics.items', { returnObjects: true });
  return (
    <section className="sect sect-navy">
      <div className="wrap">
        <div className="d-flex flex-column gap-3 mb-5">
          <ScriptTitle index="06" dark>
            {t('home.metrics.eyebrow')}
          </ScriptTitle>
          <h2 className="h2 h2-inverse">{t('home.metrics.title')}</h2>
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

function Contact({ onEnroll }) {
  const { t } = useTranslation();
  const divisions = useDivisions();
  const [f, setF] = React.useState({ first: '', last: '', email: '', country: '', phone: '' });
  const [division, setDivision] = React.useState('codeboxx');
  const [mobile, setMobile] = React.useState('yes');
  const [lang, setLang] = React.useState('en');
  const [consent, setConsent] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const set = (k) => (e) => setF((v) => Object.assign({}, v, { [k]: e.target.value }));
  const invalid = f.email.length > 0 && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email);
  const ready = f.first && f.last && f.email && !invalid && f.country && f.phone && consent;
  return (
    <section id="contact" className="sect sect-contact">
      <div className="wrap grid2">
        <div className="d-flex flex-column gap-3">
          <ScriptTitle index="07">{t('home.contact.learnMore')}</ScriptTitle>
          <h2 className="h2">{t('home.contact.title')}</h2>
          <p className="lede">{t('home.contact.lede1')}</p>
          <p className="lede">{t('home.contact.lede2')}</p>
          <div className="rule rule-spaced" />
          <h2 className="h2">{t('home.contact.enrollAcademyTitle')}</h2>
          <p className="lede">{t('home.contact.enrollAcademyLede')}</p>
          <div className="d-flex gap-3 flex-wrap">
            <Button onClick={() => onEnroll('Advanced AI Developer')}>
              {t('home.contact.enrollAiBtn')}
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => onEnroll('AI Native Full-Stack Developer')}
            >
              {t('home.contact.enrollFsdBtn')}
            </Button>
          </div>
        </div>
        <div className="panel">
          <h2 className="h2 h2-tight">{t('home.contact.formTitle')}</h2>
          <div className="d-flex flex-column gap-2">
            <span className="field-label">{t('home.contact.divisionLabel')}</span>
            <div className="d-flex gap-2 flex-wrap">
              {divisions.map((d) => (
                <Form.Check
                  key={d.id}
                  type="checkbox"
                  checked={division === d.id}
                  onChange={() => setDivision(d.id)}
                  label={d.name.replace('CodeBoxx ', '')}
                />
              ))}
              <Form.Check
                type="checkbox"
                checked={division === 'ventures'}
                onChange={() => setDivision('ventures')}
                label={t('home.contact.venturesLabel')}
              />
            </div>
          </div>
          <div className="form-row-2">
            <Form.Control
              placeholder={t('home.contact.firstPlaceholder')}
              value={f.first}
              onChange={set('first')}
            />
            <Form.Control
              placeholder={t('home.contact.lastPlaceholder')}
              value={f.last}
              onChange={set('last')}
            />
          </div>
          <Form.Group>
            <Form.Control
              placeholder={t('home.contact.emailPlaceholder')}
              value={f.email}
              isInvalid={invalid}
              onChange={set('email')}
            />
            <Form.Control.Feedback type="invalid">
              {t('home.contact.invalidEmail')}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="form-row-2">
            <Form.Control
              placeholder={t('home.contact.countryPlaceholder')}
              value={f.country}
              onChange={set('country')}
            />
            <Form.Control
              placeholder={t('home.contact.phonePlaceholder')}
              value={f.phone}
              onChange={set('phone')}
            />
          </div>
          <div className="d-flex flex-column gap-2">
            <span className="field-label">{t('home.contact.mobileQ')}</span>
            <div className="d-flex gap-2">
              <Form.Check
                type="checkbox"
                checked={mobile === 'yes'}
                onChange={() => setMobile('yes')}
                label={t('home.contact.yes')}
              />
              <Form.Check
                type="checkbox"
                checked={mobile === 'no'}
                onChange={() => setMobile('no')}
                label={t('home.contact.no')}
              />
            </div>
          </div>
          <div className="d-flex flex-column gap-2">
            <span className="field-label">{t('home.contact.languageQ')}</span>
            <div className="d-flex gap-2">
              <Form.Check
                type="checkbox"
                checked={lang === 'en'}
                onChange={() => setLang('en')}
                label={t('home.contact.english')}
              />
              <Form.Check
                type="checkbox"
                checked={lang === 'fr'}
                onChange={() => setLang('fr')}
                label={t('home.contact.french')}
              />
            </div>
          </div>
          <div className="d-flex gap-2 align-items-start">
            <Form.Check
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              label=""
            />
            <span className="consent-text">
              {t('home.contact.consentTextPart1')}
              <a href="mailto:info@codeboxx.biz">info@codeboxx.biz</a>
              {t('home.contact.consentTextPart2')}
              <a href="#contact">{t('home.contact.consentLinkText')}</a>
              {t('home.contact.consentTextPart3')}
            </span>
          </div>
          <div className="rule" />
          <div className="form-actions">
            <span className={'form-actions-note' + (sent ? ' sent' : '')}>
              {sent ? t('home.contact.sentNote') : t('home.contact.notSentNote')}
            </span>
            <Button size="lg" disabled={!ready} onClick={() => setSent(true)}>
              {t('home.contact.submit')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Phone country codes/abbreviations — not translated (not prose).
const DIAL_CODES = [
  ['+1', 'US/CA'],
  ['+33', 'FR'],
  ['+44', 'UK'],
  ['+52', 'MX'],
  ['+55', 'BR'],
  ['+61', 'AU'],
  ['+91', 'IN'],
  ['+234', 'NG'],
];

// options: [{ value, label }] — value is a stable, language-independent key so a
// language switch mid-form can't leave `value` holding a now-nonexistent old-language
// option string (which is what plain-string options did before, and which is why
// EnrollDrawer's radios below pass value/label pairs instead of the display text).
function RadioRow({ label, options, value, onChange }) {
  return (
    <div className="d-flex flex-column gap-2">
      <Form.Label className="mb-0">{label}</Form.Label>
      <div className="d-flex gap-3 flex-wrap">
        {options.map((o) => (
          <Form.Check
            key={o.value}
            type="checkbox"
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            label={o.label}
          />
        ))}
      </div>
    </div>
  );
}

const ENROLL_BLANK = {
  first: '',
  last: '',
  birth: '',
  email: '',
  dial: '+1',
  phone: '',
  street: '',
  city: '',
  region: '',
  country: '',
  postal: '',
};

function EnrollDrawer({ course, onClose }) {
  const { t } = useTranslation();
  const [form, setForm] = React.useState(ENROLL_BLANK);
  const [mobile, setMobile] = React.useState('yes');
  const [lang, setLang] = React.useState('en');
  const [contactBy, setContactBy] = React.useState('email');
  const [heard, setHeard] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [renderCourse, setRenderCourse] = React.useState(course);
  React.useEffect(() => {
    if (course) {
      setRenderCourse(course);
      setSent(false);
    }
  }, [course]);
  const set = (k) => (e) => setForm((f) => Object.assign({}, f, { [k]: e.target.value }));
  const invalid = form.email.length > 0 && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email);
  const ready =
    form.first &&
    form.last &&
    form.birth &&
    form.email &&
    !invalid &&
    form.phone &&
    form.street &&
    form.city &&
    form.region &&
    form.country &&
    form.postal;
  const title =
    renderCourse && /full-?stack|fsd/i.test(renderCourse)
      ? t('home.enroll.titles.fsd')
      : t('home.enroll.titles.ai');
  const countries = t('home.countries', { returnObjects: true });
  const heardAbout = t('home.heardAbout', { returnObjects: true });
  return (
    <Offcanvas show={!!course} onHide={onClose} placement="end" className="enroll-offcanvas">
      <Offcanvas.Header className="site-header">
        <div className="d-flex flex-column gap-3 align-items-start">
          <span className="kicker">{t('home.enroll.kicker')}</span>
          <h3 className="ptitle">{title}</h3>
        </div>
        <Button size="sm" variant="ghost" onClick={onClose}>
          {t('actions.close')}
        </Button>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column gap-4">
        <h3 className="ptitle">{t('home.enroll.createAccount')}</h3>
        <p className="pbody">
          {t('home.enroll.alreadyHave')}
          <a href="https://student.codeboxx.com/pages/login.php" target="_blank" rel="noopener">
            {t('home.enroll.logIn')}
          </a>
          {t('home.enroll.toMakeSelection')}
        </p>
        <div className="form-row-2">
          <Form.Control
            placeholder={t('home.enroll.firstPlaceholder')}
            value={form.first}
            onChange={set('first')}
          />
          <Form.Control
            placeholder={t('home.enroll.lastPlaceholder')}
            value={form.last}
            onChange={set('last')}
          />
        </div>
        <Form.Group>
          <Form.Label>{t('home.enroll.birthdate')}</Form.Label>
          <Form.Control
            type="date"
            aria-label={t('home.enroll.birthdate')}
            value={form.birth}
            onChange={set('birth')}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            placeholder={t('home.enroll.emailPlaceholder')}
            value={form.email}
            isInvalid={invalid}
            onChange={set('email')}
          />
          <Form.Control.Feedback type="invalid">
            {t('home.enroll.invalidEmail')}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>{t('home.enroll.phoneNumberLabel')}</Form.Label>
          <div className="phone-row">
            <Form.Select aria-label={t('home.enroll.countryCodeLabel')} value={form.dial} onChange={set('dial')}>
              {DIAL_CODES.map(([c, n]) => (
                <option key={c} value={c}>
                  {c} {n}
                </option>
              ))}
            </Form.Select>
            <Form.Control
              aria-label={t('home.enroll.phoneNumberLabel')}
              placeholder={t('home.enroll.phonePlaceholder')}
              value={form.phone}
              onChange={set('phone')}
            />
          </div>
        </Form.Group>
        <RadioRow
          label={t('home.enroll.mobileQ')}
          options={[
            { value: 'yes', label: t('home.enroll.yes') },
            { value: 'no', label: t('home.enroll.no') },
          ]}
          value={mobile}
          onChange={setMobile}
        />
        <RadioRow
          label={t('home.enroll.languageQ')}
          options={[
            { value: 'en', label: t('home.enroll.english') },
            { value: 'fr', label: t('home.enroll.french') },
          ]}
          value={lang}
          onChange={setLang}
        />
        <RadioRow
          label={t('home.enroll.contactMethodQ')}
          options={[
            { value: 'phone', label: t('home.enroll.phone') },
            { value: 'sms', label: t('home.enroll.sms') },
            { value: 'email', label: t('home.enroll.email') },
          ]}
          value={contactBy}
          onChange={setContactBy}
        />
        <Form.Control
          placeholder={t('home.enroll.streetPlaceholder')}
          value={form.street}
          onChange={set('street')}
        />
        <div className="form-row-2">
          <Form.Control
            placeholder={t('home.enroll.cityPlaceholder')}
            value={form.city}
            onChange={set('city')}
          />
          <Form.Control
            placeholder={t('home.enroll.regionPlaceholder')}
            value={form.region}
            onChange={set('region')}
          />
        </div>
        <div className="form-row-2">
          <Form.Group>
            <Form.Label>{t('home.enroll.countryLabel')}</Form.Label>
            <Form.Select aria-label={t('home.enroll.countryLabel')} value={form.country} onChange={set('country')}>
              <option value="">{t('home.enroll.selectPlaceholder')}</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Control
            placeholder={t('home.enroll.postalPlaceholder')}
            value={form.postal}
            onChange={set('postal')}
          />
        </div>
        <Form.Group>
          <Form.Label>{t('home.enroll.heardAboutQ')}</Form.Label>
          <Form.Select
            aria-label={t('home.enroll.heardAboutQ')}
            value={heard}
            onChange={(e) => setHeard(e.target.value)}
          >
            <option value="">{t('home.enroll.selectPlaceholder')}</option>
            {heardAbout.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <p className="pbody">{t('home.enroll.reviewNote')}</p>
        <div className="rule" />
        <div className="form-actions">
          <span className={'form-actions-note' + (sent ? ' sent' : '')}>
            {sent ? t('home.enroll.receivedNote') : t('home.enroll.submitsNote')}
          </span>
          <Button size="lg" disabled={!ready} onClick={() => setSent(true)}>
            {t('home.enroll.submit')}
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

function WSJTeaser() {
  const { t } = useTranslation();
  return (
    <section className="band-dark">
      <div className="wrap band-dark-inner">
        <img
          id="wsj-logo"
          alt="Wall Street Journal logo"
          src="/assets/the-wall-street-journal.png"
          style={{ width: 320, height: 'auto' }}
        />
        <h2 className="band-heading">{t('home.wsj.heading')}</h2>
        <p className="band-body">{t('home.wsj.body')}</p>
        <Button
          onClick={() =>
            window.open(
              'https://www.wsj.com/lifestyle/careers/how-five-americans-made-it-to-the-middle-class-e9649f8b',
              '_blank',
              'noopener'
            )
          }
        >
          {t('home.wsj.cta')}
        </Button>
      </div>
    </section>
  );
}

// Latest three from the CodeBlog. Seed fallback only — same shape and seed slugs as
// SEED_POSTS in Blog.jsx. CodeBlog() below fetches the real thing via useSanityPosts,
// same as the /blog page, so this array only renders when there's no Sanity project
// configured or no live posts yet.
const LATEST_POSTS = [
  {
    title: 'Best Corporate AI Bootcamps',
    slug: 'best-corporate-ai-bootcamps',
    category: 'Technology News',
    date: '2026-01-14',
    excerpt:
      'Corporate AI training has become one of the fastest-growing investments in workforce development. Most organizations still struggle to find programs that go beyond awareness.',
  },
  {
    title: 'Unlock your own Future: Join CodeBoxx’s 4-Day Vibe Coding and Agentic AI Workshop',
    slug: 'unlock-your-own-future-join-codeboxx-s-4-day-vibe-coding-and-agentic-ai-workshop',
    category: 'Workshop',
    date: '2025-12-01',
    excerpt:
      'Four days, virtual or in the St. Petersburg classroom, ending with a product of yours in production or in your portfolio.',
  },
  {
    title: 'CodeBoxx Academy Expands Pathways to Prosperity Through New Community Referral Program',
    slug: 'codeboxx-academy-expands-pathways-to-prosperity-through-new-community-referral-program',
    category: 'CodeBoxx for Life',
    date: '2025-11-18',
    excerpt:
      'A referral partner program that lets individuals, businesses and organizations across Tampa Bay connect motivated learners to the Academy.',
  },
];

function fmtPostDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function CodeBlog() {
  const { t } = useTranslation();
  const posts = useSanityPosts(LATEST_POSTS).slice(0, 3);
  return (
    <section id="codeblog" className="sect sect-steel">
      <div className="wrap">
        <div className="d-flex flex-column gap-3 mb-40">
          <ScriptTitle index="02" dark>
            CodeBlog
          </ScriptTitle>
          <h2 className="h2 h2-inverse">{t('home.codeBlog.title')}</h2>
          <p className="lede lede-inverse">{t('home.codeBlog.lede')}</p>
        </div>
        <div className="grid3">
          {posts.map((p) => (
            <Link key={p.slug} to={'/blog/' + p.slug} className="panel panel-link-card">
              <image-slot
                id={'codeblog-' + p.slug}
                src={sanityImageUrl(p.featuredImage, { w: 500 })}
                shape="rect"
                fit="cover"
                placeholder={t('home.coverImage')}
                style={{ width: '100%', height: 180 }}
              ></image-slot>
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
            </Link>
          ))}
        </div>
        <div className="d-flex justify-content-center mt-40">
          <Button
            onClick={() => {
              window.location.href = '/blog';
            }}
          >
            {t('home.codeBlog.seeAllPosts')}
          </Button>
        </div>
      </div>
    </section>
  );
}

function ForgeTeaser() {
  const { t } = useTranslation();
  const features = t('home.forge.features', { returnObjects: true });
  return (
    <section className="band-dark">
      <div className="wrap band-dark-inner">
        <img
          src="/assets/crewkit_wh.png"
          alt="CodeBoxx w/ CrewKit Forge 20 appliance"
          width={210}
          className="forge-logo"
        />
        <span className="band-superhead">{t('home.forge.superhead')}</span>
        <h2 className="band-heading">{t('home.forge.heading')}</h2>
        <p className="band-body">{t('home.forge.body')}</p>
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
            {t('home.forge.buildYourOwn')}
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => window.open('http://crewkit.io', '_blank', 'noopener')}
          >
            {t('home.forge.learnMore')}
          </Button>
        </div>
      </div>
    </section>
  );
}

function App() {
  const { t } = useTranslation();
  const [codi, setCodi] = React.useState(false);
  const [enroll, setEnroll] = React.useState(null);
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
    <div id="top">
      <TopBar onCodi={() => setCodi(true)} onEnroll={setEnroll} />
      <div className="hero">
        <div className="d-flex">
          <span className="pill">{t('home.hero.pill')}</span>
        </div>
        <div className="d-flex justify-content-between align-items-end gap-5 flex-wrap">
          <h1>
            {t('home.hero.titleBefore')}
            <span className="text-brand">{t('home.hero.titleHighlight')}</span>
            {t('home.hero.titleAfter')}
          </h1>
          <div className="hero-logo">
            <Logo theme="dark" width={280} />
          </div>
        </div>
      </div>
      <Platform />
      <WSJTeaser />
      <CodeBlog />
      <Studio />
      <Solutions />
      <ForgeTeaser />
      <Academy onEnroll={setEnroll} />
      <Metrics />
      <Contact onEnroll={setEnroll} />
      <Footer />
      <Codi open={codi} onClose={() => setCodi(false)} />
      <EnrollDrawer course={enroll} onClose={() => setEnroll(null)} />
    </div>
  );
}

export default App;
