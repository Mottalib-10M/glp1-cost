/** Règle des 45 jours de LillyDirect : surcoût des renouvellements en retard aux doses hautes. */
import { T, usd, product } from './_kit';
import { cashPrice } from '../engine/index';
import type { MiniSpec } from '../mini-types';
const OPTS = [['zepbound', 'vial-7.5'], ['zepbound', 'vial-10'], ['zepbound', 'vial-15'], ['zepbound', 'kwikpen-10'], ['foundayo', '14.5'], ['foundayo', '17.2']] as const;
export default (l: 'en' | 'es'): MiniSpec => ({
  title: T(l, 'What a late refill costs', 'Lo que cuesta renovar tarde'),
  cta: T(l, 'Price your dose', 'Calcular su dosis'),
  inputs: [
    { id: 'd', label: T(l, 'Medicine and dose', 'Medicamento y dosis'), def: 1, options: OPTS.map(([p, d], i) => ({ value: String(i), label: `${product(p).name} ${product(p).doses.find((x) => x.id === d)!.label.replace('vial', l === 'es' ? 'frasco' : 'vial')}` })) },
    { id: 'n', label: T(l, 'Refills more than 45 days apart in a year', 'Renovaciones con más de 45 días de intervalo en un año'), def: 2, max: 12 },
  ],
  run: (v) => {
    const [pid, did] = OPTS[v.d];
    const p = product(pid); const c = cashPrice(p, p.doses.find((x) => x.id === did)!, 2026)!;
    const n = Math.max(0, Math.min(12, Math.round(v.n)));
    const extra = (c.late ?? c.monthly) - c.monthly;
    return {
      head: [T(l, 'Extra cost over the year', 'Costo adicional en el año'), usd(extra * n, l)],
      rows: [[T(l, 'On-time refill', 'Renovación a tiempo'), usd(c.monthly, l)], [T(l, 'Refill after 45 days', 'Renovación después de 45 días'), usd(c.late ?? c.monthly, l)], [T(l, 'Difference per late refill', 'Diferencia por renovación tardía'), usd(extra, l)]],
      note: T(l, 'Prices published by LillyDirect and TrumpRx. Estimate only.', 'Precios publicados por LillyDirect y TrumpRx. Estimación indicativa.'),
    };
  },
});
