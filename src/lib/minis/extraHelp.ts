/** Extra Help (subvention de la Partie D) : copaiements maximaux par médicament de marque, 2026 et 2027. */
import { T, usd } from './_kit';
import { P } from '../engine/index';
import type { MiniSpec } from '../mini-types';
export default (l: 'en' | 'es'): MiniSpec => ({
  title: T(l, 'Your yearly copays with Extra Help', 'Sus copagos anuales con la Ayuda Adicional'),
  cta: T(l, 'Compare with the cash price', 'Comparar con el precio en efectivo'),
  inputs: [
    { id: 'n', label: T(l, 'Brand-name prescriptions a month', 'Recetas de marca al mes'), def: 2, max: 20 },
    { id: 'g', label: T(l, 'Your Extra Help level', 'Su nivel de Ayuda Adicional'), def: 1, options: [{ value: '1', label: T(l, 'Income up to 150% of poverty level', 'Ingresos hasta 150% del nivel de pobreza') }, { value: '0', label: T(l, 'Full Medicaid, income up to 100%', 'Medicaid completo, ingresos hasta 100%') }] },
  ],
  run: (v) => {
    const per = (y: '2026' | '2027') => (v.g === 1 ? P.partD[y].lisOther : P.partD[y].lisFullBenefitOther);
    const yr = (y: '2026' | '2027') => Math.min(P.partD[y].oopCap, 12 * Math.round(v.n) * per(y));
    return {
      head: [T(l, 'Most you pay in 2026', 'Lo máximo que paga en 2026'), usd(yr('2026'), l)],
      rows: [[T(l, 'Per brand prescription, 2026', 'Por receta de marca, 2026'), usd(per('2026'), l, 2)], [T(l, 'Per brand prescription, 2027', 'Por receta de marca, 2027'), usd(per('2027'), l, 2)], [T(l, 'Most you pay in 2027', 'Lo máximo que paga en 2027'), usd(yr('2027'), l)]],
      note: T(l, 'Ceilings set by CMS; your plan may charge less. Estimate only.', 'Topes fijados por CMS; su plan puede cobrar menos. Estimación indicativa.'),
    };
  },
});
