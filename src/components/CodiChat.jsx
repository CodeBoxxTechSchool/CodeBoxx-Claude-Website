import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import Avatar from './Avatar';

// Codi, the Academy's admissions assistant: a drawer on /academy and /fr/academie holding the
// GEM admissions assistant's own chat (repo gem_admissions_assistant, served at gem.codeboxx.dev),
// so the conversation, lead capture and admissions escalation all happen there. It opens from the
// header's "Talk With Codi" button and any [data-codi-open] element (both send the window event
// below), and from a #codi link.
//
// Not react-bootstrap's Offcanvas: that unmounts its body when closed, which would reload the
// chat (and replay Codi's recap) on every opening. This drawer uses Bootstrap's offcanvas classes
// directly and keeps the iframe mounted once it has loaded.
export const OPEN_EVENT = 'codi:open';
export const CODI_URL = 'https://gem.codeboxx.dev/static/index.html';

export default function CodiChat({ t, lang, applyHref, callHref }) {
  const [open, setOpen] = React.useState(false);
  const [started, setStarted] = React.useState(false); // the iframe loads on first open only
  const [loaded, setLoaded] = React.useState(false);
  const closeRef = React.useRef(null);
  const openerRef = React.useRef(null);

  React.useEffect(() => {
    const show = () => {
      openerRef.current = document.activeElement;
      setStarted(true);
      setOpen(true);
    };
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
    if (!open) return undefined;
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  function close() {
    setOpen(false);
    openerRef.current?.focus?.();
  }

  if (!started) return null;
  return (
    <React.Fragment>
      <div
        className={'offcanvas offcanvas-end codi-offcanvas' + (open ? ' show' : '')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="codi-title"
        aria-hidden={!open}
        tabIndex={-1}
      >
        <div className="offcanvas-header site-header">
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
            <Button ref={closeRef} size="sm" variant="ghost" onClick={close}>
              {t.close}
            </Button>
          </div>
        </div>
        <div className="offcanvas-body d-flex flex-column p-0">
          <div className="codi-frame-wrap">
            {!loaded && (
              <p className="codi-loading" role="status">
                {t.loading}
              </p>
            )}
            <iframe
              className="codi-frame"
              src={`${CODI_URL}?lang=${lang}`}
              title={t.frameTitle}
              onLoad={() => setLoaded(true)}
            />
          </div>
          <div className="codi-handoff">
            <span>{t.handoff}</span>
            <div className="d-flex gap-2">
              <Button size="sm" href={applyHref} onClick={close}>
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
            </div>
          </div>
        </div>
      </div>
      {open && <div className="offcanvas-backdrop fade show" onClick={close} />}
    </React.Fragment>
  );
}
