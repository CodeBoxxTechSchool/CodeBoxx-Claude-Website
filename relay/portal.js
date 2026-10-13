// What each kind of submission is sent to, and the portal answers that mean it was received.
export const KINDS = {
  // 409: the email is already known, which the visitor must not see as a failure.
  enroll: { path: '/api/v1/leads', received: [201, 409] },
  // 409: the ID was used on another endpoint, so this one was never received; not retried.
  contact: { path: '/api/v1/form-submissions', received: [201] },
  pitch: { path: '/api/v1/form-submissions', received: [201] },
  careers: { path: '/api/v1/form-submissions', received: [201] },
};

/**
 * POSTs a submission of the given kind to the portal. Resolves to { received, status }: status is
 * the portal's HTTP status, or 'timeout' / 'error' when there is no response. Never rejects.
 */
export async function sendToPortal(
  kind,
  body,
  { portalUrl, apiKey, timeoutMs = 10000, fetch = globalThis.fetch }
) {
  const { path, received } = KINDS[kind];
  try {
    const res = await fetch(endpoint(portalUrl, path), {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify(body),
      // A redirect would turn the POST into a GET; treat it as a portal error instead.
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
    });
    // The body is personal data we have no use for.
    await res.body?.cancel();
    return { received: received.includes(res.status), status: res.status };
  } catch (err) {
    return { received: false, status: err.name === 'TimeoutError' ? 'timeout' : 'error' };
  }
}

/**
 * GETs the portal's upcoming cohorts. Resolves to { status, cohorts }: cohorts is the portal's
 * array, only on a 200 whose body is a JSON array; status is the portal's HTTP status, 'invalid'
 * for any other 200 body, or 'timeout' / 'error' as in sendToPortal. Never rejects.
 */
export async function fetchCohorts({
  portalUrl,
  apiKey,
  timeoutMs = 10000,
  fetch = globalThis.fetch,
}) {
  try {
    // The timeout covers reading the body too.
    const res = await fetch(endpoint(portalUrl, '/api/v1/cohorts'), {
      headers: { accept: 'application/json', 'api-key': apiKey },
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.status !== 200) {
      await res.body?.cancel();
      return { status: res.status };
    }
    const cohorts = await res.json();
    return Array.isArray(cohorts) ? { status: 200, cohorts } : { status: 'invalid' };
  } catch (err) {
    const status = { TimeoutError: 'timeout', SyntaxError: 'invalid' }[err.name] ?? 'error';
    return { status };
  }
}

const endpoint = (portalUrl, path) => `${portalUrl.replace(/\/+$/, '')}${path}`;

/** The portal may take it later: a 5xx, a timeout or a network error. */
export const isRetryable = (status) => typeof status === 'string' || status >= 500;
