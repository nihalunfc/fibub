// Figures for src/blog/discoveries/bmdrc-benchmark-dose-zebrafish-python.md, made with the maths of the
// BMD calculator (src/lib/sci/bmd.ts).
// Run: node scripts/blog-figures/bmdrc-benchmark-dose-zebrafish-python.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { fitAll, fitModel, checkGroups, MODEL_NAMES } from '../../src/lib/sci/bmd.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/bmdrc-benchmark-dose-zebrafish-python.md', import.meta.url);

// Our own made-up zebrafish-style screen: 7 concentrations, 32 embryos each, counted for one malformation.
// Not the paper's data. Concentrations in micromolar, doubling each step as plate dilutions usually do.
const GROUPS = [[0, 32, 1], [1, 32, 1], [2, 32, 2], [4, 32, 4], [8, 32, 9], [16, 32, 19], [32, 32, 29]]
  .map(([dose, n, r]) => ({ dose, n, r }));
const BMR = 0.1;
const o = fitAll(GROUPS, BMR, 2);
const rows = o.fits.map((f) => ({ id: f.id, name: f.name, bmd: +f.bmd.toFixed(3), bmdl: +f.bmdl.toFixed(3), ratio: +(f.bmd / f.bmdl).toFixed(2), p: +f.pValue.toFixed(3), aic: +f.aic.toFixed(2) }));

// Figure 1: the data with Wilson-free simple fractions and all five fitted curves.
const xs = Array.from({ length: 161 }, (_, i) => +(i * 0.2).toFixed(2));
const fig1 = chart({
  title: 'Five models fitted to one made-up embryo screen', xLabel: 'Concentration (µM)', yLabel: 'Fraction affected',
  series: [
    { name: 'Counted fractions', kind: 'dots', x: GROUPS.map((g) => g.dose), y: GROUPS.map((g) => +(g.r / g.n).toFixed(4)), size: 4 },
    ...o.fits.slice(0, 3).map((f, i) => ({ name: f.name, kind: 'line', x: xs, y: xs.map((d) => +f.curve(d).toFixed(4)), dash: i === 2 ? '4 3' : undefined })),
  ],
  xDomain: [0, 32], yDomain: [0, 1],
  vlines: [{ x: o.lowest.bmd, text: 'BMD' }, { x: o.lowest.bmdl, text: 'BMDL', left: true, dy: 14 }],
  desc: `Seven concentrations of 32 embryos each. The best-fitting model (${o.lowest.name}) gives a benchmark dose of ${o.lowest.bmd.toFixed(2)} micromolar with a lower limit of ${o.lowest.bmdl.toFixed(2)}.`, height: 290,
});

// Figure 2: BMD and BMDL for each model, and how the BMD moves with the benchmark response.
const BMRS = [0.01, 0.025, 0.05, 0.1, 0.2];
const curveFor = (id) => BMRS.map((b) => +fitModel(id, checkGroups(GROUPS), b, 2).bmd.toFixed(3));
const byBmr = { weibull: curveFor('weibull'), loglogistic: curveFor('loglogistic'), multistage: curveFor('multistage') };
const fig2 = chart({
  title: 'The benchmark dose depends on the benchmark response', xLabel: 'Benchmark response (% extra risk)', yLabel: 'BMD (µM)',
  series: Object.entries(byBmr).map(([id, y], i) => ({ name: MODEL_NAMES[id], kind: 'line', x: BMRS.map((b) => b * 100), y, dash: i === 2 ? '4 3' : undefined })),
  xDomain: [0, 20], yDomain: [0, 10],
  desc: 'At 1 % extra risk the three models disagree by a factor of about two; by 10 % they nearly agree. Low benchmark responses lean harder on the shape of the model.', height: 270,
});

console.log(JSON.stringify({ rows, lowest: o.lowest.id, byBmr, bmrs: BMRS.map((b) => b * 100) }, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'fits', figure(fig1, 'Figure 1. Our own made-up screen (seven concentrations, 32 embryos each) with three of the five models the BMD calculator fits. The lines are maximum-likelihood fits; the vertical lines are the benchmark dose and its lower limit for the model with the lowest AIC.'));
  md = inject(md, 'bmr', figure(fig2, 'Figure 2. The same data refitted at five benchmark responses. The models agree near 10 % extra risk and spread apart below it, which is why guidance warns against reading a benchmark dose far below the doses actually tested.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
