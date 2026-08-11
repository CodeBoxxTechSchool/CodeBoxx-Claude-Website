import React from 'react';
import {
  Button,
  Hero,
  Logo,
  TopTitle,
  Badge,
  Card,
  Input,
  Checkbox,
  Toggle,
  Avatar,
  Icon,
} from '../design-system';
import { TopBar, Footer } from '../components/Chrome';
import '../lib/image-slot.js';

const DIVISIONS = [
  {
    id: 'codeboxx',
    name: 'CodeBoxx',
    role: 'About Us',
    tag: 'We Are CodeBoxx',
    blurb:
      'AI-native delivery pods that scope, build and ship product with the client in the room.',
    extra: 'We transform businesses, individuals, and communities through technology.',
  },
  {
    id: 'solutions',
    name: 'CodeBoxx Solutions',
    role: 'Discover Your Solutions',
    tag: 'Your Solutions',
    blurb:
      'We specialize in strategy, intricate design solutions, and top-tier software engineering services. Our expertise in the latest software development tools and technologies empowers our clients to innovate better and execute faster.',
  },
  {
    id: 'academy',
    name: 'CodeBoxx Academy',
    role: 'The Talent Pipeline',
    tag: 'The Next Generation',
    blurb:
      'CodeBoxx Academy is a workforce development solution committed to closing the opportunity gap and addressing the talent shortage in the tech industry. We believe that everyone has the potential to be a great developer, and we are dedicated to molding potential into proficiency and shaping novices into nimble developers.',
  },
];

const CODI_REPLIES = [
  'Routing to CodeBoxx Solutions. Median deploy time on managed clusters is 2.4s, 0 errors on the last 40 releases. Want the runbook sample?',
  'Academy intake opens September 2026. Cohorts run 12 weeks, full time, ending inside a client pod.',
  'A delivery lead and an engineer join the first call. Send the deadline and the system, and I will book it.',
];

function Codi({ open, onClose }) {
  const [draft, setDraft] = React.useState('');
  const [log, setLog] = React.useState([
    ['codi', 'Codi here, the CodeBoxx agent. Ask about the studio, the platform or the academy.'],
  ]);
  const send = () => {
    if (!draft.trim()) return;
    const reply = CODI_REPLIES[log.filter((l) => l[0] === 'user').length % CODI_REPLIES.length];
    setLog((l) => [...l, ['user', draft], ['codi', reply]]);
    setDraft('');
  };
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
        background: 'rgba(0,47,67,0.32)',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 420,
          maxWidth: '100%',
          height: '100%',
          background: 'var(--neutral-0)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'inset 1px 0 0 0 var(--ui-slate-200)',
        }}
      >
        <div
          style={{
            padding: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            boxShadow: 'inset 0 -1px 0 0 var(--ui-slate-200)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar size="md" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 700 }}>Codi</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--ui-slate-400)' }}>
                CodeBoxx AI Agent
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Badge variant="success">Active</Badge>
            <Button size="sm" variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            background: 'var(--ui-slate-50)',
          }}
        >
          {log.map(([who, text], i) => (
            <div
              key={i}
              style={{
                alignSelf: who === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '86%',
                borderRadius: 12,
                padding: '12px 16px',
                fontSize: 14,
                lineHeight: '20px',
                background: who === 'user' ? 'var(--blue-500)' : 'var(--neutral-0)',
                color: who === 'user' ? 'var(--neutral-0)' : 'var(--ui-slate-900)',
                boxShadow: who === 'user' ? 'none' : 'inset 0 0 0 1px var(--ui-slate-200)',
              }}
            >
              {text}
            </div>
          ))}
        </div>
        <div
          style={{
            padding: 24,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-end',
            boxShadow: 'inset 0 1px 0 0 var(--ui-slate-200)',
          }}
        >
          <Input
            id="codi-input"
            label={null}
            placeholder="Ask Codi"
            style={{ width: 'auto', flex: 1 }}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <Button onClick={send}>Send</Button>
        </div>
      </div>
    </div>
  );
}

function Testimonials({ eyebrow, items }) {
  return (
    <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <p className="eyebrow">{eyebrow}</p>
      <div className="grid3">
        {items.map((t) => (
          <figure
            key={t.name}
            className="panel"
            style={{ margin: 0, justifyContent: 'space-between', gap: 24 }}
          >
            <blockquote
              style={{ margin: 0, fontSize: 14, lineHeight: '20px', color: 'var(--ui-slate-900)' }}
            >
              {t.quote}
            </blockquote>
            <figcaption style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="rule" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar size="md" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{t.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--ui-slate-400)' }}>
                    {t.role}
                  </span>
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
  'Client One',
  'Client Two',
  'Client Three',
  'Client Four',
  'Client Five',
  'Client Six',
  'Client Seven',
  'Client Eight',
];

function ClientSlider() {
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
      style={{ marginTop: 64, display: 'flex', flexDirection: 'column', gap: 24 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}
      >
        <p className="eyebrow">Trusted By</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="secondary" onClick={() => nudge(-1)}>
            &lt;
          </Button>
          <Button size="sm" variant="secondary" onClick={() => nudge(1)}>
            &gt;
          </Button>
        </div>
      </div>
      <div
        ref={ref}
        className="noscroll"
        style={{ display: 'flex', gap: 24, overflowX: 'auto', scrollSnapType: 'x mandatory' }}
      >
        {CLIENT_LOGOS.map((n, i) => (
          <div
            key={i}
            style={{
              flex: '0 0 auto',
              width: 200,
              height: 96,
              scrollSnapAlign: 'start',
              background: 'var(--neutral-0)',
              borderRadius: 12,
              boxShadow: 'inset 0 0 0 1px var(--ui-slate-200)',
              padding: 16,
              boxSizing: 'border-box',
            }}
          >
            <image-slot
              id={'client-logo-' + i}
              shape="rect"
              fit="contain"
              placeholder={n}
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
    <span
      style={{
        width: 'fit-content',
        borderRadius: 9999,
        boxShadow: 'inset 0 0 0 1.5px var(--blue-500)',
        padding: '8px 16px',
        display: 'inline-flex',
        fontFamily: 'var(--font-sans)',
        fontWeight: 400,
        fontSize: 12,
        lineHeight: '100%',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        color: dark ? 'var(--neutral-0)' : 'var(--ui-slate-900)',
        whiteSpace: 'nowrap',
        marginBottom: 10,
      }}
    >
      <span style={{ display: 'inline-flex', gap: 8 }}>
        <span>{index}</span>
        <span>&mdash;</span>
        <span style={{ fontWeight: 700 }}>{children}</span>
      </span>
    </span>
  );
}

function SectionHead({ eyebrow, index, title, lede, children }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 48,
        marginBottom: 40,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ScriptTitle index={index}>{eyebrow}</ScriptTitle>
        <h2 className="h2">{title}</h2>
        {lede ? <p className="lede">{lede}</p> : null}
      </div>
      {children}
    </div>
  );
}

function Platform() {
  return (
    <section id="platform" className="sect">
      <div className="wrap">
        <SectionHead
          index="01"
          eyebrow="The Pipeline"
          title="Three divisions. One pipeline."
          lede="One AI-first entity covering the full need: the build, the platform that runs it and the talent that staffs it. Fewer vendors, faster delivery, lower cost per outcome."
        />
        <div className="grid3">
          {DIVISIONS.map((d) => (
            <div
              key={d.id}
              className="panel"
              style={{ justifyContent: 'space-between', minHeight: 240 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Badge variant="brand">{d.tag}</Badge>
                <h3 className="ptitle">{d.name}</h3>
                <p className="pbody">{d.blurb}</p>
                {d.extra ? <p className="pbody">{d.extra}</p> : null}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="rule" />
                <a
                  href={'#' + d.id}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    color: 'var(--blue-500)',
                    width: 'fit-content',
                  }}
                >
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
    <section
      id={id}
      className="sect"
      style={
        alt
          ? {
              background: 'var(--neutral-0)',
              boxShadow:
                'inset 0 1px 0 0 var(--ui-slate-200), inset 0 -1px 0 0 var(--ui-slate-200)',
            }
          : undefined
      }
    >
      <div className="wrap">
        {aside ? (
          <div
            style={{
              display: 'flex',
              gap: 48,
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: '1 1 560px', minWidth: 0 }}>
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
        <div className="grid2" style={{ alignItems: 'start' }}>
          {left || (
            <div
              className="panel"
              style={{ gap: 0, padding: 0, boxShadow: 'none', background: 'transparent' }}
            >
              {points.map(([t, b], i) => (
                <div
                  key={t}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    padding: '20px 0',
                    boxShadow: i === 0 ? 'none' : 'inset 0 1px 0 0 var(--ui-slate-200)',
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 700 }}>{t}</span>
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

const ABOUT = [
  {
    id: 'team',
    title: 'The Team',
    blurb:
      'A team devoted to the craft, passionate about delivering quality, and committed to innovating on every build.',
    heading: 'PEOPLE, PODS, PAIRING',
    sub: 'The team that scopes it is the team that ships it',
    detail:
      "Our team is dedicated to helping your business enhance its performance through innovative AI-First solutions. We understand the unique challenges you face and are committed to providing tailored strategies that drive results. Let's work together to elevate your business to new heights!",
    tags: null,
    people: [
      ['Nicolas Genest', 'CEO & Co-Founder', 'https://www.linkedin.com/in/ngenest/'],
      ['Rémi Gagnon', 'CDO', 'https://www.linkedin.com/in/r%C3%A9mi-gagnon-7684092/'],
      ['Félix-Antoine Paradis', 'CTO', 'https://www.linkedin.com/in/felixaparadis/'],
      [
        'Martin Chantal',
        'General Manager',
        'https://www.linkedin.com/in/martin-chantal-078832181/',
      ],
      [
        'Marie-France Nolin',
        'Administrative Assistant',
        'https://www.linkedin.com/in/marie-france-nolin-1ab1b8154/',
      ],
      ['Brian Peret', 'Academy Director', 'https://www.linkedin.com/in/brian-peret-b62636101/'],
      [
        'Francis Patry-Jessop',
        'Director of Coaching',
        'https://www.linkedin.com/in/francis-patry-jessop-b1794b241/',
      ],
      [
        'Cédéric Noël',
        'Director of Delivery',
        'https://www.linkedin.com/in/c%C3%A9d%C3%A9ric-no%C3%ABl-4145a5167/',
      ],
      [
        'Dovév Weaver Sr.',
        'Director of Communities & Outcomes',
        'https://www.linkedin.com/in/coachdtalks/',
      ],
    ],
    close:
      'You meet the people who will do the work in the first session, and they stay to the end of the engagement.',
  },
  {
    id: 'history',
    title: 'History',
    blurb: 'A studio, a platform practice and a school, built one after the other.',
    heading: 'BUILT, PROVEN, REPEATED',
    sub: 'Three divisions grown from one practice',
    detail:
      'Nicolas Genest is a technology executive, serial founder, and former multi-exit CTO who has built and led companies generating over $1 billion in annual revenue. He is the founder and CEO of CodeBoxx Technology, an AI-first education and software company that trains and employs technologists from all walks of life.\n\nPreviously, Nicolas Genest served as CTO at The RealReal, ModCloth, and Full Harvest, and led digital transformations at Walmart, Microsoft, and Pfizer. An early adopter of applied AI, machine learning, and automation, he’s known for his focus on “AI Done Right”—building human-centered, high-quality technology. Nicolas holds degrees in Business Analytics from Harvard University and in Business and Public Administration from the University of Phoenix, and is recognized as a U.S. EB-1A Extraordinary Ability Permanent Resident.',
    tags: null,
    subhead: 'CodeBoxx',
    close:
      'CodeBoxx goes beyond technical skills to enhance your employability. Their proprietary ProDev modules and career services help you cultivate the essential qualities that tech employers consistently tell them what they value most – such as communication, creative problem-solving, collaboration, resiliency, and a “lead from your seat” mentality.\n\nWith a complete skill set under your belt, you’ll position yourself as a versatile and highly sought-after candidate. And with personalized guidance every step of the way, you’ll gain practical skills and build your coding portfolio alongside a cohort of supportive peers.',
    reference: 'https://coruzant.com/profiles/nicolas-genest/',
  },
  {
    id: 'vision',
    title: 'Vision & Mission',
    blurb: 'AI-first delivery, human accountability on every release.',
    heading: 'AI-FIRST, HUMAN-BUILT',
    sub: 'Outwork the old way, and show the receipts',
    detail:
      'The mission is to put applied AI to work inside real delivery: agents carrying the repetitive load, engineers carrying the judgment, and attribution on every action either way. Innovation only counts here once it ships and holds in production.\n\nThe vision sits one step ahead of that. We build the practice before the market asks for it, so that when a technology becomes unavoidable our clients are already running it — not evaluating it.',
    tags: ['Applied AI', 'Agentic Delivery', 'Human Judgment', 'Attribution', 'Production-Proven'],
    close: 'We build AI-Native teams and software that outworks the old way.',
  },
];

function Studio() {
  const [active, setActive] = React.useState(ABOUT[0]);
  React.useEffect(() => {
    const apply = () => {
      const m = /^#about-(team|history|vision)$/.exec(location.hash);
      if (!m) return;
      const found = ABOUT.filter((a) => a.id === m[1])[0];
      if (!found) return;
      setActive(found);
      const el = document.getElementById('codeboxx');
      if (el)
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.pageYOffset - 80,
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
      role="About Us"
      name="CodeBoxx: Digital Transformation Has a Name"
      lede="Since 2018, CodeBoxx has been the guiding force helping companies adapt to an ever-evolving digital world. As experts in AI agent integration, we are committed to providing native AI solutions tailored to your needs."
      left={
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {ABOUT.map((a, i) => (
            <div
              key={a.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                alignItems: 'flex-start',
                padding: '20px 0',
                boxShadow: i === 0 ? 'none' : 'inset 0 1px 0 0 var(--ui-slate-200)',
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  color: active.id === a.id ? 'var(--blue-500)' : 'var(--ui-slate-900)',
                }}
              >
                {a.title}
              </span>
              <span className="pbody">{a.blurb}</span>
              <Button
                size="sm"
                variant={active.id === a.id ? 'primary' : 'secondary'}
                onClick={() => setActive(a)}
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
            </div>
          ))}
        </div>
      }
    >
      <ServiceDetail s={active} />
    </DivisionBand>
  );
}

const CLIENT_QUOTES = [
  {
    quote:
      'Solutions took over our cluster mid-quarter. Deploys went from a Thursday-night ritual to a 2.4s canary promotion nobody has to watch.',
    name: 'Marc Lavoie',
    role: 'VP Engineering, Northline Freight',
  },
  {
    quote:
      'The console is the status report. Our board reads the same release log our engineers do, with the actor and SHA on every line.',
    name: 'Priya Raman',
    role: 'CTO, Meridian Health',
  },
  {
    quote:
      'Twelve weeks from signature to a production cut, then a clean handoff of the runbook to our internal team.',
    name: 'Daniel Okafor',
    role: 'Director of Platform, Cassel Bank',
  },
];

const SERVICES = [
  {
    id: 'cto',
    title: 'Fractional CTO',
    blurb: 'Strategic technology leadership on demand to scale products and teams.',
    detail:
      'A digital transformation can seem daunting and costly for any company. A fractional CTO can be a trusted resource for a reassuring and well-orchestrated transition.\n\nCodeBoxx offers resources from experience in all markets that have faced the same challenges as you. Contact us and discover how CodeBoxx can support you at this pivotal moment.',
    heading: 'TRUST, EXPERIENCE, COMMITMENT',
    sub: 'The confidence of experience',
    tags: [
      'Digital Transformation',
      'Technology Strategy',
      'Team Structure',
      'Vendor Selection',
      'Executive Advisory',
    ],
    close:
      'We understand the challenges of every digital transformation because we have been through it ourselves. Every scenario is different, but with our team, one thing is certain: success.\n\nIn a chain, each link must be stronger than the next one, and that is where our Fractional CTOs come into their own. Through your trust, our experience, and our commitment',
  },
  {
    id: 'agentic',
    title: 'Agentic AI',
    blurb: 'Design and deploy autonomous AI agents to automate complex workflows.',
    detail:
      'Customer service and response speed are the Achilles heel of the customer experience. Like your competitors, you need to adapt at lightning speed.\n\nThe challenge for human resources is to find qualified and loyal employees, but not anymore. Train an AI agent tailored to your market and create a reliable ally, 24 hours a day.',
    heading: 'KNOWLEDGE, RELIABILITY, STABILITY',
    sub: 'Taking your service to the next level',
    tags: null,
    steps: [
      [
        'Audit Your Ecosystem',
        'We map the tools, channels and conversations already in place: where requests arrive, how they are handled today, and what a resolution actually costs you in time.',
      ],
      [
        'Give a Report of the Situation',
        'You receive a plain reading of what we found. Volumes, response times, the requests worth automating and the ones that should stay with a human.',
      ],
      [
        'Build a Plan and Stick to the Plan',
        'A scoped rollout with dates and measures. The agent is trained on your market, evaluated before release, and adjusted against the numbers we agreed on.',
      ],
    ],
    close:
      "Three non-negotiable qualities for delivering a customer experience worthy of the name. We understand that such a change can be stressful. That's why we support you throughout the process.",
  },
  {
    id: 'custom',
    title: 'Tailor-Made Softwares',
    blurb: 'Custom-built software designed to fit your workflows, goals, and growth.',
    detail:
      'There are many solutions on the market, each with its own strengths and weaknesses. However, the compromise is always on your side. Why not build THE solution as you see it in your ecosystem?',
    heading: 'INNOVATE, CREATE, ADAPT',
    sub: 'Building A Solution With You, Tailored to Your Needs',
    tags: null,
    logosTitle: 'Discover Our In-House Solutions Built to Facilitate Your Journeys',
    logos: ['Crewkit', 'Optigo', 'Catalog Crafter', 'Soumigo'],
    close:
      "A company's journey is intertwined with crucial decisions such as digital transformation. There are two choices: follow the crowd or take the lead in your market.",
    closeAfter:
      'CodeBoxx is the ideal partner to support the second choice. Our AI-First approach offers velocity to the growth of your technological infrastructure.',
  },
  {
    id: 'daas',
    title: 'Developer as a Service',
    blurb: 'On-demand developers to accelerate projects, scale teams, and deliver faster.',
    detail:
      "Hiring, onboarding, and managing in-house developers in today's competitive market can be time consuming and costly. Embrace the future with Development as a Service (DaaS) – the ultimate solution for businesses seeking seamless, tailor-made software solutions without the hassle and costs of managing internal resources.",
    heading: 'SCALE, SHIFT, ADAPT',
    sub: 'Scale Your Dev Team Up or Down with Ease.',
    tags: [
      'No Hiring Overhead',
      'One Developer or a Full Team',
      'Matched to Your Stack',
      'Scale Up or Down',
      'On Time, On Budget',
    ],
    close:
      'Welcome to a world where seamless software development meets unparalleled convenience. Our Developer as a Service (DaaS) offering is designed to revolutionize the way you build and maintain software solutions. This hassle-free approach that allows you to focus on your core business operations while we expertly handle the intricacies of your software development needs.\n\nWhether you need a single developer resource or an entire development team, our diverse and highly skilled technologists are meticulously selected to match your needs and complement your existing resources, delivering top-notch software solutions on time and within budget.',
  },
];

const LOGO_LINKS = {
  Crewkit: 'https://crewkit.io/',
  Optigo: 'https://optigo.ca/',
  'Catalog Crafter': 'https://www.catalogcrafter.com/',
  Soumigo: 'https://soumigo.com/',
};

function ServiceDetail({ s }) {
  return (
    <div className="panel" style={{ gap: 20, position: 'sticky', top: 104 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
        <span
          style={{
            width: 'fit-content',
            borderRadius: 9999,
            background: 'var(--steel-500)',
            marginBottom: 10,
            padding: '6px 14px',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            color: 'var(--neutral-0)',
            whiteSpace: 'nowrap',
          }}
        >
          {s.title}
        </span>
        <h3
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 700,
            lineHeight: '110%',
            letterSpacing: '0.5px',
          }}
        >
          {s.heading}
        </h3>
        <h4
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '100%',
            color: 'var(--ui-slate-500)',
          }}
        >
          {s.sub}
        </h4>
      </div>
      <div className="rule" />
      {s.detail.split('\n\n').map((p, i) => (
        <p key={i} className="pbody">
          {p}
        </p>
      ))}
      {s.people ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {s.people.map(([n, r, url], i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                alignItems: 'flex-start',
              }}
            >
              <div style={{ width: '100%', aspectRatio: '3 / 4' }}>
                <image-slot
                  id={'team-' + i}
                  mask="polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)"
                  fit="cover"
                  placeholder="Headshot"
                  style={{ width: '100%', height: '100%' }}
                ></image-slot>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{n}</span>
                <span style={{ fontSize: 12, color: 'var(--ui-slate-500)' }}>{r}</span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  LinkedIn
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {s.tags ? (
        <React.Fragment>
          <div className="rule" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {s.tags.map((t) => (
              <Badge key={t} variant="default">
                {t}
              </Badge>
            ))}
          </div>
        </React.Fragment>
      ) : null}
      <div className="rule" />
      {s.subhead ? (
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, lineHeight: '100%' }}>
          {s.subhead}
        </h3>
      ) : null}
      {s.close.split('\n\n').map((p, i) => (
        <p key={i} className="pbody">
          {p}
        </p>
      ))}
      {s.reference ? (
        <p className="pbody" style={{ fontSize: 12 }}>
          &mdash;Reference{' '}
          <a href={s.reference} target="_blank" rel="noopener noreferrer">
            {s.reference}
          </a>
        </p>
      ) : null}
      {s.logos ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, lineHeight: '130%' }}>
            {s.logosTitle}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {s.logos.map((n) => (
              <div
                key={n}
                style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}
              >
                <image-slot
                  id={'logo-' + n.toLowerCase().replace(/\s+/g, '-')}
                  shape="rounded"
                  radius="8"
                  fit="contain"
                  placeholder={n}
                  style={{ width: '100%', height: 64, '--slot-frame-bg': 'transparent' }}
                ></image-slot>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    color: 'var(--ui-slate-400)',
                  }}
                >
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 4 }}>
          {s.steps.map(([t, b], i) => (
            <div key={t} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span
                style={{
                  flex: '0 0 auto',
                  width: 28,
                  height: 28,
                  borderRadius: 9999,
                  background: 'var(--blue-500)',
                  color: 'var(--neutral-0)',
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {i + 1}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{t}</span>
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
  const [active, setActive] = React.useState(SERVICES[0]);
  return (
    <DivisionBand
      id="solutions"
      index="04"
      role="Innovate, Create, Adapt"
      name="The Age of Vibe Coding"
      aside={
        <div
          style={{
            flex: '0 0 148px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <img
            src="/assets/award-2025-retailtech.png"
            alt="RetailTech Breakthrough Award 2025 — CodeBoxx for GoodwillFinds' GEM Chatbot, Chatbot Solution of the Year"
            style={{ width: 148, height: 'auto', display: 'block' }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              lineHeight: '16px',
              textAlign: 'center',
              color: 'var(--ui-slate-500)',
              textWrap: 'pretty',
            }}
          >
            We were awarded Best AI Chatbot from over a 1000 entries
          </span>
        </div>
      }
      after={
        <React.Fragment>
          <ClientSlider />
          <Testimonials eyebrow="Client Testimonials" items={CLIENT_QUOTES} />
        </React.Fragment>
      }
      lede={null}
      intro={
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            marginTop: -16,
            marginBottom: 40,
            maxWidth: 720,
          }}
        >
          <p className="lede" style={{ maxWidth: 'none' }}>
            In the past, young people learned how to speak the language of computers by following
            strict rules and writing precise instructions. That era is fading.
          </p>
          <p className="lede" style={{ maxWidth: 'none' }}>
            With the rise of generative AI, technologists are no longer just coders—they design
            systems that can learn, adapt, and respond. This shift has given rise to vibe coding, a
            skill that blends clear intent, logic, creativity, and human intuition. As intelligent
            machines become more common, this way of working is becoming an essential skill for the
            next generation.
          </p>
        </div>
      }
      left={
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {SERVICES.map((s, i) => (
            <div
              key={s.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                alignItems: 'flex-start',
                padding: '20px 0',
                boxShadow: i === 0 ? 'none' : 'inset 0 1px 0 0 var(--ui-slate-200)',
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  color: active.id === s.id ? 'var(--blue-500)' : 'var(--ui-slate-900)',
                }}
              >
                {s.title}
              </span>
              <span className="pbody">{s.blurb}</span>
              <Button
                size="sm"
                variant={active.id === s.id ? 'primary' : 'secondary'}
                onClick={() => setActive(s)}
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
            </div>
          ))}
        </div>
      }
    >
      <ServiceDetail s={active} />
    </DivisionBand>
  );
}

const COHORT = [
  [
    'Weeks 1–4',
    'Fundamentals',
    'Typed languages, version control, testing. Assessed on merged pull requests.',
  ],
  ['Weeks 5–8', 'Systems', 'APIs, data stores, containers. First deploy to a shared cluster.'],
  [
    'Weeks 9–12',
    'Live Build',
    'Placement inside a client pod. Shipped work, reviewed by a delivery lead.',
  ],
];

const GRAD_QUOTES = [
  {
    quote:
      'I merged my first pull request in week two and deployed to a shared cluster in week six. Nothing was a simulation.',
    name: 'Ariane Bouchard',
    role: 'Cohort 21 — Junior Engineer, CodeBoxx',
  },
  {
    quote:
      'Weeks nine to twelve put me inside a client pod. The review standard was the same one the senior engineers were held to.',
    name: 'Tomás Herrera',
    role: 'Cohort 19 — Platform Engineer, Meridian Health',
  },
  {
    quote:
      'No degree, an entrance assessment and twelve weeks. I was hired into the pod I trained in.',
    name: 'Naomi Fields',
    role: 'Cohort 23 — Software Engineer, Northline Freight',
  },
];

const INTAKES = {
  fsd: [
    ['Sep 14, 2026', 'Quebec City', 'Open'],
    ['Oct 26, 2026', 'Montreal', 'Open'],
    ['Jan 11, 2027', 'Remote', 'Waitlist'],
    ['Mar 22, 2027', 'Quebec City', 'Planned'],
  ],
  aidev: [
    ['Sep 28, 2026', 'Remote', 'Open'],
    ['Nov 16, 2026', 'Montreal', 'Waitlist'],
    ['Feb 08, 2027', 'Remote', 'Planned'],
    ['Apr 19, 2027', 'Quebec City', 'Planned'],
  ],
};

function CalendarColumn({ title, meta, rows }) {
  const tone = {
    Open: 'var(--blue-500)',
    Waitlist: 'var(--yellow-500)',
    Planned: 'rgba(255,255,255,0.4)',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          paddingBottom: 20,
          boxShadow: 'inset 0 -1px 0 0 rgba(255,255,255,0.16)',
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            color: 'var(--neutral-0)',
          }}
        >
          {title}
        </span>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.56)' }}>
          {meta}
        </span>
      </div>
      {rows.map(([date, place, status]) => (
        <div
          key={date}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <span
              style={{ fontSize: 16, fontWeight: 600, color: 'var(--neutral-0)', minWidth: 128 }}
            >
              {date}
            </span>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.56)' }}>
              {place}
            </span>
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: tone[status],
            }}
          >
            {status}
          </span>
        </div>
      ))}
    </div>
  );
}

function IntakeCalendar() {
  return (
    <div
      id="intake"
      style={{
        scrollMarginTop: 96,
        marginTop: 64,
        background: 'var(--navy-500)',
        borderRadius: 16,
        padding: 48,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 32,
          flexWrap: 'wrap',
          marginBottom: 40,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: 'var(--blue-500)',
            }}
          >
            Intake Calendar
          </span>
          <span
            style={{ fontSize: 28, fontWeight: 700, lineHeight: '100%', color: 'var(--neutral-0)' }}
          >
            Two programs. Eight cohorts.
          </span>
        </div>
        <Badge variant="brand">Editable in Sanity</Badge>
      </div>
      <div className="grid2" style={{ gap: 64 }}>
        <CalendarColumn title="AI-Native FSD" meta="12 weeks, full time" rows={INTAKES.fsd} />
        <CalendarColumn
          title="Advanced AI-Developer"
          meta="8 weeks, part time"
          rows={INTAKES.aidev}
        />
      </div>
    </div>
  );
}

const ACADEMY_TOPICS = [
  [
    '12 weeks, full time',
    'Cohorts start monthly. No prior degree required, entrance assessment only.',
    'Twelve weeks, five days a week. The entrance assessment measures aptitude, not credentials, and the calendar below sets the intakes.',
  ],
  [
    'Our Courses\nPrograms that fit your journey.',
    'We know a thing or two about crazy schedules. That’s why we’ve designed our programs to fit various needs and commitment levels.\n\nWhether you want an immersive training experience from your couch or our classroom in St. Pete, Florida, you can transform your life from just about anywhere – without losing the community, collaboration, and personal support usually only available in a classroom.',
    'No sandbox curriculum. Students work in the same repositories, clusters and consoles the delivery pods use, under the same review standard.',
    [
      [
        'Online & On-site',
        'AI Native Full-Stack Developer',
        'Gaining the Skills to Break into Tech Has Never Been Easier.',
        'enroll',
      ],
      [
        'Online & On-site',
        'Advanced AI Developer',
        'Gaining the Skills to Break into Tech Has Never Been Easier.',
        'enroll',
      ],
      [
        'CodeBoxx for Businesses',
        'Tailor-Made for Enterprises Training',
        'Gaining the Skills to Break into Tech Has Never Been Easier.',
        'contact',
      ],
    ],
    'Courses',
  ],
  [
    'Meet Your Team',
    'Placement is the exit criterion, not a job board.',
    'Your instructors at CodeBoxx are experienced, passionate professionals that are driven to teach and help you succeed. Beyond a textbook, they bring real-world experience and expertise to the classroom, providing you with valuable guidance and mentorship that\u2019s relevant to what hiring organizations are looking for in their software development and AI candidates.',
    null,
    'Academy Team',
    [
      [
        'Etienne Gonthier-Lapointe',
        'Coach',
        'https://www.linkedin.com/in/etienne-lapointe-b82b101bb/',
      ],
      ['Raina DeJute', 'Student Success Coordinator', 'https://www.linkedin.com/in/rainadejute/'],
      ['Brian Peret', 'Academy Director', 'https://www.linkedin.com/in/brian-peret-b62636101/'],
      [
        'Francis Patry-Jessop',
        'Director of Coaching',
        'https://www.linkedin.com/in/francis-patry-jessop-b1794b241/',
      ],
    ],
  ],
];

function Academy({ onEnroll }) {
  const [active, setActive] = React.useState(0);
  return (
    <DivisionBand
      alt
      id="academy"
      index="05"
      role="The Talent Pipeline"
      name="AI-Enabled Coding Education for Next-Gen Technologists"
      after={
        <React.Fragment>
          <IntakeCalendar />
          <Testimonials eyebrow="Graduate Testimonials" items={GRAD_QUOTES} />
        </React.Fragment>
      }
      lede="A 12-week program that ends inside a real pod. Graduates carry the same tooling and the same review standard as the studio."
      intro={
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            marginTop: -16,
            marginBottom: 40,
            maxWidth: 720,
          }}
        >
          <p className="lede" style={{ maxWidth: 'none' }}>
            Wherever you come from, AI has the power to jumpstart your career as a developer. You
            need a fully committed partner moving at the speed of innovation. Find a partner for
            life with CodeBoxx.
          </p>
        </div>
      }
      left={
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {ACADEMY_TOPICS.map(([t, b], i) => (
            <div
              key={t}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                alignItems: 'flex-start',
                padding: '20px 0',
                boxShadow: i === 0 ? 'none' : 'inset 0 1px 0 0 var(--ui-slate-200)',
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: active === i ? 'var(--blue-500)' : 'var(--ui-slate-900)',
                }}
              >
                {t.split('\n').map((l, k) => (
                  <span key={k} style={{ display: 'block' }}>
                    {l}
                  </span>
                ))}
              </span>
              <span className="pbody">
                {b.split('\n\n').map((p, k) => (
                  <span key={k} style={{ display: 'block', marginTop: k ? 12 : 0 }}>
                    {p}
                  </span>
                ))}
              </span>
              <Button
                size="sm"
                variant={active === i ? 'primary' : 'secondary'}
                onClick={() => setActive(i)}
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
            </div>
          ))}
        </div>
      }
    >
      <div className="panel" style={{ gap: 20, position: 'sticky', top: 104 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span
            style={{
              width: 'fit-content',
              borderRadius: 9999,
              background: 'var(--steel-500)',
              marginBottom: 10,
              padding: '6px 14px',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              color: 'var(--neutral-0)',
              whiteSpace: 'nowrap',
            }}
          >
            {ACADEMY_TOPICS[active][4] || 'Cohort Structure'}
          </span>
          <Badge variant="brand">Next intake: Sept 2026</Badge>
        </div>
        <p className="pbody">{ACADEMY_TOPICS[active][2]}</p>
        <div className="rule" />
        {ACADEMY_TOPICS[active][5] ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {ACADEMY_TOPICS[active][5].map(([n, r, url], i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ width: '100%', aspectRatio: '3 / 4', filter: 'grayscale(1)' }}>
                  <image-slot
                    id={'academy-team-' + i}
                    mask="polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)"
                    fit="cover"
                    placeholder="Headshot"
                    style={{ width: '100%', height: '100%' }}
                  ></image-slot>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{n}</span>
                  <span style={{ fontSize: 12, color: 'var(--ui-slate-500)' }}>{r}</span>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                    }}
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {(ACADEMY_TOPICS[active][3] || (ACADEMY_TOPICS[active][5] ? [] : COHORT)).map(
          ([w, t, b, cta], i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                alignItems: 'flex-start',
                paddingTop: i === 0 ? 0 : 20,
                boxShadow: i === 0 ? 'none' : 'inset 0 1px 0 0 var(--ui-slate-200)',
              }}
            >
              <span className="eyebrow">{w}</span>
              <span style={{ fontSize: 16, fontWeight: 700 }}>{t}</span>
              <span className="pbody">{b}</span>
              {cta === 'enroll' ? (
                <Button size="sm" onClick={() => onEnroll(t)} style={{ marginTop: 4 }}>
                  Enroll Now
                </Button>
              ) : null}
              {cta === 'contact' ? (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    location.hash = '#contact';
                  }}
                  style={{ marginTop: 4 }}
                >
                  Contact Us
                </Button>
              ) : null}
            </div>
          )
        )}
      </div>
    </DivisionBand>
  );
}

const METRICS = [
  [
    '78%',
    'Business Adoption',
    'Nearly four out of five organizations now use AI in some capacity across their operations',
  ],
  [
    '40%',
    'Job Impact',
    'International labor projections show AI will transform nearly two-fifths of jobs worldwide rather than just eliminate them',
  ],
  [
    '86%',
    'Budget Growth',
    'The vast majority of corporate enterprises plan to spend more money on artificial intelligence development',
  ],
  [
    '40%',
    'Productivity Boost',
    'Workers utilizing generative AI tools experience substantial jumps in daily efficiency',
  ],
];

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
  return (
    <section style={{ background: 'var(--navy-500)' }} className="sect">
      <div className="wrap">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
          <ScriptTitle index="06" dark>
            The AI in 2026
          </ScriptTitle>
          <h2 className="h2" style={{ color: 'var(--neutral-0)' }}>
            Adoption is no longer the question. Pace is.
          </h2>
        </div>
        <div className="grid4">
          {METRICS.map(([n, t, l]) => (
            <div key={t} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span
                style={{
                  fontSize: 48,
                  fontWeight: 900,
                  lineHeight: '100%',
                  color: 'var(--blue-500)',
                }}
              >
                <CountUp value={n} />
              </span>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  lineHeight: '100%',
                  color: 'var(--neutral-0)',
                }}
              >
                {t}
              </span>
              <span style={{ fontSize: 14, lineHeight: '20px', color: 'rgba(255,255,255,0.72)' }}>
                {l}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ onEnroll }) {
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
    <section
      id="contact"
      style={{ background: 'var(--neutral-0)', boxShadow: 'inset 0 1px 0 0 var(--ui-slate-200)' }}
      className="sect"
    >
      <div className="wrap grid2" style={{ alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ScriptTitle index="07">LEARN MORE</ScriptTitle>
          <h2 className="h2">One form for all three divisions.</h2>
          <p className="lede">
            Please specify the department you would like to contact. We will respond as soon as
            possible.
          </p>
          <p className="lede">
            Do you need a team of developers to carry out a project or improve an existing one?
            Would you like to learn more about the CodeBoxx Academy? Do you have a project and are
            looking for a venture-style partner? Contact us.
          </p>
          <div className="rule" style={{ margin: '8px 0' }} />
          <h2 className="h2">You want to Enroll the Academy?</h2>
          <p className="lede">
            Skip the form. Pick the program you want and apply directly. Applications are reviewed
            within one business day.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button onClick={() => onEnroll('Advanced AI Developer')}>
              Enroll Now to AI Course
            </Button>
            <Button variant="secondary" onClick={() => onEnroll('AI Native Full-Stack Developer')}>
              Enroll Now to FSD
            </Button>
          </div>
        </div>
        <div className="panel">
          <h2 className="h2" style={{ marginBottom: 4 }}>
            Need more info, contact us.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              CodeBoxx's Division you want to reach
            </span>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {DIVISIONS.map((d) => (
                <Checkbox
                  key={d.id}
                  checked={division === d.id}
                  onChange={() => setDivision(d.id)}
                  label={d.name.replace('CodeBoxx ', '')}
                />
              ))}
              <Checkbox
                checked={division === 'ventures'}
                onChange={() => setDivision('ventures')}
                label="Ventures"
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input
              id="first"
              label="First Name"
              placeholder="First"
              style={{ width: '100%' }}
              value={f.first}
              onChange={set('first')}
            />
            <Input
              id="last"
              label="Last Name"
              placeholder="Last"
              style={{ width: '100%' }}
              value={f.last}
              onChange={set('last')}
            />
          </div>
          <Input
            id="email"
            label="Email"
            placeholder="name@company.com"
            style={{ width: '100%' }}
            value={f.email}
            state={invalid ? 'error' : 'default'}
            helperText="Invalid address. Missing domain."
            onChange={set('email')}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input
              id="country"
              label="Country"
              placeholder="Canada"
              style={{ width: '100%' }}
              value={f.country}
              onChange={set('country')}
            />
            <Input
              id="phone"
              label="Phone"
              placeholder="+1 555 000 0000"
              style={{ width: '100%' }}
              value={f.phone}
              onChange={set('phone')}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Is it a mobile phone?</span>
            <div style={{ display: 'flex', gap: 10 }}>
              <Checkbox checked={mobile === 'yes'} onChange={() => setMobile('yes')} label="Yes" />
              <Checkbox checked={mobile === 'no'} onChange={() => setMobile('no')} label="No" />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Select your preferred language.</span>
            <div style={{ display: 'flex', gap: 10 }}>
              <Checkbox checked={lang === 'en'} onChange={() => setLang('en')} label="English" />
              <Checkbox checked={lang === 'fr'} onChange={() => setLang('fr')} label="French" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Checkbox checked={consent} onChange={setConsent} label="" />
            <span style={{ fontSize: 11, lineHeight: '16px', color: 'var(--ui-slate-500)' }}>
              By submitting this form, you agree that we may call, text, and email you additional
              information on CodeBoxx programs. You understand that you can unsubscribe at any time
              including by emailing your request to{' '}
              <a href="mailto:info@codeboxx.biz">info@codeboxx.biz</a>. Message and data rates may
              apply. <a href="#contact">View our complete Privacy Policy</a> for further detail.
            </span>
          </div>
          <div className="rule" />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: sent ? 'var(--green-600)' : 'var(--ui-slate-400)',
              }}
            >
              {sent
                ? 'Brief received. Reply within 1 business day.'
                : 'No sales sequence. One reply from a human.'}
            </span>
            <Button size="lg" disabled={!ready} onClick={() => setSent(true)}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

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
const COUNTRIES = [
  'United States',
  'Canada',
  'Mexico',
  'France',
  'United Kingdom',
  'Belgium',
  'Switzerland',
  'Germany',
  'Spain',
  'Brazil',
  'Nigeria',
  'India',
  'Australia',
  'Other',
];
const HEARD_ABOUT = [
  'Google / Search Engine',
  'TV',
  'Radio Ads',
  'Spotify',
  'SkillPointe',
  'Facebook',
  'Instagram',
  'LinkedIn',
  'Youtube',
  'TikTok',
  'Barbershop Book Club',
  'Empact Solutions',
  'Referred By a Friend',
];
const ENROLL_TITLES = { fsd: 'AI Native Full-Stack Developer', ai: 'Advanced AI Developer' };

const fieldLabel = {
  fontSize: 13,
  fontWeight: 600,
  lineHeight: '100%',
  color: 'var(--ui-slate-900)',
};
const selectStyle = {
  width: '100%',
  height: 40,
  borderRadius: 8,
  border: 'none',
  boxShadow: 'inset 0 0 0 1px var(--ui-slate-300)',
  background: 'var(--neutral-0)',
  padding: '0 12px',
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  color: 'var(--ui-slate-900)',
  appearance: 'none',
};

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={fieldLabel}>{label}</span>
      {children}
    </div>
  );
}

function RadioRow({ label, options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={fieldLabel}>{label}</span>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {options.map((o) => (
          <Checkbox key={o} checked={value === o} onChange={() => onChange(o)} label={o} />
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
  const [form, setForm] = React.useState(ENROLL_BLANK);
  const [mobile, setMobile] = React.useState('Yes');
  const [lang, setLang] = React.useState('English');
  const [contactBy, setContactBy] = React.useState('Email');
  const [heard, setHeard] = React.useState('');
  const [sent, setSent] = React.useState(false);
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
  const [render, setRender] = React.useState(course);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    if (course) {
      setRender(course);
      setSent(false);
      const r = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(r);
    }
    setShown(false);
    const t = setTimeout(() => setRender(null), 880);
    return () => clearTimeout(t);
  }, [course]);
  if (!render) return null;
  const title = /full-?stack|fsd/i.test(render) ? ENROLL_TITLES.fsd : ENROLL_TITLES.ai;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
        background: shown ? 'rgba(0,47,67,0.32)' : 'rgba(0,47,67,0)',
        transition: 'background 800ms cubic-bezier(0.16,1,0.3,1)',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 460,
          maxWidth: '100%',
          height: '100%',
          background: 'var(--neutral-0)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transform: shown ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 860ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div
          style={{
            flex: '0 0 auto',
            background: 'var(--neutral-0)',
            padding: 24,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
            boxShadow: 'inset 0 -1px 0 0 var(--ui-slate-200)',
          }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}
          >
            <span
              style={{
                borderRadius: 9999,
                background: 'var(--steel-500)',
                marginBottom: 10,
                padding: '6px 14px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                color: 'var(--neutral-0)',
              }}
            >
              Enroll
            </span>
            <h3 className="ptitle">{title}</h3>
          </div>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <h3 className="ptitle">Create Your Student Portal Account.</h3>
          <p className="pbody">
            If you already have a student portal account please{' '}
            <a href="https://student.codeboxx.com/pages/login.php" target="_blank" rel="noopener">
              log in
            </a>{' '}
            to make your course selection.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input
              id="enroll-first"
              label="First Name"
              placeholder="First"
              style={{ width: '100%' }}
              value={form.first}
              onChange={set('first')}
            />
            <Input
              id="enroll-last"
              label="Last Name"
              placeholder="Last"
              style={{ width: '100%' }}
              value={form.last}
              onChange={set('last')}
            />
          </div>
          <Field label="Birthdate">
            <input
              id="enroll-birth"
              type="date"
              aria-label="Birthdate"
              style={selectStyle}
              value={form.birth}
              onChange={set('birth')}
            />
          </Field>
          <Input
            id="enroll-email"
            label="Email"
            placeholder="name@company.com"
            style={{ width: '100%' }}
            value={form.email}
            state={invalid ? 'error' : 'default'}
            helperText="Invalid address. Missing domain."
            onChange={set('email')}
          />
          <Field label="Phone">
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8 }}>
              <select
                aria-label="Country code"
                style={selectStyle}
                value={form.dial}
                onChange={set('dial')}
              >
                {DIAL_CODES.map(([c, n]) => (
                  <option key={c} value={c}>
                    {c} {n}
                  </option>
                ))}
              </select>
              <input
                id="enroll-phone"
                aria-label="Phone number"
                placeholder="555 000 0000"
                style={selectStyle}
                value={form.phone}
                onChange={set('phone')}
              />
            </div>
          </Field>
          <RadioRow
            label="Is it a mobile phone?"
            options={['Yes', 'No']}
            value={mobile}
            onChange={setMobile}
          />
          <RadioRow
            label="Preferred Language"
            options={['English', 'French']}
            value={lang}
            onChange={setLang}
          />
          <RadioRow
            label="Preferred Communication Method"
            options={['Phone', 'SMS', 'Email']}
            value={contactBy}
            onChange={setContactBy}
          />
          <Input
            id="enroll-street"
            label="Civic Number and Street"
            placeholder="1200 Central Ave"
            style={{ width: '100%' }}
            value={form.street}
            onChange={set('street')}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input
              id="enroll-city"
              label="City"
              placeholder="St. Petersburg"
              style={{ width: '100%' }}
              value={form.city}
              onChange={set('city')}
            />
            <Input
              id="enroll-region"
              label="State / Province"
              placeholder="Florida"
              style={{ width: '100%' }}
              value={form.region}
              onChange={set('region')}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Country">
              <select
                aria-label="Country"
                style={selectStyle}
                value={form.country}
                onChange={set('country')}
              >
                <option value="">Select</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Input
              id="enroll-postal"
              label="Postal Code / Zip Code"
              placeholder="33705"
              style={{ width: '100%' }}
              value={form.postal}
              onChange={set('postal')}
            />
          </div>
          <Field label="How did you hear about us?">
            <select
              aria-label="How did you hear about us?"
              style={selectStyle}
              value={heard}
              onChange={(e) => setHeard(e.target.value)}
            >
              <option value="">Select</option>
              {HEARD_ABOUT.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <p className="pbody">
            Applications are reviewed within one business day. The entrance assessment is scheduled
            by email.
          </p>
          <div className="rule" />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: sent ? 'var(--green-600)' : 'var(--ui-slate-400)',
              }}
            >
              {sent ? 'Application received.' : 'Submits to the admissions API.'}
            </span>
            <Button size="lg" disabled={!ready} onClick={() => setSent(true)}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WSJTeaser() {
  return (
    <section style={{ background: 'var(--navy-500)', padding: '80px 0' }}>
      <div
        className="wrap"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 900,
          marginInline: 'auto',
        }}
      >
        <image-slot
          id="wsj-logo"
          shape="rect"
          fit="contain"
          placeholder="Wall Street Journal logo"
          style={{
            width: 320,
            height: 88,
            '--slot-frame-bg': 'transparent',
            color: 'var(--neutral-0)',
          }}
        ></image-slot>
        <h2
          style={{
            margin: 0,
            fontSize: 32,
            fontWeight: 700,
            lineHeight: '110%',
            color: 'var(--neutral-0)',
            textWrap: 'pretty',
          }}
        >
          How Five Americans Made It to the Middle Class
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: '20px',
            color: 'rgba(255,255,255,0.72)',
            maxWidth: 640,
          }}
        >
          We are proud to be part of this success story, as featured in the Wall Street Journal. Tim
          Weaver is highlighted in this truly fascinating article. Congratulations,
          Tim&mdash;CodeBoxx for life.
        </p>
        <Button
          onClick={() =>
            window.open(
              'https://www.wsj.com/lifestyle/careers/how-five-americans-made-it-to-the-middle-class-e9649f8b',
              '_blank',
              'noopener'
            )
          }
        >
          Read the Article
        </Button>
      </div>
    </section>
  );
}

// Latest three from the CodeBlog. Same source as blog.jsx — replaced by the Sanity `post` document type at runtime.
const LATEST_POSTS = [
  {
    title: 'Best Corporate AI Bootcamps',
    category: 'Technology News',
    date: '2026-01-14',
    excerpt:
      'Corporate AI training has become one of the fastest-growing investments in workforce development. Most organizations still struggle to find programs that go beyond awareness.',
    url: 'https://academy.codeboxx.com/post/best-corporate-ai-bootcamps',
  },
  {
    title: 'Unlock your own Future: Join CodeBoxx\u2019s 4-Day Vibe Coding and Agentic AI Workshop',
    category: 'Workshop',
    date: '2025-12-01',
    excerpt:
      'Four days, virtual or in the St. Petersburg classroom, ending with a product of yours in production or in your portfolio.',
    url: 'https://academy.codeboxx.com/post/unlock-your-own-future-join-codeboxx-s-4-day-vibe-coding-and-agentic-ai-workshop',
  },
  {
    title: 'CodeBoxx Academy Expands Pathways to Prosperity Through New Community Referral Program',
    category: 'CodeBoxx for Life',
    date: '2025-11-18',
    excerpt:
      'A referral partner program that lets individuals, businesses and organizations across Tampa Bay connect motivated learners to the Academy.',
    url: 'https://academy.codeboxx.com/post/codeboxx-academy-expands-pathways-to-prosperity-through-new-community-referral-program',
  },
];

function fmtPostDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function CodeBlog() {
  return (
    <section id="codeblog" className="sect" style={{ background: 'var(--steel-700)' }}>
      <div className="wrap">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          <ScriptTitle index="02" dark>
            CodeBlog
          </ScriptTitle>
          <h2 className="h2" style={{ color: 'var(--neutral-0)' }}>
            What we ship, we write down.
          </h2>
          <p className="lede" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Field notes from the studio and the Academy: what the agents took over, what the
            engineers kept, and what the results were. Written by the people who did the work.
          </p>
        </div>
        <div className="grid3">
          {LATEST_POSTS.map((p) => (
            <a
              key={p.url}
              href={p.url}
              target="_blank"
              rel="noopener"
              className="panel"
              style={{
                justifyContent: 'space-between',
                minHeight: 260,
                background: 'var(--neutral-0)',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Badge variant="brand">{p.category}</Badge>
                <h3 className="ptitle">{p.title}</h3>
                <p className="pbody">{p.excerpt}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="rule" />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    color: 'var(--ui-slate-400)',
                  }}
                >
                  {fmtPostDate(p.date)}
                </span>
              </div>
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <Button
            onClick={() => {
              window.location.href = '/blog';
            }}
          >
            See All Posts
          </Button>
        </div>
      </div>
    </section>
  );
}

function ForgeTeaser() {
  return (
    <section style={{ background: 'var(--navy-500)', padding: '80px 0' }}>
      <div
        className="wrap"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 900,
          marginInline: 'auto',
        }}
      >
        <image-slot
          id="forge20-product"
          shape="rect"
          fit="contain"
          placeholder="CodeBoxx w/ CrewKit Forge 20 appliance"
          style={{
            width: 210,
            height: 100,
            '--slot-frame-bg': 'transparent',
            color: 'var(--neutral-0)',
          }}
        ></image-slot>
        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: 'var(--blue-500)',
          }}
        >
          Lead. Think. Write. Run.
        </span>
        <h2
          style={{
            margin: 0,
            fontSize: 32,
            fontWeight: 700,
            lineHeight: '110%',
            color: 'var(--neutral-0)',
            textWrap: 'pretty',
          }}
        >
          CodeBoxx w/ CrewKit Forge 20
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: '20px',
            color: 'rgba(255,255,255,0.72)',
            maxWidth: 640,
          }}
        >
          Plan, build and run your software in one shell, two deployment paths. One executive
          chassis, five integrated touch surfaces, low-cost local computing by default and cloud
          escalation when warranted. Up to 20 heavy software workstreams in parallel: a complete
          end-to-end software development team in one appliance.
        </p>
        <div
          style={{
            display: 'flex',
            gap: 32,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 8,
          }}
        >
          {[
            ['Local Inference', 'Keep your foundational code, your software and your data close.'],
            ['Cost Control', 'Cut cloud dependency and unpredictable token-based pricing.'],
            ['Operator Model', 'CrewKit, operators and Academy training above the hardware.'],
          ].map(([t, d]) => (
            <div
              key={t}
              style={{
                flex: '1 1 220px',
                maxWidth: 260,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  lineHeight: '100%',
                  color: 'var(--neutral-0)',
                }}
              >
                {t}
              </span>
              <span style={{ fontSize: 14, lineHeight: '20px', color: 'rgba(255,255,255,0.6)' }}>
                {d}
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 8,
          }}
        >
          <Button
            onClick={() => window.open('https://buildorder.codeboxx.com/', '_blank', 'noopener')}
          >
            Build Your Own
          </Button>
          <Button
            variant="secondary"
            onClick={() => window.open('http://crewkit.io', '_blank', 'noopener')}
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [codi, setCodi] = React.useState(false);
  const [enroll, setEnroll] = React.useState(null);
  return (
    <div id="top">
      <TopBar onCodi={() => setCodi(true)} onEnroll={setEnroll} />
      <Hero
        backgroundImage="/assets/hero-bg.png"
        style={{
          width: '100%',
          height: 'auto',
          minHeight: 560,
          padding: '64px 48px',
          gap: 96,
          backgroundPosition: 'center bottom',
        }}
      >
        We build <span style={{ color: 'var(--blue-500)' }}>AI-Native</span> teams and software that
        outwork the old way.
      </Hero>
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
