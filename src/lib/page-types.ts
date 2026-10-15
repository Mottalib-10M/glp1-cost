/**
 * Une page = UN fichier de `src/content/pages/<id>.ts`. Il porte l'anglais (toujours) et l'espagnol
 * (sur les pages les plus demandées), le texte, la FAQ, les sources, l'outil ou le mini-simulateur et
 * les liens. Routes, menus, pied de page, sitemap, hreflang et schémas lisent ces fichiers seuls.
 */
import type { SourceKey, ProductId, Coverage, Year } from './engine/index';
import type * as Engine from './engine/index';
import type { Locale } from '../i18n/routes';

export interface FAQ { q: string; a: string }
export type Group = 'glp1' | 'other' | 'compare' | 'medicare' | 'medicaid' | 'guides';

export interface Helpers {
  lang: Locale;
  a: (id: string, text: string) => string;
  usd: (n: number, decimals?: number) => string;
  num: (n: number, decimals?: number) => string;
  pct: (x: number, decimals?: number) => string;
  date: (iso: string) => string;
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  src: (key: SourceKey, text?: string) => string;
  /** Moteur : tout montant d'une page se calcule ici, jamais recopié à la main. */
  M: typeof Engine;
  /** Mini-simulateur placé dans le corps : `<!--mini:kind-->`. */
  mini: (kind: string) => string;
}

export interface PageText {
  slug: string;
  nav: string;
  card: string;
  /** 50 à 60 caractères, terme-clé en tête, 2026 compris (RECETTE §11). */
  title: string;
  /** 150 à 160 caractères, 2026 compris. */
  description: string;
  h1: string;
  intro: (h: Helpers) => string;
  /** UN paragraphe de 120 mots ou plus, chiffres tirés du moteur (RECETTE §21). */
  resume: (h: Helpers) => string;
  faqs: (h: Helpers) => FAQ[];
  body: (h: Helpers) => string;
}

export type ToolSpec =
  | { kind: 'calc'; product: ProductId; dose?: string; coverage?: Coverage; year?: Year; lock?: boolean }
  | { kind: 'compare'; a: ProductId; b: ProductId; doseA?: string; doseB?: string }
  | { kind: 'medicaid'; product?: ProductId }
  | { kind: 'catalog' }
  | { kind: 'partd'; product?: ProductId };

export interface PageDef {
  id: string;
  group: Group;
  order: number;
  tool?: ToolSpec;
  mini?: string;
  miniHref?: string;
  related: string[];
  sources: SourceKey[];
  en: PageText;
  es?: PageText;
}
export const definePage = (p: PageDef): PageDef => p;
