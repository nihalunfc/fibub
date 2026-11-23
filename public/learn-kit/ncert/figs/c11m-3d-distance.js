// Class 11 Maths, Three-dimensional Geometry: the distance formula. A and B are opposite corners of a box with edges parallel to the axes.
// The floor diagonal AC has AC² = p² + q²; then AB² = AC² + r², so AB = sqrt(p² + q² + r²) with p = |x2 - x1|, q = |y2 - y1|, r = |z2 - z1|.
import { canvas, text, title, line, dot, row, slider, readout } from '../../kit.js';
import { view3d } from '../c12m-view3d.js';

export default function (host) {
  const A = [-3, -2, 0], B = [2, 2, 3];
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Two points in space with the box that gives their distance' });
  const ctl = row(host), ro = readout(host);
  const v = view3d(cv, ctl, { span: 5, yaw: 0.55, pitch: 0.5 });
  [['A', A], ['B', B]].forEach(([nm, T]) => ['x', 'y', 'z'].forEach((c, i) => slider(ctl, { label: `${nm}: ${c}`, min: -4, max: 4, step: 1, value: T[i], fmt: (t) => String(t).replace('-', '−'), oninput: (t) => { T[i] = t; cv.redraw(); } })));
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Distance AB from the box with AB as diagonal', col); v.fit(w, h, top + 6); v.axes(ctx, col);
    const D = (p) => v.P(...p), C = [B[0], B[1], A[2]], p = Math.abs(B[0] - A[0]), q = Math.abs(B[1] - A[1]), r = Math.abs(B[2] - A[2]);
    const E = (a, b, c, wd = 1.1, d = [3, 3]) => line(ctx, [D(a), D(b)], c, wd, d);
    const c1 = [B[0], A[1], A[2]], c2 = [A[0], B[1], A[2]], t1 = [A[0], A[1], B[2]], t2 = [B[0], A[1], B[2]], t3 = [A[0], B[1], B[2]];
    E(A, c1, col.s[0], 2.2, null); E(c1, C, col.s[1], 2.2, null); E(C, B, col.s[2], 2.2, null);
    [[A, c2], [c2, C], [A, t1], [t1, t2], [t1, t3], [c1, t2], [c2, t3], [t2, B], [t3, B]].forEach(([a, b]) => E(a, b, col.muted));
    E(A, C, col.s[3], 1.6, [5, 3]); E(A, B, col.ink, 2.8, null);
    dot(ctx, D(A)[0], D(A)[1], 6, col.s[4], col.panel); dot(ctx, D(B)[0], D(B)[1], 6, col.s[5], col.panel);
    text(ctx, 'A', D(A)[0] - 12, D(A)[1] + 6, { color: col.ink, size: 13, weight: 800, halo: col.panel }); text(ctx, 'B', D(B)[0] + 10, D(B)[1] - 6, { color: col.ink, size: 13, weight: 800, halo: col.panel });
    const mid = (a, b) => D([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]);
    [[A, c1, 'p', col.s[0]], [c1, C, 'q', col.s[1]], [C, B, 'r', col.s[2]]].forEach(([a, b, s, c]) => { const m = mid(a, b); text(ctx, s, m[0] + 8, m[1] + 9, { color: c, size: 12, weight: 800, halo: col.panel }); });
    const cm = mid(A, C); text(ctx, 'AC', cm[0] - 14, cm[1] - 8, { color: col.s[3], size: 11, weight: 700, halo: col.panel });
    ro.innerHTML = `p = ${p}, q = ${q}, r = ${r}. AC² = ${p * p} + ${q * q} = ${p * p + q * q}; AB² = ${p * p + q * q} + ${r * r} = ${p * p + q * q + r * r}; <b>AB = ${Math.sqrt(p * p + q * q + r * r).toFixed(3)}</b>.`;
  };
  cv.redraw();
}
