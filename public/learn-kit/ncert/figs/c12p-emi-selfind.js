// Class 12 Electromagnetic Induction: self-inductance. When the switch closes, the rising current makes a changing flux in the coil itself, and an induced emf
// ε = −L dI/dt opposes the rise (Lenz's law): I(t) = (V/R)(1 − e^(−Rt/L)), time constant τ = L/R. The energy stored in the magnetic field is U = ½ L I².
import { canvas, text, title, row, slider, button, readout, line, dot, axes, loop } from '../../kit.js';
import { si } from '../c12p-mmlib.js';

export default function (host) {
  let L = 2, R = 10, t = 0, run = true;
  const V = 12;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Current growing in a coil and the back emf' });
  const ctl = row(host);
  slider(ctl, { label: 'Inductance L', min: 0.5, max: 5, step: 0.5, value: L, fmt: (x) => `${x} H`, oninput: (x) => { L = x; t = 0; } });
  slider(ctl, { label: 'Resistance R', min: 2, max: 20, step: 1, value: R, fmt: (x) => `${x} Ω`, oninput: (x) => { R = x; t = 0; } });
  button(ctl, 'Close the switch again', () => { t = 0; run = true; });
  const out = readout(host);
  loop(host, (dt) => { if (run) { t += dt * (L / R) * 0.8; if (t > 5 * (L / R)) t = 5 * (L / R); } cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'The coil opposes the change: I rises slowly', col), tau = L / R, I = (V / R) * (1 - Math.exp(-t / tau)), emf = V * Math.exp(-t / tau);
    const ht = h * 0.2, cy = top + (ht - top) / 2 + 8;
    line(ctx, [[20, cy], [60, cy]], col.ink, 2); line(ctx, [[60, cy - 10], [60, cy + 10]], col.ink, 3); line(ctx, [[66, cy - 5], [66, cy + 5]], col.ink, 3); line(ctx, [[66, cy], [100, cy]], col.ink, 2);
    ctx.save(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.beginPath(); for (let k = 0; k < 5; k++) ctx.ellipse(112 + k * 12, cy, 6, 12, 0, 0, 7); ctx.stroke(); ctx.restore();
    line(ctx, [[172, cy], [w - 40, cy]], col.ink, 2); ctx.strokeStyle = col.s[2]; ctx.strokeRect(w - 92, cy - 8, 36, 16);
    text(ctx, 'L', 140, cy - 22, { color: col.s[1], size: 12, weight: 700, align: 'center' }); text(ctx, 'R', w - 74, cy - 22, { color: col.s[2], size: 12, weight: 700, align: 'center' }); text(ctx, '12 V', 40, cy - 16, { color: col.muted, size: 10.5, align: 'center' });
    const g = axes(ctx, w, h, col, { x: [0, 5 * tau], y: [0, 1.05], t: ht + 12, b: 34, l: 48, r: 14, xt: [0, tau, 2 * tau, 3 * tau, 4 * tau, 5 * tau], fx: (v) => (v / tau).toFixed(0) + 'τ', yt: [0, 0.5, 1], fy: (v) => v, xlabel: 'time (units of τ = L/R)' });
    const curve = (fn, c) => { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 2.4; ctx.beginPath(); for (let k = 0; k <= 100; k++) { const x = (k / 100) * 5 * tau, X = g.X(x), Y = g.Y(fn(x)); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); ctx.restore(); };
    curve((x) => 1 - Math.exp(-x / tau), col.s[0]); curve((x) => Math.exp(-x / tau), col.s[1]);
    line(ctx, [[g.X(tau), g.Y(0.632)], [g.X(tau), g.B]], col.muted, 1, [3, 4]); text(ctx, '63%', g.X(tau) + 4, g.Y(0.632) - 8, { color: col.muted, size: 10.5 });
    dot(ctx, g.X(t), g.Y(1 - Math.exp(-t / tau)), 6, col.s[0], col.ink); dot(ctx, g.X(t), g.Y(Math.exp(-t / tau)), 6, col.s[1], col.ink);
    text(ctx, 'I / I max', g.R - 4, g.Y(0.9), { color: col.s[0], size: 10.5, weight: 700, align: 'right' }); text(ctx, 'back emf / V', g.R - 4, g.Y(0.2), { color: col.s[1], size: 10.5, weight: 700, align: 'right' });
    out.innerHTML = `τ = L/R = <b>${tau.toFixed(2)} s</b>. At this moment I = <b>${I.toFixed(2)} A</b> (final V/R = ${(V / R).toFixed(2)} A), the coil's back emf is <b>${emf.toFixed(1)} V</b> (it starts at the full 12 V, so the current starts at zero), and the stored energy ½LI² = <b>${(0.5 * L * I * I).toFixed(2)} J</b>.`;
  };
  cv.redraw();
}
