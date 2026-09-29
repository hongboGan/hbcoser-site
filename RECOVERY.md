# RECOVERY.md — rebuilding hbcoser.com from nothing

An honest answer to "what happens if this is lost". Read it with
[ARCHITECTURE.md](ARCHITECTURE.md), which describes the stack this document restores.

## What is recoverable, and what is not

| Asset | Where it lives | Recoverable without it? |
|---|---|---|
| Source code, design system, catalogue data | GitHub `hbcoser-site` | Yes, from any clone |
| Product images (28) | In the repository under `public/products/` | Yes, from any clone |
| Fonts (5 woff2) | In the repository under `public/fonts/` | Yes — or re-run `node scripts/fetch-fonts.mjs` |
| Hosting, TLS, CDN | Vercel project `hbcoser-site` | Yes — re-import the repository |
| DNS zone | Cloudflare account | **No.** Every record must be re-created by hand |
| Domain `hbcoser.com` | Registrar | **No.** This is the one asset that cannot be re-created |
| Inquiry delivery | FormSubmit activation for `stellagaoxin@gmail.com` | **No** — must be re-activated |
| Search history / indexing | Google Search Console | Partly. Re-verify and resubmit; rankings rebuild slowly |

The three items marked **No** are the real risk. Everything else is a clone and a rebuild.

## Scenario 1 — a bad deploy or a broken build

```bash
git log --oneline -10          # find the last good commit
git revert <sha>               # revert, do not reset — main is what Vercel builds
git push origin main
```

Vercel redeploys on the push. If the site is down entirely, Vercel keeps every previous
deployment; promote the last good one from the dashboard to restore service immediately, then
fix forward.

## Scenario 2 — the local machine is lost

```bash
git clone https://github.com/<owner>/hbcoser-site.git
cd hbcoser-site
npm install
node scripts/fetch-fonts.mjs        # only if public/fonts/ is missing
node scripts/gen-sitemap.mjs
npm run build
node scripts/serve-dist.mjs 4173    # check the build locally before pushing anything
```

`npm run preview` needs esbuild and hits `spawn EPERM` in this environment. Use
`serve-dist.mjs`.

**Check `public/products/` exists and holds 28 JPEGs.** If the images are missing, restore
them with `node scripts/fetch-product-images.mjs`, which re-downloads each one from the
`sourceImage` recorded in `src/data/products.json`. That script also writes the real width and
height back into the JSON, so the layout's reserved space stays correct.

## Scenario 3 — GitHub is unreachable (a real condition from mainland China)

The build has no dependency on GitHub at runtime — only deploys do. Work locally, commit
locally, and push when the route is back. If the outage is long enough to matter:

- Push the same repository to a second remote (Gitee or GitLab) and import *that* into Vercel.
- Or deploy directly from the local folder with the Vercel CLI.

Vercel itself is reachable from mainland China for deploying; it is the git host that is
intermittent.

## Scenario 4 — the Vercel project is deleted

1. In Vercel, import `hbcoser-site` from GitHub again.
2. Framework preset `Vite`, build command `npm run build`, output directory `dist`.
3. Attach `www.hbcoser.com` and let the apex redirect to it.
4. Confirm `vercel.json` still contains `cleanUrls: true` **before** the first deploy — a
   missing `cleanUrls` ships a site whose routes all return the empty SPA shell, and it looks
   like a content problem rather than a config one.

## Scenario 5 — the domain or the DNS zone is lost

This is the expensive one. There is no technical recovery for a domain; it is a commercial
and legal process with the registrar, and it depends on being able to prove control.

For DNS, if the Cloudflare account survives but the zone does not, re-create:

| Record | Purpose |
|---|---|
| `A` / `CNAME` for `www` and the apex | Point at Vercel |
| `TXT` — Google site verification | Prove ownership of the domain to Search Console |
| `MX` and SPF/DKIM `TXT` | Mail for the sending domain |

**Export the zone before every structural change.** A zone file is a text file; there is no
excuse for rebuilding record lists from memory, and a missed mail record is how an inquiry
address stops receiving.

## Scenario 6 — inquiries stop arriving

The website can be perfectly healthy and the inquiry path dead. Work in this order:

1. **Check the spam folder**, then the `success` field. The form checks the response body's
   `success` field rather than the HTTP status, because FormSubmit answers `200` even when it
   rejects a submission.
2. **Check the activation.** Activation is per form page. A domain change is a new form page,
   and an unactivated page drops submissions silently.
3. **Send one live test submission** and confirm it lands. Verify with a real submission, not
   with a read of the code:

```bash
curl -X POST "https://formsubmit.co/ajax/stellagaoxin@gmail.com" \
  -H "Content-Type: application/json" \
  -d '{"Name":"Recovery test","Company":"Internal","Email":"test@example.com","Message":"channel test","_captcha":"false"}'
```

A working reply is `{"success":"true"}`. Anything else means the channel is down — treat it as
a production incident, because it is one.

## The rule this file exists to enforce

The site is not the asset. **The inquiry channel is the asset.** A restoring engineer who
brings the pages back and stops there has restored a brochure, not a business. Every scenario
above ends with the same final step: send a real submission and watch it arrive.
