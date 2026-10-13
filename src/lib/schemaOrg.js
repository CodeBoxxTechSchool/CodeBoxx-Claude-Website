// Schema.org JSON-LD shared by SeoHead.astro (Organization, BreadcrumbList), the blog post
// pages (BlogPosting), the Academy page (Course) and the Solutions and Corporate Training
// pages (Service).
import { SITE_URL } from './sitemap.js';
import { localizedHref } from './i18nRoutes.js';
import { CAMPUSES, COURSE_MODES, PACES, PROGRAM_FACTS, upcomingStarts } from './academyPrograms.js';
import { parseVideoUrl } from './portableText.js';

// Google wants a raster logo of at least 112 px, so not favicon.svg.
export const LOGO_URL = SITE_URL + '/icon-192.png';

const CODEBOXX = { '@type': 'Organization', name: 'CodeBoxx', url: SITE_URL + '/' };

// Sanity's post.author is free text: the company under varying spellings
// ("CodeBoxx Technology", "Codeboxx Technology") or a person's name.
export function postAuthor(name) {
  const trimmed = (name || '').trim();
  if (!trimmed || /codeboxx/i.test(trimmed)) return CODEBOXX;
  return { '@type': 'Person', name: trimmed };
}

// `url` must be the page's canonical URL (SeoHead's, trailing slash included).
export function blogPostingSchema({ post, url, image, inLanguage }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: [image],
    inLanguage,
    url,
    datePublished: post.date || undefined,
    dateModified: post.updatedAt || post.date || undefined,
    author: postAuthor(post.author),
    publisher: { ...CODEBOXX, logo: { '@type': 'ImageObject', url: LOGO_URL } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}

// One VideoObject per YouTube video in a post's body (its videoEmbed blocks), so Google can show
// the post in video results: the blog plays them behind a click-to-play thumbnail, which search
// engines don't see as a video. Vimeo has no thumbnail without an API call, and Google requires
// one, so only YouTube; a post with no date (Google requires uploadDate) gets none.
export function videoSchemas({ post }) {
  if (!post.date) return [];
  const ids = (post.content || [])
    .filter((block) => block._type === 'videoEmbed')
    .map((block) => parseVideoUrl(block.url))
    .filter((video) => video && video.provider === 'youtube')
    .map((video) => video.id);
  return [...new Set(ids)].map((id, i) => ({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: i ? `${post.title} (${i + 1})` : post.title,
    description: post.excerpt || post.title,
    thumbnailUrl: [`https://i.ytimg.com/vi/${id}/hqdefault.jpg`],
    uploadDate: post.date,
    embedUrl: `https://www.youtube.com/embed/${id}`,
  }));
}

const AREA_SERVED = [
  { '@type': 'Country', name: 'United States' },
  { '@type': 'Country', name: 'Canada' },
];

// One Course per Academy program (src/locales/{en,fr}/academy.js programs.items), for
// Google's course info results and for AI assistants quoting tuition, length and dates.
// Each program is offered on campus (both campuses) or online, full-time or part-time:
// one CourseInstance per mode and pace, per upcoming start date when the program has any.
// `starts`: the portal's start dates by program key (src/lib/cohorts.js).
export function courseSchemas({ programs, lang, starts, pageUrl }) {
  const fr = lang === 'fr';
  const provider = {
    '@type': 'EducationalOrganization',
    name: fr ? 'CodeBoxx Académie' : 'CodeBoxx Academy',
    url: pageUrl,
  };
  return programs
    .filter((p) => PROGRAM_FACTS[p.id])
    .map((p) => {
      const facts = PROGRAM_FACTS[p.id];
      const dates = upcomingStarts(p, starts);
      const instances = [];
      for (const courseMode of COURSE_MODES) {
        for (const pace of PACES) {
          const instance = {
            '@type': 'CourseInstance',
            name: `${p.title} (${paceLabel(pace, fr)}, ${modeLabel(courseMode, fr)})`,
            courseMode,
            courseWorkload: `P${facts.weeks[pace]}W`,
            ...(courseMode === 'Onsite' ? { location: CAMPUSES } : {}),
          };
          if (dates.length)
            dates.forEach((startDate) => instances.push({ ...instance, startDate }));
          else instances.push(instance);
        }
      }
      return {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: p.title,
        description: [p.who, ...(p.schedule || [])].join(' '),
        url: pageUrl + '#programs',
        provider,
        coursePrerequisites: p.who,
        offers: [
          {
            '@type': 'Offer',
            category: 'Paid',
            price: facts.price,
            priceCurrency: facts.currency,
            url: pageUrl + '#apply',
          },
        ],
        financialAidEligible: fr
          ? 'Plans de paiement et options de financement : ' + SITE_URL + '/fr/financement/'
          : 'Payment plans and financing options: ' + SITE_URL + '/financing/',
        hasCourseInstance: instances,
      };
    });
}

function paceLabel(pace, fr) {
  if (pace === 'fullTime') return fr ? 'temps plein' : 'full-time';
  return fr ? 'temps partiel' : 'part-time';
}

function modeLabel(mode, fr) {
  if (mode === 'Onsite') return fr ? 'sur le campus' : 'on campus';
  return fr ? 'en ligne' : 'online';
}

// A service CodeBoxx sells (Solutions' four services, Corporate Training). `offers`: the
// engagement formats, as { name, description }, listed in an OfferCatalog.
export function serviceSchema({ name, description, url, serviceType = name, offers = [] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType,
    url,
    provider: CODEBOXX,
    areaServed: AREA_SERVED,
    ...(offers.length
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name,
            itemListElement: offers.map((o) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: o.name, description: o.description },
            })),
          },
        }
      : {}),
  };
}

// Breadcrumb names for every inner page, by English path. A path missing here (a landing
// page under /lp/) gets no breadcrumbs; the last level of a blog post is the post's title.
const CRUMBS = {
  '/academy': ['Academy', 'Académie'],
  '/blog': ['CodeBlog', 'CodeBlog'],
  '/solutions': ['Solutions', 'Solutions'],
  '/corporate-training': ['Corporate Training', 'Formation en entreprise'],
  '/case-studies': ['Case Studies', 'Études de cas'],
  '/financing': ['Financing Options', 'Options de financement'],
  '/faq': ['FAQ', 'FAQ'],
  '/careers': ['Careers', 'Carrières'],
  '/pinellas-residents': ['Pinellas Residents', 'Résidents de Pinellas'],
  '/ventures': ['Ventures', 'Ventures'],
  '/ai-done-right': ['#AIDoneRight', '#AIDoneRight'],
  '/crewkit-forge-20': ['CrewKit Forge 20', 'CrewKit Forge 20'],
  '/crewkit-forge-20/dive-deeper': ['Dive Deeper', 'Approfondir'],
  '/privacy-policy': ['Privacy Policy', 'Politique de confidentialité'],
  '/terms-conditions': ['Terms & Conditions', 'Conditions générales'],
};

// BreadcrumbList for the page at `pathname` (either language): Home, then each level of
// its English path. null for the homepage and for paths CRUMBS doesn't know.
export function breadcrumbSchema({ pathname, lang, title }) {
  const fr = lang === 'fr';
  const enPath = localizedHref(pathname, 'en', pathname).replace(/\/+$/, '');
  if (!enPath) return null;
  const parts = enPath.split('/').filter(Boolean);
  const crumbs = [{ name: fr ? 'Accueil' : 'Home', url: SITE_URL + (fr ? '/fr/' : '/') }];
  for (let i = 0; i < parts.length; i++) {
    const path = '/' + parts.slice(0, i + 1).join('/');
    const known = CRUMBS[path];
    const isPost = !known && i === parts.length - 1 && path.startsWith('/blog/');
    if (!known && !isPost) return null;
    crumbs.push({
      name: known ? known[fr ? 1 : 0] : title,
      url: SITE_URL + localizedHref(path + '/', lang, path + '/'),
    });
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}
