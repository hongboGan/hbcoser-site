export const PROCUREMENT_TYPES = [
  'Stock order',
  'Stock sample',
  'Light customisation',
  'Custom sample',
  'Custom bulk',
];

export const ECOMMERCE_SCENARIO = 'ecommerce';
export const ECOMMERCE_PRODUCT = 'Ecommerce sourcing and labelling';

export function getInquiryContext(params, getProduct, shortTitle) {
  const productId = params.get('product');
  const product = productId ? getProduct(productId) : null;
  const scenario = params.get('scenario') === ECOMMERCE_SCENARIO ? ECOMMERCE_SCENARIO : '';
  const productValue = product
    ? `${shortTitle(product, 90)} (ref ${product.id})`
    : scenario === ECOMMERCE_SCENARIO
      ? ECOMMERCE_PRODUCT
      : '';

  return {
    product,
    productValue,
    sourceProduct: product ? product.id : '',
    sourceScenario: scenario,
  };
}

export function initialInquiryValues(productValue = '') {
  return {
    Name: '',
    Email: '',
    Product: productValue,
    Company: '',
    Country: '',
    Quantity: '',
    'Target date': '',
    'Procurement type': 'Stock order',
    Message: '',
  };
}

export function validateInquiry(values) {
  const errors = {};
  if (!values.Name.trim()) errors.Name = 'Please tell us your name.';
  if (!values.Email.trim()) errors.Email = 'We need an email to reply to.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.Email.trim())) {
    errors.Email = 'That email address looks incomplete.';
  }
  if (!values.Product.trim()) errors.Product = 'Which product or category are you asking about?';
  return errors;
}

export function createInquiryReference(random, cryptoApi = globalThis.crypto) {
  if (!random && typeof cryptoApi?.randomUUID === 'function') {
    return `HB-${cryptoApi.randomUUID()}`;
  }
  const fallbackRandom = random || Math.random;
  const part = `${Math.floor(fallbackRandom() * 0xffffffff).toString(36)}${Date.now().toString(36)}`
    .toUpperCase()
    .slice(-12);
  return `HB-${part}`;
}
