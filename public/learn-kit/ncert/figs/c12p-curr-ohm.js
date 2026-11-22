// Class 12 Current Electricity: V-I characteristics. An ohmic conductor (50 ohm resistor) gives a straight line through the origin (constant R = V/I).
// A lamp filament heats up, its resistance rises, and the line bends toward the voltage axis. A diode conducts almost nothing until its knee (about 0.6 V) and then rises steeply.
// The dot shows the chosen voltage; the readout gives R = V/I there (the chord, "static") and the slope dV/dI ("dynamic").
import { canvas, text, axes, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let kind = 'ohm', V = 4;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 290, label: 'Current against voltage for an ohmic resistor, a lamp filament and a diode' });
  const ctl = row(host), ro = readout(host);
  const D = {
    ohm: { name: 'Ohmic resistor, 50 Ω', vmax: 10, imax: 220, I: (v) => v / 50 * 1000 },
    lamp: { name: 'Lamp filament', vmax: 10, imax: 380, I: (v) => { let lo = 0, hi = 1; for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; (20 * mid + 100 * mid ** 3 < v ? (lo = mid) : (hi = mid)); } return lo * 1000; } },
    diode: { name: 'Silicon diode', vmax: 0.8, imax: 600, I: (v) => 1e-6 * (Math.exp(v / 0.06) - 1) * 1000 },
  };
  let sl;
  choice(ctl, 'Component', [['ohm', 'Resistor'], ['lamp', 'Lamp'], ['diode', 'Diode']], kind, (v) => { kind = v; V = D[kind].vmax * 0.5; sl.set(V); go(); });
  sl = slider(ctl, { label: 'voltage V', min: 0.05, max: 10, step: 0.05, value: V, fmt: (v) => (+Math.min(v, D[kind].vmax)).toFixed(2) + ' V', oninput: (v) => { V = Math.min(v, D[kind].vmax); go(); } });
  const go = () => { const d = D[kind], v = Math.min(V, d.vmax), I = d.I(v), dI = d.I(v + 1e-4), r = I > 1e-9 ? v / (I / 1000) : Infinity, dyn = 1e-4 / ((dI - I) / 1000); ro.textContent = `${d.name}: at ${v.toFixed(2)} V the current is ${I.toFixed(1)} mA.  V/I = ${r.toFixed(0)} Ω;  slope dV/dI = ${dyn.toFixed(0)} Ω.  ${kind === 'ohm' ? 'Both are the same: Ohm’s law holds.' : 'They differ: not ohmic.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const d = D[kind], A = axes(ctx, w, h, col, { x: [0, d.vmax], y: [0, d.imax], xlabel: 'voltage V (V)', ylabel: 'current I (mA)', l: 50, t: 24 });
    const pts = []; for (let i = 0; i <= 120; i++) { const v = d.vmax * i / 120; pts.push([A.X(v), A.Y(d.I(v))]); }
    ctx.save(); A.clip(); line(ctx, pts, col.s[0], 3);
    const v = Math.min(V, d.vmax), I = d.I(v); line(ctx, [[A.X(0), A.Y(0)], [A.X(v), A.Y(I)]], col.s[3], 1.5, [5, 3]); ctx.restore();
    dot(ctx, A.X(v), A.Y(I), 6, col.s[3], col.panel);
    text(ctx, d.name, A.L + 8, A.T + 8, { color: col.ink, size: 12, weight: 700 });
  };
  go();
}
