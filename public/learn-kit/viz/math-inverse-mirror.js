// A function and its inverse are mirror images in the line y = x. Pick a function, drag the point along f, and fold
// the paper with the slider: (a, f(a)) lands on (f(a), a), the point of the inverse. A function that is not one-one
// (x² on all of R) fails: its mirror image is not a function, and a horizontal line cuts it twice.
import { canvas, axes, row, slider, choice, readout, dot, line, text } from '../kit.js';
import { curve, drag, f2 } from './_math.js';

const F = {
  cube: ['x³', (x) => x ** 3, -2, 2], exp: ['eˣ', Math.exp, -3, 2], lin: ['2x + 1', (x) => 2 * x + 1, -3, 3],
  sqr: ['x², x ≥ 0', (x) => x * x, 0, 2.4], sqf: ['x² (all x)', (x) => x * x, -2.4, 2.4], sin: ['sin x, −π/2…π/2', Math.sin, -Math.PI / 2, Math.PI / 2],
};
export default function (host) {
  let k = "cube", a = 1, fold = 0.4;
  const cv = canvas(host, { aspect: 0.95, max: 400, min: 280, label: 'A graph reflected in the line y = x' });
  const c1 = row(host), c2 = row(host);
  const re = () => { cv.redraw(); show(); };
  choice(c1, 'Function', Object.entries(F).map(([id, v]) => [id, v[0]]), k, (v) => { k = v; a = Math.min(Math.max(a, F[k][2]), F[k][3]); re(); });
  slider(c2, { label: 'Point x = a', min: -2.4, max: 2.4, step: 0.05, value: a, fmt: (v) => f2(v), oninput: (v) => { a = Math.min(Math.max(v, F[k][2]), F[k][3]); re(); } });
  slider(c2, { label: 'Fold paper', min: 0, max: 1, step: 0.01, value: fold, fmt: (v) => (v === 1 ? 'folded' : v === 0 ? 'open' : f2(v)), oninput: (v) => { fold = v; re(); } });
  const out = readout(host);
  let A0 = null;
  drag(cv, () => (A0 ? [[A0.X(a), A0.Y(F[k][1](a))]] : []), (i, x) => { a = Math.min(Math.max(A0.x(x), F[k][2]), F[k][3]); re(); });
  const show = () => { const f = F[k][1], y = f(a), one = k !== 'sqf';
    out.innerHTML = `Point on f: (${f2(a)}, ${f2(y)}). Its mirror image on the inverse: (${f2(y)}, ${f2(a)}), so f⁻¹(${f2(y)}) = ${f2(a)}. ${one ? 'f is one-one here, so the mirror image is again a function.' : '<b>Not one-one:</b> x = −a and x = a give the same y, so the mirror image is two-valued. Restrict to x ≥ 0 to get √x.'} Composition check: f⁻¹(f(a)) = ${f2(a)}.`; };
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [-4, 4], y: [-4, 4], l: 26, b: 22, t: 22, r: 10, xt: [-4, -2, 0, 2, 4], yt: [-4, -2, 0, 2, 4] });
    A0 = A; A.x = (px) => ((px - A.L) / (A.R - A.L)) * 8 - 4;
    const f = F[k][1], lo = F[k][2], hi = F[k][3];
    ctx.save(); A.clip(); line(ctx, [[A.X(-4), A.Y(-4)], [A.X(4), A.Y(4)]], col.muted, 1.5, [6, 4]); ctx.restore();
    curve(ctx, A, f, lo, hi, col.s[0], 3, { jump: 400 });
    // the folded copy: points (t·y + (1−t)·x, t·x + (1−t)·y)
    ctx.save(); A.clip();
    const pts = []; for (let i = 0; i <= 160; i++) { const x = lo + ((hi - lo) * i) / 160, y = f(x); pts.push([A.X(fold * y + (1 - fold) * x), A.Y(fold * x + (1 - fold) * y)]); }
    line(ctx, pts, col.s[1], 3);
    ctx.restore();
    const y = f(a);
    if (fold > 0) { line(ctx, [[A.X(a), A.Y(y)], [A.X(y), A.Y(a)]], col.muted, 1, [3, 3]); dot(ctx, A.X(fold * y + (1 - fold) * a), A.Y(fold * a + (1 - fold) * y), 6, col.s[1], col.ink); }
    dot(ctx, A.X(a), A.Y(y), 6, col.s[0], col.ink);
    text(ctx, 'y = x', A.X(3.1), A.Y(3.5), { color: col.muted, size: 11 });
    text(ctx, 'f', A.L + 8, A.T + 10, { color: col.s[0], size: 12, weight: 700 }); text(ctx, 'f⁻¹ (mirror)', A.L + 24, A.T + 10, { color: col.s[1], size: 12, weight: 700 });
  };
  re();
}
