// Figures for src/blog/discoveries/oak-pine-grass-stomatal-index-density-consistency.md, made with the maths of the
// Stomatal density counter (src/lib/sci/plantimg.ts: stomatalIndex, fovDiameter, circleArea, wilson).
// Run: node scripts/blog-figures/oak-pine-grass-stomatal-index-density-consistency.mjs
import fs from 'node:fs';
import { stomatalIndex, fovDiameter, circleArea, wilson } from '../../src/lib/sci/plantimg.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/oak-pine-grass-stomatal-index-density-consistency.md', import.meta.url);

// Inputs from the paper: Marquez-Godoy et al. (2026), Grasses 5(2): 16, doi:10.3390/grasses5020016 (CC BY 4.0).
// Ten grasses of an oak-pine ecosystem in Chihuahua, counted at 400x in fields of 0.0946 mm2, three optical fields
// per epidermal impression and three impressions per leaf. Values quoted in its running text:
const FIELD = 0.0946;      // mm2 per optical field
const SPP = [
  { id: 'Muhlenbergia arizonica', side: 'adaxial', sd: 299.8, ed: 1499.1, si: 16.7 },
  { id: 'Muhlenbergia arizonica', side: 'abaxial', sd: 317.5, ed: 1527.3, si: 17.2 },
  { id: 'Setaria parviflora', side: 'adaxial', sd: 60.0, ed: 243.4, si: 19.9 },
];
const DISCUSSION = { adax: 1672.0, abax: 1661.4 };   // the Discussion's epidermal densities for M. arizonica

const table = SPP.map((s) => ({ ...s, siTool: +stomatalIndex(s.sd, s.ed).toFixed(2), perField: { stomata: +(s.sd * FIELD).toFixed(1), cells: +(s.ed * FIELD).toFixed(1) } }));
const clash = { adax: +stomatalIndex(299.8, DISCUSSION.adax).toFixed(2), abax: +stomatalIndex(317.5, DISCUSSION.abax).toFixed(2) };

// Counting precision: a Poisson count of k stomata has a relative standard error of 1/sqrt(k), and the stomatal
// index is a proportion of all cells counted, so the Wilson interval covers it.
const NF = Array.from({ length: 30 }, (_, i) => i + 1);
const precision = (sd, ed) => NF.map((n) => {
  const k = Math.round(n * sd * FIELD), tot = Math.round(n * (sd + ed) * FIELD);
  const [lo, hi] = wilson(k, tot, 0.95);
  return { fields: n, k, tot, relSE: 100 / Math.sqrt(k), si: (100 * k) / tot, halfPp: (100 * (hi - lo)) / 2 };
});
const hi = precision(299.8, 1499.1), lo = precision(60.0, 243.4);

const EDX = Array.from({ length: 121 }, (_, i) => 1100 + i * 10);
const fig1 = chart({
  title: 'Stomatal index from the two densities', xLabel: 'Epidermal cell density (cells mm⁻²)', yLabel: 'Stomatal index (%)',
  series: [
    { name: 'Adaxial, 299.8 stomata mm⁻²', kind: 'line', x: EDX, y: EDX.map((e) => +stomatalIndex(299.8, e).toFixed(3)) },
    { name: 'Abaxial, 317.5 stomata mm⁻²', kind: 'line', x: EDX, y: EDX.map((e) => +stomatalIndex(317.5, e).toFixed(3)) },
    { name: '', noLegend: true, kind: 'dots', size: 4, x: [1499.1, 1527.3], y: [16.7, 17.2], colour: 'var(--ink)' },
    { name: '', noLegend: true, kind: 'dots', size: 4, x: [DISCUSSION.adax, DISCUSSION.abax], y: [16.7, 17.2], colour: 'var(--muted)' },
  ],
  xDomain: [1100, 1750], yDomain: [14, 23],
  vlines: [{ x: 1499.1, text: 'Results' }, { x: 1672, text: 'Discussion', left: false, dy: 14 }],
  desc: 'Stomatal index against epidermal cell density for Muhlenbergia arizonica. The paper’s Results densities land on its reported index of 16.7 and 17.2 percent, while the higher epidermal densities quoted in its Discussion would give 15.2 and 16.0 percent.',
  height: 290,
});
const fig2 = chart({
  title: 'How many fields a density needs', xLabel: 'Optical fields counted (0.0946 mm² each)', yLabel: 'Counting error of the density (± %)',
  series: [
    { name: 'M. arizonica (299.8 mm⁻²)', kind: 'line', x: NF, y: hi.map((r) => +r.relSE.toFixed(2)) },
    { name: 'S. parviflora (60 mm⁻²)', kind: 'line', x: NF, y: lo.map((r) => +r.relSE.toFixed(2)) },
  ],
  xDomain: [1, 30], yDomain: [0, 45], hlines: [{ y: 10, text: '±10 %' }],
  vlines: [{ x: 3, text: '3 fields', left: true }, { x: 9, text: '9 per leaf' }],
  desc: 'The counting error alone on a stomatal density, against the number of 0.0946 square millimetre fields counted. Three fields give about 11 percent for the densest grass and 24 percent for the sparsest; reaching 10 percent on the sparsest needs about 18 fields.',
  height: 290,
});

console.log('index from the Results densities:', JSON.stringify(table, null, 1));
console.log('index from the Discussion densities:', JSON.stringify(clash));
console.log('epidermal density that would give 19.9 % at 60 stomata mm-2:', (60 / 0.199 - 60).toFixed(1));
console.log('field of view: 0.0946 mm2 is', (2 * Math.sqrt(0.0946 / Math.PI)).toFixed(4), 'mm across, a field number of', (2 * Math.sqrt(0.0946 / Math.PI) * 40).toFixed(1), 'at 400x');
console.log('a field number 22 eyepiece at 40x:', fovDiameter(22, 40), 'mm across,', circleArea(fovDiameter(22, 40)).toFixed(4), 'mm2, which is', (circleArea(fovDiameter(22, 40)) / FIELD).toFixed(2), 'of their field');
for (const [name, p] of [['M. arizonica', hi], ['S. parviflora', lo]]) {
  for (const n of [3, 9, 20]) { const r = p[n - 1]; console.log(`${name}, ${n} fields: ${r.k} stomata of ${r.tot} cells, index ${r.si.toFixed(2)} % +/- ${r.halfPp.toFixed(2)} pp (Wilson), density +/- ${r.relSE.toFixed(1)} %`); }
}

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'si', figure(fig1, 'Figure 1. The stomatal index of Muhlenbergia arizonica as a function of epidermal cell density, at the paper’s own stomatal densities. Its Results values (black) reproduce its published index to 0.05 of a percentage point; the epidermal densities its Discussion quotes (grey) do not.'));
  md = inject(md, 'fields', figure(fig2, 'Figure 2. The counting error on a stomatal density against the number of fields counted, for the densest and the sparsest grass in the paper, in its own 0.0946 mm² field. Poisson counting error only: real leaf-to-leaf variation adds to it.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
