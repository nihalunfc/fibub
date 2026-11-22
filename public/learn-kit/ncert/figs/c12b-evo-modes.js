// Class 12 Evolution: three kinds of natural selection acting on a trait such as beak size. Each generation the number of each type is multiplied by its fitness and a little
// new variation (mutation and recombination) is mixed in. Directional selection shifts the mean, stabilising selection narrows the spread, disruptive selection splits it in two.
import { canvas, text, title, axes, line, row, button, choice, readout, loop } from '../../kit.js';

export default function (host) {
  const NB = 31;
  let kind = 'dir', gen = 0, d, acc = 0;
  const fit = (kd, x) => (kd === 'dir' ? 0.35 + 0.65 * x : kd === 'stab' ? 0.15 + 0.85 * Math.exp(-((x - 0.5) ** 2) / 0.03) : 0.2 + 0.8 * (1 - Math.exp(-((x - 0.5) ** 2) / 0.04)));
  const init = () => { d = Array.from({ length: NB }, (_, i) => Math.exp(-((i / (NB - 1) - 0.5) ** 2) / 0.04)); const s = d.reduce((a, b) => a + b, 0); d = d.map((v) => v / s); gen = 0; };
  const next = () => { d = d.map((v, i) => v * fit(kind, i / (NB - 1))); let s = d.reduce((a, b) => a + b, 0); d = d.map((v) => v / s); d = d.map((v, i) => 0.9 * v + 0.05 * ((d[i - 1] ?? v) + (d[i + 1] ?? v))); s = d.reduce((a, b) => a + b, 0); d = d.map((v) => v / s); gen++; };
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A histogram of a trait in a population changing over generations under directional, stabilising or disruptive selection' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Selection', [['dir', 'Directional'], ['stab', 'Stabilising'], ['dis', 'Disruptive']], kind, (v) => { kind = v; init(); go(); });
  const anim = loop(host, (dt) => { acc += dt; if (acc > 0.35 && gen < 60) { acc = 0; next(); go(); } });
  anim.button(ctl); button(ctl, 'Restart', () => { init(); go(); });
  const go = () => {
    const mean = d.reduce((a, v, i) => a + v * i / (NB - 1), 0), sd = Math.sqrt(d.reduce((a, v, i) => a + v * (i / (NB - 1) - mean) ** 2, 0));
    ro.textContent = `Dashed line = fitness of each trait value. Generation ${gen}: mean trait ${mean.toFixed(2)}, spread (SD) ${sd.toFixed(2)}. ` + { dir: 'Directional: one extreme is favoured (as in the dark peppered moths), so the whole curve slides toward it.', stab: 'Stabilising: the middle is favoured (like birth weight in babies), so the curve gets narrower and taller.', dis: 'Disruptive: both extremes are favoured, so the curve splits into two peaks, which can lead to two forms or species.' }[kind];
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `Generation ${gen}: ${{ dir: 'directional', stab: 'stabilising', dis: 'disruptive' }[kind]} selection`, col);
    const A = axes(ctx, w, h, col, { x: [0, 1], y: [0, 0.2], xlabel: 'trait value (e.g. beak size)', ylabel: 'share of population', l: 58, t: t0 + 8, b: 40, xt: [0, 0.5, 1], yt: [0, 0.1, 0.2], fy: (v) => Math.round(v * 100) + '%' });
    const bw = (A.R - A.L) / NB;
    d.forEach((v, i) => { const y = A.Y(Math.min(v, 0.2)); ctx.fillStyle = col.s[0]; ctx.fillRect(A.L + i * bw + 1, y, bw - 2, A.B - y); });
    const pts = []; for (let i = 0; i < NB; i++) pts.push([A.L + (i + 0.5) * bw, A.Y(0.2 * fit(kind, i / (NB - 1)) )]);
    line(ctx, pts, col.s[3], 2.5, [5, 3]);
  };
  init(); go();
}
