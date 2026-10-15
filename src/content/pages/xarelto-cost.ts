import { definePage } from '../../lib/page-types';
import { cash, list, nadac, mfp, PD, partD, nadacAsOf, asOf, $en } from './_util';
import { product } from '../../lib/engine/index';

const X = product('xarelto');

export default definePage({
  id: 'xarelto-cost', group: 'other', order: 22,
  tool: { kind: 'calc', product: 'xarelto', dose: '20', lock: true },
  related: ['eliquis-cost', 'trumprx-prices', 'medicare-negotiated-prices', 'medicare-part-d-cap', 'nadac-pharmacy-cost'],
  sources: ['trumprx', 'cmsNegotiation', 'cmsFactSheet2026', 'nadac', 'medicarePartDCosts'],
  en: {
    slug: 'xarelto-cost', nav: 'Xarelto cost', card: 'Xarelto: TrumpRx cash price, list price, Medicare 2026 negotiated price',
    title: `Xarelto Cost 2026: ${$en(cash('xarelto', '20'))} a Month on TrumpRx and Medicare`,
    description: `Xarelto cost in 2026: ${$en(cash('xarelto', '20'))} for 30 tablets on TrumpRx against a ${$en(list('xarelto', '20'))} list price, Medicare’s ${$en(mfp('xarelto', 2026))} negotiated price for 30 days, and your Part D share in 2026.`,
    h1: 'Xarelto cost in 2026: TrumpRx, Medicare and the list price',
    intro: (h) => `Xarelto costs ${h.usd(cash('xarelto', '20'))} for 30 tablets of 10, 15 or 20 mg through TrumpRx, the same amount Medicare negotiated for 2026; the list price is ${h.usd(list('xarelto', '20'))}.`,
    resume: (h) => `Xarelto (rivaroxaban), the once-daily anticoagulant from Johnson & Johnson, is one of the few drugs whose cash price and Medicare price meet: TrumpRx lists 30 tablets of 10, 15 or 20 mg at ${h.usd(cash('xarelto', '20'))}, exactly the ${h.usd(mfp('xarelto', 2026))} for 30 days that Medicare negotiated for 2026, while the list price shown on the same TrumpRx page is ${h.usd(list('xarelto', '20'))}. A 90-tablet bottle is listed at three times that amount. Pharmacies pay about ${h.usd(nadac('xarelto', '20'))} for 30 tablets of 20 mg according to the NADAC survey of ${h.date(nadacAsOf())}. On Medicare, the standard Part D benefit puts a year of Xarelto at about ${h.usd(partD('xarelto', '20', 2026))} in 2026. The CMS file ends Xarelto’s negotiated price on December 31, 2026, with no 2027 price listed, so the calculator falls back to the list price for 2027.`,
    body: (h) => `
<h2>Prices by strength</h2>
${h.table(['Tablet', 'TrumpRx, 30 tablets', 'List price, 30 tablets', 'Pharmacy cost (NADAC)', 'Medicare 2026'], X.doses.map((d) => [d.label, h.usd(cash('xarelto', d.id)), h.usd(list('xarelto', d.id)), h.usd(nadac('xarelto', d.id)), h.usd(mfp('xarelto', 2026))]), `Xarelto. TrumpRx read on ${h.date(asOf())}; NADAC file of ${h.date(nadacAsOf())}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The 2.5 mg tablet, used twice a day with aspirin in vascular disease, is not on TrumpRx; its pharmacy cost is about half that of the other strengths per tablet, but twice-daily dosing brings the month back to a similar total.</p>
<h2>TrumpRx or Medicare?</h2>
<p>For someone on Medicare, the cash price is not a bargain worth taking: a self-pay purchase does not count toward the Part D deductible or the ${h.usd(PD(2026).oopCap)} cap, and the TrumpRx terms ask government beneficiaries not to seek reimbursement for it. The coinsurance on the negotiated price is a quarter of ${h.usd(mfp('xarelto', 2026))} once the deductible is met. For someone uninsured, or whose plan excludes Xarelto, ${h.usd(cash('xarelto', '20'))} is a third of the list price.</p>
<h2>What happens in 2027</h2>
<p>CMS’s file lists a 2027 inflation-adjusted price for most 2026 drugs, but Xarelto’s 2027 line is dated to end before it starts, which the calculator reads as no negotiated price for 2027. Part D plans will then pay their own contracted price; the calculator uses the list price as the conservative basis and says so in the result.</p>`,
    faqs: (h) => [
      { q: 'How much is Xarelto without insurance?', a: `${h.usd(cash('xarelto', '20'))} for 30 tablets of 10, 15 or 20 mg through the TrumpRx coupon, and three times that for 90 tablets. Without it, the list price is ${h.usd(list('xarelto', '20'))} for 30 tablets. The coupon is shown on TrumpRx and scanned at a retail pharmacy.` },
      { q: 'What does Xarelto cost on Medicare in 2026?', a: `Medicare negotiated ${h.usd(mfp('xarelto', 2026))} for 30 days. On the standard Part D benefit you pay the ${h.usd(PD(2026).deductible)} deductible, then 25%, about ${h.usd(partD('xarelto', '20', 2026))} for the year; flat-copay plans may differ within the ${h.usd(PD(2026).oopCap)} cap. Cash purchases would not count toward that cap.` },
      { q: 'Should I use TrumpRx for Xarelto if I have Medicare?', a: 'That is your choice, but cash purchases do not count toward your Part D deductible or yearly cap, and TrumpRx’s terms ask government beneficiaries not to bill their plan for them. With coverage, compare your plan’s copay with the cash price before paying.' },
    ],
  },
});
