import { definePage } from '../../lib/page-types';
import { cash, nadac, list, nadacAsOf } from './_util';
import { PRODUCTS, nadacMonth, cashPrice, listPrice } from '../../lib/engine/index';

export default definePage({
  id: 'nadac-pharmacy-cost', group: 'guides', order: 65,
  mini: 'nadacCost',
  related: ['rybelsus-cost', 'eliquis-cost', 'glp-1-price-comparison', 'trumprx-prices', 'wegovy-cost'],
  sources: ['nadac', 'trumprx', 'cmsNegotiation'],
  en: {
    slug: 'nadac-pharmacy-cost', nav: 'What pharmacies pay (NADAC)', card: 'The federal survey of pharmacy invoices, and why it explains the counter price',
    title: 'NADAC Drug Prices 2026: What Pharmacies Pay for GLP-1s',
    description: 'NADAC drug prices in 2026: what retail pharmacies pay for Ozempic, Wegovy, Zepbound and other costly drugs, from the weekly CMS survey, against list prices.',
    h1: 'What pharmacies pay for GLP-1s: the NADAC survey explained',
    intro: (h) => `A pharmacy pays about ${h.usd(nadac('wegovy', '2.4'))} for a box of Wegovy 2.4 mg, according to the federal NADAC survey of ${h.date(nadacAsOf())}; the self-pay price is ${h.usd(cash('wegovy', '2.4'))}.`,
    resume: (h) => `NADAC, the National Average Drug Acquisition Cost, is a weekly CMS survey of what retail pharmacies pay their wholesalers, built from invoices that a sample of pharmacies submits each month and published per unit, per tablet or per milliliter, for nearly every drug on the market. States use it to reimburse Medicaid pharmacies, and it is the best public answer to a question uninsured buyers ask at the counter: why does the pharmacy want so much more than the price I saw online? For GLP-1s the answer is plain. The pharmacy pays about ${h.usd(nadac('wegovy', '2.4'))} for a box of Wegovy 2.4 mg and ${h.usd(nadac('ozempic', '1'))} for an Ozempic pen, close to their list prices of ${h.usd(list('wegovy', '2.4'))} and ${h.usd(list('ozempic', '1'))}. It cannot sell below that without losing money, so a plain cash claim starts there. The self-pay prices of ${h.usd(cash('wegovy', '2.4'))} and ${h.usd(cash('ozempic', '1'))} exist only because the manufacturer makes up the difference through its program or the TrumpRx coupon.`,
    body: (h) => `
<h2>Pharmacy cost of each drug, per month</h2>
${h.table(['Drug and dose', 'NADAC per unit', 'Pharmacy cost a month', 'List price', 'Self-pay'], PRODUCTS.map((p) => { const d = p.doses.find((x) => x.id === p.defaultDose)!; const n = nadacMonth(d); return n ? [`${p.name} ${d.label}`, `${h.usd(n.perUnit, 2)} / ${n.unit === 'ML' ? 'mL' : 'tablet'}`, h.usd(n.monthly), listPrice(d) ? h.usd(listPrice(d)!) : '–', cashPrice(p, d, 2026) ? h.usd(cashPrice(p, d, 2026)!.monthly) : 'none'] : null; }).filter((r): r is string[] => !!r), `NADAC file of ${h.date(nadacAsOf())} (CMS, data.medicaid.gov).`, ['l', 'r', 'r', 'r', 'r'])}
<h2>How a month is counted</h2>
<p>NADAC is per unit, so we multiply by what makes a month: one 3 mL Ozempic pen, four Wegovy pens of 0.5 or 0.75 mL, four Mounjaro or Trulicity pens of 0.5 mL, one 2.4 mL Zepbound KwikPen, 30 tablets for once-daily pills and 60 for Eliquis and Entresto, taken twice a day. Those are the quantities the makers and TrumpRx use to define a month.</p>
<h2>What NADAC is not</h2>
<p>It is not a price you can pay. The counter price adds the pharmacy’s margin and a dispensing fee, and insurers negotiate their own reimbursement. It is also an average across pharmacies and a few weeks behind: the file is weekly, prices are updated when the survey shows a change, and the effective date of each figure is published. The NADAC Comparison file on the same site shows which prices moved each week.</p>
<h2>Why we show it</h2>
<p>Three reasons. It is current, official and neutral, unlike coupon-site “typical cash prices” that depend on a sign-up. It is the only public figure for drugs without any self-pay offer, such as Rybelsus, Eliquis, Jardiance or the Zepbound single-dose pen. And it shows how far a self-pay price sits below what the supply chain charges, which tells you how much depends on the manufacturer keeping that program open.</p>
<h2>Reading a NADAC line yourself</h2>
<p>On data.medicaid.gov, each NADAC row gives a drug description, its NDC, the price per unit, the pricing unit, the effective date and the date of the file. For a pen sold by the milliliter, multiply by the volume of the pen; for tablets, by the number in the bottle. A price unchanged for weeks keeps its old effective date even in the newest file. Brand drugs carry a classification flag that tells a state whether to price them as brands or generics.</p>
<h2>NADAC and the GLP-1 price cuts</h2>
<p>When manufacturers cut self-pay prices, NADAC does not move, because pharmacies still buy from wholesalers at prices tied to the list price. That gap, close to a thousand dollars a month for Wegovy, is what the makers’ programs absorb, and it is why a pharmacy that runs a plain cash claim instead of the program will quote a price near NADAC.</p>`,
    faqs: (h) => [
      { q: 'What is NADAC?', a: 'The National Average Drug Acquisition Cost is a weekly CMS survey of the prices retail pharmacies pay for drugs, based on invoices from a sample of pharmacies. It is published per unit on data.medicaid.gov and used by states to pay Medicaid pharmacies.' },
      { q: 'How much does a pharmacy pay for Ozempic?', a: `About ${h.usd(nadac('ozempic', '1'))} for a pen of 1 mg doses, according to the NADAC file of ${h.date(nadacAsOf())}. That is close to the ${h.usd(list('ozempic', '1'))} list price and far above the ${h.usd(cash('ozempic', '1'))} self-pay price, which the manufacturer funds through its program.` },
      { q: 'Can I buy a drug at the NADAC price?', a: 'No. NADAC is what the pharmacy pays its wholesaler; the price you pay adds the pharmacy’s margin and a dispensing fee. It is useful as a floor: a cash quote far above it is high, and a self-pay price below it is a manufacturer program.' },
      { q: 'How often does NADAC change?', a: `CMS publishes a new file every week. Each drug’s figure carries an effective date and changes when the monthly survey shows a significant move. We read the latest file automatically; the one used on this page is dated ${h.date(nadacAsOf())}.` },
      { q: 'Why is NADAC close to the list price for GLP-1s?', a: 'Pharmacies buy GLP-1s from wholesalers at prices tied to the list price, and that did not change when manufacturers cut their self-pay prices. The programs and the TrumpRx coupons cover the gap, so a pharmacy that processes a plain cash claim quotes a price near NADAC.' },
    ],
  },
});
