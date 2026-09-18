import React from 'react';
import LandingHero from './LandingHero';
import LandingPlatform from './LandingPlatform';
import LandingWsjAd from './LandingWsjAd';
import LandingCrewkitAd from './LandingCrewkitAd';
import LandingStats from './LandingStats';

const SECTION_COMPONENTS = {
  sectionHero: LandingHero,
  sectionPlatform: LandingPlatform,
  sectionWsjAd: LandingWsjAd,
  sectionCrewkitAd: LandingCrewkitAd,
  sectionStats: LandingStats,
};

// Dispatches each landingPage document's `sections` array (already resolved at
// build time by getStaticPaths in pages/lp/[slug].astro) to its renderer by
// `_type`. Mounted as a single island so LandingWsjAd's CTA button works.
export default function LandingSections({ sections, lang }) {
  return (
    <React.Fragment>
      {(sections || []).map((s, i) => {
        const Section = SECTION_COMPONENTS[s._type];
        return Section ? <Section key={i} data={s} lang={lang} /> : null;
      })}
    </React.Fragment>
  );
}
