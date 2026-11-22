// 5.6 The Fermi sea at finite temperature. Filled states g(E) f(E) for an ideal 3D Fermi gas (g ∝ √E) at a chosen T/T_F,
// with μ found numerically so the particle number stays fixed. The dashed curve is the T = 0 step (the full Fermi sphere).
import { canvas, axes, line, row, slider, readout, title, text } from '../../kit.js';

const nOf = (mu, t) => { let s = 0; const N = 1200, Emax = Math.max(3, mu + 40 * t); const dE = Emax / N; for (let i = 0; i < N; i++) { const E = (i + 0.5) * dE; s += Math.sqrt(E) / (Math.exp((E - mu) / t) + 1); } return s * dE; };
const muOf = (t) => { let a = -50 * t - 5, b = 1.5; for (let i = 0; i < 70; i++) { const m = (a + b) / 2; if (nOf(m, t) < 2 / 3) a = m; else b = m; } return (a + b) / 2; };

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 380, min: 250, label: 'Occupied density of states of a Fermi gas at a chosen temperature' });
  let t = 0.1;
  const ctl = row(host);
  slider(ctl, { label: 'Temperature T/T_F', min: 0.01, max: 1.5, step: 0.01, value: t, fmt: (v) => v.toFixed(2), oninput: (v) => { t = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const mu = muOf(t), som = 1 - (Math.PI ** 2 / 12) * t * t;
    out.innerHTML = `T = ${t.toFixed(2)} T<sub>F</sub>: chemical potential <b>μ = ${mu.toFixed(4)} E<sub>F</sub></b> (Sommerfeld estimate ${som.toFixed(4)}). Only electrons within a few kT of μ move; the fraction excited is about T/T<sub>F</sub>, which is why C ∝ T. ${t > 0.5 ? 'At this temperature the gas is no longer degenerate and μ heads towards the negative classical value.' : ''}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const ax = axes(ctx, w, h, col, { x: [0, 2.5], y: [0, 1.7], xlabel: 'energy E/E_F', ylabel: 'states per unit energy', fy: () => '', t: 34 });
    title(ctx, 'Filled states g(E) f(E) of an ideal Fermi gas', col);
    const mu = muOf(t);
    ctx.save(); ax.clip();
    const g = []; const filled = [];
    for (let i = 0; i <= 400; i++) { const E = (i / 400) * 2.5; g.push([ax.X(E), ax.Y(Math.sqrt(E))]); filled.push([ax.X(E), ax.Y(Math.sqrt(E) / (Math.exp((E - mu) / t) + 1))]); }
    ctx.beginPath(); ctx.moveTo(ax.X(0), ax.Y(0)); filled.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(ax.X(2.5), ax.Y(0)); ctx.closePath();
    ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[0]; ctx.fill(); ctx.globalAlpha = 1;
    line(ctx, g, col.muted, 1.3);
    line(ctx, [[ax.X(0), ax.Y(0)]].concat(g.filter((_, i) => (i / 400) * 2.5 <= 1)).concat([[ax.X(1), ax.Y(0)]]), col.s[2], 1.5, [5, 4]);
    line(ctx, filled, col.s[0], 2.4);
    line(ctx, [[ax.X(mu), ax.Y(0)], [ax.X(mu), ax.Y(1.7)]], col.s[3], 1.3, [3, 3]);
    ctx.restore();
    text(ctx, 'μ', ax.X(mu) + 4, ax.T + 12, { color: col.s[3], size: 12, weight: 700, halo: col.panel });
    text(ctx, 'g(E) ∝ √E', ax.X(1.9), ax.Y(Math.sqrt(1.9)) - 10, { color: col.muted, size: 11, halo: col.panel });
    text(ctx, 'dashed: T = 0', ax.R - 6, ax.T + 14, { color: col.s[2], size: 11, align: 'right', halo: col.panel });
  };
  cv.redraw(); show();
}
