/**
 * Partie D de Medicare : reste à charge annuel d'un médicament couvert, mois où le plafond est
 * atteint, et mensualités du plan de paiement Medicare (Medicare Prescription Payment Plan),
 * en 2026 et en 2027. Prestation standard définie par CMS ; un plan peut faire moins cher.
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import NumberField from '../ui/NumberField';
import Toggle from '../ui/Toggle';
import { Shell, Row2, Head, Bars, Note, Actions, usd, T, type L } from './kit';
import { productOption, doseLabel } from './labels';
import { PRODUCTS, product, dose, partDBasis, partDYear, partDCapMonth, paymentPlanMonthly, P, type Year, type ProductId } from '../../lib/engine/index';
import { readParams, str, num, updateURL } from '../../lib/url-state';

interface Props { lang?: L; productId?: ProductId; methodHref?: string; idPrefix?: string }
const COVERED = PRODUCTS.filter((p) => p.partD !== 'excluded');
const MONTHS = { en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'] };

export default function PartDTool({ lang = 'en', productId = 'ozempic', methodHref, idPrefix = 'd' }: Props) {
  const [pid, setPid] = useState<ProductId>(productId);
  const p = product(pid);
  const [did, setDid] = useState(p.defaultDose);
  const [yr, setYr] = useState<Year>(2026);
  const [start, setStart] = useState(1);
  const [other, setOther] = useState(0);
  useEffect(() => {
    const u = readParams(window.location.search);
    const up = str(u, 'drug', productId) as ProductId; if (COVERED.some((x) => x.id === up)) setPid(up);
    if (str(u, 'dose', '')) setDid(str(u, 'dose', ''));
    const uy = num(u, 'year', 2026); if (uy === 2026 || uy === 2027) setYr(uy);
    setStart(Math.min(12, Math.max(1, num(u, 'start', 1))));
    setOther(num(u, 'other', 0));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { updateURL({ drug: pid, dose: did, year: yr, start: start === 1 ? undefined : start, other: other || undefined }); }, [pid, did, yr, start, other]);
  const d = dose(p, did);
  const res = useMemo(() => {
    const b = partDBasis(p, d, yr);
    if (!b) return null;
    const monthly = b.monthly + other;
    const y = partDYear(12 * monthly, yr);
    return { basis: b, monthly, y, capMonth: partDCapMonth(monthly, yr), plan: paymentPlanMonthly(y.oop, start) };
  }, [p, d, yr, other, start]);
  const q = P.partD[String(yr) as '2026' | '2027'];
  const ids = (k: string) => `${idPrefix}-${k}`;
  const basisText = (b: 'mfp' | 'wac' | 'nadac') => b === 'mfp' ? T(lang, 'Medicare negotiated price', 'precio negociado por Medicare') : b === 'wac' ? T(lang, 'list price', 'precio de lista') : T(lang, 'pharmacy cost (NADAC)', 'costo de farmacia (NADAC)');
  const form = (
    <>
      <Row2>
        <SelectField id={ids('drug')} label={T(lang, 'Medicine covered by your plan', 'Medicamento cubierto por su plan')} value={pid} onChange={(v) => { setPid(v as ProductId); setDid(product(v).defaultDose); }} options={COVERED.map((x) => ({ value: x.id, label: productOption(x, lang) }))} />
        <SelectField id={ids('dose')} label={T(lang, 'Dose', 'Dosis')} value={d.id} onChange={setDid} options={p.doses.map((x) => ({ value: x.id, label: doseLabel(x, lang) }))} />
      </Row2>
      <Row2>
        <Toggle id={ids('year')} label={T(lang, 'Year', 'Año')} value={String(yr)} onChange={(v) => setYr(Number(v) as Year)} options={[{ value: '2026', label: '2026' }, { value: '2027', label: '2027' }]} />
        <SelectField id={ids('start')} label={T(lang, 'Payment plan from', 'Plan de pago desde')} value={String(start)} onChange={(v) => setStart(Number(v))} options={MONTHS[lang].map((m, i) => ({ value: String(i + 1), label: m }))} />
      </Row2>
      <Row2>
        <NumberField id={ids('other')} label={T(lang, 'Other covered drugs, cost a month', 'Otros medicamentos cubiertos, costo al mes')} value={other} onChange={setOther} unit="$" max={50000} lang={lang}
          help={T(lang, 'Full price of your other Part D drugs, if any.', 'Precio completo de sus otros medicamentos, si los hay.')} />
        <div />
      </Row2>
    </>
  );
  const result = !res ? <Head label={T(lang, 'No price published', 'Sin precio publicado')} value="–" /> : (
    <>
      <Head label={T(lang, `Your Part D share in ${yr}`, `Su parte de la Parte D en ${yr}`)} value={usd(res.y.oop, lang)}
        sub={res.capMonth ? T(lang, `Cap reached in ${MONTHS.en[res.capMonth - 1]}`, `Tope alcanzado en ${MONTHS.es[res.capMonth - 1]}`) : T(lang, 'Below the yearly cap', 'Por debajo del tope anual')} />
      <Bars lang={lang} title={T(lang, `${yr} defined standard benefit`, `Beneficio estándar ${yr}`)} lines={[
        { label: T(lang, `Drug cost a month (${basisText(res.basis.basis)})`, `Costo del medicamento al mes (${basisText(res.basis.basis)})`), value: res.monthly },
        { label: T(lang, 'Deductible', 'Deducible'), value: q.deductible },
        { label: T(lang, 'Yearly out-of-pocket cap', 'Tope anual de gastos de bolsillo'), value: q.oopCap },
        { label: T(lang, `Payment plan, a month from ${MONTHS.en[start - 1]}`, `Plan de pago, al mes desde ${MONTHS.es[start - 1]}`), value: res.plan, strong: true },
      ]} />
      <Note>{T(lang, `After the ${usd(q.deductible, lang)} deductible you pay 25% of the cost until your share reaches ${usd(q.oopCap, lang)}; your plan may charge flat copays instead, never more than the cap.`, `Después del deducible de ${usd(q.deductible, lang)} paga el 25% del costo hasta que su parte llega a ${usd(q.oopCap, lang)}; su plan puede cobrar copagos fijos, nunca por encima del tope.`)} {T(lang, 'Estimate only.', 'Estimación indicativa.')}{methodHref && <> <a href={methodHref} className="font-medium text-accent-700 underline">{T(lang, 'Method', 'Método')}</a></>}</Note>
      <Actions lang={lang} />
    </>
  );
  const months = useMemo(() => {
    if (!res) return [];
    const out: Array<{ label: string; value: number }> = []; let prev = 0;
    for (let m = 1; m <= 12; m++) {
      const spent = res.monthly * m; const ded = Math.min(spent, q.deductible);
      const cum = Math.min(q.oopCap, ded + q.coinsurance * Math.max(0, spent - ded));
      out.push({ label: MONTHS[lang][m - 1], value: Math.round(cum - prev) }); prev = cum;
    }
    return out;
  }, [res, q, lang]);
  const aside = res ? (
    <div className="mt-6 border-t border-navy-200 pt-4">
      <Bars lang={lang} title={T(lang, 'Paid at the pharmacy each month, without the payment plan', 'Pagado en la farmacia cada mes, sin el plan de pago')} lines={months} />
    </div>
  ) : null;
  return <Shell id="partd" form={form} result={result} aside={aside} />;
}
