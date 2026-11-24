// Figures for src/blog/discoveries/slope-geometry-factor-of-safety-limit-equilibrium.md, made with the maths of
// the Slope stability tool (src/lib/sci/slope.ts: Bishop's simplified method, the ordinary method and the
// grid search for the critical circle).
// Run: node scripts/blog-figures/slope-geometry-factor-of-safety-limit-equilibrium.mjs
import fs from 'node:fs';
import { search } from '../../src/lib/sci/slope.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/slope-geometry-factor-of-safety-limit-equilibrium.md', import.meta.url);

// Inputs from the paper: Misriani, Joleha, Wanggai, Amsyar, Fitria, Gianda and Kurniawan (2025),
// E3S Web of Conferences 677: 01004, doi:10.1051/e3sconf/202567701004 (CC BY 4.0).
// Table 2 (CPT-based soil parameters) and Tables 3-6 (factor of safety against slope height and angle).
const L1 = { c: 7.2, phi: 7.686, gamma: 16.5 };      // clayey silt, 0 to 0.8 m
const L2 = { c: 12.72, phi: 8.21, gamma: 16.6 };     // clayey silt, 1 to 2.8 m
const L3 = { c: 27.31, phi: 10.618, gamma: 16.7 };   // stiff clay, 3 to 11.8 m
const CASES = [ // point, height (m), angle (°), the paper's LEM (Bishop) FS, the paper's FEM FS
  [1, 2.62, 49, 1.778, 1.5], [2, 2.73, 54, 1.614, 1.451], [3, 3.0, 65, 1.446, 1.287], [4, 3.12, 70, 1.338, 1.213],
  [5, 3.65, 70, 1.365, 1.225], [6, 4.04, 71, 1.388, 1.223], [7, 4.36, 71, 1.37, 1.217], [8, 4.52, 74, 1.315, 1.159],
  [9, 4.6, 76, 1.223, 1.104], [10, 4.75, 79, 1.276, 1.138], [11, 4.8, 84, 1.117, 1.038],
];
const STIFF = 3; // depth below the crest at which the stiff clay starts (m), from the paper's layer table

// The tool's critical-circle search for one slope. The grid covers the whole slope generously.
const run = (H, beta, soil, water = { kind: 'none' }) => {
  const s = { H, beta, ...soil, water };
  const xc = H / Math.tan((beta * Math.PI) / 180);
  const g = { x0: -1.5 * H, x1: xc + 1.5 * H, y0: 0.8 * H, y1: 4 * H, nx: 13, ny: 13, yLow: -1.0 * H, nR: 8 };
  const r = search(s, g, 40);
  return { F: r.best.f.bishop, ord: r.best.f.ordinary, c: r.best.c, onEdge: r.onEdge };
};

const res = CASES.map(([n, H, beta, lem, fem]) => {
  const two = run(H, beta, { top: L2, bottom: L3, yi: H - STIFF });
  const one = run(H, beta, { top: L2 });
  const soft = run(H, beta, { top: L1 });
  const wet = run(H, beta, { top: L2, bottom: L3, yi: H - STIFF }, { kind: 'ru', ru: 0.2 });
  return { n, H, beta, lem, fem, two: two.F, ord: two.ord, one: one.F, soft: soft.F, wet: wet.F, edge: two.onEdge || one.onEdge, R: two.c.R };
});
const ratio = res.map((r) => r.two / r.lem);
const mean = (v) => v.reduce((a, b) => a + b, 0) / v.length;
const corr = (a, b) => { const ma = mean(a), mb = mean(b); let n = 0, da = 0, db = 0; a.forEach((x, i) => { n += (x - ma) * (b[i] - mb); da += (x - ma) ** 2; db += (b[i] - mb) ** 2; }); return n / Math.sqrt(da * db); };

// --- Figure 1: FS against slope angle, paper and tool ---------------------------------------------
const fig1 = chart({
  title: 'Factor of safety of eleven cut slopes',
  xLabel: 'Slope angle (°)', yLabel: 'Factor of safety',
  series: [
    { name: 'Paper, Bishop (LEM)', kind: 'dots', x: res.map((r) => r.beta), y: res.map((r) => r.lem), size: 4 },
    { name: 'Tool, Bishop, two layers', kind: 'dots', x: res.map((r) => r.beta), y: res.map((r) => +r.two.toFixed(3)), size: 4 },
    { name: 'Paper, finite element', kind: 'dots', x: res.map((r) => r.beta), y: res.map((r) => r.fem), size: 3, colour: 'var(--ink)' },
    { name: 'Tool, soft silt only', kind: 'dots', x: res.map((r) => r.beta), y: res.map((r) => +r.one.toFixed(3)), size: 3, colour: 'var(--muted)' },
  ],
  xDomain: [45, 88], yDomain: [0.6, 2.1], hlines: [{ y: 1.25, text: 'FS 1.25' }, { y: 1, text: 'failure' }],
  width: 540, height: 310,
  desc: 'Factor of safety against slope angle for the paper’s eleven cut slopes: its own limit-equilibrium and finite-element values, the tool’s Bishop search with the stiff clay at 3 m depth, and the tool’s Bishop search with only the soft silt. The two-layer curve tracks the paper; the soft-silt-only one falls below 1.',
});

// --- Figure 2: how much the depth to the stiff clay matters ---------------------------------------
const DEPTHS = Array.from({ length: 29 }, (_, i) => 1.5 + i * 0.25);
const pick = [res[3], res[10]]; // point 4 (3.12 m, 70°) and point 11 (4.8 m, 84°)
const curves = pick.map((p) => DEPTHS.map((d) => +run(p.H, p.beta, { top: L2, bottom: L3, yi: p.H - d }).F.toFixed(3)));
const fig2 = chart({
  title: 'Where the stiff clay starts decides the answer',
  xLabel: 'Depth to the stiff clay below the crest (m)', yLabel: 'Factor of safety (Bishop)',
  series: pick.map((p, i) => ({ name: `Point ${p.n}: ${p.H} m, ${p.beta}°`, kind: 'line', x: DEPTHS, y: curves[i] })),
  xDomain: [1.5, 8.5], yDomain: [0.7, 2.1],
  hlines: [{ y: pick[0].lem, text: `paper, point ${pick[0].n}` }, { y: pick[1].lem, text: `paper, point ${pick[1].n}` }],
  vlines: [{ x: STIFF, text: '3 m' }],
  width: 540, height: 300,
  desc: 'Bishop factor of safety for two of the slopes as the assumed depth to the stiff clay changes from 1.5 m to 8.5 m. Both curves fall steeply over the first few metres and flatten once the slip circle no longer reaches the stiff layer.',
});

console.log(JSON.stringify({
  table: res.map((r) => `pt${r.n} H=${r.H} b=${r.beta} paperLEM=${r.lem} tool2=${r.two.toFixed(3)} ordinary=${r.ord.toFixed(3)} softOnly=${r.one.toFixed(3)} L1only=${r.soft.toFixed(3)} ru0.2=${r.wet.toFixed(3)} R=${r.R.toFixed(2)}`),
  ratioMean: +mean(ratio).toFixed(3), ratioMin: +Math.min(...ratio).toFixed(3), ratioMax: +Math.max(...ratio).toFixed(3),
  corrTwo: +corr(res.map((r) => r.two), res.map((r) => r.lem)).toFixed(3),
  corrOne: +corr(res.map((r) => r.one), res.map((r) => r.lem)).toFixed(3),
  femOverLem: res.map((r) => +(r.fem / r.lem).toFixed(3)), femOverLemMean: +mean(res.map((r) => r.fem / r.lem)).toFixed(3),
  bishopOverOrdinary: +mean(res.map((r) => r.two / r.ord)).toFixed(4),
  anyEdge: res.some((r) => r.edge),
  plateau: res.slice(3, 7).map((r) => ({ n: r.n, H: r.H, paper: r.lem, tool: +r.two.toFixed(3), soft: +r.one.toFixed(3) })),
  depthCurve: { depths: [2, 3, 4, 6, 8], pt4: [2, 3, 4, 6, 8].map((d) => +run(pick[0].H, pick[0].beta, { top: L2, bottom: L3, yi: pick[0].H - d }).F.toFixed(3)), pt11: [2, 3, 4, 6, 8].map((d) => +run(pick[1].H, pick[1].beta, { top: L2, bottom: L3, yi: pick[1].H - d }).F.toFixed(3)) },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'fs', figure(fig1, 'Figure 1. The paper’s eleven cut slopes. Its limit-equilibrium (Bishop) and finite-element factors of safety, with the fibub Slope stability search run twice: once with the soft silt over stiff clay at 3 m depth, and once with the soft silt alone.'));
  md = inject(md, 'depth', figure(fig2, 'Figure 2. The same maths with only one thing changed: how deep the stiff clay is assumed to start. Dashed lines mark the paper’s own factors of safety for those two slopes and the 3 m depth its soil table implies.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
