// Figures for src/blog/discoveries/thiessen-weights-areal-rainfall-tasikmalaya.md, made with the maths of the
// Rain gauge average (src/lib/sci/thiessen.ts: Thiessen cells, areas, weights and the areal mean).
// Run: node scripts/blog-figures/thiessen-weights-areal-rainfall-tasikmalaya.mjs   (rewrites the charts in the article)
import fs from 'node:fs';
import { cells, area, arealMean, inside } from '../../src/lib/sci/thiessen.ts';
import { chart, figure, inject, watermark } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/thiessen-weights-areal-rainfall-tasikmalaya.md', import.meta.url);

// Inputs from the paper: Hamidi, Mukhaiyar, Sri Rezeki, Dianti and Rohat (2025), ITM Web of Conferences 75: 04004,
// doi:10.1051/itmconf/20257504004 (CC BY 4.0). Its Table 1 (station monthly rainfall statistics), Table 4 (Thiessen
// areas and weights) and Table 5 (the areal series). The gauge coordinates are NOT published.
const NAME = ['Taraju', 'Gn. Satria', 'Singaparna', 'Kawalu', 'Cikunten', 'Karangnunggal', 'Cigede', 'Cimulu'];
const AREA = [636706540.53, 220335769.46, 172771131.14, 406859686.61, 52395594.00, 821362618.22, 245685842.77, 143799533.27]; // m²
const WPAPER = [0.23582, 0.08161, 0.06399, 0.15069, 0.01941, 0.30422, 0.09100, 0.05326];
const TOTAL = 2699916716.00; // m², the paper's stated total
const MEAN = [285.585, 197.881, 181.881, 219.722, 199.038, 202.618, 298.222, 284.417]; // mm per month
const SD = [180.244, 162.598, 136.910, 154.106, 159.785, 179.242, 192.034, 182.872];
const AREAL = { mean: 234.36, sd: 145.54, min: 4.92, max: 667.36 }; // the paper's areal rainfall series

// --- Checks that use only the paper's own numbers -------------------------------------------------
const sumArea = AREA.reduce((a, b) => a + b, 0);
const wFromArea = AREA.map((a) => a / TOTAL);
const wErr = Math.max(...wFromArea.map((w, i) => Math.abs(w - WPAPER[i])));
const arealFromWeights = WPAPER.reduce((s, w, i) => s + w * MEAN[i], 0);
const plain = MEAN.reduce((a, b) => a + b, 0) / MEAN.length;
// What average correlation between stations would explain the areal series' own SD?
const s = WPAPER.map((w, i) => w * SD[i]);
const sum2 = s.reduce((a, b) => a + b, 0) ** 2, sumsq = s.reduce((a, b) => a + b * b, 0);
const rho = (AREAL.sd ** 2 - sumsq) / (sum2 - sumsq);
const sdIndep = Math.sqrt(sumsq), sdOne = s.reduce((a, b) => a + b, 0);

// --- A demonstration catchment whose Thiessen weights match the paper's ---------------------------
// OUR OWN catchment outline (km), scaled to the paper's total area, and eight gauge positions found by a
// pattern search (with a 9 km minimum spacing) so that the tool's weights reproduce the paper's eight weights.
const POLY = [[0, 0], [23.368, -7.789], [44.139, -5.193], [59.718, 5.193], [67.507, 20.771], [62.314, 36.35], [46.735, 44.139], [28.561, 42.841], [10.386, 33.753], [-2.596, 18.175]];
const GAUGE = [[57.09, 25.14], [-1.66, 14.79], [9.89, 32.34], [39.89, 29.83], [30.05, 42.94], [19.02, 6.32], [24.16, 34.29], [39.58, 41.17]];
const demo = cells(POLY, GAUGE);
const wDemo = demo.cells.map((c) => c.weight);
const wDemoErr = Math.max(...wDemo.map((w, i) => Math.abs(w - WPAPER[i])));
const all = arealMean(POLY, GAUGE, MEAN);
const drops = GAUGE.map((_, k) => {
  const v = MEAN.map((m, i) => (i === k ? NaN : m));
  const q = arealMean(POLY, GAUGE, v);
  return { k, name: NAME[k], w: WPAPER[k], mean: q.mean, delta: q.mean - all.mean };
});

// --- Figure 1: the demonstration catchment and its Thiessen cells ---------------------------------
const W0 = 560, H0 = 330, PAD = 14;
const xs = POLY.map((p) => p[0]), ys = POLY.map((p) => p[1]);
const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
const sc = Math.min((W0 - 2 * PAD - 120) / (x1 - x0), (H0 - 2 * PAD - 22) / (y1 - y0));
const PX = (x) => PAD + (x - x0) * sc, PY = (y) => H0 - PAD - 22 - (y - y0) * sc;
const path = (p) => 'M' + p.map(([x, y]) => `${PX(x).toFixed(1)} ${PY(y).toFixed(1)}`).join('L') + 'Z';
const map = [
  `<svg class="blog-fig" viewBox="0 0 ${W0} ${H0}" role="img" aria-label="A made-up catchment of the same total area as the paper's, divided into eight Thiessen cells whose weights match the paper's eight gauge weights. Each cell is labelled with its gauge and weight." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:12px system-ui,sans-serif">`,
  `<title>Thiessen cells of a demonstration catchment</title>`,
  ...demo.cells.map((c) => `<path d="${path(c.poly)}" style="fill:var(--c-tools);fill-opacity:.07;stroke:var(--line)"/>`),
  `<path d="${path(POLY)}" style="fill:none;stroke:var(--ink);stroke-width:2"/>`,
  ...demo.cells.map((c, i) => {
    const [cx, cy] = c.poly.length >= 3 ? c.poly.reduce((a, p) => [a[0] + p[0] / c.poly.length, a[1] + p[1] / c.poly.length], [0, 0]) : GAUGE[i];
    return `<text x="${PX(cx).toFixed(1)}" y="${PY(cy).toFixed(1)}" text-anchor="middle" style="fill:var(--muted)">${NAME[i]} ${(c.weight * 100).toFixed(1)}%</text>`;
  }),
  ...GAUGE.map(([x, y]) => `<circle cx="${PX(x).toFixed(1)}" cy="${PY(y).toFixed(1)}" r="3.5" style="fill:var(--c-blog)"/>`),
  `<text x="${PAD}" y="${H0 - 6}" style="fill:var(--muted)">Catchment ${(area(POLY)).toFixed(0)} km², eight gauges (our layout, not the paper's)</text>`,
  watermark(W0, H0),
  '</svg>',
].join('');

// --- Figure 2: what one missing gauge does --------------------------------------------------------
const fig2 = chart({
  title: 'A missing gauge: weight is not importance',
  xLabel: "Gauge's Thiessen weight", yLabel: 'Change in areal rainfall (mm per month)',
  series: [
    { name: 'One gauge missing', kind: 'dots', x: drops.map((d) => d.w), y: drops.map((d) => +d.delta.toFixed(2)), size: 4 },
  ],
  xDomain: [0, 0.34], yDomain: [-18, 12], hlines: [{ y: 0, text: 'all eight gauges' }],
  width: 520, height: 290,
  desc: 'For each of the eight gauges, the change in the catchment rainfall when that gauge is left out and the polygons are redrawn, against the gauge’s own weight. The largest shifts come from the two gauges whose readings are furthest from the catchment mean, not from the gauge with the largest area.',
});

console.log(JSON.stringify({
  sumArea, sumMinusTotal: +(sumArea - TOTAL).toFixed(2), wErr: +wErr.toExponential(1), wSum: +WPAPER.reduce((a, b) => a + b, 0).toFixed(5),
  wFromArea: wFromArea.map((w) => +w.toFixed(5)),
  arealFromWeights: +arealFromWeights.toFixed(2), paperAreal: AREAL.mean, gap: +(arealFromWeights - AREAL.mean).toFixed(2),
  plain: +plain.toFixed(2), thiessenMinusPlain: +(arealFromWeights - plain).toFixed(2),
  sdIndep: +sdIndep.toFixed(2), sdOne: +sdOne.toFixed(2), rho: +rho.toFixed(3),
  demoArea: +area(POLY).toFixed(2), wDemo: wDemo.map((w) => +w.toFixed(5)), wDemoErr: +wDemoErr.toExponential(1),
  demoAreal: +all.mean.toFixed(2), demoPlain: +all.arith.toFixed(2),
  drops: drops.map((d) => `${d.name} w=${d.w} -> ${d.mean.toFixed(2)} (${d.delta >= 0 ? '+' : ''}${d.delta.toFixed(2)})`),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'map', figure(map, 'Figure 1. A demonstration catchment of the same total area as the paper’s (2,699.9 km²), with eight gauge positions chosen so that the Rain gauge average tool’s Thiessen weights reproduce the paper’s eight published weights to five decimal places. The outline and the positions are ours: the paper does not publish gauge coordinates.'));
  md = inject(md, 'drop', figure(fig2, 'Figure 2. The same catchment with one gauge missing at a time. The tool redraws the polygons each time, so every weight changes; the shift in catchment rainfall depends on how wet the missing gauge was, not just on how much area it held.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [map, fig2].map((x) => (x.length / 1024).toFixed(1) + ' KB').join(', '));
}
