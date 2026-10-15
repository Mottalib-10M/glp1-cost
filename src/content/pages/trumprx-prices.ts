import { definePage } from '../../lib/page-types';
import catalog from '../../data/trumprx-catalog.json';
import { cash, list } from './_util';

type V = [string | null, string | null, string | null, number, number | null];
const C = catalog as unknown as { retrieved_at: string; count: number; items: Array<{ s: string; n: string; gen: boolean; v: V[] }> };
const brands = C.items.filter((x) => !x.gen);
const generics = C.items.filter((x) => x.gen);
const best = (x: { v: V[] }) => x.v.reduce((a, b) => (b[3] < a[3] ? b : a), x.v[0]);
const deepest = brands.map((x) => ({ n: x.n, b: best(x) })).filter((x) => x.b[4] && x.b[4] > x.b[3]).sort((a, z) => (z.b[4]! - z.b[3]) / z.b[4]! - (a.b[4]! - a.b[3]) / a.b[4]!);
const at35 = brands.filter((x) => best(x)[3] === 35).length;

export default definePage({
  id: 'trumprx-prices', group: 'guides', order: 60,
  tool: { kind: 'catalog' },
  related: ['trumprx-vs-novocare-lillydirect', 'insulin-cost', 'glp-1-price-comparison', 'farxiga-cost', 'xarelto-cost'],
  sources: ['trumprx', 'trumprxBrowse', 'trumprxSitemap', 'medicarePartDCosts'],
  en: {
    slug: 'trumprx-prices', nav: 'TrumpRx price list', card: 'Every TrumpRx listing searchable: brand deals and generics with the original price',
    title: `TrumpRx Prices 2026: Search All ${C.count} Listed Medicines`,
    description: `TrumpRx prices in 2026: search all ${C.count} medicines on TrumpRx.gov, ${brands.length} brand deals and ${generics.length} generics, with the TrumpRx price, the original price and the discount.`,
    h1: 'TrumpRx prices: the full list, searchable',
    intro: (h) => `TrumpRx.gov lists ${h.num(C.count)} medicines; type a name to see the TrumpRx price next to the original price and the discount.`,
    resume: (h) => `TrumpRx.gov is the federal site that lists prescription drugs at prices negotiated by the administration with manufacturers, together with generic prices offered by retail pharmacies. Its pages are public, and we read every one of them from the site’s map: on ${h.date(C.retrieved_at)} it held ${h.num(C.count)} listings, ${h.num(brands.length)} for brand-name drugs and ${h.num(generics.length)} for generics. For each we keep the lowest TrumpRx price and the “original price” shown beside it, which TrumpRx defines for brand drugs as the wholesale acquisition cost. ${h.num(at35)} brand listings, mostly insulins, sit at $35. The deepest discounts on brand drugs reach ${h.pct(1 - deepest[0].b[3] / deepest[0].b[4]!, 0)}, as with ${deepest[0].n}. The GLP-1 listings match the makers’ own self-pay prices, Wegovy pens at ${h.usd(cash('wegovy', '2.4'))} against ${h.usd(list('wegovy', '2.4'))}. TrumpRx prices are self-pay: they do not go through insurance and do not count toward a deductible or the Medicare cap.`,
    body: (h) => `
<h2>How TrumpRx works</h2>
<p>TrumpRx does not sell anything itself. For brand drugs it either shows a coupon that a retail pharmacy scans, with fixed processing codes, or sends you to the manufacturer’s own pharmacy program, as it does for Lilly drugs through LillyDirect. For generics it shows prices offered by participating retail pharmacies near the zip code you enter. In every case you need a valid prescription, and the terms ask anyone with Medicare, Medicaid or other government coverage not to seek reimbursement for the purchase.</p>
<h2>The biggest brand-name discounts</h2>
${h.table(['Medicine', 'TrumpRx', 'Original price', 'Discount'], deepest.slice(0, 12).map((x) => [x.n, h.usd(x.b[3], x.b[3] < 100 ? 2 : 0), h.usd(x.b[4]!, x.b[4]! < 100 ? 2 : 0), h.pct(1 - x.b[3] / x.b[4]!, 0)]), `Lowest listed package per medicine, read on TrumpRx.gov on ${h.date(C.retrieved_at)}.`, ['l', 'r', 'r', 'r'])}
<h2>When TrumpRx is not the cheapest route</h2>
<p>For someone with insurance that covers the drug, a plan copay is often lower, and it counts toward the deductible and out-of-pocket limits. On Medicare, purchases outside the plan do not count toward the ${h.usd(h.M.P.partD['2026'].oopCap)} Part D cap; someone who will reach the cap anyway gains nothing by paying cash. The ${h.a('trumprx-vs-novocare-lillydirect', 'TrumpRx, NovoCare and LillyDirect guide')} compares the routes for the GLP-1 drugs.</p>`,
    faqs: (h) => [
      { q: 'How many medicines are on TrumpRx?', a: `${h.num(C.count)} listings on ${h.date(C.retrieved_at)}: ${h.num(brands.length)} brand-name drugs at negotiated prices and ${h.num(generics.length)} generics with pharmacy prices. We reread the full list every week from the site map of TrumpRx.gov, so new deals appear here within days. Search by brand or generic name in the tool above.` },
      { q: 'Can I use insurance with TrumpRx prices?', a: 'No. TrumpRx prices are self-pay. The terms say you must not ask your insurer or a government program to pay you back, and the purchase does not count toward a deductible or out-of-pocket maximum. Check your plan copay first; it may be lower.' },
      { q: 'Is the TrumpRx price the same as the manufacturer’s self-pay price?', a: `For the GLP-1 drugs, yes: Wegovy at ${h.usd(cash('wegovy', '2.4'))}, Zepbound vials from ${h.usd(cash('zepbound', 'vial-2.5'))} and Foundayo from ${h.usd(cash('foundayo', '0.8'))} are the prices NovoCare Pharmacy and LillyDirect publish. TrumpRx is a way in, not a separate discount. Ask for it by name at the pharmacy.` },
    ],
  },
  es: {
    slug: 'precios-trumprx', nav: 'Lista de precios TrumpRx', card: 'Todas las fichas de TrumpRx, con buscador: medicamentos de marca y genéricos',
    title: `Precios de TrumpRx 2026: busque los ${C.count} medicamentos`,
    description: `Precios de TrumpRx en 2026: busque los ${C.count} medicamentos de TrumpRx.gov, ${brands.length} acuerdos de marca y ${generics.length} genéricos, con precio TrumpRx, precio original y descuento.`,
    h1: 'Precios de TrumpRx: la lista completa, con buscador',
    intro: (h) => `TrumpRx.gov publica ${h.num(C.count)} medicamentos; escriba un nombre para ver el precio TrumpRx junto al precio original y el descuento.`,
    resume: (h) => `TrumpRx.gov es el sitio federal que publica medicamentos con receta a precios negociados por el gobierno con los fabricantes, además de precios de genéricos ofrecidos por farmacias. Sus páginas son públicas y las leemos todas a partir del mapa del sitio: el ${h.date(C.retrieved_at)} había ${h.num(C.count)} fichas, ${h.num(brands.length)} de medicamentos de marca y ${h.num(generics.length)} de genéricos. De cada una guardamos el precio TrumpRx más bajo y el «precio original» que aparece al lado, que TrumpRx define para los medicamentos de marca como el costo mayorista. ${h.num(at35)} fichas de marca, sobre todo insulinas, cuestan $35. Los mayores descuentos en marcas llegan al ${h.pct(1 - deepest[0].b[3] / deepest[0].b[4]!, 0)}, como en ${deepest[0].n}. Las fichas de los GLP-1 coinciden con los precios de autopago de los fabricantes: las plumas de Wegovy a ${h.usd(cash('wegovy', '2.4'))} frente a ${h.usd(list('wegovy', '2.4'))}. Los precios de TrumpRx son de autopago: no pasan por el seguro y no cuentan para el deducible ni para el tope de Medicare.`,
    body: (h) => `
<h2>Cómo funciona TrumpRx</h2>
<p>TrumpRx no vende nada. Para los medicamentos de marca muestra un cupón que la farmacia escanea, con códigos de procesamiento fijos, o lo envía al programa de farmacia del fabricante, como hace con los medicamentos de Lilly en LillyDirect. Para los genéricos muestra precios de farmacias participantes cerca del código postal que usted indique. Siempre se necesita una receta válida, y las condiciones piden a quien tiene Medicare, Medicaid u otra cobertura pública que no pida el reembolso de la compra.</p>
<h2>Los mayores descuentos de marca</h2>
${h.table(['Medicamento', 'TrumpRx', 'Precio original', 'Descuento'], deepest.slice(0, 12).map((x) => [x.n, h.usd(x.b[3], x.b[3] < 100 ? 2 : 0), h.usd(x.b[4]!, x.b[4]! < 100 ? 2 : 0), h.pct(1 - x.b[3] / x.b[4]!, 0)]), `Envase más barato de cada medicamento, leído en TrumpRx.gov el ${h.date(C.retrieved_at)}.`, ['l', 'r', 'r', 'r'])}
<h2>Cuándo TrumpRx no es la vía más barata</h2>
<p>Con un seguro que cubre el medicamento, el copago del plan suele ser menor y cuenta para el deducible y los límites de gastos. Con Medicare, las compras fuera del plan no cuentan para el tope de ${h.usd(h.M.P.partD['2026'].oopCap)} de la Parte D; quien va a llegar al tope de todos modos no gana nada pagando en efectivo.</p>`,
    faqs: (h) => [
      { q: '¿Cuántos medicamentos hay en TrumpRx?', a: `${h.num(C.count)} fichas el ${h.date(C.retrieved_at)}: ${h.num(brands.length)} medicamentos de marca a precios negociados y ${h.num(generics.length)} genéricos con precios de farmacia. Releemos la lista completa cada semana a partir del mapa del sitio de TrumpRx.gov. Busque por nombre de marca o genérico en la herramienta.` },
      { q: '¿Puedo usar mi seguro con los precios de TrumpRx?', a: 'No. Los precios de TrumpRx son de autopago. Las condiciones dicen que no debe pedir el reembolso a su aseguradora ni a un programa público, y la compra no cuenta para el deducible ni para el máximo de gastos. Compare antes con su copago.' },
      { q: '¿El precio TrumpRx es el mismo que el del fabricante?', a: `Para los GLP-1, sí: Wegovy a ${h.usd(cash('wegovy', '2.4'))}, los frascos de Zepbound desde ${h.usd(cash('zepbound', 'vial-2.5'))} y Foundayo desde ${h.usd(cash('foundayo', '0.8'))} son los precios que publican NovoCare Pharmacy y LillyDirect. TrumpRx es una puerta de entrada, no un descuento aparte. Pídalo por su nombre en la farmacia.` },
    ],
  },
});
