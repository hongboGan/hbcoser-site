# DESIGN.md — hbcoser.com

Visual and content contract for the third independent site.

## 1. Positioning

**Scene-based cosplay supply, built for programmes that repeat.** Three lines run side by
side and share one commercial story: **kids' cosplay**, **pet cosplay**, and **party &
event supply** — all available as stock wholesale *or* as OEM/ODM production.

The buyer is an organisation, not a fan. A toy and dress-up importer, a pet-products
distributor, a party-goods wholesaler, an event producer, a theme venue, a school or
family-entertainment operator. They order in cartons, they re-order seasonally, and they
care about one thing above all: **can this supplier hold a specification across repeat
orders.** Every page is judged by whether it moves that buyer toward an inquiry.

OEM/ODM is not a footnote here — it is the third pillar and gets its own page, because
"we can make your version" is the reason a programme buyer switches suppliers.

Contact is fixed and appears on every page:

- Email — `stellagaoxin@gmail.com`
- WhatsApp — `wa.me/8615107146833` (country code required in the link)

## 2. Visual direction — "gallery white, poster rhythm"

A supplier's catalogue set as a gallery hang: a white wall, hairline frames, generous air,
and the goods as the only objects with any weight on the page. Black ink does the
structural work. One deep cyan does the pointing.

The palette alone, however, reads as a document rather than a design — a white wall with
nothing on it is a plain room. Impact comes from four devices, and they are as binding as
the colours:

1. **Scale.** Display type is deliberately oversized and tightly tracked
   (`clamp(2.6rem, 6.8vw, 5.35rem)`, `letter-spacing: -0.04em`). On a white page the
   headline has to carry the weight a dark ground would have carried.
2. **Numbered section heads** (`.sec-head`) — a hairline across the top, then a large cyan
   numeral, then the label and title. This is what gives a long page a visible skeleton.
3. **Whole-bleed alternation.** The page rhythm is white → tinted → white → **ink** →
   **cyan**. The reader hits a hard cut three times. On the home page the Custom/OEM section
   is full-bleed near-black, and every page closes on a solid deep-cyan block (`.band`, and
   `.post-cta` on articles — a page that closes on a light panel reads as unfinished).
4. **One graphic element per loud block.** A pale cyan disc behind the hero frames, and an
   outlined circle bleeding off the edge of each dark block. Sized large enough that it
   reads as the arc of a much bigger circle — a small clipped arc looks like a mistake.

A fifth device, cheap and system-wide: a 26px cyan tick before every `.eyebrow`.

### The problem a white ground creates, and the rule that solves it

**Most supplier photographs are shot on white.** A white photograph on a white page has no
edge — the goods float and the grid disappears. Every photograph therefore sits on a faint
mat (`--mat`) inside a 1px frame (`--line`). That frame-and-mat is the house signature, and
it is structural, not decorative: remove it and the catalogue stops reading as a catalogue.

### Deliberate contrast with the other two sites

`hongbocostumes.com` is loud daylight: warm cream ground, several saturated accents, hard
offset shadows, sticker badges, a marquee ticker.

`hongbocosplay.com` is a dark theatre: neutral near-black ground, one warm amber accent,
serif display face, tone-only separation, soft bloom.

Site 3 must be recognisably a third brand at a glance. These rules are binding:

| Dimension | Site 1 | Site 2 | Site 3 (this one) |
|---|---|---|---|
| Ground | warm cream `#FFF6E9` | neutral near-black `#0B0C0E` | **pure white** `#FFFFFF` |
| Accent | many, saturated | exactly one warm amber | **one deep cyan** `#0B6E7F` |
| Primary action | saturated fill | amber fill | **near-black ink fill** |
| Heading face | Archivo Black, caps, ultra-heavy | display serif, sentence case | **geometric grotesk**, sentence case |
| Separation | 2px solid black, hard offset shadow | tone only, soft bloom | **1px hairline frame + faint mat** |
| Density | high, ticker, badges | generous single column | **gallery air, wide gutters** |
| Photography | cropped to fill | cropped to fill, bloomed | **contained on a mat, whole item visible** |
| Structure | ticker + sticker badges | one long column | **numbered section heads + whole-bleed alternation** |
| Rhythm | loud throughout | dark throughout | **white → tinted → white → ink → cyan** |
| Motion | marquee, bounce | slow fade / lift | 2px lift + a cyan rule drawing across |

Do not import site 1's or site 2's tokens, components, fonts or blog voice. Do not reuse
either `styles.css`.

### Palette

```css
:root {
  --paper:         #FFFFFF;  /* the wall */
  --paper-alt:     #F6F7F9;  /* alternating band, footer */
  --mat:           #EDF0F3;  /* the bed every photograph sits on */
  --line:          rgba(12,24,33,0.13);
  --line-soft:     rgba(12,24,33,0.07);

  --ink:           #0C1821;  /* headings, prices, primary button, the ink band */
  --ink-muted:     #55636E;  /* body copy */
  --ink-faint:     #64717B;  /* small meta only, never body copy */

  --cyan:          #0B6E7F;  /* the single interactive accent */
  --cyan-strong:   #095A69;
  --cyan-wash:     rgba(11,110,127,0.08);
  --cyan-tint:     #EAF4F6;
  --cyan-light:    #5BC8D8;  /* dark surfaces only — see the rules below */

  --good:          #1F7A4D;
  --alert:         #B3261E;
}
```

Rules:

- `--ink` carries the primary button and every heading. One decisive black surface per
  viewport is the gallery move.
- `--cyan` is for anything *interactive or labelling*: eyebrows, links, active filter chip,
  hover edges, focus ring, the floating WhatsApp button. It is never body copy.
- `--mat` is mandatory under every product photograph. There are no exceptions.
- `--cyan-light` exists for one purpose: deep cyan on near-black measures about 1.6:1 and is
  unreadable. It is used **only on `--ink` and `--cyan` surfaces** — never on `--paper`.
- Dark and cyan blocks carry white, or `rgba(255,255,255,0.92)` at the very lightest. On the
  cyan block 0.92 composites to 5.26:1; 0.86 measured 4.83:1, which passes but has no headroom.
- No drop shadows except `--lift` / `--lift-lg` on hover, and the sticky header's hairline.
  Nothing else casts.
- No gradients anywhere. A gradient on white reads as decoration, and this system has none.
- Motion is one thing: a 2–3px lift, plus a cyan rule that draws itself across a card's top
  edge. `prefers-reduced-motion` removes every transition and leaves those rules at rest.

Contrast, measured in the browser on the built site (not estimated): `--ink` on white 17.98:1 ·
`--ink-muted` 6.18:1 · `--ink-faint` 5.01:1 · `--cyan` on white 5.91:1 · white on `--cyan`
5.91:1 · white on `--ink` 17.98:1 · `--cyan-light` on `--ink` 9.16:1 · `rgba(255,255,255,0.92)`
on `--cyan` 5.26:1 · `.sec-head__n` and `.footer__label` on `--paper-alt` 5.52:1. **The lowest
ratio on any readable text is 5.26:1**; everything passes AA on `--paper`, `--paper-alt`, `--ink`
and `--cyan` alike. The only sub-4.5 element in the build is `.tile__n`, the decorative tile
numeral at `opacity: 0.42` — it is `aria-hidden`, exempt as decoration, and rises to 0.82 on
hover so it never reads as a printing error.

### Typography

| Role | Face | Weight | Size |
|---|---|---|---|
| Display | Space Grotesk | 600–700 | `clamp(2.6rem, 6.8vw, 5.35rem)`, line-height 0.99, tracking −0.04em |
| Section head | Space Grotesk | 600 | `clamp(1.7rem, 3.6vw, 2.85rem)` |
| Section numeral | Space Grotesk | 700 | `clamp(2rem, 4.4vw, 3.5rem)`, `--cyan`, tracking −0.05em |
| Stat figure | Space Grotesk | 700 | `clamp(2.4rem, 5.4vw, 3.7rem)`, tracking −0.05em |
| Body | IBM Plex Sans | 400 | 16–17px, line-height 1.66 |
| Label / eyebrow / spec | IBM Plex Mono | 500–600 | 12px, letter-spacing 0.17em, uppercase |
| Price / MOQ | IBM Plex Mono | 600 | 15px, `--ink` |

Fonts are self-hosted woff2 in `public/fonts/`. No external font CDN. IBM Plex Mono has no
variable axis on Google Fonts, so it ships as three static weights — deliberate, not an
oversight. The mono for labels is the loudest typographic break from both other sites.

### Spacing and shape

- 8px base scale; section rhythm `clamp(72px, 10vw, 132px)` — looser than site 2, because
  air is the point.
- Corner radius 3px on frames and cards, 2px on chips, 999px on pill buttons only.
- Photographs are **contained, not cropped**, wherever the buyer is judging an item
  (product cards, product detail). They are cropped only where the image is atmosphere
  (hero frames, category tiles, blog covers).
- Card frames sit on `--paper`; the hover state raises the frame, lights its edge in cyan
  and lifts it 2px. No colour change to the image itself.

## 3. Pages

| Route | Purpose |
|---|---|
| `/` | Hero, three-line overview, category tiles, featured products, OEM capability, inquiry CTA |
| `/shop` | Full catalogue with category filter chips |
| `/shop/:category` | Category listing (`kids`, `pets`, `party`) |
| `/product/:id` | Product detail — image, spec table, MOQ, prefilled inquiry CTA |
| `/custom` | OEM/ODM capability: what we change, how sampling works, what we need from you |
| `/about` | What we produce, how we work, sourcing policy |
| `/blog` | Programme and sourcing notes |
| `/blog/:slug` | Article |
| `/inquiry` | Inquiry form (all fields), plus direct email/WhatsApp routes |
| `*` | 404 |

Category slugs are fixed strings, not translated labels, so URLs stay stable if a display
name changes.

### Navigation

Desktop: wordmark left, `Shop ▾` / `Custom / OEM` / `About` / `Notes` / `Inquiry` right,
with a primary `Get a quote` button in ink. `Shop ▾` is a mega panel listing every category
with its product count — all three lines rank equally.

Mobile (<900px): wordmark + a single menu control opening a full-height panel. Every
category reachable in one tap. No hover-only affordances anywhere.

### Product card

Framed mat (4:5, the photograph contained inside it, `loading="lazy"`, explicit
width/height to reserve space), category eyebrow in mono, title, price range in mono, MOQ
line in mono. Hover lights the 1px edge in cyan and lifts 2px.

## 4. Inquiry path

Every page carries a persistent path to contact: header CTA, in-flow CTA after each product
grid, and a floating WhatsApp button — a labelled pill on wide screens, a 50×50 icon-only
circle below 560px, so it grazes less body text on a narrow column.

The form posts via FormSubmit to `stellagaoxin@gmail.com`. Fields: name, company, email,
country, product or category, quantity, target date, message. Client-side validation with
inline errors; a visible success and failure state; the submitting button disables during
flight.

**Two operational facts that must not be forgotten:**

1. FormSubmit requires the recipient to click an activation link on the first submission
   **per form page**. A new domain is a new form page — the first submission on
   `hbcoser.com` is silently dropped until that link is clicked.
2. The endpoint answers HTTP 200 even when it rejects a submission. Never treat the status
   code as success — check the response body's `success` field.

## 5. Non-negotiables

- One `h1` per page; headings descend in order, and the footer's column captions are not
  headings.
- All product images self-hosted under `public/products/`, max 900px on the long edge,
  JPEG q82 progressive, target under 150KB each. No hot-linking to supplier CDNs.
- Product photos must be photographs of the actual goods, and must carry no watermark, no
  supplier logo and no Chinese marketing text. A buyer who receives something different
  from the picture is a lost account.
- No IP: no character names, no studio or franchise names, no trademarked likenesses in
  titles, copy or imagery. Describe the category, not the property.
- Every image has a descriptive `alt`; decorative images use empty `alt`.
- `prefers-reduced-motion` disables every transition and lift.
- Body text ≥ `--ink-muted` on its background; `--ink-faint` only for small meta, never for
  a paragraph.
- No horizontal overflow at any width; verify at 375px, 768px, 1440px.
- Layout uses `min-height: 100dvh` and stays vertically scrollable; nothing may be clipped
  by fixed chrome. The footer carries 76px of bottom padding to clear the floating button.
