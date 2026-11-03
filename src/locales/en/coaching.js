// /vibe-coaching: Vibe Coaching, a 30-minute live session with a CodeBoxx coach, paid with Stripe
// (CoachingPage.astro, CoachingBooking.jsx; the relay's coaching.js; CLP-1499). FR: fr/coaching.js.
export default {
  seo: {
    title: 'Vibe Coaching: 30-Minute Live AI Coding Sessions | CodeBoxx',
    description:
      'Live one-on-one coaching for agentic and vibe coding with a CodeBoxx coach: Claude Code, Codex, Cursor, Lovable. $200 for 30 minutes on Zoom, refunded if no coaching happens.',
  },
  hero: {
    eyebrow: 'Vibe Coaching',
    title: 'Live coaching for agentic and vibe coding.',
    lede: 'Get online now, live with a coach. Share your screen and build step by step with Claude Code or Codex, or ramp up on Cursor, Lovable and AI Studio.',
  },
  offer: {
    price: '$200',
    unit: 'for a 30-minute session',
    items: [
      'One-on-one on Zoom with a CodeBoxx coach',
      'Screen sharing and live help on your own project',
      'Valid 24 hours after you pay',
      'Refunded in full, automatically, if no coaching happens',
    ],
  },
  steps: {
    title: 'How it works',
    items: [
      ['Pay securely', 'Stripe checkout, by card or wallet. Promotion codes are accepted.'],
      ['Join the waiting room', 'Right after paying, you are in the queue: no form to fill again.'],
      [
        'Code with your coach',
        'When it is your turn, your coach opens the Zoom call. Bring your project.',
      ],
    ],
  },
  availability: {
    loading: 'Checking coach availability…',
    now: 'A coach is available now',
    until: 'until {time}',
    next: 'Next coaching hours: {start} to {end}',
    none: 'No coaching hours are posted yet. Your session stays valid 24 hours, and is refunded in full if no coach takes it.',
  },
  form: {
    title: 'Book your session',
    name: 'Full name',
    email: 'Email',
    phone: 'Phone (optional)',
    pay: 'Pay $200 and join the queue',
    paying: 'Opening secure checkout…',
    note: 'Payment by Stripe: your card details never reach CodeBoxx. Have a promotion code? Enter it at checkout.',
    invalid: 'Please enter your name and a valid email.',
    unavailable: 'Online booking isn’t open yet. Contact us and we’ll set up your session.',
    error: 'Something went wrong. Please try again.',
    contact: 'Contact us',
    canceled: 'Checkout canceled: nothing was charged.',
  },
  back: {
    checking: 'Payment received. Taking you to your coach’s waiting room…',
    failed: 'Your payment went through, but your waiting room didn’t open automatically.',
    fallback: 'Check in with the name and email you paid with:',
    link: 'Open the check-in page',
    refund: 'If no coaching happens within 24 hours, you are refunded in full automatically.',
  },
};
