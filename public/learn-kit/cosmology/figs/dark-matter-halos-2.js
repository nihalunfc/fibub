// 10.3 The NFW profile (Navarro, Frenk and White 1996, 1997): the shape simulated dark matter halos of every mass
// share. ρ(r) = ρ_s / [(r/r_s)(1 + r/r_s)²], falling as r⁻¹ near the middle and r⁻³ far out. The halo edge r200
// encloses a mean density 200 times the critical density; the concentration is c = r200 / r_s.
// Mass inside r: M(<r) = M200 f(r/r_s) / f(c), f(x) = ln(1 + x) − x/(1 + x). Circular speed v = √(G M(<r)/r),
// which peaks at r ≈ 2.163 r_s. Critical density for H0 = 67.7 km/s/Mpc.
import { canvas, axes, text, title, line, dot, row, slider, readout, fmt } from '../../kit.js';
import { criticalDensity, MPC, M_SUN } from '../phys.js';

const RHOC = criticalDensity(67.7) * MPC ** 3 / M_SUN / 1e9; // solar masses per kpc³
const GK = 4.30091e-6; // G in kpc (km/s)² per solar mass
const f = (x) => Math.log(1 + x) - x / (1 + x);
export const r200of = (M) => Math.cbrt((3 * M) / (4 * Math.PI * 200 * RHOC)); // kpc

export default function (host) {
  const cv = canvas(host, { aspect: 1.05, max: 520, min: 400, label: 'Density and orbital speed against distance from the centre of a dark matter halo, NFW profile' });
  let M = 1e12, c = 10;
  const ctl = row(host);
  slider(ctl, { label: 'Halo mass (M200)', min: 1e9, max: 1e15, log: true, value: M, fmt: (v) => fmt(v, 2) + ' suns', oninput: (v) => { M = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Concentration, c', min: 3, max: 25, step: 0.5, value: c, fmt: (v) => v.toFixed(1), oninput: (v) => { c = v; cv.redraw(); show(); } });
  const out = readout(host);
  const geo = () => { const r2 = r200of(M), rs = r2 / c, v2 = Math.sqrt(GK * M / r2); return { r2, rs, v2, vmax: v2 * Math.sqrt((c / 2.163) * f(2.163) / f(c)) }; };
  const show = () => {
    const g = geo();
    out.innerHTML = `Edge r<sub>200</sub> = <b>${fmt(g.r2, 3)} kpc</b>; scale radius r<sub>s</sub> = <b>${fmt(g.rs, 2)} kpc</b>; fastest orbit <b>${fmt(g.vmax, 3)} km/s</b> at ${fmt(2.163 * g.rs, 2)} kpc. ${M > 3e14 ? 'A galaxy cluster.' : M > 3e11 && M < 3e12 ? 'About the Milky Way\'s halo.' : M < 3e10 ? 'A dwarf galaxy\'s halo.' : ''}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const g = geo(), dc = (200 / 3) * c ** 3 / f(c);
    const rho = (r) => { const x = r / g.rs; return dc / (x * (1 + x) ** 2); };
    const top = title(ctx, 'One shape for every halo', col) + 2;
    const mid = Math.round(h * 0.52);
    const xr = [g.r2 * 0.004, g.r2 * 1.5];
    const A = axes(ctx, w, mid + 30, col, { x: xr, y: [3, 3e7], xlog: true, ylog: true, t: top + 8, b: 30, ylabel: 'Density ÷ critical', yt: [10, 1e3, 1e5, 1e7], fy: (v) => '10' + String(Math.round(Math.log10(v))).replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]) });
    const pts = []; for (let i = 0; i <= 160; i++) { const r = xr[0] * (xr[1] / xr[0]) ** (i / 160); pts.push([A.X(r), A.Y(rho(r))]); }
    ctx.save(); A.clip(); line(ctx, pts, col.s[0], 3); ctx.restore();
    line(ctx, [[A.X(g.rs), A.T], [A.X(g.rs), A.B]], col.s[3], 1, [3, 3]);
    text(ctx, 'r_s', A.X(g.rs) + 4, A.B - 10, { color: col.s[3], size: 11, weight: 700, halo: col.panel });
    line(ctx, [[A.X(g.r2), A.T], [A.X(g.r2), A.B]], col.muted, 1, [3, 3]);
    text(ctx, 'r200', A.X(g.r2) - 4, A.B - 10, { color: col.muted, size: 11, weight: 700, align: 'right', halo: col.panel });
    text(ctx, 'slope −1', A.X(xr[0] * 1.5), A.Y(rho(xr[0] * 1.5)) + 14, { color: col.s[0], size: 11, weight: 600, halo: col.panel });
    text(ctx, 'slope −3', A.X(g.r2 * 0.55), A.Y(rho(g.r2 * 0.55)) - 14, { color: col.s[0], size: 11, weight: 600, align: 'center', halo: col.panel });
    // circular speed
    const vmaxAxis = Math.max(20, g.vmax * 1.25);
    const B = axes(ctx, w, h, col, { x: [0, g.r2 * 1.5], y: [0, vmaxAxis], t: mid + 44, xlabel: 'Distance from the centre (kpc)', ylabel: 'Orbit speed (km/s)' });
    const vp = []; for (let i = 1; i <= 160; i++) { const r = (i / 160) * g.r2 * 1.5; vp.push([B.X(r), B.Y(g.v2 * Math.sqrt(f(r / g.rs) / f(c) * g.r2 / r))]); }
    line(ctx, vp, col.s[1], 3);
    dot(ctx, B.X(2.163 * g.rs), B.Y(g.vmax), 4.5, col.s[1], col.panel);
    text(ctx, 'peak at 2.16 r_s', B.X(2.163 * g.rs) + 8, B.Y(g.vmax * 0.62), { color: col.s[1], size: 11, weight: 600, halo: col.panel });
    text(ctx, 'kpc', A.R, A.B + 18, { color: col.muted, size: 10.5, align: 'right' });
  };
  cv.redraw(); show();
}
