// Landau levels: a 2D electron gas in a magnetic field has only the levels E = (n + ½)ħω_c, each holding eB/h electrons per
// area. As B rises, levels move apart and the Fermi level jumps down from level to level, which makes the resistance oscillate
// (Shubnikov–de Haas) and the Hall resistance flat at h/νe². Drag the density and watch ν = n_s h/eB; GaAs, m* = 0.067 mₑ.
import { canvas, axes, line, text, title, row, slider, choice, readout, dot } from '../kit.js';

const HW = 1.728, GE = 2.418; // ħω_c per tesla (meV, GaAs); eB/h per tesla in 10^10 cm^-2
export default function (host) {
  const cv = canvas(host, { aspect: 1.15, max: 520, min: 420, label: 'Landau level fan, Fermi energy and Hall resistance plateaus against magnetic field' });
  let ns = 4, B = 4, spin = false;
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  slider(ctl, { label: 'Electron density', min: 1, max: 8, step: 0.1, value: ns, fmt: (v) => v.toFixed(1) + '×10¹¹ cm⁻²', oninput: (v) => { ns = v; show(); } });
  slider(ctl, { label: 'Field B', min: 0.5, max: 12, step: 0.05, value: B, fmt: (v) => v.toFixed(2) + ' T', oninput: (v) => { B = v; show(); } });
  choice(ctl2, 'Spin split', [[false, 'Off (levels hold 2)'], [true, 'On (exaggerated)']], spin, (v) => { spin = v; show(); });
  const nu = (b) => (ns * 10) / (GE * b), g = () => (spin ? 1 : 2);
  const level = (k, b) => { const n = Math.floor(k / (spin ? 2 : 1)), s = spin ? (k % 2 ? 1 : -1) * 0.2 : 0; return (n + 0.5 + s) * HW * b; };
  const EF = (b) => { const k = Math.min(60, Math.floor(nu(b) / (spin ? 1 : 2) - 1e-9 + (spin ? 0 : 0))); const kk = Math.ceil(nu(b) / (spin ? 1 : 2) - 1e-9) - 1; return level(Math.max(0, kk), b); };
  function show() {
    const v = nu(B), full = Math.floor(v / (spin ? 1 : 2) + 1e-9);
    out.innerHTML = `Each level holds eB/h = ${(GE * B / 10).toFixed(2)}×10¹¹ per cm² (${spin ? '1' : '2'} spin state${spin ? '' : 's'}). Filling factor ν = n_s h/(eB) = <b>${v.toFixed(2)}</b>. ħω_c = ${(HW * B).toFixed(1)} meV. ${Math.abs(v - Math.round(v)) < 0.06 && (spin || Math.round(v) % 2 === 0) ? 'Integer filling: a gap above the Fermi level, so ρ_xx dips to zero and ρ_xy = h/(' + Math.round(v) + 'e²) = ' + (25812.8 / Math.round(v)).toFixed(0) + ' Ω on a plateau.' : 'Fermi level inside a partly filled level: electrons can scatter, so ρ_xx is large.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Landau levels in a 2D electron gas', col);
    const top = 34, h1 = Math.round(h * 0.52), a = axes(ctx, w, h1 + top, col, { x: [0, 12], y: [0, 24 * 1.728 * 0.9 + 25], l: 44, t: top, b: 26, xt: [0, 4, 8, 12], yt: [], ylabel: 'energy (meV)', xlabel: '' });
    const ymax = 24 * 1.728 * 0.9 + 25, nlev = spin ? 14 : 8;
    for (let k = 0; k < nlev; k++) line(ctx, [[a.X(0), a.Y(level(k, 0))], [a.X(12), a.Y(level(k, 12))]], col.line, 1.4);
    // filled portion: draw Fermi energy sawtooth
    const pts = []; for (let b = 0.5; b <= 12.001; b += 0.04) pts.push([a.X(b), a.Y(Math.min(ymax, EF(b)))]);
    line(ctx, pts, col.s[1], 2);
    // current B marker with level dots
    line(ctx, [[a.X(B), a.T], [a.X(B), a.B]], col.ink, 1, [3, 4]);
    const nfill = nu(B); for (let k = 0; k < nlev; k++) { if (level(k, B) > ymax - 4) continue; const f = Math.max(0, Math.min(1, nfill / (spin ? 1 : 2) - k)); dot(ctx, a.X(B), a.Y(level(k, B)), 4.5, f > 0.99 ? col.s[0] : f > 0.01 ? col.s[2] : col.bg, col.s[0]); }
    text(ctx, 'Fermi energy', a.X(0.6), a.T + 8, { color: col.s[1], size: 10.5, weight: 700 }); text(ctx, 'Landau levels', a.X(11.8), a.Y(level(1, 11.8)) - 9, { color: col.muted, size: 10, align: 'right' });
    // resistance panel
    const b2 = axes(ctx, w, h, col, { x: [0, 12], y: [0, 3.2], l: 44, t: h1 + top + 14, b: 38, xlabel: 'magnetic field B (T)', ylabel: 'ρ_xy (h/e² units)', xt: [0, 4, 8, 12], yt: [0, 1, 2, 3], fy: (v) => v });
    // rho_xy plateau curve: smoothed step against 1/nu
    const rxy = (b) => { const v = nu(b), st = spin ? 1 : 2, n = v / st; const k = Math.round(n); const d = Math.abs(n - k); const tr = Math.min(1, Math.max(0, (d - 0.12) / 0.26)); const lo = 1 / (Math.max(1, Math.floor(n)) * st), hi = 1 / (Math.max(1, Math.floor(n) + 1) * st); const f = n - Math.floor(n); const t = f < 0.2 ? 0 : f > 0.8 ? 1 : (f - 0.2) / 0.6; const s = t * t * (3 - 2 * t); return (n < 1 ? 1 / Math.max(nu(b), 0.0001) : lo + (hi - lo) * s); };
    const cl = (v) => Math.min(3.1, v); const p1 = []; for (let b = 0.5; b <= 12.001; b += 0.05) p1.push([b2.X(b), b2.Y(cl(rxy(b)))]);
    line(ctx, p1, col.s[0], 2);
    line(ctx, Array.from({ length: 50 }, (_, i) => { const b = 0.5 + i * 0.25; return [b2.X(b), b2.Y(Math.min(3.1, 1 / nu(b)))]; }), col.muted, 1.2, [4, 4]);
    const rxx = (b) => { const n = nu(b) / (spin ? 1 : 2), f = n - Math.floor(n); return 0.35 * Math.exp(-Math.pow((f - 0.5) / 0.2, 2) * 0.5 * 0) * (1 - Math.cos(2 * Math.PI * n)) / 2 * 1; };
    line(ctx, Array.from({ length: 220 }, (_, i) => { const b = 0.5 + i * 0.0523; return [b2.X(b), b2.Y(0.1 + 1.2 * rxx(b) * Math.min(1, b / 2))]; }), col.s[3], 1.6);
    dot(ctx, b2.X(B), b2.Y(Math.min(3.1, rxy(B))), 5, col.s[1]);
    text(ctx, 'ρ_xy (steps)', b2.L + 6, b2.T + 8, { color: col.s[0], size: 10.5, weight: 700 }); text(ctx, 'ρ_xx (oscillates)', b2.L + 6, b2.T + 22, { color: col.s[3], size: 10.5, weight: 700 }); text(ctx, 'dashed = classical 1/ν line', b2.R - 4, b2.T + 8, { color: col.muted, size: 10, align: 'right' });
  };
  show();
}
