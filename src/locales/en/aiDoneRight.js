// /ai-done-right — the #AIDoneRight standard landing page. Written for journalists
// and for readers who are afraid of AI or skeptical of it: plain language first,
// the standard's own wording quoted where it matters. Source: "AI Done Right
// v2.0 — The Verifiable Edition" (CodeBoxx, 13 August 2026, draft for review),
// served at /docs/AI-Done-Right-v2.0.pdf. Every figure below is one the standard
// itself cites, with its attribution; the contested figures it flags are left out.
export default {
  seo: {
    title: '#AIDoneRight — A Human-First Standard for Artificial Intelligence',
    description:
      'AI Done Right v2.0 is an open, human-first standard for using AI with purpose and accountability: 13 checkable commitments, a public pledge and clear red lines. Read it and download the full standard.',
  },
  pdf: {
    href: '/docs/AI-Done-Right-v2.0.pdf',
    file: 'AI-Done-Right-v2.0.pdf',
    meta: 'PDF · 59 pages · English',
  },
  hero: {
    tag: '#AIDoneRight',
    title: 'Artificial intelligence, with a human answering for it.',
    lede: 'AI Done Right is an open standard for using AI with a clear purpose, a named person responsible for it, and proof that anyone outside the company can check. It was written for everyone who has good reasons to worry about AI, and wants more than promises.',
    download: 'Download the standard',
    explore: 'Read it in plain language',
    status:
      'Version 2.0, “The Verifiable Edition” · Issued 13 August 2026 · Proposed for public review',
  },
  worry: {
    eyebrow: 'If you are worried about AI',
    title: 'You are paying attention.',
    body: 'Skepticism about AI is not ignorance. It is a reasonable response to what people have seen. AI Done Right starts from the same evidence the skeptics do, and turns it into rules.',
    stats: [
      [
        '39%',
        'of Americans say AI does more harm than good, up from 31%.',
        'Polling published July 2026',
      ],
      [
        '27%',
        'express at least some trust in businesses to use AI responsibly.',
        'Same polling, down from 31%',
      ],
      [
        '84%',
        'of CIOs had no formal process to check whether their AI is accurate.',
        'Gartner, October 2025',
      ],
      [
        '1,800+',
        'court cases worldwide involved AI-invented legal citations.',
        'Academic tracker, August 2026',
      ],
    ],
    source: 'Figures as cited in AI Done Right v2.0, Part One, with the attributions it gives.',
  },
  idea: {
    eyebrow: 'The idea in one sentence',
    quote: 'A principle you cannot evidence is a preference.',
    body: [
      'The first version of AI Done Right, in 2025, was a pledge: a list of good intentions. Pledges cannot be checked, so they cannot be failed.',
      'Version 2.0 keeps every one of those commitments and attaches to each one a document that proves it: who is responsible, what the AI may do, where it came from, what it keeps, and how it is stopped. The moral content has not changed. What is new is that someone outside the company can check.',
    ],
  },
  fears: {
    eyebrow: 'Start with your concern',
    title: 'What worries you most?',
    lede: 'Pick a concern to see which parts of the standard answer it.',
    all: 'Show all 13',
    items: {
      nobody: ['Nobody is responsible when AI gets it wrong', [1, 13]],
      stop: ['Nobody can stop it', [8, 10]],
      data: ['My data trains someone else’s AI', [5, 7, 6]],
      madeup: ['AI makes things up', [12, 2]],
      bot: ['I won’t know I’m talking to a machine', [11, 3]],
      unfair: ['It will treat people unfairly', [3]],
      hidden: ['Companies don’t even know what AI they run', [4]],
      hack: ['It can be tricked or hacked', [9, 8]],
    },
  },
  articles: {
    eyebrow: 'The thirteen commitments',
    title: 'Four questions every AI system must answer.',
    lede: 'The standard groups its 13 Articles under four plain questions. Each Article states a belief, the rules that follow from it, and the evidence that proves it.',
    pillarLabel: 'Group',
    principleLabel: 'In the standard’s words',
    meansLabel: 'What it means for people',
    pillars: {
      accountability: ['Accountability', 'Who answers for it?'],
      provenance: ['Provenance', 'Where did it come from?'],
      control: ['Control', 'What may it do?'],
      trust: ['Trust', 'How is it proven?'],
    },
    list: [
      {
        n: 1,
        pillar: 'accountability',
        title: 'Human accountability',
        principle:
          'No AI system is ever in charge. There is always a clearly identified human, team or institution responsible for outcomes, decisions and harms.',
        means:
          'Every AI system has one named person who answers for it, and who has the authority to switch it off.',
      },
      {
        n: 2,
        pillar: 'accountability',
        title: 'Declared purpose and value',
        principle:
          'We do not ship because we can. We ship when we understand why we should, and we say in advance what the system is not for.',
        means:
          'Before it is built, the company writes down what the AI is for, what it must never be used for, and what result would make it switch it off.',
      },
      {
        n: 3,
        pillar: 'accountability',
        title: 'Human dignity and fair impact',
        principle: 'If a shortcut is unethical, it is not a shortcut. It is a liability.',
        means:
          'No pretending to be human, no manipulative designs, testing for unfair results across groups, and a real person to appeal to when a decision affects you.',
      },
      {
        n: 4,
        pillar: 'accountability',
        title: 'Inventory and bill of materials',
        principle: 'We cannot govern what we have not enumerated.',
        means:
          'The company keeps a complete list of every AI system it runs and what each one is made of. Nothing reaches customers without being on the list.',
      },
      {
        n: 5,
        pillar: 'provenance',
        title: 'Data provenance and rights',
        principle:
          'We do not use data we do not have the right to use, and we do not make our customers’ data into someone else’s model.',
        means:
          'Your data is not used to train AI without your separate, written permission, and the company knows where its models came from.',
      },
      {
        n: 6,
        pillar: 'provenance',
        title: 'Custody, retention and records',
        principle: 'Prompts and outputs are records. We decide before anyone demands them.',
        means:
          'The company knows exactly what the AI keeps, for how long and who can read it, instead of leaving it to a vendor’s default setting.',
      },
      {
        n: 7,
        pillar: 'provenance',
        title: 'Supply chain',
        principle: 'The obligations we accept, we impose.',
        means:
          'Every outside company that touches your data through the AI is named, bound by contract and checked, not just “improving their services”.',
      },
      {
        n: 8,
        pillar: 'control',
        title: 'Bounded agency',
        principle:
          'An AI system may act only within limits a human set in advance, and it can always be stopped. Capability is not permission.',
        means:
          'AI cannot send, delete, pay, publish or change anything important without a human approving it, and there is a tested way to stop it.',
      },
      {
        n: 9,
        pillar: 'control',
        title: 'Security by design',
        principle: 'Security is part of safety.',
        means:
          'Systems are built assuming the AI can be tricked, so that when it is, nothing important breaks.',
      },
      {
        n: 10,
        pillar: 'control',
        title: 'Cost containment',
        principle:
          'An AI system that can spend without limit is an availability risk and a financial one.',
        means: 'Automatic limits stop runaway AI costs and loops before anyone has to notice them.',
      },
      {
        n: 11,
        pillar: 'trust',
        title: 'Transparency and disclosure',
        principle: 'AI should not be an inscrutable box that people are asked to simply trust.',
        means:
          'You are told when you are dealing with AI, AI-generated media is marked, and limitations are disclosed up front.',
      },
      {
        n: 12,
        pillar: 'trust',
        title: 'Evaluation and monitoring',
        principle:
          'Powerful models are not a substitute for engineering rigour. Deployment is the beginning of responsibility.',
        means:
          'Accuracy is measured on a schedule after launch, and facts, figures and citations are checked by a person before they reach you.',
      },
      {
        n: 13,
        pillar: 'trust',
        title: 'Independent assurance',
        principle:
          'We are prepared to be checked. Conformity that only we can verify is not conformity; it is confidence.',
        means: 'The evidence is kept, and shown to people who do not work for the company.',
      },
    ],
  },
  pledge: {
    eyebrow: 'The pledge',
    title: 'What the people behind a labelled system publicly affirm.',
    lines: [
      'We know exactly what this AI is for, what it must never be used for, and who is accountable for it by name.',
      'We know where its models came from, what they were trained on, and on what legal basis, and our customers’ data is not in them.',
      'We know every system it can reach and every action it can take, because we enumerated them, and it cannot take a consequential action without a human.',
      'We can stop it, we have tested that we can stop it, and we know how long that takes.',
      'We know what it retains, for how long, who can read it, and how we produce it when it is demanded.',
      'We measure whether it is still correct, we record what we measure, and we have agreed in advance what result would make us switch it off.',
      'We tell people they are talking to it, we mark what it generates, and we do not hide behind a disclaimer.',
      'We have written down what we cannot yet do, with a date.',
      'And we have shown all of this to someone who does not work for us.',
    ],
    close:
      'AI Done Right asks for responsibility, not perfection. It is the promise that behind every system bearing this label there are humans who care enough to stand in front of it.',
  },
  redlines: {
    eyebrow: 'The red lines',
    title: 'Any one of these means no #AIDoneRight label.',
    lede: 'However good everything else is.',
    items: [
      'Training on customer data without separate, express permission.',
      'An AI that can take an irreversible or public action without a human approving it.',
      'No tested way to stop the system.',
      'Claiming a certification the organisation does not hold.',
      'Presenting an AI as a human being, or as an actor separate from the company.',
      'Knowing a system treats a protected group unfairly, and doing nothing.',
      'Not knowing how long the system keeps what people type into it.',
    ],
  },
  ladder: {
    eyebrow: 'Honesty over perfection',
    title: 'The standard rewards telling the truth about gaps.',
    lede: 'Each commitment is rated on four levels. The label requires at least Level 2 everywhere, and Level 3 on the four that matter most. Most organisations will not qualify on day one, and the standard says the right answer is to publish the gap rather than pretend.',
    levels: [
      [
        'L3',
        'Governed',
        'Enforced by a technical control, checked automatically and reviewed independently.',
      ],
      [
        'L2',
        'Managed',
        'Documented and applied consistently, but relying on people following the process.',
      ],
      [
        'L1',
        'Documented',
        'A policy exists, but it is applied unevenly and proof is rebuilt on demand.',
      ],
      ['L0', 'Ad hoc', 'No stated position. The answer would come from memory.'],
    ],
    quote:
      'An organisation that marks itself down in two places and up in ten is believed. An organisation that marks itself Low everywhere is re-examined.',
  },
  press: {
    eyebrow: 'For journalists',
    title: 'The facts, in one place.',
    facts: [
      [
        'What it is',
        'An open, voluntary standard for human-accountable AI in digital products and platforms, with 13 Articles, a four-level conformance ladder and a public label.',
      ],
      ['Who wrote it', 'Nicolas Genest, founder and CEO of CodeBoxx Technology Corporation.'],
      [
        'Version and status',
        'Version 2.0, “The Verifiable Edition”, issued 13 August 2026 as a draft for review. It supersedes Version 1.0 (2025).',
      ],
      [
        'Who it is for',
        'Any organisation that builds or uses AI affecting people, and the AI agents that now write software on their behalf.',
      ],
      [
        'How it relates to the law',
        'It is not a law and not a certification. It maps onto ISO/IEC 42001, the NIST AI Risk Management Framework, the EU AI Act and the OWASP threat lists, and explicitly forbids presenting that mapping as certification.',
      ],
      ['Cost to use', 'Free to read, adopt and turn into company policy.'],
      ['Hashtag', '#AIDoneRight'],
    ],
    quotesTitle: 'Quotable, from the standard',
    quotes: [
      'A principle you cannot evidence is a preference.',
      'Accountability cannot be delegated to a model.',
      'Capability is not permission.',
      'A label nothing can fail is decoration.',
      'An ethics that cannot be audited protects no one but the people who profess it.',
    ],
    contact: 'Media inquiries',
    contactEmail: 'info@codeboxx.com',
  },
  adopt: {
    eyebrow: 'Adopt it',
    title: 'Ninety days from good intentions to proof.',
    lede: 'The standard ends with a practical plan for any organisation starting from zero.',
    phases: [
      [
        'Days 1–15',
        'Find out what is true',
        'List every AI system actually in use, what each keeps and for how long, and every credential it holds.',
      ],
      [
        'Days 16–45',
        'Close the gaps that cannot wait',
        'Write and test the off switch, require human approval for risky actions, and name an owner for every system.',
      ],
      [
        'Days 46–75',
        'Build the evidence habit',
        'Measure accuracy, list every outside provider, and run a first test of how the AI can be tricked.',
      ],
      [
        'Days 76–90',
        'Make it checkable',
        'Rate yourself honestly on all 13 commitments, and have someone independent challenge the ratings.',
      ],
    ],
  },
  cta: {
    eyebrow: '#AIDoneRight',
    title: 'Hold AI to a standard. Start with this one.',
    body: 'Read it, use it, argue with it. Version 2.0 is proposed for public review because a standard for accountability should itself be accountable.',
    download: 'Download AI Done Right v2.0',
    shareLabel: 'Share',
    shareText: 'AI Done Right v2.0: an open, human-first standard for accountable AI. #AIDoneRight',
  },
};
