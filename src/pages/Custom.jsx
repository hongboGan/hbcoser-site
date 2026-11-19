import { Link } from 'react-router-dom';
import { CONTACT, waLink } from '../data/products.js';
import { usePageMeta } from '../lib/seo.js';
import GalleryImage from '../components/GalleryImage.jsx';
import DeferredGallery from '../components/DeferredGallery.jsx';
import { ADDED_CUSTOM_IMAGES } from '../data/added-gallery-images.js';
import TradeTerms from '../components/TradeTerms.jsx';

const CHANGES = [
  {
    k: 'Colour',
    v:
      'Mix available colours within one style. For a custom colourway, send a colour reference or physical swatch for specification and quotation confirmation.',
  },
  {
    k: 'Sizing',
    v:
      "Your size chart, not ours. Children's runs from toddler to teen, and pet sizing graded by breed and girth rather than a single 'small / medium / large' block.",
  },
  {
    k: 'Material',
    v:
      'The fabric used for textile products is polyester. Non-textile parts, accessories and any requested changes need separate specification confirmation.',
  },
  {
    k: 'Branding',
    v:
      'Custom hangtags and label application for Amazon and other ecommerce buyers. Send the artwork, product-to-label mapping and placement requirements for confirmation.',
  },
  {
    k: 'Packaging',
    v:
      'Standard packing is a zip bag and carton. Packaging bags, shipping marks and hangtags can be customised. We can apply labels for Amazon and other ecommerce buyers using your confirmed files and instructions.',
  },
];

const STEPS = [
  { n: 'Step 01', t: 'Specification', v: 'Tell us the reference, the quantity, the market and the date you need it in store. If you have a tech pack, send it — if not, reference images are enough to start.' },
  { n: 'Step 02', t: 'Quotation', v: 'We come back with unit pricing at your quantity, the tooling or setup charges if any, and the lead time we will hold ourselves to. Both are confirmed in writing before anything is cut.' },
  { n: 'Step 03', t: 'Sampling', v: 'A pre-production sample in your colourway and sizing, with your artwork and label. Nothing goes to bulk until you have signed it off.' },
  { n: 'Step 04', t: 'Bulk production', v: 'The approved sample becomes the reference for the run. Changes after sign-off are a new sample, not a quiet deviation.' },
  { n: 'Step 05', t: 'Inspection and shipping', v: 'A final check against the approved sample before packing, with photos of the packed cartons. We ship on your forwarder or ours.' },
];

const CASE_STUDIES = [
  ...ADDED_CUSTOM_IMAGES,
  { image: '/custom/custom-case-01.webp', title: 'Retail packaging and garment presentation' },
  { image: '/custom/custom-case-02.webp', title: 'Licensed-style costume sample development' },
  { image: '/custom/custom-case-03.webp', title: 'Custom hangtag and brand identity details' },
  { image: '/custom/custom-case-04.webp', title: 'Production-ready garment and trim packaging' },
];

export default function Custom() {
  usePageMeta();

  return (
    <>
      <section className="section">
        <div className="shell">
          <p className="eyebrow">Custom / OEM</p>
          <h1 style={{ maxWidth: '20ch' }}>Made to your specification, not to ours.</h1>
          <p className="lede mt-1">
            Every reference on this site is a starting point. Tell us what has to change — colour,
            sizing, material, branding, packaging — and we quote the version you actually want to
            sell, rather than the one we happen to stock.
          </p>
        </div>
      </section>

      <section className="section section--raised">
        <div className="shell">
          <div className="sec-head">
            <span className="sec-head__n">01</span>
            <div className="sec-head__body">
              <p className="eyebrow">What can be changed</p>
              <h2>Five things buyers change first.</h2>
            </div>
          </div>
          <div className="features">
            {CHANGES.map((c) => (
              <div className="feature" key={c.k}>
                <span className="feature__n">{c.k}</span>
                <p>{c.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--raised custom-cases">
        <div className="shell">
          <div className="sec-head">
            <span className="sec-head__n">02</span>
            <div className="sec-head__body">
              <p className="eyebrow">Custom references</p>
              <h2>From sample detail to retail-ready finish.</h2>
              <p>Selected examples of packaging, labelling and costume development for custom programmes.</p>
            </div>
          </div>
          <DeferredGallery id="custom-references" layout="custom-page" className="custom-roll custom-roll--page" aria-label="Scrolling custom references">
            <div className="custom-roll__track">
              {[...CASE_STUDIES, ...CASE_STUDIES].map((item, index) => (
                <figure key={`${item.image}-${index}`} className="custom-roll__item">
                  <GalleryImage image={item.image} alt={`${item.title} custom costume reference`} />
                </figure>
              ))}
            </div>
          </DeferredGallery>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="sec-head">
            <span className="sec-head__n">03</span>
            <div className="sec-head__body">
              <p className="eyebrow">How it works</p>
              <h2>Sample first. Then bulk.</h2>
            </div>
          </div>
          <div className="features">
            {STEPS.map((s) => (
              <div className="feature" key={s.n}>
                <span className="feature__n">{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--raised">
        <div className="shell">
          <div className="sec-head">
            <span className="sec-head__n">04</span>
            <div className="sec-head__body">
              <p className="eyebrow">Working terms</p>
              <h2>What we need from you.</h2>
            </div>
          </div>
          <TradeTerms />
          <div className="features mt-2">
            <div className="feature">
              <h3>Artwork or reference</h3>
              <p>
                Vector artwork for anything printed, plus a reference photo of the finish you expect.
                Colour decisions made from a screen are the most common source of a rejected sample.
              </p>
            </div>
            <div className="feature">
              <h3>A quantity to quote against</h3>
              <p>
                MOQ is 2 per style, with mixed sizes and colours within one style. All listed product
                prices are EXW; freight is paid by the buyer. Custom specifications are quoted separately.
              </p>
            </div>
            <div className="feature">
              <h3>The market it sells into</h3>
              <p>
                Age grading, labelling and mandatory safety requirements differ by country. Tell us
                where the goods are going and we will flag what the run has to carry.
              </p>
            </div>
          </div>
          <p className="mt-3" style={{ fontSize: '0.88rem', color: 'var(--ink-muted)' }}>
            Custom work is quoted per project, so there is no price list to publish — the reference
            prices on this site apply to the stock versions only.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="band">
            <div>
              <h2>Send the reference and the quantity.</h2>
              <p className="mt-1">We will tell you what the custom version costs and how long it takes.</p>
            </div>
            <div className="band__actions">
              <Link className="btn btn--primary" to="/inquiry">
                Start an inquiry
              </Link>
              <a className="btn btn--ghost" href={waLink('CUSTOM')}>
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
