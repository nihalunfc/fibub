// Class 12 Maths, Three Dimensional Geometry: direction ratios and direction cosines of a line through the origin.
// Direction ratios (a, b, c) are any numbers in proportion to the direction; direction cosines l = cos(alpha), m = cos(beta), n = cos(gamma) are
// a/r, b/r, c/r with r = sqrt(a² + b² + c²), so l² + m² + n² = 1. Scaling the ratios changes (a, b, c) but never (l, m, n); reversing flips all three signs.
import { canvas, text, title, line, dot, arrow, row, slider, button, readout } from '../../kit.js';
import { view3d } from '../c12m-view3d.js';

export default function (host) {
  const q = { a: 2, b: 3, c: 6 }; let k = 1, flip = 1;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'A line through the origin in three dimensions with its direction ratios and direction cosines' });
  const ctl = row(host), ro = readout(host);
  const v = view3d(cv, ctl, { span: 5, yaw: 0.6, pitch: 0.45 });
  ['a', 'b', 'c'].forEach((n) => slider(ctl, { label: 'ratio ' + n, min: -6, max: 6, step: 1, value: q[n], fmt: (t) => String(t), oninput: (t) => { q[n] = t; go(); } }));
  slider(ctl, { label: 'multiply the ratios by', min: 1, max: 3, step: 1, value: k, fmt: (t) => '× ' + t, oninput: (t) => { k = t; go(); } });
  button(ctl, 'Reverse direction', () => { flip = -flip; go(); });
  const go = () => {
    const A = q.a * k * flip, B = q.b * k * flip, C = q.c * k * flip, r = Math.hypot(A, B, C);
    if (!r) { ro.textContent = 'All three ratios are 0: that is not a direction. Move a slider.'; cv.redraw(); return; }
    const d = [A, B, C].map((t) => t / r);
    ro.textContent = `Direction ratios (${A}, ${B}, ${C}); r = √(${A * A} + ${B * B} + ${C * C}) = ${r.toFixed(3)}.  Direction cosines l, m, n = ${d.map((t) => t.toFixed(3)).join(', ')}; angles α, β, γ = ${d.map((t) => Math.round(Math.acos(t) * 180 / Math.PI) + '°').join(', ')}.  l² + m² + n² = ${d.reduce((s, t) => s + t * t, 0).toFixed(3)}.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Direction ratios and direction cosines', col); v.fit(w, h, top + 6);
    v.axes(ctx, col);
    const A = q.a * k * flip, B = q.b * k * flip, C = q.c * k * flip, r = Math.hypot(A, B, C);
    if (!r) return;
    const u = [A / r, B / r, C / r], s = 4.6, O = v.P(0, 0, 0), T = v.P(u[0] * s, u[1] * s, u[2] * s), T2 = v.P(-u[0] * s, -u[1] * s, -u[2] * s);
    line(ctx, [T2, O], col.s[3], 1.6, [5, 4]);
    arrow(ctx, O[0], O[1], T[0], T[1], col.s[3], 3.5, 11);
    [[0, col.s[0], 'α'], [1, col.s[1], 'β'], [2, col.s[2], 'γ']].forEach(([i, c, g]) => {
      const e = [0, 0, 0]; e[i] = 1; const ax = v.P(e[0] * 1.4, e[1] * 1.4, e[2] * 1.4), dd = v.P(u[0] * 1.4, u[1] * 1.4, u[2] * 1.4);
      line(ctx, [ax, dd], c, 1.5, [2, 2]);
      const mid = [(ax[0] + dd[0]) / 2, (ax[1] + dd[1]) / 2]; text(ctx, g, mid[0], mid[1] - 8, { color: c, size: 12, weight: 700, align: 'center', halo: col.panel });
    });
    text(ctx, `(${u.map((t) => t.toFixed(2)).join(', ')})`, T[0] + 8, T[1] - 10, { color: col.ink, size: 11.5, weight: 700, halo: col.panel });
  };
  go();
}
