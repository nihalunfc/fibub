// Class 11 Maths, Three-dimensional Geometry: the section formula. P divides AB in the ratio m : n (AP : PB = m : n): P = ((m x2 + n x1)/(m + n), ...).
// Externally (P outside the segment): P = ((m x2 - n x1)/(m - n), ...) when m is not n. m = n inside gives the midpoint.
import { canvas, text, title, line, dot, row, slider, readout, choice } from '../../kit.js';
import { view3d } from '../c12m-view3d.js';

export default function (host) {
  const A = [-3, 2, -2], B = [3, -2, 4]; let m = 1, n = 2, ext = false;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 330, label: 'A point dividing the segment AB in a ratio m to n, internally or externally' });
  const ctl = row(host), ro = readout(host);
  const v = view3d(cv, ctl, { span: 5, yaw: 0.55, pitch: 0.45 });
  choice(ctl, 'Divide', [[false, 'internally'], [true, 'externally']], ext, (t) => { ext = t; cv.redraw(); });
  slider(ctl, { label: 'm', min: 1, max: 5, step: 1, value: m, fmt: String, oninput: (t) => { m = t; cv.redraw(); } });
  slider(ctl, { label: 'n', min: 1, max: 5, step: 1, value: n, fmt: String, oninput: (t) => { n = t; cv.redraw(); } });
  const pt = () => { const s = ext ? m - n : m + n; if (!s) return null; return A.map((a, i) => ((m * B[i] + (ext ? -n : n) * a) / s)); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Section formula: AP : PB = m : n', col); v.fit(w, h, top + 6); v.axes(ctx, col);
    const D = (p) => v.P(...p), P = pt(), d = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
    line(ctx, [D(A.map((a, i) => a - 0.5 * d[i])), D(B.map((b, i) => b + 0.5 * d[i]))], col.muted, 1.2, [4, 4]);
    line(ctx, [D(A), D(B)], col.ink, 2.6);
    [[A, 'A', col.s[4]], [B, 'B', col.s[5]]].forEach(([p, s, c]) => { const q = D(p); dot(ctx, q[0], q[1], 6, c, col.panel); text(ctx, `${s}(${p.join(', ')})`.replace(/-/g, '−'), q[0] + 8, q[1] - 9, { color: col.ink, size: 11, weight: 700, halo: col.panel }); });
    if (P) { const q = D(P); dot(ctx, q[0], q[1], 7, col.s[2], col.panel); text(ctx, 'P', q[0] + 9, q[1] + 12, { color: col.s[2], size: 13, weight: 800, halo: col.panel }); }
    if (!P) text(ctx, 'm = n: P is at infinity', w / 2, h - 30, { color: col.bad, size: 13, weight: 700, align: 'center' });
    const ap = P ? Math.hypot(P[0] - A[0], P[1] - A[1], P[2] - A[2]) : 0, pb = P ? Math.hypot(P[0] - B[0], P[1] - B[1], P[2] - B[2]) : 0;
    ro.innerHTML = P ? `P = <b>(${P.map((t) => +t.toFixed(2)).join(', ')})</b>. AP = ${ap.toFixed(2)}, PB = ${pb.toFixed(2)}, AP : PB = ${(ap / pb).toFixed(2)} = m : n = ${(m / n).toFixed(2)}. ${ext ? 'P is outside the segment, beyond ' + (m > n ? 'B' : 'A') + '.' : m === n ? 'm = n gives the midpoint.' : 'P is inside AB, nearer ' + (m < n ? 'A' : 'B') + '.'}`.replace(/-(?=\d)/g, '−') : 'External division needs m ≠ n.';
  };
  cv.redraw();
}
