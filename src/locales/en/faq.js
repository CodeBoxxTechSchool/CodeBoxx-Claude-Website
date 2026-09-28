// Content migrated from https://academy.codeboxx.com/frequently-asked-questions.
// Each answer is a list of paragraphs; a paragraph is either a plain string or
// an array of segments, where a { label, href } segment renders as a link (href
// goes through localizedHref, so site paths/anchors get their FR twin for free).
export default {
  seo: {
    title: 'Frequently Asked Questions — CodeBoxx Academy',
    description:
      'Answers to the most common questions about CodeBoxx Academy: who it is for, prior experience, tuition, financing, and what graduates do next.',
  },
  pill: 'FAQ',
  band: {
    title: 'Frequently Asked Questions',
    lede: "This page is your go-to resource where we tackle the most common queries, concerns, and curiosities about our programs. So, grab a cup of your favorite brew, get comfy, and let's start decoding the mysteries of the tech universe together!",
  },
  list: {
    eyebrow: 'ACADEMY',
    title: 'Your questions, answered',
  },
  items: [
    {
      q: 'Is CodeBoxx the right choice for me?',
      a: [
        "Absolutely! Your life experience matters. Regardless of your educational journey, personal background, or circumstances, we know a career in technology can be transformational and we believe in your potential. So, if you're ready to take the leap, CodeBoxx is the perfect way to fast-track your new technology career!",
      ],
    },
    {
      q: 'Does this academy work?',
      a: [
        'Our track record of satisfied graduates and their successful career journeys prove that, yes, our programs truly work!',
        "We're all about making sure our learners get the most effective and immersive learning experience. Our programs are meticulously designed and updated in partnership with top tech employers to ensure we impart the latest market-demanding skills.",
        'Plus, we are much more than your typical bootcamp. We take you much deeper than just the required technical skills. We help you build the skills that lead to success in every industry. Our proprietary Pro Dev modules are infused throughout our programs to help you cultivate the human skills that employers consistently tell us they value most — qualities like effective communication, a "lead from your seat" mentality, and problem-solving skills.',
      ],
    },
    {
      q: 'Do I need prior experience to enroll?',
      a: [
        'Not at all. At CodeBoxx, we accept everyone. A registration reserves you a seat in the cohort and the enrollment process, although mandatory, is not disqualifying.',
      ],
    },
    {
      q: 'How much does it cost?',
      a: [
        'Whether you choose online, on campus, full-time, or part-time, our Full-Stack Development program is $12,000. Our simulation-based programs give you the skills and knowledge necessary to launch your new, higher-paying career in a fraction of the time and cost of a traditional college degree.',
        "And we want to make sure we're a good fit for you before you commit financially. That's why we are the only coding academy that will let you begin our program and evaluate us for two weeks (full-time) or four weeks (part-time) before your tuition is due.",
      ],
    },
    {
      q: 'What financing options are available?',
      a: [
        [
          'We partner with multiple organizations who provide different ways for you to fund your future. View our ',
          { label: 'Financing page', href: '/financing' },
          ' for more details.',
        ],
        [
          'Pinellas County, Florida residents: We encourage you to ',
          { label: 'contact us', href: '#contact' },
          ' to learn more about local funding that can cover all or part of your tuition.',
        ],
      ],
    },
    {
      q: 'What do CodeBoxx students do after graduation?',
      a: [
        "Our graduates have been hired by eBay, Lucky Brand, Coveo, and TD Synnex, to name a few. But it's unrealistic that you'll get a job at Google, Meta, or Amazon as a developer after completing a bootcamp, and red flags should go off when you see a bootcamp that promises you will.",
        'The truth is coding academies are a wonderful way to fast-track your career in technology by exposing you to different areas of software development, so you can find the specialization that aligns with your passions and leverages your strengths. And finding your specialization is our specialty.',
        'During the program, we provide career coaching and guide you through creating a resume, LinkedIn, GitHub, and acing interviews so you can confidently start your job search as soon as (or even before!) you complete the program.',
        "And with CodeBoxx for Life, you'll have lifelong access to a community of employers, coaches, and alumni to lean on for career-building strategies, advice on complex technical projects, and more.",
      ],
    },
  ],
  more: {
    eyebrow: 'STILL CURIOUS?',
    title: "Have more questions? We're here to help!",
    contact: 'Contact Us',
    schedule: 'Schedule a Call',
    scheduleHref: 'https://calendly.com/raina-dejute-codeboxx/30min',
  },
};
