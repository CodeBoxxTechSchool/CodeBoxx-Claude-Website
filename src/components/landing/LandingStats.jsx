import React from 'react';
import { pickLocale } from '../../lib/sanity';
import { ScriptTitle, CountUp } from '../../pages/Home';

// Mirrors Home.jsx's Metrics() ("Stats") band.
function LandingStats({ data, lang }) {
  const metrics = data.metrics || [];
  return (
    <section className="sect sect-navy">
      <div className="wrap">
        <div className="d-flex flex-column gap-3 mb-5">
          <ScriptTitle index="06" dark>
            {pickLocale(data.eyebrow, lang)}
          </ScriptTitle>
          <h2 className="h2 h2-inverse">{pickLocale(data.title, lang)}</h2>
        </div>
        <div className="grid4">
          {metrics.map((m, i) => (
            <div key={i} className="metric">
              <span className="metric-value">
                <CountUp value={m.value} />
              </span>
              <span className="metric-label">{pickLocale(m.label, lang)}</span>
              <span className="metric-desc">{pickLocale(m.description, lang)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LandingStats;
