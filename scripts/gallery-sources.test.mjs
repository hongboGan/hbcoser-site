import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { gallerySizes, gallerySources, galleryVisibility } from '../src/lib/gallery-sources.js';
import { ADDED_GALLERY_IMAGES } from '../src/data/added-gallery-images.js';
const manifest = JSON.parse(fs.readFileSync(new URL('../src/data/gallery-variants.json', import.meta.url)));

test('all added photos have responsive variants backed by real files', () => {
  assert.deepEqual(Object.keys(manifest), Object.keys(ADDED_GALLERY_IMAGES));
  for (const [image, entries] of Object.entries(manifest)) {
    assert.equal(entries.at(-1).src, image);
    assert.equal(entries.at(-1).width, ADDED_GALLERY_IMAGES[image].width);
    assert.equal(entries[0].width, 320);
    for (const entry of entries) {
      assert.ok(fs.existsSync(new URL(`../public${entry.src}`, import.meta.url)));
    }
    const sources = gallerySources(image, 'factory');
    assert.equal(sources.mobile, undefined);
    assert.ok(sources.srcSet.includes('320w'));
    assert.ok(sources.sizes.includes('390px'));
  }
});
test('existing pictures retain mobile URLs and never get nonexistent variants', () => {
  const result = gallerySources('/factory/factory-01.webp', 'factory');
  assert.equal(result.mobile, '/factory/factory-01-mobile.webp');
  assert.equal(result.srcSet, undefined);
  assert.equal(result.sizes, undefined);
});
test('visibility fallback loads nearby strips and pauses distant ones', () => {
  assert.deepEqual(galleryVisibility({ top: 1600, bottom: 1800, left: 16, right: 374 }, 844, 390), { near: false, visible: false });
  assert.deepEqual(galleryVisibility({ top: 1200, bottom: 1400, left: 16, right: 374 }, 844, 390), { near: true, visible: false });
  assert.deepEqual(galleryVisibility({ top: 300, bottom: 540, left: 16, right: 374 }, 844, 390), { near: true, visible: true });
  assert.deepEqual(galleryVisibility({ top: -900, bottom: -650, left: 16, right: 374 }, 844, 390), { near: false, visible: false });
});

test('source sizes match the three existing carousel layouts', () => {
  assert.equal(gallerySizes('custom-home'), '(max-width: 640px) 150px, 220px');
  assert.ok(gallerySizes('custom-page').includes('26vw, 320px'));
  assert.ok(gallerySizes('factory').includes('32vw, 390px'));
});
