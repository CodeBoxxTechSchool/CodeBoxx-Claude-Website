// /corporate-training: CodeBoxx for Businesses, a SKU of its own (not an Academy
// program). Sources, so every claim can be traced:
// - academy.codeboxx.com/corporate-training (its copy in this repo: home.js
//   `corporate`): the lede, "Our Secret Sauce", "Stay Ahead in the Digital Race",
//   the +300 / +100 figures, technical sales → software development → prompt
//   engineering.
// - Sanity posts: best-corporate-ai-bootcamps (engagement focus areas, Solutions +
//   Academy model, fractional CTO), top-ai-native-developer-training-programs-for-
//   businesses (online and on-site cohorts, curriculum fed by Solutions),
//   best-ai-workforce-upskilling-companies (GitHub/Jira/Confluence/approved LLM
//   context, security and compliance), best-ai-first-coding-academies-for-
//   corporate-training-in-north-america (CrewKit governance, analytics, shared
//   playbooks), the-challenges-and-solutions-of-tech-training-for-tampa-bay-
//   corporations-… (tailored modules, flexible on-site schedules, CaseGlide quote),
//   unlock-your-own-future-… (4-day Vibe Coding & Agentic AI workshop).
// - Loto-Québec (corporate training client), VideoAmp and Industrielle Alliance
//   (placement partners): confirmed by CodeBoxx leadership, Oct 2026.
// Left out on purpose (sources conflict or aren't about training clients): any
// placement rate, the +55K salary stat, named "training clients", USF CTPE.
export default {
  seo: {
    title: 'Corporate AI Training for Engineering Teams | CodeBoxx for Businesses',
    description:
      'Tailor-made, AI-native technology training for your teams, on-site or online. Built inside a working software and AI studio, governed with CrewKit, measured on real work.',
  },
  hero: {
    pill: 'CodeBoxx for Businesses',
    title: 'Make your team AI-native. On your code, in weeks.',
    lede: 'Build up your workforce with tailor-made technology training programs and exclusive access to our coding school’s pool of tech talent.',
    ctaPrimary: 'Design your program',
    ctaSecondary: 'How it works',
    note: 'On-site or online · United States and Canada',
  },
  stats: [
    ['+300', 'graduates making their mark at renowned companies'],
    ['+100', 'companies have employed our Business-First technologists'],
    ['2', 'divisions in one: a training academy and a working software and AI studio'],
  ],
  trust: {
    label: 'Trusted by',
    groups: [
      {
        title: 'Corporate training client',
        names: [{ name: 'Loto-Québec', logo: '/assets/logos/loto-quebec.webp' }],
      },
      {
        title: 'Placement partners',
        names: [
          // Sanity partnerLogo "VideoAmp" (same file the homepage slider uses).
          {
            name: 'VideoAmp',
            logo: 'https://cdn.sanity.io/images/zagi8xr3/production/bb1491c24211580ea849530ca94a681d3463c2ec-359x139.svg',
          },
          { name: 'Industrielle Alliance' },
        ],
      },
    ],
  },
  manifesto: {
    eyebrow: 'Why CodeBoxx',
    line: 'Training built inside a software studio, not a classroom.',
    pillars: [
      [
        'Fed by live delivery',
        'Our curriculum is continuously updated through our Solutions division: real client projects generate the insights that feed straight back into your program.',
      ],
      [
        'Governed, not just generated',
        'Most AI coding tools ask developers to generate code. CrewKit, our managed engineering infrastructure, asks them to govern it.',
      ],
      [
        'People who lead',
        'Our proprietary Pro Dev modules, designed with top tech employers, build communication, resiliency and leadership alongside the technical skills.',
      ],
    ],
  },
  learn: {
    eyebrow: 'What your teams learn',
    title: 'From limited tech experience to confidently shipping solutions.',
    body: 'From technical sales to software development to prompt engineering, every engagement is scoped to your goals. Most center on:',
    items: [
      [
        'AI-native software development',
        'Modern tooling, including Claude Code, AI-assisted environments and prompt-structured orchestration.',
      ],
      [
        'Human-AI workflow integration',
        'Where agents take the repetitive work and your people keep judgment and accountability.',
      ],
      [
        'Sprints aligned to production goals',
        'Collaborative sprint structures built around what your business actually needs to ship.',
      ],
      [
        'Deployment readiness at every level',
        'Junior and senior technical roles, trained to deploy, review and defend engineering decisions.',
      ],
      [
        'Governance and quality',
        'Shared playbooks and conventions that persist after the cohort ends.',
      ],
      [
        'Agentic AI development',
        'Engineering teams moving into agentic AI, with the guardrails enterprises require.',
      ],
    ],
  },
  formats: {
    eyebrow: 'Engagement formats',
    title: 'Pick the shape that fits your organization.',
    items: [
      {
        kicker: 'Most requested',
        name: 'Enterprise cohorts',
        body: 'A tailored program for your team, custom in scope and schedule, online or on-site. Training modules are built around the specific needs and goals of your company.',
      },
      {
        kicker: 'Fast start',
        name: 'Intensive workshops',
        body: 'Hands-on crash courses, like our 4-day Vibe Coding and Agentic AI workshop, attended virtually or in our dedicated classroom in St. Petersburg, FL.',
      },
      {
        kicker: 'Leadership',
        name: 'Fractional CTO & advisory',
        body: 'Senior-level AI strategy alongside workforce development, for organizations that need direction as well as skills.',
      },
      {
        kicker: 'Talent',
        name: 'Hire from the Academy',
        body: 'Exclusive access to our coding school’s pool of AI-native technologists, trained on the same standard as your team.',
        href: '/academy/',
        cta: 'Meet the Academy',
      },
    ],
  },
  process: {
    eyebrow: 'How it works',
    title: 'Four steps from first call to lasting capability.',
    steps: [
      [
        'Discover',
        'We map your goals, your stack and your security, compliance and infrastructure requirements.',
      ],
      [
        'Tailor',
        'Modules are built on your approved context: GitHub, Jira, Confluence, internal codebases and approved model providers.',
      ],
      [
        'Deliver',
        'On-site or online, on flexible schedules that minimize disruption to day-to-day operations.',
      ],
      [
        'Measure',
        'Session analytics, cost per AI-assisted task and agent performance, so progress shows up in numbers.',
      ],
    ],
  },
  sauce: {
    eyebrow: 'Our secret sauce',
    title: 'Skills get people hired. Character keeps teams shipping.',
    body: [
      'Beyond teaching the necessary technical skills, we cultivate a set of invaluable professional qualities, including effective communication, unwavering resiliency, and exceptional leadership. Our proprietary Pro Dev modules, designed in collaboration with top tech employers, help program participants develop these traits so they know how to work well individually and within a team, delivering results quickly and effectively.',
      'And we’re constantly working to innovate in this space and develop new programs that address modern challenges faced by today’s businesses.',
    ],
  },
  quote: {
    eyebrow: 'In their words',
    text: 'CodeBoxx’s new tech training program offers a valuable solution for local businesses by providing a structured and efficient way to enhance employees’ tech skills. This program helps businesses like ours stay competitive and fosters a culture of continuous learning and innovation.',
    name: 'Carly Todd',
    role: 'Co-founder, CaseGlide',
  },
  cta: {
    eyebrow: 'Stay ahead in the digital race',
    title: 'Let’s build your team’s program.',
    body: 'Tell us where your team is today and where it needs to be. One reply from a human, within one business day.',
    primary: 'Talk to our team',
  },
};
