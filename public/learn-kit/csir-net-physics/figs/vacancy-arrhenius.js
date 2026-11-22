// 9.2 Vacancies in equilibrium. An Arrhenius plot of log10(n/N) against 1000/T for a single vacancy
// (n/N = e^{S/k} e^{-E/kT}) and, for comparison, Schottky pairs or Frenkel defects (exponent halved). The slope gives
// the formation energy; the intercept the entropy factor. The marked temperature shows the fraction and the number per
// cubic centimetre in a metal with 8.5e22 atoms per cm^3.
import { canvas, row, slider, choice, readout, axes, line, dot, text, fmt } from '../../kit.js';

const KB = 8.617333e-5;

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 300, label: 'Arrhenius plot of the equilibrium vacancy fraction against inverse temperature' });
  let E = 1.0, S = 1.0, T = 1000, kind = 'vac';
  const ctl = row(host), out = readout(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'Defect', [['vac', 'Vacancy (metal)'], ['pair', 'Schottky or Frenkel pair']], kind, (v) => { kind = v; re(); });
  slider(ctl, { label: 'Formation energy E (eV)', min: 0.5, max: 2.5, step: 0.05, value: E, fmt: (v) => fmt(v, 3), oninput: (v) => { E = v; re(); } });
  slider(ctl, { label: 'Formation entropy S/k', min: 0, max: 4, step: 0.1, value: S, fmt: (v) => fmt(v, 2), oninput: (v) => { S = v; re(); } });
  slider(ctl, { label: 'Temperature T (K)', min: 300, max: 1600, step: 10, value: T, fmt: (v) => fmt(v, 4), oninput: (v) => { T = v; re(); } });
  const lf = (t) => { const h = kind === 'vac' ? 1 : 2; return (S / h - E / (h * KB * t)) / Math.LN10; };
  const show = () => {
    const f = 10 ** lf(T);
    out.innerHTML = `At ${fmt(T, 4)} K: n/N = ${fmt(f, 3)} (about ${fmt(f * 8.5e22, 3)} per cm³ in a metal). Slope of the line = −${kind === 'vac' ? 'E' : 'E/2'}/(k ln 10) per unit of 1/T; a 100 K rise multiplies n by ${fmt(10 ** (lf(T + 100) - lf(T)), 3)}.`;
  };
  cv.draw = (ctx, W, H, col) => {
    const ax = axes(ctx, W, H, col, { x: [0.6, 3.4], y: [-30, 0], xlabel: '1000 / T  (K⁻¹)', ylabel: 'log₁₀(n/N)', yt: [-30, -25, -20, -15, -10, -5, 0], fy: (v) => (v === 0 ? '1' : `10^${v}`), t: 26 });
    ax.clip && (ctx.save(), ax.clip());
    const pts = [];
    for (let x = 0.6; x <= 3.401; x += 0.02) pts.push([ax.X(x), ax.Y(Math.max(-31, lf(1000 / x)))]);
    line(ctx, pts, col.s[0], 2.5);
    // the other kind for comparison, dashed
    const save = kind; kind = kind === 'vac' ? 'pair' : 'vac';
    const p2 = []; for (let x = 0.6; x <= 3.401; x += 0.02) p2.push([ax.X(x), ax.Y(Math.max(-31, lf(1000 / x)))]);
    kind = save;
    line(ctx, p2, col.muted, 1.5, [5, 4]);
    ctx.restore();
    const x0 = 1000 / T, y0 = lf(T);
    if (y0 > -30) dot(ctx, ax.X(x0), ax.Y(y0), 5, col.ink, col.panel);
    text(ctx, kind === 'vac' ? 'single vacancy: slope −E/k' : 'pair: slope −E/2k', ax.X(0.7), ax.Y(-27), { color: col.s[0], size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'dashed: the other case', ax.X(0.7), ax.Y(-29), { color: col.muted, size: 11, halo: col.panel });
    text(ctx, 'Hot ← → Cold', ax.X(2.0), 14, { color: col.muted, size: 11, align: 'center' });
  };
  re();
}
