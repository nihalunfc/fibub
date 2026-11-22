// Genetic drift: eight populations start with the same allele frequency (0.5) and no selection at all. Each generation
// the next one is a random sample of the gene pool. In small populations the frequency wanders and quickly reaches 0 or 1
// (an allele lost or fixed); in large ones it barely moves. Change the population size and press "New run".
import { canvas, row, slider, button, readout, rng, axes, line, text, title } from '../kit.js';

export default function (host) {
  let N = 20, seed = 1, runs = [];
  const cv = canvas(host, { aspect: 0.8, max: 360, min: 290, label: 'Allele frequency over 100 generations in eight populations of the same size' });
  const c = row(host);
  slider(c, { label: 'Population size N', min: 10, max: 500, step: 10, value: N, fmt: (v) => `${v}`, oninput: (v) => { N = v; sim(); } });
  button(c, 'New run', () => { seed++; sim(); });
  const out = readout(host);
  function sim() {
    const G = 100; runs = [];
    for (let k = 0; k < 8; k++) { const R = rng(seed * 100 + k * 7 + 3); let p = 0.5; const h = [p]; for (let g = 0; g < G; g++) { let a = 0; for (let i = 0; i < 2 * N; i++) if (R() < p) a++; p = a / (2 * N); h.push(p); } runs.push(h); }
    const fixed = runs.filter((h) => h[100] === 1).length, lost = runs.filter((h) => h[100] === 0).length, sd = Math.sqrt(runs.reduce((s, h) => s + (h[100] - 0.5) ** 2, 0) / 8);
    out.innerHTML = `N = <b>${N}</b>: after 100 generations ${fixed} populations fixed the allele, ${lost} lost it, spread of final frequencies ±<b>${sd.toFixed(2)}</b>. Drift is strongest when N is small (the founder effect and bottleneck are drift events).`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Allele frequency, no selection', col);
    const A = axes(ctx, w, h, col, { x: [0, 100], y: [0, 1], xt: [0, 25, 50, 75, 100], yt: [0, 0.5, 1], l: 40, t: 34, b: 38, xlabel: 'Generation' });
    text(ctx, 'frequency of allele A', A.L + 6, A.T + 10, { color: col.ink, size: 10.5, weight: 700 });
    runs.forEach((hh, i) => line(ctx, hh.map((v, g) => [A.X(g), A.Y(v)]), col.s[i], 2));
  };
  sim();
}
