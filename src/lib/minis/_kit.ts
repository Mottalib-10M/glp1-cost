/** Outils communs aux mini-simulateurs (fichier ignoré par le registre : préfixe « _ »). */
import { formatMoney, formatPercent, formatNumber } from '../format';
import { PRODUCTS, product } from '../engine/index';
import type { ProductDef } from '../engine/index';
export type L = 'en' | 'es';
export const T = <A>(l: L, en: A, es: A) => (l === 'es' ? es : en);
export const usd = (x: number, l: L, d = 0) => formatMoney(x, d, l);
export const pct = (x: number, l: L, d = 1) => formatPercent(x, d, l);
export const num = (x: number, l: L, d = 0) => formatNumber(x, d, l);
/** Options « produit » d'un mini : la valeur est l'index dans la liste donnée. */
export const productOpts = (ids: string[], l: L) => ids.map((id, i) => ({ value: String(i), label: l === 'es' ? product(id).name.replace(/ pill$/, ' en pastilla') : product(id).name }));
export const doseOpts = (p: ProductDef, l: L) => p.doses.map((d, i) => ({ value: String(i), label: l === 'es' ? d.label.replace(/^([\d.]+) mg vial$/, 'frasco de $1 mg').replace(/^([\d.]+) mg KwikPen$/, 'KwikPen de $1 mg').replace(/^([\d.]+) mg single-dose pen$/, 'pluma de dosis única de $1 mg').replace(/ twice a day$/, ', dos veces al día') : d.label }));
export const monthsOpts = (l: L) => (l === 'es' ? ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'] : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']).map((m, i) => ({ value: String(i + 1), label: m }));
export { PRODUCTS, product };
