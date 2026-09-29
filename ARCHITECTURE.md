# ARCHITECTURE.md — the storage and delivery stack

The target architecture, layer by layer: where each thing lives, why it lives there, and
which layers are actually in place today.

> 一句话：**注册商买门牌号 + Cloudflare 管解析 + GitHub 存图纸 + Vercel 开店。**

Companion document: [RECOVERY.md](RECOVERY.md) — how to rebuild all of this after a loss.

---

## Layer 1 — the domain · hbcoser.com

**Role:** owns the address. The only layer that cannot be re-created — everything else can
be rebuilt from scratch, but a lost domain is gone.

| | |
|---|---|
| Domain | `hbcoser.com` |
| DNS hosting | Cloudflare (nameservers point at Cloudflare, not at the registrar) |
| Renewal | annual; **set auto-renew on and keep the card current** |

Because DNS lives at Cloudflare rather than at the registrar, the registrar can change
without touching a single record — and equally, losing access to the Cloudflare account
loses every record. Keep a second owner on that account.

The domain is the one asset where an expired card costs you the business identity.
Calendar the renewal date.

## Layer 2 — GitHub · the drawings

**Role:** the authoritative copy of the source. As long as the drawings exist, the site can
be restored at any time.

| | |
|---|---|
| Repository | `hbcoser-site` (public, branch `main`) |
| Contents | 9 routes, design system, 28-product catalogue, all product images, fonts, build scripts |

Everything needed to rebuild the site is here. The only things outside it are the Cloudflare,
GitHub and Vercel accounts, the domain, and the FormSubmit activation.

## Layer 3 — Vercel · the shopfront

**Role:** turns the GitHub blueprint into a live, globally distributed site. Free, fast, and
correctly sized for a site like this one.

| | |
|---|---|
| Project | `hbcoser-site` |
| Build | framework `Vite`, `npm run build`, output `dist` |
| Deploy | automatic on every push to `main` |
| Domains | `www.hbcoser.com` primary; apex `hbcoser.com` 308-redirects to www |
| TLS | issued and renewed automatically |
| Config | `vercel.json` — **`cleanUrls: true`, and nothing else** |

**Canonical host is `www`.** The canonical tags, the sitemap and `robots.txt` all point at
`https://www.hbcoser.com` to match the redirect.

`cleanUrls` is load-bearing. Vercel does not map `/custom` to `custom.html` on its own, so
without it every extensionless route falls through to the SPA shell and the prerendered HTML
is unreachable. Do not add a catch-all rewrite either: unmatched paths are answered by the
prerendered `404.html`, which returns a real 404 and deliberately carries no canonical.

## Layer 4 — Cloudflare · DNS in front

**Role:** owns DNS for the domain, and is where the "no character licences, no lookalike
goods" sourcing position gets an extra safety net — bot and abuse filtering before traffic
reaches Vercel.

Two rules when touching it:

- **Start the site records on "DNS only".** Proxying adds a second cache layer, and a
  misconfigured cache rule will happily serve stale HTML for a page that was just rebuilt.
  Turn the orange cloud on one record at a time, after verifying the origin directly.
- **Never edit a mail record while adding a site record.** `stellagaoxin@gmail.com` is the
  inquiry destination and lives on a different provider; a careless zone edit at the apex is
  how an inquiry channel dies quietly.

## Layer 5 — assets · the repository

**Role in the target architecture:** a separate object store (Cloudflare R2) for images and
video, served through a dedicated asset hostname.

**Status: deliberately not adopted.** All 28 product images and the self-hosted fonts are
committed to the repository and served by Vercel.

- **At this scale a separate store would be over-engineering.** The images are a few
  megabytes on Vercel's CDN — free, fast, and one less provider to keep in sync.
- **It becomes worth it when:** the catalogue moves into the hundreds of images, video is
  added, or buyers in slow regions need a dedicated cheaply-cacheable asset origin.
- **If adopted:** keep the source images in the repository regardless. R2 is a delivery
  layer, not a backup. The repository must stay the thing you can rebuild from.

## Deployment record — 2026-09-29

Recorded so a future rebuild starts from facts rather than memory.

| | |
|---|---|
| GitHub repo | `hongboGan/hbcoser-site` — public, default branch `main` |
| First commit | `2874f1ba93657b26d9085c491135b2f5ff11de95` |
| Vercel project | `hbcoser-site` — id `prj_WtjpZieGkRZXQuApHAi6CjEapVO9` |
| Vercel team | `team_v70WLrBY7nB0rAGbsm98rE0Y` (slug `hongbocostumes`) |
| Vercel account | `miazhang031@gmail.com` (`miazhang031-6375`) |
| Production URL | `https://hbcoser-site.vercel.app` |
| Deployment id | `dpl_69u29K8SWnGRSZxhzXnKDM9G6EDD` — state READY |
| Domain config in Vercel | `www.hbcoser.com` primary; apex `hbcoser.com` 308-redirects to www |

DNS records Vercel issued for this project — **these are unique to this project; never copy
another project's CNAME target**:

| Domain | Type | Name | Value |
|---|---|---|---|
| `hbcoser.com` | A | `@` | `216.198.79.1` |
| `www.hbcoser.com` | CNAME | `www` | `5b9dfe9ae74fd237.vercel-dns-017.com.` |

### One environment trap worth writing down

On this machine pushing to GitHub fails with `Recv failure: Connection was reset` and
`Invoke-WebRequest` fails with a `system.net/defaultProxy` error, while plain TCP to
`github.com:443` succeeds. The cause is a **system proxy enabled and pointed at a local
proxy that cannot carry the git smart-HTTP path**. It is not a network outage, and it is not
GitHub.

Do not clear the registry proxy setting and do not touch the global git config. Bypass it per
command instead:

```bash
git -c safe.directory='*' -c http.proxy= -c https.proxy= push -u origin main
```

`safe.directory` is needed as well because the project directory is owned by
`BUILTIN\Administrators`, which git treats as a dubious-ownership case. Both overrides are
per-invocation; nothing is written to any config file.

## Layer the list misses — the inquiry channel

The layers above carry the site. They do **not** carry the thing the site exists for:
getting a buyer's message into a human's inbox.

That is a separate dependency — **FormSubmit** delivering to `stellagaoxin@gmail.com` — and
it is the single most fragile part of the stack. On the previous site it proved that: the
form looked fine, the page said "thank you", and every inquiry was being silently dropped.

Three rules follow, and they belong in the architecture:

1. **Never trust HTTP 200 from the form endpoint.** The response body's `success` field is
   the truth. The code already checks it and shows a real failure state with clickable email
   and WhatsApp fallbacks.
2. **Activation is per form page, and a new domain is a new form page.** The first submission
   on `hbcoser.com` is dropped until the activation link that arrives by email is clicked.
   Know this before you tell anyone the form works.
3. **Test the channel after any migration** — DNS change, host change, domain change. A
   working website with a broken inquiry path is worth nothing to this business.

## Current state at a glance

| # | Layer | Purpose | State |
|---|---|---|---|
| 1 | Domain | Address `hbcoser.com` | ✅ held |
| 2 | Cloudflare | DNS | ⏳ zone present — the two Vercel records are **not yet added** |
| 3 | GitHub | Source of truth | ✅ `hongboGan/hbcoser-site`, commit `2874f1b` pushed |
| 4 | Vercel | Hosting + CDN + TLS | ✅ project READY at `hbcoser-site.vercel.app`; custom domain attached, awaiting DNS |
| 5 | Repository assets | Product images, fonts | ✅ served from the repository through Vercel |
| + | FormSubmit | Inquiry delivery | ⏳ not activated on this domain |

Update this table when a layer goes live. A status table that drifts is worse than none.

## Recommended order of work

1. **Push to GitHub, import to Vercel, attach the domain in Cloudflare.** Keep the site
   records on "DNS only" until the origin is verified, then proxy.
2. **Activate FormSubmit** by submitting the inquiry form once and clicking the link that
   arrives at `stellagaoxin@gmail.com`.
3. **Submit the sitemap in Google Search Console** for the `www` property, and verify the
   property first with a DNS TXT record rather than an HTML tag — the DNS route cannot be
   broken by a rebuild.
4. **Keep layers 1–4 healthy.** Auto-renew the domain; keep pushes flowing to `main`.
5. **Add a second git remote** (Gitee or GitLab). Two copies of the source is one copy short
   of safe, and GitHub is intermittently unreachable from mainland China.
6. **Test the inquiry channel** with one real submission per month, and always after any
   infrastructure change.
