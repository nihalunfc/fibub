// Class 8 Quadrilaterals: what the diagonals tell you. Pick a shape and switch on the checks: do the diagonals bisect each other,
// are they equal, are they perpendicular, does a diagonal bisect the angles? The numbers are worked out from the corner points.
import { canvas, text, title, row, choice, button, readout } from '../../kit.js';
import { view, grid, shape, seg, mid } from './c8-lib.js';

const S = { Parallelogram: [[1, 1], [7, 1], [9, 5], [3, 5]], Rectangle: [[1, 1], [9, 1], [9, 5], [1, 5]], Rhombus: [[5, 1], [9, 4], [5, 7], [1, 4]], Square: [[2, 1], [8, 1], [8, 7], [2, 7]], Kite: [[5, 1], [9, 4], [5, 8], [2, 4]], Trapezium: [[1, 1], [9, 1], [7, 5], [3, 5]] };
const L = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
export default function (host) {
  let k = 'Parallelogram', on = { bis: true, eq: false, perp: false };
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A quadrilateral with its two diagonals and their midpoints' });
  const out = readout(host); const ctl = row(host);
  choice(ctl, 'Shape', Object.keys(S).map((x) => [x, x]), k, (v) => { k = v; sync(); });
  const row2 = row(host);
  [['bis', 'Midpoints'], ['eq', 'Lengths'], ['perp', 'Right angle']].forEach(([id, t]) => { const b = button(row2, t, () => { on[id] = !on[id]; b.setAttribute('aria-pressed', String(on[id])); sync(); }); b.setAttribute('aria-pressed', String(on[id])); });
  const f = () => { const [A, B, C, D] = S[k], m1 = mid(A, C), m2 = mid(B, D), d1 = [C[0] - A[0], C[1] - A[1]], d2 = [D[0] - B[0], D[1] - B[1]]; return { A, B, C, D, bis: Math.hypot(m1[0] - m2[0], m1[1] - m2[1]) < 1e-9, eq: Math.abs(L(A, C) - L(B, D)) < 1e-9, perp: Math.abs(d1[0] * d2[0] + d1[1] * d2[1]) < 1e-9, m1, m2, l1: L(A, C), l2: L(B, D) }; };
  function sync() { const q = f(); out.innerHTML = `${k}: diagonals ${q.bis ? '<b>bisect</b> each other' : 'do <b>not</b> bisect each other'}; they are ${q.eq ? '<b>equal</b>' : '<b>not equal</b>'} (${q.l1.toFixed(1)} and ${q.l2.toFixed(1)}); they ${q.perp ? 'meet at <b>90°</b>' : 'do <b>not</b> meet at 90°'}.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `Diagonals of a ${k.toLowerCase()}`, col), V = view(w, h, top, 10, 9, 8), q = f();
    grid(ctx, V, col); shape(ctx, V, [q.A, q.B, q.C, q.D], col.s[0], col.ink, 0.12, 2.5);
    seg(ctx, V, q.A, q.C, col.s[3], 2.5); seg(ctx, V, q.B, q.D, col.s[2], 2.5);
    if (on.bis) [[q.m1, col.s[3]], [q.m2, col.s[2]]].forEach(([m, c], i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(V.X(m[0]), V.Y(m[1]) + (i ? 0 : 0), i ? 5 : 8, 0, 7); ctx.fill(); });
    if (on.eq) { text(ctx, `AC = ${q.l1.toFixed(1)}`, 10, top + 10, { color: col.s[3], size: 12, weight: 700 }); text(ctx, `BD = ${q.l2.toFixed(1)}`, 10, top + 28, { color: col.s[2], size: 12, weight: 700 }); }
    if (on.perp) { const c = [(q.m1[0] + q.m2[0]) / 2, (q.m1[1] + q.m2[1]) / 2]; text(ctx, q.perp ? '90° ✓' : 'not 90°', V.X(c[0]) + 16, V.Y(c[1]) - 16, { color: q.perp ? col.s[2] : col.s[3], size: 12, weight: 700, halo: col.panel }); }
    [q.A, q.B, q.C, q.D].forEach((p, i) => text(ctx, 'ABCD'[i], V.X(p[0]) + (p[0] < 5 ? -11 : 11), V.Y(p[1]) + (p[1] < 4 ? 11 : -11), { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel }));
  };
  sync();
}
