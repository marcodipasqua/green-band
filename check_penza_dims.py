import os
import struct

def get_image_info(filepath):
    with open(filepath, 'rb') as f:
        data = f.read(30)
        if data[:8] == b'\x89PNG\r\n\x1a\n':
            w, h = struct.unpack('>LL', data[16:24])
            return 'PNG', w, h
        elif data[:2] == b'\xff\xd8':
            f.seek(0)
            data = f.read()
            i = 2
            while i < len(data) - 8:
                if data[i] == 0xff:
                    marker = data[i+1]
                    if marker in (0xc0, 0xc1, 0xc2, 0xc3):
                        h, w = struct.unpack('>HH', data[i+5:i+9])
                        return 'JPEG', w, h
                    elif marker in (0xd9, 0xda):
                        break
                    elif marker not in (0x00, 0xff):
                        length = struct.unpack('>H', data[i+2:i+4])[0]
                        i += 2 + length
                        continue
                i += 1
            return 'JPEG', 0, 0
    return 'UNKNOWN', 0, 0

penza_dir = r'C:\Users\marco\.gemini\antigravity\scratch\green-band-website\assets\img\penza'
for f in sorted(os.listdir(penza_dir)):
    p = os.path.join(penza_dir, f)
    fmt, w, h = get_image_info(p)
    print(f"{f}: {w}x{h} (ratio: {w/h:.2f} if h else 0)")
