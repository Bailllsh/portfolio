"""Export a square source photograph to browser icons (requires Pillow).

The source stays outside public/. Only dimensions and file formats change;
no crop, retouch or recolor is applied.
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / 'public'
SOURCE = ROOT / 'assets-source' / 'avatar.jpg'

with Image.open(SOURCE) as original:
    photo = ImageOps.exif_transpose(original).convert('RGB')
    if photo.width != photo.height:
        raise ValueError('Supply a square photograph to retain its composition.')
    for size in (16, 32, 48, 180, 256):
        resized = photo.resize((size, size), Image.Resampling.LANCZOS)
        name = 'apple-touch-icon.png' if size == 180 else f'favicon-{size}.png'
        resized.save(PUBLIC / name, optimize=True)
    photo.resize((256, 256), Image.Resampling.LANCZOS).save(
        PUBLIC / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)]
    )
print('Exported original photography as PNG and ICO; composition unchanged.')
