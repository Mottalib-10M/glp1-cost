import { definePage } from '../../lib/page-types';
import { PD, partD, capMonth, monthName } from './_util';
import { paymentPlanMonthly, partDYear, partDBasis, product, dose } from '../../lib/engine/index';

const first = (id: 'ozempic' | 'mounjaro', d: string) => { const b = partDBasis(product(id), dose(product(id), d), 2026)!.monthly; const q = PD(2026); return Math.min(q.oopCap, Math.min(b, q.deductible) + q.coinsurance * Math.max(0, b - q.deductible)); };

export default definePage({
  id: 'medicare-prescription-payment-plan', group: 'medicare', order: 44,
  mini: 'paymentPlan', miniHref: 'medicare-part-d-cap',
  related: ['medicare-part-d-cap', 'medicare-extra-help-drug-costs', 'mounjaro-cost', 'ozempic-cost', 'entresto-cost'],
  sources: ['medicarePaymentPlan', 'medicarePartDCosts', 'cmsRate2027'],
  en: {
    slug: 'medicare-prescription-payment-plan', nav: 'Medicare Prescription Payment Plan', card: 'Spread your Part D share into equal monthly bills: how much each one is',
    title: 'Medicare Prescription Payment Plan 2026: Your Monthly Bill',
    description: 'Medicare Prescription Payment Plan in 2026: how it spreads your Part D share into equal monthly bills, what each bill is for a GLP-1, and why it saves nothing.',
    h1: 'Medicare Prescription Payment Plan: what your monthly bill will be',
    intro: (h) => `Instead of paying ${h.usd(first('ozempic', '1'))} at the pharmacy in January for a GLP-1, the Medicare Prescription Payment Plan bills about ${h.usd(paymentPlanMonthly(partD('ozempic', '1', 2026), 1))} a month all year.`,
    resume: (h) => `The Medicare Prescription Payment Plan is a payment option, available since 2025 to anyone with Part D or a Medicare Advantage plan with drug coverage, that changes when you pay for covered drugs rather than how much. With an expensive drug, the Part D year is lopsided: the deductible, up to ${h.usd(PD(2026).deductible)} in 2026, and a quarter of each fill land in the first months, until the ${h.usd(PD(2026).oopCap)} cap stops the bills. For Ozempic at list price that means about ${h.usd(first('ozempic', '1'))} at the counter for the first fill and the cap reached in ${monthName(capMonth('ozempic', '1', 2026), 'en')}. With the payment plan, you pay nothing at the pharmacy for covered drugs; the plan then bills you each month, spreading what you owe over the remaining months of the calendar year. Joining in January turns the ${h.usd(partD('ozempic', '1', 2026))} into twelve bills of ${h.usd(paymentPlanMonthly(partD('ozempic', '1', 2026), 1))}. Medicare.gov is explicit that it may help manage monthly expenses but does not save money or lower drug costs.`,
    body: (h) => `
<h2>How the monthly amount is set</h2>
<p>The plan divides what you owe by the number of months left in the year. Join in January and twelve bills share the year; join in July and the same amount is spread over six, so each bill doubles. As new prescriptions are filled, later bills grow to absorb them, but no single month can exceed what the rule allows. Once your share reaches the yearly cap, there is nothing more to spread.</p>
${h.table(['Joining in', 'Ozempic 1 mg', 'Mounjaro 7.5 mg'], [1, 4, 7, 10].map((m) => [monthName(m, 'en'), h.usd(paymentPlanMonthly(partD('ozempic', '1', 2026), m)), h.usd(paymentPlanMonthly(partD('mounjaro', '7.5', 2026), m))]), `Monthly bill for a full year of the drug at list price under the 2026 standard benefit (share ${h.usd(partD('ozempic', '1', 2026))}).`, ['l', 'r', 'r'])}
<h2>Who it helps</h2>
<p>The option suits people with a high yearly share concentrated early: a GLP-1, a cancer drug, several brand drugs together. It helps little with low, steady costs, where the monthly share is already small. People with Extra Help pay fixed low copays and rarely gain from it. Medicare notes that you can join before or during the year through your plan, and that missing a bill can get you removed from the option, though not from your drug coverage.</p>
<h2>What it does not do</h2>
<p>It does not lower prices, change your coinsurance or cover drugs your plan excludes. It does not apply to cash purchases made through TrumpRx or a maker’s self-pay program, nor to the ${h.usd(h.M.P.bridge.copay)} Medicare GLP-1 Bridge copay, which is outside Part D. In 2027 the same mechanism applies to the new ${h.usd(PD(2027).oopCap)} cap.</p>
<h2>A rule of thumb</h2>
<p>If your first pharmacy bill of the year would be more than a few hundred dollars, compare it with the monthly figure in the tool above. The total is identical; the question is only whether one large payment or twelve small ones suits your budget.</p>
<h2>Signing up and leaving</h2>
<p>You join through your Part D plan or Medicare Advantage plan, by phone, mail or online, before or during the year. Plans must tell you about the option, and must offer it at the pharmacy when a fill would cost a lot at once. If you join in the middle of a month, the first bill covers what you owe from then on. You can leave at any time; the remaining balance is then billed according to your plan’s rules. A missed payment can end your participation after a grace period, but your drug coverage stays.</p>
<h2>Two examples</h2>
<p>A person on Mounjaro for diabetes whose share for 2026 is ${h.usd(partD('mounjaro', '7.5', 2026))}, joining in January, gets twelve bills of ${h.usd(paymentPlanMonthly(partD('mounjaro', '7.5', 2026), 1))} instead of a first pharmacy bill of about ${h.usd(first('mounjaro', '7.5'))}. A person on Eliquis alone, whose yearly share is around ${h.usd(partD('eliquis', '5', 2026))}, pays about a hundred dollars a month at the counter after the deductible either way, and gains little from the plan beyond the first month.</p>
<h2>The 2027 version</h2>
<p>In 2027 the plan works the same way with the higher ${h.usd(PD(2027).deductible)} deductible and ${h.usd(PD(2027).oopCap)} cap. Because semaglutide moves to a negotiated price, an Ozempic user’s yearly share falls to about ${h.usd(partD('ozempic', '1', 2027))}, and the monthly bill from January to about ${h.usd(paymentPlanMonthly(partD('ozempic', '1', 2027), 1))}.</p>`,
    faqs: (h) => [
      { q: 'Does the Medicare Prescription Payment Plan save money?', a: 'No. Medicare.gov states that it helps manage monthly expenses by spreading out-of-pocket costs for covered drugs across the calendar year, but it does not save money or lower drug costs. You pay the same total, in monthly bills instead of at the pharmacy.' },
      { q: 'How much will my monthly bill be?', a: `Your Part D share for the year divided by the months left after you join. For a year of Ozempic at list price under the 2026 standard benefit, the share is ${h.usd(partD('ozempic', '1', 2026))}, or ${h.usd(paymentPlanMonthly(partD('ozempic', '1', 2026), 1))} a month if you join in January.` },
      { q: 'Can I join the payment plan in the middle of the year?', a: 'Yes, through your Part D or Medicare Advantage drug plan. The amount you owe is then spread over fewer months, so each bill is higher. Joining before your first expensive fill gives the lowest monthly amounts. You can also leave it at any time.' },
      { q: 'Does the payment plan cover the $50 GLP-1 Bridge copay?', a: `No. The Bridge runs outside the Part D benefit, so its ${h.usd(h.M.P.bridge.copay)} monthly copay is paid at the pharmacy and is not part of the payment plan, nor of the yearly cap. Only Part D-covered drugs can be spread. Nothing changes there.` },
      { q: 'Who benefits most from the Medicare Prescription Payment Plan?', a: `People whose yearly Part D share is high and arrives early: a GLP-1 at list price, cancer drugs or several brand drugs together. For a share of ${h.usd(PD(2026).oopCap)}, joining in January means ${h.usd(paymentPlanMonthly(PD(2026).oopCap, 1))} a month instead of large bills in the first months. People with Extra Help rarely gain from it.` },
    ],
  },
});
