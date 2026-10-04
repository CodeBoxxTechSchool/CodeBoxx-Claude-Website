import React from 'react';
import { Badge, Button, Form, Offcanvas } from 'react-bootstrap';
import Avatar from './Avatar';

// Codi, the Academy's admissions assistant: a chat drawer on /academy and /fr/academie, answered
// by the relay's POST /api/codi (relay/codi.js, Claude grounded in the Academy copy). It opens
// from the header's "Talk With Codi" button and any [data-codi-open] element (both send the
// window event below), and from a #codi link. The conversation lives in this tab only
// (sessionStorage), so a reload keeps it and closing the tab forgets it.
export const OPEN_EVENT = 'codi:open';
const STORE = 'codi-conversation';
const MAX_TURNS = 24; // the relay's limit: user and assistant messages together

// Turns the plain URLs in a reply into links (Codi pastes them as plain text).
const URL_RE = /(https?:\/\/[^\s)]+[^\s).,;:!?])/g;
function Linkified({ text }) {
  return text.split(URL_RE).map((part, i) =>
    i % 2 ? (
      <a
        key={i}
        href={part}
        {...(part.startsWith('https://codeboxx.com') ? {} : { target: '_blank', rel: 'noopener' })}
      >
        {part.replace(/^https:\/\/codeboxx\.com/, '') || part}
      </a>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

function load() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}
function save(log) {
  try {
    sessionStorage.setItem(STORE, JSON.stringify(log));
  } catch {
    // Private mode or storage off: the chat still works, it just won't survive a reload.
  }
}

export default function CodiChat({ t, lang, applyHref, callHref }) {
  const [open, setOpen] = React.useState(false);
  const [log, setLog] = React.useState([]); // [{ role: 'user'|'assistant', content }]
  const [draft, setDraft] = React.useState('');
  const [pending, setPending] = React.useState(false);
  const [notice, setNotice] = React.useState(null); // 'offline' | 'busy' | 'error' | 'refusal'
  const logRef = React.useRef(null);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    setLog(load());
    const show = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, show);
    const onClick = (e) => {
      if (e.target.closest?.('[data-codi-open]')) {
        e.preventDefault();
        show();
      }
    };
    document.addEventListener('click', onClick);
    if (location.hash === '#codi') show();
    return () => {
      window.removeEventListener(OPEN_EVENT, show);
      document.removeEventListener('click', onClick);
    };
  }, []);

  React.useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [log, pending, notice, open]);

  const full = log.length >= MAX_TURNS - 1;

  async function ask(question) {
    const content = question.trim();
    if (!content || pending || full) return;
    const next = [...log, { role: 'user', content }];
    setLog(next);
    save(next);
    setDraft('');
    setNotice(null);
    setPending(true);
    try {
      const res = await fetch('/api/codi', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ lang, messages: next }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.reply) {
        const answered = [...next, { role: 'assistant', content: body.reply }];
        setLog(answered);
        save(answered);
      } else {
        // Unanswered: take the question back out so the conversation still alternates.
        setLog(log);
        save(log);
        setDraft(content);
        setNotice(
          body.reason === 'refusal'
            ? 'refusal'
            : res.status === 429 || body.reason === 'busy'
              ? 'busy'
              : body.reason === 'offline'
                ? 'offline'
                : 'error'
        );
      }
    } catch {
      setLog(log);
      save(log);
      setDraft(content);
      setNotice('error');
    } finally {
      setPending(false);
      inputRef.current?.focus();
    }
  }

  function restart() {
    setLog([]);
    save([]);
    setNotice(null);
    setDraft('');
  }

  return (
    <Offcanvas
      show={open}
      onHide={() => setOpen(false)}
      onEntered={() => inputRef.current?.focus()}
      placement="end"
      className="codi-offcanvas"
      aria-labelledby="codi-title"
    >
      <Offcanvas.Header className="site-header">
        <div className="d-flex align-items-center gap-3">
          <Avatar size="md" />
          <div className="d-flex flex-column gap-1">
            <span id="codi-title" className="codi-name">
              {t.name}
            </span>
            <span className="codi-role">{t.role}</span>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3">
          <Badge bg="success">{t.active}</Badge>
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
            {t.close}
          </Button>
        </div>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column p-0">
        {/* A link in a reply (apply, funding…) closes the drawer so the page shows it. */}
        <div
          className="codi-log"
          ref={logRef}
          aria-live="polite"
          onClick={(e) => e.target.closest('a') && setOpen(false)}
        >
          <div className="codi-bubble">{t.greeting}</div>
          {log.length === 0 && (
            <div className="codi-suggestions">
              {t.suggestions.map((s) => (
                <button key={s} type="button" className="codi-chip" onClick={() => ask(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
          {log.map((m, i) => (
            <div key={i} className={'codi-bubble' + (m.role === 'user' ? ' codi-bubble-user' : '')}>
              {m.role === 'assistant' ? <Linkified text={m.content} /> : m.content}
            </div>
          ))}
          {pending && (
            <div className="codi-bubble codi-typing" role="status">
              <span className="visually-hidden">{t.typing}</span>
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </div>
          )}
          {(notice || full) && (
            <div className="codi-notice" role="alert">
              <p>{full ? t.full : t.notices[notice]}</p>
              <div className="d-flex gap-2 flex-wrap">
                <Button size="sm" href={applyHref}>
                  {t.apply}
                </Button>
                <Button
                  size="sm"
                  variant="outline-primary"
                  href={callHref}
                  target="_blank"
                  rel="noopener"
                >
                  {t.call}
                </Button>
                {full && (
                  <Button size="sm" variant="ghost" onClick={restart}>
                    {t.restart}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        <form
          className="codi-input-row"
          onSubmit={(e) => {
            e.preventDefault();
            ask(draft);
          }}
        >
          <Form.Control
            ref={inputRef}
            id="codi-input"
            className="flex-grow-1"
            aria-label={t.placeholder}
            placeholder={t.placeholder}
            value={draft}
            maxLength={1500}
            disabled={full}
            onChange={(e) => setDraft(e.target.value)}
          />
          <Button type="submit" disabled={pending || full || !draft.trim()}>
            {t.send}
          </Button>
        </form>
        <p className="codi-disclaimer">{t.disclaimer}</p>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
