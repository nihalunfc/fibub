// Multiplying complex numbers turns and stretches. Drag z₁ (blue) and z₂ (orange) on the Argand plane. The product
// z₁z₂ has modulus |z₁||z₂| and argument arg z₁ + arg z₂: z₂ turns z₁ by arg z₂ and scales it by |z₂|. Try dividing,
// squaring, taking the conjugate or 1/z, and press Animate to see the turn-and-stretch happen.
import { canvas, axes, row, choice, button, readout, arrow, dot, line, text, loop, ease } from '../kit.js';
import { drag, f2 } from './_math.js';

export default function (host) {
  let z1 = [1.5, 1], z2 = [0.8, 1.2], op = 'mul', k = 1;
  const cv = canvas(host, { aspect: 0.92, max: 400, min: 280, label: 'Complex numbers on the Argand plane and their product' });
  const ctl = row(host);
  choice(ctl, 'Operation', [['mul', 'z₁ × z₂'], ['div', 'z₁ ÷ z₂'], ['sq', 'z₁²'], ['conj', 'conjugate'], ['inv', '1 / z₁']], op, (v) => { op = v; k = 1; cv.redraw(); });
  const c2 = row(host);
  let play = false, t0 = 0;
  button(c2, 'Animate', () => { play = true; t0 = 0; });
  const anim = loop(host, (dt) => { if (!play) return; t0 += dt / 2.2; k = ease(Math.min(1, t0)); if (t0 >= 1) play = false; cv.redraw(); });
  const out = readout(host);
  let A0 = null;
  const res = (a, b) => ({ mul: [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]], div: (() => { const d = b[0] ** 2 + b[1] ** 2 || 1e-9; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; })(), sq: [a[0] ** 2 - a[1] ** 2, 2 * a[0] * a[1]], conj: [a[0], -a[1]], inv: (() => { const d = a[0] ** 2 + a[1] ** 2 || 1e-9; return [a[0] / d, -a[1] / d]; })() }[op]);
  drag(cv, () => A0 ? [[A0.X(z1[0]), A0.Y(z1[1])], ...(op === 'mul' || op === 'div' ? [[A0.X(z2[0]), A0.Y(z2[1])]] : [])] : [], (i, x, y) => { const p = [Math.min(4, Math.max(-4, ((x - A0.L) / (A0.R - A0.L)) * 8 - 4)), Math.min(4, Math.max(-4, 4 - ((y - A0.T) / (A0.B - A0.T)) * 8))]; (i ? z2 = p : z1 = p); k = 1; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [-4, 4], y: [-4, 4], l: 24, b: 20, t: 22, r: 10, xt: [-4, -2, 0, 2, 4], yt: [-4, -2, 0, 2, 4] }); A0 = A;
    const r = res(z1, z2), two = op === 'mul' || op === 'div';
    const polar = (z) => [Math.hypot(...z), Math.atan2(z[1], z[0])];
    const [m1, a1] = polar(z1), [m2, a2] = polar(z2), [mr, ar] = polar(r);
    // animated position: interpolate modulus and argument from z1 to result
    const am = a1 + (((ar - a1 + Math.PI * 3) % (2 * Math.PI)) - Math.PI) * k, mm = m1 + (mr - m1) * k;
    const cur = [mm * Math.cos(am), mm * Math.sin(am)];
    ctx.save(); ctx.beginPath(); ctx.rect(A.L, A.T, A.R - A.L, A.B - A.T); ctx.clip();
    ctx.beginPath(); ctx.arc(A.X(0), A.Y(0), (A.X(1) - A.X(0)), 0, 7); ctx.strokeStyle = col.line; ctx.stroke();
    const arc = (m, from, to, colr) => { ctx.beginPath(); ctx.arc(A.X(0), A.Y(0), Math.max(8, m * (A.X(1) - A.X(0))), -from, -to, to > from); ctx.strokeStyle = colr; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]); };
    if (k > 0 && k < 1 || play) arc(0.6, a1, am, col.muted);
    ctx.restore();
    const arr = (z, c, n) => { arrow(ctx, A.X(0), A.Y(0), A.X(z[0]), A.Y(z[1]), c, 2.5); dot(ctx, A.X(z[0]), A.Y(z[1]), 4, c); text(ctx, n, A.X(z[0]) + 10, A.Y(z[1]) - 10, { color: c, size: 13, weight: 700 }); };
    arr(z1, col.s[0], 'z₁'); if (two) arr(z2, col.s[1], 'z₂');
    arr(cur, col.s[2], op === 'mul' ? 'z₁z₂' : op === 'div' ? 'z₁/z₂' : op === 'sq' ? 'z₁²' : op === 'conj' ? 'z̄₁' : '1/z₁');
    const d = (v) => f2((v * 180) / Math.PI, 1) + '°';
    const rule = { mul: `|z₁z₂| = ${f2(m1)} × ${f2(m2)} = <b>${f2(mr)}</b> and arg = ${d(a1)} + ${d(a2)} = <b>${d(ar)}</b> (mod 360°)`, div: `|z₁/z₂| = ${f2(m1)} ÷ ${f2(m2)} = <b>${f2(mr)}</b> and arg = ${d(a1)} − ${d(a2)} = <b>${d(ar)}</b>`, sq: `|z₁²| = ${f2(m1)}² = <b>${f2(mr)}</b> and arg = 2 × ${d(a1)} = <b>${d(ar)}</b>`, conj: `same modulus ${f2(m1)}, argument negated: <b>${d(ar)}</b> (mirror image in the real axis)`, inv: `|1/z| = 1/${f2(m1)} = <b>${f2(mr)}</b>, arg = <b>${d(ar)}</b> (negated)` }[op];
    out.innerHTML = `z₁ = ${f2(z1[0])} ${z1[1] < 0 ? '−' : '+'} ${f2(Math.abs(z1[1]))}i${two ? `, z₂ = ${f2(z2[0])} ${z2[1] < 0 ? '−' : '+'} ${f2(Math.abs(z2[1]))}i` : ''}. Result ${f2(r[0])} ${r[1] < 0 ? '−' : '+'} ${f2(Math.abs(r[1]))}i. ${rule}.`;
  };
  cv.redraw();
}
