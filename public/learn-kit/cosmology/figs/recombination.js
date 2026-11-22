// 6.9 Recombination: the fog clears. Bottom: the fraction of hydrogen still ionised, x_e, against redshift.
// Dashed: the Saha equation (balance at each moment), which says half the atoms form at z ≈ 1,370 (3,700 K).
// Solid: Peebles's 1968 three-level atom (case-B recombination rate of Péquignot et al. 1991 with the usual
// 1.14 fudge factor, two-photon decay 8.22 s⁻¹ and Lyman-alpha escape), which lags behind Saha. Helium is left
// out (it recombined earlier). Shaded: where the CMB photons last scattered (visibility τ′e^−τ), peaking at
// z ≈ 1,090 (τ = 1), T ≈ 2,970 K. Top: a patch of the young universe; the fog's opacity is 1 − e^−τ, the chance
// a photon from there is scattered again before reaching us, and the photons' steps lengthen as the free
// electrons vanish. Model: PLANCK18 (phys.js), Ω_b h² = 0.0224, Y = 0.245.
import { canvas, axes, text, title, line, dot, row, slider, readout, loop, rng } from '../../kit.js';
import { E, criticalDensity, ageGyr, PLANCK18, T_CMB, K_B, M_E, H_PLANCK, EV, C, M_P, MPC, LY } from '../phys.js';

const HB = H_PLANCK / (2 * Math.PI), B = 13.6057 * EV, ST = 6.6524587e-29;
const NH0 = (0.0224 / 0.677 ** 2) * criticalDensity(67.7) / M_P * (1 - 0.245); // hydrogen nuclei per m³ today (0.19)
const Hz = (z) => (PLANCK18.H0 * 1000 / MPC) * E(z, PLANCK18);
const saha = (z) => { const T = T_CMB * (1 + z), S = Math.pow((M_E * K_B * T) / (2 * Math.PI * HB * HB), 1.5) * Math.exp(-B / (K_B * T)) / (NH0 * (1 + z) ** 3); return (-S + Math.sqrt(S * S + 4 * S)) / 2; };
const alphaB = (T) => { const t = T / 1e4; return 1.14 * 4.309e-19 * Math.pow(t, -0.6166) / (1 + 0.6703 * Math.pow(t, 0.53)); };
/** x_e and optical depth τ (from today back to z) on a grid of z from 2000 to 0. */
function history() {
  const rows = []; let z = 2000, x = saha(z); const dz = 0.5;
  while (z > 0) {
    const T = T_CMB * (1 + z), nH = NH0 * (1 + z) ** 3, H = Hz(z), a = alphaB(T);
    const th = Math.pow((M_E * K_B * T) / (2 * Math.PI * HB * HB), 1.5);
    const beta = a * th * Math.exp(-B / (4 * K_B * T));
    const lya = (8 * Math.PI * H) / ((121.567e-9) ** 3 * nH * Math.max(1e-12, 1 - x));
    const Cr = (8.2246 + lya) / (8.2246 + lya + beta);
    const dxdt = Cr * (beta * (1 - x) * Math.exp(-3 * B / (4 * K_B * T)) - nH * a * x * x);
    x = Math.min(x + dxdt * (dz / ((1 + z) * H)), 1);
    if (z > 1600) x = Math.min(x, saha(z));
    z -= dz;
    rows.push({ z, x, s: saha(z) });
  }
  rows.reverse(); // now from z = 0 upwards
  let tau = 0;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (!i) { r.tau = 0; r.g = 0; continue; }
    const dzz = r.z - rows[i - 1].z;
    const dtau = r.x * NH0 * (1 + r.z) ** 3 * ST * C * dzz / ((1 + r.z) * Hz(r.z));
    tau += dtau; r.tau = tau; r.g = (dtau / dzz) * Math.exp(-tau);
  }
  return rows;
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.95, max: 520, min: 400, label: 'A patch of the young universe whose fog clears as atoms form, above a plot of the fraction of free electrons against redshift' });
  const H = history();
  const gMax = Math.max(...H.map((r) => r.g));
  const at = (z) => H[Math.min(H.length - 1, Math.max(0, Math.round(z / 0.5)))];
  const Z0 = 1800, Z1 = 600;
  let z = 1300;
  const ctl = row(host);
  slider(ctl, { label: 'Redshift (cooling →)', min: 0, max: 1, value: (Z0 - z) / (Z0 - Z1), fmt: (u) => `z = ${Math.round(Z0 - u * (Z0 - Z1)).toLocaleString('en-CA')}`, oninput: (u) => { z = Z0 - u * (Z0 - Z1); show(); } });
  const out = readout(host);
  const show = () => {
    const r = at(z), T = T_CMB * (1 + z), yrs = ageGyr(z, PLANCK18) * 1e9, mfp = 1 / (r.x * NH0 * (1 + z) ** 3 * ST) / LY;
    out.innerHTML = `z = ${Math.round(z).toLocaleString('en-CA')} · <b>${Math.round(T).toLocaleString('en-CA')} K</b> · ${(+yrs.toPrecision(2)).toLocaleString('en-CA')} years after the start · free electrons: <b>${r.x >= 0.01 ? (100 * r.x).toFixed(r.x > 0.1 ? 0 : 1) + '%' : (100 * r.x).toFixed(3) + '%'}</b> of hydrogen · a photon goes about <b>${mfp > 1e6 ? (mfp / 1e6).toPrecision(2) + ' million' : (+mfp.toPrecision(2)).toLocaleString('en-CA')} light-years</b> between bounces · chance of reaching us without another bounce: <b>${(100 * Math.exp(-r.tau)).toFixed(0)}%</b>`;
  };
  // photons random-walking in the top box (box coordinates 0..1)
  const rnd = rng(3);
  const ph = Array.from({ length: 14 }, () => ({ x: rnd(), y: rnd(), a: rnd() * 6.28, left: 0, trail: [] }));
  const stepLen = () => { const tau = at(z).tau; return Math.min(5, 0.015 * Math.exp(1.4 / Math.max(tau, 0.05))); };
  loop(host, (dt) => {
    for (const p of ph) {
      let go = dt * 0.35;
      while (go > 0) {
        if (p.left <= 0) { p.a = rnd() * 6.283; p.left = stepLen(); p.trail.push([p.x, p.y]); }
        const d = Math.min(go, p.left);
        p.x += Math.cos(p.a) * d; p.y += Math.sin(p.a) * d; p.left -= d; go -= d;
      }
      if (p.trail.length > 30) p.trail.shift();
      if (p.x < -0.05 || p.x > 1.05 || p.y < -0.05 || p.y > 1.05) { p.x = rnd(); p.y = rnd(); p.trail = []; p.left = 0; }
    }
    cv.redraw();
  });
  const bg = Array.from({ length: 60 }, () => [rnd(), rnd(), 0.8 + rnd() * 1.6]);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Atoms form and the fog clears', col);
    const bx = 10, by = top + 6, bw = w - 20, bh = (h - top) * 0.36;
    const r = at(z), fog = 1 - Math.exp(-r.tau);
    // what lies beyond: visible only when the fog is thin
    ctx.save(); ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.clip();
    for (const [x, y, s] of bg) dot(ctx, bx + x * bw, by + y * bh, s, col.ink);
    ctx.globalAlpha = 0.25 + 0.72 * fog; ctx.fillStyle = col.s[3]; ctx.fillRect(bx, by, bw, bh); ctx.globalAlpha = 1;
    for (const p of ph) {
      const pts = [...p.trail, [p.x, p.y]].map(([x, y]) => [bx + x * bw, by + y * bh]);
      line(ctx, pts, col.s[7], 1.4);
      dot(ctx, bx + p.x * bw, by + p.y * bh, 2.6, col.s[7]);
    }
    ctx.restore();
    ctx.strokeStyle = col.line; ctx.strokeRect(bx, by, bw, bh);
    text(ctx, fog > 0.9 ? 'opaque: light zig-zags off free electrons' : fog > 0.2 ? 'clearing: the last bounces' : 'transparent: light flies straight', bx + bw / 2, by + bh + 12, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    // the plot
    const A = axes(ctx, w, h, col, { x: [Z0, Z1], y: [1e-4, 1.5], ylog: true, t: by + bh + 34, l: 52, xt: [1800, 1500, 1200, 900, 600], yt: [1e-4, 1e-3, 1e-2, 0.1, 1], fy: (v) => (v >= 0.01 ? 100 * v + '%' : (100 * v).toFixed(v < 1e-3 ? 2 : 1) + '%'), xlabel: 'Redshift z (cooling and later →)', ylabel: 'Free electrons' });
    ctx.save(); A.clip();
    // visibility: where the CMB last scattered
    ctx.beginPath(); ctx.moveTo(A.X(Z0), A.B);
    for (let zz = Z0; zz >= Z1; zz -= 5) ctx.lineTo(A.X(zz), A.B - (at(zz).g / gMax) * (A.B - A.T) * 0.45);
    ctx.lineTo(A.X(Z1), A.B); ctx.closePath(); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.22; ctx.fill(); ctx.globalAlpha = 1;
    const zs = []; for (let zz = Z0; zz >= Z1; zz -= 5) zs.push(zz);
    line(ctx, zs.filter((q) => at(q).s > 1e-5).map((q) => [A.X(q), A.Y(Math.max(1e-5, at(q).s))]), col.s[0], 1.6, [5, 4]);
    line(ctx, zs.map((q) => [A.X(q), A.Y(at(q).x)]), col.s[0], 2.6);
    line(ctx, [[A.X(z), A.T], [A.X(z), A.B]], col.ink, 1, [4, 3]);
    ctx.restore();
    dot(ctx, A.X(z), A.Y(r.x), 5.5, col.s[0], col.panel);
    text(ctx, 'dashed: Saha', A.X(1290), A.Y(2e-3), { color: col.s[0], size: 11, align: 'right', halo: col.panel });
    text(ctx, 'full calculation', A.X(1000), A.Y(0.12), { color: col.s[0], size: 11, weight: 700, halo: col.panel });
    text(ctx, 'last scattering, z ≈ 1,090', A.X(1090), A.B - 10, { color: col.s[1], size: 11, weight: 700, align: 'center', halo: col.panel });
  };
  show(); cv.redraw();
}
