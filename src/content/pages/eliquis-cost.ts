import { definePage } from '../../lib/page-types';
import { nadac, mfp, PD, partD, nadacAsOf, $en } from './_util';
import { product, nadacMonth } from '../../lib/engine/index';

const E = product('eliquis');

export default definePage({
  id: 'eliquis-cost', group: 'other', order: 20,
  tool: { kind: 'calc', product: 'eliquis', dose: '5', coverage: 'partd', lock: true },
  related: ['xarelto-cost', 'medicare-negotiated-prices', 'medicare-part-d-cap', 'medicare-extra-help-drug-costs', 'nadac-pharmacy-cost'],
  sources: ['cmsNegotiation', 'cmsFactSheet2026', 'nadac', 'cmsRate2027', 'medicarePartDCosts'],
  en: {
    slug: 'eliquis-cost', nav: 'Eliquis cost', card: 'Eliquis: Medicare negotiated price, Part D share and pharmacy cost without insurance',
    title: `Eliquis Cost 2026: ${$en(mfp('eliquis', 2026))} Medicare Price and Cash Cost`,
    description: `Eliquis cost in 2026: the ${$en(mfp('eliquis', 2026))} Medicare negotiated price for 30 days, your Part D share, about ${$en(nadac('eliquis', '5'))} a month at pharmacy cost without cover, and ${$en(mfp('eliquis', 2027))} in 2027.`,
    h1: 'Eliquis cost in 2026: Medicare’s negotiated price and the cash price',
    intro: (h) => `Medicare Part D pays ${h.usd(mfp('eliquis', 2026))} for 30 days of Eliquis in 2026; without insurance, a pharmacy pays about ${h.usd(nadac('eliquis', '5'))} for 60 tablets of 5 mg.`,
    resume: (h) => `Eliquis (apixaban), the blood thinner taken twice a day, was the negotiated drug with the largest Part D spending, $18.3 billion in 2023 according to CMS, and 2026 is the first year its price is set by negotiation: Part D plans pay ${h.usd(mfp('eliquis', 2026))} for a 30-day supply, against a list price of ${h.usd(h.M.P.cmsList2023.eliquis)} for 30 days in 2023 according to CMS. Under the standard benefit, a full year of Eliquis then costs you the ${h.usd(PD(2026).deductible)} deductible and 25% of the rest, about ${h.usd(partD('eliquis', '5', 2026))} in total, far below the ${h.usd(PD(2026).oopCap)} cap. In 2027 the negotiated price is adjusted for inflation to ${h.usd(mfp('eliquis', 2027))}. Without insurance there is no Bristol Myers Squibb or TrumpRx self-pay listing for Eliquis; what pharmacies pay, according to the NADAC survey of ${h.date(nadacAsOf())}, is about ${h.usd(nadac('eliquis', '5'))} for a month of 5 mg tablets, the floor of any counter price.`,
    body: (h) => `
<h2>What the negotiated price changes for you</h2>
<p>Before 2026, a Part D plan paid its own contracted price for Eliquis and your 25% coinsurance followed that price. Since January 1, 2026, the plan’s cost and your share are computed on the ${h.usd(mfp('eliquis', 2026))} maximum fair price, whatever the strength, and the manufacturer makes the pharmacy whole for the difference with what it paid. People who pay a flat copay see less change than people who pay coinsurance. The cap matters less for Eliquis than for a GLP-1: twelve months at the negotiated price add up to ${h.usd(12 * mfp('eliquis', 2026))}, well under the amount that would trigger the ${h.usd(PD(2026).oopCap)} ceiling on its own.</p>
${h.table(['Tablet', 'Pharmacy cost, 60 tablets (NADAC)', 'Medicare 2026, 30 days', 'Medicare 2027, 30 days'], E.doses.map((d) => [d.label, h.usd(nadac('eliquis', d.id)), h.usd(mfp('eliquis', 2026)), h.usd(mfp('eliquis', 2027))]), `Eliquis. NADAC file of ${h.date(nadacAsOf())} (${h.usd(nadacMonth(E.doses[1])!.perUnit, 2)} a tablet at 5 mg); negotiated prices from the CMS file.`, ['l', 'r', 'r', 'r'])}
<h2>Without insurance</h2>
<p>Eliquis is not among the drugs on TrumpRx, and its makers publish no cash price. The pharmacy’s acquisition cost is therefore the useful benchmark: the counter price adds a margin and a dispensing fee to it.</p>
<h2>With Extra Help</h2>
<p>People with low incomes who qualify for Extra Help pay a fixed copay per brand prescription instead of coinsurance: at most ${h.usd(PD(2026).lisOther, 2)} in 2026 and ${h.usd(PD(2027).lisOther, 2)} in 2027, and less for those with full Medicaid. The ${h.a('medicare-extra-help-drug-costs', 'Extra Help page')} adds this up for several drugs.</p>`,
    faqs: (h) => [
      { q: 'How much is Eliquis with Medicare in 2026?', a: `Part D plans pay the negotiated ${h.usd(mfp('eliquis', 2026))} for 30 days. Under the standard benefit you pay the ${h.usd(PD(2026).deductible)} deductible, then 25% of that price: about ${h.usd(partD('eliquis', '5', 2026))} for a full year. Plans with flat copays may charge differently, never above the ${h.usd(PD(2026).oopCap)} cap.` },
      { q: 'How much does Eliquis cost without insurance?', a: `No self-pay price is published by the makers or on TrumpRx. Pharmacies pay about ${h.usd(nadac('eliquis', '5'))} for 60 tablets of 5 mg according to the federal NADAC survey, so the cash price at the counter starts above that. Ask the pharmacy for its cash price before filling.` },
      { q: 'Will Eliquis cost more in 2027?', a: `Slightly, for Medicare: CMS adjusted the negotiated price for inflation to ${h.usd(mfp('eliquis', 2027))} for 30 days, and the 2027 deductible rises to ${h.usd(PD(2027).deductible)}. A year at the standard benefit comes to about ${h.usd(partD('eliquis', '5', 2027))}. Plans that charge a flat copay may keep the same amount at the counter.` },
    ],
  },
});
