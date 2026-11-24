// Figures for src/blog/discoveries/spectrophotometer-filter-uncertainty-budget.md, made with the maths of the
// Uncertainty propagation calculator (src/lib/sci/uncertainty.ts, GUM, with the same expression parser the tool uses).
// Run: node scripts/blog-figures/spectrophotometer-filter-uncertainty-budget.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { parse, compile, variables, splitName } from '../../src/lib/sci/expr.ts';
import { propagate, monteCarlo } from '../../src/lib/sci/uncertainty.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/spectrophotometer-filter-uncertainty-budget.md', import.meta.url);

// The budget as printed by the paper: Zarubica et al. (2025), EPJ Web Conf. 323: 10002 (CC BY 4.0).
// Every value is in absorbance units, one column per filter (FOL1, FOL2, FOL3), plus the paper's own
// combined standard uncertainty and expanded uncertainty at k = 2.
const COMP = ['sys', 'stab', 'homo', 'light', 'temp'];
const LABEL = { sys: 'Spectrophotometer', stab: 'One-year stability', homo: 'Filter homogeneity', light: 'Light exposure', temp: 'Temperature' };
const FILTERS = [
  { id: 'FOL1', sys: 0.00104, stab: 0.0104, homo: 0.0006, light: 0.0004, temp: 0.0017, ucPaper: 0.0106, UPaper: 0.0213 },
  { id: 'FOL2', sys: 0.00104, stab: 0.011, homo: 0.0019, light: 0.0028, temp: 0.0002, ucPaper: 0.0115, UPaper: 0.0231 },
  { id: 'FOL3', sys: 0.00104, stab: 0.0173, homo: 0.0025, light: 0.0031, temp: 0.0001, ucPaper: 0.0177, UPaper: 0.0356 },
];
// An illustrative certified absorbance of 0.5 (OURS: the paper's certified values were not readable), with the
// five influences entered as zero-valued corrections, which is how a GUM budget of this shape is written.
const SRC = 'A = 0.5 + sys + stab + homo + light + temp';
const named = splitName(SRC), ast = parse(named.formula), VARS = variables(ast), F = compile(ast, VARS);
const rowsFor = (f, dist = 'normal', over = {}) => VARS.map((n) => ({ name: n, value: 0, spread: over[n] ?? f[n], dist: dist === 'normal' || n === 'stab' ? 'normal' : dist }));

const results = FILTERS.map((f) => {
  const r = propagate(F, rowsFor(f), 0.9545);
  const mc = monteCarlo(F, rowsFor(f), 200000, 0.9545, 2026);
  const rect = propagate(F, rowsFor(f, 'rect'), 0.9545);
  const onlyStab = propagate(F, rowsFor(f, 'normal', { sys: 0, homo: 0, light: 0, temp: 0 }), 0.9545);
  const halfStab = propagate(F, rowsFor(f, 'normal', { stab: f.stab / 2 }), 0.9545);
  return {
    id: f.id, uc: +r.uc.toFixed(6), ucPaper: f.ucPaper, k: +r.k.toFixed(3), U: +r.U.toFixed(6), UPaper: f.UPaper,
    shares: Object.fromEntries(r.rows.map((x) => [x.name, +(x.share * 100).toFixed(2)])),
    contrib: Object.fromEntries(r.rows.map((x) => [x.name, x.contrib])),
    mcSd: +mc.sd.toFixed(6), mcLo: +mc.lo.toFixed(5), mcHi: +mc.hi.toFixed(5),
    rect: +rect.uc.toFixed(6), onlyStab: +onlyStab.uc.toFixed(6), halfStab: +halfStab.uc.toFixed(6),
  };
});

// Figure 1: how much each influence puts into the combined uncertainty, per filter (log scale).
const fig1 = chart({
  title: 'What each influence contributes', xLabel: 'Influence', yLabel: 'Contribution to uᶜ (absorbance)',
  series: results.map((r, i) => ({ name: r.id, kind: 'dots', x: COMP.map((_, j) => j + 1), y: COMP.map((c) => +Math.log10(r.contrib[c]).toFixed(4)), size: 5, colour: ['var(--c-blog)', 'var(--c-tools)', 'var(--ink)'][i] })),
  xDomain: [0.5, 5.5], yDomain: [-4.3, -1.5],
  xTicks: [1, 2, 3, 4, 5], xFmt: (v) => ['system', 'stability', 'homogen.', 'light', 'temp.'][v - 1] ?? '',
  yTicks: [-4, -3.5, -3, -2.5, -2], yFmt: (v) => Math.pow(10, v).toPrecision(2),
  desc: 'The contribution of each of the five influences to the combined standard uncertainty for the three filters, on a logarithmic scale. The one-year stability term is ten to thirty times every other term.', height: 290,
});

// Figure 2: the combined uncertainty against the size of the stability term, with the other four fixed.
const stabs = Array.from({ length: 61 }, (_, i) => i * 0.0004);
const fig2 = chart({
  title: 'The budget is one term', xLabel: 'One-year stability term (absorbance)', yLabel: 'Combined uncertainty uᶜ',
  series: [
    ...FILTERS.map((f, i) => ({ name: f.id, kind: 'line', x: stabs, y: stabs.map((s) => +propagate(F, rowsFor(f, 'normal', { stab: s }), 0.9545).uc.toFixed(6)), colour: ['var(--c-blog)', 'var(--c-tools)', 'var(--ink)'][i] })),
    { name: 'If stability were the only term', kind: 'line', x: stabs, y: stabs, dash: '5 4', colour: 'var(--muted)' },
  ],
  xDomain: [0, 0.024], yDomain: [0, 0.024],
  vlines: FILTERS.map((f, i) => ({ x: f.stab, text: f.id, left: i === 0, dy: i * 14 })),
  desc: 'The combined standard uncertainty against the size of the one-year stability term. Above about 0.004 absorbance every curve sits on the line where stability is the whole budget.', height: 300,
});

console.log(JSON.stringify(results, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'shares', figure(fig1, 'Figure 1. Each influence’s contribution to the combined standard uncertainty, worked out by the Uncertainty propagation calculator’s GUM routine from the paper’s own budget. Logarithmic scale: the stability term dwarfs the rest.'));
  md = inject(md, 'stability', figure(fig2, 'Figure 2. The same budget with the stability term swept from zero to 0.024 absorbance and the other four held at the paper’s values. The dashed line is "stability is the whole uncertainty"; each filter sits on it.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
