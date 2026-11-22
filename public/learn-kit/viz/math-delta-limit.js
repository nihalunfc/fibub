// The Dirac delta as a limit of ever-narrower spikes. Each spike δ_ε(x) always has area 1, but gets taller and
// thinner as ε shrinks. Multiply by a smooth test function f(x) and add up: ∫δ_ε(x − a) f(x) dx drifts to f(a), the
// "sifting" property. Slide ε down and a along, and choose the spike shape; the answer does not depend on it.
import { canvas, axes, row, slider, choice, readout, dot, line, text } from '../kit.js';
import { curve, f2 } from './_math.js';

const SP = {
  gauss: ['Gaussian', (x, e) => Math.exp(-0.5 * (x / e) ** 2) / (e * Math.sqrt(2 * Math.PI))], lor: ['Lorentzian', (x, e) => e / (Math.PI * (x * x + e * e))], box: ['Box', (x, e) => (Math.abs(x) <= e ? 1 / (2 * e) : 0)],
};
const f = (x) => 1 + 0.6 * Math.sin(1.3 * x) + 0.15 * x;
export default function (host) {
  let k = 'gauss', eps = 0.6, a = 0.8;
  const cv = canvas(host, { aspect: 0.78, max: 380, min: 260, label: 'A narrowing spike multiplied by a smooth function' });
  const c = row(host), c2 = row(host);
  choice(c, 'Spike', Object.entries(SP).map(([id, v]) => [id, v[0]]), k, (v) => { k = v; re(); });
  slider(c2, { label: 'width ε', min: 0.03, max: 1.5, step: 0.01, value: eps, fmt: (v) => f2(v), oninput: (v) => { eps = v; re(); }, log: true });
  slider(c2, { label: 'position a', min: -2, max: 2, step: 0.05, value: a, fmt: (v) => f2(v), oninput: (v) => { a = v; re(); } });
  const out = readout(host);
  const I = () => { let s = 0, area = 0; const d = 0.001; for (let x = -6; x < 6; x += d) { const g = SP[k][1](x - a, eps); s += g * f(x) * d; area += g * d; } return [s, area]; };
  function re() { cv.redraw(); const [s, ar] = I(); out.innerHTML = `Spike width ε = ${f2(eps)}, height at the top = ${f2(SP[k][1](0, eps), 2)}. Area of the spike = <b>${f2(ar, 3)}</b> (always 1). ∫δ<sub>ε</sub>(x − a) f(x) dx = <b>${f2(s, 4)}</b>; f(a) = ${f2(f(a), 4)}. Difference ${f2(Math.abs(s - f(a)), 4)} shrinks as ε → 0: the delta function picks out f(a).`; }
  cv.draw = (ctx, w, h, col) => {
    const top = Math.max(2.5, SP[k][1](0, eps) * 1.05), A = axes(ctx, w, h, col, { x: [-3, 3], y: [0, Math.min(top, 14)], l: 32, b: 34, t: 22, r: 10, xlabel: 'x' }), g = (x) => Math.min(14, SP[k][1](x - a, eps));
    ctx.save(); ctx.beginPath(); ctx.rect(A.L, A.T, A.R - A.L, A.B - A.T); ctx.clip();
    ctx.beginPath(); ctx.moveTo(A.X(-3), A.Y(0)); for (let i = 0; i <= 400; i++) { const x = -3 + (6 * i) / 400; ctx.lineTo(A.X(x), A.Y(g(x))); } ctx.lineTo(A.X(3), A.Y(0)); ctx.globalAlpha = 0.28; ctx.fillStyle = col.s[0]; ctx.fill(); ctx.globalAlpha = 1; ctx.restore();
    curve(ctx, A, g, -3, 3, col.s[0], 2.5, { n: 600 }); curve(ctx, A, f, -3, 3, col.s[1], 2.5);
    line(ctx, [[A.X(a), A.Y(0)], [A.X(a), A.Y(f(a))]], col.muted, 1, [4, 3]); dot(ctx, A.X(a), A.Y(f(a)), 5, col.s[1], col.ink);
    text(ctx, 'blue: spike δε(x − a) · orange: f(x)', A.L + 6, A.T + 10, { color: col.muted, size: 10 });
  };
  re();
}
