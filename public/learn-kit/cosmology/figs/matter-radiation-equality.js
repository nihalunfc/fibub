// 6.8 Matter-radiation equality and why it matters. Top: the share of the universe's energy in radiation
// (photons, plus the relic neutrinos if switched on) and in matter, against time. Bottom: how much a clump of
// dark matter, already inside the horizon, has grown since early on: δ ∝ 1 + 3y/2 with y = a / a_eq (Mészáros
// 1974, the exact growing solution for a universe of radiation and matter, ignoring the atoms' pressure). While
// radiation rules, clumps barely grow; after equality they grow in step with the universe.
// Times come from the exact radiation-plus-matter solution, H₀t = (4a_eq² / 3√Ω_r)[1 − (1 − y/2)√(1 + y)]
// (dark energy is negligible this early). Photons: Ω_γ = 5.38 × 10⁻⁵ for h = 0.677; with three neutrino kinds
// (N_eff = 3.044) Ω_r = 1.6913 Ω_γ = 9.1 × 10⁻⁵, as PLANCK18 in phys.js.
import { canvas, axes, text, title, line, row, slider, choice, readout } from '../../kit.js';
import { hubbleTimeGyr, PLANCK18, T_CMB } from '../phys.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.95, max: 520, min: 380, label: 'Shares of radiation and matter against time, and the growth of a dark matter clump before and after matter took over' });
  const OG = 5.38e-5, NU = 1.6913, tH = hubbleTimeGyr(PLANCK18.H0) * 1e9; // years
  let Om = PLANCK18.Om, nu = true;
  const Or = () => OG * (nu ? NU : 1);
  const aeq = () => Or() / Om;
  const tOfA = (a) => { const ae = aeq(), y = a / ae; return ((4 * ae * ae) / (3 * Math.sqrt(Or()))) * (1 - (1 - y / 2) * Math.sqrt(1 + y)) * tH; };
  const aOfT = (t) => { let lo = 1e-9, hi = 1; for (let i = 0; i < 80; i++) { const m = Math.sqrt(lo * hi); if (tOfA(m) > t) hi = m; else lo = m; } return Math.sqrt(lo * hi); };
  const ctl = row(host);
  slider(ctl, { label: 'Matter today, Ωm', min: 0.1, max: 0.6, value: Om, step: 0.01, fmt: (v) => v.toFixed(2), oninput: (v) => { Om = v; show(); cv.redraw(); } });
  choice(ctl, 'Radiation', [[true, 'Light + neutrinos'], [false, 'Light only']], true, (v) => { nu = v; show(); cv.redraw(); });
  const out = readout(host);
  const show = () => {
    const ae = aeq(), z = 1 / ae - 1, t = tOfA(ae);
    out.innerHTML = `Matter overtakes radiation at <b>z = ${Math.round(z).toLocaleString('en-CA')}</b>, about <b>${(+t.toPrecision(2)).toLocaleString('en-CA')} years</b> after the start, when the light was at ${Math.round(T_CMB * (1 + z)).toLocaleString('en-CA')} K.${nu ? '' : ' Leaving out the neutrinos puts it far too early.'}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Matter takes over, and clumps start to grow', col);
    const t0 = 100, t1 = 1e8, gap = 30;
    const mid = top + 8 + (h - top - 8 - gap - 42) * 0.42;
    const A = axes(ctx, w, h, col, { x: [t0, t1], y: [0, 100], xlog: true, t: top + 10, b: h - mid, l: 52, xt: [1e2, 1e4, 1e6, 1e8], fx: () => '', yt: [0, 50, 100], fy: (v) => v + '%' });
    const B = axes(ctx, w, h, col, { x: [t0, t1], y: [0.8, 300], xlog: true, ylog: true, t: mid + gap, l: 52, xt: [1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8], fx: (v) => ({ 100: '100', 1000: '1,000', 10000: '10⁴', 100000: '10⁵', 1000000: '10⁶', 10000000: '10⁷', 100000000: '10⁸' })[v], yt: [1, 10, 100], xlabel: 'Years since the start (log scale)' });
    const ts = []; for (let l = 2; l <= 8.0001; l += 0.03) ts.push(10 ** l);
    const as = ts.map(aOfT), ae = aeq(), teq = tOfA(ae);
    // top: stacked shares
    ctx.save(); A.clip();
    const share = as.map((a) => { const r = Or() / a ** 4, m = Om / a ** 3; return (100 * r) / (r + m); });
    ctx.beginPath(); ctx.moveTo(A.X(ts[0]), A.Y(0));
    ts.forEach((t, i) => ctx.lineTo(A.X(t), A.Y(share[i])));
    ctx.lineTo(A.X(ts[ts.length - 1]), A.Y(0)); ctx.closePath(); ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.75; ctx.fill();
    ctx.beginPath(); ctx.moveTo(A.X(ts[0]), A.Y(100));
    ts.forEach((t, i) => ctx.lineTo(A.X(t), A.Y(share[i])));
    ctx.lineTo(A.X(ts[ts.length - 1]), A.Y(100)); ctx.closePath(); ctx.fillStyle = col.s[0]; ctx.fill(); ctx.globalAlpha = 1;
    line(ctx, [[A.X(teq), A.T], [A.X(teq), A.B]], col.ink, 1.3, [4, 3]);
    ctx.restore();
    text(ctx, 'radiation', A.X(150), A.Y(30), { color: '#fff', size: 12, weight: 700, fit: false });
    text(ctx, 'matter', A.R - 6, A.Y(70), { color: '#fff', size: 12, weight: 700, align: 'right', fit: false });
    text(ctx, 'share of energy', A.L + 2, A.T - 7, { color: col.ink, size: 11, weight: 600 });
    // bottom: growth of a clump
    ctx.save(); B.clip();
    line(ctx, as.map((a, i) => [B.X(ts[i]), B.Y(1 + 1.5 * (a / ae))]), col.s[1], 2.6);
    // what steady growth in step with a would have given
    line(ctx, as.map((a, i) => [B.X(ts[i]), B.Y(Math.max(0.5, a / as[0]))]), col.muted, 1.2, [3, 4]);
    line(ctx, [[B.X(teq), B.T], [B.X(teq), B.B]], col.ink, 1.3, [4, 3]);
    ctx.restore();
    text(ctx, 'growth of a dark matter clump', B.L + 2, B.T - 8, { color: col.ink, size: 11, weight: 600 });
    text(ctx, 'stalls while radiation rules', B.L + 6, B.Y(1.4) - 10, { color: col.s[1], size: 11, weight: 600, halo: col.panel });
    text(ctx, 'then grows with the universe', B.R - 4, B.Y(60) - 2, { color: col.s[1], size: 11, weight: 600, align: 'right', halo: col.panel });
    text(ctx, 'dashed: steady growth', B.R - 4, B.T + 10, { color: col.muted, size: 10.5, align: 'right', halo: col.panel });
    text(ctx, 'equality', B.X(teq) + 4, B.B - 10, { color: col.ink, size: 11, weight: 700, halo: col.panel });
  };
  show(); cv.redraw();
}
