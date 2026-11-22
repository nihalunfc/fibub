// Class 12 Current Electricity: how resistance changes with temperature. Metals: R rises roughly linearly (R = R20 [1 + alpha (T - 20)], alpha about 0.004 per degC for copper)
// because hotter ions vibrate more and collide more often (tau falls). Alloys such as constantan/manganin have tiny alpha (used in standard resistors).
// Semiconductors (a thermistor, NTC): more carriers are freed as T rises, so R falls steeply, R = R20 exp[B(1/T - 1/T20)], B = 3000 K here.
import { canvas, text, axes, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let T = 100;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Resistance against temperature for a metal, an alloy and a semiconductor' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'temperature T (°C)', min: 0, max: 200, step: 5, value: T, fmt: (v) => v.toFixed(0) + ' °C', oninput: (v) => { T = v; go(); } });
  const F = { metal: (t) => 1 + 0.004 * (t - 20), alloy: (t) => 1 + 0.00001 * (t - 20), semi: (t) => Math.exp(3000 * (1 / (t + 273.15) - 1 / 293.15)) };
  const go = () => { ro.textContent = `At ${T} °C (relative to 20 °C): copper ${F.metal(T).toFixed(2)} ×,  constantan ${F.alloy(T).toFixed(3)} ×,  thermistor ${F.semi(T).toFixed(2)} ×.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [0, 200], y: [0, 3], xlabel: 'temperature (°C)', ylabel: 'R / R at 20 °C', l: 46, t: 24, xt: [0, 50, 100, 150, 200] });
    const draw = (f, c) => { const p = []; for (let i = 0; i <= 100; i++) { const t = i * 2; p.push([A.X(t), A.Y(Math.min(3, f(t)))]); } line(ctx, p, c, 3); dot(ctx, A.X(T), A.Y(Math.min(3, f(T))), 5, c, col.panel); };
    ctx.save(); A.clip(); draw(F.metal, col.s[0]); draw(F.alloy, col.s[1]); draw(F.semi, col.s[3]); ctx.restore();
    ctx.strokeStyle = col.line; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(A.X(T), A.T); ctx.lineTo(A.X(T), A.B); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'metal (copper): rises', A.L + 8, A.Y(2.7), { color: col.s[0], size: 11.5, weight: 700 }); text(ctx, 'semiconductor: falls', A.R - 6, A.Y(2.15), { color: col.s[3], size: 11.5, weight: 700, align: 'right' }); text(ctx, 'alloy: almost flat', A.R - 6, A.Y(1.2), { color: col.s[1], size: 11.5, weight: 700, align: 'right' });
  };
  go();
}
