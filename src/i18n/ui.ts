import type { Locale } from './routes';
const en = {
  updatedOn: 'Prices updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Prices read by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Questions people ask', relatedCalculators: 'Read next', sourcesTitle: 'Where these figures come from', writtenBy: 'Published by',
  asOf: 'Prices and rules for', lastUpdated: 'updated from the publishers’ pages on',
  footerValidated: 'Sources: TrumpRx.gov, CMS, Medicare.gov, Medicaid data, Novo Nordisk, Eli Lilly, FDA labels',
  footerBrowser: 'Calculated in your browser · nothing you type leaves your device · free, no account, nothing to buy',
  footerDisclaimer: 'US GLP Cost is an independent site published by Radif Partners. It is not TrumpRx, CMS, Medicare, a state Medicaid agency, Novo Nordisk or Eli Lilly, sells no medicine and refers you to no pharmacy, telehealth service or insurer. Prices are estimates only, built from figures those bodies publish; they are not medical advice. Whether a drug is right for you is a decision for you and your prescriber.',
  footerPopular: '', notFound: 'There is no page at this address. The calculator below still prices Ozempic, Wegovy, Zepbound, Mounjaro and Foundayo by dose and way of paying.',
  readMore: 'Read more',
};
const es: typeof en = {
  updatedOn: 'Precios actualizados el', editorialPolicy: 'Política editorial', contactLabel: 'Contacto', reviewedBy: 'Precios leídos por',
  skipToContent: 'Ir al contenido', mainNav: 'Navegación principal', breadcrumbLabel: 'Ruta de navegación', breadcrumbHome: 'Inicio', menuOpen: 'Abrir el menú',
  faqTitle: 'Preguntas frecuentes', relatedCalculators: 'Siga leyendo', sourcesTitle: 'De dónde salen estas cifras', writtenBy: 'Publicado por',
  asOf: 'Precios y reglas de', lastUpdated: 'actualizados desde las páginas oficiales el',
  footerValidated: 'Fuentes: TrumpRx.gov, CMS, Medicare.gov, datos de Medicaid, Novo Nordisk, Eli Lilly, fichas de la FDA',
  footerBrowser: 'Cálculo en su navegador · nada de lo que escribe sale de su equipo · gratis, sin cuenta, nada que comprar',
  footerDisclaimer: 'US GLP Cost es un sitio independiente publicado por Radif Partners. No es TrumpRx, ni CMS, ni Medicare, ni una agencia estatal de Medicaid, ni Novo Nordisk, ni Eli Lilly; no vende medicamentos ni lo envía a ninguna farmacia, servicio de telesalud o aseguradora. Los precios son una estimación indicativa basada en cifras que publican esos organismos y no sustituye el consejo médico. Si un medicamento le conviene lo deciden usted y su médico.',
  footerPopular: '', notFound: 'No hay ninguna página en esta dirección. La calculadora de abajo sigue dando el precio de Ozempic, Wegovy, Zepbound, Mounjaro y Foundayo por dosis y forma de pago.',
  readMore: 'Leer más',
};
export function t(lang: Locale) { return lang === 'es' ? es : en; }
