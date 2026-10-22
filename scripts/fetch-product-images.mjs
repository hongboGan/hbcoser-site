// Fetch every product photo from its Alibaba.com source, normalise it to the site's
// image budget, write the real pixel dimensions back into products.json, and build a
// single contact sheet so the whole catalogue can be checked for watermarks, supplier
// logos, Chinese marketing text and stray IP marks in one pass.
//
// Run after editing src/data/products.json:  node scripts/fetch-product-images.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const DATA = path.resolve('src/data/products.json');
const OUT_DIR = path.resolve('public/products');
const SHEET_DIR = path.resolve('public/_qc');
const SHEET = path.join(SHEET_DIR, 'contact-sheet.jpg');

const LONG_EDGE = 900;
const MAX_KB = 150;
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(SHEET_DIR, { recursive: true });

const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));

async function download(url) {
  // A browser-ish Referer is what the Alibaba CDN expects; without it several
  // hosts answer 403. Retry bare if the referer is rejected.
  for (const headers of [
    { 'User-Agent': UA, Referer: 'https://www.alibaba.com/', Accept: 'image/*,*/*;q=0.8' },
    { 'User-Agent': UA, Accept: 'image/*,*/*;q=0.8' },
  ]) {
    const res = await fetch(url, { headers });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if (res.status !== 403 && res.status !== 401) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  }
  throw new Error('403 from CDN with and without referer');
}

const report = [];

for (const product of data.products) {
  const dest = path.join(OUT_DIR, `${product.id}.jpg`);
  try {
    const raw = await download(product.sourceImage);
    const base = sharp(raw).rotate().flatten({ background: '#ffffff' });

    let info = await base
      .clone()
      .resize(LONG_EDGE, LONG_EDGE, { fit: 'inside', withoutEnlargement: false })
      .jpeg({ quality: 82, progressive: true, mozjpeg: true })
      .toFile(dest);

    // Page weight decides whether an overseas buyer waits or leaves, so a file over
    // budget gets cheaper passes instead of shipping as-is.
    if (info.size / 1024 > MAX_KB) {
      for (const [edge, quality] of [
        [900, 72],
        [760, 76],
        [620, 78],
      ]) {
        info = await base
          .clone()
          .resize(edge, edge, { fit: 'inside', withoutEnlargement: false })
          .jpeg({ quality, progressive: true, mozjpeg: true })
          .toFile(dest);
        if (info.size / 1024 <= MAX_KB) break;
      }
    }

    product.image = `/products/${product.id}.jpg`;
    product.width = info.width;
    product.height = info.height;
    report.push({ id: product.id, ok: true, w: info.width, h: info.height, kb: Math.round(info.size / 1024) });
  } catch (err) {
    report.push({ id: product.id, ok: false, error: err.message });
  }
}

fs.writeFileSync(DATA, `${JSON.stringify(data, null, 2)}\n`);

// --- contact sheet ---------------------------------------------------------
const ok = data.products.filter((p) => fs.existsSync(path.join(OUT_DIR, `${p.id}.jpg`)));
const TILE = 300;
const COLS = 5;
const PAD = 10;
const rows = Math.ceil(ok.length / COLS);
const sheetW = COLS * TILE + (COLS + 1) * PAD;
const sheetH = rows * TILE + (rows + 1) * PAD;

const tiles = [];
for (let i = 0; i < ok.length; i += 1) {
  const buf = await sharp(path.join(OUT_DIR, `${ok[i].id}.jpg`))
    .resize(TILE, TILE, { fit: 'contain', background: '#1a1a1a' })
    .toBuffer();
  tiles.push({
    input: buf,
    left: PAD + (i % COLS) * (TILE + PAD),
    top: PAD + Math.floor(i / COLS) * (TILE + PAD),
  });
}

await sharp({
  create: { width: sheetW, height: sheetH, channels: 3, background: '#1a1a1a' },
})
  .composite(tiles)
  .jpeg({ quality: 88 })
  .toFile(SHEET);

// Tile order is products.json order, so index -> id is exact.
console.log(
  JSON.stringify(
    {
      downloaded: report.filter((r) => r.ok).length,
      failed: report.filter((r) => !r.ok),
      sheet: SHEET,
      sheetOrder: ok.map((p, i) => `${i + 1}=${p.id}`),
      sizes: report.filter((r) => r.ok).map((r) => `${r.kb}KB ${r.w}x${r.h} ${r.id}`),
    },
    null,
    2
  )
);
