import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { analyticsAllowed, trackAcceptedInquiry, trackWhatsAppClick, handleContactClick } from '../src/lib/analytics.js';
import { submitInquiryToService } from '../src/lib/inquiry-delivery.js';

const bootstrap = fs.readFileSync(new URL('../public/analytics-bootstrap.js', import.meta.url), 'utf8');
function browser(href = 'https://www.hbcoser.com/inquiry', options = {}) {
  const location = new URL(href);
  const entries = new Map(options.stored ? [['hb_internal_traffic', '1']] : []);
  const appended = [];
  const handlers = {};
  const replacements = [];
  let cookie = options.cookie || '';
  const document = {
    get cookie() { if (options.blockStorage) throw Error('blocked'); return cookie; },
    set cookie(value) { if (options.blockStorage) throw Error('blocked'); cookie = value.includes('Max-Age=0') ? '' : value.split(';')[0]; },
    createElement: tag => ({ tag }),
    head: { appendChild: script => appended.push(script) },
  };
  const win = {
    location, document,
    history: { state: null, replaceState: (_a, _b, value) => replacements.push(value) },
    localStorage: {
      getItem(k) { if (options.blockStorage) throw Error('blocked'); return entries.get(k) ?? null; },
      setItem(k, v) { if (options.blockStorage) throw Error('blocked'); entries.set(k, v); },
      removeItem(k) { if (options.blockStorage) throw Error('blocked'); entries.delete(k); },
    },
    addEventListener: (type, fn) => { handlers[type] = fn; },
  };
  const context = { window: win, document, URL, Date };
  vm.runInNewContext(bootstrap, context);
  return { win, context, appended, replacements, handlers, entries };
}
const calls = fixture => (fixture.win.dataLayer || []).filter(entry => entry[0] === 'event');

test('production loads only the existing GTM once and never adds a GA config', () => {
  const f = browser();
  vm.runInNewContext(bootstrap, f.context);
  assert.equal(f.appended.length, 1);
  assert.equal(f.appended[0].src, 'https://www.googletagmanager.com/gtm.js?id=GTM-KDKGFJR7');
  assert.equal(f.win.dataLayer.filter(e => e.event === 'gtm.js').length, 1);
  assert.equal(f.win.dataLayer.some(e => e[0] === 'config'), false);
});

test('local, IP, preview, lookalike and non-HTTPS hosts do not load or track', () => {
  for (const url of ['http://127.0.0.1:4175/', 'http://localhost:4175/', 'http://[::1]/', 'https://hbcoser-site.vercel.app/', 'https://www.hbcoser.com.evil.example/', 'http://www.hbcoser.com/']) {
    const f = browser(url);
    assert.equal(f.appended.length, 0, url);
    assert.equal(f.win['ga-disable-G-40RVZTDFNM'], true);
    assert.equal(analyticsAllowed(f.win), false);
    assert.equal(trackWhatsAppClick('header', f.win), false);
  }
  assert.equal(analyticsAllowed(undefined), false);
});

test('internal query is persisted before any tag loads and is stripped without losing other parameters', () => {
  const f = browser('https://www.hbcoser.com/inquiry?scenario=ecommerce&hb_internal=1#details');
  assert.equal(f.appended.length, 0);
  assert.equal(f.entries.get('hb_internal_traffic'), '1');
  assert.deepEqual(f.replacements, ['/inquiry?scenario=ecommerce#details']);
  assert.equal(trackAcceptedInquiry('HB-internal', f.win), false);
  assert.equal(browser(undefined, {stored:true}).appended.length, 0);
  assert.equal(browser(undefined, {cookie:'hb_internal_traffic=1'}).appended.length, 0);
});

test('explicit disable-internal command clears stored browser exclusion', () => {
  const f = browser('https://www.hbcoser.com/?hb_internal=0', {stored:true, cookie:'hb_internal_traffic=1'});
  assert.equal(f.win.__HB_ANALYTICS__.enabled, true);
  assert.equal(f.entries.has('hb_internal_traffic'), false);
  assert.equal(f.win.document.cookie, '');
  assert.deepEqual(f.replacements, ['/']);
});

test('blocked browser storage keeps internal suppression and leaves the query visible', () => {
  const f = browser('https://www.hbcoser.com/?hb_internal=1', {blockStorage:true});
  assert.equal(f.appended.length, 0);
  assert.equal(f.win.__HB_ANALYTICS__.internal, true);
  assert.equal(f.replacements.length, 0);
});

test('another tab marking internal disables future events in this document', () => {
  const f = browser();
  f.handlers.storage({key:'hb_internal_traffic', newValue:'1'});
  assert.equal(analyticsAllowed(f.win), false);
  assert.equal(trackWhatsAppClick('header', f.win), false);
});

test('accepted inquiries are deduplicated and event payloads exclude reference and URL private data', () => {
  const f = browser('https://www.hbcoser.com/inquiry?email=buyer%40example.com&message=private#secret');
  assert.equal(trackAcceptedInquiry('HB-unit-one', f.win), true);
  assert.equal(trackAcceptedInquiry('HB-unit-one', f.win), false);
  const events = calls(f);
  assert.equal(events.length, 1);
  assert.equal(events[0][1], 'generate_lead');
  assert.equal(events[0][2].page_location, 'https://www.hbcoser.com/inquiry');
  assert.equal(events[0][2].submission_status, 'service_accepted');
  const payload = JSON.stringify(Array.from(events[0]));
  for (const forbidden of ['HB-unit-one','buyer','example.com','private','secret','email','message']) assert.equal(payload.includes(forbidden), false);
});

test('unknown paths and caller-provided placement are not reflected into events', () => {
  const f = browser('https://www.hbcoser.com/buyer-private-info');
  assert.equal(trackWhatsAppClick('buyer@example.com', f.win), true);
  assert.equal(calls(f)[0][2].link_placement, 'content');
  assert.equal(calls(f)[0][2].page_location, 'https://www.hbcoser.com/');
});

test('WhatsApp detection covers nested icons and middle click without interfering with navigation', () => {
  const f = browser();
  const anchor = {href:'https://wa.me/8615926072590?text=PRIVATE', closest:s=>s==='.mobile-contact' ? {} : null};
  const event = {type:'click', button:0, target:{closest:()=>anchor}, preventDefault:()=>{throw Error('navigation must not be blocked');}};
  assert.equal(handleContactClick(event, f.win), true);
  assert.equal(handleContactClick({...event,type:'auxclick',button:1}, f.win), true);
  assert.equal(handleContactClick({...event,type:'auxclick',button:2}, f.win), false);
  assert.equal(calls(f).length, 2);
  assert.equal(calls(f)[0][2].link_placement, 'mobile_contact');
  assert.equal(JSON.stringify(calls(f)).includes('PRIVATE'), false);
  anchor.href = 'https://wa.me.evil.example/';
  assert.equal(handleContactClick(event, f.win), false);
});

test('analytics errors do not throw or turn an accepted request into failure', async () => {
  const f = browser();
  f.win.gtag = () => { throw Error('blocked'); };
  assert.equal(trackAcceptedInquiry('HB-blocked', f.win), false);
  await submitInquiryToService('https://example.invalid', {}, () => {throw Error('analytics failure');}, async()=>({ok:true,json:async()=>({success:true})}));
});

test('service acceptance emits one lead; HTTP 200 rejection, malformed data and network failures emit none', async () => {
  for (const value of [true, 'true']) {
    const f = browser(); let requests = 0;
    await submitInquiryToService('https://example.invalid', {Name:'PRIVATE',Email:'buyer@example.com'}, ()=>trackAcceptedInquiry(`HB-success-${value === true ? 'bool' : 'str'}`, f.win), async(_url, request)=>{
      requests++;
      assert.equal(request.method, 'POST');
      return {ok:true,json:async()=>({success:value})};
    });
    assert.equal(requests, 1); assert.equal(calls(f).length, 1);
  }
  for (const response of [{ok:true,json:async()=>({success:false})},{ok:true,json:async()=>({})},{ok:false,json:async()=>({success:true})},{ok:true,json:async()=>{throw Error('invalid json');}},null]) {
    let requests = 0; let accepted = 0;
    await assert.rejects(submitInquiryToService('https://example.invalid', {}, ()=>accepted++, async()=>{requests++; if(!response) throw Error('network'); return response;}));
    assert.equal(requests, 1); assert.equal(accepted, 0);
  }
});
