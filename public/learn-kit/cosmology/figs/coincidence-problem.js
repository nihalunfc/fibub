// 9.7 Why now? Density of radiation, matter and a cosmological constant (kg/m³) against cosmic time on log scales,
// for the Planck 2018 mix (rounded, flat). Time comes from t = ∫ d(ln a) / H with H = H0 √(Ωr a⁻⁴ + Ωm a⁻³ + ΩΛ),
// summed along a fine grid in ln a. The shaded band is when dark energy and matter are within a factor of 10 of
// each other (0.1 < ρΛ/ρm < 10): from about 3.6 to 22 billion years after the Big Bang. On a log time axis
// running from a century to a trillion years, that is a thin slice, and we live inside it.
import { canvas, axes, text, title, line, dot, row, slider, readout } from '../../kit.js';
import { PLANCK18, criticalDensity, hubbleTimeGyr } from '../phys.js';

const Or = PLANCK18.Or, Om = PLANCK18.Om, OL = 1 - Om - Or, RC = criticalDensity(PLANCK18.H0), TH = hubbleTimeGyr(PLANCK18.H0) * 1e9;
const sup = (e) => String(e).replace(/[-0-9]/g, (d) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(d)]);

// table of (ln a, t in years)
const TAB = (() => {
  const H = (x) => Math.sqrt(Or * Math.exp(-4 * x) + Om * Math.exp(-3 * x) + OL);
  const x0 = -20, dx = 0.005, out = [];
  let t = (Math.exp(2 * x0) / (2 * Math.sqrt(Or))) * TH, x = x0, prev = 1 / H(x0);
  out.push([x, t]);
  while (x < 70) { x += dx; const cur = 1 / H(x); t += 0.5 * (prev + cur) * dx * TH; prev = cur; out.push([x, t]); }
  return out;
})();
const lnaAt = (ty) => { let lo = 0, hi = TAB.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; TAB[m][1] < ty ? (lo = m) : (hi = m); } const [x0, t0] = TAB[lo], [x1, t1] = TAB[hi]; return x0 + (x1 - x0) * (ty - t0) / (t1 - t0); };
const tAtLna = (x) => { const i = Math.max(0, Math.min(TAB.length - 2, Math.floor((x - TAB[0][0]) / 0.005))); return TAB[i][1]; };

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 430, min: 320, label: 'Densities of radiation, matter and dark energy against time since the Big Bang, with the brief era when matter and dark energy are comparable' });
  const tNow = tAtLna(0), win = [tAtLna(Math.log(Math.cbrt(0.1 * Om / OL))), tAtLna(Math.log(Math.cbrt(10 * Om / OL)))];
  const tAcc = tAtLna(Math.log(Math.cbrt(Om / (2 * OL))));
  let ty = tNow;
  const ctl = row(host);
  slider(ctl, { label: 'Time since the Big Bang', min: 100, max: 1e12, value: ty, log: true, fmt: (v) => (v < 1e6 ? Math.round(v).toLocaleString('en-CA') + ' years' : v < 1e9 ? (v / 1e6).toPrecision(3) + ' million years' : (v / 1e9).toPrecision(3) + ' billion years'), oninput: (v) => { ty = v; show(); cv.redraw(); } });
  const key = readout(host), out = readout(host);
  const sw = (i) => `<span style="display:inline-block;width:20px;border-top:3px solid var(--s${i + 1});vertical-align:middle;margin-right:5px"></span>`;
  key.style.fontSize = '13.5px';
  key.innerHTML = `${sw(3)}radiation (∝ 1/a⁴) &nbsp; ${sw(0)}matter (∝ 1/a³) &nbsp; ${sw(1)}dark energy (constant)`;
  const show = () => {
    const a = Math.exp(lnaAt(ty)), r = Or / a ** 4, m = Om / a ** 3, L = OL, s = r + m + L;
    const ratio = L / m;
    out.innerHTML = `Radiation <b>${(100 * r / s).toFixed(1)}%</b>, matter <b>${(100 * m / s).toFixed(1)}%</b>, dark energy <b>${(100 * L / s).toFixed(1)}%</b>. Dark energy ÷ matter = <b>${ratio < 1e-3 || ratio > 1e3 ? '10' + sup(Math.round(Math.log10(ratio))) : ratio.toPrecision(2)}</b>${ratio > 0.1 && ratio < 10 ? ': inside the "now" window.' : '.'}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Only now are matter and dark energy alike', col);
    const A = axes(ctx, w, h, col, { x: [100, 1e12], y: [1e-40, 1e-10], xlog: true, ylog: true, t: top + 10, l: 50, xt: [100, 1e4, 1e6, 1e8, 1e10, 1e12], yt: [1e-40, 1e-30, 1e-20, 1e-10], fx: (v) => '10' + sup(Math.round(Math.log10(v))), fy: (v) => '10' + sup(Math.round(Math.log10(v))), xlabel: 'Years since the Big Bang', ylabel: 'Density (kg/m³)' });
    ctx.save(); A.clip();
    ctx.globalAlpha = 0.22; ctx.fillStyle = col.s[1];
    ctx.fillRect(A.X(win[0]), A.T, A.X(win[1]) - A.X(win[0]), A.B - A.T);
    ctx.globalAlpha = 1;
    const ts = []; for (let e = 2; e <= 12.0001; e += 0.04) ts.push(10 ** e);
    const pts = (f) => ts.map((t) => { const a = Math.exp(lnaAt(t)); return [A.X(t), A.Y(Math.max(1e-60, RC * f(a)))]; });
    line(ctx, pts((a) => Or / a ** 4), col.s[3], 2.4);
    line(ctx, pts((a) => Om / a ** 3), col.s[0], 2.4);
    line(ctx, pts(() => OL), col.s[1], 2.4);
    line(ctx, [[A.X(ty), A.T], [A.X(ty), A.B]], col.ink, 1, [4, 3]);
    ctx.restore();
    dot(ctx, A.X(tNow), A.Y(RC), 5, col.ink, col.panel);
    text(ctx, 'now', A.X(tNow), A.Y(RC) - 13, { color: col.ink, size: 11.5, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'dark energy', A.X(300), A.Y(OL * RC) - 11, { color: col.s[1], size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'shaded: within ×10 of each other', A.R - 4, A.B - 10, { color: col.muted, size: 11, align: 'right', halo: col.panel });
  };
  show(); cv.redraw();
  return { tAcc };
}
