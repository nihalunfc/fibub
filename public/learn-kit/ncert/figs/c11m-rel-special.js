// Class 11 Maths, Relations and Functions: the special real functions in the syllabus: identity, constant, modulus (absolute value), signum,
// greatest integer (floor), reciprocal and a polynomial. Slide x and read the output; open circles mark values a jump skips.
import { canvas, text, title, row, slider, choice, readout, dot } from '../../kit.js';
import { plot, curve, r2 } from '../c11m-lib.js';

const F = {
  id: ['f(x) = x  (identity)', (x) => x, 'R', 'R'], cst: ['f(x) = 3  (constant)', () => 3, 'R', '{3}'], mod: ['f(x) = |x|  (modulus)', Math.abs, 'R', '[0, ∞)'],
  sg: ['f(x) = sgn x  (signum)', Math.sign, 'R', '{−1, 0, 1}'], fl: ['f(x) = ⌊x⌋  (greatest integer)', Math.floor, 'R', 'Z (all integers)'], rc: ['f(x) = 1/x  (reciprocal)', (x) => (Math.abs(x) < 1e-9 ? NaN : 1 / x), 'R − {0}', 'R − {0}'],
  cu: ['f(x) = x³ − 3x  (polynomial)', (x) => x ** 3 - 3 * x, 'R', 'R'],
};
export default function (host) {
  let k = 'fl', x0 = 1.6;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'Graph of a special function with a point you can slide' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, F[k][0], col);
    const P = plot(ctx, w, h, col, { x: [-4, 4], y: [-4, 4], l: 22, b: 14, t: 28, r: 12 }), f = F[k][1];
    if (k === 'fl') { for (let i = -4; i < 4; i++) { ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(P.X(i), P.Y(i)); ctx.lineTo(P.X(i + 1), P.Y(i)); ctx.stroke(); dot(ctx, P.X(i), P.Y(i), 4, col.s[0], col.panel); ctx.fillStyle = col.panel; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(P.X(i + 1), P.Y(i), 4, 0, 7); ctx.fill(); ctx.stroke(); } }
    else if (k === 'sg') { ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.6; [[-4, -1, 0, -1], [0, 4, 0, 1]].forEach(([a, b, , v]) => { ctx.beginPath(); ctx.moveTo(P.X(a), P.Y(v)); ctx.lineTo(P.X(b), P.Y(v)); ctx.stroke(); }); dot(ctx, P.X(0), P.Y(0), 4.5, col.s[0], col.panel); [-1, 1].forEach((v) => { ctx.fillStyle = col.panel; ctx.beginPath(); ctx.arc(P.X(0), P.Y(v), 4, 0, 7); ctx.fill(); ctx.stroke(); }); }
    else curve(ctx, P, f, col.s[0], 2.6, 60);
    const y = f(x0);
    if (Number.isFinite(y) && Math.abs(y) <= 4) { ctx.setLineDash([4, 3]); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(P.X(x0), P.Y(0)); ctx.lineTo(P.X(x0), P.Y(y)); ctx.lineTo(P.X(0), P.Y(y)); ctx.stroke(); ctx.setLineDash([]); dot(ctx, P.X(x0), P.Y(y), 6, col.s[3], col.panel); }
    out.innerHTML = `Domain: <b>${F[k][2]}</b>, range: <b>${F[k][3]}</b>. At x = ${r2(x0, 1)}: f(x) = <b>${Number.isFinite(y) ? r2(y) : 'not defined'}</b>.`;
  };
  choice(row(host), 'Function', Object.entries(F).map(([a, v]) => [a, v[0].split('(')[1].split(')')[0] === 'x' ? v[0].split('  ')[1].replace(/[()]/g, '') : v[0].split('  ')[1].replace(/[()]/g, '')]), k, (v) => { k = v; cv.redraw(); });
  slider(row(host), { label: 'x', min: -3.9, max: 3.9, step: 0.1, value: x0, fmt: (v) => r2(v, 1), oninput: (v) => { x0 = v; cv.redraw(); } });
  cv.redraw();
}
