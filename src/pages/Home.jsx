import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, byCategory, countIn, products } from '../data/products.js';
import { usePageMeta } from '../lib/seo.js';
import ProductCard from '../components/ProductCard.jsx';

// Section 02 always leads with the four newest records in products.json. The catalogue
// append order is the source of truth for “latest”; the remaining six slots use the
// previously requested superhero range, then newest non-duplicate products as fallback.
const LATEST_PRODUCTS = products.slice(-4).reverse();
const PRIORITY_PRODUCT_IDS = [
  'miles-morales-spiderman',
  'spider-gwen',
  'iron-spider',
  'venom-symbiote',
  'spiderman-peter-parker',
  'venom-carnage-red',
  'lightning-venom',
  'venom-blackpanther-kids',
  'captain-america-muscle',
  'deadpool-cosplay',
];
const PRIORITY_PRODUCTS = PRIORITY_PRODUCT_IDS
  .map((id) => products.find((product) => product.id === id))
  .filter((product) => product && !LATEST_PRODUCTS.some((latest) => latest.id === product.id));
const FEATURED_EXTRAS = products
  .slice()
  .reverse()
  .filter((p) => !LATEST_PRODUCTS.some((latest) => latest.id === p.id)
    && !PRIORITY_PRODUCT_IDS.includes(p.id))
  .slice(0, Math.max(0, 10 - LATEST_PRODUCTS.length - PRIORITY_PRODUCTS.length));
const FEATURED = [...LATEST_PRODUCTS, ...PRIORITY_PRODUCTS, ...FEATURED_EXTRAS].slice(0, 10);

// Above the fold, so these are preloaded rather than lazy — a lazy hero has produced a
// blank first paint on this stack before, and scrolling hides the defect.
const HERO = [
  { image: '/banners/banner-career.jpg', href: '/shop/character' },
  { image: '/banners/banner-christmas.jpg', href: '/shop/character' },
  { image: '/banners/banner-princess.jpg', href: '/shop/character' },
];

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

const FACTORY_IMAGES = [
  '/factory/factory-01.webp',
  '/factory/factory-02.webp',
  '/factory/factory-03.webp',
  '/factory/factory-04.webp',
  '/factory/factory-05.webp',
];

const REVIEWS = [
  {
    image: '/reviews/review-01.webp',
    market: 'Buyer showcase · Europe',
    quote: 'Sample review copy — replace with a verified buyer quote before publishing.',
  },
  {
    image: '/reviews/review-02.webp',
    market: 'Buyer showcase · North America',
    quote: 'Sample review copy — replace with a verified buyer quote before publishing.',
  },
  {
    image: '/reviews/review-03.webp',
    market: 'Buyer showcase · Australia',
    quote: 'Sample review copy — replace with a verified buyer quote before publishing.',
  },
  {
    image: '/reviews/review-04.webp',
    market: 'Buyer showcase · Middle East',
    quote: 'Sample review copy — replace with a verified buyer quote before publishing.',
  },
  {
    image: '/reviews/review-05.webp',
    market: 'Buyer showcase · Latin America',
    quote: 'Sample review copy — replace with a verified buyer quote before publishing.',
  },
];

const CUSTOM_CASE_IMAGES = [
  '/custom/custom-case-01.webp',
  '/custom/custom-case-02.webp',
  '/custom/custom-case-03.webp',
  '/custom/custom-case-04.webp',
  ...Array.from({ length: 13 }, (_, index) => `/custom/client-case-web/client-case-${String(index + 1).padStart(2, '0')}.jpg`),
];

export default function Home() {
  usePageMeta();
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = HERO[slide];

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => setSlide((value) => (value + 1) % HERO.length), 3000);
    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (reduce?.matches) setPaused(true);
  }, []);

  function move(delta) {
    setSlide((value) => (value + delta + HERO.length) % HERO.length);
  }

  return (
    <>
      <section className="hero hero--carousel hero--wide-banner" aria-roledescription="carousel" aria-label="Costume collection banners">
        <img className="hero__banner-image" key={current.image} src={current.image} alt="Costume collection banner" />
        <Link className="hero__banner-link" to={current.href} aria-label="Shop this collection" />
      </section>

      <section className="section section--raised">
        <div className="shell">
          <div className="sec-head">
            <span className="sec-head__n">01</span>
            <div className="sec-head__body">
              <p className="eyebrow">Who we are</p>
              <h2>Four lines, one manufacturing floor.</h2>
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
              const first = c.slug === 'character'
                ? { image: '/categories/costumes-cosplay.webp' }
                : byCategory(c.slug)[0];
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
              <p>Four latest additions lead the section, followed by priority character references.</p>
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

          <div className="factory-showcase" aria-label="Factory showcase">
            <div className="factory-showcase__copy">
              <p className="eyebrow">Factory floor</p>
              <h3>See how the range comes together.</h3>
              <p>Printing, finishing, packing and a live costume reference wall — built for buyer visits and repeat programmes.</p>
              <Link className="btn btn--ghost" to="/factory">Visit the factory page</Link>
            </div>
            <div className="factory-showcase__rail" aria-label="Scrolling factory image display">
              <div className="factory-showcase__track">
                {[...FACTORY_IMAGES, ...FACTORY_IMAGES].map((image, index) => (
                  <figure className="factory-showcase__frame" key={`${image}-${index}`}>
                    <img src={image} alt={`Factory production showcase ${(index % FACTORY_IMAGES.length) + 1}`} loading="lazy" />
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bleed bleed--ink combined-custom-section">
        <div className="shell">
          <div className="sec-head sec-head--ink">
            <span className="sec-head__n">03</span>
            <div className="sec-head__body">
              <p className="eyebrow">Custom / OEM</p>
              <h2>Your programme, whoever&apos;s label is on it.</h2>
              <p>From artwork and sampling to finished costume programmes, packaging and buyer-ready production.</p>
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
          <p className="custom-roll__label">Custom case references · artwork, sampling and finished applications</p>
          <div className="custom-roll" aria-label="Scrolling custom case references">
            <div className="custom-roll__track">
              {[...CUSTOM_CASE_IMAGES, ...CUSTOM_CASE_IMAGES].map((image, index) => (
                <figure className="custom-roll__item" key={`${image}-${index}`}>
                  <img src={image} alt={`Custom case reference ${(index % CUSTOM_CASE_IMAGES.length) + 1}`} loading="lazy" />
                </figure>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <Link className="btn btn--light" to="/custom">How custom orders work</Link>
          </div>
        </div>
      </section>

      <section className="section section--raised testimonials-section">
        <div className="shell">
          <div className="sec-head">
            <span className="sec-head__n">04</span>
            <div className="sec-head__body">
              <p className="eyebrow">Customer proof</p>
              <h2>Made for buyers who need the range to work.</h2>
              <p>Five visual references for the kinds of programmes our wholesale partners build.</p>
            </div>
          </div>
          <div className="reviews-grid">
            {REVIEWS.map((review, index) => (
              <article className="review-card" key={review.image}>
                <div className="review-card__image"><img src={review.image} alt="Customer costume showcase" loading="lazy" /></div>
                <div className="review-card__body">
                  <span className="review-card__index">0{index + 1}</span>
                  <p className="review-card__market">{review.market}</p>
                  <p className="review-card__quote">“{review.quote}”</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>


    </>
  );
}
