// Class 12 Biology, Organisms and Populations: tolerance ranges. A eurythermal species (many temperatures) and a stenothermal species (a narrow range)
// have performance curves of different widths; the same idea gives euryhaline and stenohaline (salinity). A slider moves the environment and shows who thrives.
import { canvas, axes, line, dot, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let x = 20, f = 'temp';
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 280, label: 'Performance curves for a wide-tolerance species and a narrow-tolerance species against an environmental factor' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Factor', [['temp', 'Temperature'], ['salt', 'Salinity']], 'temp', (v) => { f = v; x = v === 'temp' ? 20 : 15; sl.set(x); go(); });
  const sl = slider(ctl, { label: 'level', min: 0, max: 50, step: 1, value: 20, fmt: (v) => v.toFixed(0) + (f === 'temp' ? ' °C' : ' ‰'), oninput: (v) => { x = v; go(); } });
  const wide = (v) => Math.max(0, 1 - Math.pow((v - 25) / 25, 2)), narrow = (v) => Math.max(0, 1 - Math.pow((v - 30) / 7, 2));
  const verdict = (p) => (p > 0.7 ? 'thrives' : p > 0.3 ? 'under stress' : p > 0 ? 'barely survives' : 'cannot live here');
  const go = () => { ro.textContent = `At ${x}${f === 'temp' ? ' °C' : ' ‰'}: the ${f === 'temp' ? 'eurythermal' : 'euryhaline'} species ${verdict(wide(x))}; the ${f === 'temp' ? 'stenothermal' : 'stenohaline'} species ${verdict(narrow(x))}. A species with a wide range (euryhaline fish like hilsa) can live in many habitats; narrow ones (many reef corals) are easily harmed by change.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Wide and narrow tolerance', col);
    const a = axes(ctx, w, h, col, { x: [0, 50], y: [0, 1.1], xlabel: f === 'temp' ? 'temperature (°C)' : 'salinity (parts per thousand)', ylabel: 'how well it lives', l: 46, t: 36, yt: [0, 0.5, 1], fy: (v) => (v === 1 ? 'best' : v === 0 ? 'none' : '') });
    const W = [], Nn = []; for (let v = 0; v <= 50; v += 0.5) { W.push([a.X(v), a.Y(wide(v))]); Nn.push([a.X(v), a.Y(narrow(v))]); }
    line(ctx, W, col.s[0], 2.5); line(ctx, Nn, col.s[2], 2.5);
    text(ctx, f === 'temp' ? 'eury-thermal' : 'eury-haline', a.X(14), a.Y(0.8) - 4, { color: col.s[0], size: 11, weight: 700, align: 'center' }); text(ctx, f === 'temp' ? 'steno-thermal' : 'steno-haline', a.X(39), a.Y(0.9) - 4, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    line(ctx, [[a.X(x), a.T], [a.X(x), a.B]], col.ink, 1.5); dot(ctx, a.X(x), a.Y(wide(x)), 5, col.s[0], col.panel); dot(ctx, a.X(x), a.Y(narrow(x)), 5, col.s[2], col.panel);
  };
  go();
}
