// Class 12 Maths, Three Dimensional Geometry: the angle between two lines is the angle between their directions: cos(theta) = |a1a2 + b1b2 + c1c2| / (|b1||b2|).
// Line 1 is fixed (direction ratios 1, 2, 2); change the direction ratios of line 2. Perpendicular lines give 0 in the numerator; parallel lines have ratios in proportion.
import { canvas, text, title, line, dot, arrow, row, slider, readout } from '../../kit.js';
import { view3d } from '../c12m-view3d.js';

export default function (host) {
  const d1 = [1, 2, 2], d2 = { a: 2, b: -1, c: 0 };
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Two lines through the origin whose direction ratios give the angle between them' });
  const ctl = row(host), ro = readout(host);
  const v = view3d(cv, ctl, { span: 5, yaw: 0.6, pitch: 0.45 });
  ['a', 'b', 'c'].forEach((n) => slider(ctl, { label: 'line 2 ratio ' + n, min: -4, max: 4, step: 1, value: d2[n], fmt: (t) => String(t), oninput: (t) => { d2[n] = t; go(); } }));
  const go = () => {
    const e = [d2.a, d2.b, d2.c], m1 = Math.hypot(...d1), m2 = Math.hypot(...e);
    if (!m2) { ro.textContent = 'Line 2 needs a direction: move a slider.'; cv.redraw(); return; }
    const dot_ = d1[0] * e[0] + d1[1] * e[1] + d1[2] * e[2], c = Math.abs(dot_) / (m1 * m2), th = Math.acos(Math.min(1, c)) * 180 / Math.PI;
    const cr = [d1[1] * e[2] - d1[2] * e[1], d1[2] * e[0] - d1[0] * e[2], d1[0] * e[1] - d1[1] * e[0]], par = cr.every((t) => t === 0);
    ro.textContent = `a₁a₂ + b₁b₂ + c₁c₂ = 1×${e[0]} + 2×${e[1]} + 2×${e[2]} = ${dot_}.  |b₁| = 3, |b₂| = ${m2.toFixed(3)}.  cos θ = ${dot_ < 0 ? '|' + dot_ + '|' : dot_}/${(m1 * m2).toFixed(3)} = ${c.toFixed(3)}, θ = ${th.toFixed(1)}°.  ${dot_ === 0 ? 'Perpendicular.' : par ? 'Parallel (ratios in proportion).' : ''}`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Angle between two lines', col); v.fit(w, h, top + 6);
    v.axes(ctx, col);
    const e = [d2.a, d2.b, d2.c], m1 = 3, m2 = Math.hypot(...e), O = v.P(0, 0, 0), s = 4.4;
    const T1 = v.P(d1[0] / m1 * s, d1[1] / m1 * s, d1[2] / m1 * s), N1 = v.P(-d1[0] / m1 * s, -d1[1] / m1 * s, -d1[2] / m1 * s);
    line(ctx, [N1, O], col.s[0], 1.5, [5, 4]); arrow(ctx, O[0], O[1], T1[0], T1[1], col.s[0], 3, 10); text(ctx, 'L₁', T1[0] + 6, T1[1] - 8, { color: col.s[0], size: 12, weight: 700, halo: col.panel });
    if (!m2) return;
    const T2 = v.P(e[0] / m2 * s, e[1] / m2 * s, e[2] / m2 * s), N2 = v.P(-e[0] / m2 * s, -e[1] / m2 * s, -e[2] / m2 * s);
    line(ctx, [N2, O], col.s[1], 1.5, [5, 4]); arrow(ctx, O[0], O[1], T2[0], T2[1], col.s[1], 3, 10); text(ctx, 'L₂', T2[0] + 6, T2[1] - 8, { color: col.s[1], size: 12, weight: 700, halo: col.panel });
    const a = [d1[0] / m1, d1[1] / m1, d1[2] / m1], sg = (d1[0] * e[0] + d1[1] * e[1] + d1[2] * e[2]) < 0 ? -1 : 1, b = [sg * e[0] / m2, sg * e[1] / m2, sg * e[2] / m2], pts = [];
    for (let i = 0; i <= 12; i++) { const t = i / 12, p = [a[0] * (1 - t) + b[0] * t, a[1] * (1 - t) + b[1] * t, a[2] * (1 - t) + b[2] * t], n = Math.hypot(...p) || 1; pts.push(v.P(p[0] / n * 1.5, p[1] / n * 1.5, p[2] / n * 1.5)); }
    line(ctx, pts, col.s[3], 2.5);
    const c = Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
    text(ctx, `θ = ${(Math.acos(Math.min(1, c)) * 180 / Math.PI).toFixed(0)}°`, w - 12, h - 12, { color: col.s[3], size: 13, weight: 700, align: 'right', halo: col.panel });
  };
  go();
}
