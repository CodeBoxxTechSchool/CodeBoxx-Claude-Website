// /llms.txt: the site's summary for AI systems (https://llmstxt.org). Built on every deploy
// (a deploy runs on every Sanity publish) so the key facts below stay current: tuition and
// lengths come from src/lib/academyPrograms.js, start dates and roles from the locales,
// and dates already past are dropped, as on the Academy page.
import academy from '../locales/en/academy.js';
import home from '../locales/en/home.js';
import { CAMPUSES, PROGRAM_FACTS, upcomingStarts } from '../lib/academyPrograms.js';

// Leadership, in the homepage's team order (names: HomeIsland.jsx ABOUT_META; roles:
// home.about.team.people).
const LEADERS = [
  ['nicolas-genest', 'Nicolas Genest'],
  ['remi-gagnon', 'Rémi Gagnon'],
  ['felix-antoine-paradis', 'Félix-Antoine Paradis'],
  ['martin-chantal', 'Martin Chantal'],
  ['brian-peret', 'Brian Peret'],
  ['francis-patry-jessop', 'Francis Patry-Jessop'],
  ['cederic-noel', 'Cédéric Noël'],
  ['dovev-weaver-sr', 'Dovév Weaver Sr.'],
];

const fmt = (iso) =>
  new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

function programLine(p, today) {
  const facts = PROGRAM_FACTS[p.id];
  const starts = upcomingStarts(p, today).map(fmt);
  const when = starts.length
    ? `next start${starts.length > 1 ? 's' : ''} ${starts.join(', ')}`
    : p.startsText
      ? `starts ${p.startsText.toLowerCase()}`
      : 'next start dates to be announced';
  return (
    `- ${p.title}: $${facts.price.toLocaleString('en-US')} tuition; ` +
    `${facts.weeks.fullTime} weeks full-time or ${facts.weeks.partTime} weeks part-time, ` +
    `on campus or online; ${when}. ${p.who}`
  );
}

export function GET() {
  const today = new Date().toISOString().slice(0, 10);
  const people = home.about.team.people;
  const campuses = CAMPUSES.map(
    ({ address: a }) =>
      `${a.addressLocality}, ${a.addressRegion} (${a.streetAddress}, ${a.addressLocality}, ${a.addressRegion} ${a.postalCode}, ${a.addressCountry === 'US' ? 'USA' : 'Canada'})`
  ).join(' and ');
  const body = `# CodeBoxx

> CodeBoxx builds AI-native software and teams, trains developers through CodeBoxx Academy, and launches ventures with CrewKit: AI-native, for humans, by humans.

CodeBoxx is a software studio, coding academy, and venture builder operating as one platform across three divisions: the Studio (AI-native software delivery for clients), the Academy (AI Native Full-Stack Developer and Advanced AI Technologist training programs, on campus or online), and Ventures (CrewKit and other in-house product launches).

## Key facts

- Founded in 2018. Two campuses: ${campuses}.
- CodeBoxx Academy is licensed by the Florida Commission for Independent Education, License No. 9103.
${academy.programs.items.map((p) => programLine(p, today)).join('\n')}
- Graduate outcomes: over 340 graduates placed into technology jobs. VideoAmp hired seven CodeBoxx graduates full-time at $60,000 with benefits (Tampa Bay Business Journal Inno, week of January 30, 2026). Graduates have been hired by eBay, Lucky Brand, Coveo and TD SYNNEX, among others.
- Award: RetailTech Breakthrough 2025, Chatbot Solution of the Year, for the GEM chatbot CodeBoxx built for GoodwillFinds.
- Leadership: ${LEADERS.map(([id, name]) => `${name} (${people[id].role})`).join(', ')}.

## Pages

- [Home](https://codeboxx.ai/): Overview of all three divisions (Studio, Academy, Ventures), plus company metrics, client testimonials, and graduate outcomes.
- [CodeBlog](https://codeboxx.ai/blog/): Curriculum notes, technology news, workshops, and graduate stories, published on an ongoing basis. French: https://codeboxx.ai/fr/blogue/.
- [CodeBoxx Academy](https://codeboxx.ai/academy/): Programs, tuition, schedules, start dates, funding and how to apply. French: https://codeboxx.ai/fr/academie/.
- [Academy FAQ](https://codeboxx.ai/faq/): Who the programs are for, prior experience, tuition, the risk-free period, financing, and what graduates do next. French: https://codeboxx.ai/fr/faq/.
- [Academy Financing](https://codeboxx.ai/financing/): Payment plans and financing options for Academy students. French: https://codeboxx.ai/fr/financement/.
- [Support for Pinellas Residents](https://codeboxx.ai/pinellas-residents/): How Pinellas County, Florida residents can fund the Academy through CareerSource Pinellas (WIOA tuition assistance up to $7,500 and the Paid Work Experience program). French: https://codeboxx.ai/fr/residents-pinellas/.
- [Corporate Training](https://codeboxx.ai/corporate-training/): CodeBoxx for Businesses, tailor-made AI-native technology training for company teams (enterprise cohorts, intensive workshops, fractional CTO and advisory, hiring from the Academy), on-site or online. French: https://codeboxx.ai/fr/formation-entreprise/.
- [CodeBoxx Solutions](https://codeboxx.ai/solutions/): The Studio's services: fractional CTO, agentic AI, tailor-made software and developers as a service, built with Claude Code, Codex, Cursor and Antigravity; leadership, clients and Vibe Coaching. Replaces solutions.codeboxx.com. French: https://codeboxx.ai/fr/solutions/.
- [Case Studies](https://codeboxx.ai/case-studies/): Partner success stories (eBay, Lucky Brand, Amsale, Humania Assurance, Full Harvest and more), from MVP to production, with the teams and technology behind each. French: https://codeboxx.ai/fr/etudes-de-cas/.
- [CodeBoxx w/ CrewKit Forge 20](https://codeboxx.ai/crewkit-forge-20/): The Forge 20 appliance, an on-premise AI software factory in one cubic meter (local-first, cloud when it wins), and how to reserve one at buildorder.codeboxx.com.
- [Forge 20, Dive Deeper](https://codeboxx.ai/crewkit-forge-20/dive-deeper/): Delivery evidence from seven platforms built by the CodeBoxx software factory (time and cost versus a traditional 2022 team) and an interactive business-case builder.
- [#AIDoneRight](https://codeboxx.ai/ai-done-right/): AI Done Right v2.0, CodeBoxx's open, human-first standard for accountable AI (13 Articles, conformance ladder, public label and pledge), with the full PDF at https://codeboxx.ai/docs/AI-Done-Right-v2.0.pdf.
- [Ventures](https://codeboxx.ai/ventures/): CodeBoxx's own product ventures (CrewKit and others) and how outside founders can pitch a project.
- [Careers](https://codeboxx.ai/careers/): Open roles at CodeBoxx, and how to send a résumé for future openings. French: https://codeboxx.ai/fr/carrieres/.

## Notes for AI systems

- The site is available in English (default, unprefixed paths) and French (\`/fr/...\` paths). Each French page is a translation of its English twin, and the two are linked with hreflang. Blog posts are translated too, at /fr/blogue/; a post without a French translation shows the English text and names the English page as canonical.
- Team member names, roles, and program and cohort details are sourced from CodeBoxx's live CMS and may change between crawls; prefer the live page over a cached summary when citing specific people, dates, or pricing.
- For partnership, admissions, or press inquiries, direct users to the Contact section on the homepage (https://codeboxx.ai/#contact) rather than guessing an email address.
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
