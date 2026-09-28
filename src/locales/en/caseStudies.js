// Content from https://www.solutions.codeboxx.com/case-studies. Wix's fourth case
// study (tagged Lucky Brand, Catalyst Group, SPARC) is left out: its text there
// is a copy of the eBay study, not its own.
export default {
  seo: {
    title: 'Case Studies — CodeBoxx Solutions',
    description:
      'Partner success stories from CodeBoxx: Full Harvest, Humania Assurance and eBay — from MVP to production, with the teams, timelines and technology behind each.',
  },
  pill: 'Case Studies',
  band: {
    title: 'Successful from MVP to Production',
    lede: 'All projects are different, but our goal is always the same: deliver the best! Discover our partners’ success stories and the case studies behind them.',
  },
  intro: {
    eyebrow: 'PARTNER SUCCESS STORIES',
    title: 'Introducing Our Partner Success Stories',
    subtitle: 'Rebuilding Trust. Delivering Outcomes. Operationalizing Intelligence.',
    body: [
      'Technology was supposed to be the great accelerator of business. Instead, for too many companies, it became the great frustration.',
      'Bloated roadmaps. Outsourced chaos. Detached technologists building for elegance instead of impact. Budgets burned. Momentum lost. Trust eroded.',
      'That’s where our partners usually meet us. Not at the beginning. At the breaking point. And that’s exactly where CodeBoxx does its best work.',
    ],
  },
  badge: 'Case Study',
  labels: {
    mandate: 'Mandate',
    duration: 'Duration',
    resources: 'Resources',
    solution: 'Solution',
    technology: 'Technology',
  },
  cases: [
    {
      client: 'Full Harvest',
      logo: '/assets/case-studies/full-harvest.png',
      body: [
        'Full Harvest is an example of a Ventures client where we consult & assess technology, operational & staff needs to help address immediate & long term needs. The client secured their B-Series round of funding & needed to quickly stand up an internal IT team. They partnered with CodeBoxx to build a customized 4-month training curriculum targeting their specific requirements, and our Academy successfully identified, trained, and delivered 9 qualified developers to establish their team.',
        'CodeBoxx provided the services of a fractional CTO for technology design, conditioning & definition. Our fractional services model is ideally suited to ventures/startups that need to build IT teams quickly & affordably based on their unique requirements.',
      ],
      mandate: 'Create a Technology Operations Team to support ongoing platform.',
      duration: '4 months',
      resources: '9 developers hired',
      solution: ['Customized Academy', 'Build an IT Team'],
      technology: 'React, Ruby',
    },
    {
      client: 'Humania Assurance',
      logo: '/assets/case-studies/humania.png',
      body: [
        'A large Canadian Insurance business needed to move forward in digitalization but did not have the internal IT resources available to execute in the time required. They engaged CodeBoxx to provide a turnkey development team, including a senior developer and 6 junior developers. In the first 4 months, this dedicated team designed and delivered a customized client platform that met Humania’s digitalization objectives.',
        'At project completion, all 6 CodeBoxx developers on the project team were hired by the client.',
      ],
      mandate: 'Increase capacity in digital transformation',
      duration: '9-Month Development Project',
      resources: '6 developers hired',
      solution: ['Customized Academy', 'Build an IT Team'],
      technology: 'React, Ruby on Rails, GraphQL',
    },
    {
      client: 'eBay',
      logo: '/assets/case-studies/ebay.png',
      body: [
        '25 personnel were trained by our experienced team of senior developers to meet eBay’s needs for software development and implementation of authentication, warehouse management, and vault management software.',
        'CodeBoxx continues to maintain a long-term collaboration with eBay and our experienced developers are still actively working on their long-term projects.',
      ],
      mandate:
        'Developed and implemented various software solutions with a team of developers. Some of whom were hired as permanent members of the client’s team.',
      duration: 'August 2021 - Ongoing',
      resources: 'Up to 25 developers, including 2 hired for specific purpose',
      solution: [
        'Authentication platform',
        'Warehouse management system',
        'RFID tracking system',
        'Fulfillment system integration',
        'Data warehouse',
        'CodeBoxx-trained resources hired by eBay',
      ],
      technology: 'React, Ruby on Rails, GraphQL',
    },
  ],
  services: {
    eyebrow: 'SERVICES',
    title: 'Other Services at CodeBoxx',
    // [label, href] — hrefs go through localizedHref (homepage sections).
    items: [
      ['Corporate Training', '#academy-courses'],
      ['CTO as a Service', '#solutions'],
      ['Advisory Service', '#solutions'],
      ['Custom Software Development', '#solutions'],
    ],
  },
  cta: {
    eyebrow: 'CHALLENGE US',
    title: 'Your project is interesting, challenge us and you will see the velocity of our team.',
    contact: 'Contact Us',
  },
};
