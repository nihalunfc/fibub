// Why a reaction speeds up with heat and with a catalyst. Top: the spread of molecular energies (Maxwell-Boltzmann, log scale so
// the far tail is visible); the shaded part is the molecules with energy above the activation energy Ea. Bottom: the reaction
// path with Ea. Raise T and the tail grows; switch on a catalyst and Ea drops. k ∝ fraction above Ea ≈ e^(−Ea/RT).
import { canvas, axes, line, text, row, slider, choice, readout, title } from '../kit.js';

const R = 0.008314; // kJ/(mol K)
const dens = (E, T) => 2 * Math.sqrt(E / Math.PI) * Math.pow(R * T, -1.5) * Math.exp(-E / (R * T));
function above(Ea, T) { let s = 0; const dE = 0.1; for (let E = Ea + dE / 2; E < Ea + 40 * R * T + 30; E += dE) s += dens(E, T) * dE; return s; }
export default function (host) {
  let T = 300, Ea = 60, cat = false;
  const cv = canvas(host, { aspect: 1.05, max: 470, min: 350, label: 'Energy distribution of molecules with the activation energy marked, and a reaction energy path' });
  const c1 = row(host);
  slider(c1, { label: 'Temperature (K)', min: 250, max: 600, step: 5, value: T, oninput: (v) => { T = v; set(); } });
  slider(c1, { label: 'Activation energy Ea (kJ/mol)', min: 20, max: 120, step: 5, value: Ea, oninput: (v) => { Ea = v; set(); } });
  choice(row(host), 'Catalyst (lowers Ea by 30)', [[false, 'None'], [true, 'Add catalyst']], cat, (v) => { cat = v; set(); });
  const out = readout(host);
  const eff = () => Math.max(10, cat ? Ea - 30 : Ea);
  function set() {
    const f = above(eff(), T), f0 = above(Ea, 300), f10 = above(eff(), T + 10);
    out.innerHTML = `Ea = ${eff()} kJ/mol at ${T} K: fraction of molecules above Ea = <b>${f.toExponential(2)}</b> (e<sup>−Ea/RT</sup> = ${Math.exp(-eff() / (R * T)).toExponential(2)}). Compared with 300 K and no catalyst the rate is <b>×${(f / f0).toPrecision(3)}</b>. A 10 K rise from here multiplies the rate by <b>${(f10 / f).toFixed(2)}</b>${f10 / f > 1.7 && f10 / f < 2.6 ? ' (the familiar "doubling")' : ''}.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Energy tail and reaction path', col);
    const split = h * 0.56, ee = eff();
    const A = axes(ctx, w, split, col, { x: [0, 150], y: [1e-14, 1], ylog: true, xlabel: 'molecular energy E (kJ/mol)', ylabel: 'fraction per kJ/mol', t: 30, b: 34, l: 54, fx: (v) => v, fy: (v) => '1e' + Math.round(Math.log10(v)), yt: [1e-12, 1e-8, 1e-4, 1] });
    const pts = []; for (let E = 0.2; E <= 150; E += 1) pts.push([A.X(E), A.Y(Math.max(1e-14, dens(E, T)))]);
    ctx.save(); A.clip();
    ctx.beginPath(); let started = false; for (let E = ee; E <= 150; E += 1) { const p = [A.X(E), A.Y(Math.max(1e-14, dens(E, T)))]; if (!started) { ctx.moveTo(p[0], A.B); ctx.lineTo(p[0], p[1]); started = true; } else ctx.lineTo(p[0], p[1]); }
    ctx.lineTo(A.X(150), A.B); ctx.closePath(); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1;
    line(ctx, pts, col.s[0], 2.5); ctx.restore();
    ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(A.X(ee), A.T); ctx.lineTo(A.X(ee), A.B); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, `Ea = ${ee}`, A.X(ee) + 4, A.T + 8, { color: col.s[1], size: 11, weight: 700 });
    // reaction path
    const y0 = split + 8, y1 = h - 20, x0 = 36, x1 = w - 12, base = y1 - 20, Ey = (e) => base - (e / 150) * (base - y0 - 8);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
    text(ctx, 'path →', x1, y1 + 10, { color: col.muted, size: 10, align: 'right' }); text(ctx, 'E', 14, y0 + 6, { color: col.muted, size: 10 });
    const path = (peak, c, lw, dash) => { ctx.save(); if (dash) ctx.setLineDash([5, 4]); ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath(); for (let k = 0; k <= 60; k++) { const u = k / 60, X = x0 + 10 + u * (x1 - x0 - 20), g = Math.exp(-(((u - 0.45) / 0.17) ** 2)), e = peak * g - 25 * u; k ? ctx.lineTo(X, Ey(Math.max(0, e + 25 * u) - 25 * u + 25)) : ctx.moveTo(X, Ey(e + 25)); } ctx.stroke(); ctx.restore(); };
    if (cat) path(Ea, col.muted, 1.5, true);
    path(ee, col.s[0], 2.8, false);
    const tx = x0 + 10 + 0.45 * (x1 - x0 - 20); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(tx - 28, Ey(25)); ctx.lineTo(tx - 28, Ey(ee + 25 - 10)); ctx.stroke();
    text(ctx, 'Ea', tx - 24, (Ey(25) + Ey(ee + 15)) / 2, { color: col.s[1], size: 11, weight: 700 });
    if (cat) text(ctx, 'dashed: without catalyst', x1, y0 + 6, { color: col.muted, size: 10, align: 'right' });
  };
  set();
}
