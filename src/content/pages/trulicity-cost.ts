import { definePage } from '../../lib/page-types';
import { cash, list, nadac, PD, partD, capMonth, monthName, asOf, $en, cardOf } from './_util';
import { product, mfpFirstYear } from '../../lib/engine/index';

const TR = product('trulicity');

export default definePage({
  id: 'trulicity-cost', group: 'glp1', order: 9,
  tool: { kind: 'calc', product: 'trulicity', dose: '1.5', lock: true },
  related: ['ozempic-cost', 'mounjaro-cost', 'medicare-negotiated-prices', 'medicare-part-d-cap', 'trumprx-prices'],
  sources: ['trumprx', 'lillyTrulicitySavings', 'nadac', 'cmsNegotiation', 'cmsRate2027', 'labelTrulicity'],
  en: {
    slug: 'trulicity-cost', nav: 'Trulicity cost', card: 'Trulicity by dose: LillyDirect cash price, list price, Part D, 2028 negotiation',
    title: `Trulicity Cost 2026: ${$en(cash('trulicity', '1.5'))} a Month Cash, Medicare and 2028`,
    description: `Trulicity cost in 2026: ${$en(cash('trulicity', '1.5'))} a month at any dose via LillyDirect or TrumpRx, list price ${$en(list('trulicity', '1.5'))}, the Medicare Part D cap, and the 2028 Medicare price negotiation.`,
    h1: 'Trulicity cost in 2026, and the Medicare price coming in 2028',
    intro: (h) => `Trulicity costs ${h.usd(cash('trulicity', '1.5'))} a month for four weekly pens at any dose when paid in cash, against a list price of ${h.usd(list('trulicity', '1.5'))}.`,
    resume: (h) => `Trulicity, Lilly’s once-weekly dulaglutide pen for type 2 diabetes and cardiovascular risk in diabetes, has a single self-pay price of ${h.usd(cash('trulicity', '1.5'))} a month for 0.75, 1.5, 3 and 4.5 mg, published on TrumpRx and filled through LillyDirect. That is ${h.pct(1 - cash('trulicity', '1.5') / list('trulicity', '1.5'), 0)} below its ${h.usd(list('trulicity', '1.5'))} list price, and below what pharmacies pay for it, about ${h.usd(nadac('trulicity', '1.5'))} according to the NADAC survey. On Medicare, Part D covers it: in 2026 your share under the standard benefit reaches the ${h.usd(PD(2026).oopCap)} cap in ${monthName(capMonth('trulicity', '1.5', 2026), 'en')} at list price, and in 2027, with a ${h.usd(PD(2027).oopCap)} cap, a year costs about ${h.usd(partD('trulicity', '1.5', 2027))}. CMS selected Trulicity for the third round of Medicare price negotiation, with a negotiated price taking effect in ${mfpFirstYear(TR) ?? 2028}; that price has not been published yet.`,
    body: (h) => `
<h2>Four strengths, one price</h2>
<p>Like Mounjaro, Trulicity is priced per carton of four single-dose pens, whatever the strength. The label starts adults at 0.75 mg and allows steps of 1.5 mg every four weeks up to 4.5 mg; none of those steps changes a cash bill.</p>
${h.table(['Strength', 'Self-pay a month', 'List price', 'Pharmacy cost (NADAC)'], TR.doses.map((d) => [d.label, h.usd(cash('trulicity', d.id)), h.usd(list('trulicity', d.id)), h.usd(nadac('trulicity', d.id))]), `Trulicity, four pens. Prices read on TrumpRx on ${h.date(asOf())}.`, ['l', 'r', 'r', 'r'])}
<h2>Selected for 2028</h2>
<p>The Inflation Reduction Act lets Medicare negotiate the price of drugs with high Part D spending that have been on the market for years. Trulicity is on the list of fifteen drugs CMS selected for prices that apply from January 1, 2028, alongside Biktarvy, Xolair and others; the negotiated amounts are not public yet. Until then, Part D plans pay their own contracted price and your share follows the standard rules. The ${h.a('medicare-negotiated-prices', 'negotiated prices page')} tracks every selected drug.</p>
<h2>Cash or coverage</h2>
<p>For an uninsured patient, the self-pay price is a large cut on what a pharmacy would otherwise charge. With employer coverage that includes Trulicity, Lilly’s savings card lets you pay as little as ${h.usd(cardOf('trulicity').floor)}, saving at most ${h.usd(cardOf('trulicity').maxMonthly)} a month and ${h.usd(cardOf('trulicity').maxAnnual!)} a year until December 31, 2026. Without the card, check your plan’s copay first: if it is above the self-pay price, paying cash may cost less month to month, but those payments do not count toward your deductible or out-of-pocket maximum.</p>`,
    faqs: (h) => [
      { q: 'How much is Trulicity without insurance?', a: `${h.usd(cash('trulicity', '1.5'))} a month for four pens of any strength, through LillyDirect or the TrumpRx listing that sends you there. The list price is ${h.usd(list('trulicity', '1.5'))}, and pharmacies pay about ${h.usd(nadac('trulicity', '1.5'))} for a carton. All four strengths cost the same, whatever the dose step.` },
      { q: 'Will Medicare negotiate the price of Trulicity?', a: `Yes. CMS selected Trulicity in the third negotiation cycle, for a price that applies from January 1, ${mfpFirstYear(TR) ?? 2028}. The amount will be published by CMS once negotiations end; until then Part D plans pay their own price. We will add it to the calculator as soon as CMS publishes it.` },
      { q: 'What will Trulicity cost me on Medicare in 2026?', a: `Under the standard Part D benefit, at most ${h.usd(PD(2026).oopCap)} for the year: the ${h.usd(PD(2026).deductible)} deductible, then 25% of the price until the cap, which a year of Trulicity at list price reaches in ${monthName(capMonth('trulicity', '1.5', 2026), 'en')}. A plan copay may be lower than the standard design.` },
    ],
  },
});
