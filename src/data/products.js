import raw from './products.json';

export const CONTACT = {
  email: 'stellagaoxin@gmail.com',
  whatsappDisplay: '+86 15107146833',
  whatsappUrl: 'https://wa.me/8615107146833',
};

// Three lines, deliberately kept apart from the other two sites: children's cosplay,
// pets, and party/event supply. Nothing here overlaps the adult costume range or the
// masks, wigs, armour and props catalogue.
export const CATEGORIES = [
  {
    slug: 'kids',
    name: "Kids' Cosplay",
    blurb:
      "Role-play and character outfits from toddler to teen, built for children's dress-up ranges.",
  },
  {
    slug: 'pets',
    name: 'Pet Cosplay',
    blurb: 'Capes, hats and full outfits sized for cats and dogs, in the styles pet retailers reorder.',
  },
  {
    slug: 'party',
    name: 'Party & Event',
    blurb: 'Photo-booth kits, balloon garlands, backdrops and occasion sets for event programmes.',
  },
];

export const products = raw.products;

export const getProduct = (id) => products.find((p) => p.id === id) || null;

export const getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug) || null;

export const byCategory = (slug) => products.filter((p) => p.category === slug);

export const countIn = (slug) => byCategory(slug).length;

export function priceLabel(p) {
  if (p.priceUsdMin == null) return 'Price on request';
  if (p.priceUsdMax == null || p.priceUsdMax === p.priceUsdMin) return `US$${p.priceUsdMin.toFixed(2)}`;
  return `US$${p.priceUsdMin.toFixed(2)} – ${p.priceUsdMax.toFixed(2)}`;
}

export function moqLabel(p) {
  return p.moq ? `MOQ ${p.moq}` : 'MOQ on request';
}

// A compact label for links and lists, trimmed on a word boundary.
export function shortTitle(p, max = 58) {
  const t = p.title;
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const at = cut.lastIndexOf(' ');
  return `${cut.slice(0, at > 30 ? at : max).replace(/[,;:.\-–]$/, '')}…`;
}
