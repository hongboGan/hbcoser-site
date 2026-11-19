import { metaForPath, ORIGIN } from './route-meta.js';

const MEASUREMENT_ID = 'G-40RVZTDFNM';
const INTERNAL_KEY = 'hb_internal_traffic';
const acceptedInquiries = new Set();
const POSITIONS = new Set(['header', 'mobile_contact', 'menu', 'footer', 'content']);

export function analyticsAllowed(win = globalThis.window) {
  if (!win || !win.__HB_ANALYTICS__?.enabled || win[`ga-disable-${MEASUREMENT_ID}`]) return false;
  if (win.location.protocol !== 'https:' || !['www.hbcoser.com', 'hbcoser.com'].includes(win.location.hostname)) return false;
  try { if (win.localStorage.getItem(INTERNAL_KEY) === '1') return false; } catch (_) {}
  try { if (win.document.cookie.split(';').some(part => part.trim() === `${INTERNAL_KEY}=1`)) return false; } catch (_) {}
  return true;
}

function sendEvent(name, fields, win) {
  try {
    if (!analyticsAllowed(win) || typeof win.gtag !== 'function') return false;
    const meta = metaForPath(win.location.pathname);
    // Never forward the current URL query, WhatsApp text, form values or an unknown path.
    win.gtag('event', name, {
      send_to: MEASUREMENT_ID,
      page_location: `${ORIGIN}${meta.path || '/'}`,
      page_title: meta.title,
      page_referrer: '',
      ...fields,
    });
    return true;
  } catch (_) {
    // Analytics failure must never change delivery success or block navigation.
    return false;
  }
}

export function trackAcceptedInquiry(reference, win = globalThis.window) {
  if (!reference || acceptedInquiries.has(reference)) return false;
  const sent = sendEvent('generate_lead', {
    form_id: 'wholesale_inquiry',
    lead_type: 'website_inquiry',
    submission_status: 'service_accepted',
  }, win);
  // Used only in memory to deduplicate. The inquiry reference is NOT sent to Google.
  if (sent) acceptedInquiries.add(reference);
  return sent;
}

export function trackWhatsAppClick(position = 'content', win = globalThis.window) {
  return sendEvent('whatsapp_click', {
    contact_method: 'whatsapp',
    link_placement: POSITIONS.has(position) ? position : 'content',
  }, win);
}

export function handleContactClick(event, win = globalThis.window) {
  if (event.type === 'auxclick' && event.button !== 1) return false;
  if (event.type === 'click' && event.button > 0) return false;
  const anchor = event.target?.closest?.('a[href]');
  if (!anchor) return false;
  let url;
  try { url = new URL(anchor.href); } catch (_) { return false; }
  if (url.protocol !== 'https:' || url.hostname !== 'wa.me') return false;
  let position = 'content';
  if (anchor.closest('.mobile-contact')) position = 'mobile_contact';
  else if (anchor.closest('.drawer')) position = 'menu';
  else if (anchor.closest('header')) position = 'header';
  else if (anchor.closest('footer')) position = 'footer';
  return trackWhatsAppClick(position, win);
}
