import { definePage } from '../../lib/page-types';
import { cash, list, nadac, BR, $en } from './_util';
import { product, cashPrice, dose } from '../../lib/engine/index';
import { firstYear } from '../../lib/minis/titrationYear';

const F = product('foundayo');
const reg = (d: string) => cashPrice(F, dose(F, d), 2027)!.monthly;

export default definePage({
  id: 'wegovy-pill-vs-foundayo-cost', group: 'compare', order: 34,
  tool: { kind: 'compare', a: 'wegovy-pill', b: 'foundayo', doseA: '25', doseB: '9' },
  related: ['wegovy-pill-cost', 'foundayo-cost', 'glp-1-cost-first-year', 'medicare-glp-1-bridge', 'glp-1-price-comparison'],
  sources: ['novocareWegovy', 'lillyFoundayo', 'trumprx', 'nadac', 'cmsBridgeProviders'],
  en: {
    slug: 'wegovy-pill-vs-foundayo-cost', nav: 'Wegovy pill vs Foundayo', card: 'The two weight-loss pills priced step by step, 2026 and 2027',
    title: 'Wegovy Pill vs Foundayo Cost 2026: Two GLP-1 Pills Compared',
    description: `Wegovy pill vs Foundayo cost in 2026: both start at ${$en(cash('wegovy-pill', '1.5'))} a month, reach ${$en(cash('wegovy-pill', '25'))} at maintenance, differ in list price and in 2027, and both cost ${$en(BR.copay)} on the Bridge.`,
    h1: 'Wegovy pill vs Foundayo: the cost of the two weight-loss pills',
    intro: (h) => `Both pills start at ${h.usd(cash('wegovy-pill', '1.5'))} a month and both are ${h.usd(BR.copay)} through the Medicare Bridge; the differences are in the middle steps and in 2027.`,
    resume: (h) => `The Wegovy pill (oral semaglutide, Novo Nordisk) and Foundayo (orforglipron, Eli Lilly) are the two daily tablets approved for weight reduction, and in cash their prices are almost a mirror image. Both start at ${h.usd(cash('wegovy-pill', '1.5'))} for 30 tablets and both cost ${h.usd(cash('wegovy-pill', '25'))} at the strength most people reach, 25 mg for the Wegovy pill and 9 mg or more for Foundayo. In between, Foundayo’s 2.5 mg step costs ${h.usd(cash('foundayo', '2.5'))} and its 5.5 mg step ${h.usd(cash('foundayo', '5.5'))}, but those two prices are temporary reductions that end on December 31, 2026, after which they become ${h.usd(reg('2.5'))} and ${h.usd(reg('5.5'))}. Foundayo’s list price is ${h.usd(list('foundayo', '9'))} against ${h.usd(list('wegovy-pill', '25'))} for the Wegovy pill. Under the Medicare GLP-1 Bridge both cost ${h.usd(BR.copay)} a month for Part D enrollees prescribed them for weight management.`,
    body: (h) => `
<h2>Step by step through the titration</h2>
${h.table(['Month', 'Wegovy pill', 'Foundayo (2026 prices)', 'Foundayo (2027 prices)'], [0, 1, 2, 3].map((i) => { const w = product('wegovy-pill').doses[i]; const f = F.doses[i]; return [`${i + 1}`, `${w.label}: ${h.usd(cash('wegovy-pill', w.id))}`, `${f.label}: ${h.usd(cash('foundayo', f.id))}`, `${f.label}: ${h.usd(reg(f.id))}`]; }), 'One dose step a month, as both labels allow; the prescriber may keep a dose longer.', ['l', 'r', 'r', 'r'])}
<p>Following the label escalation from the first tablet to maintenance, twelve months cost ${h.usd(firstYear(1, false).total)} with the Wegovy pill and ${h.usd(firstYear(6, false).total)} with Foundayo up to 9 mg at 2026 prices. The ${h.a('glp-1-cost-first-year', 'first-year guide')} runs the same sum for every GLP-1.</p>
<h2>Where they differ beyond the price</h2>
<p>The labels set different routines. The Wegovy pill is taken on an empty stomach with up to four ounces of water, 30 minutes before food, drink or other medicines. Foundayo is taken once a day with or without food. Wegovy tablets also carry a cardiovascular risk-reduction indication, which makes them a Part D drug for people with established heart disease; Foundayo is approved for weight management only. Pharmacies pay about ${h.usd(nadac('wegovy-pill', '25'))} a month for the Wegovy pill and ${h.usd(nadac('foundayo', '9'))} for Foundayo 9 mg according to NADAC.</p>`,
    faqs: (h) => [
      { q: 'Is Foundayo cheaper than the Wegovy pill?', a: `In 2026, slightly, during titration: Foundayo 2.5 mg costs ${h.usd(cash('foundayo', '2.5'))} against ${h.usd(cash('wegovy-pill', '4'))} for the Wegovy pill 4 mg. At maintenance both cost ${h.usd(cash('wegovy-pill', '25'))}. From 2027 Foundayo’s middle steps return to ${h.usd(reg('2.5'))} and ${h.usd(reg('5.5'))}. The comparison tool applies those dates. Prices as published.` },
      { q: 'Are both pills covered by the Medicare GLP-1 Bridge?', a: `Yes. CMS lists all formulations of Wegovy, tablets included, and Foundayo among the Bridge drugs. Part D enrollees who meet the criteria pay ${h.usd(BR.copay)} a month from July 1, 2026 to December 31, 2027. A prior authorization from the prescriber is required.` },
      { q: 'Which pill has the lower list price?', a: `Foundayo: ${h.usd(list('foundayo', '9'))} a month against ${h.usd(list('wegovy-pill', '25'))} for the Wegovy pill, as shown on TrumpRx. List prices matter when you buy without a program or when a plan bases your coinsurance on them. Cash buyers pay the self-pay price instead. Both list prices are public.` },
    ],
  },
});
