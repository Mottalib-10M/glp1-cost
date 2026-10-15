import { definePage } from '../../lib/page-types';
import { cash, list, PD, BR } from './_util';

export default definePage({
  id: 'trumprx-vs-novocare-lillydirect', group: 'guides', order: 68,
  mini: 'trumprxSaving', miniHref: 'trumprx-prices',
  related: ['trumprx-prices', 'glp-1-savings-card', 'wegovy-cost', 'zepbound-cost', 'medicare-part-d-cap'],
  sources: ['trumprx', 'novocarePharmacy', 'lillyZepbound', 'lillyFoundayo', 'medicarePartDCosts'],
  en: {
    slug: 'trumprx-vs-novocare-lillydirect', nav: 'TrumpRx vs NovoCare vs LillyDirect', card: 'Three doors to the same self-pay price: how each works and when to use none',
    title: 'TrumpRx vs NovoCare vs LillyDirect 2026: Same GLP-1 Price',
    description: 'TrumpRx vs NovoCare Pharmacy vs LillyDirect in 2026: the same GLP-1 self-pay prices through three routes, how each fills a prescription, when insurance wins.',
    h1: 'TrumpRx, NovoCare Pharmacy or LillyDirect: which route for a GLP-1?',
    intro: (h) => `For Wegovy, Ozempic, Zepbound and Foundayo, all three routes charge the same self-pay price, ${h.usd(cash('wegovy', '2.4'))} for Wegovy 2.4 mg; what differs is how the prescription gets filled.`,
    resume: (h) => `TrumpRx.gov, NovoCare Pharmacy and LillyDirect are three ways into the same self-pay prices, not three competing discounts. TrumpRx, the federal site, lists each GLP-1 at the price its manufacturer agreed, ${h.usd(cash('wegovy', '2.4'))} for Wegovy 2.4 mg against a list price of ${h.usd(list('wegovy', '2.4'))}, ${h.usd(cash('zepbound', 'vial-10'))} for Zepbound 10 mg, and then hands over: for Novo Nordisk drugs it shows a coupon a retail pharmacy can scan, and for Lilly drugs it sends you to LillyDirect. NovoCare Pharmacy is Novo Nordisk’s own pharmacy, which sells Wegovy and Ozempic at those prices with free home delivery, or lets you pick up at a local pharmacy with a savings offer. LillyDirect is Lilly’s platform for Zepbound, Foundayo, Mounjaro and Trulicity, with home delivery and the 45-day refill condition at higher doses. All three require a prescription, all three are self-pay only, and none counts toward an insurance deductible or the ${h.usd(PD(2026).oopCap)} Medicare Part D cap. The choice is about convenience; the price is the same.`,
    body: (h) => `
<h2>Side by side</h2>
${h.table(['', 'TrumpRx.gov', 'NovoCare Pharmacy', 'LillyDirect'], [['Run by', 'Federal government (HHS)', 'Novo Nordisk, through a partner pharmacy', 'Eli Lilly, through partner pharmacies'], ['GLP-1 drugs', 'Wegovy, Ozempic, Zepbound, Mounjaro, Foundayo, Trulicity', 'Wegovy, Ozempic (pens and pills)', 'Zepbound, Foundayo, Mounjaro, Trulicity'], ['How you get it', 'Coupon at a retail pharmacy, or link to LillyDirect', 'Home delivery or local pickup', 'Home delivery or pickup'], ['Price for Wegovy 2.4 mg', h.usd(cash('wegovy', '2.4')), h.usd(cash('wegovy', '2.4')), '–'], ['Price for Zepbound 10 mg', h.usd(cash('zepbound', 'vial-10')), '–', h.usd(cash('zepbound', 'vial-10'))], ['Counts toward deductible or Medicare cap', 'No', 'No', 'No']], 'Prices read on each site; identical across routes for the same drug and dose.', ['l', 'l', 'l', 'l'])}
<h2>Which route when</h2>
<p>If you want your usual pharmacy, the TrumpRx coupon is the simplest for Wegovy and Ozempic: the pharmacist runs it like an insurance card with fixed processing codes. If you prefer delivery, NovoCare Pharmacy and LillyDirect ship to your home; your prescriber sends the prescription electronically. For Lilly drugs TrumpRx simply forwards you to LillyDirect, so there is nothing to choose.</p>
<h2>When none of them is the best route</h2>
<p>With insurance that covers the drug, a plan copay, possibly lowered by a savings card, is usually cheaper and counts toward your limits. On Medicare, if the drug is covered for your use, the Part D cap limits the year; for weight management, the ${h.usd(BR.copay)} Medicare GLP-1 Bridge costs far less than any self-pay price. Using a cash route while covered also means telling your plan, if asked, that you bought outside it: the TrumpRx terms require it.</p>
<h2>What to check before paying</h2>
<ol>
<li><strong>The exact product and dose</strong>: vials, KwikPens and single-dose pens are priced differently, and only some forms have a self-pay price.</li>
<li><strong>The conditions</strong>: Novo Nordisk’s ${h.usd(h.M.P.makerOffers.novoIntro.price)} offer is for new patients until December 31, 2026; Lilly’s higher-dose prices need refills within 45 days.</li>
<li><strong>Your coverage</strong>: a covered copay or the Bridge may be lower and counts differently.</li>
</ol>
<h2>Prescriptions and pharmacies</h2>
<p>Every route needs a valid prescription from a licensed prescriber. For the TrumpRx coupon, the prescription goes to your usual retail pharmacy as normal; you show the coupon and the pharmacy enters its codes. For NovoCare Pharmacy and LillyDirect, the prescriber sends the prescription electronically to the partner pharmacy named on each program’s page, and you complete an enrolment that confirms you are paying cash. Telehealth services can write the prescription, but none of them changes the price: the programs set it.</p>
<p>Switching routes between fills is possible. A patient can start with the coupon at a local pharmacy and move to home delivery later, or the reverse; each route treats the fill as a cash purchase. What does not combine is self-pay and insurance on the same fill.</p>
<h2>A note on Medicare and Medicaid enrollees</h2>
<p>Nothing forbids a Medicare or Medicaid enrollee from paying cash through any of the three routes. The terms only require that the purchase stay outside the plan: no claim, no reimbursement, and an honest answer if the plan asks. For a covered use, the plan route is usually cheaper over a year; for weight management on Medicare, the ${h.usd(BR.copay)} Bridge beats every self-pay price we track, from ${h.usd(cash('wegovy-pill', '1.5'))} upward.</p>
<h2>What changes in 2027</h2>
<p>Novo Nordisk’s starter offer ends on December 31, 2026, and Lilly’s temporary Foundayo prices at 2.5 and 5.5 mg end the same day. The three routes will reflect the new prices together, since TrumpRx shows the manufacturers’ figures; the calculator’s 2027 setting already applies the regular prices.</p>`,
    faqs: (h) => [
      { q: 'Is TrumpRx cheaper than NovoCare Pharmacy?', a: `No. For Wegovy and Ozempic the TrumpRx price is the Novo Nordisk self-pay price, ${h.usd(cash('wegovy', '2.4'))} for Wegovy 2.4 mg, and NovoCare Pharmacy charges the same. TrumpRx gives a coupon for a retail pharmacy; NovoCare adds home delivery. Choose whichever is easier for you.` },
      { q: 'Does TrumpRx send Zepbound orders to LillyDirect?', a: 'Yes. TrumpRx states that Eli Lilly manages all Zepbound vial orders through LillyDirect, and its Zepbound, Foundayo and Trulicity listings link there. The price is the one LillyDirect publishes. Lilly’s 45-day refill condition applies there. Home delivery is offered there.' },
      { q: 'Do TrumpRx, NovoCare or LillyDirect purchases count toward my deductible?', a: `No. They are self-pay purchases outside insurance. They do not count toward a deductible, an out-of-pocket maximum or the ${h.usd(PD(2026).oopCap)} Medicare Part D cap, and you should not submit them to your plan. Compare with your covered copay before paying cash.` },
      { q: 'Can I switch between TrumpRx, NovoCare and LillyDirect?', a: 'Yes, between fills. Each route treats the purchase as a cash sale, so you can start with the TrumpRx coupon at a local pharmacy and move to home delivery later, or the reverse. What you cannot do is combine a self-pay price and an insurance claim on the same fill.' },
    ],
  },
});
