/**
 * Moteur du site : ce que coûte un médicament par mois et par an, selon le dosage et la façon de
 * payer. Fonctions pures, sans réseau. Données : prices.json (TrumpRx, NADAC, prix négociés CMS,
 * téléchargés par scripts/build-data.py) et params-2026.json (règles de la Partie D, du Bridge,
 * de Medicaid, offres temporaires des fabricants). Aucun montant n'est écrit ici en dur.
 */
import pricesJson from '../../data/prices.json';
import paramsJson from '../../data/params-2026.json';
import { PRODUCTS, product, dose, type ProductDef, type DoseDef, type ProductId } from './products';

export { PRODUCTS, product, dose };
export type { ProductDef, DoseDef, ProductId };

export type Year = 2026 | 2027;
export type Coverage = 'cash' | 'commercial' | 'partd' | 'weightonly' | 'medicaid';
export type ExtraHelp = 'none' | 'partial' | 'full';

interface TrxVariant { form: string | null; strength: string | null; quantity: string | null; trx: number; before: number; introFills: number | null; introPrice: number | null; regular: number | null; late: number | null; onMaker?: boolean }
interface TrxPage { slug: string; url: string; name: string | null; maker: string | null; wacLabel: string | null; disclaimer: string | null; variants: TrxVariant[] }
interface NadacRow { perUnit: number; unit: string; effective: string; asOf: string }
interface Prices { retrieved_at: string; trumprx: Record<string, TrxPage>; nadac: Record<string, NadacRow>; nadacAsOf: string; nadacSource: string; mfp: { file: string; url: string; fileDate: string | null; drugs: Record<string, { ingredient: string; ipay: string; prices: Record<string, number> }> } }

export const DATA = pricesJson as unknown as Prices;
export const P = paramsJson as unknown as typeof paramsJson;
export type SourceKey = keyof typeof paramsJson.sources;

const round2 = (x: number) => Math.round(x * 100) / 100;

/** Ligne TrumpRx d'un dosage, ou null si le produit n'est pas sur TrumpRx. */
export function trxVariant(d: DoseDef): TrxVariant | null {
  if (!d.trx) return null;
  const page = DATA.trumprx[d.trx.slug];
  if (!page) return null;
  return page.variants.find((v) => v.strength === d.trx!.strength && (!d.trx!.quantity || v.quantity === d.trx!.quantity)) ?? null;
}
export const trxPage = (d: DoseDef): TrxPage | null => (d.trx ? DATA.trumprx[d.trx.slug] ?? null : null);

/** Prix catalogue (WAC) d'un mois, tel que TrumpRx le publie (« Original price represents the
 *  Wholesale Acquisition Cost »). Null si TrumpRx ne le donne pas. */
export function listPrice(d: DoseDef): number | null {
  const v = trxVariant(d); const page = trxPage(d);
  if (!v || !page || !v.before || !/wholesale acquisition cost/i.test(page.wacLabel ?? '')) return null;
  return v.before;
}

/** Coût moyen d'acquisition des pharmacies (NADAC) pour un mois, ou null. */
export function nadacMonth(d: DoseDef): { monthly: number; perUnit: number; unit: string; units: number; asOf: string; effective: string } | null {
  if (!d.nadac) return null;
  const r = DATA.nadac[d.nadac.desc];
  if (!r) return null;
  return { monthly: round2(r.perUnit * d.nadac.units), perUnit: r.perUnit, unit: r.unit, units: d.nadac.units, asOf: r.asOf, effective: r.effective };
}

/** Prix négocié Medicare (Maximum Fair Price) pour 30 jours, l'année donnée, ou null. */
export function mfp(p: ProductDef, year: Year): number | null {
  if (!p.mfpKey) return null;
  const x = DATA.mfp.drugs[p.mfpKey];
  return x?.prices[String(year)] ?? null;
}
/** Année à partir de laquelle un prix négocié existe pour ce produit (2026, 2027, 2028…). */
export function mfpFirstYear(p: ProductDef): number | null {
  if (!p.mfpKey) return null;
  const x = DATA.mfp.drugs[p.mfpKey];
  if (!x) return null;
  const ys = Object.keys(x.prices).map(Number);
  return ys.length ? Math.min(...ys) : Number(x.ipay);
}

export interface CashPrice {
  /** Prix mensuel une fois le traitement installé (après l'offre de bienvenue). */
  monthly: number;
  /** Prix des premiers mois pour un nouveau patient, quand une offre de bienvenue s'applique. */
  intro?: { price: number; fills: number; until: string };
  /** Prix si le renouvellement arrive plus de 45 jours après le précédent (LillyDirect). */
  late?: number;
  /** Le prix lu sur TrumpRx figure aussi sur la page de prix du fabricant. */
  confirmed: boolean;
  /** Réduction temporaire qui prend fin (Foundayo 2,5 et 5,5 mg). */
  temporary?: { until: string; regular: number };
}

/** Prix d'autopago (programme du fabricant, que TrumpRx renvoie au même tarif). */
export function cashPrice(p: ProductDef, d: DoseDef, year: Year): CashPrice | null {
  const v = trxVariant(d);
  if (!v || !v.trx) return null;
  const o = P.makerOffers;
  let monthly = v.regular ?? v.trx;
  let intro: CashPrice['intro'];
  if (v.introPrice && v.introFills && o.novoIntro.products.includes(p.id) && year === 2026) intro = { price: v.introPrice, fills: v.introFills, until: o.novoIntro.until };
  let temporary: CashPrice['temporary'];
  const tmp = p.id === 'foundayo' ? (o.foundayoTemporary.regular as Record<string, number>)[d.id] : undefined;
  if (tmp) {
    if (year === 2027) monthly = tmp;
    else temporary = { until: o.foundayoTemporary.until, regular: tmp };
  }
  return { monthly, intro, late: v.late ?? undefined, confirmed: !!v.onMaker, temporary };
}

/** Coût d'une année au comptant : 12 mois, dont les mois de bienvenue pour un nouveau patient,
 *  et le tarif « retard » si les renouvellements ne sont pas faits à temps. */
export function cashYear(c: CashPrice, newPatient: boolean, onTime: boolean): number {
  const base = !onTime && c.late ? c.late : c.monthly;
  if (newPatient && c.intro) return round2(c.intro.fills * c.intro.price + (12 - c.intro.fills) * base);
  return round2(12 * base);
}

/** Base de coût d'un mois pour la Partie D : prix négocié de l'année s'il existe, sinon prix
 *  catalogue publié, sinon coût d'acquisition NADAC. */
export function partDBasis(p: ProductDef, d: DoseDef, year: Year): { monthly: number; basis: 'mfp' | 'wac' | 'nadac' } | null {
  const m = mfp(p, year);
  if (m) return { monthly: m, basis: 'mfp' };
  const w = listPrice(d);
  if (w) return { monthly: w, basis: 'wac' };
  const n = nadacMonth(d);
  if (n) return { monthly: n.monthly, basis: 'nadac' };
  return null;
}

/** Reste à charge annuel de la Partie D, prestation standard (« defined standard benefit ») :
 *  franchise, puis 25 % du coût jusqu'au plafond annuel. Avec l'Extra Help, copaiement par mois. */
export function partDYear(annualCost: number, year: Year, extraHelp: ExtraHelp = 'none'): { oop: number; capped: boolean; deductible: number; cap: number } {
  const q = P.partD[String(year) as '2026' | '2027'];
  if (extraHelp !== 'none') {
    const per = extraHelp === 'full' ? q.lisFullBenefitOther : q.lisOther;
    const oop = Math.min(12 * per, q.oopCap);
    return { oop: round2(oop), capped: false, deductible: 0, cap: q.oopCap };
  }
  const ded = Math.min(annualCost, q.deductible);
  const raw = ded + q.coinsurance * Math.max(0, annualCost - ded);
  return { oop: round2(Math.min(raw, q.oopCap)), capped: raw >= q.oopCap, deductible: q.deductible, cap: q.oopCap };
}

/** Mois où le plafond de la Partie D est atteint (1 = janvier), ou null s'il ne l'est pas dans l'année. */
export function partDCapMonth(monthlyCost: number, year: Year): number | null {
  const q = P.partD[String(year) as '2026' | '2027'];
  let paid = 0; let spent = 0;
  for (let m = 1; m <= 12; m++) {
    spent += monthlyCost;
    const ded = Math.min(spent, q.deductible);
    paid = ded + q.coinsurance * Math.max(0, spent - ded);
    if (paid >= q.oopCap) return m;
  }
  return null;
}

/** Plan de paiement Medicare (Medicare Prescription Payment Plan) : le reste à charge de l'année
 *  réparti en mensualités égales à partir du mois d'adhésion. */
export const paymentPlanMonthly = (annualOop: number, startMonth: number) => round2(annualOop / (13 - Math.min(12, Math.max(1, startMonth))));

/** Produit et dosage admis au Medicare GLP-1 Bridge (FAQ CMS : Wegovy toutes formes, Foundayo,
 *  Zepbound en KwikPen seulement). */
export function bridgeEligible(p: ProductDef, d: DoseDef): boolean {
  const list = P.bridge.products;
  if (p.id === 'zepbound') return d.form === 'kwikpen' && list.includes('zepbound-kwikpen');
  return list.includes(p.id);
}

/** Carte d'économies Novo Nordisk (assurance commerciale qui couvre le médicament) : on paie au
 *  moins 25 $, l'économie est plafonnée à 100 $ par mois. */
export function novoCard(p: ProductDef, copay: number): number | null {
  const c = P.makerOffers.novoCopayCard;
  if (!c.products.includes(p.id)) return null;
  if (copay <= c.floor) return round2(copay);
  return round2(Math.max(c.floor, copay - c.maxSavings));
}

export interface Query {
  product: ProductId; dose: string; year: Year; coverage: Coverage;
  newPatient: boolean; onTime: boolean; copay: number; extraHelp: ExtraHelp; medicaidCopay: number;
}

export interface Result {
  monthly: number | null; yearly: number | null;
  /** Ce qui produit le chiffre : la règle appliquée, en clé de libellé. */
  rule: 'cash' | 'cash-intro' | 'cash-late' | 'cash-temp' | 'no-cash' | 'commercial' | 'commercial-card' | 'partd' | 'partd-cap' | 'partd-lis' | 'bridge' | 'not-covered-cash' | 'not-covered-none' | 'medicaid';
  cash: CashPrice | null; list: number | null; nadac: ReturnType<typeof nadacMonth>; mfp: number | null;
  partD: { basis: 'mfp' | 'wac' | 'nadac'; monthlyCost: number; oop: number; capped: boolean; capMonth: number | null } | null;
  bridge: boolean;
}

/** Le calcul du site : ce que paie la personne, par mois et par an, dans sa situation. */
export function compute(q: Query): Result {
  const p = product(q.product); const d = dose(p, q.dose);
  const cash = cashPrice(p, d, q.year);
  const list = listPrice(d); const nd = nadacMonth(d); const m = mfp(p, q.year);
  const basis = partDBasis(p, d, q.year);
  const pd = basis ? (() => { const y = partDYear(12 * basis.monthly, q.year, q.extraHelp); return { basis: basis.basis, monthlyCost: basis.monthly, oop: y.oop, capped: y.capped, capMonth: q.extraHelp === 'none' ? partDCapMonth(basis.monthly, q.year) : null }; })() : null;
  const bridge = bridgeEligible(p, d);
  const base: Omit<Result, 'monthly' | 'yearly' | 'rule'> = { cash, list, nadac: nd, mfp: m, partD: pd, bridge };
  const cashRes = (): Result => {
    if (!cash) return { ...base, monthly: null, yearly: null, rule: 'no-cash' };
    const late = !q.onTime && !!cash.late;
    const yearly = cashYear(cash, q.newPatient, q.onTime);
    const intro = q.newPatient && !!cash.intro;
    return { ...base, monthly: late ? cash.late! : cash.monthly, yearly, rule: intro ? 'cash-intro' : late ? 'cash-late' : cash.temporary ? 'cash-temp' : 'cash' };
  };
  switch (q.coverage) {
    case 'cash': return cashRes();
    case 'commercial': {
      const card = novoCard(p, q.copay);
      const mo = card ?? q.copay;
      return { ...base, monthly: round2(mo), yearly: round2(12 * mo), rule: card !== null && card < q.copay ? 'commercial-card' : 'commercial' };
    }
    case 'partd': {
      if (p.partD === 'excluded' || !pd) {
        return bridge ? { ...base, monthly: P.bridge.copay, yearly: 12 * P.bridge.copay, rule: 'bridge' } : { ...cashRes(), rule: cash ? 'not-covered-cash' : 'not-covered-none' };
      }
      return { ...base, monthly: round2(pd.oop / 12), yearly: pd.oop, rule: q.extraHelp !== 'none' ? 'partd-lis' : pd.capped ? 'partd-cap' : 'partd' };
    }
    case 'weightonly': {
      if (bridge) return { ...base, monthly: P.bridge.copay, yearly: 12 * P.bridge.copay, rule: 'bridge' };
      const r = cashRes();
      return { ...r, rule: cash ? 'not-covered-cash' : 'not-covered-none' };
    }
    case 'medicaid':
      return { ...base, monthly: round2(q.medicaidCopay), yearly: round2(12 * q.medicaidCopay), rule: 'medicaid' };
  }
}

/** Première offre « la moins chère sans assurance » d'un produit : dosage par défaut. */
export function cheapestCash(p: ProductDef, year: Year = 2026): { dose: DoseDef; price: number } | null {
  let best: { dose: DoseDef; price: number } | null = null;
  for (const d of p.doses) {
    const c = cashPrice(p, d, year);
    if (c && (!best || c.monthly < best.price)) best = { dose: d, price: c.monthly };
  }
  return best;
}
