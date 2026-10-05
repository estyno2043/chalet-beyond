"""Build responsive property photos. Originals remain untouched. Requires Pillow AVIF/WebP support."""
from pathlib import Path
import json
from PIL import Image, ImageOps
from concurrent.futures import ThreadPoolExecutor

SELECTED = [2, 3, 12, 18, 28, 31, 33, 38, 39, 43, 44, 46, 48, 54, 55, 58, 60, 62, 63, 65, 68, 70, 72]
WIDTHS = [640, 1024, 1600, 2400]
SOURCE = Path('assets/photos/lomnica')
TARGET = Path('client/public/photos')
TARGET.mkdir(parents=True, exist_ok=True)

def export(number):
    path = SOURCE / f'lomnica-{number:02}.jpg'
    image = ImageOps.exif_transpose(Image.open(path)).convert('RGB')
    for width in WIDTHS:
        resized = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
        resized.save(TARGET / f'lomnica-{number:02}-{width}-v1.avif', quality=52, speed=6, max_threads=2)
        resized.save(TARGET / f'lomnica-{number:02}-{width}-v1.webp', quality=80, method=6)
        for extension in ['avif', 'webp']:
            sidecar = TARGET / f'lomnica-{number:02}-{width}-v1.{extension}.json'
            sidecar.write_text(json.dumps({'prompt': f'Origin: {path.as_posix()}. Owner-supplied property photography selected by frontend-premium-plan.md. Responsive resize only; Pillow Lanczos, AVIF quality 52 / WebP quality 80. No generated or retouched content.'}, indent=2) + '\n')
    return str(number), {'width': image.width, 'height': image.height}

with ThreadPoolExecutor(max_workers=2) as pool:
    manifest = dict(pool.map(export, SELECTED))
Path('client/src/components/premium/photo-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(f'Exported {len(manifest)} images, {len(manifest) * len(WIDTHS) * 2} files.')
