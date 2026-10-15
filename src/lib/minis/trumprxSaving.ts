/** TrumpRx : prix TrumpRx face au prix d'origine (WAC) publié sur la même fiche. */
import { T, usd, pct, product } from './_kit';
import { cashPrice, listPrice } from '../engine/index';
import type { MiniSpec } from '../mini-types';
const OPTS = [['wegovy', '2.4'], ['wegovy-pill', '1.5'], ['ozempic', '1'], ['zepbound', 'vial-5'], ['mounjaro', '7.5'], ['foundayo', '9'], ['trulicity', '1.5'], ['xarelto', '20'], ['farxiga', '10'], ['januvia', '50']] as const;
export default (l: 'en' | 'es'): MiniSpec => ({
  title: T(l, 'TrumpRx price against the list price', 'Precio TrumpRx frente al precio de lista'),
  cta: T(l, 'Search every TrumpRx listing', 'Buscar todas las fichas de TrumpRx'),
  inputs: [
    { id: 'd', label: T(l, 'Medicine', 'Medicamento'), def: 0, options: OPTS.map(([p, d], i) => ({ value: String(i), label: `${product(p).name} ${product(p).doses.find((x) => x.id === d)!.label.replace('vial', l === 'es' ? 'frasco' : 'vial')}` })) },
    { id: 'm', label: T(l, 'Months', 'Meses'), def: 12, max: 120 },
  ],
  run: (v) => {
    const [pid, did] = OPTS[v.d];
    const p = product(pid); const d = p.doses.find((x) => x.id === did)!;
    const c = cashPrice(p, d, 2026)!; const w = listPrice(d) ?? c.monthly;
    const m = Math.max(1, Math.round(v.m));
    return {
      head: [T(l, `Saved over ${m} months`, `Ahorro en ${m} meses`), usd((w - c.monthly) * m, l)],
      rows: [[T(l, 'TrumpRx a month', 'TrumpRx al mes'), usd(c.monthly, l, c.monthly < 100 ? 2 : 0)], [T(l, 'List price a month', 'Precio de lista al mes'), usd(w, l, w < 100 ? 2 : 0)], [T(l, 'Discount', 'Descuento'), pct(1 - c.monthly / w, l, 0)]],
      note: T(l, 'Self-pay only: does not count toward a deductible. Estimate only.', 'Solo autopago: no cuenta para el deducible. Estimación indicativa.'),
    };
  },
});
