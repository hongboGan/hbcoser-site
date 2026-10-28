import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CHARACTER_SUBCATEGORIES, getCategory, byCategory } from '../data/products.js';
import { usePageMeta } from '../lib/seo.js';
import ProductCard from '../components/ProductCard.jsx';
import NotFound from './NotFound.jsx';

export default function CategoryPage() {
  const { category } = useParams();
  const [subcategory, setSubcategory] = useState('all');
  const cat = getCategory(category);

  usePageMeta();

  if (!cat) return <NotFound />;

  const items = byCategory(cat.slug, subcategory === 'all' ? null : subcategory);
  const subcategories = cat.slug === 'character' ? CHARACTER_SUBCATEGORIES : [];

  return (
    <section className="section">
      <div className="shell">
        <p className="eyebrow">
          <Link to="/shop">Catalogue</Link> / {cat.name}
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 4.4vw, 3.2rem)' }}>{cat.name}</h1>
        <p className="lede mt-1">{cat.blurb}</p>

        {subcategories.length > 0 && (
          <div className="chips category-subcategories" role="group" aria-label="Character subcategories">
            <button type="button" className="chip" aria-pressed={subcategory === 'all'} onClick={() => setSubcategory('all')}>All Character</button>
            {subcategories.map((item) => (
              <button key={item.slug} type="button" className="chip" aria-pressed={subcategory === item.slug} onClick={() => setSubcategory(item.slug)}>{item.name}</button>
            ))}
          </div>
        )}

        {items.length === 0 ? (
          <p className="empty">No products in this category yet.</p>
        ) : (
          <div className="grid">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="mt-3">
          <Link className="btn btn--ghost" to="/shop">
            Back to all products
          </Link>
        </div>
      </div>
    </section>
  );
}
