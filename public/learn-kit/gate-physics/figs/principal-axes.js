// 1.2 Diagonalising a real symmetric matrix = rotating to its principal axes. The curve x^T A x = 1 for
// A = [[a, b], [b, c]] is drawn with the two orthogonal eigenvectors. In those axes the cross term disappears:
// l1 X^2 + l2 Y^2 = 1. Both eigenvalues positive: ellipse; opposite signs: hyperbola; both negative: no curve.
import { canvas, text, arrow, line, row, slider, choice, readout, fmt, title } from '../../kit.js';

const PRESETS = { e: [2, 0.8, 1], h: [1, 2, 1], c: [1.5, 0, 1.5], n: [-1, 0.5, -2] };

export default function (host) {
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 260, label: 'The conic x transpose A x equals 1 for a symmetric 2 by 2 matrix, with its eigenvector axes' });
  let [a, b, c] = PRESETS.e;
  const ctl = row(host);
  choice(ctl, 'Start from', [['e', 'Ellipse'], ['h', 'Hyperbola'], ['c', 'Circle'], ['n', 'No curve']], 'e', (k) => { [a, b, c] = PRESETS[k]; sb.set(b); cv.redraw(); upd(); });
  const sb = slider(ctl, { label: 'Off-diagonal entry b', min: -2.5, max: 2.5, step: 0.05, value: b, fmt: (v) => fmt(v, 2), oninput: (v) => { b = v; cv.redraw(); upd(); } });
  const out = readout(host);
  const eig = () => {
    const t = a + c, D = a * c - b * b, s = Math.sqrt(Math.max(0, (t * t) / 4 - D));
    const l1 = t / 2 + s, l2 = t / 2 - s;
    const ang = Math.abs(b) < 1e-12 ? (a >= c ? 0 : Math.PI / 2) : Math.atan2(l1 - a, b);
    return { l1, l2, ang, D, t };
  };
  const upd = () => {
    const e = eig();
    const kind = e.l2 > 1e-9 ? 'an ellipse' : e.l1 > 1e-9 && e.l2 < -1e-9 ? 'a hyperbola' : e.l1 > 1e-9 ? 'a pair of parallel lines' : 'empty: x^T A x is never positive';
    out.innerHTML = `A = [[${fmt(a, 2)}, ${fmt(b, 2)}], [${fmt(b, 2)}, ${fmt(c, 2)}]]. Eigenvalues λ₁ = ${fmt(e.l1, 3)}, λ₂ = ${fmt(e.l2, 3)} (sum ${fmt(e.t, 3)} = trace, product ${fmt(e.D, 3)} = det). Principal axes at ${fmt((e.ang * 180) / Math.PI, 3)}° and ${fmt((e.ang * 180) / Math.PI + 90, 3)}°, always perpendicular. In those axes λ₁X² + λ₂Y² = 1: the curve is ${kind}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const e = eig(), S = Math.min(w, h) / 6.4, cx = w / 2, cy = h / 2 + 10;
    const P = (x, y) => [cx + x * S, cy - y * S];
    title(ctx, 'xᵀAx = 1 and the eigenvector axes', col);
    line(ctx, [P(-3, 0), P(3, 0)], col.line, 1); line(ctx, [P(0, -2.8), P(0, 2.8)], col.line, 1);
    const u = [Math.cos(e.ang), Math.sin(e.ang)], v = [-u[1], u[0]];
    const X = (Xc, Yc) => [Xc * u[0] + Yc * v[0], Xc * u[1] + Yc * v[1]];
    line(ctx, [P(...X(-3.2, 0)), P(...X(3.2, 0))], col.s[4], 1.5, [7, 5]);
    line(ctx, [P(...X(0, -3.2)), P(...X(0, 3.2))], col.s[5], 1.5, [7, 5]);
    const clip = () => { ctx.save(); ctx.beginPath(); ctx.rect(0, 30, w, h - 50); ctx.clip(); };
    clip();
    if (e.l2 > 1e-9) {
      const pts = []; for (let k = 0; k <= 160; k++) { const t = (k / 160) * 2 * Math.PI; pts.push(P(...X(Math.cos(t) / Math.sqrt(e.l1), Math.sin(t) / Math.sqrt(e.l2)))); }
      line(ctx, pts, col.s[0], 3);
    } else if (e.l1 > 1e-9 && e.l2 < -1e-9) {
      for (const sg of [1, -1]) { const pts = []; for (let k = -60; k <= 60; k++) { const t = k / 20; pts.push(P(...X((sg * Math.cosh(t)) / Math.sqrt(e.l1), Math.sinh(t) / Math.sqrt(-e.l2)))); } line(ctx, pts, col.s[0], 3); }
    } else if (e.l1 > 1e-9) {
      for (const sg of [1, -1]) line(ctx, [P(...X(sg / Math.sqrt(e.l1), -4)), P(...X(sg / Math.sqrt(e.l1), 4))], col.s[0], 3);
    }
    ctx.restore();
    arrow(ctx, ...P(0, 0), ...P(...X(1, 0)), col.s[4], 2.5, 9);
    arrow(ctx, ...P(0, 0), ...P(...X(0, 1)), col.s[5], 2.5, 9);
    text(ctx, `λ₁ = ${fmt(e.l1, 2)}`, ...P(...X(1.35, 0.2)), { color: col.s[4], size: 12, weight: 700, halo: col.panel });
    text(ctx, `λ₂ = ${fmt(e.l2, 2)}`, ...P(...X(0.2, 1.35)), { color: col.s[5], size: 12, weight: 700, halo: col.panel });
    text(ctx, 'dashed: eigenvector directions (principal axes)', 8, h - 10, { color: col.muted, size: 11, base: 'bottom' });
  };
  cv.redraw(); upd();
}
