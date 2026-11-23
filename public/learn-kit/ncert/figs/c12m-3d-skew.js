// Class 12 Maths, Three Dimensional Geometry: shortest distance between two lines. Line 1 is the x-axis direction through the origin; line 2 passes through (1, 1.5, h)
// and its direction turns with the sliders. The shortest segment is the common perpendicular, along b1 x b2. Distance = |(a2 - a1) . (b1 x b2)| / |b1 x b2|.
// If the lines are parallel (b1 x b2 = 0) the formula changes to |(a2 - a1) x b| / |b|; if they meet, the distance is 0.
import { canvas, text, title, line, dot, row, slider, readout } from '../../kit.js';
import { view3d } from '../c12m-view3d.js';

export default function (host) {
  let h = 2.5, phi = 50, tilt = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Two skew lines in three dimensions with the shortest segment joining them' });
  const ctl = row(host), ro = readout(host);
  const v = view3d(cv, ctl, { span: 5, yaw: 0.7, pitch: 0.5 });
  slider(ctl, { label: 'height h of line 2', min: -3, max: 3, step: 0.5, value: h, fmt: (t) => t.toFixed(1), oninput: (t) => { h = t; go(); } });
  slider(ctl, { label: 'turn line 2 (angle)', min: 0, max: 180, step: 5, value: phi, fmt: (t) => t + '°', oninput: (t) => { phi = t; go(); } });
  slider(ctl, { label: 'tilt line 2 upward', min: -1, max: 1, step: 0.25, value: tilt, fmt: (t) => t.toFixed(2), oninput: (t) => { tilt = t; go(); } });
  const sub = (a, b) => a.map((t, i) => t - b[i]), dotp = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const calc = () => {
    const a1 = [0, 0, 0], b1 = [1, 0, 0], a2 = [1, 1.5, h], p = phi * Math.PI / 180, b2 = [Math.cos(p), Math.sin(p), tilt], n = crs(b1, b2), nn = Math.hypot(...n), d = sub(a2, a1);
    if (nn < 1e-6) { const c = crs(d, b1); return { a1, b1, a2, b2, par: true, dist: Math.hypot(...c) / 1, s: d[0], t: 0, n, nn }; }
    const s = dotp(crs(sub(a2, a1), b2), n) / (nn * nn), t = dotp(crs(sub(a2, a1), b1), n) / (nn * nn);
    return { a1, b1, a2, b2, par: false, dist: Math.abs(dotp(d, n)) / nn, s, t, n, nn };
  };
  const go = () => {
    const c = calc(), f = (x) => +x.toFixed(3);
    ro.textContent = c.par ? `Parallel lines: distance = |(a₂ − a₁) × b|/|b| = ${f(c.dist)}.`
      : `b₁ × b₂ = (${c.n.map(f).join(', ')}), |b₁ × b₂| = ${f(c.nn)}.  (a₂ − a₁)·(b₁ × b₂) = ${f(dotp(sub(c.a2, c.a1), c.n))}.  Shortest distance = ${f(c.dist)}${c.dist < 0.01 ? ': the lines meet (they are coplanar and not parallel).' : '.'}`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h2, col) => {
    const top = title(ctx, 'Shortest distance between two lines', col); v.fit(w, h2, top + 6);
    v.axes(ctx, col);
    const c = calc(), L = 5.5;
    ctx.save(); ctx.beginPath(); ctx.rect(0, top, w, h2 - top); ctx.clip();
    line(ctx, [v.P(-L, 0, 0), v.P(L, 0, 0)], col.s[0], 2.6);
    const m = Math.hypot(...c.b2); line(ctx, [v.P(c.a2[0] - L * c.b2[0] / m, c.a2[1] - L * c.b2[1] / m, c.a2[2] - L * c.b2[2] / m), v.P(c.a2[0] + L * c.b2[0] / m, c.a2[1] + L * c.b2[1] / m, c.a2[2] + L * c.b2[2] / m)], col.s[1], 2.6);
    ctx.restore();
    let P, Q;
    if (c.par) { P = [c.a2[0], 0, 0]; Q = c.a2; } else { P = c.b1.map((t, i) => c.a1[i] + c.s * t); Q = c.b2.map((t, i) => c.a2[i] + c.t * t); }
    const pp = v.P(...P), qq = v.P(...Q);
    line(ctx, [pp, qq], col.s[3], 3); dot(ctx, pp[0], pp[1], 5, col.s[3], col.panel); dot(ctx, qq[0], qq[1], 5, col.s[3], col.panel);
    text(ctx, `d = ${c.dist.toFixed(2)}`, (pp[0] + qq[0]) / 2 + 10, (pp[1] + qq[1]) / 2, { color: col.s[3], size: 13, weight: 700, halo: col.panel });
    text(ctx, 'L₁', v.P(-L * 0.8, 0, 0)[0], v.P(-L * 0.8, 0, 0)[1] - 10, { color: col.s[0], size: 12, weight: 700, halo: col.panel });
    text(ctx, 'L₂', v.P(...c.a2.map((x, i) => x + 2 * c.b2[i] / m))[0] + 8, v.P(...c.a2.map((x, i) => x + 2 * c.b2[i] / m))[1] - 8, { color: col.s[1], size: 12, weight: 700, halo: col.panel });
  };
  go();
}
