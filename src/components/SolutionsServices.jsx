import React from 'react';

// The four services on /solutions as tabs: the list on the left, the chosen
// service's detail on the right. Text comes from home.services (the homepage's
// Solutions band uses the same), so the two never drift. While it is on screen
// and nobody has touched it, it moves to the next service every few seconds, with a
// progress bar on the active tab. It stops for good on the first click, key or
// focus, and never runs under prefers-reduced-motion.
const ADVANCE_MS = 9000;

const LOGO_IMAGES = {
  Crewkit: '/assets/crewkit.webp',
  Optigo: '/assets/optigo.webp',
  'Catalog Crafter': '/assets/catalog-crafter.webp',
  Soumigo: '/assets/soumigo.webp',
};
const LOGO_LINKS = {
  Crewkit: 'https://crewkit.io/',
  Optigo: 'https://optigo.ca/',
  'Catalog Crafter': 'https://www.catalogcrafter.com/',
  Soumigo: 'https://soumigo.com/',
};

export default function SolutionsServices({ services, label }) {
  const [active, setActive] = React.useState(0);
  const [auto, setAuto] = React.useState(false);
  const rootRef = React.useRef(null);
  const tabsRef = React.useRef([]);
  const panelRef = React.useRef(null);

  // Auto-advance only while visible, with motion allowed, and until touched.
  React.useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setAuto((on) => (on === null ? null : entry.isIntersecting)),
      { threshold: 0.35 }
    );
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    if (!auto) return undefined;
    const id = setTimeout(() => setActive((i) => (i + 1) % services.length), ADVANCE_MS);
    return () => clearTimeout(id);
  }, [auto, active, services.length]);

  const stop = () => setAuto(null); // null: stopped for good
  const choose = (i) => {
    stop();
    setActive(i);
  };
  const onKey = (e) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    let next = null;
    if (step) next = (active + step + services.length) % services.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = services.length - 1;
    if (next === null) return;
    e.preventDefault();
    choose(next);
    tabsRef.current[next]?.focus();
  };

  const s = services[active];
  return (
    <div className="sol-services" ref={rootRef} onPointerDown={stop} onFocus={stop}>
      <div
        className="sol-tabs"
        role="tablist"
        aria-label={label}
        aria-orientation="vertical"
        onKeyDown={onKey}
      >
        {services.map((item, i) => (
          <button
            key={item.id}
            ref={(el) => (tabsRef.current[i] = el)}
            type="button"
            role="tab"
            id={`sol-tab-${item.id}`}
            aria-selected={i === active}
            aria-controls={`sol-panel-${item.id}`}
            tabIndex={i === active ? 0 : -1}
            className={'sol-tab' + (i === active ? ' is-active' : '')}
            onClick={() => {
              choose(i);
              // Stacked layout (phones, tablets): bring the detail below the list into view.
              if (window.matchMedia('(max-width: 1000px)').matches)
                requestAnimationFrame(() =>
                  panelRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
                );
            }}
          >
            <span className="sol-tab-index">{String(i + 1).padStart(2, '0')}</span>
            <span className="sol-tab-text">
              <span className="sol-tab-title">{item.title}</span>
              <span className="sol-tab-blurb">{item.blurb}</span>
            </span>
            {i === active && auto ? (
              <span
                key={active}
                className="sol-tab-progress"
                style={{ animationDuration: `${ADVANCE_MS}ms` }}
              />
            ) : null}
          </button>
        ))}
      </div>

      <div
        key={s.id}
        ref={panelRef}
        className="sol-panel"
        role="tabpanel"
        id={`sol-panel-${s.id}`}
        aria-labelledby={`sol-tab-${s.id}`}
        tabIndex={0}
      >
        <span className="kicker">{s.title}</span>
        <h3 className="sol-panel-heading">{s.heading}</h3>
        <p className="sol-panel-sub">{s.sub}</p>
        {s.detail.split('\n\n').map((p, i) => (
          <p key={i} className="pbody">
            {p}
          </p>
        ))}
        {s.tags ? (
          <ul className="sol-chips">
            {s.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
        {s.steps ? (
          <ol className="sol-steps">
            {s.steps.map(([title, body]) => (
              <li key={title}>
                <span className="sol-step-title">{title}</span>
                <span className="pbody">{body}</span>
              </li>
            ))}
          </ol>
        ) : null}
        {s.logos ? (
          <div className="sol-products">
            <span className="sol-products-title">{s.logosTitle}</span>
            <ul>
              {s.logos.map((n) => (
                <li key={n}>
                  <a href={LOGO_LINKS[n]} target="_blank" rel="noopener noreferrer">
                    <img src={LOGO_IMAGES[n]} alt={n} loading="lazy" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {s.close.split('\n\n').map((p, i) => (
          <p key={i} className="pbody sol-panel-close">
            {p}
          </p>
        ))}
        {s.closeAfter ? <p className="pbody sol-panel-close">{s.closeAfter}</p> : null}
      </div>
    </div>
  );
}
