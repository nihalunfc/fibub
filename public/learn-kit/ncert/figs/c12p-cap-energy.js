// Class 12 Electrostatic Potential and Capacitance: energy stored in a capacitor. Charging moves charge q across, one tiny dq at a time; when q is already on the plates
// each dq costs work V dq = (q/C) dq. Adding these up is the area of the triangle under the V-q line: U = 1/2 Q V = 1/2 C V^2 = Q^2/(2C). C = 2 uF, final V = 10 V.
import { canvas, text, axes, line, dot, row, slider, button, readout, loop } from '../../kit.js';

export default function (host) {
  let f = 0.5, run = false, sl;
  const C = 2e-6, Vm = 10, Qm = C * Vm;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Graph of voltage against charge for a charging capacitor with the energy as the area under the line' });
  const ctl = row(host), ro = readout(host);
  sl = slider(ctl, { label: 'charge moved so far, q / Q', min: 0, max: 1, step: 0.01, value: f, fmt: (v) => (v * 100).toFixed(0) + '%', oninput: (v) => { f = v; run = false; go(); } });
  button(ctl, 'Charge it up', () => { f = 0; run = true; });
  loop(host, (dt) => { if (!run) return; f = Math.min(1, f + dt * 0.35); sl.set(f); if (f >= 1) run = false; go(); });
  const go = () => { const q = f * Qm, V = q / C; ro.textContent = `q = ${(q * 1e6).toFixed(1)} µC,  V = q/C = ${V.toFixed(1)} V,  energy so far = ½qV = ${(0.5 * q * V * 1e6).toFixed(1)} µJ  (= ½CV² = q²/2C).  At the end: ½QV = ${(0.5 * Qm * Vm * 1e6).toFixed(0)} µJ.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [0, 20], y: [0, 12], xlabel: 'charge q on the plate (µC)', ylabel: 'voltage V (V)', xt: [0, 5, 10, 15, 20], yt: [0, 5, 10], l: 50, t: 22 });
    line(ctx, [[A.X(0), A.Y(0)], [A.X(20), A.Y(10)]], col.s[0], 3);
    const q = f * 20, V = q / 2; ctx.save(); ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.moveTo(A.X(0), A.Y(0)); ctx.lineTo(A.X(q), A.Y(V)); ctx.lineTo(A.X(q), A.Y(0)); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.strokeStyle = col.s[3]; ctx.beginPath(); ctx.moveTo(A.X(q), A.Y(V)); ctx.lineTo(A.X(q), A.Y(0)); ctx.stroke();
    dot(ctx, A.X(q), A.Y(V), 6, col.s[3], col.panel);
    text(ctx, 'V = q/C', A.X(14), A.Y(7.6), { color: col.s[0], size: 12, weight: 700 });
    text(ctx, 'shaded area = work done = energy', A.R - 4, A.B - 12, { color: col.s[3], size: 11, weight: 700, align: 'right' });
  };
  go();
}
