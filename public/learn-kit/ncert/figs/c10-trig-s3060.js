// Class 10 Trigonometry (step player): the ratios of 30 and 60 degrees from an equilateral triangle of side 2. The altitude
// from the top bisects the base (1 and 1) and the 60 degree apex angle (30 and 30). Its length is sqrt(3) by Pythagoras, so the
// right triangle has sides 1, sqrt(3), 2 with angles 30, 60, 90.
import { canvas, axes, text, title, line, dot, arrow, row, slider, button, choice, readout, loop } from '../../kit.js';

const D = Math.PI / 180, f3 = (v) => (Math.abs(v) < 5e-10 ? '0' : String(+v.toFixed(3)));
const arcAt = (ctx, x, y, r, a0, a1, color, wd = 2) => { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = wd; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); ctx.restore(); };
const rmark = (ctx, x, y, dx, dy, col, s = 9) => line(ctx, [[x + dx * s, y], [x + dx * s, y + dy * s], [x, y + dy * s]], col, 1.3);
const wrap = (ctx, s, w, y, col, size = 12) => { const words = s.split(' '); let a = '', ls = []; for (const wd of words) { if ((a + ' ' + wd).length > Math.floor(w / (size * 0.53)) && a) { ls.push(a); a = wd; } else a = a ? a + ' ' + wd : wd; } ls.push(a); ls.forEach((l, i) => text(ctx, l, w / 2, y - (ls.length - 1 - i) * (size + 4), { color: col.ink, size, align: 'center', halo: col.panel })); };
const lab = (ctx, s, x, y, tone, col, al = 'center', size = 12) => text(ctx, s, x, y, { color: tone, size, weight: 700, align: al, halo: col && col.panel });

const MSG = ['An equilateral triangle with every side 2 and every angle 60°.', 'Drop the altitude from the top to the base. It cuts the base into 1 and 1, and the top angle into 30° and 30°.', 'Pythagoras in the right half: height² = 2² − 1² = 3, so the height is √3.', 'The half triangle has sides 1, √3 and 2, with angles 30° at the top and 60° at the base corner.', 'For 30°: opposite 1, adjacent √3, hypotenuse 2. sin 30° = 1/2, cos 30° = √3/2, tan 30° = 1/√3.', 'For 60° (the other angle): opposite √3, adjacent 1. sin 60° = √3/2, cos 60° = 1/2, tan 60° = √3.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.12, max: 440, min: 330, label: 'An equilateral triangle cut in half giving the sine cosine and tangent of 30 and 60 degrees' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, '30° and 60° from an equilateral triangle', col), side = Math.min(w - 100, (h - t - 150) / 0.866), x0 = (w - side) / 2, y1 = t + 16 + side * 0.866 + 6, ht = side * 0.866, xm = x0 + side / 2, yT = y1 - ht;
    if (s >= 3) { ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(xm, y1); ctx.lineTo(xm, yT); ctx.fill(); ctx.restore(); }
    line(ctx, [[x0, y1], [x0 + side, y1], [xm, yT], [x0, y1]], col.ink, 2.5);
    if (s >= 1) line(ctx, [[xm, yT], [xm, y1]], col.s[2], 3.5, s >= 3 ? undefined : [6, 4]);
    lab(ctx, '2', x0 + side * 0.22 - 10, (yT + y1) / 2 - 6, col.ink, col, 'right', 13); lab(ctx, '2', x0 + side * 0.78 + 10, (yT + y1) / 2 - 6, col.ink, col, 'left', 13);
    if (s >= 1) { lab(ctx, '1', x0 + side / 4, y1 + 14, col.ink, col, 'center', 13); lab(ctx, '1', x0 + side * 0.75, y1 + 14, col.ink, col, 'center', 13); arcAt(ctx, xm, yT, 30, Math.PI / 2, Math.PI / 2 + 0.5236, col.ink, 1.6); lab(ctx, '30°', xm - 8, yT + 46, col.ink, col, 'right', 11); }
    if (s >= 2) lab(ctx, '√3', xm + 6, (yT + y1) / 2 + 4, col.s[2], col, 'left', 14);
    arcAt(ctx, x0, y1, 28, -Math.PI / 3, 0, col.ink, 1.6); lab(ctx, '60°', x0 + 34, y1 - 8, col.ink, col, 'left', 11);
    rmark(ctx, xm, y1, -1, -1, col.ink);
    if (s >= 4) lab(ctx, 'sin 30° = 1/2   cos 30° = √3/2   tan 30° = 1/√3', w / 2, y1 + 32, col.s[0], col, 'center', 11);
    if (s >= 5) lab(ctx, 'sin 60° = √3/2   cos 60° = 1/2   tan 60° = √3', w / 2, y1 + 50, col.s[1], col, 'center', 11);
    wrap(ctx, MSG[Math.min(s, 5)], w, h - 6, col, 12);
  };
  cv.redraw();
  return { step(i) { s = i; cv.redraw(); } };
}
