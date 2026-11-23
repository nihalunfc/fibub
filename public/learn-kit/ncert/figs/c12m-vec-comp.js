// Class 12 Maths, Vector Algebra: a vector in space r = x i + y j + z k. Magnitude |r| = sqrt(x² + y² + z²); the direction cosines are
// l = x/|r|, m = y/|r|, n = z/|r| (cosines of the angles with the three axes) and l² + m² + n² = 1; the unit vector is (l, m, n). Slide x, y, z and turn the view.
import { canvas, text, title, line, dot, arrow, row, slider, readout } from '../../kit.js';
import { view3d } from '../c12m-view3d.js';

export default function (host) {
  const q = { x: 3, y: 2, z: 4 };
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'A vector in three dimensions with its components along the axes, its length and direction cosines' });
  const ctl = row(host), ro = readout(host);
  const v = view3d(cv, ctl, { span: 5, yaw: 0.6, pitch: 0.45 });
  ['x', 'y', 'z'].forEach((k) => slider(ctl, { label: k, min: -4, max: 4, step: 1, value: q[k], fmt: (t) => String(t), oninput: (t) => { q[k] = t; go(); } }));
  const go = () => {
    const m = Math.hypot(q.x, q.y, q.z);
    if (!m) { ro.textContent = 'The zero vector has no direction: move a slider.'; cv.redraw(); return; }
    const d = [q.x, q.y, q.z].map((t) => t / m), ang = d.map((t) => Math.round(Math.acos(t) * 180 / Math.PI));
    ro.textContent = `r = ${q.x}i + ${q.y}j + ${q.z}k.  |r| = √(${q.x * q.x} + ${q.y * q.y} + ${q.z * q.z}) = ${m.toFixed(3)}.  Direction cosines l, m, n = ${d.map((t) => t.toFixed(3)).join(', ')} (angles ${ang.join('°, ')}°).  l² + m² + n² = ${d.reduce((s, t) => s + t * t, 0).toFixed(3)}.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'r = x i + y j + z k', col); v.fit(w, h, top + 6);
    v.axes(ctx, col);
    const { x, y, z } = q, O = v.P(0, 0, 0), A = v.P(x, 0, 0), B = v.P(x, y, 0), T = v.P(x, y, z);
    line(ctx, [O, A], col.s[0], 3); line(ctx, [A, B], col.s[1], 3); line(ctx, [B, T], col.s[2], 3);
    line(ctx, [v.P(0, y, 0), B], col.muted, 1, [3, 3]); line(ctx, [v.P(x, 0, z), T], col.muted, 1, [3, 3]); line(ctx, [v.P(0, y, z), T], col.muted, 1, [3, 3]); line(ctx, [v.P(0, 0, z), v.P(x, 0, z)], col.muted, 1, [3, 3]); line(ctx, [A, v.P(x, 0, z)], col.muted, 1, [3, 3]);
    if (x || y || z) arrow(ctx, O[0], O[1], T[0], T[1], col.s[3], 3.5, 11);
    dot(ctx, T[0], T[1], 5, col.s[3], col.panel);
    text(ctx, `(${x}, ${y}, ${z})`, T[0] + 8, T[1] - 10, { color: col.ink, size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'x i', (O[0] + A[0]) / 2, (O[1] + A[1]) / 2 + 12, { color: col.s[0], size: 11, weight: 700, halo: col.panel, align: 'center' });
    text(ctx, 'y j', (A[0] + B[0]) / 2 + 10, (A[1] + B[1]) / 2 + 10, { color: col.s[1], size: 11, weight: 700, halo: col.panel, align: 'center' });
    text(ctx, 'z k', (B[0] + T[0]) / 2 + 12, (B[1] + T[1]) / 2, { color: col.s[2], size: 11, weight: 700, halo: col.panel, align: 'center' });
  };
  go();
}
