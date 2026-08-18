import React from 'react';
import { Button, Badge, Form, Offcanvas } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { TopBar, Footer } from '../components/Chrome';
import Seo from '../components/Seo';
import { localizedHref } from '../lib/routes';
import '../lib/image-slot.js';

const PITCH_BLANK = { first: '', last: '', email: '', phone: '', kind: '', details: '' };

function Band({ onPitch }) {
  const { t } = useTranslation();
  return (
    <section className="band-dark">
      <div className="wrap d-flex flex-column gap-4 align-items-start">
        <span className="pill">{t('ventures.pill')}</span>
        <h1 className="band-title">{t('ventures.band.title')}</h1>
        <p className="band-lede">{t('ventures.band.lede')}</p>
        <Button onClick={onPitch}>{t('ventures.band.pitchButton')}</Button>
      </div>
    </section>
  );
}

function Models() {
  const { t } = useTranslation();
  const items = t('ventures.models.items', { returnObjects: true });
  return (
    <section className="sect">
      <div className="wrap d-flex flex-column gap-5">
        <div className="d-flex flex-column gap-3">
          <p className="eyebrow">{t('ventures.models.eyebrow')}</p>
          <h2 className="h2">{t('ventures.models.title')}</h2>
          <p className="lede lede-640">{t('ventures.models.lede')}</p>
        </div>
        <div className="grid2">
          {items.map(([title, d, bullets]) => (
            <div key={title} className="panel">
              <div className="panel-header-row">
                <h3 className="ptitle">{title}</h3>
                <Badge bg="brand">{t('ventures.pill')}</Badge>
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
  const { t } = useTranslation();
  const items = t('ventures.criteria.items', { returnObjects: true });
  return (
    <section className="sect sect-contact">
      <div className="wrap d-flex flex-column gap-5">
        <div className="d-flex flex-column gap-3">
          <p className="eyebrow">{t('ventures.criteria.eyebrow')}</p>
          <h2 className="h2">{t('ventures.criteria.title')}</h2>
        </div>
        <div className="grid3">
          {items.map(([title, d], i) => (
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

function PitchDrawer({ open, onClose }) {
  const { t } = useTranslation();
  const projectKinds = t('ventures.pitchDrawer.projectKinds', { returnObjects: true });
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
          <span className="kicker">{t('ventures.pitchDrawer.kicker')}</span>
          <h3 className="ptitle">{t('ventures.pitchDrawer.title')}</h3>
        </div>
        <Button size="sm" variant="ghost" onClick={onClose}>
          {t('actions.close')}
        </Button>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column gap-4">
        <div className="form-row-2">
          <Form.Control
            placeholder={t('ventures.pitchDrawer.firstNamePlaceholder')}
            value={form.first}
            onChange={set('first')}
          />
          <Form.Control
            placeholder={t('ventures.pitchDrawer.lastNamePlaceholder')}
            value={form.last}
            onChange={set('last')}
          />
        </div>
        <Form.Group>
          <Form.Control
            placeholder={t('ventures.pitchDrawer.emailPlaceholder')}
            value={form.email}
            isInvalid={invalid}
            onChange={set('email')}
          />
          <Form.Control.Feedback type="invalid">
            {t('ventures.pitchDrawer.invalidEmail')}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Control
          placeholder={t('ventures.pitchDrawer.phonePlaceholder')}
          value={form.phone}
          onChange={set('phone')}
        />
        <Form.Group>
          <Form.Label>{t('ventures.pitchDrawer.kindLabel')}</Form.Label>
          <Form.Select
            aria-label={t('ventures.pitchDrawer.kindLabel')}
            value={form.kind}
            onChange={set('kind')}
          >
            <option value="">{t('ventures.pitchDrawer.selectPlaceholder')}</option>
            {projectKinds.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>{t('ventures.pitchDrawer.describeLabel')}</Form.Label>
          <Form.Control as="textarea" rows={4} value={form.details} onChange={set('details')} />
        </Form.Group>
        <div className="rule" />
        <div className="form-actions">
          <span className={'form-actions-note' + (sent ? ' sent' : '')}>
            {sent ? t('ventures.pitchDrawer.receivedNote') : t('ventures.pitchDrawer.reviewedNote')}
          </span>
          <Button size="lg" disabled={!ready} onClick={() => setSent(true)}>
            {t('ventures.pitchDrawer.submit')}
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

function VenturesPage() {
  const { t, i18n } = useTranslation();
  const [pitchOpen, setPitchOpen] = React.useState(false);
  return (
    <div id="top">
      <Seo title={t('ventures.seo.title')} description={t('ventures.seo.description')} />
      <TopBar
        onCodi={() => {
          location.href = localizedHref('#contact', i18n.language);
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
