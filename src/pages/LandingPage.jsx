import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TopBar, Footer } from '../components/Chrome';
import { useSanityLandingPage } from '../lib/sanity';
import { localizedHref, setLandingPageSlugs } from '../lib/routes';
import LandingHero from '../components/landing/LandingHero';
import LandingPlatform from '../components/landing/LandingPlatform';
import LandingWsjAd from '../components/landing/LandingWsjAd';
import LandingCrewkitAd from '../components/landing/LandingCrewkitAd';
import LandingStats from '../components/landing/LandingStats';

const SECTION_COMPONENTS = {
  sectionHero: LandingHero,
  sectionPlatform: LandingPlatform,
  sectionWsjAd: LandingWsjAd,
  sectionCrewkitAd: LandingCrewkitAd,
  sectionStats: LandingStats,
};

function NotFound() {
  const { t, i18n } = useTranslation();
  return (
    <div id="top">
      <TopBar
        onCodi={() => {
          window.location.href = localizedHref('#contact', i18n.language);
        }}
      />
      <section className="sect">
        <div className="wrap d-flex flex-column gap-3 align-items-start">
          <h1 className="h2">{t('landingPage.notFoundTitle')}</h1>
          <p className="pbody">{t('landingPage.notFoundBody')}</p>
          <a href={localizedHref('/', i18n.language)} className="link-tag">
            {t('landingPage.backToHome')}
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function LandingPage() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const page = useSanityLandingPage(slug, i18n.language);

  React.useEffect(() => {
    if (page) setLandingPageSlugs({ slug: page.slug, slugFr: page.slugFr });
    return () => setLandingPageSlugs(null);
  }, [page]);

  if (page === null) return <NotFound />;
  if (!page) return null;

  return (
    <div id="top">
      {page.showTopBar ? (
        <TopBar
          onCodi={() => {
            window.location.href = localizedHref('#contact', i18n.language);
          }}
        />
      ) : null}
      {page.sections.map((s, i) => {
        const Section = SECTION_COMPONENTS[s._type];
        return Section ? <Section key={i} data={s} lang={i18n.language} /> : null;
      })}
      {page.showFooter ? <Footer /> : null}
    </div>
  );
}

export default LandingPage;
