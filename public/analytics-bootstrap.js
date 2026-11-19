/* Load the existing container once, only on the public site and outside internal testing. */
(function (window, document) {
  'use strict';
  if (window.__HB_ANALYTICS__) return;
  var measurementId = 'G-40RVZTDFNM';
  var key = 'hb_internal_traffic';
  var url = new URL(window.location.href);
  var requested = url.searchParams.get('hb_internal');
  var stored = false;
  var cookie = false;
  try { stored = window.localStorage.getItem(key) === '1'; } catch (_) {}
  try { cookie = document.cookie.split(';').some(function (part) { return part.trim() === key + '=1'; }); } catch (_) {}
  var internal = stored || cookie;
  if (requested === '1' || requested === '0') {
    internal = requested === '1';
    try {
      if (internal) window.localStorage.setItem(key, '1');
      else window.localStorage.removeItem(key);
    } catch (_) {}
    try {
      document.cookie = key + '=' + (internal ? '1' : '') + '; Path=/; SameSite=Lax; Max-Age=' + (internal ? '31536000' : '0') + (url.protocol === 'https:' ? '; Secure' : '');
    } catch (_) {}
    var persisted = false;
    try { persisted = window.localStorage.getItem(key) === '1'; } catch (_) {}
    try { persisted = persisted || document.cookie.split(';').some(function (part) { return part.trim() === key + '=1'; }); } catch (_) {}
    // Never silently resume collection when the stored exclusion could not be cleared.
    if (!internal && persisted) internal = true;
    if (persisted === internal) {
      url.searchParams.delete('hb_internal');
      try { window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash); } catch (_) {}
    }
  }
  var production = url.protocol === 'https:' && (url.hostname === 'www.hbcoser.com' || url.hostname === 'hbcoser.com');
  var state = window.__HB_ANALYTICS__ = {
    enabled: production && !internal,
    internal: internal,
    reason: internal ? 'internal' : production ? 'production' : 'non-production'
  };
  function disable() {
    state.enabled = false;
    state.internal = true;
    state.reason = 'internal';
    window['ga-disable-' + measurementId] = true;
  }
  // Marking another tab internal also disables event collection in this document.
  window.addEventListener('storage', function (event) {
    if (event.key === key && event.newValue === '1') disable();
  });
  if (!state.enabled) {
    window['ga-disable-' + measurementId] = true;
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-KDKGFJR7';
  document.head.appendChild(script);
})(window, document);
