// Negative feedback cleans up an amplifier. The open-loop amplifier saturates softly: y = V_m tanh(A x / V_m). Feeding back a
// fraction β of the output (x = v_in − βy) cuts the gain to about A/(1+Aβ) and cuts the distortion by about the same factor.
// Both outputs are drawn at the same size, against a perfect sine (dashed). Raise β, or the drive, and watch the flat tops
// round off; the readout gives the closed-loop gain and the third-harmonic distortion each way.
import { canvas, axes, line, text, row, slider, readout, title } from '../kit.js';

const VM = 10, N = 240;
const f = (x, A) => VM * Math.tanh((A * x) / VM);
function solve(v, A, b) { let lo = -VM * 1.01, hi = VM * 1.01; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; (f(v - b * m, A) - m > 0 ? (lo = m) : (hi = m)); } return (lo + hi) / 2; }
const fourier = (y, n) => { let a = 0, b = 0; y.forEach((v, i) => { const t = (2 * Math.PI * n * i) / y.length; a += v * Math.cos(t); b += v * Math.sin(t); }); return (2 / y.length) * Math.hypot(a, b); };
export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 250, label: 'Amplifier output with and without negative feedback' });
  const ctl = row(host);
  const sA = slider(ctl, { label: 'Open-loop gain A', min: 20, max: 2000, step: 'any', value: 400, log: true, fmt: (v) => v.toFixed(0), oninput: () => cv.redraw() });
  const sb = slider(ctl, { label: 'Feedback fraction β', min: 0, max: 0.5, step: 0.005, value: 0.1, fmt: (v) => v.toFixed(3), oninput: () => cv.redraw() });
  const sv = slider(ctl, { label: 'Output wanted (peak)', min: 1, max: 9, step: 0.1, value: 6, fmt: (v) => v.toFixed(1) + ' V', oninput: () => cv.redraw() });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const A = sA.value, b = sb.value, want = sv.value;
    // drive each so that the fundamental is the same size as "want" if possible: find vin amplitude by scanning
    const gen = (amp, beta) => Array.from({ length: N }, (_, i) => solve(amp * Math.sin((2 * Math.PI * i) / N), A, beta));
    const fit = (beta) => { let lo = 0, hi = 40; for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; (fourier(gen(m, beta), 1) < want ? (lo = m) : (hi = m)); } return (lo + hi) / 2; };
    const a0 = fit(0), a1 = fit(b), y0 = gen(a0, 0), y1 = gen(a1, b);
    const thd = (y) => Math.sqrt([2, 3, 4, 5].reduce((s, n) => s + fourier(y, n) ** 2, 0)) / fourier(y, 1) * 100;
    const Ax = axes(ctx, w, h, col, { x: [0, 2], y: [-10, 10], xlabel: 'time (two cycles)', ylabel: 'output (V)', l: 42, t: 36, xt: [0, 1, 2], yt: [-10, -5, 0, 5, 10] });
    Ax.clip();
    const P = (y) => Array.from({ length: 2 * N + 1 }, (_, i) => [Ax.X(i / N), Ax.Y(y[i % N])]);
    line(ctx, P(Array.from({ length: N }, (_, i) => want * Math.sin((2 * Math.PI * i) / N))), col.muted, 1.5, [4, 4]);
    line(ctx, P(y0), col.bad, 2); line(ctx, P(y1), col.s[0], 2.5);
    
    text(ctx, 'no feedback', Ax.L + 6, Ax.T + 10, { color: col.bad, size: 11, weight: 700 }); text(ctx, 'with feedback', Ax.L + 90, Ax.T + 10, { color: col.s[0], size: 11, weight: 700 });
    title(ctx, 'Same output size, different distortion', col);
    out.innerHTML = `<b>Closed-loop gain A/(1 + Aβ) = ${(A / (1 + A * b)).toFixed(1)}</b> (ideal 1/β = ${b > 0 ? (1 / b).toFixed(1) : '∞'}); the factor 1 + Aβ = ${(1 + A * b).toFixed(1)}. Distortion (harmonics 2 to 5): ${thd(y0).toFixed(1)}% with no feedback, ${thd(y1).toFixed(2)}% with it, a cut of about ${(thd(y0) / Math.max(thd(y1), 1e-6)).toFixed(0)}×. The price is gain: you need a larger input to get the same output.`;
  };
  cv.redraw();
}
