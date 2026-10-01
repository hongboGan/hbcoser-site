#!/usr/bin/env node
// Draft queue and pre-publish guardrails for the daily programme-notes pipeline.
//
// Published articles live in src/content/blog.js and nowhere else. entry-server.jsx and
// gen-sitemap.mjs both import POSTS directly, so appending to that array is the single act
// that makes a post routable, prerendered, sitemapped and head-tagged. Drafts therefore
// have to live outside src/, which is what blog-queue/ is for.
//
// The queue holds one JSON file per draft, so a bad draft can be rejected on its own and a
// half-written file cannot corrupt the whole queue.
//
// Usage:
//   node scripts/blog-draft.mjs list
//   node scripts/blog-draft.mjs check   <file.json>
//   node scripts/blog-draft.mjs add     <file.json>
//   node scripts/blog-draft.mjs reject  <slug> --reason "..."
//   node scripts/blog-draft.mjs publish <slug> [--dry-run]
//
// Exit code 0 means the draft is publishable. Any failure prints every reason found, not
// just the first, because a generator that fixes one error per round wastes a day.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BLOG_JS = path.join(ROOT, 'src/content/blog.js');
const QUEUE = path.join(ROOT, 'blog-queue');
const PRODUCT_DIR = path.join(ROOT, 'public/products');

const { POSTS } = await import(new URL('../src/content/blog.js', import.meta.url).href);

// ---------------------------------------------------------------- vocabulary

// Tags are rendered as visible chips on /blog. Keep the set closed so the vocabulary does
// not drift into a hundred one-off labels a reader cannot filter by.
const ALLOWED_TAGS = [
  'Kids', 'Pets', 'Party', 'Events',
  'Sizing', 'Retail', 'Sourcing', 'Quality',
  'Specification', 'Planning', 'Seasonality',
  'Compliance', 'Logistics', 'Sampling', 'Costing', 'OEM', 'Packaging', 'Trade',
];

// Trademarks, franchises and character names. This site sells unbranded and original
// designs only; naming a franchise in an article is both an IP risk and a misrepresentation
// of what we supply. Matched case-insensitively against the whole draft.
const BANNED_IP = [
  'disney', 'disneyland', 'pixar', 'marvel', 'dc comics', 'warner', 'universal studios',
  'nickelodeon', 'cartoon network', 'hasbro', 'mattel', 'sanrio', 'funko',
  'hello kitty', 'snoopy', 'garfield', 'tom and jerry', 'tom & jerry', 'looney tunes',
  'popeye', 'betty boop', 'smurfs', 'care bears', 'rainbow brite', 'strawberry shortcake',
  'pusheen', 'squishmallow', 'my little pony', 'lol surprise', 'barbie', 'lego',
  'play-doh', 'playdoh', 'crayola', 'nerf', 'hot wheels', 'transformers', 'power rangers',
  'teenage mutant', 'gi joe', 'he-man', 'thundercats',
  'star wars', 'harry potter', 'hogwarts', 'lord of the rings', 'game of thrones',
  'the witcher', 'stranger things', 'wednesday addams', 'squid game', 'jurassic',
  'frozen', 'elsa', 'encanto', 'moana', 'cinderella', 'snow white', 'rapunzel', 'ariel',
  'tinker bell', 'peter pan', 'aladdin', 'lion king', 'simba', 'stitch', 'lilo',
  'mickey mouse', 'minnie', 'winnie the pooh', 'toy story', 'minions', 'despicable me',
  'spider-man', 'spiderman', 'batman', 'superman', 'wonder woman', 'iron man',
  'captain america', 'avengers', 'hulk',
  'pokemon', 'pokémon', 'nintendo', 'mario', 'sonic', 'kirby', 'zelda', 'minecraft',
  'roblox', 'fortnite', 'among us', 'five nights at freddy', 'angry birds', 'plants vs zombies',
  'bluey', 'paw patrol', 'peppa pig', 'dora', 'spongebob', 'shrek', 'ben 10', 'inspector gadget',
  'sailor moon', 'naruto', 'one piece', 'dragon ball', 'dragon quest', 'studio ghibli',
  'totoro', 'gundam', 'ultraman', 'kamen rider', 'precure', 'anpanman', 'shinchan',
  'doraemon', 'crayon shin', 'demon slayer', 'jujutsu kaisen', 'attack on titan',
  'my hero academia', 'tokyo revengers', 'chainsaw man', 'spy x family', 'final fantasy',
  'resident evil', 'street fighter', 'tekken', 'mortal kombat', 'the simpsons', 'family guy',
  'rick and morty', 'south park', 'scooby', 'adventure time', 'powerpuff',
  'tm', 'officially licensed', 'licensed merchandise',
];

// Claims about our own operation that we cannot substantiate. Certification schemes are
// banned outright rather than pattern-matched: a reader cannot tell "we hold BSCI" from a
// legitimate "buyers often ask about BSCI", and a misread claim is the expensive direction.
// Regulations (CPSIA, EN 71, REACH, CE) stay allowed as general subject matter.
const BANNED_TERMS = [
  'bsci', 'sedex', 'smeta', 'wrap certified', 'oeko-tex', 'oekotex', 'iso 9001',
  'iso9001', 'iso 14001', 'iso14001', 'fama', 'gots', 'global recycled standard',
  'alibaba', '1688', 'made-in-china', 'made in china', 'dhgate', 'taobao', 'global sources',
];

// Sentences that promise something no supplier can promise, or that invent scale.
const BANNED_PATTERNS = [
  [/\bwe (are|have been) (an? )?(audited|certified|approved)\b/i, 'concrete audit/certification claim'],
  [/\bour (factory|company|workshop|plant) (is|has been|holds?)\b/i, 'claim about our own facility'],
  [/\bour (clients|customers|buyers) include\b/i, 'names customers we may not have'],
  [/\bwe (guarantee|warrant)\b/i, 'guarantee we cannot back'],
  [/\b100\s?%/i, 'absolute guarantee'],
  [/\bour moq (is|starts|begins)\b/i, 'states commercial terms that belong in a quote'],
  [/\b\d{2,},?\d* (workers|employees|staff|machines|sewing lines)\b/i, 'invents factory scale'],
  [/\b\d[\d,]* (square met|sqm|sq\.? ?m)/i, 'invents factory scale'],
  [/\$\s?\d/, 'quotes a price; this site routes price to a quote'],
  [/\b\d+(\.\d+)?\s?(usd|dollars)\b/i, 'quotes a price; this site routes price to a quote'],
];

// Typographic punctuation is wanted; anything else non-ASCII is a leak of source text
// (typically Chinese scraped from a supplier page) or an emoji, and both must not ship.
const ALLOWED_NON_ASCII = new Set([
  '\u2018', '\u2019', '\u201C', '\u201D', '\u2013', '\u2014', '\u2026', '\u00B7', '\u2192',
]);

// The renderer in src/lib/markdown.jsx understands headings, "- " lists, "> " quotes,
// paragraphs, **bold**, *italic* and [label](/path) links. Everything below renders as
// literal punctuation, so it is rejected rather than shipped as visible noise.
const UNSUPPORTED_MARKDOWN = [
  [/^```/m, 'fenced code block'],
  [/^\s*\d+\.\s/m, 'numbered list; use an "## N." heading or a "- " list'],
  [/^\s*\|/m, 'table'],
  [/!\[/, 'inline image'],
  [/^\s*---+\s*$/m, 'horizontal rule'],
  [/<[a-zA-Z\/]/, 'raw HTML'],
  [/`/, 'backtick; code spans are not rendered'],
  [/\\/, 'backslash'],
  [/\$\{/, 'template literal interpolation'],
];

const MIN_WORDS = 330;
const MAX_WORDS = 680;
const TITLE_RANGE = [25, 70];
const EXCERPT_RANGE = [110, 240];

// ---------------------------------------------------------------- helpers

const fail = (errors, message) => errors.push(message);

function wordCount(body) {
  return String(body).trim().split(/\s+/).filter(Boolean).length;
}

// Every route a [label](/path) link in an article body is allowed to point at.
function knownRoutes() {
  const { products } = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/products.json'), 'utf8'));
  const slugs = new Set(POSTS.map((p) => p.slug));
  const routes = new Set([
    '/', '/shop', '/custom', '/about', '/inquiry', '/blog',
    '/shop/kids', '/shop/pets', '/shop/party',
  ]);
  products.forEach((p) => routes.add(`/product/${p.id}`));
  slugs.forEach((s) => routes.add(`/blog/${s}`));
  return routes;
}

function coverExists(cover) {
  if (typeof cover !== 'string' || !cover.startsWith('/products/')) return false;
  return fs.existsSync(path.join(ROOT, 'public', cover.replace(/^\//, '')));
}

function titleSignificantWords(title) {
  const stop = new Set(['the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'for', 'on', 'your', 'you',
    'is', 'are', 'it', 'that', 'this', 'with', 'when', 'what', 'how', 'why', 'not', 'be', 'as', 'at']);
  return new Set(String(title).toLowerCase().match(/[a-z]{3,}/g)?.filter((w) => !stop.has(w)) ?? []);
}

function overlapRatio(a, b) {
  const inter = [...a].filter((w) => b.has(w)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}

// ---------------------------------------------------------------- validation

// Returns every problem found, so one review round can fix them all.
function validate(post, { queuedSlugs = new Set() } = {}) {
  const errors = [];
  const warnings = [];

  if (!post || typeof post !== 'object' || Array.isArray(post)) {
    return { errors: ['draft has no `post` object'], warnings };
  }

  const { slug, title, excerpt, date, tags, cover, sources, body } = post;

  // slug
  if (typeof slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    fail(errors, 'slug must be kebab-case: lowercase letters, digits and single hyphens');
  } else if (slug.length < 8 || slug.length > 72) {
    fail(errors, `slug length ${slug.length} is outside 8-72`);
  } else if (POSTS.some((p) => p.slug === slug)) {
    fail(errors, `slug "${slug}" already exists in blog.js`);
  } else if (queuedSlugs.has(slug)) {
    fail(errors, `slug "${slug}" is already queued`);
  }

  // title
  if (typeof title !== 'string' || !title.trim()) {
    fail(errors, 'title is required');
  } else {
    const len = title.length;
    if (len < TITLE_RANGE[0] || len > TITLE_RANGE[1]) {
      fail(errors, `title length ${len} is outside ${TITLE_RANGE[0]}-${TITLE_RANGE[1]} (it shares <title> with the site name)`);
    }
    if (/[.]$/.test(title.trim())) fail(errors, 'title must not end with a period');
    if (/[|]/.test(title)) fail(errors, 'title must not contain "|"');
    if (/\s{2,}/.test(title)) fail(errors, 'title contains a double space');

    for (const existing of POSTS) {
      const ratio = overlapRatio(titleSignificantWords(title), titleSignificantWords(existing.title));
      if (ratio >= 0.45) {
        fail(errors, `title overlaps ${Math.round(ratio * 100)}% with the existing post "${existing.slug}" - pick a genuinely different subject`);
      }
    }
  }

  // excerpt
  if (typeof excerpt !== 'string' || !excerpt.trim()) {
    fail(errors, 'excerpt is required; it becomes the meta description');
  } else if (excerpt.length < EXCERPT_RANGE[0] || excerpt.length > EXCERPT_RANGE[1]) {
    fail(errors, `excerpt length ${excerpt.length} is outside ${EXCERPT_RANGE[0]}-${EXCERPT_RANGE[1]}`);
  } else if (/^["']|["']$/.test(excerpt)) {
    fail(errors, 'excerpt must not be wrapped in quotes');
  }

  // date
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    fail(errors, 'date must be YYYY-MM-DD');
  } else {
    const parsed = new Date(`${date}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) fail(errors, `date "${date}" is not a real calendar date`);
    else {
      // Compared against the local calendar date, not UTC: this machine runs at UTC+8, so a
      // draft written in the local morning would look like tomorrow to a UTC clock and be
      // rejected as a future date.
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const todayLocal = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      if (date > todayLocal) fail(errors, `date "${date}" is in the future (today is ${todayLocal})`);
    }
  }

  // tags
  if (!Array.isArray(tags) || tags.length < 2 || tags.length > 3) {
    fail(errors, `tags must be an array of 2-3 entries (got ${Array.isArray(tags) ? tags.length : typeof tags})`);
  } else {
    tags.forEach((t) => {
      if (!ALLOWED_TAGS.includes(t)) fail(errors, `tag "${t}" is not in the allowed set: ${ALLOWED_TAGS.join(', ')}`);
    });
    if (new Set(tags).size !== tags.length) fail(errors, 'tags contain a duplicate');
  }

  // cover
  if (!coverExists(cover)) {
    fail(errors, `cover "${cover}" is not an existing file under public/products/ - reuse a real product image`);
  }

  // sources
  if (!Array.isArray(sources) || sources.length < 2 || sources.length > 4) {
    fail(errors, `sources must be an array of 2-4 entries (got ${Array.isArray(sources) ? sources.length : typeof sources})`);
  } else {
    sources.forEach((s, i) => {
      if (typeof s !== 'string' || !s.trim()) fail(errors, `sources[${i}] is empty`);
      else if (!/\(topic cue only\)/i.test(s)) {
        fail(errors, `sources[${i}] must end with "(topic cue only)" - we record the cue, never copy the text`);
      }
    });
  }

  // body
  if (typeof body !== 'string' || !body.trim()) {
    fail(errors, 'body is required');
  } else {
    const words = wordCount(body);
    if (words < MIN_WORDS || words > MAX_WORDS) {
      fail(errors, `body is ${words} words; the house format is ${MIN_WORDS}-${MAX_WORDS}`);
    }
    if (/^#\s/m.test(body)) {
      fail(errors, 'body must not contain an "# " h1 - the page renders the title as the h1');
    }

    // Heading structure: h2 first, h3 only inside a section, no level jumps.
    const headings = [...body.matchAll(/^(#{1,6})\s+(.*)$/gm)].map((m) => ({ level: m[1].length, text: m[2] }));
    const h2 = headings.filter((h) => h.level === 2);
    const h3 = headings.filter((h) => h.level === 3);
    if (h2.length < 3 || h2.length > 6) {
      fail(errors, `body has ${h2.length} "## " sections; the house format uses 3-6`);
    }
    if (h3.length > 4) fail(errors, `body has ${h3.length} "### " subsections; keep it to 4 or fewer`);
    if (h3.length) {
      const firstH2 = body.search(/^##\s/m);
      const firstH3 = body.search(/^###\s/m);
      if (firstH3 < firstH2) fail(errors, 'an "### " subsection appears before the first "## " section');
    }
    headings.forEach((h) => {
      if (h.level > 3) fail(errors, `heading "${h.text.slice(0, 40)}" is h${h.level}; only "## " and "### " are supported`);
    });

    // Non-ASCII sweep.
    const bad = new Set();
    for (const ch of body) {
      const code = ch.codePointAt(0);
      if (code === 10 || code === 13 || code === 9) continue;
      if (code >= 32 && code <= 126) continue;
      if (ALLOWED_NON_ASCII.has(ch)) continue;
      bad.add(ch);
    }
    if (bad.size) {
      fail(errors, `body contains non-ASCII characters that look like leaked source text: ${[...bad].slice(0, 12).map((c) => `U+${c.codePointAt(0).toString(16).toUpperCase()}`).join(' ')}`);
    }

    // Unsupported markdown, blocklists.
    UNSUPPORTED_MARKDOWN.forEach(([re, why]) => {
      if (re.test(body)) fail(errors, `body contains unsupported markdown (${why})`);
    });

    const haystack = `${title}\n${excerpt}\n${body}\n${(sources || []).join('\n')}`.toLowerCase();
    BANNED_IP.forEach((term) => {
      const re = new RegExp(`(^|[^a-z0-9])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`, 'i');
      if (re.test(haystack)) fail(errors, `draft names a protected brand or character: "${term}" (this site sells unbranded designs only)`);
    });
    BANNED_TERMS.forEach((term) => {
      if (haystack.includes(term)) fail(errors, `draft contains "${term}", which cannot be claimed or disclosed`);
    });
    BANNED_PATTERNS.forEach(([re, why]) => {
      const m = haystack.match(re);
      if (m) fail(errors, `draft makes a claim that must not ship (${why}): "${m[0].trim()}"`);
    });

    // Links. Outbound links would leak a source and cannot be vouched for later.
    const links = [...body.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)];
    links.forEach(([, label, href]) => {
      if (/^https?:|^\/\//i.test(href)) {
        fail(errors, `body links out to ${href}; only internal links are allowed`);
      } else if (!href.startsWith('/')) {
        fail(errors, `link "${label}" uses a relative href "${href}"; use a site-absolute path such as /shop`);
      } else if (!knownRoutes().has(href)) {
        fail(errors, `link "${label}" points at ${href}, which is not a route on this site`);
      }
    });
    const bareUrl = body.match(/(?<![("])\bhttps?:\/\/\S+/i);
    if (bareUrl) fail(errors, `body contains a bare URL: ${bareUrl[0]}`);

    if (!links.length) {
      warnings.push('body has no internal link; one link to /shop, /custom or a relevant product page usually earns its place');
    }
    if (!/\b(quote|enquir|inquir|sample|specification|order)\b/i.test(body)) {
      warnings.push('body never mentions quotes, sampling or ordering; consider a buying angle');
    }
  }

  return { errors, warnings };
}

// ---------------------------------------------------------------- serialisation

// Mirrors the quoting style already in blog.js: double quotes when the string contains an
// apostrophe, single quotes otherwise.
function quote(value) {
  const s = String(value);
  return s.includes("'") ? `"${s.replace(/"/g, '\\"')}"` : `'${s}'`;
}

function serializePost(post) {
  const lines = [];
  lines.push('  {');
  lines.push(`    slug: ${quote(post.slug)},`);
  lines.push(`    title: ${quote(post.title)},`);
  lines.push(`    excerpt: ${quote(post.excerpt)},`);
  lines.push(`    date: ${quote(post.date)},`);
  lines.push(`    tags: [${post.tags.map(quote).join(', ')}],`);
  lines.push(`    cover: ${quote(post.cover)},`);
  lines.push('    sources: [');
  post.sources.forEach((s) => lines.push(`      ${quote(s)},`));
  lines.push('    ],');
  // Backticks and "$" are refused upstream, so only the "${" sequence needs escaping here.
  lines.push(`    body: \`${post.body.replace(/\$\{/g, '\\${')}\`,`);
  lines.push('  },');
  return lines.join('\n');
}

// Insert at the top of the array so a freshly written article is the first thing a human
// sees when they open the file. Display order is decided by sortedPosts(), not by position.
function insertIntoBlogJs(source, post) {
  const anchor = 'export const POSTS = [\n';
  const at = source.indexOf(anchor);
  if (at === -1) throw new Error('could not find "export const POSTS = [" in blog.js');
  const cut = at + anchor.length;
  return `${source.slice(0, cut)}${serializePost(post)}\n\n${source.slice(cut)}`.replace(
    /\n{3,}/g,
    '\n\n',
  );
}

// ---------------------------------------------------------------- queue io

function readQueue() {
  if (!fs.existsSync(QUEUE)) return [];
  return fs
    .readdirSync(QUEUE)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const full = path.join(QUEUE, f);
      try {
        return { file: full, name: f, ...JSON.parse(fs.readFileSync(full, 'utf8')) };
      } catch (err) {
        return { file: full, name: f, parseError: err.message };
      }
    });
}

function loadDraftFile(file) {
  const full = path.resolve(file);
  if (!fs.existsSync(full)) throw new Error(`no such file: ${full}`);
  return JSON.parse(fs.readFileSync(full, 'utf8'));
}

function draftFileName(post) {
  return path.join(QUEUE, `${post.date}-${post.slug}.json`);
}

// ---------------------------------------------------------------- commands

// This machine intermittently refuses a spawn with EPERM under load, which has nothing to do
// with the content being published, so every child process gets a retry rather than only the
// build. A real compile or script error is not transient and is not retried, so a genuine
// failure still surfaces immediately and is not buried under repeats.
function run(cmd, args, { attempts = 3 } = {}) {
  let lastError;
  let tries = 0;
  while (tries < attempts) {
    tries += 1;
    try {
      return execFileSync(cmd, args, {
        cwd: ROOT,
        stdio: 'pipe',
        shell: process.platform === 'win32',
        encoding: 'utf8',
      });
    } catch (err) {
      lastError = err;
      const detail = `${err.stdout || ''}\n${err.stderr || ''}`;
      const transient = /EPERM|spawnSync|EBUSY|EAGAIN/.test(`${err.message}\n${detail}`);
      if (!transient || tries === attempts) break;
      console.log(`  ${cmd} was refused on attempt ${tries} (transient spawn refusal), retrying`);
    }
  }
  const detail = `${lastError?.stdout || ''}${lastError?.stderr || ''}`.trim().split('\n').slice(-6).join('\n');
  throw new Error(`${cmd} ${args.join(' ')} failed after ${tries} attempt(s)\n${detail}`);
}

function cmdList() {
  const rows = readQueue().sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  if (!rows.length) {
    console.log('blog-queue: empty');
    return;
  }
  console.log(`blog-queue: ${rows.length} pending\n`);
  rows.forEach((d, i) => {
    if (d.parseError) {
      console.log(`${i + 1}. ${d.name}  [UNREADABLE: ${d.parseError}]`);
      return;
    }
    const p = d.post || {};
    console.log(`${i + 1}. ${p.slug}`);
    console.log(`   ${p.title}`);
    console.log(`   ${p.date} | ${wordCount(p.body || '')} words | cover ${p.cover} | queued ${d.createdAt}`);
    if (d.sourceCues?.length) console.log(`   cues: ${d.sourceCues.length}`);
  });
  console.log('\nPublish one with: node scripts/blog-draft.mjs publish <slug>');
}

function cmdCheck(file, { quiet = false } = {}) {
  const draft = loadDraftFile(file);
  const queued = new Set(readQueue().map((d) => d.post?.slug).filter(Boolean));
  const { errors, warnings } = validate(draft.post, { queuedSlugs: queued });

  if (!quiet) {
    const p = draft.post || {};
    console.log(`check: ${p.slug || '(no slug)'}`);
    console.log(`  ${wordCount(p.body || '')} words, ${[...(p.body || '').matchAll(/^## /gm)].length} sections, cover ${p.cover}`);
    warnings.forEach((w) => console.log(`  warn  ${w}`));
    errors.forEach((e) => console.log(`  FAIL  ${e}`));
    console.log(errors.length ? `\n${errors.length} problem(s) - not publishable` : '\nAll guardrails passed.');
  }
  return errors;
}

function cmdAdd(file) {
  const draft = loadDraftFile(file);
  const queued = new Set(readQueue().map((d) => d.post?.slug).filter(Boolean));
  const { errors, warnings } = validate(draft.post, { queuedSlugs: queued });
  warnings.forEach((w) => console.log(`  warn  ${w}`));
  if (errors.length) {
    errors.forEach((e) => console.error(`  FAIL  ${e}`));
    console.error(`\nadd: refused, ${errors.length} problem(s)`);
    process.exitCode = 1;
    return;
  }
  fs.mkdirSync(QUEUE, { recursive: true });
  const out = draftFileName(draft.post);
  if (fs.existsSync(out)) {
    console.error(`add: ${path.relative(ROOT, out)} already exists`);
    process.exitCode = 1;
    return;
  }
  const record = {
    status: 'pending',
    createdAt: new Date().toISOString(),
    sourceCues: draft.sourceCues || [],
    post: draft.post,
  };
  fs.writeFileSync(out, `${JSON.stringify(record, null, 2)}\n`);
  console.log(JSON.stringify({
    queued: path.relative(ROOT, out).replace(/\\/g, '/'),
    slug: record.post.slug,
    title: record.post.title,
    words: wordCount(record.post.body),
    warnings,
  }, null, 2));
}

function cmdReject(slug, reason) {
  const hit = readQueue().find((d) => d.post?.slug === slug);
  if (!hit) {
    console.error(`reject: no queued draft with slug "${slug}"`);
    process.exitCode = 1;
    return;
  }
  const rejected = path.join(QUEUE, 'rejected');
  fs.mkdirSync(rejected, { recursive: true });
  const target = path.join(rejected, hit.name);
  fs.renameSync(hit.file, target);
  fs.writeFileSync(`${target}.reason.txt`, `${new Date().toISOString()}\n${reason || '(no reason given)'}\n`);
  console.log(`reject: moved ${hit.name} to blog-queue/rejected/`);
}

// Verifies the built HTML rather than trusting a build exit code. Deliberately free of child
// processes: this machine refuses a spawn from inside node, so the build is run by the caller
// and only the result is checked here.
function verifyPrerendered(post) {
  const page = path.join(ROOT, 'dist', 'blog', `${post.slug}.html`);
  if (!fs.existsSync(page)) throw new Error(`no prerendered page at ${path.relative(ROOT, page)}`);
  const html = fs.readFileSync(page, 'utf8');

  // Bounded by the document's last </div>, not by the next <script>: the module script and the
  // JSON-LD block both sit in <head>, ahead of the root div, so there is no <script after the
  // app markup to anchor on.
  const rootStart = html.indexOf('<div id="root">');
  const rootEnd = html.lastIndexOf('</div>');
  // React escapes apostrophes and quotes on the way out, so entities have to come back before
  // any comparison against the source text.
  const decodeEntities = (s) =>
    s
      .replace(/&#x27;|&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
  const rootText =
    rootStart >= 0 && rootEnd > rootStart
      ? decodeEntities(html.slice(rootStart + '<div id="root">'.length, rootEnd).replace(/<[^>]+>/g, ' '))
          .replace(/\s+/g, ' ')
          .trim()
      : '';
  const rootChars = rootText.length;
  if (rootChars < 1500) throw new Error(`prerendered #root holds only ${rootChars} characters of text`);

  if (!rootText.includes(post.title.replace(/\s+/g, ' '))) {
    throw new Error('prerendered page does not carry the article title');
  }

  // Fingerprint the body by its longest words rather than by a byte-exact substring: the
  // renderer collapses soft wraps and splits inline markup into separate elements, so an exact
  // match would fail for reasons unrelated to the article being present.
  const tokens = [...new Set((post.body.match(/[A-Za-z]{8,}/g) || []).map((w) => w.toLowerCase()))];
  const sample = tokens.slice(0, 14);
  const haystack = rootText.toLowerCase();
  const found = sample.filter((w) => haystack.includes(w));
  if (sample.length < 5 || found.length < sample.length - 1) {
    throw new Error(`prerendered page does not carry the article body (${found.length}/${sample.length} distinctive words present)`);
  }

  if (!html.includes(`https://www.hbcoser.com/blog/${post.slug}`)) {
    throw new Error('prerendered page has no self-referencing canonical');
  }
  return rootChars;
}

async function cmdPublish(slug, { dryRun = false, build = true } = {}) {
  const hit = readQueue().find((d) => d.post?.slug === slug);
  if (!hit) {
    console.error(`publish: no queued draft with slug "${slug}"`);
    process.exitCode = 1;
    return;
  }
  const { errors, warnings } = validate(hit.post, { queuedSlugs: new Set() });
  warnings.forEach((w) => console.log(`  warn  ${w}`));
  if (errors.length) {
    errors.forEach((e) => console.error(`  FAIL  ${e}`));
    console.error('\npublish: refused, the draft fails guardrails');
    process.exitCode = 1;
    return;
  }

  const originalBlog = fs.readFileSync(BLOG_JS, 'utf8');
  const originalSitemap = fs.existsSync(path.join(ROOT, 'public/sitemap.xml'))
    ? fs.readFileSync(path.join(ROOT, 'public/sitemap.xml'), 'utf8')
    : null;
  const restore = () => {
    fs.writeFileSync(BLOG_JS, originalBlog);
    if (originalSitemap !== null) fs.writeFileSync(path.join(ROOT, 'public/sitemap.xml'), originalSitemap);
  };

  try {
    fs.writeFileSync(BLOG_JS, insertIntoBlogJs(originalBlog, hit.post));
    console.log(`  wrote ${hit.post.slug} into blog.js`);

    // Structural self-check before the expensive build. Serialising a Markdown body into a
    // template literal is the one step that can silently truncate an article, so catching it
    // here names the real cause instead of surfacing later as a puzzling prerender failure.
    // The cache-busting query is required: Node caches by specifier, so a plain re-import of the
    // same path would hand back the pre-insert module.
    const fresh = await import(`${pathToFileURL(BLOG_JS).href}?t=${Date.now()}`);
    const written = fresh.POSTS.find((p) => p.slug === hit.post.slug);
    if (!written) throw new Error('blog.js does not expose the new post after insertion');
    if (fresh.POSTS.length !== POSTS.length + 1) {
      throw new Error(`blog.js exposes ${fresh.POSTS.length} posts, expected ${POSTS.length + 1}`);
    }
    if (written.body.trim() !== hit.post.body.trim()) {
      throw new Error(
        `body changed during serialisation (${hit.post.body.length} chars in, ${written.body.length} out)`,
      );
    }
    if (fresh.POSTS.filter((p) => p.slug === hit.post.slug).length !== 1) {
      throw new Error('the new slug appears more than once in blog.js');
    }
    console.log(`  verified blog.js: ${fresh.POSTS.length} posts, body intact at ${written.body.length} chars`);

    if (!build) {
      // Insertion is the only step that changes the site, and it needs no child process. The
      // build does, and this machine refuses a spawn from inside node, so the build and the
      // prerender check are left to the caller. The draft stays queued until `verify` passes,
      // which means an abandoned staged publish loses nothing.
      console.log('\nstaged: blog.js updated, draft kept in the queue, nothing verified yet.');
      console.log('Run these from the shell, in order:');
      console.log('  node scripts/gen-sitemap.mjs');
      console.log('  npm run build');
      console.log(`  node scripts/blog-draft.mjs verify ${hit.post.slug}`);
      return;
    }

    run('node', ['scripts/gen-sitemap.mjs']);
    console.log('  regenerated public/sitemap.xml');

    run('npm', ['run', 'build']);

    const rootChars = verifyPrerendered(hit.post);
    console.log(`  verified dist/blog/${hit.post.slug}.html (${rootChars} chars in #root, canonical present)`);

    if (dryRun) {
      restore();
      console.log('\ndry-run: blog.js and sitemap.xml restored, nothing published');
      return;
    }

    fs.rmSync(hit.file);
    console.log(JSON.stringify({
      published: hit.post.slug,
      title: hit.post.title,
      words: wordCount(hit.post.body),
      route: `/blog/${hit.post.slug}`,
      sitemap: 'public/sitemap.xml regenerated',
      prerendered: `dist/blog/${hit.post.slug}.html`,
      queueRemaining: readQueue().length,
      next: 'git diff, then commit and push - Vercel will rebuild',
    }, null, 2));
  } catch (err) {
    restore();
    console.error(`\npublish: rolled back blog.js and sitemap.xml\n  ${err.message}`);
    process.exitCode = 1;
  }
}

// Confirms a staged publish reached the prerendered output and the sitemap, then finalises it by
// clearing the draft from the queue. Only meaningful after the caller has run the build.
function cmdVerify(slug) {
  const hit = readQueue().find((d) => d.post?.slug === slug);
  const inBlog = POSTS.find((p) => p.slug === slug);
  if (!inBlog) {
    console.error(`verify: "${slug}" is not in blog.js, so it was never staged`);
    process.exitCode = 1;
    return;
  }
  const post = inBlog;
  try {
    const rootChars = verifyPrerendered(post);
    const sitemap = fs.readFileSync(path.join(ROOT, 'public/sitemap.xml'), 'utf8');
    const route = new RegExp(`/blog/${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>`);
    if (!route.test(sitemap)) throw new Error('public/sitemap.xml does not list the new route');

    console.log(`  verified dist/blog/${slug}.html (${rootChars} chars in #root, canonical present)`);
    console.log('  verified public/sitemap.xml lists the route');
    if (hit) {
      fs.rmSync(hit.file);
      console.log(`  cleared ${hit.name} from the queue`);
    }
    console.log(JSON.stringify({
      published: slug,
      title: post.title,
      words: wordCount(post.body),
      route: `/blog/${slug}`,
      posts: POSTS.length,
      queueRemaining: readQueue().length,
      next: 'git diff, then commit and push - Vercel will rebuild',
    }, null, 2));
  } catch (err) {
    console.error(`\nverify: FAILED. Nothing was finalised; the draft is still queued.\n  ${err.message}`);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------- entry

const [command, ...rest] = process.argv.slice(2);

switch (command) {
  case 'list':
    cmdList();
    break;
  case 'check': {
    const errors = cmdCheck(rest[0]);
    if (errors.length) process.exitCode = 1;
    break;
  }
  case 'add':
    cmdAdd(rest[0]);
    break;
  case 'reject':
    cmdReject(rest[0], rest.includes('--reason') ? rest[rest.indexOf('--reason') + 1] : '');
    break;
  case 'publish':
    await cmdPublish(rest[0], {
      dryRun: rest.includes('--dry-run'),
      build: !rest.includes('--no-build'),
    });
    break;
  case 'verify':
    cmdVerify(rest[0]);
    break;
  default:
    console.log(`blog-draft.mjs - draft queue for the daily programme-notes pipeline

  list                          show pending drafts
  check   <file.json>           run every guardrail, change nothing
  add     <file.json>           validate, then queue
  reject  <slug> --reason "..."  move a draft to blog-queue/rejected/
  publish <slug> [--dry-run]    insert into blog.js, rebuild, verify the prerendered page

A draft file is:
  { "sourceCues": ["where the topic came from"], "post": { slug, title, excerpt,
    date, tags, cover, sources, body } }

Allowed tags: ${ALLOWED_TAGS.join(', ')}
Body format: ${MIN_WORDS}-${MAX_WORDS} words, 3-6 "## " sections, "- " lists and "> " quotes,
**bold** / *italic* / [label](/path) only. No h1, no tables, no code, no numbered lists,
no backticks, no external links, no brand or character names, no certification claims.`);
    if (command) process.exitCode = 1;
}
