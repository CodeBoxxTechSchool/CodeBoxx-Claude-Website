import React from 'react';

// "What worries you most?" explorer for the #AIDoneRight page. Pick a concern and
// the Articles of the standard that answer it light up; or narrow the list by the
// standard's four groups. Every Article is server-rendered in full, so the page
// reads completely without JavaScript and for search engines. Styles: _adr.scss.

export default function AdrExplorer({ t }) {
  const [fear, setFear] = React.useState(null);
  const [pillar, setPillar] = React.useState('all');
  const f = t.fears;
  const a = t.articles;
  const lit = fear ? f.items[fear][1] : null;

  const visible = a.list.filter((art) => pillar === 'all' || art.pillar === pillar);

  return (
    <div className="adr-explorer">
      <div className="adr-fears" role="group" aria-label={f.title}>
        {Object.keys(f.items).map((k) => (
          <button
            key={k}
            type="button"
            className={'adr-fear' + (fear === k ? ' is-on' : '')}
            aria-pressed={fear === k}
            onClick={() => {
              setFear(fear === k ? null : k);
              setPillar('all');
            }}
          >
            {f.items[k][0]}
          </button>
        ))}
        {fear ? (
          <button type="button" className="adr-fear-reset" onClick={() => setFear(null)}>
            {f.all}
          </button>
        ) : null}
      </div>

      <div className="adr-pillars" role="radiogroup" aria-label={a.pillarLabel}>
        <button
          type="button"
          role="radio"
          aria-checked={pillar === 'all'}
          className={'adr-pillar' + (pillar === 'all' ? ' is-on' : '')}
          onClick={() => setPillar('all')}
        >
          <span className="adr-pillar-name">1–13</span>
          <span className="adr-pillar-q">{f.all}</span>
        </button>
        {Object.keys(a.pillars).map((k) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={pillar === k}
            className={'adr-pillar adr-pillar-' + k + (pillar === k ? ' is-on' : '')}
            onClick={() => {
              setPillar(k);
              setFear(null);
            }}
          >
            <span className="adr-pillar-name">{a.pillars[k][0]}</span>
            <span className="adr-pillar-q">{a.pillars[k][1]}</span>
          </button>
        ))}
      </div>

      <ol className="adr-articles">
        {visible.map((art) => {
          const on = !lit || lit.includes(art.n);
          return (
            <li
              key={art.n}
              className={
                'adr-article adr-article-' + art.pillar + (lit ? (on ? ' is-lit' : ' is-dim') : '')
              }
            >
              <div className="adr-article-head">
                <span className="adr-article-n">{String(art.n).padStart(2, '0')}</span>
                <span className="adr-article-pillar">{a.pillars[art.pillar][0]}</span>
              </div>
              <h3 className="adr-article-title">{art.title}</h3>
              <p className="adr-article-means">
                <span className="adr-label">{a.meansLabel}</span>
                {art.means}
              </p>
              <blockquote className="adr-article-principle">
                <span className="adr-label">{a.principleLabel}</span>
                {art.principle}
              </blockquote>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
