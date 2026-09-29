# hbcoser-site

Source for **https://www.hbcoser.com** — a B2B site for kids' cosplay, pet costumes and
party/event supply, sold wholesale and OEM to importers, distributors, retailers, event
producers and venue operators.

This is the third site in the HB family and shares its build approach with
`hongbocostumes-site` (site 1) and `hongbocosplay-site` (site 2), but none of their visual
language. See [DESIGN.md](DESIGN.md) for the binding rules that keep the three brands apart.

React 18 + Vite 5 + React Router v6, deployed on Vercel from `main`. There is no CMS, no
database and no server: the site is static files plus one third-party form endpoint.

## Scripts

```bash
npm install
npm run dev      # local dev server on 127.0.0.1
npm run build    # client build + SSR bundle + prerender every route into dist/
npm run preview  # preview the built output

node scripts/gen-sitemap.mjs          # regenerate public/sitemap.xml — run after any catalogue or article change
node scripts/fetch-product-images.mjs # re-download and normalise every product photo from its source
node scripts/fetch-fonts.mjs          # re-download the self-hosted fonts and rewrite src/styles/fonts.css
node scripts/serve-dist.mjs 4173      # tiny static server with SPA fallback, for checking a build
```

`npm run preview` needs esbuild and hits `spawn EPERM` in this environment; use
`serve-dist.mjs` instead.

## Routes

`/` · `/shop` · `/shop/:category` · `/product/:id` · `/custom` · `/about` · `/blog` ·
`/blog/:slug` · `/inquiry` · 404 fallback

Three categories: `kids`, `pets`, `party`.

## Prerendering

`npm run build` runs three steps: the client build, an SSR bundle of `src/entry-server.jsx`,
then `scripts/prerender.mjs`, which renders all 41 public routes with `react-dom/server` and
writes real HTML — including that route's title, description, canonical and og tags — so a
crawler that never runs JavaScript still receives a complete page. No SSR framework and no
new runtime dependency.

Three things to preserve when touching this:

- **`vercel.json` must keep `cleanUrls: true`.** Vercel does not map `/blog` to `blog.html` on
  its own; without it every extensionless route falls through and the prerendered files are
  unreachable.
- **Do not add a catch-all rewrite.** Unmatched paths are answered by the prerendered
  `404.html`, which returns a real 404 status and deliberately carries no canonical.
- **`src/lib/route-meta.js` is the only place page metadata lives.** The static HTML and the
  hydrated app both read it, which is what keeps them from disagreeing and triggering a
  hydration mismatch. A new route belongs there and in `ROUTES` in `entry-server.jsx`.

## Adding or changing products

`src/data/products.json` is the single source of truth. Each entry carries `id`, `title`,
`category` (`kids` | `pets` | `party`), `priceUsdMin` / `priceUsdMax`, `moq`, `sourceUrl`,
`sourceImage` and `image`.

Then run `node scripts/fetch-product-images.mjs`. It downloads each `sourceImage`, resizes the
long edge to 900px, re-encodes to progressive JPEG and **writes the real `width` / `height`
back into the JSON** — those values reserve space in the layout, so they must not be guessed.
Anything still over 150KB gets a cheaper second and third pass automatically.

The same script also writes `public/_qc/contact-sheet.jpg` — every product photo on one page,
in products.json order. **Look at it before pushing.** It is how the watermark, the supplier
banner, the colour chart and the Chinese marketing text were caught on this catalogue, and it
is far cheaper than opening 28 files one at a time. Delete `public/_qc/` before committing; it
is a working file, not an asset.

Product photos must be photographs of the actual goods. Never substitute a generated or
borrowed image: a buyer who orders something different from the picture is a lost account.

## Content rules

- **No IP.** No character names, studio names, franchise names or trademarked likenesses in
  titles, copy or imagery. Describe the category, not the property.
- **Titles describe the product, not the supplier's keyword list.** Supplier titles arrive full
  of "Factory Wholesale Best Quality…" — rewrite them before they reach the catalogue.
- **No claim about the factory that is not true.** If a capability has not been verified, it
  does not go on the page.

## Inquiry delivery

The form posts to FormSubmit and is forwarded to `stellagaoxin@gmail.com`.

**The endpoint answers HTTP 200 even when it rejects a submission.** Never treat the status
code as success — the code checks the response body's `success` field, and shows a real failure
state with clickable email and WhatsApp fallbacks.

**FormSubmit activation is per form page, and a new domain is a new form page.** The first
submission on `hbcoser.com` is silently dropped until the activation link in that email is
clicked. Re-test the channel after any DNS, host or domain change.

## Performance rules worth not breaking

- Images above the fold must **not** use `loading="lazy"`. It has caused a blank hero twice.
  Verify `naturalWidth` at first paint, not after a scroll — scrolling hides the defect.
- Fonts are self-hosted woff2. No external font CDN. IBM Plex Mono has no variable axis on
  Google Fonts, so it ships as three static weights — that is deliberate, not an oversight.
- No UI framework, no Markdown parser, no CMS. The build stays small on purpose.

## More documentation

- [DESIGN.md](DESIGN.md) — the visual contract and the rules that keep this site distinct
- [ARCHITECTURE.md](ARCHITECTURE.md) — the storage and delivery stack, layer by layer
- [RECOVERY.md](RECOVERY.md) — how to rebuild everything from nothing
