import { definePage } from '../../lib/page-types';
import { PD, partD, cash } from './_util';

export default definePage({
  id: 'medicare-extra-help-drug-costs', group: 'medicare', order: 45,
  mini: 'extraHelp', miniHref: 'medicare-part-d-cap',
  related: ['medicare-part-d-cap', 'medicare-prescription-payment-plan', 'medicare-glp-1-bridge', 'eliquis-cost', 'medicaid-glp-1-coverage'],
  sources: ['cmsRate2027', 'medicareExtraHelp', 'medicarePartDCosts', 'cmsBridge'],
  en: {
    slug: 'medicare-extra-help-drug-costs', nav: 'Extra Help drug copays', card: 'Extra Help copays for brand drugs in 2026 and 2027, and what they mean for GLP-1s',
    title: 'Extra Help Copays 2026: Part D Drug Costs With Low Income',
    description: `Extra Help copays in 2026: at most ${'$'}${PD(2026).lisOther.toFixed(2)} per brand prescription, ${'$'}${PD(2026).lisFullBenefitOther.toFixed(2)} with full Medicaid, the 2027 amounts, and what Extra Help does for a GLP-1 drug.`,
    h1: 'Extra Help: what Part D drugs cost with the low-income subsidy',
    intro: (h) => `With Extra Help, a brand-name drug costs at most ${h.usd(PD(2026).lisOther, 2)} per prescription in 2026, or ${h.usd(PD(2026).lisFullBenefitOther, 2)} with full Medicaid and income up to the poverty level.`,
    resume: (h) => `Extra Help, Medicare’s Part D low-income subsidy, replaces the deductible and coinsurance with small fixed copays set each year by CMS. For 2026 the maximum is ${h.usd(PD(2026).lisOther, 2)} per prescription for a brand-name drug for most enrollees with income up to 150% of the poverty level, and ${h.usd(PD(2026).lisFullBenefitOther, 2)} for people with full Medicaid and income up to 100%; generics cost at most ${h.usd(PD(2026).lisGeneric, 2)} and ${h.usd(PD(2026).lisFullBenefitGeneric, 2)}. In 2027 the brand maximums rise to ${h.usd(PD(2027).lisOther, 2)} and ${h.usd(PD(2027).lisFullBenefitOther, 2)}, and people in institutions or receiving home and community-based services pay nothing. For a GLP-1 covered by Part D, the difference is stark: a year of Ozempic costs about ${h.usd(12 * PD(2026).lisOther)} with Extra Help against ${h.usd(partD('ozempic', '1', 2026))} under the standard benefit. One exception matters for weight loss: the ${h.usd(h.M.P.bridge.copay)} Medicare GLP-1 Bridge copay is outside Part D, and CMS says no low-income subsidy applies to it.`,
    body: (h) => `
<h2>The 2026 and 2027 maximum copays</h2>
${h.table(['Extra Help group', 'Brand drug 2026', 'Brand drug 2027', 'Generic 2026', 'Generic 2027'], [['Full Medicaid, income up to 100% of poverty level', h.usd(PD(2026).lisFullBenefitOther, 2), h.usd(PD(2027).lisFullBenefitOther, 2), h.usd(PD(2026).lisFullBenefitGeneric, 2), h.usd(PD(2027).lisFullBenefitGeneric, 2)], ['Income up to 150% of poverty level (most others)', h.usd(PD(2026).lisOther, 2), h.usd(PD(2027).lisOther, 2), h.usd(PD(2026).lisGeneric, 2), h.usd(PD(2027).lisGeneric, 2)], ['Institutionalized or home and community-based services', '$0', '$0', '$0', '$0']], 'CMS Rate Announcement for 2027, Table V-2. Deductible: $0 for these groups.', ['l', 'r', 'r', 'r', 'r'])}
<h2>How Extra Help interacts with the cap</h2>
<p>The yearly cap of ${h.usd(PD(2026).oopCap)} still applies, and Medicare counts payments that Extra Help makes on your behalf toward it. Because the subsidy covers the coinsurance, people with Extra Help reach the cap on paper even when they pay only a few copays. Very few will pay anywhere near it themselves: twelve brand prescriptions a year at the maximum come to ${h.usd(12 * PD(2026).lisOther)}.</p>
<h2>Cash prices are rarely better</h2>
<p>Self-pay prices published on TrumpRx can look tempting, Farxiga at ${h.usd(cash('farxiga', '10'), 2)} for example. With Extra Help, the covered copay is lower than nearly every cash price, and a cash purchase does not count toward the cap. The calculator lets you set Extra Help in the Medicare Part D option and compare.</p>
<h2>Applying</h2>
<p>People with full Medicaid, a Medicare Savings Program or Supplemental Security Income get Extra Help automatically. Others apply through Social Security, which checks income and resources; Medicare.gov explains the steps. The resource limits for 2027 are announced by CMS after the September inflation figures.</p>
<h2>Extra Help and GLP-1s, case by case</h2>
<p>For a GLP-1 covered by Part D, diabetes, heart risk, sleep apnea or MASH, Extra Help is the strongest protection there is: each fill costs at most the brand copay, and twelve fills cost a fraction of what the standard benefit would charge before the cap. For weight management, the drug goes through the Medicare GLP-1 Bridge instead, and there the subsidy does not apply: everyone pays the same ${h.usd(h.M.P.bridge.copay)} a month. Someone with full Medicaid may also get coverage of an obesity drug from the state if the state chooses to cover it, but Medicare remains the primary payer for Part D drugs, so for most dual-eligible people the Bridge rules are the ones that count.</p>
<h2>Who qualifies</h2>
<p>Extra Help is for people with limited income and resources. People enrolled in full Medicaid, a Medicare Savings Program or Supplemental Security Income qualify automatically and receive a notice; others apply to Social Security. Since 2024 the full subsidy reaches incomes up to 150% of the federal poverty level, which is why the table shows only two copay levels for most people. The resource limits for 2027 are published by CMS once the September inflation figure is known.</p>
<h2>Checking your copays</h2>
<p>Your plan’s Evidence of Coverage and the LIS rider it sends each year show the copays that apply to you. If a pharmacy charges more than the CMS maximum for a covered brand drug, ask it to check the subsidy level on file; Medicare’s Best Available Evidence process exists for that case.</p>
<h2>Extra Help in 2027</h2>
<p>The 2027 copays rise slightly, to ${h.usd(PD(2027).lisOther, 2)} for a brand drug and ${h.usd(PD(2027).lisGeneric, 2)} for a generic for most enrollees. For someone on three brand drugs, that is ${h.usd(36 * PD(2027).lisOther)} for the year at most, against a standard-benefit cap of ${h.usd(PD(2027).oopCap)}. Negotiated prices do not change those copays, since Extra Help copays are already fixed amounts.</p>
<p>One more practical point: Extra Help also lowers or removes the Part D premium for a basic plan, which is a saving in addition to the copays shown here.</p>`,
    faqs: (h) => [
      { q: 'How much is a brand-name drug with Extra Help in 2026?', a: `At most ${h.usd(PD(2026).lisOther, 2)} per prescription for most Extra Help enrollees, and ${h.usd(PD(2026).lisFullBenefitOther, 2)} for people with full Medicaid and income up to the poverty level, with no deductible. Your plan may charge less. Generics cost less still. The amounts are national maximums.` },
      { q: 'What are the Extra Help copays for 2027?', a: `${h.usd(PD(2027).lisOther, 2)} per brand prescription and ${h.usd(PD(2027).lisGeneric, 2)} per generic for most enrollees, ${h.usd(PD(2027).lisFullBenefitOther, 2)} and ${h.usd(PD(2027).lisFullBenefitGeneric, 2)} for those with full Medicaid and income up to 100% of the poverty level, according to CMS’s 2027 Rate Announcement. Your plan can charge less, never more.` },
      { q: 'Does Extra Help lower the GLP-1 Bridge copay?', a: `No. CMS states that drugs furnished under the Medicare GLP-1 Bridge are outside the Part D benefit and that no low-income subsidy applies, so the copay stays ${h.usd(h.M.P.bridge.copay)} a month even with Extra Help. The Bridge is still far cheaper than any self-pay price.` },
      { q: 'What does Ozempic cost with Extra Help?', a: `For type 2 diabetes, at most ${h.usd(PD(2026).lisOther, 2)} a month in 2026 for most enrollees, about ${h.usd(12 * PD(2026).lisOther)} for the year, against ${h.usd(partD('ozempic', '1', 2026))} under the standard benefit without the subsidy. People with full Medicaid and the lowest incomes pay even less per fill.` },
      { q: 'Who gets Extra Help automatically?', a: 'People enrolled in full Medicaid, a Medicare Savings Program or Supplemental Security Income qualify automatically and receive a notice from Medicare. Others can apply through Social Security, which reviews income and resources; since 2024 the full subsidy reaches incomes up to 150% of the federal poverty level.' },
    ],
  },
});
