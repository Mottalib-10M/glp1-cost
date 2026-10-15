import { definePage } from '../../lib/page-types';
import { cash, intro, mfp, PD, partD, BR, mfpFile, $en } from './_util';
import { product, cashPrice, dose } from '../../lib/engine/index';

const reg = (d: string) => cashPrice(product('foundayo'), dose(product('foundayo'), d), 2027)!.monthly;

export default definePage({
  id: 'glp-1-prices-2027', group: 'guides', order: 66,
  mini: 'price2027',
  related: ['medicare-negotiated-prices', 'medicare-part-d-cap', 'ozempic-cost', 'foundayo-cost', 'medicare-glp-1-bridge'],
  sources: ['cmsNegotiation', 'cmsFactSheet2027', 'cmsRate2027', 'cmsBridge', 'novocarePharmacy', 'lillyFoundayo'],
  en: {
    slug: 'glp-1-prices-2027', nav: 'GLP-1 prices in 2027', card: 'What is already scheduled for 2027: negotiated prices, Part D, end of offers',
    title: `GLP-1 Prices 2027: Medicare ${$en(mfp('ozempic', 2027))}, Part D and Expiring Offers`,
    description: 'GLP-1 prices in 2027: the Medicare negotiated semaglutide price, the new Part D deductible and cap, the end of Novo Nordisk and Lilly starter prices too.',
    h1: 'GLP-1 prices in 2027: what is already decided',
    intro: (h) => `On January 1, 2027, Medicare starts paying ${h.usd(mfp('ozempic', 2027))} for 30 days of Ozempic, Wegovy or Rybelsus, and the Part D cap rises to ${h.usd(PD(2027).oopCap)}.`,
    resume: (h) => `Several GLP-1 price changes for 2027 are already published, and they pull in different directions. For Medicare, the negotiated price of semaglutide, ${h.usd(mfp('ozempic', 2027))} for a 30-day supply of Ozempic, Wegovy or Rybelsus, takes effect on January 1, 2027, according to the CMS file dated ${h.date(mfpFile())}. At the same time the Part D standard benefit moves: the maximum deductible rises from ${h.usd(PD(2026).deductible)} to ${h.usd(PD(2027).deductible)} and the out-of-pocket cap from ${h.usd(PD(2026).oopCap)} to ${h.usd(PD(2027).oopCap)}. For Ozempic the net effect is a lower yearly share, about ${h.usd(partD('ozempic', '1', 2027))} against ${h.usd(partD('ozempic', '1', 2026))}; for a GLP-1 without a negotiated price, such as Mounjaro, the higher cap means paying up to ${h.usd(PD(2027).oopCap - PD(2026).oopCap)} more. In the cash channel, Novo Nordisk’s ${h.usd(intro('wegovy', '0.25'))} starter offer and Lilly’s reduced prices for Foundayo 2.5 and 5.5 mg are scheduled to end on December 31, 2026. The Medicare GLP-1 Bridge continues at ${h.usd(BR.copay)} a month through December 31, 2027.`,
    body: (h) => `
<h2>Scheduled changes, one by one</h2>
${h.table(['Item', '2026', '2027', 'Source'], [['Medicare price, semaglutide (30 days)', 'plan price', h.usd(mfp('ozempic', 2027)), 'CMS negotiated prices'], ['Part D deductible, at most', h.usd(PD(2026).deductible), h.usd(PD(2027).deductible), 'CMS 2027 Rate Announcement'], ['Part D out-of-pocket cap', h.usd(PD(2026).oopCap), h.usd(PD(2027).oopCap), 'CMS 2027 Rate Announcement'], ['Extra Help, brand copay', h.usd(PD(2026).lisOther, 2), h.usd(PD(2027).lisOther, 2), 'CMS 2027 Rate Announcement'], ['Medicare GLP-1 Bridge', `${h.usd(BR.copay)} from July 1`, `${h.usd(BR.copay)} to December 31`, 'CMS Bridge FAQ'], ['Wegovy and Ozempic starter offer', `${h.usd(intro('wegovy', '0.25'))} for two fills`, 'ends December 31, 2026', 'NovoCare terms'], ['Foundayo 2.5 mg / 5.5 mg', `${h.usd(cash('foundayo', '2.5'))} / ${h.usd(cash('foundayo', '5.5'))}`, `${h.usd(reg('2.5'))} / ${h.usd(reg('5.5'))}`, 'LillyDirect terms']], 'Changes published as of the date at the foot of this page.', ['l', 'r', 'r', 'l'])}
<h2>What is not decided</h2>
<p>Self-pay prices beyond these end dates are the manufacturers’ to set; nothing published says whether the regular Wegovy, Zepbound or Ozempic cash prices will move in 2027, so the calculator keeps today’s regular prices for 2027 and says so. The BALANCE Model will not launch in Part D in 2027, CMS says, and which states adopt it in Medicaid is not yet public. The negotiated prices of the fifteen drugs selected for 2028, Trulicity among them, are not out yet.</p>
<h2>Who gains, who pays more</h2>
<p>A Medicare enrollee on Ozempic, Wegovy for heart risk, or Rybelsus pays less in 2027 under the standard benefit. One on Mounjaro or Zepbound for sleep apnea, with no negotiated price, can pay ${h.usd(PD(2027).oopCap - PD(2026).oopCap)} more because the cap is higher. A new cash patient starting Wegovy in 2027 loses the starter discount, ${h.usd(2 * (cash('wegovy', '0.25') - intro('wegovy', '0.25')))} over the first two months. A Bridge user pays the same ${h.usd(BR.copay)} a month all year.</p>
<h2>How we keep this current</h2>
<p>The prices on this site are refreshed from TrumpRx, NADAC and the CMS files every week by an automated job; the rules in this table are checked by hand each month and dated at the foot of the page.</p>
<h2>The negotiated price in practice</h2>
<p>From January 1, 2027, a Part D plan that covers Ozempic, Wegovy or Rybelsus pays the negotiated price of ${h.usd(mfp('ozempic', 2027))} for any 30-day supply, whatever the strength. Pharmacies buy the drug at the usual price and are made whole by the manufacturer for the difference, through a system CMS set up for the program. For the enrollee, the visible change depends on the plan’s design. On coinsurance, 25% of ${h.usd(mfp('ozempic', 2027))} is ${h.usd(0.25 * mfp('ozempic', 2027))} a month after the deductible, against a quarter of a price close to a thousand dollars in 2026. On a flat copay, the monthly amount may not move at all; the saving shows up in the plan’s costs and, indirectly, in premiums.</p>
<h2>Two drugs leave, fifteen arrive</h2>
<p>The 2027 list adds fifteen drugs, from Trelegy Ellipta and Breo Ellipta for lung disease to Xtandi and Ibrance for cancer and Janumet and Tradjenta for diabetes; their prices are in the ${h.a('medicare-negotiated-prices', 'negotiated prices table')}. Some 2026 drugs have no 2027 line in the CMS file, which means plans will pay their own price for them again. The ${h.usd(PD(2027).oopCap)} cap protects enrollees either way, but someone whose drug leaves the program can see a higher share in the first months of 2027.</p>
<h2>What to watch in the coming months</h2>
<p>Three publications will change this page: the prices of the fifteen drugs selected for 2028, which CMS negotiates during 2026; any announcement by Novo Nordisk or Lilly extending or replacing their starter and temporary prices beyond December 31, 2026; and the list of states that join the BALANCE Model for Medicaid. Our weekly data job picks up price files automatically; announcements are checked by hand each month.</p>`,
    faqs: (h) => [
      { q: 'Will Ozempic be cheaper in 2027?', a: `On Medicare, yes: Part D plans pay the negotiated ${h.usd(mfp('ozempic', 2027))} for 30 days from January 1, 2027, and your share under the standard benefit falls to about ${h.usd(partD('ozempic', '1', 2027))} for the year. The cash price is set by Novo Nordisk and no 2027 change has been announced.` },
      { q: 'What is the Medicare Part D cap for 2027?', a: `${h.usd(PD(2027).oopCap)} for the year, with a maximum deductible of ${h.usd(PD(2027).deductible)}, according to CMS’s 2027 Rate Announcement. Both are up from ${h.usd(PD(2026).oopCap)} and ${h.usd(PD(2026).deductible)} in 2026. Payments made by Extra Help on your behalf count toward the cap, like your own.` },
      { q: 'Does the $50 GLP-1 Bridge continue in 2027?', a: `Yes. CMS extended the Medicare GLP-1 Bridge through December 31, 2027, at ${h.usd(BR.copay)} a month for Wegovy, Zepbound KwikPen and Foundayo prescribed for weight management, because the BALANCE Model will not launch in Part D in 2027. A prior authorization is still required.` },
      { q: 'Do the Wegovy and Foundayo starter prices end?', a: `Novo Nordisk’s ${h.usd(intro('wegovy', '0.25'))} offer for the first two fills of Wegovy or Ozempic applies until December 31, 2026, and Lilly’s reduced Foundayo prices at 2.5 and 5.5 mg end the same day, returning to ${h.usd(reg('2.5'))} and ${h.usd(reg('5.5'))}. Any extension would be announced by the manufacturers.` },
    ],
  },
});
