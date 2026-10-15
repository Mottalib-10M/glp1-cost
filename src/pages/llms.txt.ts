import type { APIRoute } from 'astro';
import { SITE_URL, SITE_NAMES } from '../data/site-config';
import { PAGES } from '../lib/pages';
import { DATA } from '../lib/engine/index';
export const GET: APIRoute = () => {
  const lines = [
    `# ${SITE_NAMES.en}`,
    '',
    '> Monthly and yearly cost of GLP-1 drugs (Ozempic, Wegovy, Zepbound, Mounjaro, Foundayo, Rybelsus, Trulicity) and other costly drugs in the United States, by dose and way of paying: manufacturer self-pay, TrumpRx, pharmacy acquisition cost (NADAC), Medicare Part D standard benefit, Medicare negotiated prices, the Medicare GLP-1 Bridge and Medicaid. Independent site published by Radif Partners. Not medical advice.',
    '',
    `Data read on ${DATA.retrieved_at} from TrumpRx.gov, NovoCare Pharmacy, LillyDirect, CMS (NADAC file of ${DATA.nadacAsOf}, negotiated prices, State Drug Utilization Data, 2027 Rate Announcement).`,
    '',
    '## Pages',
    `- [GLP-1 cost calculator](${SITE_URL}/en/)`,
    ...PAGES.map((p) => `- [${p.en.nav}](${SITE_URL}/en/${p.en.slug}/): ${p.en.card}`),
    `- [Method and data](${SITE_URL}/en/method/)`,
    '',
    '## Español',
    `- [Calculadora de costo GLP-1](${SITE_URL}/es/)`,
    ...PAGES.filter((p) => p.es).map((p) => `- [${p.es!.nav}](${SITE_URL}/es/${p.es!.slug}/)`),
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
