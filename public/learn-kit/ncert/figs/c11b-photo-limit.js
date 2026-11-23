// Class 11 Biology, Photosynthesis: Blackman's law of limiting factors. The rate of photosynthesis is set by whichever of light, CO2 or temperature is scarcest;
// raising a factor that is not limiting changes nothing, raising the limiting one raises the rate until another factor takes over.
import { canvas, text, title, axes, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let L = 30, C = 50, T = 28;
  const fL = (l) => Math.min(1, 1.25 * l / (l + 28)), fC = (c) => Math.min(1, 1.2 * c / (c + 22)), fT = (t) => Math.min(1, 1.05 / (1 + Math.exp(-(t - 14) / 4)) / (1 + Math.exp((t - 38) / 2.2)));
  const rate = (l, c, t) => 100 * Math.min(fL(l), fC(c), fT(t));
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Rate of photosynthesis against light intensity for chosen carbon dioxide and temperature, showing the limiting factor' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Light', min: 0, max: 100, step: 1, value: L, fmt: (v) => Math.round(v) + ' %', oninput: (v) => { L = v; go(); } });
  slider(ctl, { label: 'CO₂', min: 0, max: 100, step: 1, value: C, fmt: (v) => Math.round(v * 8) + ' ppm', oninput: (v) => { C = v; go(); } });
  slider(ctl, { label: 'Temperature', min: 5, max: 45, step: 1, value: T, fmt: (v) => Math.round(v) + ' °C', oninput: (v) => { T = v; go(); } });
  const lim = () => { const a = [['light', fL(L)], ['CO₂', fC(C)], ['temperature', fT(T)]].sort((x, y) => x[1] - y[1]); return a[0][0]; };
  const go = () => {
    ro.textContent = `Rate = ${rate(L, C, T).toFixed(0)} % of the best possible. The limiting factor is ${lim()}: changing the other two will not help until this one is raised. (Rates here are on a made-up 0-100 scale to show the idea.)`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `Limiting factor now: ${lim()}`, col);
    const A = axes(ctx, w, h, col, { x: [0, 100], y: [0, 100], xlabel: 'light intensity (% of full sun)', ylabel: 'rate (%)', l: 48, t: t0 + 10, b: 44, xt: [0, 25, 50, 75, 100], yt: [0, 50, 100] });
    const cur = (c, t) => { const p = []; for (let l = 0; l <= 100; l += 2) p.push([A.X(l), A.Y(rate(l, c, t))]); return p; };
    line(ctx, cur(100, 30), col.muted, 2, [5, 4]); text(ctx, 'plenty of CO₂, 30 °C', A.R - 4, A.Y(rate(100, 100, 30)) - 12, { color: col.muted, size: 10, align: 'right' });
    line(ctx, cur(C, T), col.s[1], 3);
    dot(ctx, A.X(L), A.Y(rate(L, C, T)), 6, col.s[3], col.bg);
  };
  go();
}
