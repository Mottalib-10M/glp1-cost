/**
 * Petits accès au moteur pour écrire les pages (fichier ignoré par le registre : préfixe « _ »).
 * Tout montant cité dans un texte passe par ici : il suit les données au prochain relevé.
 */
import * as M from '../../lib/engine/index';
import type { Helpers } from '../../lib/page-types';

export const prod = (id: M.ProductId) => M.product(id);
export const dz = (id: M.ProductId, d: string) => M.dose(M.product(id), d);
/** Prix d'autopago mensuel (après l'offre de bienvenue). */
export const cash = (id: M.ProductId, d: string, y: M.Year = 2026) => M.cashPrice(prod(id), dz(id, d), y)?.monthly ?? NaN;
export const late = (id: M.ProductId, d: string) => M.cashPrice(prod(id), dz(id, d), 2026)?.late ?? NaN;
export const intro = (id: M.ProductId, d: string) => M.cashPrice(prod(id), dz(id, d), 2026)?.intro?.price ?? NaN;
export const list = (id: M.ProductId, d: string) => M.listPrice(dz(id, d)) ?? NaN;
export const nadac = (id: M.ProductId, d: string) => M.nadacMonth(dz(id, d))?.monthly ?? NaN;
export const mfp = (id: M.ProductId, y: M.Year) => M.mfp(prod(id), y) ?? NaN;
export const partD = (id: M.ProductId, d: string, y: M.Year) => { const b = M.partDBasis(prod(id), dz(id, d), y); return b ? M.partDYear(12 * b.monthly, y).oop : NaN; };
export const capMonth = (id: M.ProductId, d: string, y: M.Year) => { const b = M.partDBasis(prod(id), dz(id, d), y); return b ? M.partDCapMonth(b.monthly, y) : null; };
export const PD = (y: M.Year) => M.P.partD[String(y) as '2026' | '2027'];
export const BR = M.P.bridge;
/** Prix d'autopago le plus bas et le plus haut d'un produit. */
export function range(id: M.ProductId, y: M.Year = 2026): [number, number] {
  const p = prod(id);
  const xs = p.doses.map((d) => M.cashPrice(p, d, y)?.monthly).filter((x): x is number => typeof x === 'number');
  return [Math.min(...xs), Math.max(...xs)];
}
/** Remise en pourcentage d'un prix sur un autre (0,74 → « 74 % »). */
export const off = (h: Helpers, price: number, ref: number) => h.pct(1 - price / ref, 0);
export const monthName = (m: number | null, lang: 'en' | 'es') => (m ? (lang === 'es' ? ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'] : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])[m - 1] : '');
/** Date du relevé TrumpRx/fabricants et du fichier NADAC. */
export const asOf = () => M.DATA.retrieved_at;
export const nadacAsOf = () => M.DATA.nadacAsOf;
export const mfpFile = () => M.DATA.mfp.fileDate ?? M.DATA.retrieved_at;
import { formatMoney } from '../../lib/format';
/** Montant pour un titre ou une description (chaîne fixe au build, suit les données au relevé suivant). */
export const $en = (x: number) => formatMoney(x, 0, 'en');
export const $es = (x: number) => formatMoney(x, 0, 'es');
