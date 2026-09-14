import React from 'react';
import { Button, Form, Offcanvas } from 'react-bootstrap';

// The one piece of Ventures that needs a React island: the "Pitch us" trigger
// button and the drawer it opens share local state, so they're one small
// self-contained component instead of two — unlike Home, nothing else on this
// page needs that state (TopBar's Codi button just navigates to /#contact, same
// as Blog, so it stays a separate, independent island via Layout.astro). Mounted
// with `client:load` right where the trigger button belongs in the page; the
// Offcanvas itself overlays the viewport when open, so its position in the DOM
// tree doesn't affect where it visually appears.
const PITCH_BLANK = { first: '', last: '', email: '', phone: '', kind: '', details: '' };

export default function PitchWidget({ ventures, closeLabel }) {
  const [open, setOpen] = React.useState(false);
  const projectKinds = ventures.pitchDrawer.projectKinds;
  const [form, setForm] = React.useState(PITCH_BLANK);
  const [sent, setSent] = React.useState(false);
  React.useEffect(() => {
    if (open) setSent(false);
  }, [open]);
  const set = (k) => (e) => setForm((f) => Object.assign({}, f, { [k]: e.target.value }));
  const invalid = form.email.length > 0 && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email);
  const ready = form.first && form.last && form.email && !invalid && form.phone;
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
              value={form.kind}
              onChange={set('kind')}
            >
              <option value="">{ventures.pitchDrawer.selectPlaceholder}</option>
              {projectKinds.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>{ventures.pitchDrawer.describeLabel}</Form.Label>
            <Form.Control as="textarea" rows={4} value={form.details} onChange={set('details')} />
          </Form.Group>
          <div className="rule" />
          <div className="form-actions">
            <span className={'form-actions-note' + (sent ? ' sent' : '')}>
              {sent ? ventures.pitchDrawer.receivedNote : ventures.pitchDrawer.reviewedNote}
            </span>
            <Button size="lg" disabled={!ready} onClick={() => setSent(true)}>
              {ventures.pitchDrawer.submit}
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </React.Fragment>
  );
}
