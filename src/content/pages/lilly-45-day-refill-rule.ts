import { definePage } from '../../lib/page-types';
import { cash, late } from './_util';

export default definePage({
  id: 'lilly-45-day-refill-rule', group: 'guides', order: 63,
  mini: 'lateRefill', miniHref: 'zepbound-cost',
  related: ['zepbound-cost', 'foundayo-cost', 'zepbound-vial-vs-kwikpen', 'glp-1-cost-first-year', 'trumprx-vs-novocare-lillydirect'],
  sources: ['lillyZepboundSavings', 'lillyFoundayoSavings', 'lillyZepbound', 'lillyFoundayo', 'trumprx'],
  en: {
    slug: 'lilly-45-day-refill-rule', nav: 'LillyDirect 45-day refill rule', card: 'Why a late Zepbound or Foundayo refill costs more, and how much',
    title: 'Zepbound 45-Day Refill Rule 2026: What a Late Refill Costs',
    description: `Zepbound and Foundayo 45-day refill rule in 2026: the ${'$'}${cash('zepbound', 'vial-10')} price needs a refill within 45 days, late refills cost up to ${'$'}${late('zepbound', 'vial-10')}. Who it hits, yearly cost.`,
    h1: 'The 45-day refill rule: what a late Zepbound or Foundayo refill costs',
    intro: (h) => `On LillyDirect, Zepbound from 7.5 mg costs ${h.usd(cash('zepbound', 'vial-10'))} a month only if you refill within 45 days; otherwise ${h.usd(late('zepbound', 'vial-7.5'))} or ${h.usd(late('zepbound', 'vial-10'))}.`,
    resume: (h) => `Eli Lilly’s self-pay prices for the higher doses of Zepbound and Foundayo carry a timing condition that most price pages leave out. On LillyDirect and the TrumpRx listings that lead there, Zepbound vials and KwikPens at 7.5, 10, 12.5 and 15 mg cost ${h.usd(cash('zepbound', 'vial-10'))} a month for the first fill at a dose and for any refill within 45 days of the previous delivery; Lilly calls this the Zepbound Journey Program. A refill that comes later is billed at the regular price, ${h.usd(late('zepbound', 'vial-7.5'))} at 7.5 mg and ${h.usd(late('zepbound', 'vial-10'))} at 10 mg and above. Foundayo works the same way at 14.5 and 17.2 mg: ${h.usd(cash('foundayo', '14.5'))} on time, ${h.usd(late('foundayo', '14.5'))} late. The lower strengths have no such condition. A month is 28 days for a KwikPen in Lilly’s terms, so a schedule that slips a few days each cycle can cross the 45-day line after a pause, a trip or a shipping delay. The tool computes what that costs over a year.`,
    body: (h) => `
<h2>Which doses the rule covers</h2>
${h.table(['Product and dose', 'Refill within 45 days', 'Refill after 45 days', 'Difference'], [['Zepbound 7.5 mg', cash('zepbound', 'vial-7.5'), late('zepbound', 'vial-7.5')], ['Zepbound 10 mg', cash('zepbound', 'vial-10'), late('zepbound', 'vial-10')], ['Zepbound 12.5 mg', cash('zepbound', 'vial-12.5'), late('zepbound', 'vial-12.5')], ['Zepbound 15 mg', cash('zepbound', 'vial-15'), late('zepbound', 'vial-15')], ['Foundayo 14.5 mg', cash('foundayo', '14.5'), late('foundayo', '14.5')], ['Foundayo 17.2 mg', cash('foundayo', '17.2'), late('foundayo', '17.2')]].map(([n, a, b]) => [n as string, h.usd(a as number), h.usd(b as number), h.usd((b as number) - (a as number))]), 'LillyDirect and TrumpRx self-pay prices; vials and KwikPens priced alike.', ['l', 'r', 'r', 'r'])}
<h2>How the 45 days are counted</h2>
<p>Lilly’s terms count from the delivery or receipt of the previous fill to the next one, not from the prescription date. Lilly’s terms grant the lower price automatically on the first purchase of a covered dose, and new and existing patients are both eligible, so moving up to 7.5 mg or above starts at the program price. A pause in treatment, for illness, travel or a supply problem, followed by a restart at the same dose, is the typical way to cross the line.</p>
<h2>What it means over a year</h2>
<p>Thirteen four-week cycles fit in a year, and a refill pattern of every 28 days leaves a 17-day margin each time. One late refill at 10 mg costs ${h.usd(late('zepbound', 'vial-10') - cash('zepbound', 'vial-10'))}; three cost ${h.usd(3 * (late('zepbound', 'vial-10') - cash('zepbound', 'vial-10')))}. That is still far below the list price of a single-dose pen month, but it can turn Zepbound from cheaper than Wegovy at maintenance into more expensive.</p>
<h2>Why Lilly does it</h2>
<p>Lilly presents the condition as part of a program for people who stay on treatment; it does not publish other reasons, and we do not speculate. What matters for budgeting is that the lower price is conditional, and that the calculator lets you switch it off to see the regular price.</p>
<h2>What the rule does not touch</h2>
<p>Insurance claims and the Medicare GLP-1 Bridge are not affected: the Bridge copay is ${h.usd(h.M.P.bridge.copay)} for the Zepbound KwikPen and Foundayo whatever the timing. Novo Nordisk’s self-pay prices for Wegovy and Ozempic carry no refill-timing condition.</p>
<h2>Planning refills around the window</h2>
<p>The safest pattern is to order each refill a week before the current supply runs out, which keeps every interval near 28 days and far from 45. Home delivery takes several days, so ordering on the last injection day already eats into the margin. Travel abroad, a hospital stay or a supply shortage are the usual causes of a late refill; when a pause is planned, it is worth asking LillyDirect in advance how the restart will be priced, since the first fill at a dose gets the program price.</p>
<p>Prescription renewals matter too. A prescription that expires, or that needs a new dose written after a visit, can delay a refill beyond 45 days without any change in your treatment. Booking the follow-up visit before the last refill on a prescription avoids that.</p>
<h2>Comparing with insurance</h2>
<p>For someone whose employer plan covers Zepbound, the timing rule is irrelevant: the claim follows the plan’s rules and the copay card, not LillyDirect’s self-pay terms. The rule matters for cash payers, and it changes the comparison with Wegovy, whose self-pay price has no timing condition, and with the Medicare GLP-1 Bridge, where the KwikPen costs a flat ${h.usd(h.M.P.bridge.copay)}.</p>
<h2>A year with and without delays</h2>
<p>At 10 mg, twelve on-time fills cost ${h.usd(12 * cash('zepbound', 'vial-10'))}. If two of them come late, the year costs ${h.usd(10 * cash('zepbound', 'vial-10') + 2 * late('zepbound', 'vial-10'))}; if every refill is late, ${h.usd(12 * late('zepbound', 'vial-10'))}, which is more than a year of Wegovy pens at ${h.usd(12 * cash('wegovy', '2.4'))}. The tool above runs the count for any number of late refills at each affected dose.</p>`,
    faqs: (h) => [
      { q: 'What happens if I refill Zepbound after 45 days?', a: `At 7.5 mg and above, LillyDirect bills the regular price instead of the ${h.usd(cash('zepbound', 'vial-10'))} program price: ${h.usd(late('zepbound', 'vial-7.5'))} at 7.5 mg and ${h.usd(late('zepbound', 'vial-10'))} at 10, 12.5 or 15 mg. The 2.5 and 5 mg prices have no timing condition. Both prices are published by LillyDirect and TrumpRx.` },
      { q: 'Does the 45-day rule apply to Foundayo?', a: `Yes, at 14.5 and 17.2 mg: ${h.usd(cash('foundayo', '14.5'))} a month when you refill within 45 days of the last delivery, ${h.usd(late('foundayo', '14.5'))} otherwise. The lower Foundayo strengths are not concerned. The count starts from the delivery of the previous bottle. Lower doses are unaffected.` },
      { q: 'Does increasing my dose reset the 45-day count?', a: 'The first fill at a new dose is billed at the program price, according to Lilly’s terms, so a dose increase never triggers the higher price by itself. The count matters for refills at the same dose. A pause followed by a restart at the same dose is the usual trap.' },
      { q: 'Does the rule affect Medicare or insurance?', a: `No. It concerns Lilly’s self-pay prices only. Insurance claims follow your plan, and the Medicare GLP-1 Bridge charges ${h.usd(h.M.P.bridge.copay)} a month for the KwikPen and Foundayo regardless of refill timing. Wegovy and Ozempic self-pay prices have no timing condition at all.` },
      { q: 'How can I avoid paying the late-refill price?', a: `Order each refill about a week before the current supply ends, so the interval stays near 28 days, and renew the prescription before it runs out. If a pause is planned, ask LillyDirect how the restart will be billed: the first fill at a dose gets the ${h.usd(cash('zepbound', 'vial-10'))} program price.` },
    ],
  },
});
