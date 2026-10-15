import { definePage } from '../../lib/page-types';
import { cash, intro } from './_util';
import { firstYear } from '../../lib/minis/titrationYear';

const PL: Array<[number, string]> = [[0, 'Wegovy injection to 2.4 mg'], [1, 'Wegovy pill to 25 mg'], [2, 'Ozempic to 1 mg'], [3, 'Zepbound vial to 5 mg'], [4, 'Zepbound vial to 10 mg'], [5, 'Zepbound vial to 15 mg'], [6, 'Foundayo to 9 mg'], [7, 'Foundayo to 17.2 mg']];

export default definePage({
  id: 'glp-1-cost-first-year', group: 'guides', order: 62,
  mini: 'titrationYear',
  related: ['glp-1-price-comparison', 'wegovy-pill-cost', 'zepbound-cost', 'foundayo-cost', 'lilly-45-day-refill-rule'],
  sources: ['labelWegovy', 'labelZepbound', 'labelFoundayo', 'labelOzempic', 'novocarePharmacy', 'lillyZepbound'],
  en: {
    slug: 'glp-1-cost-first-year', nav: 'GLP-1 cost in the first year', card: 'The first 12 months of cash payments, following each label’s dose escalation',
    title: 'GLP-1 First-Year Cost 2026: 12 Months of Cash, Dose by Dose',
    description: 'GLP-1 first-year cost in 2026: twelve months of cash payments for Wegovy, Zepbound, Ozempic and Foundayo following each label’s dose escalation and offers.',
    h1: 'What a GLP-1 costs in the first year, dose step by dose step',
    intro: (h) => `Paying cash, the first twelve months of Wegovy cost ${h.usd(firstYear(0, true).total)} for a new patient who follows the label’s escalation to 2.4 mg; Zepbound to 10 mg costs ${h.usd(firstYear(4, false).total)}.`,
    resume: (h) => `The monthly price of a GLP-1 is not the price of the first year, because every label starts low and raises the dose every four weeks or 30 days, and several self-pay grids charge by strength. A new Wegovy patient paying cash pays ${h.usd(intro('wegovy', '0.25'))} for each of the first two months, then ${h.usd(cash('wegovy', '1'))} at every step to 2.4 mg: ${h.usd(firstYear(0, true).total)} over twelve months. The Wegovy pill climbs from ${h.usd(cash('wegovy-pill', '1.5'))} to ${h.usd(cash('wegovy-pill', '25'))} over four steps and costs ${h.usd(firstYear(1, false).total)}. Zepbound vials start at ${h.usd(cash('zepbound', 'vial-2.5'))} and settle at ${h.usd(cash('zepbound', 'vial-10'))} from 7.5 mg, so the year costs ${h.usd(firstYear(3, false).total)} if the dose stays at 5 mg and ${h.usd(firstYear(5, false).total)} if it goes to 15 mg. Foundayo, with its reduced middle steps, costs ${h.usd(firstYear(6, false).total)} to 9 mg. These figures follow the fastest escalation the labels allow; a prescriber who holds a dose longer changes them, and the tool lets you see the effect of starting as a new patient or not.`,
    body: (h) => `
<h2>Twelve months for each drug</h2>
${h.table(['Drug and target dose', 'Month 1', 'First 12 months, new patient', 'First 12 months, not new', 'At target dose, a month'], PL.map(([i, n]) => [n, h.usd(firstYear(i, true).first), h.usd(firstYear(i, true).total), h.usd(firstYear(i, false).total), h.usd(firstYear(i, false).maintenance)]), 'Cash prices read on TrumpRx, NovoCare and LillyDirect; one dose step a month as each label allows.', ['l', 'r', 'r', 'r', 'r'])}
<h2>The escalation rules we apply</h2>
<p>Wegovy injection starts at 0.25 mg for four weeks and steps through 0.5, 1 and 1.7 mg to 2.4 mg every four weeks. Wegovy tablets start at 1.5 mg for 30 days, then 4, 9 and 25 mg every 30 days. Ozempic starts at 0.25 mg, moves to 0.5 mg after four weeks and to 1 mg if more control is needed. Zepbound starts at 2.5 mg for four weeks and rises by 2.5 mg every four weeks or more to a maintenance dose of 5, 10 or 15 mg. Foundayo starts at 0.8 mg for at least 30 days, then 2.5 and 5.5 mg, then 9, 14.5 or 17.2 mg if needed. We treat each step as one month’s fill, which matches how the makers sell a month of treatment.</p>
<h2>Why the totals diverge</h2>
<p>Three pricing designs coexist. Flat grids, like Wegovy pens or Mounjaro, cost the same from the first month to the last. Rising grids, like the Wegovy pill, Ozempic pill and Foundayo, are cheap at the start and rise to the maintenance price. Lilly’s Zepbound grid rises too, but adds a condition: from 7.5 mg the price assumes each refill within 45 days. A year with two late refills at 10 mg costs ${h.usd(2 * (h.M.cashPrice(h.M.product('zepbound'), h.M.dose(h.M.product('zepbound'), 'vial-10'), 2026)!.late! - cash('zepbound', 'vial-10')))} more than the table shows.</p>
<h2>Starter offers and end dates</h2>
<p>Novo Nordisk’s ${h.usd(intro('wegovy', '0.25'))} offer for the first two months of Ozempic or Wegovy at 0.25 and 0.5 mg applies to fills until December 31, 2026, and Lilly’s reduced prices for Foundayo 2.5 and 5.5 mg end the same day. Someone starting in November 2026 will cross that date mid-escalation; the calculator’s 2027 setting applies the regular prices.</p>
<h2>With coverage</h2>
<p>The first-year view matters less with insurance, where a flat copay applies to each fill, or with Medicare, where the ${h.usd(h.M.P.partD['2026'].oopCap)} cap limits the year. It matters most for cash payers budgeting the start of treatment.</p>
<h2>Budgeting the first year, month by month</h2>
<p>The first-year total hides a shape. On rising grids the first bills are the lightest and the bill stabilises once the target dose is reached, usually by the fourth or fifth month. On Zepbound the jump comes at 7.5 mg, the third month on the fastest schedule, when the price moves from ${h.usd(cash('zepbound', 'vial-5'))} to ${h.usd(cash('zepbound', 'vial-7.5'))}. On Wegovy pens, after the two starter months, every month costs the same. Someone paying from a monthly budget should plan for the maintenance price from the start; the calculator’s monthly figure is that number.</p>
<p>Three events change the plan. A dose held longer at a lower strength lowers the total on rising grids. A pause and restart often means going back down the escalation, which on Zepbound can also trigger the higher late-refill price. And coverage can change mid-year, when an employer plan adds or drops anti-obesity drugs or when a Medicare enrollee becomes eligible for the GLP-1 Bridge; from that month on, the self-pay figures in the table no longer apply.</p>
<h2>What the table leaves out</h2>
<p>Pen needles for the Zepbound KwikPen and syringes for vials, sales tax where a state charges it, and shipping if a program bills it are not included; Lilly and Novo Nordisk both advertise free delivery through their pharmacies at the time of writing. Office visits and lab tests needed for a prescription are outside the scope of a price calculator.</p>`,
    faqs: (h) => [
      { q: 'How much does Wegovy cost in the first year without insurance?', a: `For a new patient following the label’s escalation to 2.4 mg, ${h.usd(firstYear(0, true).total)}: two months at ${h.usd(intro('wegovy', '0.25'))}, then ${h.usd(cash('wegovy', '1'))} a month. Without the starter offer, twelve months cost ${h.usd(firstYear(0, false).total)}. The calculator above shows the same total for your start month. Prices are the published ones.` },
      { q: 'How much does Zepbound cost in the first year?', a: `Paying cash on LillyDirect with on-time refills, ${h.usd(firstYear(3, false).total)} if the dose stays at 5 mg, ${h.usd(firstYear(4, false).total)} up to 10 mg and ${h.usd(firstYear(5, false).total)} up to 15 mg, following the fastest escalation the label allows. Late refills from 7.5 mg upward add to these totals.` },
      { q: 'Which GLP-1 is cheapest over the first year?', a: `Among the plans in the table, the Wegovy pill to 25 mg costs ${h.usd(firstYear(1, false).total)} and Foundayo to 9 mg ${h.usd(firstYear(6, false).total)} at 2026 prices. The choice of drug and pace is a medical decision; the table only adds up the published prices.` },
      { q: 'Does a slower dose escalation cost more?', a: 'On a rising price grid, staying longer at a low dose costs less; on a flat grid like Wegovy pens it changes nothing. Lilly’s 45-day rule applies to the time between refills, not to how long you stay on a dose.' },
    ],
  },
});
