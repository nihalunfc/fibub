// Figures and numbers for src/blog/discoveries/seoul-precipitation-triple-oxygen-excess-per-meg-lambda-0528-recomputed.md,
// made with the maths of the Isotope delta converter (src/lib/sci/delta.ts: capDelta17, deltaPrime).
// Run: node scripts/blog-figures/seoul-precipitation-triple-oxygen-excess-per-meg-lambda-0528-recomputed.mjs
import fs from 'node:fs';
import { capDelta17, deltaPrime } from '../../src/lib/sci/delta.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/seoul-precipitation-triple-oxygen-excess-per-meg-lambda-0528-recomputed.md', import.meta.url);

// Stated in the paper (facts): precipitation-weighted monthly means (permil): d17O -3.74, d18O -7.11, d2H -45.2,
// d-excess 11.7, Delta'17O 18 per meg; sample range d18O +1.15 to -18.21; reference slope 0.528; Seoul line
// d'17O = 0.528 d'18O + 0.0208 permil; Cheongju line d'17O = 0.5283 d'18O + 0.0216 permil; analytical 1-sigma for
// d17O 0.01, d18O 0.07 permil and Delta'17O reproducibility 9 per meg.
const MEAN = { d17: -3.74, d18: -7.11, d2H: -45.2, dex: 11.7, cap: 18 };
const SEOUL = { a: 0.528, b: 0.0208 }, CHEONGJU = { a: 0.5283, b: 0.0216 };
const d17OnLine = (line, d18) => 1000 * Math.expm1((line.a * deltaPrime(d18) + line.b) / 1000); // delta from the delta' line
const perMeg = (x) => x * 1000;
const D18 = Array.from({ length: 40 }, (_, i) => -18.5 + (i * 20) / 39);

const f = (x, d = 2) => +x.toFixed(d);
const out = {
  meanCap_0528: f(perMeg(capDelta17(MEAN.d17, MEAN.d18, 0.528)), 1),
  meanCap_05283: f(perMeg(capDelta17(MEAN.d17, MEAN.d18, 0.5283)), 1),
  dPrime17: f(deltaPrime(MEAN.d17), 4), dPrime18: f(deltaPrime(MEAN.d18), 4),
  dexcessOfMeans: f(MEAN.d2H - 8 * MEAN.d18, 2),
  rounding: { d17_plus001: f(perMeg(capDelta17(MEAN.d17 + 0.005, MEAN.d18, 0.528)) - perMeg(capDelta17(MEAN.d17, MEAN.d18, 0.528)), 1) },
  lambdaShiftAtMean_per0001: f(perMeg(capDelta17(MEAN.d17, MEAN.d18, 0.5281) - capDelta17(MEAN.d17, MEAN.d18, 0.528)), 2),
  lambdaShift_0528_to_05283: Object.fromEntries([-18.21, -7.11, 1.15].map((d) => [d, f(perMeg(capDelta17(d17OnLine(SEOUL, d), d, 0.5283) - capDelta17(d17OnLine(SEOUL, d), d, 0.528)), 2)])),
  seoulVsCheongju: Object.fromEntries([-18.21, -14.25, -7.11, 1.15].map((d) => [d, { seoul: f(perMeg(capDelta17(d17OnLine(SEOUL, d), d, 0.528)), 1), cheongju: f(perMeg(capDelta17(d17OnLine(CHEONGJU, d), d, 0.528)), 1) }])),
  independentErrors: f(Math.hypot(0.01 * 1000, 0.528 * 0.07 * 1000), 1),
  d18AloneIn_perMeg: f(0.528 * 0.07 * 1000, 1),
};
console.log(JSON.stringify(out, null, 1));

const fig1 = chart({
  title: 'Two published lines, same reference slope', xLabel: 'δ¹⁸O (‰ VSMOW)', yLabel: 'Δ′¹⁷O (per meg), λ = 0.528',
  desc: 'Triple-oxygen excess against delta-18-O along the Seoul regression line and the Cheongju regression line, both expressed with the 0.528 reference slope. The lines differ by about one per meg near the mean and by about five per meg at the lightest samples.',
  series: [
    { name: 'Seoul line', x: D18, y: D18.map((d) => perMeg(capDelta17(d17OnLine(SEOUL, d), d, 0.528))), kind: 'line', colour: 'var(--c-blog)' },
    { name: 'Cheongju line', x: D18, y: D18.map((d) => perMeg(capDelta17(d17OnLine(CHEONGJU, d), d, 0.528))), kind: 'line', colour: 'var(--c-tools)' },
    { name: 'monthly mean (paper)', x: [MEAN.d18], y: [perMeg(capDelta17(MEAN.d17, MEAN.d18, 0.528))], kind: 'dots', size: 5, colour: 'var(--ink)' },
  ], xDomain: [-19, 2], yDomain: [10, 30],
});
const fig2 = chart({
  title: 'What the choice of λ does to Δ′¹⁷O', xLabel: 'δ¹⁸O (‰ VSMOW)', yLabel: 'Δ′¹⁷O (per meg)',
  desc: 'The same Seoul line, with the excess worked out using four reference slopes. A slope 0.001 higher raises the excess by about seven per meg at the mean and by about eighteen per meg at the lightest samples.',
  series: [0.527, 0.528, 0.5283, 0.529].map((lam, i) => ({ name: 'λ = ' + lam, x: D18, y: D18.map((d) => perMeg(capDelta17(d17OnLine(SEOUL, d), d, lam))), kind: 'line', colour: ['var(--muted)', 'var(--c-blog)', 'var(--c-tools)', 'var(--ink)'][i], dash: i === 0 ? '4 3' : i === 3 ? '2 3' : undefined })),
  xDomain: [-19, 2], yDomain: [0, 45],
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'lines', figure(fig1, 'Figure 1. Δ′¹⁷O along the Seoul regression line and the Cheongju regression line, both worked out with the 0.528 reference slope by the isotope delta converter. They agree within about 1.3 per meg at the mean δ¹⁸O of −7.1 ‰ and drift apart toward the lightest samples.'));
  md = inject(md, 'lambda', figure(fig2, 'Figure 2. The Seoul line with Δ′¹⁷O worked out using four reference slopes. The line is flat at λ = 0.528 by construction; any other slope tilts it by δ′¹⁸O times the change in λ.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
