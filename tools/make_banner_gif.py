"""Генератор демо-гифки для баннера. Запуск: python3 tools/make_banner_gif.py"""
import math, random, os
from PIL import Image, ImageDraw, ImageFont

W, H, N = 480, 300, 24
OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "banner-demo.gif")
COLS = [(255, 45, 149), (255, 210, 0), (0, 229, 255), (124, 0, 255), (198, 255, 0), (255, 255, 255)]

def font(sz):
    for p in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
              "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"):
        if os.path.exists(p):
            return ImageFont.truetype(p, sz)
    return ImageFont.load_default()

F_SM = font(22)
# подбираем размер так, чтобы заголовок влез по ширине
TXT = "С ДНЁМ РОЖДЕНИЯ"
_probe = ImageDraw.Draw(Image.new("RGB", (10, 10)))
F_BIG = font(46)
for _sz in range(46, 18, -2):
    F_BIG = font(_sz)
    if _probe.textlength(TXT, font=F_BIG) <= W - 48:
        break
random.seed(7)
conf = [(random.random(), random.random(), random.choice(COLS), random.uniform(.6, 1.6)) for _ in range(70)]
frames = []

for f in range(N):
    t = f / N
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img)
    # бегущий радужный фон
    for x in range(0, W, 8):
        k = ((x / W) + t) % 1.0
        i = int(k * len(COLS)) % len(COLS)
        c1, c2 = COLS[i], COLS[(i + 1) % len(COLS)]
        m = (k * len(COLS)) % 1.0
        d.rectangle([x, 0, x + 8, H], fill=tuple(int(a + (b - a) * m) for a, b in zip(c1, c2)))
    # падающее конфетти
    for cx, cy, cc, sp in conf:
        y = ((cy + t * sp) % 1.2) * H - 10
        x = cx * W + math.sin((t * 6.28 * sp) + cx * 10) * 8
        d.rectangle([x, y, x + 7, y + 4], fill=cc)
    # торт
    bx, by = W // 2, int(H * 0.66) + int(math.sin(t * 6.28) * 5)
    d.rounded_rectangle([bx - 62, by - 26, bx + 62, by + 30], 10, fill=(255, 244, 251), outline=(22, 0, 36), width=5)
    d.rectangle([bx - 62, by - 6, bx + 62, by + 4], fill=(255, 45, 149))
    for i in (-34, 0, 34):
        d.rectangle([bx + i - 4, by - 54, bx + i + 4, by - 26], fill=(0, 229, 255), outline=(22, 0, 36), width=2)
        fl = 6 + 3 * math.sin(t * 12.56 + i)
        d.ellipse([bx + i - fl / 2, by - 62 - fl, bx + i + fl / 2, by - 54], fill=(255, 210, 0))
    # прыгающий текст
    dy = int(math.sin(t * 6.28) * 7)
    txt = TXT
    w = d.textlength(txt, font=F_BIG)
    for ox, oy, c in ((4, 4, (22, 0, 36)), (0, 0, (255, 255, 255))):
        d.text(((W - w) / 2 + ox, 26 + dy + oy), txt, font=F_BIG, fill=c)
    sub = ["ПРИЗ ВНУТРИ", "ЭТО НЕ РОЗЫГРЫШ", "ТОЧНО НЕ СПАМ"][f % 3 if f % 6 < 3 else (f // 3) % 3]
    w2 = d.textlength(sub, font=F_SM)
    d.text(((W - w2) / 2 + 2, 84 + 2), sub, font=F_SM, fill=(22, 0, 36))
    d.text(((W - w2) / 2, 84), sub, font=F_SM, fill=(198, 255, 0))
    frames.append(img.convert("P", palette=Image.ADAPTIVE, colors=64))

frames[0].save(OUT, save_all=True, append_images=frames[1:], duration=80, loop=0, optimize=True)
print(os.path.abspath(OUT), os.path.getsize(OUT), "bytes")
