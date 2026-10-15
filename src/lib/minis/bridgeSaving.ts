/** GLP-1 Bridge : ce que les 50 $ par mois font économiser face au prix d'autopago, de juillet 2026 à décembre 2027. */
import { T, usd, productOpts, doseOpts, product } from './_kit';
import { cashPrice, P } from '../engine/index';
import type { MiniSpec } from '../mini-types';
const IDS = ['wegovy', 'wegovy-pill', 'zepbound', 'foundayo'];
export default (l: 'en' | 'es'): MiniSpec => ({
  title: T(l, 'What the $50 Bridge saves you', 'Lo que ahorra el Bridge de $50'),
  cta: T(l, 'Price every way of paying', 'Ver todas las formas de pago'),
  inputs: [
    { id: 'p', label: T(l, 'Medicine', 'Medicamento'), def: 0, options: productOpts(IDS, l).map((o, i) => ({ ...o, label: i === 2 ? (l === 'es' ? 'Zepbound KwikPen' : 'Zepbound KwikPen') : o.label })) },
    { id: 'm', label: T(l, 'Months on the Bridge', 'Meses en el Bridge'), def: 18, unit: T(l, 'mo', 'meses'), max: 18 },
  ],
  run: (v) => {
    const p = product(IDS[v.p]);
    const d = p.id === 'zepbound' ? p.doses.find((x) => x.id === 'kwikpen-10')! : p.doses.find((x) => x.id === p.defaultDose)!;
    const c = cashPrice(p, d, 2026)?.monthly ?? 0;
    const months = Math.max(0, Math.min(18, Math.round(v.m)));
    const saving = (c - P.bridge.copay) * months;
    return {
      head: [T(l, `Saving over ${months} months`, `Ahorro en ${months} meses`), usd(saving, l)],
      rows: [[T(l, `Self-pay, ${d.label}`, `Autopago, ${d.label}`), `${usd(c, l)}${T(l, ' a month', ' al mes')}`], [T(l, 'Bridge copay', 'Copago del Bridge'), `${usd(P.bridge.copay, l)}${T(l, ' a month', ' al mes')}`], [T(l, 'Bridge window', 'Duración del Bridge'), T(l, 'Jul 2026 to Dec 2027 (18 months)', 'jul. 2026 a dic. 2027 (18 meses)')]],
      note: T(l, 'Prior authorization and BMI criteria apply. Estimate only.', 'Requiere autorización previa y criterios de IMC. Estimación indicativa.'),
    };
  },
});
