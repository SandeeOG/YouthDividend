#!/usr/bin/env python3
"""Build the Youth Dividend Data Lab dataset bundle from official open-data APIs.

Every figure shown in the Data Lab comes from this script — nothing is typed by hand.
Re-run it to refresh the data:

    python tools/build_datalab.py

Output: assets/js/datalab-data.js  (defines window.YD_DATA)

Sources
  * Eurostat dissemination API (JSON-stat 2.0)
    https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/<dataset>
  * World Bank API — World Development Indicators (ILO modelled estimates) and
    Population estimates and projections (source 40)
    https://api.worldbank.org/v2/
"""
import datetime
import json
import os
import ssl
import time
import urllib.parse
import urllib.request

try:
    import certifi
    CTX = ssl.create_default_context(cafile=certifi.where())
except ImportError:  # fall back to the system store
    CTX = ssl.create_default_context()

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'js', 'datalab-data.js')
ES = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/'
WB = 'https://api.worldbank.org/v2/'
ISO_URL = 'https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json'
TODAY = datetime.date.today().isoformat()


def fetch_json(url, tries=4):
    req = urllib.request.Request(url, headers={'User-Agent': 'YouthDividend-DataLab/1.0'})
    for attempt in range(tries):
        try:
            with urllib.request.urlopen(req, timeout=180, context=CTX) as r:
                return json.loads(r.read())
        except Exception:
            if attempt == tries - 1:
                raise
            time.sleep(4)


# --------------------------------------------------------------------------- Eurostat
def clean_geo(code, label):
    if code == 'EU27_2020':
        return 'EU-27'
    return label.split(' (')[0].strip()


def is_aggregate(code):
    return code != 'EU27_2020' and (code.startswith('EU') or code.startswith('EA') or code in ('EFTA',))


def eurostat(code, since=None, **filters):
    """Return tidy rows [{dim: code, ..., value, flag?}] plus labels, for one dataset."""
    q = [('format', 'JSON'), ('lang', 'en')]
    for k, v in filters.items():
        for x in (v if isinstance(v, (list, tuple)) else [v]):
            q.append((k, x))
    if since:
        q.append(('sinceTimePeriod', str(since)))
    url = ES + code + '?' + urllib.parse.urlencode(q)
    d = fetch_json(url)
    ids, sizes = d['id'], d['size']
    cats = {dim: d['dimension'][dim]['category'] for dim in ids}
    by_pos = {dim: {p: c for c, p in cats[dim]['index'].items()} for dim in ids}
    strides = [1] * len(ids)
    for i in range(len(ids) - 2, -1, -1):
        strides[i] = strides[i + 1] * sizes[i + 1]
    status = d.get('status', {})
    rows = []
    for k, v in d.get('value', {}).items():
        k = int(k)
        row = {dim: by_pos[dim][(k // strides[i]) % sizes[i]] for i, dim in enumerate(ids)}
        if is_aggregate(row.get('geo', '')):
            continue
        row['value'] = v
        if status.get(str(k)):
            row['flag'] = status[str(k)]
        rows.append(row)
    geo = {c: clean_geo(c, l) for c, l in cats.get('geo', {}).get('label', {}).items()}
    labels = {dim: cats[dim].get('label', {}) for dim in ids}
    print(f'  eurostat {code}: {len(rows)} obs')
    return {'rows': rows, 'geo': geo, 'labels': labels, 'title': d.get('label'),
            'updated': d.get('updated'), 'code': code,
            'link': f'https://ec.europa.eu/eurostat/databrowser/view/{code}/default/table?lang=en'}


def source_es(ds, extra=None):
    s = {'org': 'Eurostat', 'code': ds['code'], 'title': ds['title'], 'link': ds['link'],
         'updated': ds['updated'], 'retrieved': TODAY}
    if extra:
        s.update(extra)
    return s


# --------------------------------------------------------------------------- World Bank
def worldbank(indicator, date, source=None):
    base = f'{WB}country/all/indicator/{indicator}?format=json&per_page=20000&date={date}'
    if source:
        base += f'&source={source}'
    page, rows, name = 1, [], None
    while True:
        meta, data = fetch_json(base + f'&page={page}')[:2]
        for x in data or []:
            name = name or x['indicator']['value']
            if x['value'] is not None and x['countryiso3code']:
                rows.append((x['countryiso3code'], int(x['date']), x['value']))
        if page >= meta['pages']:
            break
        page += 1
    print(f'  worldbank {indicator}: {len(rows)} obs')
    return {'rows': rows, 'name': name, 'indicator': indicator,
            'updated': meta.get('lastupdated'),
            'link': f'https://data.worldbank.org/indicator/{indicator}'}


def wb_countries():
    data = fetch_json(f'{WB}country?format=json&per_page=400')[1]
    iso = {c['alpha-3']: c['country-code'] for c in fetch_json(ISO_URL)}
    out = {}
    for c in data:
        if c['region']['id'] == 'NA':  # aggregates
            continue
        out[c['id']] = {'name': c['name'], 'region': c['region']['value'].strip(),
                        'num': iso.get(c['id'])}
    return out


def source_wb(ds, org, extra=None):
    s = {'org': org, 'code': ds['indicator'], 'title': ds['name'], 'link': ds['link'],
         'updated': ds['updated'], 'retrieved': TODAY}
    if extra:
        s.update(extra)
    return s


def series(rows, keyfn, valfn=lambda r: r['value']):
    """Group tidy rows into {key: {time: value}}."""
    out = {}
    for r in rows:
        out.setdefault(keyfn(r), {})[r['time']] = round(valfn(r), 2)
    return out


def r2(x, n=2):
    return None if x is None else round(x, n)


# --------------------------------------------------------------------------- Posts
def p_independence():
    ds = eurostat('yth_demo_030', unit='AVG')
    geos = {}
    for r in ds['rows']:
        g = geos.setdefault(r['geo'], {'name': ds['geo'][r['geo']], 'T': {}, 'M': {}, 'F': {}})
        g[r['sex']][r['time']] = r['value']
    return {'geos': geos, 'source': [source_es(ds)]}


def p_cost():
    ds = eurostat('ilc_lvho07a', since=2010, unit='PC', sex='T', rskpovth='TOTAL', age=['Y15-29', 'TOTAL'])
    geos = {}
    for r in ds['rows']:
        g = geos.setdefault(r['geo'], {'name': ds['geo'][r['geo']], 'young': {}, 'all': {}})
        g['young' if r['age'] == 'Y15-29' else 'all'][r['time']] = r['value']
    return {'geos': geos, 'source': [source_es(ds)]}


def p_paycheck():
    ds = eurostat('earn_ses22_14', unit='PPS', sex='T', indic_se='ERN', isco08='TOTAL', sizeclas='GE10')
    geos = {}
    for r in ds['rows']:
        g = geos.setdefault(r['geo'], {'name': ds['geo'][r['geo']], 'ages': {}})
        g['ages'][r['age']] = r['value']
    return {'geos': geos, 'year': '2022', 'source': [source_es(ds)]}


def p_migration():
    imm = eurostat('migr_imm8', since=2022, unit='NR', sex='T')
    emi = eurostat('migr_emi2', since=2022, unit='NR', sex='T')
    pop = eurostat('demo_pjangroup', since=2022, unit='NR', sex='T', age=['Y20-24', 'Y25-29'])

    def index(ds):
        out = {}
        for r in ds['rows']:
            out.setdefault((r['geo'], r['time'], r.get('agedef', '')), {})[r['age']] = r['value']
        return out

    I, E = index(imm), index(emi)
    P = {}
    for r in pop['rows']:
        P[(r['geo'], r['time'])] = P.get((r['geo'], r['time']), 0) + r['value']
    young = [f'Y{a}' for a in range(20, 30)]
    rates = []
    for geo in sorted({k[0] for k in I}):
        for year in ('2024', '2023', '2022'):
            done = False
            for agedef in ('COMPLET', 'REACH'):
                i, e = I.get((geo, year, agedef)), E.get((geo, year, agedef))
                p = P.get((geo, year))
                if i and e and p and all(a in i for a in young) and all(a in e for a in young):
                    si, se = sum(i[a] for a in young), sum(e[a] for a in young)
                    rates.append({'geo': geo, 'name': imm['geo'].get(geo, geo), 'year': year, 'agedef': agedef,
                                  'imm': si, 'emi': se, 'pop': p, 'rate': r2((si - se) / p * 1000, 1)})
                    done = True
                    break
            if done:
                break
    # Age profile of movers: Eurostat publishes no EU-level single-age breakdown, so sum the
    # countries that report age in completed years (COMPLET) for the latest common year.
    profile = {}
    year = max(r['year'] for r in rates)
    for name, idx in (('imm', I), ('emi', E)):
        by_age, geos = {}, []
        for (geo, t, agedef), ages in idx.items():
            if t != year or agedef != 'COMPLET' or geo == 'EU27_2020':
                continue
            single = {int(a[1:]): v for a, v in ages.items() if a.startswith('Y') and a[1:].isdigit()}
            if 'Y_LT1' in ages:  # Eurostat codes under-ones as Y_LT1
                single[0] = ages['Y_LT1']
            if len(single) < 90:
                continue
            geos.append(geo)
            for a, v in single.items():
                by_age[a] = by_age.get(a, 0) + v
        tot = sum(by_age.values())
        profile[name] = {'year': year, 'countries': len(geos),
                         'share': {a: r2(v / tot * 100, 3) for a, v in sorted(by_age.items()) if a <= 90}}
    return {'rates': rates, 'profile': profile,
            'source': [source_es(imm), source_es(emi), source_es(pop)]}


def p_jobs(countries):
    inds = {'u': 'SL.UEM.1524.ZS', 'p': 'SL.TLF.ACTI.1524.ZS', 'n': 'SL.UEM.NEET.ZS'}
    out, world, srcs = {}, {}, []
    for key, ind in inds.items():
        ds = worldbank(ind, '2010:2025')
        srcs.append(source_wb(ds, 'World Bank / ILO', {'note': 'ILO modelled estimates' if key != 'n' else 'ILO; national survey years vary'}))
        for iso, year, v in ds['rows']:
            if iso == 'WLD':
                world.setdefault(key, {})[year] = r2(v, 1)
            elif iso in countries:
                c = out.setdefault(iso, dict(countries[iso]))
                c.setdefault(key, {})[year] = r2(v, 1)
    return {'countries': out, 'world': world, 'source': srcs}


def p_population(countries):
    parts = ['SP.POP.1519.MA', 'SP.POP.1519.FE', 'SP.POP.2024.MA', 'SP.POP.2024.FE']
    years = (2000, 2025, 2050)
    acc, srcs = {}, []
    for ind in parts + ['SP.POP.TOTL']:
        ds = worldbank(ind, '2000:2050', source=40)
        if ind == parts[0] or ind == 'SP.POP.TOTL':
            srcs.append(source_wb(ds, 'World Bank (UN World Population Prospects)',
                                  {'note': 'Population estimates and projections; projections use the medium variant'}))
        for iso, year, v in ds['rows']:
            if year not in years:
                continue
            key = 'tot' if ind == 'SP.POP.TOTL' else 'y'
            a = acc.setdefault(iso, {}).setdefault(key, {})
            a[year] = a.get(year, 0) + v
    out, world = {}, None
    for iso, a in acc.items():
        rec = {'y': {str(k): int(v) for k, v in a.get('y', {}).items()},
               'tot': {str(k): int(v) for k, v in a.get('tot', {}).items()}}
        if iso == 'WLD':
            world = rec
        elif iso in countries:
            out[iso] = dict(countries[iso], **rec)
    return {'countries': out, 'world': world, 'source': srcs}


def p_gap():
    pov = eurostat('ilc_li02', since=2010, unit='PC', sex='T', rskpovth='B_60', statinfo='MED_EI', age=['Y18-24', 'Y_GE65', 'TOTAL'])
    inc = eurostat('ilc_di03', since=2015, unit='PPS', sex='T', statinfo='MED_EI', age=['Y18-24', 'Y_GE65', 'TOTAL'])
    geos = {}
    for r in pov['rows']:
        g = geos.setdefault(r['geo'], {'name': pov['geo'][r['geo']], 'pov': {}, 'inc': {}})
        g['pov'].setdefault(r['age'], {})[r['time']] = r['value']
    for r in inc['rows']:
        g = geos.setdefault(r['geo'], {'name': inc['geo'][r['geo']], 'pov': {}, 'inc': {}})
        g['inc'].setdefault(r['age'], {})[r['time']] = r['value']
    return {'geos': geos, 'source': [source_es(pov), source_es(inc)]}


def p_eduwork():
    ds = eurostat('edat_lfse_24', since=2014, unit='PC', sex='T', age='Y20-34', duration='Y1-3',
                  isced11=['ED0-2', 'ED3_4', 'ED34_44', 'ED35_45', 'ED5-8', 'TOTAL'])
    geos = {}
    for r in ds['rows']:
        g = geos.setdefault(r['geo'], {'name': ds['geo'][r['geo']], 'lv': {}})
        g['lv'].setdefault(r['isced11'], {})[r['time']] = {'v': r['value'], 'f': r.get('flag', '')}
    return {'geos': geos, 'source': [source_es(ds)]}


def to_minutes(hhmm):
    h, m = str(hhmm).split(':')
    return int(h) * 60 + int(m)


def p_day():
    ds = eurostat('tus_20age', unit='TIME_SP', sex='T', age=['Y15-24', 'TOTAL'])
    geos = {}
    for r in ds['rows']:
        g = geos.setdefault(r['geo'], {'name': ds['geo'][r['geo']], 'year': r['time'], 'ages': {}})
        g['ages'].setdefault(r['age'], {})[r['acl18']] = to_minutes(r['value'])
    return {'geos': geos, 'acts': ds['labels']['acl18'],
            'source': [source_es(ds, {'note': 'Harmonised European Time Use Surveys (HETUS), 2020 wave; fieldwork years vary by country'})]}


def p_digital():
    ai = eurostat('isoc_ai_iaiu', unit='PC_IND', ind_type=['Y16_24', 'Y25_54', 'Y55_74', 'IND_TOTAL'])
    sk = eurostat('isoc_sk_dskl_i21', unit='PC_IND', indic_is='I_DSK2_BAB', ind_type=['Y16_24', 'Y25_54', 'Y55_74', 'IND_TOTAL'])
    geos = {}
    for r in ai['rows']:
        g = geos.setdefault(r['geo'], {'name': ai['geo'][r['geo']], 'ai': {}, 'sk': {}})
        g['ai'].setdefault(r['indic_is'], {})[r['ind_type']] = r['value']
    for r in sk['rows']:
        g = geos.setdefault(r['geo'], {'name': sk['geo'][r['geo']], 'ai': {}, 'sk': {}})
        g['sk'].setdefault(r['ind_type'], {})[r['time']] = r['value']
    return {'geos': geos, 'aiYear': max(r['time'] for r in ai['rows']),
            'source': [source_es(ai), source_es(sk)]}


def main():
    print('Fetching country metadata…')
    countries = wb_countries()
    bundle = {'built': TODAY}
    for key, fn in (('independence', p_independence), ('cost', p_cost), ('paycheck', p_paycheck),
                    ('migration', p_migration), ('gap', p_gap), ('eduwork', p_eduwork),
                    ('day', p_day), ('digital', p_digital)):
        print(f'{key}…')
        bundle[key] = fn()
    print('jobs…')
    bundle['jobs'] = p_jobs(countries)
    print('population…')
    bundle['population'] = p_population(countries)
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('/* Generated by tools/build_datalab.py — do not edit by hand. */\n')
        f.write('window.YD_DATA = ')
        json.dump(bundle, f, ensure_ascii=False, separators=(',', ':'))
        f.write(';\n')
    print(f'Wrote {OUT} ({os.path.getsize(OUT) // 1024} KB)')


if __name__ == '__main__':
    main()
