// Figures for src/blog/discoveries/soil-moisture-sampling-number-scale-cv-relative-error.md, made with the maths of
// the Field sampling planner (src/lib/sci/sampling.ts: nForMean, spacingForN, hotspotP) and tInv from stats.ts.
// Run: node scripts/blog-figures/soil-moisture-sampling-number-scale-cv-relative-error.mjs
import fs from 'node:fs';
import { nForMean, spacingForN, hotspotP, spacingFor } from '../../src/lib/sci/sampling.ts';
import { tInv } from '../../src/lib/sci/stats.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/soil-moisture-sampling-number-scale-cv-relative-error.md', import.meta.url);

// Inputs from the paper: Wang et al. (2023), Atmosphere 14(1): 149, doi:10.3390/atmos14010149 (CC BY 4.0).
// Nested scales (m), the average coefficient of variation of soil moisture at each scale (their Table 2), and the
// "reasonable sample number" they report at 95 % confidence and 10 % relative error.
const SCALE = [2, 10, 20, 40, 80, 160];
const CV = [0.074, 0.109, 0.110, 0.197, 0.350, 0.778];
const THEIRS = [2, 5, 5, 8, 20, 42];
const REG = (cv) => 55.1 * cv; // their Eq. (3), Rn = 55.10 × CV

const rows = SCALE.map((s, i) => {
  const cv = CV[i], n = THEIRS[i];
  return {
    scale: s, cv, theirs: n,
    n10: nForMean(cv, 0.1, 0.95), n5: nForMean(cv, 0.05, 0.95), n10at90: nForMean(cv, 0.1, 0.9),
    reg: +REG(cv).toFixed(1),
    // The margin their own sample number really buys: t(0.975, n-1) × CV / √n.
    margin: +(100 * (tInv(0.975, n - 1) * cv) / Math.sqrt(n)).toFixed(1),
  };
});

const CVX = Array.from({ length: 78 }, (_, i) => 0.03 + i * 0.01);
const fig1 = chart({
  title: 'Samples for a mean within ±10 % (95 % confidence)', xLabel: 'Coefficient of variation', yLabel: 'Samples needed (log)',
  series: [
    { name: 'fibub planner (classical)', kind: 'line', x: CVX, y: CVX.map((c) => Math.log10(nForMean(c, 0.1, 0.95))) },
    { name: 'Paper, Rn = 55.10 × CV', kind: 'line', dash: '5 4', x: CVX, y: CVX.map((c) => Math.log10(REG(c))), colour: 'var(--c-tools)' },
    { name: 'Paper, measured scales', kind: 'dots', size: 4, x: CV, y: THEIRS.map((n) => Math.log10(n)), colour: 'var(--ink)' },
  ],
  xDomain: [0, 0.82], yDomain: [0, Math.log10(400)],
  yTicks: [1, 2, 3, 5, 10, 20, 50, 100, 200, 400].map((v) => Math.log10(v)), yFmt: (v) => String(Math.round(10 ** v)),
  desc: 'Samples needed to hold a mean within 10 percent at 95 percent confidence, against the coefficient of variation. The classical curve rises as the square of CV, while the paper’s straight-line rule rises in proportion to CV, so the two agree near CV 0.1 and diverge above it.',
  height: 290,
});

const fig2 = chart({
  title: 'What the paper’s sample numbers really deliver', xLabel: 'Sampling scale (m)', yLabel: 'Margin of error (± % of mean)',
  series: [
    { name: 'Margin from the paper’s n', kind: 'line', x: SCALE, y: rows.map((r) => r.margin) },
    { name: 'Margin from the paper’s n', noLegend: true, kind: 'dots', size: 4, x: SCALE, y: rows.map((r) => r.margin), colour: 'var(--c-blog)' },
    { name: 'The ±10 % they aimed at', kind: 'line', dash: '5 4', x: [2, 160], y: [10, 10], colour: 'var(--c-tools)' },
  ],
  xDomain: [0, 165], yDomain: [0, 70],
  desc: 'The margin of error that the paper’s own sample numbers give at each scale, worked out as t times CV over the square root of n. Every scale lands wider than the 10 percent target, from 13 percent at 10 m to 24 percent at 160 m, and 66 percent at 2 m where only two samples are taken.',
  height: 280,
});

console.log(JSON.stringify(rows, null, 1));
console.log('spacing for 42 nodes on 160 m square:', spacingForN(160 * 160, 42, 'square').toFixed(2), 'm; for 235 nodes:', spacingForN(160 * 160, 235, 'square').toFixed(2), 'm');
console.log('spacing for 13 nodes on the 55 m square:', spacingForN(55 * 55, 13, 'square').toFixed(2), 'm');
console.log('5 m square grid, chance of hitting a round patch of radius 3 m:', hotspotP(3, 5, 'square').toFixed(3), ' radius 2 m:', hotspotP(2, 5, 'square').toFixed(3));
console.log('widest 95 % spacing for a 10 m patch:', spacingFor(10, 0.95, 'square').toFixed(2), 'm');

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'cv', figure(fig1, 'Figure 1. Samples needed to pin a mean within ±10 % at 95 % confidence, against the coefficient of variation, from the Field sampling planner’s own function. The dashed line is the paper’s fitted rule Rn = 55.10 × CV and the dots are its six measured scales. Classical theory rises with the square of CV, so the two rules part company above CV 0.15.'));
  md = inject(md, 'margin', figure(fig2, 'Figure 2. The margin of error the paper’s own sample numbers buy at each scale (t × CV ÷ √n with its published CV), against the ±10 % it aimed at. Worked out by us from the paper’s stated values, not a figure from the paper.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
