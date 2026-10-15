import { definePage } from '../../lib/page-types';
import { nadac, mfp, PD, partD, nadacAsOf, $en } from './_util';
import { product, nadacMonth } from '../../lib/engine/index';

const EN = product('entresto');

export default definePage({
  id: 'entresto-cost', group: 'other', order: 25,
  tool: { kind: 'calc', product: 'entresto', dose: '97-103', coverage: 'partd', lock: true },
  related: ['eliquis-cost', 'farxiga-cost', 'medicare-negotiated-prices', 'medicare-part-d-cap', 'medicare-prescription-payment-plan'],
  sources: ['cmsNegotiation', 'cmsFactSheet2026', 'nadac', 'medicarePartDCosts', 'trumprxBrowse'],
  en: {
    slug: 'entresto-cost', nav: 'Entresto cost', card: 'Entresto: Medicare 2026 negotiated price, pharmacy cost, what changes in 2027',
    title: `Entresto Cost 2026: ${$en(mfp('entresto', 2026))} Medicare Price, Pharmacy Cost`,
    description: `Entresto cost in 2026: Medicare’s ${$en(mfp('entresto', 2026))} negotiated price for 30 days, your Part D share, about ${$en(nadac('entresto', '97-103'))} a month at pharmacy cost, and why 2027 has no Medicare price.`,
    h1: 'Entresto cost in 2026, and the end of its negotiated price',
    intro: (h) => `Medicare pays ${h.usd(mfp('entresto', 2026))} for 30 days of Entresto in 2026; a pharmacy pays about ${h.usd(nadac('entresto', '97-103'))} for 60 tablets.`,
    resume: (h) => `Entresto (sacubitril and valsartan), Novartis’s twice-daily heart failure tablet, has a Medicare negotiated price of ${h.usd(mfp('entresto', 2026))} for a 30-day supply in 2026, against a 2023 list price of ${h.usd(h.M.P.cmsList2023.entresto)}. On the standard Part D benefit, a year at that price costs about ${h.usd(partD('entresto', '97-103', 2026))}. The CMS file does not carry a negotiated price for 2027: the 2027 line is dated to end on December 31, 2026, so Part D plans return to their own contracted prices and the calculator falls back to the pharmacy acquisition cost for 2027. Without insurance, there is no Novartis or TrumpRx self-pay offer for the brand; pharmacies pay about ${h.usd(nadac('entresto', '97-103'))} for 60 tablets according to the NADAC survey of ${h.date(nadacAsOf())}. TrumpRx does list generic sacubitril-valsartan, which a pharmacist can substitute only when the prescription allows.`,
    body: (h) => `
<h2>Two tablets a day, one monthly price</h2>
${h.table(['Tablet', 'NADAC per tablet', 'Pharmacy cost, 60 tablets', 'Medicare 2026, 30 days'], EN.doses.map((d) => [d.label, h.usd(nadacMonth(d)!.perUnit, 2), h.usd(nadac('entresto', d.id)), h.usd(mfp('entresto', 2026))]), `Entresto. NADAC file of ${h.date(nadacAsOf())}; negotiated price from the CMS file.`, ['l', 'r', 'r', 'r'])}
<p>All three strengths cost a pharmacy the same per tablet, and the label’s twice-daily dosing makes 60 tablets a month. Medicare’s negotiated price is likewise one figure for any 30-day supply.</p>
<h2>Why the 2027 price is missing</h2>
<p>A negotiated price stops applying when a drug no longer qualifies, for example once a generic version is marketed. CMS’s published file shows Entresto’s 2027 inflation-adjusted line closed before it opens, and no other 2027 price. For a Part D enrollee this means the 25% coinsurance will again be computed on the plan’s price, which may be higher or lower than ${h.usd(mfp('entresto', 2026))}. We will update the page if CMS publishes a different entry.</p>
<h2>Heart failure drugs and the cap</h2>
<p>Heart failure treatment often combines several brand drugs, Entresto with Farxiga or Jardiance among them. The cap of ${h.usd(PD(2026).oopCap)} in 2026 and ${h.usd(PD(2027).oopCap)} in 2027 applies to all covered drugs together; the ${h.a('medicare-part-d-cap', 'cap calculator')} adds them up and the ${h.a('medicare-prescription-payment-plan', 'payment plan guide')} explains how to spread the bill.</p>`,
    faqs: (h) => [
      { q: 'How much is Entresto with Medicare in 2026?', a: `Medicare negotiated ${h.usd(mfp('entresto', 2026))} for 30 days. On the standard Part D benefit you pay the ${h.usd(PD(2026).deductible)} deductible, then 25%, about ${h.usd(partD('entresto', '97-103', 2026))} for the year, within the ${h.usd(PD(2026).oopCap)} cap. A plan with flat copays may charge a different monthly amount, never more over the year.` },
      { q: 'How much does Entresto cost without insurance?', a: `There is no maker or TrumpRx self-pay price for the brand. Pharmacies pay about ${h.usd(nadac('entresto', '97-103'))} for 60 tablets according to the NADAC survey. TrumpRx lists generic sacubitril-valsartan, which needs your prescriber’s and pharmacist’s agreement. A cash quote far above it is worth questioning.` },
      { q: 'Will Entresto keep its Medicare negotiated price in 2027?', a: 'The CMS file published so far gives no 2027 negotiated price for Entresto: its 2027 line ends on December 31, 2026. Unless CMS changes that entry, Part D plans will pay their own prices in 2027 and your coinsurance will follow them.' },
    ],
  },
});
