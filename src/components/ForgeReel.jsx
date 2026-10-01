import React from 'react';

// The reel in the "Owned" gateway card: the six headlines of
// buildorder.codeboxx.com cycling over the Forge poster, each one entering with
// one of the funnel's six effects (word rise, letter cascade, blur zoom, mask
// wipe, 3D flip, shimmer), picked at random and never repeating the previous
// one, on the funnel's own 5.6 s cadence with its half-second blur-and-lift
// exit. Rebuilt on the Web Animations API so the site takes no motion library.
//
// Same manners as the testimonials slider above it: it pauses on hover and on
// keyboard focus, when the tab is hidden, and when the card is scrolled out of
// view; under prefers-reduced-motion the phrases simply cross-fade.

const EFFECTS = ['riseWords', 'letterCascade', 'blurZoom', 'maskWipe', 'flipX', 'shimmer'];
const EASE = 'cubic-bezier(.16, 1, .3, 1)';
const HOLD_MS = 5600;
const EXIT_MS = 500;

function reducedMotion() {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

// Every animated fragment paints its own gradient: a transformed child is
// composited apart from its parent, and a parent's background-clip:text no
// longer reaches it (the letters came out blank).
function Fragments({ phrase, mode }) {
  const words = phrase.split(' ');
  let key = 0;
  return words.map((word, wi) => (
    <span key={wi} className="gw-reel-word">
      {mode === 'letters' ? (
        Array.from(word).map((ch) => (
          <span key={key++} className="gw-reel-letter gw-reel-grad">
            {ch}
          </span>
        ))
      ) : (
        <span className="gw-reel-grad">{word}</span>
      )}
    </span>
  ));
}

function Phrase({ phrase, effect }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const fill = { easing: EASE, fill: 'both' };
    const stagger = (nodes, from, to, duration, step) =>
      nodes.forEach((n, i) => n.animate([from, to], { ...fill, duration, delay: i * step }));
    const animations = [];

    switch (effect) {
      case 'riseWords':
        stagger(
          el.querySelectorAll('.gw-reel-grad'),
          { opacity: 0, transform: 'translateY(28px)', filter: 'blur(10px)' },
          { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' },
          700,
          60
        );
        break;
      case 'letterCascade':
        stagger(
          el.querySelectorAll('.gw-reel-letter'),
          { opacity: 0, transform: 'translateY(18px) rotate(-6deg)' },
          { opacity: 1, transform: 'translateY(0) rotate(0deg)' },
          500,
          18
        );
        break;
      case 'blurZoom':
        animations.push(
          el.animate(
            [
              { opacity: 0, transform: 'scale(1.18)', filter: 'blur(16px)' },
              { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
            ],
            { ...fill, duration: 900 }
          )
        );
        break;
      case 'maskWipe':
        animations.push(
          el.animate(
            [
              { clipPath: 'inset(0 100% 0 0)', opacity: 0.4 },
              { clipPath: 'inset(0 0% 0 0)', opacity: 1 },
            ],
            { ...fill, duration: 950 }
          )
        );
        break;
      case 'flipX':
        animations.push(
          el.animate(
            [
              { opacity: 0, transform: 'rotateX(-90deg) translateY(10px)' },
              { opacity: 1, transform: 'rotateX(0deg) translateY(0)' },
            ],
            { ...fill, duration: 900 }
          )
        );
        break;
      case 'shimmer':
        animations.push(
          el.animate(
            [
              { opacity: 0, transform: 'translateY(10px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ],
            { ...fill, duration: 700 }
          ),
          el.animate([{ backgroundPositionX: '200%' }, { backgroundPositionX: '0%' }], {
            duration: 2600,
            iterations: Infinity,
            easing: 'linear',
          })
        );
        break;
      default:
        animations.push(el.animate([{ opacity: 0 }, { opacity: 1 }], { ...fill, duration: 400 }));
    }
    return () => animations.forEach((a) => a.cancel());
  }, [phrase, effect]);

  const fragmented = effect === 'riseWords' || effect === 'letterCascade';
  const className =
    'gw-reel-phrase' +
    (fragmented ? ' gw-reel-phrase-fragments' : ' gw-reel-grad') +
    (effect === 'shimmer' ? ' gw-reel-shimmer' : '') +
    (effect === 'flipX' ? ' gw-reel-flip' : '');

  return (
    <span ref={ref} className={className}>
      {fragmented ? (
        <Fragments phrase={phrase} mode={effect === 'letterCascade' ? 'letters' : 'words'} />
      ) : (
        phrase
      )}
    </span>
  );
}

export default function ForgeReel({ phrases, labels, poster, posterAlt }) {
  const [index, setIndex] = React.useState(0);
  const [effect, setEffect] = React.useState('riseWords');
  const [leaving, setLeaving] = React.useState(false);
  const [paused, setPaused] = React.useState(false); // hover / focus
  const [held, setHeld] = React.useState(false); // pause button
  const [offscreen, setOffscreen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false); // tab in the background
  const [reduced, setReduced] = React.useState(false);
  const rootRef = React.useRef(null);
  const slotRef = React.useRef(null);
  const effectRef = React.useRef(effect);
  effectRef.current = effect;

  React.useEffect(() => {
    setReduced(reducedMotion());
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const advance = React.useCallback(
    (step) => {
      const next = (i) => (i + step + phrases.length) % phrases.length;
      if (reduced) {
        setIndex(next);
        return;
      }
      // mode "wait": the current phrase lifts and blurs out, then the next mounts.
      const current = slotRef.current && slotRef.current.firstElementChild;
      const mount = () => {
        setLeaving(false);
        setEffect((prev) => {
          let pick = prev;
          while (pick === prev) pick = EFFECTS[Math.floor(Math.random() * EFFECTS.length)];
          return pick;
        });
        setIndex(next);
      };
      if (!current) return mount();
      setLeaving(true);
      const exit = current.animate(
        [
          { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' },
          { opacity: 0, transform: 'translateY(-18px)', filter: 'blur(8px)' },
        ],
        { duration: EXIT_MS, easing: EASE, fill: 'forwards' }
      );
      exit.onfinish = mount;
      exit.oncancel = mount;
    },
    [phrases.length, reduced]
  );

  React.useEffect(() => {
    if (paused || held || offscreen || hidden || leaving) return undefined;
    const t = setInterval(() => advance(1), HOLD_MS);
    return () => clearInterval(t);
  }, [paused, held, offscreen, hidden, leaving, advance]);

  React.useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const phrase = phrases[index];

  return (
    <div
      ref={rootRef}
      className="gw-reel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <img
        className="gw-reel-poster"
        src={poster}
        alt={posterAlt}
        width={1248}
        height={736}
        loading="lazy"
      />
      <div className="gw-reel-aurora" aria-hidden="true" />
      <div className="gw-reel-scrim" aria-hidden="true" />

      <div className="gw-reel-stage">
        <span className="gw-reel-source">buildorder.codeboxx.com</span>
        <div ref={slotRef} className="gw-reel-slot" aria-live="polite">
          <Phrase key={index + ':' + effect} phrase={phrase} effect={reduced ? 'fade' : effect} />
        </div>
      </div>

      <div className="gw-reel-controls">
        <div className="gw-reel-pills" role="group" aria-label={labels.phrasesLabel}>
          {phrases.map((p, i) => (
            <button
              key={p}
              type="button"
              className={'gw-reel-pill' + (i === index ? ' is-current' : '')}
              aria-label={p}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => {
                if (i !== index) advance(i - index);
              }}
            />
          ))}
        </div>
        <button
          type="button"
          className="gw-reel-pause"
          aria-pressed={held}
          onClick={() => setHeld((h) => !h)}
        >
          {held ? labels.play : labels.pause}
        </button>
      </div>
    </div>
  );
}
