// Builds relay/codi-knowledge.json, the facts Codi (the Academy's admissions assistant,
// relay/codi.js) answers from, out of the site's own Academy and Corporate Training copy, so the
// assistant never says something the pages don't. The relay is deployed on its own and can't read
// src/, hence a generated file; relay/test/drift.test.js fails when it is out of date.
//
//   node scripts/build-codi-knowledge.mjs          # rewrites relay/codi-knowledge.json
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import academyEn from '../src/locales/en/academy.js';
import academyFr from '../src/locales/fr/academy.js';
import corporateEn from '../src/locales/en/corporate.js';
import corporateFr from '../src/locales/fr/corporate.js';

const SITE = 'https://codeboxx.com';

// A FAQ answer paragraph is a string or a list of strings and {label, href} links.
const text = (p) =>
  typeof p === 'string'
    ? p
    : p.map((s) => (typeof s === 'string' ? s : `${s.label} (${SITE}${s.href})`)).join('');

function academy(a, lang) {
  const page = lang === 'fr' ? '/fr/academie/' : '/academy/';
  return {
    page: SITE + page,
    apply: `${SITE}${page}#apply`,
    pitch: a.title,
    proof: `${a.proof.fact} (${a.proof.sourceLabel})`,
    director: `${a.director.name}, ${a.director.role}`,
    offer: `${a.offer.title} ${a.offer.contrast}`,
    programs: a.programs.items.map((p) => ({
      id: p.id,
      title: p.title,
      who: p.who,
      schedule: p.schedule,
      tuition: p.tuition,
      // ISO dates; the relay drops the past ones on each request.
      starts: p.starts ?? [],
      startsText: p.startsText ?? null,
    })),
    tuitionNote: a.programs.price.body,
    callHref: a.programs.price.href,
    riskFree: a.programs.riskFree.body,
    applySteps: a.apply.body,
    portal: a.apply.portalHref,
    employers: a.employers.items.map(([name, line, tag]) =>
      tag === 'partner' ? `${name} (${a.employers.partnerTag}): ${line}` : `${name}: ${line}`
    ),
    faq: a.faq.items.map(({ q, a: answer }) => ({ q, a: answer.map(text).join(' ') })),
    funding: a.funding.items.map(
      (f) =>
        `${f.title}: ${f.body}${f.href ? ` (${f.href.startsWith('/') ? SITE + f.href : f.href})` : ''}`
    ),
    fundingPage: SITE + a.funding.moreHref,
  };
}

// Corporate Training is a separate offer: Codi only routes companies to it.
function corporate(c, lang) {
  return {
    page: SITE + (lang === 'fr' ? '/fr/formation-entreprise/' : '/corporate-training/'),
    summary: c.hero.lede,
    formats: c.formats.items.map((f) => `${f.name}: ${f.body}`),
  };
}

export function buildKnowledge() {
  return {
    en: { academy: academy(academyEn, 'en'), corporate: corporate(corporateEn, 'en') },
    fr: { academy: academy(academyFr, 'fr'), corporate: corporate(corporateFr, 'fr') },
  };
}

export const OUT = fileURLToPath(new URL('../relay/codi-knowledge.json', import.meta.url));

if (import.meta.main) {
  writeFileSync(OUT, JSON.stringify(buildKnowledge(), null, 2) + '\n');
  console.log(`wrote ${OUT}`);
}
