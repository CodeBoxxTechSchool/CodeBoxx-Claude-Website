// /crewkit-forge-20 landing page — CodeBoxx w/ CrewKit Forge 20 appliance.
// Narrative from the public Wix page (www.codeboxx.com/crewkit-forge-20), the
// public order configurator (buildorder.codeboxx.com) and the Rev K spec sheet.
// Claims discipline carried over from that spec sheet: say "12–20 governed
// software workstreams", never "20 developers in a box", and present hardware as
// the Rev K reference configuration. No pricing beyond the public $2,500 deposit.
export default {
  seo: {
    title: 'CodeBoxx w/ CrewKit Forge 20 — Your Software Factory, On-Premise',
    description:
      'A self-contained, fully owned AI software factory in one cubic meter. Local-first by default, cloud when it wins. Take back control of your enterprise software.',
  },
  buildOrderUrl: 'https://buildorder.codeboxx.com/',
  hero: {
    pill: 'CodeBoxx w/ CrewKit Forge 20',
    title: 'Take back control of your enterprise software.',
    lede: 'A software factory. One cubic meter. Yours. Forge 20 runs your code, your models and your repos in your own building, without asking anyone’s cloud for permission.',
    ctaPrimary: 'Reserve your Factory',
    ctaSecondary: 'See what’s inside',
    note: 'Fully refundable $2,500 deposit · Delivery in the United States and Canada',
  },
  manifesto: {
    eyebrow: 'Sovereignty, delivered',
    line: 'Stop aspiring to sovereignty and mean it.',
    pillars: [
      [
        'Self Contained',
        'Compute, local models, networking, power and the CrewKit control plane in one enclosure. Plug in the power, hand it your fiber, and get to work.',
      ],
      [
        'Fully Owned',
        'A fixed, owned asset instead of a per-token bill that keeps climbing. Your code, your execution, your inference and your audit trail stay on your premises.',
      ],
      [
        'Control and Ownership',
        'Every workstream is governed, every cloud escalation is a logged decision, and GitHub Enterprise stays your system of record.',
      ],
    ],
  },
  dataCenter: {
    eyebrow: 'Who needs a Data Center?',
    title: 'The whole factory fits in one cubic meter.',
    body: 'Forge 20 is an installed object, not a rack you rent. A one-meter chamfered cube of satin-black aluminum and smoked glass sits on a rolling PowerCore Table that carries its own power conditioning, UPS and batteries. Roll it into the boardroom, the open space or the CEO’s office.',
    specs: [
      ['96', 'cores', 'AMD Threadripper PRO 9995WX, 192 threads'],
      ['96', 'GB VRAM', 'NVIDIA RTX PRO 6000 Blackwell, GDDR7 ECC'],
      ['1', 'TB RAM', 'DDR5-6400 ECC system memory'],
      ['12.8', 'TB NVMe', 'Gen5 storage for the repo vault and model cache'],
      ['5', 'screens', 'Three 32" touch walls and two 23.8" console screens'],
      ['12–20', 'workstreams', 'Governed and parallel, under one control plane'],
    ],
    cubeTitle:
      'To-scale drawing of the Forge 20: a one-meter cube with touch screens on its faces and a two-screen console on top, sitting on a rolling power table.',
    cubeLabels: {
      console: 'Five touch surfaces',
      consoleSub: 'Two console screens, three 32" walls',
      cube: 'Compute cube · 1 m³',
      cubeSub: 'Threadripper PRO · RTX PRO 6000',
      table: 'PowerCore Table',
      tableSub: 'Conditioning, UPS and batteries',
    },
    footnote:
      'Specifications reflect the Forge 20 Rev K reference configuration and may change before your unit ships.',
  },
  rhythm: {
    eyebrow: 'Lead. Think. Write. Run.',
    title: 'Meet your very own new Dev Team.',
    steps: [
      [
        'Lead.',
        'You set the direction. Operators trained at CodeBoxx Academy keep people accountable for judgment, architecture and every release.',
      ],
      [
        'Think.',
        'CrewKit plans the work and splits it into governed workstreams across the 20 core disciplines of software.',
      ],
      [
        'Write.',
        'Local models write, review and test code on the box. Repo work, builds and first-pass review never leave the building.',
      ],
      [
        'Run.',
        'Monitoring and telemetry for every workstream, token, watt and data-egress decision, with a full audit trail.',
      ],
    ],
  },
  local: {
    eyebrow: 'Local-first. Cloud when it wins.',
    title: 'Stop renting your intelligence by the token.',
    body: [
      'Routine work stays on the box: repo mirrors, builds, tests, code review, embeddings and monitoring, running on resident open-weight models.',
      'When a job genuinely needs frontier-scale reasoning or a very long context, CrewKit escalates it through a managed gateway and records the decision. Providers are pluggable, never hard-coded.',
      'You trade an unpredictable cloud and token bill for a fixed asset you own.',
    ],
    lanes: [
      ['On the box', 'Repo mirrors, builds, tests, code review, embeddings, monitoring'],
      ['Escalated and logged', 'Frontier reasoning, long-context synthesis, architecture'],
      ['Never', 'Your code, data or IP leaving without a recorded decision'],
    ],
  },
  visible: {
    eyebrow: 'Why it looks like that',
    quote: 'A software factory you can’t see is a software factory you can’t govern.',
    body: 'Five touch surfaces in the room where the decisions get made. Leaders see where the software work happens, who governs it and how it performs.',
    imageAlt: 'The Forge 20 appliance in a boardroom, its touch screens lit',
  },
  workload: {
    eyebrow: 'Choose your day-one workload',
    title: 'A few decisions. One remarkable machine.',
    plans: [
      {
        name: 'Dev Team 10',
        kicker: 'Digital Product Team',
        body: 'Ten governed workstreams running in parallel from day one: a complete digital product team inside the appliance.',
      },
      {
        name: 'Dev Team 20',
        kicker: 'Digital Product Department',
        body: 'Double the workload. Twenty concurrent workstreams cover all 20 core disciplines of software at once, shipping across more codebases without adding headcount.',
      },
    ],
    optionsTitle: 'Options',
    options: [
      [
        'Long-Life Autonomy Pedestal',
        'Power conditioning and live health monitoring with ride-through UPS and extended batteries. Brownout or clean shutdown, your workstreams keep their state.',
      ],
      [
        'Advanced Inference Gateway',
        'Best-of-breed frontier escalation for the work that demands it, with human-in-the-loop on demand.',
      ],
      [
        'Quantum Gateway',
        'Optional and fully decoupled. Rehearse your algorithms locally before running them on qubits.',
      ],
    ],
  },
  included: {
    eyebrow: 'Sold as a program, not a box',
    title: 'Everything it takes to run your factory.',
    items: [
      [
        'White-Glove Service Plan',
        'Every appliance ships with, and runs on, a 3-year all-inclusive White-Glove service plan.',
      ],
      [
        'Delivered and installed',
        'A CodeBoxx deployment coordinator confirms every detail with you before anything ships. We deliver and install it on site.',
      ],
      [
        'Forward-deployed engineers',
        'Trained CodeBoxx operators and forward-deployed engineers help your team get the most out of every workstream.',
      ],
      [
        'Academy onboarding',
        'CodeBoxx Academy onboards your people, so adoption becomes a transformation program instead of a tool drop.',
      ],
    ],
  },
  proof: {
    eyebrow: 'Proven in live delivery',
    title: 'Built by a software factory, for yours.',
    body: 'CodeBoxx built CrewKit inside its own delivery business, used it to navigate a 2024 demand shock and returned to profitability in 2025. Forge 20 puts that same factory in your building.',
    deepLink: 'Dive deeper: see the numbers →',
  },
  cta: {
    eyebrow: 'It’s time to re-shore your enterprise software.',
    title: 'Reserve your Factory.',
    kicker: 'Let the savings buy the factory.',
    body: 'Own it outright on delivery, or roll it into one monthly payment and let your cloud and token savings cover it. A fully refundable $2,500 deposit holds your configuration and your place in the deployment queue.',
    primary: 'Configure and reserve',
    secondary: 'Talk to our team',
    note: 'Delivery available in the United States and Canada.',
  },
};
