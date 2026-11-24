// Figures for src/blog/discoveries/polypay-ewe-mature-weight-growth-curve.md, made with the maths of the Growth
// tracker (src/lib/sci/growth.ts: fitGrowth, MODELS, gains).
// Run: node scripts/blog-figures/polypay-ewe-mature-weight-growth-curve.mjs
import fs from 'node:fs';
import { fitGrowth, MODELS, gains } from '../../src/lib/sci/growth.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/polypay-ewe-mature-weight-growth-curve.md', import.meta.url);

// From the paper: Wilson, C. S. and Taylor, J. B. (2026), Frontiers in Animal Science 7: 1868093 (CC BY 4.0).
// Least-squares mean mid-lactation ewe weight (kg) at ages 1 to 8 years, 2,941 Polypay ewes, U.S. Sheep
// Experiment Station. Standard errors are 0.3 kg for ages 1 to 6, 0.4 at age 7 and 1.0 at age 8.
const AGE = [1, 2, 3, 4, 5, 6, 7, 8];
const W = [57.1, 64.9, 70.9, 73.2, 74.3, 74.2, 74.1, 78.6];
const SE = [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.4, 1.0];
const T = AGE.map((y) => y * 365); // the tool works in days

const IDS = ['gompertz', 'logistic', 'vonb'];
const at = (m, f, tDays) => MODELS[m].f(tDays, [f.A, f.b, f.k]);
const ageAt = (m, f, frac) => { let lo = -5 * 365, hi = 40 * 365; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; at(m, f, mid) < frac * f.A ? (lo = mid) : (hi = mid); } return (lo + hi) / 2 / 365; };

const fits = IDS.map((m) => {
  const f = fitGrowth(T, W, m);
  return { m, f, a95: ageAt(m, f, 0.95), a99: ageAt(m, f, 0.99), w0: at(m, f, 0), infl: f.inflT / 365 };
});
console.log('model      A ± SE        k            b        R2       AIC   infl (yr)  95 % of A  99 % of A  W at age 0');
for (const r of fits) console.log(`${r.m.padEnd(10)} ${r.f.A.toFixed(2)} ± ${r.f.se[0].toFixed(2)}  ${r.f.k.toExponential(3)}  ${r.f.b.toFixed(4)}  ${r.f.r2.toFixed(5)}  ${r.f.aic.toFixed(2)}  ${r.infl.toFixed(2).padStart(8)} ${r.a95.toFixed(2).padStart(10)} ${r.a99.toFixed(2).padStart(10)} ${r.w0.toFixed(1).padStart(11)}`);

// Without the age-8 point (the thinnest group: 1.0 kg standard error against 0.3 for the rest).
const fits7 = IDS.map((m) => { const f = fitGrowth(T.slice(0, 7), W.slice(0, 7), m); return { m, f, a95: ageAt(m, f, 0.95) }; });
for (const r of fits7) console.log(`ages 1-7 ${r.m.padEnd(10)} A ${r.f.A.toFixed(2)} ± ${r.f.se[0].toFixed(2)}, k ${r.f.k.toExponential(3)}, R2 ${r.f.r2.toFixed(5)}, 95 % of A at ${r.a95.toFixed(2)} yr`);

// Year-on-year gains, the tool's own `gains`.
const recs = AGE.map((y, i) => ({ animal: 'Polypay ewe', t: y * 365, w: W[i] }));
const G = gains(recs);
console.log('\ngains:', G.map((g) => `${g.from / 365}->${g.to / 365} yr: ${g.gain.toFixed(1)} kg (${(g.adg * 1000).toFixed(1)} g/day)`).join('; '));
console.log('overall ADG', ((W[7] - W[0]) / (T[7] - T[0])).toFixed(6), 'kg/day over', T[7] - T[0], 'days');

// How much data does the mature weight need? Fit ages 1..n for n = 4 to 8.
const grow = [];
for (let n = 4; n <= 8; n++) {
  const f = fitGrowth(T.slice(0, n), W.slice(0, n), 'gompertz');
  grow.push({ n, A: f.A, se: f.se[0], r2: f.r2, k: f.k });
  console.log(`ages 1-${n}: Gompertz A ${f.A.toFixed(2)} ± ${f.se[0].toFixed(2)} kg, k ${f.k.toExponential(3)}, R2 ${f.r2.toFixed(5)}`);
}

// --------------------------------------------------------------------------- charts
const tGrid = Array.from({ length: 121 }, (_, i) => (i * 10 * 365) / 120);
const fig1 = chart({
  title: 'When does a Polypay ewe reach mature weight?', xLabel: 'Ewe age (years)', yLabel: 'Mid-lactation weight (kg)',
  series: [
    ...fits.map((r) => ({ name: MODELS[r.m].name, kind: 'line', x: tGrid.map((t) => t / 365), y: tGrid.map((t) => +at(r.m, r.f, t).toFixed(2)) })),
    { name: 'Paper (least-squares means)', kind: 'dots', x: AGE, y: W, errors: SE, size: 3, colour: 'var(--ink)' },
  ],
  xDomain: [0, 10], yDomain: [40, 82],
  hlines: [{ y: +(0.95 * fits[0].f.A).toFixed(1), text: '95 % of mature weight' }],
  vlines: [{ x: +fits[0].a95.toFixed(2), text: `${fits[0].a95.toFixed(1)} yr` }],
  desc: 'The paper\'s eight mean weights with the three growth curves the tool fits. All three give a mature weight near 76 kg and 95 per cent of it before age four, and all three run to about 45 kg at age zero, which no lamb weighs.',
  height: 290,
});
const fig2 = chart({
  title: 'Mature weight from a shorter record', xLabel: 'Oldest age included in the fit (years)', yLabel: 'Fitted mature weight A (kg)',
  series: [{ name: 'Gompertz A ± 1 standard error', kind: 'dots', x: grow.map((g) => g.n), y: grow.map((g) => +g.A.toFixed(2)), errors: grow.map((g) => g.se), size: 3 }],
  xDomain: [3.5, 8.5], yDomain: [70, 82], xTicks: [4, 5, 6, 7, 8],
  hlines: [{ y: 74.9, text: 'ages 1 to 7 only' }],
  desc: 'Mature weight fitted to the weights up to each age, with its standard error. Cutting the record at age five already gives the same answer within one standard error; the heavy age-eight mean pulls it up by 1.5 kg.',
  height: 275,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'curve', figure(fig1, 'Figure 1. The paper\'s eight least-squares mean mid-lactation weights (error bars are its standard errors) and the three curves the Growth tracker fits to them. The curves agree with each other where there are data and diverge where there are none: all of them say a newborn Polypay weighs about 45 kg, which is the honest sign of an adult-only record.'));
  md = inject(md, 'need', figure(fig2, 'Figure 2. The same Gompertz fit using only the weights up to age four, five, six, seven and eight. The mature weight is settled by about age five; the age-eight mean, which comes from the fewest ewes, raises it by 1.5 kg.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
