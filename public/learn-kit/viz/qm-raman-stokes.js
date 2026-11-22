// Raman scattering as a two-photon story. A laser photon lifts the molecule to a short-lived "virtual" level; the molecule then
// drops back. Back to where it began: Rayleigh (same colour). To v = 1: Stokes (photon loses one vibrational quantum). From v = 1 to
// v = 0: anti-Stokes (photon gains one). Pick the molecule, laser and temperature; the anti-Stokes line fades as it gets colder.
import { canvas, axes, line, text, title, row, slider, choice, readout, loop, ease, arrow, calm } from '../kit.js';

const MOL = { ccl4: ['CCl₄ (459)', 459], co2: ['CO₂ (1388)', 1388], n2: ['N₂ (2331)', 2331], ch: ['C–H stretch (2900)', 2900] };
const LAS = { 532: ['532 nm', 532], 633: ['633 nm', 633], 785: ['785 nm', 785] };
export default function (host) {
  const cv = canvas(host, { aspect: 1.05, max: 500, min: 400, label: 'Raman scattering energy levels with Rayleigh, Stokes and anti-Stokes processes and the spectrum' });
  let mol = 'n2', las = 532, T = 300, proc = 1, t = 0, auto = true;
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  choice(ctl, 'Vibration (cm⁻¹)', Object.keys(MOL).map((k) => [k, MOL[k][0]]), mol, (v) => { mol = v; show(); });
  choice(ctl, 'Laser', Object.keys(LAS).map((k) => [+k, LAS[k][0]]), las, (v) => { las = v; show(); });
  choice(ctl2, 'Process', [[0, 'Rayleigh'], [1, 'Stokes'], [2, 'Anti-Stokes']], proc, (v) => { proc = v; t = 0; show(); });
  slider(ctl2, { label: 'Temperature', min: 100, max: 1000, step: 10, value: T, fmt: (v) => v + ' K', oninput: (v) => { T = v; show(); } });
  const anim = loop(host, (dt) => { t = (t + dt * 0.45) % 1; cv.redraw(); });
  anim.button(ctl2);
  const nuv = () => MOL[mol][1], nu0 = () => 1e7 / las;
  const ratio = () => ((nu0() + nuv()) / (nu0() - nuv())) ** 4 * Math.exp(-(1.4388 * nuv()) / T);
  function show() {
    const lS = 1e7 / (nu0() - nuv()), lA = 1e7 / (nu0() + nuv());
    out.innerHTML = `Laser ${las} nm (${nu0().toFixed(0)} cm⁻¹). Stokes line at <b>${lS.toFixed(1)} nm</b> (shift −${nuv()} cm⁻¹), anti-Stokes at <b>${lA.toFixed(1)} nm</b> (+${nuv()}). Intensity ratio anti-Stokes/Stokes = [(ν₀+νᵥ)/(ν₀−νᵥ)]⁴ e^(−hcνᵥ/kT) = <b>${ratio().toExponential(2)}</b> at ${T} K: only molecules already in v = 1 can give anti-Stokes, so it dims with cooling (a Raman thermometer). Raman needs the polarizability to change during the vibration.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Raman: virtual level and the three outcomes', col);
    const x0 = 30, x1 = w * 0.55, hh = Math.round(h * 0.5), Y = (e) => 36 + hh - e * (hh - 20), ev = Math.min(0.28, nuv() / 5200 + 0.05), E0 = 0.0, EV = 0.95;
    line(ctx, [[x0, Y(0)], [x1, Y(0)]], col.ink, 2.4); line(ctx, [[x0, Y(ev)], [x1, Y(ev)]], col.ink, 2.4); text(ctx, 'v = 0', x0, Y(0) + 11, { color: col.muted, size: 10 }); text(ctx, 'v = 1', x0, Y(ev) - 8, { color: col.muted, size: 10 });
    ctx.setLineDash([5, 4]); line(ctx, [[x0, Y(EV)], [x1, Y(EV)]], col.muted, 1.5); ctx.setLineDash([]); text(ctx, 'virtual level', x1 + 4, Y(EV), { color: col.muted, size: 10 });
    const f = t < 0.5 ? ease(t / 0.5) : 1, g = t < 0.5 ? 0 : ease((t - 0.5) / 0.5);
    const sx = [x0 + 60, x0 + 120, x0 + 120], ex = [x0 + 60, x0 + 150, x0 + 150];
    const startE = proc === 2 ? ev : 0, endE = proc === 0 ? 0 : proc === 1 ? ev : 0, xs = (x0 + x1) / 2 - 20, xe = xs + 50;
    arrow(ctx, xs, Y(startE), xs, Y(startE + (EV - startE) * f), col.s[1], 3, 9); text(ctx, 'laser', xs - 6, Y(0.5), { color: col.s[1], size: 10.5, weight: 700, align: 'right' });
    if (g > 0) arrow(ctx, xe, Y(EV), xe, Y(EV + (endE - EV) * g), proc === 0 ? col.s[1] : proc === 1 ? col.s[3] : col.s[2], 3, 9);
    text(ctx, proc === 0 ? 'same colour' : proc === 1 ? 'redder (Stokes)' : 'bluer (anti-Stokes)', xe + 8, Y((EV + endE) / 2), { color: proc === 1 ? col.s[3] : col.s[2], size: 10.5, weight: 700, fit: false });
    ctx.beginPath(); ctx.arc(t < 0.5 ? xs : xe, Y(t < 0.5 ? startE + (EV - startE) * f : EV + (endE - EV) * g), 6, 0, 7); ctx.fillStyle = col.bad; ctx.fill();
    // spectrum
    const a = axes(ctx, w, h, col, { x: [-3500, 3500], y: [0, 1.15], l: 20, r: 12, t: hh + 66, b: 36, yt: [], xt: [-3000, 0, 3000], xlabel: 'shift from the laser line (cm⁻¹): left redder, right bluer', fx: (v) => (v === 0 ? 'laser' : v) });
    const S = nuv(), bar = (x, hgt, c, lab, clip) => { line(ctx, [[a.X(x), a.B], [a.X(x), a.Y(Math.min(1.05, hgt))]], c, 4); if (lab) text(ctx, lab, a.X(x), a.Y(Math.min(1.05, hgt)) - 8, { color: c, size: 10, align: 'center', weight: 700 }); };
    bar(0, 1.05, col.s[1], 'Rayleigh (×1000)'); bar(-S, 0.5, col.s[3], 'Stokes'); const r = ratio(); bar(S, 0.5 * Math.max(r, 0.0), col.s[2], 'anti-S');
      };
  show();
  return { step(i) { proc = Math.max(0, Math.min(2, i)); t = 0; show(); } };
}
