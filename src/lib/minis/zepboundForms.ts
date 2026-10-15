/** Zepbound : flacon, KwikPen et stylo unidose au même dosage. */
import { T, usd, product } from './_kit';
import { cashPrice, listPrice, nadacMonth } from '../engine/index';
import type { MiniSpec } from '../mini-types';
const S = ['2.5', '5', '7.5', '10', '12.5', '15'];
export default (l: 'en' | 'es'): MiniSpec => ({
  title: T(l, 'Vial, KwikPen or single-dose pen at your dose', 'Frasco, KwikPen o pluma de dosis única en su dosis'),
  cta: T(l, 'Price Zepbound in full', 'Ver Zepbound en detalle'),
  inputs: [{ id: 's', label: T(l, 'Weekly dose', 'Dosis semanal'), def: 3, options: S.map((s, i) => ({ value: String(i), label: `${s} mg` })) }],
  run: (v) => {
    const p = product('zepbound'); const s = S[v.s];
    const g = (f: string) => p.doses.find((x) => x.id === `${f}-${s}`)!;
    const vial = cashPrice(p, g('vial'), 2026); const kw = cashPrice(p, g('kwikpen'), 2026);
    const pen = nadacMonth(g('pen'));
    return {
      head: [T(l, 'Vial, self-pay', 'Frasco, autopago'), vial ? usd(vial.monthly, l) : '–'],
      rows: [[T(l, 'KwikPen, self-pay', 'KwikPen, autopago'), kw ? usd(kw.monthly, l) : '–'], [T(l, 'KwikPen list price', 'Precio de lista KwikPen'), listPrice(g('kwikpen')) ? usd(listPrice(g('kwikpen'))!, l) : '–'], [T(l, 'Single-dose pen, pharmacy cost', 'Pluma de dosis única, costo de farmacia'), pen ? usd(pen.monthly, l) : '–']],
      note: T(l, 'Only the KwikPen is in the Medicare GLP-1 Bridge. Estimate only.', 'Solo la KwikPen entra en el Medicare GLP-1 Bridge. Estimación indicativa.'),
    };
  },
});
