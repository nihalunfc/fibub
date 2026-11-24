// Figures for src/blog/discoveries/maize-hybrid-stomatal-density-leaf-layers.md, made with the maths of the
// Stomatal density counter (src/lib/sci/plantimg.ts: fovDiameter, circleArea, placePoints, summary).
// Run: node scripts/blog-figures/maize-hybrid-stomatal-density-leaf-layers.mjs
import fs from 'node:fs';
import { fovDiameter, circleArea, placePoints, summary } from '../../src/lib/sci/plantimg.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/maize-hybrid-stomatal-density-leaf-layers.md', import.meta.url);

// Values from the paper (Zhang et al. 2025, Front. Plant Sci. 15: 1442686, CC BY): fields of view 767 x 767 µm at
// 350x and 298 x 298 µm at 900x; mean stomatal density 87.21 +/- 10.97 (inbred 2416), 78.64 +/- 9.41 (inbred MC01)
// and 74.95 +/- 11.82 stomata/mm2 (hybrid 728); by leaf layer 74.35 (lower), 80.01 (middle), 87.19 (upper).
const F350 = 0.767, F900 = 0.298;              // field side in mm
const A350 = F350 * F350, A900 = F900 * F900;  // mm2
const CV = [
  { id: 'Inbred 2416', d: 87.21, sd: 10.97 },
  { id: 'Inbred MC01', d: 78.64, sd: 9.41 },
  { id: 'Hybrid 728', d: 74.95, sd: 11.82 },
];
const mid = (CV[0].d + CV[1].d) / 2;
const het = { mp: 100 * (CV[2].d - mid) / mid, best: 100 * (CV[2].d - CV[0].d) / CV[0].d, low: 100 * (CV[2].d - CV[1].d) / CV[1].d };

// Figure 1: how many stomata land in one field of view, as the objective changes (round field, field number 22 mm).
const objs = Array.from({ length: 56 }, (_, k) => 5 + k); // 5x to 60x
const perField = (area, d) => area * d;
const fig1 = chart({
  title: 'Stomata in one field of view', xLabel: 'Objective (×), eyepiece field number 22 mm', yLabel: 'Stomata in the field',
  series: [
    ...CV.map((c) => ({ name: c.id, kind: 'line', x: objs, y: objs.map((o) => +perField(circleArea(fovDiameter(22, o)), c.d).toFixed(2)) })),
    { name: '', noLegend: true, kind: 'dots', x: [22 / F350, 22 / F900], y: [+perField(A350, CV[0].d).toFixed(1), +perField(A900, CV[0].d).toFixed(1)], size: 4, colour: 'var(--ink)' },
  ],
  xDomain: [5, 60], yDomain: [0, 120],
  hlines: [{ y: 20, text: '20 stomata: ±22 % from one field' }],
  desc: 'With an eyepiece field number of 22 mm, one round field holds about 100 stomata at a 10x objective and fewer than 10 above 40x. The two dots are the square fields the paper used at 350x and 900x magnification.', height: 285,
});

// Figure 2: counting noise alone. Stomata are scattered at random over a 10 x 10 mm patch at the paper's density
// and counted field by field; the spread between fields is then pure placement noise.
const W = 10, H = 10, N = Math.round(CV[0].d * W * H);
const pts = placePoints('random', W, H, { n: N, rows: 1, cols: 1, seed: 1442686, border: 0 });
function fieldCounts(side) {
  const k = Math.floor(W / side), box = new Map();
  for (const [x, y] of pts) {
    const i = Math.floor(x / side), j = Math.floor(y / side);
    if (i >= k || j >= k) continue;
    const key = i + ',' + j; box.set(key, (box.get(key) ?? 0) + 1);
  }
  const counts = [];
  for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) counts.push(box.get(i + ',' + j) ?? 0);
  return { k, counts, dens: summary(counts.map((c) => c / (side * side)), 'sd'), raw: summary(counts, 'sd') };
}
const s350 = fieldCounts(F350), s900 = fieldCounts(F900);
const nf = Array.from({ length: 40 }, (_, k) => k + 1);
const rse = (s) => nf.map((k) => +(100 * (s.dens.sd / s.dens.mean) / Math.sqrt(k)).toFixed(3));
const fig2 = chart({
  title: 'How many fields a density needs', xLabel: 'Fields counted', yLabel: 'Relative standard error (%)',
  series: [
    { name: '900× field (0.089 mm²)', kind: 'line', x: nf, y: rse(s900) },
    { name: '350× field (0.588 mm²)', kind: 'line', x: nf, y: rse(s350) },
  ],
  xDomain: [1, 40], yDomain: [0, 40], hlines: [{ y: 5, text: '5 %' }], vlines: [{ x: 5, text: 'the paper: 4 to 5 fields per leaf' }],
  desc: 'Relative standard error of a stomatal density from randomly scattered stomata at 87 per square millimetre. One 350x field gives about 14 per cent, one 900x field about 36 per cent; five 350x fields give 6 per cent.', height: 280,
});

const out = {
  areas: { A350, A900, fn22x40: circleArea(fovDiameter(22, 40)), fn22x10: circleArea(fovDiameter(22, 10)) },
  perField350: CV.map((c) => +(A350 * c.d).toFixed(2)), perField900: CV.map((c) => +(A900 * c.d).toFixed(2)),
  het, mid,
  sim350: { fields: s350.counts.length, meanCount: s350.raw.mean, sdCount: s350.raw.sd, meanDens: s350.dens.mean, sdDens: s350.dens.sd, cv: 100 * s350.dens.sd / s350.dens.mean, poisson: 100 / Math.sqrt(A350 * CV[0].d) },
  sim900: { fields: s900.counts.length, meanCount: s900.raw.mean, sdCount: s900.raw.sd, meanDens: s900.dens.mean, sdDens: s900.dens.sd, cv: 100 * s900.dens.sd / s900.dens.mean, poisson: 100 / Math.sqrt(A900 * CV[0].d) },
  paperCv: CV.map((c) => +(100 * c.sd / c.d).toFixed(2)),
  seDiff: (n) => n,
  fieldsFor5pc: Math.ceil((s350.dens.sd / s350.dens.mean / 0.05) ** 2),
  fieldsFor5pc900: Math.ceil((s900.dens.sd / s900.dens.mean / 0.05) ** 2),
  // Can 4 to 5 fields see the hybrid's shortfall? SE of a mean from k fields, and of a difference of two such means.
  se5: s350.dens.sd / Math.sqrt(5), seDiff5: s350.dens.sd * Math.sqrt(2 / 5), gap: mid - CV[2].d,
  se40: s350.dens.sd / Math.sqrt(40), seDiff40: s350.dens.sd * Math.sqrt(2 / 40),
  layerSpread: 100 * (87.19 - 74.35) / 74.35,
};
console.log(JSON.stringify(out, (k, v) => (typeof v === 'function' ? undefined : v), 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'fov', figure(fig1, 'Figure 1. Stomata in one round field of view against the objective, for the three maize lines\' mean densities, worked out with the Stomatal density counter\'s field-of-view functions. The two dots are the paper\'s square fields at 350× and 900×.'));
  md = inject(md, 'fields', figure(fig2, 'Figure 2. Counting noise alone: stomata scattered at random over a 10 × 10 mm patch at 87.21 per mm², counted field by field with the tool\'s own point placing and summary functions, then the standard error of a mean of several fields.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
