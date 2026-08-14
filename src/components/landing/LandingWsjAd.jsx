import React from 'react';
import { Button } from 'react-bootstrap';
import { pickLocale } from '../../lib/sanity';

// Mirrors Home.jsx's WSJTeaser() band. The logo image stays the site's
// existing static asset — only text/link are editable per landing page.
function LandingWsjAd({ data, lang }) {
  return (
    <section className="band-dark">
      <div className="wrap band-dark-inner">
        <img
          alt="Wall Street Journal logo"
          src="/assets/the-wall-street-journal.png"
          style={{ width: 320, height: 'auto' }}
        />
        <h2 className="band-heading">{pickLocale(data.heading, lang)}</h2>
        <p className="band-body">{pickLocale(data.body, lang)}</p>
        {data.ctaUrl ? (
          <Button onClick={() => window.open(data.ctaUrl, '_blank', 'noopener')}>
            {pickLocale(data.ctaLabel, lang)}
          </Button>
        ) : null}
      </div>
    </section>
  );
}

export default LandingWsjAd;
