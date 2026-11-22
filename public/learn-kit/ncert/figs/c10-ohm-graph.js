// Class 10 Electricity: Ohm's law on a V–I graph. Pick a resistor (or a filament bulb), move the voltage slider and
// a reading is added to the graph. A resistor's readings fall on a straight line through the origin whose slope
// is R = V/I; a bulb's line bends because its filament heats up and its resistance grows.
import { canvas, axes, line, dot, text, title, row, slider, readout, button, choice } from '../../kit.js';

export default function (host) {
  let kind = 'r', R = 4, V = 3, pts = [];
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 300, label: 'Voltage against current graph with readings for a resistor or a bulb' });
  const ctl = row(host);
  choice(ctl, 'Part', [['r', 'Resistor'], ['bulb', 'Bulb filament']], kind, (v) => { kind = v; pts = []; add(); });
  const rs = slider(ctl, { label: 'Resistor R', min: 2, max: 10, step: 1, value: R, fmt: (v) => `${v} Ω`, oninput: (v) => { R = v; pts = []; add(); } });
  slider(ctl, { label: 'Voltage V', min: 0.5, max: 6, step: 0.5, value: V, fmt: (v) => `${v} V`, oninput: (v) => { V = v; add(); } });
  button(ctl, 'Clear readings', () => { pts = []; add(); });
  const out = readout(host);
  // bulb: resistance rises with current (hot filament): R_b = 2 + 1.6·V (made-up but realistic shape)
  const I = (v) => (kind === 'r' ? v / R : v / (2 + 1.6 * v));
  function add() {
    if (V > 0 && !pts.some((p) => p[0] === V)) pts.push([V, I(V)]);
    pts.sort((a, b) => a[0] - b[0]);
    const i = I(V);
    out.innerHTML = `V = ${V} V, I = ${i.toFixed(3)} A, so V/I = <b>${(V / i).toFixed(2)} Ω</b>` + (kind === 'r' ? '. Same value at every reading: the resistance is constant, so V ∝ I (Ohm’s law).' : '. The ratio grows as the voltage grows: the hot filament resists more, so the graph bends.');
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, kind === 'r' ? 'A resistor: a straight line through the origin' : 'A bulb filament: the line bends', col) + 6;
    const ax = axes(ctx, w, h, col, { x: [0, 2.5], y: [0, 6.5], t: top + 4, xlabel: 'current I (A)', ylabel: 'voltage V (V)' });
    const P = (v, i) => [ax.X(i), ax.Y(v)];
    const curve = []; for (let k = 0; k <= 60; k++) { const v = (6.5 * k) / 60, i = I(v); if (i <= 2.5) curve.push(P(v, i)); }
    line(ctx, curve, col.s[kind === 'r' ? 0 : 1], 2, [5, 4]);
    for (const [v, i] of pts) dot(ctx, ...P(v, i), 5, col.s[kind === 'r' ? 0 : 1]);
    const [x, y] = P(V, I(V)); dot(ctx, x, y, 7, col.panel, col.ink);
    if (kind === 'r') text(ctx, `slope = V/I = R = ${R} Ω`, ax.X(Math.min(2.4, 6 / R) * 0.55), ax.Y(Math.min(6.2, 6)) , { color: col.s[0], size: 12, weight: 700, halo: col.panel });
  };
  add();
}
