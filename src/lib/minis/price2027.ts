/** 2026 face à 2027 : prix négocié Medicare de la sémaglutide, paramètres de la Partie D, fin des offres temporaires. */
import { T, usd, product } from './_kit';
import { compute, type Coverage } from '../engine/index';
import type { MiniSpec } from '../mini-types';
const OPTS = [['ozempic', '1'], ['wegovy', '2.4'], ['rybelsus', '7'], ['foundayo', '2.5'], ['eliquis', '5'], ['jardiance', '10']] as const;
export default (l: 'en' | 'es'): MiniSpec => ({
  title: T(l, '2026 against 2027 for one drug', '2026 frente a 2027 para un medicamento'),
  cta: T(l, 'Run your own case', 'Calcular su caso'),
  inputs: [
    { id: 'd', label: T(l, 'Medicine', 'Medicamento'), def: 0, options: OPTS.map(([p, d], i) => ({ value: String(i), label: `${product(p).name} ${product(p).doses.find((x) => x.id === d)!.label}` })) },
    { id: 'c', label: T(l, 'How you pay', 'Cómo paga'), def: 1, options: [{ value: '0', label: T(l, 'Cash (self-pay)', 'Efectivo (autopago)') }, { value: '1', label: T(l, 'Medicare Part D, covered use', 'Parte D de Medicare, uso cubierto') }] },
  ],
  run: (v) => {
    const [pid, did] = OPTS[v.d];
    const cov: Coverage = v.c === 1 ? 'partd' : 'cash';
    const q = (y: 2026 | 2027) => compute({ product: pid, dose: did, year: y, coverage: cov, newPatient: false, onTime: true, copay: 0, extraHelp: 'none', medicaidCopay: 4 });
    const a = q(2026); const b = q(2027);
    const diff = a.yearly !== null && b.yearly !== null ? b.yearly - a.yearly : null;
    return {
      head: [T(l, 'Change from 2026 to 2027', 'Cambio de 2026 a 2027'), diff === null ? '–' : `${diff > 0 ? '+' : diff < 0 ? '−' : ''}${usd(Math.abs(diff), l)}`],
      rows: [['2026', a.yearly === null ? T(l, 'no price', 'sin precio') : usd(a.yearly, l)], ['2027', b.yearly === null ? T(l, 'no price', 'sin precio') : usd(b.yearly, l)]],
      note: T(l, '2027 uses CMS negotiated prices and Part D parameters already published; cash prices are today’s unless an end date is announced.', '2027 usa los precios negociados y parámetros de la Parte D ya publicados por CMS; los precios en efectivo son los de hoy salvo fecha de fin anunciada.'),
    };
  },
});
