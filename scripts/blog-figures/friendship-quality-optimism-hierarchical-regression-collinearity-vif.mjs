// Figures for src/blog/discoveries/friendship-quality-optimism-hierarchical-regression-collinearity-vif.md,
// made with the maths of the Regression workbench (src/lib/sci/regression.ts: readTable, design, ols, vif).
// Run: node scripts/blog-figures/friendship-quality-optimism-hierarchical-regression-collinearity-vif.mjs
import fs from 'node:fs';
import { readTable, design, ols } from '../../src/lib/sci/regression.ts';
import { fSf, tInv } from '../../src/lib/sci/stats.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/friendship-quality-optimism-hierarchical-regression-collinearity-vif.md', import.meta.url);

// Values printed by the paper: Jawarneh et al. (2026), Front. Educ. 11: 1904929 (CC BY 4.0).
const N = 450, K = 10, R2 = 0.333, R2a = 0.046; // predictors: gender, 3 year dummies, 6 friendship dimensions
// Each row: name, short name, B, SE(B), beta, reported VIF.
const ROWS = [
  ['Stimulating companionship', 'Company', 0.041, 0.060, 0.035, 4.105],
  ['Help', 'Help', 0.057, 0.071, 0.044, 4.136],
  ['Intimacy', 'Intimacy', 0.068, 0.065, 0.054, 3.102],
  ['Reliable alliance', 'Alliance', 0.455, 0.032, 0.730, 4.964],
  ['Self-validation', 'Self-val.', -0.012, 0.058, -0.010, 3.919],
  ['Emotional security', 'Security', 0.043, 0.068, 0.034, 4.983],
];

// 1. The model-fit statistics that follow from the two R squared values alone.
const adj = 1 - ((N - 1) / (N - K - 1)) * (1 - R2);
const Fall = (R2 / K) / ((1 - R2) / (N - K - 1));
const Fchg = ((R2 - R2a) / 6) / ((1 - R2) / (N - K - 1));
const Fblock1 = (R2a / 4) / ((1 - R2a) / (N - 5));

// 2. The standard-error / VIF identity for standardised coefficients:
//    var(beta_j) = (1 - R2) / (N - K - 1) * VIF_j.
const base = Math.sqrt((1 - R2) / (N - K - 1));
const rows = ROWS.map(([name, short, B, seB, beta, vifRep]) => {
  const seBeta = seB * Math.abs(beta / B); // SD(x)/SD(y) = beta/B, so SE(beta) = SE(B) * beta/B
  return {
    name, short, B, seB, beta, vifRep,
    seBeta, vifImplied: (seBeta / base) ** 2,
    seExpected: base * Math.sqrt(vifRep),
    t: beta / seBeta,
    ciPub: [beta - tInv(0.975, N - K - 1) * seBeta, beta + tInv(0.975, N - K - 1) * seBeta],
    ciVif: [beta - tInv(0.975, N - K - 1) * base * Math.sqrt(vifRep), beta + tInv(0.975, N - K - 1) * base * Math.sqrt(vifRep)],
    tVif: beta / (base * Math.sqrt(vifRep)),
  };
});

// 3. The same identity, shown on data, with the tool's own functions: six correlated predictors, n = 450.
//    One common factor with loading L gives every predictor the same variance inflation; L is tuned to land
//    near the paper's average VIF. The data are OUR simulation, only to show that the tool obeys the identity.
let seed = 1904929; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
function demo(load) {
  const lines = ['optimism,x1,x2,x3,x4,x5,x6'];
  for (let i = 0; i < N; i++) {
    const f = gauss(), xs = Array.from({ length: 6 }, () => Math.sqrt(load) * f + Math.sqrt(1 - load) * gauss());
    const y = 0.74 * xs[3] + 0.78 * gauss(); // one dominant dimension, like the paper's reliable alliance
    lines.push([y, ...xs].map((v) => v.toFixed(4)).join(','));
  }
  const t = readTable(lines.join('\n'));
  const f = ols(design(t, { kind: 'linear', y: 'optimism', xs: ['x1', 'x2', 'x3', 'x4', 'x5', 'x6'], intercept: true }));
  const sdY = Math.sqrt(f.sst / (N - 1));
  const b = f.coefs.slice(1).map((c, j) => {
    const col = t.rows.map((r) => +r[j + 1]), m = col.reduce((s, v) => s + v, 0) / N;
    const sdX = Math.sqrt(col.reduce((s, v) => s + (v - m) ** 2, 0) / (N - 1));
    return { name: c.name, vif: c.vif, beta: c.est * (sdX / sdY), seBeta: c.se * (sdX / sdY), t: c.stat };
  });
  const bs = Math.sqrt((1 - f.r2) / (N - 7));
  return { r2: f.r2, F: f.F, b: b.map((x) => ({ ...x, sePredicted: bs * Math.sqrt(x.vif) })) };
}
const D = demo(0.78);

// Charts.
const VIFS = Array.from({ length: 111 }, (_, i) => 1 + i * 0.04);
const fig1 = chart({
  title: 'What a standard error says about collinearity',
  xLabel: 'Variance inflation factor (VIF)', yLabel: 'Standard error of the standardised coefficient',
  series: [
    { name: 'Identity at n = 450, 10 predictors, R² = 0.333', kind: 'line', x: VIFS, y: VIFS.map((v) => +(base * Math.sqrt(v)).toFixed(5)) },
    { name: 'Published: SE at the published VIF', kind: 'dots', x: rows.map((r) => r.vifRep), y: rows.map((r) => +r.seBeta.toFixed(5)), size: 3.5 },
  ],
  xDomain: [1, 5.4], yDomain: [0.03, 0.095],
  desc: 'Standard error of a standardised coefficient against its variance inflation factor, at the sample size and R squared of the paper. The six published coefficients sit well below the line: their standard errors correspond to variance inflation factors near 1.7, not the 3.1 to 5.0 in the collinearity table.',
  height: 285,
});

const idx = rows.map((_, i) => i + 1);
const fig2 = chart({
  title: 'The six friendship dimensions, two sets of error bars',
  xLabel: 'Friendship dimension', yLabel: 'Standardised coefficient (β) on optimism',
  series: [
    { name: 'As published', kind: 'dots', x: idx.map((i) => i - 0.09), y: rows.map((r) => +r.beta.toFixed(3)), errors: rows.map((r) => +(tInv(0.975, 439) * r.seBeta).toFixed(4)), size: 3 },
    { name: 'At the published VIFs', kind: 'dots', x: idx.map((i) => i + 0.09), y: rows.map((r) => +r.beta.toFixed(3)), errors: rows.map((r) => +(tInv(0.975, 439) * base * Math.sqrt(r.vifRep)).toFixed(4)), size: 3 },
  ],
  xDomain: [0.6, 6.4], yDomain: [-0.2, 0.9], xTicks: idx, xFmt: (t) => rows[t - 1].short,
  hlines: [{ y: 0, text: '' }],
  desc: 'The six standardised coefficients with 95 per cent intervals as published and as the published variance inflation factors imply. Reliable alliance stays far from zero either way; the other five stay close to it.',
  height: 290,
});

console.log(JSON.stringify({
  fit: { adj: +adj.toFixed(4), Fall: +Fall.toFixed(3), pAll: fSf(Fall, 10, 439).toExponential(2), Fchg: +Fchg.toFixed(3), pChg: fSf(Fchg, 6, 439).toExponential(2), Fblock1: +Fblock1.toFixed(3) },
  base: +base.toFixed(5),
  rows: rows.map((r) => ({ n: r.short, beta: r.beta, seBeta: +r.seBeta.toFixed(4), t: +r.t.toFixed(2), vifRep: r.vifRep, vifImplied: +r.vifImplied.toFixed(2), seExpected: +r.seExpected.toFixed(4), tVif: +r.tVif.toFixed(2), ciPub: r.ciPub.map((v) => +v.toFixed(3)), ciVif: r.ciVif.map((v) => +v.toFixed(3)) })),
  demo: { r2: +D.r2.toFixed(4), F: +D.F.toFixed(2), b: D.b.map((x) => ({ n: x.name, vif: +x.vif.toFixed(3), beta: +x.beta.toFixed(3), se: +x.seBeta.toFixed(4), sePredicted: +x.sePredicted.toFixed(4), t: +x.t.toFixed(2) })) },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'identity', figure(fig1, 'Figure 1. The fixed relationship between a standardised coefficient\'s standard error and its variance inflation factor, at this study\'s sample size and R squared (line), with the paper\'s six published standard errors plotted at their published VIFs (dots).'));
  md = inject(md, 'coefs', figure(fig2, 'Figure 2. The six standardised coefficients. Left bars: the intervals implied by the published standard errors. Right bars: the wider intervals implied by the published variance inflation factors.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
