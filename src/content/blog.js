// Programme notes.
//
// `sources` records the topic cues an article was written from — the discussions and
// questions that prompted it. Every word of every article is original, and nothing here
// is presented as a fact about our own factory that is not true.
export const POSTS = [
  {
    slug: 'why-the-reorder-does-not-match',
    title: 'Why the reorder does not match the first shipment',
    excerpt: 'Colour is approved before the bulk is dyed, and every dye lot differs slightly. The approved swatch, the light it was judged under and a written tolerance decide whether a repeat order lands next to the first one or beside it.',
    date: '2026-10-08',
    tags: ['Sampling', 'Quality', 'Specification'],
    cover: '/products/kids-witch-cloak-set.jpg',
    sources: [
      'Merchandising guides describing the lab dip as a dyed swatch submitted for buyer colour approval before bulk dyeing, and the approval as dye-to-match (topic cue only)',
      'Sourcing guidance noting that dye lots vary slightly from batch to batch, and that inconsistent colour across reorders is a frequent buyer complaint (topic cue only)',
      'Reorder planning material advising a check of whether material, mill, construction, trim or finish changed, because an earlier approval only covers the inputs it was given (topic cue only)',
      'Colour-matching references explaining metamerism, the use of D65 artificial daylight for approval alongside a source matching the selling environment, and the numeric colour-difference tolerance that decides a pass (topic cue only)',
    ],
    body: `A repeat order arrives and the colour is close, but not the same. Nobody changed the specification, the style number is identical, and the two shipments still cannot be merchandised side by side. The cause is usually decided long before the goods are cut.

## The colour is approved before it exists

Bulk fabric is not dyed to a colour. It is dyed to something that was approved first. That something is a lab dip: a small piece of fabric dyed to the target shade and submitted for approval ahead of the bulk run, with the approval recorded as dye-to-match.

A buyer is therefore committing an order against a swatch the size of a business card. Everything that follows, across every repeat, is measured against whatever was accepted at that moment.

## Every dye lot is slightly different

Dyeing is chemistry run in batches. Each lot is mixed and processed separately, so lots vary slightly even when the recipe and the machine are unchanged. That is why two shipments of one style, made to one specification, can sit together and still read as two different colours: they were dyed in different lots.

This is the ordinary case, not the defect case. The question is not how to eliminate the variation, but how much of it the order will accept and what it is measured against.

## Your shop lighting is not the approval lighting

Colours are judged under a defined light source, commonly D65 artificial daylight, with a second source chosen to resemble the environment where the product is actually sold. The reason is metamerism: two colours can look identical under one light and visibly different under another.

A dip that matched in the viewing booth can therefore look wrong under a shop floor's warm lighting, and neither party is lying. Printed goods make the point sharper still, because print is conventionally assessed against a different reference illuminant from dyed textile, so a printed piece and a dyed piece matched to the same number are not automatically a pair.

## Tolerance is a number, not a feeling

Colour difference is measured, not argued. Instruments return a numeric value for how far a sample sits from the standard, and a pass is a threshold on that scale. Buyers often assume a pass means a visual match. It does not. A sample comfortably inside a tolerance can still look off against the first shipment once it is lit by the room it is sold in.

That makes the tolerance a commercial decision. Set it in writing, set it against the light the goods will live under, and be explicit about which scale your supplier is measuring on.

## What to settle before you commit

- **The approved swatch, retained as the standard.** A repeat order should be matched to what you accepted, not to a freshly dyed dip.
- **The light source used for approval**, named on the order, together with the lighting the product will be sold under.
- **A written tolerance**, on the measuring scale your supplier actually reports.
- **Whether anything changed on the repeat** — fabric, mill, trim, finish or decoration — because an approval only covers the inputs it was given.
- **A production shade band or bulk swatch**, so the real range is visible before the container ships.

The work here is not craftsmanship. It is specification, and it is cheap at the sampling stage and expensive in a container. The [note on what fails first in a dress-up programme](/blog/kids-dress-up-programme-what-breaks-first) takes the same approach to the parts that break rather than the colour that drifts.`,
  },

  {
    slug: 'paying-for-the-air-in-the-carton',
    title: 'You are paying for the air in the carton',
    excerpt: 'Costume and party goods are light, bulky and billed on the space they occupy rather than on what they weigh. Carton dimensions, compression and the volumetric divisor are costing decisions, so they belong on the order.',
    date: '2026-10-04',
    tags: ['Logistics', 'Packaging', 'Costing'],
    cover: '/products/kids-fantasy-dress-set.jpg',
    sources: [
      'Freight references explaining that carriers charge the greater of actual and volumetric weight, and that the divisor differs between air and courier services (topic cue only)',
      'Import guidance on billing bulky light goods on external packed dimensions, and on the cost effect of a carton only slightly oversized (topic cue only)',
      'Sea freight material on charging loose cargo on the greater of weight or measure, and on usable volume per container (topic cue only)',
      'Sourcing notes on compressing textiles, and on negotiating the volumetric basis rather than the rate (topic cue only)',
    ],
    body: `A costume that weighs a few hundred grams can still be billed as though it weighed several kilos. Nothing in the garment caused that. The carton did, because freight is priced on the space a shipment occupies as well as on its weight, and finished garments occupy a great deal of space.

## Light goods are billed on space

Carriers compare two numbers and charge the greater one: the actual gross weight, and the volumetric weight derived from the package dimensions. The volumetric figure is length times width times height, divided by a divisor that varies by service. Air freight is normally calculated on a divisor of six thousand with centimetres and kilograms, while express couriers commonly use five thousand, so a carton priced on the courier basis comes out heavier than the air standard would suggest.

The arithmetic is unforgiving. A carton measuring sixty by forty by forty centimetres holds ninety-six thousand cubic centimetres, which works out at sixteen kilos of volumetric weight on a divisor of six thousand. If the goods inside weigh two kilos, the shipment is billed on sixteen.

## Ocean freight counts the same space differently

Sea freight uses no divisor, but the logic does not change. Loose cargo is charged on the greater of weight or measure, so a low-density shipment is priced on its volume. That volume is quoted in cubic metres, and a twenty-foot container holds roughly twenty-six to twenty-eight cubic metres of usable space.

This is why a master carton specification belongs on the purchase order. A carton of half a metre by forty centimetres by twenty-eight and a half centimetres is a little over five hundredths of a cubic metre. Small differences in that number, repeated across a thousand cartons, decide whether a container closes comfortably or needs a second one.

## Compression is the lever you can pull

Textiles compress. Garments packed flat under pressure take up markedly less volume than the same garments packed loosely, and the saving lands in the freight bill rather than in a line anyone has to negotiate.

There is a limit, and it differs by product. A printed backdrop that has to travel rolled, so that it arrives without permanent creases, will cube out far faster than one that can be folded flat, so the pack that protects the print is the pack that costs the most space. That tension belongs in the same conversation as the freight figure rather than in two separate ones, and the [packing note on backdrops](/blog/backdrop-judged-by-its-creases) works through the other side of it.

## What to settle before you commit

- **Packed dimensions, measured externally after packing**, rather than the flat product size.
- **The divisor your forwarder actually uses**, because the same carton changes price between services.
- **Whether the goods can be compressed**, and how far, before the print or the trim suffers.
- **An inner pack count that fills the carton.** A carton three-quarters full is still billed as though it were full.
- **Volume in cubic metres per carton, stated on the order**, so freight can be estimated before the goods exist.

None of this changes what the product is. It changes what the product costs to move, and for bulky goods that is frequently the larger number.`,
  },

  {
    slug: 'backdrop-judged-by-its-creases',
    title: 'A backdrop is judged by its creases, not its artwork',
    excerpt: 'A backdrop is bought for its print and judged on what shipping did to it. Substrate, finish and the way it is packed decide whether it hangs flat on the first try, so the specification is really a transport decision.',
    date: '2026-10-02',
    tags: ['Party', 'Packaging', 'Quality'],
    cover: '/products/party-halloween-backdrop-set.jpg',
    sources: [
      'Buyers and set builders asking where to find a printed backdrop that survives transport without arriving wrinkled or torn (topic cue only)',
      'Print trade guidance on removing creases from polyester backdrops and storing them rolled rather than folded (topic cue only)',
      'Material comparisons describing dye-sublimated polyester as matte and glare-free under flash, against a more reflective vinyl (topic cue only)',
    ],
    body: `A backdrop is bought for its print and judged on what shipping did to it. The artwork rarely
starts the complaint. The creases do, on the first day, in front of the people who ordered it.

## Creases are a packing decision, not a printing one

Polyester backdrop fabric creases when it is folded and stored that way. Fold a printed backdrop
for long enough and the fold lines stop being temporary. Printers who handle these goods advise
storing them rolled loosely around a sturdy tube, with the ends secured, because folding is what
creates permanent lines.

That makes the carton a specification item. A backdrop shipped rolled arrives hanging flat within
hours of being hung under tension. The same fabric shipped folded arrives needing a steamer, and
the person who has to steam it is your customer. Creases are recoverable, since hanging under
tension and moisture both work, but recovery is unpaid labour and it is the first thing a buyer
remembers about the order.

## The substrate decides how it photographs

Most printed backdrops are polyester printed by dye sublimation, where the ink is infused into the
fibres rather than sitting on the surface. The result is a soft, matte face with almost no glare,
which matters when the backdrop stands behind people who are being photographed with flash or lit
by stage lights. Matte also avoids the hotspots that make an otherwise good print look cheap in a
photograph.

Vinyl behaves differently. It is a waterproof PVC, better suited to outdoor use where wind and
ultraviolet light are the real risks, and it can be printed on both sides. Even in a matte finish
vinyl stays more reflective than dye-sublimated polyester, so the two are not interchangeable
simply because both accept a photograph.

## The finish decides whether it hangs flat

A backdrop needs a way to attach to something, and the options are not equivalent:

- A pole pocket, a sleeve sewn along one edge to take a rod or a pipe
- Grommets, metal eyelets set into a reinforced edge
- A reinforced hem, which stops a weighted edge from tearing out
- Hook-and-loop strips, where the backdrop meets the frame

The pocket is where buyers lose usable print. Fabric folded back to make the sleeve is fabric that
no longer shows artwork, so the printable area of a nominal size is smaller than the number on the
order. Ask for the finished image area rather than the nominal size, and for a hanging method that
matches the frame the venue actually owns.

## What to settle before you commit

- **Substrate and finish by where it will hang**, indoors under flash or outdoors in wind.
- **Packed rolled on a tube**, with the tube written into the specification rather than left to
  whoever packs the carton.
- **Care and storage guidance printed on the pack**, because the customer stores it between events.
- **The finished image area**, measured after the pocket has been taken.
- **One sample hung under tension for a day**, which answers the crease question in a way a flat
  photograph never will.

None of this is exotic, and none of it is the artwork. It is the difference between a backdrop that
goes back in its bag and one that goes into a bin. The [party range](/shop/party) shows how the
pieces are specified across a full programme.`,
  },

  {
    slug: 'balloon-kit-perishable-specification',
    title: 'A balloon kit is perishable - specify it that way',
    excerpt: 'A balloon garland reads as a durable prop and behaves like a perishable good. Latex loses lift in a day, oxidises in light and carries a shelf life, so the specification is a sell-by decision.',
    date: '2026-10-01',
    tags: ['Party', 'Specification', 'Packaging'],
    cover: '/products/party-balloon-arch-73pc.jpg',
    sources: [
      'Party businesses comparing how long latex and foil balloons actually hold their lift (topic cue only)',
      'Decorators describing latex balloons going dull and cloudy after inflating them early (topic cue only)',
      'Distributor guidance on storing latex balloons away from light and heat, and the shelf life that follows (topic cue only)',
    ],
    body: `A balloon garland is bought like a prop and it behaves like a perishable good. It carries a lift
expectation, a shelf life, and a finish that changes once air touches it. Buyers who treat the kit
as a durable decoration tend to discover all three at once, in front of a customer.

## The promise you are actually selling is lift

Latex balloons lose their lift quickly. Helium molecules are small enough to diffuse straight
through the wall of the balloon, so latex filled for an event is a same-day product rather than a
same-week one. Foil balloons are made from a non-porous material and hold their lift far longer.

That difference decides what a kit can honestly be sold as. A garland that hangs indoors for an
afternoon is a straightforward proposition. The same garland sold as a week-long display is not,
and the complaint arrives after the customer has already hung it.

## Latex has a date on it

Latex is harvested from rubber trees, which is why the material ages. Uninflated stock has a shelf
life, and storage decides how much of it survives to the day it is used: away from direct sunlight
and fluorescent light, away from heat, and at a steady room temperature of roughly 20 to 22
degrees C.

Inflation starts a second clock. Once a balloon is filled it begins to oxidise, and the visible
result is a finish that goes from glossy to cloudy. Ultraviolet light accelerates that and also
makes the film more brittle. A garland that looked right in a photograph can still read as tired by
its second day.

## What is actually inside the kit

A garland kit is a size mix plus hardware, and the mix is where two kits at the same piece count
diverge:

- Balloon sizes, usually a small and a large working together, such as 5 inch with 11 or 12 inch
- The colour and finish count, because matte, pearl and confetti finishes do not read the same
- The garland strip, a plastic tape with holes that the balloon necks are pushed through
- Adhesive dots, ribbon, and any foil or confetti accents

The strip is the quiet failure point. A short strip, or one whose holes tear when a balloon is
pulled through, ends the kit's life before the balloons do.

## What to settle before you commit

- **The lift expectation, in writing.** Same-day indoor use and multi-day display are different
  products with different balloons in them.
- **The size and finish mix by count**, not by total pieces, so a reorder matches the first run.
- **The strip by length and hole count**, and whether it survives a whole garland being assembled.
- **Light-blocking packaging**, with storage guidance printed on it, because the shelf life
  belongs with whoever stores the stock.
- **One inflation test.** Fill a sample and leave it standing for two days. That answers more than a
  photograph does.

None of this is exotic. It is the difference between a kit that sells as a decoration and one that
comes back as a complaint. The [party range](/shop/party) shows how the components are specified
across a full programme.`,
  },

  {
    slug: 'who-signs-the-childrens-product-certificate',
    title: "Who actually signs the children's product certificate",
    excerpt: "The certificate that clears a children's product at the border is issued by the importer, not the factory. What that changes about your next dress-up order, and the filing rule that took effect this year.",
    date: '2026-09-30',
    tags: ['Kids', 'Compliance', 'Sourcing'],
    cover: '/products/kids-officer-uniform.jpg',
    sources: [
      "Importers repeatedly asking who signs the children's product certificate (topic cue only)",
      "Buyer questions about selling a children's product before certification is complete (topic cue only)",
      'Regulator guidance describing the testing and certification duties of the importer (topic cue only)',
    ],
    body: `A children's product that is subject to a safety rule cannot legally enter the United States
without a certificate of compliance. Buyers routinely assume the factory writes one and drops it
into the shipping documents. It does not work that way, and the misunderstanding usually surfaces
at the worst moment: at the border, with a container already on the water.

## The certificate has to come from you

The duty to draft and issue the certificate sits with the domestic manufacturer or the importer.
A third-party laboratory supplies the test results; it does not issue the certificate. Those are
two separate documents from two separate parties.

This matters because a certificate issued by a factory overseas does not by itself discharge the
importer's obligation. The rules do let an importer build a certificate on another party's
testing, but only while exercising due care: you have to be satisfied the results are valid, and
you have to be able to obtain the underlying test reports and the test plan behind them. A scanned
certificate with no reports attached is not that.

## What has to be on it

Seven elements, and a missing one is a defect:

- A description precise enough to match the certificate to that product and no other
- A citation to each children's product safety rule the item is certified against
- The name, full mailing address and telephone number of the firm certifying
- Contact details for the person who holds the test records
- The month and year of manufacture, plus the city and country of final assembly
- The dates and places of testing
- The name, address and telephone number of the accepted laboratory

Where a rule carries an exemption, the item may not need testing, but it still needs a certificate
that says so and names the exemption it relies on.

## What changed this year

Since July 2026, importers of most regulated consumer products have to file certificates of
compliance electronically with US Customs and Border Protection ahead of entry, through a
government-agency message set. A certificate that exists only as a PDF in somebody's inbox no
longer clears the entry on its own.

## What to ask before you commit

- **Which safety rules apply** to this exact item and age grade, in writing, before the order is
  confirmed.
- **Who holds the test reports**, and whether you can have them alongside the certificate rather
  than after it.
- **Whether lot identifiers will be recorded**, so one certificate can cover repeated production
  instead of being rewritten every shipment.
- **Who the importer of record is.** That party is the certifier, whatever the invoice implies.

These questions cost nothing to settle before the goods are cut and a great deal afterwards. The
useful part a supplier can play is narrower and more practical: holding the test reports, keeping
the lot identifiers straight, and answering them without a week of delay. The
[kids range](/shop/kids) shows the styles we build for wholesale and OEM programmes.`,
  },

  {
    slug: 'kids-dress-up-programme-what-breaks-first',
    title: "What breaks first in a children's dress-up programme",
    excerpt:
      'Children\'s costumes fail in three predictable places. Knowing which one you are buying for decides the specification — and the reorder rate.',
    date: '2026-09-26',
    tags: ['Kids', 'Quality', 'Sourcing'],
    cover: '/products/kids-firefighter-set.jpg',
    sources: [
      'Parent complaints about dress-up costumes losing shape after a few wears (topic cue only)',
      'Buyer threads on returns rates in childrenswear and dress-up ranges (topic cue only)',
      'Discussion of age grading and mandatory labelling for childrenswear (topic cue only)',
    ],
    body: `A children's dress-up programme is not judged on the first wear. It is judged on the tenth,
after the costume has been through a wash, a birthday party and a dressing-up box.

Three things fail first, and they fail in a predictable order.

## 1. The closure, not the fabric

Zip pulls snap, hook-and-loop loses its grab, and elastic goes slack. These are the cheapest parts
of the garment and the first to end a costume's life, because a child cannot dress themselves once
the closure stops working — and a parent who has to help every time stops buying.

If you are specifying a dress-up line, **spend the money on the closure before the print.** A
heavier-gauge zip or a wider hook-and-loop tape costs cents per unit and decides whether the
product survives to be recommended.

## 2. The shoulder and the seat

In childrenswear the highest-stress seams are the shoulder (pulled when the costume is yanked on
over the head) and the seat (sat on, dragged, and knelt on). A costume can look identical to a
better-built one on a hanger and split at the shoulder on the third wear.

This is where a size chart built from real measurements beats a generic block. If the garment is
graded from an adult pattern scaled down, the shoulder width will be wrong across the whole run,
and no amount of inspection catches it — because the garment is not defective, it is mis-graded.

> A size chart is not paperwork. It is the part of the specification that decides your returns rate.

## 3. Anything that sheds, snaps or is swallowed

Trims, beads, feathers and anything that can be pulled off by a determined four-year-old are a
compliance question before they are an aesthetic one. Age grading and mandatory warnings for
childrenswear differ by market, and the run has to carry the right ones for where it is going.

Ask early, not after the carton lands. Changing a label or adding a warning after the goods are
packed is a rework cost; deciding it before cutting is free.

## What this means when you order

- **Decide the market first.** It sets the labelling, the age grading and often the trim list.
- **Ask what the closure is.** If the answer is vague, that is the answer.
- **Get the size chart in writing** and check the shoulder and seat measurements, not the chest.
- **Sample the wash.** One wash cycle tells you more about a dress-up costume than an inspection
  report does.

None of this is exotic. It is the difference between a line that gets reordered every season and
one that gets marked down in January.`,
  },
  {
    slug: 'sizing-pet-costumes-for-retail',
    title: 'Sizing pet costumes for a retail wall',
    excerpt:
      'Pet sizing is not small, medium and large. It is girth, length and neck — and getting it wrong is the most common reason a pet range comes back off the shelf.',
    date: '2026-09-22',
    tags: ['Pets', 'Sizing', 'Retail'],
    cover: '/products/pets-tiger-fleece.jpg',
    sources: [
      'Pet-owner complaints about costume fit and returns (topic cue only)',
      'Retail discussion of pet apparel sizing inconsistency between suppliers (topic cue only)',
      'Breed and girth measurement conventions used in pet apparel (topic cue only)',
    ],
    body: `A pet costume is bought by a human who cannot try it on. That single fact decides how the
range has to be specified.

## The three measurements that matter

Weight is a marketing number. The three that actually decide fit are:

- **Girth** — around the chest, just behind the front legs. This is the primary measurement, and
  the one most ranges get wrong.
- **Length** — from the base of the neck to the base of the tail, along the back.
- **Neck** — around the neck where a collar sits.

A 6 kg poodle and a 6 kg bulldog are not the same customer. One is long and narrow, the other is
deep and broad, and a costume sized on weight alone will fit neither properly.

## Breed proxies are useful, up to a point

Most buyers group the wall by rough size bands. Breed examples are the fastest way to communicate
those bands to a shopper — "fits most terriers and similar" tells a parent more than "size M" does.

The trap is treating breed as a specification. It is a merchandising label. The specification is
still girth, length and neck, and it should be published on the product page, not left to the
shopper's guess.

## What to fix in the specification

- **Grade by girth first,** then adjust length and neck within the band.
- **Publish girth ranges** on the hangtag. Shoppers measure girth with a tape measure at home;
  they do not measure anything else as reliably.
- **Elasticity is a fit decision, not a cost decision.** A costume with enough give in the girth
  covers two adjacent bands and cuts returns sharply.
- **Separate the patterns for cats.** A cat is not a small dog. The leg openings and the belly
  panel have to be cut differently, and a dog pattern scaled down will fail on a cat.

> The cheapest return to avoid is the one caused by a size chart the shopper could not read.

## On the wall

For a retail wall, the practical rule is to keep the number of bands small enough that a shopper
can pick confidently and wide enough that most pets fall inside one of them. Three or four bands
covering the realistic size distribution will outsell a longer ladder of narrower sizes, because
the shopper who is unsure buys nothing.

Whatever the ladder is, it has to stay stable across reorders. A supplier who shifts the boundary
of "medium" between two runs turns a reorder into a return.`,
  },
  {
    slug: 'photo-booth-kit-that-survives-a-season',
    title: 'Building a photo-booth kit that survives a season',
    excerpt:
      'Photo-booth props are a consumable that buyers expect to reuse. The specification that decides whether they do is unglamorous: board weight, stick fixing and finish.',
    date: '2026-09-17',
    tags: ['Party', 'Events', 'Specification'],
    cover: '/products/party-circus-photobooth.jpg',
    sources: [
      'Event-producer complaints about props delaminating and snapping (topic cue only)',
      'Discussion of rental-versus-disposable expectations for event props (topic cue only)',
      'Buyer threads on packaging kits so they survive transport and reuse (topic cue only)',
    ],
    body: `A photo-booth kit is sold as reusable and used as a consumable. The gap between those two
expectations is where the complaints come from.

## Board weight decides the season

The single biggest variable is the stock the props are cut from. Thinner board prints beautifully
and photographs identically on day one. It also delaminates the first time a guest grips it with
warm hands, and it curls the moment it sees humidity.

For anything intended to be used more than once, the print is worth less than the board under it.
Two things to pin down before quoting:

- **Board weight**, in gsm, and whether it is laminated on both faces. A single-face laminate curls.
- **Corner treatment.** Square corners fold and tear; radiused corners survive being stacked back
  into a box by someone in a hurry.

## The stick is where kits fail

Guests hold props by the stick, and the stick is a joint. Glue that is adequate in a mild room
fails after an hour in a warm venue.

If the kit is going to be reused, ask how the stick is fixed and whether the fixing has been tested
warm. A taped adhesive strip is a different product from a mechanically fixed or sandwiched stick,
and the price difference is small relative to the difference in how the second event goes.

> A prop that snaps is remembered. It is remembered at the venue, by the person who hired the kit.

## Packing for the second use

How a kit is packed decides whether it survives transport back from the event:

- **Flat, in a divided box**, beats a bag. Bags bend the corners that radiused cutting just saved.
- **A printed contents card** costs very little and is the difference between a kit being repacked
  tidily and a kit coming back as a pile.
- **A reusable outer** — a printed box rather than a polybag — turns the delivery packaging into
  part of the product the buyer hired.

## What to specify, in one line

Board weight with double-face lamination, radiused corners, a warm-tested stick fixing, and a
divided box. None of it is expensive. All of it is invisible in a product photo, which is exactly
why it has to be written into the specification instead.`,
  },
  {
    slug: 'when-to-place-a-halloween-order',
    title: 'When to place a Halloween order',
    excerpt:
      'Halloween is the most compressed season in the calendar, and the buyers who lose money are the ones who treat it like a normal lead time.',
    date: '2026-09-10',
    tags: ['Planning', 'Seasonality', 'Sourcing'],
    cover: '/products/party-balloon-arch-halloween.jpg',
    sources: [
      'Retail discussion of Halloween sell-through windows and markdown timing (topic cue only)',
      'Supplier-discussion of factory congestion in the run-up to Q4 (topic cue only)',
      'Discussion of container and freight congestion around peak season (topic cue only)',
    ],
    body: `Halloween has the narrowest sell-through window of any season on the calendar, and the
longest supply chain. Those two facts together decide when an order has to be placed.

## The window is shorter than the season

The commercial season is not the month of October. Most sell-through happens in a compressed
window before it, and after that the goods are marked down — which means a late arrival is not a
late sale, it is a discount.

Work backwards from the shelf date rather than forwards from today. The chain is:

- sea transit, plus any inland leg
- customs clearance at origin and destination
- final inspection and packing
- bulk production
- sample production, shipping and sign-off

Every one of those steps can absorb a week without anyone making a mistake.

## Q4 congestion is structural, not bad luck

From roughly late summer onwards, factories that serve multiple seasonal categories are competing
for the same lines, and freight capacity tightens with them. A lead time that held comfortably in
spring is not the same lead time in September, even from the same supplier.

The practical consequence is that **sampling is the step buyers most often delay and can least
afford to.** A sample that slips two weeks in spring is recoverable. A sample that slips two weeks
in the middle of the pre-season crush takes the whole run with it.

> Order the sample as though it were the production slot, because in a compressed season it is.

## What to do differently for a seasonal line

- **Approve the sample a season ahead** for anything recurring, so the next year's run starts from
  an approved reference rather than a new sample cycle.
- **Book capacity, not just price.** A confirmed slot is worth more than a marginally better unit
  price that has no slot behind it.
- **Split the shipment** if part of the range is more time-critical. Getting the lead SKUs onto the
  floor early beats waiting for a complete order.
- **Decide the markdown plan before the order is placed.** Knowing your exit price changes what you
  are prepared to pay for speed.

## The uncomfortable arithmetic

A seasonal line that arrives on time at a slightly higher unit cost makes money. The same line
arriving three weeks late at a better unit cost usually does not, because the discount it needs to
clear is larger than the saving.

That is the whole case for treating a seasonal calendar as a specification, exactly like colour or
sizing.`,
  },
];

export const sortedPosts = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPost(slug) {
  return POSTS.find((p) => p.slug === slug) || null;
}

export function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${d} ${months[m - 1]} ${y}`;
}
