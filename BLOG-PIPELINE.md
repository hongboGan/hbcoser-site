# Programme notes: the draft queue

How a new article gets from a community discussion to a live page on hbcoser.com, and where the
human decides.

## The shape of it

A scheduled job runs every morning and produces a **draft**. The draft sits in a queue. Nothing is
visible to a buyer until the draft is explicitly published. Approval is the only gate, and it is
the only step a person has to perform.

```
  community discussion  ->  draft in blog-queue/  ->  [ YOUR APPROVAL ]  ->  blog.js  ->  deploy
        (daily job)            (invisible)                                    (live)
```

## Why published articles and drafts live in different places

`src/content/blog.js` is the only source of published articles. That is not a style choice:
`src/entry-server.jsx` and `scripts/gen-sitemap.mjs` both import `POSTS` from it directly, so
appending one object to that array is the single act that gives a post a route, a prerendered
HTML file, a sitemap entry and a `<head>` block. There is no second place to update.

The consequence is that a draft written into `blog.js` would be published immediately. Drafts
therefore live in `blog-queue/`, outside `src/`, where nothing imports them.

## The daily job

The scheduled task researches recent community and buyer discussion, picks one recurring question
that the existing articles do not already answer, writes the piece in the house format, checks it
against the guardrails, and queues it. It then reports a short summary. It does not publish, and
it does not push.

## Approving a draft

```
node scripts/blog-draft.mjs list                       # see what is waiting
node scripts/blog-draft.mjs check  <file.json>         # run the guardrails, change nothing
node scripts/blog-draft.mjs publish <slug>             # ship it
node scripts/blog-draft.mjs reject  <slug> --reason "…"  # bin it
```

`publish` does the whole local chain in one step and **rolls itself back** if any part fails:

1. validate the draft against every guardrail
2. insert the entry at the top of `POSTS` in `blog.js`
3. regenerate `public/sitemap.xml`
4. run `npm run build` (retried once; this machine occasionally fails a spawn under load)
5. verify the prerendered `dist/blog/<slug>.html` — that it exists, that `#root` carries real
   text, that the title, the opening of the body and a self-referencing canonical are present
6. on success, remove the draft from the queue

Step 5 is the important one. A green build exit code only means the bundler finished; it does not
mean the page a crawler receives has content. `publish --dry-run` runs steps 1 to 5 and then
restores `blog.js` and `sitemap.xml`, so the chain can be proven without shipping anything.

After a successful `publish`, commit and push. Vercel rebuilds and prerenders the new route.

## What the guardrails reject

A draft is refused if it breaks any of these. Every problem is reported in one pass, not one per
round, because a generator that fixes a single error per attempt costs a day each time.

**Shape.** Slug is kebab-case, unique against published and queued drafts. Title is 25-70
characters and does not overlap an existing article by 45% or more of its significant words.
Excerpt is 110-240 characters. Date is a real date and not in the future. Cover points at a file
that actually exists under `public/products/`.

**Format.** 330-680 words, 3-6 `##` sections, `###` only inside a section. No `#` heading, because
the page already renders the title as the `h1`.

**Rendering.** The renderer in `src/lib/markdown.jsx` understands headings, `- ` lists, `> `
quotes, paragraphs, `**bold**`, `*italic*` and `[label](/path)`. Tables, fenced code, numbered
lists, inline images, raw HTML, backticks and horizontal rules all render as literal punctuation,
so they are refused rather than shipped as noise.

**Legal and commercial.** No protected brand, franchise or character name, in any field, including
inside a source cue. No certification or audit scheme named as held. No claim about our own plant,
headcount or client list. No guarantee, no percentage promise, no unit price, and no stated MOQ -
price and terms belong in a quote. No supplier platform named. No Chinese characters or other
non-ASCII text, which is the signature of pasted supplier copy.

**Links.** Internal only, and every one must resolve to a real route. An outbound link would leak
where the topic came from and cannot be vouched for later.

Sources are recorded as topic cues and must be phrased as such, ending in `(topic cue only)`.
Every word of every article is original.

## The house format, measured

The thresholds above are taken from the four articles already live, not from a generic style guide:

| Property | Existing range | Enforced |
| --- | --- | --- |
| Words | 384-449 | 330-680 |
| Excerpt | 137-165 chars | 110-240 |
| `##` sections | 4 | 3-6 |
| Tags | 3 | 2-3 from a closed list |
| Sources | 3 | 2-4 |
| Cover | a real product image | must exist on disk |

Keeping the ceilings near the existing range is deliberate: these are short, dense buying notes,
and a 1,500-word essay would break the page rhythm every other article is built on.

## Adding a topic by hand

Write a file in the draft shape and run `check` on it:

```json
{
  "sourceCues": ["where the topic came from"],
  "post": {
    "slug": "kebab-case-slug",
    "title": "Between 25 and 70 characters",
    "excerpt": "110-240 characters, becomes the meta description",
    "date": "YYYY-MM-DD",
    "tags": ["Kids", "Compliance"],
    "cover": "/products/kids-officer-uniform.jpg",
    "sources": ["... (topic cue only)"],
    "body": "Markdown, hard-wrapped at about 100 columns."
  }
}
```

Allowed tags: Kids, Pets, Party, Events, Sizing, Retail, Sourcing, Quality, Specification,
Planning, Seasonality, Compliance, Logistics, Sampling, Costing, OEM, Packaging, Trade.

Bodies may be hard-wrapped. The renderer joins consecutive lines inside a paragraph, a list item
and a quote, so wrapping is purely for reading the source file.

## Guarding the guardrails

`scripts/__fixtures__/invalid-draft.json` is a deliberately broken draft. If it ever passes
`check`, the guardrails have regressed and the daily job must not be trusted until they are
repaired:

```
node scripts/blog-draft.mjs check scripts/__fixtures__/invalid-draft.json
```

It currently reports 26 problems across every category.

## Recovery

If a publish half-fails, `blog.js` and `sitemap.xml` are restored automatically and the draft stays
in the queue - the usual cause is a transient spawn failure, so re-running is safe. If a bad
article does reach production, `git revert` the publish commit; the queue file is already gone at
that point, so recover the draft from the commit that removed it.
