// Class 11 Biology, Excretory products (step player): the counter-current multiplier. The ascending limb pumps salt out but cannot pass water, so at every level the salt level
// in the medulla is about 200 mOsm/L higher than in the tube beside it; the descending limb, which passes water, follows the medulla. Repeated, this "multiplies" a small
// 200 mOsm/L difference into a gradient from 300 (cortex) to 1200 mOsm/L (tip of the loop).
import { canvas, text, title, line, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'A U-shaped loop of Henle with osmolarity numbers at four depths rising to 1200 at the tip as the counter-current gradient builds' });
  const F = [0, 0.3, 0.6, 0.85, 1], T = ['Start: everything 300', 'Ascending limb pumps salt out', 'Descending limb loses water', 'New fluid enters; gradient grows', 'Steady state: 300 to 1200'];
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[step], col), f = F[step], top = t0 + 24, bot = h - 88, lv = [0, 0.33, 0.66, 1], xd = w * 0.3, xa = w * 0.7, xm = w * 0.5;
    ctx.fillStyle = col.soft; ctx.fillRect(xd + 22, top - 10, xa - xd - 44, bot - top + 14);
    line(ctx, [[xd, top - 14], [xd, bot], [xm, bot + 14], [xa, bot], [xa, top - 14]], col.line, 14);
    text(ctx, 'descending', xd, top - 22, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'ascending', xa, top - 22, { color: col.muted, size: 10, align: 'center' });
    text(ctx, 'medulla fluid', xm, top - 22, { color: col.muted, size: 10, align: 'center' });
    lv.forEach((d) => {
      const y = top + d * (bot - top), med = 300 + 900 * f * d, asc = med - 200 * f, desc = med;
      const c = (v) => `rgb(${Math.round(255 - Math.min(1, (v - 100) / 1100) * 40)},${Math.round(230 - Math.min(1, (v - 100) / 1100) * 150)},${Math.round(210 - Math.min(1, (v - 100) / 1100) * 190)})`;
      text(ctx, String(Math.round(desc)), xd, y, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.bg });
      text(ctx, String(Math.round(med)), xm, y, { color: col.s[3], size: 11, weight: 700, align: 'center' });
      text(ctx, String(Math.round(asc)), xa, y, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.bg });
      if (step >= 1) arrow(ctx, xa - 12, y + 10, xa - 36, y + 10, col.s[2], 2, 6);
      if (step >= 2) arrow(ctx, xd + 12, y + 18, xd + 36, y + 18, col.s[0], 2, 6);
    });
    text(ctx, 'salt pumped out (green), water out (blue)', w / 2, h - 36, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, 'numbers: mOsm/L at each level', w / 2, h - 18, { color: col.muted, size: 10.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
