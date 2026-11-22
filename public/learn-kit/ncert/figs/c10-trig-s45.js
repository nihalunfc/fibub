// Class 10 Trigonometry (step player): the ratios of 45 degrees from a square of side 1. The diagonal has length sqrt(2) and splits
// the 90 degree corner into two 45 degree angles, so the triangle has legs 1, 1 and hypotenuse sqrt(2): sin 45 = cos 45 = 1/sqrt(2), tan 45 = 1.
import { canvas, axes, text, title, line, dot, arrow, row, slider, button, choice, readout, loop } from '../../kit.js';

const D = Math.PI / 180, f3 = (v) => (Math.abs(v) < 5e-10 ? '0' : String(+v.toFixed(3)));
const arcAt = (ctx, x, y, r, a0, a1, color, wd = 2) => { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = wd; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); ctx.restore(); };
const rmark = (ctx, x, y, dx, dy, col, s = 9) => line(ctx, [[x + dx * s, y], [x + dx * s, y + dy * s], [x, y + dy * s]], col, 1.3);
const wrap = (ctx, s, w, y, col, size = 12) => { const words = s.split(' '); let a = '', ls = []; for (const wd of words) { if ((a + ' ' + wd).length > Math.floor(w / (size * 0.53)) && a) { ls.push(a); a = wd; } else a = a ? a + ' ' + wd : wd; } ls.push(a); ls.forEach((l, i) => text(ctx, l, w / 2, y - (ls.length - 1 - i) * (size + 4), { color: col.ink, size, align: 'center', halo: col.panel })); };
const lab = (ctx, s, x, y, tone, col, al = 'center', size = 12) => text(ctx, s, x, y, { color: tone, size, weight: 700, align: al, halo: col && col.panel });

const MSG = ['Take a square of side 1. We want a right triangle with a 45° angle.', 'Draw a diagonal. It cuts the square into two equal triangles and splits the 90° corner into two 45° angles.', 'Pythagoras on one triangle: diagonal² = 1² + 1² = 2, so the diagonal is √2.', 'Look at one triangle: angle 45° at the corner, opposite side 1, adjacent side 1, hypotenuse √2.', 'sin 45° = opposite/hypotenuse = 1/√2, and cos 45° = adjacent/hypotenuse = 1/√2.', 'tan 45° = opposite/adjacent = 1/1 = 1. The two legs are equal, so tan is exactly 1.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.1, max: 440, min: 320, label: 'A square cut by its diagonal giving the sine cosine and tangent of 45 degrees' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'The ratios of 45° from a square', col), L = Math.min(w - 90, h - t - 130), X = (w - L) / 2, Y = t + 16 + 10, x1 = X + L, y1 = Y + L;
    if (s < 3) { line(ctx, [[X, Y], [x1, Y], [x1, y1], [X, y1], [X, Y]], col.ink, 2.5); } else { ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(X, y1); ctx.lineTo(x1, y1); ctx.lineTo(x1, Y); ctx.fill(); ctx.restore(); line(ctx, [[X, Y], [x1, Y], [x1, y1], [X, y1], [X, Y]], col.muted, 1.5); line(ctx, [[X, y1], [x1, y1]], col.s[1], 4); line(ctx, [[x1, y1], [x1, Y]], col.s[0], 4); }
    if (s >= 1) line(ctx, [[X, y1], [x1, Y]], col.s[2], s >= 3 ? 4 : 3);
    lab(ctx, '1', (X + x1) / 2, y1 + 14, col.ink, col, 'center', 13); lab(ctx, '1', x1 + 8, (Y + y1) / 2, col.ink, col, 'left', 13);
    if (s >= 1) { arcAt(ctx, X, y1, 30, -Math.PI / 4, 0, col.ink, 1.8); lab(ctx, '45°', X + 38, y1 - 9, col.ink, col, 'left', 12); }
    if (s >= 2) lab(ctx, '√2', (X + x1) / 2 - 6, (Y + y1) / 2 - 12, col.s[2], col, 'right', 14);
    rmark(ctx, x1, y1, -1, -1, col.ink);
    if (s >= 4) lab(ctx, 'sin 45° = cos 45° = 1/√2', w / 2, y1 + 34, col.ink, col, 'center', 13);
    if (s >= 5) lab(ctx, 'tan 45° = 1', w / 2, y1 + 54, col.s[0], col, 'center', 13);
    wrap(ctx, MSG[Math.min(s, 5)], w, h - 8, col, 12);
  };
  cv.redraw();
  return { step(i) { s = i; cv.redraw(); } };
}
