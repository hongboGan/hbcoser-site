import raw from './products.json';

export const CONTACT = {
  email: 'sales01@hoburn.group',
  // The public inbound mailbox and the FormSubmit destination are kept apart on purpose:
  // FormSubmit only delivers to an address that has been activated, so swapping the address
  // customers see must not silently redirect the form to an unverified one.
  formEmail: 'stellagaoxin@gmail.com',
  facebookName: 'Hbmc Costume',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61595292675761',
  whatsappDisplay: '+86 15926072590',
  whatsappUrl: 'https://wa.me/8615926072590',
};

// The third site. The same number also takes chats from the other two sites, so the code
// is what separates them once a conversation is open.
export const SITE_CODE = 'HB3';

// wa.me forwards nothing but the text, so the page a visitor clicked from has to travel
// inside the first message. That tag is the only attribution WhatsApp will ever show us.
export function waLink(ref, tail) {
  const tag = ref ? `${SITE_CODE}-${ref}` : SITE_CODE;
  const opening = `Hello HB Coser, I found you on hbcoser.com (ref ${tag})`;
  // One template for every entry point: the tag sits mid-sentence so the cursor still lands
  // at the end of the message, where the buyer is meant to type.
  const text = `${opening} ${tail || 'and would like to ask about '}`;
  return `${CONTACT.whatsappUrl}?text=${encodeURIComponent(text)}`;
}

// Four storefront lines: character cosplay combines the original kids and general costume
// catalogues, followed by mascot, pets and party/event supply. Product records remain unchanged.
const CHARACTER_CATEGORY = {
  slug: 'character',
  name: 'Character Cosplay',
  blurb: 'Kids, adult and general character costumes, seasonal outfits and cosplay references for wholesale programmes.',
};

const MASCOT_CATEGORY = {
  slug: 'mascot',
  name: 'Mascot',
  blurb: 'Large-format mascot costumes for brand activations, events, retail promotions and public appearances.',
};

export const CATEGORIES = [
  CHARACTER_CATEGORY,
  MASCOT_CATEGORY,
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

export const getCategory = (slug) => {
  if (slug === 'kids' || slug === 'costumes') return CHARACTER_CATEGORY;
  return CATEGORIES.find((c) => c.slug === slug) || null;
};

export const byCategory = (slug, subcategory = null) => {
  const items = slug === 'character'
    ? products.filter((p) => p.category === 'kids' || p.category === 'costumes')
    : products.filter((p) => p.category === slug);
  return subcategory ? items.filter((p) => p.subcategory === subcategory) : items;
};

export const CHARACTER_SUBCATEGORIES = [
  { slug: 'hero', name: 'Hero' },
  { slug: 'dress', name: 'Dress' },
  { slug: 'occupation', name: 'Occupation' },
];

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
