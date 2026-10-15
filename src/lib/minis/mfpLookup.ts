/** Prix négociés Medicare : prix pour 30 jours en 2026 et 2027, part annuelle Partie D à ce prix. */
import { T, usd } from './_kit';
import { DATA, partDYear } from '../engine/index';
import type { MiniSpec } from '../mini-types';
const DRUGS = Object.entries(DATA.mfp.drugs).sort((a, b) => a[0].localeCompare(b[0]));
const nice = (s: string) => s.split(';')[0].toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
export default (l: 'en' | 'es'): MiniSpec => ({
  title: T(l, 'Medicare negotiated price of a drug', 'Precio negociado por Medicare de un medicamento'),
  cta: T(l, 'Work out your Part D share', 'Calcular su parte de la Parte D'),
  inputs: [{ id: 'd', label: T(l, 'Drug', 'Medicamento'), def: Math.max(0, DRUGS.findIndex(([k]) => k.startsWith('OZEMPIC'))), options: DRUGS.map(([k], i) => ({ value: String(i), label: nice(k) })) }],
  run: (v) => {
    const [, x] = DRUGS[v.d] ?? DRUGS[0];
    const p26 = x.prices['2026']; const p27 = x.prices['2027'];
    const share = p27 ? partDYear(12 * p27, 2027).oop : null;
    return {
      head: [T(l, '2027 price for 30 days', 'Precio 2027 por 30 días'), p27 ? usd(p27, l, p27 % 1 ? 2 : 0) : T(l, 'Not yet published', 'Aún no publicado')],
      rows: [[T(l, '2026 price for 30 days', 'Precio 2026 por 30 días'), p26 ? usd(p26, l, p26 % 1 ? 2 : 0) : T(l, 'not selected for 2026', 'no seleccionado para 2026')], [T(l, 'Your 2027 Part D share at this price', 'Su parte de la Parte D 2027 a este precio'), share === null ? '–' : usd(share, l)], [T(l, 'Selected for', 'Seleccionado para'), x.ipay]],
      note: T(l, 'CMS file of negotiated (maximum fair) prices; standard Part D benefit. Estimate only.', 'Archivo de CMS de precios negociados; beneficio estándar de la Parte D. Estimación indicativa.'),
    };
  },
});
