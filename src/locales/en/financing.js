// Content from https://academy.codeboxx.com/coding-school-financing-options.
// Paragraphs (`body`, `note`) use the same shape as faq.js: a plain string, or an
// array of segments where a { label, href } segment renders as a link (see
// src/components/RichParagraph.astro).
export default {
  seo: {
    title: 'Coding Bootcamp Financing Options & Payment Plans',
    description:
      'Explore CodeBoxx Academy financing: 0% interest installment plans, pay in full, Canadian options, and a risk-free period to help you invest in a career in tech.',
  },
  pill: 'Financing Options',
  band: {
    title: 'Coding School Financing Options',
    lede: 'At CodeBoxx Academy coding school, we believe education should be accessible to everyone regardless of financial circumstances. That’s why we offer multiple financing options to help you turn your passion for technology into a successful career.',
  },
  schedule: {
    label: 'Schedule a Call',
    href: 'https://calendly.com/raina-dejute-codeboxx/30min',
  },
  academyBadge: 'Academy',
  paths: {
    eyebrow: 'THE PATHS',
    title: 'Multiple Payment Options to Help You Invest in Your Future',
    lede: 'All payment plans require a deposit, which is fully refundable if you change your mind during our risk-free period. Tuition costs and cohort start dates are located on the program page.',
    items: [
      {
        title: 'Installment Plan',
        subtitle: 'Get More Out of Your Education with a Hassle-Free Installment Plan',
        body: [
          'Don’t want to pay all at once, but are able to make payments while enrolled? Apply for an installment plan through our partner, MiaShare, to begin learning without having to pay the full tuition upfront. These plans vary by program and student financial need, carry 0% interest, do not affect your credit score, and have different payment options for you to choose from.',
          'For more information and details, please speak with MiaShare. Terms will vary by student and you will work directly with our third-party partner, MiaShare.',
        ],
        bullets: [
          '0% interest',
          'Does not affect your credit score',
          'Multiple payment options to choose from',
          'Available to US-based students only',
        ],
        cta: {
          label: 'Submit your MiaShare application',
          href: 'https://codeboxxtechnology.mia-share.com/apply/programs',
        },
        note: 'Additional terms may apply; see the application for more details.',
      },
      {
        title: 'Pay in Full',
        subtitle: 'Simplify Your Payment Process with Our Pay in Full Option',
        body: [
          'With our single, lump-sum payment option, you will pay the deposit during the enrollment period and the remainder of your payment is due after the risk-free period.* This means that you can start the program with confidence, knowing that you have time to assess whether it’s the right fit for you before committing financially.',
          'After the risk-free period, our Pay in Full option provides you with the peace of mind of knowing that you have covered all your tuition costs, freeing you to concentrate fully on your learning.',
        ],
        bullets: [
          'Deposit paid during enrollment',
          'Balance due after the risk-free period',
          'All tuition covered, nothing left to manage',
        ],
        note: '*The risk-free period is 12% of the program. It spans the initial 2 weeks of the 16-week program or the initial 4 weeks of our 32-week program.',
      },
      {
        title: 'Desjardins',
        subtitle: 'For residents of Canada',
        body: [
          'MiaShare is only available for US-based students. For residents of Canada, our financial partner Desjardins offers truly advantageous financing options.',
        ],
      },
      {
        title: 'Windmill Microcredits',
        subtitle: 'For qualified newcomers',
        body: ['Windmill Microcredits offers affordable career loans for qualified newcomers.'],
      },
    ],
  },
  riskFree: {
    eyebrow: 'RISK-FREE PERIOD',
    title: 'Jump into tech for a few weeks. No strings attached.',
    body: [
      'We get it, learning to code is a huge commitment. That’s why we are the only coding academy to provide the initial 12% of our program risk-free.',
      'Our risk-free period spans the initial 2 weeks of the 16-week program or the initial 4 weeks of our 32-week program. Regardless of the program track that you choose, it is important to us that you make the best decision for you. We want you to feel confident that this is the right career path for you before committing yourself financially.',
      'If you choose not to continue after the risk-free period, you can drop out without consequences. We’ll fully refund your deposit and you can walk away with a fundamental understanding of modern technology that you can take with you for the rest of your life, regardless of what your future holds.',
    ],
  },
  beyond: {
    eyebrow: 'BEYOND THE BOOTCAMP',
    title: 'Coding bootcamps overpromise and underdeliver',
    body: [
      'Bootcamps are failing their students. They teach people how to code, but leave them hanging after graduation. That’s why we’ve evolved past the bootcamp model. We’re committed to helping you change your life with a new career.',
      'People who finish our programs have gone on to work for some pretty big names — eBay, Lucky Brands, Cybercat, and Coveo, to drop just a few. But we’re not going to oversell it to you. The odds of jumping straight from a bootcamp into a coding job at Google, Meta, or Amazon are pretty slim — and if someone promises you that, take it with a pinch of salt, okay?',
      'But here’s the real deal — enrolling in a coding program like ours is like a shortcut into the tech world. It’s a great way to get your hands dirty in different areas and see what clicks with you. We personalize our programs to help you find your specialty within tech. Think of it as a head start in finding your niche, the one you’re really passionate about and where you thrive!',
    ],
  },
  ask: {
    eyebrow: 'QUESTIONS ON TUITION',
    title: 'Let’s Explore Your Funding Options Together',
    lede: 'Don’t let financial concerns hold you back from pursuing your dream career. Education is an investment in your future career, financial stability, and peace of mind. Contact us today to navigate your financing options and career goals.',
    schedule: 'Schedule a Call with Us',
    investTitle: 'Invest in Yourself',
    enroll: 'Enroll Today',
  },
};
