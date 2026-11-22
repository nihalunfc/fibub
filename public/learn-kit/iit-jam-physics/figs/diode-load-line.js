// 7.4 Diode I-V curve and load line. A source V_s drives a diode through a resistor R. The straight load line
// I = (V_s − V)/R meets the diode's exponential curve at the operating point Q, worked out exactly by iteration.
// Pick a silicon, germanium or red LED diode and compare Q with the simple constant-drop model.
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt, title } from '../../kit.js';

const VT = 0.02585;
const DIODES = {
  si: { name: 'Silicon', Is: 1e-14, n: 1, drop: 0.7 },
  ge: { name: 'Germanium', Is: 1e-9, n: 1, drop: 0.3 },
  led: { name: 'Red LED', Is: 1e-20, n: 2, drop: 1.8 },
};
/** Operating point (V, I) of source Vs, resistor R and diode d. */
export function qPoint(Vs, R, d) {
  let V = Math.min(d.drop, Vs);
  for (let i = 0; i < 300; i++) { const I = Math.max((Vs - V) / R, 1e-30); V = Math.min(Vs, d.n * VT * Math.log(I / d.Is + 1)); }
  return [V, (Vs - V) / R];
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 420, min: 280, label: 'Diode current against voltage with the load line of the resistor and the operating point' });
  let key = 'si', Vs = 3, R = 200;
  const ctl = row(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'Diode', Object.entries(DIODES).map(([k, v]) => [k, v.name]), key, (k) => { key = k; re(); });
  slider(ctl, { label: 'Source V_s (V)', min: 0.5, max: 6, step: 0.1, value: Vs, fmt: (v) => fmt(v, 3), oninput: (v) => { Vs = v; re(); } });
  slider(ctl, { label: 'Resistor R (Ω)', min: 50, max: 2000, step: 10, value: R, fmt: (v) => fmt(v, 4), oninput: (v) => { R = v; re(); } });
  const out = readout(host);
  const show = () => {
    const d = DIODES[key], [V, I] = qPoint(Vs, R, d), simple = Math.max(0, (Vs - d.drop) / R);
    out.innerHTML = `Q point: V<sub>D</sub> = <b>${fmt(V, 3)} V</b>, I = <b>${fmt(I * 1000, 3)} mA</b>. Constant-drop model (${d.drop} V): I = ${fmt(simple * 1000, 3)} mA. Dynamic resistance at Q: r<sub>d</sub> = ηV<sub>T</sub>/I = ${fmt(d.n * VT / I, 3)} Ω. Load line ends: (0 V, ${fmt(Vs / R * 1000, 3)} mA) and (${fmt(Vs, 3)} V, 0).`;
  };
  cv.draw = (ctx, W, H, col) => {
    const d = DIODES[key], Imax = Vs / R * 1.15 * 1000, [V, I] = qPoint(Vs, R, d);
    title(ctx, `${d.name} diode with load line`, col);
    const ax = axes(ctx, W, H, col, { x: [-0.5, Math.max(Vs, d.drop + 0.4)], y: [-0.05 * Imax, Imax], t: 40, xlabel: 'diode voltage V (V)', ylabel: 'current I (mA)' });
    ctx.save(); ax.clip();
    const pts = [];
    const vmax = Math.max(Vs, d.drop + 0.4);
    for (let v = -0.5; v <= vmax; v += vmax / 600) pts.push([ax.X(v), ax.Y(Math.min(d.Is * (Math.exp(v / (d.n * VT)) - 1) * 1000, Imax * 2))]);
    line(ctx, pts, col.s[0], 2.5);
    line(ctx, [[ax.X(0), ax.Y(Vs / R * 1000)], [ax.X(Vs), ax.Y(0)]], col.s[2], 2);
    line(ctx, [[ax.X(V), ax.Y(0)], [ax.X(V), ax.Y(I * 1000)], [ax.X(-0.5), ax.Y(I * 1000)]], col.muted, 1, [3, 3]);
    ctx.restore();
    dot(ctx, ax.X(V), ax.Y(I * 1000), 6, col.s[3], col.ink);
    text(ctx, 'Q', ax.X(V) + 9, ax.Y(I * 1000) - 9, { color: col.ink, size: 12, weight: 700, halo: col.panel });
    text(ctx, 'load line', ax.X(Vs * 0.7), ax.Y(Vs * 0.3 / R * 1000) - 12, { color: col.s[2], size: 11, halo: col.panel });
  };
  re();
}
