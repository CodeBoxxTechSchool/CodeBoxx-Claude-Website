import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  blogPostingSchema,
  breadcrumbSchema,
  courseSchemas,
  LOGO_URL,
  postAuthor,
  serviceSchema,
} from '../schemaOrg.js';

const CODEBOXX = { '@type': 'Organization', name: 'CodeBoxx', url: 'https://codeboxx.ai/' };

test('postAuthor maps any CodeBoxx spelling, or no author, to the organization', () => {
  for (const name of ['CodeBoxx Technology', 'Codeboxx Technology', ' codeboxx ', '', null]) {
    assert.deepEqual(postAuthor(name), CODEBOXX, String(name));
  }
});

test('postAuthor maps anyone else to a Person', () => {
  assert.deepEqual(postAuthor(' Cédéric Noël '), { '@type': 'Person', name: 'Cédéric Noël' });
});

const POST = {
  title: 'AI Native Code Migration',
  excerpt: 'Excerpt',
  author: 'Nicolas Genest',
  date: '2026-07-16',
  updatedAt: '2026-09-30T15:45:11Z',
};
const PAGE_URL = 'https://codeboxx.ai/blog/ai-native-code-migration/';

test('blogPostingSchema points the page, url and logo at absolute URLs', () => {
  const schema = blogPostingSchema({ post: POST, url: PAGE_URL, image: 'img', inLanguage: 'en' });
  assert.equal(schema.url, PAGE_URL);
  assert.deepEqual(schema.mainEntityOfPage, { '@type': 'WebPage', '@id': PAGE_URL });
  assert.equal(schema.inLanguage, 'en');
  assert.deepEqual(schema.author, { '@type': 'Person', name: 'Nicolas Genest' });
  assert.deepEqual(schema.publisher, {
    ...CODEBOXX,
    logo: { '@type': 'ImageObject', url: LOGO_URL },
  });
  assert.equal(LOGO_URL, 'https://codeboxx.ai/icon-192.png');
  assert.equal(schema.datePublished, '2026-07-16');
  assert.equal(schema.dateModified, '2026-09-30T15:45:11Z');
});

test('blogPostingSchema falls back to datePublished without an edit date (seed posts)', () => {
  const { updatedAt, ...seed } = POST;
  const schema = blogPostingSchema({ post: seed, url: PAGE_URL, image: 'img', inLanguage: 'en' });
  assert.equal(schema.dateModified, '2026-07-16');
});

const PROGRAMS = [
  {
    id: 'fsd',
    title: 'AI Native Full-Stack Developer',
    who: 'People starting from no experience.',
    schedule: ['Full-time: 16 weeks.', 'Part-time: 32 weeks.'],
    starts: ['2026-09-14', '2026-11-09'],
  },
  { id: 'ai', title: 'Advanced AI Technologist', who: 'People who already program.', schedule: [] },
  { id: 'other', title: 'Not a program with facts' },
];
const ACADEMY = 'https://codeboxx.ai/academy/';

test('courseSchemas gives each program its tuition, provider and instances', () => {
  const [fsd, ai, ...rest] = courseSchemas({
    programs: PROGRAMS,
    lang: 'en',
    today: '2026-10-08',
    pageUrl: ACADEMY,
  });
  assert.equal(rest.length, 0, 'programs without facts are skipped');
  assert.equal(fsd['@type'], 'Course');
  assert.equal(fsd.name, 'AI Native Full-Stack Developer');
  assert.equal(
    fsd.description,
    'People starting from no experience. Full-time: 16 weeks. Part-time: 32 weeks.'
  );
  assert.deepEqual(fsd.offers, [
    {
      '@type': 'Offer',
      category: 'Paid',
      price: 12000,
      priceCurrency: 'USD',
      url: ACADEMY + '#apply',
    },
  ]);
  assert.equal(ai.offers[0].price, 9800);
  assert.deepEqual(fsd.provider, {
    '@type': 'EducationalOrganization',
    name: 'CodeBoxx Academy',
    url: ACADEMY,
  });
});

test('courseSchemas lists on-campus and online, full-time and part-time, for each upcoming start', () => {
  const [fsd, ai] = courseSchemas({
    programs: PROGRAMS,
    lang: 'en',
    today: '2026-10-08',
    pageUrl: ACADEMY,
  });
  // September 14 has passed: only November 9 remains, in 2 modes x 2 paces.
  assert.equal(fsd.hasCourseInstance.length, 4);
  assert.ok(fsd.hasCourseInstance.every((i) => i.startDate === '2026-11-09'));
  const byKey = Object.fromEntries(
    fsd.hasCourseInstance.map((i) => [i.courseMode + ' ' + i.courseWorkload, i])
  );
  assert.deepEqual(Object.keys(byKey).sort(), [
    'Online P16W',
    'Online P32W',
    'Onsite P16W',
    'Onsite P32W',
  ]);
  assert.equal(byKey['Onsite P16W'].location.length, 2, 'both campuses');
  assert.equal(byKey['Online P16W'].location, undefined);
  // On demand: no dates, one instance per mode and pace.
  assert.equal(ai.hasCourseInstance.length, 4);
  assert.ok(ai.hasCourseInstance.every((i) => !('startDate' in i)));
  assert.deepEqual(ai.hasCourseInstance.map((i) => i.courseWorkload).sort(), [
    'P12W',
    'P12W',
    'P24W',
    'P24W',
  ]);
});

test('courseSchemas names the French provider and labels in French', () => {
  const [fsd] = courseSchemas({
    programs: PROGRAMS,
    lang: 'fr',
    today: '2026-10-08',
    pageUrl: 'https://codeboxx.ai/fr/academie/',
  });
  assert.equal(fsd.provider.name, 'CodeBoxx Académie');
  assert.match(fsd.hasCourseInstance[0].name, /temps plein, sur le campus/);
  assert.match(fsd.financialAidEligible, /\/fr\/financement\/$/);
});

test('serviceSchema lists the engagement formats only when there are some', () => {
  const plain = serviceSchema({
    name: 'Agentic AI',
    description: 'Agents.',
    url: 'https://codeboxx.ai/solutions/#services',
  });
  assert.equal(plain['@type'], 'Service');
  assert.equal(plain.serviceType, 'Agentic AI');
  assert.deepEqual(plain.provider, CODEBOXX);
  assert.equal(plain.hasOfferCatalog, undefined);
  const training = serviceSchema({
    name: 'Corporate AI Training',
    description: 'd',
    url: 'u',
    offers: [{ name: 'Enterprise cohorts', description: 'A tailored program.' }],
  });
  assert.deepEqual(training.hasOfferCatalog.itemListElement, [
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Enterprise cohorts',
        description: 'A tailored program.',
      },
    },
  ]);
});

const crumbs = (pathname, lang, title) =>
  breadcrumbSchema({ pathname, lang, title })?.itemListElement.map((c) => [
    c.position,
    c.name,
    c.item,
  ]);

test('breadcrumbSchema: home, then each level, in the page language', () => {
  assert.deepEqual(crumbs('/academy/', 'en'), [
    [1, 'Home', 'https://codeboxx.ai/'],
    [2, 'Academy', 'https://codeboxx.ai/academy/'],
  ]);
  assert.deepEqual(crumbs('/fr/crewkit-forge-20/approfondir/', 'fr'), [
    [1, 'Accueil', 'https://codeboxx.ai/fr/'],
    [2, 'CrewKit Forge 20', 'https://codeboxx.ai/fr/crewkit-forge-20/'],
    [3, 'Approfondir', 'https://codeboxx.ai/fr/crewkit-forge-20/approfondir/'],
  ]);
});

test('breadcrumbSchema ends a blog post with its title', () => {
  assert.deepEqual(crumbs('/fr/blogue/un-article/', 'fr', 'Un article'), [
    [1, 'Accueil', 'https://codeboxx.ai/fr/'],
    [2, 'CodeBlog', 'https://codeboxx.ai/fr/blogue/'],
    [3, 'Un article', 'https://codeboxx.ai/fr/blogue/un-article/'],
  ]);
});

test('breadcrumbSchema skips the homepage and pages it has no name for', () => {
  assert.equal(breadcrumbSchema({ pathname: '/', lang: 'en', title: 'Home' }), null);
  assert.equal(breadcrumbSchema({ pathname: '/fr/', lang: 'fr', title: 'Accueil' }), null);
  assert.equal(breadcrumbSchema({ pathname: '/lp/spring-cohort/', lang: 'en', title: 'LP' }), null);
});
