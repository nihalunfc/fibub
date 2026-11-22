// 11.4 The hunt for r, the tensor-to-scalar ratio, step by step (log scale).
// Model bands, for N = 50 to 60 e-folds: ½m²φ² gives r = 8/N = 0.13-0.16; Starobinsky gives r ≈ 12/N² = 0.0033-0.0048.
// BICEP2 (PRL 112, 241101, March 2014): r = 0.20 +0.07 −0.05 (dust model of the time).
// BICEP2/Keck + Planck joint analysis (PRL 114, 101301, 2015): the signal is consistent with dust; r < 0.12 (95%).
// BICEP2/Keck 2018 (BK15, PRL 121, 221301): r < 0.06. BICEP/Keck 2021 (BK18, PRL 127, 151301): r < 0.036.
// Tristram et al. 2022 (PRD 105, 083524, BK18 + Planck PR4 + BAO + lensing): r < 0.032 (all 95%).
// Goals of the next experiments (Simons Observatory, LiteBIRD): uncertainty on r of roughly 0.001-0.003.
import { canvas, axes, text, title, line, dot, arrow, readout } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.75, max: 430, min: 320, label: 'Measurements and limits on the tensor-to-scalar ratio r since 2014, against the predictions of two inflation models' });
  let step = 0;
  const lims = [[2015.1, 0.12, 'BICEP2/Keck + Planck'], [2018.8, 0.06, 'BICEP/Keck'], [2021.8, 0.036, 'BICEP/Keck'], [2022.6, 0.032, '+ Planck']];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, ['Two models, two predictions', 'March 2014: BICEP2 claims r = 0.2', '2015: it was dust', 'The limits keep falling', 'Next: down to r ≈ 0.001'][step], col);
    const A = axes(ctx, w, h, col, { x: [2013, 2033], y: [5e-4, 0.5], ylog: true, t: top + 14, l: 46,
      xt: [2014, 2018, 2022, 2026, 2030], yt: [1e-3, 0.01, 0.1], fx: (v) => String(v), fy: (v) => String(+v.toPrecision(1)),
      xlabel: 'year', ylabel: 'tensor-to-scalar ratio r' });
    // model bands
    const band = (lo, hi, c, lab, below) => {
      ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = c; ctx.fillRect(A.L, A.Y(hi), A.R - A.L, A.Y(lo) - A.Y(hi)); ctx.restore();
      text(ctx, lab, A.R - 4, below ? A.Y(lo) + 10 : A.Y(hi) - 9, { color: c, size: 10.5, weight: 700, align: 'right', halo: col.panel });
    };
    band(0.133, 0.16, col.s[3], '½m²φ² (ball in a bowl)', true);
    band(0.0033, 0.0048, col.s[2], 'Starobinsky');
    if (step >= 1) {
      const x = A.X(2014.2), c = step === 1 ? col.s[0] : col.muted;
      line(ctx, [[x, A.Y(0.15)], [x, A.Y(0.27)]], c, 2);
      dot(ctx, x, A.Y(0.2), 6, c, col.panel);
      text(ctx, step === 1 ? 'BICEP2: r = 0.20' : 'BICEP2 (dust)', x + 9, A.Y(0.2) - (step === 1 ? 0 : 12), { color: c, size: 11, weight: 700, halo: col.panel });
    }
    const shown = step >= 3 ? lims : step >= 2 ? lims.slice(0, 1) : [];
    shown.forEach(([yr, r, lab], i) => {
      const x = A.X(yr), c = i === shown.length - 1 ? col.s[0] : col.muted;
      line(ctx, [[x - 7, A.Y(r)], [x + 7, A.Y(r)]], c, 2.5);
      arrow(ctx, x, A.Y(r), x, A.Y(r) + 22, c, 2, 7);
      text(ctx, `< ${r}`, i === 2 ? x - 9 : x + 9, A.Y(r) - 2, { color: c, size: 10.5, weight: 700, align: i === 2 ? 'right' : 'left', halo: col.panel });
    });
    if (step >= 4) {
      ctx.save(); ctx.globalAlpha = 0.15; ctx.fillStyle = col.s[0]; ctx.fillRect(A.X(2026), A.Y(0.003), A.R - A.X(2026), A.Y(0.001) - A.Y(0.003)); ctx.restore();
      text(ctx, 'goal of the next experiments', A.R - 4, A.Y(0.001) + 10, { color: col.s[0], size: 10.5, weight: 700, align: 'right', halo: col.panel });
    }
  };
  const out = readout(host);
  const show = () => {
    out.innerHTML = [
      'Simple inflation models predict how strong the gravitational waves should be. The ball-in-a-bowl model (½m²φ²) predicts r ≈ 0.13 to 0.16; Starobinsky\'s plateau predicts only about 0.004.',
      'On 17 March 2014 the BICEP2 team, observing from the South Pole, announced swirling B-mode polarisation on degree scales, read as r = 0.20. Headlines called it proof of inflation.',
      'Dust grains in our own galaxy, lined up by its magnetic field, also glow with B-mode polarisation. Planck\'s dust maps and a joint analysis in 2015 showed the signal could be all dust. Only an upper limit, r &lt; 0.12, survived.',
      'Measuring at several frequencies separates dust from the CMB. The limit fell to r &lt; 0.06 (2018), r &lt; 0.036 (2021) and r &lt; 0.032 with Planck added (2022). The ball-in-a-bowl model is ruled out.',
      'The Simons Observatory in Chile and the planned LiteBIRD satellite aim to reach r of about 0.001 to 0.003: enough to test Starobinsky-like models.',
    ][step];
  };
  cv.redraw(); show();
  return { step(i) { step = Math.min(4, i); cv.redraw(); show(); } };
}
