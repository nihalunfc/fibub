// Least action, made tangible. A ball thrown up and caught after 2 s has one true path. Add a wobble of size A to the
// path (same start and end) and compute the action S = ∫ (½mv² − mgy) dt for the wobbled path: it is smallest, a
// parabola in A, exactly at A = 0. Nature picks the path where S is stationary: this is how the Euler–Lagrange equation appears.
import { canvas, text, row, slider, readout, button, line, dot } from '../kit.js';
import { G } from './_mech.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'The true path of a thrown ball, a wobbled path, and the action against wobble size' });
  const c1 = row(host);
  const sa = slider(c1, { label: 'Wobble 1', min: -2, max: 2, step: 0.05, value: 0.8, fmt: (v) => v.toFixed(2) + ' m', oninput: () => { cv.redraw(); show(); } });
  const sb = slider(c1, { label: 'Wobble 2', min: -2, max: 2, step: 0.05, value: -0.4, fmt: (v) => v.toFixed(2) + ' m', oninput: () => { cv.redraw(); show(); } });
  button(c1, 'True path', () => { sa.set(0); sb.set(0); cv.redraw(); show(); });
  const out = readout(host);
  const T = 2, m = 1, v0 = (G * T) / 2;
  const y = (t, a, b) => v0 * t - 0.5 * G * t * t + a * Math.sin((Math.PI * t) / T) + b * Math.sin((2 * Math.PI * t) / T);
  const dy = (t, a, b) => v0 - G * t + a * (Math.PI / T) * Math.cos((Math.PI * t) / T) + b * (2 * Math.PI / T) * Math.cos((2 * Math.PI * t) / T);
  const S = (a, b) => { let s = 0; const n = 400, h = T / n; for (let i = 0; i < n; i++) { const t = (i + 0.5) * h; s += (0.5 * m * dy(t, a, b) ** 2 - m * G * y(t, a, b)) * h; } return s; };
  function show() { const a = sa.value, b = sb.value; out.innerHTML = `Action S = ${S(a, b).toFixed(3)} J s; true path S₀ = ${S(0, 0).toFixed(3)} J s. Extra action ΔS = <b>${(S(a, b) - S(0, 0)).toFixed(3)} J s</b>, exactly (mπ²/4T)(a² + 4b²) = ${(Math.PI ** 2 / 8 * (a * a + 4 * b * b)).toFixed(3)}: always ≥ 0, so the true path is a minimum of S. The first-order change is zero, which is the Euler–Lagrange equation.`; }
  cv.draw = (ctx, w, h, col) => {
    const a = sa.value, b = sb.value, ph = h * 0.5, X = (t) => 36 + (t / T) * (w - 52), Yp = (v) => ph - 14 - ((v + 0.5) / 5.5) * (ph - 36);
    line(ctx, [[36, Yp(0)], [w - 16, Yp(0)]], col.muted, 1);
    const true_ = [], wob = []; for (let i = 0; i <= 60; i++) { const t = (T * i) / 60; true_.push([X(t), Yp(y(t, 0, 0))]); wob.push([X(t), Yp(y(t, a, b))]); }
    line(ctx, true_, col.s[2], 2.5); line(ctx, wob, col.s[1], 2.5);
    [0, T].forEach((t) => dot(ctx, X(t), Yp(0), 5, col.ink, col.panel));
    text(ctx, 'true path', X(T / 2), Yp(y(T / 2, 0, 0)) - 8, { color: col.s[2], size: 11, align: 'center', weight: 700 }); text(ctx, 'wobbled path', X(0.3), Yp(y(0.3, a, b)) - 14, { color: col.s[1], size: 11, weight: 700 });
    text(ctx, 'height y vs time t (same start and end)', 36, 14, { color: col.muted, size: 10 });
    const gx0 = 44, gx1 = w - 16, gy0 = ph + 24, gy1 = h - 22, AX = (v) => gx0 + ((v + 2) / 4) * (gx1 - gx0);
    const vals = []; for (let v = -2; v <= 2.001; v += 0.1) vals.push([v, S(v, b)]); const mn = Math.min(...vals.map((q) => q[1])), mx = Math.max(...vals.map((q) => q[1])), SY = (s) => gy1 - ((s - mn) / (mx - mn || 1)) * (gy1 - gy0);
    line(ctx, [[gx0, gy1], [gx1, gy1]], col.muted, 1); line(ctx, vals.map(([v, s]) => [AX(v), SY(s)]), col.s[0], 2.5);
    dot(ctx, AX(a), SY(S(a, b)), 6, col.bad, col.panel); dot(ctx, AX(0), SY(S(0, b)), 4, col.s[2], col.panel);
    text(ctx, 'action S against wobble 1 (wobble 2 as set)', gx0, gy0 - 8, { color: col.muted, size: 10 }); text(ctx, '0', AX(0), gy1 + 12, { color: col.muted, size: 10, align: 'center' });
  };
  show();
}
