// 4.4 The quantum harmonic oscillator. Stationary states psi_n drawn on their energy levels inside the parabola
// V = x²/2 (units: hbar*omega for energy, sqrt(hbar/m omega) for length), as psi or |psi|², and a comparison of
// |psi_n|² with the classical probability density 1/(pi sqrt(A² - x²)) of a particle with the same energy.
// The readout gives E_n, the number of nodes and the probability of being found outside the classical turning points.
import { canvas, axes, line, text, row, slider, choice, readout, fmt } from '../../kit.js';

const NMAX = 12;

// Normalised oscillator functions by the stable recursion psi_{n+1} = sqrt(2/(n+1)) x psi_n - sqrt(n/(n+1)) psi_{n-1}.
function psi(n, x) {
  let p0 = Math.pow(Math.PI, -0.25) * Math.exp(-x * x / 2);
  if (n === 0) return p0;
  let p1 = Math.SQRT2 * x * p0;
  for (let k = 1; k < n; k++) {
    const p2 = Math.sqrt(2 / (k + 1)) * x * p1 - Math.sqrt(k / (k + 1)) * p0;
    p0 = p1; p1 = p2;
  }
  return p1;
}

function outside(n) {
  const A = Math.sqrt(2 * n + 1), N = 4000, X = A + 8, h = (X - A) / N;
  let s = 0;
  for (let i = 0; i <= N; i++) { const x = A + i * h, f = psi(n, x) ** 2; s += (i === 0 || i === N ? 0.5 : 1) * f; }
  return 2 * s * h;
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 470, min: 320, label: 'Harmonic oscillator stationary states on their energy levels, or compared with the classical probability density' });
  let n = 0, mode = 'psi';
  const ctl = row(host);
  const out = readout(host);
  const show = () => {
    const A = Math.sqrt(2 * n + 1), P = outside(n);
    out.innerHTML = `State n = ${n}: E<sub>${n}</sub> = (n + ½)ħω = <b>${fmt(n + 0.5, 3)} ħω</b>, ${n} node${n === 1 ? '' : 's'}, parity ${n % 2 ? 'odd' : 'even'}. ` +
      `Classical turning points at x = ±${fmt(A, 3)} x₀ (x₀ = √(ħ/mω)); probability of being found beyond them: <b>${fmt(100 * P, 3)}%</b>.`;
  };
  slider(ctl, { label: 'State n', min: 0, max: NMAX, step: 1, value: n, fmt: (v) => String(Math.round(v)), oninput: (v) => { n = Math.round(v); cv.redraw(); show(); } });
  choice(ctl, 'Draw', [['psi', 'ψ'], ['prob', '|ψ|²'], ['classical', '|ψ|² vs classical']], mode, (v) => { mode = v; cv.redraw(); });

  cv.draw = (ctx, w, h, col) => {
    const xs = Array.from({ length: 481 }, (_, i) => -6.5 + 13 * i / 480);
    const A = Math.sqrt(2 * n + 1);
    if (mode === 'classical') {
      const top = Math.max(0.65, ...xs.map((x) => psi(n, x) ** 2)) * 1.15;
      const a = axes(ctx, w, h, col, { x: [-6.5, 6.5], y: [0, top], xlabel: 'position x / x₀', ylabel: 'probability density', t: 28 });
      ctx.save(); a.clip();
      ctx.fillStyle = col.soft;
      ctx.fillRect(a.L, a.T, a.X(-A) - a.L, a.B - a.T);
      ctx.fillRect(a.X(A), a.T, a.R - a.X(A), a.B - a.T);
      line(ctx, xs.map((x) => [a.X(x), a.Y(psi(n, x) ** 2)]), col.s[0], 2.4);
      const cl = xs.filter((x) => Math.abs(x) < A * 0.999).map((x) => [a.X(x), a.Y(Math.min(top * 2, 1 / (Math.PI * Math.sqrt(A * A - x * x))))]);
      line(ctx, cl, col.s[1], 2, [6, 4]);
      ctx.restore();
      text(ctx, `quantum |ψ${n}|²`, a.L + 8, a.T + 10, { color: col.s[0], size: 12, weight: 700 });
      text(ctx, 'classical, same energy', a.L + 8, a.T + 27, { color: col.s[1], size: 12, weight: 700 });
      text(ctx, 'shaded: classically forbidden', a.L + 8, a.T + 44, { color: col.muted, size: 11 });
      return;
    }
    const topE = Math.max(8, n + 2.5);
    const a = axes(ctx, w, h, col, { x: [-6.5, 6.5], y: [0, topE], xlabel: 'position x / x₀', ylabel: 'energy / ħω', t: 24 });
    ctx.save(); a.clip();
    line(ctx, xs.map((x) => [a.X(x), a.Y(x * x / 2)]), col.ink, 1.8);
    const lo = Math.max(0, n - 6), hi = Math.min(NMAX, Math.max(n + 1, 7));
    for (let k = lo; k <= hi; k++) {
      const E = k + 0.5, Ak = Math.sqrt(2 * k + 1);
      if (E > topE) break;
      line(ctx, [[a.X(-Ak), a.Y(E)], [a.X(Ak), a.Y(E)]], k === n ? col.ink : col.muted, k === n ? 1.4 : 1, [3, 3]);
    }
    const amp = mode === 'psi' ? 0.85 : 1.6;
    const f = (x) => (mode === 'psi' ? psi(n, x) : psi(n, x) ** 2 * 1.6) * amp;
    line(ctx, xs.map((x) => [a.X(x), a.Y(n + 0.5 + f(x))]), col.s[0], 2.6);
    line(ctx, [[a.X(-A), a.B], [a.X(-A), a.Y(n + 0.5)]], col.s[1], 1.2, [2, 4]);
    line(ctx, [[a.X(A), a.B], [a.X(A), a.Y(n + 0.5)]], col.s[1], 1.2, [2, 4]);
    ctx.restore();
    text(ctx, `n = ${n}`, a.X(A) + 6, a.Y(n + 0.5) - 10, { color: col.s[0], size: 12, weight: 700 });
    text(ctx, 'V = ½mω²x²', a.X(-5.9), a.Y(Math.min(topE - 0.6, 17.4)), { color: col.muted, size: 11 });
  };
  cv.redraw(); show();
}
