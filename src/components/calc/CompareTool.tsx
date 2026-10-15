/** Comparateur : deux médicaments, chacun à son dosage, la même façon de payer et la même année. */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { Shell, Row2, Row1, Head, Bars, Note, Actions, usd, T, type L } from './kit';
import { productOption, productName, doseLabel, coverageOptions, ruleText } from './labels';
import { PRODUCTS, product, dose, compute, P, type Coverage, type Year, type ProductId } from '../../lib/engine/index';
import { readParams, str, num, updateURL } from '../../lib/url-state';

interface Props { lang?: L; a: ProductId; b: ProductId; doseA?: string; doseB?: string; methodHref?: string; idPrefix?: string }
const GLP = PRODUCTS.filter((p) => p.group === 'glp1');

export default function CompareTool({ lang = 'en', a, b, doseA, doseB, methodHref, idPrefix = 'k' }: Props) {
  const [pa, setPa] = useState<ProductId>(a);
  const [pb, setPb] = useState<ProductId>(b);
  const [da, setDa] = useState(doseA ?? product(a).defaultDose);
  const [db, setDb] = useState(doseB ?? product(b).defaultDose);
  const [cov, setCov] = useState<Coverage>('cash');
  const [yr, setYr] = useState<Year>(2026);
  useEffect(() => {
    const u = readParams(window.location.search);
    const ua = str(u, 'a', a) as ProductId; const ub = str(u, 'b', b) as ProductId;
    if (GLP.some((x) => x.id === ua)) setPa(ua);
    if (GLP.some((x) => x.id === ub)) setPb(ub);
    if (str(u, 'da', '')) setDa(str(u, 'da', ''));
    if (str(u, 'db', '')) setDb(str(u, 'db', ''));
    const uc = str(u, 'pay', 'cash') as Coverage;
    if (['cash', 'partd', 'weightonly'].includes(uc)) setCov(uc);
    const uy = num(u, 'year', 2026); if (uy === 2026 || uy === 2027) setYr(uy);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const A = product(pa); const B = product(pb);
  const dA = dose(A, da); const dB = dose(B, db);
  const q = (id: ProductId, d: string) => compute({ product: id, dose: d, year: yr, coverage: cov, newPatient: false, onTime: true, copay: 0, extraHelp: 'none', medicaidCopay: P.medicaid.defaultCopay });
  const rA = useMemo(() => q(pa, dA.id), [pa, dA.id, cov, yr]); // eslint-disable-line react-hooks/exhaustive-deps
  const rB = useMemo(() => q(pb, dB.id), [pb, dB.id, cov, yr]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { updateURL({ a: pa, da: dA.id, b: pb, db: dB.id, pay: cov, year: yr }); }, [pa, dA.id, pb, dB.id, cov, yr]);
  const ids = (k: string) => `${idPrefix}-${k}`;
  const nameA = `${productName(A, lang)} ${doseLabel(dA, lang)}`; const nameB = `${productName(B, lang)} ${doseLabel(dB, lang)}`;
  const diff = rA.yearly !== null && rB.yearly !== null ? rA.yearly - rB.yearly : null;
  const covOpts = coverageOptions(lang).filter((o) => ['cash', 'partd', 'weightonly'].includes(o.value));
  const form = (
    <>
      <Row2>
        <SelectField id={ids('a')} label={T(lang, 'First medicine', 'Primer medicamento')} value={pa} onChange={(v) => { setPa(v as ProductId); setDa(product(v).defaultDose); }} options={GLP.map((x) => ({ value: x.id, label: productOption(x, lang) }))} />
        <SelectField id={ids('da')} label={T(lang, 'Its dose', 'Su dosis')} value={dA.id} onChange={setDa} options={A.doses.map((x) => ({ value: x.id, label: doseLabel(x, lang) }))} />
      </Row2>
      <Row2>
        <SelectField id={ids('b')} label={T(lang, 'Second medicine', 'Segundo medicamento')} value={pb} onChange={(v) => { setPb(v as ProductId); setDb(product(v).defaultDose); }} options={GLP.map((x) => ({ value: x.id, label: productOption(x, lang) }))} />
        <SelectField id={ids('db')} label={T(lang, 'Its dose', 'Su dosis')} value={dB.id} onChange={setDb} options={B.doses.map((x) => ({ value: x.id, label: doseLabel(x, lang) }))} />
      </Row2>
      <Row2>
        <SelectField id={ids('pay')} label={T(lang, 'How you pay', 'Cómo paga')} value={cov} onChange={(v) => setCov(v as Coverage)} options={covOpts} />
        <Toggle id={ids('year')} label={T(lang, 'Year', 'Año')} value={String(yr)} onChange={(v) => setYr(Number(v) as Year)} options={[{ value: '2026', label: '2026' }, { value: '2027', label: '2027' }]} />
      </Row2>
    </>
  );
  const result = (
    <>
      <Head label={T(lang, `Difference over ${yr}`, `Diferencia en ${yr}`)} value={diff === null ? '–' : usd(Math.abs(diff), lang)}
        sub={diff === null ? undefined : diff === 0 ? T(lang, 'Same yearly cost', 'Mismo costo anual') : T(lang, `${diff > 0 ? nameB : nameA} costs less`, `${diff > 0 ? nameB : nameA} cuesta menos`)} />
      <Bars lang={lang} title={T(lang, 'Your price per month', 'Su precio por mes')} lines={[
        { label: nameA, value: rA.monthly, text: T(lang, 'not published', 'no publicado'), note: ruleText(rA, A, lang, yr) },
        { label: nameB, value: rB.monthly, text: T(lang, 'not published', 'no publicado'), note: ruleText(rB, B, lang, yr) },
      ]} />
      <Bars lang={lang} title={T(lang, 'List price per month', 'Precio de lista por mes')} lines={[
        { label: productName(A, lang), value: rA.list, text: T(lang, 'not published', 'no publicado') },
        { label: productName(B, lang), value: rB.list, text: T(lang, 'not published', 'no publicado') },
      ]} />
      <Note>{rA.yearly !== null && rB.yearly !== null ? T(lang, `${usd(rA.yearly, lang)} against ${usd(rB.yearly, lang)} a year.`, `${usd(rA.yearly, lang)} frente a ${usd(rB.yearly, lang)} al año.`) : ''} {T(lang, 'Estimate only, not medical advice: switching drugs is a decision for your prescriber.', 'Estimación indicativa, no es consejo médico: cambiar de medicamento lo decide su médico.')}{methodHref && <> <a href={methodHref} className="font-medium text-accent-700 underline">{T(lang, 'Method', 'Método')}</a></>}</Note>
      <Actions lang={lang} />
    </>
  );
  return <Shell id="compare" form={form} result={result} />;
}
