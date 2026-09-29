import React from 'react';
import { CASES, PORTFOLIO } from '../lib/forgeEvidence';
import { money, months as fmtMonths, percent, times } from '../lib/forgeFormat';

// Interactive evidence explorer for /crewkit-forge-20/dive-deeper: seven delivered
// platforms, each a grey bar for the traditional 2022 baseline with the factory's
// actual cost or time overlaid in blue from the same baseline. Toggle the metric,
// filter the groups, select a row for its detail, or switch to a table view (the
// accessible, colour-free reading of the same numbers). Styles: _forge-deep.scss.

const caseName = (c, t) => c.client || t.cases[c.id].name;

function timeLabel(side, t, lang) {
  if (side.days) return side.days + ' ' + t.evidence.days;
  return (
    (side.range
      ? side.range.replace('–', lang === 'fr' ? ' à ' : '–')
      : fmtMonths(side.months, lang)) +
    ' ' +
    t.evidence.months
  );
}

function valueLabel(side, metric, t, lang) {
  return metric === 'cost' ? money(side.cost, lang) : timeLabel(side, t, lang);
}

export default function ForgeEvidence({ t, lang }) {
  const e = t.evidence;
  const [metric, setMetric] = React.useState('cost');
  const [filter, setFilter] = React.useState('all');
  const [view, setView] = React.useState('chart');
  const [selected, setSelected] = React.useState(CASES[0].id);

  const rows = CASES.filter((c) => filter === 'all' || c.group === filter);
  const key = metric === 'cost' ? 'cost' : 'months';
  const max = Math.max(...rows.map((c) => c.traditional[key]));
  const active = CASES.find((c) => c.id === selected) || CASES[0];
  const activeText = t.cases[active.id];

  // Keep the selection inside the visible set when a filter hides it.
  React.useEffect(() => {
    if (!rows.some((c) => c.id === selected)) setSelected(rows[0].id);
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fd-evidence">
      <div className="fd-controls" role="group">
        <div className="fd-seg" role="radiogroup" aria-label={e.metricLabel}>
          <span className="fd-seg-label">{e.metricLabel}</span>
          {['cost', 'time'].map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={metric === m}
              className={'fd-seg-btn' + (metric === m ? ' is-on' : '')}
              onClick={() => setMetric(m)}
            >
              {e.metrics[m]}
            </button>
          ))}
        </div>
        <div className="fd-seg" role="radiogroup" aria-label={e.filterLabel}>
          <span className="fd-seg-label">{e.filterLabel}</span>
          {['all', 'benchmark', 'additional'].map((f) => (
            <button
              key={f}
              type="button"
              role="radio"
              aria-checked={filter === f}
              className={'fd-seg-btn' + (filter === f ? ' is-on' : '')}
              onClick={() => setFilter(f)}
            >
              {e.filters[f]}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="fd-link-btn"
          onClick={() => setView(view === 'chart' ? 'table' : 'chart')}
        >
          {view === 'chart' ? e.tableToggle : e.chartToggle}
        </button>
      </div>

      <div className="fd-evidence-grid">
        <div className="fd-chart-card">
          <div className="fd-legend" aria-hidden={view === 'table'}>
            <span className="fd-key">
              <span className="fd-swatch fd-swatch-trad" />
              {e.legend.traditional}
            </span>
            <span className="fd-key">
              <span className="fd-swatch fd-swatch-fact" />
              {e.legend.factory}
            </span>
          </div>

          {view === 'chart' ? (
            <ul className="fd-rows">
              {rows.map((c) => {
                const tw = (c.traditional[key] / max) * 100;
                const fw = (c.factory[key] / max) * 100;
                const on = c.id === selected;
                const gain =
                  metric === 'cost'
                    ? percent(c.reduction, lang)
                    : c.speed
                      ? times(c.speed, lang)
                      : null;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      className={'fd-row' + (on ? ' is-on' : '')}
                      aria-pressed={on}
                      onClick={() => setSelected(c.id)}
                    >
                      <span className="fd-row-name">
                        {caseName(c, t)}
                        <span className="fd-row-group">{e.groups[c.group]}</span>
                      </span>
                      <span className="fd-track">
                        <span className="fd-bar-trad" style={{ width: Math.max(tw, 0.6) + '%' }} />
                        <span className="fd-bar-fact" style={{ width: Math.max(fw, 0.6) + '%' }} />
                        <span
                          className="fd-trad-label"
                          style={{ left: 'min(calc(' + tw + '% + 8px), calc(100% - 4.5em))' }}
                        >
                          {valueLabel(c.traditional, metric, t, lang)}
                        </span>
                        <span className="fd-tip" role="tooltip">
                          {e.legend.traditional}: {valueLabel(c.traditional, metric, t, lang)}
                          <br />
                          {e.legend.factory}: {valueLabel(c.factory, metric, t, lang)}
                        </span>
                      </span>
                      <span className="fd-row-gain">
                        <span className="fd-row-fact">
                          {valueLabel(c.factory, metric, t, lang)}
                        </span>
                        <span className="fd-row-mult">
                          {gain ? gain + ' ' + (metric === 'cost' ? e.cheaper : e.faster) : '—'}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="fd-table-wrap">
              <table className="fd-table">
                <thead>
                  <tr>
                    <th scope="col">{e.table.platform}</th>
                    <th scope="col">{e.table.tradTime}</th>
                    <th scope="col">{e.table.factTime}</th>
                    <th scope="col">{e.table.tradCost}</th>
                    <th scope="col">{e.table.factCost}</th>
                    <th scope="col">{e.table.gain}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr key={c.id}>
                      <th scope="row">{caseName(c, t)}</th>
                      <td>{timeLabel(c.traditional, t, lang)}</td>
                      <td>{timeLabel(c.factory, t, lang)}</td>
                      <td>{money(c.traditional.cost, lang)}</td>
                      <td>{money(c.factory.cost, lang)}</td>
                      <td>
                        {(c.speed ? times(c.speed, lang) : timeLabel(c.factory, t, lang)) +
                          ' / ' +
                          percent(c.reduction, lang)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="fd-note">{e.note}</p>
        </div>

        <aside className="fd-detail" aria-live="polite">
          <span className="fd-detail-group">{e.groups[active.group]}</span>
          <h3 className="fd-detail-name">{caseName(active, t)}</h3>
          <p className="fd-detail-kind">{activeText.kind}</p>
          <div className="fd-detail-mults">
            <div>
              <span className="fd-mult">
                {active.speed ? times(active.speed, lang) : timeLabel(active.factory, t, lang)}
              </span>
              <span className="fd-mult-label">{active.speed ? e.faster : e.metrics.time}</span>
            </div>
            <div>
              <span className="fd-mult">{percent(active.reduction, lang)}</span>
              <span className="fd-mult-label">{e.cheaper}</span>
            </div>
          </div>
          <h4 className="fd-detail-h">{e.detail.need}</h4>
          <p className="pbody">{activeText.need}</p>
          <h4 className="fd-detail-h">{e.detail.delivered}</h4>
          <ol className="fd-detail-list">
            {activeText.delivered.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ol>
          <h4 className="fd-detail-h">{e.detail.stack}</h4>
          <div className="fd-chips">
            {active.tech.map((x) => (
              <span key={x} className="fd-chip">
                {x}
              </span>
            ))}
          </div>
          <p className="fd-basis">
            <strong>{e.detail.basis}.</strong> {activeText.basis}
          </p>
        </aside>
      </div>

      <div className="fd-totals">
        <span className="fd-totals-title">{e.totals.title}</span>
        <div className="fd-total">
          <span className="fd-total-label">{e.totals.traditional}</span>
          <span className="fd-total-value fd-total-muted">
            {money(PORTFOLIO.traditionalCost, lang)}
          </span>
        </div>
        <div className="fd-total">
          <span className="fd-total-label">{e.totals.factory}</span>
          <span className="fd-total-value">{money(PORTFOLIO.factoryCost, lang)}</span>
        </div>
        <div className="fd-total fd-total-hero">
          <span className="fd-total-label">{e.totals.saved}</span>
          <span className="fd-total-value">{money(PORTFOLIO.saved, lang)}</span>
          <span className="fd-total-sub">
            {percent(Math.round(PORTFOLIO.costReduction * 100) + '%', lang)} {e.totals.reduction}
          </span>
        </div>
        <div className="fd-total">
          <span className="fd-total-label">{e.totals.calendar}</span>
          <span className="fd-total-value">
            {PORTFOLIO.traditionalMonths} → {PORTFOLIO.factoryMonths} {e.months}
          </span>
        </div>
      </div>
    </div>
  );
}
