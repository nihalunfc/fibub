// 10.6 How good each halo is at making stars: stellar mass ÷ halo mass against halo mass, today (z = 0), from the
// abundance-matching fit of Moster, Naab and White (2013): M*/M = 2N [ (M/M1)^−β + (M/M1)^γ ]⁻¹ with
// N = 0.0351, log M1 = 11.59, β = 1.376, γ = 0.608. The cosmic baryon fraction Ωb/Ωm ≈ 0.157 (Planck 2018) is
// the most a halo could turn into stars. The peak, about a fifth of that, sits near the Milky Way's mass.
import { canvas, axes, text, title, line, dot, row, slider, readout, fmt } from '../../kit.js';

const FB = 0.157;
export const eff = (M) => { const x = M / 10 ** 11.59; return 2 * 0.0351 / (x ** -1.376 + x ** 0.608); };

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 420, min: 300, label: 'Fraction of each halo\'s mass that ends up in stars, against halo mass' });
  let M = 1e12;
  const ctl = row(host);
  slider(ctl, { label: 'Halo mass', min: 1e10, max: 1e15, log: true, value: M, fmt: (v) => fmt(v, 2) + ' suns', oninput: (v) => { M = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const e = eff(M);
    out.innerHTML = `Stars: <b>${fmt(e * M, 2)} suns</b>, which is ${(100 * e).toFixed(1)}% of the halo, or <b>${Math.round(100 * e / FB)}%</b> of its fair share of atoms. ${M < 3e11 ? 'Small halo: supernova winds blow the gas out of its shallow well.' : M > 3e12 ? 'Big halo: the gas stays too hot, and the central black hole keeps it that way.' : 'Near the sweet spot, around the Milky Way\'s mass.'}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [1e10, 1e15], y: [1e-4, 0.3], xlog: true, ylog: true, t: 40, xlabel: 'Halo mass (suns)', ylabel: 'Stars ÷ halo mass' });
    line(ctx, [[A.L, A.Y(FB)], [A.R, A.Y(FB)]], col.s[1], 1.5, [6, 4]);
    text(ctx, 'all the atoms (15.7%)', A.R - 4, A.Y(FB) - 9, { color: col.s[1], size: 11, weight: 700, align: 'right', halo: col.panel });
    const pts = []; for (let i = 0; i <= 200; i++) { const m = 10 ** (10 + i * 5 / 200); pts.push([A.X(m), A.Y(eff(m))]); }
    line(ctx, pts, col.s[0], 3);
    dot(ctx, A.X(M), A.Y(eff(M)), 6, col.s[3], col.panel);
    text(ctx, 'supernovae win', A.X(1.3e10), A.Y(2e-4), { color: col.muted, size: 11, weight: 600 });
    text(ctx, 'black holes win', A.X(8e14), A.Y(2e-4), { color: col.muted, size: 11, weight: 600, align: 'right' });
    title(ctx, 'Few atoms become stars', col);
  };
  cv.redraw(); show();
}
