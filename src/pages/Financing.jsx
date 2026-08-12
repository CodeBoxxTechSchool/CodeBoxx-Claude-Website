import React from 'react';
import { Button, Badge, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { TopBar, Footer } from '../components/Chrome';
import '../lib/image-slot.js';

function Band() {
  const { t } = useTranslation();
  return (
    <section className="band-dark">
      <div className="wrap d-flex flex-column gap-4 align-items-start">
        <span className="pill">{t('financing.pill')}</span>
        <h1 className="band-title">{t('financing.band.title')}</h1>
        <p className="band-lede">{t('financing.band.lede')}</p>
      </div>
    </section>
  );
}

function Paths() {
  const { t } = useTranslation();
  const items = t('financing.paths.items', { returnObjects: true });
  return (
    <section className="sect">
      <div className="wrap d-flex flex-column gap-5">
        <div className="d-flex flex-column gap-3">
          <p className="eyebrow">{t('financing.paths.eyebrow')}</p>
          <h2 className="h2">{t('financing.paths.title')}</h2>
          <p className="lede lede-640">{t('financing.paths.lede')}</p>
        </div>
        <div className="grid2">
          {items.map(([title, d, bullets]) => (
            <div key={title} className="panel">
              <div className="panel-header-row">
                <h3 className="ptitle">{title}</h3>
                <Badge bg="brand">{t('financing.academyBadge')}</Badge>
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
  const { t } = useTranslation();
  const steps = t('financing.process.steps', { returnObjects: true });
  return (
    <section className="sect sect-contact">
      <div className="wrap d-flex flex-column gap-5">
        <div className="d-flex flex-column gap-3">
          <p className="eyebrow">{t('financing.process.eyebrow')}</p>
          <h2 className="h2">{t('financing.process.title')}</h2>
        </div>
        <div className="grid3">
          {steps.map(([title, d], i) => (
            <div key={title} className="numbered-step">
              <span className="numbered-step-index">{'0' + (i + 1)}</span>
              <h3 className="ptitle">{title}</h3>
              <p className="pbody">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RiskFree() {
  const { t } = useTranslation();
  return (
    <section className="sect sect-navy">
      <div className="wrap band-dark-left">
        <p className="eyebrow eyebrow-brand">{t('financing.riskFree.eyebrow')}</p>
        <h2 className="h2 h2-inverse">{t('financing.riskFree.title')}</h2>
        <p className="band-body">{t('financing.riskFree.body1')}</p>
        <p className="band-body">{t('financing.riskFree.body2')}</p>
      </div>
    </section>
  );
}

function Ask() {
  const { t } = useTranslation();
  return (
    <section className="sect">
      <div className="wrap grid2">
        <div className="d-flex flex-column gap-3">
          <p className="eyebrow">{t('financing.ask.eyebrow')}</p>
          <h2 className="h2">{t('financing.ask.title')}</h2>
          <p className="lede">{t('financing.ask.lede')}</p>
          <div className="d-flex gap-3 flex-wrap">
            <Button
              onClick={() => {
                location.href = 'CodeBoxx.html#academy';
              }}
            >
              {t('financing.ask.seePrograms')}
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => {
                location.href = '/#contact';
              }}
            >
              {t('financing.ask.contactAdmissions')}
            </Button>
          </div>
        </div>
        <div className="panel">
          <h3 className="ptitle">{t('financing.ask.formTitle')}</h3>
          <Form.Group>
            <Form.Label>{t('financing.ask.fullNameLabel')}</Form.Label>
            <Form.Control id="fin-name" placeholder={t('financing.ask.fullNamePlaceholder')} />
          </Form.Group>
          <Form.Group>
            <Form.Label>{t('financing.ask.emailLabel')}</Form.Label>
            <Form.Control id="fin-email" placeholder={t('financing.ask.emailPlaceholder')} />
          </Form.Group>
          <Form.Group>
            <Form.Label>{t('financing.ask.programLabel')}</Form.Label>
            <Form.Control id="fin-program" placeholder={t('financing.ask.programPlaceholder')} />
          </Form.Group>
          <div className="rule" />
          <div className="form-actions">
            <span className="form-actions-note">{t('financing.ask.answeredNote')}</span>
            <Button size="lg">{t('financing.ask.send')}</Button>
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
