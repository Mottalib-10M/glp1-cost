import { definePage } from '../../lib/page-types';
import { cash, list, nadac, mfp, BR, asOf, $en, $es } from './_util';
import { product } from '../../lib/engine/index';

const WP = product('wegovy-pill');
const step = (h: { usd: (n: number) => string }) => WP.doses.map((d) => h.usd(cash('wegovy-pill', d.id))).join(' → ');

export default definePage({
  id: 'wegovy-pill-cost', group: 'glp1', order: 4,
  tool: { kind: 'calc', product: 'wegovy-pill', dose: '25', lock: true },
  related: ['wegovy-cost', 'wegovy-pill-vs-foundayo-cost', 'glp-1-cost-first-year', 'medicare-glp-1-bridge', 'ozempic-pill-cost'],
  sources: ['novocareWegovy', 'trumprx', 'nadac', 'cmsBridge', 'labelWegovy'],
  en: {
    slug: 'wegovy-pill-cost', nav: 'Wegovy pill cost', card: 'Wegovy tablets 1.5 to 25 mg: cash price per bottle, list price and the Bridge',
    title: `Wegovy Pill Cost 2026: ${$en(cash('wegovy-pill', '1.5'))} to ${$en(cash('wegovy-pill', '25'))} a Month by Strength`,
    description: `Wegovy pill cost in 2026: ${$en(cash('wegovy-pill', '1.5'))} a month at 1.5 mg up to ${$en(cash('wegovy-pill', '25'))} at 25 mg self-pay, a list price of ${$en(list('wegovy-pill', '25'))}, and ${$en(BR.copay)} a month through the Medicare GLP-1 Bridge.`,
    h1: 'Wegovy pill cost, from the first bottle to 25 mg',
    intro: (h) => `A bottle of 30 Wegovy tablets costs ${h.usd(cash('wegovy-pill', '1.5'))} at 1.5 mg and ${h.usd(cash('wegovy-pill', '25'))} at the 25 mg maintenance dose when you pay cash.`,
    resume: (h) => `The Wegovy pill, oral semaglutide approved for weight reduction and for lowering cardiovascular risk in adults with heart disease and excess weight, shares with Foundayo the lowest entry price of any GLP-1 bought without insurance. Novo Nordisk charges ${h.usd(cash('wegovy-pill', '1.5'))} for 30 tablets of 1.5 mg, ${h.usd(cash('wegovy-pill', '4'))} for 4 mg and ${h.usd(cash('wegovy-pill', '9'))} for 9 mg and ${h.usd(cash('wegovy-pill', '25'))} for the 25 mg maintenance strength, through NovoCare Pharmacy or the TrumpRx coupon. The list price is ${h.usd(list('wegovy-pill', '25'))} whatever the strength, close to what pharmacies pay according to NADAC, about ${h.usd(nadac('wegovy-pill', '25'))}. The label raises the dose every 30 days, so a cash payer goes ${step(h)} over the first four months. On Medicare, the tablets are in the GLP-1 Bridge at ${h.usd(BR.copay)} a month for weight management, and they share semaglutide’s 2027 negotiated price of ${h.usd(mfp('wegovy-pill', 2027))} for Part D uses.`,
    body: (h) => `
<h2>The price follows the escalation</h2>
<p>The prescribing information starts the tablets at 1.5 mg for 30 days and steps up every 30 days to 25 mg. Each step is a new bottle and, below 9 mg, a new price. That makes the Wegovy pill the reverse of the Wegovy pen, whose cash price is flat from 0.25 to 2.4 mg: the first months are cheap and the maintenance months are not. The ${h.a('glp-1-cost-first-year', 'first-year cost guide')} adds the steps up for each drug.</p>
${h.table(['Tablet', 'Self-pay, 30 tablets', 'List price', 'Pharmacy cost (NADAC)'], WP.doses.map((d) => [d.label, h.usd(cash('wegovy-pill', d.id)), h.usd(list('wegovy-pill', d.id)), h.usd(nadac('wegovy-pill', d.id))]), `Wegovy tablets. Prices read on TrumpRx and NovoCare on ${h.date(asOf())}.`, ['l', 'r', 'r', 'r'])}
<h2>Pill or pen at maintenance</h2>
<p>At maintenance, the 25 mg bottle costs ${h.usd(cash('wegovy-pill', '25'))} and the 2.4 mg pen ${h.usd(cash('wegovy', '2.4'))}, so the tablet saves ${h.usd(12 * (cash('wegovy', '2.4') - cash('wegovy-pill', '25')))} over a year of cash payments. The tablet has rules of its own: it is taken on an empty stomach with a little water, 30 minutes before eating. Which form suits you is for your prescriber; the money side is in the calculator above.</p>
<h2>Medicare Bridge and Part D</h2>
<p>CMS lists Wegovy tablets among the drugs of the Medicare GLP-1 Bridge. For a Part D enrollee prescribed the pill for weight management who meets the body-mass-index criteria, the cost is ${h.usd(BR.copay)} a month from July 1, 2026 to December 31, 2027, whatever the strength. Prescribed to cut cardiovascular risk, it is a Part D drug instead, under your plan’s rules and the yearly cap.</p>`,
    faqs: (h) => [
      { q: 'How much is the Wegovy pill a month?', a: `Paying cash through NovoCare Pharmacy or TrumpRx, ${h.usd(cash('wegovy-pill', '1.5'))} for 30 tablets of 1.5 mg, ${h.usd(cash('wegovy-pill', '4'))} for 4 mg, ${h.usd(cash('wegovy-pill', '9'))} for 9 mg and ${h.usd(cash('wegovy-pill', '25'))} for 25 mg. The list price is ${h.usd(list('wegovy-pill', '25'))} for any strength. One bottle counts as a month.` },
      { q: 'Is the Wegovy pill cheaper than the injection?', a: `At every strength, yes, for a cash buyer: the injection costs ${h.usd(cash('wegovy', '2.4'))} a month from 0.25 to 2.4 mg, the tablets ${h.usd(cash('wegovy-pill', '1.5'))} to ${h.usd(cash('wegovy-pill', '25'))}. A full year at maintenance costs ${h.usd(12 * cash('wegovy-pill', '25'))} in tablets against ${h.usd(12 * cash('wegovy', '2.4'))} in pens. The choice of form is your prescriber’s.` },
      { q: 'Can I get the Wegovy pill for $50 with Medicare?', a: `Yes, if you are in a Part D plan, the pill is prescribed for weight management and your prescriber’s prior authorization meets CMS’s criteria. The Medicare GLP-1 Bridge then charges ${h.usd(BR.copay)} a month, from July 1, 2026 through December 31, 2027.` },
    ],
  },
  es: {
    slug: 'precio-wegovy-pastilla', nav: 'Precio de Wegovy en pastilla', card: 'Wegovy en comprimidos de 1.5 a 25 mg: precio por frasco, precio de lista y Bridge',
    title: `Wegovy en pastilla 2026: de ${$es(cash('wegovy-pill', '1.5'))} a ${$es(cash('wegovy-pill', '25'))} al mes, por dosis`,
    description: `Precio de Wegovy en pastilla en 2026: de ${$es(cash('wegovy-pill', '1.5'))} al mes en 1.5 mg a ${$es(cash('wegovy-pill', '25'))} en 25 mg en autopago, precio de lista ${$es(list('wegovy-pill', '25'))} y ${$es(BR.copay)} al mes con el Bridge de Medicare.`,
    h1: 'Precio de Wegovy en pastilla, del primer frasco a 25 mg',
    intro: (h) => `Un frasco de 30 comprimidos de Wegovy cuesta ${h.usd(cash('wegovy-pill', '1.5'))} en 1.5 mg y ${h.usd(cash('wegovy-pill', '25'))} en la dosis de mantenimiento de 25 mg, pagando en efectivo.`,
    resume: (h) => `Wegovy en pastilla, semaglutida oral aprobada para reducir el peso y el riesgo cardiovascular en adultos con enfermedad cardíaca y exceso de peso, comparte con Foundayo el precio de entrada más bajo de los GLP-1 sin seguro. Novo Nordisk cobra ${h.usd(cash('wegovy-pill', '1.5'))} por 30 comprimidos de 1.5 mg, ${h.usd(cash('wegovy-pill', '4'))} por los de 4 mg y ${h.usd(cash('wegovy-pill', '9'))} por los de 9 mg y ${h.usd(cash('wegovy-pill', '25'))} por los de 25 mg, con NovoCare Pharmacy o el cupón de TrumpRx. El precio de lista es de ${h.usd(list('wegovy-pill', '25'))} sea cual sea la concentración, cerca de lo que pagan las farmacias según NADAC, unos ${h.usd(nadac('wegovy-pill', '25'))}. La ficha sube la dosis cada 30 días, así que quien paga en efectivo pasa por ${step(h)} en los primeros cuatro meses. Con Medicare, los comprimidos están en el GLP-1 Bridge a ${h.usd(BR.copay)} al mes para controlar el peso, y comparten el precio negociado de 2027 de la semaglutida, ${h.usd(mfp('wegovy-pill', 2027))}, para los usos de la Parte D.`,
    body: (h) => `
<h2>El precio sigue la escalada de dosis</h2>
<p>La ficha técnica empieza con 1.5 mg durante 30 días y sube cada 30 días hasta 25 mg. Cada escalón es un frasco nuevo y, por debajo de 9 mg, un precio nuevo. Wegovy en pastilla funciona al revés que la pluma, cuyo precio en efectivo es el mismo de 0.25 a 2.4 mg: los primeros meses son baratos y los de mantenimiento no tanto.</p>
${h.table(['Comprimido', 'Autopago, 30 comprimidos', 'Precio de lista', 'Costo farmacia (NADAC)'], WP.doses.map((d) => [d.label, h.usd(cash('wegovy-pill', d.id)), h.usd(list('wegovy-pill', d.id)), h.usd(nadac('wegovy-pill', d.id))]), `Wegovy en comprimidos. Precios leídos en TrumpRx y NovoCare el ${h.date(asOf())}.`, ['l', 'r', 'r', 'r'])}
<h2>Pastilla o pluma en mantenimiento</h2>
<p>En mantenimiento, el frasco de 25 mg cuesta ${h.usd(cash('wegovy-pill', '25'))} y la pluma de 2.4 mg ${h.usd(cash('wegovy', '2.4'))}: el comprimido ahorra ${h.usd(12 * (cash('wegovy', '2.4') - cash('wegovy-pill', '25')))} en un año de pagos en efectivo. Tiene sus propias reglas: se toma en ayunas con un poco de agua, 30 minutos antes de comer. Qué forma le conviene lo decide su médico.</p>
<h2>Bridge de Medicare y Parte D</h2>
<p>CMS incluye los comprimidos de Wegovy en el Medicare GLP-1 Bridge. Para una persona en la Parte D a quien se receta la pastilla para controlar el peso y que cumple los criterios de índice de masa corporal, el costo es de ${h.usd(BR.copay)} al mes del 1 de julio de 2026 al 31 de diciembre de 2027, en cualquier concentración. Recetada para reducir el riesgo cardiovascular, es un medicamento de la Parte D, con las reglas de su plan y el tope anual.</p>`,
    faqs: (h) => [
      { q: '¿Cuánto cuesta Wegovy en pastilla al mes?', a: `Pagando en efectivo con NovoCare Pharmacy o TrumpRx, ${h.usd(cash('wegovy-pill', '1.5'))} por 30 comprimidos de 1.5 mg, ${h.usd(cash('wegovy-pill', '4'))} por los de 4 mg, ${h.usd(cash('wegovy-pill', '9'))} por los de 9 mg y ${h.usd(cash('wegovy-pill', '25'))} por los de 25 mg. El precio de lista es de ${h.usd(list('wegovy-pill', '25'))} en cualquier concentración.` },
      { q: '¿Wegovy en pastilla es más barato que la inyección?', a: `En todas las concentraciones, sí, para quien paga en efectivo: la inyección cuesta ${h.usd(cash('wegovy', '2.4'))} al mes de 0.25 a 2.4 mg y los comprimidos de ${h.usd(cash('wegovy-pill', '1.5'))} a ${h.usd(cash('wegovy-pill', '25'))}. Un año completo en mantenimiento cuesta ${h.usd(12 * cash('wegovy-pill', '25'))} en comprimidos frente a ${h.usd(12 * cash('wegovy', '2.4'))} en plumas.` },
      { q: '¿Puedo tener Wegovy en pastilla por $50 con Medicare?', a: `Sí, si está en un plan de la Parte D, la pastilla se receta para controlar el peso y la autorización previa de su médico cumple los criterios de CMS. El Medicare GLP-1 Bridge cobra entonces ${h.usd(BR.copay)} al mes, del 1 de julio de 2026 al 31 de diciembre de 2027.` },
    ],
  },
});
