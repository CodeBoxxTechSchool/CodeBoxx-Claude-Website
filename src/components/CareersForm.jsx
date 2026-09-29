import React from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { suggestEmail } from '../lib/emailTypos';
import { localizedHref } from '../lib/i18nRoutes';
import { pageUrl, useRelaySubmit } from '../lib/useRelaySubmit';

// The careers page's application form, its one island. The relay and the portal check the CV
// by its content; these checks only spare the visitor a long upload that would be refused.
const CV_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const MAX_CV_BYTES = 5 * 1024 * 1024;
// A 5 MB file is about 7 MB to upload, which the other forms' 15 s won't cover on a slow line.
const TIMEOUT_MS = 60000;

const CAREERS_BLANK = {
  first: '',
  last: '',
  email: '',
  phone: '',
  position: '',
  startDate: '',
  website: '',
};

// The strings key of what's wrong with the chosen file, if anything. By extension rather than
// MIME type, which browsers often leave blank or generic for .doc and .docx.
function cvProblem(file) {
  if (!file) return null;
  const name = file.name.toLowerCase();
  if (!CV_EXTENSIONS.some((ext) => name.endsWith(ext))) return 'cvWrongType';
  if (file.size === 0) return 'cvEmpty';
  if (file.size > MAX_CV_BYTES) return 'cvTooBig';
  return null;
}

// Plain base64, without the data URL's "data:…;base64," prefix.
function readBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.slice(reader.result.indexOf(',') + 1));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function CareersForm({ strings, lang }) {
  const [form, setForm] = React.useState(CAREERS_BLANK);
  const [cv, setCv] = React.useState(null);
  // A file input can't be emptied through React state; a new key remounts it blank.
  const [cvKey, setCvKey] = React.useState(0);
  const [consent, setConsent] = React.useState(false);
  const [emailHint, setEmailHint] = React.useState(null);
  const { status, setStatus, submit, errors } = useRelaySubmit('/api/careers', {
    timeoutMs: TIMEOUT_MS,
  });
  const set = (k) => (e) => setForm((f) => Object.assign({}, f, { [k]: e.target.value }));
  const invalid = form.email.length > 0 && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email);
  const cvError = cvProblem(cv);
  const ready =
    form.first &&
    form.last &&
    form.email &&
    !invalid &&
    form.phone &&
    form.position &&
    form.startDate &&
    cv &&
    !cvError &&
    consent;
  const sending = status === 'sending';
  const sent = status === 'sent';
  const note = {
    sent: strings.receivedNote,
    // A file renamed to .pdf passes the extension check here but not the relay's content check.
    error: errors?.includes('cv') ? strings.cvRejected : strings.errorNote,
    busy: strings.busyNote,
  }[status];
  const send = async () => {
    // Set before the file is read, so a second click can't start a second upload.
    setStatus('sending');
    let content;
    try {
      content = await readBase64(cv);
    } catch {
      setStatus('error');
      return;
    }
    const fields = {
      ...form,
      lang,
      consent,
      pageUrl: pageUrl(),
      cv: { fileName: cv.name, content },
    };
    // Blank again after a success, so a second click can't send the same application twice.
    if (await submit(fields)) {
      setForm(CAREERS_BLANK);
      setCv(null);
      setCvKey((k) => k + 1);
      setConsent(false);
      setEmailHint(null);
    }
  };
  return (
    <div className="panel">
      <h2 className="h2 h2-tight">{strings.title}</h2>
      <div className="form-row-2">
        <Form.Control
          placeholder={strings.firstPlaceholder}
          aria-label={strings.firstPlaceholder}
          autoComplete="given-name"
          value={form.first}
          onChange={set('first')}
        />
        <Form.Control
          placeholder={strings.lastPlaceholder}
          aria-label={strings.lastPlaceholder}
          autoComplete="family-name"
          value={form.last}
          onChange={set('last')}
        />
      </div>
      <Form.Group>
        <Form.Control
          type="email"
          placeholder={strings.emailPlaceholder}
          aria-label={strings.emailPlaceholder}
          autoComplete="email"
          value={form.email}
          isInvalid={invalid}
          onChange={(e) => {
            set('email')(e);
            setEmailHint(null);
          }}
          onBlur={() => setEmailHint(suggestEmail(form.email))}
        />
        <Form.Control.Feedback type="invalid">{strings.invalidEmail}</Form.Control.Feedback>
        {emailHint && (
          <Form.Text as="p" className="mb-0">
            {strings.didYouMean}
            <button
              type="button"
              className="inline-link"
              onClick={() => {
                setForm((f) => ({ ...f, email: emailHint }));
                setEmailHint(null);
              }}
            >
              {emailHint}
            </button>
            {strings.didYouMeanEnd}
          </Form.Text>
        )}
      </Form.Group>
      <Form.Control
        type="tel"
        placeholder={strings.phonePlaceholder}
        aria-label={strings.phonePlaceholder}
        autoComplete="tel"
        value={form.phone}
        onChange={set('phone')}
      />
      <Form.Group controlId="careers-position">
        <Form.Label>{strings.positionLabel}</Form.Label>
        <Form.Control maxLength={100} value={form.position} onChange={set('position')} />
      </Form.Group>
      <Form.Group controlId="careers-start-date">
        <Form.Label>{strings.startDateLabel}</Form.Label>
        <Form.Control type="date" value={form.startDate} onChange={set('startDate')} />
      </Form.Group>
      <Form.Group controlId="careers-cv">
        <Form.Label>{strings.cvLabel}</Form.Label>
        <Form.Control
          key={cvKey}
          type="file"
          accept=".pdf,.doc,.docx"
          isInvalid={Boolean(cvError)}
          aria-describedby="careers-cv-hint"
          onChange={(e) => setCv(e.target.files[0] ?? null)}
        />
        <Form.Control.Feedback type="invalid">{cvError && strings[cvError]}</Form.Control.Feedback>
        <Form.Text id="careers-cv-hint">{strings.cvHint}</Form.Text>
      </Form.Group>
      <div className="d-flex gap-2 align-items-start">
        <Form.Check
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          aria-label={strings.consentTextPart1}
        />
        <span className="consent-text">
          {strings.consentTextPart1}
          <a href="mailto:info@codeboxx.com">info@codeboxx.com</a>
          {strings.consentTextPart2}
          <a href={localizedHref('/privacy-policy', lang)}>{strings.consentLinkText}</a>
          {strings.consentTextPart3}
        </span>
      </div>
      {/* Honeypot: off-screen rather than display:none, which some bots skip. */}
      <div className="enroll-hp" aria-hidden="true">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={form.website}
          onChange={set('website')}
        />
      </div>
      <div className="rule" />
      <div className="form-actions">
        <span
          className={'form-actions-note' + (sent ? ' sent' : note ? ' error' : '')}
          aria-live="polite"
        >
          {note ?? strings.requiredNote}
        </span>
        <Button size="lg" disabled={!ready || sending} onClick={send}>
          {sending && <Spinner size="sm" aria-hidden="true" />}
          {sending ? strings.sending : strings.submit}
        </Button>
      </div>
    </div>
  );
}
