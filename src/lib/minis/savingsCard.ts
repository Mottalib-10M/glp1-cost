/** Carte d'économies Novo Nordisk (assurance commerciale) : copaiement après la carte. */
import { T, usd, product } from './_kit';
import { novoCard } from '../engine/index';
import type { MiniSpec } from '../mini-types';
export default (l: 'en' | 'es'): MiniSpec => ({
  title: T(l, 'Your copay after the Novo Nordisk savings card', 'Su copago con la tarjeta de ahorro de Novo Nordisk'),
  cta: T(l, 'Compare with paying cash', 'Comparar con pagar en efectivo'),
  inputs: [{ id: 'c', label: T(l, 'Plan copay for one month', 'Copago del plan por un mes'), def: 150, unit: '$', max: 5000 }],
  run: (v) => {
    const after = novoCard(product('wegovy'), v.c) ?? v.c;
    return {
      head: [T(l, 'You pay a month', 'Usted paga al mes'), usd(after, l)],
      rows: [[T(l, 'Saving a month', 'Ahorro al mes'), usd(v.c - after, l)], [T(l, 'Saving over 12 months', 'Ahorro en 12 meses'), usd(12 * (v.c - after), l)]],
      note: T(l, 'Only when your private plan covers the drug; never with Medicare or Medicaid. Estimate only.', 'Solo si su plan privado cubre el medicamento; nunca con Medicare ni Medicaid. Estimación indicativa.'),
    };
  },
});
