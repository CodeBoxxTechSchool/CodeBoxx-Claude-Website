// Delivery evidence behind the CrewKit Forge 20 "Dive Deeper" page
// (/crewkit-forge-20/dive-deeper). Source: "Crewkit savings presentation deck"
// (Series A evidence annex, sections 0–8.1). Seven platforms delivered by the
// CodeBoxx AI-native software factory, each compared with a pre-agentic 2022
// baseline (team, timeline, cost).
//
// Confidentiality: the annex names the clients next to contract values. This file
// ships to the browser (the islands import it), so it deliberately holds NO client
// names: the page uses the anonymized study names the Investment Memo already uses
// (src/locales/*/forgeDeep.js), and leaves out contract caps, rates and
// source-document references. To name a client, add a `client` field to its case
// below only once that client has approved in writing.

// Portfolio figures as stated in the annex (sum of the seven rows below, rounded).
export const PORTFOLIO = {
  traditionalCost: 18.8e6,
  factoryCost: 4.0e6,
  saved: 14.9e6,
  costReduction: 0.79,
  traditionalMonths: 120,
  factoryMonths: 28,
  // Investment Memo headline: average of the four benchmark studies.
  memoSpeed: 5.2,
  memoCostReduction: 0.78,
};

// Scenario multipliers for the business-case builder — every one is a figure the
// evidence actually shows, never an extrapolation:
// conservative = the weakest benchmark study (the warehouse system),
// benchmark    = the Investment Memo average across the four studies,
// portfolio    = the seven-platform totals (120 → 28 months, 79% cost reduction).
export const SCENARIOS = {
  conservative: { speed: 2.0, costReduction: 0.62 },
  benchmark: { speed: 5.2, costReduction: 0.78 },
  portfolio: { speed: 120 / 28, costReduction: 0.79 },
};

// `speed` and `reduction` are the per-platform multiples exactly as the annex
// states them (not recomputed from the rounded midpoints below); the day camp has
// no speed multiple, it is shown as "3 days" instead.
// Months are midpoints where the annex gives a range (noted in `range`). Costs in
// each project's own currency (CAD, or USD for the warehouse system and the
// military-benefits app), shown at parity like the annex does. `group`:
// "benchmark" = one of the Memo's four studies; "additional" = extra proof,
// outside the 5.2× / 78% average.
export const CASES = [
  {
    id: 'travel',
    speed: '12',
    reduction: '82%',
    group: 'benchmark',
    traditional: { months: 24, cost: 6.5e6 },
    factory: { months: 2, cost: 1.2e6 },
    tech: ['Next.js / React', 'Java · Spring Boot', 'MySQL', 'Rails · Node.js', 'AWS Lambda / SQS'],
  },
  {
    id: 'construction',
    speed: '4.5',
    reduction: '90%',
    group: 'benchmark',
    traditional: { months: 18, cost: 3.2e6 },
    factory: { months: 4, cost: 335e3 },
    tech: ['Microsoft Graph API', 'RBAC', 'CI/CD', 'MCP server'],
  },
  {
    id: 'warehouse',
    speed: '2.0',
    reduction: '62%',
    group: 'benchmark',
    traditional: { months: 24, cost: 5.8e6 },
    factory: { months: 10.5, cost: 2.2e6, range: '9–12' },
    tech: ['Kotlin · Spring Boot', 'GCP Cloud Run', 'Postgres', 'React / TS', 'Terraform'],
  },
  {
    id: 'camp',
    speed: null,
    reduction: '77–88%',
    group: 'additional',
    traditional: { months: 7.5, cost: 22.5e3, range: '6–9', costRange: '15–30k' },
    factory: { months: 0.1, cost: 3.5e3, days: 3 },
    tech: ['Responsive web', 'SMS integration', 'QuickBooks', 'RBAC'],
  },
  {
    id: 'memory',
    speed: '3.8',
    reduction: '92%',
    group: 'additional',
    traditional: { months: 15, cost: 1.1e6 },
    factory: { months: 4, cost: 88e3 },
    tech: ['Go · MCP', 'Ollama / local Gemma', 'WebRTC', 'macOS · Windows · iOS'],
  },
  {
    id: 'military',
    speed: '1.9',
    reduction: '92%',
    group: 'additional',
    traditional: { months: 7.5, cost: 0.6e6, range: '6–9' },
    factory: { months: 4, cost: 47e3 },
    tech: ['Swift / iOS', 'PostgreSQL', 'Stripe · RevenueCat', 'Docker · GitHub Actions'],
  },
  {
    id: 'catalog',
    speed: '8',
    reduction: '94%',
    // CodeBoxx's own product, already public on the homepage.
    client: 'Catalog Crafter',
    group: 'additional',
    traditional: { months: 24, cost: 1.6e6 },
    factory: { months: 3, cost: 90e3 },
    tech: ['Next.js', 'Multi-tenant', 'S3 storage', 'Figma'],
  },
];
