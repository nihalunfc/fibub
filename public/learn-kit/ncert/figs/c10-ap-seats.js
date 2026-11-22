// Class 10 Arithmetic Progressions (step player): a stadium block with 15 rows. The first row has 20 seats and every
// row has 2 more than the one in front: an AP with a = 20, d = 2, n = 15. Last row l = 20 + 14 x 2 = 48 and
// S = n(a + l)/2 = 15 x 68 / 2 = 510 seats. Rows are drawn as bars centred on the aisle, so the block looks like a trapezium.
import { canvas, text, title, loop } from '../../kit.js';

export default function (host) {
  let step = 0, k = 1;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'A stadium block whose rows each have two more seats than the row before' });
  loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt * 3); cv.redraw(); } });
  const CAP = ['A stand has 15 rows. Row 1 has 20 seats, each row has 2 more', 'a = 20, d = 2, n = 15', 'Last row: l = a + (n − 1)d = 20 + 14 × 2 = 48', 'S = n(a + l)/2 = 15 × (20 + 48) / 2', 'Total seats: 15 × 34 = 510'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Seats in a stadium block', col) + 12;
    const rh = Math.min(15, (h - top - 70) / 15), cx = w / 2, sc = (w - 70) / 48;
    for (let r = 0; r < 15; r++) {
      const seats = 20 + 2 * r, bw = seats * sc, y = top + r * (rh + 1.5);
      const hi = (step === 1 && r < 3) || (step === 2 && r === 14);
      ctx.globalAlpha = r === step - 1 ? k : 1;
      ctx.fillStyle = hi ? col.s[2] : step >= 3 ? col.s[0] : col.s[1]; ctx.globalAlpha = hi ? 1 : 0.65;
      ctx.fillRect(cx - bw / 2, y, bw, rh);
      ctx.globalAlpha = 1;
      if (hi || r === 0 || r === 14) text(ctx, String(seats), cx, y + rh / 2, { color: col.panel, size: Math.min(11, rh), weight: 700, align: 'center' });
    }
    if (step === 1) text(ctx, '20, 22, 24 …', cx + 12 * sc + 8, top + 1.5 * (rh + 1.5), { color: col.s[2], size: 11.5, weight: 700 });
    if (step >= 3) text(ctx, step === 3 ? 'S = 15 × 68 / 2' : 'S = 510 seats', cx, top + 15 * (rh + 1.5) + 18, { color: col.s[3], size: 15, weight: 700, align: 'center' });
    text(ctx, CAP[step], w / 2, h - 14, { color: col.muted, size: 10.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(4, i); k = 0; cv.redraw(); } };
}
