import React from 'react';
import { newSubmissionId } from './submissionId';

// Past the relay's own 10 s portal timeout, so a slow portal still gets its answer through.
const TIMEOUT_MS = 15000;

/**
 * Posts a form to the relay at `path`. status: idle | sending | sent | error | busy (429).
 * submit(fields) resolves to true once the relay answered ok.
 */
export function useRelaySubmit(path) {
  const [status, setStatus] = React.useState('idle');
  // Kept across retries, so the relay's resends and the visitor's retries make a single submission.
  const submissionId = React.useRef(null);
  if (submissionId.current === null) submissionId.current = newSubmissionId();
  const submit = async (fields) => {
    setStatus('sending');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, submissionId: submissionId.current }),
        signal: controller.signal,
      });
      // Checks the body too: a 200 from anything but the relay (e.g. an HTML page) isn't received.
      const body = res.ok ? await res.json().catch(() => null) : null;
      // Submitting again after a success is a new submission.
      if (body?.ok) submissionId.current = newSubmissionId();
      setStatus(body?.ok ? 'sent' : res.status === 429 ? 'busy' : 'error');
      return Boolean(body?.ok);
    } catch {
      setStatus('error');
      return false;
    } finally {
      clearTimeout(timer);
    }
  };
  return { status, setStatus, submit };
}

// The relay and portal take at most 500 characters; past that, the query string is dropped.
export const pageUrl = () =>
  location.href.length <= 500 ? location.href : location.origin + location.pathname;
