/**
 * Medicaid par État : ce que le programme de l'État a réellement remboursé pour un GLP-1, trimestre
 * par trimestre (State Drug Utilization Data, CMS), et le copaiement plafonné par la règle fédérale.
 * Le nombre d'ordonnances remboursées prouve que l'État paie ce médicament pour au moins une partie
 * de ses usages ; il ne dit pas lesquels (diabète, cœur, apnée, obésité).
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { Shell, Row2, Head, Bars, Note, Actions, usd, T, type L } from './kit';
import { P, type ProductId } from '../../lib/engine/index';
import { STATES } from '../../lib/states';
import { readParams, str, updateURL } from '../../lib/url-state';
import { formatNumber } from '../../lib/format';

interface Cell { rx: number; paid: number; suppressed: number }
interface Data { quarters: string[]; latestFull: string | null; states: Record<string, Record<string, Record<string, Cell>>>; retrieved_at: string }
interface Props { lang?: L; productId?: ProductId; data: Data; methodHref?: string; idPrefix?: string }
const BRANDS: Array<[ProductId | 'rybelsus', string]> = [['wegovy', 'WEGOVY'], ['zepbound', 'ZEPBOUND'], ['ozempic', 'OZEMPIC'], ['mounjaro', 'MOUNJARO'], ['trulicity', 'TRULICITY'], ['rybelsus', 'RYBELSUS']];
const NAME: Record<string, string> = { WEGOVY: 'Wegovy', ZEPBOUND: 'Zepbound', OZEMPIC: 'Ozempic', MOUNJARO: 'Mounjaro', TRULICITY: 'Trulicity', RYBELSUS: 'Rybelsus' };

const qLabel = (q: string, l: L) => { const [y, n] = q.split('Q'); return l === 'es' ? `T${n} ${y}` : `Q${n} ${y}`; };

export default function MedicaidTool({ lang = 'en', productId = 'wegovy', data, methodHref, idPrefix = 'm' }: Props) {
  const startBrand = BRANDS.find(([id]) => id === productId)?.[1] ?? 'WEGOVY';
  const [st, setSt] = useState('CA');
  const [brand, setBrand] = useState(startBrand);
  useEffect(() => {
    const u = readParams(window.location.search);
    const s = str(u, 'state', 'CA').toUpperCase(); if (STATES.some((x) => x.abbr === s)) setSt(s);
    const b = str(u, 'drug', startBrand).toUpperCase(); if (NAME[b]) setBrand(b);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { updateURL({ state: st, drug: brand }); }, [st, brand]);
  const ids = (k: string) => `${idPrefix}-${k}`;
  const state = STATES.find((x) => x.abbr === st)!;
  const cells = data.states[st]?.[brand] ?? {};
  const q = data.latestFull ?? data.quarters[data.quarters.length - 1];
  const last = cells[q];
  const perRx = last && last.rx > 0 ? last.paid / last.rx : null;
  const nationalRx = useMemo(() => Object.values(data.states).reduce((s, x) => s + (x[brand]?.[q]?.rx ?? 0), 0), [data, brand, q]);
  const head = !last || (last.rx === 0 && last.suppressed === 0)
    ? T(lang, 'None reported', 'Ninguna declarada')
    : last.rx === 0 ? T(lang, 'Fewer than 11', 'Menos de 11') : formatNumber(last.rx, 0, lang);
  const form = (
    <>
      <Row2>
        <SelectField id={ids('state')} label={T(lang, 'State', 'Estado')} value={st} onChange={setSt} options={STATES.map((s) => ({ value: s.abbr, label: lang === 'es' ? s.es : s.name }))} />
        <SelectField id={ids('drug')} label={T(lang, 'Medicine', 'Medicamento')} value={brand} onChange={setBrand} options={BRANDS.map(([, b]) => ({ value: b, label: NAME[b] }))} />
      </Row2>
    </>
  );
  const result = (
    <>
      <Head label={T(lang, `${NAME[brand]} prescriptions paid by ${state.name} Medicaid, ${qLabel(q, lang)}`, `Recetas de ${NAME[brand]} pagadas por Medicaid de ${state.es}, ${qLabel(q, lang)}`)} value={head}
        sub={perRx ? T(lang, `${usd(perRx, lang)} reimbursed per prescription`, `${usd(perRx, lang)} reembolsados por receta`) : undefined} />
      <Bars count lang={lang} title={T(lang, 'Prescriptions reimbursed, quarter by quarter', 'Recetas reembolsadas, trimestre por trimestre')}
        lines={data.quarters.map((x) => ({ label: qLabel(x, lang), value: cells[x] ? cells[x].rx : 0, text: '', note: cells[x]?.suppressed ? T(lang, 'some rows hidden by CMS (under 11)', 'algunas filas ocultas por CMS (menos de 11)') : undefined }))} />
      <Note>{T(lang,
        `A count above zero shows the state pays for ${NAME[brand]} in at least some cases; it does not say for which use. Nationwide, Medicaid programs reported ${formatNumber(nationalRx, 0, lang)} for the same quarter. Your copay is capped by federal rule (${usd(P.medicaid.preferredCopayFY2013, lang)} for a preferred drug in the FY 2013 table, indexed since) and total cost sharing by 5% of family income.`,
        `Una cifra mayor que cero indica que el estado paga ${NAME[brand]} al menos en algunos casos; no dice para qué uso. En todo el país, los programas de Medicaid declararon ${formatNumber(nationalRx, 0, lang)} en el mismo trimestre. Su copago está limitado por la regla federal (${usd(P.medicaid.preferredCopayFY2013, lang)} para un medicamento preferido en la tabla del año fiscal 2013, actualizada desde entonces) y el total de copagos al 5% de los ingresos familiares.`)}
        {' '}{T(lang, 'Estimate only: your state Medicaid agency decides coverage.', 'Estimación indicativa: decide la agencia de Medicaid de su estado.')}{methodHref && <> <a href={methodHref} className="font-medium text-accent-700 underline">{T(lang, 'Method', 'Método')}</a></>}</Note>
      <Actions lang={lang} />
    </>
  );
  const aside = (
    <div className="mt-6 border-t border-navy-200 pt-4">
      <Bars count lang={lang} title={T(lang, `${state.name}, every GLP-1 in ${qLabel(q, lang)}`, `${state.es}, todos los GLP-1 en ${qLabel(q, lang)}`)}
        lines={BRANDS.map(([, b]) => ({ label: NAME[b], value: data.states[st]?.[b]?.[q]?.rx ?? 0 }))} />
      <p className="mt-3 text-xs text-navy-600">{T(lang, 'Prescriptions reimbursed, fee-for-service and managed care combined. Diabetes drugs (Ozempic, Mounjaro, Trulicity, Rybelsus) must be covered; Wegovy and Zepbound for weight loss are a state choice.', 'Recetas reembolsadas, pago por servicio y atención administrada. Los medicamentos para la diabetes (Ozempic, Mounjaro, Trulicity, Rybelsus) deben cubrirse; Wegovy y Zepbound para bajar de peso son opción de cada estado.')}</p>
    </div>
  );
  return <Shell id="medicaid" form={form} result={result} aside={aside} />;
}
