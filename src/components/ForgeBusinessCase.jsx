import React from 'react';
import { SCENARIOS } from '../lib/forgeEvidence';
import { money, moneyFull, months as fmtMonths, pct, times } from '../lib/forgeFormat';

// Business-case builder for /crewkit-forge-20/dive-deeper. The visitor describes
// one project as they would staff it today; the builder applies one of three
// scenarios whose multiples all come from delivered work (see SCENARIOS in
// src/lib/forgeEvidence.js) and returns cost, time, time-to-market value and a
// ready-to-paste summary for a leadership memo. Nothing is sent anywhere.

const FIELDS = [
  { id: 'team', min: 1, max: 40, step: 1 },
  { id: 'rate', min: 5000, max: 30000, step: 500, money: true },
  { id: 'months', min: 2, max: 48, step: 1 },
  { id: 'value', min: 0, max: 1000000, step: 5000, money: true },
  { id: 'projects', min: 1, max: 12, step: 1 },
];

const fill = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : ''));

function CompareBars({ title, trad, fact, labels, format }) {
  const max = Math.max(trad, fact) || 1;
  return (
    <div className="fb-compare">
      <span className="fb-compare-title">{title}</span>
      {[
        ['trad', labels.traditional, trad],
        ['fact', labels.factory, fact],
      ].map(([k, label, v]) => (
        <div key={k} className="fb-compare-row">
          <span className="fb-compare-label">{label}</span>
          <span className="fb-compare-track">
            <span
              className={'fb-compare-bar fb-compare-' + k}
              style={{ width: Math.max((v / max) * 100, 1) + '%' }}
            />
          </span>
          <span className="fb-compare-value">{format(v)}</span>
        </div>
      ))}
    </div>
  );
}

export default function ForgeBusinessCase({ t, lang }) {
  const b = t.builder;
  const [v, setV] = React.useState({ team: 8, rate: 15000, months: 18, value: 0, projects: 2 });
  const [scenario, setScenario] = React.useState('benchmark');
  const [copied, setCopied] = React.useState(false);

  const s = SCENARIOS[scenario];
  const tradCost = v.team * v.rate * v.months;
  const factCost = tradCost * (1 - s.costReduction);
  const factMonths = v.months / s.speed;
  const saved = tradCost - factCost;
  const monthsSaved = v.months - factMonths;
  const earlyValue = monthsSaved * v.value;
  const yearSaved = saved * v.projects;

  const vars = {
    team: v.team,
    teamUnit: v.team === 1 ? b.inputs.teamUnitSingular : b.inputs.teamUnitPlural,
    months: v.months,
    tradCost: money(tradCost, lang),
    scenario: b.scenarios[scenario][0],
    factMonths: fmtMonths(factMonths, lang),
    factCost: money(factCost, lang),
    saved: money(saved, lang),
    monthsSaved: fmtMonths(monthsSaved, lang),
    earlyValue: money(earlyValue, lang),
    projects: v.projects,
    yearSaved: money(yearSaved, lang),
  };
  vars.valuePart = v.value > 0 ? fill(b.summaryValue, vars) : '';
  const summary = fill(b.summary, vars);

  const set = (id) => (ev) => {
    const f = FIELDS.find((x) => x.id === id);
    const n = Math.min(f.max, Math.max(f.min, Number(ev.target.value) || 0));
    setV((prev) => ({ ...prev, [id]: n }));
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        b.summaryTitle + '\n\n' + summary + '\n\n' + b.disclaimer
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fb">
      <div className="fb-inputs">
        {FIELDS.map((f) => (
          <div key={f.id} className="fb-field">
            <label htmlFor={'fb-' + f.id} className="fb-label">
              {b.inputs[f.id]}
            </label>
            <div className="fb-field-row">
              <input
                id={'fb-' + f.id}
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={v[f.id]}
                onChange={set(f.id)}
              />
              <output className="fb-out" htmlFor={'fb-' + f.id}>
                {f.money ? moneyFull(v[f.id], lang) : v[f.id]}
                {f.id === 'team'
                  ? ' ' + (v.team === 1 ? b.inputs.teamUnitSingular : b.inputs.teamUnitPlural)
                  : f.id === 'months'
                    ? ' ' + b.inputs.monthsUnit
                    : ''}
              </output>
            </div>
            {f.id === 'value' ? <span className="fb-hint">{b.inputs.valueHint}</span> : null}
          </div>
        ))}

        <fieldset className="fb-scenarios">
          <legend className="fb-label">{b.scenarioLabel}</legend>
          {Object.keys(SCENARIOS).map((k) => (
            <label key={k} className={'fb-scenario' + (scenario === k ? ' is-on' : '')}>
              <input
                type="radio"
                name="fb-scenario"
                value={k}
                checked={scenario === k}
                onChange={() => setScenario(k)}
              />
              <span className="fb-scenario-name">{b.scenarios[k][0]}</span>
              <span className="fb-scenario-desc">{b.scenarios[k][1]}</span>
            </label>
          ))}
        </fieldset>
      </div>

      <div className="fb-results" aria-live="polite">
        <div className="fb-tiles">
          <div className="fb-tile fb-tile-hero">
            <span className="fb-tile-label">{b.results.saved}</span>
            <span className="fb-tile-value">{money(saved, lang)}</span>
            <span className="fb-tile-sub">{pct(s.costReduction, lang)}</span>
          </div>
          <div className="fb-tile">
            <span className="fb-tile-label">{b.results.monthsSaved}</span>
            <span className="fb-tile-value">{fmtMonths(monthsSaved, lang)}</span>
            <span className="fb-tile-sub">{times(s.speed, lang)}</span>
          </div>
          <div className="fb-tile">
            <span className="fb-tile-label">{b.results.earlyValue}</span>
            <span className="fb-tile-value">{v.value > 0 ? money(earlyValue, lang) : '—'}</span>
          </div>
          <div className="fb-tile">
            <span className="fb-tile-label">{b.results.perYear}</span>
            <span className="fb-tile-value">{money(yearSaved, lang)}</span>
          </div>
        </div>

        <CompareBars
          title={b.results.cost}
          trad={tradCost}
          fact={factCost}
          labels={b.results}
          format={(x) => money(x, lang)}
        />
        <CompareBars
          title={b.results.time}
          trad={v.months}
          fact={factMonths}
          labels={b.results}
          format={(x) => fmtMonths(x, lang) + ' ' + b.results.monthsUnit}
        />

        <div className="fb-summary">
          <span className="fb-summary-title">{b.summaryTitle}</span>
          <p className="fb-summary-text">{summary}</p>
          <div className="fb-summary-actions">
            <button type="button" className="btn btn-primary" onClick={copy}>
              {copied ? b.copied : b.copy}
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => window.print()}
            >
              {b.print}
            </button>
          </div>
          <p className="fb-disclaimer">{b.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
