/** Plan de paiement Medicare : le reste à charge de l'année réparti en mensualités égales. */
import { T, usd, monthsOpts } from './_kit';
import { partDYear, paymentPlanMonthly, P } from '../engine/index';
import type { MiniSpec } from '../mini-types';
export default (l: 'en' | 'es'): MiniSpec => ({
  title: T(l, 'Your monthly bill with the Payment Plan', 'Su pago mensual con el Plan de Pago'),
  cta: T(l, 'Work out your Part D share', 'Calcular su parte de la Parte D'),
  inputs: [
    { id: 'c', label: T(l, 'Drug cost a month (full price)', 'Costo del medicamento al mes (precio completo)'), def: 1028, unit: '$', max: 50000 },
    { id: 's', label: T(l, 'Joining in', 'Se inscribe en'), def: 1, options: monthsOpts(l) },
  ],
  run: (v) => {
    const y = partDYear(12 * v.c, 2026);
    const first = Math.min(P.partD['2026'].oopCap, Math.min(v.c, P.partD['2026'].deductible) + 0.25 * Math.max(0, v.c - P.partD['2026'].deductible));
    return {
      head: [T(l, 'Each monthly bill', 'Cada pago mensual'), usd(paymentPlanMonthly(y.oop, v.s), l)],
      rows: [[T(l, 'Your 2026 share for the year', 'Su parte anual 2026'), usd(y.oop, l)], [T(l, 'Paid at the counter in month one without the plan', 'Pagado en el mostrador el primer mes sin el plan'), usd(first, l)]],
      note: T(l, 'The plan spreads costs; it does not lower them. Estimate only.', 'El plan reparte los costos; no los reduce. Estimación indicativa.'),
    };
  },
});
