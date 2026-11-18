import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ECOMMERCE_PRODUCT,
  getInquiryContext,
  initialInquiryValues,
  createInquiryReference,
  validateInquiry,
} from '../src/lib/inquiry-form.js';

const getProduct = (id) => id === 'known-1' ? { id, title: 'Known costume' } : null;
const shortTitle = (product) => product.title;

 test('only Name, Email and Product are required', () => {
  const values = initialInquiryValues();
  assert.deepEqual(Object.keys(validateInquiry(values)), ['Name', 'Email', 'Product']);
  values.Name = 'A';
  values.Email = 'buyer@example.com';
  values.Product = 'Costume set';
  assert.deepEqual(validateInquiry(values), {});
});

test('valid email is checked without requiring optional details', () => {
  const values = { ...initialInquiryValues(), Name: 'A', Email: 'not-an-email', Product: 'Costume' };
  assert.equal(validateInquiry(values).Email, 'That email address looks incomplete.');
});

test('known product wins over ecommerce scenario and unknown query is not echoed', () => {
  const known = getInquiryContext(new URLSearchParams('product=known-1&scenario=ecommerce&foo=private'), getProduct, shortTitle);
  assert.equal(known.productValue, 'Known costume (ref known-1)');
  const scenario = getInquiryContext(new URLSearchParams('scenario=ecommerce&foo=private'), getProduct, shortTitle);
  assert.equal(scenario.productValue, ECOMMERCE_PRODUCT);
  const unknown = getInquiryContext(new URLSearchParams('foo=private'), getProduct, shortTitle);
  assert.equal(unknown.productValue, '');
});

test('reference uses UUID when available and fallback supports injected randomness', () => {
  assert.equal(createInquiryReference(undefined, { randomUUID: () => 'test-uuid' }), 'HB-test-uuid');
  assert.match(createInquiryReference(() => 0.5, undefined), /^HB-[A-Z0-9]{12}$/);
});

test('context exposes only allowlisted source fields', () => {
  const context = getInquiryContext(new URLSearchParams('product=known-1&scenario=ecommerce&email=pii'), getProduct, shortTitle);
  assert.deepEqual({ sourceProduct: context.sourceProduct, sourceScenario: context.sourceScenario }, {
    sourceProduct: 'known-1',
    sourceScenario: 'ecommerce',
  });
  assert.equal('email' in context, false);
});
