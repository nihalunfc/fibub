// Figures for src/blog/discoveries/dem-slope-truncation-error-vs-elevation-noise-optimal-grid-spacing-horn.md, made with the maths of the DEM terrain tool
// (src/lib/sci/dem.ts: derive(grid, 'slope') is Horn's 3 x 3 method; derive(grid, 'aspect')).
// Run: node scripts/blog-figures/dem-slope-truncation-error-vs-elevation-noise-optimal-grid-spacing-horn.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { derive } from '../../src/lib/sci/dem.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/dem-slope-truncation-error-vs-elevation-noise-optimal-grid-spacing-horn.md', import.meta.url);

// Idea from Smith, Rheinwalt and Bookhagen (2019), Earth Surface Dynamics 7: 475-489, doi:10.5194/esurf-7-475-2019 (CC BY 4.0): slope and aspect from a gridded
// elevation model carry a truncation error (the grid is a coarse picture of a smooth surface; it shrinks as cells get smaller) and a propagated elevation
// uncertainty (noise in the heights; it grows as cells get smaller), so there is a best spacing. The paper used a synthetic Gaussian hill, its own finite
// differences and lidar from Santa Cruz Island (4 m best).
// OUR assumptions: a Gaussian hill 100 m high with a spread (sigma) of 150 m on a 800 m square, a metre grid, Horn's method (the tool's, not the paper's four-neighbour one),
// white noise of 0.05 and 0.15 m (standard deviation) in the heights, errors as the mean over interior cells, a seeded random generator, 3 noise draws per point.
const L = 800, H0 = 100, S = 150, C0 = L / 2, R = (x, n = 2) => +x.toFixed(n);
const hill = (x, y) => H0 * Math.exp(-((x - C0) ** 2 + (y - C0) ** 2) / (2 * S * S));
const trueSlope = (x, y) => { const z = hill(x, y), k = z / (S * S); return Math.atan(Math.hypot(k * (x - C0), k * (y - C0))) * 180 / Math.PI; };
let seed = 12345; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const gauss = () => Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd());
function errors(h, sigma, draws = 3) {
  const n = Math.round(L / h) + 1, z0 = new Float32Array(n * n), tr = new Float64Array(n * n);
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { z0[r * n + c] = hill(c * h, r * h); tr[r * n + c] = trueSlope(c * h, r * h); }
  const grid = (z) => ({ w: n, h: n, z, dx: h, dy: h, x0: 0, y0: L, unit: 'm', notes: [] });
  const clean = derive(grid(z0), 'slope');
  let te = 0, m = 0; for (let r = 1; r < n - 1; r++) for (let c = 1; c < n - 1; c++) { te += Math.abs(clean[r * n + c] - tr[r * n + c]); m++; } te /= m;
  let peu = 0;
  for (let d = 0; d < draws; d++) {
    const z = Float32Array.from(z0, (v) => v + sigma * gauss()), s = derive(grid(z), 'slope'); let a = 0;
    for (let r = 1; r < n - 1; r++) for (let c = 1; c < n - 1; c++) a += (s[r * n + c] - clean[r * n + c]) ** 2;
    peu += Math.sqrt(a / m);
  }
  return { te, peu: peu / draws };
}
const SP = [1, 2, 4, 5, 8, 10, 16, 20, 25, 40, 50, 80, 100];
const out = {};
for (const sg of [0.05, 0.15]) out[sg] = SP.map((h) => { const e = errors(h, sg); return { h, te: R(e.te, 4), peu: R(e.peu, 3), tot: R(Math.hypot(e.te, e.peu), 3) }; });
const best = (sg) => out[sg].reduce((a, b) => (b.tot < a.tot ? b : a));
const fig1 = chart({
  title: 'Slope errors on a smooth hill: two sources, opposite trends', xLabel: 'Grid spacing (m)', yLabel: 'Slope error (degrees)',
  series: [
    { name: 'Truncation error (grid too coarse)', kind: 'line', colour: 'var(--c-blog)', x: SP, y: out[0.05].map((r) => r.te) },
    { name: 'Noise 0.15 m', kind: 'line', colour: 'var(--c-tools)', x: SP, y: out[0.15].map((r) => r.peu) },
    { name: 'Noise 0.05 m', kind: 'line', colour: 'var(--muted)', x: SP, y: out[0.05].map((r) => r.peu) },
  ],
  xDomain: [0, 100], yDomain: [0, 4],
  desc: 'Slope error in degrees against grid spacing from 1 to 100 metres for a smooth Gaussian hill. The truncation error rises with spacing; the error spread by random height noise of 0.05 and 0.15 metres falls with spacing.', height: 300,
});
const fig2 = chart({
  title: 'Total slope error has a minimum', xLabel: 'Grid spacing (m)', yLabel: 'Combined error (degrees)',
  series: [
    { name: 'Noise 0.15 m', kind: 'line', colour: 'var(--c-tools)', x: SP, y: out[0.15].map((r) => r.tot) },
    { name: 'Noise 0.05 m', kind: 'line', colour: 'var(--c-blog)', x: SP, y: out[0.05].map((r) => r.tot) },
  ],
  xDomain: [0, 100], yDomain: [0, 2],
  vlines: [{ x: best(0.05).h, text: `best ${best(0.05).h} m (0.05 m noise)` }, { x: best(0.15).h, text: `best ${best(0.15).h} m (0.15 m noise)`, dy: 14 }],
  desc: 'Combined slope error, the square root of the sum of the squares of truncation error and noise error, against grid spacing, with its minimum marked for two noise levels.', height: 300,
});
const res = { out, best: [best(0.05), best(0.15)] };
console.log(JSON.stringify(res));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'errors', figure(fig1, 'Figure 1. Mean slope error from Horn\'s method on a synthetic Gaussian hill (100 m high, spread 150 m): the error caused by the grid itself (truncation) and the spread caused by random height noise, at grid spacings from 1 to 100 m. Our own simulation with the DEM terrain tool\'s maths, not data from the paper.'));
  md = inject(md, 'best', figure(fig2, 'Figure 2. The two errors combined as the square root of the sum of squares. Cleaner heights allow a finer grid: the best spacing moves from a larger to a smaller value as the noise falls. Our simulation.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
