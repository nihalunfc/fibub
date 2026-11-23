// Class 11 Thermal Properties of Matter: Newton's law of cooling. The rate of loss of heat is proportional to the excess temperature over the surroundings: dT/dt = -k (T - Ts), so T(t) = Ts + (T0 - Ts) exp(-k t).
// The log plot of (T - Ts) against t is a straight line of slope -k. Valid for small excess temperature (forced convection), good enough for a cup of tea. Tea starts at 90 degC.
import { canvas, text, title, axes, line, dot, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let Ts = 25, k = 0.04, mode = 'T', t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A cup of tea cooling towards room temperature with a graph of temperature against time' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Graph', [['T', 'temperature'], ['ln', 'ln of excess']], mode, (v) => { mode = v; go(); });
  slider(ctl, { label: 'room temperature (°C)', min: 5, max: 40, step: 1, value: Ts, fmt: (v) => v + ' °C', oninput: (v) => { Ts = v; go(); } });
  slider(ctl, { label: 'cooling constant k (per min)', min: 0.01, max: 0.1, step: 0.005, value: k, fmt: (v) => v.toFixed(3), oninput: (v) => { k = v; go(); } });
  const T0 = 90, Tt = (x) => Ts + (T0 - Ts) * Math.exp(-k * x);
  const go = () => { const tt = Math.log((T0 - Ts) / (60 - Ts)) / k; ro.textContent = `T = Ts + (T₀ − Ts)e^(−kt). The tea reaches a drinkable 60 °C after ${tt.toFixed(1)} min and never goes below the room temperature (${Ts} °C). Hotter rooms, thicker mugs (smaller k): slower cooling.`; cv.redraw(); };
  loop(host, (dt) => { t = (t + dt * 8) % 120; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'T' ? 'Cooling curve: T against time' : 'ln(T − Ts) is a straight line', col);
    if (mode === 'T') {
      const A = axes(ctx, w, h, col, { x: [0, 120], y: [0, 100], xlabel: 'time (minutes)', ylabel: 'temperature (°C)', l: 44, t: top + 8, xt: [0, 30, 60, 90, 120] }), p = []; for (let x = 0; x <= 120; x += 2) p.push([A.X(x), A.Y(Tt(x))]);
      line(ctx, [[A.L, A.Y(Ts)], [A.R, A.Y(Ts)]], col.s[0], 1.5, [5, 4]); text(ctx, 'room ' + Ts + ' °C', A.R - 4, A.Y(Ts) - 9, { color: col.s[0], size: 10.5, weight: 700, align: 'right' }); line(ctx, p, col.s[1], 3); dot(ctx, A.X(t), A.Y(Tt(t)), 5.5, col.s[3], col.panel); text(ctx, Tt(t).toFixed(0) + ' °C', A.X(t) + 8, A.Y(Tt(t)) - 10, { color: col.s[3], size: 11, weight: 700 });
    } else {
      const A = axes(ctx, w, h, col, { x: [0, 120], y: [0, 5], xlabel: 'time (minutes)', ylabel: 'ln (T − Ts)', l: 44, t: top + 8, xt: [0, 30, 60, 90, 120], yt: [0, 1, 2, 3, 4, 5] }), f = (x) => Math.log(Math.max(1e-6, Tt(x) - Ts));
      line(ctx, [[A.X(0), A.Y(f(0))], [A.X(120), A.Y(f(120))]], col.s[1], 3); dot(ctx, A.X(t), A.Y(f(t)), 5.5, col.s[3], col.panel); text(ctx, 'slope = −k = ' + (-k).toFixed(3), A.X(60), A.Y(f(60)) - 14, { color: col.s[1], size: 11.5, weight: 700, align: 'center' });
    }
  };
  go();
}
