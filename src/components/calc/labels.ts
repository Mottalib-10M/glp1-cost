/** Libellés des produits, dosages et règles dans les deux langues (anglais, espagnol des États-Unis). */
import type { ProductDef, DoseDef, Result, Coverage } from '../../lib/engine/index';
import { formatMoney } from '../../lib/format';
import type { L } from './kit';

export const productName = (p: ProductDef, l: L) =>
  l === 'es' ? p.name.replace(/ pill$/, ' en pastilla') : p.name;

export const productOption = (p: ProductDef, l: L) => `${productName(p, l)} (${l === 'es' ? p.molecule.replace('oral semaglutide', 'semaglutida oral').replace('semaglutide', 'semaglutida').replace('tirzepatide', 'tirzepatida').replace('orforglipron', 'orforglipron').replace('dulaglutide', 'dulaglutida').replace('apixaban', 'apixabán').replace('empagliflozin', 'empagliflozina').replace('rivaroxaban', 'rivaroxabán').replace('dapagliflozin', 'dapagliflozina').replace('sitagliptin', 'sitagliptina').replace('sacubitril and valsartan', 'sacubitrilo y valsartán') : p.molecule})`;

export function doseLabel(d: DoseDef, l: L): string {
  if (l === 'en') return d.label;
  return d.label
    .replace(/^([\d.]+) mg vial$/, 'frasco de $1 mg')
    .replace(/^([\d.]+) mg KwikPen$/, 'KwikPen de $1 mg')
    .replace(/^([\d.]+) mg single-dose pen$/, 'pluma de dosis única de $1 mg')
    .replace(/ twice a day$/, ', dos veces al día')
    .replace('(Wegovy HD)', '(Wegovy HD)');
}

export const coverageOptions = (l: L): Array<{ value: Coverage; label: string }> => [
  { value: 'cash', label: l === 'es' ? 'Sin seguro (pago por mi cuenta)' : 'No insurance (I pay myself)' },
  { value: 'commercial', label: l === 'es' ? 'Mi seguro privado lo cubre' : 'My private insurance covers it' },
  { value: 'partd', label: l === 'es' ? 'Medicare Parte D, uso cubierto' : 'Medicare Part D, covered use' },
  { value: 'weightonly', label: l === 'es' ? 'Medicare, solo para bajar de peso' : 'Medicare, for weight loss only' },
  { value: 'medicaid', label: 'Medicaid' },
];

/** Phrase qui dit quelle règle produit le chiffre (RECETTE §17.3). */
export function ruleText(r: Result, p: ProductDef, l: L, year: number): string {
  const $ = (x: number) => formatMoney(x, 0, l);
  const es = l === 'es';
  const prog = p.program === 'TrumpRx' ? 'TrumpRx' : `${p.program ?? ''}${p.program ? ' / TrumpRx' : ''}`;
  switch (r.rule) {
    case 'cash': return es ? `Precio de autopago publicado por ${prog}, el mismo en las dos vías.` : `Self-pay price published by ${prog}, the same through both.`;
    case 'cash-intro': return es ? `Paciente nuevo: ${r.cash!.intro!.fills} primeros meses a ${$(r.cash!.intro!.price)}, luego ${$(r.cash!.monthly)} (oferta hasta el 31 de diciembre de 2026).` : `New patient: first ${r.cash!.intro!.fills} months at ${$(r.cash!.intro!.price)}, then ${$(r.cash!.monthly)} (offer runs to December 31, 2026).`;
    case 'cash-late': return es ? `Renovación más de 45 días después de la anterior: se aplica el precio normal de ${$(r.cash!.late!)} en vez de ${$(r.cash!.monthly)}.` : `Refill more than 45 days after the last one: the regular ${$(r.cash!.late!)} applies instead of ${$(r.cash!.monthly)}.`;
    case 'cash-temp': return es ? `Precio rebajado hasta el 31 de diciembre de 2026; luego ${$(r.cash!.temporary!.regular)} al mes.` : `Temporary price to December 31, 2026; ${$(r.cash!.temporary!.regular)} a month after that.`;
    case 'no-cash': return es ? 'Ni el fabricante ni TrumpRx publican un precio de autopago para este medicamento: en la farmacia, el precio en efectivo parte como mínimo del costo que paga la farmacia (NADAC).' : 'Neither the maker nor TrumpRx publishes a self-pay price for this drug: at the counter, a cash price starts at least at what the pharmacy pays for it (NADAC).';
    case 'commercial': return es ? 'Su copago, tal como lo fija su plan. Los cupones del fabricante no se aplican si el plan no cubre el medicamento.' : 'Your copay, as your plan sets it. Maker coupons only apply when the plan covers the drug.';
    case 'commercial-card': return es ? 'Tarjeta de ahorro de Novo Nordisk: paga al menos $25 y ahorra hasta $100 al mes sobre su copago.' : 'Novo Nordisk savings card: you pay at least $25 and save up to $100 a month off your copay.';
    case 'partd': return es ? `Beneficio estándar de la Parte D ${year}: deducible y luego 25% del costo, sin llegar al tope anual.` : `Standard ${year} Part D benefit: deductible, then 25% of the cost, below the yearly cap.`;
    case 'partd-cap': return es ? `Se alcanza el tope anual de la Parte D ${year}: no paga nada más ese año por los medicamentos cubiertos.` : `You reach the ${year} Part D yearly cap: nothing more to pay that year for covered drugs.`;
    case 'partd-lis': return es ? `Ayuda Adicional (Extra Help): copago máximo por receta fijado por CMS para ${year}.` : `Extra Help: the per-prescription maximum CMS sets for ${year}.`;
    case 'bridge': return es ? 'Medicare GLP-1 Bridge: $50 por mes, fuera de la Parte D, del 1 de julio de 2026 al 31 de diciembre de 2027, con autorización previa.' : 'Medicare GLP-1 Bridge: $50 a month, outside Part D, July 1, 2026 to December 31, 2027, with prior authorization.';
    case 'not-covered-cash': return es ? 'La Parte D no cubre este uso: el precio es el de autopago.' : 'Part D does not cover this use: the price is the self-pay one.';
    case 'not-covered-none': return es ? 'La Parte D no cubre este uso y no hay precio de autopago publicado.' : 'Part D does not cover this use and no self-pay price is published.';
    case 'medicaid': return es ? 'Copago de Medicaid de su estado, si el estado cubre el medicamento para su caso.' : 'Your state Medicaid copay, if the state covers the drug for your case.';
  }
}
