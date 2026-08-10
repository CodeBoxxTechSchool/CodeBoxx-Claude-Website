import React from 'react';
import { Button, Logo, TopTitle, Badge, Input, Checkbox } from '../design-system';
import { TopBar, Footer } from '../components/Chrome';
import '../lib/image-slot.js';

const PATHS = [
  ['Installment Plan', 'Apply for an installment plan through our partner, MiaShare, and start learning without paying the full tuition upfront.', ['0% interest', 'No impact on your credit score', 'Plans vary by program and financial need', 'US-based students only']],
  ['Pay in Full', 'A single lump-sum payment: the deposit during enrollment, the remainder after the risk-free period.', ['Deposit paid at enrollment', 'Balance due after the risk-free period', 'All tuition covered up front']],
  ['Desjardins (Canada)', 'For residents of Canada, our financial partner Desjardins offers financing options.', ['Applied through Desjardins directly', 'Canadian residents', 'Terms vary by applicant']],
  ['Windmill Microcredits', 'Affordable career loans for qualified newcomers.', ['For qualified newcomers', 'Career-focused loan terms', 'Applied through Windmill']],
];

const STEPS = [
  ['Apply', 'Submit the application and complete the entrance assessment.'],
  ['Pay the Deposit', 'All payment plans require a deposit. It is fully refundable if you change your mind during the risk-free period.'],
  ['Confirm', 'Settle the balance after the risk-free period and your seat is locked for the cohort.'],
];

function Band() {
  return (
    <section style={{ background: 'var(--navy-500)', padding: '80px 0' }}>
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}>
        <span style={{ width: 'fit-content', borderRadius: 9999, boxShadow: 'inset 0 0 0 1.5px var(--blue-500)', padding: '8px 16px', display: 'inline-flex', fontWeight: 700, fontSize: 12, lineHeight: '100%', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--neutral-0)', whiteSpace: 'nowrap', marginBottom: 10 }}>Financing Options</span>
        <h1 style={{ margin: 0, fontSize: 48, fontWeight: 900, lineHeight: '100%', color: 'var(--neutral-0)', maxWidth: 780, textWrap: 'pretty' }}>Coding School Financing Options</h1>
        <p style={{ fontSize: 14, lineHeight: '20px', color: 'rgba(255,255,255,0.72)', margin: 0, maxWidth: 560 }}>At CodeBoxx Academy coding school, we believe education should be accessible to everyone regardless of financial circumstances. That\u2019s why we offer multiple financing options to help you turn your passion for technology into a successful career.</p>
      </div>
    </section>
  );
}

function Paths() {
  return (
    <section className="sect">
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p className="eyebrow">THE PATHS</p>
          <h2 className="h2">Multiple Payment Options to Help You Invest in Your Future</h2>
          <p className="lede" style={{ maxWidth: 640 }}>All payment plans require a deposit, which is fully refundable if you change your mind during our risk-free period. Tuition costs and cohort start dates are located on the program page.</p>
        </div>
        <div className="grid2">
          {PATHS.map(([t, d, bullets]) => (
            <div key={t} className="panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <h3 className="ptitle">{t}</h3>
                <Badge variant="brand">Academy</Badge>
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

function Process() {
  return (
    <section className="sect" style={{ background: 'var(--neutral-0)', boxShadow: 'inset 0 1px 0 0 var(--ui-slate-200)' }}>
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p className="eyebrow">HOW IT WORKS</p>
          <h2 className="h2">Three steps to a confirmed seat</h2>
        </div>
        <div className="grid3">
          {STEPS.map(([t, d], i) => (
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

function RiskFree() {
  return (
    <section style={{ background: 'var(--navy-500)' }} className="sect">
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 780 }}>
        <p className="eyebrow" style={{ color: 'var(--blue-500)' }}>RISK-FREE PERIOD</p>
        <h2 className="h2" style={{ color: 'var(--neutral-0)' }}>Jump into tech for a few weeks. No strings attached.</h2>
        <p style={{ margin: 0, fontSize: 14, lineHeight: '20px', color: 'rgba(255,255,255,0.72)' }}>We get it, learning to code is a huge commitment. That&rsquo;s why we are the only coding academy to provide the initial 12% of our program risk-free. Our risk-free period spans the initial 2 weeks of the 16-week program or the initial 4 weeks of our 32-week program.</p>
        <p style={{ margin: 0, fontSize: 14, lineHeight: '20px', color: 'rgba(255,255,255,0.72)' }}>If you choose not to continue after the risk-free period, you can drop out without consequences. We&rsquo;ll fully refund your deposit and you can walk away with a fundamental understanding of modern technology that you can take with you for the rest of your life.</p>
      </div>
    </section>
  );
}

function Ask() {
  return (
    <section className="sect">
      <div className="wrap grid2" style={{ alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p className="eyebrow">QUESTIONS ON TUITION</p>
          <h2 className="h2">Let&rsquo;s explore your funding options together.</h2>
          <p className="lede">Don&rsquo;t let financial concerns hold you back from pursuing your dream career. Education is an investment in your future career, financial stability, and peace of mind. Contact us today to navigate your financing options and career goals.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button onClick={() => { location.href = 'CodeBoxx.html#academy'; }}>See the Programs</Button>
            <Button variant="secondary" onClick={() => { location.href = '/#contact'; }}>Contact Admissions</Button>
          </div>
        </div>
        <div className="panel">
          <h3 className="ptitle">Request the tuition sheet</h3>
          <Input id="fin-name" label="Full Name" placeholder="First Last" style={{ width: '100%' }} />
          <Input id="fin-email" label="Email" placeholder="name@company.com" style={{ width: '100%' }} />
          <Input id="fin-program" label="Program of Interest" placeholder="AI Native Full-Stack Developer" style={{ width: '100%' }} />
          <div className="rule" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ui-slate-400)' }}>Answered within one business day.</span>
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
      <TopBar onCodi={() => { location.href = '/#contact'; }} />
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
