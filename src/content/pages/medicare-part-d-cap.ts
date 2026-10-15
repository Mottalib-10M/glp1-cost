import { definePage } from '../../lib/page-types';
import { PD, partD, capMonth, monthName, mfp, $en, $es } from './_util';

export default definePage({
  id: 'medicare-part-d-cap', group: 'medicare', order: 41,
  tool: { kind: 'partd', product: 'ozempic' },
  related: ['medicare-prescription-payment-plan', 'medicare-extra-help-drug-costs', 'medicare-negotiated-prices', 'ozempic-cost', 'medicare-glp-1-bridge'],
  sources: ['cmsRate2027', 'medicarePartDCosts', 'medicarePaymentPlan', 'cmsNegotiation'],
  en: {
    slug: 'medicare-part-d-cap', nav: 'Part D cap calculator', card: 'Your Part D share for the year, the month you hit the cap, 2026 and 2027',
    title: `Part D Out-of-Pocket Cap 2026: ${$en(PD(2026).oopCap)}, and ${$en(PD(2027).oopCap)} in 2027`,
    description: `Medicare Part D out-of-pocket cap: ${$en(PD(2026).oopCap)} in 2026 and ${$en(PD(2027).oopCap)} in 2027, deductible ${$en(PD(2026).deductible)} then ${$en(PD(2027).deductible)}. Your yearly share, the month you hit the cap, the payment plan.`,
    h1: 'Medicare Part D cap: your yearly share and the month you reach it',
    intro: (h) => `Medicare Part D limits what you pay for covered drugs to ${h.usd(PD(2026).oopCap)} in 2026 and ${h.usd(PD(2027).oopCap)} in 2027; this calculator shows when you get there.`,
    resume: (h) => `Since 2025 the Part D standard benefit has a hard ceiling on out-of-pocket spending, and CMS has published its level for two years: ${h.usd(PD(2026).oopCap)} in 2026 and ${h.usd(PD(2027).oopCap)} in 2027, in Table V-2 of the 2027 Rate Announcement. Below it, you pay the plan’s deductible, at most ${h.usd(PD(2026).deductible)} in 2026 and ${h.usd(PD(2027).deductible)} in 2027, then 25% of the cost of each covered drug. Once your share, including payments made for you by Extra Help, reaches the cap, covered drugs cost nothing for the rest of the calendar year. For a GLP-1 at list price the cap comes quickly: a year of Ozempic reaches it in ${monthName(capMonth('ozempic', '1', 2026), 'en')} 2026. In 2027 the negotiated semaglutide price of ${h.usd(mfp('ozempic', 2027))} changes the arithmetic, and the same year of Ozempic costs about ${h.usd(partD('ozempic', '1', 2027))}. The calculator computes your share, the month you hit the cap, and the monthly bill if you join the Medicare Prescription Payment Plan.`,
    body: (h) => `
<h2>The three stages, with the 2026 and 2027 figures</h2>
${h.table(['Stage', '2026', '2027'], [['Deductible, at most', h.usd(PD(2026).deductible), h.usd(PD(2027).deductible)], ['Coinsurance after the deductible', h.pct(PD(2026).coinsurance, 0), h.pct(PD(2027).coinsurance, 0)], ['Out-of-pocket cap', h.usd(PD(2026).oopCap), h.usd(PD(2027).oopCap)], ['After the cap', '$0', '$0']], 'Defined standard Part D benefit, CMS Rate Announcement for 2027, Table V-2.', ['l', 'r', 'r'])}
<p>Plans may use copays instead of coinsurance and many have a lower deductible; none may ask more of you than the standard design over the year, and none may exceed the cap. The calculator applies the standard design, which is the upper bound.</p>
<h2>What counts toward the cap</h2>
<p>Everything you pay for covered Part D drugs counts, including the deductible, plus payments made on your behalf by Extra Help and certain assistance programs. What does not count: drugs your plan does not cover, cash purchases made outside the plan through TrumpRx or a maker’s self-pay program, and the ${h.usd(h.M.P.bridge.copay)} Medicare GLP-1 Bridge copay. This is why paying cash for a cheap drug can backfire for someone who would otherwise reach the cap.</p>
<h2>Why the cap month matters</h2>
<p>With an expensive drug, the whole yearly share falls in the first months: deductible in January, then a quarter of each fill until the ceiling. That is a cash-flow problem more than a total-cost one. Medicare’s answer is the Prescription Payment Plan, which bills the same amount every month from the month you join; it does not lower the total. The ${h.a('medicare-prescription-payment-plan', 'payment plan guide')} explains how to sign up.</p>`,
    faqs: (h) => [
      { q: 'What is the Medicare Part D out-of-pocket cap for 2026?', a: `${h.usd(PD(2026).oopCap)} for the calendar year, under the standard benefit published by CMS. Once your share for covered drugs reaches it, including the deductible and Extra Help payments, you pay nothing more for covered drugs until December 31. Plans may have a lower deductible but never a higher cap.` },
      { q: 'What changes for Part D in 2027?', a: `The cap rises to ${h.usd(PD(2027).oopCap)} and the maximum deductible to ${h.usd(PD(2027).deductible)}, according to CMS’s 2027 Rate Announcement. Fifteen more drugs get negotiated prices, among them Ozempic, Wegovy and Rybelsus at ${h.usd(mfp('ozempic', 2027))} for 30 days. Extra Help copays rise slightly too.` },
      { q: 'Does the GLP-1 Bridge copay count toward the Part D cap?', a: `No. The ${h.usd(h.M.P.bridge.copay)} a month paid under the Medicare GLP-1 Bridge is outside the Part D benefit, so it does not count toward the ${h.usd(PD(2026).oopCap)} cap and is not reduced by Extra Help. Self-pay purchases on TrumpRx do not count either.` },
      { q: 'When will I reach the Part D cap with Ozempic?', a: `At Ozempic’s list price and under the standard 2026 benefit, in ${monthName(capMonth('ozempic', '1', 2026), 'en')}: the deductible plus 25% of ${capMonth('ozempic', '1', 2026)} fills add up to ${h.usd(PD(2026).oopCap)}. A plan using flat copays may get there later or not at all. From that month, covered drugs cost nothing.` },
    ],
  },
  es: {
    slug: 'tope-parte-d-medicare', nav: 'Tope de la Parte D', card: 'Su parte anual de la Parte D, el mes en que llega al tope, 2026 y 2027',
    title: `Tope de la Parte D de Medicare 2026: ${$es(PD(2026).oopCap)} y ${$es(PD(2027).oopCap)} en 2027`,
    description: `Tope de gastos de la Parte D: ${$es(PD(2026).oopCap)} en 2026 y ${$es(PD(2027).oopCap)} en 2027, deducible de ${$es(PD(2026).deductible)} y ${$es(PD(2027).deductible)}. Su parte anual, el mes en que llega al tope y el plan de pago.`,
    h1: 'Tope de la Parte D de Medicare: su parte anual y el mes en que llega',
    intro: (h) => `La Parte D de Medicare limita lo que paga por los medicamentos cubiertos a ${h.usd(PD(2026).oopCap)} en 2026 y ${h.usd(PD(2027).oopCap)} en 2027; la calculadora muestra cuándo llega.`,
    resume: (h) => `Desde 2025, el beneficio estándar de la Parte D tiene un techo firme de gastos de bolsillo, y CMS ya publicó su nivel para dos años: ${h.usd(PD(2026).oopCap)} en 2026 y ${h.usd(PD(2027).oopCap)} en 2027, en la tabla V-2 del Anuncio de tarifas 2027. Por debajo, paga el deducible del plan, como máximo ${h.usd(PD(2026).deductible)} en 2026 y ${h.usd(PD(2027).deductible)} en 2027, y luego el 25% del costo de cada medicamento cubierto. Cuando su parte, incluidos los pagos que la Ayuda Adicional hace por usted, llega al tope, los medicamentos cubiertos no le cuestan nada el resto del año. Con un GLP-1 a precio de lista el tope llega rápido: un año de Ozempic lo alcanza en ${monthName(capMonth('ozempic', '1', 2026), 'es')} de 2026. En 2027 el precio negociado de la semaglutida, ${h.usd(mfp('ozempic', 2027))}, cambia la cuenta, y el mismo año de Ozempic cuesta unos ${h.usd(partD('ozempic', '1', 2027))}. La calculadora da su parte, el mes del tope y el pago mensual si se inscribe en el Plan de Pago de Recetas de Medicare.`,
    body: (h) => `
<h2>Las tres etapas, con las cifras de 2026 y 2027</h2>
${h.table(['Etapa', '2026', '2027'], [['Deducible, como máximo', h.usd(PD(2026).deductible), h.usd(PD(2027).deductible)], ['Coseguro después del deducible', h.pct(PD(2026).coinsurance, 0), h.pct(PD(2027).coinsurance, 0)], ['Tope de gastos de bolsillo', h.usd(PD(2026).oopCap), h.usd(PD(2027).oopCap)], ['Después del tope', '$0', '$0']], 'Beneficio estándar de la Parte D, Anuncio de tarifas 2027 de CMS, tabla V-2.', ['l', 'r', 'r'])}
<p>Los planes pueden cobrar copagos en vez de coseguro y muchos tienen un deducible menor; ninguno puede pedirle más que el diseño estándar en el año ni superar el tope. La calculadora aplica el diseño estándar, que es el límite superior.</p>
<h2>Qué cuenta para el tope</h2>
<p>Cuenta todo lo que paga por medicamentos cubiertos de la Parte D, deducible incluido, más los pagos hechos en su nombre por la Ayuda Adicional y ciertos programas de asistencia. No cuentan los medicamentos que su plan no cubre, las compras en efectivo fuera del plan con TrumpRx o un programa de autopago, ni el copago de ${h.usd(h.M.P.bridge.copay)} del Medicare GLP-1 Bridge. Por eso pagar en efectivo un medicamento barato puede salir caro a quien de todos modos llegaría al tope.</p>
<h2>Por qué importa el mes del tope</h2>
<p>Con un medicamento caro, toda la parte anual cae en los primeros meses: el deducible en enero y luego una cuarta parte de cada receta hasta el techo. Es un problema de liquidez más que de costo total. La respuesta de Medicare es el Plan de Pago de Recetas, que factura el mismo monto cada mes desde el mes de inscripción; no reduce el total.</p>`,
    faqs: (h) => [
      { q: '¿Cuál es el tope de gastos de la Parte D en 2026?', a: `${h.usd(PD(2026).oopCap)} por año calendario, con el beneficio estándar que publica CMS. Cuando su parte por medicamentos cubiertos lo alcanza, deducible y pagos de la Ayuda Adicional incluidos, no paga nada más por medicamentos cubiertos hasta el 31 de diciembre. Los planes pueden tener un deducible menor, nunca un tope mayor.` },
      { q: '¿Qué cambia en la Parte D en 2027?', a: `El tope sube a ${h.usd(PD(2027).oopCap)} y el deducible máximo a ${h.usd(PD(2027).deductible)}, según el Anuncio de tarifas 2027 de CMS. Quince medicamentos más tienen precio negociado, entre ellos Ozempic, Wegovy y Rybelsus a ${h.usd(mfp('ozempic', 2027))} por 30 días. Los copagos de la Ayuda Adicional suben un poco.` },
      { q: '¿El copago del GLP-1 Bridge cuenta para el tope?', a: `No. Los ${h.usd(h.M.P.bridge.copay)} al mes del Medicare GLP-1 Bridge están fuera del beneficio de la Parte D: no cuentan para el tope de ${h.usd(PD(2026).oopCap)} y la Ayuda Adicional no los reduce. Las compras en efectivo con TrumpRx tampoco cuentan, y la Ayuda Adicional no lo reduce.` },
    ],
  },
});
