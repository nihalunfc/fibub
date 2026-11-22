// Class 10 Light: refractive index as a race. Light pulses start together in vacuum/air, water, glass and diamond.
// The pulse in a medium of refractive index n moves at v = c/n, so the larger n is, the later it finishes the race.
// c = 3.0 x 10^8 m/s; n = c/v. Indices (for yellow light): water 1.33, glass about 1.5, diamond 2.42.
import { canvas, text, title, dot, row, loop } from '../../kit.js';

const LANES = [['Air / vacuum', 1.0003, 1], ['Water', 1.33, 1.33], ['Glass', 1.5, 1.5], ['Diamond', 2.42, 2.42]];
export default function (host) {
  let t = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'A race between light pulses in air, water, glass and diamond' });
  const ctl = row(host);
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(ctl);
  const done = [];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'The race: light slows down in dense media', col);
    const tt = t % 9, x0 = 18, x1 = w - 24, top = 54, gap = (h - top - 34) / 4;
    LANES.forEach(([name, n], k) => {
      const y = top + gap * k + gap / 2, pos = Math.min(1, tt / (3 * n));
      ctx.save(); ctx.globalAlpha = 0.14; ctx.fillStyle = col.s[k]; ctx.fillRect(x0, y - 13, x1 - x0, 26); ctx.restore();
      text(ctx, `${name}  (n = ${n < 1.01 ? '1' : n})`, x0 + 4, y - 20, { color: col.ink, size: 11, weight: 700 });
      text(ctx, `v = ${(3 / n).toFixed(2)} × 10⁸ m/s`, x1 - 2, y - 20, { color: col.muted, size: 10.5, align: 'right' });
      for (let j = 1; j <= 3; j++) { ctx.fillStyle = col.line; ctx.fillRect(x0 + (x1 - x0) * j / 4 - 0.5, y - 13, 1, 26); }
      const x = x0 + 10 + (x1 - x0 - 20) * pos; dot(ctx, x, y, 8, col.s[k], col.panel);
      if (pos >= 1) text(ctx, '✔ finished', x1 - 6, y + 1, { color: col.ink, size: 11, weight: 700, align: 'right', halo: col.panel });
    });
    text(ctx, 'v = c / n  →  n = c / v', 10, h - 12, { color: col.ink, size: 11.5, weight: 700 });
  };
  cv.redraw();
}
