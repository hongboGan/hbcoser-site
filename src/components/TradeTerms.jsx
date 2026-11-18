import { TRADE_TERMS } from '../data/trade-terms.js';
import './trade-terms.css';

export default function TradeTerms({ compact = false }) {
  if (compact) return <p className="trade-summary">{TRADE_TERMS.order} {TRADE_TERMS.price}</p>;
  return (
    <section className="trade-terms" aria-label="Ordering, samples and delivery terms">
      <h2>Ordering, samples and delivery</h2>
      <dl className="trade-terms__grid">
        {[
          ['Minimum order & prices', `${TRADE_TERMS.order} ${TRADE_TERMS.price}`],
          ['Stock orders & samples', `${TRADE_TERMS.stock} ${TRADE_TERMS.stockSample}`],
          ['Custom production', `${TRADE_TERMS.light} ${TRADE_TERMS.sample} ${TRADE_TERMS.bulk}`],
          ['Fabric', TRADE_TERMS.fabric],
          ['Packing', TRADE_TERMS.packaging],
          ['Ecommerce labelling', TRADE_TERMS.labelling],
        ].map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}
      </dl>
      <p className="trade-terms__note">{TRADE_TERMS.timing}</p>
    </section>
  );
}
