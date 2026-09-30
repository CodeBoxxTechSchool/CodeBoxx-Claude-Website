// Content from https://www.solutions.codeboxx.com/case-studies and /portfolio.
// Each case: client, optional project name and logo, story paragraphs, then the
// facts, all optional except as noted (mandate / duration / resources /
// technology strings, solution list). The portfolio page lists only the services
// delivered for its projects, so those cases carry just `solution`.
export default {
  seo: {
    title: 'Case Studies — CodeBoxx Solutions',
    description:
      'Partner success stories from CodeBoxx: eBay, Lucky Brand, Amsale, Humania Assurance, Full Harvest and more — from MVP to production, with the teams and technology behind each.',
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
      project: 'Digitalization Initiative',
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
      project: 'eBay Authenticator & eBay Vault',
      logo: '/assets/case-studies/ebay.png',
      body: [
        '25 personnel were trained by our experienced team of senior developers to meet eBay’s needs for software development and implementation of authentication, warehouse management, and vault management software.',
        'Our custom-developed authenticator software utilizes a series of strict processes to verify the authenticity of each high-value item, resulting in increased customer trust and satisfaction.',
        'Our warehouse management software improved the efficiency and accuracy of eBay’s logistics and inventory management processes, enabling their customers to receive their products faster.',
        'Our vault management software was specifically designed to meet the needs of eBay’s high-value items, such as collectibles and valuable merchandise. The software ensures that these items are stored and handled properly, providing an added layer of security and protection.',
        'Finally, our sneakers authentication application identifies counterfeit products on the platform. By using advanced image recognition and machine learning algorithms, the application can accurately identify and authenticate sneakers, providing a valuable service for both buyers and sellers.',
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
    {
      client: 'Lucky Brand',
      project: 'eCommerce Ecosystem',
      logo: '/assets/case-studies/lucky-brand.png',
      body: [
        'Our partnership with Lucky Brand showcases our extensive experience building and maintaining ecommerce websites with custom features that enhance the user experience and increase conversion rates.',
        'In addition to ecommerce, we also developed and implemented the company’s ERP system, automations, and system integrations resulting in increased efficiency, reduction in manual errors, improved data management, and streamlined communication and data sharing between departments.',
        'Overall, our portfolio with Lucky Brand showcases our proven track record of delivering high-quality software solutions that drive business growth, improve the online presence, and streamline internal operations.',
      ],
      solution: [
        'Ecommerce platform',
        'System integration',
        'Data warehouse',
        'Order management system',
      ],
    },
    {
      client: 'Amsale Group',
      project: 'Digital Transformation',
      logo: '/assets/case-studies/amsale.svg',
      body: [
        'The renowned Amsale Group, one of the world’s leading luxury bridal houses, needed to perform a rapid digital transformation to survive. The retail apocalypse had plagued their traditional sales partners and they needed to add a Direct-to-Consumer channel to their business model to prosper in our modern, fast-paced digital world.',
        'CodeBoxx Solutions migrated Amsale away from Magento to Shopify in just 6 weeks. Afterwards, we integrated both B2B and D2C experiences with our Bridal-Specialized CRM, integrated Netsuite, and launched their Partner Program Mobile App.',
        'Amsale not only started selling directly to customers, but also rebuilt bridges with retailers and wholesalers, ushering in a new phase of their business.',
      ],
      solution: [
        'D2C platform',
        'B2B portal',
        'Netsuite integration',
        'Custom bridal CRM',
        'Partner Program mobile app',
      ],
    },
    {
      client: 'Smart Waste Management Collection',
      body: [
        'One of the most innovative companies in the waste management industry needed to build a specialized ERP system for their Smart Collection contracts. We designed, developed, and deployed a fully customized platform for every stage of the garbage collection process, enabling them to manage, track, and bill more efficiently and effectively.',
        'With our custom solutions, the organization established itself as one of the top recognized service providers in their region and they are now eligible to apply on any waste management contract that requires Smart Collection, which is increasingly becoming the standard.',
      ],
      solution: [
        'Fleet management',
        'Dispatching system',
        'RFID tracking system',
        'Accounting integration',
      ],
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
