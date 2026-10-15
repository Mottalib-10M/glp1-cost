/** Pièces communes des outils : cadre deux colonnes, carte de résultat, lignes à barre proportionnelle. */
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { formatMoney, formatNumber } from '../../lib/format';

export type L = 'en' | 'es';
export const usd = (x: number, l: L, d = 0) => formatMoney(x, d, l);
export const T = <A,>(l: L, en: A, es: A) => (l === 'es' ? es : en);

const KeyFigure = createContext<((k: [string, string]) => void) | null>(null);

/** Formulaire à gauche, résultat à droite (marqué data-resultat) ; sur téléphone, barre collante
 *  avec le chiffre clé tant que la carte du résultat est sous l'écran (RECETTE §5). */
export function Shell({ form, result, id, aside }: { form: ReactNode; result: ReactNode; id: string; aside?: ReactNode }) {
  const card = useRef<HTMLDivElement>(null);
  const [below, setBelow] = useState(false);
  const [key, setKey] = useState<[string, string] | null>(null);
  useEffect(() => {
    const el = card.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setBelow(!e.isIntersecting && e.boundingClientRect.top > 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="rechner not-prose rounded-xl border border-navy-200 bg-white p-4 sm:p-6" data-chrome data-calc={id}>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start lg:gap-6">
        <div className="self-start"><form onSubmit={(e) => e.preventDefault()} className="grid content-start gap-y-4">{form}</form>{aside}</div>
        <div ref={card} aria-live="polite" data-resultat className="mt-6 rounded-xl border border-accent-200 bg-accent-50/60 p-4 sm:p-5 lg:sticky lg:top-20 lg:mt-0"><KeyFigure.Provider value={setKey}>{result}</KeyFigure.Provider></div>
      </div>
      {below && key && (
        <button type="button" aria-hidden="true" tabIndex={-1} onClick={() => card.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="fixed inset-x-0 bottom-0 z-40 flex items-baseline justify-between gap-3 border-t border-accent-200 bg-accent-50 px-4 py-3 text-left shadow-lg lg:hidden">
          <span className="text-sm font-medium text-navy-700">{key[0]}</span>
          <span className="tabular-nums shrink-0 text-xl font-bold text-navy-900">{key[1]}</span>
        </button>
      )}
    </div>
  );
}
export const Row2 = ({ children }: { children: ReactNode }) => <div className="grid grid-cols-2 gap-x-4 gap-y-4">{children}</div>;
export const Row1 = ({ children }: { children: ReactNode }) => <div className="grid grid-cols-1 gap-y-4">{children}</div>;

export function Head({ label, value, sub }: { label: string; value: string; sub?: string }) {
  const report = useContext(KeyFigure);
  useEffect(() => { report?.([label, value]); }, [report, label, value]);
  return (
    <>
      <p className="text-sm font-medium text-navy-700">{label}</p>
      <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{value}</p>
      {sub && <p className="tabular-nums mt-1 text-base font-medium text-navy-800">{sub}</p>}
    </>
  );
}

export interface Line { label: string; value: number | null; text?: string; note?: string; strong?: boolean }
/** Lignes de comparaison : montant et barre proportionnelle au plus grand montant de la liste. */
export function Bars({ lines, lang, title, count = false }: { lines: Line[]; lang: L; title?: string; count?: boolean }) {
  const max = Math.max(1, ...lines.map((l) => l.value ?? 0));
  return (
    <div className="mt-4">
      {title && <p className="text-xs font-semibold uppercase tracking-wide text-navy-600">{title}</p>}
      <ul className="mt-2 space-y-2.5">
        {lines.map((l) => (
          <li key={l.label} className={l.strong ? 'font-semibold' : ''}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-navy-800">{l.label}</span>
              <span className="tabular-nums shrink-0 text-navy-900">{l.value === null ? (l.text ?? '–') : count ? formatNumber(l.value, 0, lang) : usd(l.value, lang)}</span>
            </div>
            {l.value !== null && <div className="mt-1 h-1.5 rounded bg-navy-200"><div className="h-1.5 rounded bg-accent-500" style={{ width: `${Math.max(2, (100 * (l.value ?? 0)) / max)}%` }} /></div>}
            {l.note && <p className="mt-0.5 text-xs text-navy-600">{l.note}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
export const Note = ({ children }: { children: ReactNode }) => <p className="mt-3 text-sm text-navy-700">{children}</p>;

/** Copier le lien de la simulation, imprimer (RECETTE §17.2). */
export function Actions({ lang }: { lang: L }) {
  const [done, setDone] = useState(false);
  const copy = () => { try { navigator.clipboard?.writeText(window.location.href); setDone(true); setTimeout(() => setDone(false), 2000); } catch { /* rien */ } };
  return (
    <div className="mt-4 flex flex-wrap gap-2 text-sm no-print">
      <button type="button" onClick={copy} className="rounded-lg border border-navy-300 bg-white px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">{done ? T(lang, 'Link copied', 'Enlace copiado') : T(lang, 'Copy link', 'Copiar enlace')}</button>
      <button type="button" onClick={() => window.print()} className="rounded-lg border border-navy-300 bg-white px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">{T(lang, 'Print', 'Imprimir')}</button>
    </div>
  );
}
export const yesNo = (l: L) => [{ value: '0', label: T(l, 'No', 'No') }, { value: '1', label: T(l, 'Yes', 'Sí') }];
