// 9.4 The integer quantum Hall effect. Top: Landau levels ħωc(n + 1/2) (spin-resolved, drawn equally spaced) fanning
// out with B, and the Fermi level of a 2D gas of fixed density, which jumps down whenever a level empties. Bottom: the
// Hall resistance in units of h/e² (plateaus at 1/ν) with the classical line B/ne dashed, and the longitudinal
// resistance, which vanishes on the plateaus. Disorder sets the fraction of extended states and so the plateau width.
import { canvas, row, slider, readout, axes, line, dot, text, fmt } from '../../kit.js';

const H = 6.62607015e-34, E = 1.602176634e-19;

export default function (host) {
  const cv = canvas(host, { aspect: 0.95, max: 560, min: 380, label: 'Landau levels and quantum Hall plateaus against magnetic field' });
  let n = 3.0, w = 0.12, B = 6;
  const ctl = row(host), out = readout(host);
  const re = () => { cv.redraw(); show(); };
  slider(ctl, { label: 'Electron density (10¹⁵ m⁻²)', min: 1, max: 6, step: 0.1, value: n, fmt: (v) => fmt(v, 2), oninput: (v) => { n = v; re(); } });
  slider(ctl, { label: 'Extended-state width (disorder)', min: 0.03, max: 0.4, step: 0.01, value: w, fmt: (v) => fmt(v, 2), oninput: (v) => { w = v; re(); } });
  slider(ctl, { label: 'Field B (T)', min: 0.5, max: 14, step: 0.05, value: B, fmt: (v) => fmt(v, 3), oninput: (v) => { B = v; re(); } });
  const nu = (b) => n * 1e15 * H / (E * b);
  // conductivities in units of e²/h: steps of sxy when the Fermi level crosses the extended states at mid-level
  const sig = (b) => { const v = Math.max(1.0001, nu(b)), N = Math.floor(v), f = v - N, z = (f - 0.5) / (w / 4), S = 1 / (1 + Math.exp(-z)); return [0.5 * 4 * S * (1 - S), N + S]; };
  const rho = (b) => { const [xx, xy] = sig(b), D = xx * xx + xy * xy; return [xx / D, xy / D]; };
  const show = () => {
    const v = nu(B), [rxx, rxy] = rho(B);
    out.innerHTML = `B = ${fmt(B, 3)} T: filling factor ν = ${fmt(v, 3)}. Hall resistance ${fmt(rxy, 4)} h/e² = ${fmt(rxy * 25812.807, 5)} Ω; ρxx = ${fmt(rxx, 2)} h/e². ${rxx < 0.01 ? `On the ν = ${Math.round(1 / rxy)} plateau: the Fermi level sits in localised states.` : 'Between plateaus: the Fermi level crosses extended states, so current dissipates.'}`;
  };
  cv.draw = (ctx, W, H2, col) => {
    const top = H2 * 0.42;
    // Landau fan: energies in units of ħωc at 1 T (so level n at field b has energy (n + 1/2) b)
    ctx.save();
    const a1 = axes(ctx, W, top, col, { x: [0, 14], y: [0, 14], xlabel: '', ylabel: 'E (ħωc at 1 T)', t: 22, b: 18, grid: false, fx: () => '' });
    ctx.save(); a1.clip();
    for (let k = 0; k < 30; k++) line(ctx, [[a1.X(0), a1.Y(0)], [a1.X(14), a1.Y((k + 0.5) * 14)]], col.line, 1.2);
    // Fermi level: with spin-resolved levels each holding eB/h, E_F = (floor(ν) + 1/2) b inside the partly filled level
    const ef = []; for (let b = 0.3; b <= 14; b += 0.02) { const v = nu(b); ef.push([a1.X(b), a1.Y((Math.floor(v) + 0.5) * b)]); }
    line(ctx, ef, col.s[3], 2.2);
    ctx.restore();
    text(ctx, 'Landau levels and the Fermi level (fixed density)', 10, 12, { color: col.ink, size: 12, weight: 700 });
    line(ctx, [[a1.X(B), a1.T], [a1.X(B), a1.B]], col.muted, 1, [3, 3]);
    ctx.restore();
    ctx.save(); ctx.translate(0, top);
    const a2 = axes(ctx, W, H2 - top, col, { x: [0, 14], y: [0, 1.1], xlabel: 'Magnetic field B (T)', ylabel: 'ρ (h/e²)', t: 14 });
    ctx.save(); a2.clip();
    const pxy = [], pxx = [], cl = [];
    for (let b = 0.2; b <= 14; b += 0.01) { const [xx, xy] = rho(b); pxy.push([a2.X(b), a2.Y(xy)]); pxx.push([a2.X(b), a2.Y(Math.min(1.1, xx))]); cl.push([a2.X(b), a2.Y(1 / nu(b))]); }
    line(ctx, cl, col.muted, 1.2, [5, 4]);
    line(ctx, pxx, col.s[2], 1.8);
    line(ctx, pxy, col.s[0], 2.6);
    ctx.restore();
    for (let k = 1; k <= 8; k++) { const bk = n * 1e15 * H / (E * k); if (bk > 0.8 && bk < 13.5 && 1 / k > 0.12) text(ctx, `ν=${k}`, a2.X(bk), a2.Y(1 / k) - 9, { color: col.s[0], size: 10.5, align: 'center', halo: col.panel }); }
    const [rxx, rxy] = rho(B);
    dot(ctx, a2.X(B), a2.Y(rxy), 4.5, col.ink, col.panel);
    if (rxx < 1.1) dot(ctx, a2.X(B), a2.Y(rxx), 3.5, col.s[2], col.panel);
    text(ctx, 'ρxy (Hall)', a2.L + 8, a2.T + 8, { color: col.s[0], size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'ρxx', a2.L + 8, a2.T + 24, { color: col.s[2], size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'dashed: classical B/ne', a2.L + 8, a2.T + 40, { color: col.muted, size: 11, halo: col.panel });
    ctx.restore();
  };
  re();
}
