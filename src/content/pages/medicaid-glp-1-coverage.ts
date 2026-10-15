import { definePage } from '../../lib/page-types';
import sdud from '../../data/sdud.json';
import { STATES } from '../../lib/states';
import { BR } from './_util';

type Cell = { rx: number; paid: number; suppressed: number };
const S = sdud as unknown as { quarters: string[]; latestFull: string; states: Record<string, Record<string, Record<string, Cell>>>; retrieved_at: string };
const Q = S.latestFull;
const PREV = S.quarters[S.quarters.indexOf(Q) - 4] ?? S.quarters[0];
const rx = (st: string, b: string, q: string) => S.states[st]?.[b]?.[q]?.rx ?? 0;
const name = (st: string, es = false) => { const x = STATES.find((s) => s.abbr === st)!; return es ? x.es : x.name; };
const ql = (q: string, es = false) => { const [y, n] = q.split('Q'); return es ? `el ${['primer', 'segundo', 'tercer', 'cuarto'][Number(n) - 1]} trimestre de ${y}` : `the ${['first', 'second', 'third', 'fourth'][Number(n) - 1]} quarter of ${y}`; };
const ranked = (b: string) => Object.keys(S.states).map((st) => ({ st, n: rx(st, b, Q) })).sort((a, c) => c.n - a.n);
const nat = (b: string, q: string) => Object.keys(S.states).reduce((s, st) => s + rx(st, b, q), 0);
/** Plus forte baisse d'un an sur l'autre (États avec au moins 1 000 ordonnances un an plus tôt). */
const drops = (b: string) => Object.keys(S.states).map((st) => ({ st, a: rx(st, b, PREV), z: rx(st, b, Q) })).filter((x) => x.a >= 1000).map((x) => ({ ...x, r: x.z / x.a })).sort((x, y) => x.r - y.r);
const zeroStates = (b: string) => Object.keys(S.states).filter((st) => rx(st, b, Q) === 0 && !(S.states[st]?.[b]?.[Q]?.suppressed));

export default definePage({
  id: 'medicaid-glp-1-coverage', group: 'medicaid', order: 50,
  tool: { kind: 'medicaid', product: 'wegovy' },
  related: ['medicare-glp-1-bridge', 'does-medicare-cover-wegovy', 'wegovy-cost', 'zepbound-cost', 'glp-1-price-comparison'],
  sources: ['sdud', 'sdud2025', 'cmsBalance', 'ecfrCostSharing', 'medicaidCostSharing'],
  en: {
    slug: 'medicaid-glp-1-coverage', nav: 'Medicaid GLP-1 coverage by state', card: 'Wegovy, Zepbound, Ozempic prescriptions paid by each state’s Medicaid, quarter by quarter',
    title: 'Medicaid GLP-1 Coverage by State 2026: Wegovy and Zepbound',
    description: 'Medicaid GLP-1 coverage by state in 2026: the Wegovy, Zepbound, Ozempic and Mounjaro prescriptions each Medicaid program paid, quarter by quarter since 2025.',
    h1: 'Medicaid GLP-1 coverage by state, from the prescriptions states paid',
    intro: (h) => `Pick a state and a drug: the tool shows how many prescriptions that state’s Medicaid program paid for, quarter by quarter, from CMS’s State Drug Utilization Data.`,
    resume: (h) => `Federal law lets each state decide whether its Medicaid program pays for drugs used for weight loss, while coverage of GLP-1s for diabetes is required. Lists of which states cover obesity drugs go out of date quickly, so this page reads the record states leave behind: the State Drug Utilization Data that CMS publishes from the prescriptions each Medicaid program reimburses, by drug and by quarter. In ${ql(Q)}, the latest quarter most states have reported, Medicaid programs paid for ${h.num(nat('WEGOVY', Q))} Wegovy and ${h.num(nat('ZEPBOUND', Q))} Zepbound prescriptions nationwide, against ${h.num(nat('WEGOVY', PREV))} and ${h.num(nat('ZEPBOUND', PREV))} a year earlier. ${name(ranked('WEGOVY')[0].st)} paid for the most Wegovy prescriptions. A large drop shows when a state stops paying for obesity treatment: in ${name(drops('ZEPBOUND')[0]?.st ?? 'CA')}, Zepbound prescriptions fell from ${h.num(drops('ZEPBOUND')[0]?.a ?? 0)} to ${h.num(drops('ZEPBOUND')[0]?.z ?? 0)} over the year. A count above zero proves the state pays for the drug in some cases, not that it pays for weight loss.`,
    body: (h) => `
<h2>How to read the numbers</h2>
<p>Each row of the CMS file is one drug package, in one state, in one quarter, split between fee-for-service Medicaid and managed care plans; we add both. Counts under eleven are hidden by CMS to protect privacy, which the tool flags. Wegovy and Zepbound have other covered uses, heart risk and sleep apnea, so a state that dropped obesity coverage still shows some prescriptions. The trend is the signal: a state that pays for weight-loss use shows thousands of prescriptions a quarter, and a policy change shows up as a break in the series.</p>
<h2>The states with the most Wegovy and Zepbound prescriptions</h2>
${h.table(['State', `Wegovy, ${Q.replace('Q', ' Q')}`, `Zepbound, ${Q.replace('Q', ' Q')}`, `Wegovy, ${PREV.replace('Q', ' Q')}`], ranked('WEGOVY').slice(0, 12).map(({ st }) => [name(st), rx(st, 'WEGOVY', Q), rx(st, 'ZEPBOUND', Q), rx(st, 'WEGOVY', PREV)]), 'Prescriptions reimbursed, fee-for-service and managed care combined. CMS State Drug Utilization Data.', ['l', 'r', 'r', 'r'])}
<h2>Where coverage changed</h2>
<p>Comparing ${ql(Q)} with the same quarter a year earlier, the steepest falls in Zepbound prescriptions were in ${drops('ZEPBOUND').slice(0, 4).map((x) => `${name(x.st)} (${h.num(x.a)} to ${h.num(x.z)})`).join(', ')}. For Wegovy they were in ${drops('WEGOVY').slice(0, 4).map((x) => `${name(x.st)} (${h.num(x.a)} to ${h.num(x.z)})`).join(', ')}. Breaks of that size match decisions to end coverage for obesity; smaller moves can come from reporting delays. ${zeroStates('WEGOVY').length} states and territories reported no Wegovy prescription at all for ${ql(Q)}.</p>
<h2>What you would pay</h2>
<p>When Medicaid covers a drug, cost sharing is capped by federal rule: states may charge at most a nominal copay, ${h.usd(h.M.P.medicaid.preferredCopayFY2013)} for a preferred drug and ${h.usd(h.M.P.medicaid.nonPreferredCopayFY2013)} for a non-preferred one in the FY 2013 table CMS still publishes, indexed each year since, and total cost sharing may not exceed ${h.pct(h.M.P.medicaid.aggregateCapShareOfIncome, 0)} of family income. Many states charge nothing. The calculator’s Medicaid option asks only for your copay.</p>
<h2>BALANCE: the federal model for Medicaid</h2>
<p>CMS’s BALANCE Model lets state Medicaid agencies cover weight-loss GLP-1s at prices CMS negotiated with Eli Lilly and Novo Nordisk; states can join from May 2026 until January 1, 2027. CMS has not published a list of participating states. When one joins, its numbers in this tool should rise from the following quarters. People with both Medicare and Medicaid get Part D drug coverage through Medicare, where the ${h.usd(BR.copay)} GLP-1 Bridge applies.</p>`,
    faqs: (h) => [
      { q: 'Does Medicaid cover Wegovy for weight loss?', a: 'It depends on the state. Federal law makes weight-loss drugs optional for Medicaid, so each state decides, and several ended coverage in 2025 and 2026. The tool shows how many Wegovy prescriptions your state’s Medicaid paid for each quarter; your state Medicaid agency confirms current rules.' },
      { q: 'Does Medicaid cover Zepbound?', a: 'Medicaid must cover drugs for their medically accepted uses, which for Zepbound include moderate to severe obstructive sleep apnea in adults with obesity. Coverage for weight loss alone is a state option. The prescription counts in the tool show which states pay for it in volume.' },
      { q: 'How much is a GLP-1 copay with Medicaid?', a: `Nominal by federal rule: ${h.usd(h.M.P.medicaid.preferredCopayFY2013)} for a preferred drug and ${h.usd(h.M.P.medicaid.nonPreferredCopayFY2013)} for a non-preferred one in the FY 2013 table, indexed since, with total cost sharing capped at ${h.pct(h.M.P.medicaid.aggregateCapShareOfIncome, 0)} of family income. Many states charge no copay at all.` },
      { q: 'Where do these state numbers come from?', a: `From CMS’s State Drug Utilization Data, which every state reports from the prescriptions its Medicaid program reimburses. The figures here cover the quarters from ${S.quarters[0].replace('Q', ' Q')} to ${S.quarters[S.quarters.length - 1].replace('Q', ' Q')} and are refreshed when CMS publishes a new quarter. Counts under eleven are hidden by CMS for privacy.` },
    ],
  },
  es: {
    slug: 'medicaid-glp-1-por-estado', nav: 'Medicaid y GLP-1 por estado', card: 'Recetas de Wegovy, Zepbound y Ozempic pagadas por el Medicaid de cada estado',
    title: 'Medicaid y GLP-1 por estado 2026: Wegovy y Zepbound',
    description: 'Medicaid y los GLP-1 por estado en 2026: las recetas de Wegovy, Zepbound, Ozempic y Mounjaro que pagó cada programa estatal, trimestre por trimestre desde 2025.',
    h1: 'Medicaid y los GLP-1 por estado, según las recetas pagadas',
    intro: () => 'Elija un estado y un medicamento: la herramienta muestra cuántas recetas pagó el Medicaid de ese estado, trimestre por trimestre, según los datos de uso de medicamentos de CMS.',
    resume: (h) => `La ley federal deja que cada estado decida si su Medicaid paga los medicamentos para bajar de peso, mientras que la cobertura de los GLP-1 para la diabetes es obligatoria. Las listas de estados que cubren la obesidad envejecen rápido, así que esta página lee el rastro que dejan los estados: los datos de uso de medicamentos (State Drug Utilization Data) que CMS publica a partir de las recetas que reembolsa cada programa de Medicaid, por medicamento y por trimestre. En ${ql(Q, true)}, el último trimestre que han declarado la mayoría de los estados, los programas de Medicaid pagaron ${h.num(nat('WEGOVY', Q))} recetas de Wegovy y ${h.num(nat('ZEPBOUND', Q))} de Zepbound en todo el país, frente a ${h.num(nat('WEGOVY', PREV))} y ${h.num(nat('ZEPBOUND', PREV))} un año antes. ${name(ranked('WEGOVY')[0].st, true)} pagó el mayor número de recetas de Wegovy. Una caída fuerte aparece cuando un estado deja de pagar el tratamiento de la obesidad: en ${name(drops('ZEPBOUND')[0]?.st ?? 'CA', true)}, las recetas de Zepbound pasaron de ${h.num(drops('ZEPBOUND')[0]?.a ?? 0)} a ${h.num(drops('ZEPBOUND')[0]?.z ?? 0)} en un año. Una cifra mayor que cero prueba que el estado paga el medicamento en algunos casos, no que pague la pérdida de peso.`,
    body: (h) => `
<h2>Cómo leer las cifras</h2>
<p>Cada fila del archivo de CMS es un envase, en un estado, en un trimestre, separado entre Medicaid de pago por servicio y planes de atención administrada; aquí se suman los dos. CMS oculta las cifras menores de once para proteger la privacidad, y la herramienta lo indica. Wegovy y Zepbound tienen otros usos cubiertos, el riesgo cardíaco y la apnea del sueño, así que un estado que dejó de cubrir la obesidad sigue mostrando algunas recetas. La señal es la tendencia.</p>
<h2>Los estados con más recetas de Wegovy y Zepbound</h2>
${h.table(['Estado', `Wegovy, ${Q.replace('Q', ' T')}`, `Zepbound, ${Q.replace('Q', ' T')}`, `Wegovy, ${PREV.replace('Q', ' T')}`], ranked('WEGOVY').slice(0, 12).map(({ st }) => [name(st, true), rx(st, 'WEGOVY', Q), rx(st, 'ZEPBOUND', Q), rx(st, 'WEGOVY', PREV)]), 'Recetas reembolsadas, pago por servicio y atención administrada sumados. Datos de CMS.', ['l', 'r', 'r', 'r'])}
<h2>Dónde cambió la cobertura</h2>
<p>Comparando ${ql(Q, true)} con el mismo trimestre del año anterior, las mayores caídas de recetas de Zepbound se dieron en ${drops('ZEPBOUND').slice(0, 4).map((x) => `${name(x.st, true)} (de ${h.num(x.a)} a ${h.num(x.z)})`).join(', ')}. Para Wegovy, en ${drops('WEGOVY').slice(0, 4).map((x) => `${name(x.st, true)} (de ${h.num(x.a)} a ${h.num(x.z)})`).join(', ')}. Rupturas de ese tamaño coinciden con decisiones de dejar de cubrir la obesidad; los movimientos pequeños pueden deberse a retrasos en las declaraciones.</p>
<h2>Cuánto pagaría</h2>
<p>Cuando Medicaid cubre un medicamento, el copago está limitado por regla federal: como máximo ${h.usd(h.M.P.medicaid.preferredCopayFY2013)} por un medicamento preferido y ${h.usd(h.M.P.medicaid.nonPreferredCopayFY2013)} por uno no preferido en la tabla del año fiscal 2013 que CMS sigue publicando, actualizada cada año desde entonces, y el total de copagos no puede superar el ${h.pct(h.M.P.medicaid.aggregateCapShareOfIncome, 0)} de los ingresos familiares. Muchos estados no cobran nada.</p>
<h2>BALANCE: el modelo federal para Medicaid</h2>
<p>El modelo BALANCE de CMS permite a las agencias estatales de Medicaid cubrir los GLP-1 para bajar de peso a precios que CMS negoció con Eli Lilly y Novo Nordisk; los estados pueden adherirse desde mayo de 2026 hasta el 1 de enero de 2027. CMS no ha publicado la lista de estados participantes. Las personas con Medicare y Medicaid reciben los medicamentos de la Parte D por Medicare, donde se aplica el GLP-1 Bridge de ${h.usd(BR.copay)}.</p>`,
    faqs: (h) => [
      { q: '¿Medicaid cubre Wegovy para bajar de peso?', a: 'Depende del estado. La ley federal hace opcionales los medicamentos para bajar de peso en Medicaid, así que cada estado decide, y varios dejaron de cubrirlos en 2025 y 2026. La herramienta muestra cuántas recetas de Wegovy pagó el Medicaid de su estado cada trimestre; su agencia estatal confirma las reglas actuales.' },
      { q: '¿Medicaid cubre Zepbound?', a: 'Medicaid debe cubrir los medicamentos para sus usos médicamente aceptados, que para Zepbound incluyen la apnea obstructiva del sueño moderada a grave en adultos con obesidad. La cobertura solo para bajar de peso es opcional para cada estado. Las cifras de la herramienta muestran qué estados lo pagan en volumen.' },
      { q: '¿Cuánto es el copago de un GLP-1 con Medicaid?', a: `Mínimo por regla federal: ${h.usd(h.M.P.medicaid.preferredCopayFY2013)} por un medicamento preferido y ${h.usd(h.M.P.medicaid.nonPreferredCopayFY2013)} por uno no preferido en la tabla de 2013, actualizada desde entonces, con un total limitado al ${h.pct(h.M.P.medicaid.aggregateCapShareOfIncome, 0)} de los ingresos familiares. Muchos estados no cobran copago. La calculadora solo le pide el suyo.` },
    ],
  },
});
