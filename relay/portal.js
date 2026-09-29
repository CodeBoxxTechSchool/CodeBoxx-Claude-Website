// What each kind of submission is sent to, and the portal answers that mean it was received.
export const KINDS = {
  // 409: the email is already known, which the visitor must not see as a failure.
  enroll: { path: '/api/v1/leads', received: [201, 409] },
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
    const res = await fetch(`${portalUrl.replace(/\/+$/, '')}${path}`, {
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

/** The portal may take it later: a 5xx, a timeout or a network error. */
export const isRetryable = (status) => typeof status === 'string' || status >= 500;
