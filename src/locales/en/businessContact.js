// The business contact form on /solutions and /case-studies (BusinessContact.jsx); FR twin:
// src/locales/fr/businessContact.js. Topic values are the relay's CONTACT_TOPICS
// (relay/lists.js; the drift test keeps them in step). Shared form labels, consent and
// notes come from home.contact.
export default {
  eyebrow: 'Contact us',
  title: 'Tell us what your company needs.',
  lede: 'An issue to solve, a project to build, a quote, the software factory, engineers for your team, or training built into the delivery. One form, and a human replies within one business day.',
  autonomy: {
    title: 'Delivery that leaves you autonomous.',
    body: 'We embed corporate training and coaching into the delivery of our solutions. Your people learn the tools and the code while we build, so your partners and teams can run it on their own when we hand it over.',
  },
  topicLabel: 'What can we help you with?',
  topics: [
    {
      value: 'issue',
      label: 'Report an issue',
      hint: 'Something is broken or blocking you.',
      placeholder: 'What happens, since when, and which system is affected?',
    },
    {
      value: 'project',
      label: 'Start a project',
      hint: 'A product, a platform or an agent to build.',
      placeholder: 'What do you want to build, for whom, and by when?',
    },
    {
      value: 'quote',
      label: 'Request a quote',
      hint: 'Scope, timeline and budget.',
      placeholder: 'What should the quote cover, and is there a deadline or a budget?',
    },
    {
      value: 'factory',
      label: 'The software factory',
      hint: 'CrewKit Forge 20, owned and on site.',
      placeholder: 'How many workstreams would it run, and where?',
    },
    {
      value: 'staffing',
      label: 'Staff augmentation',
      hint: 'AI-native engineers who join your team.',
      placeholder: 'Which roles, how many people, for how long, and on which stack?',
    },
    {
      value: 'training',
      label: 'Training & coaching',
      hint: 'Built into the delivery, to reach autonomy.',
      placeholder: 'Which teams and tools, and what does autonomy look like for you?',
    },
  ],
  companyPlaceholder: 'Company',
  messageLabel: 'Tell us more',
  submit: 'Send',
  formTitle: 'Contact CodeBoxx',
};
