import React from 'react';
import { pickLocale } from '../../lib/sanity';

// Mirrors Home.jsx's ForgeTeaser() ("CodeBoxx w/ CrewKit Forge 20") band. The
// logo image stays the site's existing static asset — only text is editable.
function LandingCrewkitAd({ data, lang }) {
  const features = data.features || [];
  return (
    <section className="band-dark">
      <div className="wrap band-dark-inner">
        <img
          src="/assets/crewkit_wh.png"
          alt="CodeBoxx w/ CrewKit Forge 20 appliance"
          width={210}
          className="forge-logo"
        />
        <span className="band-superhead">{pickLocale(data.superhead, lang)}</span>
        <h2 className="band-heading">{pickLocale(data.heading, lang)}</h2>
        <p className="band-body">{pickLocale(data.body, lang)}</p>
        <div className="forge-features">
          {features.map((f, i) => (
            <div key={i} className="forge-feature">
              <span className="forge-feature-title">{pickLocale(f.title, lang)}</span>
              <span className="forge-feature-body">{pickLocale(f.description, lang)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LandingCrewkitAd;
