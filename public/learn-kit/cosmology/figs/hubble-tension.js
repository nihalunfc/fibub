// 12.2 Published measurements of the Hubble constant with their ±1σ error bars, grouped by method, plus a
// sigma-gap calculator for any two of them. Only published values (sources in the lesson):
// WMAP 9-year alone (Hinshaw et al. 2013, ApJS 208, 19); Planck 2015 XIII (A&A 594, A13) and 2018 VI (A&A 641, A6);
// DESI DR2 BAO + BBN + CMB angle θ* (DESI Collaboration 2025, arXiv:2503.14738); HST Key Project (Freedman et al.
// 2001, ApJ 553, 47); SH0ES (Riess et al. 2019, ApJ 876, 85; 2022, ApJL 934, L7); CCHP tip of the red giant branch
// (Freedman et al. 2019, ApJ 882, 34; stat and sys added in quadrature) and CCHP with JWST (Freedman et al. 2025,
// ApJ 985, 203, arXiv:2408.06153; 70.39 ± 1.22 stat ± 1.33 sys ± 0.70 SN, combined here); megamasers (Pesce et al.
// 2020, ApJL 891, L1); lensed quasar delays H0LiCOW (Wong et al. 2020, MNRAS 498, 1420) and TDCOSMO (Birrer et al.
// 2020, A&A 643, A165); GW170817 standard siren (Abbott et al. 2017, Nature 551, 85).
import { canvas, axes, text, title, line, dot, row, readout } from '../../kit.js';

export const H0DATA = [
  { g: 0, name: 'WMAP 9-year', yr: 2013, v: 70.0, lo: 2.2, hi: 2.2 },
  { g: 0, name: 'Planck 2015', yr: 2015, v: 67.8, lo: 0.9, hi: 0.9 },
  { g: 0, name: 'Planck 2018', yr: 2018, v: 67.4, lo: 0.5, hi: 0.5 },
  { g: 0, name: 'DESI BAO+BBN', yr: 2025, v: 68.51, lo: 0.58, hi: 0.58 },
  { g: 1, name: 'HST Key Project', yr: 2001, v: 72, lo: 8, hi: 8 },
  { g: 1, name: 'SH0ES Cepheids', yr: 2019, v: 74.03, lo: 1.42, hi: 1.42 },
  { g: 1, name: 'SH0ES Cepheids', yr: 2022, v: 73.04, lo: 1.04, hi: 1.04 },
  { g: 1, name: 'CCHP red giants', yr: 2019, v: 69.8, lo: 1.9, hi: 1.9 },
  { g: 1, name: 'CCHP with JWST', yr: 2025, v: 70.39, lo: 1.94, hi: 1.94 },
  { g: 1, name: 'Megamasers', yr: 2020, v: 73.9, lo: 3.0, hi: 3.0 },
  { g: 1, name: 'H0LiCOW lenses', yr: 2020, v: 73.3, lo: 1.8, hi: 1.7 },
  { g: 1, name: 'TDCOSMO lenses', yr: 2020, v: 67.4, lo: 3.2, hi: 4.1 },
  { g: 1, name: 'GW170817 siren', yr: 2017, v: 70.0, lo: 8, hi: 12 },
];

// complementary error function (Abramowitz and Stegun 7.1.26), good to 1e-7
const erfc = (x) => { const t = 1 / (1 + 0.3275911 * x); return t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429)))) * Math.exp(-x * x); };

export default function (host) {
  const D = H0DATA;
  const cv = canvas(host, { aspect: 1.05, max: 520, min: 430, label: 'Published Hubble constant measurements with error bars, early-universe and local methods' });
  let A = 2, B = 6;
  const ctl = row(host);
  const mk = (lab, val, on) => {
    const l = document.createElement('label'); l.className = 'lk-slider';
    const s = document.createElement('span'); s.textContent = lab;
    const sel = document.createElement('select');
    D.forEach((d, i) => { const o = document.createElement('option'); o.value = i; o.textContent = `${d.name} ${d.yr}`; sel.appendChild(o); });
    sel.value = val; sel.setAttribute('aria-label', lab);
    sel.style.maxWidth = '100%'; sel.style.width = '100%'; sel.style.gridColumn = '1 / -1'; sel.style.font = 'inherit';
    sel.addEventListener('change', () => on(+sel.value));
    l.append(s, sel); ctl.appendChild(l);
  };
  mk('Compare', A, (i) => { A = i; upd(); });
  mk('with', B, (i) => { B = i; upd(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Hubble constant: published measurements', col) + 2;
    const nameW = Math.min(170, Math.max(128, w * 0.38));
    const Ax = axes(ctx, w, h, col, { x: [62, 80], y: [0, D.length + 2], t: top + 6, l: nameW, r: 12, b: 38, xlabel: 'H₀ (km/s/Mpc)', yt: [], xt: [64, 68, 72, 76, 80] });
    const rowY = (i) => Ax.Y(D.length + 1.5 - (i + (D[i].g ? 1.6 : 0.6)));
    ctx.save(); Ax.clip();
    // bands for the two headline values
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = col.s[0]; ctx.fillRect(Ax.X(67.4 - 0.5), Ax.T, Ax.X(67.9) - Ax.X(66.9), Ax.B - Ax.T);
    ctx.fillStyle = col.s[1]; ctx.fillRect(Ax.X(73.04 - 1.04), Ax.T, Ax.X(74.08) - Ax.X(72.0), Ax.B - Ax.T);
    ctx.globalAlpha = 1;
    D.forEach((d, i) => {
      const y = rowY(i), c = d.g ? col.s[1] : col.s[0], s = i === A || i === B;
      if (s) { ctx.fillStyle = col.soft; ctx.fillRect(Ax.L, y - 9, Ax.R - Ax.L, 18); }
      line(ctx, [[Ax.X(d.v - d.lo), y], [Ax.X(d.v + d.hi), y]], c, s ? 3 : 2);
      dot(ctx, Ax.X(d.v), y, s ? 5.5 : 4.5, c, col.panel);
    });
    ctx.restore();
    D.forEach((d, i) => {
      const y = rowY(i);
      if (d.v + d.hi > 80) text(ctx, '→', Ax.R - 2, y - 9, { color: col.muted, size: 11, align: 'right' });
      if (d.v - d.lo < 62) text(ctx, '←', Ax.L + 2, y - 9, { color: col.muted, size: 11 });
      text(ctx, `${d.name} ${String(d.yr).slice(2)}`, Ax.L - 6, y, { color: i === A || i === B ? col.ink : col.muted, size: 11, weight: i === A || i === B ? 700 : 400, align: 'right' });
    });
    text(ctx, 'Early universe + ΛCDM', Ax.L + 4, rowY(0) - 15, { color: col.s[0], size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'Local measurements', Ax.L + 4, rowY(4) - 15, { color: col.s[1], size: 11.5, weight: 700, halo: col.panel });
  };
  const upd = () => {
    const a = D[A], b = D[B];
    const lowFirst = a.v <= b.v, sa = lowFirst ? a.hi : a.lo, sb = lowFirst ? b.lo : b.hi;
    const sig = Math.abs(a.v - b.v) / Math.hypot(sa, sb), p = erfc(sig / Math.SQRT2);
    const odds = p > 0 ? +(1 / p).toPrecision(2) : Infinity;
    out.innerHTML = A === B ? 'Pick two different measurements.' : `Gap: |${a.v} − ${b.v}| = ${Math.abs(a.v - b.v).toFixed(2)} km/s/Mpc. Combined error √(${sa}² + ${sb}²) = ${Math.hypot(sa, sb).toFixed(2)}. So they are <b>${sig.toFixed(1)}σ</b> apart. ${sig < 1 ? 'They agree.' : sig < 3 ? `A gap this big happens by chance about 1 time in ${odds.toLocaleString('en-CA')}: not worrying.` : sig < 5 ? `Chance about 1 in ${odds.toLocaleString('en-CA')}: "evidence" of a real difference.` : `Chance less than 1 in ${odds > 1e6 ? (Math.round(odds / 1e5) / 10).toLocaleString('en-CA') + ' million' : odds.toLocaleString('en-CA')}: past physicists' 5σ bar.`}<br><small>Error bars are ±1σ; shaded bands: Planck 2018 and SH0ES 2022. Lens results with uneven error bars use the side facing the other value.</small>`;
    cv.redraw();
  };
  upd();
}
