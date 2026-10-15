import { definePage } from '../../lib/page-types';
import { cash, list, nadac, mfp, PD, partD, $en } from './_util';

export default definePage({
  id: 'ozempic-vs-mounjaro-cost', group: 'compare', order: 32,
  tool: { kind: 'compare', a: 'ozempic', b: 'mounjaro', doseA: '1', doseB: '7.5' },
  related: ['ozempic-cost', 'mounjaro-cost', 'medicare-part-d-cap', 'glp-1-prices-2027', 'trulicity-cost'],
  sources: ['novocareOzempic', 'trumprx', 'nadac', 'cmsNegotiation', 'cmsRate2027'],
  en: {
    slug: 'ozempic-vs-mounjaro-cost', nav: 'Ozempic vs Mounjaro cost', card: 'Two diabetes GLP-1s priced side by side, cash and Medicare 2026-2027',
    title: 'Ozempic vs Mounjaro Cost 2026: Cash and Medicare Compared',
    description: `Ozempic vs Mounjaro cost in 2026: ${$en(cash('ozempic', '1'))} against ${$en(cash('mounjaro', '7.5'))} a month in cash, list prices, and the Medicare gap that opens in 2027 when Ozempic’s ${$en(mfp('ozempic', 2027))} price arrives.`,
    h1: 'Ozempic vs Mounjaro: the cost of two diabetes drugs',
    intro: (h) => `In cash, Ozempic 1 mg costs ${h.usd(cash('ozempic', '1'))} a month and Mounjaro ${h.usd(cash('mounjaro', '7.5'))} at any dose; on Medicare the gap opens in 2027.`,
    resume: (h) => `Ozempic (semaglutide) and Mounjaro (tirzepatide) are both weekly injections for type 2 diabetes, and both are covered by Medicare Part D, but their prices diverge in each channel. Paying cash, Ozempic costs ${h.usd(cash('ozempic', '1'))} a month up to 1 mg and ${h.usd(cash('ozempic', '2'))} at 2 mg, through NovoCare Pharmacy or TrumpRx, while Mounjaro costs ${h.usd(cash('mounjaro', '7.5'))} at every strength through Lilly. List prices are close, ${h.usd(list('ozempic', '1'))} against ${h.usd(list('mounjaro', '7.5'))}, and pharmacies pay about ${h.usd(nadac('ozempic', '1'))} and ${h.usd(nadac('mounjaro', '7.5'))} according to NADAC. On Medicare in 2026 both reach the ${h.usd(PD(2026).oopCap)} cap under the standard benefit. In 2027 Ozempic moves to its negotiated price of ${h.usd(mfp('ozempic', 2027))}, which brings the yearly share to about ${h.usd(partD('ozempic', '1', 2027))}, while Mounjaro, with no negotiated price, stays near the new ${h.usd(PD(2027).oopCap)} cap. Neither drug is in the Medicare GLP-1 Bridge, since both are approved for diabetes, the use Part D already covers.`,
    body: (h) => `
<h2>Cash: a fixed gap until 2 mg</h2>
<p>The self-pay grids are simple to set side by side. Up to Ozempic 1 mg, Mounjaro costs ${h.usd(cash('mounjaro', '5') - cash('ozempic', '1'))} more a month, ${h.usd(12 * (cash('mounjaro', '5') - cash('ozempic', '1')))} a year. At Ozempic 2 mg the two are level at ${h.usd(cash('ozempic', '2'))}. A new Ozempic patient also pays ${h.usd(h.M.P.makerOffers.novoIntro.price)} for the first two fills until December 31, 2026; Mounjaro has no starter price.</p>
<h2>Medicare: level in 2026, apart in 2027</h2>
<p>At list price either drug costs more than ${h.usd(PD(2026).oopCap)} over a year at the 25% coinsurance, so under the standard benefit both cost the full cap in 2026. The 2027 picture is different: the negotiated semaglutide price applies to Ozempic from January 1, and the yearly share drops to about ${h.usd(partD('ozempic', '1', 2027))}, against about ${h.usd(partD('mounjaro', '7.5', 2027))} for Mounjaro. That is a difference of ${h.usd(partD('mounjaro', '7.5', 2027) - partD('ozempic', '1', 2027))} for the year for a person whose plan follows the standard design.</p>
<h2>Not a substitution table</h2>
<p>The two drugs have different molecules, doses and evidence, and they are not interchangeable at the pharmacy. Price can be one of the things you raise with your prescriber, not the reason to switch on your own.</p>`,
    faqs: (h) => [
      { q: 'Is Ozempic cheaper than Mounjaro?', a: `In cash, yes up to 1 mg: ${h.usd(cash('ozempic', '1'))} against ${h.usd(cash('mounjaro', '7.5'))} a month. At 2 mg Ozempic costs ${h.usd(cash('ozempic', '2'))}, the same as Mounjaro. On Medicare both cost the full cap in 2026; in 2027 Ozempic’s negotiated price makes it cheaper. Coverage by indication matters more than cash price for most patients.` },
      { q: 'How much will each cost on Medicare in 2027?', a: `Under the standard Part D benefit, about ${h.usd(partD('ozempic', '1', 2027))} for a year of Ozempic, based on the ${h.usd(mfp('ozempic', 2027))} negotiated price, and about ${h.usd(partD('mounjaro', '7.5', 2027))} for Mounjaro at its list price, within the ${h.usd(PD(2027).oopCap)} cap. Plans with flat copays may narrow the gap.` },
      { q: 'Why does Mounjaro not get a Medicare negotiated price?', a: 'CMS selects drugs for negotiation by Part D spending and time on the market. Tirzepatide was not on the lists for 2026, 2027 or 2028, so Part D plans pay their own contracted price for Mounjaro. A future selection round could still include it.' },
    ],
  },
});
