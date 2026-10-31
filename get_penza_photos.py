import urllib.request
import re
import json

url = 'https://photos.app.goo.gl/d5eeXKiu5hjzpMcdA'
headers = {'User-Agent': 'Mozilla/5.0'}

req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, timeout=15) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

# In Google Photos albums, images are stored in JSON arrays
# Pattern: ["https://lh3.googleusercontent.com/pw/...", width, height]
links = re.findall(r'"(https://lh3\.googleusercontent\.com/pw/[^"]+)"', html)
clean_links = list(dict.fromkeys([l.split('=')[0] for l in links if len(l) > 60]))

print(f"Total distinct photo tokens in Penza album: {len(clean_links)}")
for idx, l in enumerate(clean_links[:10]):
    print(f"Penza img {idx+1}: {l}")

# Let's download them to inspect their dimensions
import os
penza_dir = r'C:\Users\marco\.gemini\antigravity\scratch\green-band-website\assets\img\penza'
os.makedirs(penza_dir, exist_ok=True)

for idx, l in enumerate(clean_links[:8]):
    img_url = f"{l}=w1920"
    target = os.path.join(penza_dir, f'penza_{idx+1}.jpg')
    try:
        urllib.request.urlretrieve(img_url, target)
        print(f"Downloaded penza_{idx+1}.jpg ({os.path.getsize(target)} bytes)")
    except Exception as e:
        print(f"Error {idx+1}: {e}")
