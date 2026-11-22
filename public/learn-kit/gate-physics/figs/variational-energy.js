// 4.9 The variational method. <H> as a function of the trial parameter for four classic cases: the oscillator
// with a Gaussian (exact at the minimum) and with e^(−α|x|), hydrogen with a Gaussian, and helium with a
// screened charge ζ. The curve always lies above the exact energy (dashed); its minimum is the best estimate.
import { canvas, axes, line, dot, text, row, choice, slider, readout, fmt } from '../../kit.js';

const CASES = {
  og: { name: 'oscillator, Gaussian e^(−βx²)', p: 'β (units mω/ħ)', lo: 0.05, hi: 2, E: (b) => b / 2 + 1 / (8 * b), exact: 0.5, unit: 'ħω', y: [0, 2.5] },
  oe: { name: 'oscillator, e^(−α|x|)', p: 'α (units √(mω/ħ))', lo: 0.3, hi: 3, E: (a) => a * a / 2 + 1 / (4 * a * a), exact: 0.5, unit: 'ħω', y: [0, 3] },
  hg: { name: 'hydrogen, Gaussian e^(−βr²)', p: 'β (units 1/a₀²)', lo: 0.02, hi: 1.2, E: (b) => 3 * b - 4 * Math.sqrt(2 * b / Math.PI), exact: -1, unit: 'Ry', y: [-1.2, 1] },
  he: { name: 'helium, screened charge ζ', p: 'ζ', lo: 1, hi: 2.4, E: (z) => (2 * z * z - 6.75 * z) * 13.6, exact: -79.0, unit: 'eV', y: [-82, -66] },
};

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 280, label: 'Variational energy against the trial parameter, with the exact energy' });
  let key = 'og', p = 0.25;
  const ctl = row(host), srow = document.createElement('div');
  const out = readout(host);
  let sl;
  const minOf = (c) => { let best = [c.lo, c.E(c.lo)]; for (let i = 0; i <= 2000; i++) { const x = c.lo + (c.hi - c.lo) * i / 2000, e = c.E(x); if (e < best[1]) best = [x, e]; } return best; };
  const build = () => {
    srow.innerHTML = '';
    const c = CASES[key]; p = c.lo + (c.hi - c.lo) * 0.15;
    sl = slider(srow, { label: c.p, min: c.lo, max: c.hi, step: (c.hi - c.lo) / 200, value: p, fmt: (v) => fmt(v, 3), oninput: (v) => { p = v; show(); } });
  };
  choice(ctl, 'Trial', [['og', 'oscillator, Gaussian'], ['oe', 'oscillator, exponential'], ['hg', 'hydrogen, Gaussian'], ['he', 'helium, ζ']], key, (v) => { key = v; build(); show(); });
  ctl.appendChild(srow);
  const show = () => {
    const c = CASES[key], [pm, em] = minOf(c);
    out.innerHTML = `${c.name}: ⟨H⟩(${fmt(p, 3)}) = ${fmt(c.E(p), 4)} ${c.unit}. Best: ${fmt(em, 4)} ${c.unit} at ${fmt(pm, 3)}; exact ${fmt(c.exact, 4)} ${c.unit} (error ${fmt(Math.abs(em - c.exact) / Math.abs(c.exact) * 100, 2)}%). Every point on the curve is an upper bound.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const c = CASES[key], [pm, em] = minOf(c);
    const ax = axes(ctx, w, h, col, { x: [c.lo, c.hi], y: c.y, xlabel: c.p, ylabel: `⟨H⟩ (${c.unit})` });
    ctx.save(); ax.clip();
    line(ctx, [[ax.L, ax.Y(c.exact)], [ax.R, ax.Y(c.exact)]], col.s[2], 1.6, [6, 4]);
    const pts = []; for (let i = 0; i <= 400; i++) { const x = c.lo + (c.hi - c.lo) * i / 400; pts.push([ax.X(x), ax.Y(c.E(x))]); }
    line(ctx, pts, col.s[0], 2.6);
    dot(ctx, ax.X(pm), ax.Y(em), 5, col.s[1]);
    dot(ctx, ax.X(p), ax.Y(c.E(p)), 4, col.ink);
    ctx.restore();
    text(ctx, 'exact', ax.R - 40, ax.Y(c.exact) + 12, { color: col.s[2], size: 11, weight: 600 });
    text(ctx, 'minimum', ax.X(pm) + 8, ax.Y(em) - 12, { color: col.s[1], size: 11, weight: 600 });
  };
  build(); show();
}
