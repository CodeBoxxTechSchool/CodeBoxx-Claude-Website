import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { localizedHref } from '../lib/routes';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl, truncate } from '../lib/seo';

// Drop-in per-page <head> manager. Every route renders exactly one of these with its
// own title/description/image — react-helmet-async merges them in render order, so
// the last-mounted (i.e. current page's) tags win over any default set in index.html.
//
// title/description are plain strings already resolved by the caller (via
// useTranslation or, for a blog post, straight from the Sanity document) rather than
// translation keys, since a Sanity post's copy isn't in i18next at all.
function Seo({
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  structuredData,
}) {
  const { i18n } = useTranslation();
  const location = useLocation();
  const lang = i18n.language === 'fr' ? 'fr' : 'en';
  const pathname = location.pathname;
  const canonical = absoluteUrl(pathname);
  const enHref = absoluteUrl(localizedHref(pathname, 'en'));
  const frHref = absoluteUrl(localizedHref(pathname, 'fr'));
  const fullTitle = title.includes(SITE_NAME) ? title : title + ' | ' + SITE_NAME;
  const desc = truncate(description);
  const schemas = Array.isArray(structuredData)
    ? structuredData
    : structuredData
      ? [structuredData]
      : [];

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en" href={enHref} />
      <link rel="alternate" hrefLang="fr" href={frHref} />
      <link rel="alternate" hrefLang="x-default" href={enHref} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={lang === 'fr' ? 'fr_CA' : 'en_US'} />
      <meta property="og:locale:alternate" content={lang === 'fr' ? 'en_US' : 'fr_CA'} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

export default Seo;
