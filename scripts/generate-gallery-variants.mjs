// Build versioned responsive copies; leave original images untouched.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { ADDED_GALLERY_IMAGES } from '../src/data/added-gallery-images.js';
const root = process.cwd();
const manifest = {};
const report = [];
for (const item of Object.values(ADDED_GALLERY_IMAGES)) {
  const input = path.join(root, 'public', item.image);
  const buffer = await fs.readFile(input);
  const metadata = await sharp(buffer).metadata();
  const widths = [320, 640].filter((w) => w < metadata.width);
  const variants = [];
  for (const width of widths) {
    const output = await sharp(buffer).resize({ width, withoutEnlargement: true }).webp({ quality: 84 }).toBuffer();
    const hash = crypto.createHash('sha256').update(output).digest('hex').slice(0, 12);
    const filename = `${path.basename(item.image, '.webp')}-${width}-${hash}.webp`;
    const rel = `/gallery-responsive/${filename}`;
    await fs.mkdir(path.join(root, 'public/gallery-responsive'), { recursive: true });
    const file = path.join(root, 'public', rel);
    try { await fs.writeFile(file, output, { flag: 'wx' }); } catch (e) {
      if (e.code !== 'EEXIST' || !(await fs.readFile(file)).equals(output)) throw e;
    }
    variants.push({ src: rel, width, bytes: output.length });
  }
  variants.push({ src: item.image, width: metadata.width, bytes: buffer.length });
  manifest[item.image] = variants.map(({ src, width }) => ({ src, width }));
  report.push({ image: item.image, variants });
}
await fs.writeFile(path.join(root, 'src/data/gallery-variants.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ images: report.length, addedFiles: report.reduce((sum, r) => sum + r.variants.length - 1, 0), report }, null, 2));
