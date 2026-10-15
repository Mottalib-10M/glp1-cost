import { definePage } from '../../lib/page-types';
import { cash, list, nadac, BR } from './_util';

const S = ['2.5', '5', '7.5', '10', '12.5', '15'];

export default definePage({
  id: 'zepbound-vial-vs-kwikpen', group: 'guides', order: 67,
  mini: 'zepboundForms', miniHref: 'zepbound-cost',
  related: ['zepbound-cost', 'lilly-45-day-refill-rule', 'medicare-glp-1-bridge', 'wegovy-vs-zepbound-cost', 'glp-1-cost-first-year'],
  sources: ['lillyZepbound', 'trumprx', 'nadac', 'cmsBridgeProviders', 'labelZepbound'],
  en: {
    slug: 'zepbound-vial-vs-kwikpen', nav: 'Zepbound vial vs KwikPen', card: 'Three ways Zepbound is sold, what each costs and which Medicare covers',
    title: 'Zepbound Vial vs KwikPen 2026: Price, Needles and Medicare',
    description: 'Zepbound vial vs KwikPen vs single-dose pen in 2026: LillyDirect prices by dose, list prices, pharmacy cost, needles, and why only the KwikPen gets the Bridge.',
    h1: 'Zepbound vial, KwikPen or single-dose pen: the price differences',
    intro: (h) => `On LillyDirect, a Zepbound vial and a KwikPen cost the same, ${h.usd(cash('zepbound', 'vial-10'))} a month at 10 mg; the single-dose pen has no self-pay price at all.`,
    resume: (h) => `Zepbound comes in three forms, and the form changes the price channel more than the price. Single-dose vials, which you draw with a syringe once a week, and the KwikPen, a multi-dose pen that holds four weekly doses and takes a pen needle, are both sold to cash buyers on LillyDirect at identical prices: ${h.usd(cash('zepbound', 'vial-2.5'))} at 2.5 mg, ${h.usd(cash('zepbound', 'vial-5'))} at 5 mg and ${h.usd(cash('zepbound', 'vial-10'))} from 7.5 mg with on-time refills. Their list prices on TrumpRx differ, ${h.usd(list('zepbound', 'vial-10'))} for a month of vials against ${h.usd(list('zepbound', 'kwikpen-10'))} for a 10 mg KwikPen. The original single-dose autoinjector pen is sold only through insurance; pharmacies pay about ${h.usd(nadac('zepbound', 'pen-10'))} for a month of them according to NADAC. Medicare draws its own line: of the three, CMS included only the KwikPen in the ${h.usd(BR.copay)} Medicare GLP-1 Bridge.`,
    body: (h) => `
<h2>All three forms at every dose</h2>
${h.table(['Dose', 'Vial, self-pay', 'KwikPen, self-pay', 'Vial list price', 'KwikPen list price', 'Single-dose pen, pharmacy cost'], S.map((s) => [`${s} mg`, h.usd(cash('zepbound', `vial-${s}`)), h.usd(cash('zepbound', `kwikpen-${s}`)), h.usd(list('zepbound', `vial-${s}`)), h.usd(list('zepbound', `kwikpen-${s}`)), h.usd(nadac('zepbound', `pen-${s}`))]), 'One month: four vials, one KwikPen (28 days, four doses) or four single-dose pens.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Practical differences that cost money</h2>
<p>Vials need a syringe and needle for every injection, and the KwikPen needs pen needles; Lilly’s KwikPen terms state that pen needles are a separate purchase, and CMS confirms the Bridge does not cover them. A month of KwikPen therefore costs its price plus four needles. A KwikPen month is defined as 28 days, which matters for the 45-day refill condition at 7.5 mg and above. The single-dose pen needs nothing else, which is part of why insurers that cover Zepbound usually cover that form.</p>
<h2>Why the list prices differ</h2>
<p>TrumpRx shows the vial at ${h.usd(list('zepbound', 'vial-5'))} whatever the dose, and the KwikPen at ${h.usd(list('zepbound', 'kwikpen-5'))} up to 7.5 mg and ${h.usd(list('zepbound', 'kwikpen-10'))} above. Lilly does not publish its reasons. For a cash buyer on LillyDirect the list price is irrelevant; it matters when an insurer’s coinsurance is computed on it, or for a pharmacy cash claim outside the program.</p>
<h2>Medicare: only the KwikPen in the Bridge</h2>
<p>CMS’s Bridge guidance lists six Zepbound NDCs, all KwikPens, and says the single-dose vial and single-dose pen will not be available through the Bridge. For weight management under Medicare, that makes the KwikPen the only Zepbound at ${h.usd(BR.copay)} a month. For sleep apnea, Part D plans cover Zepbound under their own formulary rules, often in the single-dose pen.</p>
<h2>Which form for which situation</h2>
<p>For a cash buyer on LillyDirect, price does not decide between vial and KwikPen. The practical points do: drawing a dose from a vial takes a syringe and a little practice, while the KwikPen dials a dose and needs a fresh pen needle each week. A KwikPen holds four doses, so a missed week leaves a dose in the pen rather than an unopened vial. For a Medicare enrollee seeking the GLP-1 Bridge, the KwikPen is the only Zepbound that qualifies. For someone with employer coverage, the single-dose pen is usually the form the plan lists, and the copay card applies to it.</p>
<p>Changing form is a prescription change. The strengths are the same, but the pharmacy cannot switch a vial prescription to a KwikPen on its own, so ask the prescriber to write the form you want.</p>
<h2>A year at 10 mg, form by form</h2>
<p>Twelve on-time months at 10 mg cost ${h.usd(12 * cash('zepbound', 'vial-10'))} in vials or KwikPens on LillyDirect, plus syringes or pen needles. Through the Medicare GLP-1 Bridge, the KwikPen costs ${h.usd(12 * BR.copay)} for the same year. A pharmacy cash claim for single-dose pens, priced from what the pharmacy pays, would start near ${h.usd(12 * nadac('zepbound', 'pen-10'))}. Same molecule, same dose, three very different years.</p>
<h2>Strengths and colours</h2>
<p>All three forms come in the same six strengths, from 2.5 to 15 mg, and the label’s escalation is the same whichever form is used: 2.5 mg for four weeks, then steps of 2.5 mg every four weeks or more. Moving between forms at the same strength does not restart the escalation, though it does require a new prescription.</p>
<h2>Storage and waste</h2>
<p>Each form has its own storage rules in the prescribing information, and a dose lost to a broken vial or a pen used past its in-use period is a dose paid for twice. For a cash buyer at ${h.usd(cash('zepbound', 'vial-10'))} a month, one wasted week costs about a quarter of that. Reading the storage section of the label before the first fill is the cheapest saving on this page.</p>`,
    faqs: (h) => [
      { q: 'Is the Zepbound KwikPen cheaper than the vial?', a: `Not on LillyDirect: both cost ${h.usd(cash('zepbound', 'kwikpen-2.5'))} at 2.5 mg, ${h.usd(cash('zepbound', 'kwikpen-5'))} at 5 mg and ${h.usd(cash('zepbound', 'kwikpen-10'))} from 7.5 mg with on-time refills. The KwikPen needs pen needles bought separately; the vial needs syringes. Late refills cost the same extra in both forms.` },
      { q: 'Which Zepbound form does Medicare cover for weight loss?', a: `Only the KwikPen, through the Medicare GLP-1 Bridge at ${h.usd(BR.copay)} a month. CMS states that single-dose vials and single-dose pens are not available through the Bridge. Pen needles are not covered either. For sleep apnea, Part D plans follow their own formulary.` },
      { q: 'Can I buy the Zepbound single-dose pen without insurance?', a: `Lilly offers no self-pay price for it. A pharmacy cash claim would start from what the pharmacy pays, about ${h.usd(nadac('zepbound', 'pen-10'))} a month according to NADAC; the vial or KwikPen on LillyDirect costs far less. Insurers usually list the single-dose pen instead.` },
      { q: 'Do I need a new prescription to switch from vials to the KwikPen?', a: 'Yes. The strengths and the escalation are the same, but the form is part of the prescription, so the pharmacy cannot switch on its own. Ask the prescriber to write the form you want; for a Medicare Bridge request it has to be the KwikPen.' },
    ],
  },
});
