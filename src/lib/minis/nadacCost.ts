/** NADAC : ce que paie la pharmacie pour un mois de traitement, face au prix d'autopago. */
import { T, usd, product } from './_kit';
import { nadacMonth, cashPrice, listPrice } from '../engine/index';
import type { MiniSpec } from '../mini-types';
const OPTS = [['ozempic', '1'], ['wegovy', '2.4'], ['wegovy-pill', '25'], ['zepbound', 'kwikpen-10'], ['zepbound', 'pen-10'], ['mounjaro', '7.5'], ['foundayo', '9'], ['rybelsus', '7'], ['trulicity', '1.5']] as const;
export default (l: 'en' | 'es'): MiniSpec => ({
  title: T(l, 'What the pharmacy pays, and what you pay', 'Lo que paga la farmacia y lo que paga usted'),
  cta: T(l, 'See every way of paying', 'Ver todas las formas de pago'),
  inputs: [{ id: 'd', label: T(l, 'Medicine and dose', 'Medicamento y dosis'), def: 1, options: OPTS.map(([p, d], i) => ({ value: String(i), label: `${product(p).name} ${product(p).doses.find((x) => x.id === d)!.label.replace('single-dose pen', l === 'es' ? 'pluma de dosis única' : 'single-dose pen')}` })) }],
  run: (v) => {
    const [pid, did] = OPTS[v.d];
    const p = product(pid); const d = p.doses.find((x) => x.id === did)!;
    const n = nadacMonth(d); const c = cashPrice(p, d, 2026); const w = listPrice(d);
    return {
      head: [T(l, 'Pharmacy cost for one month', 'Costo de la farmacia por un mes'), n ? usd(n.monthly, l) : '–'],
      rows: [[T(l, `NADAC per ${n?.unit === 'ML' ? 'mL' : T(l, 'tablet', 'comprimido')}`, `NADAC por ${n?.unit === 'ML' ? 'mL' : 'comprimido'}`), n ? usd(n.perUnit, l, 2) : '–'], [T(l, 'Self-pay price', 'Precio de autopago'), c ? usd(c.monthly, l) : T(l, 'none', 'ninguno')], [T(l, 'List price', 'Precio de lista'), w ? usd(w, l) : '–']],
      note: T(l, 'Weekly CMS survey of retail pharmacy invoices. Estimate only.', 'Encuesta semanal de CMS sobre facturas de farmacias. Estimación indicativa.'),
    };
  },
});
