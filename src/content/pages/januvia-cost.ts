import { definePage } from '../../lib/page-types';
import { cash, list, nadac, mfp, PD, partD, nadacAsOf, asOf, $en } from './_util';
import { product, nadacMonth } from '../../lib/engine/index';

const JV = product('januvia');

export default definePage({
  id: 'januvia-cost', group: 'other', order: 24,
  tool: { kind: 'calc', product: 'januvia', dose: '100', coverage: 'partd', lock: true },
  related: ['farxiga-cost', 'jardiance-cost', 'medicare-negotiated-prices', 'trumprx-prices', 'ozempic-cost'],
  sources: ['trumprx', 'cmsNegotiation', 'cmsFactSheet2026', 'nadac', 'medicarePartDCosts'],
  en: {
    slug: 'januvia-cost', nav: 'Januvia cost', card: 'Januvia: Medicare negotiated price, TrumpRx cash price for 25 and 50 mg',
    title: `Januvia Cost 2026: ${$en(mfp('januvia', 2026))} Medicare Price, TrumpRx Cash Price`,
    description: `Januvia cost in 2026: Medicare’s ${$en(mfp('januvia', 2026))} negotiated price for 30 days, the TrumpRx cash price for 25 and 50 mg, the 100 mg pharmacy cost, your Part D share.`,
    h1: 'Januvia cost in 2026: Medicare, TrumpRx and the pharmacy',
    intro: (h) => `Medicare pays ${h.usd(mfp('januvia', 2026))} for 30 days of Januvia in 2026; TrumpRx lists 30 tablets of 25 or 50 mg at ${h.usd(cash('januvia', '50'), 2)}.`,
    resume: (h) => `Januvia (sitagliptin) received the deepest cut of the first Medicare negotiation round: ${h.usd(mfp('januvia', 2026))} for 30 days from January 2026, against a 2023 list price of ${h.usd(h.M.P.cmsList2023.januvia)}, and ${h.usd(mfp('januvia', 2027), 2)} in 2027 after inflation adjustment. Under the standard Part D benefit that makes a year of Januvia about ${h.usd(partD('januvia', '100', 2026))}. For cash buyers, Merck’s TrumpRx listing covers only the 25 and 50 mg tablets, at ${h.usd(cash('januvia', '50'), 2)} for 30, against a list price of ${h.usd(list('januvia', '50'))} on the same page. The 100 mg tablet, the usual adult dose, is not on TrumpRx; pharmacies pay about ${h.usd(nadac('januvia', '100'))} for 30 of them according to the NADAC survey of ${h.date(nadacAsOf())}, so its counter price starts there. Januvia alone never comes close to the yearly Part D cap, which makes the negotiated price, rather than the cap, the figure that sets what a Medicare enrollee pays.`,
    body: (h) => `
<h2>The three tablets and their routes</h2>
${h.table(['Tablet', 'TrumpRx, 30 tablets', 'List price', 'Pharmacy cost (NADAC)', 'Medicare 2026'], JV.doses.map((d) => [d.label, Number.isNaN(cash('januvia', d.id)) ? 'not listed' : h.usd(cash('januvia', d.id), 2), Number.isNaN(list('januvia', d.id)) ? '–' : h.usd(list('januvia', d.id)), h.usd(nadac('januvia', d.id)), h.usd(mfp('januvia', 2026))]), `Januvia. TrumpRx read on ${h.date(asOf())}; NADAC file of ${h.date(nadacAsOf())} (${h.usd(nadacMonth(JV.doses[2])!.perUnit, 2)} a tablet at 100 mg).`, ['l', 'r', 'r', 'r', 'r'])}
<p>The lower strengths are prescribed mainly when kidney function is reduced, which is why a cash offer limited to 25 and 50 mg helps fewer people than its price suggests.</p>
<h2>What a cut of ${h.pct(1 - mfp('januvia', 2026) / h.M.P.cmsList2023.januvia, 0)} means at the counter</h2>
<p>CMS presents Januvia’s negotiated price as ${h.pct(1 - mfp('januvia', 2026) / h.M.P.cmsList2023.januvia, 0)} below its 2023 list price. For a Part D enrollee paying 25% coinsurance after the deductible, the monthly share falls in proportion; for one paying a flat copay, the change shows up in the plan’s costs rather than at the counter. Januvia alone never approaches the ${h.usd(PD(2026).oopCap)} cap: twelve months at the negotiated price cost ${h.usd(12 * mfp('januvia', 2026))} in total.</p>
<h2>Janumet in 2027</h2>
<p>Sitagliptin with metformin, sold as Janumet, joins the negotiated list in 2027 at its own price; the ${h.a('medicare-negotiated-prices', 'negotiated prices page')} lists it with the other fourteen drugs of that round.</p>`,
    faqs: (h) => [
      { q: 'How much does Januvia cost on Medicare in 2026?', a: `Medicare negotiated ${h.usd(mfp('januvia', 2026))} for 30 days. On the standard Part D benefit you pay the ${h.usd(PD(2026).deductible)} deductible, then 25%, about ${h.usd(partD('januvia', '100', 2026))} for a full year. Flat-copay plans may charge differently. The cap of the year is not reached with Januvia alone.` },
      { q: 'Is Januvia 100 mg on TrumpRx?', a: `No. TrumpRx lists Januvia 25 mg and 50 mg at ${h.usd(cash('januvia', '50'), 2)} for 30 tablets. For 100 mg, pharmacies pay about ${h.usd(nadac('januvia', '100'))} for 30 tablets according to the NADAC survey, so a cash price starts above that. Your prescriber decides the strength; the lower ones are not a price workaround.` },
      { q: 'How much does Januvia cost in 2027?', a: `Medicare’s negotiated price is adjusted for inflation to ${h.usd(mfp('januvia', 2027), 2)} for 30 days, and the Part D deductible rises to ${h.usd(PD(2027).deductible)}. A year on the standard benefit comes to about ${h.usd(partD('januvia', '100', 2027))}. Januvia alone stays far below the yearly cap. Plans may still use flat copays.` },
    ],
  },
});
