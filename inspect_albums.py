import os
import re

base_dir = r'C:\Users\marco\.gemini\antigravity\scratch\green-band-website'

for i in range(5):
    fpath = os.path.join(base_dir, f'photo_album_{i}.html')
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
            html = f.read()
        title_m = re.search(r'<title>(.*?)</title>', html)
        og_desc = re.search(r'<meta property="og:description" content="(.*?)"', html)
        og_title = re.search(r'<meta property="og:title" content="(.*?)"', html)
        print(f"Album {i}:")
        print("  Title:", title_m.group(1) if title_m else "")
        print("  OG Title:", og_title.group(1) if og_title else "")
        print("  OG Desc:", og_desc.group(1) if og_desc else "")
        # Search for any text mentions of "penza", "gruppo", etc.
        for kw in ['penza', 'bar', 'live', 'gruppo', 'marco', 'chitarra']:
            if kw in html.lower():
                print(f"  Keyword '{kw}' found in album {i}")
