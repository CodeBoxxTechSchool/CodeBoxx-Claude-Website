import React from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import CountryCombobox from './CountryCombobox';
import { localizedHref } from '../lib/i18nRoutes';
import { pageUrl, useRelaySubmit } from '../lib/useRelaySubmit';
import { trackLead } from '../lib/trackLead';

// The business contact form on /solutions and /case-studies (BusinessContactSection.astro mounts
// it in the page's #contact section): what a company writes to CodeBoxx about, an issue, a project,
// a quote, the software factory, staff augmentation, or training and coaching built into the
// delivery. Posts to the relay's /api/contact as the Solutions division, with the topic and the
// company (sent to the portal in `extra`). A link with data-contact-topic="<value>" anywhere on the
// page picks the topic (the section's script keeps the choice until the island hydrates).
// Shared labels, consent and notes are the homepage contact form's (home.contact).
export const TOPIC_EVENT = 'contact:topic';

const BLANK = {
  first: '',
  last: '',
  company: '',
  email: '',
  country: '',
  phone: '',
  message: '',
  website: '',
};

export default function BusinessContact({ t, home, lang }) {
  const c = home.contact;
  const values = t.topics.map((x) => x.value);
  const initialTopic = () => {
    const picked = typeof window !== 'undefined' && window.__cbxContactTopic;
    return values.includes(picked) ? picked : 'project';
  };
  const [topic, setTopic] = React.useState(initialTopic);
  const [f, setF] = React.useState(BLANK);
  const [mobile, setMobile] = React.useState('yes');
  const [consent, setConsent] = React.useState(false);
  const { status, submit } = useRelaySubmit('/api/contact');

  React.useEffect(() => {
    const onTopic = (e) => values.includes(e.detail) && setTopic(e.detail);
    window.addEventListener(TOPIC_EVENT, onTopic);
    return () => window.removeEventListener(TOPIC_EVENT, onTopic);
  }, []);

  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));
  const invalid = f.email.length > 0 && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email);
  const ready = f.first && f.last && f.email && !invalid && f.country && f.phone && consent;
  const sending = status === 'sending';
  const current = t.topics.find((x) => x.value === topic);

  const send = async () => {
    const fields = {
      ...f,
      division: 'solutions',
      topic,
      mobile,
      lang,
      consent,
      pageUrl: pageUrl(),
    };
    if (await submit(fields)) {
      trackLead({ formId: 'contact', language: lang });
      setF(BLANK);
      setConsent(false);
    }
  };
  const note = { sent: c.sentNote, error: c.errorNote, busy: c.busyNote }[status];

  return (
    <div className="panel biz-form">
      <h3 className="biz-form-title">{t.formTitle}</h3>
      <fieldset className="biz-topics">
        <legend className="field-label">{t.topicLabel}</legend>
        <div className="biz-topic-grid">
          {t.topics.map((x) => (
            <label key={x.value} className={'biz-topic' + (topic === x.value ? ' is-active' : '')}>
              <input
                type="radio"
                name="biz-topic"
                value={x.value}
                checked={topic === x.value}
                onChange={() => setTopic(x.value)}
              />
              <span className="biz-topic-label">{x.label}</span>
              <span className="biz-topic-hint">{x.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="form-row-2">
        <Form.Control
          aria-label={c.firstPlaceholder}
          placeholder={c.firstPlaceholder}
          autoComplete="given-name"
          value={f.first}
          onChange={set('first')}
        />
        <Form.Control
          aria-label={c.lastPlaceholder}
          placeholder={c.lastPlaceholder}
          autoComplete="family-name"
          value={f.last}
          onChange={set('last')}
        />
      </div>
      <div className="form-row-2">
        <Form.Control
          aria-label={t.companyPlaceholder}
          placeholder={t.companyPlaceholder}
          autoComplete="organization"
          maxLength={200}
          value={f.company}
          onChange={set('company')}
        />
        <Form.Group>
          <Form.Control
            type="email"
            aria-label={c.emailPlaceholder}
            placeholder={c.emailPlaceholder}
            autoComplete="email"
            value={f.email}
            isInvalid={invalid}
            onChange={set('email')}
          />
          <Form.Control.Feedback type="invalid">{c.invalidEmail}</Form.Control.Feedback>
        </Form.Group>
      </div>
      <div className="form-row-2">
        <CountryCombobox
          id="biz-country"
          label={home.enroll.countryLabel}
          lang={lang}
          value={f.country}
          onChange={(country) => setF((v) => ({ ...v, country }))}
          strings={home.enroll}
        />
        <Form.Control
          className="align-self-end"
          type="tel"
          aria-label={c.phonePlaceholder}
          placeholder={c.phonePlaceholder}
          autoComplete="tel"
          value={f.phone}
          onChange={set('phone')}
        />
      </div>
      <div className="d-flex flex-column gap-2">
        <span className="field-label">{c.mobileQ}</span>
        <div className="d-flex gap-2">
          <Form.Check
            id="biz-mobile-yes"
            type="checkbox"
            checked={mobile === 'yes'}
            onChange={() => setMobile('yes')}
            label={c.yes}
          />
          <Form.Check
            id="biz-mobile-no"
            type="checkbox"
            checked={mobile === 'no'}
            onChange={() => setMobile('no')}
            label={c.no}
          />
        </div>
      </div>
      <Form.Group>
        <Form.Label htmlFor="biz-message">{t.messageLabel}</Form.Label>
        <Form.Control
          id="biz-message"
          as="textarea"
          rows={4}
          maxLength={2000}
          placeholder={current?.placeholder}
          value={f.message}
          onChange={set('message')}
        />
      </Form.Group>
      <div className="d-flex gap-2 align-items-start">
        <Form.Check
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          aria-label={c.consentTextPart1}
        />
        <span className="consent-text">
          {c.consentTextPart1}
          <a href="mailto:info@codeboxx.com">info@codeboxx.com</a>
          {c.consentTextPart2}
          <a href={localizedHref('/privacy-policy', lang)}>{c.consentLinkText}</a>
          {c.consentTextPart3}
        </span>
      </div>
      <div className="enroll-hp" aria-hidden="true">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={f.website}
          onChange={set('website')}
        />
      </div>
      <div className="rule" />
      <div className="form-actions">
        <span
          className={'form-actions-note' + (status === 'sent' ? ' sent' : note ? ' error' : '')}
          aria-live="polite"
        >
          {note ?? c.notSentNote}
        </span>
        <Button size="lg" disabled={!ready || sending} onClick={send}>
          {sending && <Spinner size="sm" aria-hidden="true" />}
          {sending ? c.sending : t.submit}
        </Button>
      </div>
    </div>
  );
}
