/** Registre des pages : chaque fichier de `src/content/pages/` est chargé ici. */
import type { PageDef, Group } from './page-types';
const mods = import.meta.glob<{ default: PageDef }>(['../content/pages/*.ts', '!../content/pages/_*.ts'], { eager: true });
export const PAGES: PageDef[] = Object.entries(mods)
  .map(([file, m]) => {
    const g = m.default;
    const base = file.split('/').pop()!.replace(/\.ts$/, '');
    if (g.id !== base) throw new Error(`${file} : id « ${g.id} » différent du nom du fichier`);
    return g;
  })
  .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
export const GROUPS: Group[] = ['glp1', 'other', 'compare', 'medicare', 'medicaid', 'guides'];
export const pageById = (id: string) => PAGES.find((p) => p.id === id);
