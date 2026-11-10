import { Link } from 'react-router-dom';
import { priceLabel, moqLabel, getCategory } from '../data/products.js';

export default function ProductCard({ product }) {
  const cat = getCategory(product.category);
  const mobileImage = product.image.startsWith('/')
    ? product.image.replace(/\.webp$/, '-mobile.webp')
    : null;
  return (
    <Link className="card" to={`/product/${product.id}`}>
      <div className="card__media">
        <picture>
          {mobileImage && <source media="(max-width: 640px)" srcSet={mobileImage} />}
          <img
            src={product.image}
            alt={`${product.title} — ${cat ? cat.name : product.category}`}
            width={product.width || 900}
            height={product.height || 900}
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
      <span className="card__cat">{cat ? cat.name : product.category}</span>
      <span className="card__title">{product.title}</span>
      <span className="card__price">{priceLabel(product)}</span>
      <span className="card__moq">{moqLabel(product)}</span>
    </Link>
  );
}
