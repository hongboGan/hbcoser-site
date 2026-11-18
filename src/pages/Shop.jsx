import { useSearchParams } from 'react-router-dom';
import { CATEGORIES, byCategory, getCategory, products } from '../data/products.js';
import { matchesProductSearch } from '../lib/product-search.js';
import { usePageMeta } from '../lib/seo.js';
import ProductCard from '../components/ProductCard.jsx';
import TradeTerms from '../components/TradeTerms.jsx';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const query = (params.get('search') || '').trim().replace(/\s+/g, ' ');
  const requestedCategory = params.get('category');
  const filter = CATEGORIES.some((category) => category.slug === requestedCategory) ? requestedCategory : 'all';

  usePageMeta();

  const matches = (product) => matchesProductSearch(product, query, getCategory(product.category)?.name);
  const searchResults = products.filter(matches);
  const shown = filter === 'all' ? searchResults : byCategory(filter).filter(matches);
  const categoryCount = (slug) => byCategory(slug).filter(matches).length;

  function setFilter(category) {
    const next = new URLSearchParams(params);
    if (category === 'all') next.delete('category');
    else next.set('category', category);
    setParams(next);
  }

  function clearSearch() {
    const next = new URLSearchParams(params);
    next.delete('search');
    setParams(next);
  }

  return (
    <section className="section">
      <div className="shell">
        <p className="eyebrow">Catalogue</p>
        <h1 className="catalogue-title" style={{ fontSize: 'clamp(2rem, 4.4vw, 3.2rem)' }}>
          {query ? `Search results for “${query}”` : 'All products'}
        </h1>
        <p className="lede mt-1">
          {products.length} product references. Prices are indicative EXW ranges in USD; final pricing
          depends on quantity and specification. Freight is paid by the buyer.
        </p>

        <TradeTerms compact />
        <div className="catalogue-search-summary">
          <span role="status" aria-live="polite" aria-atomic="true">
            {shown.length} {shown.length === 1 ? 'product' : 'products'}{query ? ` matching “${query}”` : ''}
            {filter !== 'all' ? ` in ${getCategory(filter).name}` : ''}.
          </span>
          {query && <button className="chip" type="button" onClick={clearSearch}>Clear search</button>}
        </div>

        <div className="chips" role="group" aria-label="Filter by category">
          <button
            type="button"
            className="chip"
            aria-pressed={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All ({searchResults.length})
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              className="chip"
              aria-pressed={filter === c.slug}
              onClick={() => setFilter(c.slug)}
            >
              {c.name} ({categoryCount(c.slug)})
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <div className="empty">
            <p>{query ? 'No products match this search in the selected category. Try another product name or reference code.' : 'No products in this category yet.'}</p>
            {filter !== 'all' && (
              <button className="chip" type="button" onClick={() => setFilter('all')}>Search all categories</button>
            )}
            {query && <button className="chip" type="button" onClick={clearSearch}>Clear search</button>}
          </div>
        ) : (
          <div className="grid">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
