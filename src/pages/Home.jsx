import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, CONTACT, byCategory, countIn, getProduct, products, waLink } from '../data/products.js';
import { usePageMeta } from '../lib/seo.js';
import ProductCard from '../components/ProductCard.jsx';

// Four per line, so every category is represented and the grid fills whole rows. Three per
// line left a single orphaned card on the last row at desktop width.
const FEATURED = CATEGORIES.flatMap((c) => byCategory(c.slug).slice(0, 4));

// Above the fold, so these are preloaded rather than lazy — a lazy hero has produced a
// blank first paint on this stack before, and scrolling hides the defect.
const HERO = [
  {
    image: '/banners/halloween-costumes-banner.jpg',
    kicker: 'Halloween wholesale edit · Factory direct',
    title: <>Make the night <em>unforgettable.</em></>,
    copy: 'Costumes, masks and party-ready pieces for seasonal retailers, event teams and OEM buyers.',
    cta: 'Shop the Halloween edit',
    href: '/shop/costumes',
  },
  {
    image: '/banners/halloween-props-banner.jpg',
    kicker: 'Masks · props · seasonal stock',
    title: <>Build a <em>scene</em> they remember.</>,
    copy: 'Source the accessories and atmosphere that turn a costume line into a complete event programme.',
    cta: 'Browse masks & props',
    href: '/shop/party',
  },
  {
    image: '/banners/halloween-collection-banner.jpg',
    kicker: 'Custom colour · sizing · packaging',
    title: <>Your label. Our <em>workshop.</em></>,
    copy: 'Start with a stock silhouette, then move into your artwork, size chart and retail-ready pack.',
    cta: 'Start an OEM brief',
    href: '/custom',
  },
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
      <section className="hero hero--carousel" aria-roledescription="carousel" aria-label="Halloween campaign banners">
        <div className="hero__moon" aria-hidden="true" />
        <div className="hero__stars" aria-hidden="true">✦　·　✧　·　✦</div>
        <div className="hero__banner-image" key={current.image} style={{ backgroundImage: `url(${current.image})` }} aria-hidden="true" />
        <div className="shell hero__inner">
          <div className="hero__grid">
            <div className="hero__copy" aria-live="polite">
              <p className="eyebrow">{current.kicker}</p>
              <h1>{current.title}</h1>
              <p className="lede">{current.copy}</p>
              <div className="hero__actions">
                <Link className="btn btn--primary" to={current.href}>{current.cta}</Link>
                <Link className="btn btn--ghost" to="/inquiry">Request a wholesale quote</Link>
              </div>
              <div className="hero__proof">
                <span><strong>105</strong> stocked references</span>
                <span><strong>OEM</strong> colour + label</span>
                <span><strong>3s</strong> seasonal rotation</span>
              </div>
            </div>
            <div className="hero__stage hero__stage--banner">
              <div className="stage__card">
                <strong>Seasonal edit · {String(slide + 1).padStart(2, '0')} / 03</strong>
                <span>Factory-direct pieces for retail, events and custom programmes.</span>
              </div>
            </div>
          </div>
          <div className="hero__controls" aria-label="Banner controls">
            <button type="button" onClick={() => move(-1)} aria-label="Previous banner">←</button>
            {HERO.map((item, index) => (
              <button key={item.image} type="button" className={index === slide ? 'is-active' : ''} onClick={() => setSlide(index)} aria-label={`Show banner ${index + 1}`} aria-current={index === slide ? 'true' : undefined} />
            ))}
            <button type="button" onClick={() => move(1)} aria-label="Next banner">→</button>
            <button type="button" className="hero__pause" onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Resume banner rotation' : 'Pause banner rotation'}>{paused ? 'Play' : 'Pause'}</button>
          </div>
        </div>
      </section>

      <div className="wallstrip">
        <div className="shell wallstrip__row">
          <span>HALLOWEEN COSTUMES</span>
          <span>MASKS &amp; PROPS</span>
          <span>SEASONAL STOCK</span>
          <span>OEM / ODM</span>
        </div>
      </div>

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
              <a className="btn btn--ghost" href={waLink('HOME')}>
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
