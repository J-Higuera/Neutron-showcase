#!/usr/bin/env python3
import json, re, time, urllib.parse, urllib.request
from pathlib import Path

OUT = Path('assets')
UA = 'NeutronFrondosaImageRepair/1.0 (local portfolio demo; source attribution manifest)'
TARGETS = {
  'birdNestFern': ['Asplenium nidus bird nest fern potted', 'Asplenium nidus'],
  'jade': ['Crassula ovata jade plant potted', 'Crassula ovata'],
  'hoya': ['Hoya carnosa hanging plant', 'Hoya carnosa'],
  'pilea': ['Pilea peperomioides potted plant', 'Pilea peperomioides'],
  'orchid': ['Phalaenopsis orchid potted flower', 'Phalaenopsis orchid'],
  'aloe': ['Aloe vera potted plant', 'Aloe vera'],
  'cachepot': ['ceramic cachepot flower pot', 'ceramic flower pot planter', 'flower pot ceramic'],
  'terracottaSaucer': ['terracotta flower pot saucer', 'terracotta pot'],
  'heatPack': ['disposable hand warmer heat pack', 'hand warmer packet', 'shipping heat pack'],
}

def req(url):
    r = urllib.request.Request(url, headers={'User-Agent': UA})
    return urllib.request.urlopen(r, timeout=40)

def search(q):
    params = {'action':'query','format':'json','generator':'search','gsrsearch':q,'gsrnamespace':'6','gsrlimit':'10','prop':'imageinfo','iiprop':'url|mime|size|extmetadata','iiurlwidth':'1200'}
    with req('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)) as f:
        data=json.load(f)
    pages=sorted(data.get('query',{}).get('pages',{}).values(), key=lambda p:p.get('index',99))
    c=[]
    for p in pages:
        info=(p.get('imageinfo') or [{}])[0]
        if info.get('url') and re.match(r'image/(jpeg|png|webp)', info.get('mime','')) and info.get('width',0)>=350 and info.get('height',0)>=350:
            c.append((p['title'], info))
    return c

def filename(key,title,mime):
    ext={'image/png':'png','image/webp':'webp'}.get(mime,'jpg')
    base=re.sub(r'\.[^.]+$','',title.replace('File:',''))
    base=re.sub(r'[^A-Za-z0-9]+','-',base).strip('-').lower()[:86]
    return f'{key}-{base}.{ext}'

OUT.mkdir(exist_ok=True)
manifest_path=OUT/'image-sources.json'
try:
    manifest=json.loads(manifest_path.read_text())
except Exception:
    manifest={'generatedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()), 'source':'Wikimedia Commons API imageinfo; chosen to replace repeated/misidentified Frondosa catalog primary images.', 'images':{}}

for key, queries in TARGETS.items():
    if key in manifest['images'] and (OUT/manifest['images'][key]['filename']).exists():
        print('skip', key)
        continue
    chosen=None
    for q in queries:
        time.sleep(4)
        try:
            cs=search(q)
        except Exception as e:
            print('search fail', key, q, e)
            time.sleep(20); continue
        if cs:
            chosen=(q, cs[0][0], cs[0][1]); break
    if not chosen:
        print('no candidate', key); continue
    q,title,info=chosen
    name=filename(key,title,info['mime'])
    url=(info.get('thumburl') or info['url']).split('?')[0]
    data = None
    for attempt in range(5):
        try:
            time.sleep(8*(attempt+1))
            with req(url) as f:
                data = f.read()
            (OUT/name).write_bytes(data)
            break
        except Exception as e:
            print('download fail', key, attempt+1, e)
    if data is None:
        continue
    ext=info.get('extmetadata') or {}
    manifest['images'][key]={'query':q,'filename':name,'commonsTitle':title,'descriptionUrl':info.get('descriptionurl'),'width':info.get('width'),'height':info.get('height'),'bytes':len(data),'artist':re.sub('<[^>]+>','',ext.get('Artist',{}).get('value','')),'licenseShortName':ext.get('LicenseShortName',{}).get('value',''),'usageTerms':ext.get('UsageTerms',{}).get('value','')}
    manifest_path.write_text(json.dumps(manifest, indent=2)+'\n')
    print(key, name, len(data))
print('manifest', manifest_path)
