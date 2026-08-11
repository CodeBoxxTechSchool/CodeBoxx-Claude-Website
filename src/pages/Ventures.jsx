import React from 'react';
import { Button, Badge, Form } from 'react-bootstrap';
import { TopBar, Footer } from '../components/Chrome';
import '../lib/image-slot.js';

const MODELS = [
  [
    'Build for Equity',
    'We take part of the build cost in equity and ship the product with you.',
    [
      'Delivery pod assigned at kickoff',
      'Cash and equity split agreed before scoping',
      'Founders keep control of the roadmap',
    ],
  ],
  [
    'Co-Founded Ventures',
    'An idea validated with us becomes a company we hold a stake in.',
    [
      'Joint incorporation and cap table',
      'CodeBoxx supplies the engineering side',
      'Operating partner in the first year',
    ],
  ],
  [
    'Venture Studio Services',
    'Cash engagements for funded startups that need to move now.',
    [
      'Fixed-scope sprints',
      'Same review standard as the studio',
      'Handover to your own team on exit',
    ],
  ],
  [
    'Talent Placement',
    'Academy graduates embedded in portfolio companies.',
    [
      'Screened through the entrance assessment',
      'Placed inside a delivery pod first',
      'Hire directly after the engagement',
    ],
  ],
];

const CRITERIA = [
  ['Software at the Core', 'The product is the business, not a side channel.'],
  ['A Founder in the Room', 'Someone with domain authority stays on the build with us.'],
  ['A Path to Revenue', 'A named first customer or a market we can reach in the first year.'],
];

function Band() {
  return (
    <section className="band-dark">
      <div className="wrap d-flex flex-column gap-4 align-items-start">
        <span className="pill">Ventures</span>
        <h1 className="band-title">We build with founders, not just for them.</h1>
        <p className="band-lede">
          CodeBoxx Ventures puts the studio&rsquo;s delivery capacity behind products we believe in.
          Cash, equity, or both &mdash; the structure follows the stage you are at.
        </p>
        <Button
          onClick={() => {
            location.href = '/#contact';
          }}
        >
          Pitch Your Project
        </Button>
      </div>
    </section>
  );
}

function Models() {
  return (
    <section className="sect">
      <div className="wrap d-flex flex-column gap-5">
        <div className="d-flex flex-column gap-3">
          <p className="eyebrow">ENGAGEMENT MODELS</p>
          <h2 className="h2">Four ways we partner</h2>
          <p className="lede lede-640">
            Every engagement starts with the same scoping call and ends with a signed structure. The
            difference is how the build gets paid for.
          </p>
        </div>
        <div className="grid2">
          {MODELS.map(([t, d, bullets]) => (
            <div key={t} className="panel">
              <div className="panel-header-row">
                <h3 className="ptitle">{t}</h3>
                <Badge bg="brand">Ventures</Badge>
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

function Criteria() {
  return (
    <section className="sect sect-contact">
      <div className="wrap d-flex flex-column gap-5">
        <div className="d-flex flex-column gap-3">
          <p className="eyebrow">WHAT WE LOOK FOR</p>
          <h2 className="h2">Three things before we commit</h2>
        </div>
        <div className="grid3">
          {CRITERIA.map(([t, d], i) => (
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

function Pitch() {
  return (
    <section className="sect">
      <div className="wrap grid2">
        <div className="d-flex flex-column gap-3">
          <p className="eyebrow">START THE CONVERSATION</p>
          <h2 className="h2">Have a project and looking for a venture-style partner?</h2>
          <p className="lede">
            Send the product, the stage you are at and what you need built. A delivery lead and a
            partner review it together and answer with a proposed structure.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <Button
              variant="outline-primary"
              onClick={() => {
                location.href = 'CodeBoxx.html#solutions';
              }}
            >
              See the Studio
            </Button>
          </div>
        </div>
        <div className="panel">
          <h3 className="ptitle">Submit your project</h3>
          <Form.Group>
            <Form.Label>Full Name</Form.Label>
            <Form.Control id="v-name" placeholder="First Last" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control id="v-email" placeholder="name@company.com" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Company or Product</Form.Label>
            <Form.Control id="v-company" placeholder="codeboxx-enterprise-primary" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Stage</Form.Label>
            <Form.Control id="v-stage" placeholder="Idea, prototype, or in market" />
          </Form.Group>
          <div className="rule" />
          <div className="form-actions">
            <span className="form-actions-note">Reviewed within one business day.</span>
            <Button size="lg">Send</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function VenturesPage() {
  return (
    <div id="top">
      <TopBar
        onCodi={() => {
          location.href = '/#contact';
        }}
      />
      <Band />
      <Models />
      <Criteria />
      <Pitch />
      <Footer />
    </div>
  );
}

export default VenturesPage;
