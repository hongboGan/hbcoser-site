import { Link } from 'react-router-dom';
import { CATEGORIES, CONTACT, countIn, products } from '../data/products.js';
import { usePageMeta } from '../lib/seo.js';

export default function About() {
  usePageMeta();

  return (
    <>
      <section className="section">
        <div className="shell">
          <p className="eyebrow">About</p>
          <h1 style={{ maxWidth: '22ch' }}>A cosplay supplier built for repeat programmes.</h1>
          <p className="lede mt-1">
            HB Coser manufactures and supplies children&apos;s cosplay, pet costumes and party/event
            material for buyers who reorder: importers and distributors, toy and dress-up retailers,
            pet-product sellers, event producers and theme venues. The catalogue is the front door;
            most of the business is made-to-order.
          </p>
        </div>
      </section>

      <section className="section section--raised">
        <div className="shell">
          <div className="sec-head">
            <span className="sec-head__n">01</span>
            <div className="sec-head__body">
              <p className="eyebrow">What we produce</p>
              <h2>Three lines, kept deliberately separate.</h2>
            </div>
          </div>
          <ul className="spec mt-2" style={{ maxWidth: '62ch' }}>
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <span>
                  <Link to={`/shop/${c.slug}`} style={{ color: 'var(--cyan)' }}>
                    {c.name}
                  </Link>
                </span>
                <span>{countIn(c.slug)} references</span>
              </li>
            ))}
            <li>
              <span>Custom / OEM production</span>
              <span>Quoted per project</span>
            </li>
            <li>
              <span>Stock references in total</span>
              <span>{products.length}</span>
            </li>
          </ul>
          <p className="lede mt-2">
            The lines are kept apart on purpose. A children&apos;s buyer, a pet-products distributor
            and an event producer need different MOQs, different cartons and different compliance
            paperwork — bundling them into one catalogue would serve none of them well.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="sec-head">
            <span className="sec-head__n">02</span>
            <div className="sec-head__body">
              <p className="eyebrow">How we work</p>
              <h2>Three habits that decide whether a reorder lands on time.</h2>
            </div>
          </div>
          <div className="features">
            <div className="feature">
              <span className="feature__n">01</span>
              <h3>The approved sample is the specification</h3>
              <p>
                Once you sign off a sample, that sample is the reference for every run we make against
                it. Deliberate changes go through a new sample — they do not appear quietly in a
                reorder.
              </p>
            </div>
            <div className="feature">
              <span className="feature__n">02</span>
              <h3>Deviations get reported, not smoothed over</h3>
              <p>
                If a trim, a shade or a delivery date is going to move, you hear it while there is
                still time to decide something. A surprise in the carton costs more than an
                uncomfortable email.
              </p>
            </div>
            <div className="feature">
              <span className="feature__n">03</span>
              <h3>Compliance is quoted with the goods</h3>
              <p>
                Labelling, age grading and market-specific requirements are part of the specification
                from the start, because they change what the factory has to cut and print.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--raised">
        <div className="shell">
          <div className="sec-head">
            <span className="sec-head__n">03</span>
            <div className="sec-head__body">
              <p className="eyebrow">Sourcing policy</p>
              <h2>No character licences, no lookalike goods.</h2>
            </div>
          </div>
          <p className="lede mt-1">
            Everything we list is a generic design or a buyer&apos;s own artwork. We do not sell
            licensed characters, and we do not run lookalike versions of them — so nothing on this
            site carries a studio name, a franchise name or a character likeness. If your programme
            needs a licensed property, that is a licence you hold and artwork you supply.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="band">
            <div>
              <h2>Tell us what your programme needs.</h2>
              <p className="mt-1">We will tell you what is stock, what has to be made, and what it costs.</p>
            </div>
            <div className="band__actions">
              <Link className="btn btn--primary" to="/inquiry">
                Request a quote
              </Link>
              <a className="btn btn--ghost" href={`mailto:${CONTACT.email}`}>
                Email us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
