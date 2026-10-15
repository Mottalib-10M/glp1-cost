import { definePage } from '../../lib/page-types';
import { range, list, nadac, mfp, BR, asOf, $en, $es } from './_util';
import { PRODUCTS, cashPrice, listPrice, nadacMonth, mfp as mfpOf, bridgeEligible, type ProductDef } from '../../lib/engine/index';

const GLP = PRODUCTS.filter((p) => p.group === 'glp1');
const fmtRange = (h: { usd: (n: number) => string }, p: ProductDef, f: (p: ProductDef) => number[]) => { const xs = f(p).filter((x) => Number.isFinite(x)); if (!xs.length) return '–'; const a = Math.min(...xs); const b = Math.max(...xs); return a === b ? h.usd(a) : `${h.usd(a)} to ${h.usd(b)}`; };
const cashes = (p: ProductDef) => p.doses.map((d) => cashPrice(p, d, 2026)?.monthly ?? NaN);
const lists = (p: ProductDef) => p.doses.map((d) => listPrice(d) ?? NaN);
const nadacs = (p: ProductDef) => p.doses.map((d) => nadacMonth(d)?.monthly ?? NaN);
const rowsOf = (h: { usd: (n: number) => string }, es = false) => GLP.map((p) => [es ? p.name.replace(/ pill$/, ' en pastilla') : p.name, fmtRange(h, p, cashes).replace(' to ', es ? ' a ' : ' to '), fmtRange(h, p, lists).replace(' to ', es ? ' a ' : ' to '), fmtRange(h, p, nadacs).replace(' to ', es ? ' a ' : ' to '), mfpOf(p, 2027) ? h.usd(mfpOf(p, 2027)!) : '–', p.doses.some((d) => bridgeEligible(p, d)) ? h.usd(BR.copay) : '–']);

export default definePage({
  id: 'glp-1-price-comparison', group: 'compare', order: 30,
  tool: { kind: 'compare', a: 'ozempic-pill', b: 'wegovy-pill', doseA: '4', doseB: '4' },
  related: ['wegovy-vs-zepbound-cost', 'ozempic-vs-mounjaro-cost', 'ozempic-vs-wegovy-cost', 'wegovy-pill-vs-foundayo-cost', 'glp-1-cost-first-year'],
  sources: ['trumprx', 'novocarePharmacy', 'lillyZepbound', 'nadac', 'cmsNegotiation', 'cmsBridge'],
  en: {
    slug: 'glp-1-price-comparison', nav: 'GLP-1 price comparison', card: 'Every GLP-1 side by side: cash, list, pharmacy cost, Medicare 2027, Bridge',
    title: 'GLP-1 Price Comparison 2026: Every Drug, Dose and Channel',
    description: `GLP-1 price comparison for 2026: Ozempic, Wegovy, Zepbound, Mounjaro, Foundayo, Rybelsus and Trulicity by dose, from ${$en(range('wegovy-pill')[0])} a month in cash to list price.`,
    h1: 'GLP-1 price comparison: every drug, dose and way of paying',
    intro: (h) => `Pick any two GLP-1 drugs and doses: the comparison prices both for the same way of paying and gives the yearly difference.`,
    resume: (h) => `Comparing GLP-1 prices only works when both drugs are priced the same way. Cash prices published by the makers on TrumpRx now range from ${h.usd(range('wegovy-pill')[0])} a month, for the starting strengths of the Wegovy pill, the Ozempic pill and Foundayo, to ${h.usd(range('mounjaro')[1])} for Mounjaro at any dose; list prices run from ${h.usd(list('foundayo', '9'))} for Foundayo to ${h.usd(list('wegovy', '2.4'))} for Wegovy, and what pharmacies pay, according to the NADAC survey, follows the list price closely. Medicare adds two prices of its own: the negotiated ${h.usd(mfp('ozempic', 2027))} for semaglutide products from 2027, and the ${h.usd(BR.copay)} Bridge copay for Wegovy, Zepbound KwikPen and Foundayo prescribed for weight management. The table below sets every GLP-1 we price on one grid, and the comparison tool above takes any two drugs at the doses you choose.`,
    body: (h) => `
<h2>All GLP-1 drugs on one grid</h2>
${h.table(['Drug', 'Self-pay a month', 'List price', 'Pharmacy cost (NADAC)', 'Medicare 2027', 'Medicare Bridge'], rowsOf(h), `Ranges across doses, one month each. Read on TrumpRx and the makers’ pages on ${h.date(asOf())}.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Comparing like with like</h2>
<p>Three traps make most online comparisons misleading. The first is mixing channels: setting one drug’s list price against another’s self-pay price. The second is comparing a starting dose with a maintenance dose; on the Wegovy pill, Ozempic pill and Foundayo the price climbs with the strength, while Wegovy pens, Mounjaro and Trulicity are flat. The third is ignoring the conditions attached: Novo Nordisk’s ${h.usd(h.M.P.makerOffers.novoIntro.price)} first-two-months offer ends on December 31, 2026, and Lilly’s top prices hold only for refills within 45 days. The comparison tool keeps the channel and year identical for both drugs and uses the regular price, so the difference it shows is the lasting one.</p>
<h2>Price is not equivalence</h2>
<p>Drugs on the same row of a table are not interchangeable. Ozempic, Mounjaro, Rybelsus and Trulicity are approved for type 2 diabetes; Wegovy, Zepbound and Foundayo for weight reduction, with heart, sleep apnea or liver indications for some. Insurers and Medicare cover by indication, so the cheaper drug in cash may be the more expensive one for you once coverage is applied. Use the comparison to understand the money; leave the choice of drug to your prescriber.</p>`,
    faqs: (h) => [
      { q: 'Which GLP-1 is cheapest without insurance in 2026?', a: `The starting strengths of three tablets share the lowest self-pay price, ${h.usd(range('wegovy-pill')[0])} a month: the Wegovy pill at 1.5 mg, the Ozempic pill at 1.5 mg and Foundayo at 0.8 mg. At maintenance doses the cheapest cash options sit around ${h.usd(range('wegovy-pill')[1])}.` },
      { q: 'Which GLP-1 has the lowest list price?', a: `Among the drugs priced here, Foundayo’s list price is ${h.usd(list('foundayo', '9'))} a month and the Zepbound KwikPen’s starts at ${h.usd(list('zepbound', 'kwikpen-2.5'))}, both well under Wegovy’s ${h.usd(list('wegovy', '2.4'))}. List prices matter mainly to uninsured buyers who pay without a program. Self-pay prices, not list prices, are what most cash buyers actually pay.` },
      { q: 'Why do pharmacies charge so much more than the self-pay price?', a: `Because they buy at close to list price: NADAC puts Wegovy 2.4 mg at about ${h.usd(nadac('wegovy', '2.4'))} a box for the pharmacy. The self-pay price only applies through the maker’s program or the TrumpRx coupon, so ask for it by name.` },
    ],
  },
  es: {
    slug: 'comparar-precios-glp-1', nav: 'Comparar precios GLP-1', card: 'Todos los GLP-1 lado a lado: efectivo, lista, costo de farmacia, Medicare 2027, Bridge',
    title: 'Comparar precios GLP-1 2026: cada medicamento y dosis',
    description: `Comparación de precios GLP-1 en 2026: Ozempic, Wegovy, Zepbound, Mounjaro, Foundayo, Rybelsus y Trulicity por dosis, de ${$es(range('wegovy-pill')[0])} al mes en efectivo a más de ${$es(list('wegovy', '2.4'))}.`,
    h1: 'Comparación de precios de los GLP-1: medicamento, dosis y forma de pago',
    intro: () => 'Elija dos medicamentos GLP-1 y sus dosis: la comparación los calcula con la misma forma de pago y le da la diferencia anual.',
    resume: (h) => `Comparar precios de GLP-1 solo tiene sentido si los dos medicamentos se calculan de la misma manera. Los precios en efectivo que publican los fabricantes en TrumpRx van hoy de ${h.usd(range('wegovy-pill')[0])} al mes, para las concentraciones iniciales de Wegovy en pastilla, Ozempic en pastilla y Foundayo, a ${h.usd(range('mounjaro')[1])} por Mounjaro en cualquier dosis; los precios de lista van de ${h.usd(list('foundayo', '9'))} para Foundayo a ${h.usd(list('wegovy', '2.4'))} para Wegovy, y lo que pagan las farmacias según la encuesta NADAC sigue de cerca el precio de lista. Medicare añade dos precios propios: los ${h.usd(mfp('ozempic', 2027))} negociados para la semaglutida desde 2027 y el copago de ${h.usd(BR.copay)} del Bridge para Wegovy, Zepbound KwikPen y Foundayo recetados para controlar el peso. La tabla reúne todos los GLP-1 que calculamos y la herramienta compara dos medicamentos en las dosis que usted elija.`,
    body: (h) => `
<h2>Todos los GLP-1 en una tabla</h2>
${h.table(['Medicamento', 'Autopago al mes', 'Precio de lista', 'Costo farmacia (NADAC)', 'Medicare 2027', 'Bridge de Medicare'], rowsOf(h, true), `Rangos según la dosis, un mes cada uno. Leído en TrumpRx y en las páginas de los fabricantes el ${h.date(asOf())}.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Comparar lo comparable</h2>
<p>Tres trampas hacen engañosas la mayoría de las comparaciones. La primera es mezclar canales: oponer el precio de lista de un medicamento al precio de autopago de otro. La segunda es comparar una dosis inicial con una de mantenimiento; en Wegovy en pastilla, Ozempic en pastilla y Foundayo el precio sube con la concentración, mientras que las plumas de Wegovy, Mounjaro y Trulicity tienen un precio fijo. La tercera es olvidar las condiciones: la oferta de ${h.usd(h.M.P.makerOffers.novoIntro.price)} de los dos primeros meses de Novo Nordisk termina el 31 de diciembre de 2026, y los precios más altos de Lilly solo valen si renueva dentro de 45 días. La herramienta mantiene el mismo canal y el mismo año para los dos medicamentos y usa el precio normal.</p>
<h2>Precio no es equivalencia</h2>
<p>Dos medicamentos en la misma fila no son intercambiables. Ozempic, Mounjaro, Rybelsus y Trulicity están aprobados para la diabetes tipo 2; Wegovy, Zepbound y Foundayo para reducir el peso, y algunos tienen indicaciones cardíacas, de apnea del sueño o hepáticas. Los seguros y Medicare cubren según la indicación, así que el más barato en efectivo puede salirle más caro con cobertura. La elección del medicamento le corresponde a su médico.</p>`,
    faqs: (h) => [
      { q: '¿Cuál es el GLP-1 más barato sin seguro en 2026?', a: `Las concentraciones iniciales de tres comprimidos comparten el precio de autopago más bajo, ${h.usd(range('wegovy-pill')[0])} al mes: Wegovy en pastilla de 1.5 mg, Ozempic en pastilla de 1.5 mg y Foundayo de 0.8 mg. En dosis de mantenimiento, las opciones más baratas rondan los ${h.usd(range('wegovy-pill')[1])}.` },
      { q: '¿Qué GLP-1 tiene el precio de lista más bajo?', a: `Entre los medicamentos calculados aquí, el precio de lista de Foundayo es de ${h.usd(list('foundayo', '9'))} al mes y el de la KwikPen de Zepbound empieza en ${h.usd(list('zepbound', 'kwikpen-2.5'))}, muy por debajo de los ${h.usd(list('wegovy', '2.4'))} de Wegovy. Quien paga en efectivo con los programas paga mucho menos.` },
      { q: '¿Por qué la farmacia cobra mucho más que el precio de autopago?', a: `Porque compra cerca del precio de lista: NADAC sitúa Wegovy de 2.4 mg en unos ${h.usd(nadac('wegovy', '2.4'))} por caja para la farmacia. El precio de autopago solo se aplica con el programa del fabricante o el cupón de TrumpRx: pídalo por su nombre.` },
    ],
  },
});
