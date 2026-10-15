/**
 * Les médicaments du calculateur : un produit par fiche du site, ses dosages, et pour chaque dosage
 * la ligne TrumpRx, la ligne NADAC et la quantité qui fait un mois de traitement.
 *
 * Quantité d'un mois : celle que définissent les programmes des fabricants et TrumpRx (« one month is
 * defined as… ») : 1 stylo Ozempic, 1 boîte de 4 stylos Wegovy, 30 comprimés, 1 KwikPen Zepbound
 * (28 jours), 4 stylos ou flacons hebdomadaires. Les faits médicaux (indications) viennent de la
 * notice FDA citée ; aucun n'est un conseil.
 */
export type ProductId =
  | 'ozempic' | 'ozempic-pill' | 'wegovy' | 'wegovy-pill' | 'zepbound' | 'mounjaro' | 'foundayo' | 'rybelsus' | 'trulicity'
  | 'eliquis' | 'jardiance' | 'xarelto' | 'farxiga' | 'januvia' | 'entresto';

/** Couverture par la Partie D de Medicare, d'après les indications de la notice et la règle CMS
 *  (« type 2 diabetes, moderate to severe obstructive sleep apnea and noncirrhotic MASH indications
 *  are eligible for Part D coverage », FAQ du GLP-1 Bridge) : 'covered' = usage principal couvert ;
 *  'indication' = couvert seulement pour une indication autre que la perte de poids ; 'excluded' =
 *  perte de poids seule, exclue de la Partie D (42 CFR 423.100). */
export type PartDRule = 'covered' | 'indication' | 'excluded';

export interface DoseDef {
  id: string;
  /** Libellé affiché (« 2.4 mg »). */
  label: string;
  /** Forme quand le produit en a plusieurs (Zepbound : flacon, KwikPen, stylo unidose). */
  form?: 'vial' | 'kwikpen' | 'pen';
  /** Fiche TrumpRx et dosage tels qu'écrits par TrumpRx (« 2.4/0.75 »). */
  trx?: { slug: string; strength: string; quantity?: string };
  /** Ligne NADAC (description exacte du fichier CMS) et unités facturées pour un mois. */
  nadac?: { desc: string; units: number };
}

export interface ProductDef {
  id: ProductId;
  name: string;
  molecule: string;
  maker: string;
  group: 'glp1' | 'other';
  route: 'injection' | 'tablet';
  /** Clé du fichier CMS des prix négociés (« Selected Drug Name »). */
  mfpKey?: string;
  partD: PartDRule;
  /** Programme d'autopago du fabricant. */
  program?: 'NovoCare Pharmacy' | 'LillyDirect' | 'TrumpRx';
  doses: DoseDef[];
  /** Dosage montré par défaut (dosage d'entretien courant). */
  defaultDose: string;
  labelKey?: string;
}

const pen4 = (desc: string, ml: number) => ({ desc, units: 4 * ml });
const tab = (desc: string, n = 30) => ({ desc, units: n });

export const PRODUCTS: ProductDef[] = [
  {
    id: 'ozempic', name: 'Ozempic', molecule: 'semaglutide', maker: 'Novo Nordisk', group: 'glp1', route: 'injection', mfpKey: 'OZEMPIC; RYBELSUS; WEGOVY',
    partD: 'covered', program: 'NovoCare Pharmacy', defaultDose: '1', labelKey: 'labelOzempic',
    doses: [
      { id: '0.25', label: '0.25 mg', trx: { slug: 'ozempic', strength: '0.25/0.5' }, nadac: { desc: 'OZEMPIC 0.25-0.5 MG/DOSE (2 MG/3 ML) PEN', units: 3 } },
      { id: '0.5', label: '0.5 mg', trx: { slug: 'ozempic', strength: '0.5/0.5' }, nadac: { desc: 'OZEMPIC 0.25-0.5 MG/DOSE (2 MG/3 ML) PEN', units: 3 } },
      { id: '1', label: '1 mg', trx: { slug: 'ozempic', strength: '1/0.5' }, nadac: { desc: 'OZEMPIC 1 MG/DOSE (4 MG/3 ML) PEN', units: 3 } },
      { id: '2', label: '2 mg', trx: { slug: 'ozempic', strength: '2/0.5' }, nadac: { desc: 'OZEMPIC 2 MG/DOSE (8 MG/3 ML) PEN', units: 3 } },
    ],
  },
  {
    id: 'ozempic-pill', name: 'Ozempic pill', molecule: 'oral semaglutide', maker: 'Novo Nordisk', group: 'glp1', route: 'tablet', mfpKey: 'OZEMPIC; RYBELSUS; WEGOVY',
    partD: 'covered', program: 'NovoCare Pharmacy', defaultDose: '4', labelKey: 'labelOzempicPill',
    doses: [
      { id: '1.5', label: '1.5 mg', trx: { slug: 'ozempic-pill', strength: '1.5' }, nadac: tab('OZEMPIC 1.5 MG TABLET') },
      { id: '4', label: '4 mg', trx: { slug: 'ozempic-pill', strength: '4' }, nadac: tab('OZEMPIC 4 MG TABLET') },
      { id: '9', label: '9 mg', trx: { slug: 'ozempic-pill', strength: '9' }, nadac: tab('OZEMPIC 9 MG TABLET') },
    ],
  },
  {
    id: 'wegovy', name: 'Wegovy', molecule: 'semaglutide', maker: 'Novo Nordisk', group: 'glp1', route: 'injection', mfpKey: 'OZEMPIC; RYBELSUS; WEGOVY',
    partD: 'indication', program: 'NovoCare Pharmacy', defaultDose: '2.4', labelKey: 'labelWegovy',
    doses: [
      { id: '0.25', label: '0.25 mg', trx: { slug: 'wegovy', strength: '0.25/0.5' }, nadac: pen4('WEGOVY 0.25 MG/0.5 ML PEN', 0.5) },
      { id: '0.5', label: '0.5 mg', trx: { slug: 'wegovy', strength: '0.5/0.5' }, nadac: pen4('WEGOVY 0.5 MG/0.5 ML PEN', 0.5) },
      { id: '1', label: '1 mg', trx: { slug: 'wegovy', strength: '1/0.5' }, nadac: pen4('WEGOVY 1 MG/0.5 ML PEN', 0.5) },
      { id: '1.7', label: '1.7 mg', trx: { slug: 'wegovy', strength: '1.7/0.75' }, nadac: pen4('WEGOVY 1.7 MG/0.75 ML PEN', 0.75) },
      { id: '2.4', label: '2.4 mg', trx: { slug: 'wegovy', strength: '2.4/0.75' }, nadac: pen4('WEGOVY 2.4 MG/0.75 ML PEN', 0.75) },
      { id: '7.2', label: '7.2 mg (Wegovy HD)', trx: { slug: 'wegovy', strength: '7.2/0.75' }, nadac: pen4('WEGOVY HD 7.2 MG/0.75 ML PEN', 0.75) },
    ],
  },
  {
    id: 'wegovy-pill', name: 'Wegovy pill', molecule: 'oral semaglutide', maker: 'Novo Nordisk', group: 'glp1', route: 'tablet', mfpKey: 'OZEMPIC; RYBELSUS; WEGOVY',
    partD: 'indication', program: 'NovoCare Pharmacy', defaultDose: '25', labelKey: 'labelWegovy',
    doses: [
      { id: '1.5', label: '1.5 mg', trx: { slug: 'wegovy-pill', strength: '1.5' }, nadac: tab('WEGOVY 1.5 MG TABLET') },
      { id: '4', label: '4 mg', trx: { slug: 'wegovy-pill', strength: '4' }, nadac: tab('WEGOVY 4 MG TABLET') },
      { id: '9', label: '9 mg', trx: { slug: 'wegovy-pill', strength: '9' }, nadac: tab('WEGOVY 9 MG TABLET') },
      { id: '25', label: '25 mg', trx: { slug: 'wegovy-pill', strength: '25' }, nadac: tab('WEGOVY 25 MG TABLET') },
    ],
  },
  {
    id: 'zepbound', name: 'Zepbound', molecule: 'tirzepatide', maker: 'Eli Lilly', group: 'glp1', route: 'injection',
    partD: 'indication', program: 'LillyDirect', defaultDose: 'vial-5', labelKey: 'labelZepbound',
    doses: [
      ...['2.5', '5', '7.5', '10', '12.5', '15'].map((s) => ({ id: `vial-${s}`, label: `${s} mg vial`, form: 'vial' as const, trx: { slug: 'zepbound', strength: s } })),
      ...[['2.5', 'ZEPBOUND 2.5 MG/DOSE (10 MG/2.4 ML) KWIKPEN'], ['5', 'ZEPBOUND 5 MG/DOSE (20 MG/2.4 ML) KWIKPEN'], ['7.5', 'ZEPBOUND 7.5 MG/DOSE (30 MG/2.4 ML) KWIKPEN'], ['10', 'ZEPBOUND 10 MG/DOSE (40 MG/2.4 ML) KWIKPEN'], ['12.5', 'ZEPBOUND 12.5 MG/DOSE (50 MG/2.4 ML) KWIKPEN'], ['15', 'ZEPBOUND 15 MG/DOSE (60 MG/2.4 ML) KWIKPEN']]
        .map(([s, d]) => ({ id: `kwikpen-${s}`, label: `${s} mg KwikPen`, form: 'kwikpen' as const, trx: { slug: 'zepbound-kwikpen', strength: s }, nadac: { desc: d, units: 2.4 } })),
      ...['2.5', '5', '7.5', '10', '12.5', '15'].map((s) => ({ id: `pen-${s}`, label: `${s} mg single-dose pen`, form: 'pen' as const, nadac: pen4(`ZEPBOUND ${s} MG/0.5 ML PEN`, 0.5) })),
    ],
  },
  {
    id: 'mounjaro', name: 'Mounjaro', molecule: 'tirzepatide', maker: 'Eli Lilly', group: 'glp1', route: 'injection',
    partD: 'covered', program: 'LillyDirect', defaultDose: '7.5', labelKey: 'labelMounjaro',
    doses: ['2.5', '5', '7.5', '10', '12.5', '15'].map((s) => ({ id: s, label: `${s} mg`, trx: { slug: 'mounjaro', strength: `${s}/0.5` }, nadac: pen4(`MOUNJARO ${s} MG/0.5 ML PEN`, 0.5) })),
  },
  {
    id: 'foundayo', name: 'Foundayo', molecule: 'orforglipron', maker: 'Eli Lilly', group: 'glp1', route: 'tablet',
    partD: 'excluded', program: 'LillyDirect', defaultDose: '9', labelKey: 'labelFoundayo',
    doses: ['0.8', '2.5', '5.5', '9', '14.5', '17.2'].map((s) => ({ id: s, label: `${s} mg`, trx: { slug: 'foundayo', strength: s }, ...(['0.8', '2.5', '5.5', '9'].includes(s) ? { nadac: tab(`FOUNDAYO ${s} MG TABLET`) } : {}) })),
  },
  {
    id: 'rybelsus', name: 'Rybelsus', molecule: 'oral semaglutide', maker: 'Novo Nordisk', group: 'glp1', route: 'tablet', mfpKey: 'OZEMPIC; RYBELSUS; WEGOVY',
    partD: 'covered', defaultDose: '7', labelKey: 'labelOzempicPill',
    doses: ['3', '7', '14'].map((s) => ({ id: s, label: `${s} mg`, nadac: tab(`RYBELSUS ${s} MG TABLET`) })),
  },
  {
    id: 'trulicity', name: 'Trulicity', molecule: 'dulaglutide', maker: 'Eli Lilly', group: 'glp1', route: 'injection', mfpKey: 'TRULICITY',
    partD: 'covered', program: 'LillyDirect', defaultDose: '1.5', labelKey: 'labelTrulicity',
    doses: ['0.75', '1.5', '3', '4.5'].map((s) => ({ id: s, label: `${s} mg`, trx: { slug: 'trulicity', strength: `${s}/0.5` }, nadac: pen4(`TRULICITY ${s} MG/0.5 ML PEN`, 0.5) })),
  },
  {
    id: 'eliquis', name: 'Eliquis', molecule: 'apixaban', maker: 'Bristol Myers Squibb and Pfizer', group: 'other', route: 'tablet', mfpKey: 'ELIQUIS; ELIQUIS SPRINKLE',
    partD: 'covered', defaultDose: '5',
    doses: [{ id: '2.5', label: '2.5 mg twice a day', nadac: tab('ELIQUIS 2.5 MG TABLET', 60) }, { id: '5', label: '5 mg twice a day', nadac: tab('ELIQUIS 5 MG TABLET', 60) }],
  },
  {
    id: 'jardiance', name: 'Jardiance', molecule: 'empagliflozin', maker: 'Boehringer Ingelheim', group: 'other', route: 'tablet', mfpKey: 'JARDIANCE',
    partD: 'covered', defaultDose: '10',
    doses: [{ id: '10', label: '10 mg', nadac: tab('JARDIANCE 10 MG TABLET') }, { id: '25', label: '25 mg', nadac: tab('JARDIANCE 25 MG TABLET') }],
  },
  {
    id: 'xarelto', name: 'Xarelto', molecule: 'rivaroxaban', maker: 'Johnson & Johnson', group: 'other', route: 'tablet', mfpKey: 'XARELTO',
    partD: 'covered', program: 'TrumpRx', defaultDose: '20',
    doses: ['10', '15', '20'].map((s) => ({ id: s, label: `${s} mg`, trx: { slug: 'xarelto', strength: s, quantity: '30' }, nadac: tab(`XARELTO ${s} MG TABLET`) })),
  },
  {
    id: 'farxiga', name: 'Farxiga', molecule: 'dapagliflozin', maker: 'AstraZeneca', group: 'other', route: 'tablet', mfpKey: 'FARXIGA',
    partD: 'covered', program: 'TrumpRx', defaultDose: '10',
    doses: ['5', '10'].map((s) => ({ id: s, label: `${s} mg`, trx: { slug: 'farxiga', strength: s }, nadac: tab(`FARXIGA ${s} MG TABLET`) })),
  },
  {
    id: 'januvia', name: 'Januvia', molecule: 'sitagliptin', maker: 'Merck', group: 'other', route: 'tablet', mfpKey: 'JANUVIA',
    partD: 'covered', program: 'TrumpRx', defaultDose: '100',
    doses: [
      { id: '25', label: '25 mg', trx: { slug: 'januvia', strength: '25' }, nadac: tab('JANUVIA 25 MG TABLET') },
      { id: '50', label: '50 mg', trx: { slug: 'januvia', strength: '50' }, nadac: tab('JANUVIA 50 MG TABLET') },
      { id: '100', label: '100 mg', nadac: tab('JANUVIA 100 MG TABLET') },
    ],
  },
  {
    id: 'entresto', name: 'Entresto', molecule: 'sacubitril and valsartan', maker: 'Novartis', group: 'other', route: 'tablet', mfpKey: 'ENTRESTO; ENTRESTO SPRINKLE',
    partD: 'covered', defaultDose: '97-103',
    doses: [
      { id: '24-26', label: '24/26 mg twice a day', nadac: tab('ENTRESTO 24 MG-26 MG TABLET', 60) },
      { id: '49-51', label: '49/51 mg twice a day', nadac: tab('ENTRESTO 49 MG-51 MG TABLET', 60) },
      { id: '97-103', label: '97/103 mg twice a day', nadac: tab('ENTRESTO 97 MG-103 MG TABLET', 60) },
    ],
  },
];

export const product = (id: string): ProductDef => {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) throw new Error(`Produit inconnu : ${id}`);
  return p;
};
export const dose = (p: ProductDef, id: string): DoseDef => p.doses.find((d) => d.id === id) ?? p.doses.find((d) => d.id === p.defaultDose)!;
