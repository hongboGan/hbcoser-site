// Download the display grotesk, the body sans and the mono into public/fonts and emit a
// local @font-face stylesheet. No external font CDN at runtime.
//
// Two modes per family, because Google Fonts does not serve every family as a variable
// font: `variable` fetches one file covering a weight range, `staticWeights` fetches one
// file per weight. IBM Plex Mono has no wght axis on Google Fonts, so it uses the latter.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const OUT_DIR = path.resolve('public/fonts');
const OUT_CSS = path.resolve('src/styles/fonts.css');
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(path.dirname(OUT_CSS), { recursive: true });

const SPEC = [
  { family: 'Space Grotesk', mode: 'variable', range: '500..700', file: 'space-grotesk-var.woff2' },
  { family: 'IBM Plex Sans', mode: 'variable', range: '400..600', file: 'ibm-plex-sans-var.woff2' },
  { family: 'IBM Plex Mono', mode: 'staticWeights', weights: [400, 500, 600], prefix: 'ibm-plex-mono' },
];

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res;
}

// One stylesheet can describe several subsets; the site only ever needs `latin`.
function pickLatinWoff2(css) {
  for (const block of css.split('@font-face').slice(1)) {
    const subset = /\/\*\s*([\w-]+)\s*\*\//.exec(block);
    const url = /url\((https:\/\/[^)]+\.woff2)\)/.exec(block);
    if (!url) continue;
    if (subset && subset[1] !== 'latin') continue;
    return url[1];
  }
  return null;
}

const cssUrl = (family, query) =>
  `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${query}&display=swap`;

const files = [];
const faceBlocks = [];

for (const spec of SPEC) {
  if (spec.mode === 'variable') {
    const picked = pickLatinWoff2(await (await get(cssUrl(spec.family, spec.range))).text());
    if (!picked) throw new Error(`no latin woff2 in stylesheet for ${spec.family}`);

    const buf = Buffer.from(await (await get(picked)).arrayBuffer());
    fs.writeFileSync(path.join(OUT_DIR, spec.file), buf);
    files.push({ family: spec.family, file: spec.file, bytes: buf.length });

    faceBlocks.push(`@font-face {
  font-family: '${spec.family}';
  font-style: normal;
  font-weight: ${spec.range.replace('..', ' ')};
  font-display: swap;
  src: url('/fonts/${spec.file}') format('woff2-variations');
}`);
    continue;
  }

  for (const weight of spec.weights) {
    const picked = pickLatinWoff2(await (await get(cssUrl(spec.family, String(weight)))).text());
    if (!picked) throw new Error(`no latin woff2 for ${spec.family} ${weight}`);

    const file = `${spec.prefix}-${weight}.woff2`;
    const buf = Buffer.from(await (await get(picked)).arrayBuffer());
    fs.writeFileSync(path.join(OUT_DIR, file), buf);
    files.push({ family: spec.family, file, bytes: buf.length });

    faceBlocks.push(`@font-face {
  font-family: '${spec.family}';
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url('/fonts/${file}') format('woff2');
}`);
  }
}

const sha1 = (file) =>
  crypto.createHash('sha1').update(fs.readFileSync(path.join(OUT_DIR, file))).digest('hex').slice(0, 12);

fs.writeFileSync(OUT_CSS, faceBlocks.join('\n\n') + '\n');

console.log(
  JSON.stringify(
    {
      files: files.map((f) => ({ ...f, kb: Math.round(f.bytes / 1024), sha1: sha1(f.file) })),
      totalKB: Math.round(files.reduce((s, f) => s + f.bytes, 0) / 1024),
      css: OUT_CSS,
    },
    null,
    2
  )
);
