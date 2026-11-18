// Treat punctuation and repeated whitespace consistently for titles and reference codes.
export function normalizeSearch(value = '') {
  return String(value).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

export function matchesProductSearch(product, query, categoryName = '') {
  const terms = normalizeSearch(query).split(' ').filter(Boolean);
  const searchable = normalizeSearch([
    product.title,
    product.id,
    product.category,
    categoryName,
    product.subcategory,
  ].filter(Boolean).join(' '));
  return terms.every((term) => searchable.includes(term));
}
