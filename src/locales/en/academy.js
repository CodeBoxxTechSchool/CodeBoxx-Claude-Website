// /academy: the one CodeBoxx Academy page (academy.codeboxx.com 301s here, see
// ops/nginx/redirects.tsv). Every fact below comes from academy.codeboxx.com (its
// copies in this repo: faq.js, financing.js, pinellas.js) or from the cutover brief,
// with the source named next to it. Where two old pages disagree, the fact is left
// out and a TODO says which sources conflict: pick one source before publishing it.
//
// Not on this page on purpose: "The best kept secret in North America", the
// +100 / +55K stats (the graduate count is in the title, updated to 340+), any placement rate, "no upfront costs", ISAs, the Wall
// Street Journal banner, and studio proof (Forge, Lucky Brand, Suitely).
export default {
  seo: {
    title: 'CodeBoxx Academy: Coding School in St. Petersburg, FL',
    description:
      'A licensed school that teaches AI and technology for business readiness, with over 340 graduates already placed into technology jobs. A 16-week full-stack program from no experience, and an AI track for programmers.',
  },
  pill: 'CodeBoxx Academy',
  // 1. One sentence.
  // Graduate count (340+) confirmed by CodeBoxx leadership, Oct 2026.
  title:
    'A licensed school that teaches AI and Technology for business readiness. Over 340 graduates strong with the new kind of smart already placed into technology jobs.',
  applyCta: 'Apply',
  // 2. The hero fact, and only this one.
  proof: {
    eyebrow: 'Placement',
    fact: 'VideoAmp hired seven CodeBoxx graduates full-time at $60,000 with benefits, and they asked for CodeBoxx graduates.',
    sourceLabel: 'Tampa Bay Business Journal Inno, week of January 30, 2026',
    // Linked from CodeBoxx's own post on it (Sanity post
    // inno-roundup-codeboxx-s-latest-partnership-with-1b-valued-california-adtech-company).
    sourceHref:
      'https://www.bizjournals.com/tampabay/news/2026/02/04/inno-newsletter-codeboxx.html',
  },
  // 3. Who runs it.
  director: {
    eyebrow: 'Who runs it',
    name: 'Brian Peret',
    role: 'Director of Academy',
    profileLabel: 'Read his profile in American Banker',
    profileHref:
      'https://www.americanbanker.com/news/how-brian-peret-went-from-inmate-to-ai-academy-director',
    linkedin: 'https://www.linkedin.com/in/brian-peret-b62636101/',
    linkedinLabel: 'LinkedIn',
  },
  // 4. The offer; the contrast line is used as written.
  offer: {
    eyebrow: 'The offer',
    title:
      'A 16-week program that ends inside a real pod. Placement is the exit criterion, not a job board.',
    contrast:
      'They are selecting 50 people who already built something, in San Francisco, in 2027. We start from no experience, with the latest and greatest in applied AI, we’ve been at it since 2018 and we can give you a start date you can put on a calendar.',
  },
  // 5. Who it is for, schedule, price, apply.
  programs: {
    eyebrow: 'Programs',
    title: 'Who it is for, when it runs, and how to apply',
    whoLabel: 'Who it is for',
    scheduleLabel: 'Schedule',
    startsLabel: 'Next start',
    tuitionLabel: 'Tuition',
    items: [
      {
        id: 'fsd',
        title: 'AI Native Full-Stack Developer',
        // academy.codeboxx.com/full-stack-development: no prior experience.
        who: 'People starting from no experience. No prior programming required.',
        schedule: ['Full-time: 16 weeks, 35–40 hours a week.', 'Part-time: 32 weeks.'],
        // academy.codeboxx.com/full-stack-development. Dates already past at build
        // time are dropped by the page (src/pages/academy.astro).
        starts: ['2026-09-14', '2026-11-09'],
        noDates: 'Next start dates coming soon.',
        tuition: '$12,000',
        apply: 'Apply to Full-Stack',
      },
      {
        id: 'ai',
        title: 'Advanced AI Developer',
        // academy.codeboxx.com/artificial-intelligence. Not "we accept everyone":
        // this track has prerequisites.
        who: 'People who already program. Requires prior programming experience and SQL.',
        // The AI page also says "six weeks", which conflicts with 12 / 24: dropped.
        schedule: ['Full-time: 12 weeks.', 'Part-time: 24 weeks.'],
        startsText: 'On Demand',
        tuition: '$9,800',
        apply: 'Apply to AI Developer',
      },
    ],
    price: {
      title: 'Tuition and deposit',
      // Tuition confirmed by CodeBoxx leadership (Oct 2026): $12,000 for AI Native
      // Full-Stack, $9,800 for Advanced AI. The deposit amount is still unconfirmed
      // (academy.codeboxx.com said $1,000), so it isn't published.
      lines: [
        ['AI Native Full-Stack Developer', '$12,000'],
        ['Advanced AI Developer', '$9,800'],
      ],
      body: 'Ask admissions about the deposit and payment schedule before you commit.',
      cta: 'Schedule a call',
      href: 'https://calendly.com/raina-dejute-codeboxx/30min',
    },
    riskFree: {
      title: 'Risk-free period',
      // TODO(academy-cutover): the duration conflicts. /full-stack-development (and
      // /coding-school-financing-options) say 2 weeks of the 16-week program and 4
      // of the 32-week one; /artificial-intelligence says 1 / 2 weeks in its table
      // and 2 / 4 in its prose. Publish no duration until one source is chosen.
      body: 'The first 12% of the program is risk-free: if you leave during it, your deposit is refunded.',
    },
  },
  apply: {
    eyebrow: 'Apply',
    title: 'Registration reserves a seat.',
    body: 'Pick your program and apply. We then email you a link to create your student portal account and continue your admission.',
    portalPrompt: 'Already have a portal account? ',
    portalLabel: 'Log in to the student portal',
    portalHref: 'https://portal.codeboxx.dev/Identity/Account/Login',
  },
  // 6. Graduate stories (Academy graduates only, never studio clients).
  stories: {
    eyebrow: 'Graduates',
    title: 'Where they were. Where they are.',
    whereIWas: 'Where I was',
    whereIAm: 'Where I Am',
    // These lead; the rest follow in their Sanity order.
    lead: ['Gabby C.', 'Vanessa P.'],
    // Fallback when Sanity has no graduateTestimonial documents (moved from home.js).
    seed: [
      {
        photo: '/assets/miachel.avif',
        name: 'Michael P.',
        role: 'Junior Software Developer',
        before:
          'Before CodeBoxx, I was a project manager in commercial and industrial HVAC construction. During the program, I was offered the opportunity to buy the company and continue to grow it. I decided to take on the challenge!',
        after:
          "For me, CodeBoxx is a team of people who are passionate about the field and who helped me acquire knowledge that I didn't have before, while having fun doing it. It's a great gateway into the tech field!",
      },
      {
        photo: '/assets/colby.avif',
        name: 'Cody C.',
        role: 'Junior Software Developer',
        before:
          'Before Codeboxx, I was working full-time in ministry, mentoring men in early recovery and finding deep fulfillment in that calling. Yet I also wanted to launch a career path that could sustain me long term. Codeboxx opened that door, taking me from zero tech experience to building a career in the tech industry.',
        after:
          'Now I serve as a coach at CodeBoxx, guiding new students while still continuing my ministry work. For me, Codeboxx is more than just a training program — it’s the bridge between purpose and sustainability, and a place where I can pay it forward.',
      },
      {
        photo: '/assets/gavriel.avif',
        name: 'Gavriel R.',
        role: 'Junior Software Developer',
        before:
          'I moved to Florida from the UK after dropping out of university. I was running a food truck business while studying for a part-time degree.',
        after:
          'I became a coach specializing in AI, ML, and DS, and now I’m the lead software engineer at Journey Viral, a rapidly growing and exciting start-up, developing AI integrations, GCloud infra, React FED, Python, and PostgreSQL BED.\n\nCodeBoxx provided a flexible, supportive space to hone my craft, push myself, and redefine my limits. It taught me a lot about leadership in tech.',
      },
      {
        photo: '/assets/william.avif',
        name: 'William M.',
        role: 'Junior Software Developer',
        before:
          'Before CodeBoxx I worked in construction. Everything from building/fixing pallets, mixing, pouring, finishing concrete trenches and lids, to operating forklifts and front end loaders.',
        after:
          'Today I help coach the same Full Stack Development program that I went through. Help facilitate an AI Literacy class through partnerships CodeBoxx has. I continue to sharpen my development skills by working on various projects. CodeBoxx has transcended the core pillars into a way of life for me. It has been completely life changing! No more manual labor beating up my body that gave little meaning to my life. CodeBoxx has become a second family to me.',
      },
      {
        photo: '/assets/gaby.avif',
        name: 'Gabby C.',
        role: 'Junior Software Developer',
        before:
          'I was the general manager at a tea bar in downtown St. Pete from 2019 - 2023. Seeing no growth or future with the company and also being burnt out from the customer service industry, I decided to take the full stack development course at CodeBoxx.',
        after:
          'Right after graduating, I got a job offer from RevStar (my top choice).\n\nIn 4 months, I took a 16-week coding course, changed my career to software development, and got my dream job!\n\nThis career change shaped me into the individual I am proud to be today.',
      },
      {
        photo: '/assets/tim.avif',
        name: 'Tim W.',
        role: 'Junior Software Developer',
        before:
          "I did labor-intensive jobs my whole life. I started as a welder at the shipping docks straight out of high school. Fast forward almost 10+ years and several jobs later, I started to realize I couldn't keep doing this.",
        after:
          "I found CodeBoxx and discovered that my passion for building things could be applied to coding. Now, I'm furthering my learning as a Full Stack Developer while becoming a part of a great community of like-minded coders, who are always collaborating and growing.",
      },
      {
        photo: '/assets/vanessa.avif',
        name: 'Vanessa P.',
        role: 'iOS App Developer',
        before:
          'I got my diploma in culinary arts and made pastries for about 10 years. When I was ​looking to switch fields, CodeBoxx was at the top of my list.',
        after:
          "My first placement out of CodeBoxx was for Bond, a fashion company. Today I am a mobile developer at eBay. There are plenty of options for me now, as opposed to the service industry. I'm very grateful that I decided to go with CodeBoxx.",
      },
      {
        photo: '/assets/abdul.avif',
        name: 'Abdul R.',
        role: 'Software Developer',
        before:
          "I started working at McDonald's at 16. And then I moved into gig work - Uber, GrubHub, DoorDash, you name it. I was trading money for time and working from 8 AM to midnight. I knew something had to change.",
        after:
          "I'm in another part of my career. And that's the key word - career. It's not the clock-in, clock-out work from before. It's a career I can be in and grow into as I get older.",
      },
    ],
  },
  // 7. Academy placements only, one sentence each. Coveo and TD Synnex are named on
  // academy.codeboxx.com/frequently-asked-questions, Cybercat (and Coveo) on
  // /coding-school-financing-options (see faq.js and financing.js). Never Google,
  // Meta or Amazon, and never studio clients.
  employers: {
    eyebrow: 'Employers',
    title: 'Placement partners and employers',
    // [name, line, tag?]. VideoAmp and Industrielle Alliance are placement partners
    // (confirmed by CodeBoxx leadership, Oct 2026).
    partnerTag: 'Placement partner',
    items: [
      ['VideoAmp', 'Asked for CodeBoxx graduates and hired seven of them full-time.', 'partner'],
      ['Industrielle Alliance', 'Hires CodeBoxx graduates.', 'partner'],
      ['Coveo', 'Has hired CodeBoxx graduates.'],
      ['TD Synnex', 'Has hired CodeBoxx graduates.'],
      ['Cybercat', 'Has hired CodeBoxx graduates.'],
    ],
  },
  // 8. FAQ and funding. Answers use the same paragraph shape as faq.js.
  faq: {
    eyebrow: 'FAQ',
    title: 'Your questions, answered',
    items: [
      {
        q: 'Do I need prior experience?',
        a: [
          'Not for Full-Stack: it starts from no experience.',
          'The Advanced AI Developer track requires prior programming experience and SQL.',
        ],
      },
      {
        q: 'How long are the programs?',
        a: [
          'Full-Stack: 16 weeks full-time, at 35–40 hours a week, or 32 weeks part-time.',
          'Advanced AI Developer: 12 weeks full-time or 24 weeks part-time.',
        ],
      },
      {
        q: 'How much does it cost?',
        a: [
          'AI Native Full-Stack Developer: $12,000. Advanced AI Developer: $9,800.',
          [
            'Installment plans and local funding can cover all or part of it; see ',
            { label: 'Funding', href: '/academy/#funding' },
            '.',
          ],
        ],
      },
      {
        q: 'When is the next cohort?',
        a: [
          [
            'Full-Stack cohorts start on fixed dates, listed under ',
            { label: 'Programs', href: '/academy/#programs' },
            '. Advanced AI Developer cohorts start on demand.',
          ],
        ],
      },
      {
        q: 'How do I apply?',
        a: [
          [
            'Registration reserves a seat. ',
            { label: 'Apply here', href: '/academy/#apply' },
            ', then create your student portal account from the link we email you to continue your admission.',
          ],
        ],
      },
      {
        q: 'Is there a risk-free period?',
        a: [
          'Yes. The first 12% of the program is risk-free: if you leave during it, your deposit is refunded.',
        ],
      },
      {
        q: 'What do CodeBoxx students do after graduation?',
        // From academy.codeboxx.com/frequently-asked-questions (faq.js).
        a: [
          'During the program, we provide career coaching and guide you through creating a resume, LinkedIn, GitHub, and acing interviews so you can confidently start your job search as soon as (or even before!) you complete the program.',
          "And with CodeBoxx for Life, you'll have lifelong access to a community of employers, coaches, and alumni to lean on for career-building strategies, advice on complex technical projects, and more.",
        ],
      },
    ],
  },
  // Only what academy.codeboxx.com/coding-school-financing-options lists (financing.js
  // and pinellas.js), with a link to the full page.
  funding: {
    eyebrow: 'Funding',
    title: 'Ways to pay for it',
    items: [
      {
        title: 'MiaShare',
        body: 'Installment plans at 0% interest that do not affect your credit score. US-based students only.',
        href: 'https://codeboxxtechnology.mia-share.com/apply/programs',
        cta: 'Apply with MiaShare',
      },
      {
        title: 'Desjardins',
        body: 'Financing for residents of Canada.',
      },
      {
        title: 'Windmill Microcredits',
        body: 'Affordable career loans for qualified newcomers.',
      },
      {
        title: 'CareerSource Pinellas',
        body: 'Pinellas County, Florida residents: local funding through CareerSource can cover all or part of your tuition.',
        href: '/pinellas-residents/',
        cta: 'Pinellas residents',
      },
    ],
    // TODO(academy-cutover): the brief also lists Florida grants and laptop loans;
    // neither is in this repo's copy of the financing page, and that page couldn't be
    // re-read from here. Add them once confirmed on it.
    more: 'See every financing option',
    moreHref: '/financing/',
  },
};
