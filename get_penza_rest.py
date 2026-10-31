import urllib.request
import os

penza_dir = r'C:\Users\marco\.gemini\antigravity\scratch\green-band-website\assets\img\penza'
links = [
    'https://lh3.googleusercontent.com/pw/AP1GczNa2KRQxtKd3op8wAqs3XGRnVIxWjd0li4SKRAmvIdc1XhfceoQB0gkNVvx4MlWBy87rxCGLErc9QK0jldzoSTJv-3AmpWYk6RbZiW87HPEvml_6Rs',
    'https://lh3.googleusercontent.com/pw/AP1GczNEBhqiliRUN67EpXb-WfSAH8f_th6vJLr8QCzA6EC0ShC5L3_B8umvalr6hwPBP_uO3Quv3TXjOkHVjsYtrKH3cc7o7elVaSW4o0IywXRz5yyc55k'
]
for idx, l in enumerate(links):
    target = os.path.join(penza_dir, f'penza_{idx+9}.jpg')
    urllib.request.urlretrieve(f"{l}=w1920", target)
    print(f"Downloaded {target} ({os.path.getsize(target)} bytes)")
