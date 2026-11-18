import { Link } from 'react-router-dom';
import { usePageMeta } from '../lib/seo.js';
import { CATEGORIES, CONTACT } from '../data/products.js';
import { COMPANY_NAME } from '../data/trade-terms.js';
import TradeTerms from '../components/TradeTerms.jsx';

const quote = '/inquiry?scenario=ecommerce';
export default function Ecommerce() {
  usePageMeta();
  return (
    <>
      <section className="section section--tight">
        <div className="shell">
          <div className="procurement-hero">
            <div>
              <p className="eyebrow">Ecommerce sourcing &amp; labelling</p>
              <h1>Start small. Prepare for your next listing.</h1>
              <p className="lede mt-1">Source costumes, pet outfits and party supplies with MOQ 2 per style. Mix sizes and colours within a style, order stock samples, and discuss packaging and labelling for Amazon or other ecommerce channels.</p>
              <div className="hero__actions">
                <Link className="btn btn--primary" to={quote}>Discuss my ecommerce order</Link>
                <Link className="btn btn--ghost" to="/shop">Explore products</Link>
              </div>
            </div>
            <figure className="procurement-hero__image">
              <img src="/custom/added-20261118/packaging-reference.webp" width="588" height="738" alt="Pink drawstring packaging reference with printed band" loading="eager" />
              <figcaption>Custom packaging reference. This example is not the standard zip bag and carton pack; confirm your own dimensions and artwork.</figcaption>
            </figure>
          </div>
          <TradeTerms compact />
        </div>
      </section>
      <section className="section section--raised">
        <div className="shell">
          <p className="eyebrow">Choose your route</p>
          <h2>Stock, light customisation or a new sample?</h2>
          <div className="features mt-2">
            <div className="feature"><h3>Test existing stock</h3><p>Stock samples are available to order. In-stock orders dispatch within 3 days; delivery time depends on transport. The buyer pays freight.</p></div>
            <div className="feature"><h3>Add your labels and packing</h3><p>Light customisation starts from 7 days. Packaging bags, shipping marks and hangtags can be customised; send your label files and placement instructions.</p></div>
            <div className="feature"><h3>Develop a custom version</h3><p>Custom sampling generally starts from 10 days; ask for the sample fee. Custom bulk production starts from 15 days. Confirm the schedule for your specification.</p></div>
          </div>
          <div className="procurement-links">{CATEGORIES.map((c) => <Link className="chip" key={c.slug} to={`/shop/${c.slug}`}>{c.name}</Link>)}</div>
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <p className="eyebrow">Prepare a useful request</p>
          <h2>Send the details that affect your quotation.</h2>
          <ul className="procurement-checklist">
            <li>Product reference, quantity and the size/colour mix for each style.</li>
            <li>Stock sample, light customisation or custom production.</li>
            <li>Destination country and your required dispatch or arrival date.</li>
            <li>Packaging bag, carton mark or hangtag artwork, if needed.</li>
            <li>Your label files and product-to-label mapping, including placement instructions.</li>
          </ul>
          <p className="mt-2">Labelling support is a service, not an Amazon endorsement or a guarantee of marketplace or warehouse acceptance. Confirm the applicable requirements for your products and destination before ordering.</p>
          <p>Send reference files to <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> after your inquiry. Label and packaging charges are confirmed with the quotation, not assumed to be included.</p>
          <TradeTerms />
          <div className="band">
            <div><h2>Ready to discuss your product mix?</h2><p className="mt-1">{COMPANY_NAME} · EXW quotations, with freight paid by the buyer.</p></div>
            <Link className="btn btn--primary" to={quote}>Request an ecommerce quote</Link>
          </div>
        </div>
      </section>
    </>
  );
}
