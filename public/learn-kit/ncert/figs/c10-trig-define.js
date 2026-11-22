// Class 10 Trigonometry (step player): the six trigonometric ratios of angle A in a 3-4-5 right triangle (right angle at C).
// sin = opp/hyp, cos = adj/hyp, tan = opp/adj, and their reciprocals cosec = hyp/opp, sec = hyp/adj, cot = adj/opp.
import { canvas, axes, text, title, line, dot, arrow, row, slider, button, choice, readout, loop } from '../../kit.js';

const D = Math.PI / 180, f3 = (v) => (Math.abs(v) < 5e-10 ? '0' : String(+v.toFixed(3)));
const arcAt = (ctx, x, y, r, a0, a1, color, wd = 2) => { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = wd; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); ctx.restore(); };
const rmark = (ctx, x, y, dx, dy, col, s = 9) => line(ctx, [[x + dx * s, y], [x + dx * s, y + dy * s], [x, y + dy * s]], col, 1.3);
const wrap = (ctx, s, w, y, col, size = 12) => { const words = s.split(' '); let a = '', ls = []; for (const wd of words) { if ((a + ' ' + wd).length > Math.floor(w / (size * 0.53)) && a) { ls.push(a); a = wd; } else a = a ? a + ' ' + wd : wd; } ls.push(a); ls.forEach((l, i) => text(ctx, l, w / 2, y - (ls.length - 1 - i) * (size + 4), { color: col.ink, size, align: 'center', halo: col.panel })); };
const lab = (ctx, s, x, y, tone, col, al = 'center', size = 12) => text(ctx, s, x, y, { color: tone, size, weight: 700, align: al, halo: col && col.panel });

const MSG = ['A right triangle ABC with the right angle at C. We will look at angle A.', 'The hypotenuse is the longest side, across from the right angle: AB = 5.', 'The side opposite A (across from it) is BC = 3.', 'The side adjacent to A (touching it, besides the hypotenuse) is AC = 4.', 'sin A = opposite / hypotenuse = 3/5.  cos A = adjacent / hypotenuse = 4/5.', 'tan A = opposite / adjacent = 3/4. Note tan A = sin A / cos A = (3/5)/(4/5).', 'The three flipped ratios: cosec A = 5/3, sec A = 5/4, cot A = 4/3. In all, six ratios, but they all come from one triangle.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Step by step the six trigonometric ratios of an angle in a 3 4 5 right triangle' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'The six ratios of angle A', col), u = Math.min((w - 100) / 4, (h - t - 120) / 3), Cx = 34, Cy = h - 78 - 4, A = [Cx + 4 * u, Cy], B = [Cx, Cy - 3 * u];
    line(ctx, [[Cx, Cy], A], s >= 3 ? col.s[1] : col.ink, s >= 3 ? 4 : 2.5); line(ctx, [[Cx, Cy], B], s >= 2 ? col.s[0] : col.ink, s >= 2 ? 4 : 2.5); line(ctx, [A, B], s >= 1 ? col.s[2] : col.ink, s >= 1 ? 4 : 2.5);
    rmark(ctx, Cx, Cy, 1, -1, col.ink); lab(ctx, 'C', Cx - 10, Cy + 12, col.ink, col, 'center', 14); lab(ctx, 'B', B[0] - 4, B[1] - 12, col.ink, col, 'center', 14); lab(ctx, 'A', A[0] + 8, A[1] + 12, col.ink, col, 'left', 14);
    arcAt(ctx, A[0], A[1], 32, Math.PI, Math.PI + Math.atan(0.75), col.ink, 2);
    if (s >= 1) lab(ctx, 'hypotenuse 5', (A[0] + B[0]) / 2 + 8, (A[1] + B[1]) / 2 - 12, col.s[2], col, 'left');
    if (s >= 2) lab(ctx, 'opposite 3', Cx - 8, Cy - 1.5 * u, col.s[0], col, 'left', 12);
    if (s >= 3) lab(ctx, 'adjacent 4', Cx + 2 * u, Cy + 15, col.s[1], col);
    const bx = w - 14; let y = t + 20;
    const rows = [['sin A', '3/5', 4], ['cos A', '4/5', 4], ['tan A', '3/4', 5], ['cosec A', '5/3', 6], ['sec A', '5/4', 6], ['cot A', '4/3', 6]];
    rows.forEach(([n, v, at]) => { if (s >= at) { lab(ctx, `${n} = ${v}`, bx, y, col.ink, col, 'right', 13); } y += 20; });
    wrap(ctx, MSG[Math.min(s, 6)], w, h - 8, col, 12);
  };
  cv.redraw();
  return { step(i) { s = i; cv.redraw(); } };
}
