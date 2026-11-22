// 6.6 The "Schramm plot": how much of each light element the Big Bang makes, against the number of atoms per
// photon, η (shown as η₁₀ = η × 10¹⁰). Curves are simple fits to detailed nucleosynthesis calculations (Steigman
// 2007; Fields et al. 2020), good to roughly 10% near η₁₀ = 6 and to about 20% across the plot; lithium's dip
// near η₁₀ ≈ 2.7 (made directly as lithium-7 at low η, as beryllium-7 at high η) is drawn approximately.
//   helium-4 (mass fraction): Y ≈ 0.2470 + 0.011 ln(η₁₀ / 6.1)
//   deuterium: D/H ≈ 2.5 × 10⁻⁵ (6.1 / η₁₀)^1.6
//   helium-3: ³He/H ≈ 1.0 × 10⁻⁵ (6.1 / η₁₀)^0.6
//   lithium-7: Li/H ≈ 5.0 × 10⁻¹⁰ (η₁₀ / 6.1)² + 4.2 × 10⁻¹² (η₁₀ / 6.1)^−2.5
// Measured bands: Y = 0.245 ± 0.003 (Aver et al. 2021), D/H = (2.53 ± 0.03) × 10⁻⁵ (Cooke et al. 2018),
// Li/H = (1.6 ± 0.3) × 10⁻¹⁰ in old halo stars (Sbordone et al. 2010). CMB (Planck 2018): η₁₀ = 6.13 ± 0.04.
import { canvas, axes, text, title, line, row, slider, readout } from '../../kit.js';

export const bbn = {
  Y: (e) => 0.2470 + 0.011 * Math.log(e / 6.1),
  D: (e) => 2.5e-5 * Math.pow(6.1 / e, 1.6),
  He3: (e) => 1.0e-5 * Math.pow(6.1 / e, 0.6),
  Li: (e) => 5.0e-10 * (e / 6.1) ** 2 + 4.2e-12 * Math.pow(e / 6.1, -2.5),
};

export default function (host) {
  const cv = canvas(host, { aspect: 1.05, max: 560, min: 400, label: 'Predicted helium, deuterium, helium-3 and lithium from the Big Bang against the density of atoms, with measured values as bands' });
  let eta = 6.1;
  const ctl = row(host);
  slider(ctl, { label: 'Atoms per photon, η × 10¹⁰', min: 1, max: 10, value: eta, log: true, fmt: (v) => v.toFixed(2), oninput: (v) => { eta = v; show(); cv.redraw(); } });
  const out = readout(host);
  const sci = (v) => { const e = Math.floor(Math.log10(v)); return `${(v / 10 ** e).toFixed(2)} × 10<sup>${e}</sup>`; };
  const show = () => {
    const obh2 = eta / 273.9;
    out.innerHTML = `η = ${eta.toFixed(2)} × 10<sup>−10</sup> (1 atom per ${(10 / eta).toFixed(2)} billion photons; atoms = ${(100 * obh2 / 0.677 ** 2).toFixed(1)}% of the critical density). Predicted: helium <b>${bbn.Y(eta).toFixed(4)}</b> (measured 0.245 ± 0.003), D/H <b>${sci(bbn.D(eta))}</b> (measured 2.53 × 10<sup>−5</sup>), Li/H <b>${sci(bbn.Li(eta))}</b> (old stars 1.6 × 10<sup>−10</sup>).`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'What the Big Bang cooks, for each density of atoms', col);
    const gapY = 34, split = top + 6 + (h - top - 6 - gapY - 42) * 0.3;
    // top panel: helium-4 by mass
    const A = axes(ctx, w, h, col, { x: [1, 10], y: [0.22, 0.26], xlog: true, t: top + 8, b: h - split, l: 58, xt: [1, 2, 5, 10], fx: () => '', yt: [0.22, 0.24, 0.26], ylabel: '', fy: (v) => v.toFixed(2) });
    // bottom panel: number ratios
    const B = axes(ctx, w, h, col, { x: [1, 10], y: [5e-11, 1e-3], xlog: true, ylog: true, t: split + gapY, l: 58, xt: [1, 2, 3, 5, 7, 10], yt: [1e-10, 1e-8, 1e-6, 1e-4], xlabel: 'Atoms per photon, η × 10¹⁰ (log scale)' });
    const xs = []; for (let l = 0; l <= 1.0001; l += 0.01) xs.push(10 ** l);
    const band = (P, lo, hi, c) => { ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = c; const y1 = P.Y(hi), y2 = P.Y(lo); ctx.fillRect(P.L, y1, P.R - P.L, Math.max(2, y2 - y1)); ctx.restore(); };
    // CMB value
    for (const P of [A, B]) { ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = col.ink; ctx.fillRect(P.X(6.09) - 1.5, P.T, P.X(6.17) - P.X(6.09) + 3, P.B - P.T); ctx.restore(); }
    band(A, 0.242, 0.248, col.s[0]);
    band(B, 2.50e-5, 2.56e-5, col.s[1]);
    band(B, 1.3e-10, 1.9e-10, col.s[7]);
    ctx.save(); A.clip(); line(ctx, xs.map((e) => [A.X(e), A.Y(bbn.Y(e))]), col.s[0], 2.5); ctx.restore();
    ctx.save(); B.clip();
    line(ctx, xs.map((e) => [B.X(e), B.Y(bbn.D(e))]), col.s[1], 2.5);
    line(ctx, xs.map((e) => [B.X(e), B.Y(bbn.He3(e))]), col.s[2], 2.5);
    line(ctx, xs.map((e) => [B.X(e), B.Y(bbn.Li(e))]), col.s[7], 2.5);
    ctx.restore();
    // labels
    text(ctx, 'helium-4 (share of mass)', A.L + 6, A.T + 10, { color: col.s[0], size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'D/H', B.X(1.15), B.Y(bbn.D(1.15)) + 14, { color: col.s[1], size: 11.5, weight: 700, halo: col.panel });
    text(ctx, '³He/H', B.X(1.15), B.Y(bbn.He3(1.15)) + 14, { color: col.s[2], size: 11.5, weight: 700, halo: col.panel });
    text(ctx, '⁷Li/H', B.X(1.6), B.Y(bbn.Li(1.6)) - 12, { color: col.s[7], size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'atoms per hydrogen', B.L + 4, B.T - 9, { color: col.ink, size: 11.5, weight: 600 });
    text(ctx, 'CMB', B.X(6.13), B.T + 9, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'old stars', B.L + 4, B.Y(1.3e-10) + 9, { color: col.s[7], size: 10.5, halo: col.panel });
    // the reader's η
    for (const P of [A, B]) line(ctx, [[P.X(eta), P.T], [P.X(eta), P.B]], col.ink, 1.2, [4, 3]);
  };
  show(); cv.redraw();
}
