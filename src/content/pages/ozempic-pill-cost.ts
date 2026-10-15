import { definePage } from '../../lib/page-types';
import { cash, list, nadac, mfp, PD, partD, asOf, $en } from './_util';
import { product } from '../../lib/engine/index';

const OP = product('ozempic-pill');

export default definePage({
  id: 'ozempic-pill-cost', group: 'glp1', order: 2,
  tool: { kind: 'calc', product: 'ozempic-pill', dose: '4', lock: true },
  related: ['ozempic-cost', 'rybelsus-cost', 'wegovy-pill-cost', 'glp-1-price-comparison', 'medicare-part-d-cap'],
  sources: ['novocarePharmacy', 'trumprx', 'nadac', 'cmsNegotiation', 'labelOzempicPill'],
  en: {
    slug: 'ozempic-pill-cost', nav: 'Ozempic pill cost', card: 'Ozempic tablets 1.5, 4 and 9 mg: cash price, list price and Medicare',
    title: `Ozempic Pill Cost 2026: From ${$en(cash('ozempic-pill', '1.5'))} a Month, All 3 Strengths`,
    description: `Ozempic pill cost in 2026: ${$en(cash('ozempic-pill', '1.5'))}, ${$en(cash('ozempic-pill', '4'))} and ${$en(cash('ozempic-pill', '9'))} a month self-pay for the 1.5, 4 and 9 mg tablets, against a list price of ${$en(list('ozempic-pill', '4'))}, plus Medicare Part D rules.`,
    h1: 'Ozempic pill cost: the tablet priced strength by strength',
    intro: (h) => `Ozempic tablets cost ${h.usd(cash('ozempic-pill', '1.5'))} a month at 1.5 mg, ${h.usd(cash('ozempic-pill', '4'))} at 4 mg and ${h.usd(cash('ozempic-pill', '9'))} at 9 mg when you pay cash.`,
    resume: (h) => `The Ozempic pill is oral semaglutide taken once a day, sold by Novo Nordisk under the same prescribing information as Rybelsus, and it is the cheapest way to pay cash for a semaglutide product prescribed for type 2 diabetes. Through NovoCare Pharmacy or the TrumpRx coupon a bottle of 30 tablets costs ${h.usd(cash('ozempic-pill', '1.5'))} at 1.5 mg, ${h.usd(cash('ozempic-pill', '4'))} at 4 mg and ${h.usd(cash('ozempic-pill', '9'))} at 9 mg, while the list price is ${h.usd(list('ozempic-pill', '4'))} for every strength and pharmacies pay about ${h.usd(nadac('ozempic-pill', '4'))} for a bottle according to the NADAC survey. Unlike the injectable pen, the price climbs with the strength. Medicare Part D covers the tablets for diabetes; from January 2027 they share semaglutide’s negotiated price of ${h.usd(mfp('ozempic-pill', 2027))} for 30 days, so a year at the standard benefit comes to about ${h.usd(partD('ozempic-pill', '9', 2027))}.`,
    body: (h) => `
<h2>Three bottles, three prices</h2>
<p>Novo Nordisk prices the tablets per bottle of 30, and the three strengths sit on three steps. That matters because the label starts most patients low and raises the dose after at least 30 days: a cash payer climbing from 1.5 mg to 9 mg sees the monthly bill double. The list price does not move with the strength, which is why the discount on the starter bottle looks spectacular and the one on 9 mg less so.</p>
${h.table(['Tablet', 'Self-pay, 30 tablets', 'List price', 'Pharmacy cost (NADAC)', 'Discount on list'], OP.doses.map((d) => [d.label, h.usd(cash('ozempic-pill', d.id)), h.usd(list('ozempic-pill', d.id)), h.usd(nadac('ozempic-pill', d.id)), h.pct(1 - cash('ozempic-pill', d.id) / list('ozempic-pill', d.id), 0)]), `Ozempic tablets. Prices read on TrumpRx and NovoCare on ${h.date(asOf())}.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Not the same milligrams as Rybelsus or the pen</h2>
<p>The prescribing information is explicit that Ozempic tablets and Rybelsus tablets are not substitutable on a milligram-to-milligram basis, and that moving from Ozempic injections to tablets follows its own conversion. In price terms the gap is large: Rybelsus has no published self-pay price, and pharmacies pay about ${h.usd(nadac('rybelsus', '7'))} for a month of it. The ${h.a('rybelsus-cost', 'Rybelsus page')} explains what that means at the counter. Any switch is a prescribing decision, not a pricing one.</p>
<h2>Medicare and insurance</h2>
<p>The tablets carry the diabetes indications, so Part D plans can cover them, subject to the ${h.usd(PD(2026).deductible)} deductible and the ${h.usd(PD(2026).oopCap)} cap in 2026. They are not part of the Medicare GLP-1 Bridge, which is reserved for weight-management drugs. With employer coverage, the Novo Nordisk savings card applies to the pill as it does to the pen: as little as $25 a month, with savings capped at $100.</p>`,
    faqs: (h) => [
      { q: 'How much is the Ozempic pill without insurance?', a: `${h.usd(cash('ozempic-pill', '1.5'))} for 30 tablets of 1.5 mg, ${h.usd(cash('ozempic-pill', '4'))} for 4 mg and ${h.usd(cash('ozempic-pill', '9'))} for 9 mg, through NovoCare Pharmacy or the TrumpRx coupon at a pharmacy. One bottle of 30 tablets counts as a month of treatment. The list price is the same for every strength.` },
      { q: 'Is the Ozempic pill cheaper than the Ozempic pen?', a: `In cash, yes at the two lower strengths: ${h.usd(cash('ozempic-pill', '1.5'))} and ${h.usd(cash('ozempic-pill', '4'))} against ${h.usd(cash('ozempic', '1'))} for a pen. At 9 mg the tablet costs ${h.usd(cash('ozempic-pill', '9'))}. The doses are not equivalent, so the comparison is about price, not about which suits you. Your prescriber decides any switch.` },
      { q: 'Does Medicare cover Ozempic tablets?', a: `Yes for type 2 diabetes, through your Part D plan. Your 2026 share stops at ${h.usd(PD(2026).oopCap)} for the year; in 2027 the cap is ${h.usd(PD(2027).oopCap)} and Medicare pays the negotiated semaglutide price of ${h.usd(mfp('ozempic-pill', 2027))} for 30 days. The tablets are not in the GLP-1 Bridge.` },
    ],
  },
});
