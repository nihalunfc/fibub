// Figures for src/blog/discoveries/preschool-waist-to-height-ratio-050-vs-waist-percentile-agreement-rome.md, made with the
// maths of the Anthropometric indices tool (src/lib/sci/anthro.ts: indices, summary) and the Diagnostic test calculator
// (src/lib/sci/diagtest.ts: fromTable), plus normCdf from src/lib/sci/distributions.ts.
// Run: node scripts/blog-figures/preschool-waist-to-height-ratio-050-vs-waist-percentile-agreement-rome.mjs
import fs from 'node:fs';
import { indices } from '../../src/lib/sci/anthro.ts';
import { fromTable } from '../../src/lib/sci/diagtest.ts';
import { normCdf } from '../../src/lib/sci/distributions.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/preschool-waist-to-height-ratio-050-vs-waist-percentile-agreement-rome.md', import.meta.url);

// Inputs from the paper: Spiezia et al. (2026), Front. Pediatr. 14: 1885267, doi:10.3389/fped.2026.1885267 (CC BY 4.0).
// 1,518 children aged 3 to 5 in Lazio, Italy. WHtR mean and SD by BMI group, and the share at or above 0.50 (Table 1);
// the 2 x 2 counts of WHtR >= 0.50 against the Fernandez 90th percentile of waist circumference (Table 3).
const G = [
  { id: 'Normal weight', n: 950, m: 0.487, sd: 0.032, ge50: 304, both: 16, fOnly: 2, wOnly: 288, neg: 644, kappaPaper: null },
  { id: 'At risk of overweight', n: 261, m: 0.524, sd: 0.030, ge50: 212, both: 28, fOnly: 1, wOnly: 184, neg: 48 },
  { id: 'Overweight', n: 206, m: 0.521, sd: 0.037, ge50: 149, both: 39, fOnly: 1, wOnly: 110, neg: 56 },
  { id: 'Obesity', n: 101, m: 0.558, sd: 0.049, ge50: 92, both: 58, fOnly: 1, wOnly: 34, neg: 8 },
];
const N = G.reduce((s, g) => s + g.n, 0);
const wMean = G.reduce((s, g) => s + g.n * g.m, 0) / N;
// Total variance = within-group variance + between-group variance (n - 1 weights for the within part).
const within = G.reduce((s, g) => s + (g.n - 1) * g.sd ** 2, 0), between = G.reduce((s, g) => s + g.n * (g.m - wMean) ** 2, 0);
const pooledSd = Math.sqrt((within + between) / (N - 1));
const kappa = (a, b, c, d) => { const n = a + b + c + d, po = (a + d) / n, pe = ((a + b) * (a + c) + (c + d) * (b + d)) / (n * n); return (po - pe) / (1 - pe); };
G.forEach((g) => {
  g.normalShare = 1 - normCdf((0.5 - g.m) / g.sd);        // share at or above 0.50 if WHtR were normal
  g.seen = g.ge50 / g.n;
  g.sumOk = g.both + g.fOnly + g.wOnly + g.neg === g.n;
  g.t = fromTable(g.both, g.wOnly, g.fOnly, g.neg, 'wilson'); // reference = Fernandez P90; test = WHtR >= 0.50
  g.kappa = kappa(g.both, g.wOnly, g.fOnly, g.neg);
});
const all = G.reduce((s, g) => ({ both: s.both + g.both, fOnly: s.fOnly + g.fOnly, wOnly: s.wOnly + g.wOnly, neg: s.neg + g.neg }), { both: 0, fOnly: 0, wOnly: 0, neg: 0 });
const tAll = fromTable(all.both, all.wOnly, all.fOnly, all.neg, 'wilson'), kAll = kappa(all.both, all.wOnly, all.fOnly, all.neg);

// What WHtR 0.50 means in centimetres. Heights of 95, 100, 105 and 110 cm are OUR assumption for 3 to 5 year olds.
const cm = [95, 100, 105, 110].map((h) => ({ h, w50: 0.5 * h, check: indices({ height: h, waist: 0.5 * h }).find((r) => r.def.key === 'whtr').value }));

const fig1 = chart({
  title: 'Share at WHtR 0.50 or more: seen against a bell curve', xLabel: 'BMI group (1 = normal weight to 4 = obesity)', yLabel: 'Share of children (%)',
  series: [
    { name: 'Seen (paper)', kind: 'dots', x: [1, 2, 3, 4], y: G.map((g) => +(g.seen * 100).toFixed(1)), size: 5, colour: 'var(--ink)' },
    { name: 'Bell curve from mean and SD', kind: 'dots', x: [1, 2, 3, 4], y: G.map((g) => +(g.normalShare * 100).toFixed(1)), size: 5, colour: 'var(--c-tools)' },
  ],
  xDomain: [0.5, 4.5], xTicks: [1, 2, 3, 4], yDomain: [0, 100],
  desc: `The share of children with a waist-to-height ratio of 0.50 or more in each BMI group, as counted (${G.map((g) => (g.seen * 100).toFixed(1)).join(', ')} %) and as a bell curve with the group's mean and SD would predict (${G.map((g) => (g.normalShare * 100).toFixed(1)).join(', ')} %).`, height: 270,
});
const fig2 = chart({
  title: 'WHtR 0.50 against the waist 90th percentile', xLabel: 'BMI group (1 = normal weight to 4 = obesity)', yLabel: 'Percent',
  series: [
    { name: 'Catches the percentile\'s positives', kind: 'dots', x: [1, 2, 3, 4], y: G.map((g) => +(g.t.get('sens').est * 100).toFixed(1)), size: 5, colour: 'var(--ink)' },
    { name: 'Clears the percentile\'s negatives', kind: 'dots', x: [1, 2, 3, 4], y: G.map((g) => +(g.t.get('spec').est * 100).toFixed(1)), size: 5, colour: 'var(--c-tools)' },
  ],
  xDomain: [0.5, 4.5], xTicks: [1, 2, 3, 4], yDomain: [0, 100],
  desc: `Treating the waist 90th percentile as the reference, WHtR 0.50 catches ${G.map((g) => (g.t.get('sens').est * 100).toFixed(0)).join(', ')} % of its positives but clears only ${G.map((g) => (g.t.get('spec').est * 100).toFixed(0)).join(', ')} % of its negatives, by BMI group.`, height: 270, width: 560,
});

const r = (v, d = 3) => +v.toFixed(d);
const out = {
  N, wMean: r(wMean, 4), pooledSd: r(pooledSd, 4), within: r(within, 4), between: r(between, 4),
  groups: G.map((g) => ({ id: g.id, sumOk: g.sumOk, seen: r(g.seen * 100, 1), normal: r(g.normalShare * 100, 1), sens: r(g.t.get('sens').est * 100, 1), spec: r(g.t.get('spec').est * 100, 1), ppv: r(g.t.get('ppv').est * 100, 1), kappa: r(g.kappa), sensCI: g.t.get('sens').ci.map((v) => r(v * 100, 1)), specCI: g.t.get('spec').ci.map((v) => r(v * 100, 1)) })),
  all: { ...all, n: all.both + all.fOnly + all.wOnly + all.neg, sens: r(tAll.get('sens').est * 100, 1), spec: r(tAll.get('spec').est * 100, 1), ppv: r(tAll.get('ppv').est * 100, 1), kappa: r(kAll), wFlag: all.both + all.wOnly, fFlag: all.both + all.fOnly, fShare: r((all.both + all.fOnly) / N * 100, 1), wShare: r((all.both + all.wOnly) / N * 100, 1) },
  cm, w60: [95, 100, 105, 110].map((h) => 0.6 * h),
};
console.log(JSON.stringify(out));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'normal', figure(fig1, 'Figure 1. Share of children at a waist-to-height ratio of 0.50 or more in each BMI group: counted (black) and predicted from the group mean and SD with a bell curve (blue).'));
  md = inject(md, 'agree', figure(fig2, 'Figure 2. Treating the waist-circumference 90th percentile as the reference: the share of its positives that WHtR 0.50 also flags (black) and the share of its negatives that WHtR clears (blue), by BMI group.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
