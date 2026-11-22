// 8.1 Nuclear density. The Fermi (Woods-Saxon) shape rho(r) = rho0 / (1 + exp((r - R)/a)) with R = 1.07 A^(1/3) fm and
// a = 0.54 fm, normalised so that it holds A nucleons. Light grey curves: 16O, 40Ca, 208Pb for reference. The central
// density barely changes with A (saturation), the half-density radius grows as A^(1/3) and the skin stays the same.
import { canvas, row, slider, readout, axes, line, text, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 460, min: 260, label: 'Nuclear density against radius for a chosen mass number' });
  let A = 120, dif = 0.54;
  const ctl = row(host), out = readout(host);
  const re = () => { cv.redraw(); show(); };
  slider(ctl, { label: 'Mass number A', min: 4, max: 250, step: 1, value: A, fmt: (v) => String(v), oninput: (v) => { A = v; re(); } });
  slider(ctl, { label: 'Diffuseness a (fm)', min: 0.1, max: 0.9, step: 0.01, value: dif, fmt: (v) => fmt(v, 2), oninput: (v) => { dif = v; re(); } });
  const shape = (r, R, a) => 1 / (1 + Math.exp((r - R) / a));
  // rho0 from the normalisation 4 pi integral rho r^2 dr = A, and the mean square radius
  const solve = (A, a) => {
    const R = 1.07 * Math.cbrt(A); let n = 0, m2 = 0; const h = 0.01;
    for (let r = h / 2; r < R + 14 * a; r += h) { const f = shape(r, R, a) * r * r * h; n += f; m2 += f * r * r; }
    return { R, rho0: A / (4 * Math.PI * n), rms: Math.sqrt(m2 / n) };
  };
  const show = () => {
    const s = solve(A, dif);
    out.innerHTML = `R = 1.07 A<sup>1/3</sup> = ${fmt(s.R, 3)} fm; central density ρ₀ = ${fmt(s.rho0, 3)} nucleons/fm³; rms radius = ${fmt(s.rms, 3)} fm (a sharp sphere of radius R would give ${fmt(Math.sqrt(0.6) * s.R, 3)} fm); skin thickness t = 4.39a = ${fmt(4.39 * dif, 3)} fm.`;
  };
  cv.draw = (ctx, W, H, col) => {
    const ax = axes(ctx, W, H, col, { x: [0, 10], y: [0, 0.2], xlabel: 'r (fm)', ylabel: 'ρ (nucleons per fm³)', t: 14 });
    for (const [a0, lab] of [[16, '¹⁶O'], [40, '⁴⁰Ca'], [208, '²⁰⁸Pb']]) {
      const s = solve(a0, 0.54), pts = [];
      for (let r = 0; r <= 10; r += 0.05) pts.push([ax.X(r), ax.Y(s.rho0 * shape(r, s.R, 0.54))]);
      line(ctx, pts, col.line, 1.5, [4, 3]);
      text(ctx, lab, ax.X(s.R) + 4, ax.Y(s.rho0 * 0.5) - 8, { color: col.muted, size: 10.5, halo: col.panel });
    }
    const s = solve(A, dif), pts = [];
    for (let r = 0; r <= 10; r += 0.03) pts.push([ax.X(r), ax.Y(s.rho0 * shape(r, s.R, dif))]);
    line(ctx, pts, col.s[0], 2.6);
    // half-density radius and the 90%-10% skin
    const r90 = s.R - dif * Math.log(9), r10 = s.R + dif * Math.log(9);
    line(ctx, [[ax.X(s.R), ax.Y(0)], [ax.X(s.R), ax.Y(s.rho0 / 2)]], col.s[2], 1.5, [3, 3]);
    ctx.save(); ctx.globalAlpha = 0.13; ctx.fillStyle = col.s[3];
    ctx.fillRect(ax.X(Math.max(0, r90)), ax.T, ax.X(Math.min(10, r10)) - ax.X(Math.max(0, r90)), ax.B - ax.T); ctx.restore();
    text(ctx, 'R', ax.X(s.R) + 4, ax.Y(0.012), { color: col.s[2], size: 11, weight: 700, halo: col.panel });
    text(ctx, 'skin', ax.X(Math.min(9.4, r10)) - 26, ax.T + 10, { color: col.muted, size: 10.5, halo: col.panel });
  };
  re();
}
