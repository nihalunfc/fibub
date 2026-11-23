// Class 11 Maths, Complex Numbers and Quadratic Equations: the roots of x² + bx + c = 0. The discriminant D = b² − 4c decides: D > 0 two real roots (the parabola cuts the x-axis twice),
// D = 0 one repeated root (it touches), D < 0 two complex roots that are conjugates, −b/2 ± i√(−D)/2 (it floats above the axis). Slide b and c.
import { canvas, text, title, row, slider, readout, dot } from '../../kit.js';
import { plot, curve, argandPlot, cstr, r2 } from '../c11m-lib.js';

export default function (host) {
  let b = -2, c = 5;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 300, label: 'A parabola above, and the roots of its equation plotted on the Argand plane below' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `x² ${b < 0 ? '−' : '+'} ${Math.abs(b)}x ${c < 0 ? '−' : '+'} ${Math.abs(c)} = 0`, col), pw = (w - 36) / 2, ph = Math.min(pw, h - top - 20);
    const D = b * b - 4 * c, f = (x) => x * x + b * x + c, A = plot(ctx, w, h, col, { x: [-6, 6], y: [-6, 12], l: 14, r: w - 14 - pw, t: top + 14, b: h - top - 14 - ph, sx: 6, sy: 6, fy: (v) => v });
    curve(ctx, A, f, col.s[0], 2.6); text(ctx, 'y = x² + bx + c', A.L + 4, A.T - 8, { color: col.muted, size: 10.5, weight: 700 });
    const re = -b / 2;
    if (D >= 0) [re - Math.sqrt(D) / 2, re + Math.sqrt(D) / 2].forEach((r) => dot(ctx, A.X(r), A.Y(0), 6, col.s[3], col.panel));
    const B = argandPlot(ctx, w, h, col, { x: w - 14 - pw, y: top + 14, w: pw, h: ph }, 6, 2);
    const p1 = D >= 0 ? [re - Math.sqrt(D) / 2, 0] : [re, Math.sqrt(-D) / 2], p2 = D >= 0 ? [re + Math.sqrt(D) / 2, 0] : [re, -Math.sqrt(-D) / 2];
    [p1, p2].forEach((p) => { if (Math.abs(p[0]) < 6 && Math.abs(p[1]) < 6) dot(ctx, B.X(p[0]), B.Y(p[1]), 6, col.s[3], col.panel); });
    text(ctx, 'roots on the Argand plane', B.L + 4, B.T - 8, { color: col.muted, size: 10.5, weight: 700 });
    out.innerHTML = D > 0 ? `D = b² − 4c = ${r2(D)} > 0: <b>two real roots</b> ${r2(p1[0], 2)} and ${r2(p2[0], 2)}.` : D === 0 ? `D = 0: <b>one repeated real root</b> x = ${r2(re)}.` : `D = ${r2(D)} < 0: <b>two complex conjugate roots</b> ${cstr(...p1, 2)} and ${cstr(...p2, 2)}. The parabola never reaches the x-axis.`;
  };
  const r = row(host);
  slider(r, { label: 'b', min: -6, max: 6, step: 1, value: b, fmt: (v) => v, oninput: (v) => { b = v; cv.redraw(); } });
  slider(r, { label: 'c', min: -4, max: 10, step: 1, value: c, fmt: (v) => v, oninput: (v) => { c = v; cv.redraw(); } });
  cv.redraw();
}
