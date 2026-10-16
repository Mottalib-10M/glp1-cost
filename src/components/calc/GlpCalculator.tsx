/**
 * Le calculateur du site : « combien je paierai par mois et par an » pour un médicament, un dosage,
 * une façon de payer et une année. Tout le calcul est dans lib/engine (compute) ; ce composant ne
 * fait qu'afficher. Premier rendu = valeurs par défaut (RECETTE §17.5), puis lecture du lien partagé.
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import NumberField from '../ui/NumberField';
import Toggle from '../ui/Toggle';
import { Shell, Row2, Row1, Head, Bars, Note, Actions, usd, T, yesNo, type L, type Line } from './kit';
import { productName, productOption, doseLabel, coverageOptions, ruleText } from './labels';
import { PRODUCTS, product, dose, compute, DATA, P, type Coverage, type Year, type ExtraHelp, type ProductId } from '../../lib/engine/index';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { displayDate } from '../../lib/format';

interface Props { lang?: L; productId?: ProductId; doseId?: string; coverage?: Coverage; year?: Year; lock?: boolean; methodHref?: string; idPrefix?: string }

const COVERAGES: Coverage[] = ['cash', 'commercial', 'partd', 'weightonly', 'medicaid'];

export default function GlpCalculator({ lang = 'en', productId = 'wegovy', doseId, coverage = 'cash', year = 2026, lock = false, methodHref, idPrefix = 'c' }: Props) {
  const [pid, setPid] = useState<ProductId>(productId);
  const p = product(pid);
  const [did, setDid] = useState<string>(doseId ?? p.defaultDose);
  const [cov, setCov] = useState<Coverage>(coverage);
  const [yr, setYr] = useState<Year>(year);
  const [newPatient, setNew] = useState(false);
  const [onTime, setOnTime] = useState(true);
  const [copay, setCopay] = useState(150);
  const [extra, setExtra] = useState<ExtraHelp>('none');
  const [mcopay, setMcopay] = useState<number>(P.medicaid.defaultCopay);

  useEffect(() => {
    const u = readParams(window.location.search);
    const up = str(u, 'drug', productId) as ProductId;
    if (!lock && PRODUCTS.some((x) => x.id === up)) setPid(up);
    const ud = str(u, 'dose', '');
    if (ud) setDid(ud);
    const uc = str(u, 'pay', coverage) as Coverage;
    if (COVERAGES.includes(uc)) setCov(uc);
    const uy = num(u, 'year', year);
    if (uy === 2026 || uy === 2027) setYr(uy);
    setNew(str(u, 'new', '0') === '1');
    setOnTime(str(u, 'late', '0') !== '1');
    setCopay(num(u, 'copay', 150));
    const ux = str(u, 'xh', 'none') as ExtraHelp;
    if (['none', 'partial', 'full'].includes(ux)) setExtra(ux);
    setMcopay(num(u, 'mc', P.medicaid.defaultCopay));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const d = dose(p, did);
  const r = useMemo(() => compute({ product: pid, dose: d.id, year: yr, coverage: cov, newPatient, onTime, copay, extraHelp: extra, medicaidCopay: mcopay }), [pid, d.id, yr, cov, newPatient, onTime, copay, extra, mcopay]);

  useEffect(() => {
    updateURL({ drug: lock ? undefined : pid, dose: d.id, pay: cov, year: yr, new: newPatient ? 1 : undefined, late: onTime ? undefined : 1, copay: cov === 'commercial' ? copay : undefined, xh: cov === 'partd' && extra !== 'none' ? extra : undefined, mc: cov === 'medicaid' ? mcopay : undefined });
  }, [pid, d.id, cov, yr, newPatient, onTime, copay, extra, mcopay, lock]);

  const ids = (k: string) => `${idPrefix}-${k}`;
  const choose = (x: string) => { const np = product(x); setPid(np.id); setDid(np.defaultDose); };
  const showIntro = cov === 'cash' && !!r.cash?.intro;
  const showLate = (cov === 'cash' || ((cov === 'partd' || cov === 'weightonly') && r.rule.startsWith('not-covered'))) && !!r.cash?.late;

  const head = r.monthly === null
    ? { label: T(lang, 'Self-pay price', 'Precio de autopago'), value: T(lang, 'Not published', 'No publicado'), sub: r.nadac ? T(lang, `Pharmacy cost: ${usd(r.nadac.monthly, lang)} a month`, `Costo de la farmacia: ${usd(r.nadac.monthly, lang)} al mes`) : undefined }
    : { label: T(lang, `You would pay, ${productName(p, lang)} ${doseLabel(d, lang)}`, `Usted pagaría, ${productName(p, lang)} ${doseLabel(d, lang)}`), value: `${usd(r.monthly, lang)}${T(lang, ' / month', ' / mes')}`, sub: `${usd(r.yearly ?? 0, lang)} ${T(lang, `in ${yr}`, `en ${yr}`)}` };

  const lines: Line[] = [];
  lines.push({ label: T(lang, 'List price (wholesale acquisition cost)', 'Precio de lista (costo mayorista)'), value: r.list, text: T(lang, 'not published', 'no publicado') });
  if (r.cash) lines.push({ label: T(lang, `Self-pay: ${p.program === 'TrumpRx' ? 'TrumpRx' : `${p.program} or TrumpRx`}`, `Autopago: ${p.program === 'TrumpRx' ? 'TrumpRx' : `${p.program} o TrumpRx`}`), value: !onTime && r.cash.late ? r.cash.late : r.cash.monthly });
  if (r.nadac) lines.push({ label: T(lang, 'What pharmacies pay (NADAC)', 'Lo que pagan las farmacias (NADAC)'), value: r.nadac.monthly });
  if (r.mfp) lines.push({ label: T(lang, `Medicare negotiated price, ${yr}`, `Precio negociado por Medicare, ${yr}`), value: r.mfp });
  if (r.partD && p.partD !== 'excluded') lines.push({ label: T(lang, `Medicare Part D, your share (month avg., ${yr})`, `Parte D de Medicare, su parte (promedio mensual, ${yr})`), value: Math.round(r.partD.oop / 12) });
  if (r.bridge) lines.push({ label: T(lang, 'Medicare GLP-1 Bridge (weight loss)', 'Medicare GLP-1 Bridge (bajar de peso)'), value: P.bridge.copay });

  const form = (
    <>
      <Row1>
        {!lock && <SelectField id={ids('drug')} label={T(lang, 'Medicine', 'Medicamento')} value={pid} onChange={choose}
          options={PRODUCTS.map((x) => ({ value: x.id, label: productOption(x, lang) }))} />}
      </Row1>
      <Row2>
        <SelectField id={ids('dose')} label={T(lang, 'Dose', 'Dosis')} value={d.id} onChange={setDid} options={p.doses.map((x) => ({ value: x.id, label: doseLabel(x, lang) }))} />
        <Toggle id={ids('year')} label={T(lang, 'Year', 'Año')} value={String(yr)} onChange={(v) => setYr(Number(v) as Year)} options={[{ value: '2026', label: '2026' }, { value: '2027', label: '2027' }]} />
      </Row2>
      <Row1>
        <SelectField id={ids('pay')} label={T(lang, 'How you pay', 'Cómo paga')} value={cov} onChange={(v) => setCov(v as Coverage)} options={coverageOptions(lang)}
          help={cov === 'partd' ? T(lang, 'Diabetes, heart risk, sleep apnea or MASH, as the label and CMS allow.', 'Diabetes, riesgo cardíaco, apnea del sueño o MASH, según la ficha y CMS.') : undefined} />
      </Row1>
      {(showIntro || showLate) && (
        <Row2>
          {showIntro ? <Toggle id={ids('new')} label={T(lang, 'First time on it?', '¿Primera vez?')} value={newPatient ? '1' : '0'} onChange={(v) => setNew(v === '1')} options={yesNo(lang)} /> : <div />}
          {showLate ? <Toggle id={ids('late')} label={T(lang, 'Refill within 45 days?', '¿Renueva en 45 días?')} value={onTime ? '1' : '0'} onChange={(v) => setOnTime(v === '1')} options={yesNo(lang)} /> : <div />}
        </Row2>
      )}
      {cov === 'commercial' && (
        <Row2>
          <NumberField id={ids('copay')} label={T(lang, 'Your plan copay a month', 'Copago mensual de su plan')} value={copay} onChange={setCopay} unit="$" max={5000} lang={lang}
            help={T(lang, 'On your plan’s drug list or pharmacy receipt.', 'En la lista de su plan o el recibo de la farmacia.')} />
          <div />
        </Row2>
      )}
      {cov === 'partd' && (
        <Row1>
          <SelectField id={ids('xh')} label={T(lang, 'Extra Help (Part D low-income subsidy)', 'Ayuda Adicional (subsidio de la Parte D)')} value={extra} onChange={(v) => setExtra(v as ExtraHelp)}
            options={[{ value: 'none', label: T(lang, 'No', 'No') }, { value: 'partial', label: T(lang, 'Yes, income up to 150% of poverty level', 'Sí, ingresos hasta 150% del nivel de pobreza') }, { value: 'full', label: T(lang, 'Yes, full Medicaid and income up to 100%', 'Sí, Medicaid completo e ingresos hasta 100%') }]} />
        </Row1>
      )}
      {cov === 'medicaid' && (
        <Row2>
          <NumberField id={ids('mc')} label={T(lang, 'Your Medicaid copay', 'Su copago de Medicaid')} value={mcopay} onChange={setMcopay} unit="$" max={500} decimals={2} lang={lang}
            help={T(lang, 'Set by your state; federal rules keep it nominal.', 'Lo fija su estado; la ley federal lo limita.')} />
          <div />
        </Row2>
      )}
    </>
  );

  const result = (
    <>
      <Head label={head.label} value={head.value} sub={head.sub} />
      <Note>{ruleText(r, p, lang, yr)}</Note>
      <Bars lang={lang} title={T(lang, 'Same dose, other ways to pay (per month)', 'Misma dosis, otras formas de pago (por mes)')} lines={lines} />
      <p className="mt-3 text-xs text-navy-600">
        {T(lang, 'TrumpRx and makers read on', 'TrumpRx y fabricantes leídos el')} {displayDate(DATA.retrieved_at, lang === 'es' ? 'es-US' : 'en-US')} · NADAC {T(lang, 'file of', 'archivo del')} {displayDate(DATA.nadacAsOf, lang === 'es' ? 'es-US' : 'en-US')}.{' '}
        {T(lang, 'Estimate only, not medical advice.', 'Estimación indicativa, no es consejo médico.')}
        {methodHref && <> <a href={methodHref} className="font-medium text-accent-700 underline">{T(lang, 'How it is calculated', 'Cómo se calcula')}</a></>}
      </p>
      <Actions lang={lang} />
    </>
  );
  const yearLines: Line[] = useMemo(() => {
    const base = { product: pid, dose: d.id, year: yr, newPatient, onTime, copay, extraHelp: extra, medicaidCopay: mcopay };
    const y = (c: Coverage) => compute({ ...base, coverage: c }).yearly;
    const out: Line[] = [{ label: T(lang, 'Paying cash (self-pay)', 'Pagando en efectivo (autopago)'), value: y('cash'), text: T(lang, 'no published price', 'sin precio publicado') }];
    if (cov === 'commercial') { const rc = compute({ ...base, coverage: 'commercial' }); out.push({ label: rc.rule === 'commercial-card' ? T(lang, `Private plan, ${usd(copay, lang)} copay with the savings card`, `Plan privado, copago de ${usd(copay, lang)} con la tarjeta`) : T(lang, `Private plan, ${usd(copay, lang)} copay`, `Plan privado, copago de ${usd(copay, lang)}`), value: rc.yearly }); }
    if (p.partD !== 'excluded') out.push({ label: T(lang, 'Medicare Part D, covered use', 'Parte D de Medicare, uso cubierto'), value: y('partd') });
    if (r.bridge) out.push({ label: T(lang, 'Medicare GLP-1 Bridge, weight loss', 'Medicare GLP-1 Bridge, bajar de peso'), value: y('weightonly') });
    out.push({ label: T(lang, `Medicaid, at a ${usd(mcopay, lang, 2)} copay`, `Medicaid, con copago de ${usd(mcopay, lang, 2)}`), value: y('medicaid') });
    return out;
  }, [pid, d.id, yr, newPatient, onTime, copay, extra, mcopay, lang, p.partD, r.bridge, cov]);
  const below = (
    <div className="mt-6 border-t border-navy-200 pt-4">
      <Bars lang={lang} title={T(lang, `The whole of ${yr}, by way of paying`, `Todo ${yr}, según la forma de pago`)} lines={yearLines} />
    </div>
  );
  return <Shell id="glp1" form={form} result={result} aside={below} />;
}
