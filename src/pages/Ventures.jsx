import React from 'react';
import { Button, Logo, Badge, Input } from '../design-system';
import { TopBar, Footer } from '../components/Chrome';
import '../lib/image-slot.js';

const PILL = { width: 'fit-content', borderRadius: 9999, boxShadow: 'inset 0 0 0 1.5px var(--blue-500)', padding: '8px 16px', display: 'inline-flex', fontWeight: 700, fontSize: 12, lineHeight: '100%', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--neutral-0)', whiteSpace: 'nowrap', marginBottom: 10 };

const MODELS = [
  ['Build for Equity', 'We take part of the build cost in equity and ship the product with you.', ['Delivery pod assigned at kickoff', 'Cash and equity split agreed before scoping', 'Founders keep control of the roadmap']],
  ['Co-Founded Ventures', 'An idea validated with us becomes a company we hold a stake in.', ['Joint incorporation and cap table', 'CodeBoxx supplies the engineering side', 'Operating partner in the first year']],
  ['Venture Studio Services', 'Cash engagements for funded startups that need to move now.', ['Fixed-scope sprints', 'Same review standard as the studio', 'Handover to your own team on exit']],
  ['Talent Placement', 'Academy graduates embedded in portfolio companies.', ['Screened through the entrance assessment', 'Placed inside a delivery pod first', 'Hire directly after the engagement']],
];

const CRITERIA = [
  ['Software at the Core', 'The product is the business, not a side channel.'],
  ['A Founder in the Room', 'Someone with domain authority stays on the build with us.'],
  ['A Path to Revenue', 'A named first customer or a market we can reach in the first year.'],
];

function Band() {
  return (
    <section style={{ background: 'var(--navy-500)', padding: '80px 0' }}>
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}>
        <span style={PILL}>Ventures</span>
        <h1 style={{ margin: 0, fontSize: 48, fontWeight: 900, lineHeight: '100%', color: 'var(--neutral-0)', maxWidth: 780, textWrap: 'pretty' }}>We build with founders, not just for them.</h1>
        <p style={{ fontSize: 14, lineHeight: '20px', color: 'rgba(255,255,255,0.72)', margin: 0, maxWidth: 560 }}>CodeBoxx Ventures puts the studio&rsquo;s delivery capacity behind products we believe in. Cash, equity, or both &mdash; the structure follows the stage you are at.</p>
        <Button onClick={() => { location.href = '/#contact'; }}>Pitch Your Project</Button>
      </div>
    </section>
  );
}

function Models() {
  return (
    <section className="sect">
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p className="eyebrow">ENGAGEMENT MODELS</p>
          <h2 className="h2">Four ways we partner</h2>
          <p className="lede" style={{ maxWidth: 640 }}>Every engagement starts with the same scoping call and ends with a signed structure. The difference is how the build gets paid for.</p>
        </div>
        <div className="grid2">
          {MODELS.map(([t, d, bullets]) => (
            <div key={t} className="panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <h3 className="ptitle">{t}</h3>
                <Badge variant="brand">Ventures</Badge>
              </div>
              <p className="pbody">{d}</p>
              <div className="rule" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {bullets.map(b => (
                  <div key={b} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ width: 4, height: 4, borderRadius: 9999, background: 'var(--blue-500)', marginTop: 8, flex: '0 0 auto' }} />
                    <span style={{ fontSize: 14, lineHeight: '20px', color: 'var(--ui-slate-500)' }}>{b}</span>
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
    <section className="sect" style={{ background: 'var(--neutral-0)', boxShadow: 'inset 0 1px 0 0 var(--ui-slate-200)' }}>
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p className="eyebrow">WHAT WE LOOK FOR</p>
          <h2 className="h2">Three things before we commit</h2>
        </div>
        <div className="grid3">
          {CRITERIA.map(([t, d], i) => (
            <div key={t} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: 'var(--blue-500)' }}>{'0' + (i + 1)}</span>
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
      <div className="wrap grid2" style={{ alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p className="eyebrow">START THE CONVERSATION</p>
          <h2 className="h2">Have a project and looking for a venture-style partner?</h2>
          <p className="lede">Send the product, the stage you are at and what you need built. A delivery lead and a partner review it together and answer with a proposed structure.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button variant="secondary" onClick={() => { location.href = 'CodeBoxx.html#solutions'; }}>See the Studio</Button>
          </div>
        </div>
        <div className="panel">
          <h3 className="ptitle">Submit your project</h3>
          <Input id="v-name" label="Full Name" placeholder="First Last" style={{ width: '100%' }} />
          <Input id="v-email" label="Email" placeholder="name@company.com" style={{ width: '100%' }} />
          <Input id="v-company" label="Company or Product" placeholder="codeboxx-enterprise-primary" style={{ width: '100%' }} />
          <Input id="v-stage" label="Stage" placeholder="Idea, prototype, or in market" style={{ width: '100%' }} />
          <div className="rule" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ui-slate-400)' }}>Reviewed within one business day.</span>
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
      <TopBar onCodi={() => { location.href = '/#contact'; }} />
      <Band />
      <Models />
      <Criteria />
      <Pitch />
      <Footer />
    </div>
  );
}

export default VenturesPage;
