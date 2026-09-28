/**
 * POSTs a lead to the portal. Resolves to { ok, status }: ok for 201 (created) and 409 (email
 * already known, which the visitor must not see as a failure); status is the portal's HTTP status,
 * or 'timeout' / 'error' when there is no response. Never rejects.
 */
export async function sendLead(
  lead,
  { portalUrl, apiKey, timeoutMs = 10000, fetch = globalThis.fetch }
) {
  try {
    const res = await fetch(`${portalUrl.replace(/\/+$/, '')}/api/v1/leads`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify(lead),
      // A redirect would turn the POST into a GET; treat it as a portal error instead.
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
    });
    // The body is personal data we have no use for.
    await res.body?.cancel();
    return { ok: res.status === 201 || res.status === 409, status: res.status };
  } catch (err) {
    return { ok: false, status: err.name === 'TimeoutError' ? 'timeout' : 'error' };
  }
}
