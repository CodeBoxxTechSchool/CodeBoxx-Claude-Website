import React from 'react';
import { Button, Form, Offcanvas, Spinner } from 'react-bootstrap';
import { localizedHref } from '../lib/i18nRoutes';
import { pageUrl, useRelaySubmit } from '../lib/useRelaySubmit';
import { trackLead } from '../lib/trackLead';

// The one piece of Ventures that needs a React island: the "Pitch us" trigger
// button and the drawer it opens share local state, so they're one small
// self-contained component instead of two — unlike Home, nothing else on this
// page needs that state (TopBar's Codi button just navigates to /#contact, same
// as Blog, so it stays a separate, independent island via Layout.astro). Mounted
// with `client:load` right where the trigger button belongs in the page; the
// Offcanvas itself overlays the viewport when open, so its position in the DOM
// tree doesn't affect where it visually appears.
const PITCH_BLANK = {
  first: '',
  last: '',
  email: '',
  phone: '',
  projectType: '',
  description: '',
  website: '',
};

export default function PitchWidget({ ventures, lang, closeLabel }) {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState(PITCH_BLANK);
  const [consent, setConsent] = React.useState(false);
  const { status, setStatus, submit } = useRelaySubmit('/api/pitch');
  React.useEffect(() => {
    if (open) setStatus((s) => (s === 'sending' ? s : 'idle'));
  }, [open]);
  const set = (k) => (e) => setForm((f) => Object.assign({}, f, { [k]: e.target.value }));
  const invalid = form.email.length > 0 && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email);
  const ready = form.first && form.last && form.email && !invalid && form.phone && consent;
  const sending = status === 'sending';
  const sent = status === 'sent';
  const note = {
    sent: ventures.pitchDrawer.receivedNote,
    error: ventures.pitchDrawer.errorNote,
    busy: ventures.pitchDrawer.busyNote,
  }[status];
  const send = async () => {
    // Blank again after a success, so a second click can't send the same pitch twice.
    if (await submit({ ...form, consent, lang, pageUrl: pageUrl() })) {
      trackLead({ formId: 'pitch', language: lang });
      setForm(PITCH_BLANK);
      setConsent(false);
    }
  };
  return (
    <React.Fragment>
      <Button onClick={() => setOpen(true)}>{ventures.band.pitchButton}</Button>
      <Offcanvas
        show={open}
        onHide={() => setOpen(false)}
        placement="end"
        className="pitch-offcanvas"
      >
        <Offcanvas.Header className="site-header">
          <div className="d-flex flex-column gap-3 align-items-start">
            <span className="kicker">{ventures.pitchDrawer.kicker}</span>
            <h3 className="ptitle">{ventures.pitchDrawer.title}</h3>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
            {closeLabel}
          </Button>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column gap-4">
          <div className="form-row-2">
            <Form.Control
              placeholder={ventures.pitchDrawer.firstNamePlaceholder}
              value={form.first}
              onChange={set('first')}
            />
            <Form.Control
              placeholder={ventures.pitchDrawer.lastNamePlaceholder}
              value={form.last}
              onChange={set('last')}
            />
          </div>
          <Form.Group>
            <Form.Control
              placeholder={ventures.pitchDrawer.emailPlaceholder}
              value={form.email}
              isInvalid={invalid}
              onChange={set('email')}
            />
            <Form.Control.Feedback type="invalid">
              {ventures.pitchDrawer.invalidEmail}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Control
            placeholder={ventures.pitchDrawer.phonePlaceholder}
            value={form.phone}
            onChange={set('phone')}
          />
          <Form.Group>
            <Form.Label>{ventures.pitchDrawer.kindLabel}</Form.Label>
            <Form.Select
              aria-label={ventures.pitchDrawer.kindLabel}
              value={form.projectType}
              onChange={set('projectType')}
            >
              <option value="">{ventures.pitchDrawer.selectPlaceholder}</option>
              {ventures.pitchDrawer.projectKinds.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>{ventures.pitchDrawer.describeLabel}</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              maxLength={2000}
              value={form.description}
              onChange={set('description')}
            />
          </Form.Group>
          <div className="d-flex gap-2 align-items-start">
            <Form.Check
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              aria-label={ventures.pitchDrawer.consentTextPart1}
            />
            <span className="consent-text">
              {ventures.pitchDrawer.consentTextPart1}
              <a href="mailto:info@codeboxx.com">info@codeboxx.com</a>
              {ventures.pitchDrawer.consentTextPart2}
              <a href={localizedHref('/privacy-policy', lang)}>
                {ventures.pitchDrawer.consentLinkText}
              </a>
              {ventures.pitchDrawer.consentTextPart3}
            </span>
          </div>
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
              {note ?? ventures.pitchDrawer.reviewedNote}
            </span>
            <Button size="lg" disabled={!ready || sending} onClick={send}>
              {sending && <Spinner size="sm" aria-hidden="true" />}
              {sending ? ventures.pitchDrawer.sending : ventures.pitchDrawer.submit}
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </React.Fragment>
  );
}
