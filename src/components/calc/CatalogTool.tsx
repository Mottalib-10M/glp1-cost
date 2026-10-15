/**
 * Catalogue TrumpRx : toutes les fiches publiées sur TrumpRx.gov (prix TrumpRx et prix d'origine),
 * filtrables par nom, par type (marque ou générique) et triées. Données : trumprx-catalog.json,
 * relevé par scripts/build-data.py à partir du plan du site TrumpRx.
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { Shell, Row2, Head, Note, usd, T, type L } from './kit';
import { readParams, str, updateURL } from '../../lib/url-state';
import { displayDate, formatNumber } from '../../lib/format';

type V = [string | null, string | null, string | null, number, number | null];
interface Item { s: string; n: string; g: string | null; m: string; gen: boolean; v: V[] }
interface Props { lang?: L; data: { retrieved_at: string; count: number; items: Item[] }; idPrefix?: string }

export default function CatalogTool({ lang = 'en', data, idPrefix = 't' }: Props) {
  const [q, setQ] = useState('');
  const [kind, setKind] = useState('brand');
  const [sort, setSort] = useState('saving');
  useEffect(() => {
    const u = readParams(window.location.search);
    setQ(str(u, 'q', '')); const k = str(u, 'type', 'brand'); if (['brand', 'generic', 'all'].includes(k)) setKind(k);
    const s = str(u, 'sort', 'saving'); if (['saving', 'price', 'name'].includes(s)) setSort(s);
  }, []);
  useEffect(() => { updateURL({ q: q || undefined, type: kind === 'brand' ? undefined : kind, sort: sort === 'saving' ? undefined : sort }); }, [q, kind, sort]);
  const rows = useMemo(() => {
    const k = q.trim().toLowerCase();
    return data.items
      .filter((x) => (kind === 'all' || (kind === 'brand' ? !x.gen : x.gen)) && (!k || x.n.toLowerCase().includes(k) || (x.g ?? '').toLowerCase().includes(k)))
      .map((x) => {
        const best = x.v.reduce((a, b) => (b[3] < a[3] ? b : a), x.v[0]);
        const saving = best[4] && best[4] > best[3] ? 1 - best[3] / best[4] : 0;
        return { x, best, saving };
      })
      .sort((a, b) => (sort === 'name' ? a.x.n.localeCompare(b.x.n) : sort === 'price' ? a.best[3] - b.best[3] : b.saving - a.saving));
  }, [data, q, kind, sort]);
  const shown = rows.slice(0, 40);
  const ids = (k: string) => `${idPrefix}-${k}`;
  const form = (
    <>
      <div className="grid grid-cols-1">
        <label htmlFor={ids('q')} className="mb-1 block text-sm font-medium text-navy-700">{T(lang, 'Search a medicine', 'Buscar un medicamento')}</label>
        <input id={ids('q')} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={T(lang, 'Ozempic, Lantus, metformin…', 'Ozempic, Lantus, metformina…')}
          className="h-12 w-full rounded-lg border border-navy-300 bg-white px-3 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
      </div>
      <Row2>
        <SelectField id={ids('type')} label={T(lang, 'Type', 'Tipo')} value={kind} onChange={setKind} options={[{ value: 'brand', label: T(lang, 'Brand-name deals', 'Acuerdos de marca') }, { value: 'generic', label: T(lang, 'Generics', 'Genéricos') }, { value: 'all', label: T(lang, 'All', 'Todos') }]} />
        <SelectField id={ids('sort')} label={T(lang, 'Sort by', 'Ordenar por')} value={sort} onChange={setSort} options={[{ value: 'saving', label: T(lang, 'Largest saving', 'Mayor ahorro') }, { value: 'price', label: T(lang, 'Lowest price', 'Precio más bajo') }, { value: 'name', label: T(lang, 'Name', 'Nombre') }]} />
      </Row2>
      <div className="overflow-x-auto">
        <table className="journal w-full text-sm">
          <thead><tr>
            <th scope="col" className="px-2 py-2 text-left font-semibold text-navy-900">{T(lang, 'Medicine', 'Medicamento')}</th>
            <th scope="col" className="px-2 py-2 text-right font-semibold text-navy-900">TrumpRx</th>
            <th scope="col" className="px-2 py-2 text-right font-semibold text-navy-900">{T(lang, 'Before', 'Antes')}</th>
          </tr></thead>
          <tbody>
            {shown.map(({ x, best, saving }) => (
              <tr key={x.s}>
                <td className="border-b border-navy-100 px-2 py-1.5 text-navy-800"><a href={`https://trumprx.gov/p/${x.s}`} target="_blank" rel="nofollow noopener noreferrer" className="font-medium text-accent-700 underline">{x.n}</a><span className="block text-xs text-navy-600">{[best[0], best[1], best[2] ? `× ${best[2]}` : null].filter(Boolean).join(' · ')}</span></td>
                <td className="tabular-nums border-b border-navy-100 px-2 py-1.5 text-right text-navy-900">{usd(best[3], lang, best[3] < 100 ? 2 : 0)}</td>
                <td className="tabular-nums border-b border-navy-100 px-2 py-1.5 text-right text-navy-700">{best[4] ? usd(best[4], lang, best[4] < 100 ? 2 : 0) : '–'}{saving > 0 && <span className="block text-xs text-navy-600">−{formatNumber(saving * 100, 0, lang)}%</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
  const result = (
    <>
      <Head label={T(lang, 'Listings matching your search', 'Fichas que coinciden')} value={formatNumber(rows.length, 0, lang)} sub={T(lang, `of ${formatNumber(data.count, 0, lang)} on TrumpRx`, `de ${formatNumber(data.count, 0, lang)} en TrumpRx`)} />
      <Note>{T(lang, `Lowest TrumpRx price per listing, against the “original price” TrumpRx shows. Read on TrumpRx.gov on ${displayDate(data.retrieved_at, 'en-US')}. Prices are self-pay only: they do not count toward an insurance deductible.`, `Precio TrumpRx más bajo por ficha, frente al «precio original» que muestra TrumpRx. Leído en TrumpRx.gov el ${displayDate(data.retrieved_at, 'es-US')}. Son precios de autopago: no cuentan para el deducible del seguro.`)}</Note>
      <Note>{T(lang, 'Estimate only: the pharmacy and the program confirm the final price.', 'Estimación indicativa: la farmacia y el programa confirman el precio final.')}</Note>
    </>
  );
  return <Shell id="catalog" form={form} result={result} />;
}
