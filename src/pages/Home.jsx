import { Link } from 'react-router-dom';
import { CATEGORIES, CONTACT, byCategory, countIn, getProduct, products } from '../data/products.js';
import { usePageMeta } from '../lib/seo.js';
import ProductCard from '../components/ProductCard.jsx';

// Four per line, so every category is represented and the grid fills whole rows. Three per
// line left a single orphaned card on the last row at desktop width.
const FEATURED = CATEGORIES.flatMap((c) => byCategory(c.slug).slice(0, 4));

// Above the fold, so these are preloaded rather than lazy — a lazy hero has produced a
// blank first paint on this stack before, and scrolling hides the defect.
const HERO = [
  { id: 'kids-witch-cloak-set', tile: 'hero__tile hero__tile--tall' },
  { id: 'pets-panda-hat-cape', tile: 'hero__tile hero__tile--short' },
  { id: 'kids-pumpkin-set', tile: 'hero__tile hero__tile--short' },
]
  .map((t) => ({ ...t, product: getProduct(t.id) }))
  .filter((t) => t.product);

const OEM = [
  {
    t: 'Your artwork',
    v: 'Send reference images, tech packs or a physical sample. We match colour, material and finish.',
  },
  {
    t: 'Your size chart',
    v: 'Grading built from your measurements, not a generic block — toddler through teen, plus pet sizing by breed.',
  },
  {
    t: 'Your packaging',
    v: 'Labels, hangtags and retail packing applied at the factory, so the carton arrives shelf-ready.',
  },
  {
    t: 'Your season',
    v: 'Sample first, then bulk. Tell us the in-store or event date and we plan the run backwards from it.',
  },
];

export default function Home() {
  usePageMeta();

  return (
    <>
      <section className="hero">
        <div className="shell hero__inner">
          <div className="hero__grid">
            <div>
              <p className="eyebrow">Wholesale &amp; OEM · Made to order</p>
              <h1>Cosplay for kids, pets and the party floor.</h1>
              <p className="lede">
                Dress-up outfits for children, costumes sized for cats and dogs, and photo-booth,
                balloon and backdrop programmes for events. Buy the stock line as it is, or have it
                built to your own artwork, size chart and label.
              </p>
              <div className="hero__actions">
                <Link className="btn btn--primary" to="/shop">
                  Browse the catalogue
                </Link>
                <Link className="btn btn--ghost" to="/inquiry">
                  Request a quote
                </Link>
              </div>
            </div>

            <div className="hero__stage">
              <div className="hero__mosaic">
                {HERO.map(({ product, tile }) => (
                  <div className={tile} key={product.id}>
                    <img
                      src={product.image}
                      alt={product.title}
                      width={product.width || 900}
                      height={product.height || 900}
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
              <div className="stage__card">
                <strong>Your programme, our floor</strong>
                <span>
                  MOQ from 1 pc on stock lines · OEM on artwork, sizing and packaging · sample approved
                  before bulk
                </span>
              </div>
            </div>
          </div>

          <div className="stats">
            <div>
              <strong>{products.length}</strong>
              <span>Stock references</span>
            </div>
            <div>
              <strong>{CATEGORIES.length}</strong>
              <span>Product lines</span>
            </div>
            <div>
              <strong>OEM</strong>
              <span>Your artwork &amp; label</span>
            </div>
            <div>
              <strong>0</strong>
              <span>Licensed characters sold</span>
            </div>
          </div>
        </div>
      </section>

      <div className="wallstrip">
        <div className="shell wallstrip__row">
          {CATEGORIES.map((c) => (
            <span key={c.slug}>{c.name}</span>
          ))}
          <span>OEM / ODM</span>
        </div>
      </div>

      <section className="section section--raised">
        <div className="shell">
          <div className="sec-head">
            <span className="sec-head__n">01</span>
            <div className="sec-head__body">
              <p className="eyebrow">Who we are</p>
              <h2>Three lines, one manufacturing floor.</h2>
              <p>
                HB Coser supplies children&apos;s cosplay, pet costumes and party/event programmes to
                importers, distributors, retailers, event producers and family-entertainment
                operators. The references below are stock starting points — most of what leaves our
                floor is made to a buyer&apos;s own colourway, size chart and packaging.
              </p>
            </div>
          </div>

          <div className="tiles">
            {CATEGORIES.map((c, i) => {
              const first = byCategory(c.slug)[0];
              return (
                <Link key={c.slug} className="tile" to={`/shop/${c.slug}`}>
                  <span className="tile__n" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {first && (
                    <span className="tile__bloom">
                      <img src={first.image} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                    </span>
                  )}
                  <span className="tile__body">
                    <strong>{c.name}</strong>
                    <em>{countIn(c.slug)} products</em>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="sec-head">
            <span className="sec-head__n">02</span>
            <div className="sec-head__body">
              <p className="eyebrow">Selected references</p>
              <h2>Recent additions to the catalogue.</h2>
            </div>
          </div>

          <div className="grid">
            {FEATURED.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-3">
            <Link className="btn btn--ghost" to="/shop">
              See all {products.length} products
            </Link>
          </div>
        </div>
      </section>

      <section className="bleed bleed--ink">
        <div className="shell">
          <div className="sec-head sec-head--ink">
            <span className="sec-head__n">03</span>
            <div className="sec-head__body">
              <p className="eyebrow">Custom / OEM</p>
              <h2>Your programme, whoever&apos;s label is on it.</h2>
            </div>
          </div>

          <div className="features">
            {OEM.map((f, i) => (
              <div className="feature" key={f.t}>
                <span className="feature__n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{f.t}</h3>
                <p>{f.v}</p>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Link className="btn btn--light" to="/custom">
              How custom orders work
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="band">
            <div>
              <h2>Send us the item and the quantity.</h2>
              <p className="mt-1">Quotes within one working day, by email or WhatsApp — whichever you prefer.</p>
            </div>
            <div className="band__actions">
              <Link className="btn btn--primary" to="/inquiry">
                Start an inquiry
              </Link>
              <a className="btn btn--ghost" href={CONTACT.whatsappUrl}>
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
