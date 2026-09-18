import React from 'react';

// Mirrors HomeIsland.jsx's own (private) ScriptTitle/CountUp, extracted here so
// the landing-page section renderers don't have to pull in that whole island.
export function ScriptTitle({ index, children, dark }) {
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

export function CountUp({ value }) {
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
