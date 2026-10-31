import urllib.request
import re

urls = [
    'https://photos.app.goo.gl/4ViWwxcBa83rkAZb6',
    'https://photos.app.goo.gl/g8bWzw9GhS4h2Z8N7',
    'https://photos.app.goo.gl/GPzhQ5k4Fue9hpRm6',
    'https://photos.app.goo.gl/d5eeXKiu5hjzpMcdA',
    'https://photos.app.goo.gl/fC2W59d5fRxu92fC9'
]

headers = {'User-Agent': 'Mozilla/5.0'}

for idx, u in enumerate(urls):
    try:
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            final_url = resp.geturl()
            html = resp.read().decode('utf-8', errors='ignore')
            title = re.search(r'<title>(.*?)</title>', html)
            og_title = re.search(r'<meta property="og:title" content="(.*?)"', html)
            og_desc = re.search(r'<meta property="og:description" content="(.*?)"', html)
            # Find photo names or dates
            print(f"Photo {idx+1}:")
            print("  Title:", title.group(1) if title else "")
            print("  OG Title:", og_title.group(1) if og_title else "")
            print("  OG Desc:", og_desc.group(1) if og_desc else "")
            # check if there are string occurrences of penza or filenames
            for m in re.finditer(r'["\']([^"\']*(?:penza|marco|group|band|live|20260626)[^"\']*)["\']', html, re.IGNORECASE):
                print("  Match:", m.group(1)[:100])
    except Exception as e:
        print(f"Error Photo {idx+1}: {e}")
