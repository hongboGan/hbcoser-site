// Single source of truth for per-route <head> values.
// The pages read it on navigation and the prerender script reads it at build time,
// so the static HTML and the hydrated app cannot drift apart.
import { getCategory, getProduct, moqLabel, priceLabel, shortTitle } from '../data/products.js';
import { getPost } from '../content/blog.js';

export const SITE = 'HB Coser';
// Canonical host is www: the apex 308-redirects here on Vercel, so a self-referencing
// canonical must say www or every page points at a URL that immediately redirects away.
export const ORIGIN = 'https://www.hbcoser.com';

const STATIC = {
  '/': {
    title: 'Kids, Pet and Party Cosplay — Wholesale & OEM',
    description:
      "Wholesale and OEM supply for children's cosplay, pet costumes and party programmes — dress-up outfits, photo-booth kits, balloon garlands and backdrops.",
  },
  '/shop': {
    title: 'Catalogue',
    description:
      "The full HB Coser catalogue — kids' cosplay, pet costumes and party & event supply, all available for wholesale and OEM orders.",
  },
  '/custom': {
    title: 'Custom / OEM manufacturing',
    description:
      'OEM and ODM cosplay supply: your artwork, your size chart and your label. How sampling works, what we tool, and the trade terms we work to.',
  },
  '/about': {
    title: 'About us',
    description:
      "A children's cosplay, pet costume and party-supply manufacturer serving importers, distributors, retailers and event producers on wholesale and OEM terms.",
  },
  '/blog': {
    title: 'Programme notes',
    description:
      "Sourcing and programme notes for buyers of kids' cosplay, pet costumes and party supply — sizing, seasonality, compliance and order timing.",
  },
  '/inquiry': {
    title: 'Request a quote',
    description: 'Send us the item and the quantity. Quotes come back within one working day by email or WhatsApp.',
  },
};

// No canonical: a page that does not exist must never claim an address as canonical.
const NOT_FOUND = {
  title: 'Page not found',
  description: 'The page you requested does not exist.',
  path: null,
};

export function metaForPath(pathname) {
  const clean = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  if (STATIC[clean]) return { ...STATIC[clean], path: clean };

  const shop = clean.match(/^\/shop\/([^/]+)$/);
  if (shop) {
    const cat = getCategory(shop[1]);
    return cat
      ? { title: cat.name, description: `${cat.blurb} Wholesale and OEM orders welcome.`, path: clean }
      : NOT_FOUND;
  }

  const product = clean.match(/^\/product\/([^/]+)$/);
  if (product) {
    const item = getProduct(product[1]);
    return item
      ? {
          title: shortTitle(item, 70),
          description: `${item.title} — ${priceLabel(item)}, ${moqLabel(item)}. Wholesale and OEM orders.`,
          path: clean,
          image: item.image,
        }
      : NOT_FOUND;
  }

  const post = clean.match(/^\/blog\/([^/]+)$/);
  if (post) {
    const article = getPost(post[1]);
    return article
      ? { title: article.title, description: article.excerpt, path: clean, image: article.cover }
      : NOT_FOUND;
  }

  return NOT_FOUND;
}

// Concrete head values for a meta descriptor — shared by the client and the prerender.
// A null `path` means "no canonical": an unknown URL must not claim the home page as
// its canonical address.
export function headFor(meta) {
  const title = meta.title ? `${meta.title} | ${SITE}` : SITE;
  const canonical = meta.path == null ? null : `${ORIGIN}${meta.path}`;
  const description = meta.description || '';
  return {
    title,
    description,
    canonical,
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonical,
    ogImage: meta.image ? `${ORIGIN}${meta.image}` : null,
  };
}
