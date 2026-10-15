import { definePage } from '../../lib/page-types';
import { cash, list, nadac, mfp, BR, $en } from './_util';

export default definePage({
  id: 'ozempic-vs-wegovy-cost', group: 'compare', order: 33,
  tool: { kind: 'compare', a: 'ozempic', b: 'wegovy', doseA: '1', doseB: '2.4' },
  related: ['ozempic-cost', 'wegovy-cost', 'does-medicare-cover-wegovy', 'medicare-negotiated-prices', 'glp-1-savings-card'],
  sources: ['novocareOzempic', 'novocareWegovy', 'trumprx', 'nadac', 'cmsNegotiation'],
  en: {
    slug: 'ozempic-vs-wegovy-cost', nav: 'Ozempic vs Wegovy cost', card: 'Same molecule, two products: why their prices and coverage differ',
    title: 'Ozempic vs Wegovy Cost 2026: Same Molecule, Different Price',
    description: `Ozempic vs Wegovy cost in 2026: both semaglutide, ${$en(cash('ozempic', '1'))} a month in cash for each up to 1 mg, list prices of ${$en(list('ozempic', '1'))} and ${$en(list('wegovy', '2.4'))}, and different Medicare routes.`,
    h1: 'Ozempic vs Wegovy: one molecule, two prices, two coverage rules',
    intro: (h) => `Ozempic and Wegovy are both semaglutide; in cash they cost the same ${h.usd(cash('ozempic', '1'))} a month at most doses, yet their list prices are ${h.usd(list('wegovy', '2.4') - list('ozempic', '1'))} apart.`,
    resume: (h) => `Ozempic and Wegovy contain the same active substance, semaglutide, in weekly injections made by Novo Nordisk, and the question of why one would cost more than the other comes up constantly. In the self-pay channel they now cost the same: ${h.usd(cash('ozempic', '1'))} a month for Ozempic 0.25 to 1 mg and for Wegovy 0.25 to 2.4 mg, through NovoCare Pharmacy or TrumpRx. The differences sit at the top doses, ${h.usd(cash('ozempic', '2'))} for Ozempic 2 mg and ${h.usd(cash('wegovy', '7.2'))} for Wegovy HD 7.2 mg, and in the list prices, ${h.usd(list('ozempic', '1'))} for an Ozempic pen against ${h.usd(list('wegovy', '2.4'))} for a box of Wegovy pens. What separates them most is coverage. Ozempic is a diabetes drug that Part D and most employer plans cover; Wegovy is approved for weight reduction, which Part D excludes, and covered by Medicare only for heart risk, MASH or through the ${h.usd(BR.copay)} GLP-1 Bridge. From 2027 Medicare pays the same negotiated ${h.usd(mfp('ozempic', 2027))} for both.`,
    body: (h) => `
<h2>Price by price</h2>
${h.table(['Price', 'Ozempic', 'Wegovy'], [['Self-pay, usual doses', h.usd(cash('ozempic', '1')), h.usd(cash('wegovy', '2.4'))], ['Self-pay, top dose', `${h.usd(cash('ozempic', '2'))} (2 mg)`, `${h.usd(cash('wegovy', '7.2'))} (7.2 mg HD)`], ['New patient, first two fills', h.usd(h.M.P.makerOffers.novoIntro.price), h.usd(h.M.P.makerOffers.novoIntro.price)], ['List price a month', h.usd(list('ozempic', '1')), h.usd(list('wegovy', '2.4'))], ['Pharmacy cost (NADAC)', h.usd(nadac('ozempic', '1')), h.usd(nadac('wegovy', '2.4'))], ['Medicare 2027 negotiated', h.usd(mfp('ozempic', 2027)), h.usd(mfp('wegovy', 2027))], ['Medicare GLP-1 Bridge', 'not included', h.usd(BR.copay)]], 'Ozempic 1 mg pen; Wegovy 2.4 mg, four pens.', ['l', 'r', 'r'])}
<h2>Why the list prices differ</h2>
<p>A list price is set per product, not per molecule, and Novo Nordisk does not publish its reasons. What can be read in the data is the packaging: an Ozempic month is one multi-dose pen, a Wegovy month is four single-dose pens. None of this changes the price a cash payer sees today, which Novo Nordisk aligned at ${h.usd(cash('wegovy', '1'))} for the common doses.</p>
<h2>Why coverage differs, and why it matters more</h2>
<p>Insurers pay for the use on the label. Ozempic prescribed for type 2 diabetes is covered by Part D and most employer plans, with the Novo Nordisk savings card available to commercially insured patients. Ozempic prescribed only for weight loss is off-label, and plans routinely deny it; Medicare cannot cover it. Wegovy for weight reduction is excluded from Part D by law, but it is in the Medicare GLP-1 Bridge and is covered by Part D for its heart and liver indications. In 2027 the two share Medicare’s negotiated price, because CMS negotiated semaglutide as a single drug across Ozempic, Rybelsus and Wegovy.</p>`,
    faqs: (h) => [
      { q: 'Why is Wegovy more expensive than Ozempic?', a: `Only its list price is higher: ${h.usd(list('wegovy', '2.4'))} against ${h.usd(list('ozempic', '1'))}. In cash through NovoCare Pharmacy or TrumpRx both cost ${h.usd(cash('wegovy', '2.4'))} a month at their usual doses; only Ozempic 2 mg and Wegovy HD cost more. The list price matters mostly to uninsured buyers without a program.` },
      { q: 'Can I get Ozempic instead of Wegovy to save money?', a: 'The cash price is the same at usual doses, so there is little to save, and the two products are prescribed for different conditions. Insurers and Medicare cover by indication: Ozempic for diabetes, Wegovy for weight reduction, heart risk or MASH. The choice is your prescriber’s.' },
      { q: 'Do Ozempic and Wegovy have the same Medicare price in 2027?', a: `Yes. CMS negotiated semaglutide as one drug, and from January 1, 2027 Part D plans pay ${h.usd(mfp('ozempic', 2027))} for 30 days of Ozempic, Wegovy or Rybelsus, for the uses Part D covers. Wegovy for weight loss alone remains outside Part D.` },
    ],
  },
});
