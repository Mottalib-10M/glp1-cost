/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://usglpcost.com";
// Partie du nom en couleur dans l'en-tete ('' = aucune).
export const BRAND_ACCENT = 'GLP';
export const SITE_NAMES: Record<string, string> = {"en": "US GLP Cost", "es": "US GLP Cost"};
export const LANG_TAGS: Record<string, string> = {"en": "en-US", "es": "es-US"};
export const OG_LOCALES: Record<string, string> = {"en": "en_US", "es": "es_US"};
export const LOCALE_TAG = 'en-US';
/** Locale de mise en forme par langue (RECETTE §4 : une locale par langue, pas une par site). */
export const LOCALE_BY_LANG: Record<string, string> = { en: 'en-US', es: 'es-US' };
export const CURRENCY = 'USD';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-29';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"en": "Publisher of the US prescription price calculators (GLP-1 cash, TrumpRx, Medicare, Medicaid)", "es": "Editor de las calculadoras de precios de medicamentos en EE. UU. (GLP-1, TrumpRx, Medicare, Medicaid)"};
export const AUTHOR_DESC: Record<string, string> = {"en": "Radif Partners reads the self-pay price lists that Novo Nordisk and Eli Lilly publish, the TrumpRx.gov listings, the CMS negotiated Medicare prices, the weekly NADAC pharmacy survey and the 2026 and 2027 Part D parameters, and turns them into one monthly and yearly figure per drug, dose and way of paying.", "es": "Radif Partners lee las listas de precios de autopago que publican Novo Nordisk y Eli Lilly, las fichas de TrumpRx.gov, los precios negociados de Medicare que publica CMS, la encuesta semanal NADAC de farmacias y los parámetros de la Parte D de 2026 y 2027, y los convierte en una cifra mensual y anual por medicamento, dosis y forma de pago."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"en": ["GLP-1 drug prices", "Manufacturer self-pay programs", "TrumpRx", "Medicare Part D out-of-pocket cap", "Medicare drug price negotiation", "Medicare GLP-1 Bridge", "Medicaid prescription drug coverage", "NADAC pharmacy acquisition cost"], "es": ["Precios de los GLP-1", "Programas de autopago de los fabricantes", "TrumpRx", "Tope de gastos de la Parte D de Medicare", "Negociación de precios de Medicare", "Medicare GLP-1 Bridge", "Cobertura de medicamentos de Medicaid", "Costo de adquisición NADAC"]};
export const CONTACT_EMAIL = "contact@usglpcost.com";
export const THEME_COLOR = '#3C3B6E';
export const LOGO_SYMBOL = 'Rx';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau, aucun cookie, Clarity chargé en mode sans cookie (consentv2 denied).
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
export const GA4_ID = 'G-NP14WHBE21';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = 'yz4c43rgdy';
export const INDEXNOW_KEY = '7c1f4b2e9a6d4e0f8b3a5c2d1e9f7a60';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',  // vide : comme sur les autres sites du portefeuille
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "VAT",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
