#!/usr/bin/env python3
"""Télécharge les données officielles du site et écrit src/data/*.json (script rejouable).

Usage : python3 scripts/build-data.py [--sans-catalogue]

Sources, toutes publiques et sans clé d'API :
  1. TrumpRx.gov (gouvernement fédéral) : chaque fiche /p/<slug> porte, dans le HTML servi,
     la liste structurée des dosages (`drugVariants`) avec le prix TrumpRx (`trxPrice`) et le
     prix d'origine, que la page définit comme le Wholesale Acquisition Cost (WAC). Le plan du
     site (sitemap.xml) donne la liste complète des fiches : catalogue.
  2. Fabricants : NovoCare Pharmacy (Novo Nordisk) et LillyDirect (Eli Lilly). On vérifie que
     chaque prix d'autopago lu sur TrumpRx figure aussi sur la page du fabricant (« confirmé »).
  3. CMS, Medicaid : NADAC hebdomadaire (data.medicaid.gov, jeu « NADAC 2026 »), coût moyen
     d'acquisition des pharmacies de détail, par unité (mL ou comprimé).
  4. CMS, Medicare Drug Price Negotiation : fichier des prix négociés (Maximum Fair Price) par
     médicament et par année, archive ZIP publiée sur cms.gov.
  5. CMS, Medicaid : State Drug Utilization Data (SDUD) 2025 et 2026, ordonnances et montants
     remboursés par État et par trimestre.

Un échec de téléchargement arrête le script (code 1) sans écraser les fichiers existants :
le site reste sur les dernières données valides et l'Action GitHub signale l'échec.
"""
import csv, io, json, os, re, subprocess, sys, time, urllib.parse, urllib.request, zipfile
from concurrent.futures import ThreadPoolExecutor
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'src', 'data')
TODAY = date.today().isoformat()


_last = {}
_lock = __import__('threading').Lock()


def get(url, binary=False, tries=4):
    """Téléchargement par curl, son identifiant d'origine, une requête par seconde et par hôte
    (les serveurs de Lilly répondent 429 au-delà) ; nouvel essai espacé en cas d'échec."""
    host = urllib.parse.urlparse(url).netloc
    for k in range(tries):
        with _lock:
            wait = _last.get(host, 0) + 1.0 - time.time()
            _last[host] = max(time.time(), _last.get(host, 0) + 1.0)
        if wait > 0:
            time.sleep(wait)
        r = subprocess.run(['curl', '-sL', '--compressed', '--max-time', '90', '-w', '\\n%{http_code}', url], capture_output=True)
        body, _, code = r.stdout.rpartition(b'\n')
        if r.returncode == 0 and code.strip() == b'200':
            return body if binary else body.decode('utf-8', 'replace')
        if k == tries - 1:
            raise RuntimeError(f'{url} : HTTP {code.decode(errors="replace").strip()} (curl {r.returncode})')
        time.sleep(5 + 10 * k)


def text_of(html):
    t = re.sub(r'<script.*?</script>|<style.*?</style>', ' ', html, flags=re.S)
    t = re.sub(r'<[^>]+>', ' ', t)
    t = t.replace('&amp;', '&').replace('&nbsp;', ' ').replace('&#x27;', "'")
    return re.sub(r'\s+', ' ', t)


def grab(t, key):
    """Valeur JSON (objet, tableau ou chaîne) qui suit `key` dans le flux Next.js de TrumpRx."""
    i = t.find(key)
    if i < 0:
        return None
    j = i + len(key)
    o = t[j]
    if o == '"':
        return t[j + 1:t.find('"', j + 1)]
    if o not in '[{':
        m = re.match(r'[^,}\]]+', t[j:])
        return m.group(0) if m else None
    c = ']' if o == '[' else '}'
    depth = 0
    for k in range(j, len(t)):
        if t[k] == o:
            depth += 1
        elif t[k] == c:
            depth -= 1
            if depth == 0:
                return json.loads(t[j:k + 1])
    return None


# ---------------------------------------------------------------- TrumpRx ----
def trumprx(slug):
    raw = get(f'https://trumprx.gov/p/{slug}')
    t = raw.replace('\\"', '"')
    v = grab(t, '"drugVariants":') or []
    cfg = {}
    for key in ('drugName', 'companyDisplayName', 'genericName', 'originalPriceDisclaimer', 'drugDisclaimer'):
        x = grab(t, f'"{key}":')
        cfg[key] = None if x in (None, '$undefined', 'null') else x
    gen = grab(t, '"isGeneric":')
    variants = []
    for x in v:
        p = x.get('price') or {}
        tier = x.get('tiered') or {}
        cont = x.get('contingentPrice') or {}
        variants.append({
            'form': x.get('form'), 'strength': x.get('strength'), 'quantity': x.get('quantity'),
            'trx': (p.get('trxPrice') or 0) / 100, 'before': (p.get('beforePrice') or 0) / 100,
            'introFills': tier.get('discountedDoseCount') if tier.get('discountedDosePrice') != tier.get('regularDosePrice') else None,
            'introPrice': tier.get('discountedDosePrice', 0) / 100 if tier.get('discountedDosePrice') != tier.get('regularDosePrice') else None,
            'regular': tier.get('regularDosePrice', 0) / 100 if tier.get('discountedDosePrice') != tier.get('regularDosePrice') else None,
            'late': (cont.get('price') or 0) / 100 or None,
        })
    return {'slug': slug, 'url': f'https://trumprx.gov/p/{slug}', 'name': cfg['drugName'], 'maker': cfg['companyDisplayName'],
            'generic': cfg['genericName'], 'isGeneric': gen == 'true',
            'wacLabel': cfg['originalPriceDisclaimer'], 'disclaimer': cfg['drugDisclaimer'], 'variants': variants}


def catalogue():
    sm = get('https://trumprx.gov/sitemap.xml')
    slugs = sorted(set(re.findall(r'trumprx\.gov/p/([a-z0-9-]+)', sm)))
    if len(slugs) < 50:
        raise RuntimeError(f'sitemap TrumpRx : {len(slugs)} fiches seulement')
    with ThreadPoolExecutor(3) as ex:
        rows = list(ex.map(lambda s: _safe(trumprx, s), slugs))
    out = []
    for r in rows:
        if not r or not r['variants']:
            continue
        vs = [v for v in r['variants'] if v['trx'] > 0]
        if not vs:
            continue
        out.append({'s': r['slug'], 'n': (r['name'] or r['slug']).replace('®', '').replace('™', '').strip(),
                    'g': r['generic'], 'm': (r['maker'] or '').replace('®', '').strip(), 'gen': r['isGeneric'],
                    'v': [[v['form'], v['strength'], v['quantity'], v['trx'], v['before'] or None] for v in vs]})
    return {'retrieved_at': TODAY, 'source': 'https://trumprx.gov/sitemap.xml', 'count': len(out), 'items': out}


def _safe(f, *a):
    try:
        return f(*a)
    except Exception as e:  # noqa: BLE001
        print('  ! ', a, e, file=sys.stderr)
        return None


INSULIN = re.compile(r'insulin|lantus|toujeo|tresiba|novolog|fiasp|admelog|apidra|humalog|lyumjev|basaglar|semglee|merilog|rezvoglar|levemir|humulin|novolin', re.I)


def insulins(cat):
    """Fiches d'insuline du catalogue TrumpRx (sous-ensemble léger pour le mini-simulateur)."""
    return {'retrieved_at': cat['retrieved_at'], 'items': [x for x in cat['items'] if INSULIN.search(x['n']) or INSULIN.search(x['g'] or '')]}


# ------------------------------------------------------------------- NADAC ----
NADAC_ID = 'fbb83258-11c7-47f5-8b18-5f8e79f7e704'  # « NADAC (National Average Drug Acquisition Cost) 2026 »


def nadac(like):
    rows, off = [], 0
    while True:
        p = {'limit': 500, 'offset': off, 'conditions[0][property]': 'ndc_description',
             'conditions[0][value]': like, 'conditions[0][operator]': 'LIKE'}
        d = json.loads(get(f'https://data.medicaid.gov/api/1/datastore/query/{NADAC_ID}/0?' + urllib.parse.urlencode(p)))
        rows += d['results']
        off += 500
        if off >= d['count']:
            break
    if not rows:
        return {}
    last = max(r['as_of_date'] for r in rows)
    cur = {}
    for r in rows:
        if r['as_of_date'] == last:
            cur[r['ndc_description'].strip()] = {'perUnit': float(r['nadac_per_unit']), 'unit': r['pricing_unit'],
                                                 'effective': r['effective_date'], 'asOf': last}
    return cur


# --------------------------------------------------------------------- MFP ----
def mfp():
    page = get('https://www.cms.gov/priorities/medicare-prescription-drug-affordability/overview/medicare-drug-price-negotiation-program/selected-drugs-and-negotiated-prices')
    m = re.search(r'href="(/files/zip/selected-drug-list-negotiated-prices[^"]+\.zip)"', page)
    if not m:
        raise RuntimeError('lien du fichier des prix négociés introuvable sur cms.gov')
    z = zipfile.ZipFile(io.BytesIO(get('https://www.cms.gov' + m.group(1), binary=True)))
    name = next(n for n in z.namelist() if n.lower().endswith('.csv'))
    rows = list(csv.DictReader(io.StringIO(z.read(name).decode('utf-8-sig'))))
    out = {}
    for r in rows:
        drug = r['Selected Drug Name'].strip()
        price = r['Single MFP per 30 DES'].strip()
        if not price:
            continue
        start = r['MFP Effective Date'][-4:]
        end = r['MFP End Date'][-4:] if r['MFP End Date'] else None
        # Une ligne vaut pour l'année de son début ; les lignes « 01/01/2026 – 12/31/2025 »
        # sont des corrections de saisie de CMS (fin avant début) : ignorées.
        if end and end < start:
            continue
        d = out.setdefault(drug, {'ingredient': r['Active Ingredient Name or Active Moiety Name'].strip(), 'ipay': r['IPAY'], 'prices': {}})
        d['prices'][start] = float(price)
    asof = re.search(r'(\d{8})\.csv$', name)
    return {'file': name, 'url': 'https://www.cms.gov' + m.group(1), 'fileDate': f'{asof.group(1)[:4]}-{asof.group(1)[4:6]}-{asof.group(1)[6:]}' if asof else None,
            'retrieved_at': TODAY, 'drugs': out}


# -------------------------------------------------------------------- SDUD ----
SDUD = {'2025': '158a1baa-5506-400a-8ec3-97756f0b0536', '2026': '2957a7f9-9a15-453e-9afd-3bbdcbac8fd3'}
SDUD_BRANDS = ['OZEMPIC', 'WEGOVY', 'ZEPBOUND', 'MOUNJARO', 'RYBELSUS', 'TRULICITY', 'FOUNDAYO']


def sdud_year(year, brand):
    rows, off = [], 0
    while True:
        p = {'limit': 500, 'offset': off, 'conditions[0][property]': 'product_name',
             'conditions[0][value]': brand + '%', 'conditions[0][operator]': 'LIKE'}
        d = json.loads(get(f'https://data.medicaid.gov/api/1/datastore/query/{SDUD[year]}/0?' + urllib.parse.urlencode(p)))
        rows += d['results']
        off += 500
        if off >= d['count']:
            break
    return rows


def sdud():
    acc = {}
    for y in SDUD:
        for b in SDUD_BRANDS:
            for r in sdud_year(y, b):
                st = r['state']
                if st == 'XX':  # total national
                    continue
                q = f"{r['year']}Q{r['quarter']}"
                cell = acc.setdefault(st, {}).setdefault(b, {}).setdefault(q, {'rx': 0, 'paid': 0.0, 'suppressed': 0})
                if r['suppression_used'] == 'true' or r['number_of_prescriptions'] is None:
                    cell['suppressed'] += 1
                else:
                    cell['rx'] += int(float(r['number_of_prescriptions']))
                    cell['paid'] += float(r['total_amount_reimbursed'] or 0)
    quarters = sorted({q for s in acc.values() for b in s.values() for q in b})
    # Dernier trimestre « plein » : celui que publient au moins 40 États.
    full = [q for q in quarters if sum(1 for s in acc.values() if any(q in b for b in s.values())) >= 40]
    for s in acc.values():
        for b in s.values():
            for c in b.values():
                c['paid'] = round(c['paid'])
    return {'retrieved_at': TODAY, 'quarters': quarters, 'latestFull': full[-1] if full else None, 'states': acc,
            'source': 'https://data.medicaid.gov/dataset/' + SDUD['2026']}


# ----------------------------------------------------------- fabricants ----
MAKER_PAGES = {
    'novo': ['https://www.novocare.com/pharmacy/wegovy.html', 'https://www.novocare.com/pharmacy/ozempic.html', 'https://www.novocare.com/pharmacy.html'],
    'lilly': ['https://www.lilly.com/lillydirect/medicines/zepbound', 'https://www.lilly.com/lillydirect/medicines/foundayo',
              'https://www.lilly.com/lillydirect/medicines/trulicity', 'https://www.lilly.com/lillydirect/medicines/mounjaro'],
}


def maker_text():
    out = {}
    for k, urls in MAKER_PAGES.items():
        txt = ''
        for u in urls:
            r = _safe(get, u)
            if r:
                txt += ' ' + text_of(r)
        out[k] = txt
    return out


# --------------------------------------------------------------- produits ----
# Fiches TrumpRx suivies dans le calculateur, par produit du site.
PRODUCTS = ['ozempic', 'ozempic-pill', 'wegovy', 'wegovy-pill', 'zepbound', 'zepbound-kwikpen', 'mounjaro', 'foundayo',
            'trulicity', 'xarelto', 'farxiga', 'januvia']
NADAC_LIKE = ['OZEMPIC%', 'WEGOVY%', 'ZEPBOUND%', 'MOUNJARO%', 'RYBELSUS%', 'TRULICITY%', 'FOUNDAYO%', 'ELIQUIS%',
              'JARDIANCE%', 'XARELTO%', 'FARXIGA%', 'JANUVIA%', 'ENTRESTO%']


def main():
    os.makedirs(OUT, exist_ok=True)
    print('TrumpRx : fiches suivies')
    trx = {s: trumprx(s) for s in PRODUCTS}
    for s, r in trx.items():
        if not r['variants']:
            raise RuntimeError(f'TrumpRx {s} : aucun dosage lu (structure de page changée ?)')
    print('Fabricants : pages de prix')
    mk = maker_text()
    for s, r in trx.items():
        txt = mk['novo'] if 'Novo' in (r['maker'] or '') else mk['lilly'] if 'Lilly' in (r['maker'] or '') else ''
        for v in r['variants']:
            v['onMaker'] = bool(txt) and (f"${v['trx']:,.0f}" in txt or f"${v['trx']:.0f}" in txt)
    print('NADAC')
    nd = {}
    for like in NADAC_LIKE:
        nd.update(nadac(like))
    if len(nd) < 30:
        raise RuntimeError(f'NADAC : {len(nd)} lignes seulement')
    print('Prix négociés Medicare')
    mf = mfp()
    print('SDUD')
    sd = sdud()
    prices = {'retrieved_at': TODAY, 'trumprx': trx, 'nadac': nd, 'nadacAsOf': max(x['asOf'] for x in nd.values()),
              'nadacSource': f'https://data.medicaid.gov/dataset/{NADAC_ID}', 'mfp': mf}
    json.dump(prices, open(os.path.join(OUT, 'prices.json'), 'w'), ensure_ascii=False, indent=1)
    json.dump(sd, open(os.path.join(OUT, 'sdud.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
    if '--sans-catalogue' not in sys.argv:
        print('TrumpRx : catalogue complet')
        cat = catalogue()
        json.dump(cat, open(os.path.join(OUT, 'trumprx-catalog.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
        json.dump(insulins(cat), open(os.path.join(OUT, 'insulin.json'), 'w'), ensure_ascii=False, indent=1)
        print(f'  {cat["count"]} fiches')
    print('ok', TODAY)


if __name__ == '__main__':
    try:
        main()
    except Exception as e:  # noqa: BLE001
        print('ÉCHEC :', e, file=sys.stderr)
        sys.exit(1)
