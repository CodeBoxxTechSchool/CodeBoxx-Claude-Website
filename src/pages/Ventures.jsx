import React from 'react';
import { Button, Badge, Form, Offcanvas } from 'react-bootstrap';
import { TopBar, Footer } from '../components/Chrome';
import '../lib/image-slot.js';

const PITCH_BLANK = { first: '', last: '', email: '', phone: '', kind: '', details: '' };
const PROJECT_KINDS = ['Native App', 'Web App', 'Web Base Project', 'Other'];

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

function Band({ onPitch }) {
  return (
    <section className="band-dark">
      <div className="wrap d-flex flex-column gap-4 align-items-start">
        <span className="pill">Ventures</span>
        <h1 className="band-title">We build with founders, not just for them.</h1>
        <p className="band-lede">
          CodeBoxx Ventures puts the studio&rsquo;s delivery capacity behind products we believe in.
          Cash, equity, or both &mdash; the structure follows the stage you are at.
        </p>
        <Button onClick={onPitch}>Pitch Your Project</Button>
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

function PitchDrawer({ open, onClose }) {
  const [form, setForm] = React.useState(PITCH_BLANK);
  const [sent, setSent] = React.useState(false);
  React.useEffect(() => {
    if (open) setSent(false);
  }, [open]);
  const set = (k) => (e) => setForm((f) => Object.assign({}, f, { [k]: e.target.value }));
  const invalid = form.email.length > 0 && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email);
  const ready = form.first && form.last && form.email && !invalid && form.phone;
  return (
    <Offcanvas show={open} onHide={onClose} placement="end" className="pitch-offcanvas">
      <Offcanvas.Header className="site-header">
        <div className="d-flex flex-column gap-3 align-items-start">
          <span className="kicker">Ventures</span>
          <h3 className="ptitle">Pitch Your Project</h3>
        </div>
        <Button size="sm" variant="ghost" onClick={onClose}>
          Close
        </Button>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column gap-4">
        <div className="form-row-2">
          <Form.Control placeholder="First Name" value={form.first} onChange={set('first')} />
          <Form.Control placeholder="Last Name" value={form.last} onChange={set('last')} />
        </div>
        <Form.Group>
          <Form.Control
            placeholder="Email"
            value={form.email}
            isInvalid={invalid}
            onChange={set('email')}
          />
          <Form.Control.Feedback type="invalid">
            Invalid address. Missing domain.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Control placeholder="Phone" value={form.phone} onChange={set('phone')} />
        <Form.Group>
          <Form.Label>What kind of project</Form.Label>
          <Form.Select aria-label="What kind of project" value={form.kind} onChange={set('kind')}>
            <option value="">Select</option>
            {PROJECT_KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Describe your project in a few words</Form.Label>
          <Form.Control as="textarea" rows={4} value={form.details} onChange={set('details')} />
        </Form.Group>
        <div className="rule" />
        <div className="form-actions">
          <span className={'form-actions-note' + (sent ? ' sent' : '')}>
            {sent ? 'Pitch received.' : 'Reviewed within one business day.'}
          </span>
          <Button size="lg" disabled={!ready} onClick={() => setSent(true)}>
            Submit
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

function VenturesPage() {
  const [pitchOpen, setPitchOpen] = React.useState(false);
  return (
    <div id="top">
      <TopBar
        onCodi={() => {
          location.href = '/#contact';
        }}
      />
      <Band onPitch={() => setPitchOpen(true)} />
      <Models />
      <Criteria />
      <Footer />
      <PitchDrawer open={pitchOpen} onClose={() => setPitchOpen(false)} />
    </div>
  );
}

export default VenturesPage;
