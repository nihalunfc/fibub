// Why fusion needs millions of degrees yet still happens: nuclei must climb the Coulomb barrier (hundreds of keV) but typical thermal
// energies are only keV. The few that fuse are the ones in the "Gamow window", where the thinning Maxwell tail (e^(−E/kT)) and the
// rising tunnelling chance (e^(−√(E_G/E))) multiply to a peak at E₀ = (E_G (kT)² / 4)^(1/3). Pick a reaction and slide the temperature.
import { canvas, axes, line, text, title, row, slider, choice, readout, dot } from '../kit.js';

const RX = { dt: ['D + T', 1, 1, 2, 3], dd: ['D + D', 1, 1, 2, 2], pp: ['p + p', 1, 1, 1, 1], cc: ['¹²C + ¹²C', 6, 6, 12, 12] };
export default function (host) {
  const cv = canvas(host, { aspect: 1.1, max: 500, min: 400, label: 'Coulomb barrier with tunnelling and the Gamow peak against energy' });
  let rx = 'dt', kT = 10;
  const ctl = row(host), out = readout(host);
  choice(ctl, 'Reaction', Object.keys(RX).map((k) => [k, RX[k][0]]), rx, (v) => { rx = v; show(); });
  slider(ctl, { label: 'Temperature kT', min: 0.5, max: 200, value: kT, log: true, fmt: (v) => v.toFixed(1) + ' keV', oninput: (v) => { kT = v; show(); } });
  const P = () => { const [, z1, z2, a1, a2] = RX[rx], mu = (a1 * a2) / (a1 + a2) * 931.494e3, EG = 2 * mu * (Math.PI * z1 * z2 / 137.036) ** 2, R = 1.2 * (Math.cbrt(a1) + Math.cbrt(a2)), VB = 1.44 * z1 * z2 / R * 1000; return { z1z2: z1 * z2, EG, R, VB, E0: Math.cbrt(EG * kT * kT / 4) }; };
  function show() {
    const p = P(), K = kT / 8.617e-2 * 1e3; // kT keV -> T in MK: kT=0.08617 keV per MK
    out.innerHTML = `Barrier height at contact (R = ${p.R.toFixed(1)} fm): <b>${(p.VB).toFixed(0)} keV</b>. Thermal energy kT = ${kT.toFixed(1)} keV (T ≈ <b>${(kT / 0.08617).toFixed(0)} million K</b>), ${(p.VB / kT).toFixed(0)}× too low to climb it. Most fusions happen near E₀ = <b>${p.E0.toFixed(1)} keV</b> (Gamow energy E_G = ${(p.EG).toFixed(0)} keV). The Sun's core is ~1.3 keV, a fusion experiment ~10–20 keV.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Climbing and tunnelling the Coulomb barrier', col);
    const p = P(), top = 34, H1 = Math.round(h * 0.5);
    // top: potential
    const a1 = axes(ctx, w, H1, col, { x: [0, 60], y: [-0.25, 1.35], l: 44, t: top, b: 34, xlabel: 'separation r (fm)', ylabel: 'V / barrier top', yt: [0, 1], xt: [0, 20, 40, 60] });
    line(ctx, [[a1.X(1), a1.Y(-0.2)], [a1.X(p.R), a1.Y(-0.2)], [a1.X(p.R), a1.Y(1)], ...Array.from({ length: 150 }, (_, i) => { const r = p.R + (i + 1) * 0.4; return [a1.X(Math.min(r, 60)), a1.Y(p.R / Math.min(r, 60))]; })], col.ink, 2);
    const e = kT / p.VB, rt = p.R / Math.max(e, 1e-4); // classical turning point for energy e (in barrier units)
    line(ctx, [[a1.L, a1.Y(Math.min(e, 1.3))], [a1.R, a1.Y(Math.min(e, 1.3))]], col.s[1], 1.5, [5, 4]);
    text(ctx, `thermal kT = ${(e * 100).toFixed(1)}% of the top`, a1.L + 6, a1.Y(Math.min(e, 1.3)) - 8, { color: col.s[1], size: 10, weight: 600 });
    const P0 = a1.X(Math.min(rt, 60));
    if (rt > p.R && rt < 60) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.fillRect(a1.X(p.R), a1.Y(1.1), P0 - a1.X(p.R), a1.Y(0) - a1.Y(1.1)); ctx.globalAlpha = 1; text(ctx, 'tunnel', (a1.X(p.R) + P0) / 2, a1.Y(0.55), { color: col.s[0], size: 10, align: 'center', weight: 600 }); }
    // bottom: Gamow peak
    const Em = Math.max(5 * p.E0, 6 * kT), a2 = axes(ctx, w, h, col, { x: [0, Em], y: [0, 1.15], l: 44, t: H1 + 10, b: 38, xlabel: 'energy E (keV)', yt: [], fx: (v) => (v >= 100 ? Math.round(v) : +v.toFixed(1)) });
    const F = { m: (E) => Math.exp(-E / kT), t: (E) => Math.exp(-Math.sqrt(p.EG / Math.max(E, 1e-9))), g: (E) => Math.exp(-E / kT - Math.sqrt(p.EG / Math.max(E, 1e-9))) };
    const curve = (f, norm) => { let mx = 0; const v = []; for (let i = 1; i <= 240; i++) { const E = (i / 240) * Em, y = f(E); v.push([E, y]); mx = Math.max(mx, y); } return v.map(([E, y]) => [a2.X(E), a2.Y(norm ? y / mx : y)]); };
    line(ctx, curve(F.m, false), col.s[0], 1.6, [5, 3]); line(ctx, curve(F.t, true), col.s[2], 1.6, [2, 3]); line(ctx, curve(F.g, true), col.s[1], 2.6);
    line(ctx, [[a2.X(p.E0), a2.B], [a2.X(p.E0), a2.Y(1.05)]], col.ink, 1, [3, 3]); text(ctx, 'E₀', a2.X(p.E0) + 10, a2.Y(1.08), { color: col.ink, size: 10.5, align: 'center', weight: 700 });
    text(ctx, 'Maxwell tail', a2.R - 4, a2.T + 6, { color: col.s[0], size: 10, align: 'right' }); text(ctx, 'tunnelling (scaled)', a2.R - 4, a2.T + 20, { color: col.s[2], size: 10, align: 'right' }); text(ctx, 'product = Gamow peak', a2.R - 4, a2.T + 34, { color: col.s[1], size: 10, weight: 700, align: 'right' });
  };
  show();
}
