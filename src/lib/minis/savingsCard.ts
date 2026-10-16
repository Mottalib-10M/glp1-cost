/** Cartes d'économies des fabricants (assurance commerciale) : copaiement après la carte, mois et année. */
import { T, usd, product } from './_kit';
import { savingsCardFor, cardCost } from '../engine/index';
import type { MiniSpec } from '../mini-types';
const OPTS = [['wegovy', '2.4'], ['ozempic', '1'], ['zepbound', 'pen-5'], ['mounjaro', '7.5'], ['foundayo', '9'], ['trulicity', '1.5']] as const;
export default (l: 'en' | 'es'): MiniSpec => ({
  title: T(l, 'Your copay after the maker’s savings card', 'Su copago con la tarjeta de ahorro del fabricante'),
  cta: T(l, 'Compare with paying cash', 'Comparar con pagar en efectivo'),
  inputs: [
    { id: 'p', label: T(l, 'Medicine', 'Medicamento'), def: 0, options: OPTS.map(([p], i) => ({ value: String(i), label: p === 'zepbound' ? T(l, 'Zepbound single-dose pen', 'Zepbound, pluma de dosis única') : product(p).name })) },
    { id: 'c', label: T(l, 'Plan copay for one month', 'Copago del plan por un mes'), def: 150, unit: '$', max: 5000 },
  ],
  run: (v) => {
    const [pid, did] = OPTS[v.p] ?? OPTS[0];
    const p = product(pid);
    const c = savingsCardFor(p, p.doses.find((d) => d.id === did))!;
    const k = cardCost(c, v.c);
    const cap = c.maxAnnual != null ? T(l, `Lilly caps the card at ${usd(c.maxAnnual, l)} a year and ${c.maxFills} fills; savings end December 31, 2026.`, `Lilly limita la tarjeta a ${usd(c.maxAnnual, l)} al año y ${c.maxFills} surtidos; el ahorro termina el 31 de diciembre de 2026.`) : T(l, 'Novo Nordisk publishes no yearly cap.', 'Novo Nordisk no publica tope anual.');
    return {
      head: [T(l, 'You pay a month', 'Usted paga al mes'), usd(k.monthly, l)],
      rows: [
        [T(l, 'Saving a month', 'Ahorro al mes'), usd(k.saving, l)],
        [T(l, 'Saving over 12 months', 'Ahorro en 12 meses'), usd(k.yearlySaving, l)],
        [T(l, 'You pay over 12 months', 'Usted paga en 12 meses'), usd(k.yearly, l)],
      ],
      note: `${cap} ${T(l, 'Only when your private plan covers the drug; never with Medicare or Medicaid. Estimate only.', 'Solo si su plan privado cubre el medicamento; nunca con Medicare ni Medicaid. Estimación indicativa.')}`,
    };
  },
});
