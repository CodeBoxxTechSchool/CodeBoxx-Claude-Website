import React from 'react';
import { Button, Badge, Form, Offcanvas } from 'react-bootstrap';
import { TopBar, Footer } from '../components/Chrome';
import Avatar from '../components/Avatar';
import Logo from '../components/Logo';
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
  return (
    <Offcanvas show={open} onHide={onClose} placement="end" className="codi-offcanvas">
      <Offcanvas.Header className="site-header">
        <div className="d-flex align-items-center gap-3">
          <Avatar size="md" />
          <div className="d-flex flex-column gap-1">
            <span className="codi-name">Codi</span>
            <span className="codi-role">CodeBoxx AI Agent</span>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3">
          <Badge bg="success">Active</Badge>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column p-0">
        <div className="codi-log">
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
            placeholder="Ask Codi"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <Button onClick={send}>Send</Button>
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
      className="client-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="client-slider-head">
        <p className="eyebrow">Trusted By</p>
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
        {CLIENT_LOGOS.map((n, i) => (
          <div key={i} className="client-slide">
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
      role="About Us"
      name="CodeBoxx: Digital Transformation Has a Name"
      lede="Since 2018, CodeBoxx has been the guiding force helping companies adapt to an ever-evolving digital world. As experts in AI agent integration, we are committed to providing native AI solutions tailored to your needs."
      left={
        <div className="stacked-list">
          {ABOUT.map((a) => (
            <div key={a.id} className="stacked-item">
              <span className={'stacked-item-title' + (active.id === a.id ? ' active' : '')}>
                {a.title}
              </span>
              <span className="pbody">{a.blurb}</span>
              <ChevronButton active={active.id === a.id} onClick={() => setActive(a)} />
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
          {s.people.map(([n, r, url], i) => (
            <div key={i} className="person">
              <div className="person-photo">
                <image-slot
                  id={'team-' + i}
                  mask="polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)"
                  fit="cover"
                  placeholder="Headshot"
                  style={{ width: '100%', height: '100%' }}
                ></image-slot>
              </div>
              <div className="d-flex flex-column gap-1">
                <span className="person-name">{n}</span>
                <span className="person-role">{r}</span>
                <a href={url} target="_blank" rel="noopener noreferrer" className="link-tag">
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
          <div className="d-flex flex-wrap gap-2">
            {s.tags.map((t) => (
              <Badge key={t} bg="default">
                {t}
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
          &mdash;Reference{' '}
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
                  shape="rounded"
                  radius="8"
                  fit="contain"
                  placeholder={n}
                  style={{ width: '100%', height: 64, '--slot-frame-bg': 'transparent' }}
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
  const [active, setActive] = React.useState(SERVICES[0]);
  return (
    <DivisionBand
      id="solutions"
      index="04"
      role="Innovate, Create, Adapt"
      name="The Age of Vibe Coding"
      aside={
        <div className="d-flex flex-column gap-3 align-items-center award-block">
          <img
            src="/assets/award-2025-retailtech.png"
            alt="RetailTech Breakthrough Award 2025 — CodeBoxx for GoodwillFinds' GEM Chatbot, Chatbot Solution of the Year"
            className="award-img"
          />
          <span className="award-caption">
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
        <div className="d-flex flex-column gap-3 division-intro">
          <p className="lede lede-wide">
            In the past, young people learned how to speak the language of computers by following
            strict rules and writing precise instructions. That era is fading.
          </p>
          <p className="lede lede-wide">
            With the rise of generative AI, technologists are no longer just coders—they design
            systems that can learn, adapt, and respond. This shift has given rise to vibe coding, a
            skill that blends clear intent, logic, creativity, and human intuition. As intelligent
            machines become more common, this way of working is becoming an essential skill for the
            next generation.
          </p>
        </div>
      }
      left={
        <div className="stacked-list">
          {SERVICES.map((s) => (
            <div key={s.id} className="stacked-item">
              <span className={'stacked-item-title' + (active.id === s.id ? ' active' : '')}>
                {s.title}
              </span>
              <span className="pbody">{s.blurb}</span>
              <ChevronButton active={active.id === s.id} onClick={() => setActive(s)} />
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
  const tone = { Open: 'status-open', Waitlist: 'status-waitlist', Planned: 'status-planned' };
  return (
    <div className="calendar-col">
      <div className="calendar-col-head">
        <span className="calendar-col-title">{title}</span>
        <span className="calendar-col-meta">{meta}</span>
      </div>
      {rows.map(([date, place, status]) => (
        <div key={date} className="calendar-row">
          <div className="calendar-row-left">
            <span className="calendar-date">{date}</span>
            <span className="calendar-place">{place}</span>
          </div>
          <span className={'calendar-status ' + tone[status]}>{status}</span>
        </div>
      ))}
    </div>
  );
}

function IntakeCalendar() {
  return (
    <div id="intake" className="calendar-band">
      <div className="calendar-head">
        <div className="d-flex flex-column gap-3">
          <span className="calendar-eyebrow">Intake Calendar</span>
          <span className="calendar-title">Two programs. Eight cohorts.</span>
        </div>
        <Badge bg="brand">Editable in Sanity</Badge>
      </div>
      <div className="grid2 calendar-grid">
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
    'Your instructors at CodeBoxx are experienced, passionate professionals that are driven to teach and help you succeed. Beyond a textbook, they bring real-world experience and expertise to the classroom, providing you with valuable guidance and mentorship that’s relevant to what hiring organizations are looking for in their software development and AI candidates.',
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
        <div className="d-flex flex-column gap-3 division-intro">
          <p className="lede lede-wide">
            Wherever you come from, AI has the power to jumpstart your career as a developer. You
            need a fully committed partner moving at the speed of innovation. Find a partner for
            life with CodeBoxx.
          </p>
        </div>
      }
      left={
        <div className="stacked-list">
          {ACADEMY_TOPICS.map(([t, b], i) => (
            <div key={t} className="stacked-item">
              <span className={'stacked-item-title' + (active === i ? ' active' : '')}>
                {t.split('\n').map((l, k) => (
                  <span key={k} className="line-block">
                    {l}
                  </span>
                ))}
              </span>
              <span className="pbody">
                {b.split('\n\n').map((p, k) => (
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
          <span className="kicker">{ACADEMY_TOPICS[active][4] || 'Cohort Structure'}</span>
          <Badge bg="brand">Next intake: Sept 2026</Badge>
        </div>
        <p className="pbody">{ACADEMY_TOPICS[active][2]}</p>
        <div className="rule" />
        {ACADEMY_TOPICS[active][5] ? (
          <div className="people-grid people-grid-4">
            {ACADEMY_TOPICS[active][5].map(([n, r, url], i) => (
              <div key={i} className="person">
                <div className="person-photo person-photo-gray">
                  <image-slot
                    id={'academy-team-' + i}
                    mask="polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)"
                    fit="cover"
                    placeholder="Headshot"
                    style={{ width: '100%', height: '100%' }}
                  ></image-slot>
                </div>
                <div className="d-flex flex-column gap-1">
                  <span className="person-name">{n}</span>
                  <span className="person-role">{r}</span>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="link-tag">
                    LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {(ACADEMY_TOPICS[active][3] || (ACADEMY_TOPICS[active][5] ? [] : COHORT)).map(
          ([w, t, b, cta], i) => (
            <div key={i} className="stacked-item">
              <span className="eyebrow">{w}</span>
              <span className="cohort-title">{t}</span>
              <span className="pbody">{b}</span>
              {cta === 'enroll' ? (
                <Button size="sm" className="mt-1" onClick={() => onEnroll(t)}>
                  Enroll Now
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
    <section className="sect sect-navy">
      <div className="wrap">
        <div className="d-flex flex-column gap-3 mb-5">
          <ScriptTitle index="06" dark>
            The AI in 2026
          </ScriptTitle>
          <h2 className="h2 h2-inverse">Adoption is no longer the question. Pace is.</h2>
        </div>
        <div className="grid4">
          {METRICS.map(([n, t, l]) => (
            <div key={t} className="metric">
              <span className="metric-value">
                <CountUp value={n} />
              </span>
              <span className="metric-label">{t}</span>
              <span className="metric-desc">{l}</span>
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
    <section id="contact" className="sect sect-contact">
      <div className="wrap grid2">
        <div className="d-flex flex-column gap-3">
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
          <div className="rule rule-spaced" />
          <h2 className="h2">You want to Enroll the Academy?</h2>
          <p className="lede">
            Skip the form. Pick the program you want and apply directly. Applications are reviewed
            within one business day.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <Button onClick={() => onEnroll('Advanced AI Developer')}>
              Enroll Now to AI Course
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => onEnroll('AI Native Full-Stack Developer')}
            >
              Enroll Now to FSD
            </Button>
          </div>
        </div>
        <div className="panel">
          <h2 className="h2 h2-tight">Need more info, contact us.</h2>
          <div className="d-flex flex-column gap-2">
            <span className="field-label">CodeBoxx's Division you want to reach</span>
            <div className="d-flex gap-2 flex-wrap">
              {DIVISIONS.map((d) => (
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
                label="Ventures"
              />
            </div>
          </div>
          <div className="form-row-2">
            <Form.Control placeholder="First" value={f.first} onChange={set('first')} />
            <Form.Control placeholder="Last" value={f.last} onChange={set('last')} />
          </div>
          <Form.Group>
            <Form.Control
              placeholder="name@company.com"
              value={f.email}
              isInvalid={invalid}
              onChange={set('email')}
            />
            <Form.Control.Feedback type="invalid">
              Invalid address. Missing domain.
            </Form.Control.Feedback>
          </Form.Group>
          <div className="form-row-2">
            <Form.Control placeholder="Canada" value={f.country} onChange={set('country')} />
            <Form.Control placeholder="+1 555 000 0000" value={f.phone} onChange={set('phone')} />
          </div>
          <div className="d-flex flex-column gap-2">
            <span className="field-label">Is it a mobile phone?</span>
            <div className="d-flex gap-2">
              <Form.Check
                type="checkbox"
                checked={mobile === 'yes'}
                onChange={() => setMobile('yes')}
                label="Yes"
              />
              <Form.Check
                type="checkbox"
                checked={mobile === 'no'}
                onChange={() => setMobile('no')}
                label="No"
              />
            </div>
          </div>
          <div className="d-flex flex-column gap-2">
            <span className="field-label">Select your preferred language.</span>
            <div className="d-flex gap-2">
              <Form.Check
                type="checkbox"
                checked={lang === 'en'}
                onChange={() => setLang('en')}
                label="English"
              />
              <Form.Check
                type="checkbox"
                checked={lang === 'fr'}
                onChange={() => setLang('fr')}
                label="French"
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
              By submitting this form, you agree that we may call, text, and email you additional
              information on CodeBoxx programs. You understand that you can unsubscribe at any time
              including by emailing your request to{' '}
              <a href="mailto:info@codeboxx.biz">info@codeboxx.biz</a>. Message and data rates may
              apply. <a href="#contact">View our complete Privacy Policy</a> for further detail.
            </span>
          </div>
          <div className="rule" />
          <div className="form-actions">
            <span className={'form-actions-note' + (sent ? ' sent' : '')}>
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

function RadioRow({ label, options, value, onChange }) {
  return (
    <div className="d-flex flex-column gap-2">
      <Form.Label className="mb-0">{label}</Form.Label>
      <div className="d-flex gap-3 flex-wrap">
        {options.map((o) => (
          <Form.Check
            key={o}
            type="checkbox"
            checked={value === o}
            onChange={() => onChange(o)}
            label={o}
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
  const [form, setForm] = React.useState(ENROLL_BLANK);
  const [mobile, setMobile] = React.useState('Yes');
  const [lang, setLang] = React.useState('English');
  const [contactBy, setContactBy] = React.useState('Email');
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
    renderCourse && /full-?stack|fsd/i.test(renderCourse) ? ENROLL_TITLES.fsd : ENROLL_TITLES.ai;
  return (
    <Offcanvas show={!!course} onHide={onClose} placement="end" className="enroll-offcanvas">
      <Offcanvas.Header className="site-header">
        <div className="d-flex flex-column gap-3 align-items-start">
          <span className="kicker">Enroll</span>
          <h3 className="ptitle">{title}</h3>
        </div>
        <Button size="sm" variant="ghost" onClick={onClose}>
          Close
        </Button>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column gap-4">
        <h3 className="ptitle">Create Your Student Portal Account.</h3>
        <p className="pbody">
          If you already have a student portal account please{' '}
          <a href="https://student.codeboxx.com/pages/login.php" target="_blank" rel="noopener">
            log in
          </a>{' '}
          to make your course selection.
        </p>
        <div className="form-row-2">
          <Form.Control placeholder="First" value={form.first} onChange={set('first')} />
          <Form.Control placeholder="Last" value={form.last} onChange={set('last')} />
        </div>
        <Form.Group>
          <Form.Label>Birthdate</Form.Label>
          <Form.Control
            type="date"
            aria-label="Birthdate"
            value={form.birth}
            onChange={set('birth')}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            placeholder="name@company.com"
            value={form.email}
            isInvalid={invalid}
            onChange={set('email')}
          />
          <Form.Control.Feedback type="invalid">
            Invalid address. Missing domain.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>Phone</Form.Label>
          <div className="phone-row">
            <Form.Select aria-label="Country code" value={form.dial} onChange={set('dial')}>
              {DIAL_CODES.map(([c, n]) => (
                <option key={c} value={c}>
                  {c} {n}
                </option>
              ))}
            </Form.Select>
            <Form.Control
              aria-label="Phone number"
              placeholder="555 000 0000"
              value={form.phone}
              onChange={set('phone')}
            />
          </div>
        </Form.Group>
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
        <Form.Control placeholder="1200 Central Ave" value={form.street} onChange={set('street')} />
        <div className="form-row-2">
          <Form.Control placeholder="St. Petersburg" value={form.city} onChange={set('city')} />
          <Form.Control placeholder="Florida" value={form.region} onChange={set('region')} />
        </div>
        <div className="form-row-2">
          <Form.Group>
            <Form.Label>Country</Form.Label>
            <Form.Select aria-label="Country" value={form.country} onChange={set('country')}>
              <option value="">Select</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Control placeholder="33705" value={form.postal} onChange={set('postal')} />
        </div>
        <Form.Group>
          <Form.Label>How did you hear about us?</Form.Label>
          <Form.Select
            aria-label="How did you hear about us?"
            value={heard}
            onChange={(e) => setHeard(e.target.value)}
          >
            <option value="">Select</option>
            {HEARD_ABOUT.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <p className="pbody">
          Applications are reviewed within one business day. The entrance assessment is scheduled by
          email.
        </p>
        <div className="rule" />
        <div className="form-actions">
          <span className={'form-actions-note' + (sent ? ' sent' : '')}>
            {sent ? 'Application received.' : 'Submits to the admissions API.'}
          </span>
          <Button size="lg" disabled={!ready} onClick={() => setSent(true)}>
            Submit
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

function WSJTeaser() {
  return (
    <section className="band-dark">
      <div className="wrap band-dark-inner">
        <image-slot
          id="wsj-logo"
          shape="rect"
          fit="contain"
          placeholder="Wall Street Journal logo"
          style={{ width: 320, height: 88, '--slot-frame-bg': 'transparent', color: '#fff' }}
        ></image-slot>
        <h2 className="band-heading">How Five Americans Made It to the Middle Class</h2>
        <p className="band-body">
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
    title: 'Unlock your own Future: Join CodeBoxx’s 4-Day Vibe Coding and Agentic AI Workshop',
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
    <section id="codeblog" className="sect sect-steel">
      <div className="wrap">
        <div className="d-flex flex-column gap-3 mb-40">
          <ScriptTitle index="02" dark>
            CodeBlog
          </ScriptTitle>
          <h2 className="h2 h2-inverse">What we ship, we write down.</h2>
          <p className="lede lede-inverse">
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
              className="panel panel-link-card"
            >
              <div className="d-flex flex-column gap-3">
                <Badge bg="brand">{p.category}</Badge>
                <h3 className="ptitle">{p.title}</h3>
                <p className="pbody">{p.excerpt}</p>
              </div>
              <div className="d-flex flex-column gap-4">
                <div className="rule" />
                <span className="card-date">{fmtPostDate(p.date)}</span>
              </div>
            </a>
          ))}
        </div>
        <div className="d-flex justify-content-center mt-40">
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
    <section className="band-dark">
      <div className="wrap band-dark-inner">
        <image-slot
          id="forge20-product"
          shape="rect"
          fit="contain"
          placeholder="CodeBoxx w/ CrewKit Forge 20 appliance"
          style={{ width: 210, height: 100, '--slot-frame-bg': 'transparent', color: '#fff' }}
        ></image-slot>
        <span className="band-superhead">Lead. Think. Write. Run.</span>
        <h2 className="band-heading">CodeBoxx w/ CrewKit Forge 20</h2>
        <p className="band-body">
          Plan, build and run your software in one shell, two deployment paths. One executive
          chassis, five integrated touch surfaces, low-cost local computing by default and cloud
          escalation when warranted. Up to 20 heavy software workstreams in parallel: a complete
          end-to-end software development team in one appliance.
        </p>
        <div className="forge-features">
          {[
            ['Local Inference', 'Keep your foundational code, your software and your data close.'],
            ['Cost Control', 'Cut cloud dependency and unpredictable token-based pricing.'],
            ['Operator Model', 'CrewKit, operators and Academy training above the hardware.'],
          ].map(([t, d]) => (
            <div key={t} className="forge-feature">
              <span className="forge-feature-title">{t}</span>
              <span className="forge-feature-body">{d}</span>
            </div>
          ))}
        </div>
        <div className="d-flex gap-3 flex-wrap justify-content-center mt-2">
          <Button
            onClick={() => window.open('https://buildorder.codeboxx.com/', '_blank', 'noopener')}
          >
            Build Your Own
          </Button>
          <Button
            variant="outline-primary"
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
          <span className="pill">AI-First, Human-Built</span>
        </div>
        <div className="d-flex justify-content-between align-items-end gap-5 flex-wrap">
          <h1>
            We build <span className="text-brand">AI-Native</span> teams and software that outwork
            the old way.
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
