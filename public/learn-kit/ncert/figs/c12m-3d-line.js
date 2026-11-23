// Class 12 Maths, Three Dimensional Geometry: the equation of a line through a point A with direction b is r = a + lambda b.
// Each value of lambda is one point of the line: slide it and the point moves along. The same line in Cartesian form is
// (x - x1)/p = (y - y1)/q = (z - z1)/r, where (p, q, r) are the direction ratios (the components of b).
import { canvas, text, title, line, dot, arrow, row, slider, readout } from '../../kit.js';
import { view3d } from '../c12m-view3d.js';

export default function (host) {
  const A = [-2, -1, 1], b = { p: 2, q: 1, r: 1 }; let lam = 1.5;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'A line through a point A with direction b in three dimensions and the moving point for a chosen lambda' });
  const ctl = row(host), ro = readout(host);
  const v = view3d(cv, ctl, { span: 5, yaw: 0.5, pitch: 0.4 });
  slider(ctl, { label: 'λ', min: -2, max: 2, step: 0.1, value: lam, fmt: (t) => t.toFixed(1), oninput: (t) => { lam = t; go(); } });
  ['p', 'q', 'r'].forEach((n) => slider(ctl, { label: 'b: ' + n, min: -3, max: 3, step: 1, value: b[n], fmt: (t) => String(t), oninput: (t) => { b[n] = t; go(); } }));
  const pt = () => [A[0] + lam * b.p, A[1] + lam * b.q, A[2] + lam * b.r];
  const go = () => {
    const P = pt(), f = (t) => +t.toFixed(2);
    ro.textContent = `r = (−2i − j + k) + λ(${b.p}i + ${b.q}j + ${b.r}k).  For λ = ${lam.toFixed(1)}: point (${P.map(f).join(', ')}).  Cartesian: (x + 2)/${b.p} = (y + 1)/${b.q} = (z − 1)/${b.r}${b.p && b.q && b.r ? '' : ' (a 0 below means that coordinate stays fixed)'}.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Line r = a + λb', col); v.fit(w, h, top + 6);
    v.axes(ctx, col);
    const m = Math.hypot(b.p, b.q, b.r) || 1, L = 7 / m, P = pt();
    const e1 = v.P(A[0] - L * b.p, A[1] - L * b.q, A[2] - L * b.r), e2 = v.P(A[0] + L * b.p, A[1] + L * b.q, A[2] + L * b.r), pa = v.P(...A), pp = v.P(...P), O = v.P(0, 0, 0);
    ctx.save(); ctx.beginPath(); ctx.rect(0, top, w, h - top); ctx.clip(); line(ctx, [e1, e2], col.s[0], 2.2); ctx.restore();
    arrow(ctx, O[0], O[1], pa[0], pa[1], col.muted, 1.4, 7);
    arrow(ctx, pa[0], pa[1], pp[0], pp[1], col.s[3], 3, 9);
    dot(ctx, pa[0], pa[1], 5, col.s[2], col.panel); dot(ctx, pp[0], pp[1], 6, col.s[3], col.panel);
    text(ctx, 'A (a)', pa[0] - 8, pa[1] + 12, { color: col.s[2], size: 12, weight: 700, align: 'right', halo: col.panel });
    text(ctx, 'P', pp[0] + 8, pp[1] - 9, { color: col.s[3], size: 13, weight: 700, halo: col.panel });
    text(ctx, 'a', (O[0] + pa[0]) / 2 - 6, (O[1] + pa[1]) / 2, { color: col.muted, size: 11, weight: 700, align: 'right' });
  };
  go();
}
