// Figures for src/blog/discoveries/miombo-woodland-mozambique-stand-basal-area-quadratic-mean-diameter-logged.md, made
// with the maths of the Forest inventory summary (src/lib/sci/inventory.ts) and Tree basal area (src/lib/sci/treeheight.ts).
// Run: node scripts/blog-figures/miombo-woodland-mozambique-stand-basal-area-quadratic-mean-diameter-logged.mjs
import fs from 'node:fs';
import { inventory } from '../../src/lib/sci/inventory.ts';
import { basalArea, diameterFromBA } from '../../src/lib/sci/treeheight.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/miombo-woodland-mozambique-stand-basal-area-quadratic-mean-diameter-logged.md', import.meta.url);

// Inputs from the paper's text: Manjate et al. (2025), Forests 16(4): 569, doi:10.3390/f16040569 (CC BY).
// 34 plots of 1 ha, DBH >= 10 cm; 8660 live trees; 255 ± 21 stems/ha; 15.43 ± 0.95 m²/ha;
// Brachystegia spiciformis 42 % of stems and 58 % of basal area; Shannon 2.3 with 57 species, Pielou 0.6.
const PLOTS = 34, TREES = 8660, N = 255, BA = 15.43, SH_N = 0.42, SH_BA = 0.58, H = 2.3, S = 57;
const qmd = diameterFromBA(BA / N, 'metric');
const qmdBs = diameterFromBA((BA * SH_BA) / (N * SH_N), 'metric'), qmdOther = diameterFromBA((BA * (1 - SH_BA)) / (N * (1 - SH_N)), 'metric');
const check = { treesPerHa: TREES / PLOTS, qmd, baPerTree: BA / N, qmdBs, qmdOther, pielou: H / Math.log(S), oneTree: basalArea(+qmd.toFixed(1), 'metric') };

// A SIMULATED tally (our assumption): DBH = 10 cm + an exponential tail (the reverse-J shape the paper describes), with the
// tail mean chosen so each group's quadratic mean diameter matches the one implied above. Plot totals vary with a
// standard deviation of 21 × √34 stems/ha, reading "± 21" as a standard error (our assumption).
const tailMean = (q) => (-20 + Math.sqrt(400 - 8 * (100 - q * q))) / 4; // E[D²] = 100 + 20m + 2m² for D = 10 + Exp(m)
let seed = 569; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const sdPlot = 21 * Math.sqrt(PLOTS);
const trees = [];
for (let p = 1; p <= PLOTS; p++) {
  const n = Math.max(40, Math.round(N + sdPlot * gauss()));
  for (let i = 0; i < n; i++) {
    const bs = rnd() < SH_N, m = tailMean(bs ? qmdBs : qmdOther);
    const d = Math.min(130, 10 - m * Math.log(1 - rnd() + 1e-12));
    trees.push({ plot: 'P' + p, species: bs ? 'Brachystegia spiciformis' : 'Other species', dbh: +d.toFixed(1) });
  }
}
const inv = inventory(trees, 10000, 'metric', 10);
const bs = inv.species.find((s) => s.species.startsWith('Brachy'));

// Plots needed for ±10 % of the mean at 95 % from the simulated spread (n = (t·CV/0.1)², iterated with t from 1.96).
const cv = inv.stems.sd / inv.stems.mean, cvBA = inv.ba.sd / inv.ba.mean;
const plotsFor = (c) => Math.ceil((1.96 * c / 0.1) ** 2);

// Figure 1: diameter classes from the tool's maths (stems per hectare per 10 cm class), by group.
const mids = inv.classes.map((c) => c.mid);
const idx = (name) => inv.species.findIndex((s) => s.species === name);
const fig1 = chart({
  title: 'Simulated miombo stand: stems per hectare by diameter class', xLabel: 'DBH class midpoint (cm)', yLabel: 'Stems per hectare',
  series: [
    { name: 'All trees', kind: 'line', x: mids, y: inv.classes.map((c) => +c.total.toFixed(1)) },
    { name: 'B. spiciformis', kind: 'line', x: mids, y: inv.classes.map((c) => +c.perSpecies[idx('Brachystegia spiciformis')].toFixed(1)) },
    { name: 'Other species', kind: 'line', x: mids, y: inv.classes.map((c) => +c.perSpecies[idx('Other species')].toFixed(1)), colour: 'var(--ink)', dash: '5 4' },
  ],
  xDomain: [10, 110], yDomain: [0, 140],
  desc: `Reverse-J diameter distribution of a simulated 34-plot tally built to match ${N} stems and ${BA} m² per hectare; ${inv.classes[0].total.toFixed(0)} stems per hectare fall in the 10 to 20 cm class.`, height: 260,
});

// Figure 2: the same basal area spread over different stem numbers (lines of constant quadratic mean diameter).
const NN = Array.from({ length: 51 }, (_, i) => 100 + i * 8);
const baLine = (q) => NN.map((n) => +(n * basalArea(q, 'metric')).toFixed(2));
const fig2 = chart({
  title: 'Stems, basal area and quadratic mean diameter', xLabel: 'Stems per hectare (DBH ≥ 10 cm)', yLabel: 'Basal area (m²/ha)',
  series: [
    { name: 'QMD 22 cm', kind: 'line', x: NN, y: baLine(22), colour: 'var(--muted)', dash: '4 4' },
    { name: `QMD ${qmd.toFixed(1)} cm`, kind: 'line', x: NN, y: baLine(+qmd.toFixed(1)) },
    { name: 'QMD 34 cm', kind: 'line', x: NN, y: baLine(34), colour: 'var(--ink)', dash: '4 4' },
    { name: '', noLegend: true, kind: 'dots', x: [N], y: [BA], size: 4.5, colour: 'var(--c-tools)', label: { text: 'this stand', dx: 8, dy: 14 } },
  ],
  xDomain: [100, 500], yDomain: [0, 40],
  desc: `Basal area against stem density for three quadratic mean diameters. The paper's stand, ${N} stems and ${BA} m² per hectare, lies on the ${qmd.toFixed(1)} cm line.`, height: 260,
});

// A small 2-plot tally for "Check it yourself": quantiles of the same two groups, 10 trees per 400 m² plot.
const q = (m, u) => +(10 - m * Math.log(1 - u)).toFixed(1);
const mini = [];
['A', 'B'].forEach((p, k) => { for (let i = 0; i < 10; i++) { const isBs = i % 5 < 2; const u = ((isBs ? [0, 1, 5, 6].indexOf(i) : [2, 3, 4, 7, 8, 9].indexOf(i)) * 2 + k + 0.5) / (isBs ? 8 : 12); mini.push({ plot: p, species: isBs ? 'Brachystegia' : 'Other', dbh: q(tailMean(isBs ? qmdBs : qmdOther), u) }); } });
const mi = inventory(mini, 400, 'metric', 10);

const f = (v, d = 2) => +v.toFixed(d);
console.log(JSON.stringify({ check: Object.fromEntries(Object.entries(check).map(([k, v]) => [k, f(v, 4)])), tail: [f(tailMean(qmdBs)), f(tailMean(qmdOther))],
  sim: { trees: inv.trees, stems: [f(inv.stems.mean), f(inv.stems.se), f(inv.stems.sd)], ba: [f(inv.ba.mean), f(inv.ba.se), f(inv.ba.sd)], qmd: f(inv.qmd), bsShareBA: f(bs.shareBA, 3), bsShareN: f(bs.stems.mean / inv.stems.mean, 3), bsQmd: f(bs.qmd), classes: inv.classes.map((c) => `${c.lo}:${c.total.toFixed(1)}`).join(' '), cv: f(cv, 3), cvBA: f(cvBA, 3), plotsN: plotsFor(cv), plotsBA: plotsFor(cvBA) },
  mini: { rows: mini.map((t) => `${t.plot}, ${t.species}, ${t.dbh}`).join(' | '), stems: f(mi.stems.mean), ba: f(mi.ba.mean, 3), qmd: f(mi.qmd), bsShare: f(mi.species.find((s) => s.species === 'Brachystegia').shareBA, 3) } }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'classes', figure(fig1, 'Figure 1. Diameter classes from the Forest inventory summary\'s maths, run on a simulated 34-plot tally built to match the paper\'s stem density, basal area and B. spiciformis shares. Not the paper\'s trees.'));
  md = inject(md, 'qmd', figure(fig2, 'Figure 2. Lines of equal quadratic mean diameter, from the basal area of one stem (Tree basal area maths). The paper\'s stand sits on the 27.8 cm line.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
