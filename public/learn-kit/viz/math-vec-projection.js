// Projection of one vector on another. Drag the tips of a and b. The shadow of a on b is (a·b̂) b̂ and the leftover
// part of a is perpendicular to b: a = a∥ + a⊥. Their lengths are |a|cos θ and |a|sin θ, so a∥ is zero when the
// vectors are perpendicular, and the dot product a·b = |b| × (length of the shadow).
import { canvas, axes, row, button, readout, arrow, dot, line, text } from '../kit.js';
import { drag, f2 } from './_math.js';

export default function (host) {
  let a = [3, 2.5], b = [4, 0.5];
  const cv = canvas(host, { aspect: 0.8, max: 380, min: 260, label: 'Vector a split into a part along b and a part perpendicular to b' });
  const c = row(host);
  button(c, 'Make perpendicular', () => { a = [-b[1] * 0.9, b[0] * 0.9]; cv.redraw(); show(); });
  button(c, 'Make parallel', () => { a = [b[0] * 0.6, b[1] * 0.6]; cv.redraw(); show(); });
  const out = readout(host);
  let A0 = null;
  drag(cv, () => (A0 ? [[A0.X(a[0]), A0.Y(a[1])], [A0.X(b[0]), A0.Y(b[1])]] : []), (i, x, y) => { const p = [Math.max(-5, Math.min(5, -5 + ((x - A0.L) / (A0.R - A0.L)) * 10)), Math.max(-4, Math.min(4, 4 - ((y - A0.T) / (A0.B - A0.T)) * 8))]; i ? (b = p) : (a = p); cv.redraw(); show(); });
  function show() { const bl = Math.hypot(...b) || 1e-9, al = Math.hypot(...a), dd = a[0] * b[0] + a[1] * b[1], p = dd / bl, th = Math.acos(Math.max(-1, Math.min(1, dd / (al * bl || 1e-9)))) * 180 / Math.PI;
    out.innerHTML = `a·b = ${f2(a[0] * b[0])} + ${f2(a[1] * b[1])} = <b>${f2(dd)}</b>. Angle θ = ${f2(th, 1)}°. Component of a along b = a·b̂ = a·b/|b| = <b>${f2(p)}</b> (= |a| cos θ). Perpendicular part has length ${f2(Math.sqrt(Math.max(0, al * al - p * p)))} (= |a| sin θ). ${Math.abs(dd) < 0.05 ? 'a·b = 0: the vectors are perpendicular.' : ''}`; }
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [-5, 5], y: [-4, 4], l: 24, b: 20, t: 22, r: 10, xt: [-4, 0, 4], yt: [-4, 0, 4] }); A0 = A;
    const bl = Math.hypot(...b) || 1e-9, u = [b[0] / bl, b[1] / bl], p = a[0] * u[0] + a[1] * u[1], par = [u[0] * p, u[1] * p], O = [A.X(0), A.Y(0)], T = (v) => [A.X(v[0]), A.Y(v[1])];
    line(ctx, [T([-u[0] * 6, -u[1] * 6]), T([u[0] * 6, u[1] * 6])], col.line, 1, [6, 4]);
    line(ctx, [T(a), T(par)], col.s[2], 1.5, [4, 3]);
    arrow(ctx, ...O, ...T(par), col.s[2], 4);
    const perpv = [a[0] - par[0], a[1] - par[1]]; arrow(ctx, ...T(par), ...T(a), col.s[3], 2);
    arrow(ctx, ...O, ...T(b), col.s[1], 2.5); arrow(ctx, ...O, ...T(a), col.s[0], 2.5);
    dot(ctx, ...T(a), 6, col.s[0], col.ink); dot(ctx, ...T(b), 6, col.s[1], col.ink);
    text(ctx, 'a', T(a)[0] + 9, T(a)[1] - 9, { color: col.s[0], size: 14, weight: 700 }); text(ctx, 'b', T(b)[0] + 9, T(b)[1] - 9, { color: col.s[1], size: 14, weight: 700 });
    text(ctx, 'a∥ (shadow on b)', ...T([par[0] / 2, par[1] / 2]).map((v, i) => v + (i ? 14 : 0)), { color: col.s[2], size: 11, weight: 700, align: 'center' });
    text(ctx, 'a⊥', (T(par)[0] + T(a)[0]) / 2 + 12, (T(par)[1] + T(a)[1]) / 2, { color: col.s[3], size: 11, weight: 700 });
    text(ctx, 'Drag the tips of a and b', A.L + 6, A.T + 10, { color: col.muted, size: 10 });
  };
  show(); cv.redraw();
}
