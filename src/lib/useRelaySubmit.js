import React from 'react';
import { newSubmissionId } from './submissionId';

// Past the relay's own 10 s portal timeout, so a slow portal still gets its answer through.
const TIMEOUT_MS = 15000;

/**
 * Posts a form to the relay at `path`. status: idle | sending | sent | error | busy (429).
 * submit(fields) resolves to true once the relay answered ok. errors: the field names the relay
 * refused on its last answer, if any.
 */
export function useRelaySubmit(path, { timeoutMs = TIMEOUT_MS } = {}) {
  const [status, setStatus] = React.useState('idle');
  const [errors, setErrors] = React.useState(null);
  // Kept across retries, so the relay's resends and the visitor's retries make a single submission.
  const submissionId = React.useRef(null);
  if (submissionId.current === null) submissionId.current = newSubmissionId();
  const submit = async (fields) => {
    setStatus('sending');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, submissionId: submissionId.current }),
        signal: controller.signal,
      });
      // Checks the body too: a 200 from anything but the relay (e.g. an HTML page) isn't received.
      const body = await res.json().catch(() => null);
      setErrors(res.status === 400 && Array.isArray(body?.errors) ? body.errors : null);
      const ok = res.ok && body?.ok === true;
      // Submitting again after a success is a new submission.
      if (ok) submissionId.current = newSubmissionId();
      setStatus(ok ? 'sent' : res.status === 429 ? 'busy' : 'error');
      return ok;
    } catch {
      setErrors(null);
      setStatus('error');
      return false;
    } finally {
      clearTimeout(timer);
    }
  };
  return { status, setStatus, submit, errors };
}

// The relay and portal take at most 500 characters; past that, the query string is dropped.
export const pageUrl = () =>
  location.href.length <= 500 ? location.href : location.origin + location.pathname;
