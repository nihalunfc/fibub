// 12.3 Published values of S8 = σ8 √(Ωm/0.3) with ±1σ error bars. Only published values (sources in the lesson):
// Planck 2018 TT,TE,EE+lowE+lensing (A&A 641, A6): 0.832 ± 0.013. Weak lensing: KiDS-1000 cosmic shear (Asgari et
// al. 2021, A&A 645, A104) 0.759 +0.024/−0.021; KiDS-1000 3×2pt (Heymans et al. 2021, A&A 646, A140) 0.766
// +0.020/−0.014; DES Y3 3×2pt (DES Collaboration 2022, PRD 105, 023520) 0.776 ± 0.017; HSC Y3 cosmic shear
// (Dalal et al. 2023, PRD 108, 123519) 0.776 +0.032/−0.033; DES Y3 + KiDS-1000 (2023, Open Journal of Astrophysics
// 6, 36) 0.790 +0.018/−0.014; KiDS-Legacy (Wright et al. 2025, arXiv:2503.19441) 0.815 +0.016/−0.021.
// Galaxy clusters: eROSITA (Ghirardini et al. 2024, A&A 689, A298) 0.86 ± 0.01.
import { canvas, axes, text, title, line, dot, readout } from '../../kit.js';

const D = [
  { g: 0, name: 'Planck 2018 (CMB)', v: 0.832, lo: 0.013, hi: 0.013 },
  { g: 1, name: 'KiDS-1000 shear 2021', v: 0.759, lo: 0.021, hi: 0.024 },
  { g: 1, name: 'KiDS-1000 3×2pt 2021', v: 0.766, lo: 0.014, hi: 0.02 },
  { g: 1, name: 'DES Y3 3×2pt 2022', v: 0.776, lo: 0.017, hi: 0.017 },
  { g: 1, name: 'HSC Y3 shear 2023', v: 0.776, lo: 0.033, hi: 0.032 },
  { g: 1, name: 'DES Y3 + KiDS 2023', v: 0.79, lo: 0.014, hi: 0.018 },
  { g: 1, name: 'KiDS-Legacy 2025', v: 0.815, lo: 0.021, hi: 0.016 },
  { g: 2, name: 'eROSITA clusters 2024', v: 0.86, lo: 0.01, hi: 0.01 },
];

export default function (host) {
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 340, label: 'Published S8 values from the CMB, weak lensing surveys and galaxy clusters' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'S₈: how clumpy is matter today?', col) + 2;
    const nameW = Math.min(170, Math.max(140, w * 0.4));
    const A = axes(ctx, w, h, col, { x: [0.72, 0.88], y: [0, D.length + 0.6], t: top + 8, l: nameW, r: 12, b: 38, xlabel: 'S₈ (smoother ← → lumpier)', yt: [], xt: [0.72, 0.76, 0.8, 0.84, 0.88], fx: (v) => v.toFixed(2) });
    const y = (i) => A.Y(D.length - i);
    ctx.save(); A.clip();
    ctx.globalAlpha = 0.16; ctx.fillStyle = col.s[0];
    ctx.fillRect(A.X(0.819), A.T, A.X(0.845) - A.X(0.819), A.B - A.T);
    ctx.globalAlpha = 1;
    D.forEach((d, i) => {
      const c = col.s[[0, 1, 4][d.g]];
      line(ctx, [[A.X(d.v - d.lo), y(i)], [A.X(d.v + d.hi), y(i)]], c, 2.2);
      dot(ctx, A.X(d.v), y(i), 5, c, col.panel);
    });
    ctx.restore();
    D.forEach((d, i) => text(ctx, d.name, A.L - 6, y(i), { color: col.ink, size: 11, weight: i === 0 || i === 6 ? 700 : 400, align: 'right' }));
  };
  const sig = (a, b) => Math.abs(a.v - b.v) / Math.hypot(a.v < b.v ? a.hi : a.lo, a.v < b.v ? b.lo : b.hi);
  out.innerHTML = `<span style="color:var(--s1);font-weight:700">●</span> CMB, predicted with ΛCDM · <span style="color:var(--s2);font-weight:700">●</span> weak lensing · <span style="color:var(--s5);font-weight:700">●</span> galaxy clusters. Error bars ±1σ.<br>Gap from Planck: DES Y3 ${sig(D[3], D[0]).toFixed(1)}σ, KiDS-1000 shear ${sig(D[1], D[0]).toFixed(1)}σ, KiDS-Legacy ${sig(D[6], D[0]).toFixed(1)}σ, eROSITA ${sig(D[7], D[0]).toFixed(1)}σ (simple estimate: S₈ only, errors in quadrature).`;
  cv.redraw();
}
