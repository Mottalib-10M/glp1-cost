import { definePage } from '../../lib/page-types';
import { cash, list, nadac, mfp, PD, partD, nadacAsOf, asOf, $en } from './_util';
import { product } from '../../lib/engine/index';

const FX = product('farxiga');

export default definePage({
  id: 'farxiga-cost', group: 'other', order: 23,
  tool: { kind: 'calc', product: 'farxiga', dose: '10', lock: true },
  related: ['jardiance-cost', 'trumprx-prices', 'medicare-negotiated-prices', 'januvia-cost', 'medicare-part-d-cap'],
  sources: ['trumprx', 'cmsNegotiation', 'cmsFactSheet2026', 'nadac', 'medicarePartDCosts'],
  en: {
    slug: 'farxiga-cost', nav: 'Farxiga cost', card: 'Farxiga: $35 TrumpRx cash price against the Medicare negotiated price',
    title: `Farxiga Cost 2026: ${$en(cash('farxiga', '10'))} on TrumpRx, Medicare ${$en(mfp('farxiga', 2026))} Price`,
    description: `Farxiga cost in 2026: ${$en(cash('farxiga', '10'))} for 30 tablets on TrumpRx, a ${$en(list('farxiga', '10'))} list price, Medicare’s negotiated price for 30 days and your Part D share in 2026 and 2027.`,
    h1: 'Farxiga cost in 2026: a cash price below Medicare’s',
    intro: (h) => `Through TrumpRx, 30 Farxiga tablets cost ${h.usd(cash('farxiga', '10'), 2)}, five times less than the ${h.usd(mfp('farxiga', 2026), 2)} Medicare negotiated for 2026.`,
    resume: (h) => `Farxiga (dapagliflozin), AstraZeneca’s once-daily tablet for type 2 diabetes, heart failure and chronic kidney disease, is the clearest case of a cash price beating Medicare’s. TrumpRx lists 30 tablets of 5 or 10 mg at ${h.usd(cash('farxiga', '10'), 2)}, against a list price of ${h.usd(list('farxiga', '10'), 2)} on the same page and a Medicare negotiated price of ${h.usd(mfp('farxiga', 2026), 2)} for 30 days in 2026, rising to ${h.usd(mfp('farxiga', 2027), 2)} in 2027. Pharmacies pay about ${h.usd(nadac('farxiga', '10'))} for 30 tablets according to the NADAC survey. On the standard Part D benefit, a year of Farxiga costs about ${h.usd(partD('farxiga', '10', 2026))} in 2026, more than ${h.usd(12 * cash('farxiga', '10'))} for twelve TrumpRx fills. The catch for Medicare enrollees is that a cash purchase stays outside the plan: it does not count toward the deductible or the yearly cap, and the TrumpRx terms ask you not to claim it from your plan.`,
    body: (h) => `
<h2>Price by strength and channel</h2>
${h.table(['Tablet', 'TrumpRx, 30 tablets', 'List price', 'Pharmacy cost (NADAC)', 'Medicare 2026', 'Medicare 2027'], FX.doses.map((d) => [d.label, h.usd(cash('farxiga', d.id), 2), h.usd(list('farxiga', d.id), 2), h.usd(nadac('farxiga', d.id)), h.usd(mfp('farxiga', 2026), 2), h.usd(mfp('farxiga', 2027), 2)]), `Farxiga. TrumpRx read on ${h.date(asOf())}; NADAC file of ${h.date(nadacAsOf())}.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>When paying cash makes sense on Medicare</h2>
<p>Under the standard benefit, the first ${h.usd(PD(2026).deductible)} of covered drugs each year comes out of your pocket. If Farxiga is your only Part D drug, those first months cost you ${h.usd(mfp('farxiga', 2026), 2)} each at the negotiated price, against ${h.usd(cash('farxiga', '10'), 2)} cash. If you also take expensive drugs that will push you to the ${h.usd(PD(2026).oopCap)} cap anyway, buying Farxiga through the plan helps you get there, after which it is free. The calculator shows both lines; the decision depends on your other prescriptions, and a pharmacist can run both prices.</p>
<h2>Generic dapagliflozin</h2>
<p>TrumpRx also lists generic dapagliflozin and dapagliflozin with metformin; the ${h.a('trumprx-prices', 'TrumpRx price list')} lets you search them. A generic is substituted only when your prescriber and pharmacist allow it.</p>`,
    faqs: (h) => [
      { q: 'How much is Farxiga without insurance?', a: `${h.usd(cash('farxiga', '10'), 2)} for 30 tablets of 5 or 10 mg with the TrumpRx coupon at a participating pharmacy. The list price shown on TrumpRx is ${h.usd(list('farxiga', '10'), 2)}, and pharmacies pay about ${h.usd(nadac('farxiga', '10'))}. That makes it one of the lowest-priced brand drugs listed on TrumpRx.` },
      { q: 'What is Medicare’s negotiated price for Farxiga?', a: `${h.usd(mfp('farxiga', 2026), 2)} for a 30-day supply in 2026 and ${h.usd(mfp('farxiga', 2027), 2)} in 2027 after inflation adjustment. Your share on the standard Part D benefit is the deductible, then 25% of that price. The negotiated price is not available to cash buyers, who use the TrumpRx price instead.` },
      { q: 'Is it better to pay cash for Farxiga if I have Medicare?', a: `It can cost less month to month, ${h.usd(cash('farxiga', '10'), 2)} against your coinsurance or copay, but cash purchases do not count toward the Part D deductible or the ${h.usd(PD(2026).oopCap)} cap. If your other drugs reach the cap, paying through the plan may come out cheaper over the year.` },
    ],
  },
});
