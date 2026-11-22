// 7.6 The free electron model. The density of states g(E) ∝ E^(d/2 - 1) for d = 1, 2, 3, the Fermi-Dirac
// occupation f(E) at temperature T, and the occupied states g(E) f(E) (shaded). The chemical potential is found
// numerically so that the number of electrons stays fixed as T changes. Units: energy in E_F, temperature as T/T_F.
import { canvas, axes, line, text, row, slider, choice, readout, fmt } from '../../kit.js';

const fd = (E, mu, t) => (t <= 0 ? (E < mu ? 1 : E > mu ? 0 : 0.5) : 1 / (Math.exp(Math.min(700, (E - mu) / t)) + 1));

// number of electrons for chemical potential mu: N = ∫ E^(d/2-1) f dE = 2 ∫ u^(d-1) f(u²) du (E = u²)
function count(d, mu, t) {
  const Emax = Math.max(1, mu) + 40 * t + 0.5, U = Math.sqrt(Emax), n = 1200, h = U / n;
  let s = 0;
  for (let i = 0; i <= n; i++) { const u = i * h, v = u ** (d - 1) * fd(u * u, mu, t); s += (i === 0 || i === n ? 1 : i % 2 ? 4 : 2) * v; }
  return 2 * s * h / 3;
}
export function chemPot(d, t) {
  if (t <= 0) return 1;
  const N0 = 2 / d; // electrons at T = 0 with E_F = 1
  let a = -20, b = 2;
  for (let i = 0; i < 70; i++) { const m = (a + b) / 2; count(d, m, t) < N0 ? (a = m) : (b = m); }
  return (a + b) / 2;
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 300, label: 'Density of states, Fermi-Dirac occupation and occupied states of a free electron gas' });
  let d = 3, t = 0.05;
  const ctl = row(host);
  const out = readout(host);
  const show = () => {
    const mu = chemPot(d, t);
    const som = d === 3 ? ` Sommerfeld: 1 − (π²/12)(T/T<sub>F</sub>)² = ${fmt(1 - Math.PI ** 2 / 12 * t * t, 4)}.` : d === 2 ? ` Exact 2D: ln(e<sup>1/t</sup> − 1)·t = ${fmt(t > 0 ? t * Math.log(Math.expm1(1 / t)) : 1, 4)}.` : '';
    out.innerHTML = `T/T<sub>F</sub> = ${fmt(t, 3)}: chemical potential μ = <b>${fmt(mu, 4)} E<sub>F</sub></b>.${som} ` +
      `The occupation falls from 0.9 to 0.1 over about 4.4 k<sub>B</sub>T = ${fmt(4.4 * t, 3)} E<sub>F</sub>; for copper (T<sub>F</sub> ≈ 81 000 K) this T/T<sub>F</sub> means T ≈ ${fmt(t * 81000, 3)} K.`;
  };
  choice(ctl, 'Dimension', [[1, '1D'], [2, '2D'], [3, '3D']], d, (v) => { d = v; cv.redraw(); show(); });
  slider(ctl, { label: 'T / T_F', min: 0, max: 0.6, step: 0.005, value: t, fmt: (v) => fmt(v, 3), oninput: (v) => { t = v; cv.redraw(); show(); } });

  cv.draw = (ctx, w, h, col) => {
    const mu = chemPot(d, t), X1 = 2.2;
    const gmax = d === 1 ? 2.2 : d === 2 ? 1.6 : Math.sqrt(X1) * 1.1;
    const a = axes(ctx, w, h, col, { x: [0, X1], y: [0, gmax], xlabel: 'energy E / E_F', ylabel: 'states per unit energy', t: 26 });
    const g = (E) => E ** (d / 2 - 1);
    const xs = Array.from({ length: 441 }, (_, i) => 0.002 + (X1 - 0.002) * i / 440);
    ctx.save(); a.clip();
    // occupied states
    ctx.beginPath(); ctx.moveTo(a.X(xs[0]), a.Y(0));
    for (const E of xs) ctx.lineTo(a.X(E), a.Y(Math.min(gmax * 1.2, g(E) * fd(E, mu, t))));
    ctx.lineTo(a.X(X1), a.Y(0)); ctx.closePath();
    ctx.fillStyle = col.soft; ctx.fill();
    line(ctx, xs.map((E) => [a.X(E), a.Y(Math.min(gmax * 1.2, g(E) * fd(E, mu, t)))]), col.s[0], 2.2);
    line(ctx, xs.map((E) => [a.X(E), a.Y(Math.min(gmax * 1.2, g(E)))]), col.ink, 1.8, [6, 4]);
    // f(E) scaled to the axis height
    line(ctx, xs.map((E) => [a.X(E), a.Y(fd(E, mu, t) * gmax * 0.9)]), col.s[2], 2);
    line(ctx, [[a.X(mu), a.T], [a.X(mu), a.B]], col.muted, 1, [2, 4]);
    line(ctx, [[a.X(1), a.B], [a.X(1), a.B - 8]], col.ink, 2);
    ctx.restore();
    text(ctx, 'g(E), density of states', a.L + 8, a.T + 10, { color: col.ink, size: 12, weight: 700 });
    text(ctx, 'g(E) f(E), occupied (shaded)', a.L + 8, a.T + 27, { color: col.s[0], size: 12, weight: 700 });
    text(ctx, 'f(E), occupation (top = 1)', a.L + 8, a.T + 44, { color: col.s[2], size: 12, weight: 700 });
    text(ctx, 'μ', a.X(mu) + 4, a.B - 14, { color: col.muted, size: 12, weight: 700 });
  };
  cv.redraw(); show();
}
