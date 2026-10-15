/** Insuline : prix TrumpRx d'un conditionnement et plafond Medicare de 35 $ par mois et par produit. */
import { T, usd } from './_kit';
import ins from '../../data/insulin.json';
import type { MiniSpec } from '../mini-types';
type V = [string | null, string | null, string | null, number, number | null];
const ITEMS = (ins.items as Array<{ s: string; n: string; v: V[] }>).flatMap((x) => x.v.map((v) => ({ name: x.n, form: v[0] ?? '', qty: v[2] ?? '1', trx: v[3], before: v[4] })));
export default (l: 'en' | 'es'): MiniSpec => ({
  title: T(l, 'Your insulin cost a month', 'Su costo de insulina al mes'),
  cta: T(l, 'Search every TrumpRx listing', 'Buscar todas las fichas de TrumpRx'),
  inputs: [
    { id: 'i', label: T(l, 'Insulin and package', 'Insulina y envase'), def: ITEMS.findIndex((x) => /^Lantus/.test(x.name)), options: ITEMS.map((x, i) => ({ value: String(i), label: `${x.name}, ${x.form} × ${x.qty}` })) },
    { id: 'n', label: T(l, 'Packages a month', 'Envases al mes'), def: 1, max: 10 },
  ],
  run: (v) => {
    const x = ITEMS[v.i] ?? ITEMS[0];
    const n = Math.max(0, Math.round(v.n));
    return {
      head: [T(l, 'TrumpRx, a month', 'TrumpRx, al mes'), usd(x.trx * n, l, 0)],
      rows: [[T(l, 'Price before TrumpRx', 'Precio antes de TrumpRx'), x.before ? usd(x.before * n, l, 0) : '–'], [T(l, 'Medicare Part D or B, most you pay', 'Medicare Parte D o B, lo máximo que paga'), usd(35, l, 0)]],
      note: T(l, 'Medicare caps each covered insulin product at $35 for a month’s supply. Estimate only.', 'Medicare limita cada insulina cubierta a $35 por un mes de suministro. Estimación indicativa.'),
    };
  },
});
