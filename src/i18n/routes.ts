import { makeRouter, type RouteDef } from './routes-core';
import { PAGES } from '../lib/pages';
/** Anglais partout (États-Unis), espagnol sur les pages les plus demandées : la locale espagnole
 *  est partielle, le hreflang ne relie que les pages qui existent dans les deux langues. */
export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
const R = (id: string, en: string, es: string | null, noindex = false): RouteDef<Locale> => ({ id, paths: { en: `/en/${en}/`, ...(es ? { es: `/es/${es}/` } : {}) }, ...(noindex ? { noindex } : {}) });
const CORE: RouteDef<Locale>[] = [
  { id: 'home', paths: { en: '/en/', es: '/es/' } },
  R('method', 'method', 'metodologia'),
  R('about', 'about', 'sobre'),
  R('widget', 'widget', 'widget', true),
  R('contact', 'contact', 'contacto', true),
  R('editorial', 'editorial-policy', 'politica-editorial', true),
  R('privacy', 'privacy', 'privacidad', true),
  R('terms', 'legal-notice', 'aviso-legal', true),
  R('cookies', 'cookies', 'cookies', true),
];
export const ROUTES: RouteDef<Locale>[] = [
  CORE[0],
  ...PAGES.map((p) => R(p.id, p.en.slug, p.es?.slug ?? null)),
  ...CORE.slice(1),
];
export const { NOINDEX_PATHS, route, altPaths, hasRoute } = makeRouter(LOCALES, ROUTES);
