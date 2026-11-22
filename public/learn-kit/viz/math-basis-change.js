// The same vector, different coordinates. Drag the tip of v and the tips of the two basis vectors b₁ and b₂. The
// coordinates (c₁, c₂) say how much of each basis vector you need: v = c₁b₁ + c₂b₂ (follow the dashed parallelogram).
// Make the basis orthonormal ("Orthonormal basis") and the coordinates become plain dot products, cᵢ = bᵢ·v, which is
// why orthonormal bases are so convenient. Make b₁ and b₂ parallel and no basis is left (det = 0).
import { canvas, axes, row, button, readout, arrow, dot, line, text } from '../kit.js';
import { drag, f2 } from './_math.js';

export default function (host) {
  let v = [2.5, 1.5], b1 = [2, 0.5], b2 = [-0.5, 1.5];
  const cv = canvas(host, { aspect: 0.82, max: 380, min: 260, label: 'A vector expressed in a chosen basis' });
  const c = row(host);
  button(c, 'Orthonormal basis', () => { const a = Math.atan2(b1[1], b1[0]); b1 = [Math.cos(a), Math.sin(a)]; b2 = [-Math.sin(a), Math.cos(a)]; re(); });
  button(c, 'Standard basis', () => { b1 = [1, 0]; b2 = [0, 1]; re(); });
  const out = readout(host);
  let A0 = null;
  drag(cv, () => (A0 ? [v, b1, b2].map((p) => [A0.X(p[0]), A0.Y(p[1])]) : []), (i, x, y) => { const p = [Math.max(-4.5, Math.min(4.5, -5 + ((x - A0.L) / (A0.R - A0.L)) * 10)), Math.max(-3.5, Math.min(3.5, 4 - ((y - A0.T) / (A0.B - A0.T)) * 8))]; [v, b1, b2][i].splice(0, 2, ...p); re(); });
  const coords = () => { const D = b1[0] * b2[1] - b1[1] * b2[0]; return Math.abs(D) < 1e-6 ? null : [(v[0] * b2[1] - v[1] * b2[0]) / D, (b1[0] * v[1] - b1[1] * v[0]) / D, D]; };
  function re() { cv.redraw(); const c1 = coords(); const o = Math.abs(b1[0] * b2[0] + b1[1] * b2[1]) < 0.03 && Math.abs(Math.hypot(...b1) - 1) < 0.03 && Math.abs(Math.hypot(...b2) - 1) < 0.03;
    out.innerHTML = c1 ? `v = (${f2(v[0])}, ${f2(v[1])}) in the usual axes. In the basis {b₁, b₂}: <b>v = ${f2(c1[0])} b₁ + ${f2(c1[1])} b₂</b>, coordinates (${f2(c1[0])}, ${f2(c1[1])}). det[b₁ b₂] = ${f2(c1[2])}. ${o ? `Orthonormal: c₁ = b₁·v = ${f2(b1[0] * v[0] + b1[1] * v[1])}, c₂ = b₂·v = ${f2(b2[0] * v[0] + b2[1] * v[1])}.` : 'Not orthonormal, so the coordinates are not simple dot products.'}` : 'b₁ and b₂ are parallel (det = 0): they cannot span the plane, so they are not a basis.'; }
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [-5, 5], y: [-4, 4], l: 8, b: 8, t: 22, r: 8, xt: [], yt: [] }); A0 = A; const T = (p) => [A.X(p[0]), A.Y(p[1])], O = T([0, 0]), c1 = coords();
    // dashed grid of the new basis
    if (c1) { ctx.save(); ctx.beginPath(); ctx.rect(A.L, A.T, A.R - A.L, A.B - A.T); ctx.clip(); for (let i = -6; i <= 6; i++) { line(ctx, [T([i * b1[0] - 8 * b2[0], i * b1[1] - 8 * b2[1]]), T([i * b1[0] + 8 * b2[0], i * b1[1] + 8 * b2[1]])], col.line, 1); line(ctx, [T([i * b2[0] - 8 * b1[0], i * b2[1] - 8 * b1[1]]), T([i * b2[0] + 8 * b1[0], i * b2[1] + 8 * b1[1]])], col.line, 1); }
      const m = [c1[0] * b1[0], c1[0] * b1[1]], n2 = [c1[1] * b2[0], c1[1] * b2[1]]; line(ctx, [O, T(m), T(v), T(n2), O], col.s[3], 1.5, [4, 3]); ctx.restore(); }
    arrow(ctx, ...O, ...T(b1), col.s[0], 2.5); arrow(ctx, ...O, ...T(b2), col.s[2], 2.5); arrow(ctx, ...O, ...T(v), col.s[1], 3);
    [[v, 'v', col.s[1]], [b1, 'b₁', col.s[0]], [b2, 'b₂', col.s[2]]].forEach(([p, n, c]) => { dot(ctx, ...T(p), 6, c, col.ink); text(ctx, n, T(p)[0] + 9, T(p)[1] - 9, { color: c, size: 13, weight: 700 }); });
    text(ctx, 'drag v, b₁ and b₂', A.L + 6, A.T + 10, { color: col.muted, size: 10 });
  };
  re();
}
