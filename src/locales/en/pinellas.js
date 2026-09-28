// Content from https://academy.codeboxx.com/local-support-for-pinellas-residents.
// Paragraphs use the same string-or-segments shape as faq.js (see
// src/components/RichParagraph.astro).
export default {
  seo: {
    title: 'Local Support for Pinellas Residents — CodeBoxx Academy',
    description:
      'Pinellas County residents can fund CodeBoxx Academy through CareerSource: WIOA tuition assistance up to $7,500 and the Paid Work Experience program.',
  },
  pill: 'Pinellas Residents',
  band: {
    title: 'Local Support for Pinellas Residents',
    lede: 'We’ve partnered with CareerSource to make our coding school programs more accessible for members of our community.',
    lede2:
      'Whether you want to attend our course on campus in downtown St. Pete, fully online, or hybrid, there is local support available to help you fund your future.',
  },
  badge: 'CareerSource',
  programs: {
    eyebrow: 'LOCAL FUNDING',
    title: 'Programs available through CareerSource',
    items: [
      {
        title: 'Tuition Assistance',
        body: [
          [
            'The ',
            {
              label: 'Workforce Innovation and Opportunity Act (WIOA) program',
              href: 'https://careersourcepinellas.com/wioa/',
            },
            ' helps Tampa Bay residents upskill or return to the workforce by providing tuition assistance up to $7,500 as well as one-on-one assistance for resume writing, interviewing, job searches, and career planning.',
          ],
        ],
      },
      {
        title: 'Paid Work Experience',
        body: [
          [
            'The ',
            {
              label: 'Paid Work Experience program',
              href: 'https://careersourcepinellas.com/youth/pwe/',
            },
            ' helps CodeBoxx graduates get paid while working on projects for local non-profits and startups through our consulting division, ',
            { label: 'CodeBoxx Solutions', href: 'https://www.solutions.codeboxx.com/' },
            '. To be eligible, you must be 16 to 24 years old and reside in Pinellas County.',
          ],
        ],
      },
    ],
  },
  streamline: {
    eyebrow: 'WIOA APPLICATION',
    title: 'Let Us Streamline the Process',
    body: 'Don’t miss out on the opportunity to fund your future. Let us help you with your WIOA application! We understand the importance of accessing these funds for your career development, and that’s why we work closely with the dedicated staff at CareerSource. Our team is experienced in navigating the application process, and we can ensure your request is processed quickly and efficiently. Reach out to us today for assistance, and let’s pave the way for your success together!',
    cta: 'Book a Call with our Enrollment Coordinator',
    ctaHref: 'https://calendly.com/raina-dejute-codeboxx/30min',
  },
};
