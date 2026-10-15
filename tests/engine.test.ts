/**
 * Tests du moteur. Deux familles :
 *  - formules, sur des entrées fixes, résultats recalculés à la main (Partie D, plan de paiement,
 *    carte Novo, offres) : ils ne dépendent pas du relevé ;
 *  - cohérence des données relevées (chaque prix d'autopago sous le prix catalogue, chaque produit
 *    a un prix…), plus des cas de référence datés du relevé du 2026-10-15, joués seulement sur ce relevé.
 */
import { describe, it, expect } from 'vitest';
import * as M from '../src/lib/engine/index';
import { firstYear } from '../src/lib/minis/titrationYear';

const close = (a: number, b: number, eps = 0.01) => expect(Math.abs(a - b)).toBeLessThanOrEqual(eps);

describe('Partie D, prestation standard (CMS, 2027 Rate Announcement, tableau V-2)', () => {
  it('2026 : au-dessus du plafond, la part annuelle est 2 100 $', () => {
    // 615 + 25 % × (12 330,12 − 615) = 3 543,78 → plafonné à 2 100
    const y = M.partDYear(12 * 1027.51, 2026);
    close(y.oop, 2100); expect(y.capped).toBe(true);
  });
  it('2027 : 12 × 274 $ = 3 288 $ → 700 + 25 % × 2 588 = 1 347 $', () => {
    close(M.partDYear(12 * 274, 2027).oop, 1347);
  });
  it('2026 : Eliquis au prix négocié 231 $ → 615 + 25 % × 2 157 = 1 154,25 $', () => {
    close(M.partDYear(12 * 231, 2026).oop, 1154.25);
  });
  it('coût annuel sous la franchise : on paie tout', () => {
    close(M.partDYear(400, 2026).oop, 400);
  });
  it('mois du plafond : 1 027,51 $ par mois → juillet (6 mois : 2 002,52 $ ; 7 mois : 2 259,14 $)', () => {
    expect(M.partDCapMonth(1027.51, 2026)).toBe(7);
  });
  it('pas de plafond atteint à 231 $ par mois', () => {
    expect(M.partDCapMonth(231, 2026)).toBeNull();
  });
  it('Extra Help : 12 × 12,65 $ = 151,80 $ (2026), 12 × 5,00 $ = 60 $ (2027, Medicaid complet)', () => {
    close(M.partDYear(12000, 2026, 'partial').oop, 151.8);
    close(M.partDYear(12000, 2027, 'full').oop, 60);
  });
});

describe('Plan de paiement Medicare', () => {
  it('2 100 $ dès janvier → 175 $ par mois ; dès juillet → 350 $', () => {
    close(M.paymentPlanMonthly(2100, 1), 175);
    close(M.paymentPlanMonthly(2100, 7), 350);
    close(M.paymentPlanMonthly(2100, 12), 2100);
  });
});

describe('Carte d’économies Novo Nordisk (au moins 25 $, économie plafonnée à 100 $)', () => {
  const w = M.product('wegovy');
  it.each([[150, 50], [60, 25], [20, 20], [400, 300], [125, 25]])('copaiement %d $ → %d $', (c, r) => close(M.novoCard(w, c)!, r));
  it('ne s’applique pas aux produits Lilly', () => expect(M.novoCard(M.product('zepbound'), 150)).toBeNull());
});

describe('GLP-1 Bridge (FAQ CMS)', () => {
  const z = M.product('zepbound');
  it('Zepbound : KwikPen seulement', () => {
    expect(M.bridgeEligible(z, M.dose(z, 'kwikpen-10'))).toBe(true);
    expect(M.bridgeEligible(z, M.dose(z, 'vial-10'))).toBe(false);
    expect(M.bridgeEligible(z, M.dose(z, 'pen-10'))).toBe(false);
  });
  it('Wegovy (stylo et comprimé) et Foundayo oui, Ozempic et Mounjaro non', () => {
    for (const id of ['wegovy', 'wegovy-pill', 'foundayo'] as const) expect(M.bridgeEligible(M.product(id), M.dose(M.product(id), M.product(id).defaultDose))).toBe(true);
    for (const id of ['ozempic', 'mounjaro'] as const) expect(M.bridgeEligible(M.product(id), M.dose(M.product(id), M.product(id).defaultDose))).toBe(false);
  });
  it('Medicare, perte de poids seule : 50 $ par mois, 600 $ par an', () => {
    const r = M.compute({ product: 'wegovy', dose: '2.4', year: 2026, coverage: 'weightonly', newPatient: false, onTime: true, copay: 0, extraHelp: 'none', medicaidCopay: 4 });
    expect(r.rule).toBe('bridge'); close(r.monthly!, 50); close(r.yearly!, 600);
  });
  it('Foundayo en Partie D (usage exclu) bascule sur le Bridge', () => {
    expect(M.compute({ product: 'foundayo', dose: '9', year: 2026, coverage: 'partd', newPatient: false, onTime: true, copay: 0, extraHelp: 'none', medicaidCopay: 4 }).rule).toBe('bridge');
  });
  it('Ozempic pour la perte de poids seule : pas de couverture, prix d’autopago', () => {
    expect(M.compute({ product: 'ozempic', dose: '1', year: 2026, coverage: 'weightonly', newPatient: false, onTime: true, copay: 0, extraHelp: 'none', medicaidCopay: 4 }).rule).toBe('not-covered-cash');
  });
});

describe('Cohérence des données relevées', () => {
  it('chaque produit GLP-1 vendu sur TrumpRx a un prix d’autopago à chaque dosage concerné', () => {
    for (const p of M.PRODUCTS) for (const d of p.doses) if (d.trx) expect(M.trxVariant(d), `${p.id} ${d.id}`).not.toBeNull();
  });
  it('le prix d’autopago est sous le prix catalogue', () => {
    for (const p of M.PRODUCTS) for (const d of p.doses) {
      const c = M.cashPrice(p, d, 2026); const l = M.listPrice(d);
      if (c && l) expect(c.monthly, `${p.id} ${d.id}`).toBeLessThanOrEqual(l);
    }
  });
  it('chaque ligne NADAC déclarée existe dans le fichier', () => {
    for (const p of M.PRODUCTS) for (const d of p.doses) if (d.nadac) expect(M.nadacMonth(d), `${p.id} ${d.id}`).not.toBeNull();
  });
  it('le prix négocié de la sémaglutide existe pour 2027', () => expect(M.mfp(M.product('ozempic'), 2027)).toBeGreaterThan(0));
});

describe.runIf(M.DATA.retrieved_at === '2026-10-15')('Cas de référence du relevé du 2026-10-15', () => {
  it('Wegovy 0,25 mg, nouveau patient 2026 : 2 × 199 + 10 × 349 = 3 888 $', () => {
    const r = M.compute({ product: 'wegovy', dose: '0.25', year: 2026, coverage: 'cash', newPatient: true, onTime: true, copay: 0, extraHelp: 'none', medicaidCopay: 4 });
    close(r.yearly!, 3888); close(r.monthly!, 349); expect(r.rule).toBe('cash-intro');
  });
  it('Wegovy 2027 : plus d’offre de bienvenue → 12 × 349 = 4 188 $', () => {
    close(M.compute({ product: 'wegovy', dose: '0.25', year: 2027, coverage: 'cash', newPatient: true, onTime: true, copay: 0, extraHelp: 'none', medicaidCopay: 4 }).yearly!, 4188);
  });
  it('Zepbound 10 mg renouvelé en retard : 699 $', () => {
    const r = M.compute({ product: 'zepbound', dose: 'vial-10', year: 2026, coverage: 'cash', newPatient: false, onTime: false, copay: 0, extraHelp: 'none', medicaidCopay: 4 });
    close(r.monthly!, 699); expect(r.rule).toBe('cash-late');
  });
  it('Foundayo 2,5 mg : 149 $ en 2026, 199 $ en 2027', () => {
    const f = M.product('foundayo');
    close(M.cashPrice(f, M.dose(f, '2.5'), 2026)!.monthly, 149);
    close(M.cashPrice(f, M.dose(f, '2.5'), 2027)!.monthly, 199);
  });
  it('NADAC Wegovy 2,4 mg : 4 × 0,75 mL × 435,52629 $ = 1 306,58 $', () => {
    close(M.nadacMonth(M.dose(M.product('wegovy'), '2.4'))!.monthly, 1306.58);
  });
  it('Ozempic Partie D 2026 au prix catalogue 1 027,51 $ : plafond 2 100 $, atteint en juillet', () => {
    const r = M.compute({ product: 'ozempic', dose: '1', year: 2026, coverage: 'partd', newPatient: false, onTime: true, copay: 0, extraHelp: 'none', medicaidCopay: 4 });
    close(r.yearly!, 2100); expect(r.partD!.capMonth).toBe(7); expect(r.partD!.basis).toBe('wac');
  });
  it('Ozempic Partie D 2027 au prix négocié 274 $ : 1 347 $', () => {
    close(M.compute({ product: 'ozempic', dose: '1', year: 2027, coverage: 'partd', newPatient: false, onTime: true, copay: 0, extraHelp: 'none', medicaidCopay: 4 }).yearly!, 1347);
  });
  it('Première année Wegovy (nouveau patient, escalade jusqu’à 2,4 mg) : 3 888 $', () => close(firstYear(0, true).total, 3888));
  it('Première année Zepbound jusqu’à 15 mg : 299 + 399 + 10 × 449 = 5 188 $', () => close(firstYear(5, false).total, 5188));
});
