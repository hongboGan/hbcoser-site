import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const DATA = path.resolve('src/data/products.json');
const SOURCE = path.resolve('extracted/hongbo-products-68.json');
const OUT_DIR = path.resolve('public/products');
const MAX_KB = 150;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36';

const CATEGORY_MAP = {
  'Halloween Costumes': 'costumes',
  'Superhero, Movie & TV': 'costumes',
  'Anime & Cosplay': 'costumes',
  'Funny, Career & Novelty': 'costumes',
  'Kids, Princess & Party': 'kids',
  'Party Masks, Hats & Props': 'party',
  'Christmas & Thanksgiving': 'party',
};

fs.mkdirSync(OUT_DIR, { recursive: true });
const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const source = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
const existing = new Set(data.products.map((p) => p.id));
const report = [];

async function download(url) {
  const variants = [
    { 'User-Agent': UA, Referer: 'https://www.hongbocostumes.com/', Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8' },
    { 'User-Agent': UA, Accept: 'image/*,*/*;q=0.8' },
  ];
  let last;
  for (const headers of variants) {
    try {
      const res = await fetch(url, { headers });
      if (res.ok) return Buffer.from(await res.arrayBuffer());
      last = new Error(`${res.status} ${res.statusText}`);
    } catch (err) {
      last = err;
    }
  }
  throw last || new Error('image download failed');
}

for (const item of source.products) {
  const id = item.slug;
  if (existing.has(id)) {
    report.push({ id, ok: false, error: 'duplicate id already exists' });
    continue;
  }
  const category = CATEGORY_MAP[item.category];
  if (!category) {
    report.push({ id, ok: false, error: `unmapped category: ${item.category}` });
    continue;
  }
  const dest = path.join(OUT_DIR, `${id}.jpg`);
  try {
    const raw = await download(item.mainImageUrl);
    const base = sharp(raw).rotate().flatten({ background: '#ffffff' });
    let info = await base.clone()
      .resize(900, 900, { fit: 'inside', withoutEnlargement: false })
      .jpeg({ quality: 82, progressive: true, mozjpeg: true })
      .toFile(dest);
    if (info.size / 1024 > MAX_KB) {
      for (const [edge, quality] of [[900, 72], [760, 76], [620, 78]]) {
        info = await base.clone()
          .resize(edge, edge, { fit: 'inside', withoutEnlargement: false })
          .jpeg({ quality, progressive: true, mozjpeg: true })
          .toFile(dest);
        if (info.size / 1024 <= MAX_KB) break;
      }
    }
    const product = {
      id,
      title: item.originalTitle,
      category,
      ...(item.price == null ? {} : { priceUsdMin: item.price, priceUsdMax: item.price }),
      moq: null,
      sourceUrl: item.detailUrl,
      sourceImage: item.mainImageUrl,
      image: `/products/${id}.jpg`,
      width: info.width,
      height: info.height,
    };
    data.products.push(product);
    existing.add(id);
    report.push({ id, ok: true, category, kb: Math.round(info.size / 1024), width: info.width, height: info.height });
    console.log(`imported ${report.filter((r) => r.ok).length}/${source.products.length} ${id}`);
  } catch (err) {
    report.push({ id, ok: false, error: String(err.message || err) });
    console.error(`failed ${id}: ${err.message || err}`);
  }
}

if (report.some((r) => !r.ok)) {
  console.error(JSON.stringify({ failed: report.filter((r) => !r.ok) }, null, 2));
  process.exitCode = 1;
}

if (report.every((r) => r.ok)) {
  data.updated = new Date().toISOString().slice(0, 10);
  data.note = `${data.note} The authorized Hongbo Costumes catalogue import added ${source.products.length} products from the user's authorized source catalogue on ${data.updated}; source URLs and source image URLs are retained for traceability.`;
  fs.writeFileSync(DATA, `${JSON.stringify(data, null, 2)}\n`);
}

console.log(JSON.stringify({ imported: report.filter((r) => r.ok).length, failed: report.filter((r) => !r.ok), totalProducts: data.products.length }, null, 2));
