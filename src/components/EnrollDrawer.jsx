import React from 'react';
import { flushSync } from 'react-dom';
import { Button, Form, Offcanvas, Spinner } from 'react-bootstrap';
import CountryCombobox from './CountryCombobox';
import { suggestEmail } from '../lib/emailTypos';
import { useRelaySubmit } from '../lib/useRelaySubmit';
import { trackLead } from '../lib/trackLead';

// The Academy application drawer: posts to the relay (/api/enroll), which creates the
// lead in the student portal; the portal then emails the link to create the portal
// account. Moved out of HomeIsland.jsx so /academy (the only place a student applies)
// can mount it. `home` only needs home.js's `enroll` and `heardAbout`; `common` is
// common.js (for the Close label).

// Phone country codes/abbreviations — not translated (not prose).
const DIAL_CODES = [
  ['+1', 'US/CA'],
  ['+33', 'FR'],
  ['+44', 'UK'],
  ['+52', 'MX'],
  ['+55', 'BR'],
  ['+61', 'AU'],
  ['+91', 'IN'],
  ['+234', 'NG'],
];

// options: [{ value, label }] — value is a stable, language-independent key so a
// language switch mid-form can't leave `value` holding a now-nonexistent old-language
// option string (which is what plain-string options did before, and which is why
// EnrollDrawer's radios below pass value/label pairs instead of the display text).
function RadioRow({ label, options, value, onChange }) {
  const id = React.useId();
  return (
    <div className="d-flex flex-column gap-2" role="group" aria-labelledby={id}>
      <Form.Label className="mb-0" id={id}>
        {label}
      </Form.Label>
      <div className="d-flex gap-3 flex-wrap">
        {options.map((o) => (
          <Form.Check
            key={o.value}
            id={`${id}-${o.value}`}
            type="checkbox"
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            label={o.label}
          />
        ))}
      </div>
    </div>
  );
}

const ENROLL_BLANK = {
  first: '',
  last: '',
  birth: '',
  email: '',
  dial: '+1',
  phone: '',
  street: '',
  city: '',
  region: '',
  country: '',
  postal: '',
  website: '',
};

export default function EnrollDrawer({ course, onClose, home, common, lang: pageLang }) {
  const [form, setForm] = React.useState(ENROLL_BLANK);
  const [mobile, setMobile] = React.useState('yes');
  // The portal emails the applicant in this language, so it starts as the page's.
  const [lang, setLang] = React.useState(pageLang === 'fr' ? 'fr' : 'en');
  const [contactBy, setContactBy] = React.useState('email');
  const [heard, setHeard] = React.useState('');
  const { status, setStatus, submit } = useRelaySubmit('/api/enroll');
  const [emailHint, setEmailHint] = React.useState(null);
  const [renderCourse, setRenderCourse] = React.useState(course);
  const emailRef = React.useRef(null);
  const sentRef = React.useRef(null);
  React.useEffect(() => {
    if (course) {
      setRenderCourse(course);
      setStatus((s) => (s === 'sending' ? s : 'idle'));
    }
  }, [course]);
  React.useEffect(() => {
    if (status === 'sent') sentRef.current?.focus();
  }, [status]);
  const set = (k) => (e) => setForm((f) => Object.assign({}, f, { [k]: e.target.value }));
  const invalid = form.email.length > 0 && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email);
  const ready =
    form.first &&
    form.last &&
    form.birth &&
    form.email &&
    !invalid &&
    form.phone &&
    form.street &&
    form.city &&
    form.region &&
    form.country &&
    form.postal;
  // Matches both the legacy hyphenated "Full-Stack" and Sanity's real Program
  // title "Full Stack" (space-separated) — a real cohort's title now comes
  // straight from a live Program document, not just this file's own hardcoded
  // strings, so the space form has to match too.
  const program = renderCourse && /full[\s-]?stack|fsd/i.test(renderCourse) ? 'fsd' : 'ai';
  const title = home.enroll.titles[program];
  const heardAbout = home.heardAbout;
  const submitAgain = () => {
    flushSync(() => setStatus('idle'));
    emailRef.current?.focus();
  };
  const sending = status === 'sending';
  const note = { error: home.enroll.errorNote, busy: home.enroll.busyNote }[status];
  return (
    <Offcanvas show={!!course} onHide={onClose} placement="end" className="enroll-offcanvas">
      <Offcanvas.Header className="site-header">
        <div className="d-flex flex-column gap-3 align-items-start">
          <span className="kicker">{home.enroll.kicker}</span>
          <h3 className="ptitle">{title}</h3>
        </div>
        <Button size="sm" variant="ghost" onClick={onClose}>
          {common.actions.close}
        </Button>
      </Offcanvas.Header>
      {status === 'sent' && (
        <Offcanvas.Body className="d-flex flex-column gap-3">
          <h3 className="ptitle" ref={sentRef} tabIndex={-1}>
            {home.enroll.receivedNote}
          </h3>
          <p className="pbody">
            {home.enroll.linkSentBefore}
            <strong>{form.email.trim()}</strong>
            {home.enroll.linkSentAfter}
          </p>
          <p className="pbody">
            {home.enroll.wrongAddress}{' '}
            <button type="button" className="inline-link" onClick={submitAgain}>
              {home.enroll.submitAgain}
            </button>
          </p>
        </Offcanvas.Body>
      )}
      {/* Hidden rather than unmounted after sending, so "Submit again" finds it as it was. */}
      <Offcanvas.Body className={status === 'sent' ? 'd-none' : 'd-flex flex-column gap-4'}>
        <h3 className="ptitle">{home.enroll.applyTitle}</h3>
        <p className="pbody">
          {home.enroll.alreadyHave}
          <a
            href="https://portal.codeboxx.dev/Identity/Account/Login"
            target="_blank"
            rel="noopener"
          >
            {home.enroll.logIn}
          </a>
        </p>
        <div className="form-row-2">
          <Form.Control
            placeholder={home.enroll.firstPlaceholder}
            value={form.first}
            onChange={set('first')}
          />
          <Form.Control
            placeholder={home.enroll.lastPlaceholder}
            value={form.last}
            onChange={set('last')}
          />
        </div>
        <Form.Group>
          <Form.Label>{home.enroll.birthdate}</Form.Label>
          <Form.Control
            type="date"
            aria-label={home.enroll.birthdate}
            value={form.birth}
            onChange={set('birth')}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            ref={emailRef}
            placeholder={home.enroll.emailPlaceholder}
            value={form.email}
            isInvalid={invalid}
            onChange={(e) => {
              set('email')(e);
              setEmailHint(null);
            }}
            onBlur={() => setEmailHint(suggestEmail(form.email))}
          />
          <Form.Control.Feedback type="invalid">{home.enroll.invalidEmail}</Form.Control.Feedback>
          {emailHint && (
            <Form.Text as="p" className="mb-0">
              {home.enroll.didYouMean}
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
              {home.enroll.didYouMeanEnd}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Label>{home.enroll.phoneNumberLabel}</Form.Label>
          <div className="phone-row">
            <Form.Select
              aria-label={home.enroll.countryCodeLabel}
              value={form.dial}
              onChange={set('dial')}
            >
              {DIAL_CODES.map(([c, n]) => (
                <option key={c} value={c}>
                  {c} {n}
                </option>
              ))}
            </Form.Select>
            <Form.Control
              aria-label={home.enroll.phoneNumberLabel}
              placeholder={home.enroll.phonePlaceholder}
              value={form.phone}
              onChange={set('phone')}
            />
          </div>
        </Form.Group>
        <RadioRow
          label={home.enroll.mobileQ}
          options={[
            { value: 'yes', label: home.enroll.yes },
            { value: 'no', label: home.enroll.no },
          ]}
          value={mobile}
          onChange={setMobile}
        />
        <RadioRow
          label={home.enroll.languageQ}
          options={[
            { value: 'en', label: home.enroll.english },
            { value: 'fr', label: home.enroll.french },
          ]}
          value={lang}
          onChange={setLang}
        />
        <RadioRow
          label={home.enroll.contactMethodQ}
          options={[
            { value: 'phone', label: home.enroll.phone },
            { value: 'sms', label: home.enroll.sms },
            { value: 'email', label: home.enroll.email },
          ]}
          value={contactBy}
          onChange={setContactBy}
        />
        <Form.Control
          placeholder={home.enroll.streetPlaceholder}
          value={form.street}
          onChange={set('street')}
        />
        <div className="form-row-2">
          <Form.Control
            placeholder={home.enroll.cityPlaceholder}
            value={form.city}
            onChange={set('city')}
          />
          <Form.Control
            placeholder={home.enroll.regionPlaceholder}
            value={form.region}
            onChange={set('region')}
          />
        </div>
        <div className="form-row-2">
          <CountryCombobox
            id="enroll-country"
            label={home.enroll.countryLabel}
            lang={pageLang}
            value={form.country}
            onChange={(country) => setForm((f) => ({ ...f, country }))}
            strings={home.enroll}
          />
          <Form.Control
            className="align-self-end"
            placeholder={home.enroll.postalPlaceholder}
            value={form.postal}
            onChange={set('postal')}
          />
        </div>
        <Form.Group>
          <Form.Label>{home.enroll.heardAboutQ}</Form.Label>
          <Form.Select
            aria-label={home.enroll.heardAboutQ}
            value={heard}
            onChange={(e) => setHeard(e.target.value)}
          >
            <option value="">{home.enroll.selectPlaceholder}</option>
            {heardAbout.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <p className="pbody">{home.enroll.nextStepNote}</p>
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
          <span className={'form-actions-note' + (note ? ' error' : '')} aria-live="polite">
            {note}
          </span>
          <Button
            size="lg"
            disabled={!ready || sending}
            onClick={async () => {
              if (await submit({ ...form, mobile, lang, contactBy, heard, program }))
                trackLead({ formId: 'enroll', program, language: pageLang });
            }}
          >
            {sending && <Spinner size="sm" aria-hidden="true" />}
            {sending ? home.enroll.sending : home.enroll.submit}
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
