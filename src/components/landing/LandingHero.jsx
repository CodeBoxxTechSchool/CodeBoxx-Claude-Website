import React from 'react';
import Logo from '../Logo';
import { pickLocale } from '../../lib/sanity';

// Mirrors Home.jsx's own top hero (the inline ".hero" block in <App>). The logo
// stays the site's existing Logo component — only text is editable.
function LandingHero({ data, lang }) {
  return (
    <div className="hero">
      <div className="d-flex">
        <span className="pill">{pickLocale(data.pill, lang)}</span>
      </div>
      <div className="d-flex justify-content-between align-items-end gap-5 flex-wrap">
        <h1>
          {pickLocale(data.titleBefore, lang)}
          <span className="text-brand">{pickLocale(data.titleHighlight, lang)}</span>
          {pickLocale(data.titleAfter, lang)}
        </h1>
        <div className="hero-logo">
          <Logo theme="dark" width={280} />
        </div>
      </div>
    </div>
  );
}

export default LandingHero;
