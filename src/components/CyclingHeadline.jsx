import React from 'react';

// The cycling title of the "Owned" gateway card. It opens on the card's thesis
// ("Take back control of your enterprise software.") and then runs through the
// six headlines of buildorder.codeboxx.com, each one entering with one of the
// funnel's six effects (word rise, letter cascade, blur zoom, mask wipe, 3D
// flip, shimmer), picked at random and never repeating the previous one, on the
// funnel's own 5.6 s cadence with its half-second blur-and-lift exit. Rebuilt on
// the Web Animations API so the site takes no motion library.
//
// Same manners as the testimonials slider: it pauses on hover and on keyboard
// focus inside the card, when the tab is hidden, and when the card is scrolled
// out of view; under prefers-reduced-motion the phrases simply cross-fade.

const EFFECTS = ['riseWords', 'letterCascade', 'blurZoom', 'maskWipe', 'flipX', 'shimmer'];
const EASE = 'cubic-bezier(.16, 1, .3, 1)';
const HOLD_MS = 5600;
const EXIT_MS = 500;

// Every animated fragment paints its own gradient: a transformed child is
// composited apart from its parent, and a parent's background-clip:text no
// longer reaches it (the letters came out blank).
function Fragments({ phrase, mode }) {
  const words = phrase.split(' ');
  let key = 0;
  return words.map((word, wi) => (
    <span key={wi} className="gw-cycle-word">
      {mode === 'letters' ? (
        Array.from(word).map((ch) => (
          <span key={key++} className="gw-cycle-letter gw-cycle-grad">
            {ch}
          </span>
        ))
      ) : (
        <span className="gw-cycle-grad">{word}</span>
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
          el.querySelectorAll('.gw-cycle-grad'),
          { opacity: 0, transform: 'translateY(28px)', filter: 'blur(10px)' },
          { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' },
          700,
          60
        );
        break;
      case 'letterCascade':
        stagger(
          el.querySelectorAll('.gw-cycle-letter'),
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
    'gw-cycle-phrase' +
    (fragmented ? ' gw-cycle-phrase-fragments' : ' gw-cycle-grad') +
    (effect === 'shimmer' ? ' gw-cycle-shimmer' : '') +
    (effect === 'flipX' ? ' gw-cycle-flip' : '');

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

// `phrases[0]` is what the server renders and what the card opens on: the
// first transition only runs once the clock has ticked, so the thesis is
// readable at rest and in a thumbnail.
export default function CyclingHeadline({ phrases }) {
  const [index, setIndex] = React.useState(0);
  const [effect, setEffect] = React.useState('none');
  const [leaving, setLeaving] = React.useState(false);
  const [paused, setPaused] = React.useState(false); // hover / focus
  const [offscreen, setOffscreen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false); // tab in the background
  const [reduced, setReduced] = React.useState(false);
  const rootRef = React.useRef(null);

  React.useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const onVisibility = () => setHidden(document.hidden);
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    const el = rootRef.current;
    const io =
      el && typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting), {
            threshold: 0.2,
          })
        : null;
    if (io) io.observe(el);
    // the card is the hover/focus surface, not just the title line
    const card = el && el.closest('.gw-card');
    const pause = () => setPaused(true);
    const resume = () => setPaused(false);
    const blur = (e) => {
      if (!card.contains(e.relatedTarget)) setPaused(false);
    };
    if (card) {
      card.addEventListener('mouseenter', pause);
      card.addEventListener('mouseleave', resume);
      card.addEventListener('focusin', pause);
      card.addEventListener('focusout', blur);
    }
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      if (io) io.disconnect();
      if (card) {
        card.removeEventListener('mouseenter', pause);
        card.removeEventListener('mouseleave', resume);
        card.removeEventListener('focusin', pause);
        card.removeEventListener('focusout', blur);
      }
    };
  }, []);

  const advance = React.useCallback(() => {
    const next = (i) => (i + 1) % phrases.length;
    if (reduced) {
      setIndex(next);
      return;
    }
    // mode "wait": the current phrase lifts and blurs out, then the next mounts.
    const current = rootRef.current && rootRef.current.firstElementChild;
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
    // Mount on the exit's finish, but never depend on it alone: where the
    // animation's finish event doesn't arrive (a throttled or headless
    // renderer), the reel would otherwise stop on its first exit for good.
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(fallback);
      mount();
    };
    const fallback = setTimeout(finish, EXIT_MS + 150);
    exit.onfinish = finish;
    exit.oncancel = finish;
  }, [phrases.length, reduced]);

  React.useEffect(() => {
    if (paused || offscreen || hidden || leaving) return undefined;
    const t = setInterval(advance, HOLD_MS);
    return () => clearInterval(t);
  }, [paused, offscreen, hidden, leaving, advance]);

  return (
    <span ref={rootRef} className="gw-cycle" aria-live="polite">
      <Phrase
        key={index + ':' + effect}
        phrase={phrases[index]}
        effect={reduced ? 'fade' : effect}
      />
    </span>
  );
}
