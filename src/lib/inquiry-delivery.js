// "Accepted" is the form service's response, not proof of mailbox delivery or a qualified lead.
export async function submitInquiryToService(endpoint, payload, onAccepted, fetchImpl = globalThis.fetch) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data || String(data.success) !== 'true') {
      throw new Error('FormSubmit delivery failed');
    }
    // A tracking error must not invite the buyer to resubmit an accepted inquiry.
    try { onAccepted?.(); } catch (_) {}
  } finally {
    clearTimeout(timer);
  }
}
