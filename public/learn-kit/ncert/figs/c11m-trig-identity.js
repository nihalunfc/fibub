// Class 11 Maths, Trigonometric Functions: an identity is true for EVERY angle, so the graphs of its two sides lie exactly on top of each other.
// Pick a true identity and watch the orange curve hide the blue one; pick a false "identity" and the curves come apart.
import { canvas, text, title, row, slider, choice, readout, dot } from '../../kit.js';
import { plot, curve, r2, piLabel } from '../c11m-lib.js';

const S = Math.sin, C = Math.cos;
const I = {
  d1: ['sin 2θ = 2 sin θ cos θ', (t) => S(2 * t), (t) => 2 * S(t) * C(t), true], d2: ['cos 2θ = cos²θ − sin²θ', (t) => C(2 * t), (t) => C(t) ** 2 - S(t) ** 2, true], d3: ['cos 2θ = 1 − 2 sin²θ', (t) => C(2 * t), (t) => 1 - 2 * S(t) ** 2, true],
  d4: ['sin 3θ = 3 sin θ − 4 sin³θ', (t) => S(3 * t), (t) => 3 * S(t) - 4 * S(t) ** 3, true], d5: ['cos 3θ = 4 cos³θ − 3 cos θ', (t) => C(3 * t), (t) => 4 * C(t) ** 3 - 3 * C(t), true],
  f1: ['✗ sin 2θ = 2 sin θ', (t) => S(2 * t), (t) => 2 * S(t), false], f2: ['✗ cos 2θ = 2 cos θ', (t) => C(2 * t), (t) => 2 * C(t), false],
};
export default function (host) {
  let k = 'd1', t0 = 0.7;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'Graphs of the left and right sides of a trigonometric identity' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const [name, L, R, ok] = I[k]; title(ctx, name, col);
    const P = plot(ctx, w, h, col, { x: [-Math.PI, Math.PI], y: [-2.2, 2.2], l: 22, b: 14, t: 28, r: 12, sx: Math.PI / 2, sy: 1, fx: piLabel });
    curve(ctx, P, L, col.s[0], 5); curve(ctx, P, R, col.s[3], 2.2);
    [[L, col.s[0], -5], [R, col.s[3], 5]].forEach(([f, c, dy]) => dot(ctx, P.X(t0), P.Y(f(t0)), 5, c, col.panel));
    ctx.setLineDash([4, 3]); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(P.X(t0), P.T); ctx.lineTo(P.X(t0), P.B); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'left side', P.R - 4, P.T + 8, { color: col.s[0], size: 11, weight: 800, align: 'right' }); text(ctx, 'right side', P.R - 4, P.T + 22, { color: col.s[3], size: 11, weight: 800, align: 'right' });
    const a = L(t0), b = R(t0);
    out.innerHTML = `θ = ${r2(t0, 2)}: left = <b>${r2(a, 4)}</b>, right = <b>${r2(b, 4)}</b>. ${ok ? '<b>Equal at every θ: a true identity.</b>' : Math.abs(a - b) < 1e-3 ? 'Equal here by luck, but not everywhere: <b>not an identity</b>.' : '<b>Different: not an identity.</b>'}`;
  };
  choice(row(host), 'Identity', Object.entries(I).map(([a, v]) => [a, ['sin 2θ ✓', 'cos 2θ (a) ✓', 'cos 2θ (b) ✓', 'sin 3θ ✓', 'cos 3θ ✓', '✗ sin 2θ = 2sin θ', '✗ cos 2θ = 2cos θ'][Object.keys(I).indexOf(a)]]), k, (v) => { k = v; cv.redraw(); });
  slider(row(host), { label: 'θ (rad)', min: -3.1, max: 3.1, step: 0.05, value: t0, fmt: (v) => r2(v, 2), oninput: (v) => { t0 = v; cv.redraw(); } });
  cv.redraw();
}
