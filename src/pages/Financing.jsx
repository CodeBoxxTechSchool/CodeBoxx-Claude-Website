import React from 'react';
import { Button, Badge, Form } from 'react-bootstrap';
import { TopBar, Footer } from '../components/Chrome';
import '../lib/image-slot.js';

const PATHS = [
  [
    'Installment Plan',
    'Apply for an installment plan through our partner, MiaShare, and start learning without paying the full tuition upfront.',
    [
      '0% interest',
      'No impact on your credit score',
      'Plans vary by program and financial need',
      'US-based students only',
    ],
  ],
  [
    'Pay in Full',
    'A single lump-sum payment: the deposit during enrollment, the remainder after the risk-free period.',
    [
      'Deposit paid at enrollment',
      'Balance due after the risk-free period',
      'All tuition covered up front',
    ],
  ],
  [
    'Desjardins (Canada)',
    'For residents of Canada, our financial partner Desjardins offers financing options.',
    ['Applied through Desjardins directly', 'Canadian residents', 'Terms vary by applicant'],
  ],
  [
    'Windmill Microcredits',
    'Affordable career loans for qualified newcomers.',
    ['For qualified newcomers', 'Career-focused loan terms', 'Applied through Windmill'],
  ],
];

const STEPS = [
  ['Apply', 'Submit the application and complete the entrance assessment.'],
  [
    'Pay the Deposit',
    'All payment plans require a deposit. It is fully refundable if you change your mind during the risk-free period.',
  ],
  [
    'Confirm',
    'Settle the balance after the risk-free period and your seat is locked for the cohort.',
  ],
];

function Band() {
  return (
    <section className="band-dark">
      <div className="wrap d-flex flex-column gap-4 align-items-start">
        <span className="pill">Financing Options</span>
        <h1 className="band-title">Coding School Financing Options</h1>
        <p className="band-lede">
          At CodeBoxx Academy coding school, we believe education should be accessible to everyone
          regardless of financial circumstances. That’s why we offer multiple financing options to
          help you turn your passion for technology into a successful career.
        </p>
      </div>
    </section>
  );
}

function Paths() {
  return (
    <section className="sect">
      <div className="wrap d-flex flex-column gap-5">
        <div className="d-flex flex-column gap-3">
          <p className="eyebrow">THE PATHS</p>
          <h2 className="h2">Multiple Payment Options to Help You Invest in Your Future</h2>
          <p className="lede lede-640">
            All payment plans require a deposit, which is fully refundable if you change your mind
            during our risk-free period. Tuition costs and cohort start dates are located on the
            program page.
          </p>
        </div>
        <div className="grid2">
          {PATHS.map(([t, d, bullets]) => (
            <div key={t} className="panel">
              <div className="panel-header-row">
                <h3 className="ptitle">{t}</h3>
                <Badge bg="brand">Academy</Badge>
              </div>
              <p className="pbody">{d}</p>
              <div className="rule" />
              <div className="bullet-list">
                {bullets.map((b) => (
                  <div key={b} className="bullet">
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="sect sect-contact">
      <div className="wrap d-flex flex-column gap-5">
        <div className="d-flex flex-column gap-3">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2 className="h2">Three steps to a confirmed seat</h2>
        </div>
        <div className="grid3">
          {STEPS.map(([t, d], i) => (
            <div key={t} className="numbered-step">
              <span className="numbered-step-index">{'0' + (i + 1)}</span>
              <h3 className="ptitle">{t}</h3>
              <p className="pbody">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RiskFree() {
  return (
    <section className="sect sect-navy">
      <div className="wrap band-dark-left">
        <p className="eyebrow eyebrow-brand">RISK-FREE PERIOD</p>
        <h2 className="h2 h2-inverse">Jump into tech for a few weeks. No strings attached.</h2>
        <p className="band-body">
          We get it, learning to code is a huge commitment. That&rsquo;s why we are the only coding
          academy to provide the initial 12% of our program risk-free. Our risk-free period spans
          the initial 2 weeks of the 16-week program or the initial 4 weeks of our 32-week program.
        </p>
        <p className="band-body">
          If you choose not to continue after the risk-free period, you can drop out without
          consequences. We&rsquo;ll fully refund your deposit and you can walk away with a
          fundamental understanding of modern technology that you can take with you for the rest of
          your life.
        </p>
      </div>
    </section>
  );
}

function Ask() {
  return (
    <section className="sect">
      <div className="wrap grid2">
        <div className="d-flex flex-column gap-3">
          <p className="eyebrow">QUESTIONS ON TUITION</p>
          <h2 className="h2">Let&rsquo;s explore your funding options together.</h2>
          <p className="lede">
            Don&rsquo;t let financial concerns hold you back from pursuing your dream career.
            Education is an investment in your future career, financial stability, and peace of
            mind. Contact us today to navigate your financing options and career goals.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <Button
              onClick={() => {
                location.href = 'CodeBoxx.html#academy';
              }}
            >
              See the Programs
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => {
                location.href = '/#contact';
              }}
            >
              Contact Admissions
            </Button>
          </div>
        </div>
        <div className="panel">
          <h3 className="ptitle">Request the tuition sheet</h3>
          <Form.Group>
            <Form.Label>Full Name</Form.Label>
            <Form.Control id="fin-name" placeholder="First Last" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control id="fin-email" placeholder="name@company.com" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Program of Interest</Form.Label>
            <Form.Control id="fin-program" placeholder="AI Native Full-Stack Developer" />
          </Form.Group>
          <div className="rule" />
          <div className="form-actions">
            <span className="form-actions-note">Answered within one business day.</span>
            <Button size="lg">Send</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinancingPage() {
  return (
    <div id="top">
      <TopBar
        onCodi={() => {
          location.href = '/#contact';
        }}
      />
      <Band />
      <Paths />
      <Process />
      <RiskFree />
      <Ask />
      <Footer />
    </div>
  );
}

export default FinancingPage;
