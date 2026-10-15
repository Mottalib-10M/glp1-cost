import { definePage } from '../../lib/page-types';
import { nadac, mfp, PD, partD, nadacAsOf, $en } from './_util';
import { product } from '../../lib/engine/index';

const J = product('jardiance');

export default definePage({
  id: 'jardiance-cost', group: 'other', order: 21,
  tool: { kind: 'calc', product: 'jardiance', dose: '10', coverage: 'partd', lock: true },
  related: ['farxiga-cost', 'januvia-cost', 'medicare-negotiated-prices', 'medicare-part-d-cap', 'ozempic-cost'],
  sources: ['cmsNegotiation', 'cmsFactSheet2026', 'nadac', 'cmsRate2027', 'medicarePartDCosts'],
  en: {
    slug: 'jardiance-cost', nav: 'Jardiance cost', card: 'Jardiance: Medicare negotiated price, Part D share, cash cost at the pharmacy',
    title: `Jardiance Cost 2026: ${$en(mfp('jardiance', 2026))} Medicare Price, Pharmacy Cost`,
    description: `Jardiance cost in 2026: Medicare’s ${$en(mfp('jardiance', 2026))} negotiated price for 30 days, your Part D share, about ${$en(nadac('jardiance', '10'))} a month at pharmacy cost without insurance, ${$en(mfp('jardiance', 2027))} in 2027.`,
    h1: 'Jardiance cost in 2026, on Medicare and without insurance',
    intro: (h) => `Jardiance costs Medicare ${h.usd(mfp('jardiance', 2026))} for 30 days in 2026, at either strength; a pharmacy pays about ${h.usd(nadac('jardiance', '10'))} for a month of 10 mg tablets.`,
    resume: (h) => `Jardiance (empagliflozin) is a once-daily tablet used for type 2 diabetes, heart failure and chronic kidney disease, and it carried the second-largest Part D spending among the first ten negotiated drugs, $8.8 billion in 2023 according to CMS. Since January 1, 2026 Medicare pays a negotiated ${h.usd(mfp('jardiance', 2026))} for a 30-day supply of the 10 or 25 mg tablet, against a 2023 list price of ${h.usd(h.M.P.cmsList2023.jardiance)}. On the standard Part D benefit, a year of Jardiance comes to the ${h.usd(PD(2026).deductible)} deductible plus 25% of the remainder, about ${h.usd(partD('jardiance', '10', 2026))}. In 2027 the price moves with inflation to ${h.usd(mfp('jardiance', 2027))}, and the yearly share to about ${h.usd(partD('jardiance', '10', 2027))}. Boehringer Ingelheim publishes no self-pay price and Jardiance is not on TrumpRx; pharmacies pay about ${h.usd(nadac('jardiance', '10'))} for 30 tablets according to the NADAC survey of ${h.date(nadacAsOf())}.`,
    body: (h) => `
<h2>Same price at 10 and 25 mg</h2>
<p>Jardiance tablets are priced flat across the two strengths, both by the manufacturer and by Medicare. The NADAC figures confirm it at the pharmacy level: the 10 mg and 25 mg tablets cost a pharmacy the same to within a cent.</p>
${h.table(['Tablet', 'Pharmacy cost, 30 tablets (NADAC)', 'Medicare 2026, 30 days', 'Medicare 2027, 30 days'], J.doses.map((d) => [d.label, h.usd(nadac('jardiance', d.id)), h.usd(mfp('jardiance', 2026)), h.usd(mfp('jardiance', 2027))]), `Jardiance. NADAC file of ${h.date(nadacAsOf())}; negotiated prices from the CMS file.`, ['l', 'r', 'r', 'r'])}
<h2>Diabetes drugs together: why the cap still matters</h2>
<p>Jardiance alone does not get near the ${h.usd(PD(2026).oopCap)} yearly ceiling. Many people take it with a GLP-1 such as Ozempic or with insulin, though, and the cap counts all covered drugs together. Two drugs that each cost a few hundred dollars a month can reach the ceiling by late summer. The ${h.a('medicare-part-d-cap', 'Part D cap calculator')} has a field for your other drugs to show when it happens.</p>
<h2>SGLT2 neighbours</h2>
<p>Farxiga, from the same drug class, has a negotiated price of ${h.usd(mfp('farxiga', 2026))} and is also sold through TrumpRx; its ${h.a('farxiga-cost', 'cost page')} compares the cash routes. A switch between them is a clinical decision for your prescriber.</p>`,
    faqs: (h) => [
      { q: 'How much does Jardiance cost with Medicare in 2026?', a: `Part D plans pay the negotiated ${h.usd(mfp('jardiance', 2026))} for 30 days. On the standard benefit you pay the ${h.usd(PD(2026).deductible)} deductible, then 25%: about ${h.usd(partD('jardiance', '10', 2026))} for the year. A plan with flat copays can charge differently, within the ${h.usd(PD(2026).oopCap)} cap. Taking it with other brand drugs can bring the cap into play.` },
      { q: 'What is the cash price of Jardiance?', a: `The manufacturer publishes no self-pay price and TrumpRx has no Jardiance listing. Pharmacies pay about ${h.usd(nadac('jardiance', '10'))} for 30 tablets according to the NADAC survey, so expect a counter price above that. Medicare enrollees pay through their plan on the negotiated price instead.` },
      { q: 'Does the Jardiance price change in 2027?', a: `For Medicare, the negotiated price rises with inflation to ${h.usd(mfp('jardiance', 2027))} for 30 days, and the Part D deductible goes to ${h.usd(PD(2027).deductible)}. The yearly share on the standard benefit is then about ${h.usd(partD('jardiance', '10', 2027))}. A flat-copay plan may not change what you see.` },
    ],
  },
});
