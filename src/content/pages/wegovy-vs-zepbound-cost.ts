import { definePage } from '../../lib/page-types';
import { cash, late, list, nadac, BR, PD, $en } from './_util';

export default definePage({
  id: 'wegovy-vs-zepbound-cost', group: 'compare', order: 31,
  tool: { kind: 'compare', a: 'wegovy', b: 'zepbound', doseA: '2.4', doseB: 'vial-10' },
  related: ['wegovy-cost', 'zepbound-cost', 'medicare-glp-1-bridge', 'zepbound-vial-vs-kwikpen', 'glp-1-price-comparison'],
  sources: ['novocareWegovy', 'lillyZepbound', 'trumprx', 'nadac', 'cmsBridgeProviders'],
  en: {
    slug: 'wegovy-vs-zepbound-cost', nav: 'Wegovy vs Zepbound cost', card: 'The two weight-loss injections priced dose for dose, cash and Medicare',
    title: 'Wegovy vs Zepbound Cost 2026: Cash, List Price and Medicare',
    description: `Wegovy vs Zepbound cost in 2026: ${$en(cash('wegovy', '2.4'))} a month for Wegovy against ${$en(cash('zepbound', 'vial-2.5'))} to ${$en(cash('zepbound', 'vial-10'))} for Zepbound in cash, list prices, pharmacy cost and the Medicare GLP-1 Bridge.`,
    h1: 'Wegovy vs Zepbound: what each costs, dose for dose',
    intro: (h) => `At maintenance, Wegovy 2.4 mg costs ${h.usd(cash('wegovy', '2.4'))} a month in cash and Zepbound 10 mg ${h.usd(cash('zepbound', 'vial-10'))}; both are ${h.usd(BR.copay)} through the Medicare Bridge.`,
    resume: (h) => `Wegovy and Zepbound are the two injectable drugs most often prescribed for weight reduction, and their cash prices cross over as the dose rises. Wegovy costs ${h.usd(cash('wegovy', '2.4'))} a month from 0.25 to 2.4 mg through NovoCare Pharmacy or TrumpRx, and ${h.usd(cash('wegovy', '7.2'))} for the 7.2 mg HD pen. Zepbound vials and KwikPens cost ${h.usd(cash('zepbound', 'vial-2.5'))} at 2.5 mg, ${h.usd(cash('zepbound', 'vial-5'))} at 5 mg and ${h.usd(cash('zepbound', 'vial-10'))} from 7.5 mg on LillyDirect, if each refill comes within 45 days, so Zepbound is cheaper during the first two months and dearer after that. List prices go the other way: ${h.usd(list('wegovy', '2.4'))} for Wegovy against ${h.usd(list('zepbound', 'vial-10'))} for a Zepbound vial. On Medicare, both are ${h.usd(BR.copay)} a month through the GLP-1 Bridge for weight management, Wegovy in any form and Zepbound in the KwikPen only.`,
    body: (h) => `
<h2>Where the cash prices cross</h2>
<p>The comparison changes with time on treatment. In the first month Zepbound 2.5 mg costs ${h.usd(cash('wegovy', '0.25') - cash('zepbound', 'vial-2.5'))} less than a regular Wegovy fill, and in the second, Zepbound 5 mg is ${h.usd(Math.abs(cash('zepbound', 'vial-5') - cash('wegovy', '0.5')))} ${cash('zepbound', 'vial-5') > cash('wegovy', '0.5') ? 'more' : 'less'}. From 7.5 mg the Zepbound price is ${h.usd(cash('zepbound', 'vial-10') - cash('wegovy', '2.4'))} above Wegovy’s every month, or ${h.usd(12 * (cash('zepbound', 'vial-10') - cash('wegovy', '2.4')))} over a year. A new Wegovy patient also gets two months at ${h.usd(h.M.P.makerOffers.novoIntro.price)} until December 31, 2026, which widens the gap in Wegovy’s favour in the first year.</p>
<h2>The conditions behind each price</h2>
<p>Lilly’s ${h.usd(cash('zepbound', 'vial-10'))} for 7.5 mg and above assumes refills within 45 days; a late refill costs ${h.usd(late('zepbound', 'vial-7.5'))} at 7.5 mg and ${h.usd(late('zepbound', 'vial-10'))} from 10 mg. Novo Nordisk attaches no such condition to Wegovy. The KwikPen needs pen needles bought separately. Pharmacies outside both programs pay about ${h.usd(nadac('wegovy', '2.4'))} for a box of Wegovy and ${h.usd(nadac('zepbound', 'pen-10'))} for a month of Zepbound single-dose pens.</p>
<h2>Medicare: same Bridge, different Part D uses</h2>
<p>For weight management, CMS treats them alike in the Bridge: ${h.usd(BR.copay)} a month, prior authorization, the same body-mass-index criteria. Their Part D uses differ. Wegovy is covered when prescribed to cut cardiovascular risk in established heart disease or for MASH; Zepbound when prescribed for moderate to severe sleep apnea. In both cases the 2026 yearly share stops at ${h.usd(PD(2026).oopCap)}. Neither drug is substitutable for the other by a pharmacist; the switch is your prescriber’s.</p>`,
    faqs: (h) => [
      { q: 'Is Wegovy or Zepbound cheaper without insurance?', a: `It depends on the dose. Zepbound costs less at 2.5 mg (${h.usd(cash('zepbound', 'vial-2.5'))}); from 7.5 mg it costs ${h.usd(cash('zepbound', 'vial-10'))} against ${h.usd(cash('wegovy', '2.4'))} for Wegovy at any strength up to 2.4 mg. Over a year at maintenance, Wegovy costs ${h.usd(12 * (cash('zepbound', 'vial-10') - cash('wegovy', '2.4')))} less. Lilly’s prices also assume on-time refills.` },
      { q: 'Are Wegovy and Zepbound the same price on Medicare?', a: `For weight management through the Medicare GLP-1 Bridge, yes: ${h.usd(BR.copay)} a month each, Zepbound in the KwikPen only. For their Part D uses (heart risk or MASH for Wegovy, sleep apnea for Zepbound), your plan’s cost sharing applies, capped at ${h.usd(PD(2026).oopCap)} in 2026.` },
      { q: 'Which has the higher list price?', a: `Wegovy: ${h.usd(list('wegovy', '2.4'))} for a month of pens, against ${h.usd(list('zepbound', 'vial-10'))} for a month of Zepbound vials and ${h.usd(list('zepbound', 'kwikpen-10'))} for a 10 mg KwikPen, as published on TrumpRx. Cash buyers on the makers’ programs pay much less for both, so the list price mostly matters without a program.` },
    ],
  },
});
