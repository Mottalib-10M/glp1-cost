/** Première année au comptant en suivant l'escalade de dose de la notice (une marche par mois). */
import { T, usd, product } from './_kit';
import { cashPrice } from '../engine/index';
import type { MiniSpec } from '../mini-types';
// Escalade de la notice FDA : une marche toutes les 4 semaines (injections) ou 30 jours (comprimés).
const PLANS: Array<{ id: string; en: string; es: string; steps: string[] }> = [
  { id: 'wegovy', en: 'Wegovy injection, up to 2.4 mg', es: 'Wegovy inyectable, hasta 2.4 mg', steps: ['0.25', '0.5', '1', '1.7', '2.4'] },
  { id: 'wegovy-pill', en: 'Wegovy pill, up to 25 mg', es: 'Wegovy en pastilla, hasta 25 mg', steps: ['1.5', '4', '9', '25'] },
  { id: 'ozempic', en: 'Ozempic, up to 1 mg', es: 'Ozempic, hasta 1 mg', steps: ['0.25', '0.5', '1'] },
  { id: 'zepbound', en: 'Zepbound vial, up to 5 mg', es: 'Zepbound en frasco, hasta 5 mg', steps: ['vial-2.5', 'vial-5'] },
  { id: 'zepbound', en: 'Zepbound vial, up to 10 mg', es: 'Zepbound en frasco, hasta 10 mg', steps: ['vial-2.5', 'vial-5', 'vial-7.5', 'vial-10'] },
  { id: 'zepbound', en: 'Zepbound vial, up to 15 mg', es: 'Zepbound en frasco, hasta 15 mg', steps: ['vial-2.5', 'vial-5', 'vial-7.5', 'vial-10', 'vial-12.5', 'vial-15'] },
  { id: 'foundayo', en: 'Foundayo, up to 9 mg', es: 'Foundayo, hasta 9 mg', steps: ['0.8', '2.5', '5.5', '9'] },
  { id: 'foundayo', en: 'Foundayo, up to 17.2 mg', es: 'Foundayo, hasta 17.2 mg', steps: ['0.8', '2.5', '5.5', '9', '14.5', '17.2'] },
];
/** Coût de 12 mois : marches de l'escalade puis dose d'entretien ; offre de bienvenue Novo sur les deux premiers mois. */
export function firstYear(planIndex: number, newPatient: boolean): { total: number; first: number; maintenance: number } {
  const plan = PLANS[planIndex];
  const p = product(plan.id);
  let total = 0; let first = 0; let maint = 0;
  for (let m = 0; m < 12; m++) {
    const d = p.doses.find((x) => x.id === plan.steps[Math.min(m, plan.steps.length - 1)])!;
    const c = cashPrice(p, d, 2026)!;
    const price = newPatient && c.intro && m < c.intro.fills ? c.intro.price : c.monthly;
    if (m === 0) first = price;
    maint = c.monthly;
    total += price;
  }
  return { total, first, maintenance: maint };
}
export default (l: 'en' | 'es'): MiniSpec => ({
  title: T(l, 'Your first 12 months, paying cash', 'Sus primeros 12 meses, pagando en efectivo'),
  cta: T(l, 'Price one dose in the calculator', 'Ver una dosis en la calculadora'),
  inputs: [
    { id: 'p', label: T(l, 'Medicine and target dose', 'Medicamento y dosis objetivo'), def: 0, options: PLANS.map((x, i) => ({ value: String(i), label: l === 'es' ? x.es : x.en })) },
    { id: 'n', label: T(l, 'New to the drug?', '¿Nuevo con el medicamento?'), def: 1, options: [{ value: '1', label: T(l, 'Yes', 'Sí') }, { value: '0', label: T(l, 'No', 'No') }] },
  ],
  run: (v) => {
    const r = firstYear(v.p, v.n === 1);
    return {
      head: [T(l, 'First 12 months', 'Primeros 12 meses'), usd(r.total, l)],
      rows: [[T(l, 'Month one', 'Primer mes'), usd(r.first, l)], [T(l, 'Average a month', 'Promedio al mes'), usd(r.total / 12, l)], [T(l, 'At the target dose', 'En la dosis objetivo'), usd(r.maintenance, l)]],
      note: T(l, 'One dose step a month, as the label describes; your prescriber may go slower. Estimate only.', 'Un escalón de dosis por mes, como indica la ficha; su médico puede ir más despacio. Estimación indicativa.'),
    };
  },
});
