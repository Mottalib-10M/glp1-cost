import { route, hasRoute, type Locale } from './routes';
import { PAGES, pageById, GROUPS } from '../lib/pages';
import type { Group } from '../lib/page-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<Locale, Record<string, string>> = {
  en: { home: 'GLP-1 cost calculator', method: 'Method and data', about: 'About', widget: 'Embed the calculator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' },
  es: { home: 'Calculadora de costo GLP-1', method: 'Método y datos', about: 'Quiénes somos', widget: 'Insertar la calculadora', contact: 'Contacto', editorial: 'Política editorial', privacy: 'Privacidad', terms: 'Aviso legal', cookies: 'Cookies' },
};
const GROUP_LABEL: Record<Locale, Record<Group, string>> = {
  en: { glp1: 'GLP-1 drugs', other: 'Other costly drugs', compare: 'Compare', medicare: 'Medicare', medicaid: 'Medicaid', guides: 'Guides' },
  es: { glp1: 'Medicamentos GLP-1', other: 'Otros medicamentos caros', compare: 'Comparar', medicare: 'Medicare', medicaid: 'Medicaid', guides: 'Guías' },
};
export const groupLabel = (g: Group, lang: Locale) => GROUP_LABEL[lang][g];
export const label = (id: string, lang: Locale) => CORE[lang][id] ?? (pageById(id)?.[lang] ?? pageById(id)?.en)?.nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id, lang) });
/** Dans le menu d'une langue, seules les pages qui existent dans cette langue. */
const inGroup = (g: Group, lang: Locale) => PAGES.filter((p) => p.group === g && hasRoute(p.id, lang)).map((p) => link(p.id, lang));
export function navCategories(lang: Locale): NavCategory[] {
  const order: Group[] = lang === 'es' ? ['glp1', 'compare', 'medicare', 'medicaid', 'guides'] : ['glp1', 'other', 'compare', 'medicare', 'guides'];
  return order.map((g) => ({ label: GROUP_LABEL[lang][g], links: g === 'medicare' && lang === 'en' ? [...inGroup('medicare', lang), ...inGroup('medicaid', lang)] : inGroup(g, lang) })).filter((c) => c.links.length);
}
export const navDirect = (lang: Locale): NavLink[] => [link('method', lang)];
export const footerColumns = (lang: Locale): NavCategory[] => [
  ...GROUPS.filter((g) => g !== 'other' || lang === 'en').map((g) => ({ label: GROUP_LABEL[lang][g], links: inGroup(g, lang) })).filter((c) => c.links.length),
  { label: lang === 'es' ? 'El sitio' : 'This site', links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) },
];
export const popularLinks = (_lang: Locale): NavLink[] => [];
