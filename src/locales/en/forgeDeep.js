// /crewkit-forge-20/dive-deeper — the evidence and business case behind the
// CrewKit Forge 20 appliance. Numbers live in src/lib/forgeEvidence.js; this file
// holds only words. Case names default to the Investment Memo's anonymized study
// names; src/lib/forgeEvidence.js explains why no client names ship.
export default {
  seo: {
    title: 'Dive Deeper — The AI-Native Software Factory, in Numbers',
    description:
      'Seven platforms delivered by the CodeBoxx software factory: 5.2× faster and 78% cheaper than a traditional team, $14.9M saved. Build the business case for your own CrewKit Forge 20.',
  },
  back: '← CrewKit Forge 20',
  hero: {
    pill: 'Dive deeper · The evidence',
    title: 'The factory already delivered. Here are the receipts.',
    lede: 'Before it was an appliance, the CodeBoxx AI-native software factory shipped real platforms for real clients. Seven of them, project by project, against what the same work cost a traditional team in 2022.',
    stats: [
      ['5.2×', 'faster', 'Average of the four benchmark studies'],
      ['78%', 'cheaper', 'Than a traditional team, same studies'],
      ['$14.9M', 'saved', 'Across all seven platforms'],
    ],
    cta: 'Build your business case',
  },
  evidence: {
    eyebrow: 'What the factory saved',
    title: 'Seven platforms, one pattern.',
    lede: 'Each bar is what the work would have cost, or taken, with a traditional 2022 team. The blue part is what the factory actually needed. Select a platform to see what was built.',
    metricLabel: 'Compare',
    metrics: { cost: 'Build cost', time: 'Delivery time' },
    filterLabel: 'Show',
    filters: { all: 'All seven', benchmark: 'Benchmark studies', additional: 'Additional proof' },
    legend: { traditional: 'Traditional team, 2022', factory: 'CodeBoxx factory' },
    tableToggle: 'View as table',
    chartToggle: 'View as chart',
    table: {
      platform: 'Platform',
      tradTime: 'Traditional time',
      factTime: 'Factory time',
      tradCost: 'Traditional cost',
      factCost: 'Factory cost',
      gain: 'Faster / cheaper',
    },
    months: 'mo',
    days: 'days',
    faster: 'faster',
    cheaper: 'cheaper',
    groups: { benchmark: 'Benchmark study', additional: 'Additional proof' },
    detail: {
      need: 'The need',
      delivered: 'What the factory delivered',
      stack: 'Stack',
      basis: 'Basis',
    },
    totals: {
      title: 'Across all seven',
      traditional: 'Traditional cost',
      factory: 'Delivered by the factory',
      saved: 'Saved',
      reduction: 'cost reduction',
      calendar: 'Combined calendar',
    },
    note: 'Amounts in each project’s own currency (CAD, or USD for two of them), shown at parity. Ranges use their midpoint.',
  },
  cases: {
    travel: {
      name: 'Travel Agency Operations Hub',
      kind: 'Booking and trip-customization platform',
      need: 'Agent-assisted booking and traditional tour-operator tools, with no direct online purchase and no trip customization.',
      delivered: [
        'Customer booking site for flight + hotel packages',
        'Customization module: trip length, hotel, activities, car rental',
        'Back end for inventory, pricing and booking processing',
        'Three more phases delivered over the following 12 months',
      ],
      basis:
        'Timeline for the first two phases; cost for the full mandate. Traditional comparison estimated.',
    },
    construction: {
      name: 'Construction Project Management Hub',
      kind: 'Integrated project-management hub for a construction group',
      need: 'Operations spread across six separate tools, with no per-project dashboard and no unified task management.',
      delivered: [
        'Data lake and integrations with the existing tools, Microsoft Graph, role-based access',
        'Kanban and list task management, transactional email center, budget dashboard',
        'Equipment validation and internal ticketing',
        'An AI conversational agent with its own MCP server',
      ],
      basis: 'Actual fixed-price contract plus contingency used. Traditional comparison estimated.',
    },
    warehouse: {
      name: 'Specialized Warehouse Management System',
      kind: 'Custom WMS for a collectibles marketplace, built to scale to about a billion items',
      need: 'A warehouse system for an inventory no packaged WMS was designed for.',
      delivered: [
        'Location configurator, task engine and device registry',
        'Enterprise SSO and MFA with role-based access',
        'Item master synchronized with the marketplace catalog',
        'Receiving, put-away, inventory, optimized picking, packing and shipping',
      ],
      basis:
        'Actual purchase-order ceiling. A leading packaged WMS vendor bid about US$5.5M and 18+ months for the same scope.',
    },
    camp: {
      name: 'Day Camp Management Platform',
      kind: 'Registration, health records, staff roles and payments for a day camp',
      need: 'Registrations, health records, staff roles, payments and parent communication lived in spreadsheets and email.',
      delivered: [
        'Portal with child profiles linked to health records and message history',
        'Role hierarchy for lead and support counselors',
        'Validated SMS and payment reminders through QuickBooks',
        'Real-time registration and capacity tracking for up to 150 children',
      ],
      basis:
        'Actual. Specification to first transaction in 3 days, against 6–9 months and $15–30K for an agency in 2022.',
    },
    memory: {
      name: 'AI Memory-Preservation Agent',
      kind: 'AI agent and cross-platform apps for preserving personal memories',
      need: 'An AI companion that works across desktop and mobile without shipping API keys to devices.',
      delivered: [
        'Model-agnostic agent runtime with an MCP server exposing 10 tool categories',
        'macOS and Windows desktop apps: messaging, design system, authentication',
        'Full visual redesign of the mobile app',
        'On-device inference with a local Gemma model',
      ],
      basis:
        'Actual factory cost with 3 AI-native contributors. Traditional: 75 person-months estimated.',
    },
    military: {
      name: 'Military Benefits App',
      kind: 'Native iOS and web app for calculating military benefits',
      need: 'Move off a hosted back end, ship a native iOS app and monetize it end to end.',
      delivered: [
        'Migration to self-hosted PostgreSQL with custom JWT authentication',
        'Native Swift iOS app with money, TSP and VA calculators',
        'Discount data: 1,831 state-park records, 194 county veteran offices and more',
        'Unified subscriptions across the App Store and the web',
      ],
      basis:
        '607 commits by 3 contributors, documented by affidavit. Traditional: 41 person-months estimated.',
    },
    catalog: {
      name: 'Catalog Crafter',
      kind: 'Multi-tenant product-catalog SaaS, CodeBoxx’s own product',
      need: 'Take a new SaaS product from idea to its first design-partner customer.',
      delivered: [
        'Three-tier multi-tenant SaaS: Starter, Professional, Enterprise',
        'Reusable catalog template engine and shared user experience',
        'S3-compatible storage and backups, custom-domain support',
        'First design-partner deployment',
      ],
      basis:
        'Internal product: 6 actual person-months against 108 estimated, measured to the first customer.',
    },
  },
  method: {
    eyebrow: 'How to read these numbers',
    title: 'What is measured, and what is estimated.',
    items: [
      [
        'Actual',
        'Amounts billed, dates, headcount, commits and delivered scope, from contracts, purchase orders, delivery reports and affidavits.',
      ],
      [
        'Estimated',
        'The traditional 2022 team, timeline and cost, based on day rates and cycles observed on comparable mandates from 2019 to 2023. The warehouse system is the exception: its comparison is a real vendor bid.',
      ],
      [
        'Benchmark vs additional',
        'The 5.2× and 78% headline averages the four benchmark studies only. The other platforms are additional proof and are not counted in it.',
      ],
    ],
  },
  builder: {
    eyebrow: 'Your business case',
    title: 'Put your own roadmap through the factory.',
    lede: 'Describe one project the way you would staff it today. The builder applies the gains the factory has actually shown and turns them into numbers you can take to your leadership team.',
    inputs: {
      team: 'Traditional team size',
      teamUnit: 'people',
      rate: 'Fully loaded cost per person, per month',
      months: 'Planned duration with that team',
      monthsUnit: 'months',
      value: 'Value of having it live, per month',
      valueHint: 'Revenue gained or cost avoided once it ships. Leave at 0 to ignore.',
      projects: 'Projects like this per year',
    },
    scenarioLabel: 'Apply the gains from',
    scenarios: {
      conservative: ['Conservative', 'Our weakest benchmark study: 2.0× faster, 62% cheaper'],
      benchmark: ['Benchmark', 'Investment Memo average: 5.2× faster, 78% cheaper'],
      portfolio: ['Seven-platform portfolio', 'All seven combined: 4.3× faster, 79% cheaper'],
    },
    results: {
      traditional: 'Traditional team',
      factory: 'With the factory',
      cost: 'Build cost',
      time: 'Time to deliver',
      saved: 'Build cost saved',
      monthsSaved: 'Months to market saved',
      earlyValue: 'Value of shipping earlier',
      perYear: 'Per year, at this pace',
      monthsUnit: 'months',
    },
    summaryTitle: 'Your business case',
    summary:
      'A {team}-person team for {months} months costs about {tradCost}. Applying the {scenario} results, the factory delivers the same scope in about {factMonths} months for about {factCost}: {saved} saved and {monthsSaved} months to market gained{valuePart}. At {projects} project(s) a year, that is {yearSaved} of build cost avoided annually.',
    summaryValue: ', worth about {earlyValue} in value delivered earlier',
    copy: 'Copy the business case',
    copied: 'Copied to your clipboard',
    print: 'Print or save as PDF',
    disclaimer:
      'Projections apply multiples the factory has achieved on past delivery. They are not a quote or a guarantee; your results depend on scope and context. The appliance’s own price is set in your configuration.',
  },
  bridge: {
    eyebrow: 'From evidence to your building',
    title: 'The same factory, in one cubic meter you own.',
    body: 'Every result on this page came from CrewKit orchestrating AI-native delivery. CrewKit Forge 20 puts that factory on your premises: local-first, fully owned, governed, with your code and data staying in the building.',
    primary: 'Reserve your Factory',
    secondary: 'Back to CrewKit Forge 20',
  },
};
