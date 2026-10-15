import { definePage } from '../../lib/page-types';
import { cash, nadac, mfp, PD, partD, capMonth, monthName, nadacAsOf, $en } from './_util';
import { product } from '../../lib/engine/index';

const R = product('rybelsus');

export default definePage({
  id: 'rybelsus-cost', group: 'glp1', order: 8,
  tool: { kind: 'calc', product: 'rybelsus', dose: '7', coverage: 'partd', lock: true },
  related: ['ozempic-pill-cost', 'ozempic-cost', 'medicare-negotiated-prices', 'nadac-pharmacy-cost', 'glp-1-prices-2027'],
  sources: ['nadac', 'cmsNegotiation', 'cmsFactSheet2027', 'cmsRate2027', 'labelOzempicPill'],
  en: {
    slug: 'rybelsus-cost', nav: 'Rybelsus cost', card: 'Rybelsus 3, 7 and 14 mg: pharmacy cost, Part D share and the 2027 negotiated price',
    title: `Rybelsus Cost 2026: Pharmacy Price, ${$en(mfp('rybelsus', 2027))} Medicare in 2027`,
    description: `Rybelsus cost in 2026: no self-pay offer, about ${$en(nadac('rybelsus', '7'))} a month at pharmacy cost, your Medicare Part D share, and the ${$en(mfp('rybelsus', 2027))} negotiated price from January 2027.`,
    h1: 'Rybelsus cost in 2026 and what changes in 2027',
    intro: (h) => `Rybelsus has no published self-pay price: pharmacies pay about ${h.usd(nadac('rybelsus', '7'))} for 30 tablets, and Medicare’s negotiated price from January 2027 is ${h.usd(mfp('rybelsus', 2027))}.`,
    resume: (h) => `Rybelsus, the first semaglutide tablet for type 2 diabetes, is the one Novo Nordisk GLP-1 without a cash offer on NovoCare Pharmacy or TrumpRx. What a pharmacy pays for it is public, though: the federal NADAC survey of ${h.date(nadacAsOf())} puts a bottle of 30 tablets at about ${h.usd(nadac('rybelsus', '3'))} for 3 mg, ${h.usd(nadac('rybelsus', '7'))} for 7 mg and ${h.usd(nadac('rybelsus', '14'))} for 14 mg, so an uninsured buyer at the counter pays at least that, plus the pharmacy’s margin. Most Rybelsus users are on Medicare or employer coverage. Under the 2026 Part D standard benefit, a year of 7 mg tablets at that cost reaches the ${h.usd(PD(2026).oopCap)} cap in ${monthName(capMonth('rybelsus', '7', 2026), 'en')}. Rybelsus was negotiated together with Ozempic and Wegovy, so from January 1, 2027 Medicare pays ${h.usd(mfp('rybelsus', 2027))} for 30 days and the yearly share falls to about ${h.usd(partD('rybelsus', '7', 2027))}. The cash route to oral semaglutide is now the Ozempic pill, at ${h.usd(cash('ozempic-pill', '1.5'))} to ${h.usd(cash('ozempic-pill', '9'))}.`,
    body: (h) => `
<h2>No cash offer, so the floor is the pharmacy’s cost</h2>
<p>NovoCare Pharmacy sells Ozempic, Wegovy and their tablets at self-pay prices, but Rybelsus is not on that list, and TrumpRx has no Rybelsus page. That leaves the pharmacy’s own price. The calculator shows the NADAC figure because it is the only public, current and neutral number: CMS surveys retail pharmacies’ invoices every week and publishes the average per tablet. No pharmacy can sell below what it paid without losing money, so treat it as a minimum.</p>
${h.table(['Tablet', 'NADAC per tablet', 'Pharmacy cost, 30 tablets', 'Medicare 2027, 30 days'], R.doses.map((d) => [d.label, h.usd(h.M.nadacMonth(d)!.perUnit, 2), h.usd(nadac('rybelsus', d.id)), h.usd(mfp('rybelsus', 2027))]), `Rybelsus. NADAC file of ${h.date(nadacAsOf())}; negotiated price from the CMS file.`, ['l', 'r', 'r', 'r'])}
<h2>Medicare in 2026 and 2027</h2>
<p>Part D plans cover Rybelsus for diabetes. With no negotiated price in 2026, the plan pays its own contracted price and you pay the ${h.usd(PD(2026).deductible)} deductible plus 25% until the ${h.usd(PD(2026).oopCap)} ceiling. In 2027, CMS’s negotiated price for semaglutide, ${h.usd(mfp('rybelsus', 2027))} for any 30-day supply, becomes the price the plan pays and the base of your 25%. The ${h.a('medicare-negotiated-prices', 'negotiated prices page')} lists all the drugs concerned.</p>
<h2>Rybelsus or the Ozempic pill?</h2>
<p>Both are oral semaglutide for type 2 diabetes and share one prescribing information, which states that they are not substitutable milligram for milligram. Only the Ozempic pill has a cash price. If cost is the obstacle, the question to bring to your prescriber is whether a change of product makes sense for you, not which tablet is cheaper.</p>`,
    faqs: (h) => [
      { q: 'How much is Rybelsus without insurance?', a: `There is no maker or TrumpRx self-pay price. Pharmacies pay about ${h.usd(nadac('rybelsus', '7'))} for 30 tablets of 7 mg according to the federal NADAC survey, so a cash price starts above that. The Ozempic pill, also oral semaglutide, has a self-pay price from ${h.usd(cash('ozempic-pill', '1.5'))}.` },
      { q: 'What is the Medicare negotiated price of Rybelsus?', a: `${h.usd(mfp('rybelsus', 2027))} for a 30-day supply from January 1, 2027, the price CMS negotiated for all semaglutide products, Ozempic and Wegovy included. Under the standard Part D benefit that means a yearly share of about ${h.usd(partD('rybelsus', '7', 2027))}. Cash buyers cannot get that price.` },
      { q: 'Does Medicare cover Rybelsus in 2026?', a: `Yes, Part D plans cover it for type 2 diabetes. Your share under the standard benefit is the ${h.usd(PD(2026).deductible)} deductible, then 25% of the price, never more than ${h.usd(PD(2026).oopCap)} for the year. From 2027 the negotiated semaglutide price applies; ask your plan which tier it uses.` },
    ],
  },
});
