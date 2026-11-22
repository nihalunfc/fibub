// Class 10 Arithmetic Progressions (step player): where a + (n - 1)d comes from. Each new term adds one more copy of the
// common difference d to the first term a. So the third term is a plus two d's, and the n-th term is a plus (n - 1) d's.
// Tiles: one blue "a" tile, then orange "d" tiles. The example uses a = 5, d = 3.
import { canvas, text, title, loop } from '../../kit.js';

export default function (host) {
  let step = 0, k = 1;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'Rows of tiles: the first term a followed by one more d tile in each row' });
  loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt * 3); cv.redraw(); } });
  const LAB = ['a₁ = a', 'a₂ = a + d', 'a₃ = a + 2d', 'a₄ = a + 3d', 'aₙ = a + (n − 1)d'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Count the d tiles: always one fewer than the term number', col) + 16;
    const rows = Math.min(4, step + 1), tw = Math.min(40, (w - 150) / 8), th = Math.min(30, (h - top - 90) / 6);
    for (let r = 0; r < rows; r++) {
      const y = top + r * (th + 12), a = (r === step ? k : 1);
      ctx.globalAlpha = a;
      ctx.fillStyle = col.s[0]; ctx.fillRect(10, y, tw, th); text(ctx, 'a', 10 + tw / 2, y + th / 2, { color: col.panel, size: 13, weight: 700, align: 'center' });
      for (let j = 0; j < r; j++) { ctx.fillStyle = col.s[1]; ctx.fillRect(14 + tw * (j + 1), y, tw - 4, th); text(ctx, 'd', 14 + tw * (j + 1) + tw / 2 - 2, y + th / 2, { color: col.panel, size: 13, weight: 700, align: 'center' }); }
      text(ctx, LAB[r], 20 + tw * 4.6, y + th / 2, { color: col.ink, size: 13, weight: 700 });
      ctx.globalAlpha = 1;
    }
    if (step >= 4) {
      const y = top + 4 * (th + 12) + 6;
      ctx.globalAlpha = k;
      ctx.fillStyle = col.s[0]; ctx.fillRect(10, y, tw, th); text(ctx, 'a', 10 + tw / 2, y + th / 2, { color: col.panel, size: 13, weight: 700, align: 'center' });
      for (let j = 0; j < 5; j++) { ctx.fillStyle = col.s[1]; ctx.fillRect(14 + tw * (j + 1), y, tw - 4, th); }
      text(ctx, '…', 14 + tw * 6.2, y + th / 2, { color: col.ink, size: 16, weight: 700 });
      text(ctx, 'aₙ = a + (n − 1)d', 14 + tw * 7, y + th / 2, { color: col.s[2], size: 13, weight: 700 });
      text(ctx, '(n − 1) tiles of d', 14 + tw, y + th + 14, { color: col.muted, size: 11 });
      text(ctx, 'Example a = 5, d = 3: a₂₀ = 5 + 19 × 3 = 62', 10, y + th + 40, { color: col.s[3], size: 12.5, weight: 700 });
      ctx.globalAlpha = 1;
    }
  };
  cv.redraw();
  return { step(i) { step = Math.min(4, i); k = 0; cv.redraw(); } };
}
