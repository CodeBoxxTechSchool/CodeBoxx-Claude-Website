import React from 'react';
import { Badge } from 'react-bootstrap';
import { pickLocale } from '../../lib/sanity';
import { ScriptTitle } from '../../pages/Home';

// Mirrors Home.jsx's Platform() ("01" section), but with fully custom content
// per landing page and plain external links instead of in-page anchors.
function LandingPlatform({ data, lang }) {
  const divisions = data.divisions || [];
  return (
    <section className="sect">
      <div className="wrap">
        <div className="section-head">
          <div className="d-flex flex-column gap-3">
            <ScriptTitle index="01">{pickLocale(data.eyebrow, lang)}</ScriptTitle>
            <h2 className="h2">{pickLocale(data.title, lang)}</h2>
            {data.lede ? <p className="lede">{pickLocale(data.lede, lang)}</p> : null}
          </div>
        </div>
        <div className="grid3">
          {divisions.map((d, i) => (
            <div key={i} className="panel panel-division">
              <div className="d-flex flex-column gap-3">
                <Badge bg="brand">{pickLocale(d.tag, lang)}</Badge>
                <h3 className="ptitle">{pickLocale(d.name, lang)}</h3>
                <p className="pbody">{pickLocale(d.blurb, lang)}</p>
                {d.extra ? <p className="pbody">{pickLocale(d.extra, lang)}</p> : null}
              </div>
              <div className="d-flex flex-column gap-4">
                <div className="rule" />
                <a href={d.linkUrl} target="_blank" rel="noopener noreferrer" className="link-tag">
                  {pickLocale(d.linkLabel, lang)}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LandingPlatform;
