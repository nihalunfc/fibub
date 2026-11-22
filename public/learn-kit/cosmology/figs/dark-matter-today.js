// 8.8 The evidence on every scale, as a step player. Across: size, from a dwarf galaxy (1 kpc) to the whole
// observable universe (about 10 Gpc), on a log scale. Each step adds one kind of evidence at its scale and scores
// two ideas: cold dark matter (CDM) and MOND (modified gravity, no dark matter). The scores sum up the lessons of
// Module 8: ✓ explains it well, ~ partly or with trouble, ✗ has no working explanation without extra ingredients.
import { canvas, text, title, line, dot } from '../../kit.js';

const ITEMS = [
  { lo: 3, hi: 100, name: 'Rotation curves', cdm: 2, mond: 2 },
  { lo: 1000, hi: 4000, name: 'Cluster speeds, gas, lensing', cdm: 2, mond: 1 },
  { lo: 700, hi: 2500, name: 'Bullet Cluster', cdm: 2, mond: 0 },
  { lo: 2e4, hi: 1e6, name: 'Cosmic web, weak lensing', cdm: 2, mond: 0 },
  { lo: 1e6, hi: 1.4e7, name: 'CMB peaks, element recipe', cdm: 2, mond: 0 },
  { lo: 0.5, hi: 5, name: 'Dwarf galaxy puzzles', cdm: 1, mond: 2 },
];
const TITLES = ['Galaxies: both ideas fit', 'Clusters: MOND falls short', 'The Bullet Cluster', 'The cosmic web', 'The first light', 'Small puzzles for dark matter'];

export default function (host) {
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 330, label: 'Evidence for dark matter across sizes from dwarf galaxies to the whole universe, scored for cold dark matter and for MOND' });
  let step = 0;
  cv.draw = (ctx, w, h, col) => {
    const Lp = 14, Rp = w - 14, x0 = Math.log10(0.3), x1 = Math.log10(3e7);
    const X = (kpc) => Lp + ((Math.log10(kpc) - x0) / (x1 - x0)) * (Rp - Lp);
    const top = 50, rowH = Math.min(40, (h - top - 70) / ITEMS.length), axisY = top + rowH * ITEMS.length + 4;
    const mark = (x, y, s) => {
      const c = [col.s[7], col.s[3], col.s[2]][s];
      dot(ctx, x, y, 7, c);
      ctx.save(); ctx.strokeStyle = col.panel; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.beginPath();
      if (s === 2) { ctx.moveTo(x - 3.5, y); ctx.lineTo(x - 1, y + 3); ctx.lineTo(x + 3.5, y - 3); }
      else if (s === 0) { ctx.moveTo(x - 3, y - 3); ctx.lineTo(x + 3, y + 3); ctx.moveTo(x + 3, y - 3); ctx.lineTo(x - 3, y + 3); }
      else { ctx.moveTo(x - 3.5, y); ctx.lineTo(x + 3.5, y); }
      ctx.stroke(); ctx.restore();
    };
    ITEMS.forEach((it, i) => {
      const y = top + i * rowH, on = i <= step, cur = i === step;
      ctx.save(); ctx.globalAlpha = on ? (cur ? 1 : 0.7) : 0.15;
      ctx.fillStyle = cur ? col.s[0] : col.muted;
      ctx.fillRect(X(it.lo), y + 16, Math.max(6, X(it.hi) - X(it.lo)), 5);
      ctx.restore();
      if (!on) return;
      const mid = (X(it.lo) + X(it.hi)) / 2, left = mid < w * 0.5;
      text(ctx, it.name, left ? Math.max(Lp, X(it.lo)) : Math.min(Rp, X(it.hi)), y + 7, { color: cur ? col.ink : col.muted, size: 10.5, weight: cur ? 700 : 500, align: left ? 'left' : 'right', halo: col.panel });
      // scores: two small marks next to the bar
      const sx = left ? X(it.hi) + 14 : X(it.lo) - 44;
      mark(sx, y + 18, it.cdm); mark(sx + 30, y + 18, it.mond);
    });
    line(ctx, [[Lp, axisY], [Rp, axisY]], col.muted, 1);
    for (const [v, s] of [[1, '1 kpc'], [100, '100 kpc'], [1e4, '10 Mpc'], [1e6, '1 Gpc']]) {
      line(ctx, [[X(v), axisY - 3], [X(v), axisY + 3]], col.muted, 1);
      text(ctx, s, X(v), axisY + 12, { color: col.muted, size: 10, align: 'center' });
    }
    text(ctx, 'Size of the thing measured →', Rp, axisY + 28, { color: col.ink, size: 11, weight: 600, align: 'right' });
    const ky = h - 14;
    text(ctx, 'Marks: left = cold dark matter, right = MOND.', 10, ky - 15, { color: col.ink, size: 10.5, weight: 600 });
    mark(16, ky + 2, 2); text(ctx, 'fits', 27, ky + 2, { color: col.muted, size: 10.5 });
    mark(66, ky + 2, 1); text(ctx, 'partly', 77, ky + 2, { color: col.muted, size: 10.5 });
    mark(128, ky + 2, 0); text(ctx, 'no working model', 139, ky + 2, { color: col.muted, size: 10.5 });
    title(ctx, TITLES[step], col);
  };
  cv.redraw();
  return { step(i) { step = i; cv.redraw(); } };
}
