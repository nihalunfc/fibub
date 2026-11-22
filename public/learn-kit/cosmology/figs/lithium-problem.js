// 6.7 The lithium problem. Dots: lithium in old, metal-poor halo stars, A(Li) = 12 + log₁₀(Li/H), against their
// iron content [Fe/H] (−3 means 1/1000 of the Sun's iron). They sit on a flat "Spite plateau" at A(Li) ≈ 2.2
// (Li/H ≈ 1.6 × 10⁻¹⁰); below [Fe/H] ≈ −2.8 the scatter grows. The dots are illustrative, drawn to match the
// published plateau (Spite and Spite 1982; Sbordone et al. 2010), not a real catalogue. Band: the Big Bang
// prediction for the chosen η (fits as in big-bang-nucleosynthesis.js), about A(Li) = 2.7, three times higher.
// Slide η to see that lowering it enough to match lithium wrecks deuterium.
import { canvas, axes, text, title, line, dot, row, slider, readout, rng, arrow } from '../../kit.js';
import { bbn } from './big-bang-nucleosynthesis.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 420, min: 300, label: 'Lithium in old halo stars on a flat plateau, below the Big Bang prediction' });
  const r = rng(23), gauss = () => { let s = 0; for (let i = 0; i < 6; i++) s += r(); return (s - 3) / Math.sqrt(0.5); };
  const stars = Array.from({ length: 56 }, () => {
    const fe = -3.5 + r() * 2.3;
    let A = 2.21 + 0.06 * gauss();
    if (fe < -2.8 && r() < 0.45) A -= 0.1 + r() * 0.35; // the "meltdown" of the plateau at the lowest metallicity
    return [fe, A];
  });
  let eta = 6.1;
  const ctl = row(host);
  slider(ctl, { label: 'Atoms per photon, η × 10¹⁰', min: 1.5, max: 9, value: eta, log: true, fmt: (v) => v.toFixed(2), oninput: (v) => { eta = v; show(); cv.redraw(); } });
  const out = readout(host);
  const Apred = (e) => 12 + Math.log10(bbn.Li(e));
  const show = () => {
    const f = bbn.Li(eta) / 1.6e-10, d = bbn.D(eta) / 2.53e-5;
    out.innerHTML = `At η = ${eta.toFixed(2)} × 10<sup>−10</sup>: predicted lithium A(Li) = <b>${Apred(eta).toFixed(2)}</b>, <b>${f.toFixed(1)}×</b> what the old stars show. Predicted deuterium: <b>${d.toFixed(2)}×</b> the measured value${Math.abs(d - 1) > 0.15 ? ' (ruled out)' : ' (matches)'}.${Math.abs(eta - 6.13) > 0.3 ? ' The CMB says η = 6.13.' : ''}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Old stars hold a third of the lithium', col);
    const A = axes(ctx, w, h, col, { x: [-3.6, -0.85], y: [1.6, 3.2], t: top + 10, l: 44, xt: [-3.5, -3, -2.5, -2, -1.5, -1], yt: [1.6, 2, 2.4, 2.8, 3.2], fy: (v) => v.toFixed(1), xlabel: 'Iron in the star, [Fe/H]', ylabel: 'Lithium, A(Li)' });
    ctx.save(); A.clip();
    const ap = Apred(eta);
    ctx.globalAlpha = 0.25; ctx.fillStyle = col.s[7]; ctx.fillRect(A.L, A.Y(ap + 0.06), A.R - A.L, A.Y(ap - 0.06) - A.Y(ap + 0.06)); ctx.globalAlpha = 1;
    line(ctx, [[A.L, A.Y(ap)], [A.R, A.Y(ap)]], col.s[7], 2.2);
    line(ctx, [[A.L, A.Y(2.2)], [A.R, A.Y(2.2)]], col.s[0], 1.2, [5, 4]);
    for (const [fe, a] of stars) dot(ctx, A.X(fe), A.Y(a), 3.6, col.s[0]);
    ctx.restore();
    text(ctx, `Big Bang prediction (η = ${eta.toFixed(1)})`, A.L + 6, A.Y(ap) - 13, { color: col.s[7], size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'Spite plateau, A(Li) ≈ 2.2', A.R - 4, A.Y(2.2) + 30, { color: col.s[0], size: 11.5, weight: 700, align: 'right', halo: col.panel });
    if (ap - 2.2 > 0.15) {
      const x = A.X(-1.0);
      arrow(ctx, x, A.Y(2.2) - 6, x, A.Y(ap) + 6, col.ink, 1.5, 7);
      text(ctx, `×${(10 ** (ap - 2.2)).toFixed(1)}`, x - 6, (A.Y(2.2) + A.Y(ap)) / 2, { color: col.ink, size: 12, weight: 700, align: 'right', halo: col.panel });
    }
  };
  show(); cv.redraw();
}
