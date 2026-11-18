import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CONTACT, getProduct, shortTitle, waLink } from '../data/products.js';
import { usePageMeta } from '../lib/seo.js';
import {
  createInquiryReference,
  getInquiryContext,
  initialInquiryValues,
  PROCUREMENT_TYPES,
  validateInquiry,
} from '../lib/inquiry-form.js';
import { MailIcon, WhatsAppIcon } from '../components/icons.jsx';
import '../components/inquiry-form.css';

function fieldId(key) {
  return `f-${key.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function errorId(key) {
  return `${fieldId(key)}-error`;
}

export default function Inquiry() {
  const [params] = useSearchParams();
  const { productValue, sourceProduct, sourceScenario } = getInquiryContext(params, getProduct, shortTitle);
  const [values, setValues] = useState(() => initialInquiryValues(productValue));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [notice, setNotice] = useState('');
  const [reference, setReference] = useState('');
  const valuesRef = useRef(values);
  const submitLock = useRef(false);
  const productPrefillRef = useRef(productValue);
  const focusRequest = useRef(null);
  const successHeading = useRef(null);

  usePageMeta();

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  useEffect(() => {
    const previousPrefill = productPrefillRef.current;
    const shouldUpdateProduct = valuesRef.current.Product === previousPrefill;
    productPrefillRef.current = productValue;
    if (shouldUpdateProduct) {
      setValues((previous) => ({ ...previous, Product: productValue }));
    }
  }, [productValue]);

  useEffect(() => {
    const key = focusRequest.current;
    if (!key) return;
    focusRequest.current = null;
    const frame = requestAnimationFrame(() => {
      const field = document.getElementById(fieldId(key));
      field?.focus({ preventScroll: true });
      field?.scrollIntoView({ block: 'center', behavior: 'auto' });
    });
    return () => cancelAnimationFrame(frame);
  }, [errors]);

  useEffect(() => {
    if (status === 'done') {
      successHeading.current?.focus({ preventScroll: true });
      successHeading.current?.scrollIntoView({ block: 'center', behavior: 'auto' });
    }
  }, [status]);

  function set(key, value) {
    setValues((previous) => ({ ...previous, [key]: value }));
    if (errors[key]) setErrors((previous) => ({ ...previous, [key]: undefined }));
  }

  function mailDraft() {
    const body = [
      `Name: ${values.Name}`,
      `Email: ${values.Email}`,
      values.Company && `Company: ${values.Company}`,
      values.Country && `Country: ${values.Country}`,
      `Product: ${values.Product}`,
      `Procurement type: ${values['Procurement type']}`,
      values.Quantity && `Quantity: ${values.Quantity}`,
      values['Target date'] && `Target date: ${values['Target date']}`,
      values.Message && `Message: ${values.Message}`,
      reference && `Inquiry reference: ${reference}`,
    ].filter(Boolean).join('\n');
    const subject = `Website inquiry — ${values.Company || values.Name}`;
    return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function sendPrimary(payload) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${CONTACT.formEmail || CONTACT.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data || String(data.success) !== 'true') {
        throw new Error('FormSubmit delivery failed');
      }
    } finally {
      clearTimeout(timer);
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (submitLock.current) return;
    const currentValues = valuesRef.current;
    const nextErrors = validateInquiry(currentValues);
    const firstInvalid = Object.keys(nextErrors).find((key) => nextErrors[key]);
    focusRequest.current = firstInvalid || null;
    if (firstInvalid) document.getElementById(fieldId(firstInvalid))?.focus({ preventScroll: true });
    setErrors(nextErrors);
    if (firstInvalid) {
      setStatus('idle');
      setNotice('');
      return;
    }

    submitLock.current = true;
    const inquiryReference = reference || createInquiryReference();
    setReference(inquiryReference);
    setStatus('sending');
    setNotice('');
    const payload = {
      ...currentValues,
      'Inquiry reference': inquiryReference,
      'Inquiry source product': sourceProduct,
      'Inquiry source scenario': sourceScenario,
      _subject: `Website inquiry — ${currentValues.Company || currentValues.Name} (${inquiryReference})`,
      _template: 'table',
      _captcha: 'false',
    };

    try {
      await sendPrimary(payload);
      setStatus('done');
    } catch {
      setStatus('error');
      setNotice('Delivery could not be confirmed. Contact us with the reference before resubmitting to avoid duplicates.');
    } finally {
      submitLock.current = false;
    }
  }

  if (status === 'done') {
    return (
      <section className="section">
        <div className="shell">
          <p className="eyebrow">Inquiry</p>
          <h1 ref={successHeading} tabIndex={-1} style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>Thank you — your inquiry is with us.</h1>
          <p className="lede mt-1">Your inquiry reference is <strong className="inquiry-reference">{reference}</strong>. Please keep it for follow-up. We reply within one working day.</p>
          <div className="hero__actions">
            <a className="btn btn--primary" href={waLink('INQUIRY')}><WhatsAppIcon /> WhatsApp {CONTACT.whatsappDisplay}</a>
            <Link className="btn btn--ghost" to="/shop">Back to the catalogue</Link>
          </div>
        </div>
      </section>
    );
  }

  const invalid = (key) => (errors[key] ? 'true' : undefined);
  const describedBy = (key) => (errors[key] ? errorId(key) : undefined);
  const fieldError = (key) => errors[key] && <span id={errorId(key)} className="field__error" role="alert">{errors[key]}</span>;

  return (
    <section className="section">
      <div className="shell">
        <p className="eyebrow">Inquiry</p>
        <h1 style={{ fontSize: 'clamp(2rem, 4.4vw, 3.2rem)' }}>Request a quote</h1>
        <p className="lede mt-1">Tell us the item and the quantity. Quotes come back within one working day, by email or WhatsApp.</p>

        <div className="detail mt-3">
          <div className="panel">
            {status === 'error' && (
              <div className="notice notice--err" role="alert">
                <strong className="inquiry-reference">Inquiry reference: {reference}</strong><br />
                {notice} No automatic resend was attempted. You can retry manually, or use the email button below.
                <div className="hero__actions mt-2">
                  <a className="btn btn--primary" href={mailDraft()}><MailIcon /> Send it by email instead</a>
                  <a className="btn btn--ghost" href={waLink('INQUIRY')}><WhatsAppIcon /> WhatsApp {CONTACT.whatsappDisplay}</a>
                </div>
              </div>
            )}

            <form className="inquiry-form" onSubmit={onSubmit} noValidate>
              <p className="inquiry-form__optional">Only Name, Email and Product or category are required. Other details are optional.</p>
              <div className="form__row">
                <div className="field">
                  <label htmlFor="f-name">Your name <span className="req">*</span></label>
                  <input id="f-name" name="Name" required value={values.Name} onChange={(event) => set('Name', event.target.value)} aria-invalid={invalid('Name')} aria-describedby={describedBy('Name')} autoComplete="name" />
                  {fieldError('Name')}
                </div>
                <div className="field">
                  <label htmlFor="f-email">Email <span className="req">*</span></label>
                  <input id="f-email" name="Email" type="email" required value={values.Email} onChange={(event) => set('Email', event.target.value)} aria-invalid={invalid('Email')} aria-describedby={describedBy('Email')} autoComplete="email" />
                  {fieldError('Email')}
                </div>
              </div>

              <div className="field">
                <label htmlFor="f-product">Product or category <span className="req">*</span></label>
                <input id="f-product" name="Product" required value={values.Product} onChange={(event) => set('Product', event.target.value)} aria-invalid={invalid('Product')} aria-describedby={describedBy('Product')} placeholder="e.g. Kids' witch cloak set, 500 sets" />
                {fieldError('Product')}
              </div>

              <div className="field">
                <label htmlFor="f-procurement">Procurement type</label>
                <select id="f-procurement" name="Procurement type" value={values['Procurement type']} onChange={(event) => set('Procurement type', event.target.value)}>
                  {PROCUREMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <details className="inquiry-form__details">
                <summary>More details (optional)</summary>
                <div className="form__row">
                  <div className="field">
                    <label htmlFor="f-company">Company</label>
                    <input id="f-company" name="Company" value={values.Company} onChange={(event) => set('Company', event.target.value)} aria-describedby={describedBy('Company')} autoComplete="organization" />
                  </div>
                  <div className="field">
                    <label htmlFor="f-country">Country</label>
                    <input id="f-country" name="Country" value={values.Country} onChange={(event) => set('Country', event.target.value)} aria-describedby={describedBy('Country')} autoComplete="country-name" />
                  </div>
                </div>
                <div className="form__row">
                  <div className="field">
                    <label htmlFor="f-qty">Quantity</label>
                    <input id="f-qty" name="Quantity" value={values.Quantity} onChange={(event) => set('Quantity', event.target.value)} aria-describedby={describedBy('Quantity')} placeholder="e.g. 2 per style, mixed colours and sizes" inputMode="text" />
                  </div>
                  <div className="field">
                    <label htmlFor="f-date">Target date</label>
                    <input id="f-date" name="Target date" type="date" value={values['Target date']} onChange={(event) => set('Target date', event.target.value)} aria-describedby={describedBy('Target date')} />
                  </div>
                </div>
              </details>

              <div className="field">
                <label htmlFor="f-message">Message</label>
                <textarea id="f-message" name="Message" value={values.Message} onChange={(event) => set('Message', event.target.value)} aria-describedby={describedBy('Message')} placeholder="Colourway, sizing, branding, packaging — anything that affects the price." />
              </div>

              <button className="btn btn--primary" type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'}>{status === 'sending' ? 'Sending…' : status === 'error' ? 'Retry manually' : 'Send inquiry'}</button>
              <p className="inquiry-form__materials">Need to share reference images? <a href={mailDraft()}>Open an email draft, attach your files, and send it</a> to {CONTACT.email}. We do not ask you to upload files here.</p>
              <p className="mt-1" style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', marginBottom: 0 }}>We only use these details to answer your inquiry.</p>
            </form>
          </div>

          <div>
            <h2>Or reach us directly</h2>
            <div className="contact-ways">
              <a className="contact-way" href={`mailto:${CONTACT.email}`}><MailIcon size={20} /><span><strong>{CONTACT.email}</strong><em>Email — replies within one working day</em></span></a>
              <a className="contact-way" href={waLink('INQUIRY')}><WhatsAppIcon size={20} /><span><strong>{CONTACT.whatsappDisplay}</strong><em>WhatsApp — fastest for quick questions</em></span></a>
            </div>
            <p className="mt-2" style={{ fontSize: '0.92rem' }}>Sending a product code helps us quote faster — every product page has one. Or <Link to="/shop" style={{ color: 'var(--cyan)' }}>browse the catalogue</Link>.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
