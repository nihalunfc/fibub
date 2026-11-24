// Figures for src/blog/discoveries/soybean-antinutrient-genetic-advance.md, made with the maths of the
// Breeder's equation calculator (src/lib/sci/breedeq.ts: intensity and response).
// Run: node scripts/blog-figures/soybean-antinutrient-genetic-advance.mjs
import fs from 'node:fs';
import { intensity, response } from '../../src/lib/sci/breedeq.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/soybean-antinutrient-genetic-advance.md', import.meta.url);

// Values from the paper (Palange et al. 2025, Discover Agriculture 3: 63, CC BY): 308 soybean genotypes;
// broad-sense heritability 0.68 (phytate), 0.84 (total trypsin inhibitors, TTI), 0.08 (yield);
// phytate PCV 203.1 %, GCV 137.6 %, genetic advance 1667.6 mg/kg; TTI PCV 34.6 %, GCV 29.2 %, GA 504.3 mg/kg.
const T = [
  { id: 'Phytate', h2: 0.68, pcv: 203.1, gcv: 137.6, ga: 1667.6, unit: 'mg/kg' },
  { id: 'Trypsin inhibitors', h2: 0.84, pcv: 34.6, gcv: 29.2, ga: 504.3, unit: 'mg/kg' },
];
const P = 0.05; // the usual 5 % selected behind a "genetic advance" figure (Johnson, Robinson and Comstock 1955)
const { i: i5, z: z5 } = intensity(P);

const rows = T.map((t) => {
  const h2cv = (t.gcv / t.pcv) ** 2;                       // heritability implied by the two coefficients of variation
  const gamP = i5 * t.h2 * t.pcv;                          // GA as % of mean, route A: i h2 PCV
  const gamG = i5 * Math.sqrt(t.h2) * t.gcv;               // route B: i h sigma_g, i.e. i sqrt(h2) GCV
  return { ...t, h2cv, gamP, gamG, meanP: (100 * t.ga) / gamP, meanG: (100 * t.ga) / gamG };
});

// Response in units of the phenotypic standard deviation, for the three reported heritabilities.
const ps = Array.from({ length: 99 }, (_, k) => (k + 1) / 100);
const lines = [{ h2: 0.84, name: 'Trypsin inhibitors (h² 0.84)' }, { h2: 0.68, name: 'Phytate (h² 0.68)' }, { h2: 0.08, name: 'Seed yield (h² 0.08)' }];
const fig1 = chart({
  title: 'What one round of selection moves the mean', xLabel: 'Share of the 308 genotypes kept (%)', yLabel: 'Response R (phenotypic SDs)',
  series: lines.map((L) => ({ name: L.name, kind: 'line', x: ps.map((p) => 100 * p), y: ps.map((p) => +response({ h2: L.h2, p, sigmaP: 1 }).R.toFixed(4)) })),
  xDomain: [1, 60], yDomain: [0, 2.2], vlines: [{ x: 5, text: '5 % kept' }],
  desc: 'Response to one round of selection, in phenotypic standard deviations, against the share of genotypes kept. At 5 per cent kept the response is 1.73 SD for the trypsin inhibitors, 1.40 for phytate and 0.17 for seed yield.', height: 280,
});

// The two routes to a genetic advance, as the assumed heritability changes (phytate's CVs).
const h2s = Array.from({ length: 96 }, (_, k) => 0.05 + k * 0.01);
const ph = rows[0];
const fig2 = chart({
  title: 'Two routes to phytate’s genetic advance', xLabel: 'Broad-sense heritability h²', yLabel: 'Genetic advance (% of the mean)',
  series: [
    { name: 'i h² × PCV', kind: 'line', x: h2s, y: h2s.map((h) => +(i5 * h * ph.pcv).toFixed(2)) },
    { name: 'i √h² × GCV', kind: 'line', x: h2s, y: h2s.map((h) => +(i5 * Math.sqrt(h) * ph.gcv).toFixed(2)) },
  ],
  xDomain: [0.05, 1], yDomain: [0, 450],
  vlines: [{ x: +ph.h2cv.toFixed(4), text: 'CVs agree: 0.459' }, { x: 0.68, text: 'paper: 0.68' }],
  desc: 'The two standard ways of writing a genetic advance agree only when the heritability equals the squared ratio of the two coefficients of variation, 0.459 here. At the paper\'s 0.68 they differ by 51 per cent of the mean.', height: 280,
});

console.log(JSON.stringify({
  i5, z5, rows,
  yieldVsPhytate: response({ h2: 0.08, p: P, sigmaP: 1 }).R / response({ h2: 0.68, p: P, sigmaP: 1 }).R,
  phytateCheck: response({ h2: 0.68, p: P, sigmaP: 2.031 * 585.3 }).R,
  ttiCheck: response({ h2: 0.84, p: P, sigmaP: 0.346 * 841.2 }).R,
  oneParent: response({ h2: 0.68, p: P, sigmaP: 2.031 * 585.3, c: 0.5 }).R,
  twoPct: response({ h2: 0.68, p: 0.02, sigmaP: 2.031 * 585.3 }).R,
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'resp', figure(fig1, 'Figure 1. One round of truncation selection among 308 genotypes, worked out with the Breeder\'s equation calculator\'s own functions, using the three heritabilities the paper reports. The response is in phenotypic standard deviations, so it applies whatever the trait\'s units.'));
  md = inject(md, 'routes', figure(fig2, 'Figure 2. The same genetic advance written two ways, with the paper\'s phytate coefficients of variation (PCV 203.1 %, GCV 137.6 %) and 5 % of genotypes kept. The two agree only at h² = 0.459.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
