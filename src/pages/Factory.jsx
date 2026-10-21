import { Link } from 'react-router-dom';
import { CONTACT } from '../data/products.js';
import { usePageMeta } from '../lib/seo.js';

// Every number on this page comes from the company's own operating records for 2025
// (the 极目新闻 interview published 2025-11-19). Nothing here is rounded up or invented.
// If a figure cannot be sourced, it is left out rather than estimated.

const TIMELINE = [
  {
    year: '2014',
    title: 'Two people and one sewing floor',
    body:
      'The company started as a husband-and-wife workshop in Wuhan, making cosplay and performance costumes for the domestic market. The founder had already spent 17 years at a sewing machine before that.',
  },
  {
    year: '2018',
    title: 'Onto 1688, and top of the category in three months',
    body:
      'The move onto 1688\u2019s B2B channel was carried by pattern-making and fabric control rather than price. Within three months the store had reached top-seller status in its category.',
  },
  {
    year: '2021',
    title: 'The year the domestic market stopped paying',
    body:
      'A price war pushed domestic margins under 5%. More than 50,000 units sat in the warehouse, wages were missed for three months, and the factory came close to shutting. This is the part most supplier pages leave out; it is also the reason the export business was built the way it was.',
  },
  {
    year: '2022',
    title: 'First export year: \u00a51.2M',
    body:
      'The store opened on Alibaba.com. Month one brought 28,131 visits and 273 inquiries; search impressions rose from 168,500 to 456,700, and high-intent inquiries reached 37.89% of the total. The year closed at \u00a51.2 million in export sales.',
  },
  {
    year: '2023',
    title: '10-piece minimums, 3-day custom runs',
    body:
      'Small-batch, fast-turn production was formalised: 10 pieces minimum and a three-day custom turnaround. A horror-themed series was designed, sampled and listed in seven days, and carried 30% of that month\u2019s sales.',
  },
  {
    year: '2025',
    title: '\u00a512M in exports, 18 people',
    body:
      'Exports reached \u00a512 million with an 18-person team. Performance and stage wear accounted for 78% of sales. The first orders from Brazil and Argentina came in during the year.',
  },
];

const CAPABILITIES = [
  {
    n: '01',
    title: 'Cutting and pattern-making are in-house',
    body:
      'Intelligent cutting equipment and a digital pattern-making system replaced the original manual setup; output per operator is roughly ten times what it was at the start. Patterns stay in-house, so a size correction does not wait on an outside vendor.',
  },
  {
    n: '02',
    title: 'Small runs are the normal case, not a favour',
    body:
      'The floor is set up for 10-piece minimums and three-day custom turnaround. That is what lets a buyer test a design before committing to a season, and it is the capability the whole export business was built on.',
  },
  {
    n: '03',
    title: 'One recent order: inquiry to dispatch in three days',
    body:
      'In October 2025 a US$2,665 order moved from first inquiry to handover to the forwarder in three days, against a seven-day industry norm. It is one data point, not a promise, but it is the kind of order this floor is organised to handle.',
  },
  {
    n: '04',
    title: 'Replies in minutes, not overnight',
    body:
      'Inquiries are answered in English and Russian around the clock, with an average first response of about 15 minutes. Orders already in production get a named contact and a fixed update rhythm rather than a shared inbox.',
  },
];

const MARKETS = [
  { region: 'Europe', share: '45% of 2025 orders', detail: 'Germany and Spain are the two largest markets.' },
  { region: 'Russia', share: '30% of 2025 orders', detail: 'Moscow buyers reorder at 65%, against a 40% category average.' },
  { region: 'South Africa', share: 'Established', detail: 'Served since the early export years.' },
  { region: 'Brazil & Argentina', share: 'New in 2025', detail: 'First orders placed during the year.' },
];

const CHECKS = [
  'Our business licence, with the registered company name and number visible.',
  'Photographs or a live video walkthrough of the floor, on request, before you place an order.',
  'The QC checklist we actually use on a run \u2014 not a generic template.',
  'The name and measurements of the sample you approved, kept on file against every reorder.',
];

export default function Factory() {
  usePageMeta();

  return (
    <>
      <section className="section">
        <div className="shell">
          <p className="eyebrow">The factory</p>
          <h1 style={{ maxWidth: '24ch' }}>
            Twelve years on one floor in Wuhan, and the year it nearly closed.
          </h1>
          <p className="lede mt-1">
            HB Coser is the export business of Wuhan Hongbo Mingchuang E-commerce Co., Ltd.,
            registered in Wuhan, Hubei. We started in 2014 as a two-person sewing workshop and now
            run an 18-person team supplying children&apos;s costumes, pet costumes and party
            material to importers, retailers and event producers. Most of what leaves the floor is
            made to order, in small runs.
          </p>
          <div className="stats mt-2">
            <div>
              <strong>2014</strong>
              <span>Year the workshop opened</span>
            </div>
            <div>
              <strong>18</strong>
              <span>People on the team</span>
            </div>
            <div>
              <strong>&yen;12M</strong>
              <span>2025 export sales</span>
            </div>
            <div>
              <strong>10</strong>
              <span>Pieces, minimum order</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--raised">
        <div className="shell">
          <div className="sec-head">
            <span className="sec-head__n">01</span>
            <div className="sec-head__body">
              <p className="eyebrow">How it got here</p>
              <h2>Six years that explain how we quote today.</h2>
            </div>
          </div>
          <div className="features">
            {TIMELINE.map((step) => (
              <div className="feature" key={step.year}>
                <span className="feature__n">{step.year}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="sec-head">
            <span className="sec-head__n">02</span>
            <div className="sec-head__body">
              <p className="eyebrow">On the floor</p>
              <h2>What the equipment and the schedule actually allow.</h2>
            </div>
          </div>
          <div className="features">
            {CAPABILITIES.map((item) => (
              <div className="feature" key={item.n}>
                <span className="feature__n">{item.n}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--raised">
        <div className="shell">
          <div className="sec-head">
            <span className="sec-head__n">03</span>
            <div className="sec-head__body">
              <p className="eyebrow">Where the goods go</p>
              <h2>Two core markets, and what each one asks for.</h2>
            </div>
          </div>
          <ul className="spec mt-2" style={{ maxWidth: '70ch' }}>
            {MARKETS.map((m) => (
              <li key={m.region}>
                <span>
                  <strong>{m.region}</strong>
                  <br />
                  {m.detail}
                </span>
                <span>{m.share}</span>
              </li>
            ))}
          </ul>
          <p className="lede mt-2">
            The two core markets buy at a different level and want different things. Performance
            wear sells at US$50&ndash;80 in both, but Eastern European buyers lean towards darker,
            heavier fabrics while Western European buyers want cleaner, simpler cuts. Development
            runs are briefed against the market the goods are going to, not against a single house
            style.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="sec-head">
            <span className="sec-head__n">04</span>
            <div className="sec-head__body">
              <p className="eyebrow">Claims and evidence</p>
              <h2>What we will show you, and what we will not claim.</h2>
            </div>
          </div>
          <p className="lede mt-1" style={{ maxWidth: '68ch' }}>
            We do not put certification logos on this site that we do not hold. If a programme
            needs a social-compliance audit or a test report before it can place an order, say so at
            the quotation stage and we will tell you plainly whether we can meet it &mdash; rather
            than discover it after the deposit.
          </p>
          <ul className="spec mt-2" style={{ maxWidth: '68ch' }}>
            {CHECKS.map((c) => (
              <li key={c}>
                <span>{c}</span>
                <span>On request</span>
              </li>
            ))}
          </ul>
          <p className="lede mt-2" style={{ maxWidth: '68ch' }}>
            The figures on this page are our own operating records for 2025, published in a
            November 2025 interview with Jimu News. They are updated once a year, not restated every
            quarter to look better.
          </p>
        </div>
      </section>

      <section className="section section--raised">
        <div className="shell">
          <div className="sec-head">
            <span className="sec-head__n">05</span>
            <div className="sec-head__body">
              <p className="eyebrow">Verification</p>
              <h2>Three ways to check us before you send money.</h2>
            </div>
          </div>
          <div className="features">
            <div className="feature">
              <span className="feature__n">01</span>
              <h3>Order a paid sample first</h3>
              <p>
                A sample is quoted and shipped like any other order. If the hand-feel, the print or
                the sizing is wrong, you find out for the price of one piece instead of a container.
              </p>
            </div>
            <div className="feature">
              <span className="feature__n">02</span>
              <h3>Ask for the licence and the floor</h3>
              <p>
                Business licence, floor photographs and a video walkthrough are sent on request to
                any buyer with a real programme behind them. We would rather answer three awkward
                questions up front than argue about a carton later.
              </p>
            </div>
            <div className="feature">
              <span className="feature__n">03</span>
              <h3>Come and stand on the floor</h3>
              <p>
                We are in Wuhan, Hubei. Visits are welcome by appointment &mdash; tell us the dates
                and we will confirm the address, the schedule and who will walk you through the
                lines.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="band">
            <div>
              <h2>Tell us what your programme needs.</h2>
              <p className="mt-1">
                Send the item, the quantity and the market. We will tell you what is stock, what has
                to be made, and when it can leave.
              </p>
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
