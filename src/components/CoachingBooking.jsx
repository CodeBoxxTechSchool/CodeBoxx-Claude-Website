import React from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';

// The Vibe Coaching booking card (CoachingPage.astro): the coach availability, the form that opens
// Stripe Checkout through the relay's /api/coaching/checkout, and, back from Stripe with
// ?session_id=…, the hand-off to the portal's waiting room (/api/coaching/check-in). The relay's
// coaching.js holds the Stripe key; nothing here sees a card.

// The portal's name-and-email check-in, for when the waiting room doesn't open by itself.
const PORTAL_CHECK_IN = 'https://portal.codeboxx.dev/livecoaching';
const TIMEOUT_MS = 20000;

async function relay(path, init) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(path, { ...init, signal: controller.signal });
    const body = await res.json().catch(() => null);
    return { status: res.status, body: body ?? {} };
  } catch {
    return { status: 0, body: {} };
  } finally {
    clearTimeout(timer);
  }
}

// A UTC time from the relay, in the visitor's own time zone.
function when(iso, lang, withDay) {
  const options = { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' };
  if (withDay) Object.assign(options, { weekday: 'short', month: 'short', day: 'numeric' });
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-CA' : 'en-US', options).format(new Date(iso));
}

function Availability({ t, lang }) {
  const [state, setState] = React.useState(null);
  React.useEffect(() => {
    relay('/api/coaching/availability').then(({ status, body }) =>
      setState(status === 200 ? body : 'unknown')
    );
  }, []);
  if (state === 'unknown') return null;
  if (state === null) return <p className="coach-status">{t.loading}</p>;
  if (state.availableNow) {
    const until = state.untilUtc ? ' ' + t.until.replace('{time}', when(state.untilUtc, lang)) : '';
    return (
      <p className="coach-status is-live">
        <span className="coach-status-dot" aria-hidden="true" />
        {t.now + until}
      </p>
    );
  }
  if (state.nextStartUtc) {
    const text = t.next
      .replace('{start}', when(state.nextStartUtc, lang, true))
      .replace('{end}', when(state.nextEndUtc, lang));
    return <p className="coach-status">{text}</p>;
  }
  return <p className="coach-status">{t.none}</p>;
}

export default function CoachingBooking({ t, lang, contactHref }) {
  // form | back (returning from Stripe) | failed (paid, but no waiting room link)
  const [mode, setMode] = React.useState('form');
  const [canceled, setCanceled] = React.useState(false);
  const [f, setF] = React.useState({ name: '', email: '', phone: '', website: '' });
  const [status, setStatus] = React.useState('idle');

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get('session_id');
    if (params.get('canceled')) setCanceled(true);
    if (!sessionId) return;
    setMode('back');
    relay(`/api/coaching/check-in?session_id=${encodeURIComponent(sessionId)}`).then(
      ({ status, body }) => {
        if (status === 200 && typeof body.checkInUrl === 'string') location.assign(body.checkInUrl);
        else setMode('failed');
      }
    );
  }, []);

  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));
  const validEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email);
  const ready = f.name.trim() && validEmail;
  const sending = status === 'sending';

  const pay = async (e) => {
    e.preventDefault();
    if (!ready || sending) return;
    setStatus('sending');
    const { status: code, body } = await relay('/api/coaching/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...f, lang }),
    });
    if (code === 200 && typeof body.url === 'string') {
      location.assign(body.url);
      return;
    }
    setStatus(code === 400 ? 'invalid' : code === 503 ? 'unavailable' : 'error');
  };

  if (mode === 'back') {
    return (
      <div className="panel coach-card" role="status">
        <Spinner animation="border" size="sm" aria-hidden="true" />
        <p className="pbody">{t.back.checking}</p>
      </div>
    );
  }
  if (mode === 'failed') {
    return (
      <div className="panel coach-card" role="alert">
        <p className="pbody">{t.back.failed}</p>
        <p className="pbody">{t.back.fallback}</p>
        <Button href={PORTAL_CHECK_IN} variant="primary">
          {t.back.link}
        </Button>
        <p className="coach-note">{t.back.refund}</p>
      </div>
    );
  }

  return (
    <form className="panel coach-card" onSubmit={pay} noValidate>
      <h2 className="coach-card-title">{t.form.title}</h2>
      <Availability t={t.availability} lang={lang} />
      {canceled && <p className="coach-note">{t.form.canceled}</p>}
      <Form.Control
        aria-label={t.form.name}
        placeholder={t.form.name}
        autoComplete="name"
        maxLength={200}
        value={f.name}
        onChange={set('name')}
        required
      />
      <Form.Control
        type="email"
        aria-label={t.form.email}
        placeholder={t.form.email}
        autoComplete="email"
        maxLength={255}
        value={f.email}
        onChange={set('email')}
        isInvalid={f.email.length > 0 && !validEmail}
        required
      />
      <Form.Control
        type="tel"
        aria-label={t.form.phone}
        placeholder={t.form.phone}
        autoComplete="tel"
        maxLength={50}
        value={f.phone}
        onChange={set('phone')}
      />
      {/* Honeypot: hidden from people, filled by bots. */}
      <input
        className="d-none"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        name="website"
        value={f.website}
        onChange={set('website')}
      />
      <Button type="submit" size="lg" disabled={!ready || sending}>
        {sending ? t.form.paying : t.form.pay}
      </Button>
      {status === 'invalid' && <p className="coach-note error">{t.form.invalid}</p>}
      {status === 'error' && <p className="coach-note error">{t.form.error}</p>}
      {status === 'unavailable' && (
        <p className="coach-note error">
          {t.form.unavailable} <a href={contactHref}>{t.form.contact}</a>
        </p>
      )}
      <p className="coach-note">{t.form.note}</p>
    </form>
  );
}
