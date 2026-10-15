import { definePage } from '../../lib/page-types';
import ins from '../../data/insulin.json';
import { DATA } from '../../lib/engine/index';
const novolog = Object.entries(DATA.mfp.drugs).find(([k]) => k.startsWith('NOVOLOG'))?.[1].prices['2026'] ?? 0;

type V = [string | null, string | null, string | null, number, number | null];
const I = ins as unknown as { retrieved_at: string; items: Array<{ s: string; n: string; g: string | null; gen: boolean; v: V[] }> };
const rows = I.items.flatMap((x) => x.v.map((v) => ({ n: x.n, g: x.g, form: v[0] ?? '', qty: v[2] ?? '1', trx: v[3], before: v[4] })));
const at35 = rows.filter((r) => r.trx === 35).length;

export default definePage({
  id: 'insulin-cost', group: 'guides', order: 61,
  mini: 'insulin35', miniHref: 'trumprx-prices',
  related: ['trumprx-prices', 'medicare-part-d-cap', 'medicare-negotiated-prices', 'ozempic-cost', 'medicare-extra-help-drug-costs'],
  sources: ['trumprx', 'trumprxBrowse', 'medicareInsulin', 'cmsNegotiation'],
  en: {
    slug: 'insulin-cost', nav: 'Insulin cost without insurance', card: 'Insulin at $35 on TrumpRx and the $35 Medicare cap, product by product',
    title: 'Insulin Cost 2026: $35 on TrumpRx, Medicare Cap, Every Brand',
    description: `Insulin cost in 2026 without insurance: ${at35} TrumpRx packages at $35, Lantus, Toujeo, Tresiba, NovoLog and Fiasp prices, the Medicare $35 monthly cap, generics.`,
    h1: 'Insulin cost in 2026: the $35 prices, with and without insurance',
    intro: () => `Most brand insulins are listed at $35 a package on TrumpRx, and Medicare caps each covered insulin at $35 for a month’s supply.`,
    resume: (h) => `Insulin is the one class of drugs where a $35 price is now the rule rather than the exception, through two separate mechanisms. For people without insurance, TrumpRx.gov lists Lantus, Toujeo, Tresiba, NovoLog, Fiasp, Admelog, Apidra, Merilog and other insulins at $35 a package: on ${h.date(I.retrieved_at)} we counted ${h.num(at35)} insulin packages at that price, against original prices of up to ${h.usd(Math.max(...rows.map((r) => r.before ?? 0)))}. For people with Medicare, the law caps cost sharing at $35 for a one-month supply of each covered insulin product, under Part D for pens and vials and under Part B for insulin used with a covered pump. The two are not the same thing: the TrumpRx price is per package, whatever it contains, while the Medicare cap is per month of supply. A package of five pens may last more or less than a month depending on the dose. NovoLog and Fiasp also have a Medicare negotiated price of ${h.usd(novolog)} for 30 days in 2026, which lowers what the plan pays but not your capped share.`,
    body: (h) => `
<h2>Every insulin listed on TrumpRx</h2>
${h.table(['Insulin', 'Package', 'TrumpRx', 'Original price'], rows.map((r) => [r.n, `${r.form} × ${r.qty}`, h.usd(r.trx, r.trx < 100 ? 2 : 0), r.before ? h.usd(r.before, r.before < 100 ? 2 : 0) : '–']), `Read on TrumpRx.gov on ${h.date(I.retrieved_at)}.`, ['l', 'l', 'r', 'r'])}
<h2>How many packages a month?</h2>
<p>Because TrumpRx charges per package, your monthly cost depends on how fast you use it. One vial of U-100 insulin holds 1,000 units; a box of five U-100 pens holds 1,500. Someone using 40 units a day uses 1,200 units a month, a little more than a vial and less than a box of pens. The tool above multiplies the TrumpRx price by the number of packages you need; ask your pharmacist how many your prescription represents.</p>
<h2>Medicare: the $35 cap, insulin by insulin</h2>
<p>Medicare.gov states that you pay no more than $35 for a one-month supply of each Part D-covered and Part B-covered insulin product, other costs aside. Two insulins mean up to $70 a month. The cap applies only to insulin your plan covers; if you buy a non-formulary insulin outside your plan through TrumpRx, the TrumpRx price applies instead, and the payment does not count toward the yearly Part D cap.</p>
<h2>With employer insurance</h2>
<p>Many plans and several states cap insulin copays, but there is no single federal cap outside Medicare. If your plan’s copay is above $35 a package, the TrumpRx price may be lower month to month; it will not count toward your deductible.</p>
<h2>Generic and unbranded insulins</h2>
<p>TrumpRx also lists unbranded insulin lispro and insulin aspart, some priced per vial and some per several vials, and an unbranded insulin glargine. They are interchangeable with their brand only when your prescription and your state’s pharmacy rules allow.</p>`,
    faqs: (h) => [
      { q: 'How much is insulin without insurance in 2026?', a: `Most brand insulins are listed on TrumpRx at $35 a package: Lantus, Toujeo, Tresiba, NovoLog, Fiasp, Admelog, Apidra and Merilog among them. We counted ${h.num(at35)} insulin packages at that price. The price is per package, so the monthly cost depends on how many you use.` },
      { q: 'Is insulin $35 a month with Medicare?', a: 'Yes for each covered insulin product: Medicare caps your cost at $35 for a one-month supply, under Part D for pens and vials and under Part B for insulin used with a covered pump. Each additional insulin product has its own $35 cap.' },
      { q: 'Does TrumpRx insulin count toward my deductible?', a: 'No. TrumpRx prices are self-pay, outside insurance. They do not count toward a deductible, an out-of-pocket maximum or the Medicare Part D cap, and the terms ask government beneficiaries not to seek reimbursement for them. With coverage, compare your plan copay first.' },
    ],
  },
});
