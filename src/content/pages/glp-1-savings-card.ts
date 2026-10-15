import { definePage } from '../../lib/page-types';
import { cash } from './_util';
import { novoCard, product } from '../../lib/engine/index';

const C = () => product('wegovy');
const card = (c: number) => novoCard(C(), c)!;

export default definePage({
  id: 'glp-1-savings-card', group: 'guides', order: 64,
  mini: 'savingsCard',
  related: ['wegovy-cost', 'ozempic-cost', 'ozempic-vs-wegovy-cost', 'trumprx-vs-novocare-lillydirect', 'foundayo-cost'],
  sources: ['novocarePharmacy', 'novocareWegovy', 'novocareOzempic', 'lillyFoundayo'],
  en: {
    slug: 'glp-1-savings-card', nav: 'GLP-1 savings cards', card: 'The $25 copay cards for insured patients: what they really cut, and who cannot use them',
    title: 'GLP-1 Savings Card 2026: $25 Copay, $100 Cap, Who Qualifies',
    description: 'GLP-1 savings cards in 2026: how the Novo Nordisk card brings a Wegovy or Ozempic copay to $25 with a $100 monthly cap, and why Medicare is left out of it.',
    h1: 'GLP-1 savings cards: what “as little as $25” means for your copay',
    intro: (h) => `With insurance that covers the drug, the Novo Nordisk savings card turns a ${h.usd(150)} copay into ${h.usd(card(150))}, because it saves at most $100 a month.`,
    resume: (h) => `Manufacturer savings cards are the most advertised and least understood GLP-1 price. Novo Nordisk’s card for Wegovy, Ozempic and their tablets lets commercially insured patients pay “as little as $25” for a month, but its own terms add that savings are capped at $100 a month and that people on government programs are excluded. In practice the card subtracts up to $100 from your plan’s copay and never takes it below $25: a ${h.usd(60)} copay becomes ${h.usd(card(60))}, a ${h.usd(150)} copay ${h.usd(card(150))}, a ${h.usd(400)} copay ${h.usd(card(400))}. It only works when your plan covers the drug; if your employer excludes weight-loss drugs, there is no copay to reduce and the self-pay price, ${h.usd(cash('wegovy', '2.4'))} for Wegovy, is the alternative. Lilly runs its own programs and states that eligible commercially insured patients with coverage for Foundayo can pay as little as $25 a month. People with Medicare, Medicaid, TRICARE or VA coverage cannot use any of these cards; for them the Part D cap and the GLP-1 Bridge play that role.`,
    body: (h) => `
<h2>The arithmetic of a capped card</h2>
${h.table(['Your plan copay', 'You pay with the card', 'Card saves', 'Saved over 12 months'], [25, 50, 100, 125, 150, 250, 400].map((c) => [h.usd(c), h.usd(card(c)), h.usd(c - card(c)), h.usd(12 * (c - card(c)))]), 'Novo Nordisk savings offer: pay as little as $25, maximum savings $100 a month.', ['r', 'r', 'r', 'r'])}
<p>The card is most valuable for copays between $125 and roughly $400; below $125 it brings you to $25, above that it saves a flat $100 and you pay the rest. For a plan that applies coinsurance on a high price, the remainder can exceed the self-pay price, and paying cash may cost less, at the expense of the deductible.</p>
<h2>What “covered” means</h2>
<p>The card reduces a copay; it does not create coverage. Many employer plans exclude anti-obesity drugs or require prior authorization and step therapy. If the claim is denied, the card cannot be applied and the pharmacy will quote either the list price or, if asked, the self-pay program price. Check coverage first: the NovoCare and LillyDirect pages offer coverage checks, and your plan’s drug list says whether Wegovy, Zepbound or Foundayo is on it.</p>
<h2>Why government programs are excluded</h2>
<p>Federal anti-kickback rules prevent manufacturers from subsidizing copays for people whose drugs are paid by Medicare, Medicaid or other federal programs, which is why every card’s terms exclude them. Those beneficiaries have their own protections: the ${h.usd(h.M.P.partD['2026'].oopCap)} Part D cap in 2026, Extra Help, and the ${h.usd(h.M.P.bridge.copay)} Medicare GLP-1 Bridge for weight management.</p>
<h2>Cards and self-pay prices are different things</h2>
<p>A savings card works with insurance; a self-pay price replaces it. NovoCare Pharmacy and LillyDirect offer both, and the pharmacist can only apply one per fill. If your copay after the card is above the self-pay price, the cheaper route that month is cash, but cash purchases do not count toward your deductible or out-of-pocket maximum.</p>
<h2>Deductibles, coinsurance and the card</h2>
<p>A savings card applies to what the pharmacy asks you to pay after your plan has processed the claim. Early in a plan year, before the deductible is met, that can be the plan’s full negotiated price, several hundred dollars; the card then saves its maximum, $100 a month for Novo Nordisk, and you pay the rest. As the deductible is met and coinsurance or a flat copay takes over, the card covers more of the bill, down to the $25 floor. The amount the card pays does not always count toward your deductible: some plans run accumulator or maximizer programs that exclude it, which your plan documents must disclose.</p>
<p>That is why the same person can pay very different amounts in January and in June. The calculator’s private-insurance option asks for the copay you actually see at the pharmacy and applies the card to it; enter the January figure and the later one to see both.</p>
<h2>How to enrol</h2>
<p>Novo Nordisk’s Wegovy and Ozempic savings offers are activated online or by text message, and the pharmacy processes them like a second insurance card. Lilly’s programs are matched to your insurance type on its savings pages. Enrolment asks whether you are covered by a government program; answering yes ends the process, as the terms require. Keep the card details with your prescription, since each refill must carry them.</p>
<h2>A worked example</h2>
<p>Take a plan that covers Wegovy with a ${h.usd(150)} copay. With the card, each fill costs ${h.usd(card(150))}, or ${h.usd(12 * card(150))} a year, against ${h.usd(12 * cash('wegovy', '2.4'))} paid in cash. If the same plan instead charged 30% coinsurance on a negotiated price of about a thousand dollars, the copay would be near ${h.usd(300)} and the card would bring it to ${h.usd(card(300))}, still below cash.</p>`,
    faqs: (h) => [
      { q: 'How does the Wegovy savings card work?', a: `If your commercial plan covers Wegovy, the card lowers your copay by up to $100 a month, never below $25. A ${h.usd(150)} copay becomes ${h.usd(card(150))}; a ${h.usd(60)} copay becomes $25. It is not available with Medicare, Medicaid or other government coverage.` },
      { q: 'Can I use a GLP-1 savings card if my insurance does not cover the drug?', a: `No. The card reduces a copay on a covered claim. Without coverage, the alternative is the self-pay price, ${h.usd(cash('wegovy', '2.4'))} a month for Wegovy through NovoCare Pharmacy or TrumpRx, which does not count toward your deductible. A coverage check on the maker’s page tells you which case applies.` },
      { q: 'Do GLP-1 savings cards work with Medicare or Medicaid?', a: 'No. Manufacturer copay cards exclude Medicare, Medicaid, TRICARE and VA beneficiaries under federal rules. Medicare enrollees are protected by the Part D yearly cap and, for weight management, by the Medicare GLP-1 Bridge. Those programs replace the card for them.' },
      { q: 'Is there a Zepbound or Foundayo savings card?', a: 'Lilly runs savings programs for commercially insured patients and states, for Foundayo, that eligible patients with coverage can pay as little as $25 a month. Terms and caps are on Lilly’s pages; we model only the Novo Nordisk card, whose cap is published.' },
    ],
  },
});
