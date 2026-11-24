// Figures and numbers for src/blog/discoveries/transdiagnostic-inventory-alpha-inter-item-correlation.md,
// made with the maths of the Questionnaire scorer (src/lib/sci/questionnaire.ts and src/lib/sci/reliability.ts).
// Run: node scripts/blog-figures/transdiagnostic-inventory-alpha-inter-item-correlation.mjs
import fs from 'node:fs';
import { scoreScales, parseItems } from '../../src/lib/sci/questionnaire.ts';
import { cronbach } from '../../src/lib/sci/reliability.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/transdiagnostic-inventory-alpha-inter-item-correlation.md', import.meta.url);

// Values stated in the paper's reliability tables: Blais, Cai, Adam and Correll (2026), Frontiers in
// Psychology 17, doi:10.3389/fpsyg.2026.1917064 (CC BY 4.0). Ten of its 23 scales, spanning the range.
// [name, number of items k, Cronbach's alpha, mean inter-item correlation]
const SCALES = [
  ['Depression', 6, 0.89, 0.59], ['Anxiety', 7, 0.91, 0.61], ['Social anxiety', 4, 0.91, 0.71],
  ['Traumatic stress', 4, 0.74, 0.42], ['Impulsivity', 5, 0.75, 0.38], ['Antisocial actions', 5, 0.68, 0.33],
  ['Treatment attitude', 4, 0.66, 0.29], ['TED', 21, 0.87, 0.56], ['TBD', 22, 0.77, 0.39], ['TTD', 17, 0.79, 0.25],
];

// ---- An exact k-item scale with a given mean inter-item correlation -------------------------------------
// Sylvester Hadamard columns are mean-zero, equal-variance and mutually orthogonal, so
// X_j = sqrt(r)·f + sqrt(1 − r)·e_j has variance 1 and correlation exactly r between any two items.
// The tool's own cronbach() then returns rbar = r and its standardised alpha with no sampling noise.
function hadamard(n) {
  let H = [[1]];
  while (H.length < n) H = [...H.map((r) => [...r, ...r]), ...H.map((r) => [...r, ...r.map((v) => -v)])];
  return H;
}
const H32 = hadamard(32);
function exactScale(k, r) { // 32 rows (people) × k items with mean inter-item correlation r
  const f = H32.map((row) => row[1]);
  return H32.map((row, i) => Array.from({ length: k }, (_, j) => Math.sqrt(r) * f[i] + Math.sqrt(1 - r) * row[j + 2]));
}
const alphaOf = (k, r) => cronbach(exactScale(k, r)).std; // the tool's standardised alpha
const impliedR = (a, k) => a / (k - a * (k - 1)); // invert it: the r̄ that alpha implies

// ---- Check 1: does each printed alpha match the printed mean inter-item correlation? --------------------
const rows = SCALES.map(([name, k, alpha, rbar]) => {
  const c = cronbach(exactScale(k, rbar));
  return { name, k, alpha, rbar, rbarBack: +c.rbar.toFixed(4), fromR: +c.std.toFixed(4), gap: +(c.std - alpha).toFixed(4), rNeeded: +impliedR(alpha, k).toFixed(3) };
});
console.log('check 1');
for (const r of rows) console.log(`${r.name.padEnd(20)} k=${String(r.k).padStart(2)} alpha=${r.alpha} rbar=${r.rbar} -> tool alpha ${r.fromR.toFixed(3)} (gap ${r.gap >= 0 ? '+' : ''}${r.gap.toFixed(3)}), alpha implies rbar ${r.rNeeded}`);

// ---- Check 2: score a simulated six-item scale with the real scorer -------------------------------------
// A one-factor model, 640 people (the paper's reference sample), loading sqrt(0.59) so that the mean
// inter-item correlation is 0.59 before rounding; answers rounded to a 1-to-5 scale as the inventory uses.
let seed = 1917064;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const N = 640, K = 6, LOAD = Math.sqrt(0.59);
const latent = Array.from({ length: N }, () => gauss());
const clamp5 = (z) => Math.min(5, Math.max(1, Math.round(3 + z * 1.1)));
const X = latent.map((f) => Array.from({ length: K }, () => clamp5(LOAD * f + Math.sqrt(1 - LOAD * LOAD) * gauss())));
const names = Array.from({ length: K }, (_, j) => `I${j + 1}`);
const scale = [{ name: 'Depression-like', items: parseItems('I1-I6', names) }];
const opt = { min: 1, max: 5, reverse: [], method: 'sum', minAnswered: 0.75 };
const sim = scoreScales(X, scale, opt)[0];
const simC = cronbach(X);
console.log('check 2: alpha', sim.alpha.toFixed(3), 'CI', sim.alphaCi.map((v) => v.toFixed(3)).join(' to '), 'n', sim.alphaN,
  'mean', sim.mean.toFixed(2), 'sd', sim.sd.toFixed(2), 'lo', sim.lo, 'hi', sim.hi, 'rbar', simC.rbar.toFixed(3), 'std', simC.std.toFixed(3));

// ---- Check 3: what forgetting to reverse-key costs ------------------------------------------------------
// Flip m of the six items in the data (as a questionnaire with m reverse-worded items would record them),
// then score without and with the reverse list.
const flipped = (m) => X.map((r) => r.map((v, j) => (j < m ? 6 - v : v)));
const miskey = [0, 1, 2, 3].map((m) => {
  const Xm = flipped(m), rev = Array.from({ length: m }, (_, j) => j);
  return { m, wrong: scoreScales(Xm, scale, opt)[0].alpha, right: scoreScales(Xm, scale, { ...opt, reverse: rev })[0].alpha };
});
console.log('check 3', miskey.map((d) => `${d.m}: wrong ${d.wrong.toFixed(3)} right ${d.right.toFixed(3)}`).join(' | '));

// ---- Figures -------------------------------------------------------------------------------------------
const long = rows.filter((r) => r.k > 10), short = rows.filter((r) => r.k <= 10);
const fig1 = chart({
  title: 'Printed alpha against alpha from k and r̄', xLabel: "The paper's Cronbach alpha", yLabel: 'Alpha from its k and r̄',
  series: [
    { name: 'Short scales (4 to 7 items)', kind: 'dots', x: short.map((r) => r.alpha), y: short.map((r) => r.fromR), size: 4 },
    { name: 'Long composites (17 to 22)', kind: 'dots', x: long.map((r) => r.alpha), y: long.map((r) => r.fromR), size: 4 },
    { name: '', noLegend: true, kind: 'line', x: [0.6, 1], y: [0.6, 1], colour: 'var(--muted)', dash: '4 4' },
  ],
  xDomain: [0.6, 1], yDomain: [0.6, 1],
  desc: 'Each scale of the inventory: the Cronbach alpha printed in the paper on the x-axis, the alpha that follows from the same row\'s item count and mean inter-item correlation on the y-axis. The short clinical scales sit on the dashed line of equality; the three long composites sit far above it.',
  height: 280,
});
const KS = Array.from({ length: 29 }, (_, i) => i + 2);
const ted = rows.find((r) => r.name === 'TED');
const fig2 = chart({
  title: 'How alpha grows with the number of items', xLabel: 'Items in the scale (k)', yLabel: 'Standardised alpha',
  series: [
    { name: 'r̄ = 0.56 (printed)', kind: 'line', x: KS, y: KS.map((k) => +alphaOf(k, 0.56).toFixed(4)) },
    { name: 'r̄ = 0.24 (implied)', kind: 'line', x: KS, y: KS.map((k) => +alphaOf(k, 0.242).toFixed(4)) },
    { name: 'TED as printed', kind: 'dots', x: [ted.k], y: [ted.alpha], size: 5, colour: 'var(--ink)' },
  ],
  xDomain: [2, 30], yDomain: [0, 1], hlines: [{ y: 0.7, text: '0.70' }],
  desc: 'Standardised alpha against the number of items for two mean inter-item correlations, 0.56 and 0.24, with the paper\'s 21-item TED composite marked at its printed alpha of 0.87. At 21 items a mean correlation of 0.56 would give 0.96.',
  height: 280,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'identity', figure(fig1, 'Figure 1. For ten of the inventory\'s scales: the Cronbach alpha the paper prints (across) against the alpha that the same row\'s item count and mean inter-item correlation give through the tool\'s standardised alpha (up). The dashed line is equality. The short clinical scales land on it; the long transdiagnostic composites do not.'));
  md = inject(md, 'kcurve', figure(fig2, 'Figure 2. The tool\'s standardised alpha against the number of items, for a mean inter-item correlation of 0.56 (the value printed for the TED composite) and 0.24 (the value its printed alpha implies). The dot is TED as printed: 21 items, alpha 0.87.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
