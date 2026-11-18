import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeSearch, matchesProductSearch } from '../src/lib/product-search.js';

const catalogue = readFileSync(new URL('../src/data/products.json', import.meta.url), 'utf8').replace(/^\uFEFF/, '');
const { products } = JSON.parse(catalogue);
const search = (query) => products.filter((product) => matchesProductSearch(product, query));
const ids = (items) => items.map((product) => product.id);

test('normalizes punctuation, case, full-width text and repeated spaces', () => {
  assert.equal(normalizeSearch('  ＰＡＮＤＡ--Bear   '), 'panda bear');
  assert.equal(normalizeSearch('PET / COSPLAY'), 'pet cosplay');
});

test('blank and punctuation-only queries preserve the full catalogue order', () => {
  for (const query of ['', '   ', '---']) assert.deepEqual(ids(search(query)), ids(products));
});

test('panda matches the two actual catalogue references', () => {
  assert.deepEqual(ids(search('panda')).sort(), ['mascot-panda-bear', 'pets-panda-hat-cape']);
  assert.deepEqual(ids(search('  PANDA  ')), ids(search('panda')));
});

test('matches reference codes and all words regardless of order', () => {
  assert.deepEqual(ids(search('mascot-panda-bear')), ['mascot-panda-bear']);
  assert.deepEqual(ids(search('bear panda')), ['mascot-panda-bear']);
});

test('supports display category names and subcategories', () => {
  const item = { id: 'sample', title: 'Plain outfit', category: 'kids', subcategory: 'occupation' };
  assert.equal(matchesProductSearch(item, 'character cosplay', 'Character Cosplay'), true);
  assert.equal(matchesProductSearch(item, 'occupation'), true);
  assert.equal(matchesProductSearch(item, 'panda'), false);
});

test('no-match and special-character queries do not throw', () => {
  assert.equal(search('zz-no-such-product-989898').length, 0);
  assert.doesNotThrow(() => search('<script>alert(1)</script>'));
  assert.equal(matchesProductSearch({}, 'panda'), false);
});

test('search may be combined with the existing category filter', () => {
  const results = search('panda');
  assert.deepEqual(ids(results.filter((product) => product.category === 'pets')), ['pets-panda-hat-cape']);
  assert.deepEqual(ids(results.filter((product) => product.category === 'mascot')), ['mascot-panda-bear']);
});
