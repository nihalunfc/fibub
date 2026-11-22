// Semiconductor electronics: output of a diode rectifier on 50 Hz AC (peak 10 V, ideal diodes). Half-wave keeps one
// half of each cycle; full-wave flips the other half up; a smoothing capacitor holds the voltage up between peaks,
// leaving a small ripple that shrinks as RC grows.
import { canvas, axes, line, row, choice, slider, readout, fmt } from '../../kit.js';

const Vm = 10, f = 50;
export default function (host) {
  let mode = 'full', RC = 40; // ms
  const cv = canvas(host, { aspect: 0.55, max: 330, min: 230, label: 'Input and output voltage of a diode rectifier' });
  const ctl = row(host);
  choice(ctl, 'Circuit', [['half', 'Half-wave'], ['full', 'Full-wave'], ['cap', 'Full-wave + capacitor']], mode, (v) => { mode = v; upd(); });
  slider(ctl, { label: 'RC (capacitor × load)', min: 5, max: 200, step: 5, value: RC, fmt: (v) => `${v} ms`, oninput: (v) => { RC = v; upd(); } });
  const out = readout(host);
  const vin = (t) => Vm * Math.sin(2 * Math.PI * f * t);
  const rect = (t) => (mode === 'half' ? Math.max(0, vin(t)) : Math.abs(vin(t)));
  const series = () => {
    const pts = [], dt = 0.0001; let vc = 0;
    for (let t = 0; t <= 0.06; t += dt) {
      if (mode !== 'cap') { pts.push([t, rect(t)]); continue; }
      const vr = rect(t); vc = vr > vc ? vr : vc * Math.exp(-dt / (RC / 1000)); pts.push([t, vc]);
    }
    return pts;
  };
  const upd = () => {
    cv.redraw();
    const p = series().filter(([t]) => t > 0.02), vs = p.map((q) => q[1]), avg = vs.reduce((a, b) => a + b, 0) / vs.length, rip = Math.max(...vs) - Math.min(...vs);
    out.innerHTML = mode === 'half' ? `Half-wave: output only in alternate halves, ripple frequency 50 Hz, average (DC) value V<sub>m</sub>/π ≈ <b>${fmt(avg, 3)} V</b>.`
      : mode === 'full' ? `Full-wave: both halves used, ripple frequency 100 Hz, average 2V<sub>m</sub>/π ≈ <b>${fmt(avg, 3)} V</b>.`
      : `With a capacitor: DC ≈ <b>${fmt(avg, 3)} V</b>, ripple ≈ ${fmt(rip, 2)} V peak to peak (estimate V<sub>m</sub>/(2fRC) = ${fmt(Vm / (2 * f * RC / 1000), 2)} V). Larger RC, smoother output.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const { X, Y } = axes(ctx, w, h, col, { x: [0, 60], y: [-11, 11], xlabel: 't (ms)', ylabel: 'voltage (V)', t: 22 });
    const inp = []; for (let t = 0; t <= 0.06; t += 0.0002) inp.push([X(t * 1000), Y(vin(t))]);
    line(ctx, inp, col.muted, 1.5, [5, 4]);
    line(ctx, series().map(([t, v]) => [X(t * 1000), Y(v)]), col.s[0], 2.5);
    line(ctx, [[X(0), Y(0)], [X(60), Y(0)]], col.line, 1);
  };
  upd();
}
