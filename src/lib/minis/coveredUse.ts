/** Couverture Medicare selon l'usage prescrit : Partie D, GLP-1 Bridge, ou rien (prix d'autopago). */
import { T, usd, productOpts, product } from './_kit';
import { compute } from '../engine/index';
import type { MiniSpec } from '../mini-types';
const IDS = ['wegovy', 'zepbound', 'ozempic', 'mounjaro', 'foundayo'];
// Usage → produit qui l'a sur sa notice (FDA) et que CMS reconnaît pour la Partie D.
const USES = { en: ['Type 2 diabetes', 'Heart risk with heart disease', 'Sleep apnea (moderate to severe)', 'MASH liver disease', 'Weight loss only'], es: ['Diabetes tipo 2', 'Riesgo cardíaco con enfermedad cardíaca', 'Apnea del sueño (moderada a grave)', 'Enfermedad hepática MASH', 'Solo bajar de peso'] };
const COVERED: Record<string, number[]> = { wegovy: [1, 3], zepbound: [2], ozempic: [0, 1], mounjaro: [0, 1], foundayo: [] };
export default (l: 'en' | 'es'): MiniSpec => ({
  title: T(l, 'Which Medicare route your prescription takes', 'Qué vía de Medicare sigue su receta'),
  cta: T(l, 'Price it in the full calculator', 'Calcularlo en la calculadora completa'),
  inputs: [
    { id: 'p', label: T(l, 'Medicine', 'Medicamento'), def: 0, options: productOpts(IDS, l) },
    { id: 'u', label: T(l, 'Prescribed for', 'Recetado para'), def: 4, options: USES[l].map((u, i) => ({ value: String(i), label: u })) },
  ],
  run: (v) => {
    const p = product(IDS[v.p]);
    const covered = COVERED[p.id].includes(v.u);
    const weight = v.u === 4;
    const base = { product: p.id, dose: p.id === 'zepbound' ? 'kwikpen-10' : p.defaultDose, year: 2026 as const, newPatient: false, onTime: true, copay: 0, extraHelp: 'none' as const, medicaidCopay: 4 };
    const r = covered ? compute({ ...base, coverage: 'partd' }) : compute({ ...base, coverage: 'weightonly' });
    const route = covered ? T(l, 'Part D plan', 'Plan de la Parte D') : weight && r.rule === 'bridge' ? 'GLP-1 Bridge' : T(l, 'Not covered: self-pay', 'Sin cobertura: autopago');
    return {
      head: [T(l, 'Route', 'Vía'), route],
      rows: [[T(l, 'Your cost a month (2026)', 'Su costo al mes (2026)'), r.monthly === null ? '–' : usd(r.monthly, l)], [T(l, 'Your cost for the year', 'Su costo en el año'), r.yearly === null ? '–' : usd(r.yearly, l)]],
      note: covered ? T(l, 'Standard Part D benefit at the published cost basis; plans may use copays.', 'Beneficio estándar de la Parte D; los planes pueden cobrar copagos.') : T(l, 'A use not on the label is not a Part D use. Estimate only.', 'Un uso que no figura en la ficha no es un uso de la Parte D. Estimación indicativa.'),
    };
  },
});
